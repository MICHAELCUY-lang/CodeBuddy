// Main JavaScript for CodeBuddy Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('nav');

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Course Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');

    if (filterButtons.length > 0 && courseCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');

                courseCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', function() {
                // Close all other FAQ items
                faqItems.forEach(faqItem => {
                    if (faqItem !== item) {
                        faqItem.classList.remove('active');
                    }
                });
                
                // Toggle current FAQ item
                item.classList.toggle('active');
            });
        });
    }

    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            if (name.value.trim() === '') {
                isValid = false;
                showError(name, 'Nama tidak boleh kosong');
            } else {
                removeError(name);
            }
            
            if (email.value.trim() === '') {
                isValid = false;
                showError(email, 'Email tidak boleh kosong');
            } else if (!isValidEmail(email.value)) {
                isValid = false;
                showError(email, 'Format email tidak valid');
            } else {
                removeError(email);
            }
            
            if (message.value.trim() === '') {
                isValid = false;
                showError(message, 'Pesan tidak boleh kosong');
            } else {
                removeError(message);
            }
            
            if (isValid) {
                // In a real application, you would send the form data to a server here
                alert('Pesan Anda telah terkirim! Terima kasih telah menghubungi kami.');
                contactForm.reset();
            }
        });
    }

    // Helper functions for form validation
    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
        
        if (!formGroup.querySelector('.error-message')) {
            errorElement.className = 'error-message';
            errorElement.style.color = 'var(--danger-color)';
            errorElement.style.fontSize = '0.9rem';
            errorElement.style.marginTop = '5px';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.style.borderColor = 'var(--danger-color)';
    }

    function removeError(input) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            formGroup.removeChild(errorElement);
        }
        
        input.style.borderColor = 'var(--border-color)';
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Progress Tracking with localStorage for individual users
    function initProgressTracking() {
        // Initialize user data if not exists
        if (!localStorage.getItem('userProgress')) {
            const initialProgress = {
                courses: {
                    'html-basics': { progress: 0, completedLessons: [], lastAccessed: null },
                    'css-basics': { progress: 0, completedLessons: [], lastAccessed: null },
                    'js-basics': { progress: 0, completedLessons: [], lastAccessed: null },
                    'js-dom': { progress: 0, completedLessons: [], lastAccessed: null },
                    'responsive-basics': { progress: 0, completedLessons: [], lastAccessed: null }
                },
                lastCourse: '',
                lastLesson: '',
                totalProgress: 0,
                achievements: [],
                startDate: new Date().toISOString()
            };
            localStorage.setItem('userProgress', JSON.stringify(initialProgress));
        }
        
        // Update continue learning section if on progress page
        updateContinueLearningSection();
        
        // Update progress statistics
        updateProgressStats();
    }
    
    function updateContinueLearningSection() {
        const continueSection = document.querySelector('.continue-learning');
        
        if (continueSection) {
            const userProgress = JSON.parse(localStorage.getItem('userProgress'));
            const lastCourse = userProgress.lastCourse;
            const lastLesson = userProgress.lastLesson;
            
            if (lastCourse && lastLesson) {
                const continueCard = continueSection.querySelector('.continue-card');
                if (continueCard) {
                    const courseTitle = continueCard.querySelector('h3');
                    const lessonInfo = continueCard.querySelector('p');
                    const continueLink = continueCard.querySelector('a');
                    const progressInfo = continueCard.querySelector('.progress-info') || document.createElement('div');
                    
                    if (!continueCard.querySelector('.progress-info')) {
                        progressInfo.className = 'progress-info';
                        progressInfo.style.marginTop = '10px';
                        progressInfo.style.fontSize = '0.9rem';
                        progressInfo.style.color = 'var(--text-light)';
                        continueCard.appendChild(progressInfo);
                    }
                    
                    const courseProgress = userProgress.courses[lastCourse];
                    courseTitle.textContent = getCourseTitle(lastCourse);
                    lessonInfo.textContent = `Pelajaran ${lastLesson}: ${getLessonTitle(lastCourse, lastLesson)}`;
                    progressInfo.textContent = `Progress: ${courseProgress.progress}% • ${courseProgress.completedLessons.length} pelajaran selesai`;
                    continueLink.href = `courses/${lastCourse}.html#lesson${lastLesson}`;
                }
            } else {
                // Show recommendation for new users
                const continueCard = continueSection.querySelector('.continue-card');
                if (continueCard) {
                    const courseTitle = continueCard.querySelector('h3');
                    const lessonInfo = continueCard.querySelector('p');
                    const continueLink = continueCard.querySelector('a');
                    
                    courseTitle.textContent = 'Mulai Belajar';
                    lessonInfo.textContent = 'Disarankan memulai dengan Dasar-dasar HTML';
                    continueLink.href = 'courses/html-basics.html';
                }
            }
        }
    }
    
    function updateProgressStats() {
        const userProgress = JSON.parse(localStorage.getItem('userProgress'));
        
        // Update overall progress
        const totalCourses = Object.keys(userProgress.courses).length;
        let totalProgress = 0;
        
        Object.values(userProgress.courses).forEach(course => {
            totalProgress += course.progress;
        });
        
        const overallProgress = Math.round(totalProgress / totalCourses);
        userProgress.totalProgress = overallProgress;
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
        
        // Update progress display elements
        const overallProgressElement = document.querySelector('.overall-progress');
        if (overallProgressElement) {
            overallProgressElement.textContent = `${overallProgress}%`;
        }
        
        // Update learning streak
        updateLearningStreak();
    }
    
    function updateLearningStreak() {
        const userProgress = JSON.parse(localStorage.getItem('userProgress'));
        const startDate = new Date(userProgress.startDate);
        const today = new Date();
        const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
        
        const streakElement = document.querySelector('.learning-streak');
        if (streakElement) {
            streakElement.textContent = `${daysDiff + 1} hari`;
        }
    }

    // Helper functions for progress tracking
    function getCourseTitle(courseSlug) {
        const courseTitles = {
            'html-basics': 'Dasar-dasar HTML',
            'css-basics': 'Dasar-dasar CSS',
            'js-basics': 'Dasar-dasar JavaScript',
            'js-dom': 'JavaScript DOM',
            'responsive-basics': 'Dasar-dasar Responsive Web'
        };
        
        return courseTitles[courseSlug] || 'Kursus';
    }

    function getLessonTitle(courseSlug, lessonNumber) {
        // This would typically come from a database
        const lessonTitles = {
            'html-basics': {
                '1': 'Pengenalan HTML',
                '2': 'Struktur Dasar HTML',
                '3': 'Elemen Teks HTML',
                '4': 'Link dan Gambar',
                '5': 'List dan Tabel'
            },
            'css-basics': {
                '1': 'Pengenalan CSS',
                '2': 'Selectors dan Properties',
                '3': 'Box Model',
                '4': 'Layout Dasar',
                '5': 'Styling Text dan Fonts'
            },
            'js-basics': {
                '1': 'Pengenalan JavaScript',
                '2': 'Variabel dan Tipe Data',
                '3': 'Operator dan Ekspresi',
                '4': 'Conditional Statements',
                '5': 'Loops',
                '6': 'Functions'
            },
            'js-dom': {
                '1': 'Pengenalan DOM',
                '2': 'Selecting Elements',
                '3': 'Memanipulasi Elemen HTML',
                '4': 'Event Handling',
                '5': 'DOM Traversal'
            }
        };
        
        return lessonTitles[courseSlug] && lessonTitles[courseSlug][lessonNumber] 
            ? lessonTitles[courseSlug][lessonNumber] 
            : 'Pelajaran';
    }

    // Initialize progress tracking
    initProgressTracking();

    // Update course progress bars
    const progressBars = document.querySelectorAll('.progress-bar .progress');
    
    if (progressBars.length > 0) {
        const userProgress = JSON.parse(localStorage.getItem('userProgress'));
        
        if (userProgress && userProgress.courses) {
            progressBars.forEach(bar => {
                const progressItem = bar.closest('.progress-item');
                if (progressItem) {
                    const courseTitle = progressItem.querySelector('h3').textContent;
                    const courseSlug = getCourseSlugFromTitle(courseTitle);
                    
                    if (courseSlug && userProgress.courses[courseSlug]) {
                        const courseData = userProgress.courses[courseSlug];
                        bar.style.width = `${courseData.progress}%`;
                        
                        // Update progress text if exists
                        const progressText = progressItem.querySelector('.progress-text');
                        if (progressText) {
                            progressText.textContent = `${courseData.progress}% • ${courseData.completedLessons.length} pelajaran selesai`;
                        }
                    }
                }
            });
        }
    }

    function getCourseSlugFromTitle(title) {
        const titleToSlug = {
            'Dasar-dasar HTML': 'html-basics',
            'Dasar-dasar CSS': 'css-basics',
            'Dasar-dasar JavaScript': 'js-basics',
            'JavaScript DOM': 'js-dom',
            'Dasar-dasar Responsive Web': 'responsive-basics'
        };
        
        return titleToSlug[title] || '';
    }
});