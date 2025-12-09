// Persistent storage functions for prayers and testimonies

// Save prayer to localStorage
function savePrayerToStorage(prayerData) {
    const savedPrayers = JSON.parse(localStorage.getItem('savedPrayers') || '[]');
    const prayerWithId = {
        ...prayerData,
        id: 'prayer_' + Date.now(),
        timestamp: new Date().toISOString(),
        prayCount: 0
    };
    savedPrayers.unshift(prayerWithId);
    localStorage.setItem('savedPrayers', JSON.stringify(savedPrayers));
    console.log('Prayer saved to storage:', prayerWithId);
    return prayerWithId;
}

// Save testimony to localStorage
function saveTestimonyToStorage(testimonyData) {
    const savedTestimonies = JSON.parse(localStorage.getItem('savedTestimonies') || '[]');
    const testimonyWithId = {
        ...testimonyData,
        id: 'testimony_' + Date.now(),
        timestamp: new Date().toISOString(),
        reactions: 0,
        replies: []
    };
    savedTestimonies.unshift(testimonyWithId);
    localStorage.setItem('savedTestimonies', JSON.stringify(savedTestimonies));
    console.log('Testimony saved to storage:', testimonyWithId);
    return testimonyWithId;
}

// Load saved prayers on page load
function loadSavedPrayers() {
    const savedPrayers = JSON.parse(localStorage.getItem('savedPrayers') || '[]');
    console.log('Loading saved prayers:', savedPrayers.length);
    
    savedPrayers.forEach(prayer => {
        addToPrayerWallFromStorage(prayer);
    });
}

// Load saved testimonies on page load
function loadSavedTestimonies() {
    const savedTestimonies = JSON.parse(localStorage.getItem('savedTestimonies') || '[]');
    console.log('Loading saved testimonies:', savedTestimonies.length);
    
    savedTestimonies.forEach(testimony => {
        addToTestimonyWallFromStorage(testimony);
    });
}

// Add prayer to wall from storage
function addToPrayerWallFromStorage(prayerData) {
    const prayerWall = document.getElementById('prayer-wall');
    if (!prayerWall) return;
    
    // Remove empty wall message if it exists
    const emptyWall = prayerWall.querySelector('.empty-prayer-wall');
    if (emptyWall) {
        emptyWall.remove();
    }
    
    const prayerItem = document.createElement('div');
    prayerItem.className = 'prayer-item';
    prayerItem.dataset.prayerId = prayerData.id;
    
    const timeAgo = getTimeAgo(prayerData.timestamp);
    
    prayerItem.innerHTML = `
        <div class="prayer-content">
            <p>${prayerData.request}</p>
            <div class="prayer-meta">
                <span class="prayer-author">- ${prayerData.name}</span>
                <span class="prayer-time">${timeAgo}</span>
            </div>
        </div>
        <div class="prayer-actions">
            <button class="pray-btn" data-prayer-id="${prayerData.id}" data-count="${prayerData.prayCount || 0}">
                <i class="fas fa-praying-hands"></i>
                <span>I prayed</span>
                <span class="pray-count">(${prayerData.prayCount || 0})</span>
            </button>
        </div>
    `;
    
    prayerWall.appendChild(prayerItem);
    initializePrayButton(prayerItem.querySelector('.pray-btn'));
}

// Add testimony to wall from storage
function addToTestimonyWallFromStorage(testimonyData) {
    const testimonyWall = document.getElementById('testimonies-wall');
    if (!testimonyWall) return;
    
    // Remove empty wall message if it exists
    const emptyWall = testimonyWall.querySelector('.empty-testimonies-wall');
    if (emptyWall) {
        emptyWall.remove();
    }
    
    const testimonyItem = document.createElement('div');
    testimonyItem.className = 'testimony-item';
    testimonyItem.dataset.testimonyId = testimonyData.id;
    
    const timeAgo = getTimeAgo(testimonyData.timestamp);
    
    testimonyItem.innerHTML = `
        <div class="testimony-content">
            <div class="testimony-header">
                <div class="testimony-author">
                    <i class="fas fa-user-circle"></i>
                    <span class="author-name">${testimonyData.name}</span>
                </div>
                <span class="testimony-time">${timeAgo}</span>
            </div>
            <div class="testimony-text">
                <p>${testimonyData.testimony}</p>
            </div>
        </div>
        <div class="testimony-actions">
            <button class="reaction-btn" data-testimony-id="${testimonyData.id}" data-count="${testimonyData.reactions || 0}">
                <i class="fas fa-heart"></i>
                <span class="reaction-count">${testimonyData.reactions || 0}</span>
            </button>
            <button class="reply-btn" data-testimony-id="${testimonyData.id}">
                <i class="fas fa-reply"></i>
                <span>Reply</span>
            </button>
        </div>
        <div class="replies-section" id="replies-${testimonyData.id}" style="display: none;">
            <div class="replies-list"></div>
            <div class="reply-form">
                <input type="text" placeholder="Write a reply..." class="reply-input">
                <button class="send-reply-btn">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    
    testimonyWall.appendChild(testimonyItem);
    
    // Load saved replies
    if (testimonyData.replies && testimonyData.replies.length > 0) {
        const repliesList = testimonyItem.querySelector('.replies-list');
        testimonyData.replies.forEach(reply => {
            const replyElement = document.createElement('div');
            replyElement.className = 'reply-item';
            replyElement.innerHTML = `
                <div class="reply-author">
                    <i class="fas fa-user-circle"></i>
                    <span>${reply.author}</span>
                </div>
                <div class="reply-text">${reply.text}</div>
                <div class="reply-time">${getTimeAgo(reply.timestamp)}</div>
            `;
            repliesList.appendChild(replyElement);
        });
    }
    
    // Initialize interactions after a short delay to ensure DOM is ready
    setTimeout(() => {
        if (typeof initializeTestimonyInteractions === 'function') {
            initializeTestimonyInteractions(testimonyItem);
        }
    }, 50);
}

// Calculate time ago from timestamp
function getTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

// Update stored prayer count
function updateStoredPrayerCount(prayerId, newCount) {
    const savedPrayers = JSON.parse(localStorage.getItem('savedPrayers') || '[]');
    const prayerIndex = savedPrayers.findIndex(p => p.id === prayerId);
    if (prayerIndex !== -1) {
        savedPrayers[prayerIndex].prayCount = newCount;
        localStorage.setItem('savedPrayers', JSON.stringify(savedPrayers));
    }
}

// Update stored testimony reactions
function updateStoredTestimonyReactions(testimonyId, newCount) {
    const savedTestimonies = JSON.parse(localStorage.getItem('savedTestimonies') || '[]');
    const testimonyIndex = savedTestimonies.findIndex(t => t.id === testimonyId);
    if (testimonyIndex !== -1) {
        savedTestimonies[testimonyIndex].reactions = newCount;
        localStorage.setItem('savedTestimonies', JSON.stringify(savedTestimonies));
    }
}

// Add reply to storage
function addReplyToStorage(testimonyId, replyData) {
    const savedTestimonies = JSON.parse(localStorage.getItem('savedTestimonies') || '[]');
    const testimonyIndex = savedTestimonies.findIndex(t => t.id === testimonyId);
    if (testimonyIndex !== -1) {
        if (!savedTestimonies[testimonyIndex].replies) {
            savedTestimonies[testimonyIndex].replies = [];
        }
        savedTestimonies[testimonyIndex].replies.push(replyData);
        localStorage.setItem('savedTestimonies', JSON.stringify(savedTestimonies));
    }
}
