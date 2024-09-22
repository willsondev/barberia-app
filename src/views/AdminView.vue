<template>
  <div class="admin max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Panel de Administración</h1>

    <!-- Acordeón para el formulario de servicios -->
    <div class="accordion mb-6">
      <div class="accordion-header bg-gray-200 p-4 rounded-t-lg cursor-pointer flex justify-between items-center" 
           @click="toggleAccordion('serviceForm')">
        <h2 class="text-2xl font-semibold text-black">{{ isEditing ? 'Editar servicio' : 'Agregar nuevo servicio' }}</h2>
        <span class="text-xl">{{ accordion.serviceForm ? '-' : '+' }}</span>
      </div>
      <div v-if="accordion.serviceForm" class="accordion-content bg-white p-6 rounded-b-lg shadow-md">
        <form @submit.prevent="submitService">
          <input v-model="currentService.nombre" placeholder="Nombre del corte" required 
            class="border text-black border-gray-300 rounded-md p-2 mb-4 w-full"
          />
          <input v-model="currentService.descripcion" placeholder="Descripción" required 
            class="border text-black border-gray-300 rounded-md p-2 mb-4 w-full"
          />
          <input type="number" v-model="currentService.duracion" placeholder="Duración (minutos)" required 
            class="border text-black border-gray-300 rounded-md p-2 mb-4 w-full"
          />
          <input type="number" v-model="currentService.precio" placeholder="Precio ($)" required 
            class="border text-black border-gray-300 rounded-md p-2 mb-4 w-full"
          />
          <input type="file" @change="handleFileChange" 
            class="border border-gray-300 rounded-md p-2 mb-4 w-full"
          />
          <img v-if="imagePreview" :src="imagePreview" alt="Vista previa de la imagen" 
            class="w-40 h-40 object-cover mt-2 mb-4 rounded-lg shadow"
          />
          <button type="submit" 
            class="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200 w-full"
          >
            {{ isEditing ? 'Actualizar Servicio' : 'Agregar Servicio' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Acordeón para servicios existentes -->
    <div class="accordion mb-6">
      <div class="accordion-header bg-gray-200 p-4 rounded-t-lg cursor-pointer flex justify-between items-center" 
           @click="toggleAccordion('services')">
        <h2 class="text-2xl font-semibold text-black">Servicios existentes</h2>
        <span class="text-xl">{{ accordion.services ? '-' : '+' }}</span>
      </div>
      <div v-if="accordion.services" class="accordion-content bg-white p-6 rounded-b-lg shadow-md">
        <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <li v-for="(service) in services" :key="service.id" 
              class="flex flex-col justify-between p-4 mb-4 border rounded-md overflow-hidden">
            <div>
              <p class="font-semibold text-lg mb-2 text-black">Nombre: {{ service.nombre }}</p>
              <p class="font-semibold text-lg mb-2 text-black">Descripción: {{ service.descripcion }}</p>
              <p class="text-sm mb-4 text-black">Precio: ${{ service.precio }}</p>
            </div>
            <div class="flex space-x-2">
              <button @click="editService(service)" 
                class="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Editar
              </button>
              <button @click="deleteService(service.id)" 
                class="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-200"
              >
                Eliminar
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Acordeón para reservas -->
    <div class="accordion">
      <div class="accordion-header bg-gray-200 p-4 rounded-t-lg cursor-pointer flex justify-between items-center" 
           @click="toggleAccordion('reservations')">
        <h2 class="text-2xl font-semibold text-black">Reservas realizadas</h2>
        <span class="text-xl">{{ accordion.reservations ? '-' : '+' }}</span>
      </div>
      <div v-if="accordion.reservations" class="accordion-content bg-white p-6 rounded-b-lg shadow-md">
        <ul>
          <li v-for="(reservation) in reservations" :key="reservation.id" 
              class="flex flex-col p-4 mb-4 border rounded-md">
            <p class="font-semibold text-black">Nombre: {{ reservation.name }}</p>
              <p class="font-semibold text-black">Teléfono: {{ reservation.phoneNumber }}</p>
             <p class="font-semibold text-black">Hora: {{ reservation.time }}</p>
              <p class="font-semibold text-black">Dirección: {{ reservation.address }}</p>
               <p class="font-semibold text-black">{{ reservation.service }}</p>
            <p class="font-semibold text-black">{{ reservation.date }}</p>
            <button @click="deleteReservation(reservation.id)" 
              class="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-200 mt-2"
            >
              Eliminar
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { db, storage } from '@/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from 'vue-toastification';

export default {
  setup() {
    const toast = useToast(); 

    return { toast }; 
  },
  data() {
    return {
      currentService: {
        id: '',
        nombre: '',
        descripcion: '',
        duracion: '',
        precio: '',
        imagen: ''
      },
      services: [],
      reservations: [],
      isEditing: false,
      imagePreview: null,
      imageFile: null,
      accordion: {
        serviceForm: true,
        services: false,
        reservations: false
      }
    };
  },
  created() {
    this.fetchServices();
    this.fetchReservations();
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
    async fetchReservations() {
      try {
        const querySnapshot = await getDocs(collection(db, 'reservations'));
        this.reservations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error('Error al cargar las reservas:', error);
        this.toast.error('No se pudieron cargar las reservas. Intenta de nuevo más tarde.'); 
      }
    },
    async submitService() {
      if (!this.currentService.nombre || !this.currentService.descripcion || !this.currentService.duracion || !this.currentService.precio) {
        this.toast.error('Por favor completa todos los campos'); 
        return;
      }

      try {
        let imageURL = this.currentService.imagen;

        if (this.imageFile) {
          const storageRef = ref(storage, `service_images/${this.imageFile.name}`);
          const snapshot = await uploadBytes(storageRef, this.imageFile);
          imageURL = await getDownloadURL(snapshot.ref);
        }

        if (this.isEditing) {
          const serviceDoc = doc(db, 'services', this.currentService.id);
          await updateDoc(serviceDoc, {
            nombre: this.currentService.nombre,
            descripcion: this.currentService.descripcion,
            duracion: this.currentService.duracion,
            precio: this.currentService.precio,
            imagen: imageURL
          });
          this.toast.success('Servicio actualizado con éxito'); 
          this.isEditing = false;
        } else {
          await addDoc(collection(db, 'services'), {
            nombre: this.currentService.nombre,
            descripcion: this.currentService.descripcion,
            duracion: this.currentService.duracion,
            precio: this.currentService.precio,
            imagen: imageURL
          });
          this.toast.success('Servicio agregado con éxito'); 
        }

        this.resetForm();
        this.fetchServices();
      } catch (error) {
        console.error('Error al agregar/actualizar el servicio:', error);
        this.toast.error('Ocurrió un error al guardar el servicio. Intenta de nuevo más tarde.'); 
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      this.imageFile = file;

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    editService(service) {
      this.currentService = { ...service };
      this.isEditing = true;
      this.imagePreview = service.imagen; 
    },
    async deleteService(serviceId) {
      try {
        const serviceDoc = doc(db, 'services', serviceId);
        await deleteDoc(serviceDoc);
        this.toast.success('Servicio eliminado con éxito'); 
        this.fetchServices();
      } catch (error) {
        console.error('Error al eliminar el servicio:', error);
        this.toast.error('Ocurrió un error al eliminar el servicio. Intenta de nuevo más tarde.'); 
      }
    },
    async deleteReservation(reservationId) {
      try {
        const reservationDoc = doc(db, 'reservations', reservationId);
        await deleteDoc(reservationDoc);
        this.toast.success('Reserva eliminada con éxito'); 
        this.fetchReservations();
      } catch (error) {
        console.error('Error al eliminar la reserva:', error);
        this.toast.error('Ocurrió un error al eliminar la reserva. Intenta de nuevo más tarde.'); 
      }
    },
    toggleAccordion(accordionName) {
      this.accordion[accordionName] = !this.accordion[accordionName];
    },
    resetForm() {
      this.currentService = {
        id: '',
        nombre: '',
        descripcion: '',
        duracion: '',
        precio: '',
        imagen: ''
      };
      this.imageFile = null;
      this.imagePreview = null;
    }
  }
};
</script>


<style scoped>
.accordion {
  margin-bottom: 1rem;
}
</style>
