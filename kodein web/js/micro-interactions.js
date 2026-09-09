// ==========================================
// 1. DYNAMIC CURSOR (Aura Ring + Smooth Trail)
// ==========================================
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('custom-cursor-follower');

  if (!cursor || !follower) return;

  window.addEventListener('mousemove', (e) => {
    if (window.gsap) {
      gsap.to(cursor, { x: e.clientX - 8, y: e.clientY - 8, opacity: 1, duration: 0.1 });
      gsap.to(follower, { x: e.clientX - 20, y: e.clientY - 20, opacity: 1, duration: 0.3, ease: "power2.out" });
    }
  });

  const interactiveTargets = 'a, button, input, .card-tilt, .group, .ace-card-glass, .spotlight-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveTargets) && window.gsap) {
      gsap.to(cursor, { scale: 2.5, backgroundColor: '#8b5cf6', duration: 0.2 });
      gsap.to(follower, { scale: 1.5, borderColor: '#8b5cf6', duration: 0.2 });
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveTargets) && window.gsap) {
      gsap.to(cursor, { scale: 1, backgroundColor: '#6366f1', duration: 0.2 });
      gsap.to(follower, { scale: 1, borderColor: 'rgba(99, 102, 241, 0.5)', duration: 0.2 });
    }
  });
}

// ==========================================
// 2. MAGNETIC BUTTON EFFECT
// ==========================================
function initMagneticButtons() {
  const magneticBtns = document.querySelectorAll('.magnetic-btn');

  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      if (window.gsap) {
        gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (window.gsap) {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
      }
    });
  });
}

// ==========================================
// 3. INCLUSIVE PARTICLE CANVAS + FLOATING ORBS & RIPPLE MESH
// ==========================================
function initRippleParticleCanvas() {
  const canvas = document.getElementById('hero-particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;

  let width = (canvas.width = parent.offsetWidth);
  let height = (canvas.height = parent.offsetHeight);

  const colorPalette = [
    'rgba(244, 114, 182, ', 
    'rgba(251, 191, 36, ',  
    'rgba(167, 139, 250, ', 
    'rgba(45, 212, 191, ',  
    'rgba(129, 140, 248, '  
  ];

  const ripples = [];

  // Mouse move event to trigger ripples
  parent.addEventListener('mousemove', (e) => {
    const rect = parent.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (ripples.length === 0 || Math.hypot(ripples[ripples.length - 1].x - x, ripples[ripples.length - 1].y - y) > 30) {
      ripples.push({ x, y, radius: 5, maxRadius: 140, opacity: 0.6 });
    }
  });

  window.addEventListener('resize', () => {
    width = canvas.width = parent.offsetWidth;
    height = canvas.height = parent.offsetHeight;
  });

  // ----------------------------------------
  // A. FLOATING GLOWING ORB CLASS (Bokeh)
  // ----------------------------------------
  class FloatingOrb {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 50 + 20; // Soft large ambient glow
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.color = ['rgba(139, 92, 246, ', 'rgba(236, 72, 153, ', 'rgba(59, 130, 246, '][Math.floor(Math.random() * 3)];
      this.alpha = Math.random() * 0.25 + 0.1; // Subtle transparency
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce smoothly off canvas boundaries
      if (this.x < -this.radius) this.x = width + this.radius;
      if (this.x > width + this.radius) this.x = -this.radius;
      if (this.y < -this.radius) this.y = height + this.radius;
      if (this.y > height + this.radius) this.y = -this.radius;
    }

    draw() {
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      gradient.addColorStop(0, `${this.color}${this.alpha})`);
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  // ----------------------------------------
  // B. STANDARD NETWORK PARTICLE CLASS
  // ----------------------------------------
  class Particle {
    constructor() { 
      this.reset(); 
    }

    reset() {
      this.baseX = Math.random() * width;
      this.baseY = Math.random() * height;
      this.x = this.baseX;
      this.y = this.baseY;
      this.radius = Math.random() * 3 + 1.5;
      this.baseAlpha = Math.random() * 0.4 + 0.2;
      this.colorPrefix = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.angle = Math.random() * Math.PI * 2;
    }

    update() {
      this.angle += 0.01;
      this.baseX += this.vx + Math.sin(this.angle) * 0.2;
      this.baseY += this.vy + Math.cos(this.angle) * 0.2;

      if (this.baseX < 0) this.baseX = width;
      if (this.baseX > width) this.baseX = 0;
      if (this.baseY < 0) this.baseY = height;
      if (this.baseY > height) this.baseY = 0;

      let offsetX = 0;
      let offsetY = 0;

      ripples.forEach((r) => {
        const dx = this.baseX - r.x;
        const dy = this.baseY - r.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const waveWidth = 30;

        if (Math.abs(dist - r.radius) < waveWidth) {
          const force = Math.sin((dist - r.radius) / waveWidth * Math.PI) * r.opacity * 15;
          offsetX += (dx / (dist || 1)) * force;
          offsetY += (dy / (dist || 1)) * force;
        }
      });

      this.x = this.baseX + offsetX;
      this.y = this.baseY + offsetY;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.colorPrefix}${this.baseAlpha})`;
      ctx.fill();
    }
  }

  // Create floating elements
  const orbCount = 6; // Number of floating glowing ambient orbs
  const particleCount = Math.floor(width / 18);

  const floatingOrbs = Array.from({ length: orbCount }, () => new FloatingOrb());
  const particles = Array.from({ length: particleCount }, () => new Particle());

  // ----------------------------------------
  // C. MAIN ANIMATION LOOP
  // ----------------------------------------
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Background Floating Glowing Orbs
    floatingOrbs.forEach((orb) => {
      orb.update();
      orb.draw();
    });

    // 2. Draw Interactive Ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += 2.5;
      r.opacity -= 0.008;

      if (r.opacity <= 0 || r.radius >= r.maxRadius) {
        ripples.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(236, 72, 153, ${r.opacity * 0.25})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 3. Draw Particle Mesh Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 90) {
          const opacity = (1 - dist / 90) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(216, 180, 254, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // 4. Draw Particles
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}
// ==========================================
// 4. INNER MULTI-LAYER PARALLAX EFFECT
// ==========================================
function initHeroInnerParallax() {
  const heroCard = document.getElementById('hero-banner-card');
  if (!heroCard) return;

  const parallaxLayers = heroCard.querySelectorAll('[data-depth]');

  heroCard.addEventListener('mousemove', (e) => {
    const rect = heroCard.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    parallaxLayers.forEach((layer) => {
      const depth = parseFloat(layer.getAttribute('data-depth')) || 0.02;
      const moveX = x * depth;
      const moveY = y * depth;

      if (window.gsap) {
        gsap.to(layer, { x: moveX, y: moveY, duration: 0.4, ease: 'power1.out', overwrite: 'auto' });
      } else {
        layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      }
    });
  });

  heroCard.addEventListener('mouseleave', () => {
    parallaxLayers.forEach((layer) => {
      if (window.gsap) {
        gsap.to(layer, { x: 0, y: 0, duration: 0.8, ease: 'power2.out' });
      } else {
        layer.style.transform = `translate3d(0, 0, 0)`;
      }
    });
  });
}

// ==========================================
// 5. SPOTLIGHT RADIAL TRACKER
// ==========================================
function initSpotlightCards() {
  const selector = '.spotlight-card, .ace-card-glass, #home-artists-grid > div, #home-artists-grid article, .artist-card, #home-games-grid > div';
  
  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest(selector);
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
}

// ==========================================
// 6. GLOBAL DIRECT TILT LISTENER (Robust & Instant)
// ==========================================
function initGlobalTilt() {
  const selector = '.ace-card-glass, .spotlight-card, #home-artists-grid > div, #home-artists-grid article, .artist-card, #home-games-grid > div';

  // Delegate event to document so dynamically created cards work out-of-the-box
  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest(selector);
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Increased tilt range to 18deg for clearly visible 3D response
    const rotateX = -((y - centerY) / centerY) * 18;
    const rotateY = ((x - centerX) / centerX) * 18;

    if (window.gsap) {
      gsap.to(card, {
        transformPerspective: 1000,
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.15,
        ease: 'power1.out',
        overwrite: 'auto'
      });
    } else {
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  });

  document.addEventListener('mouseout', (e) => {
    const card = e.target.closest(selector);
    if (!card) return;

    if (window.gsap) {
      gsap.to(card, {
        transformPerspective: 1000,
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    } else {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    }
  });
}

window.refreshMicroInteractions = function() {
  // Retained for backward-compatibility hooks
};

// ==========================================
// 7. GLOBAL DOM INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initMagneticButtons();
  initRippleParticleCanvas();
  initHeroInnerParallax();
  initSpotlightCards();
  initGlobalTilt();
});