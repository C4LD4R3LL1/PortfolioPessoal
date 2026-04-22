// =====================
// NAVIGATION
// =====================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Navbar scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// =====================
// PROJECTS DATA
// =====================

const projectsData = [
    {
        name: 'BoasPraticas-DesignPatterns',
        description: 'Repositório com exemplos práticos de Design Patterns e boas práticas de desenvolvimento.',
        tech: 'Design Patterns',
        url: 'https://github.com/C4LD4R3LL1/BoasPraticas-DesignPatterns',
        stars: 1,
        icon: '🎨'
    },
    {
        name: 'BoasPaticas-SOLID',
        description: 'Implementação dos princípios SOLID com exemplos de código bem estruturado.',
        tech: 'SOLID',
        url: 'https://github.com/C4LD4R3LL1/BoasPaticas-SOLID',
        stars: 0,
        icon: '🏗️'
    },
    {
        name: 'Estoque-Web',
        description: 'Sistema web de gerenciamento de estoque com interface intuitiva e funcionalidades completas.',
        tech: 'HTML, CSS, JavaScript, Node.js',
        url: 'https://github.com/C4LD4R3LL1/Estoque-Web',
        stars: 0,
        icon: '📦'
    },
    {
        name: 'Cadastro-De-Jogadores',
        description: 'Aplicação Java para gerenciamento de jogadores e equipes esportivas com menu interativo.',
        tech: 'Java',
        url: 'https://github.com/C4LD4R3LL1/Cadastro-De-Jogadores',
        stars: 1,
        icon: '⚽'
    },
    {
        name: 'VCN-Trabalho',
        description: 'Projeto de Métodos Numéricos com implementação em Java para cálculos complexos.',
        tech: 'Java',
        url: 'https://github.com/C4LD4R3LL1/VCN-Trabalho',
        stars: 0,
        icon: '🔢'
    },
    {
        name: 'Sistema-de-Gerenciamento-de-Bibliotecas',
        description: 'Base sólida para sistema de gerenciamento de bibliotecas com controle eficiente de livros e autores.',
        tech: 'Database Design',
        url: 'https://github.com/C4LD4R3LL1/Sistema-de-Gerenciamento-de-Bibliotecas',
        stars: 0,
        icon: '📚'
    },
    {
        name: 'PortfolioMat',
        description: 'Portfolio responsivo com design moderno e interativo.',
        tech: 'HTML, CSS, JavaScript',
        url: 'https://github.com/C4LD4R3LL1/PortfolioMat',
        stars: 1,
        icon: '🎯'
    },
    {
        name: 'Atividade-Front',
        description: 'Projeto frontend com foco em experiência do usuário e design responsivo.',
        tech: 'PHP, Frontend',
        url: 'https://github.com/C4LD4R3LL1/Atividade-Front',
        stars: 0,
        icon: '🖥️'
    }
];

// =====================
// RENDER PROJECTS
// =====================

function renderProjects() {
    const projectsContainer = document.getElementById('projectsContainer');
    
    projectsData.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.style.setProperty('--index', index);
        
        const starsHTML = project.stars > 0 
            ? `<span class="project-stars"><i class="fas fa-star"></i> ${project.stars}</span>` 
            : '';
        
        projectCard.innerHTML = `
            <div class="project-header">
                <div class="project-icon">${project.icon}</div>
                <h3 class="project-title">${project.name}</h3>
                <p class="project-tech">${project.tech}</p>
            </div>
            <div class="project-body">
                <p class="project-description">${project.description}</p>
                <div class="project-footer">
                    ${starsHTML}
                    <a href="${project.url}" target="_blank" class="project-link">
                        Ver no GitHub <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
        
        projectsContainer.appendChild(projectCard);
    });
}

// =====================
// SCROLL ANIMATIONS
// =====================

function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe skill cards, project cards, and stat cards
    document.querySelectorAll('.skill-card, .project-card, .stat-card').forEach(el => {
        observer.observe(el);
    });
}

// =====================
// SMOOTH SCROLL OFFSET
// =====================

function smoothScroll(e) {
    const href = e.currentTarget.getAttribute('href');
    
    if (href.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(href);
        
        if (element) {
            const offsetTop = element.offsetTop - 80; // Navbar height
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', smoothScroll);
});

// =====================
// PARALLAX EFFECT
// =====================

function parallaxScroll() {
    const scrollTop = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrollTop * 0.5}px)`;
    }
}

window.addEventListener('scroll', parallaxScroll);

// =====================
// COUNTER ANIMATION
// =====================

function animateCounters() {
    const stats = document.querySelectorAll('.stat-card h3');
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const element = entry.target;
                const target = parseInt(element.textContent);
                const isPercentage = element.textContent.includes('%');
                
                animateValue(element, 0, target, isPercentage);
                element.dataset.animated = true;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
}

function animateValue(element, start, end, isPercentage = false) {
    const duration = 2000; // 2 segundos
    const startTime = Date.now();
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smoother animation
        const easeOutExpo = 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(start + (end - start) * easeOutExpo);
        
        element.textContent = current + (isPercentage ? '%' : '');
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// =====================
// INITIALIZATION
// =====================

document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    observeElements();
    animateCounters();
    
    // Add fade-in animation to section titles
    document.querySelectorAll('.section-title').forEach((title, index) => {
        title.style.animation = `fadeInUp 0.8s ease-out ${0.2 + index * 0.1}s both`;
    });
});

// =====================
// PERFORMANCE OPTIMIZATION
// =====================

// Debounce for scroll events
let scrollTimeout;
let isScrolling = false;

window.addEventListener('scroll', () => {
    if (!isScrolling) {
        isScrolling = true;
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 100);
    }
}, { passive: true });

// =====================
// KEYBOARD NAVIGATION
// =====================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// =====================
// FORM VALIDATION (if needed in future)
// =====================

// Add this if you implement a contact form
// const form = document.querySelector('.contact-form');
// if (form) {
//     form.addEventListener('submit', (e) => {
//         e.preventDefault();
//         // Validation logic here
//     });
// }
