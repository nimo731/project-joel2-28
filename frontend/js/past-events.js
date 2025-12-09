const API_BASE_URL = 'http://localhost:5001/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    loadPastEvents();
});

async function loadPastEvents() {
    try {
        const response = await fetch(`${API_BASE_URL}/events`);
        const data = await response.json();
        
        const pastEventsList = document.getElementById('past-events-list');
        
        if (data.events && data.events.length > 0) {
            // Filter for past events
            const now = new Date();
            const pastEvents = data.events.filter(event => new Date(event.date) < now);
            
            if (pastEvents.length > 0) {
                pastEventsList.innerHTML = pastEvents.map(event => `
                    <div class="event-card">
                        <h3>${event.title}</h3>
                        <p>${event.description || 'No description available'}</p>
                        <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                        <p><strong>Location:</strong> ${event.location || 'TBD'}</p>
                    </div>
                `).join('');
            } else {
                pastEventsList.innerHTML = '<p>No past events yet.</p>';
            }
        } else {
            pastEventsList.innerHTML = '<p>No events found.</p>';
        }
    } catch (error) {
        console.error('Error loading past events:', error);
        document.getElementById('past-events-list').innerHTML = '<p>Error loading events.</p>';
    }
}
