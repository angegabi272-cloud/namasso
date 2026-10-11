document.addEventListener('DOMContentLoaded', function () {

    /* ============================================================
       1. PRÉLOADER
       ============================================================ */
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => { preloader.style.display = 'none'; }, 700);
        }, 2000);
    });

    /* ============================================================
       2. AOS
       ============================================================ */
    AOS.init({
        duration: 800,
        once: true,
        offset: 60,
        easing: 'ease-out-cubic',
    });

    /* ============================================================
       3. BARRE DE PROGRESSION + RETOUR EN HAUT
       ============================================================ */
    const scrollProgress = document.getElementById('scrollProgress');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const h = document.documentElement;
        const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
        if (scrollProgress) scrollProgress.style.width = scrolled + '%';
        if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
    });

    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ============================================================
       4. ANIMATION TEXTE : Split-letter sur le slogan
       ============================================================ */
    document.querySelectorAll('.split-text').forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = (i * 0.02 + 0.4) + 's';
            el.appendChild(span);
        });
    });

    /* ============================================================
       5. EFFET 3D SUR LE LOGO MULTICOLORE
       ============================================================ */
    const heroLogo = document.querySelector('.multicolor-logo');
    if (heroLogo) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 8;
            const y = (e.clientY / window.innerHeight - 0.5) * 8;
            heroLogo.style.transform = `perspective(900px) rotateX(${-y}deg) rotateY(${x}deg)`;
        });
    }

    /* ============================================================
       6. EFFET DE LUEUR AU CURSEUR (cartes)
       ============================================================ */
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.setProperty('--x', x + '%');
                glow.style.setProperty('--y', y + '%');
            }
        });
    });

    /* ============================================================
       7. TILT 3D sur les cartes ateliers
       ============================================================ */
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform =
                `perspective(1000px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-8px) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });

    /* ============================================================
       8. MAGNÉTISME des boutons et canaux de contact
       ============================================================ */
    document.querySelectorAll('.btn, .channel-card').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px) scale(1.04)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    /* ============================================================
       9. NAVIGATION ACTIVE
       ============================================================ */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active',
                        link.getAttribute('href') === '#' + entry.target.id);
                });
            }
        });
    }, { rootMargin: '-40% 0px -60% 0px' });

    sections.forEach(s => observer.observe(s));

    /* ============================================================
       10. FORMULAIRE CONTACT
       ============================================================ */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                showToast('Merci de remplir tous les champs.', 'error');
                return;
            }

            showToast('Votre message est prêt — ouverture du client mail…', 'success');
            const subject = encodeURIComponent("Demande d'information — NAMAASSO");
            const body = encodeURIComponent(`Nom : ${name}\nEmail : ${email}\n\nMessage :\n${message}`);

            setTimeout(() => {
                window.location.href = `mailto:contact@namaasso.org?subject=${subject}&body=${body}`;
                contactForm.reset();
            }, 1000);
        });
    }

    /* ============================================================
       11. TOAST
       ============================================================ */
    function showToast(text, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.textContent = text;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('toast-visible'));

        setTimeout(() => {
            toast.classList.remove('toast-visible');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    /* ============================================================
       12. MORPHOSE SVG — initialisation des paths
       ============================================================ */
    const blobs = document.querySelectorAll('.blob');
    const initialPaths = [
        "M 200,180 C 320,140 420,240 400,340 C 380,440 260,480 180,440 C 100,400 80,220 200,180 Z",
        "M 600,400 C 700,380 780,460 760,560 C 740,660 640,700 560,660 C 480,620 480,440 600,400 Z",
        "M 350,650 C 470,620 560,700 540,790 C 520,880 400,900 320,860 C 240,820 220,680 350,650 Z"
    ];
    blobs.forEach((b, i) => {
        if (!b.getAttribute('d')) b.setAttribute('d', initialPaths[i]);
    });

});