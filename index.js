document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for subtle fade-in
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.project-card, .about-contact, .section-title, .resume-wrapper');
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
        revealOnScroll.observe(el);
    });

    // Add revealed class style
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Modal Logic
    const modal = document.getElementById('videoModal');
    const modalContent = modal.querySelector('.modal-content');
    const closeBtn = modal.querySelector('.modal-close');
    const playerContainer = document.getElementById('player');
    let player;

    // Load YouTube Iframe API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
        // API is ready
    };

    function openModal(videoId) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling

        if (player) {
            player.loadVideoById(videoId);
        } else {
            player = new YT.Player('player', {
                height: '100%',
                width: '100%',
                videoId: videoId,
                playerVars: {
                    'autoplay': 1,
                    'modestbranding': 1,
                    'rel': 0
                }
            });
        }
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        if (player) {
            player.stopVideo();
        }
    }

    // Attach click events to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        const videoId = card.getAttribute('data-video-id');
        if (videoId) {
            card.addEventListener('click', (e) => {
                // Don't trigger modal if a link was clicked inside the card
                if (e.target.closest('.project-links')) return;
                openModal(videoId);
            });
        }
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
});
