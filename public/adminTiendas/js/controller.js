const app = Vue.createApp({
    data() {
      return {
        tiendas: [],
        nuevaTienda: {
            nombre: "",
            descripcion: "",
            clave: "",
            rfc: ""
        },
        mensaje: "",
        mostrar: false,
        errorMensaje: false,
        loader: true
      }
    },
    methods: {
        async sleep(time) {
            return new Promise((resolve, reject) => {
                setTimeout(() =>{
                    resolve(true)
                }, time);
            });
        },
        async ocultarLoader() {
            await this.sleep(1000);
            this.loader = false;
        },
        async crearTienda($event) {
            $event.preventDefault();
            this.loader = true;
            
            //Request
            const tienda = Object.assign({}, this.nuevaTienda);
            try {
                await axios.post('/stores/new', tienda, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                this.mensaje = "Se creó la tienda :D";
                this.errorMensaje = false;
            } catch(error) {
                this.mensaje = "No se ha podido crear la tienda";
                this.errorMensaje = true;
            } finally {
                this.mostrar = true;
                await this.actualizarTiendas();
            }
        },
        async actualizarTiendas() {
            this.loader = true;
            let result = await axios.get('/stores/all');
            this.tiendas = result.data;
            await this.ocultarLoader();
        },
        async borrarTienda(clave) {
            this.loader = true;
            try {
                await axios.delete( `/stores/${clave}`, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                this.mensaje = "Se eliminó la tienda :D";
                this.errorMensaje = false;
            } catch(error) {
                this.mensaje = "No se ha podido eliminar la tienda";
                this.errorMensaje = true;
            } finally {
                this.mostrar = true;
                await this.actualizarTiendas();
            }
        }
    },
    mounted() {
        this.actualizarTiendas();
    }
}).mount('#app')