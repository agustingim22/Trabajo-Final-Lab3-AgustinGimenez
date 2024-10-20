<template>
    <BarraNavegacion/>
    <div class="venta-cripto">
        <h1>Venta de Criptomoneda</h1>
        <form @submit.prevent="guardarVenta" class="formulario-venta">
            <label for="cripto">Criptomoneda:</label>
            <select id="cripto" v-model="cripto">
                <option value="btc">Bitcoin</option>
                <option value="eth">Ethereum</option>
                <option value="usdc">USDC</option>
            </select>

        <label for="cantidad">Ingrese la cantidad:</label>
        <input type="number" id="cantidad" name="cantidad" v-model="cantidad" step="0.0001" required />

        <label for="fecha">Ingrese la fecha:</label>
        <input type="datetime-local" id="fecha" name="fecha" v-model="fecha" required />

        <label for="monto">Ingrese el monto en Pesos Argentinos:</label>
        <input type="number" id="monto" name="monto" v-model="monto" step="0.01" required />

        <button type="submit" class="boton-venta">Vender</button>
    </form>

    <AppNotification ref="notification" :message="notificationMessage" :id="notificationId" />
  </div>
</template>

<script>
import apiAxios from '@/service/apiAxios'
import BarraNavegacion from '@/components/BarraNavegacion'
import AppNotification from '@/components/AppNotification.vue'

    export default {
        name: 'VentaAltaWallet',
        components:{
            BarraNavegacion,
            AppNotification
        },
        data() {
            return {
                cripto: 'btc',
                cantidad: null,
                monto: null,
                fecha: '',
                transaccionesObtenidas:[],
                notificationMessage: '',
                notificationId: 3,
            };
        },
        methods: {
            async guardarVenta() {              
                if (this.cantidad > 0 && this.monto > 0) {
                    try {                        
                        let cantidadTotal = 0;
                        this.transaccionesObtenidas = (await apiAxios.get(`/transactions?q={"user_id": "${this.$store.state.user_id}"}`)).data;

                        if(this.transaccionesObtenidas.length > 0){                            
                            this.transaccionesObtenidas.forEach(transaccion => {
                                console.log(transaccion)
                                if(transaccion.crypto_code === this.cripto){
                                    cantidadTotal += transaccion.action === 'sale' ? -transaccion.crypto_amount : transaccion.crypto_amount;
                                }
                            });

                            if(cantidadTotal < this.cantidad){
                                this.showNotification('No puede vender más criptomonedas que las que compró. La cantidad de criptomonedas que posee es: ' + cantidadTotal, 1);
                                return;
                            }

                            const datos = {
                                user_id: this.$store.state.user_id,
                                action: 'sale',
                                crypto_code: this.cripto,
                                crypto_amount: this.cantidad,
                                money: this.monto,
                                datetime: this.fecha,
                            };
            
                            try {
                                const response = await apiAxios.post('/transactions', datos);
                                this.showNotification("Transacción completada con éxito! Monto: " + response.data?.crypto_amount + " - Crypto: " + response.data?.crypto_code, 3);

                                setTimeout(() => {
                                    this.$router.push('/MenuPrincipal');
                                }, 5000);
                            } catch (error) {
                                this.showNotification('Error al intentar guardar la transacción', 2);
                            }

                        }else{
                            this.showNotification('No puede vender si no compró antes una criptomoneda', 1);
                            return;
                        }
                    } catch (error) {
                        this.showNotification('Error al intentar obtener listado de transacciones', 2);
                    }
                }else{
                    this.showNotification("El monto y la cantidad de cripto deben ser mayor a $0", 1); 
                }           
            },

            showNotification(message, id) {
                this.notificationMessage = message;
                this.notificationId = id;
                this.$refs.notification.show();
            },
        }
    };
</script>

<style scoped>
.venta-cripto {
  background-color: black;
  padding: 20px;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 10px;
}

.venta-cripto h1 {
  color: darkgreen;
  margin-bottom: 20px;
}

.formulario-venta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.formulario-venta label {
  color: white;
  font-weight: bold;
}

.formulario-venta input,
.formulario-venta select {
  width: 100%;
  max-width: 300px;
  padding: 10px;
  background-color: black;
  color: white;
  border: 1px solid darkgreen;
  border-radius: 5px;
  text-align: center;
  transition: background-color 0.3s, color 0.3s;
}

.formulario-venta input:focus,
.formulario-venta select:focus {
  background-color: white;
  color: darkgreen;
}

.boton-venta {
  padding: 10px 20px;
  background-color: darkgreen;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.boton-venta:hover {
  background-color: white;
  color: darkgreen;
}

@media (max-width: 600px) {
  .formulario-venta input,
  .formulario-venta select {
    max-width: 100%;
  }
}
</style>