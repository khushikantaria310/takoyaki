document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lenis Smooth Scrolling
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      if (target !== '#') {
        lenis.scrollTo(target);
      }
    });
  });

  // Connect Lenis to GSAP ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Smooth curtain reveal effect for the island

    // Smooth curtain reveal effect for the island
    gsap.to('.island', {
      scale: 0.92,
      opacity: 0.4,
      scrollTrigger: {
        trigger: '.moving-features-section',
        start: 'top bottom',
        end: 'top top',
        scrub: true
      }
    });

    // Pin only the sections we want others to slide over like a curtain
    const sectionsToPin = ['.island-wrapper', '.commands-section'];
    
    sectionsToPin.forEach((selector, index) => {
      ScrollTrigger.create({
        trigger: selector,
        start: () => {
          const el = document.querySelector(selector);
          // If the section is shorter than the viewport, pin it when it hits the top.
          // If it's taller, pin it when you reach the bottom of it.
          return window.innerHeight > el.offsetHeight ? "top top" : "bottom bottom";
        },
        pin: true,
        pinSpacing: false // Let the next section slide over it!
      });
    });
  }

  // Custom Cursor Logic
  const cursor = document.querySelector('.cursor');
  const cursorFollower = document.querySelector('.cursor-follower');
  
  if (cursor && cursorFollower) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Immediate update for the dot
      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power2.out"
      });
      
      // Trailing update for the follower
      gsap.to(cursorFollower, {
        x: mouseX,
        y: mouseY,
        duration: 0.6,
        ease: "power2.out"
      });
    });

    // Magnetic logic for interactive elements
    const magneticElements = document.querySelectorAll('.nav-pill-item, .btn');
    magneticElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorFollower.classList.add('active');
      });
      
      el.addEventListener('mouseleave', () => {
        cursorFollower.classList.remove('active');
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
      });

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        // Calculate distance from center of element
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Move the button slightly towards the cursor (magnetic effect)
        gsap.to(el, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });
  }

  // Trigger initial reveals after a tiny delay for smooth loading effect
  setTimeout(() => {
    document.querySelectorAll('.island-wrapper .reveal, .island-wrapper .reveal-fast').forEach(el => {
      el.classList.add('active');
    });
  }, 100);

  // Scroll reveal observer
  const revealElements = document.querySelectorAll('.setup-section .reveal, .moving-features-section .reveal, .commands-section .reveal, .footer-new.reveal');
  
  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);
  
  revealElements.forEach(el => revealObserver.observe(el));

  // --- Wokeworks Style Staggered Command Rows Animation ---
  if (typeof ScrollTrigger !== 'undefined') {
    const commandRows = document.querySelectorAll('.command-row');
    
    commandRows.forEach((row) => {
      const title = row.querySelector('.command-title');
      const box = row.querySelector('.command-box');
      const innerText = box.querySelector('p');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: "top 85%", // Trigger when it comes into view
          toggleActions: "play none none reverse"
        }
      });

      tl.to(title, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      })
      .to(box, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6") // Start box slightly after title
      .to(innerText, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4"); // Start text slightly after box
    });

    // --- Wokeworks Style Staggered Command Cards Animation ---
    const gridItems = document.querySelectorAll('.command-timeline-item');
    
    gridItems.forEach((item, index) => {
      // even index = left column (slide from left)
      // odd index = right column (slide from right)
      const xOffset = index % 2 === 0 ? -80 : 80;
      
      gsap.fromTo(item, 
        { 
          opacity: 0, 
          x: xOffset 
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 95%", 
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }

  // --- Abstract Embers Particle System ---
  const canvases = document.querySelectorAll('.embers-canvas');
  canvases.forEach(canvas => {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
      const parent = canvas.parentElement;
      width = canvas.width = parent.offsetWidth;
      height = canvas.height = parent.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Ember {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + Math.random() * 20;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedY = -(Math.random() * 1.5 + 0.5); // Faster upwards speed
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.life = 0;
        this.maxLife = Math.random() * 300 + 200; // Live longer
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;

        if (this.life < 50) {
          this.currentOpacity = this.opacity * (this.life / 50);
        } else if (this.life > this.maxLife - 50) {
          this.currentOpacity = this.opacity * ((this.maxLife - this.life) / 50);
        } else {
          this.currentOpacity = this.opacity;
        }

        if (this.y < 0 || this.life >= this.maxLife) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(214, 158, 69, ${this.currentOpacity})`; // Golden color
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(214, 158, 69, 0.8)';
      }
    }

    // Adjust particle count based on canvas height roughly
    const particleCount = height > 500 ? 40 : 20;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Ember());
    }

    function animateEmbers() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateEmbers);
    }
    animateEmbers();
  });

  // --- Hero Heatmap Generator & Animation ---
  const heatmapGrid = document.getElementById('heroHeatmap');
  if (heatmapGrid) {
    const rows = 7;
    const cols = 26; // Roughly half a year of weeks
    const totalDots = rows * cols;
    const dots = [];

    // Generate dots
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('div');
      dot.className = 'heatmap-dot';
      
      // Determine initial level (bias towards 0 for empty space)
      let level = 0;
      if (Math.random() > 0.6) {
        level = Math.floor(Math.random() * 5); // 0 to 4
      }
      
      dot.setAttribute('data-level', level);
      heatmapGrid.appendChild(dot);
      dots.push(dot);
    }

    // Lively Animation Effect: Twinkling / Updating commits
    setInterval(() => {
      // Pick a random number of dots to update
      const numToUpdate = Math.floor(Math.random() * 5) + 2;
      for (let i = 0; i < numToUpdate; i++) {
        const randomDot = dots[Math.floor(Math.random() * dots.length)];
        const currentLevel = parseInt(randomDot.getAttribute('data-level'));
        
        // Randomly go up or down
        let newLevel;
        if (currentLevel === 0) {
          newLevel = Math.random() > 0.8 ? 1 : 0; // Occasionally light up empty ones
        } else if (currentLevel === 4) {
          newLevel = 3; // Fade down max intensity
        } else {
          newLevel = currentLevel + (Math.random() > 0.5 ? 1 : -1);
        }
        
        randomDot.setAttribute('data-level', newLevel);
      }
    }, 300);

    // Initial scanline reveal effect
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(dots, 
        { opacity: 0, scale: 0.5 }, 
        {
          opacity: 1, 
          scale: 1,
          duration: 0.5,
          stagger: {
            each: 0.02,
            from: "random"
          },
          ease: "back.out(1.5)",
          delay: 0.5
        }
      );
    }
  }
});
