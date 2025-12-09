// API Base URL
const API_BASE_URL = 'http://localhost:5001/api/v1';

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSermons();
    loadEvents();
    loadPrayers();
    loadTestimonies();
});

// Load Sermons
async function loadSermons() {
    try {
        const response = await fetch(`${API_BASE_URL}/sermons`);
        const data = await response.json();
        
        const sermonsList = document.getElementById('sermons-list');
        if (data.sermons && data.sermons.length > 0) {
            sermonsList.innerHTML = data.sermons.map(sermon => `
                <div class="sermon-card">
                    <h3>${sermon.title}</h3>
                    <p>${sermon.description || 'No description available'}</p>
                    <small>${new Date(sermon.date).toLocaleDateString()}</small>
                </div>
            `).join('');
        } else {
            sermonsList.innerHTML = '<p>No sermons available yet.</p>';
        }
    } catch (error) {
        console.error('Error loading sermons:', error);
        document.getElementById('sermons-list').innerHTML = '<p>Error loading sermons.</p>';
    }
}

// Load Events
async function loadEvents() {
    try {
        const response = await fetch(`${API_BASE_URL}/events`);
        const data = await response.json();
        
        const eventsList = document.getElementById('events-list');
        if (data.events && data.events.length > 0) {
            eventsList.innerHTML = data.events.map(event => `
                <div class="event-card">
                    <h3>${event.title}</h3>
                    <p>${event.description || 'No description available'}</p>
                    <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                    <p><strong>Location:</strong> ${event.location || 'TBD'}</p>
                </div>
            `).join('');
        } else {
            eventsList.innerHTML = '<p>No events scheduled yet.</p>';
        }
    } catch (error) {
        console.error('Error loading events:', error);
        document.getElementById('events-list').innerHTML = '<p>Error loading events.</p>';
    }
}

// Load Prayers
async function loadPrayers() {
    try {
        const response = await fetch(`${API_BASE_URL}/prayers`);
        const data = await response.json();
        
        const prayersList = document.getElementById('prayers-list');
        if (data.prayerRequests && data.prayerRequests.length > 0) {
            prayersList.innerHTML = data.prayerRequests.map(prayer => `
                <div class="prayer-item">
                    <p><strong>${prayer.name}</strong></p>
                    <p>${prayer.request}</p>
                    <small>${new Date(prayer.createdAt).toLocaleDateString()}</small>
                </div>
            `).join('');
        } else {
            prayersList.innerHTML = '<p>No prayer requests yet. Be the first to share!</p>';
        }
    } catch (error) {
        console.error('Error loading prayers:', error);
        document.getElementById('prayers-list').innerHTML = '<p>Error loading prayers.</p>';
    }
}

// Load Testimonies
async function loadTestimonies() {
    try {
        const response = await fetch(`${API_BASE_URL}/testimonies`);
        const data = await response.json();
        
        const testimoniesList = document.getElementById('testimonies-list');
        if (data.testimonies && data.testimonies.length > 0) {
            testimoniesList.innerHTML = data.testimonies.map(testimony => `
                <div class="testimony-card">
                    <p><em>"${testimony.content}"</em></p>
                    <p><strong>- ${testimony.author}</strong></p>
                    <small>${new Date(testimony.createdAt).toLocaleDateString()}</small>
                </div>
            `).join('');
        } else {
            testimoniesList.innerHTML = '<p>No testimonies yet. Share your story!</p>';
        }
    } catch (error) {
        console.error('Error loading testimonies:', error);
        document.getElementById('testimonies-list').innerHTML = '<p>Error loading testimonies.</p>';
    }
}

// Submit Prayer Request
async function submitPrayer() {
    const name = document.getElementById('prayer-name').value;
    const request = document.getElementById('prayer-request').value;
    
    if (!name || !request) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/prayers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, request })
        });
        
        if (response.ok) {
            document.getElementById('prayer-name').value = '';
            document.getElementById('prayer-request').value = '';
            alert('Prayer request submitted successfully!');
            loadPrayers();
        } else {
            alert('Error submitting prayer request');
        }
    } catch (error) {
        console.error('Error submitting prayer:', error);
        alert('Error submitting prayer request');
    }
}
