function initJornada() {
    const section = document.getElementById("saga");
    const pin = section?.querySelector(".jornada__pin");
    const track = section?.querySelector(".jornada__track");
    const counterCur = section?.querySelector(".jornada__counter .cur");
    const dots = pin ? Array.from(pin.querySelectorAll(".jornada__dot")) : [];
    const cardWraps = section
        ? Array.from(section.querySelectorAll(".jornada__card-wrap"))
        : [];

    if (!section || !pin || !track) {
        return;
    }

    function revealAllCards() {
        cardWraps.forEach(function (wrap) {
            wrap.setAttribute("data-reveal", "in");
        });
    }

    function resetDesktopCards() {
        cardWraps.forEach(function (wrap) {
            wrap.removeAttribute("data-reveal");
        });
    }

    function clearRuntimeStyles() {
        track.style.removeProperty("--x");
        pin.style.removeProperty("--progress");
        pin.classList.remove("jornada__pin--pinned");
    }

    function setPinLayer(active) {
        pin.classList.toggle("jornada__pin--pinned", active);
    }

    function readToken(name, fallback) {
        const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        const value = parseFloat(raw);
        return Number.isFinite(value) ? value : fallback;
    }

    function getScrubLerp() {
        return readToken("--jornada-scrub-lerp", 1);
    }

    function getMaxScroll() {
        return Math.max(0, track.scrollWidth - window.innerWidth);
    }

    function padChapter(n) {
        return String(n).padStart(2, "0");
    }

    function updateHUD(progress) {
        const clamped = gsap.utils.clamp(0, 1, progress);
        pin.style.setProperty("--progress", String(clamped));

        const chapter = Math.min(6, Math.max(1, Math.floor(clamped * 6) + 1));

        if (counterCur) {
            counterCur.textContent = padChapter(chapter);
        }

        dots.forEach(function (dot) {
            const dotChapter = Number(dot.dataset.chapter);
            if (dotChapter === chapter) {
                dot.setAttribute("data-active", "");
            } else {
                dot.removeAttribute("data-active");
            }
        });
    }

    function refreshJornadaLayout(scrollTween) {
        scrollTween?.scrollTrigger?.refresh();
    }

    function watchLayoutAssets(scrollTween) {
        const images = section.querySelectorAll("img");
        let pending = 0;

        images.forEach(function (img) {
            if (img.complete) {
                return;
            }
            pending += 1;
            img.addEventListener("load", onAssetDone, { once: true });
            img.addEventListener("error", onAssetDone, { once: true });
        });

        function onAssetDone() {
            pending -= 1;
            if (pending <= 0) {
                refreshJornadaLayout(scrollTween);
            }
        }

        if (document.fonts?.ready) {
            document.fonts.ready.then(function () {
                refreshJornadaLayout(scrollTween);
            });
        }

        window.addEventListener("load", function () {
            refreshJornadaLayout(scrollTween);
        }, { once: true });
    }

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        revealAllCards();
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(max-width: 768px), (prefers-reduced-motion: reduce)", function () {
        revealAllCards();
        clearRuntimeStyles();
        return function () {};
    });

    mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", function () {
        resetDesktopCards();
        clearRuntimeStyles();
        updateHUD(0);

        const revealTriggers = [];

        const scrollTween = gsap.to(track, {
            "--x": function () {
                return "-" + getMaxScroll() + "px";
            },
            ease: "none",
            scrollTrigger: {
                trigger: section,
                pin: pin,
                scrub: getScrubLerp(),
                start: "top top",
                end: function () {
                    return "+=" + getMaxScroll();
                },
                invalidateOnRefresh: true,
                refreshPriority: 10,
                id: "jornada-horizontal",
                onToggle: function (self) {
                    setPinLayer(self.isActive);
                },
                onUpdate: function (self) {
                    updateHUD(self.progress);
                },
            },
        });

        cardWraps.forEach(function (wrap) {
            revealTriggers.push(
                ScrollTrigger.create({
                    containerAnimation: scrollTween,
                    trigger: wrap,
                    start: "left 88%",
                    once: true,
                    onEnter: function () {
                        wrap.setAttribute("data-reveal", "in");
                    },
                })
            );
        });

        watchLayoutAssets(scrollTween);
        refreshJornadaLayout(scrollTween);
        setPinLayer(Boolean(scrollTween.scrollTrigger?.isActive));

        return function () {
            revealTriggers.forEach(function (trigger) {
                trigger.kill();
            });
            scrollTween.scrollTrigger?.kill();
            scrollTween.kill();
            clearRuntimeStyles();
        };
    });
}
