$(document).ready(function () {
  let storesData = []; // Variable para almacenar los datos de las tiendas

  // Configuración de DataTable
  $("#datatable1").DataTable({
    ajax: {
      url: "api/stores",
      type: "GET",
      dataSrc: function (json) {
        storesData = json; // Guardar todos los datos de la tienda en la variable storesData
        return json;
      },
    },
    columns: [
      { data: "name", title: "Nombre" },
      { data: "address", title: "Dirección" },
      { data: "postal_number", title: "Código Postal" },
      { data: "email", title: "Correo Electrónico" },
      { data: "phone", title: "Teléfono" },
      {
        data: null,
        title: "Acciones",
        render: function (data, type, row) {
          return `
            <button class="btn btn-warning btn-sm edit-btn" data-email="${row.email}" title="Editar">
              <i class="material-icons">edit</i>
            </button>
            <button class="btn btn-danger btn-sm delete-btn" data-email="${row.email}" title="Eliminar">
              <i class="material-icons">delete</i>
            </button>
          `;
        },
      },
    ],
    language: {
      url: "//cdn.datatables.net/plug-ins/2.1.8/i18n/es-ES.json",
    },
  });

  // Manejo del botón de editar
  $("#datatable1").on("click", ".edit-btn", function () {
    const email = $(this).data("email");

    // Buscar los datos de la tienda usando el email
    const store = storesData.find((store) => store.email === email);

    if (store) {
      // Rellenar los campos del formulario en el modal con los datos obtenidos
      $("#editStoreId").val(store.email); // Usamos el email como ID
      $("#editName").val(store.name);
      $("#editAddress").val(store.address);
      $("#editPostalNumber").val(store.postal_number);
      $("#editEmail").val(store.email);
      $("#editPhone").val(store.phone);

      // Abrir el modal
      $("#editStoreModal").modal("show");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró la tienda con ese correo electrónico.",
      });
    }
  });

  // Manejo del formulario para editar la tienda
  $("#editStoreForm").on("submit", function (e) {
    e.preventDefault(); // Evitar el comportamiento por defecto

    const formData = {
      name: $("#editName").val().trim(),
      address: $("#editAddress").val().trim(),
      postal_number: $("#editPostalNumber").val().trim(),
      email: $("#editEmail").val().trim(),
      phone: $("#editPhone").val().trim(),
    };

    // Hacer una solicitud para actualizar la tienda
    $.ajax({
      url: `api/stores/${encodeURIComponent(formData.email)}`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function () {
        Swal.fire({
          icon: "success",
          title: "Tienda actualizada",
          text: "Los datos de la tienda se han actualizado correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });

        // Cerrar el modal y recargar la tabla
        $("#editStoreModal").modal("hide");
        $("#datatable1").DataTable().ajax.reload();
      },
      error: function (xhr) {
        const errorText =
          xhr.status === 409
            ? "El nombre o email ya existen. Intenta con otros valores."
            : "Ocurrió un error al actualizar la tienda.";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorText,
        });
      },
    });
  });

  // Manejo del botón eliminar
  $("#datatable1").on("click", ".delete-btn", function () {
    const email = $(this).data("email");

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la tienda de forma permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#dc3545",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteStore(email);
      }
    });
  });

  // Función para eliminar una tienda
  function deleteStore(email) {
    $.ajax({
      url: `api/stores/${encodeURIComponent(email)}`,
      type: "DELETE",
      success: function () {
        Swal.fire({
          icon: "success",
          title: "Tienda eliminada",
          text: "La tienda ha sido eliminada con éxito.",
          timer: 2000,
          showConfirmButton: false,
        });
        $("#datatable1").DataTable().ajax.reload();
      },
      error: function (xhr) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            xhr.status === 404
              ? "No se encontró ninguna tienda con ese correo electrónico."
              : "Ocurrió un error al eliminar la tienda.",
        });
      },
    });
  }
});
