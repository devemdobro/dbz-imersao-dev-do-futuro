function initTrailersCarousel() {
    const section = document.getElementById("trailers");
    if (!section) return;

    const track = section.querySelector(".trailers__track");
    const slides = Array.from(section.querySelectorAll(".trailers__slide"));
    const dots = Array.from(section.querySelectorAll(".trailers__dot"));
    const iframes = Array.from(section.querySelectorAll(".trailers__slide iframe"));
    const prevBtn = section.querySelector(".trailers__arrow--prev");
    const nextBtn = section.querySelector(".trailers__arrow--next");
    const liveRegion = document.getElementById("trailers-carousel-live");
    const dotsContainer = section.querySelector(".trailers__dots");
    const carousel = section.querySelector(".trailers__carousel");

    if (!track || slides.length !== 4 || dots.length !== 4 || !prevBtn || !nextBtn) return;

    const total = 4;
    let activeIndex = 0;
    let sectionActivated = false;

    function applyLazyLoad(index) {
        iframes.forEach(function (iframe, j) {
            if (j === index) {
                const embedSrc = iframe.dataset.src;
                if (embedSrc && iframe.getAttribute("src") !== embedSrc) {
                    iframe.setAttribute("src", embedSrc);
                }
            } else {
                iframe.setAttribute("src", "about:blank");
            }
        });
    }

    function activateSection() {
        if (sectionActivated) return;
        sectionActivated = true;
        applyLazyLoad(activeIndex);
    }

    function goTo(index) {
        activeIndex = ((index % total) + total) % total;

        track.style.transform = "translateX(calc(" + activeIndex + " * -100%))";

        slides.forEach(function (slide, j) {
            const isActive = j === activeIndex;
            slide.setAttribute("aria-hidden", String(!isActive));
        });

        dots.forEach(function (dot, j) {
            const isSelected = j === activeIndex;
            dot.setAttribute("aria-selected", String(isSelected));
            dot.tabIndex = isSelected ? 0 : -1;
        });

        if (sectionActivated) {
            applyLazyLoad(activeIndex);
        }

        if (liveRegion) {
            liveRegion.textContent = "Trailer " + (activeIndex + 1) + " de 4";
        }
    }

    function next() {
        goTo(activeIndex + 1);
    }

    function prev() {
        goTo(activeIndex - 1);
    }

    function handleCarouselKeydown(event) {
        const target = event.target;
        const inScope =
            (dotsContainer && dotsContainer.contains(target)) ||
            (carousel && carousel.contains(target));

        if (!inScope) return;

        switch (event.key) {
            case "ArrowRight":
            case "ArrowDown":
                event.preventDefault();
                next();
                dots[activeIndex].focus();
                break;
            case "ArrowLeft":
            case "ArrowUp":
                event.preventDefault();
                prev();
                dots[activeIndex].focus();
                break;
            case "Home":
                event.preventDefault();
                goTo(0);
                dots[0].focus();
                break;
            case "End":
                event.preventDefault();
                goTo(total - 1);
                dots[total - 1].focus();
                break;
            default:
                break;
        }
    }

    prevBtn.addEventListener("click", function () {
        activateSection();
        prev();
    });

    nextBtn.addEventListener("click", function () {
        activateSection();
        next();
    });

    dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
            activateSection();
            goTo(i);
        });
    });

    section.addEventListener("keydown", handleCarouselKeydown);

    section.addEventListener("focusin", function () {
        activateSection();
    });

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        activateSection();
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.15 }
        );
        observer.observe(section);
    }

    goTo(0);
}

function initFloatingNav() {
    const nav = document.querySelector(".floating-nav");
    const hero = document.getElementById("hero");
    if (!nav || !hero) return;

    const links = nav.querySelectorAll(".floating-nav__link");
    const sectionIds = ["hero", "personagens", "trailers", "saga"];
    const sections = sectionIds
        .map(function (id) { return document.getElementById(id); })
        .filter(Boolean);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function getThreshold() {
        return hero.offsetHeight * 0.6;
    }

    function updateVisibility() {
        nav.classList.toggle("floating-nav--visible", window.scrollY >= getThreshold());
    }

    function setActiveLink(sectionId) {
        links.forEach(function (link) {
            const isActive = link.dataset.section === sectionId;
            link.classList.toggle("floating-nav__link--active", isActive);
            if (isActive) {
                link.setAttribute("aria-current", "true");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    function initScrollSpy() {
        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        setActiveLink(entry.target.id);
                    }
                });
            },
            {
                root: null,
                rootMargin: "-40% 0px -40% 0px",
                threshold: 0
            }
        );

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    function initAnchorScroll() {
        links.forEach(function (link) {
            link.addEventListener("click", function (event) {
                const targetId = link.getAttribute("href").slice(1);
                const target = document.getElementById(targetId);
                if (!target) return;

                event.preventDefault();

                if (prefersReducedMotion) {
                    target.scrollIntoView();
                } else {
                    target.scrollIntoView({ behavior: "smooth" });
                }
            });
        });
    }

    let ticking = false;
    window.addEventListener("scroll", function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            updateVisibility();
            ticking = false;
        });
    }, { passive: true });

    window.addEventListener("resize", updateVisibility, { passive: true });

    updateVisibility();
    initScrollSpy();
    initAnchorScroll();
}

document.addEventListener("DOMContentLoaded", function () {
    initHero();
    initJornada();
    initFloatingNav();
    initPersonagensBlueprint();
    initTrailersCarousel();

    if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.sort();
    }
});
