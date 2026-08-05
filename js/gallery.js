// =====================================================
// FLAVIUS e20
// gallery.js
// Release 0.5.0
// Great Project Team
// =====================================================

async function loadGalleries() {

    try {

        const galleryList = document.getElementById("gallery-list");

        galleryList.innerHTML = "";

        // Elenco degli eventi
        const response = await fetch("galleries/galleries.json");
        const events = await response.json();

        for (const event of events) {

            // Salta gli eventi nascosti
            if (!event.visibile) continue;

            const infoResponse = await fetch(`galleries/${event.id}/info.json`);
            const info = await infoResponse.json();

            const data = new Date(info.data);

            const dataFormattata = data.toLocaleDateString("it-IT", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });

            galleryList.innerHTML += `

            <a href="gallery.html?id=${event.id}" class="gallery-link">

                <article class="gallery-card">

                    <img
                        src="galleries/${event.id}/${info.copertina}"
                        alt="${info.titolo}">

                    <div class="gallery-info">

                        <h3>${info.titolo}</h3>

                        <p>${info.descrizione}</p>

                        <div class="gallery-meta">

                            <span>📅 ${dataFormattata}</span>

                        </div>

                    </div>

                </article>

            </a>

            `;

        }

    }

    catch (error) {

        console.error("Errore caricamento gallerie:", error);

    }

}

loadGalleries();