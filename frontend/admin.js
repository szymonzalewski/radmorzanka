document.getElementById("getOrdersBtn").addEventListener("click", async () => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch("http://localhost:3003/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  console.log(data);

  const list = document.getElementById("ordersAdminList");
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

    const ul = document.createElement("ul");
    (order.orderedProducts || []).forEach((p) => {
      const prodLi = document.createElement("li");
      prodLi.textContent = `${p.name} (x${p.quantity}) — ${p.price} zł`;
      ul.appendChild(prodLi);
    });
    li.appendChild(ul);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Ukryj to zamówienie";
    btn.addEventListener("click", () => {
      li.style.display = li.style.display === "none" ? "" : "none";
    });
    li.appendChild(btn);

    list.appendChild(li);
  });
});

document
  .getElementById("editOrderStatus")
  .addEventListener("click", async () => {
    const token = localStorage.getItem("accessToken");
    const newStatus = document.getElementById("orderStatusEdit").value.trim();
    const orderId = document.getElementById("orderIdStatus").value;

    const res = await fetch(`http://localhost:3003/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await res.json();
  });
