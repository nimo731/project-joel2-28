// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';
console.log('Using API base URL:', API_BASE_URL);

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log(' THE JOEL 2:28 GENERATION - JavaScript Loading...');
    
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            console.log('Mobile menu toggled');
        });
    }

    // Navigation link functionality
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Nav link clicked:', this.getAttribute('href'));
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Hide all sections
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
                console.log('Section activated:', targetId);
            }
            
            // Close mobile menu
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });

    // Feature button handlers - using event delegation for better reliability
    document.addEventListener('click', function(e) {
        // Join Google Meet button
        if (e.target.classList.contains('join-meet-btn') || e.target.closest('.join-meet-btn')) {
            e.preventDefault();
            window.open('https://meet.google.com/smr-grwa-fey', '_blank');
            console.log('Join Google Meet clicked');
        }
        
        // Watch Live button
        if (e.target.classList.contains('watch-live-btn') || e.target.closest('.watch-live-btn')) {
            e.preventDefault();
            window.open('https://youtube.com/@james.m.kinyanjui', '_blank');
            console.log('Watch Live clicked - opened YouTube');
        }
        
        // Prayer Request button
        if (e.target.classList.contains('prayer-request-btn') || e.target.closest('.prayer-request-btn')) {
            e.preventDefault();
            const prayersSection = document.getElementById('prayers');
            if (prayersSection) {
                document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
                prayersSection.style.display = 'block';
                console.log('Prayer Request clicked - navigated to prayers');
            }
        }
        
        // WhatsApp Group button
        if (e.target.classList.contains('whatsapp-btn') || e.target.closest('.whatsapp-btn')) {
            e.preventDefault();
            window.open('https://chat.whatsapp.com/BQJmKxHfxGE2QjQQQQQQQQ', '_blank');
            console.log('WhatsApp Group clicked');
        }
        
        // CTA button
        if (e.target.classList.contains('cta-btn') || e.target.closest('.cta-btn')) {
            e.preventDefault();
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
                aboutSection.style.display = 'block';
                console.log('CTA button clicked - navigated to about');
            }
        }
    });

    // Prayer request form handling
    const prayerForm = document.getElementById('prayer-form');
    if (prayerForm) {
        prayerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Prayer form submitted');
            
            const formData = new FormData(prayerForm);
            const prayerData = {
                name: formData.get('name') || 'Anonymous',
                request: formData.get('request'),
                category: formData.get('category') || 'general',
                isAnonymous: formData.get('isAnonymous') === 'on',
                isUrgent: formData.get('isUrgent') === 'on'
            };

            console.log('Prayer data:', prayerData);

            if (!prayerData.request) {
                showNotification('Please enter your prayer request', 'error');
                return;
            }

            const submitBtn = prayerForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            try {
                // Add to prayer wall and local storage
                const savedPrayer = savePrayerToStorage(prayerData);
                addToPrayerWall(savedPrayer);
                prayerForm.reset();
                
                // Show success message
                showNotification('Prayer request submitted successfully! 🙏', 'success');
                
                // Scroll to the newly added prayer
                const prayerWall = document.getElementById('prayer-wall');
                if (prayerWall && prayerWall.firstChild) {
                    prayerWall.firstChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                
            } catch (error) {
                console.error('Error submitting prayer:', error);
                showNotification('Error submitting prayer. Please try again.', 'error');
            } finally {
                // Always reset the button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }

            // Try to send to backend (optional, no waiting)
            try {
                console.log('Sending prayer to backend:', prayerData);
                const response = await fetch(`${API_BASE_URL}/prayers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(prayerData)
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Prayer submitted to backend:', data);
                    
                    // Update the prayer ID in local storage if needed
                    if (data.prayer && data.prayer.id) {
                        const prayers = JSON.parse(localStorage.getItem('prayers') || '[]');
                        const prayerIndex = prayers.findIndex(p => p.id === prayerData.id);
                        if (prayerIndex !== -1) {
                            prayers[prayerIndex].id = data.prayer.id;
                            localStorage.setItem('prayers', JSON.stringify(prayers));
                            
                            // Update the DOM element's data attribute
                            const prayerElement = document.querySelector(`[data-prayer-id="${prayerData.id}"]`);
                            if (prayerElement) {
                                prayerElement.dataset.prayerId = data.prayer.id;
                            }
                        }
                    }
                }
            } catch (error) {
                console.warn('Backend unavailable, prayer saved locally. Error:', error.message);
                console.debug('Error details:', error);
            }
        });
    }

    // Prayer request form handling for the prayers section
    const prayerFormSection = document.getElementById('prayer-form-section');
    if (prayerFormSection) {
        prayerFormSection.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Prayer form section submitted');
            
            const formData = new FormData(prayerFormSection);
            const prayerData = {
                name: formData.get('name') || 'Anonymous',
                request: formData.get('request'),
                category: 'general',
                isAnonymous: false,
                isUrgent: false
            };

            console.log('Prayer data from section:', prayerData);

            if (!prayerData.name || !prayerData.request) {
                showNotification('Please fill in your name and prayer request', 'error');
                return;
            }

            const submitBtn = prayerFormSection.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            try {
                // Always add to prayer wall first (for immediate feedback)
                const savedPrayer = savePrayerToStorage(prayerData);
                addToPrayerWallFromStorage(savedPrayer);
                prayerFormSection.reset();
                showNotification('Prayer request submitted successfully! 🙏', 'success');
                
                // Reset button immediately
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            } catch (error) {
                console.error('Error submitting prayer:', error);
                showNotification('Error submitting prayer. Please try again.', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }

            // Try to send to backend (optional, no waiting)
            fetch('http://localhost:5001/api/prayers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(prayerData)
            }).catch(error => {
                console.warn('Backend unavailable, prayer saved locally. Error:', error.message);
                console.debug('Error details:', error);
            });
        });
    }

    // Save prayer to local storage
    function savePrayerToStorage(prayerData) {
        const prayers = JSON.parse(localStorage.getItem('prayers') || '[]');
        const prayer = {
            id: 'prayer_' + Date.now(),
            ...prayerData,
            createdAt: new Date().toISOString(),
            prayerCount: 0,
            prayedBy: []
        };
        prayers.unshift(prayer);
        localStorage.setItem('prayers', JSON.stringify(prayers));
        return prayer;
    }

    // Add prayer to wall with dynamic functionality
    function addToPrayerWall(prayerData) {
        console.log('Adding prayer to wall:', prayerData);
        const prayerWall = document.getElementById('prayer-wall');
        
        if (!prayerWall) {
            console.error('Prayer wall element not found!');
            return;
        }
        
        const emptyWall = prayerWall.querySelector('.empty-prayer-wall');
        if (emptyWall) {
            emptyWall.remove();
        }
        
        const prayerId = prayerData.id || 'prayer_' + Date.now();
        const prayerItem = document.createElement('div');
        prayerItem.className = 'prayer-item';
        prayerItem.dataset.prayerId = prayerId;
        
        const prayerCount = prayerData.prayerCount || 0;
        const currentUser = getCurrentUser();
        const userPrayers = JSON.parse(localStorage.getItem('userPrayers') || '{}');
        const userKey = currentUser ? (currentUser.email || currentUser.id) : 'guest';
        const hasPrayed = userPrayers[userKey] && userPrayers[userKey].includes(prayerId);
        
        prayerItem.innerHTML = `
            <div class="prayer-content">
                <p>${prayerData.request || ''}</p>
                <div class="prayer-meta">
                    <span class="prayer-author">- ${prayerData.name || 'Anonymous'}</span>
                    <span class="prayer-time">Just now</span>
                </div>
            </div>
            <div class="prayer-actions">
                <button class="pray-btn ${hasPrayed ? 'prayed' : ''}" 
                        data-prayer-id="${prayerId}" 
                        data-count="${prayerCount}">
                    <i class="fas fa-praying-hands"></i>
                    <span>I prayed</span>
                    <span class="pray-count">${prayerCount > 0 ? `(${prayerCount})` : ''}</span>
                </button>
            </div>
        `;
        
        prayerWall.insertBefore(prayerItem, prayerWall.firstChild);
        console.log('Prayer item added to wall');
        initializePrayButton(prayerItem.querySelector('.pray-btn'));
    }

    // Initialize pray button functionality
    function initializePrayButton(button) {
        if (!button) return;
        
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const prayerId = button.dataset.prayerId;
            const currentUser = getCurrentUser() || { id: 'guest', email: 'guest@example.com' };
            
            // Get or initialize user prayers in localStorage
            const userPrayers = JSON.parse(localStorage.getItem('userPrayers') || '{}');
            const userKey = currentUser.email || currentUser.id || 'guest';
            
            // Initialize user's prayer array if it doesn't exist
            if (!userPrayers[userKey]) {
                userPrayers[userKey] = [];
            }
            
            // Check if user already prayed for this request
            if (userPrayers[userKey].includes(prayerId)) {
                showNotification('You have already prayed for this request', 'info');
                return;
            }
            
            // Update the prayer count in UI
            let currentCount = parseInt(button.dataset.count) || 0;
            currentCount++;
            button.dataset.count = currentCount;
            
            // Update the button UI
            const prayCountSpan = button.querySelector('.pray-count') || document.createElement('span');
            prayCountSpan.className = 'pray-count';
            prayCountSpan.textContent = currentCount > 0 ? `(${currentCount})` : '';
            
            // Update button content
            button.innerHTML = `
                <i class="fas fa-praying-hands"></i>
                <span>I prayed</span>
                <span class="pray-count">${currentCount > 0 ? `(${currentCount})` : ''}</span>
            `;
            
            // Add prayer to user's prayers
            userPrayers[userKey].push(prayerId);
            localStorage.setItem('userPrayers', JSON.stringify(userPrayers));
            
            // Update the prayer in local storage
            const prayers = JSON.parse(localStorage.getItem('prayers') || '[]');
            const prayerIndex = prayers.findIndex(p => p.id === prayerId);
            if (prayerIndex !== -1) {
                if (!prayers[prayerIndex].prayerCount) {
                    prayers[prayerIndex].prayerCount = 0;
                }
                prayers[prayerIndex].prayerCount++;
                if (!prayers[prayerIndex].prayedBy) {
                    prayers[prayerIndex].prayedBy = [];
                }
                prayers[prayerIndex].prayedBy.push({
                    userId: currentUser.id || 'guest',
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('prayers', JSON.stringify(prayers));
            }
            
            // Update the button state
            button.classList.add('prayed');
            
            // Show success message
            showNotification('Thank you for praying! 🙏', 'success');
            
            // Also update the backend if available
            try {
                await fetch(`${API_BASE_URL}/prayers/${prayerId}/pray`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        userId: currentUser.id || 'guest',
                        timestamp: new Date().toISOString()
                    })
                });
            } catch (error) {
                console.log('Error updating prayer count on server:', error);
            }
        });
    }

    // Initialize existing prayer buttons on page load
    function initializeExistingPrayButtons() {
        const existingPrayButtons = document.querySelectorAll('.pray-btn');
        existingPrayButtons.forEach(button => {
            initializePrayButton(button);
        });
    }

    // Notification system
    const style = document.createElement('style');
    style.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        font-weight: 600;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        animation: slideIn 0.3s ease forwards;
    }
    
    .notification-success {
        background: #10b981;
        color: white;
    }
    
    .notification-error {
        background: #ef4444;
        color: white;
    }
    
    .notification-info {
        background: #3b82f6;
        color: white;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    `;
    document.head.appendChild(style);

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Add interactive animations
    const cards = document.querySelectorAll('.quick-card, .sermon-card, .event-card, .leader-card, .dashboard-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Load saved data on page load
    loadSavedPrayers();
    loadSavedTestimonies();

    // Initialize page - show home section by default
    const homeSection = document.getElementById('home');
    if (homeSection) {
        document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
        homeSection.style.display = 'block';
    }

    // Add flame animation to logo
    const flameIcon = document.querySelector('.flame-icon');
    if (flameIcon) {
        setInterval(() => {
            flameIcon.style.textShadow = `0 0 ${Math.random() * 20 + 10}px rgba(255, 215, 0, 0.8)`;
        }, 500);
    }

    // Initialize testimony modal
    initializeTestimonyModal();

    // Initialize existing prayer buttons
    initializeExistingPrayButtons();

    // Initialize page
    console.log('THE JOEL 2:28 GENERATION website loaded successfully! 🔥');
});

// Auth form handling
function handleAuthForms() {
    console.log('handleAuthForms called');
    
    // Handle form switching
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('switch-link')) {
            e.preventDefault();
            const target = e.target.dataset.target;
            const loginCard = document.querySelector('.auth-card:not(.signup-card)');
            const signupCard = document.querySelector('.signup-card');
            
            console.log('Switching to:', target);
            
            if (target === 'signup') {
                loginCard.style.display = 'none';
                signupCard.style.display = 'block';
                // Re-attach event listener after showing the form
                setTimeout(() => {
                    attachSignupListener();
                }, 100);
            } else {
                signupCard.style.display = 'none';
                loginCard.style.display = 'block';
            }
        }
    });

    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const loginData = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            try {
                const response = await fetch('http://localhost:5001/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginData)
                });

                if (response.ok) {
                    const result = await response.json();
                    localStorage.setItem('token', result.token);
                    showNotification('Login successful! Welcome back.', 'success');
                    setTimeout(() => {
                        showSection('home');
                    }, 1500);
                } else {
                    const error = await response.json();
                    showNotification(error.message || 'Login failed', 'error');
                }
            } catch (error) {
                showNotification('Network error. Please try again.', 'error');
            }
        });
    }

    // Attach signup listener and password toggles
    attachSignupListener();
    attachPasswordToggles();
}

function attachSignupListener() {
    // Handle signup form submission
    const signupForm = document.getElementById('signup-form');
    console.log('Signup form found:', signupForm);
    if (signupForm) {
        // Remove existing listeners to avoid duplicates
        signupForm.removeEventListener('submit', handleSignupSubmit);
        signupForm.addEventListener('submit', handleSignupSubmit);
    }
    
    // Attach password toggle listeners
    attachPasswordToggles();
}

function attachPasswordToggles() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

async function handleSignupSubmit(e) {
    e.preventDefault();
    console.log('Signup form submitted');
    
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) {
        console.error('Signup form not found');
        return;
    }
    
    const formData = new FormData(signupForm);
    
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    console.log('Form data:', {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: password ? '***' : 'empty',
        confirmPassword: confirmPassword ? '***' : 'empty'
    });
    
    if (!password || !confirmPassword) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    const signupData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: password
    };

    // Show loading state
    const submitBtn = signupForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;

    try {
        console.log('Sending registration request to backend...');
        const response = await fetch('http://localhost:5001/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupData)
        });

        console.log('Response status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('Registration successful:', result);
            showNotification('Account created successfully! Please sign in.', 'success');
            
            // Reset form
            signupForm.reset();
            
            setTimeout(() => {
                document.querySelector('.signup-card').style.display = 'none';
                document.querySelector('.auth-card:not(.signup-card)').style.display = 'block';
            }, 1500);
        } else {
            const error = await response.json();
            console.error('Registration failed:', error);
            showNotification(error.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Network error:', error);
        showNotification('Network error. Please check your connection and try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Get current user function
function getCurrentUser() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return { id: payload.userId, email: payload.email };
        } catch (e) {
            console.log('Invalid token, using guest user');
        }
    }
    return { id: 'guest', email: 'guest@example.com' };
}



// Testimony modal functionality - moved inside main DOMContentLoaded
function initializeTestimonyModal() {
    console.log('Initializing testimony modal...');
    
    const addTestimonyBtn = document.getElementById('add-testimony-btn');
    const testimonyModal = document.getElementById('testimony-form-modal');
    const closeModalBtn = document.getElementById('close-testimony-modal');
    const cancelBtn = document.getElementById('cancel-testimony');
    const testimonyForm = document.getElementById('testimony-form');

    console.log('Testimony elements found:', {
        addTestimonyBtn: !!addTestimonyBtn,
        testimonyModal: !!testimonyModal,
        closeModalBtn: !!closeModalBtn,
        cancelBtn: !!cancelBtn,
        testimonyForm: !!testimonyForm
    });

    // Close modal functions
    function closeModal() {
        if (testimonyModal) {
            testimonyModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (testimonyForm) testimonyForm.reset();
        console.log('Modal closed');
    }

    // Open modal
    if (addTestimonyBtn && testimonyModal) {
        addTestimonyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Opening testimony modal');
            testimonyModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    if (testimonyModal) {
        testimonyModal.addEventListener('click', (e) => {
            if (e.target === testimonyModal) {
                closeModal();
            }
        });
    }

    // Handle testimony form submission
    if (testimonyForm) {
        testimonyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Testimony form submitted');
            
            const formData = new FormData(testimonyForm);
            const testimonyData = {
                name: formData.get('name'),
                email: formData.get('email'),
                testimony: formData.get('testimony')
            };

            console.log('Testimony data:', testimonyData);

            if (!testimonyData.name || !testimonyData.testimony) {
                // Create error notification manually
                const notification = document.createElement('div');
                notification.className = 'notification error';
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #ef4444;
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10000;
                    font-weight: 600;
                `;
                notification.textContent = 'Please fill in your name and testimony';
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 3000);
                return;
            }

            const submitBtn = testimonyForm.querySelector('.submit-btn');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Submitting...';
                submitBtn.disabled = true;

                // Immediate success feedback - no timeout
                const notification = document.createElement('div');
                notification.className = 'notification success';
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #10b981;
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10000;
                    font-weight: 600;
                `;
                notification.textContent = 'Testimony submitted successfully! Thank you for sharing. 🙏';
                document.body.appendChild(notification);
                
                // Remove notification after 3 seconds
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 3000);
                
                // Add testimony to wall immediately
                const savedTestimony = saveTestimonyToStorage(testimonyData);
                addToTestimonyWallFromStorage(savedTestimony);
                
                closeModal();
                
                // Reset button immediately
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }

            // Try to send to backend (optional, no waiting)
            fetch('http://localhost:5001/api/testimonies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testimonyData)
            }).catch(error => {
                console.log('Backend unavailable, testimony saved locally:', error);
            });
        });
    }
}

// Add testimony to wall with reactions and replies
function addToTestimonyWall(testimonyData) {
    console.log('Adding testimony to wall:', testimonyData);
    const testimonyWall = document.getElementById('testimonies-wall');
    
    if (!testimonyWall) {
        console.error('Testimony wall element not found!');
        return;
    }
    
    // Remove empty wall message if it exists
    const emptyWall = testimonyWall.querySelector('.empty-testimonies-wall');
    if (emptyWall) {
        emptyWall.remove();
        console.log('Empty testimony wall removed');
    }
    
    const testimonyId = 'testimony_' + Date.now();
    const testimonyItem = document.createElement('div');
    testimonyItem.className = 'testimony-item';
    testimonyItem.dataset.testimonyId = testimonyId;
    
    testimonyItem.innerHTML = `
        <div class="testimony-content">
            <div class="testimony-header">
                <div class="testimony-author">
                    <i class="fas fa-user-circle"></i>
                    <span class="author-name">${testimonyData.name}</span>
                </div>
                <span class="testimony-time">Just now</span>
            </div>
            <div class="testimony-text">
                <p>${testimonyData.testimony}</p>
            </div>
        </div>
        <div class="testimony-actions">
            <button class="reaction-btn" data-testimony-id="${testimonyId}" data-count="0">
                <i class="fas fa-heart"></i>
                <span class="reaction-count">0</span>
            </button>
            <button class="reply-btn" data-testimony-id="${testimonyId}">
                <i class="fas fa-reply"></i>
                <span>Reply</span>
            </button>
        </div>
        <div class="replies-section" id="replies-${testimonyId}" style="display: none;">
            <div class="replies-list"></div>
            <div class="reply-form">
                <input type="text" placeholder="Write a reply..." class="reply-input">
                <button class="send-reply-btn">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    
    testimonyWall.insertBefore(testimonyItem, testimonyWall.firstChild);
    console.log('Testimony item added to wall');
    
    // Initialize reaction and reply functionality
    initializeTestimonyInteractions(testimonyItem);
}

// Initialize testimony interactions (reactions and replies)
function initializeTestimonyInteractions(testimonyItem) {
    const reactionBtn = testimonyItem.querySelector('.reaction-btn');
    const replyBtn = testimonyItem.querySelector('.reply-btn');
    const sendReplyBtn = testimonyItem.querySelector('.send-reply-btn');
    const replyInput = testimonyItem.querySelector('.reply-input');
    const repliesSection = testimonyItem.querySelector('.replies-section');
    
    // Handle reaction button
    if (reactionBtn) {
        console.log('Setting up reaction button for testimony:', reactionBtn.dataset.testimonyId);
        reactionBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('❤️ Reaction button clicked!');
            
            const testimonyId = this.dataset.testimonyId;
            const reactionCountElement = this.querySelector('.reaction-count');
            console.log('Testimony ID:', testimonyId);
            console.log('Current count element:', reactionCountElement);
            
            if (!reactionCountElement) {
                console.error('❌ Reaction count element not found!');
                return;
            }
            
            // Always allow reactions for demo purposes - use guest user if not logged in
            const currentUser = getCurrentUser() || { id: 'guest', email: 'guest@example.com' };
            
            const userReactions = JSON.parse(localStorage.getItem('userTestimonyReactions') || '{}');
            const userKey = currentUser.email || currentUser.id || 'anonymous';
            
            if (!userReactions[userKey]) {
                userReactions[userKey] = [];
            }
            
            console.log('👤 User reactions before:', userReactions[userKey]);
            
            let currentCount = parseInt(this.dataset.count) || 0;
            console.log('📊 Current count from dataset:', currentCount);
            
            if (userReactions[userKey].includes(testimonyId)) {
                // Remove reaction
                console.log('➖ Removing reaction');
                const index = userReactions[userKey].indexOf(testimonyId);
                userReactions[userKey].splice(index, 1);
                
                currentCount = Math.max(0, currentCount - 1);
                this.dataset.count = currentCount;
                reactionCountElement.textContent = currentCount;
                this.classList.remove('reacted');
                console.log('✅ Reaction removed, new count:', currentCount);
            } else {
                // Add reaction
                console.log('➕ Adding reaction');
                userReactions[userKey].push(testimonyId);
                
                currentCount++;
                this.dataset.count = currentCount;
                reactionCountElement.textContent = currentCount;
                this.classList.add('reacted');
                console.log('✅ Reaction added, new count:', currentCount);
            }
            
            localStorage.setItem('userTestimonyReactions', JSON.stringify(userReactions));
            console.log('💾 User reactions after:', userReactions[userKey]);
            console.log('🎯 Final count in DOM:', reactionCountElement.textContent);
            
            // Update stored testimony reactions count
            updateStoredTestimonyReactions(testimonyId, currentCount);
            console.log('💾 Updated storage with count:', currentCount);
        });
    } else {
        console.warn('⚠️ No reaction button found in testimony item');
    }
    
    // Handle reply button
    if (replyBtn) {
        replyBtn.addEventListener('click', function() {
            const isVisible = repliesSection.style.display !== 'none';
            repliesSection.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) {
                replyInput.focus();
            }
        });
    }
    
    // Handle send reply
    if (sendReplyBtn && replyInput) {
        const sendReply = () => {
            const replyText = replyInput.value.trim();
            if (!replyText) return;
            
            // Always allow replies for demo purposes - use guest user if not logged in
            const currentUser = getCurrentUser() || { id: 'guest', email: 'guest@example.com' };
            
            const repliesList = testimonyItem.querySelector('.replies-list');
            const replyElement = document.createElement('div');
            replyElement.className = 'reply-item';
            replyElement.innerHTML = `
                <div class="reply-author">
                    <i class="fas fa-user-circle"></i>
                    <span>${currentUser.email || 'Anonymous'}</span>
                </div>
                <div class="reply-text">${replyText}</div>
                <div class="reply-time">Just now</div>
            `;
            
            repliesList.appendChild(replyElement);
            replyInput.value = '';
            
            // Save reply to storage
            const testimonyId = testimonyItem.dataset.testimonyId;
            const replyData = {
                author: currentUser.email || 'Anonymous',
                text: replyText,
                timestamp: new Date().toISOString()
            };
            addReplyToStorage(testimonyId, replyData);
            
            // Show success notification
            const notification = document.createElement('div');
            notification.className = 'notification success';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-weight: 600;
            `;
            notification.textContent = 'Reply added! 💬';
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);
        };
        
        sendReplyBtn.addEventListener('click', sendReply);
        replyInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendReply();
            }
        });
    }
}
