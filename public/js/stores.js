document
  .getElementById("createStoreForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const postal_number = document.getElementById("postal_number").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    const storeData = {
      name,
      address,
      postal_number,
      email,
      phone,
    };

    try {
      const response = await fetch("/stores/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storeData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Tienda creada exitosamente");
      } else {
        alert("Error al crear la tienda: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

document
  .getElementById("deleteStoreForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const identifier = document.getElementById("identifier").value;

    try {
      const response = await fetch(`/stores/${identifier}`, {
        method: "DELETE",
      });
      const data = await response.json();
      alert(data.deleted ? "Tienda eliminada" : "Error al eliminar la tienda");
    } catch (error) {
      console.error("Error:", error);
    }
  });

document.getElementById("fetchStores").addEventListener("click", async () => {
  try {
    const response = await fetch("/stores");
    const stores = await response.json();
    const storeList = document.getElementById("storeList");
    storeList.innerHTML = "";
    stores.forEach((store) => {
      const listItem = document.createElement("li");
      listItem.textContent = `Nombre: ${store.name}, Email: ${store.email}`;
      storeList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error:", error);
  }
});
