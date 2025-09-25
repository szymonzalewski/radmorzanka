// Pobranie zamówień
document.getElementById("loadOrdersBtn").addEventListener("click", async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("Musisz się zalogować");
    window.location.href = "index.html";
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

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("http://localhost:3003/products");
  const data = await res.json();
  const list = document.getElementById("productList");
  list.innerHTML = "";
  data.products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `${product.id} ${product.name} ${product.quantity} ${product.price}`;
  });
});
