// =====================================================
// FLAVIUS e20
// gallery.js
// Beta 0.6
// =====================================================

async function loadGalleries() {
    const featured = document.getElementById("featured-event");
    const galleryList = document.getElementById("gallery-list");

    if (!featured || !galleryList) return;

    try {
        const response = await fetch("galleries/galleries.json");
        if (!response.ok) throw new Error("Impossibile caricare galleries.json");

        const events = await response.json();
        const visibleEvents = events.filter(event => event.visibile !== false);

        const eventInfos = [];

        for (const event of visibleEvents) {
            const infoResponse = await fetch(`galleries/${event.id}/info.json`);
            if (!infoResponse.ok) continue;

            const info = await infoResponse.json();
            eventInfos.push(info);
        }

        if (!eventInfos.length) {
            featured.innerHTML = "<p>Nessun evento disponibile.</p>";
            return;
        }

        // galleries.json stabilisce l'ordine: il primo evento è quello principale.
        const mainEvent = eventInfos[0];
        const recentEvents = eventInfos.slice(1, 5);

        featured.innerHTML = createFeaturedEvent(mainEvent);
        galleryList.innerHTML = recentEvents.map(createRecentCard).join("");

        observeFadeElements();
    } catch (error) {
        console.error("Errore caricamento gallerie:", error);
        featured.innerHTML = "<p>Impossibile caricare le gallerie.</p>";
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function createFeaturedEvent(info) {
    return `
        <a href="gallery.html?id=${info.id}" class="featured-card fade-up">
            <div class="featured-image-wrap">
                <img src="galleries/${info.id}/${info.copertina}" alt="${escapeHtml(info.titolo)}">
                <span class="gallery-badge">Evento principale</span>
            </div>
            <div class="featured-info">
                <h3>${escapeHtml(info.titolo)}</h3>
                <p>${escapeHtml(info.descrizione || "")}</p>
                <span class="featured-meta">📅 ${formatDate(info.data)}${info.luogo ? ` · ${escapeHtml(info.luogo)}` : ""}</span>
                <span class="button small-button">Guarda le fotografie →</span>
            </div>
        </a>
    `;
}

function createRecentCard(info) {
    return `
        <a href="gallery.html?id=${info.id}" class="gallery-link fade-up">
            <article class="gallery-card">
                <div class="gallery-thumb">
                    <img src="galleries/${info.id}/${info.copertina}" alt="${escapeHtml(info.titolo)}">
                </div>
                <div class="gallery-info">
                    <h3>${escapeHtml(info.titolo)}</h3>
                    <p>${escapeHtml(info.descrizione || "")}</p>
                    <div class="gallery-meta">
                        <span>📅 ${formatDate(info.data)}</span>
                        <span>📷 ${Array.isArray(info.foto) ? info.foto.length : 0}</span>
                    </div>
                </div>
            </article>
        </a>
    `;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function observeFadeElements() {
    const elements = document.querySelectorAll(".fade-up");
    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
        elements.forEach(element => element.classList.add("show"));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    elements.forEach(element => observer.observe(element));
}

loadGalleries();
