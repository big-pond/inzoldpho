<template>
  <div class="app">
    <h2>🗺️ Окрестности Инжавино 70-е &mdash; 00-е</h2>
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
          <p><span style="color: red; font-size: 1.5em;">&#9679;</span> - место съемки; 
            <span style="color: #2980b9; letter-spacing: 2px; font-weight: bold; font-size: 1.5em;">-----</span> - направление съемки.
          </p>
        </div>
        <div class="info-panel" v-else>
          <p>👈 Выберите фотографию, чтобы увидеть место съёмки на карте</p>
        </div>
        <MapView 
          :lat="selectedPhoto?.lat" 
          :lon="selectedPhoto?.lon" 
          :direct="selectedPhoto?.direct"
        />
      </div>
    </div>
    <!-- Лайтбокс -->
    <Lightbox 
      :visible="lightboxVisible"
      :photos="photos"
      :currentIndex="currentPhotoIndex"
      @close="closeLightbox"
      @update:currentIndex="currentPhotoIndex = $event"
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
const currentPhotoIndex = ref(0) // ИНДЕКС: Отслеживает текущую фотографию
// const lightboxImageUrl = ref('')
// const lightboxAlt = ref('')
// const lightboxCaption = ref('')

onMounted(async () => {
  try {
    const response = await fetch('./gallery.json')
    let data = await response.json()
    data = sortPhotos(data) // Сортируем
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
  // Находим порядковый номер фотографии в отсортированном массиве
  const index = photos.value.findIndex(p => p.id === photo.id)
  // Если нашли, сохраняем индекс, иначе ставим 0
  currentPhotoIndex.value = index !== -1 ? index : 0
  
  lightboxVisible.value = true
  console.log('lightboxVisible:', lightboxVisible.value)  

  // console.log('openLightbox called', photo)
  // lightboxImageUrl.value = `./images/${photo.image}`
  // lightboxAlt.value = photo.description
  // lightboxCaption.value = `${photo.description} ${formatFullDate(photo)}`
  // lightboxVisible.value = true
  // console.log('lightboxVisible:', lightboxVisible.value)
}

function closeLightbox() {
  lightboxVisible.value = false
}

function formatFullDate(photo) {
  let date = `${photo.year} год`
  if (photo.month && photo.day) date += `, ${monthStr(photo.month)} месяц, ${photo.day} число`
  else if (photo.month) date += `, ${monthStr(photo.month)} месяц`
  return date
}

function sortPhotos(photos) {
  return [...photos].sort((a, b) => {
    if (a.year != b.year) return (a.year || Infinity) - (b.year || Infinity)
    const monthA = a.month ?? Infinity
    const monthB = b.month ?? Infinity
    if (monthA !== monthB) return monthA - monthB
    const dayA = a.day ?? Infinity
    const dayB = b.day ?? Infinity
    return dayA - dayB
  })
}

import { watch } from 'vue'

// Следим за изменением индекса в лайтбоксе. 
// Когда пользователь листает фото, обновляем активную фотографию для карты
watch(currentPhotoIndex, (newIndex) => {
  if (photos.value[newIndex]) {
    selectedPhoto.value = photos.value[newIndex]
  }
})

</script>

<style scoped>

* {
  box-sizing: border-box;
}

.app {
  height: 100vh; /* Вся высота окна браузера */
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden; /* Запрещаем скролл на уровне .app */
}

h2 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-weight: 500;
  letter-spacing: -0.3px;
  flex-shrink: 0; /* Заголовок не сжимается */
}

.gallery-container {
  display: flex;
  gap: 24px;
  flex: 1; /* Растягивается на оставшееся пространство */
  min-height: 0; /* Ключевое свойство - разрешает сжатие */
  overflow: hidden; /* Запрещаем переполнение */
}

.gallery-list {
  flex: 1;
  min-width: 280px;
  min-height: 0; /* Важно для внутренней прокрутки */
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.map-area {
  flex: 1.2;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0; /* Важно для правильной работы flexbox */
  overflow: hidden; /* Запрещаем переполнение */
}

.info-panel {
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  font-size: 14px;
  flex-shrink: 0; /* Панель информации не сжимается */
}

.info-panel h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #2c3e50;
}

.info-panel p {
  margin: 4px 0;
  color: #555;
}

@media (max-width: 768px) and (orientation: portrait) {
  
  .app {
    padding: 12px;
    height: 100vh; /* Возвращаем жесткую высоту во весь экран */
    /* Поддержка современных мобильных браузеров, где 100vh включает динамические панели */
    height: 100dvh; 
    overflow: hidden; /* Запрещаем общий скролл страницы */
  }

  h2 {
    font-size: 18px;
    margin-top: 4px;
    margin-bottom: 12px;
  }
  .gallery-container {
    flex-direction: column;
    gap: 12px;
    flex: 1;
    min-height: 0; /* Важно, чтобы контейнер мог сжиматься */
}
  
  .gallery-list {
    flex: 1;       /* Займет ровно половину оставшегося места */
    width: 100%;
    min-height: 0; /* УБРАНО min-height: 300px, разрешаем сжатие */
  }

  .map-area {
    flex: 1.2;     /* Займет чуть больше половины (под карту) */
    width: 100%;
    min-height: 0; /* УБРАНО min-height: 300px, разрешаем сжатие */
    gap: 8px;
  }

  .info-panel {
    padding: 8px 12px;
  } 

  .info-panel h3 {
    font-size: 14px;
  }
  
  .info-panel p {
    font-size: 11px;
  }
}

@media (max-width: 768px) and (orientation: landscape) {

  .app {
    padding: 8px 12px;
    height: 100vh;
    height: 100dvh; /* Гарантирует точный размер на iOS/Android */
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  h2 {
    font-size: 16px;
    margin-top: 0px;
    margin-bottom: 8px; /* Сильно уменьшаем заголовок, чтобы сэкономить высоту */
    text-align: left;   /* Смещаем влево, чтобы смотрелось компактнее */
  }


  .gallery-container {
    flex-direction: row; /* Галерея слева, карта справа */
    gap: 12px;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
  
  .gallery-list {
    flex: 1;
    min-width: 220px; /* Слегка сужаем галерею, давая простор карте */
    max-width: 320px; 
    min-height: 0;
  }
  
  .map-area {
    flex: 1.5; /* Отдаем карте приоритет по ширине */
    min-width: 280px;
    min-height: 0;
    gap: 8px;
  }

  .info-panel {
    padding: 6px 10px;
    font-size: 12px;
    border-radius: 8px;
  }
  
  .info-panel h3 {
    font-size: 13px;
    margin-bottom: 2px;
    /* Если название длинное, в ландшафте лучше спрятать хвост в одну строку */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .info-panel p {
    margin: 2px 0;
    font-size: 11px;
  }
  
}

</style>
