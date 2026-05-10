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
const imageModalPrevBtn = document.getElementById('image-modal-prev');
const imageModalNextBtn = document.getElementById('image-modal-next');
const imageModalPreview = document.getElementById('image-modal-preview');
const imageModalCaption = document.getElementById('image-modal-caption');
let activeModalCarousel = null;
let activeModalImages = [];
let activeModalIndex = 0;

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

    activeModalCarousel = null;
    activeModalImages = [];
    activeModalIndex = 0;
    imageModal.style.display = 'none';
    imageModal.setAttribute('aria-hidden', 'true');
    imageModalPreview && imageModalPreview.setAttribute('src', '');
    imageModalPreview && imageModalPreview.setAttribute('alt', '');
    imageModalCaption && (imageModalCaption.textContent = '');
};

const renderImageModal = () => {
    const activeImage = activeModalImages[activeModalIndex];

    if (!imageModal || !imageModalPreview || !activeImage) {
        return;
    }

    imageModalPreview.src = activeImage.currentSrc || activeImage.src;
    imageModalPreview.alt = activeImage.alt;
    imageModalCaption && (imageModalCaption.textContent = activeImage.alt);
};

const stepImageModal = (direction) => {
    if (!activeModalImages.length || !activeModalCarousel) {
        return;
    }

    activeModalIndex = (activeModalIndex + direction + activeModalImages.length) % activeModalImages.length;
    const carouselImages = Array.from(activeModalCarousel.querySelectorAll('.carousel-image'));
    const carouselDots = Array.from(activeModalCarousel.querySelectorAll('[data-carousel-dot]'));

    carouselImages.forEach((image, imageIndex) => {
        image.classList.toggle('is-active', imageIndex === activeModalIndex);
    });
    carouselDots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === activeModalIndex);
    });

    renderImageModal();
};

if (imageModal && imageModalCloseBtn && imageModalPreview) {
    imageModalCloseBtn.addEventListener('click', closeImageModal);
    imageModalPrevBtn && imageModalPrevBtn.addEventListener('click', () => stepImageModal(-1));
    imageModalNextBtn && imageModalNextBtn.addEventListener('click', () => stepImageModal(1));
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
    if (imageModal && imageModal.style.display === 'flex' && e.key === 'ArrowLeft') {
        stepImageModal(-1);
    }
    if (imageModal && imageModal.style.display === 'flex' && e.key === 'ArrowRight') {
        stepImageModal(1);
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
    const track = carousel.querySelector('[data-carousel-track]');
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

    const openActiveImageModal = () => {
        const activeImage = images[currentIndex];

        if (!imageModal || !imageModalPreview || !activeImage) {
            return;
        }

        activeModalCarousel = carousel;
        activeModalImages = images;
        activeModalIndex = currentIndex;
        renderImageModal();
        imageModal.style.display = 'flex';
        imageModal.setAttribute('aria-hidden', 'false');
    };

    track && track.addEventListener('click', (e) => {
        if (e.target.closest('.carousel-control') || e.target.closest('.carousel-dot')) {
            return;
        }
        openActiveImageModal();
    });

    track && track.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openActiveImageModal();
        }
    });

    images.forEach((image) => {
        image.addEventListener('click', openActiveImageModal);
    });
});

if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
    const liveReload = new EventSource('/__reload');
    liveReload.onmessage = (event) => {
        if (event.data === 'reload') {
            window.location.reload();
        }
    };
}
