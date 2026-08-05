/* ==========================================================================
   Lorenzo Arteaga — Digital Business Card
   Loader, theme preference, clipboard, vCard download, QR code, reveals
   ========================================================================== */

(function () {
  "use strict";

  var CONTACT_PATH = "/contact.vcf";
  var THEME_KEY = "la-card-theme";

  /* ---------------------------------------------------------------- helpers */

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call(
      (scope || document).querySelectorAll(selector)
    );
  }

  /* ------------------------------------------------------------------ toast */

  var toastStack = $("#toastStack");

  function toast(message, icon) {
    if (!toastStack) return;

    var el = document.createElement("div");
    el.className = "toast";

    var glyph = document.createElement("i");
    glyph.className = "fa-solid " + (icon || "fa-circle-check");
    glyph.setAttribute("aria-hidden", "true");

    el.appendChild(glyph);
    el.appendChild(document.createTextNode(message));
    toastStack.appendChild(el);

    window.setTimeout(function () {
      el.classList.add("is-leaving");
      window.setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 300);
    }, 2400);
  }

  /* ------------------------------------------------------------------ theme */

  var themeToggle = $("#themeToggle");

  function applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);

    if (!themeToggle) return;

    var isDark = theme === "dark";
    var icon = $("i", themeToggle);

    if (icon) {
      icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }

    themeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light theme" : "Switch to dark theme"
    );

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", isDark ? "#101315" : "#ff7a3d");
  }

  function storedTheme() {
    try {
      return window.localStorage.getItem(THEME_KEY);
    } catch (err) {
      return null;
    }
  }

  function rememberTheme(theme) {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch (err) {
      /* private browsing — preference simply isn't persisted */
    }
  }

  var saved = storedTheme();
  var prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  applyTheme(saved || (prefersDark ? "dark" : "light"));

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next =
        document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      rememberTheme(next);
    });
  }

  /* Follow the OS while the visitor hasn't made an explicit choice */
  if (window.matchMedia) {
    var query = window.matchMedia("(prefers-color-scheme: dark)");
    var onSchemeChange = function (event) {
      if (storedTheme()) return;
      applyTheme(event.matches ? "dark" : "light");
    };

    if (query.addEventListener) {
      query.addEventListener("change", onSchemeChange);
    } else if (query.addListener) {
      query.addListener(onSchemeChange);
    }
  }

  /* -------------------------------------------------------------- clipboard */

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    /* Fallback for non-secure contexts, e.g. opening the file directly */
    return new Promise(function (resolve, reject) {
      var field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "readonly");
      field.style.position = "fixed";
      field.style.top = "-1000px";
      document.body.appendChild(field);
      field.select();

      try {
        var ok = document.execCommand("copy");
        document.body.removeChild(field);
        ok ? resolve() : reject(new Error("copy rejected"));
      } catch (err) {
        document.body.removeChild(field);
        reject(err);
      }
    });
  }

  $$("[data-copy-target]").forEach(function (button) {
    button.addEventListener("click", function () {
      var row = button.closest("dd") || button.parentNode;
      var source = $("[data-copy-value]", row);
      if (!source) return;

      var value =
        source.getAttribute("data-copy-value") || source.textContent.trim();

      copyText(value).then(
        function () {
          toast("Copied to clipboard", "fa-circle-check");
        },
        function () {
          toast("Press and hold to copy", "fa-circle-info");
        }
      );
    });
  });

  /* ----------------------------------------------------------- vCard saving */

  function downloadVcard() {
    var link = document.createElement("a");
    link.href = CONTACT_PATH;
    link.setAttribute("download", "lorenzo-arteaga.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("Contact card downloading", "fa-id-card");
  }

  ["#downloadVcard", "#downloadVcardFooter"].forEach(function (selector) {
    var button = $(selector);
    if (button) button.addEventListener("click", downloadVcard);
  });

  /* -------------------------------------------------------------- QR code */

  function buildQr() {
    var holder = $("#qrCode");
    if (!holder) return;

    /* Absolute URL so a scanned code resolves anywhere */
    var target;
    try {
      target = new URL(CONTACT_PATH, window.location.href).href;
    } catch (err) {
      target = "https://lorenzoarteaga.netlify.app" + CONTACT_PATH;
    }

    if (window.location.protocol === "file:") {
      target = "https://lorenzoarteaga.netlify.app" + CONTACT_PATH;
    }

    if (typeof window.QRCode !== "function") {
      holder.innerHTML =
        '<p class="qr-canvas__fallback">Use the Save contact button to download the vCard.</p>';
      return;
    }

    holder.innerHTML = "";

    new window.QRCode(holder, {
      text: target,
      width: 144,
      height: 144,
      colorDark: "#16191c",
      colorLight: "#ffffff",
      correctLevel: window.QRCode.CorrectLevel
        ? window.QRCode.CorrectLevel.M
        : undefined
    });

    /* The holder already carries role="img" and a label, so hide the
       generated canvas/image from assistive tech to avoid a double read. */
    $$("canvas, img", holder).forEach(function (node) {
      node.setAttribute("aria-hidden", "true");
      if (node.tagName === "IMG") node.setAttribute("alt", "");
    });
  }

  /* -------------------------------------------------------- scroll reveals */

  function initReveals() {
    var targets = $$(".reveal");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------------- boot */

  function boot() {
    buildQr();
    initReveals();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.addEventListener("load", function () {
    var loader = $("#loader");
    if (loader) loader.classList.add("is-done");
  });

  /* Safety net: never leave the loader covering the page */
  window.setTimeout(function () {
    var loader = $("#loader");
    if (loader) loader.classList.add("is-done");
  }, 2500);
})();
