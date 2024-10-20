<template>
  <BarraNavegacion/>
  <div class="compra-cripto">
    <h1>Compra de Criptomoneda</h1>
    <form @submit.prevent="guardarCompra" class="formulario-compra">
      <label for="cripto">Criptomoneda:</label>
      <select id="cripto" v-model="cripto" required>
        <option value="btc">Bitcoin</option>
        <option value="eth">Ethereum</option>
        <option value="usdc">USDC</option>
      </select>

      <label for="cantidad">Ingrese la cantidad:</label>
      <input type="number" id="cantidad" v-model="cantidad" step="0.0001" required />

      <label for="fecha">Ingrese la fecha:</label>
      <input type="datetime-local" id="fecha" v-model="fecha" required />

      <label for="monto">Ingrese el monto en Pesos Argentinos:</label>
      <input type="number" id="monto" v-model="monto" step="0.01" required />

      <button type="submit" class="boton-compra">Comprar</button>
    </form>

    <AppNotification ref="notification" :message="notificationMessage" :id="notificationId" />
  </div>
  </template>
  
<script>
  import apiAxios from '@/service/apiAxios'
  import BarraNavegacion from '@/components/BarraNavegacion.vue'
  import AppNotification from '@/components/AppNotification.vue'

  export default {
    name: 'CompraAltaWallet',
    components: {
      BarraNavegacion,
      AppNotification
    },
    data() {
      return {
        cripto: 'btc',
        cantidad: null,
        fecha: '',
        monto: null,
        notificationMessage: '',
        notificationId: 3,
      };
    },
    methods: {
        async guardarCompra() {
          if(this.monto > 0 && this.cantidad > 0){
              const datos={
                user_id: this.$store.state.user_id,
                action: 'purchase',
                crypto_code: this.cripto,
                crypto_amount: this.cantidad,
                money: this.monto,
                datetime: this.fecha,
            };

            try {
              const response = await apiAxios.post('/transactions', datos);    
              this.showNotification('Se Guardo la compra: '+ response.data?.crypto_amount + " - Crypto: " + response.data?.crypto_code, 3);

              setTimeout(() => {
                this.$router.push('/MenuPrincipal');
              }, 5000);
            } catch (error) {
              this.showNotification(error+' - Error al intentar guardar', 2);
            }
          }else{
            this.showNotification('El monto y la cantidad de cripto deben ser mayor a $0', 1)
          }
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
.compra-cripto {
  background-color: black;
  padding: 20px;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 10px;
}

.compra-cripto h1 {
  color: darkgreen;
  margin-bottom: 20px;
}

.formulario-compra {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.formulario-compra label {
  color: white;
  font-weight: bold;
}

.formulario-compra input,
.formulario-compra select {
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

.formulario-compra input:focus,
.formulario-compra select:focus {
  background-color: white;
  color: darkgreen;
}

.boton-compra {
  padding: 10px 20px;
  background-color: darkgreen;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.boton-compra:hover {
  background-color: white;
  color: darkgreen;
}

@media (max-width: 600px) {
  .formulario-compra input,
  .formulario-compra select {
    max-width: 100%;
  }
}
</style>