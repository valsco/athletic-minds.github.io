console.log('Slideshow script loaded');

let slideshowInterval = null;

function startHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slideshow .slide');

  console.log('Trying to init slideshow. Slides found:', slides.length);

  // If no slides, do nothing
  if (!slides.length) return false;

  // Prevent multiple intervals if init runs more than once
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
  }

  let currentSlide = 0;

  // Force exactly one active slide
  slides.forEach((s, i) => s.classList.toggle('active', i === 0));

  function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  slideshowInterval = setInterval(nextSlide, 5000);

  console.log('Slideshow initialized successfully');
  return true;
}

// Run on initial load
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');
  startHeroSlideshow();
});

// Also watch for SPA navigation / dynamic DOM updates (Vite + routers)
const observer = new MutationObserver(() => {
  // If it starts successfully once, you can optionally stop observing
  if (startHeroSlideshow()) {
    // observer.disconnect(); // uncomment if you only ever have one hero slideshow
  }
});

observer.observe(document.documentElement, { childList: true, subtree: true });


// // document.querySelectorAll('.slide[data-bg]').forEach(slide => {
// //   slide.style.backgroundImage = `url('${slide.dataset.bg}')`;
// // });

// // slides.forEach(slide => {
// //   const img = new Image();
// //   img.src = slide.dataset.bg;
// // });

// console.log('Slideshow script loaded');

// let slideshowInterval = null;

// function startHeroSlideshow() {
//   // 1) Grab slides (NodeList)
//   const slides = document.querySelectorAll('.hero-slideshow .slide[data-bg]');

//   console.log('Trying to init slideshow. Slides found:', slides.length);

//   if (!slides.length) return false;

//   // 2) Apply background images from data-bg
//   slides.forEach(slide => {
//     slide.style.backgroundImage = `url("${slide.dataset.bg}")`;
//   });

//   // 3) Prevent multiple intervals if init runs more than once
//   if (slideshowInterval) {
//     clearInterval(slideshowInterval);
//     slideshowInterval = null;
//   }

//   // 4) Preload images (optional but nice)
//   slides.forEach(slide => {
//     const img = new Image();
//     img.src = slide.dataset.bg;
//   });

//   // 5) Start at slide 0
//   let currentSlide = 0;
//   slides.forEach((s, i) => s.classList.toggle('active', i === 0));

//   function nextSlide() {
//     slides[currentSlide].classList.remove('active');
//     currentSlide = (currentSlide + 1) % slides.length;
//     slides[currentSlide].classList.add('active');
//   }

//   slideshowInterval = setInterval(nextSlide, 5000);

//   console.log('Slideshow initialized successfully');
//   return true;
// }

// // Run on initial load
// document.addEventListener('DOMContentLoaded', () => {
//   console.log('DOM loaded');
//   startHeroSlideshow();
// });

// // Watch for SPA navigation / dynamic DOM updates (Vite + routers)
// const observer = new MutationObserver(() => {
//   startHeroSlideshow();
// });

// observer.observe(document.documentElement, { childList: true, subtree: true });
