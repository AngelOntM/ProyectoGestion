const app = Vue.createApp({
  data() {
    return {
      productos: [],
      nuevoProducto: {
        nombre: "",
        precio: "",
        stock: "",
      },
      mensaje: "",
      mostrar: false,
      errorMensaje: false,
      loader: true,
    };
  },
  methods: {
    async crearProducto($event) {
      // Similar al método crearTienda, pero adaptado a productos
    },
    async actualizarProductos() {
      // Método para actualizar la lista de productos
    },
    async borrarProducto(id) {
      // Método para borrar un producto
    },
  },
  mounted() {
    this.actualizarProductos();
  },
}).mount("#app");
