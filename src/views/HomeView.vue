<template>
  <div class="container -mt-7">
    <span class="content">
      <span class="n_1">B</span>
      <span class="n_2">A</span>
      <span class="n_3">R</span>
      <span class="n_4">B</span>
      <span class="n_5">E</span>
      <span class="n_6">R</span>
      <span class="n_7">S</span>
      <span class="n_8">H</span>
      <span class="n_9">O</span>
      <span class="n_10">P</span>
    </span>
  </div>
  <div class="flex justify-center lg:hidden w-30 h-10 -mt-24"><img src="../../public/img/3.png" alt=""></div>

  <!-- Imagen que se muestra solo en pantallas pequeñas -->
  <div class="h-[50vh] block lg:hidden">
    <img class="h-[70%] w-full object-cover object-bottom" src="../../public/img/incio.jpeg" alt="">
  </div>

  <div class="grid grid-cols-3 text-center lg:mt-32 -mt-24 border">
    <div class="flex flex-col items-center border">
      <h1 class="text-xl font-bold">INICIO</h1>
      <img src="../../public/img/1-footer.jpeg" alt="" class="w-24 h-24 rounded-full border-2 border-gray-800 filter grayscale brightness-90">
      <router-link to="/" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-0.5 mb-2 mt-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
        inicio
      </router-link>
    </div>
    <div class="flex flex-col items-center border">
      <h1 class="text-xl font-bold">SERVICIOS</h1>
      <img src="../../public/img/2-footer.jpeg" alt="" class="w-24 h-24 rounded-full border-2 border-gray-800 filter grayscale brightness-90">
      <router-link to="/servicios" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-0.5 mb-2 mt-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
        servicios
      </router-link>
    </div>
    <div class="flex flex-col items-center border">
      <h1 class="text-xl font-bold">RESERVAS</h1>
      <img src="../../public/img/3-footer.jpeg" alt="" class="w-24 h-24 rounded-full border-2 border-gray-800 filter grayscale brightness-90">
      <router-link to="/reservas" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-0.5 mb-2 mt-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
        reservar
      </router-link>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Chivo:wght@900&display=swap');

.container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 20vh; 
  overflow: hidden;
  padding-top: -20px;
}

.content {
  display: block;
  text-align: center;
}

span {
  display: inline-block;
  font-size: 8vw; 
  font-family: 'Chivo', sans-serif;
  font-weight: 900;
  margin: -2px;
  text-shadow: 
    0 2px 5px rgba(0, 0, 0, 0.3), 
    0 0 25px rgba(204, 204, 204, 0.5); 
}


@media (max-width: 600px) {
  span {
    font-size: 12vw; 
  }
  
  .content > span {
    margin: 0; 
  }

  .content > span:nth-child(1) {
    transform: translateX(0) translateY(20px) rotate(-10deg);
  }
  .content > span:nth-child(2) {
    transform: translateX(0) translateY(10px) rotate(-5deg);
  }
  .content > span:nth-child(3) {
    transform: translateX(0) translateY(5px) rotate(-4deg);
  }
  .content > span:nth-child(4) {
    transform: translateX(0) translateY(0px) rotate(-2deg);
  }
  .content > span:nth-child(5) {
    transform: translateX(0) translateY(0px) rotate(0deg);
  }
  .content > span:nth-child(6) {
    transform: translateX(0) translateY(0px) rotate(0deg);
  }
  .content > span:nth-child(7) {
    transform: translateX(0) translateY(0px) rotate(6deg);
  }
  .content > span:nth-child(8) {
    transform: translateX(0) translateY(5px) rotate(10deg);
  }
  .content > span:nth-child(9) {
    transform: translateX(0) translateY(10px) rotate(15deg);
  }
  .content > span:nth-child(10) {
    transform: translateX(0) translateY(20px) rotate(20deg);
  }
}
</style>
