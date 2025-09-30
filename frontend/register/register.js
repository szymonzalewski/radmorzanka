//------------ WALIDACJA ZROBIONA ------------//

const formRegister = document.getElementById("registerForm");
const resultEl = document.getElementById("result");

formRegister.addEventListener("submit", async (e) => {
  e.preventDefault();
  resultEl.textContent = "";
  const regex = /^[A-Za-zÀ-ž\s\-]{2,30}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // dodac tylko walidacje password
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S{8,64}$/;
  const firstname = document.getElementById("firstname").value.trim();
  if (!regex.test(firstname)) {
    alert("Imię może zawierać tylko litery, spacje i myślniki (2–30 znaków).");
    return;
  }
  const surname = document.getElementById("surname").value.trim();
  if (!regex.test(surname)) {
    alert(
      "Nazwisko może zawierać tylko litery, spacje i myślniki (2–30 znaków)."
    );
    return;
  }
  const email = document.getElementById("email").value.trim().toLowerCase();
  if (!regex.test(emailRegex)) {
    alert("Podaj poprawny adres e-mail.");
    return;
  }
  const password = document.getElementById("password").value;
  if (password.length < 6) {
    alert("Hasło musi zawierać conajmniej 6 znaków");
  }
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
