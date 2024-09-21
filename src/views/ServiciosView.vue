<template>
  <div class="servicios p-4 text-center bg-[#151A1E]">
    <h1 class="text-3xl font-bold text-white mb-6">Servicios</h1>
    
    <!-- Card Principal -->
    <div class="servicio-principal p-4 rounded-xl shadow-lg mb-12 mt-5">
      <img 
        src="../../public/img/servicios.jpeg" 
        alt="Imagen de servicios generales" 
        class="w-full h-64 rounded-lg object-cover cursor-pointer"
        @click="openImageZoom('../../public/img/servicios.jpeg')"
      />
      <p class="bg-[#252324] text-white border-2 border-gray-600 rounded-md p-3 mt-2 w-full">
        Conoce nuestros servicios profesionales, diseñados para ofrecerte la mejor experiencia en cuidado personal.
      </p>
    <router-link 
  to="/reservas" 
  class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-red-500 transition-colors duration-300 ease-in-out focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2 mb-2 mt-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-red-600 dark:hover:border-gray-600 dark:focus:ring-gray-700"
>
  Reservar un Servicio
</router-link>



    </div>

    <!-- Lista de servicios individuales -->
    <div class="lista-servicios grid grid-cols-2 gap-2">
      <div 
        v-for="(servicio, index) in servicios" 
        :key="index" 
        class="servicio-card rounded-lg hover:shadow-lg transition-shadow duration-200 p-0"
      >
        <img 
          v-if="servicio.imagen" 
          :src="servicio.imagen" 
          alt="Imagen del servicio" 
          class="w-full h-40 object-cover rounded-t-lg cursor-pointer"
          @click="openImageZoom(servicio.imagen)"
        />
        <div class="bg-[#252324] text-white p-1 rounded-b-lg">
          <h2 class="text-xl font-bold dark:text-white mb-2">{{ servicio.nombre }}</h2>
          <p class="text-sm text-gray-900 dark:text-white">{{ servicio.descripcion }}</p>
          <p class="text-sm text-gray-900 dark:text-white">Duración: {{ servicio.duracion }} min</p>
          <p class="text-base text-gray-900 dark:text-white mt-2">Precio: ${{ servicio.precio }}</p>
        
        </div>
      </div>
    </div>

    <!-- Modal de Zoom de Imagen -->
    <div 
      v-if="isZoomed" 
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50" 
      @click="closeImageZoom"
    >
      <img 
        :src="zoomedImage" 
        alt="Imagen ampliada" 
        class="max-w-full max-h-full"
      />
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default {
  name: 'ServiciosView',
  data() {
    return {
      servicios: [], 
      isZoomed: false,
      zoomedImage: ''
    };
  },
  async created() {
    await this.fetchServicios(); 
  },
  methods: {
    async fetchServicios() {
      try {
        const querySnapshot = await getDocs(collection(db, 'services'));
        this.servicios = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error('Error al cargar los servicios:', error);
        alert('No se pudieron cargar los servicios. Intenta de nuevo más tarde.');
      }
    },
    goToReserva() {
      this.$router.push({ name: 'reservas' }); 
    },
    reservarServicio(id) {
      this.$router.push({ name: 'reservas', query: { serviceId: id } });
    },
    openImageZoom(image) {
      this.zoomedImage = image;
      this.isZoomed = true;
    },
    closeImageZoom() {
      this.isZoomed = false;
      this.zoomedImage = '';
    }
  }
};
</script>

<style scoped>

</style>
