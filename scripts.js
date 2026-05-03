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
const imageModal = document.getElementById('image-modal');
const imageModalCloseBtn = document.getElementById('image-modal-close');
const imageModalPreview = document.getElementById('image-modal-preview');
const imageModalCaption = document.getElementById('image-modal-caption');

if (modal && openModalBtn && closeModalBtn) {
    const closeModal = () => {
        modal.style.display = 'none';
    };

    openModalBtn.addEventListener('click', ()=>{ modal.style.display = 'flex'; });
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
}

const closeImageModal = () => {
    if (!imageModal) {
        return;
    }

    imageModal.style.display = 'none';
    imageModal.setAttribute('aria-hidden', 'true');
    imageModalPreview && imageModalPreview.setAttribute('src', '');
    imageModalPreview && imageModalPreview.setAttribute('alt', '');
    imageModalCaption && (imageModalCaption.textContent = '');
};

if (imageModal && imageModalCloseBtn && imageModalPreview) {
    imageModalCloseBtn.addEventListener('click', closeImageModal);
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            closeImageModal();
        }
    });
}

window.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') {
        modal && modal.style.display === 'flex' && (modal.style.display = 'none');
        imageModal && imageModal.style.display === 'flex' && closeImageModal();
    }
});

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

document.querySelectorAll('.carousel-image').forEach((image) => {
    const openImageModal = () => {
        if (!imageModal || !imageModalPreview || !image.classList.contains('is-active')) {
            return;
        }

        imageModalPreview.src = image.currentSrc || image.src;
        imageModalPreview.alt = image.alt;
        imageModalCaption && (imageModalCaption.textContent = image.alt);
        imageModal.style.display = 'flex';
        imageModal.setAttribute('aria-hidden', 'false');
    };

    image.addEventListener('click', openImageModal);
    image.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openImageModal();
        }
    });
});
