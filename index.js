/* =========================================
   Devashya Sahu — Portfolio JS
   Next-level interactions and features
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  // -- Small helpers
  const $ = sel => document.querySelector(sel);

  // Set year in footer
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // -------------------------
  // THEME TOGGLE (Global and Next-Level)
  // -------------------------
  (function globalThemeToggle() {
    const body = document.body;
    const toggleBtn = document.getElementById('toggle-btn');
    const lrmToggle = document.getElementById('lrm-mode-toggle');

    // Check user's system preference for a next-level experience
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('site-theme');

    // Set the initial theme on load
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      body.classList.add('dark');
    }

    // Handle the button click to toggle the theme
    toggleBtn.addEventListener('click', () => {
      body.classList.toggle('dark');
      localStorage.setItem('site-theme', body.classList.contains('dark') ? 'dark' : 'light');
    });

    // Hide the old LRM-specific toggle as the main one now controls everything
    if (lrmToggle) {
      lrmToggle.parentElement.style.display = 'none';
    }
  })();


  // -------------------------
  // HERO: Canvas Animation (Day & Night)
  // -------------------------
  (function heroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;
    const stars = [];
    const floatingParticles = [];
    const PARTICLE_COUNT = 800;
    const FLOATING_PARTICLE_COUNT = 150;

    // Mouse position for parallax
    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    // Create star objects (night mode)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      stars.push({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(0.3, 1.8),
        vx: rand(-0.05, 0.05),
        vy: rand(-0.02, 0.02),
        alpha: rand(0.2, 0.9),
        z: rand(0.5, 2)
      });
    }

    // Create floating particle objects (day mode)
    for (let i = 0; i < FLOATING_PARTICLE_COUNT; i++) {
      floatingParticles.push({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(1.5, 4),
        vx: rand(-0.1, 0.1),
        vy: rand(-0.1, 0.1),
        alpha: rand(0.1, 0.3)
      });
    }

    function resize() {
      w = canvas.width = canvas.clientWidth || innerWidth;
      h = canvas.height = canvas.clientHeight || innerHeight;
    }
    window.addEventListener('resize', resize);

    function draw() {
      ctx.clearRect(0, 0, w, h);

      if (document.body.classList.contains('dark')) {
        // Draw night mode starfield
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, '#04040a');
        g.addColorStop(1, '#070714');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';
        for (const s of stars) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(180,220,255,${s.alpha})`;
          const parallaxX = (mouseX - w / 2) * 0.005 * s.z;
          const parallaxY = (mouseY - h / 2) * 0.005 * s.z;
          ctx.arc(s.x + parallaxX, s.y + parallaxY, s.r, 0, Math.PI * 2);
          ctx.fill();
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < -10) s.x = w + 10;
          if (s.x > w + 10) s.x = -10;
          if (s.y < -10) s.y = h + 10;
          if (s.y > h + 10) s.y = -10;
        }
        ctx.globalCompositeOperation = 'source-over';
      } else {
        // Draw day mode floating particles
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, '#e0f7ff');
        g.addColorStop(1, '#ffffff');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        for (const p of floatingParticles) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(180,220,255,${p.alpha})`;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;
        }
      }

      requestAnimationFrame(draw);
    }
    resize();
    draw();
  })();


  // -------------------------
  // HERO: typewriter effect simple
  // -------------------------
  (function typewriterHero() {
    const el = document.querySelector('.mono-typer');
    if (!el) return;
    const text = el.getAttribute('data-text') || el.textContent;
    el.textContent = '';
    let i = 0;
    const speed = 36;

    function step() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(step, speed);
      }
    }
    setTimeout(step, 400);
  })();


  // -------------------------
  // LIFE ROAD MAP: scroll progress & active markers
  // -------------------------
  (function lrmProgress() {
    const section = document.getElementById('life-road-map');
    if (!section) return;
    const progress = section.querySelector('.timeline-progress');
    const items = Array.from(section.querySelectorAll('.timeline-item'));

    function updateProgress() {
      const rect = section.getBoundingClientRect();
      const winH = window.innerHeight;
      const totalScrollable = Math.max(rect.height - winH, 0);
      let scrolled = 0;
      if (rect.top < 0) scrolled = Math.min(-rect.top, totalScrollable);
      const fraction = totalScrollable === 0 ? (rect.top <= 0 ? 1 : 0) : Math.max(0, Math.min(1, scrolled / totalScrollable));
      progress.style.height = (fraction * 100) + '%';
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting) el.classList.add('active');
        else el.classList.remove('active');
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40% 0px',
      threshold: 0
    });

    items.forEach(it => io.observe(it));
    window.addEventListener('scroll', updateProgress, {
      passive: true
    });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  })();


  // -------------------------
  // FADE-IN SCROLL ANIMATIONS
  // -------------------------
  (function scrollAnimations() {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, {
      rootMargin: "0px 0px -100px 0px"
    });

    const elements = document.querySelectorAll('.fade-in-on-scroll');
    elements.forEach(el => observer.observe(el));
  })();


  // -------------------------
  // CONTACT: confetti on submit (tiny, simple)
  // -------------------------
  (function contactConfetti() {
    const form = document.getElementById('contact-form');
    const root = document.getElementById('confetti-root');
    if (!form || !root) return;

    function makeConfettiParticle(x, y) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.position = 'fixed';
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.width = el.style.height = (6 + Math.random() * 10) + 'px';
      el.style.background = `hsl(${Math.random()*360} 80% 65%)`;
      el.style.borderRadius = (Math.random() > 0.5 ? '3px' : '50%');
      el.style.opacity = 1;
      el.style.transform = `translateY(0) rotate(${Math.random()*360}deg)`;
      el.style.zIndex = 9999;
      el.style.pointerEvents = 'none';
      root.appendChild(el);

      // animate
      const dx = (Math.random() - 0.5) * 400;
      const dy = 700 + Math.random() * 200;
      const rot = (Math.random() - 0.5) * 720;
      el.animate([{
        transform: `translate(0,0) rotate(0deg)`,
        opacity: 1
      }, {
        transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
        opacity: 0
      }], {
        duration: 1600 + Math.random() * 600,
        easing: 'cubic-bezier(.2,.6,.2,1)'
      });
      setTimeout(() => el.remove(), 2200);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // small faux "submit" success
      const rect = form.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + 40;
      for (let i = 0; i < 40; i++) {
        setTimeout(() => makeConfettiParticle(cx + (Math.random() - 0.5) * 200, cy + (Math.random() - 0.5) * 20), i * 20);
      }
      // Here you would send the form. For demo, just clear and show success.
      form.reset();
      alert('Message sent — thank you!');
    });
  })();

});
const videos = document.querySelectorAll('.main-video');

videos.forEach(video => {
  const wrapper = video.closest('.main-video-wrapper');
  const overlay = wrapper.querySelector('.play-overlay');

  wrapper.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      video.classList.add('playing');
    } else {
      video.pause();
      video.classList.remove('playing');
    }
  });

  // Show overlay again when video ends
  video.addEventListener('ended', () => {
    video.classList.remove('playing');
  });
});
