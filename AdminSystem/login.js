

const email = document.getElementById('email');
const pass = document.getElementById('pass');

document.getElementById('login').addEventListener('submit', async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.value.trim(), pass: pass.value.trim() }),
        credentials: "include"
    });

    const user = await res.json();

    if (user.ok) {
        // ✅ Log activity here instead of in checkSession
        const ss = await fetch('http://localhost:5000/activity-log', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "login", activity: "User logged in" }),
            credentials: "include"
        });

        const result = await ss.json();
        if (!ss.ok) return alert("Error logging activity: " + result.error);

        // Redirect after login + activity log
        window.location.href = "/inventory#sec1";
    } else {
        alert(user.message || "Login failed");
    }
});


async function checkSession() {
    const resp = await fetch('http://localhost:5000/me',{ credentials: "include"});
    const data = await resp.json();

    if(!data.loggedIn) alert("Not loggin");

    if (data.loggedIn && window.location.pathname === "/login") {
        window.location.href = "/inventory#sec1";
    }
}

checkSession()