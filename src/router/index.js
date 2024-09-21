// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import HomeView from '../views/HomeView.vue';
import ServiciosView from '../views/ServiciosView.vue';
import ReservasView from '../views/ReservasView.vue';
import AdminView from '../views/AdminView.vue';
import RegistroView from '../views/RegistroView.vue';
import LoginView from '../views/LoginView.vue';
import ContactoView from '../views/ContactoView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/servicios', component: ServiciosView },
  { path: '/reservas', component: ReservasView },
  { path: '/registro', component: RegistroView },
  { path: '/contacto', component: ContactoView },
  { path: '/login', component: LoginView },
  {
    path: '/admin',
    component: AdminView,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guardián de ruta global
router.beforeEach(async (to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;


  if (!user && to.path !== '/login' && to.path !== '/registro') {
    next({ path: '/login' });
  } 
 
  else if (to.meta.requiresAuth && !user) {
    next({ path: '/login' });
  } 
 
  else if (to.meta.requiresAdmin && (!user || !(await isAdmin(user.uid)))) {
    next({ path: '/', query: { error: 'access_denied' } });
  } 

  else {
    next();
  }
});

async function isAdmin(uid) {
  const db = getFirestore();
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists() && userDoc.data().role === 'admin';
}


router.logout = () => {
  signOut(getAuth()).then(() => {

    router.push({ path: '/login' });
  });
};

export default router;
