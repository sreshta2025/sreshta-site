/* ================================================
   SRESHTA'S PORTFOLIO - INTERACTIVE FUNCTIONALITY
   Modern JavaScript with accessibility and performance
   ================================================ */

// ===== GLOBAL VARIABLES =====
let currentSection = 'home';
let isScrolling = false;
let scrollTimeout;

// ===== DOM ELEMENTS =====
const elements = {
    loadingScreen: document.getElementById('loadingScreen'),
    navbar: document.getElementById('navbar'),
    navMenu: document.getElementById('navMenu'),
    mobileToggle: document.getElementById('mobileToggle'),
    themeToggle: document.getElementById('themeToggle'),
    projectModal: document.getElementById('projectModal'),
    modalClose: document.getElementById('modalClose'),
    modalBody: document.getElementById('modalBody'),
    contactForm: document.getElementById('contactForm'),
    navLinks: document.querySelectorAll('.nav-link'),
    projectCards: document.querySelectorAll('.project-card'),
    sections: document.querySelectorAll('.section')
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize loading screen
    setTimeout(hideLoadingScreen, 1500);
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize theme toggle
    initializeThemeToggle();
    
    // Initialize project modals
    initializeProjectModals();
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize scroll effects
    initializeScrollEffects();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize interactive elements
    initializeInteractiveElements();
    
    // Initialize expandable interests
    initializeExpandableInterests();
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize interest filters
    initializeInterestFilters();
    
    console.log('🌸 Sreshta\'s Portfolio Initialized Successfully! ✨');
}

// ===== LOADING SCREEN =====
function hideLoadingScreen() {
    if (elements.loadingScreen) {
        elements.loadingScreen.classList.add('hidden');
        setTimeout(() => {
            elements.loadingScreen.style.display = 'none';
        }, 500);
    }
}

// ===== NAVIGATION SYSTEM =====
function initializeNavigation() {
    // Mobile menu toggle
    if (elements.mobileToggle) {
        elements.mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Navigation link clicks
    elements.navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Scroll spy for active navigation
    window.addEventListener('scroll', throttle(updateActiveNavigation, 16));
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!elements.navMenu.contains(e.target) && !elements.mobileToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    elements.navMenu.classList.toggle('active');
    elements.mobileToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = elements.navMenu.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    elements.navMenu.classList.remove('active');
    elements.mobileToggle.classList.remove('active');
    document.body.style.overflow = '';
}

function handleNavClick(e) {
    const targetSection = e.target.getAttribute('data-section');
    
    if (targetSection) {
        e.preventDefault();
        scrollToSection(targetSection);
        closeMobileMenu();
    }
    // If no data-section attribute, allow normal navigation to other pages
}

function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
        const headerHeight = elements.navbar.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Update active navigation immediately
        updateActiveNavigation();
    }
}

function updateActiveNavigation() {
    const scrollPosition = window.scrollY;
    const headerHeight = elements.navbar.offsetHeight;
    
    // Update navbar appearance
    if (scrollPosition > 50) {
        elements.navbar.classList.add('scrolled');
    } else {
        elements.navbar.classList.remove('scrolled');
    }
    
    // Find current section
    let current = '';
    elements.sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    // Update active nav link
    if (current && current !== currentSection) {
        currentSection = current;
        elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }
}

// ===== THEME TOGGLE =====
function initializeThemeToggle() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        enableDarkMode();
    }
    
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        }
    });
}

function toggleTheme() {
    if (document.body.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
    
    // Add visual feedback
    createThemeToggleEffect();
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    
    if (elements.themeToggle) {
        elements.themeToggle.querySelector('.theme-icon').textContent = '☀️';
    }
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    
    if (elements.themeToggle) {
        elements.themeToggle.querySelector('.theme-icon').textContent = '🌙';
    }
}

function createThemeToggleEffect() {
    const ripple = document.createElement('div');
    const rect = elements.themeToggle.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2 - size / 2}px;
        top: ${rect.top + rect.height / 2 - size / 2}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(158, 202, 214, 0.3) 0%, transparent 70%);
        transform: scale(0);
        animation: theme-ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 9999;
    `;
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ===== PROJECT MODALS =====
function initializeProjectModals() {
    elements.projectCards.forEach(card => {
        card.addEventListener('click', handleProjectClick);
    });
    
    if (elements.modalClose) {
        elements.modalClose.addEventListener('click', closeProjectModal);
    }
    
    if (elements.projectModal) {
        elements.projectModal.addEventListener('click', (e) => {
            if (e.target === elements.projectModal) {
                closeProjectModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.projectModal.classList.contains('active')) {
            closeProjectModal();
        }
    });
}

function handleProjectClick(e) {
    const projectId = e.currentTarget.getAttribute('data-project');
    if (projectId && !e.currentTarget.classList.contains('coming-soon')) {
        openProjectModal(projectId);
    }
}

function openProjectModal(projectId) {
    const projectData = getProjectData(projectId);
    if (projectData && elements.modalBody) {
        elements.modalBody.innerHTML = createProjectModalContent(projectData);
        elements.projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        elements.modalClose.focus();
    }
}

function closeProjectModal() {
    elements.projectModal.classList.remove('active');
    document.body.style.overflow = '';
}

function getProjectData(projectId) {
    const projects = {
        'beat-by-beat': {
            title: 'Beat by Beat',
            subtitle: 'Interactive Music Visualization',
            description: 'An innovative project that transforms music into visual art through code. Beat by Beat analyzes audio frequencies and creates dynamic, colorful visualizations that dance to the rhythm of any song.',
            features: [
                'Real-time audio frequency analysis',
                'Dynamic color schemes that respond to music',
                'Customizable visualization patterns',
                'Interactive controls for users',
                'Responsive design for all devices'
            ],
            technologies: ['JavaScript', 'Web Audio API', 'Canvas', 'CSS3', 'HTML5'],
            challenges: [
                'Learning complex audio processing concepts',
                'Optimizing performance for smooth animations',
                'Creating intuitive user interactions',
                'Ensuring cross-browser compatibility'
            ],
            outcomes: [
                'Successfully created my first interactive music app',
                'Learned advanced JavaScript and Web APIs',
                'Gained experience in creative coding',
                'Built something I genuinely love using'
            ],
            status: 'In Development',
            startDate: 'August 2024',
            image: '🎵'
        },
        'portfolio': {
            title: 'This Portfolio Website',
            subtitle: 'Personal Brand & Digital Presence',
            description: 'My personal portfolio website built from scratch to showcase my journey, projects, and personality. This site represents my growth as a developer and creative thinker.',
            features: [
                'Fully responsive design',
                'Dark mode toggle',
                'Interactive animations',
                'Accessibility-focused development',
                'Modern CSS Grid and Flexbox layouts'
            ],
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'Web Design', 'UX/UI'],
            challenges: [
                'Designing a cohesive visual identity',
                'Balancing personality with professionalism',
                'Creating smooth, performant animations',
                'Ensuring accessibility compliance'
            ],
            outcomes: [
                'Created my first professional portfolio',
                'Learned modern web development practices',
                'Developed my design sensibilities',
                'Built a platform to showcase future work'
            ],
            status: 'Live',
            startDate: 'July 2024',
            image: '🌸'
        },
        'color-palette': {
            title: 'Color Palette Generator',
            subtitle: 'Design Tool for Creatives',
            description: 'A web application that generates beautiful, harmonious color palettes for designers and artists. Born from my personal obsession with colors and their emotional impact.',
            features: [
                'Generate palettes from single colors',
                'Export in multiple formats',
                'Color harmony algorithms',
                'Accessibility contrast checking',
                'Save and share favorite palettes'
            ],
            technologies: ['JavaScript', 'Color Theory', 'CSS3', 'Local Storage', 'Canvas API'],
            challenges: [
                'Understanding color theory and harmony rules',
                'Implementing color space conversions',
                'Creating an intuitive user interface',
                'Ensuring color accessibility standards'
            ],
            outcomes: [
                'Deepened my understanding of color theory',
                'Created a tool I use in my own design work',
                'Learned about accessibility in design',
                'Built something useful for other creatives'
            ],
            status: 'Completed',
            startDate: 'September 2024',
            image: '🎨'
        },
        'learning-tracker': {
            title: 'Learning Progress Tracker',
            subtitle: 'Personal Development Dashboard',
            description: 'A personal dashboard application to track my learning goals, progress, and achievements throughout high school. Helps me stay organized and motivated in my educational journey.',
            features: [
                'Goal setting and tracking',
                'Progress visualization charts',
                'Achievement milestone system',
                'Subject-specific organization',
                'Study time logging'
            ],
            technologies: ['JavaScript', 'Chart.js', 'Local Storage', 'CSS Grid', 'Progressive Web App'],
            challenges: [
                'Designing an effective data structure',
                'Creating motivating progress visualizations',
                'Building sustainable tracking habits',
                'Making it work offline as a PWA'
            ],
            outcomes: [
                'Improved my personal organization skills',
                'Learned data visualization techniques',
                'Built a tool that keeps me accountable',
                'Gained experience with Progressive Web Apps'
            ],
            status: 'In Use',
            startDate: 'October 2024',
            image: '📚'
        }
    };
    
    return projects[projectId];
}

function createProjectModalContent(project) {
    return `
        <div class="project-modal-header">
            <div class="modal-project-icon">${project.image}</div>
            <div class="modal-project-info">
                <h2>${project.title}</h2>
                <p class="modal-project-subtitle">${project.subtitle}</p>
                <div class="modal-project-meta">
                    <span class="project-status">${project.status}</span>
                    <span class="project-date">Started ${project.startDate}</span>
                </div>
            </div>
        </div>
        
        <div class="modal-project-description">
            <p>${project.description}</p>
        </div>
        
        <div class="modal-section">
            <h3>✨ Key Features</h3>
            <ul class="feature-list">
                ${project.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
        
        <div class="modal-section">
            <h3>🛠️ Technologies Used</h3>
            <div class="tech-tags">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        </div>
        
        <div class="modal-section">
            <h3>🚀 Challenges & Learning</h3>
            <ul class="challenge-list">
                ${project.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
            </ul>
        </div>
        
        <div class="modal-section">
            <h3>🎯 Outcomes & Growth</h3>
            <ul class="outcome-list">
                ${project.outcomes.map(outcome => `<li>${outcome}</li>`).join('')}
            </ul>
        </div>
        
        <div class="modal-footer">
            <p><strong>What I learned:</strong> Every project teaches me something new about coding, design, and problem-solving. This project pushed me to explore new technologies and think creatively about user experience.</p>
        </div>
    `;
}

// ===== ENHANCED CONTACT FORM =====
function initializeContactForm() {
    if (elements.contactForm) {
        elements.contactForm.addEventListener('submit', handleContactSubmit);
        
        // Initialize enhanced form features
        initializeFormValidation();
        initializeFormProgress();
        initializeTopicInteraction();
        initializeContactAnimations();
    }
}

function initializeFormValidation() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectSelect = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const charCounter = document.getElementById('charCounter');
    
    if (nameInput) {
        nameInput.addEventListener('input', () => validateName(nameInput));
        nameInput.addEventListener('blur', () => validateName(nameInput));
    }
    
    if (emailInput) {
        emailInput.addEventListener('input', () => validateEmail(emailInput));
        emailInput.addEventListener('blur', () => validateEmail(emailInput));
    }
    
    if (subjectSelect) {
        subjectSelect.addEventListener('change', () => validateSubject(subjectSelect));
    }
    
    if (messageInput && charCounter) {
        messageInput.addEventListener('input', () => {
            validateMessage(messageInput);
            updateCharacterCounter(messageInput, charCounter);
        });
        messageInput.addEventListener('blur', () => validateMessage(messageInput));
    }
}

function validateName(input) {
    const validation = document.getElementById('nameValidation');
    const value = input.value.trim();
    
    if (value.length === 0) {
        showValidation(validation, '', 'neutral');
    } else if (value.length < 2) {
        showValidation(validation, 'Name should be at least 2 characters', 'invalid');
        return false;
    } else {
        showValidation(validation, `Great! Nice to meet you, ${value.split(' ')[0]}! 👋`, 'valid');
        return true;
    }
    return false;
}

function validateEmail(input) {
    const validation = document.getElementById('emailValidation');
    const value = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (value.length === 0) {
        showValidation(validation, '', 'neutral');
    } else if (!emailRegex.test(value)) {
        showValidation(validation, 'Please enter a valid email address', 'invalid');
        return false;
    } else {
        showValidation(validation, 'Perfect! I\'ll reply to this email ✉️', 'valid');
        return true;
    }
    return false;
}

function validateSubject(select) {
    const validation = document.getElementById('subjectValidation');
    const value = select.value;
    
    if (value === '') {
        showValidation(validation, '', 'neutral');
        return false;
    } else {
        const responses = {
            'collaboration': 'Awesome! I love collaborating on projects! 🤝',
            'question': 'Feel free to ask me anything! 🤔',
            'feedback': 'I really appreciate feedback! 💭',
            'project': 'Can\'t wait to see what you\'re working on! 🎨',
            'mentorship': 'I\'d love to learn from your experience! 🌟',
            'other': 'Just saying hi is always welcome! 👋'
        };
        showValidation(validation, responses[value] || 'Thanks for choosing a topic!', 'valid');
        return true;
    }
}

function validateMessage(input) {
    const validation = document.getElementById('messageValidation');
    const value = input.value.trim();
    
    if (value.length === 0) {
        showValidation(validation, '', 'neutral');
    } else if (value.length < 10) {
        showValidation(validation, 'Tell me a bit more! I\'d love to hear your thoughts', 'invalid');
        return false;
    } else if (value.length > 500) {
        showValidation(validation, 'Your message is getting quite long! Maybe split it into parts?', 'invalid');
        return false;
    } else {
        showValidation(validation, 'This looks great! I\'m excited to read it! 📖', 'valid');
        return true;
    }
    return false;
}

function showValidation(element, message, type) {
    if (!element) return;
    
    element.textContent = message;
    element.className = `input-validation ${type}`;
    
    if (message) {
        element.classList.add('show');
    } else {
        element.classList.remove('show');
    }
}

function updateCharacterCounter(input, counter) {
    const length = input.value.length;
    const maxLength = 500;
    counter.textContent = `${length}/${maxLength} characters`;
    
    if (length > maxLength * 0.9) {
        counter.style.color = '#ef4444';
    } else if (length > maxLength * 0.7) {
        counter.style.color = '#f59e0b';
    } else {
        counter.style.color = 'var(--text-secondary)';
    }
}

function initializeFormProgress() {
    const progressFill = document.getElementById('formProgress');
    const progressText = document.getElementById('progressText');
    const encouragement = document.getElementById('formEncouragement');
    
    if (!progressFill || !progressText) return;
    
    function updateProgress() {
        const nameValid = validateName(document.getElementById('name'));
        const emailValid = validateEmail(document.getElementById('email'));
        const subjectValid = validateSubject(document.getElementById('subject'));
        const messageValid = validateMessage(document.getElementById('message'));
        
        const validFields = [nameValid, emailValid, subjectValid, messageValid].filter(Boolean).length;
        const progress = (validFields / 4) * 100;
        
        progressFill.style.width = `${progress}%`;
        
        const messages = [
            "Let's get started! 🚀",
            "You're off to a great start! 🌟",
            "Halfway there! Keep going! 💪",
            "Almost done! Looking good! ✨",
            "Perfect! Ready to send! 🎉"
        ];
        
        progressText.textContent = messages[validFields] || messages[0];
        
        if (validFields === 4 && encouragement) {
            encouragement.classList.add('show');
        } else if (encouragement) {
            encouragement.classList.remove('show');
        }
    }
    
    // Add event listeners to all form inputs
    const inputs = elements.contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updateProgress);
        input.addEventListener('blur', updateProgress);
        input.addEventListener('change', updateProgress);
    });
}

function initializeTopicInteraction() {
    const topicTags = document.querySelectorAll('.clickable-tag');
    const topicResponse = document.getElementById('topicResponse');
    
    if (!topicResponse) return;
    
    const topicMessages = {
        'creative': {
            icon: '🎨',
            text: 'I absolutely love creative projects! From digital art to web design, creativity is at the heart of everything I do. There\'s nothing quite like bringing an idea to life through art and code!'
        },
        'coding': {
            icon: '💻',
            text: 'Coding is like magic to me! I love how a few lines of code can create amazing interactive experiences. Whether it\'s building websites, creating animations, or solving problems - programming never stops being exciting!'
        },
        'learning': {
            icon: '📚',
            text: 'High school has been such an adventure! I\'m always curious about new subjects and love connecting what I learn in class with my creative projects. Every day brings new discoveries!'
        },
        'music': {
            icon: '🎵',
            text: 'Music is the soundtrack to my creativity! I love discovering new artists and genres that inspire my work. My Beat by Beat project actually came from my fascination with how music and visuals can work together!'
        },
        'dreams': {
            icon: '🌟',
            text: 'I dream big! My goal is to use technology and creativity to make a positive impact on the world. Whether that\'s through innovative apps, beautiful designs, or inspiring others to pursue their passions!'
        },
        'collab': {
            icon: '🤝',
            text: 'Collaboration makes everything better! I love working with others because everyone brings unique perspectives and skills. Some of my best ideas have come from brainstorming with friends and fellow creators!'
        },
        'projects': {
            icon: '🎮',
            text: 'Fun projects are the best kind of learning! Whether it\'s a coding challenge, an art experiment, or just trying something completely new - I believe play and creativity go hand in hand!'
        },
        'inspiration': {
            icon: '💡',
            text: 'Inspiration is everywhere! From nature walks to browsing amazing websites, reading books to watching other creators - I\'m always looking for that spark that leads to the next big idea!'
        }
    };
    
    topicTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Remove active class from all tags
            topicTags.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tag
            tag.classList.add('active');
            
            // Get topic data
            const topic = tag.getAttribute('data-topic');
            const messageData = topicMessages[topic];
            
            if (messageData && topicResponse) {
                const responseContent = topicResponse.querySelector('.response-content');
                const responseIcon = responseContent.querySelector('.response-icon');
                const responseText = responseContent.querySelector('.response-text');
                
                // Update content
                responseIcon.textContent = messageData.icon;
                responseText.textContent = messageData.text;
                
                // Show response
                topicResponse.classList.add('show');
            }
        });
    });
}

function initializeContactAnimations() {
    // Initialize card hover effects
    const contactCards = document.querySelectorAll('.hover-lift');
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            createCardHoverEffect(card);
        });
    });
    
    // Initialize fun fact interaction
    const funFactCard = document.getElementById('funFactCard');
    if (funFactCard) {
        funFactCard.addEventListener('click', () => {
            createFactClickEffect(funFactCard);
        });
    }
    
    // Add input focus animations
    const formInputs = document.querySelectorAll('.animated-input input, .animated-input select, .animated-input textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            const icon = input.parentElement.querySelector('.bounce-icon');
            if (icon) {
                icon.style.animation = 'none';
                icon.offsetHeight; // Trigger reflow
                icon.style.animation = 'bounce-subtle 0.6s ease';
            }
        });
    });
}

function createCardHoverEffect(card) {
    // Create sparkle effect on hover
    const sparkles = ['✨', '🌟', '💫', '⭐'];
    const sparkle = document.createElement('div');
    sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    sparkle.style.cssText = `
        position: absolute;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        font-size: 1.2rem;
        pointer-events: none;
        z-index: 10;
        animation: sparkle-rise 1.5s ease-out forwards;
    `;
    
    card.style.position = 'relative';
    card.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1500);
}

function createFactClickEffect(card) {
    // Create burst of emojis
    const emojis = ['🌸', '✨', '💫', '🌺', '🌟', '💖'];
    
    for (let i = 0; i < 6; i++) {
        const emoji = document.createElement('div');
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        const angle = (Math.PI * 2 * i) / 6;
        const distance = 50 + Math.random() * 30;
        
        emoji.textContent = randomEmoji;
        emoji.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            font-size: 1.5rem;
            pointer-events: none;
            z-index: 100;
            animation: emoji-burst 1s ease-out forwards;
        `;
        
        emoji.style.setProperty('--angle', `${angle}rad`);
        emoji.style.setProperty('--distance', `${distance}px`);
        
        card.appendChild(emoji);
        setTimeout(() => emoji.remove(), 1000);
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(elements.contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Enhanced form submission feedback
    showEnhancedFormSubmission();
    
    // Reset form after delay
    setTimeout(() => {
        elements.contactForm.reset();
        resetFormProgress();
    }, 3000);
    
    console.log('Form submitted:', data);
}

function showEnhancedFormSubmission() {
    const button = elements.contactForm.querySelector('button[type="submit"]');
    const progressFill = document.getElementById('formProgress');
    const progressText = document.getElementById('progressText');
    const encouragement = document.getElementById('formEncouragement');
    
    // Animate button
    button.innerHTML = '<span>✨ Message Sent! ✨</span>';
    button.disabled = true;
    button.style.background = 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)';
    button.style.transform = 'scale(1.05)';
    
    // Animate progress bar to 100%
    if (progressFill && progressText) {
        progressFill.style.width = '100%';
        progressText.textContent = 'Message sent successfully! 🎉';
    }
    
    // Show success encouragement
    if (encouragement) {
        const responseContent = encouragement.querySelector('.encouragement-message');
        if (responseContent) {
            responseContent.innerHTML = '<span class="encouragement-icon">🎉</span><span class="encouragement-text">Thank you! I\'ll get back to you soon!</span>';
        }
        encouragement.classList.add('show');
    }
    
    // Create celebration effect
    createCelebrationEffect();
    
    setTimeout(() => {
        button.innerHTML = '<span class="btn-text">Send Message</span><span class="btn-arrow">→</span><div class="btn-particles"></div><div class="btn-loading"><div class="loading-dots"><span></span><span></span><span></span></div></div>';
        button.disabled = false;
        button.style.background = '';
        button.style.transform = '';
    }, 3000);
}

function resetFormProgress() {
    const progressFill = document.getElementById('formProgress');
    const progressText = document.getElementById('progressText');
    const encouragement = document.getElementById('formEncouragement');
    
    if (progressFill) progressFill.style.width = '0%';
    if (progressText) progressText.textContent = "Let's get started! 🚀";
    if (encouragement) {
        encouragement.classList.remove('show');
        const responseContent = encouragement.querySelector('.encouragement-message');
        if (responseContent) {
            responseContent.innerHTML = '<span class="encouragement-icon">🌟</span><span class="encouragement-text">I can\'t wait to hear from you!</span>';
        }
    }
    
    // Clear all validation messages
    document.querySelectorAll('.input-validation').forEach(validation => {
        validation.classList.remove('show');
        validation.textContent = '';
    });
}

function createCelebrationEffect() {
    const celebrationEmojis = ['🎉', '🎊', '✨', '🌟', '💫', '🎈'];
    
    for (let i = 0; i < 12; i++) {
        const emoji = document.createElement('div');
        emoji.textContent = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
        emoji.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            font-size: 2rem;
            pointer-events: none;
            z-index: 9999;
            animation: celebration-burst 2s ease-out forwards;
        `;
        
        const angle = (Math.PI * 2 * i) / 12;
        const distance = 100 + Math.random() * 100;
        emoji.style.setProperty('--celebration-angle', `${angle}rad`);
        emoji.style.setProperty('--celebration-distance', `${distance}px`);
        
        document.body.appendChild(emoji);
        setTimeout(() => emoji.remove(), 2000);
    }
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const headerHeight = elements.navbar.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Parallax effect for floating elements
    window.addEventListener('scroll', throttle(updateParallaxElements, 16));
}

function updateParallaxElements() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-element');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '-50px 0px'
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.about-card, .project-card, .interest-category, .timeline-item, .contact-card').forEach(el => {
        observer.observe(el);
    });
}

function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}

// ===== INTERACTIVE ELEMENTS =====
function initializeInteractiveElements() {
    // Profile picture click effect
    const profilePlaceholder = document.querySelector('.profile-placeholder');
    if (profilePlaceholder) {
        profilePlaceholder.addEventListener('click', createProfileClickEffect);
    }
    
    // Interest item hover effects
    document.querySelectorAll('.interest-item').forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            createSparkleEffect(e.target);
        });
    });
    
    // Add hover effects to cards
    document.querySelectorAll('.about-card, .project-card, .contact-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

function createProfileClickEffect(e) {
    const rect = e.target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create multiple particles
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        const angle = (Math.PI * 2 * i) / 8;
        const distance = 100 + Math.random() * 50;
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        particle.innerHTML = ['🌸', '✨', '🌺', '💫'][Math.floor(Math.random() * 4)];
        particle.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            font-size: 1.5rem;
            pointer-events: none;
            z-index: 9999;
            animation: particle-explosion 1s ease-out forwards;
        `;
        
        particle.style.setProperty('--end-x', endX + 'px');
        particle.style.setProperty('--end-y', endY + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

function createSparkleEffect(element) {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.cssText = `
        position: absolute;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        font-size: 1rem;
        pointer-events: none;
        animation: sparkle-fade 1s ease-out forwards;
        z-index: 10;
    `;
    
    element.style.position = 'relative';
    element.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
}

// ===== UTILITY FUNCTIONS =====
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // Navigate sections with arrow keys
    if (e.altKey) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            navigateToNextSection();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            navigateToPreviousSection();
        }
    }
});

function navigateToNextSection() {
    const sections = ['home', 'about', 'projects', 'interests', 'journey', 'contact'];
    const currentIndex = sections.indexOf(currentSection);
    const nextIndex = (currentIndex + 1) % sections.length;
    scrollToSection(sections[nextIndex]);
}

function navigateToPreviousSection() {
    const sections = ['home', 'about', 'projects', 'interests', 'journey', 'contact'];
    const currentIndex = sections.indexOf(currentSection);
    const prevIndex = currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
    scrollToSection(sections[prevIndex]);
}

// ===== PERFORMANCE OPTIMIZATION =====
// Preload critical images
function preloadImages() {
    const imageUrls = [
        // Add any critical images here
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // Could send error reports to analytics service
});

// ===== DYNAMIC CSS ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes theme-ripple {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(4); opacity: 0; }
    }
    
    @keyframes particle-explosion {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(calc(var(--end-x) - 50%), calc(var(--end-y) - 50%)) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes sparkle-fade {
        0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// ===== CLEAN ABOUT PAGE INTERACTIONS =====
function initializeCleanAbout() {
    // Initialize smooth scrolling for buttons
    initializeAboutScrolling();
    
    // Initialize card hover effects
    initializeAboutCards();
}

function initializeAboutScrolling() {
    const buttons = document.querySelectorAll('a[href^="#"], .btn[href*=".html"]');
    
    buttons.forEach(button => {
        if (button.getAttribute('href').startsWith('#')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = button.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    });
}

function initializeAboutCards() {
    // Profile card interactions
    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
        profileCard.addEventListener('mouseenter', () => {
            profileCard.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        profileCard.addEventListener('mouseleave', () => {
            profileCard.style.transform = 'translateY(0) scale(1)';
        });
    }
    
    // Skill item interactions
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-8px)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
        });
    });
    
    // Fact item interactions
    const factItems = document.querySelectorAll('.fact-item');
    factItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize clean about page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure elements are rendered
    setTimeout(initializeCleanAbout, 200);
});

// ===== EXPANDABLE INTERESTS =====
function initializeExpandableInterests() {
    const expandableItems = document.querySelectorAll('.expandable');
    
    expandableItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't expand if clicking on a link or button
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
            
            this.classList.toggle('expanded');
            
            // Add subtle vibration effect on mobile devices
            if (navigator.vibrate && window.DeviceMotionEvent) {
                navigator.vibrate(50);
            }
            
            // Update ARIA attributes for accessibility
            const expandedContent = this.querySelector('.expanded-content');
            const isExpanded = this.classList.contains('expanded');
            
            this.setAttribute('aria-expanded', isExpanded);
            expandedContent.setAttribute('aria-hidden', !isExpanded);
            
            // Smooth scroll to keep item in view if needed
            if (isExpanded) {
                setTimeout(() => {
                    const rect = this.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;
                    
                    if (rect.bottom > viewportHeight) {
                        this.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest' 
                        });
                    }
                }, 400); // Wait for expansion animation
            }
        });
        
        // Initialize ARIA attributes
        item.setAttribute('aria-expanded', 'false');
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        
        const expandedContent = item.querySelector('.expanded-content');
        if (expandedContent) {
            expandedContent.setAttribute('aria-hidden', 'true');
        }
        
        // Add keyboard support
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe interest categories
    document.querySelectorAll('.interest-category').forEach(category => {
        observer.observe(category);
    });

    // Observe fascination cards
    document.querySelectorAll('.fascination-card').forEach(card => {
        observer.observe(card);
    });

    // Add subtle parallax effect to floating elements on scroll
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const parallaxElements = document.querySelectorAll('.floating-element');
                
                parallaxElements.forEach((element, index) => {
                    const rate = scrolled * -0.5 * (index + 1) * 0.1;
                    element.style.transform = `translateY(${rate}px)`;
                });
                
                // Subtle hero card parallax
                const heroCard = document.querySelector('.interests-hero-card');
                if (heroCard) {
                    const rate = scrolled * -0.2;
                    heroCard.style.transform = `translateY(${rate}px)`;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ===== INTEREST FILTERS =====
function initializeInterestFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const interestCategories = document.querySelectorAll('.interest-category');
    
    if (!filterButtons.length) return; // Exit if not on interests page
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter categories with smooth animation
            interestCategories.forEach((category, index) => {
                const categoryType = category.classList.contains('creative-arts') ? 'creative-arts' :
                                  category.classList.contains('technology') ? 'technology' :
                                  category.classList.contains('academic') ? 'academic' :
                                  category.classList.contains('lifestyle') ? 'lifestyle' : '';
                
                if (filter === 'all' || filter === categoryType) {
                    category.style.display = 'block';
                    setTimeout(() => {
                        category.style.opacity = '1';
                        category.style.transform = 'translateY(0) scale(1)';
                    }, index * 100);
                } else {
                    category.style.opacity = '0';
                    category.style.transform = 'translateY(-20px) scale(0.95)';
                    setTimeout(() => {
                        if (category.style.opacity === '0') {
                            category.style.display = 'none';
                        }
                    }, 300);
                }
            });
            
            // Add subtle feedback
            if (navigator.vibrate) {
                navigator.vibrate(25);
            }
            
            // Smooth scroll to interests grid if needed
            const interestsGrid = document.querySelector('.interests-grid');
            if (interestsGrid) {
                setTimeout(() => {
                    interestsGrid.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }, 400);
            }
        });
        
        // Add keyboard support
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
}

// ===== GLOBAL FUNCTIONS (for HTML onclick handlers) =====
window.scrollToSection = scrollToSection;

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}