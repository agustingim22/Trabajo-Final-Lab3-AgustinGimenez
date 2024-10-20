<template>  
    <BarraNavegacion/>
    <div>
        <h1 style="text-align: center;"> Análisis de la Inversion de tu Wallet</h1>
        <table class="custom-table">
            <thead>
                <tr>
                    <th>Criptomoneda</th>
                    <th>Resultado</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="this.resultadoBtc != 0">
                    <td>Bitcoin</td>
                    <td>{{ formatearNumero(this.resultadoBtc) }}</td>
                </tr>
                <tr v-if="this.resultadoEth != 0">
                    <td>Ethereum</td>
                    <td>{{ formatearNumero(this.resultadoEth) }}</td>
                </tr>
                <tr v-if="this.resultadoUsdc != 0">
                    <td>USDC</td>
                    <td>{{ formatearNumero(this.resultadoUsdc) }}</td>
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
        name: 'AnalisisInversion',
        components: {
            AppNotification,
            BarraNavegacion
        },
        data() {
            return {
                notificationMessage: '',
                notificationId: 3,
                todasTransacciones: [],
                resultadoBtc: 0,
                resultadoEth: 0,
                resultadoUsdc: 0,
                valorActualBtc: 0,
                valorActualUsdc: 0,
                valorActualEth: 0,
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

                        this.valorActualBtc = (await getCryptoValues('btc')).ask;
                        if(this.valorActualBtc === 0){
                            this.showNotification(`Error al obtener el valor actual de el Bitcoin`, 2)
                        }
                        
                        this.valorActualUsdc = (await getCryptoValues('usdc')).ask;
                        if(this.valorActualUsdc === 0){
                            this.showNotification(`Error al obtener el valor actual de el USDC`, 2)
                        }

                        this.valorActualEth = (await getCryptoValues('eth')).ask;
                        if(this.valorActualEth === 0){
                            this.showNotification(`Error al obtener el valor actual de el Ethereum`, 2)
                        }



                        this.todasTransacciones.forEach(transaccion => {

                            if(transaccion.crypto_code === 'btc'){
                                this.resultadoBtc = transaccion.action === 'sale'
                                    ? transaccion.money - (this.valorActualBtc * transaccion.crypto_amount)
                                    : (this.valorActualBtc * transaccion.crypto_amount) - transaccion.money;

                            }else if(transaccion.crypto_code === 'eth'){
                                this.resultadoEth = transaccion.action === 'sale'
                                    ? transaccion.money - (this.valorActualEth * transaccion.crypto_amount)
                                    : (this.valorActualEth * transaccion.crypto_amount) - transaccion.money;

                            }else if(transaccion.crypto_code === 'usdc'){
                                this.resultadoUsdc = transaccion.action === 'sale'
                                    ? transaccion.money - (this.valorActualUsdc * transaccion.crypto_amount)
                                    : (this.valorActualUsdc * transaccion.crypto_amount) - transaccion.money;

                            }else{
                                this.showNotification(`Esta transacción tiene un cryptoCode incorrecto. Id de transacción ${transaccion._id} - CryptoCode: ${transaccion.crypto_code}`, 1)
                            }
                        });

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

