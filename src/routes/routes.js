import { createRouter, createWebHistory } from 'vue-router';

import LoginWalletView from '@/views/LoginWalletView.vue';
import CompraAltaWallet from '@/components/CompraAltaWallet.vue';
import VentaAltaWallet from '@/components/VentaAltaWallet.vue'
import MenuPrincipal from '@/components/MenuPrincipal.vue'
import HistorialTransaccionesWallet from '@/components/HistorialTransaccionesWallet.vue';
import EstadoActual from '@/components/EstadoActual.vue';
import AnalisisInversion from '@/components/AnalisisInversion.vue';

const routes = [
    {
      path: '/',
      name: 'InicioSesion',
      component: LoginWalletView,
    },
    {
      path: '/MenuPrincipal',
      name: 'MenuPrincipal',
      component: MenuPrincipal,
    },
    {
      path: '/VentaAltaWallet',
      name: 'VentaAltaWallet',
      component: VentaAltaWallet,
    },
    {
      path: '/CompraAltaWallet',
      name: 'CompraAltaWallet',
      component: CompraAltaWallet,
    },
    {
      path: '/HistorialTransaccionesWallet',
      name: 'HistorialTransaccionesWallet',
      component: HistorialTransaccionesWallet,
    },
    {
      path: '/EstadoActual',
      name: 'EstadoActual',
      component: EstadoActual,
    },
    {
      path: '/AnalisisInversion',
      name: 'AnalisisInversion',
      component: AnalisisInversion
    },
  ];
  
  const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
  });
  
  export default router;