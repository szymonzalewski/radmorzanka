const formRegister = document.getElementById("registerForm");
const resultEl = document.getElementById("result");
const resultLogin = document.getElementById("resultLogin");
const formLogin = document.getElementById("loginForm");

formRegister.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstname = document.getElementById("firstname").value;
  const surname = document.getElementById("surname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const res = await fetch("http://localhost:3003/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstname, surname, email, password, role }),
  });
  resultEl.textContent = "Rejestracja zakończona sukcesem!";
  form.reset();
});

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("emailLogin").value;
  const password = document.getElementById("passwordLogin").value;

  const res = await fetch("http://localhost:3003/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  console.log("Token:", data);

  resultEl.textContent = "Zalogowano";
  formLogin.reset();
  setTimeout(() => {
    window.location.href = "/user.html";
  }, 1000);
});
