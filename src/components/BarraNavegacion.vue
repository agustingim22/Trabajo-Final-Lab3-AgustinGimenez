<template>
    <nav class="nav-bar">
        <button class="menu-toggle" @click="toggleMenu" v-if="isMobile">
            {{ menuVisible ? '✖' : '☰' }}
        </button>
        <div :class="['nav-links', { 'nav-links-hidden': !menuVisible && isMobile }]">
            <router-link class="style-link" to="/MenuPrincipal">VOLVER</router-link>
            <router-link class="style-link" to="/CompraAltaWallet">COMPRA CRYPTOS</router-link>
            <router-link class="style-link" to="/VentaAltaWallet">VENDE TUS CRYPTOS</router-link>
            <router-link class="style-link" to="/HistorialTransaccionesWallet">HISTORIAL TRANSACCIONES</router-link>
            <router-link class="style-link" to="/EstadoActual">ESTADO ACTUAL DE TU WALLET</router-link>
            <router-link class="style-link" to="/AnalisisInversion">ANÁLISIS DE LAS INVERSIONES</router-link>
        </div>
        <hr>
    </nav>
</template>

<script>
export default {
    name: 'BarraNavegacion',
    data() {
        return {
            menuVisible: false,
            isMobile: false
        };
    },
    mounted() {
        this.checkScreenSize();
        window.addEventListener('resize', this.checkScreenSize);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkScreenSize);
    },
    methods: {
        toggleMenu() {
            this.menuVisible = !this.menuVisible;
        },
        checkScreenSize() {
            this.isMobile = window.innerWidth <= 1357;
            if (!this.isMobile) {
                this.menuVisible = true;
            }
        }
    }
};
</script>

<style scoped>
.nav-bar {
    background-color: black;
    padding: 10px;
    position: relative;
}

.menu-toggle {
    background: none;
    border: none;
    color: darkgreen;
    font-size: 24px;
    display: none;
    cursor: pointer;
}

.nav-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 10px;
}

.nav-links-hidden {
    display: none;
}

.style-link {
    color: darkgreen;
    text-decoration: none;
    padding: 10px 15px;
    transition: background-color 0.3s, color 0.3s;
    border: 1px solid darkgreen;
    background-color: black;
}

.style-link:hover {
    background-color: white;
    color: darkgreen;
}

@media (max-width: 1357px) {
    .menu-toggle {
        display: block;
    }

    .nav-links {
        flex-direction: column;
        align-items: center;
    }

    .style-link {
        width: 100%;
        text-align: center;
    }
}
.logo{
    max-width: 50px;
    margin-bottom: -50px;
}
</style>
