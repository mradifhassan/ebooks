(function () {
    "use strict";

    var STYLE_ID = "stem-ebook-reader-style";
    var MODAL_ID = "stem-ebook-reader";
    var currentSrc = null;
    var currentTitle = "";

    if (!document.getElementById(STYLE_ID)) {
        var css = document.createElement("style");
        css.id = STYLE_ID;
        css.textContent =
            "#" + MODAL_ID + " { position: fixed; inset: 0; z-index: 9999; display: none; flex-direction: column; background: #111827; }" +
            "#" + MODAL_ID + ".open { display: flex; }" +
            "#" + MODAL_ID + " .reader-bar { display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: #1c2a49; color: #d4af37; font-family: Ubuntu, 'Noto Serif Bengali', sans-serif; font-size: 14px; }" +
            "#" + MODAL_ID + " .reader-title { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 0 4px; }" +
            "#" + MODAL_ID + " .reader-bar button { border: 1px solid #d4af37; background: transparent; color: #d4af37; border-radius: 999px; padding: 8px 16px; font: inherit; font-size: 13px; cursor: pointer; white-space: nowrap; }" +
            "#" + MODAL_ID + " .reader-bar button:hover, #" + MODAL_ID + " .reader-bar button:focus-visible { background: #d4af37; color: #1c2a49; }" +
            "#" + MODAL_ID + " .reader-close { padding: 8px 12px !important; line-height: 1; }" +
            "#" + MODAL_ID + " .reader-body { flex: 1 1 auto; position: relative; background: #111827; }" +
            "#" + MODAL_ID + " .reader-body iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; background: #111827; }" +
            "#" + MODAL_ID + " .reader-spinner { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #d4af37; font-family: Ubuntu, sans-serif; }" +
            "@media (max-width: 640px) { #" + MODAL_ID + " .reader-bar { flex-wrap: wrap; padding: 8px; } }";
        document.head.appendChild(css);
    }

    function ensureModal() {
        var existing = document.getElementById(MODAL_ID);
        if (existing) return existing;

        var modal = document.createElement("div");
        modal.id = MODAL_ID;
        modal.innerHTML =
            '<div class="reader-bar">' +
                '<button type="button" class="reader-close" aria-label="Close" title="Close (Esc)">&#10005;</button>' +
                '<span class="reader-title"></span>' +
                '<button type="button" class="reader-download">Download</button>' +
                '<button type="button" class="reader-newtab">Open in New Tab</button>' +
            '</div>' +
            '<div class="reader-body"><div class="reader-spinner">Loading\u2026</div></div>';
        document.body.appendChild(modal);

        var body = modal.querySelector(".reader-body");
        var titleEl = modal.querySelector(".reader-title");

        modal.querySelector(".reader-close").addEventListener("click", close);
        modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && modal.classList.contains("open")) close();
        });

        modal.querySelector(".reader-download").addEventListener("click", function () {
            if (currentSrc) downloadBook(currentSrc, currentTitle);
        });

        modal.querySelector(".reader-newtab").addEventListener("click", function () {
            if (currentSrc) window.open(currentSrc, "_blank", "noopener");
        });

        return modal;
    }

    function open(src, title) {
        currentSrc = src;
        currentTitle = title || "";
        var modal = ensureModal();
        modal.querySelector(".reader-title").textContent = currentTitle;
        var body = modal.querySelector(".reader-body");
        body.innerHTML = '<div class="reader-spinner">Loading\u2026</div>';
        var iframe = document.createElement("iframe");
        iframe.src = src;
        iframe.setAttribute("allowfullscreen", "");
        body.appendChild(iframe);
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function close() {
        var modal = document.getElementById(MODAL_ID);
        if (!modal) return;
        modal.classList.remove("open");
        modal.querySelector(".reader-body").innerHTML = "";
        document.body.style.overflow = "";
    }

    function downloadBook(src, title) {
        var a = document.createElement("a");
        a.href = src;
        a.download = title || "ebook";
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    document.addEventListener("click", function (e) {
        var item = e.target.closest(".book-item");
        if (!item) return;
        if (e.target.closest(".book-download")) return;
        if (e.target.closest(".reader-open") || e.target.closest(".book-title")) {
            open(item.getAttribute("data-src"), item.getAttribute("data-title"));
        }
    });

    document.addEventListener("keydown", function (e) {
        var target = e.target;
        if (e.key !== "Enter" && e.key !== " ") return;
        var title = target.closest(".book-title");
        if (!title) return;
        e.preventDefault();
        var item = title.closest(".book-item");
        open(item.getAttribute("data-src"), item.getAttribute("data-title"));
    });
})();