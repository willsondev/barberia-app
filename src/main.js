// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // Importa el router
import Toast from 'vue-toastification';  // Importa Vue Toastification
import 'vue-toastification/dist/index.css';  // Importa los estilos de Toastification
import './main.css';

const app = createApp(App);

// Usa el router
app.use(router);

// Configura el plugin de notificaciones
const options = {
  // Puedes personalizar las opciones aquí
  position: 'top-right',
  timeout: 2000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
};

app.use(Toast, options);  // Usa el plugin de notificaciones

app.mount('#app');
