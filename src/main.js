
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  
import Toast from 'vue-toastification';  
import 'vue-toastification/dist/index.css';  
import './main.css';

const app = createApp(App);


app.use(router);


const options = {
  
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

app.use(Toast, options);  

app.mount('#app');
