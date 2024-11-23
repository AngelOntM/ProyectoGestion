$(document).ready(function () {
  let productsData = []; // Almacena los datos de los productos

  // Configuración de DataTable
  $("#datatable1").DataTable({
    ajax: {
      url: "api/products", // Endpoint para obtener productos
      type: "GET",
      dataSrc: function (json) {
        productsData = json; // Guardar los datos obtenidos
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
            <button class="btn btn-warning btn-sm edit-btn" data-sku="${row.sku}" title="Editar">
              <i class="material-icons">edit</i>
            </button>
            <button class="btn btn-danger btn-sm delete-btn" data-sku="${row.sku}" title="Eliminar">
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
    const sku = $(this).data("sku");

    console.log(sku);
    // Buscar los datos del producto usando el SKU
    const product = productsData.find((product) => product.sku === sku);

    console.log(product);
    if (product) {
      // Rellenar los campos del formulario en el modal con los datos obtenidos
      $("#editProductSku").val(product.sku); // Usamos el SKU como identificador
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
      });
    }
  });

  // Manejo del formulario para editar el producto
  $("#editProductForm").on("submit", function (e) {
    e.preventDefault(); // Evitar el comportamiento por defecto

    const formData = {
      name: $("#editName").val().trim(),
      price: parseFloat($("#editPrice").val().trim()),
      quantity: parseInt($("#editQuantity").val().trim()),
      description: $("#editDescription").val().trim(),
    };

    const sku = $("#editProductSku").val().trim();

    // Hacer una solicitud para actualizar el producto
    $.ajax({
      url: `api/products/${encodeURIComponent(sku)}`, // El SKU se envía como parte de la URL
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
        });
      },
    });
  });

  // Manejo del botón eliminar
  $("#datatable1").on("click", ".delete-btn", function () {
    const sku = $(this).data("sku");
    console.log(sku);
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el producto de forma permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#dc3545",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(sku);
      }
    });
  });

  // Función para eliminar un producto
  function deleteProduct(sku) {
    $.ajax({
      url: `api/products/${encodeURIComponent(sku)}`,
      type: "DELETE",
      success: function () {
        Swal.fire({
          icon: "success",
          title: "Producto eliminado",
          text: "El producto ha sido eliminado con éxito.",
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
              ? "No se encontró ningún producto con ese SKU."
              : "Ocurrió un error al eliminar el producto.",
        });
      },
    });
  }
});
