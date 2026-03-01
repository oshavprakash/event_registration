const API_URL = "http://127.0.0.1:8003";

async function loadEvents() {
    try {
        const res = await fetch(`${API_URL}/events`);
        const events = await res.json();

        const container = document.getElementById("events");
        container.innerHTML = "";

        events.forEach(event => {
            const seatsLeft = event.capacity - event.registered_count;

            const div = document.createElement("div");
            div.className = "event-card";

            div.innerHTML = `
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <p class="seats">Seats Left: ${seatsLeft}</p>
                <button 
                    ${seatsLeft <= 0 ? "disabled" : ""} 
                    onclick="register('${event.id}')">
                    ${seatsLeft <= 0 ? "Event Full" : "Register"}
                </button>
            `;

            container.appendChild(div);
        });

    } catch (error) {
        console.error("Error loading events:", error);
        alert("Could not load events. Make sure backend is running.");
    }
}

async function register(eventId) {
    const userId = prompt("Enter your User ID:");

    if (!userId) return;

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                user_id: userId,
                event_id: eventId
            })
        });

        if (res.ok) {
            alert("Registered Successfully!");
            loadEvents();
        } else {
            const errorText = await res.text();
            alert(errorText || "Event is full!");
        }

    } catch (error) {
        console.error("Registration error:", error);
        alert("Error registering. Check backend.");
    }
}

loadEvents();