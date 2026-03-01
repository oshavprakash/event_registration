let currentUser = "";
let isAdmin = false;

let events = [
    { name: "Tech Conference 2026", date: "2026-03-25", seats: 5 },
    { name: "AI Workshop", date: "2026-04-10", seats: 2 }
];

function login() {
    const username = document.getElementById("username").value;
    if (username === "") {
        alert("Please enter a username.");
        return;
    }

    currentUser = username;

    if (username.toLowerCase() === "admin") {
        isAdmin = true;
        document.getElementById("adminPanel").style.display = "block";
        document.getElementById("welcomeMessage").innerText =
            "Welcome Admin!";
    } else {
        isAdmin = false;
        document.getElementById("adminPanel").style.display = "none";
        document.getElementById("welcomeMessage").innerText =
            "Welcome, " + currentUser + "!";
    }
}

function createEvent() {
    if (!isAdmin) return;

    const name = document.getElementById("eventName").value;
    const date = document.getElementById("eventDate").value;
    const seats = parseInt(document.getElementById("eventSeats").value);

    if (name === "" || date === "" || isNaN(seats)) {
        alert("Please fill all fields correctly.");
        return;
    }

    events.push({ name: name, date: date, seats: seats });

    document.getElementById("eventName").value = "";
    document.getElementById("eventDate").value = "";
    document.getElementById("eventSeats").value = "";

    renderEvents();
}

function scrollToEvents() {
    document.getElementById("eventsSection").scrollIntoView({
        behavior: "smooth"
    });
}

function renderEvents() {
    const eventList = document.getElementById("eventList");
    eventList.innerHTML = "";

    events.forEach((event, index) => {
        const card = document.createElement("div");
        card.className = "event-card";

        let content = `
            <h3>${event.name}</h3>
            <p>📅 ${event.date}</p>
            <p>🎟 Seats Available: ${event.seats}</p>
        `;

        if (event.seats > 0) {
            content += `<button onclick="register(${index})">Register</button>`;
        } else {
            content += `<p class="full">❌ Fully Booked</p>`;
        }

        card.innerHTML = content;
        eventList.appendChild(card);
    });
}

function register(index) {
    if (currentUser === "") {
        alert("Please login first!");
        return;
    }

    if (events[index].seats > 0) {
        events[index].seats--;
        alert("Registration successful!");
        renderEvents();
    }
}

renderEvents();