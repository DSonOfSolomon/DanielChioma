const yearEl = document.getElementById('year');
yearEl && (yearEl.textContent = new Date().getFullYear());

function handleSubmit(e){
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const status = document.getElementById('form-status');
    const email = 'dchioma01@qub.ac.uk';
    const subject = encodeURIComponent('Portfolio contact from ' + data.get('name'));
    const body = encodeURIComponent('Name: ' + data.get('name') + '\n\nMessage:\n' + data.get('message') + '\n\nEmail: ' + data.get('email'));
    const mailto = `mailto:${email}?subject=${subject}&body=${body}`;
    status && (status.textContent = 'Opening your email client...');
    window.location.href = mailto;
    setTimeout(()=>{ status && (status.textContent = 'If nothing opened, email me at ' + email) },1500);
}

document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
        const id = a.getAttribute('href');
        if(id.length>1){
            e.preventDefault();
            document.querySelector(id).scrollIntoView({behavior:'smooth',block:'start'});
        }

    });
});

const modal = document.getElementById('contact-modal');
const openModalBtn = document.getElementById('open-modal');
const closeModalBtn = document.getElementById('modal-close');

if (modal && openModalBtn && closeModalBtn) {
    const closeModal = () => {
        modal.style.display = 'none';
    };

    openModalBtn.addEventListener('click', ()=>{ modal.style.display = 'flex'; });
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
    window.addEventListener('keydown', (e)=>{
        if(e.key === 'Escape' && modal.style.display === 'flex'){
            closeModal();
        }
    });
}

document.querySelectorAll('.detail-card').forEach((card) => {
    if (card.getAttribute('href') === '#') {
        card.classList.add('placeholder-card');
        card.setAttribute('aria-disabled', 'true');
        card.addEventListener('click', (e) => {
            e.preventDefault();
        });
    } else {
        card.classList.remove('placeholder-card');
        card.removeAttribute('aria-disabled');
    }
});

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const images = Array.from(carousel.querySelectorAll('.carousel-image'));
    const dots = Array.from(carousel.querySelectorAll('[data-carousel-dot]'));
    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');
    let currentIndex = images.findIndex((image) => image.classList.contains('is-active'));
    let startX = 0;

    if (!images.length) {
        return;
    }

    if (currentIndex < 0) {
        currentIndex = 0;
    }

    const showSlide = (index) => {
        currentIndex = (index + images.length) % images.length;
        images.forEach((image, imageIndex) => {
            image.classList.toggle('is-active', imageIndex === currentIndex);
        });
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('is-active', dotIndex === currentIndex);
        });
    };

    prevBtn && prevBtn.addEventListener('click', () => {
        showSlide(currentIndex - 1);
    });

    nextBtn && nextBtn.addEventListener('click', () => {
        showSlide(currentIndex + 1);
    });

    dots.forEach((dot, dotIndex) => {
        dot.addEventListener('click', () => {
            showSlide(dotIndex);
        });
    });

    carousel.addEventListener('touchstart', (event) => {
        startX = event.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', (event) => {
        const endX = event.changedTouches[0].clientX;
        const deltaX = endX - startX;

        if (Math.abs(deltaX) < 30) {
            return;
        }

        if (deltaX < 0) {
            showSlide(currentIndex + 1);
        } else {
            showSlide(currentIndex - 1);
        }
    });
});
