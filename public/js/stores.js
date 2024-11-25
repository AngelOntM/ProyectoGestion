$(document).ready(function () {
  let storesData = []; // Variable para almacenar los datos de las tiendas

  // Configuración de DataTable
  $("#datatable1").DataTable({
    ajax: {
      url: "api/stores",
      type: "GET",
      dataSrc: function (json) {
        storesData = json; // Guardar todos los datos de la tienda en la variable storesData
        console.log(storesData);
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
            <div class="d-inline-flex align-items-center">
              <button class="btn btn-warning btn-md edit-btn me-2 d-flex justify-content-center align-items-center p-2" data-email="${row.email}" title="Editar">
                <i class="material-icons" style="font-size: 24px; margin: 0 auto;">edit</i>
              </button>
              <button class="btn btn-danger btn-md delete-btn d-flex justify-content-center align-items-center p-2" data-email="${row.email}" title="Eliminar">
                <i class="material-icons" style="font-size: 24px; margin: 0 auto;">delete</i>
              </button>
            </div>
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
        customClass: {
          popup: "custom-swal-popup", // Clase para el cuadro
          title: "custom-swal-title", // Clase para el título
          htmlContainer: "custom-swal-content", // Clase para el contenido del mensaje
          confirmButton: "swal2-confirm btn-success", // Clase para el botón de confirmación
          cancelButton: "swal2-cancel btn-danger", // Clase para el botón de cancelar
        },
      });
    }
  });

  // Manejo del botón de eliminar
  $("#datatable1").on("click", ".delete-btn", function () {
    const email = $(this).data("email");

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el producto de forma permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#dc3545",
      customClass: {
        popup: "custom-swal-popup", // Clase para el cuadro
        title: "custom-swal-title", // Clase para el título
        htmlContainer: "custom-swal-content", // Clase para el contenido del mensaje
        confirmButton: "swal2-confirm btn-success", // Clase para el botón de confirmación
        cancelButton: "swal2-cancel btn-danger", // Clase para el botón de cancelar
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteStore(email);
      }
    });
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

    console.log(formData);
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
          customClass: {
            popup: "custom-swal-popup", // Clase para el cuadro
            title: "custom-swal-title", // Clase para el título
            htmlContainer: "custom-swal-content", // Clase para el contenido del mensaje
            confirmButton: "swal2-confirm btn-success", // Clase para el botón de confirmación
            cancelButton: "swal2-cancel btn-danger", // Clase para el botón de cancelar
          },
        });

        // Cerrar el modal y recargar la tabla
        $("#editStoreModal").modal("hide");
        $("#datatable1").DataTable().ajax.reload();
        console.log("Recargando tabla");
        console.log(storesData);
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

  // Manejo del formulario para crear una nueva tienda
  $("#createStoreForm").on("submit", function (e) {
    e.preventDefault(); // Evitar el comportamiento por defecto

    const formData = {
      name: $("#name").val().trim(),
      address: $("#address").val().trim(),
      postal_number: $("#postal_number").val().trim(),
      email: $("#email").val().trim(),
      phone: $("#phone").val().trim(),
    };

    // Hacer una solicitud para crear una nueva tienda
    $.ajax({
      url: "api/stores",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function () {
        Swal.fire({
          icon: "success",
          title: "Tienda creada",
          text: "La tienda se ha creado correctamente.",
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: "custom-swal-popup", // Clase para el cuadro
            title: "custom-swal-title", // Clase para el título
            htmlContainer: "custom-swal-content", // Clase para el contenido del mensaje
            confirmButton: "swal2-confirm btn-success", // Clase para el botón de confirmación
            cancelButton: "swal2-cancel btn-danger", // Clase para el botón de cancelar
          },
        });

        // Limpiar los campos del formulario y recargar la tabla
        $("#createStoreForm")[0].reset();
        $("#datatable1").DataTable().ajax.reload();
        console.log("Recargando tabla");
        console.log(storesData);

        // Cerrar el modal
        $("#createStoreModal").modal("hide");
      },
      error: function (xhr) {
        const errorText =
          xhr.status === 409
            ? "El nombre o email ya existen. Intenta con otros valores."
            : "Ocurrió un error al crear la tienda.";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorText,
          customClass: {
            popup: "custom-swal-popup", // Clase para el cuadro
            title: "custom-swal-title", // Clase para el título
            htmlContainer: "custom-swal-content", // Clase para el contenido del mensaje
            confirmButton: "swal2-confirm btn-success", // Clase para el botón de confirmación
            cancelButton: "swal2-cancel btn-danger", // Clase para el botón de cancelar
          },
        });
      },
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
          text: "La tienda se ha eliminado correctamente.",
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: "custom-swal-popup", // Clase para el cuadro
            title: "custom-swal-title", // Clase para el título
            htmlContainer: "custom-swal-content", // Clase para el contenido del mensaje
            confirmButton: "swal2-confirm btn-success", // Clase para el botón de confirmación
            cancelButton: "swal2-cancel btn-danger", // Clase para el botón de cancelar
          },
        });

        // Recargar la tabla
        $("#datatable1").DataTable().ajax.reload();
      },
      error: function () {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al eliminar la tienda.",
          customClass: {
            popup: "custom-swal-popup", // Clase para el cuadro
            title: "custom-swal-title", // Clase para el título
            htmlContainer: "custom-swal-content", // Clase para el contenido del mensaje
            confirmButton: "swal2-confirm btn-success", // Clase para el botón de confirmación
            cancelButton: "swal2-cancel btn-danger", // Clase para el botón de cancelar
          },
        });
      },
    });
  }
});
