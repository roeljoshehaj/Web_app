console.log("🚀 login.js loaded");

document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      return alert(data.error || "Login failed");
    }

    // ✅ Save token and get full user data
    localStorage.setItem("token", data.token);

    const profileRes = await fetch("http://localhost:3000/me", {
      headers: { Authorization: `Bearer ${data.token}` }
    });

    const user = await profileRes.json();
    console.log("✅ User from /me:", user);
    localStorage.setItem("user", JSON.stringify(user));

    window.location.href = "profile.html";
  } catch (err) {
    console.error("❌ Login error:", err);
    alert("Something went wrong during login.");
  }
});
