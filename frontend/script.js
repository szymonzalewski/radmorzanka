const formRegister = document.getElementById("registerForm");
const resultEl = document.getElementById("result");

const formLogin = document.getElementById("loginForm");
const resultLogin = document.getElementById("resultLogin");

// Rejestracja
formRegister.addEventListener("submit", async (e) => {
  e.preventDefault();
  resultEl.textContent = "";

  const firstname = document.getElementById("firstname").value.trim();
  const surname = document.getElementById("surname").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const role = (document.getElementById("role")?.value || "user").trim();

  try {
    const res = await fetch("http://localhost:3003/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstname, surname, email, password, role }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(errText || `HTTP ${res.status}`);
    }

    resultEl.textContent = "Rejestracja zakończona sukcesem!";
    formRegister.reset();
  } catch (err) {
    console.error(err);
    resultEl.textContent = err.message || "Błąd rejestracji";
  }
});

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
        window.location.href = "admin.html";
      }, 500);
    }
    if (data.role === "user") {
      return setTimeout(() => {
        window.location.href = "user.html";
      }, 500);
    }
  } catch (err) {
    console.error(err);
    resultLogin.textContent = err.message || "Błąd logowania";
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("http://localhost:3003/products");
  const data = await res.json();
  const list = document.getElementById("productList");
  list.innerHTML = "";
  data.products.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = `#${p.id} ${p.name} — qty: ${p.quantity}, price: ${Number(
      p.price
    ).toFixed(2)}`;
    list.appendChild(li);
  });
});
