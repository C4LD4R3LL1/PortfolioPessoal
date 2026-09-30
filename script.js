const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canTransition = !!document.startViewTransition && !reduced;

// =====================
// TEMA (claro/escuro com transição circular)
// =====================

const themeBtn = document.getElementById('themeToggle');
const setIcon = () => themeBtn.querySelector('i').className = root.dataset.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
setIcon();

themeBtn.addEventListener('click', () => {
    const toggle = () => {
        root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch (e) {}
        setIcon();
    };
    if (!canTransition) return toggle();

    const r = themeBtn.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(toggle).ready.then(() => {
        root.animate(
            { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
            { duration: 550, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' }
        );
    });
});

// =====================
// PROJETOS
// =====================

const projectsData = [
    { name: 'Bot Lead', repo: 'bot-lead', icon: 'fa-robot', tags: 'dados', tech: ['Python', 'Automação'], stars: 0,
      description: 'Bot que busca leads de empresas que ainda não possuem site — prospecção automatizada.' },
    { name: 'Estoque Web', repo: 'Estoque-Web', icon: 'fa-boxes-stacked', tags: 'web', tech: ['Node.js', 'JavaScript', 'HTML/CSS'], stars: 0,
      description: 'Sistema web de gerenciamento de estoque com interface intuitiva e funcionalidades completas.' },
    { name: 'Design Patterns', repo: 'BoasPraticas-DesignPatterns', icon: 'fa-puzzle-piece', tags: 'praticas', tech: ['Design Patterns', 'OOP'], stars: 1,
      description: 'Exemplos práticos de Design Patterns e boas práticas de desenvolvimento.' },
    { name: 'SOLID na prática', repo: 'BoasPaticas-SOLID', icon: 'fa-cubes', tags: 'praticas', tech: ['SOLID', 'Clean Code'], stars: 0,
      description: 'Implementação dos princípios SOLID com exemplos de código bem estruturado.' },
    { name: 'Cadastro de Jogadores', repo: 'Cadastro-De-Jogadores', icon: 'fa-futbol', tags: 'java', tech: ['Java', 'CLI'], stars: 1,
      description: 'Gerenciamento de jogadores e equipes esportivas: contratações, demissões e listagens por posição.' },
    { name: 'Métodos Numéricos', repo: 'VCN-Trabalho', icon: 'fa-square-root-variable', tags: 'java', tech: ['Java', 'Cálculo Numérico'], stars: 0,
      description: 'Implementação em Java de métodos numéricos para resolução de cálculos complexos.' },
    { name: 'Gestão de Bibliotecas', repo: 'Sistema-de-Gerenciamento-de-Bibliotecas', icon: 'fa-book', tags: 'dados', tech: ['SQL', 'Modelagem'], stars: 0,
      description: 'Modelagem de banco de dados para controle eficiente de livros, autores e suas relações.' },
    { name: 'PortfolioMat', repo: 'PortfolioMat', icon: 'fa-palette', tags: 'web', tech: ['HTML', 'CSS', 'JavaScript'], stars: 1,
      description: 'Portfólio responsivo com design moderno e interativo.' }
];

const projectsContainer = document.getElementById('projectsContainer');
projectsContainer.innerHTML = projectsData.map((p, i) => `
    <article class="card project reveal" style="--i:${i % 2}" data-tags="${p.tags}" data-repo="${p.repo}">
        <div class="project-top">
            <i class="fas ${p.icon}"></i>
            <span class="stars" ${p.stars ? '' : 'hidden'}><i class="fas fa-star"></i><b>${p.stars}</b></span>
        </div>
        <h3><a href="https://github.com/C4LD4R3LL1/${p.repo}" target="_blank" rel="noopener">${p.name}<i class="fas fa-arrow-right"></i></a></h3>
        <p>${p.description}</p>
        <ul class="tech">${p.tech.map(t => `<li>${t}</li>`).join('')}</ul>
    </article>`).join('');

// Filtro com View Transitions (anima a reorganização do grid)
const filterBtns = document.querySelectorAll('[data-filter]');
filterBtns.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    const cards = [...projectsContainer.children];
    const apply = () => {
        filterBtns.forEach(b => b.setAttribute('aria-pressed', b === btn));
        cards.forEach(c => {
            c.classList.add('in');
            c.hidden = f !== 'all' && !c.dataset.tags.split(' ').includes(f);
        });
    };
    if (!canTransition) return apply();
    cards.forEach((c, i) => c.style.viewTransitionName = 'p' + i);
    document.startViewTransition(apply).finished.finally(() => cards.forEach(c => c.style.viewTransitionName = ''));
}));

// =====================
// REVELAR AO ROLAR + CONTADORES
// =====================

const countUp = (el) => {
    const t0 = performance.now();
    const step = (t) => {
        const p = Math.min((t - t0) / 1400, 1);
        el.textContent = Math.round(+el.dataset.count * (1 - (1 - p) ** 3));
        if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
};

const revealer = new IntersectionObserver((entries) => entries.forEach(({ isIntersecting, target }) => {
    if (!isIntersecting) return;
    target.classList.add('in');
    if (!reduced) target.querySelectorAll('[data-count]').forEach(countUp);
    revealer.unobserve(target);
}), { rootMargin: '0px 0px -8% 0px' });

// a coluna fixa não rola, então aparece direto
document.querySelectorAll('.reveal').forEach(el => el.closest('.side') ? el.classList.add('in') : revealer.observe(el));

// =====================
// NAVEGAÇÃO: seção ativa
// =====================

const navLinks = document.querySelectorAll('.nav a');
const sections = [...document.querySelectorAll('main section')];
const spy = () => {
    const atBottom = innerHeight + scrollY >= root.scrollHeight - 4;
    const current = atBottom ? sections.at(-1) : sections.findLast(s => s.getBoundingClientRect().top < innerHeight * 0.4) || sections[0];
    navLinks.forEach(a => a.hash === '#' + current.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
};
addEventListener('scroll', spy, { passive: true });
spy();

// =====================
// ABAS DE EXPERIÊNCIA
// =====================

const tabs = [...document.querySelectorAll('[role="tab"]')];
const indicator = document.querySelector('.tab-indicator');
const moveIndicator = (tab) => indicator.style.cssText =
    `--x:${tab.offsetLeft}px;--y:${tab.offsetTop}px;--w:${tab.offsetWidth}px;--h:${tab.offsetHeight}px`;

const selectTab = (tab) => {
    tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    moveIndicator(tab);
};

tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (e) => {
        const dir = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (!dir) return;
        e.preventDefault();
        const next = tabs[(i + dir + tabs.length) % tabs.length];
        next.focus();
        selectTab(next);
    });
});

const syncIndicator = () => moveIndicator(document.querySelector('[role="tab"][aria-selected="true"]'));
addEventListener('resize', syncIndicator);
document.fonts.ready.then(syncIndicator);
syncIndicator();

// =====================
// SPOTLIGHT (segue o mouse)
// =====================

const spotlight = document.querySelector('.spotlight');
addEventListener('pointermove', (e) => {
    spotlight.style.opacity = 1;
    spotlight.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    const card = e.target.closest?.('.card');
    if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--x', `${e.clientX - r.left}px`);
        card.style.setProperty('--y', `${e.clientY - r.top}px`);
    }
}, { passive: true });

// =====================
// COPIAR E-MAIL
// =====================

const toast = document.querySelector('.toast');
let toastTimer;
const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
};

const copyBtn = document.getElementById('copyEmail');
copyBtn.addEventListener('click', async () => {
    const email = copyBtn.dataset.email;
    try {
        await navigator.clipboard.writeText(email);
        showToast('E-mail copiado ✓');
    } catch (e) {
        location.href = 'mailto:' + email;
    }
});

// =====================
// DADOS AO VIVO DO GITHUB (fallback: valores estáticos acima)
// =====================

fetch('https://api.github.com/users/C4LD4R3LL1/repos?per_page=100')
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(repos => {
        const repoCount = document.getElementById('repoCount');
        repoCount.dataset.count = repoCount.textContent = repos.length;
        repos.forEach(({ name, stargazers_count }) => {
            const stars = document.querySelector(`[data-repo="${name}"] .stars`);
            if (!stars) return;
            stars.querySelector('b').textContent = stargazers_count;
            stars.hidden = !stargazers_count;
        });
    })
    .catch(() => {});
