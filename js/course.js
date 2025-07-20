// JavaScript for Course Pages

document.addEventListener('DOMContentLoaded', function() {
    // Lesson Navigation
    const lessonLinks = document.querySelectorAll('.lesson-sidebar a');
    const lessonContents = document.querySelectorAll('.lesson-content');
    
    if (lessonLinks.length > 0 && lessonContents.length > 0) {
        // Check if there's a hash in the URL
        const hash = window.location.hash;
        if (hash) {
            // Show the lesson content that matches the hash
            const targetLesson = document.querySelector(hash);
            if (targetLesson) {
                // Hide all lesson contents
                lessonContents.forEach(content => {
                    content.style.display = 'none';
                });
                
                // Show the target lesson
                targetLesson.style.display = 'block';
                
                // Update active class on sidebar links
                lessonLinks.forEach(link => {
                    if (link.getAttribute('href') === hash) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
                
                // Update progress tracking
                updateProgress();
            }
        } else {
            // Show the first lesson by default
            lessonContents[0].style.display = 'block';
            lessonLinks[0].classList.add('active');
        }
        
        // Add click event listeners to lesson links
        lessonLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Get the target lesson ID from the href attribute
                const targetId = this.getAttribute('href');
                
                // Hide all lesson contents
                lessonContents.forEach(content => {
                    content.style.display = 'none';
                });
                
                // Show the target lesson
                document.querySelector(targetId).style.display = 'block';
                
                // Update active class on sidebar links
                lessonLinks.forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Update progress tracking
                updateProgress();
            });
        });
    }
    
    // Quiz Functionality
    const quizForms = document.querySelectorAll('.quiz-form');
    
    if (quizForms.length > 0) {
        quizForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const quizId = this.getAttribute('id');
                const quizContainer = this.closest('.quiz-container');
                const resultContainer = quizContainer.querySelector('.quiz-result');
                const questions = this.querySelectorAll('.quiz-question');
                let score = 0;
                let totalQuestions = questions.length;
                
                // Check each question
                questions.forEach(question => {
                    const selectedOption = question.querySelector('input[type="radio"]:checked');
                    const correctOption = question.querySelector('input[data-correct="true"]');
                    
                    if (selectedOption) {
                        // Mark the selected option
                        const selectedLabel = question.querySelector(`label[for="${selectedOption.id}"]`);
                        
                        if (selectedOption.getAttribute('data-correct') === 'true') {
                            // Correct answer
                            score++;
                            selectedLabel.classList.add('correct');
                        } else {
                            // Wrong answer
                            selectedLabel.classList.add('incorrect');
                            
                            // Show the correct answer
                            const correctLabel = question.querySelector(`label[for="${correctOption.id}"]`);
                            correctLabel.classList.add('correct');
                        }
                    } else {
                        // No option selected
                        const correctLabel = question.querySelector(`label[for="${correctOption.id}"]`);
                        correctLabel.classList.add('correct');
                    }
                    
                    // Disable all inputs for this question
                    question.querySelectorAll('input[type="radio"]').forEach(input => {
                        input.disabled = true;
                    });
                });
                
                // Calculate percentage score
                const percentage = Math.round((score / totalQuestions) * 100);
                
                // Display the result
                resultContainer.innerHTML = `
                    <div class="result-message ${percentage >= 70 ? 'success' : 'error'}">
                        <h3>${percentage >= 70 ? 'Selamat!' : 'Coba Lagi!'}</h3>
                        <p>Skor Anda: ${score}/${totalQuestions} (${percentage}%)</p>
                        <p>${percentage >= 70 ? 'Anda telah menguasai materi ini.' : 'Anda perlu mengulang materi ini.'}</p>
                    </div>
                `;
                resultContainer.style.display = 'block';
                
                // Disable the submit button
                this.querySelector('button[type="submit"]').disabled = true;
                
                // Add a retry button if score is less than 70%
                if (percentage < 70) {
                    const retryButton = document.createElement('button');
                    retryButton.textContent = 'Coba Lagi';
                    retryButton.className = 'btn btn-primary';
                    retryButton.addEventListener('click', function() {
                        // Reset the quiz
                        resetQuiz(form);
                    });
                    resultContainer.querySelector('.result-message').appendChild(retryButton);
                } else {
                    // Update progress if passed
                    const courseSlug = getCourseSlug();
                    const lessonNumber = getLessonNumber();
                    
                    if (courseSlug && lessonNumber) {
                        markLessonComplete(courseSlug, lessonNumber);
                    }
                    
                    // Add a continue button
                    const continueButton = document.createElement('button');
                    continueButton.textContent = 'Lanjutkan ke Pelajaran Berikutnya';
                    continueButton.className = 'btn btn-primary';
                    continueButton.addEventListener('click', function() {
                        // Go to the next lesson
                        goToNextLesson();
                    });
                    resultContainer.querySelector('.result-message').appendChild(continueButton);
                }
            });
        });
    }
    
    // Helper function to reset a quiz
    function resetQuiz(form) {
        // Clear all selected options
        form.querySelectorAll('input[type="radio"]').forEach(input => {
            input.checked = false;
            input.disabled = false;
        });
        
        // Remove correct/incorrect classes
        form.querySelectorAll('label').forEach(label => {
            label.classList.remove('correct', 'incorrect');
        });
        
        // Hide the result container
        const quizContainer = form.closest('.quiz-container');
        const resultContainer = quizContainer.querySelector('.quiz-result');
        resultContainer.style.display = 'none';
        resultContainer.innerHTML = '';
        
        // Enable the submit button
        form.querySelector('button[type="submit"]').disabled = false;
    }
    
    // Helper function to get the current course slug
    function getCourseSlug() {
        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1);
        return filename.replace('.html', '');
    }
    
    // Helper function to get the current lesson number
    function getLessonNumber() {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#lesson')) {
            return hash.replace('#lesson', '');
        }
        return '1'; // Default to lesson 1
    }
    
    // Helper function to mark a lesson as complete
    function markLessonComplete(courseSlug, lessonNumber) {
        // Get the current user progress
        let userProgress = JSON.parse(localStorage.getItem('userProgress'));
        
        if (!userProgress) {
            // Initialize if not exists
            userProgress = {
                courses: {},
                lastCourse: '',
                lastLesson: '',
                totalProgress: 0,
                achievements: [],
                startDate: new Date().toISOString()
            };
        }
        
        // Initialize course data if not exists
        if (!userProgress.courses[courseSlug]) {
            userProgress.courses[courseSlug] = {
                progress: 0,
                completedLessons: [],
                lastAccessed: null
            };
        }
        
        const courseData = userProgress.courses[courseSlug];
        
        // Add lesson to completed lessons if not already completed
        if (!courseData.completedLessons.includes(lessonNumber)) {
            courseData.completedLessons.push(lessonNumber);
        }
        
        // Calculate the new progress percentage
        const totalLessons = document.querySelectorAll('.lesson-sidebar a').length;
        const completedLessonsCount = courseData.completedLessons.length;
        const progressPercentage = Math.round((completedLessonsCount / totalLessons) * 100);
        
        // Update the progress
        courseData.progress = progressPercentage;
        courseData.lastAccessed = new Date().toISOString();
        
        // Update the last accessed course and lesson
        userProgress.lastCourse = courseSlug;
        userProgress.lastLesson = lessonNumber;
        
        // Save to localStorage
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
        
        // Check for achievements
        checkAchievements(userProgress, courseSlug, progressPercentage);
    }
    
    // Helper function to check and award achievements
    function checkAchievements(userProgress, courseSlug, progressPercentage) {
        const achievements = userProgress.achievements || [];
        
        // First lesson completed
        if (!achievements.includes('first_lesson') && Object.values(userProgress.courses).some(course => course.completedLessons.length > 0)) {
            achievements.push('first_lesson');
            showAchievementNotification('Pelajaran Pertama!', 'Anda telah menyelesaikan pelajaran pertama Anda!');
        }
        
        // First course completed
        if (!achievements.includes('first_course') && progressPercentage === 100) {
            achievements.push('first_course');
            showAchievementNotification('Kursus Pertama!', `Selamat! Anda telah menyelesaikan ${getCourseTitle(courseSlug)}!`);
        }
        
        // Streak achievements
        const completedCourses = Object.values(userProgress.courses).filter(course => course.progress === 100).length;
        if (!achievements.includes('three_courses') && completedCourses >= 3) {
            achievements.push('three_courses');
            showAchievementNotification('Pembelajar Gigih!', 'Anda telah menyelesaikan 3 kursus!');
        }
        
        userProgress.achievements = achievements;
    }
    
    // Helper function to show achievement notification
    function showAchievementNotification(title, message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">🏆</div>
                <div class="achievement-text">
                    <h4>${title}</h4>
                    <p>${message}</p>
                </div>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4A6CF7, #6FCF97);
            color: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 1000;
            max-width: 300px;
            animation: slideIn 0.5s ease-out;
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .achievement-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .achievement-icon {
                font-size: 24px;
            }
            .achievement-text h4 {
                margin: 0 0 5px 0;
                font-size: 16px;
            }
            .achievement-text p {
                margin: 0;
                font-size: 14px;
                opacity: 0.9;
            }
        `;
        document.head.appendChild(style);
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.5s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 5000);
    }
    
    // Helper function to go to the next lesson
    function goToNextLesson() {
        const currentLessonLink = document.querySelector('.lesson-sidebar a.active');
        const nextLessonLink = currentLessonLink.parentElement.nextElementSibling?.querySelector('a');
        
        if (nextLessonLink) {
            nextLessonLink.click();
        } else {
            // No more lessons, go back to courses page
            window.location.href = '/courses.html';
        }
    }
    
    // Function to navigate to previous lesson
    function prevLesson() {
        const currentLessonId = getLessonNumber();
        const prevLessonId = parseInt(currentLessonId) - 1;
        
        if (prevLessonId >= 1) {
            // Navigate to the previous lesson
            window.location.hash = `#lesson${prevLessonId}`;
            
            // Update display
            const lessonContents = document.querySelectorAll('.lesson-content');
            lessonContents.forEach(content => {
                content.style.display = 'none';
            });
            
            const targetLesson = document.querySelector(`#lesson${prevLessonId}`);
            if (targetLesson) {
                targetLesson.style.display = 'block';
            }
            
            // Update active class on sidebar links
            const lessonLinks = document.querySelectorAll('.lesson-sidebar a');
            lessonLinks.forEach(link => {
                if (link.getAttribute('href') === `#lesson${prevLessonId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            
            // Scroll to top of lesson
            targetLesson.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Function to navigate to next lesson
    function nextLesson() {
        const currentLessonId = getLessonNumber();
        const nextLessonId = parseInt(currentLessonId) + 1;
        const totalLessons = document.querySelectorAll('.lesson-content').length;
        
        if (nextLessonId <= totalLessons) {
            // Navigate to the next lesson
            window.location.hash = `#lesson${nextLessonId}`;
            
            // Update display
            const lessonContents = document.querySelectorAll('.lesson-content');
            lessonContents.forEach(content => {
                content.style.display = 'none';
            });
            
            const targetLesson = document.querySelector(`#lesson${nextLessonId}`);
            if (targetLesson) {
                targetLesson.style.display = 'block';
            }
            
            // Update active class on sidebar links
            const lessonLinks = document.querySelectorAll('.lesson-sidebar a');
            lessonLinks.forEach(link => {
                if (link.getAttribute('href') === `#lesson${nextLessonId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            
            // Scroll to top of lesson
            targetLesson.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // No more lessons, show completion message or redirect
            alert('Selamat! Anda telah menyelesaikan semua pelajaran dalam kursus ini.');
            // Optionally redirect to courses page
            // window.location.href = '/courses.html';
        }
    }
    
    // Helper function to update progress when navigating between lessons
    function updateProgress() {
        const courseSlug = getCourseSlug();
        const lessonNumber = getLessonNumber();
        
        if (courseSlug && lessonNumber) {
            // Get current user progress
            let userProgress = JSON.parse(localStorage.getItem('userProgress'));
            
            if (!userProgress) {
                // Initialize if not exists
                userProgress = {
                    courses: {},
                    lastCourse: '',
                    lastLesson: '',
                    totalProgress: 0,
                    achievements: [],
                    startDate: new Date().toISOString()
                };
            }
            
            // Initialize course data if not exists
            if (!userProgress.courses[courseSlug]) {
                userProgress.courses[courseSlug] = {
                    progress: 0,
                    completedLessons: [],
                    lastAccessed: null
                };
            }
            
            // Update the last accessed course and lesson
            userProgress.lastCourse = courseSlug;
            userProgress.lastLesson = lessonNumber;
            userProgress.courses[courseSlug].lastAccessed = new Date().toISOString();
            
            // Save to localStorage
            localStorage.setItem('userProgress', JSON.stringify(userProgress));
        }
    }
    
    // Code Snippet Copy Functionality
    const codeBlocks = document.querySelectorAll('.code-example');
    
    if (codeBlocks.length > 0) {
        codeBlocks.forEach(block => {
            // Create copy button
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-btn';
            copyButton.innerHTML = '<i class="fas fa-copy"></i>';
            copyButton.title = 'Salin kode';
            
            // Add the button to the code block
            block.appendChild(copyButton);
            
            // Add click event listener
            copyButton.addEventListener('click', function() {
                const codeText = block.querySelector('code').textContent;
                
                // Copy to clipboard
                navigator.clipboard.writeText(codeText).then(() => {
                    // Change button text temporarily
                    this.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            });
        });
    }
    
    // Expose prevLesson and nextLesson functions globally
    window.prevLesson = prevLesson;
    window.nextLesson = nextLesson;
});