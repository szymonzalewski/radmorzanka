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
    li.textContent = `${order.id}: ${order.orderDescription} [${order.status}]`;
    list.appendChild(li);
  });
});
