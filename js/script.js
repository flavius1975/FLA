/* ==========================================================
   FLAVIUS e20
   script.js
   Beta 0.6
========================================================== */


/* ==========================================================
   CONFIGURAZIONE GALLERIE
========================================================== */


const galleries = [

    {
        title:"e20 recenti",
        folder:"images/gallery/recenti/",
        images:[
            "FLA0001.jpg",
            "FLA0002.jpg",
            "FLA0003.jpg"
        ]
    },


    {
        title:"Eventi",
        folder:"images/gallery/eventi/",
        images:[
            "FLA0101.jpg",
            "FLA0102.jpg"
        ]
    }


];



/* ==========================================================
   CREAZIONE GALLERIE
========================================================== */


const galleryList =
document.getElementById(
"gallery-list"
);



let allImages=[];



if(galleryList){


galleries.forEach(gallery=>{


gallery.images.forEach(image=>{


let path=
gallery.folder + image;



allImages.push(path);



let card=document.createElement("div");


card.className="gallery-card reveal";



card.innerHTML=`

<img 
src="${path}"
alt="${gallery.title}"
loading="lazy">


<div class="gallery-info">

<h3>${gallery.title}</h3>

</div>

`;



galleryList.appendChild(card);



});

});


}



/* ==========================================================
   LIGHTBOX CREATA AUTOMATICAMENTE
========================================================== */


const lightbox=document.createElement("div");

lightbox.className="lightbox";


lightbox.innerHTML=`

<button class="lightbox-close">
×
</button>


<button class="lightbox-prev">
‹
</button>


<img src="">


<button class="lightbox-next">
›
</button>


<div class="photo-counter"></div>

`;



document.body.appendChild(lightbox);



const lightboxImg=
lightbox.querySelector("img");


const counter=
lightbox.querySelector(
".photo-counter"
);



let currentPhoto=0;



function openLightbox(index){


currentPhoto=index;


lightboxImg.src=
allImages[currentPhoto];


counter.textContent=
`${currentPhoto+1} / ${allImages.length}`;


lightbox.classList.add("active");


document.body.style.overflow="hidden";


}



function closeLightbox(){


lightbox.classList.remove("active");


document.body.style.overflow="";


}



function nextPhoto(){


currentPhoto++;


if(currentPhoto>=allImages.length){

currentPhoto=0;

}


openLightbox(currentPhoto);


}



function prevPhoto(){


currentPhoto--;


if(currentPhoto<0){

currentPhoto=
allImages.length-1;

}


openLightbox(currentPhoto);


}





document.addEventListener(
"click",
e=>{


const image=
e.target.closest(
".gallery-card img"
);



if(image){


const index=
[...document.querySelectorAll(".gallery-card img")]
.indexOf(image);



openLightbox(index);


}


});





lightbox.querySelector(
".lightbox-close"
)
.onclick=closeLightbox;



lightbox.querySelector(
".lightbox-next"
)
.onclick=nextPhoto;



lightbox.querySelector(
".lightbox-prev"
)
.onclick=prevPhoto;




lightbox.onclick=e=>{


if(e.target===lightbox){

closeLightbox();

}


};



/* ==========================================================
   TASTIERA
========================================================== */


document.addEventListener(
"keydown",
e=>{


if(!lightbox.classList.contains("active"))
return;



if(e.key==="Escape")
closeLightbox();



if(e.key==="ArrowRight")
nextPhoto();



if(e.key==="ArrowLeft")
prevPhoto();



});



/* ==========================================================
   SWIPE MOBILE
========================================================== */


let touchStart=0;


lightbox.addEventListener(
"touchstart",
e=>{


touchStart=
e.changedTouches[0].screenX;


},
{passive:true}
);



lightbox.addEventListener(
"touchend",
e=>{


let touchEnd=
e.changedTouches[0].screenX;



if(touchStart-touchEnd>60){

nextPhoto();

}


if(touchEnd-touchStart>60){

prevPhoto();

}



},
{passive:true}
);



/* ==========================================================
   REVEAL ANIMATION
========================================================== */


const observer=
new IntersectionObserver(
entries=>{


entries.forEach(entry=>{


if(entry.isIntersecting){


entry.target.classList.add(
"active"
);


}


});


},
{
threshold:.15
});



document.querySelectorAll(".reveal")
.forEach(el=>{


observer.observe(el);


});



/* ==========================================================
   LOADER
========================================================== */


window.addEventListener(
"load",
()=>{


const loader=
document.querySelector(".loader");



if(loader){

loader.classList.add(
"hide"
);

}


});



console.log(
"FLAVIUS e20 Beta 0.6 ready"
);