<template>
  <div class="div">
    <h1>Inicie Sesión</h1>
    <form @submit.prevent="login">
      <label class="label" for="user_id">INGRESE SU ID:</label>
      <input 
        class="input"
        type="text" 
        placeholder="Ingrese su id" 
        id="user_id" 
        v-model="user_id"
        required
      />

      <button class="button" type="submit">Ingresar</button>
    </form>

    <AppNotification
        ref="notification"
        :message="notificationMessage"
        :id="notificationId"
      />
  </div>
</template>

<script>
import AppNotification from '@/components/AppNotification.vue'

export default {
  name: 'LoginWallet',
  components:{
    AppNotification
  },
  data() {
    return {
      user_id: '',
      notificationMessage: '',
      notificationId: 1,
    };
  },
  methods: {
    login() {
      const alphanumerico = /^[a-zA-Z0-9]+$/;

      if(!alphanumerico.test(this.user_id)){
        this.showNotification('Debe contener caracteres alfanumericos', 1);
      }else{
        this.$store.commit('setUserId', this.user_id);
        this.$router.push('/MenuPrincipal')
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
  .div{
    display: grid;
    place-items: center;
  }
  .textoError{
    color: red;
  }
  .input{
    color: darkgreen;
    text-decoration: none;
    padding: 10px 15px;
    transition: background-color 0.3s, color 0.3s;
    border: 1px solid darkgreen;
    background-color: black;
  }
  .input::placeholder{
    color: darkgreen;
  }
  .input:focus{
    border-color: darkgreen;
    outline: none;
  }
  .label{
    margin-right: 10px;
  }
  .button{
    margin-left: 35%;
    color: darkgreen;
    text-decoration: none;
    padding: 10px 15px;
    transition: background-color 0.3s, color 0.3s;
    border: 1px solid darkgreen;
    background-color: black;
    margin-top: 20px;
  }
  .button:hover {
    background-color: white;
    color: darkgreen;
  }
</style>