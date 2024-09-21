<template>
  <div class="flex flex-col min-h-screen overflow-hidden">
    <!-- Parte superior con imagen y texto -->
    <div class="relative flex-1 bg-cover bg-center" style="background-image: url('/img/reserva.jpeg'); height: 50vh;">
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="relative z-10 flex flex-col items-center justify-center text-white p-4 h-full mt-20">
        <h1 class="text-4xl font-bold">Reserva tu Servicio</h1>
        <p class="text-lg mt-2">Disfruta de nuestros servicios profesionales para el cuidado personal. Reserva ahora y vive la experiencia.</p>
      </div>
    </div>

    <!-- Formulario de reserva -->
    <form @submit.prevent="submitReservation" class="max-w-md mx-auto p-4 rounded-lg shadow-md mt-4">
      <h2 class="text-2xl font-bold text-center mb-4">Reservar un servicio</h2>
      
      <input 
        v-model="name" 
        placeholder="Ingresa tu Nombre" 
        required 
        class="border text-black border-gray-300 rounded-md p-2 mb-4 w-full"
      />
      
      <input 
        v-model="phoneNumber" 
        placeholder="Número de teléfono o WhatsApp" 
        required 
        class="border text-black border-gray-300 rounded-md p-2 mb-4 w-full"
      />

      <select 
        v-model="selectedService" 
        @change="updateServiceDetails"
        required 
        class="border text-black border-gray-300 rounded-md p-2 mb-4 w-full"
      >
        <option disabled value="">Selecciona un servicio</option>
        <option 
          v-for="service in services" 
          :key="service.id" 
          :value="service.nombre"
        >
          {{ service.nombre }} - ${{ service.precio }}
        </option>
      </select>

      <input 
        type="date" 
        v-model="date" 
        required 
        ref="dateInput" 
        class="border text-black border-gray-300 rounded-md p-2 mb-4 w-full"
      />
      
      <button 
        type="submit" 
        class="bg-green-500 text-white rounded-md p-2 hover:bg-green-600 transition duration-200 w-full"
      >
        Reservar
      </button>
    </form>
  </div>
</template>
<script>

import { db } from '@/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useToast } from 'vue-toastification';

export default {
  data() {
    return {
      name: '',
      phoneNumber: '',
      selectedService: '',
      date: '',
      services: [] 
    };
  },
  setup() {
    const toast = useToast();
    return { toast }; 
  },
  async created() {
    await this.fetchServices(); 
    
    const serviceId = this.$route.query.serviceId; 
    if (serviceId) {
      const selectedService = this.services.find(service => service.id === serviceId);
      if (selectedService) {
        this.selectedService = selectedService.nombre; 
      }
    }
  },
  methods: {
    async fetchServices() {
      try {
        const querySnapshot = await getDocs(collection(db, 'services'));
        this.services = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error('Error al cargar los servicios:', error);
        this.toast.error('No se pudieron cargar los servicios. Intenta de nuevo más tarde.'); 
      }
    },
    async submitReservation() {
      if (!this.selectedService) {
        this.toast.warning('Por favor selecciona un servicio'); 
        return;
      }

      try {
        await addDoc(collection(db, 'reservations'), {
          name: this.name,
          phoneNumber: this.phoneNumber,
          service: this.selectedService,
          date: this.date
        });
        this.toast.success('Reserva realizada con éxito'); 
        this.resetForm();
      } catch (error) {
        console.error('Error al realizar la reserva:', error);
        this.toast.error('No se pudo realizar la reserva. Intenta de nuevo más tarde.'); 
      }
    },
    resetForm() {
      this.name = '';
      this.phoneNumber = '';
      this.selectedService = '';
      this.date = '';
    }
  }
};
</script>

<style scoped>
/* No se requiere CSS adicional ya que se usa Tailwind */
</style>
