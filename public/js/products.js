document
  .getElementById("createProductForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const sku = document.getElementById("sku").value;
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;

    try {
      const response = await fetch("/products/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sku, name, price }),
      });
      const data = await response.json();
      alert(
        data.created
          ? "Producto creado exitosamente"
          : "Error al crear el producto"
      );
    } catch (error) {
      console.error("Error:", error);
    }
  });

document.getElementById("fetchProducts").addEventListener("click", async () => {
  try {
    const response = await fetch("/products/all");
    const products = await response.json();
    const productList = document.getElementById("productList");
    productList.innerHTML = "";
    products.forEach((product) => {
      const listItem = document.createElement("li");
      listItem.textContent = `SKU: ${product.sku}, Nombre: ${product.name}, Precio: ${product.price}`;
      productList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error:", error);
  }
});
