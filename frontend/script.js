// Users stored in localStorage
let events = [
    { name: "Full Stack development workshop", date: "2026-03-25", seats: 25 },
    { name: "AI/ML Workshop", date: "2026-03-26", seats: 25 }
    { name: "autocad Workshop", date: "2026-03-27", seats: 25 }
{ name: " Revit Workshop", date: "2026-03-28", seats: 25 }
];


// ------------------ SIGNUP ------------------
function signup() {
    const username = document.getElementById("signupUsername").value;
    const role = document.getElementById("signupRole").value;

    if (!username) {
        document.getElementById("signupMessage").innerText = "Enter username";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find(u => u.username === username)) {
        document.getElementById("signupMessage").innerText = "Username exists!";
        return;
    }

    users.push({ username: username, role: role });
    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("signupMessage").innerText = "Signup successful! Login now.";
    setTimeout(() => { window.location.href = "index.html"; }, 1000);
}


// ------------------ LOGIN ------------------
function login() {
    const username = document.getElementById("username").value;

    if (!username) {
        document.getElementById("loginMessage").innerText = "Enter username";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users") || "[]");
    let user = users.find(u => u.username === username);

    if (!user) {
        document.getElementById("loginMessage").innerText = "User not found!";
        return;
    }

    localStorage.setItem("currentUser", user.username);
    localStorage.setItem("isAdmin", user.role === "admin" ? "true" : "false");

    window.location.href = "dashboard.html";
}


// ------------------ DASHBOARD ------------------
let currentUser = "";
let isAdmin = false;

if (document.getElementById("eventList")) {

    const user = localStorage.getItem("currentUser");
    const adminStatus = localStorage.getItem("isAdmin");

    if (!user) {
        window.location.href = "index.html";
    } else {

        currentUser = user;
        isAdmin = adminStatus === "true";

        const welcome = document.getElementById("welcomeMessage");
        const adminPanel = document.getElementById("adminPanel");

        if (welcome) {
            welcome.innerText = isAdmin
                ? "Welcome Admin!"
                : "Welcome, " + currentUser + "!";
        }

        if (adminPanel) {
            adminPanel.style.display = isAdmin ? "block" : "none";
        }

        renderEvents();
    }
}


// ------------------ CREATE EVENT ------------------
function createEvent() {

    if (!isAdmin) return;

    const name = document.getElementById("eventName").value;
    const date = document.getElementById("eventDate").value;
    const seats = parseInt(document.getElementById("eventSeats").value);

    if (!name || !date || isNaN(seats)) {
        alert("Fill all fields correctly.");
        return;
    }

    events.push({ name, date, seats });

    document.getElementById("eventName").value = "";
    document.getElementById("eventDate").value = "";
    document.getElementById("eventSeats").value = "";

    renderEvents();
}


// ------------------ RENDER EVENTS ------------------
function renderEvents() {

    const eventList = document.getElementById("eventList");
    if (!eventList) return;

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
            content += `<button onclick="register(${index})">Register ✅</button>`;
        } else {
            content += `<p class="full">❌ Fully Booked</p>`;
        }

        card.innerHTML = content;
        eventList.appendChild(card);
    });
}


// ------------------ REGISTER ------------------
function register(index) {

    if (!currentUser) {
        alert("Please login first!");
        return;
    }

    if (events[index].seats > 0) {
        events[index].seats--;
        alert("Registration successful!");
        renderEvents();
    }
}


// ------------------ LOGOUT ------------------
function logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAdmin");
    window.location.href = "index.html";
}
