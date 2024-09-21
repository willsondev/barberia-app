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

  // Si el usuario no está autenticado y no intenta acceder a login o registro
  if (!user && to.path !== '/login' && to.path !== '/registro') {
    next({ path: '/login' });
  } 
  // Si la ruta requiere autenticación y el usuario no está logueado
  else if (to.meta.requiresAuth && !user) {
    next({ path: '/login' });
  } 
  // Si la ruta requiere un rol de administrador y el usuario no es administrador
  else if (to.meta.requiresAdmin && (!user || !(await isAdmin(user.uid)))) {
    next({ path: '/', query: { error: 'access_denied' } });
  } 
  // Permitir el acceso si no se cumplen las restricciones anteriores
  else {
    next();
  }
});

async function isAdmin(uid) {
  const db = getFirestore();
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists() && userDoc.data().role === 'admin';
}

// Función de logout
router.logout = () => {
  signOut(getAuth()).then(() => {
    // Redirigir a la página de login
    router.push({ path: '/login' });
  });
};

export default router;
