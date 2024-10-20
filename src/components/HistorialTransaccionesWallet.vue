<template>
    <BarraNavegacion/>
    <div class="transacciones-container">
        <div v-if="!detallesTransaccion && !edicionTransaccionSeleccionada">
            <div v-for="transaccion in todasTransacciones" :key="transaccion._id" class="transaccion-card">
                <h1 class="transaccion-titulo">TRANSACCION DEL DÍA: {{ formatDate(transaccion.datetime) }}</h1>
                <h2 class="transaccion-tipo">Tipo de Transaccion: {{ transaccion.action === 'purchase' ? 'COMPRA' : 'VENTA' }} - ({{ transaccion.crypto_code.toUpperCase() }})</h2>

                <div class="transaccion-botones">
                    <button class="transaccion-boton" @click="leerDetallesTransaccion(transaccion)">Leer Detalles</button>
                    <button class="transaccion-boton" @click="editarTransaccionRealizada(transaccion)">Modificar Transaccion</button>
                    <button class="transaccion-boton eliminar-boton" @click="eliminarTransaccionRealizada(transaccion)">Eliminar Transaccion</button>
                </div>
            </div>
        </div>

        <div v-if="detallesTransaccion" class="detalles-container">
            <hr>
                <h2>Transacción (Fecha: {{ formatDate(detallesTransaccion.datetime) }}, Tipo: {{ detallesTransaccion.action === 'purchase' ? 'COMPRA' : 'VENTA' }})</h2>  
                <h4>Detalles:</h4>
                <p>Criptomoneda: {{ detallesTransaccion.crypto_code.toUpperCase() }}</p>
                <p>Cantidad: {{ formatearNumero(detallesTransaccion.crypto_amount) }}</p>
                <p>Monto en Pesos: $ {{ formatearNumero(detallesTransaccion.money) }}</p>

                <button class="transaccion-boton cerrar-boton" @click="cerrarDetallesTransaccion">Cerrar Detalles</button>
            <hr>
        </div>

        <div v-if="edicionTransaccionSeleccionada" class="editar-container">
            <h1>Editar Transacción</h1>
            <form @submit.prevent="guardarEdicionTransaccion" class="formulario-edicion">
                <label for="action">Ingrese Acción:</label>
                <input type="text" v-model="transaccionPorEditar.action" id="action" name="action" required>

                <label for="crypto_code">Ingrese Criptomoneda:</label>
                <input type="text" v-model="transaccionPorEditar.crypto_code" id="crypto_code" name="crypto_code" required>

                <label for="crypto_amount">Ingrese Cantidad:</label>
                <input type="number" v-model="transaccionPorEditar.crypto_amount" id="crypto_amount" name="crypto_amount" step="0.0001" required>

                <label for="datetime">Fecha:</label>
                <input type="datetime-local" v-model="transaccionPorEditar.datetime" id="datetime" name="datetime" required>

                <label for="money">Ingrese Monto en Pesos:</label>
                <input type="number" v-model="transaccionPorEditar.money" id="money" name="money" step="0.01" required>

                <button class="boton-edicion" type="submit">Confirmar Edición</button>
                <button class="boton-edicion cancelar-boton" @click="cerrarEdicion">Cancelar Edición</button>
            </form>
        </div> 

        <AppNotification ref="notification" :message="notificationMessage" :id="notificationId" />
    </div>
</template>

<script>
    import apiAxios  from '@/service/apiAxios';
    import BarraNavegacion from '@/components/BarraNavegacion'
    import AppNotification from '@/components/AppNotification.vue'
    
    export default {
        name: 'HistorialTransaccionesWallet',
        components:{
            BarraNavegacion,
            AppNotification
        },
        data() {
            return {
                todasTransacciones: [],
                detallesTransaccion: null,
                edicionTransaccionSeleccionada: null,
                transaccionPorEditar: {},
                notificationMessage: '',
                notificationId: 3,
            };
        },
        
        created() {
            this.cargarMovimientos();
        },

        methods: {
            formatDate: function (datetime) {
                const date = new Date(datetime);
                const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'America/Argentina/Buenos_Aires' };
                return date.toLocaleDateString('es-AR', options);
            },

            async cargarMovimientos() {
                try {
                    if(this.$store.state.user_id != null){
                        this.todasTransacciones = (await apiAxios.get(`/transactions?q={"user_id": "${this.$store.state.user_id}"}`)).data;
                        if(!this.todasTransacciones || this.todasTransacciones.length === 0){
                            this.showNotification(`No se registraron transacciones con el Id ${this.$store.state.user_id}`, 2);
                        }
                    }else{
                        this.showNotification(`Debe ingresar su Id`, 2)
                        setTimeout(() => {
                            this.$router.push('/');
                        }, 5000);
                    }
                } catch (error) {
                    this.showNotification('Error al cargar el historial de movimientos: '+ error, 2);
                }
            },

            leerDetallesTransaccion(transaccion) {
                this.cerrarEdicion();
                this.detallesTransaccion = this.todasTransacciones.find(t => t._id === transaccion._id);   
            },
            
            cerrarDetallesTransaccion() {
                this.detallesTransaccion = null;
            },
            
            async editarTransaccionRealizada(transaccion) {
                this.cerrarDetallesTransaccion();
                const transaccion1 = this.todasTransacciones.find(t => t._id === transaccion._id);
                    if (transaccion1) {
                        this.transaccionPorEditar = { ...transaccion1 };
                        this.edicionTransaccionSeleccionada = transaccion1._id;
                    }
                
            },

            async guardarEdicionTransaccion() {
                try {
                    if(this.transaccionPorEditar.crypto_amount > 0 && this.transaccionPorEditar.money > 0){
                        if(this.transaccionPorEditar.action != "sale" && this.transaccionPorEditar.action != "purchase"){
                            this.showNotification('La acción a realizar debe ser "sale" o "purchase"', 2);
                        }else{
                            const datos={
                                user_id: this.$store.state.user_id,
                                action: this.transaccionPorEditar.action,
                                crypto_code: this.transaccionPorEditar.crypto_code,
                                crypto_amount: this.transaccionPorEditar.crypto_amount,
                                money: this.transaccionPorEditar.money,
                                datetime: this.transaccionPorEditar.datetime,
                            };

                            await apiAxios.patch(`/transactions/${this.edicionTransaccionSeleccionada}`, datos);
                            this.showNotification('Se editó la transacción ID('+ this.edicionTransaccionSeleccionada +')', 3);
                        }
                        this.cerrarEdicion();
                        this.cargarMovimientos();
                    }
                    else{
                        this.showNotification('Debe ingresar un monto de cripto y pesos superior a 0', 1);

                        this.cerrarEdicion();
                        this.cargarMovimientos();
                    }                
                } catch (error) {
                    this.showNotification('Error al guardar los cambios: '+ error, 2);
                }
            },
            
            cerrarEdicion() {
                this.edicionTransaccionSeleccionada = null;
                this.transaccionPorEditar = {};
            },

            async eliminarTransaccionRealizada(transaccion) {
                this.cerrarEdicion();
                this.cerrarDetallesTransaccion();
                try {
                    await apiAxios.delete(`/transactions/${transaccion._id}`);
                    this.cargarMovimientos();
                    this.showNotification('Se eliminó la transacción ID('+ transaccion._id +')', 3)
                } catch (error) {
                    this.showNotification('Error al eliminar la transacción: '+ error, 2);
                }
            },

            formatearNumero(value) {
                let [numero, decimal] = Number(value).toFixed(4).toString().split(".");

                numero = numero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

                decimal = decimal ? "," + decimal : "";

                return (numero + decimal).toString();
            },

            showNotification(message, id) {
                this.notificationMessage = message;
                this.notificationId = id;
                this.$refs.notification.show();
            },
        },
    };
</script>


<style scoped>
.transacciones-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.transaccion-card {
    background-color: #f9f9f9;
    padding: 15px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.transaccion-titulo {
    font-size: 20px;
    margin-bottom: 10px;
}

.transaccion-tipo {
    font-size: 18px;
    color: #555;
    margin-bottom: 10px;
}

.transaccion-botones {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.transaccion-boton {
    background-color: darkgreen;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.transaccion-boton:hover {
    background-color: darkgreen;
}

.eliminar-boton {
    background-color: #dc3545;
}

.eliminar-boton:hover {
    background-color: #c82333;
}

.detalles-container {
    background-color: #f1f1f1;
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
}

.editar-container {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
    border: 1px solid #ddd;
}

.cerrar-boton, .cancelar-boton {
    background-color: #6c757d;
}

.cerrar-boton:hover, .cancelar-boton:hover {
    background-color: #5a6268;
}

.editar-transaccion {
    background-color: black;
    padding: 20px;
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
    border-radius: 10px;
}

.editar-transaccion h1 {
    color: darkgreen;
    margin-bottom: 20px;
}

.formulario-edicion {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.formulario-edicion label {
    color: darkgreen;
    font-weight: bold;
}

.formulario-edicion input {
    width: 100%;
    max-width: 300px;
    padding: 10px;
    background-color: black;
    color: darkgreen;
    border: 2px solid darkgreen;
    border-radius: 5px;
    text-align: center;
    transition: background-color 0.3s, color 0.3s;
}

.formulario-edicion input:focus {
    background-color: white;
    color: darkgreen;
}

.boton-edicion {
    padding: 10px 20px;
    background-color: darkgreen;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
}

.boton-edicion:hover {
    background-color: white;
    color: darkgreen;
}

.cancelar-boton {
    background-color: red;
}

.cancelar-boton:hover {
    background-color: white;
    color: red;
}

@media (max-width: 600px) {
    .formulario-edicion input {
        max-width: 100%;
    }
}
</style>