/**
 * Wolfpack Provisions - Main JavaScript
 * Handles mobile navigation toggle functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    // Mobile menu functions
    const toggleMenu = (show) => {
        const isVisible = show !== undefined ? show : !navMenu.classList.contains('active');
        hamburger.classList.toggle('active', isVisible);
        navMenu.classList.toggle('active', isVisible);
        hamburger.setAttribute('aria-expanded', isVisible);
        document.body.style.overflow = isVisible ? 'hidden' : '';
    };

    // Toggle mobile menu
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when a nav link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            toggleMenu(false);
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu(false);
        }
    });

    // ============================================
    // Gallery Lightbox Functionality
    // ============================================
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightbox-content');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const galleryItems = document.querySelectorAll('.gallery-item');

    let currentIndex = 0;
    let galleryData = [];

    // Build gallery data from items
    galleryItems.forEach((item, index) => {
        galleryData.push({
            type: item.dataset.type,
            src: item.dataset.src
        });

        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        currentIndex = index;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateLightboxContent();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        // Stop any playing videos
        const video = lightboxContent.querySelector('video');
        if (video) {
            video.pause();
        }
        lightboxContent.innerHTML = '';
    }

    function updateLightboxContent() {
        const item = galleryData[currentIndex];
        lightboxContent.innerHTML = '';

        if (item.type === 'video') {
            const video = document.createElement('video');
            video.src = item.src;
            video.controls = true;
            video.autoplay = true;
            video.style.maxWidth = '100%';
            video.style.maxHeight = '85vh';
            lightboxContent.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = 'Gallery Image';
            lightboxContent.appendChild(img);
        }

        lightboxCounter.textContent = `${currentIndex + 1} / ${galleryData.length}`;
    }

    function navigateLightbox(direction) {
        // Stop current video if playing
        const video = lightboxContent.querySelector('video');
        if (video) {
            video.pause();
        }

        currentIndex += direction;
        if (currentIndex < 0) currentIndex = galleryData.length - 1;
        if (currentIndex >= galleryData.length) currentIndex = 0;
        updateLightboxContent();
    }

    // Event listeners
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => navigateLightbox(1));
    }

    // Close on backdrop click
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
            navigateLightbox(1);
        }
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (lightbox) {
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next
                navigateLightbox(1);
            } else {
                // Swipe right - prev
                navigateLightbox(-1);
            }
        }
    }
});
