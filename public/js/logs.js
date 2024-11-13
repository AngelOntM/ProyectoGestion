const app = Vue.createApp({
  data() {
    return {
      logs: [],
      loader: true,
    };
  },
  methods: {
    async obtenerLogs() {
      // Método para obtener los registros
    },
  },
  mounted() {
    this.obtenerLogs();
  },
}).mount("#app");
