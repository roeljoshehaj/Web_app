document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ hpage.js loaded");
  
    const profileSection = document.querySelector(".profile");
  
    const token = localStorage.getItem('authToken');
    console.log("📦 Token from storage:", token);
  
    if (!token) {
      profileSection.innerHTML = `<p style="color: red;">No token found. Please log in.</p>`;
      return;
    }
    
  
    fetch('http://localhost:3000/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (response) => {
        console.log("📡 /me status:", response.status);
  
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`❌ /me failed: ${response.status} - ${text}`);
        }
  
        return response.json();
      })
      .then((user) => {
        console.log("👤 User data:", user);
        profileSection.innerHTML = `
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
               alt="Profile Picture"
               style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">
          <h3>Welcome, ${user.fullName}</h3>
          <p>Email: ${user.email}</p>
          <p>Role: ${user.role}</p>
          <p>Gender: ${user.gender}</p>
        `;
      })
      .catch((err) => {
        console.error("❌ Error loading profile:", err);
        profileSection.innerHTML = `<p style="color: red;">Could not load profile. Try logging in again.</p>`;
      });
  });
  