const formRegister = document.getElementById("registerForm");
const resultEl = document.getElementById("result");

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
