<template>
  <div class="app">
    <h1>🗺️ Фотогалерея с картой мест съёмки</h1>
    <div class="gallery-container">
      <div class="gallery-list">
        <PhotoGallery 
          :photos="photos" 
          :selectedPhoto="selectedPhoto"
          @select-photo="onSelectPhoto"
        />
      </div>
      <div class="map-area">
        <div class="info-panel" v-if="selectedPhoto">
          <h3>{{ selectedPhoto.description }}</h3>
          <p>📅 {{ formatFullDate(selectedPhoto) }}</p>
          <p>📍 Координаты: {{ selectedPhoto.lat.toFixed(5) }}, {{ selectedPhoto.lon.toFixed(5) }}</p>
          <p>🧭 Направление: {{ selectedPhoto.direct?.toFixed(1) }}°</p>
        </div>
        <div class="info-panel" v-else>
          <p>👈 Выберите фотографию, чтобы увидеть место съёмки на карте</p>
        </div>
        <MapView 
          :lat="selectedPhoto?.lat" 
          :lon="selectedPhoto?.lon" 
          :direct="selectedPhoto?.direct"
          :key="selectedPhoto?.id"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PhotoGallery from './components/PhotoGallery.vue'
import MapView from './components/MapView.vue'

const photos = ref([])
const selectedPhoto = ref(null)

onMounted(async () => {
  try {
    const response = await fetch('/gallery.json')
    const data = await response.json()
    photos.value = data
    if (data.length) selectedPhoto.value = data[0]
  } catch (err) {
    console.error('Ошибка загрузки gallery.json', err)
  }
})

function onSelectPhoto(photo) {
  selectedPhoto.value = photo
}

function formatFullDate(photo) {
  let date = `${photo.year}`
  if (photo.month && photo.day) date += `-${photo.month}-${photo.day}`
  else if (photo.month) date += `, месяц ${photo.month}`
  return date
}
</script>
