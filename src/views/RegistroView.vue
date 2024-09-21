<template>
  <div class="flex flex-col min-h-screen overflow-hidden">
    <div class="relative flex-1 bg-cover bg-center" style="background-image: url('/img/registro.jpeg'); height: 50vh;">
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="relative z-10 flex flex-col items-center justify-center text-white p-4 h-full">
        <h1 class="text-4xl font-bold">Registro</h1>
      </div>
    </div>

    <form @submit.prevent="register" class="max-w-md mx-auto p-4 rounded-lg shadow-md mt-4">
      <h2 class="text-2xl font-bold text-center mb-4">Crea tu cuenta</h2>
      
      <input v-model="email" placeholder="Correo electrónico" required class="text-black border border-gray-300 rounded-md p-2 mb-4 w-full" />
      <input v-model="password" type="password" placeholder="Contraseña" required class="text-black border border-gray-300 rounded-md p-2 mb-4 w-full" />
      
      <button type="submit" class="bg-gray-800 text-white rounded-md p-2 hover:bg-gray-600 transition duration-200 w-full">
        Registrarse
      </button>
      <p class="mt-2 text-center">¿Ya tienes una cuenta? <router-link to="/login" class="text-blue-500">Inicia sesión</router-link></p>
    </form>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { useToast } from 'vue-toastification';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async register() {
      const toast = useToast();
      const auth = getAuth();
      const db = getFirestore();
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        // Crear un documento en Firestore con el rol
        await setDoc(doc(db, 'users', user.uid), {
          email: this.email,
          role: 'user' 
        });

        toast.success('Registro exitoso');
        this.$router.push('/login');
      } catch (error) {
        console.error('Error en el registro:', error);
        toast.error(error.message);
      }
    }
  }
};
</script>

<style scoped>

</style>
