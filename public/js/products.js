$(document).ready(function () {
  let productsData = []; // Almacena los datos de los productos

  // Configuración de DataTable
  $("#datatable1").DataTable({
    ajax: {
      url: "api/products", // Endpoint para obtener productos
      type: "GET",
      dataSrc: function (json) {
        productsData = json; // Guardar los datos obtenidos
        console.log(productsData);
        return json;
      },
    },
    columns: [
      { data: "name", title: "Nombre" },
      { data: "sku", title: "SKU" },
      { data: "price", title: "Precio" },
      { data: "quantity", title: "Cantidad" },
      { data: "description", title: "Descripción" },
      {
        data: null,
        title: "Acciones",
        render: function (data, type, row) {
          return `
            <div class="d-inline-flex align-items-center">
              <button class="btn btn-warning btn-md edit-btn me-2 d-flex justify-content-center align-items-center p-2" data-id="${row._id}" title="Editar">
                <i class="material-icons" style="font-size: 24px; margin: 0 auto;">edit</i>
              </button>
              <button class="btn btn-danger btn-md delete-btn d-flex justify-content-center align-items-center p-2" data-id="${row._id}" title="Eliminar">
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
    const id = $(this).data("id");

    // Buscar los datos del producto usando el SKU
    const product = productsData.find((product) => product._id == id);

    if (product) {
      // Rellenar los campos del formulario en el modal con los datos obtenidos
      $("#editProductId").val(product._id); // Usamos el id como identificador
      $("#editProductSku").val(product.sku);
      $("#editProductName").val(product.name);
      $("#editProductPrice").val(product.price);
      $("#editProductQuantity").val(product.quantity);
      $("#editProductDescription").val(product.description);

      // Abrir el modal
      $("#editProductModal").modal("show");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró el producto con ese SKU.",
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

  // Manejo del formulario para editar el producto
  $("#editProductForm").on("submit", function (e) {
    e.preventDefault(); // Evitar el comportamiento por defecto

    const id = $("#editProductId").val().trim();
    const formData = {
      name: $("#editProductName").val().trim(),
      price: parseFloat($("#editProductPrice").val().trim()),
      quantity: parseInt($("#editProductQuantity").val().trim()),
      description: $("#editProductDescription").val().trim(),
      sku: $("#editProductSku").val().trim(),
    };

    $.ajax({
      url: `api/products/${encodeURIComponent(id)}`, // El SKU se envía como parte de la URL
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function () {
        Swal.fire({
          icon: "success",
          title: "Producto actualizado",
          text: "Los datos del producto se han actualizado correctamente.",
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
        $("#editProductModal").modal("hide");
        $("#datatable1").DataTable().ajax.reload();
      },
      error: function (xhr) {
        const errorText =
          xhr.status === 409
            ? "El SKU ya existe. Intenta con otro valor."
            : "Ocurrió un error al actualizar el producto.";
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

  // Manejo del botón eliminar
  $("#datatable1").on("click", ".delete-btn", function () {
    const id = $(this).data("id");
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
        deleteProduct(id);
      }
    });
  });

  // Manejo del formulario de creación de producto
  $("#createProductForm").on("submit", function (e) {
    e.preventDefault();

    const formData = {
      name: $("#productName").val().trim(),
      sku: $("#productSku").val().trim(),
      description: $("#productDescription").val().trim(),
      price: parseFloat($("#productPrice").val().trim()),
      quantity: parseInt($("#productQuantity").val().trim()),
    };

    $.ajax({
      url: "api/products",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function () {
        Swal.fire({
          icon: "success",
          title: "Producto creado",
          text: "El producto se ha creado correctamente.",
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

        $("#createProductForm")[0].reset();
        $("#datatable1").DataTable().ajax.reload();
        $("#createProductModal").modal("hide");
      },
      error: function (xhr) {
        let errorText = "Ocurrió un error al crear el producto.";
        if (xhr.status === 409) {
          errorText = "El SKU ya existe. Intenta con otro valor.";
        }
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

  // Función para eliminar un producto
  function deleteProduct(id) {
    $.ajax({
      url: `api/products/${encodeURIComponent(id)}`,
      type: "DELETE",
      success: function () {
        Swal.fire({
          icon: "success",
          title: "Producto eliminado",
          text: "El producto ha sido eliminado con éxito.",
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
