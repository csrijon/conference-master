// DOM Elements
const notificationForm = document.getElementById("notification-form");
const seminarForm = document.getElementById("seminar-form");
const notificationsList = document.querySelector("#notifications-list ul");
const seminarsList = document.querySelector("#seminars-list div");

// Handle Notification Push
document.getElementById("push-notification").addEventListener("click", () => {
    const message = document.getElementById("notification").value.trim();
    if (!message) {
        alert("Please enter a notification message.");
        return;
    }
    fetch(`/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
    })
        .then((response) => response.json())
        .then(() => {
            alert("Notification pushed!");
            document.getElementById("notification").value = "";
            loadNotifications();
        })
        .catch((err) => console.error("Error:", err));
});

// Handle Seminar Addition
document.getElementById("add-seminar").addEventListener("click", async () => {
    const title = document.getElementById("title").value.trim();
    const description = document.querySelector("#description").value.trim();
    let body = {
        venue: title,
        aboutus: description

    }

    const resp = await fetch("/intro", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })
    console.log(resp.status)

    const respo = await fetch("/about", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })
    console.log(respo.status)
});

// Load Notifications
function loadNotifications() {
    fetch(`/notifications`)
        .then((response) => response.json())
        .then((data) => {
            notificationsList.innerHTML = data
                .map((item) => `<li>${item.message}</li>`)
                .join("");
        })
        .catch((err) => console.error("Error:", err));
}

// Load Seminars
function loadSeminars() {
    fetch(`/seminars`)
        .then((response) => response.json())
        .then((data) => {
            seminarsList.innerHTML = data
                .map(
                    (item) =>
                        `<div class="seminar-card">
                            <h4>${item.title}</h4>
                            <img src="/${item.image}" alt="${item.title}" style="width:100%; height:200px; object-fit:cover;">
                            <p>${item.description}</p>
                        </div>`
                )
                .join("");
        })
        .catch((err) => console.error("Error:", err));
}

// Load Data on Page Load
document.addEventListener("DOMContentLoaded", () => {
    loadNotifications();
    loadSeminars();
});
