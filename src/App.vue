<template>
  <div class="app">
    <h2>🗺️ Окрестности Инжавино 70-е, 80-е, 90-е</h2>
    <div class="gallery-container">
      <div class="gallery-list">
        <PhotoGallery 
          :photos="photos" 
          :selectedPhoto="selectedPhoto"
          @select-photo="onSelectPhoto"
          @open-lightbox="openLightbox"
        />
      </div>
      <div class="map-area">
        <div class="info-panel" v-if="selectedPhoto">
          <h3>{{ selectedPhoto.description }}</h3>
          <p>📅 {{ formatFullDate(selectedPhoto) }}</p>
          <!-- <p>📍 Координаты: {{ selectedPhoto.lat.toFixed(5) }}, {{ selectedPhoto.lon.toFixed(5) }}</p> -->
          <!-- <p>🧭 Направление: {{ selectedPhoto.direct?.toFixed(1) }}°</p> -->
        </div>
        <div class="info-panel" v-else>
          <p>👈 Выберите фотографию, чтобы увидеть место съёмки на карте</p>
        </div>
        <MapView 
          :lat="selectedPhoto?.lat" 
          :lon="selectedPhoto?.lon" 
          :direct="selectedPhoto?.direct"
        />
        <p>Для просмотра фото кликните на выделенной миниатюре</p>
      </div>
    </div>
    <!-- Лайтбокс -->
    <Lightbox 
      :visible="lightboxVisible"
      :imageUrl="lightboxImageUrl"
      :alt="lightboxAlt"
      :caption="lightboxCaption"
      @close="closeLightbox"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PhotoGallery from './components/PhotoGallery.vue'
import MapView from './components/MapView.vue'
import Lightbox from './components/Lightbox.vue'
import { monthStr } from './utils/dateUtils'

const photos = ref([])
const selectedPhoto = ref(null)

// Лайтбокс
const lightboxVisible = ref(false)
const lightboxImageUrl = ref('')
const lightboxAlt = ref('')
const lightboxCaption = ref('')

onMounted(async () => {
  try {
    const response = await fetch('./gallery.json')
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

function openLightbox(photo) {
  console.log('openLightbox called', photo)
  lightboxImageUrl.value = `./images/${photo.image}`
  lightboxAlt.value = photo.description
  lightboxCaption.value = `${photo.description} ${formatFullDate(photo)}`
  lightboxVisible.value = true
  console.log('lightboxVisible:', lightboxVisible.value)
}

function closeLightbox() {
  lightboxVisible.value = false
}

function formatFullDate(photo) {
  let date = `${photo.year} год`
  if (photo.month && photo.day) date += `, ${photo.month} месяц, ${photo.day}`
  else if (photo.month) date += `, ${monthStr(photo.month)} месяц`
  return date
}
</script>
