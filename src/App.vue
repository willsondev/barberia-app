<template>

  <div id="app" class="flex flex-col min-h-screen bg-[#151A1E] dark:text-gray-100">
    <header class="p-4 bg-[#151A1E] text-white">
      <div class="container flex justify-between items-center mx-auto">
       <router-link to="/" aria-label="Back to homepage" class="flex flex-col items-center" rel="noopener noreferrer">
  <img class="h-12 w-35" src="../public/img/4.png" alt="Logo de la barbería">
</router-link>

<router-link to="/" aria-label="Back to homepage" class="flex flex-col items-center" rel="noopener noreferrer">
  <h1 class="text-xl font-bold">Barbería</h1>
  <img class="h-7 w-30" src="../public/img/2.png" alt="Logo adicional">
</router-link>


        <button title="Menu" type="button" class="p-4 md:hidden" @click="toggleMobileMenu" v-if="!isLoginRoute">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        <!-- Menú para pantallas grandes -->
        <nav v-if="!isLoginRoute" class="hidden md:flex space-x-6">
          <router-link v-if="isLoggedIn" to="/" class="hover:text-red-500 font-semibold">Inicio</router-link>
          <router-link v-if="isLoggedIn" to="/servicios" class="hover:text-red-500 font-semibold">Servicios</router-link>
          <router-link v-if="isLoggedIn" to="/reservas" class="hover:text-red-500 font-semibold">Reservas</router-link>
          <router-link v-if="isLoggedIn" to="/contacto" class="hover:text-red-500 font-semibold">Contacto</router-link>
          <router-link v-if="isLoggedIn && isUserAdmin" to="/admin" class="hover:text-red-500 font-semibold">Admin</router-link>
          <router-link v-if="!isLoggedIn" to="/login" class="hover:text-red-500 font-semibold">Login</router-link>
          <router-link v-if="!isLoggedIn" to="/registro" class="hover:text-red-500 font-semibold">Registro</router-link>
          <button v-if="isLoggedIn" @click="logout" class="hover:text-red-500 font-semibold">Cerrar Sesión</button>
        </nav>
      </div>

      <!-- Menú móvil -->
      <nav v-if="isMobileMenuOpen && !isLoginRoute" class="md:hidden w-full right-0 top-16 bg-gray-800 p-4">
        <router-link v-if="isLoggedIn" to="/" class="block hover:text-red-500 font-semibold" @click="toggleMobileMenuClose">Inicio</router-link>
        <router-link v-if="isLoggedIn" to="/servicios" class="block hover:text-red-500 font-semibold" @click="toggleMobileMenuClose">Servicios</router-link>
        <router-link v-if="isLoggedIn" to="/reservas" class="block hover:text-red-500 font-semibold" @click="toggleMobileMenuClose">Reservas</router-link>
        <router-link v-if="isLoggedIn" to="/contacto" class="block hover:text-red-500 font-semibold" @click="toggleMobileMenuClose">Contacto</router-link>
        <router-link v-if="isLoggedIn && isUserAdmin" to="/admin" class="block hover:text-red-500 font-semibold" @click="toggleMobileMenuClose">Admin</router-link>
        <router-link v-if="!isLoggedIn" to="/login" class="block hover:text-red-500 font-semibold" @click="toggleMobileMenuClose">Login</router-link>
        <router-link v-if="!isLoggedIn" to="/registro" class="block hover:text-red-500 font-semibold" @click="toggleMobileMenuClose">Registro</router-link>
        <button v-if="isLoggedIn" @click="logout" class="block hover:text-red-500 font-semibold">Cerrar Sesión</button>
      </nav>
    </header>

    <main class="flex-grow p-4 overflow-auto">
      <router-view></router-view>
    </main>

   <footer class="p-4 bg-[#151A1E] text-white text-center">
  <p>© {{ currentYear }} Barbería Moderna. Todos los derechos reservados.</p>
</footer>

  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default {
  name: 'App',
  data() {
    return {
      isMobileMenuOpen: false,
      isUserAdmin: false,
      isLoginRoute: false,
      isLoggedIn: false,
      currentYear: new Date().getFullYear(), 
    };
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    toggleMobileMenuClose() {
      this.isMobileMenuOpen = false;
    },
    async logout() {
      const auth = getAuth();
      await auth.signOut();
      this.$router.push('/login');
      this.isLoggedIn = false;
    },
    async checkUserRole() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          this.isUserAdmin = true;
        }
      }
    },
  },
  watch: {
    $route(to) {
      this.isLoginRoute = to.name === 'login';
    },
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.isLoggedIn = !!user;
      if (user) {
        this.checkUserRole();
      }
    });
  },
}
</script>

<style scoped>
* {
  box-sizing: border-box; 
}

body {
  margin: 0; 
}

nav a {
  padding: 10px 15px;
  display: block;
}
</style>
