(function () {
    function initJornadaVideoPingPong(section) {
        const video = section.querySelector(".jornada__video");
        if (!video) {
            return;
        }

        video.loop = false;
        video.muted = true;

        let rafId = null;
        let reversing = false;
        let lastTime = 0;

        function cancelRaf() {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        }

        function playForward() {
            reversing = false;
            cancelRaf();
            video.play().catch(function () {});
        }

        function reverseStep(timestamp) {
            if (!reversing) {
                return;
            }

            if (!lastTime) {
                lastTime = timestamp;
            }

            const delta = (timestamp - lastTime) / 1000;
            lastTime = timestamp;
            video.currentTime = Math.max(0, video.currentTime - delta);

            if (video.currentTime <= 0) {
                reversing = false;
                cancelRaf();
                playForward();
                return;
            }

            rafId = requestAnimationFrame(reverseStep);
        }

        function startReverse() {
            reversing = true;
            lastTime = 0;
            video.pause();
            rafId = requestAnimationFrame(reverseStep);
        }

        video.addEventListener("ended", startReverse);

        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        if (!reversing && video.paused) {
                            playForward();
                        }
                    } else {
                        reversing = false;
                        cancelRaf();
                        video.pause();
                    }
                });
            },
            { threshold: 0.25 }
        );

        observer.observe(video);
    }

    function initJornada() {
        const section = document.getElementById("saga");
        if (!section) {
            return;
        }

        initJornadaVideoPingPong(section);

        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const viewport = section.querySelector(".jornada__viewport");
        const track = section.querySelector(".jornada__track");
        const fill = section.querySelector(".jornada__progress-fill");
        const counter = section.querySelector("[data-counter]");
        const intro = section.querySelector(".jornada__intro");
        const chapters = Array.from(section.querySelectorAll(".jornada__chapter"));
        const video = section.querySelector(".jornada__video");

        if (!viewport || !track) {
            return;
        }

        const mm = gsap.matchMedia();

        mm.add(
            "(min-width: 768px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)",
            function () {
                section.classList.add("is-horizontal");

                function distance() {
                    return Math.max(0, track.scrollWidth - viewport.clientWidth);
                }

                const tween = gsap.to(track, {
                    x: function () {
                        return -distance();
                    },
                    ease: "none",
                });

                let chapterBounds = [];
                let lastChapter = null;

                function measureChapters() {
                    chapterBounds = chapters.map(function (chapter) {
                        return {
                            chapter: Number(chapter.dataset.chapter),
                            left: chapter.offsetLeft,
                            right: chapter.offsetLeft + chapter.offsetWidth,
                        };
                    });
                }

                function resolveChapter(progress) {
                    const center = progress * distance() + viewport.clientWidth / 2;
                    let active = chapterBounds[0]?.chapter ?? 1;

                    chapterBounds.forEach(function (bound) {
                        if (center >= bound.left && center < bound.right) {
                            active = bound.chapter;
                        } else if (center >= bound.right) {
                            active = bound.chapter;
                        }
                    });

                    return active;
                }

                function updateHUD(progress) {
                    if (fill) {
                        fill.style.transform = "scaleX(" + progress + ")";
                    }

                    const active = resolveChapter(progress);

                    if (!counter || active === lastChapter) {
                        return;
                    }

                    lastChapter = active;
                    counter.textContent = ("0" + active).slice(-2);
                    counter.classList.remove("is-pulse");
                    void counter.offsetWidth;
                    counter.classList.add("is-pulse");
                }

                function onRefreshInit() {
                    measureChapters();
                }

                ScrollTrigger.addEventListener("refreshInit", onRefreshInit);
                measureChapters();

                ScrollTrigger.create({
                    animation: tween,
                    trigger: viewport,
                    start: "top top",
                    end: function () {
                        return "+=" + distance();
                    },
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: function (self) {
                        updateHUD(self.progress);
                    },
                });

                chapters.forEach(function (chapter) {
                    const num = chapter.querySelector(".jornada__num");
                    if (num) {
                        gsap.fromTo(
                            num,
                            { xPercent: 16 },
                            {
                                xPercent: -16,
                                ease: "none",
                                scrollTrigger: {
                                    trigger: chapter,
                                    containerAnimation: tween,
                                    start: "left right",
                                    end: "right left",
                                    scrub: true,
                                },
                            }
                        );
                    }

                    ScrollTrigger.create({
                        trigger: chapter,
                        containerAnimation: tween,
                        start: "left 78%",
                        onEnter: function () {
                            chapter.classList.add("is-inview");
                        },
                        onEnterBack: function () {
                            chapter.classList.add("is-inview");
                        },
                    });
                });

                if (intro) {
                    gsap.from(intro.children, {
                        y: 30,
                        opacity: 0,
                        filter: "blur(8px)",
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 70%",
                            once: true,
                        },
                    });
                }

                function refreshLayout() {
                    ScrollTrigger.refresh();
                }

                window.addEventListener("load", refreshLayout, { once: true });

                if (video) {
                    video.addEventListener("loadedmetadata", refreshLayout);
                }

                updateHUD(0);

                return function () {
                    ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
                    section.classList.remove("is-horizontal");
                    chapters.forEach(function (chapter) {
                        chapter.classList.remove("is-inview");
                    });

                    if (fill) {
                        fill.style.transform = "";
                    }

                    if (counter) {
                        counter.classList.remove("is-pulse");
                        counter.textContent = "01";
                    }

                    lastChapter = null;
                    gsap.set(track, { clearProps: "transform" });
                };
            }
        );
    }

    window.initJornada = initJornada;
})();
