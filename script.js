'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const header = document.querySelector('.header');
const leftBtn = document.querySelector('.slider__btn--left');
const rightBtn = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(function (btn, i, arr) {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////   Scrolling part here

btnScrollTo.addEventListener('click', function (e) {
  const slCooads = section1.getBoundingClientRect();

  // window.scrollTo({
  //   left: slCooads.left + window.pageXOffset,
  //   top: slCooads.right + window.pageYOffset,            Old method to calculate page X Offset and Y offset
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

// random color generation  rgb(255,255,255)

const randomInt = (min, max) => {
  const ranNum = Math.floor(Math.random() * (max - min + 1) + min);

  return ranNum;
};

const randomColor = () => {
  return `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
};

//console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   console.log('nav-link', e.target);
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   console.log('nav-links', e.target);
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     console.log('nav', e.target);
//   },
//   true
// );

///////////////   Page navigation part here

// const c = document
//   .querySelectorAll('.nav__link')
//   .forEach(function (el, i, arr) {
//     el.addEventListener('click', function (e) {
//       e.preventDefault();

//       const id = this.getAttribute('href');
//       const elId = document.querySelector(id);
//       elId.scrollIntoView({ behavior: 'smooth' });
//       console.log(id);
//     });
//   });

// this method we are creating 3 callback  functions for 3 but what about if we have 1000 nav links...???

/// so now event delegation comes into picture. it effectivley handles the events.

///1. Add event listner to common parent element.
///2. Determine what element originated the event.
/// Matching stratagy ignoring the events

document.querySelector('.nav__links').addEventListener('click', function (e) {
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();

    const id = e.target.getAttribute('href');
    const elId = document.querySelector(id);
    elId.scrollIntoView({ behavior: 'smooth' });
  }
});

const h1 = document.querySelector('h1');
const s = h1.querySelectorAll('.highlight');

/// tabed component

const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');

// tabs.forEach(function(el,i,arr){
// el.addEventListener('click',function(e){
// bad practice
// });
// });

// add event handler to parent container and check if tab available or not
// we can write e.target.classList.contains('operations__tab') or e.target.closest('operations__tab');

tabContainer.addEventListener('click', function (e) {
  const el = e.target.closest('.operations__tab');

  if (!el) return;
  // remove active tab already we have
  tabs.forEach(function (tab, i, arr) {
    tab.classList.remove('operations__tab--active');
  });

  // remove active content already we have
  tabContent.forEach(function (tab, i, arr) {
    tab.classList.remove('operations__content--active');
  });

  // add active tab
  el.classList.add('operations__tab--active');

  //active active content

  document
    .querySelector(`.operations__content--${el.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Fade out animation for nav links

const nav = document.querySelector('.nav');

const handleTheOver = function (e) {
  var val = this;
  if (e.target.classList.contains('nav__link')) {
    const mouseOveredElement = e.target;
    const siblings = mouseOveredElement
      .closest('.nav')
      .querySelectorAll('.nav__link');

    const logo = mouseOveredElement.closest('.nav').querySelector('img');

    siblings.forEach(function (el, i, arr) {
      if (el !== mouseOveredElement) {
        el.style.opacity = val;
      }
    });

    logo.style.opacity = val;
  }
};

nav.addEventListener('mouseover', handleTheOver.bind(0.5));
nav.addEventListener('mouseout', handleTheOver.bind(1));

const initialCords = section1.getBoundingClientRect();

///Adding the sticky header

window.addEventListener('scroll', function (e) {
  if (window.scrollY > initialCords.top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});

// Reveal Sections

// all sections
const allsections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allsections.forEach(function (section, i, arr) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

/// Lazy loading images

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});

imgTargets.forEach(function (img, i, arr) {
  imgObserver.observe(img);
});

/// Implementing Sliders

const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
let maxSlides = slides.length;
console.log(maxSlides, 'dddd');

// slides.forEach(function (el, i, arr) {
//   el.style.transform = `translateX(${100 * i}%)`;
// });

// first right click -100% 0% 100% 200% =================================

const goToSlide = function (currentSlide) {
  slides.forEach(function (el, i, arr) {
    el.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
  });
};

// Initial loading images 0% 100% 200% 300% =============================
goToSlide(0);
// =========================================================================
// Right click function

const nextSlide = function () {
  if (currentSlide === maxSlides - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
  activatingDots(currentSlide);
};

const prevSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxSlides - 1;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
  activatingDots(currentSlide);
};

const activatingDots = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(function (el, i, arr) {
    el.classList.remove('dots__dot--active');
  });

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
const creatingDots = function (e) {
  slides.forEach(function (el, i, arr) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

creatingDots();
activatingDots(0);
//=====================

// left button click ====================================================

/// images slide when Left and Right arrow key

document.addEventListener('keydown', function (e) {
  console.log('eeee', e);
  if (e.key === 'ArrowLeft') prevSlide();
  else if (e.key === 'ArrowRight') nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activatingDots(slide);
  }
});

leftBtn.addEventListener('click', prevSlide);
rightBtn.addEventListener('click', nextSlide);
