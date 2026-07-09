// --- 1. TECH PARTICLES CANVAS SCRIPT (UPGRADED + MOUSE INTERACTIVE) ---
const canvas = document.getElementById('tech-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const particleCount = 90;
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2 + 1;
        this.baseColor = Math.random() > 0.5 ? '0, 242, 254' : '127, 0, 255';
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mouse repulsion effect
        if (mouse.x !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius;
                this.x += (dx / dist) * force * 2.5;
                this.y += (dy / dist) * force * 2.5;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.baseColor}, 0.9)`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${this.baseColor}, 0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0, 242, 254, ${1 - dist / 130})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateCanvas);
}
animateCanvas();

// --- TYPING EFFECT FOR HERO TAGLINE ---
const typingElement = document.getElementById('typing-text');
const typingText = "// ASPIRING APP DEVELOPER";
let charIndex = 0;

function typeEffect() {
    if (charIndex < typingText.length) {
        typingElement.textContent += typingText.charAt(charIndex);
        charIndex++;
        setTimeout(typeEffect, 60);
    }
}
window.addEventListener('DOMContentLoaded', typeEffect);

// --- 2. SCROLL REVEAL ANIMATION ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- 3. CLICK RIPPLE ANIMATION ---
document.addEventListener('click', function(e) {
    let ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.background = 'radial-gradient(circle, var(--primary-neon) 0%, transparent 70%)';
    ripple.style.borderRadius = '50%';
    ripple.style.left = `${e.clientX - 10}px`;
    ripple.style.top = `${e.clientY - 10}px`;
    ripple.style.pointerEvents = 'none';
    ripple.style.transition = 'all 0.6s ease-out';
    ripple.style.zIndex = '9999';
    document.body.appendChild(ripple);
    setTimeout(() => {
        ripple.style.transform = 'scale(8)';
        ripple.style.opacity = '0';
    }, 10);
    setTimeout(() => { ripple.remove(); }, 600);
});

// --- 4. MOBILE MENU LOGIC (NEW) ---
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-list');

if(menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Toggle icon between bars and X
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
}

// Menu band ho jaye jab link pe click ho
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

// --- 5. MODERN CLICK TO COPY (Replaces old alert) ---
function copyText(text, label) {
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('toast');
        toast.innerText = `${label} Copied!`;
        toast.classList.add('show');
        
        // 3 second baad automatic hide ho jayega
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }).catch(err => {
        console.error('Copy fail ho gaya: ', err);
    });
}
// --- 5. EMAIL JS INTEGRATION ---
(function() {
    emailjs.init("7TukD69S2iuv65XKr");
})();

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const btn = this.querySelector('button');
    const btnLabel = btn.querySelector('span');
    const originalLabel = btnLabel.innerText;
    btnLabel.innerText = "Sending...";
    btn.disabled = true;

    emailjs.sendForm('service_39tks3r', 'template_8ow0zzk', this)
        .then(function() {
            btnLabel.innerText = "Message Sent!";
            document.getElementById('contact-form').reset();
            setTimeout(function() {
                btnLabel.innerText = originalLabel;
                btn.disabled = false;
            }, 2500);
        }, function(error) {
            alert('Failed to send. Please try again in a moment.');
            console.log('FAILED...', error);
            btnLabel.innerText = originalLabel;
            btn.disabled = false;
        });
});

// --- 6. BACKGROUND MUSIC LOGIC ---
const musicBtn = document.getElementById('music-btn');
const music = document.getElementById('bg-music');
let isPlaying = false;

musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        music.pause();
        musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i> Music';
    } else {
        music.play();
        musicBtn.innerHTML = '<i class="fas fa-volume-up"></i> Playing';
    }
    isPlaying = !isPlaying;
});
// --- CERTIFICATE POPUP MODAL ---
function openCertModal(imgSrc) {
    const modal = document.getElementById('cert-modal');
    const modalImg = document.getElementById('cert-modal-img');
    modalImg.src = imgSrc;
    modal.classList.add('show');
}

function closeCertModal() {
    document.getElementById('cert-modal').classList.remove('show');
}

// Modal ke bahar (kaale background pe) click karne se bhi band ho jaye
document.getElementById('cert-modal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeCertModal();
    }
});
