const formLogin = document.getElementById("loginForm");
const resultLogin = document.getElementById("resultLogin");

// Logowanie
formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  resultLogin.textContent = "Logowanie...";

  const email = document
    .getElementById("emailLogin")
    .value.trim()
    .toLowerCase();
  const password = document.getElementById("passwordLogin").value;

  try {
    const res = await fetch("http://localhost:3003/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(errText || `HTTP ${res.status}`);
    }

    const data = await res.json();

    const token = data.accessToken || data.token;
    if (!token) throw new Error("Brak tokena w odpowiedzi");

    localStorage.setItem("accessToken", token);

    resultLogin.textContent = "Zalogowano";
    formLogin.reset();

    if (data.role === "admin") {
      return setTimeout(() => {
        window.location.href = "../admin/admin.html";
      }, 500);
    }
    if (data.role === "user") {
      return setTimeout(() => {
        window.location.href = "../user/user.html";
      }, 500);
    }
  } catch (err) {
    console.error(err);
    resultLogin.textContent = err.message || "Błąd logowania";
  }
});
