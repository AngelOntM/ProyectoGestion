$(document).ready(async function () {
  // Función para cargar las tiendas y renderizarlas en la tabla
  async function loadStores() {
    try {
      const response = await fetch("/stores"); // Llama a tu endpoint de tiendas
      const stores = await response.json();
      const tableBody = $("#datatable1 tbody");
      tableBody.empty(); // Limpia el contenido existente

      // Rellenar la tabla con los datos de las tiendas
      stores.forEach((store) => {
        const row = `
            <tr>
              <td>${store.name}</td>
              <td>${store.address}</td>
              <td>${store.postalCode}</td>
              <td>${store.email}</td>
              <td>${store.phone}</td>
              <td>
                <button class="btn btn-warning btn-sm me-2" title="Editar">
                  <i class="material-icons">edit</i>
                </button>
                <button class="btn btn-danger btn-sm" title="Eliminar">
                  <i class="material-icons">delete</i>
                </button>
              </td>
            </tr>
          `;
        tableBody.append(row);
      });
    } catch (error) {
      console.error("Error al cargar las tiendas:", error);
    }
  }

  // Llama a la función para cargar datos
  await loadStores();

  $(document).ready(async function () {
    // Función para cargar las tiendas y renderizarlas en la tabla
    async function loadStores() {
      try {
        const response = await fetch("/stores"); // Llama a tu endpoint de tiendas
        const stores = await response.json();
        const tableBody = $("#datatable1 tbody");
        tableBody.empty(); // Limpia el contenido existente

        // Rellenar la tabla con los datos de las tiendas
        stores.forEach((store) => {
          const row = `
            <tr>
              <td>${store.name}</td>
              <td>${store.address}</td>
              <td>${store.postalCode}</td>
              <td>${store.email}</td>
              <td>${store.phone}</td>
              <td>
                <button class="btn btn-warning btn-sm me-2" title="Editar">
                  <i class="material-icons">edit</i>
                </button>
                <button class="btn btn-danger btn-sm" title="Eliminar">
                  <i class="material-icons">delete</i>
                </button>
              </td>
            </tr>
          `;
          tableBody.append(row);
        });
      } catch (error) {
        console.error("Error al cargar las tiendas:", error);
      }
    }

    // Llama a la función para cargar datos
    await loadStores();

    // Inicializar DataTable después de cargar los datos
    $("#datatable1").DataTable({
      language: {
        url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json", // Cambia la versión si es necesario
      },
    });
  });
});

document
  .getElementById("createStoreForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    // Obtener los valores del formulario
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
      // Realizar la petición POST
      const response = await fetch("/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storeData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Tienda creada exitosamente");

        // Limpiar el formulario
        document.getElementById("createStoreForm").reset();

        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("createStoreModal")
        );
        modal.hide();

        // Recargar la tabla
        await loadStores();
      } else if (response.status === 400) {
        // Error de validación
        alert(
          "Error de validación: " +
            data.error.map((err) => err.message).join(", ")
        );
      } else if (response.status === 409) {
        // Error de duplicados
        alert("Error: " + data.message);
      } else {
        // Otro error
        alert("Error al crear la tienda: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al intentar crear la tienda.");
    }
  });
