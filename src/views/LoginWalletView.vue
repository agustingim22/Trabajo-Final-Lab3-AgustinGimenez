<template>
  <div class="div">
    <img class="logo" src="../../public/logoWallet.png" alt="Logo Wallet">
    <h1>MI WALLET DE CRYPTOMONEDAS</h1>
    <div class="div">
      <LoginWallet/>
    </div>
  </div>
</template>

<script>
import LoginWallet from '@/components/LoginWallet.vue';

export default {
  name: 'LoginWalletView',
  components: {
    LoginWallet,
  },
}; 
</script> 

<style scoped>
  .div{
    display: grid;
    place-items: center;
  }
  .logo{
    max-width: 350px;
    margin-bottom: -50px;
  }
</style>