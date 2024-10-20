<template>  
    <BarraNavegacion/>
    <div>
        <h1 style="text-align: center;"> Estado Actual de Wallet</h1>
        <table class="custom-table">
            <thead>
                <tr>
                    <th>Criptomoneda</th>
                    <th>Cantidad</th>
                    <th>Dinero</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="mostrarBtc">
                    <td>Bitcoin</td>
                    <td>{{ formatearNumero(this.totalBtc) }}</td>
                    <td>$ {{ formatearNumero(this.totalBtc * this.valorActualBtc) }}</td>
                </tr>
                <tr v-if="mostrarEth">
                    <td>Ethereum</td>
                    <td>{{ formatearNumero(this.totalEth) }}</td>
                    <td>$ {{ formatearNumero(this.totalEth * this.valorActualEth) }}</td>
                </tr>
                <tr v-if="mostrarUsdc">
                    <td>USDC</td>
                    <td>{{ formatearNumero(this.totalUsdc) }}</td>
                    <td>$ {{ formatearNumero(this.totalUsdc * this.valorActualUsdc) }}</td>
                </tr>
                <tr v-if="mostrarTotal">
                    <td colspan="2"><strong>TOTAL</strong></td>
                    <td colspan="3"><strong>$ {{ formatearNumero(this.totalArs) }}</strong></td>
                </tr>
            </tbody>
        </table>

        <AppNotification ref="notification" :message="notificationMessage" :id="notificationId" />
    </div>
</template>

<script>
  import AppNotification from '@/components/AppNotification.vue'
  import BarraNavegacion from '@/components/BarraNavegacion.vue'
  import apiAxios  from '@/service/apiAxios';
  import { getCryptoValues } from '@/service/criptoApi';

    export default {
        name: 'EstadoActual',
        components: {
            AppNotification,
            BarraNavegacion
        },
        data() {
            return {
                notificationMessage: '',
                notificationId: 3,
                todasTransacciones: [],
                totalBtc: 0,
                totalUsdc: 0,
                totalEth: 0,
                valorActualBtc: 0,
                valorActualUsdc: 0,
                valorActualEth: 0,
                mostrarBtc: false,
                mostrarEth: false,
                mostrarUsdc: false,
                mostrarTotal: false,
                totalArs: 0,
            };
        },
        
        created() {
            this.cargarMovimientos();
        },
        
        methods:{
            async cargarMovimientos() {
                try {
                    if(this.$store.state.user_id != null){
                        this.todasTransacciones = (await apiAxios.get(`/transactions?q={"user_id": "${this.$store.state.user_id}"}`)).data;
                        if(!this.todasTransacciones || this.todasTransacciones.length === 0){
                            this.showNotification(`No se registraron transacciones con el Id ${this.$store.state.user_id}. Será redirigido al Menú`, 2);
                            setTimeout(() => {
                                this.$router.push('/MenuPrincipal');
                            }, 5000);
                        }

                        this.todasTransacciones.forEach(transaccion => {
                            if(transaccion.crypto_code === 'btc'){
                                this.totalBtc += transaccion.action === 'sale' ? -transaccion.crypto_amount : transaccion.crypto_amount;
                            }else if(transaccion.crypto_code === 'eth'){
                                this.totalEth += transaccion.action === 'sale' ? -transaccion.crypto_amount : transaccion.crypto_amount;
                            }else if(transaccion.crypto_code === 'usdc'){
                                this.totalUsdc += transaccion.action === 'sale' ? -transaccion.crypto_amount : transaccion.crypto_amount;
                            }else{
                                this.showNotification(`Esta transacción tiene un cryptoCode incorrecto. Id de transacción ${transaccion._id} - CryptoCode: ${transaccion.crypto_code}`, 1)
                            }
                        });

                        if(this.totalBtc > 0){
                            this.valorActualBtc = (await getCryptoValues('btc')).ask;
                            if(this.valorActualBtc === 0){
                                this.showNotification(`Error al obtener el valor actual de el Bitcoin`, 2)
                            }
                            this.mostrarBtc = true;
                        }

                        if(this.totalUsdc > 0){
                            this.valorActualUsdc = (await getCryptoValues('usdc')).ask;
                            if(this.valorActualUsdc === 0){
                                this.showNotification(`Error al obtener el valor actual de el USDC`, 2)
                            }
                            this.mostrarUsdc = true;
                        }

                        if(this.totalEth > 0){
                            this.valorActualEth = (await getCryptoValues('eth')).ask;
                            if(this.valorActualEth === 0){
                                this.showNotification(`Error al obtener el valor actual de el Ethereum`, 2)
                            }
                            this.mostrarEth = true;
                        }

                        if(this.totalBtc === 0 && this.totalEth === 0 && this.totalUsdc === 0){
                            this.showNotification(`Usted no tiene ninguna crypto(${this.$store.state.user_id}). Será redirigido al Menú`, 2);
                            setTimeout(() => {
                                this.$router.push('/MenuPrincipal');
                            }, 5000);
                        }

                        if(this.totalBtc > 0 && this.valorActualBtc > 0){
                            this.totalArs += (this.totalBtc * this.valorActualBtc);
                        }

                        if(this.totalEth > 0 && this.valorActualEth > 0){
                            this.totalArs += (this.totalEth * this.valorActualEth);
                        }

                        if(this.totalUsdc > 0 && this.valorActualUsdc > 0){
                            this.totalArs += (this.totalUsdc * this.valorActualUsdc);
                        }

                        this.mostrarTotal = true;
                        this.showNotification(`Datos cargados con éxito!`, 3)
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
        }
    };
</script>

<style scoped>
.custom-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: black;
    color: darkgreen;
}

.custom-table th, 
.custom-table td {
    border: 1px solid darkgreen;
    padding: 10px;
}

.custom-table tr:nth-child(even) {
    background-color: black;
}

.custom-table tr:hover {
    background-color: darkgreen;
    color: black;
}

.custom-table th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: center;
    background-color: black;
    color: darkgreen;
}
</style>

