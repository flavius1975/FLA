// =====================================================
// FLAVIUS e20
// event.js
// Beta 0.7
// =====================================================

async function loadEvent() {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("id");

    if (!eventId) {
        document.getElementById("event-title").textContent = "Evento non trovato";
        return;
    }

    try {
        const response = await fetch(`galleries/${eventId}/info.json`);
        if (!response.ok) throw new Error("Evento non trovato");

        const info = await response.json();
        const files = await loadPhotoList(eventId, info);

        document.title = `${info.titolo} | FLAVIUS e20`;
        document.getElementById("event-title").textContent = info.titolo;
        document.getElementById("event-description").textContent = info.descrizione || "";
        document.getElementById("cover-image").src = `galleries/${eventId}/${info.copertina}`;

        const data = new Date(info.data);
        const dataFormattata = Number.isNaN(data.getTime())
            ? info.data
            : data.toLocaleDateString("it-IT", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });

        const luogo = info.luogo ? ` • ${info.luogo}` : "";
        document.getElementById("photo-count").textContent =
            `📷 ${files.length} fotografie • ${dataFormattata}${luogo}`;

        const photoGrid = document.getElementById("photo-grid");
        photoGrid.innerHTML = files.map((file, index) => `
            <div class="photo-card">
                <img
                    src="galleries/${eventId}/thumb/${encodeURIComponent(file)}"
                    alt="Fotografia ${index + 1}"
                    class="gallery-photo"
                    data-index="${index}"
                    loading="lazy"
                    decoding="async">
            </div>
        `).join("");

        initLightbox(files, eventId);
    } catch (error) {
        console.error("Errore caricamento evento:", error);
        document.getElementById("event-title").textContent = "Evento non disponibile";
    }
}

async function loadPhotoList(eventId, info) {
    try {
        const response = await fetch(`galleries/${eventId}/photos.json?v=0.7`);
        if (!response.ok) throw new Error("Manifest non disponibile");

        const manifest = await response.json();
        if (Array.isArray(manifest.foto)) return manifest.foto;
    } catch (error) {
        // Compatibilità con gli eventi esistenti: usa info.foto come fallback.
    }

    return Array.isArray(info.foto) ? info.foto : [];
}

function initLightbox(files, eventId) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const counter = document.getElementById("lightbox-counter");
    const closeButton = document.getElementById("close-lightbox");
    const previousButton = document.getElementById("lightbox-prev");
    const nextButton = document.getElementById("lightbox-next");

    if (!lightbox || !lightboxImage || !counter) return;

    let currentPhoto = 0;
    let touchStartX = 0;

    function showPhoto(index) {
        if (!files.length) return;

        currentPhoto = (index + files.length) % files.length;
        lightboxImage.src = `galleries/${eventId}/web/${encodeURIComponent(files[currentPhoto])}`;
        lightboxImage.alt = `Fotografia ${currentPhoto + 1} di ${files.length}`;
        counter.textContent = `Foto ${currentPhoto + 1} di ${files.length}`;
        lightbox.classList.add("active");
        document.body.classList.add("lightbox-open");
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
        document.body.classList.remove("lightbox-open");
    }

    function nextPhoto() {
        showPhoto(currentPhoto + 1);
    }

    function previousPhoto() {
        showPhoto(currentPhoto - 1);
    }

    document.querySelectorAll(".gallery-photo").forEach(image => {
        image.addEventListener("click", () => {
            showPhoto(Number(image.dataset.index));
        });
    });

    closeButton?.addEventListener("click", closeLightbox);
    previousButton?.addEventListener("click", event => {
        event.stopPropagation();
        previousPhoto();
    });
    nextButton?.addEventListener("click", event => {
        event.stopPropagation();
        nextPhoto();
    });

    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", event => {
        if (!lightbox.classList.contains("active")) return;

        if (event.key === "Escape") closeLightbox();
        if (event.key === "ArrowRight") nextPhoto();
        if (event.key === "ArrowLeft") previousPhoto();
    });

    lightbox.addEventListener("touchstart", event => {
        touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener("touchend", event => {
        const touchEndX = event.changedTouches[0].screenX;
        const distance = touchStartX - touchEndX;

        if (Math.abs(distance) < 50) return;
        if (distance > 0) nextPhoto();
        else previousPhoto();
    }, { passive: true });
}

loadEvent();
