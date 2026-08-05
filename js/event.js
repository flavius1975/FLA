// ===========================================
// FLAVIUS e20
// event.js
// ===========================================

async function loadEvent() {

    const params = new URLSearchParams(window.location.search);

    const eventId = params.get("id");

    if (!eventId) {

        document.getElementById("event-title").textContent =
            "Evento non trovato";

        return;

    }

    const response = await fetch(`galleries/${eventId}/info.json`);

    const info = await response.json();

    document.title = info.titolo + " | FLAVIUS e20";

    document.getElementById("event-title").textContent =
        info.titolo;

    document.getElementById("event-description").textContent =
        info.descrizione;

    document.getElementById("cover-image").src =
        `galleries/${eventId}/${info.copertina}`;

    const data = new Date(info.data);

    const dataFormattata = data.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric"
});

document.getElementById("photo-count").textContent =
    `📷 ${info.foto.length} fotografie • ${dataFormattata} • ${info.luogo}`;

    const photoGrid = document.getElementById("photo-grid");

info.foto.forEach((file, index) => {

    photoGrid.innerHTML += `

        <div class="photo-card">

            <img
                src="galleries/${eventId}/thumb/${file}"
                alt=""
                class="gallery-photo"
                data-index="${index}">

        </div>

    `;

});

}

loadEvent();

// =======================
// LIGHTBOX
// =======================

const lightbox = document.getElementById("lightbox");

const lightboxImage = document.getElementById("lightbox-image");

document.addEventListener("click", function(e){

    if(e.target.classList.contains("gallery-photo")){

        lightboxImage.src = 
            e.target.src.replace("/thumb/", "/web/");

        lightbox.classList.add("active");

    }

});

document.getElementById("close-lightbox")
.addEventListener("click", ()=>{

    lightbox.classList.remove("active");

});

lightbox.addEventListener("click",(e)=>{

    if(e.target===lightbox){

        lightbox.classList.remove("active");

    }

});