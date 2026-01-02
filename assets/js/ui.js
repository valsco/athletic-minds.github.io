// ui.js - global UI behaviors used by router.js pages

(function () {
  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsa(sel, root = document) { return [...root.querySelectorAll(sel)]; }

  function closeMobileMenu() {
    qs('.mobile-menu')?.classList.remove('active');
    qs('.nav-links')?.classList.remove('active');
  }

  function toggleMobileMenu() {
    qs('.mobile-menu')?.classList.toggle('active');
    qs('.nav-links')?.classList.toggle('active');
  }

  function bindMobileMenu() {
    const mobileMenu = qs('.mobile-menu');
    if (!mobileMenu) return;

    // avoid double-binding if router loads pages etc.
    if (mobileMenu.dataset.bound === '1') return;
    mobileMenu.dataset.bound = '1';

    mobileMenu.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMobileMenu();
    });

    // click outside nav closes it
    document.addEventListener('click', (e) => {
      if (!e.target.closest('nav')) closeMobileMenu();
    });

    // resize closes it when going desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMobileMenu();
    });
  }

  function bindSmoothAnchors(root = document) {
    // only inside the current content area if you want
    qsa('a[href^="#"]', root).forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        const target = qs(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        closeMobileMenu();
      });
    });
  }

  function bindHeaderShadow() {
    const header = qs('header');
    if (!header) return;

    if (window.__headerShadowBound) return;
    window.__headerShadowBound = true;

    window.addEventListener('scroll', () => {
      header.style.boxShadow =
        window.scrollY > 100
          ? '0 2px 20px rgba(0,0,0,0.15)'
          : '0 2px 10px rgba(0,0,0,0.1)';
    });
  }

  function initScrollReveal(root = document) {
    // Recreate observer each time after router injects new content
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        if (entry.target.classList.contains('animate-fade-in')) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, observerOptions);

    qsa('.animate-fade-in, .reveal', root).forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  function enhanceNewContent(root = document) {
    // apply hover/ripple to dynamically injected elements if you still want this
    qsa('.feature-card, .tutor-card-container, .service-card, .testimonial', root)
      .forEach(el => el.classList.add('hover-lift'));

    qsa('.cta-button, .book-button, .submit-button', root)
      .forEach(el => el.classList.add('button-ripple'));

    bindSmoothAnchors(root);
    initScrollReveal(root);
  }

  (function () {
  // 1) Scroll reveal
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  function initReveal(root = document) {
    root.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }

  // 2) Ripple effect (optional)
  function initRipples(root = document) {
    root.querySelectorAll('.button-ripple').forEach(btn => {
      // prevent double-binding
      if (btn.dataset.rippleBound === "true") return;
      btn.dataset.rippleBound = "true";

      btn.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position:absolute;
          width:${size}px;height:${size}px;
          left:${x}px;top:${y}px;
          border-radius:50%;
          transform:scale(0);
          opacity:0.6;
          pointer-events:none;
        `;

        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);

        ripple.animate(
          [{ transform: 'scale(0)', opacity: 0.6 }, { transform: 'scale(1)', opacity: 0 }],
          { duration: 600, easing: 'ease-out' }
        );

        setTimeout(() => ripple.remove(), 650);
      });
    });
  }

  // 3) One function router can call after injecting HTML
  window.enhanceUI = function (root = document) {
    initReveal(root);
    initRipples(root);
  };
})();


  // expose for router.js
  window.UI = {
    closeMobileMenu,
    bindMobileMenu,
    bindHeaderShadow,
    enhanceNewContent,
  };

  // run once on initial load
  document.addEventListener('DOMContentLoaded', () => {
    bindMobileMenu();
    bindHeaderShadow();
    enhanceNewContent(document);
  });
})();
