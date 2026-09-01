document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('nav a');

  const observerNav = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach((section) => observerNav.observe(section));

  const revealEls = document.querySelectorAll('.reveal');
  const observerReveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observerReveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach((element) => observerReveal.observe(element));

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.dash-card[data-src]').forEach((card) => {
    card.addEventListener('click', () => {
      const src = card.dataset.src;
      if (!src) return;
      lightboxImg.src = src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightboxImg.src = '';
    }, 300);
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLightbox();
    }
  });

  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (!track || slides.length === 0 || !prevBtn || !nextBtn || !dotsContainer) {
    return;
  }

  let current = 0;
  let startX = 0;
  let autoPlay;

  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    if (index === 0) {
      dot.classList.add('active');
    }
    dot.addEventListener('click', () => goTo(index));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.querySelectorAll('span'));

  function goTo(index) {
    if (!dots.length) {
      return;
    }

    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots[current]?.classList.add('active');
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  track.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
  });

  track.addEventListener('touchend', (event) => {
    const diff = startX - event.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
    }
  });

  function startAutoPlay() {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => goTo(current + 1), 5000);
  }

  startAutoPlay();

  const carouselWrapper = document.querySelector('.carousel-wrapper');
  carouselWrapper?.addEventListener('mouseenter', () => clearInterval(autoPlay));
  carouselWrapper?.addEventListener('mouseleave', startAutoPlay);
});