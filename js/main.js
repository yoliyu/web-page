/* =====================================================
   YOLANDA SABUCO — Main JavaScript
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- NAV SCROLL STATE --- */
  const nav = document.querySelector('.nav');
  const backToTop = document.querySelector('.back-to-top');

  const onScroll = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 40);
    backToTop?.classList.toggle('visible', window.scrollY > 400);
    highlightNavLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- MOBILE MENU --- */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile-menu');

  hamburger?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', mobileMenu?.classList.contains('open'));
  });

  document.querySelectorAll('.nav__mobile-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu?.classList.remove('open'));
  });

  /* Close on outside click */
  document.addEventListener('click', (e) => {
    if (mobileMenu?.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamburger?.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });

  /* --- ACTIVE NAV LINK --- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function highlightNavLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('active', href === `#${current}` || href.endsWith(`#${current}`));
    });
  }

  /* --- EXPERIENCE TIMELINE TOGGLE --- */
  document.querySelectorAll('.timeline__header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.timeline__item');
      const body = item?.querySelector('.timeline__body');
      const isOpen = item?.classList.toggle('open');
      body?.classList.toggle('open', isOpen);
    });
  });

  /* --- BLOG FILTER --- */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.blog-card').forEach(card => {
        card.hidden = filter !== 'all' && card.dataset.category !== filter;
      });
    });
  });

  /* --- SCROLL REVEAL --- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* --- SCROLL REVEAL (.r / .show) for ported sections --- */
  const rObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        rObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

  document.querySelectorAll('.r').forEach(el => rObs.observe(el));

  /* --- BACK TO TOP --- */
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* --- COPY CODE BUTTONS --- */
  document.querySelectorAll('.code-copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pre = btn.closest('.code-wrap')?.querySelector('pre');
      const text = pre?.textContent || '';
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'Copiado ✓';
        setTimeout(() => (btn.textContent = 'Copiar'), 2000);
      } catch {
        btn.textContent = 'Error';
        setTimeout(() => (btn.textContent = 'Copiar'), 2000);
      }
    });
  });

  /* --- TUTORIAL TOC HIGHLIGHT --- */
  const tocLinks = document.querySelectorAll('.tut-toc__link');
  const tutHeadings = document.querySelectorAll('.tut-content h2[id], .tut-content h3[id]');

  if (tocLinks.length && tutHeadings.length) {
    const tocObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    }, { rootMargin: '-68px 0px -60% 0px' });
    tutHeadings.forEach(h => tocObs.observe(h));
  }

  /* --- EXTERNAL LINKS --- */
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  /* Initial call */
  onScroll();
});
