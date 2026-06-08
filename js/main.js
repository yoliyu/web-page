/* =====================================================
   YOLANDA SABUCO — Main JavaScript
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- SIDEBAR MOBILE TOGGLE --- */
  const sidebar = document.getElementById('sidebar');
  const mobileToggle = document.querySelector('.sidebar__mobile-toggle');
  const backToTop = document.querySelector('.back-to-top');

  mobileToggle?.addEventListener('click', () => {
    const isOpen = sidebar?.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', isOpen);
  });

  /* Close sidebar on nav link click (mobile) */
  document.querySelectorAll('.sidebar__nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) sidebar?.classList.remove('open');
    });
  });

  /* Close on outside click */
  document.addEventListener('click', (e) => {
    if (sidebar?.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !mobileToggle?.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });

  /* --- SCROLL STATE --- */
  const onScroll = () => {
    backToTop?.classList.toggle('visible', window.scrollY > 400);
    highlightNavLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- ACTIVE SIDEBAR LINK --- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.sidebar__nav-link');

  function highlightNavLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
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


  /* --- INTRO VIDEO CLICK TO PLAY --- */
  document.getElementById('introVideo')?.addEventListener('click', function () {
    this.innerHTML = '<iframe src="https://www.youtube.com/embed/8aj2rQQcRYQ?autoplay=1&rel=0&modestbranding=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
  });

  /* --- ANIMATED 3D BACKGROUND --- */
  (function () {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, pts;
    let mx = -9999, my = -9999;

    const COLOR = '138,92,26';
    const CONNECT = 145;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    class Dot {
      constructor() { this.init(); }
      init() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.z  = 0.2 + Math.random() * 0.8;
        this.vx = (Math.random() - 0.5) * 0.55 * this.z;
        this.vy = (Math.random() - 0.5) * 0.55 * this.z;
        this.r  = 0.7 + this.z * 2.1;
        this.a  = 0.12 + this.z * 0.48;
      }
      step() {
        const dx = this.x - mx, dy = this.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < 16000) {
          const f = (1 - Math.sqrt(d2) / 126) * 0.55;
          this.x += dx * f * 0.035;
          this.y += dy * f * 0.035;
        }
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -12) this.x = W + 12;
        else if (this.x > W + 12) this.x = -12;
        if (this.y < -12) this.y = H + 12;
        else if (this.y > H + 12) this.y = -12;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLOR},${this.a})`;
        ctx.fill();
      }
    }

    function init() {
      const n = Math.min(160, Math.floor(W * H / 7500));
      pts = Array.from({ length: n }, () => new Dot());
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++) {
        pts[i].step();
        pts[i].draw();
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(${COLOR},${(1 - d / CONNECT) * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(frame);
    }

    resize(); init(); frame();
    window.addEventListener('resize', () => { resize(); init(); });
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    window.addEventListener('mouseleave', () => { mx = -9999; my = -9999; });
  })();

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

  /* --- HOBBIES CAROUSEL (infinite) --- */
  const hobbiesTrack = document.getElementById('hobbiesTrack');
  if (hobbiesTrack) {
    const hobbiesViewport = hobbiesTrack.parentElement;
    const GAP_PX = 12;
    function getVisible() {
      return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    }

    // Clone all slides and append for seamless looping
    const origSlides = Array.from(hobbiesTrack.children);
    const ORIG = origSlides.length;
    origSlides.forEach(s => hobbiesTrack.appendChild(s.cloneNode(true)));

    let idx = 0;
    let busy = false;
    let hobbiesTimer;

    const prevBtn = hobbiesTrack.closest('.hobbies-carousel').querySelector('.hobbies-btn--prev');
    const nextBtn = hobbiesTrack.closest('.hobbies-carousel').querySelector('.hobbies-btn--next');

    function slideW() {
      const v = getVisible();
      return (hobbiesViewport.offsetWidth - GAP_PX * (v - 1)) / v;
    }

    function moveTo(i, animate = true) {
      if (!animate) hobbiesTrack.style.transition = 'none';
      idx = i;
      hobbiesTrack.style.transform = `translateX(-${i * (slideW() + GAP_PX)}px)`;
      if (!animate) { hobbiesTrack.offsetHeight; hobbiesTrack.style.transition = ''; }
    }

    hobbiesTrack.addEventListener('transitionend', () => {
      if (idx >= ORIG) moveTo(idx - ORIG, false);
      busy = false;
    });

    function next() {
      if (busy) return;
      busy = true;
      moveTo(idx + 1);
    }

    function prev() {
      if (busy) return;
      busy = true;
      if (idx === 0) {
        moveTo(ORIG, false);
        requestAnimationFrame(() => requestAnimationFrame(() => moveTo(ORIG - 1)));
      } else {
        moveTo(idx - 1);
      }
    }

    function startAuto() {
      hobbiesTimer = setInterval(next, 3200);
    }

    prevBtn.addEventListener('click', () => { clearInterval(hobbiesTimer); prev(); startAuto(); });
    nextBtn.addEventListener('click', () => { clearInterval(hobbiesTimer); next(); startAuto(); });

    hobbiesTrack.closest('.hobbies-section').addEventListener('mouseenter', () => clearInterval(hobbiesTimer));
    hobbiesTrack.closest('.hobbies-section').addEventListener('mouseleave', startAuto);

    window.addEventListener('resize', () => moveTo(idx % ORIG, false));

    moveTo(0, false);
    startAuto();
  }
});
