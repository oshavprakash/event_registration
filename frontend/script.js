// ------------------ DATA ------------------
let events = [
    { name: "Full Stack development workshop", date: "2026-03-25",venue:"internal auditorium",time:"9:30 AM", seats: 25 },
    { name: "AI/ML Workshop", date: "2026-03-26",venue:"auditorium",time:"11:30 AM", seats: 25 },
    { name: "autocad Workshop", date: "2026-03-27",venue:"internal auditorium",time:"2:30 PM", seats: 25 },
{ name: " Revit Workshop", date: "2026-03-28",venue:"internal auditorium",time:"4:30 PM", seats: 25 }
];

let currentUser = "";
let isAdmin = false;
let payingEventIndex = null; // For payment modal

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

// ------------------ DASHBOARD INIT ------------------
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

// ------------------ CREATE EVENT (ADMIN ONLY) ------------------
function createEvent() {
    if (!isAdmin) return;

    const name = document.getElementById("eventName").value;
    const date = document.getElementById("eventDate").value;
    const seats = parseInt(document.getElementById("eventSeats").value);

    if (!name || !date || isNaN(seats)) {
        alert("Please fill all fields correctly.");
        return;
    }

    const time = "09:30 AM";
    const venue = "Auditorium";

    events.push({ name, date, time, venue, seats });

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
            <h3><i class="fa-solid fa-calendar-days"></i> ${event.name}</h3>
            <p><i class="fa-regular fa-calendar"></i> Date: ${event.date}</p>
            <p><i class="fa-regular fa-clock"></i> Time: ${event.time}</p>
            <p><i class="fa-solid fa-building-columns"></i> Venue: ${event.venue}</p>
            <p><i class="fa-solid fa-chair"></i> Seats Available: ${event.seats}</p>
        `;

        if (event.seats > 0) {
            content += `<button onclick="register(${index})"><i class="fa-solid fa-ticket"></i> Register</button>`;
        } else {
            content += `<p class="full"><i class="fa-solid fa-xmark"></i> Fully Booked</p>`;
        }

        card.innerHTML = content;
        eventList.appendChild(card);
    });
}

// ------------------ REGISTER (OPEN PAYMENT MODAL) ------------------
function register(index) {
    if (!currentUser) {
        alert("Please login first!");
        return;
    }

    if (events[index].seats <= 0) {
        alert("Event is fully booked!");
        return;
    }

    payingEventIndex = index;
    document.getElementById("paymentModal").style.display = "block";
}

// ------------------ PAYMENT FUNCTIONS ------------------
function closePayment() {
    document.getElementById("paymentModal").style.display = "none";
    payingEventIndex = null;
}

function completePayment(method) {
    if (payingEventIndex === null) return;

    events[payingEventIndex].seats--;
    alert(`Payment via ${method} successful! Registration confirmed.`);
    closePayment();
    renderEvents();
}

// ------------------ LOGOUT ------------------
function logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAdmin");
    window.location.href = "index.html";
}