// Pobranie zamówień
document.getElementById("loadOrdersBtn").addEventListener("click", async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("Musisz się zalogować");
    window.location.href = "../index.html";
    return;
  }

  const res = await fetch("http://localhost:3003/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  const list = document.getElementById("ordersList");
  list.innerHTML = "";

  data.orders.forEach((order) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>Zamówienie #${order.id}</strong><br>
      Imię: ${order.firstname}<br>
      Nazwisko: ${order.surname}<br>
      Opis: ${order.orderDescription}<br>
      Status: [${order.status}]<br>
      Utworzono: ${order.createdAt}<br>
      Zaktualizowano: ${order.updatedAt}<br>
      Suma: ${order.totalPrice}<br>
      <em>Produkty:</em>
    `;

    // lista produktów
    const ul = document.createElement("ul");
    if (order.orderedProducts && Array.isArray(order.orderedProducts)) {
      order.orderedProducts.forEach((p) => {
        const prodLi = document.createElement("li");
        prodLi.textContent = `${p.name} (x${p.quantity}) — ${p.price} zł`;
        ul.appendChild(prodLi);
      });
    }
    li.appendChild(ul);

    list.appendChild(li);
  });
});

document
  .getElementById("userCreateOrder")
  .addEventListener("click", async () => {
    const token = localStorage.getItem("accessToken");
    const firstname = document.getElementById("userFirstname").value.trim();
    const surname = document.getElementById("userSurname").value.trim();
    const orderDescription = document.getElementById("userDescription").value;

    const res = await fetch("http://localhost:3003/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        firstname,
        surname,
        orderDescription,
      }),
    });
    const data = await res.json();
  });
