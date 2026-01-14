// ===== Particle Animation System =====
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.particleCount = this.calculateParticleCount();
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }
    
    calculateParticleCount() {
        const area = window.innerWidth * window.innerHeight;
        return Math.min(Math.floor(area / 15000), 100);
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.particleCount = this.calculateParticleCount();
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
    
    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.5;
                    this.ctx.strokeStyle = `rgba(245, 166, 35, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });
        
        this.connectParticles();
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== Particle Class =====
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.baseSize = this.size;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = this.getRandomColor();
    }
    
    getRandomColor() {
        const colors = [
            'rgba(245, 166, 35, 0.8)',  // Primary gold
            'rgba(78, 205, 196, 0.8)',   // Accent teal
            'rgba(255, 107, 107, 0.8)',  // Accent red
            'rgba(255, 255, 255, 0.6)'   // White
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update(mouse) {
        // Movement
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
        
        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * force * 2;
                this.y += Math.sin(angle) * force * 2;
                this.size = this.baseSize + force * 3;
            } else {
                this.size = this.baseSize;
            }
        }
    }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
    }
}

// ===== Typewriter Effect =====
class Typewriter {
    constructor(element, texts, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) {
        this.element = element;
        this.texts = texts;
        this.typingSpeed = typingSpeed;
        this.deletingSpeed = deletingSpeed;
        this.pauseDuration = pauseDuration;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.innerHTML = currentText.substring(0, this.charIndex - 1) + '<span class="cursor"></span>';
            this.charIndex--;
        } else {
            this.element.innerHTML = currentText.substring(0, this.charIndex + 1) + '<span class="cursor"></span>';
            this.charIndex++;
        }
        
        let timeout = this.isDeleting ? this.deletingSpeed : this.typingSpeed;
        
        if (!this.isDeleting && this.charIndex === currentText.length) {
            timeout = this.pauseDuration;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            timeout = 500;
        }
        
        setTimeout(() => this.type(), timeout);
    }
}

// ===== Progress Loader Animation =====
class ProgressLoader {
    constructor() {
        this.progressText = document.getElementById('progress-text');
        this.messages = [
            'Loading',
            'Building something special',
            'Preparing for launch',
            'Almost there',
            'Getting ready for COMO'
        ];
        this.currentIndex = 0;
        
        this.startRotation();
    }
    
    startRotation() {
        setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.messages.length;
            this.progressText.style.opacity = '0';
            
            setTimeout(() => {
                this.progressText.textContent = this.messages[this.currentIndex];
                this.progressText.style.opacity = '1';
            }, 300);
        }, 3000);
    }
}

// ===== Form Handler =====
class FormHandler {
    constructor(formId, successId) {
        this.form = document.getElementById(formId);
        this.successMessage = document.getElementById(successId);
        this.emailInput = document.getElementById('email-input');
        
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const email = this.emailInput.value;
        
        if (this.validateEmail(email)) {
            // In a real application, you would send this to your backend
            console.log('Email submitted:', email);
            
            // Show success message
            this.form.classList.add('hidden');
            this.successMessage.classList.add('show');
            
            // Store in localStorage (for demo purposes)
            this.storeEmail(email);
            
            // Reset after 5 seconds (for demo)
            setTimeout(() => {
                this.form.classList.remove('hidden');
                this.successMessage.classList.remove('show');
                this.form.reset();
            }, 5000);
        }
    }
    
    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    storeEmail(email) {
        const emails = JSON.parse(localStorage.getItem('como4u_emails') || '[]');
        if (!emails.includes(email)) {
            emails.push(email);
            localStorage.setItem('como4u_emails', JSON.stringify(emails));
        }
    }
}

// ===== Smooth Scroll for any anchor links =====
class SmoothScroll {
    constructor() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

// ===== Easter Egg: Konami Code =====
class KonamiCode {
    constructor(callback) {
        this.sequence = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        this.position = 0;
        this.callback = callback;
        
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }
    
    handleKeydown(e) {
        if (e.code === this.sequence[this.position]) {
            this.position++;
            
            if (this.position === this.sequence.length) {
                this.callback();
                this.position = 0;
            }
        } else {
            this.position = 0;
        }
    }
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    const canvas = document.getElementById('particles');
    if (canvas) {
        new ParticleSystem(canvas);
    }
    
    // Initialize typewriter
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const texts = [
            'Your local connection to Columbia, Missouri.',
            'Discover. Connect. Thrive.',
            'Built by the community, for the community.',
            'Coming soon to serve COMO!'
        ];
        new Typewriter(typewriterElement, texts);
    }
    
    // Initialize progress loader
    new ProgressLoader();
    
    // Initialize form handler
    new FormHandler('signup-form', 'success-message');
    
    // Initialize smooth scroll
    new SmoothScroll();
    
    // Initialize Konami code easter egg
    new KonamiCode(() => {
        document.body.style.animation = 'rainbow 2s linear';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
        
        // Add rainbow animation to stylesheet dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    });
    
    // Add loaded class to body after everything is ready
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Console message
    console.log('%c COMO4U ', 'background: linear-gradient(135deg, #f5a623, #ff6b6b); color: #1a1a2e; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 5px;');
    console.log('%c Coming soon to Columbia, Missouri! ', 'color: #4ecdc4; font-size: 14px;');
});

// ===== Service Worker Registration (for PWA support) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment this when you have a service worker file
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed:', err));
    });
}