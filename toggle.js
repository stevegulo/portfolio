// -----------------------------------
// MASTER SCRIPT – STEVE GULO
// -----------------------------------
document.addEventListener("DOMContentLoaded", () => {

  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  // ------------------------------
  // THEME PERSISTENCE
  // ------------------------------
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    if (themeIcon) themeIcon.textContent = '☀️';
  } else {
    body.classList.add('dark-theme');
    if (themeIcon) themeIcon.textContent = '🌙';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = body.classList.toggle('light-theme');
      body.classList.toggle('dark-theme', !isLight);
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      if (themeIcon) themeIcon.textContent = isLight ? '☀️' : '🌙';
    });
  }

  // ------------------------------
  // NAVBAR SCROLL / SHRINK
  // ------------------------------
  const navbar = document.querySelector('.navbar');
  const hero = document.querySelector('.hero');

  if (navbar) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = hero ? hero.offsetHeight : 400;

      let progress = scrollY / heroHeight;
      progress = Math.min(Math.max(progress, 0), 1);

      const baseOpacity = 0.55;
      const minOpacity = 0.15;
      const newOpacity = baseOpacity - (progress * (baseOpacity - minOpacity));

      navbar.style.background = `rgba(20, 20, 20, ${newOpacity})`;

      if (scrollY > 50) {
        navbar.classList.add('shrink');
      } else {
        navbar.classList.remove('shrink');
      }
    });
  }

  // ------------------------------
  // FADE-IN OBSERVER
  // ------------------------------
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    fadeEls.forEach(el => observer.observe(el));
  }

  // ------------------------------
  // FOOTER YEAR
  // ------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ------------------------------
  // LIGHTBOX (GENERIC GALLERY)
  // ------------------------------
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (lightbox && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const bgImage = item.style.backgroundImage;
        if (bgImage && bgImage.startsWith('url(')) {
          const src = bgImage.slice(5, -2);
          lightboxImg.src = src;
          lightbox.classList.add('active');
        }
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
      });
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });
  }

  // ------------------------------
  // PRO CAROUSEL – CINEMATIC FADE
  // ------------------------------
  const proCarousels = document.querySelectorAll('.pro-carousel');

  proCarousels.forEach(carousel => {
    const mainImage = carousel.querySelector('.pro-main-image');
    const thumbs = Array.from(carousel.querySelectorAll('.pro-thumb'));
    const arrowLeft = carousel.querySelector('.pro-arrow.left');
    const arrowRight = carousel.querySelector('.pro-arrow.right');

    if (!mainImage || thumbs.length === 0) return;

    let currentIndex = 0;
    let isTransitioning = false;

    function updateMainImage(index) {
      if (isTransitioning) return;
      isTransitioning = true;

      const newSrc = thumbs[index].getAttribute('src');
      if (!newSrc) {
        isTransitioning = false;
        return;
      }

      mainImage.style.transition = 'opacity 0.25s ease';
      mainImage.style.opacity = 0;

      setTimeout(() => {
        mainImage.src = newSrc;
        mainImage.style.opacity = 1;

        thumbs.forEach(t => t.classList.remove('active'));
        thumbs[index].classList.add('active');

        currentIndex = index;
        isTransitioning = false;
      }, 250);
    }

    thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        updateMainImage(index);
      });
    });

    if (arrowLeft) {
      arrowLeft.addEventListener('click', () => {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = thumbs.length - 1;
        updateMainImage(newIndex);
      });
    }

    if (arrowRight) {
      arrowRight.addEventListener('click', () => {
        let newIndex = currentIndex + 1;
        if (newIndex >= thumbs.length) newIndex = 0;
        updateMainImage(newIndex);
      });
    }

    // Initialize
    updateMainImage(0);
  });

});