<template>
    <div class="menu-principal">
        <img class="logo" src="../../public/logoWallet.png" alt="Logo Wallet">
        <h1>Menú Principal</h1>
        <div class="menu-links">
            <router-link class="style-link" to="/CompraAltaWallet">COMPRA CRYPTOS</router-link>
            <router-link class="style-link" to="/VentaAltaWallet">VENDE TUS CRYPTOS</router-link>
            <router-link class="style-link" to="/HistorialTransaccionesWallet">HISTORIAL TRANSACCIONES</router-link>
            <router-link class="style-link" to="/EstadoActual">ESTADO ACTUAL DE TU WALLET</router-link>
            <router-link class="style-link" to="/AnalisisInversion">ANÁLISIS DE LAS INVERSIONES</router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'MenuPrincipal',
        computed: {
            user_id() {
                return this.$store.state.user_id;
            },
        },
    }
</script>

<style scoped>
.menu-principal {
    background-color: black;
    padding: 20px;
    text-align: center;
}

.menu-principal h1 {
    color: darkgreen;
    margin-bottom: 20px;
}

.menu-links {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.style-link {
    display: block;
    width: 100%;
    max-width: 300px;
    padding: 10px;
    color: darkgreen;
    background-color: black;
    text-align: center;
    text-decoration: none;
    border: 1px solid darkgreen;
    transition: background-color 0.3s, color 0.3s;
}

.style-link:hover {
    background-color: white;
    color: darkgreen;
}

@media (max-width: 600px) {
    .style-link {
        max-width: 100%;
    }
}

.logo{
    max-width: 350px;
    margin-bottom: -50px;
  }
</style>
