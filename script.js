const pageLoader = document.querySelector("#pageLoader");
const themeToggle = document.querySelector("#themeToggle");
const toast = document.querySelector("#toast");
let toastTimer;

const showToast = (message) => {
  if (!toast) return;

  toast.querySelector("span").textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
};

const setTheme = (theme) => {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = theme;

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
    themeToggle.innerHTML = `<i class="fa-solid fa-${isDark ? "sun" : "moon"}" aria-hidden="true"></i>`;
  }
};

const savedTheme = localStorage.getItem("preferred-theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  localStorage.setItem("preferred-theme", nextTheme);
  showToast(`${nextTheme === "dark" ? "Dark" : "Light"} mode enabled`);
});

document.querySelectorAll(".copy-button").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    const label = button.dataset.label || "Information";

    try {
      await navigator.clipboard.writeText(value);
      showToast(`${label} copied`);
    } catch {
      const temporaryInput = document.createElement("textarea");
      temporaryInput.value = value;
      temporaryInput.setAttribute("readonly", "");
      temporaryInput.style.position = "fixed";
      temporaryInput.style.opacity = "0";
      document.body.appendChild(temporaryInput);
      temporaryInput.select();
      document.execCommand("copy");
      temporaryInput.remove();
      showToast(`${label} copied`);
    }
  });
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" }
  );

  revealElements.forEach((element, index) => {
    if (index < 2) element.style.transitionDelay = `${index * 110}ms`;
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const createQrCode = () => {
  const qrContainer = document.querySelector("#qrcode");
  if (!qrContainer) return;

  const pageUrl = `${window.location.origin}${window.location.pathname}`;

  if (typeof window.QRCode === "function") {
    new window.QRCode(qrContainer, {
      text: pageUrl,
      width: 174,
      height: 174,
      colorDark: "#182027",
      colorLight: "#ffffff",
      correctLevel: window.QRCode.CorrectLevel.H
    });
  } else {
    const fallbackLink = document.createElement("a");
    fallbackLink.href = pageUrl;
    fallbackLink.textContent = "Open digital card";
    fallbackLink.className = "button button-secondary";
    qrContainer.appendChild(fallbackLink);
  }
};

window.addEventListener("load", () => {
  createQrCode();
  window.setTimeout(() => pageLoader?.classList.add("is-hidden"), 250);
});

window.setTimeout(() => pageLoader?.classList.add("is-hidden"), 2200);

const currentYear = document.querySelector("#currentYear");
if (currentYear) currentYear.textContent = new Date().getFullYear();

function updateAvailability() {
    const badge = document.getElementById("availabilityBadge");
    const text = document.getElementById("availabilityText");

    if (!badge || !text) return;

    const now = new Date();

    // Portland time
    const hour = Number(
        now.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles",
            hour: "numeric",
            hour12: false
        })
    );

    const day = Number(
        now.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles",
            weekday: "numeric"
        })
    );

    // Monday-Friday, 9 AM - 5 PM
    const isWeekday = day >= 1 && day <= 5;
    const isBusinessHours = hour >= 9 && hour < 17;

    if (isWeekday && isBusinessHours) {
        badge.classList.remove("offline");
        text.textContent = "Available to Connect";
    } else {
        badge.classList.add("offline");
        text.textContent = "Currently Unavailable";
    }
}

updateAvailability();
setInterval(updateAvailability, 60000);
