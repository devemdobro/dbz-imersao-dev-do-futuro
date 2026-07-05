function initHero() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const hero = document.getElementById("hero");
    if (!hero) return;

    const bgVideo = hero.querySelector(".hero__bg-video");
    const gokuWrap = hero.querySelector(".hero__figure-wrap--goku");
    const freezaWrap = hero.querySelector(".hero__figure-wrap--freeza");
    const poster = hero.querySelector(".hero__poster");
    const scrollHint = hero.querySelector(".hero__scroll");
    const posterLines = hero.querySelectorAll(".hero__poster-line");

    if (!bgVideo || !poster || !scrollHint || !posterLines.length) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", function () {
        gsap.from(posterLines, {
            yPercent: 60,
            opacity: 0,
            filter: "blur(10px)",
            stagger: 0.14,
            duration: 1.1,
            ease: "power3.out",
            delay: 0.15
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "+=90%",
                scrub: true,
                invalidateOnRefresh: true
            }
        });

        if (gokuWrap) {
            tl.fromTo(
                gokuWrap,
                { xPercent: 0, scale: 1 },
                {
                    xPercent: -120,
                    scale: 0.55,
                    transformOrigin: "left bottom",
                    ease: "power2.in",
                    duration: 1
                },
                0
            );
        }

        if (freezaWrap) {
            tl.fromTo(
                freezaWrap,
                { xPercent: 0, scale: 1 },
                {
                    xPercent: 120,
                    scale: 0.55,
                    transformOrigin: "right bottom",
                    ease: "power2.in",
                    duration: 1
                },
                0
            );
        }

        tl.fromTo(
            bgVideo,
            { scale: 1 },
            { scale: 1.18, ease: "none", duration: 1 },
            0
        );

        tl.fromTo(
            poster,
            { yPercent: 0, scale: 1, opacity: 1 },
            { yPercent: -10, scale: 1.18, opacity: 0, ease: "none", duration: 0.7 },
            0.1
        );

        tl.to(scrollHint, { opacity: 0, duration: 0.12, ease: "none" }, 0);
    });

    mm.add("(max-width: 767.98px) and (prefers-reduced-motion: no-preference)", function () {
        gsap.from(posterLines, {
            yPercent: 40,
            opacity: 0,
            stagger: 0.12,
            duration: 1.1,
            ease: "power3.out",
            delay: 0.15
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "+=80%",
                scrub: true,
                invalidateOnRefresh: true
            }
        });

        tl.fromTo(
            bgVideo,
            { scale: 1 },
            { scale: 1.12, ease: "none", duration: 1 },
            0
        );

        tl.fromTo(
            poster,
            { yPercent: 0, scale: 1, opacity: 1 },
            { yPercent: -8, scale: 1.12, opacity: 0, ease: "none", duration: 0.7 },
            0.1
        );

        tl.to(scrollHint, { opacity: 0, duration: 0.12, ease: "none" }, 0);
    });
}
