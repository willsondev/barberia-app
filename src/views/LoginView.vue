<template>
  <div class="flex flex-col min-h-screen overflow-hidden">
    <div class="relative flex-1 bg-cover bg-center" style="background-image: url('/img/login2.jpeg'); height: 50vh;">
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="relative z-10 flex flex-col items-center justify-center text-white p-4 h-full">
        <h1 class="text-4xl font-bold">Iniciar Sesión</h1>
      </div>
    </div>

    <form @submit.prevent="login" class="max-w-md mx-auto p-4 rounded-lg shadow-md mt-4">
      <h2 class="text-2xl font-bold text-center mb-4">Bienvenido de nuevo</h2>
      
      <input v-model="email" placeholder="Correo electrónico" required class="border text-black border-gray-300 rounded-md p-2 mb-4 w-full" />
      <input v-model="password" type="password" placeholder="Contraseña" required class="text-black border border-gray-300 rounded-md p-2 mb-4 w-full" />
      
      <button type="submit" class="bg-gray-800 text-white rounded-md p-2 hover:bg-gray-600 transition duration-200 w-full">
        Iniciar Sesión
      </button>
      <p class="mt-2 text-center">¿No tienes una cuenta? <router-link to="/registro" class="text-blue-500">Regístrate</router-link></p>
    </form>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useToast } from 'vue-toastification';

export default {
  data() {
    return {
      email: '',
      password: '',
      role: '' // Agregar la propiedad role
    };
  },
  methods: {
    async login() {
      const toast = useToast();
      const auth = getAuth();
      const db = getFirestore();
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        // Obtener el documento del usuario de Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          this.role = userDoc.data().role; // Obtener el rol
          toast.success(`Inicio de sesión exitoso como ${this.role}`); // Notificación de éxito
          
          // Redirigir según el rol
          if (this.role === 'admin') {
            this.$router.push('/admin'); // Redirige a la página de admin
          } else {
            this.$router.push('/'); // Redirige a la página principal
          }
        } else {
          toast.error('No se encontró el usuario en Firestore.'); // Notificación de error
        }
      } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        toast.error(error.message); // Notificación de error
      }
    }
  }
};
</script>

<style scoped>
/* No se requiere CSS adicional ya que se usa Tailwind */
</style>
