// Poobranie zamówień
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

// edycja statusu zamówienia
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

// Usuwanie zamówienia
document.getElementById("deleteOrder").addEventListener("click", async () => {
  const token = localStorage.getItem("accessToken");
  const orderId = document.getElementById("deleteOrderId").value;

  const res = await fetch(`http://localhost:3003/orders/${orderId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
});

// Pobieranie uzytkowników
document.getElementById("getUsers").addEventListener("click", async () => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch("http://localhost:3003/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  const list = document.getElementById("usersList");

  list.innerHTML = "";

  data.users.forEach((user) => {
    const li = document.createElement("li");

    li.innerHTML = `<strong>Users #${user.id}</strong><br>
    Imię: ${user.firstname}<br>
    Nazwisko: ${user.surname}<br>
    Email: ${user.email}<br>
    Utworzono: ${user.created_at}<br>
    Zaktualizowano: ${user.updated_at}<br>`;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Ukryj to użytkownika";
    btn.addEventListener("click", () => {
      li.style.display = li.style.display === "none" ? "" : "none";
    });
    li.appendChild(btn);

    list.appendChild(li);
  });
});

// Pobieranie produktów
document
  .getElementById("getProductsAdmin")
  .addEventListener("click", async () => {
    const token = localStorage.getItem("accessToken");
    const res = await fetch("http://localhost:3003/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    const list = document.getElementById("showProductsAdmin");
    list.innerHTML = "";

    data.products.forEach((product) => {
      const li = document.createElement("li");

      li.innerHTML = `<strong>Products #${product.id}</strong><br>
    Nazwa: ${product.name}<br>
    Ilość: ${product.quantity}<br>
    Cena: ${product.price}<br>`;

      const btn = document.createElement("button");
      btn.textContent = "Ukryj produkt";
      btn.addEventListener("click", () => {
        li.style.display = li.style.display === "none" ? "" : "none";
      });
      li.appendChild(btn);
      list.appendChild(li);
    });
  });

// dodanie produktu
document.getElementById("addProduct").addEventListener("click", async () => {
  const token = localStorage.getItem("accessToken");
  const productName = document.getElementById("addProductName").value.trim();
  const productQuantity = document.getElementById("addProductQuantity").value;
  const productPrice = document.getElementById("addProductPrice").value;

  const res = await fetch("http://localhost:3003/products", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: productName,
      quantity: productQuantity,
      price: productPrice,
    }),
  });
  const data = await res.json();
  console.log(JSON.stringify(data));
});

// Edycja produktu
document.getElementById("editProduct").addEventListener("click", async () => {
  const token = localStorage.getItem("accessToken");
  const productId = document.getElementById("productId").value;
  const productName = document.getElementById("productName").value.trim();
  const productQuantity = document.getElementById("productQuantity").value;
  const productPrice = document.getElementById("productPrice").value;
  const addQuantity = Number(productQuantity);
  const newPrice = Number(productPrice);
  const response = await fetch(`http://localhost:3003/products/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const productsData = await response.json();
  const current = productsData.product;
  console.log(productsData.product);

  const newQuantity = addQuantity + current.quantity;

  const res = await fetch(`http://localhost:3003/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: productName,
      quantity: newQuantity,
      price: newPrice,
    }),
  });
  const data = await res.json();
  console.log(JSON.stringify(data));
});

// Usuwanie produktu
document.getElementById("deleteProduct").addEventListener("click", async () => {
  const token = localStorage.getItem("accessToken");
  const productId = document.getElementById("deleteProductId").value;
  const res = await fetch(`http://localhost:3003/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  console.log("Usunięto: " + JSON.stringify(data));
});
