const quoteText = `"We always feel that space is out of our reach. Not anymore."`;
const quote = document.getElementById("quote");
const nav = document.querySelector(".nav");
const progress = document.querySelector(".scroll-progress");
const revealItems = document.querySelectorAll(".reveal");
const countdownShell = document.querySelector("[data-reveal-date]");
const countdownStatus = document.getElementById("countdownStatus");
const registrationForm = document.getElementById("registrationForm");
const registrationMessage = document.getElementById("registrationMessage");
const registrationSubmit = document.querySelector(".registration-submit");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function typeQuote() {
    if (!quote) {
        return;
    }

    if (prefersReducedMotion) {
        quote.textContent = quoteText;
        quote.classList.add("is-complete");
        return;
    }

    let index = 0;

    function writeNextCharacter() {
        quote.textContent += quoteText.charAt(index);
        index += 1;

        if (index < quoteText.length) {
            window.setTimeout(writeNextCharacter, 34);
        } else {
            quote.classList.add("is-complete");
        }
    }

    writeNextCharacter();
}

function updateChrome() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progressValue = scrollable > 0 ? scrollTop / scrollable : 0;

    if (nav) {
        nav.classList.toggle("is-scrolled", scrollTop > 24);
    }

    if (progress) {
        progress.style.transform = `scaleX(${Math.min(Math.max(progressValue, 0), 1)})`;
    }
}

function setupReveals() {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("in-view"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.18,
            rootMargin: "0px 0px -8% 0px"
        }
    );

    revealItems.forEach((item) => observer.observe(item));
}

function setupRegistrationForm() {
    if (!registrationForm || !registrationMessage || !registrationSubmit) {
        return;
    }

    registrationForm.addEventListener("invalid", () => {
        registrationMessage.textContent = "Please complete the required fields.";
        registrationMessage.classList.remove("is-success");
        registrationMessage.classList.add("is-error");
    }, true);

    registrationForm.addEventListener("input", () => {
        registrationMessage.textContent = "";
        registrationMessage.classList.remove("is-success", "is-error");
    });

    registrationForm.addEventListener("submit", () => {
        registrationMessage.textContent = "Sending your registration...";
        registrationMessage.classList.remove("is-error");
        registrationMessage.classList.add("is-success");
        registrationSubmit.disabled = true;

        window.setTimeout(() => {
            registrationForm.reset();
            registrationSubmit.disabled = false;
            registrationMessage.textContent = "Registration sent. You will receive Astra Island Summit updates.";
        }, 1200);
    });
}

function setupRevealCountdown() {
    if (!countdownShell) {
        return;
    }

    const targetDate = new Date(countdownShell.dataset.revealDate);
    const countdownValues = {
        days: document.querySelector('[data-countdown="days"]'),
        hours: document.querySelector('[data-countdown="hours"]'),
        minutes: document.querySelector('[data-countdown="minutes"]'),
        seconds: document.querySelector('[data-countdown="seconds"]')
    };

    if (Number.isNaN(targetDate.getTime())) {
        if (countdownStatus) {
            countdownStatus.textContent = "Reveal date: 1 July 2026.";
        }
        return;
    }

    function setValue(key, value) {
        if (countdownValues[key]) {
            countdownValues[key].textContent = String(value).padStart(2, "0");
        }
    }

    function updateCountdown() {
        const distance = targetDate.getTime() - Date.now();

        if (distance <= 0) {
            setValue("days", 0);
            setValue("hours", 0);
            setValue("minutes", 0);
            setValue("seconds", 0);

            if (countdownStatus) {
                countdownStatus.textContent = "The reveal is live.";
                countdownStatus.classList.add("is-live");
            }
            return;
        }

        const secondsTotal = Math.floor(distance / 1000);
        const days = Math.floor(secondsTotal / 86400);
        const hours = Math.floor((secondsTotal % 86400) / 3600);
        const minutes = Math.floor((secondsTotal % 3600) / 60);
        const seconds = secondsTotal % 60;

        setValue("days", days);
        setValue("hours", hours);
        setValue("minutes", minutes);
        setValue("seconds", seconds);
    }

    updateCountdown();
    window.setInterval(updateCountdown, 1000);
}

window.addEventListener("load", () => {
    setupReveals();
    setupRegistrationForm();
    setupRevealCountdown();
    typeQuote();
    updateChrome();
});

window.addEventListener("scroll", updateChrome, { passive: true });
window.addEventListener("resize", updateChrome);
