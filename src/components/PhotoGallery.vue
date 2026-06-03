<template>
  <div class="photo-gallery">
  <div class="photo-grid">
    <div 
      v-for="photo in photos" 
      :key="photo.id"
      class="photo-card"
      :class="{ active: selectedPhoto?.id === photo.id }"
      @click="handleCardClick(photo)"
    >
      <img 
        :src="getThumbUrl(photo.image)" 
        :alt="photo.description"
        class="photo-thumb"
        loading="lazy"
        @error="handleImageError"
      >
      <div class="photo-info">
        <div class="desc">{{ photo.description }}</div>
        <div class="year">{{ formatDate(photo) }}</div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { monthStr } from '../utils/dateUtils'

const props = defineProps({
  photos: Array,
  selectedPhoto: Object
})

const emit = defineEmits(['select-photo', 'open-lightbox'])

function handleCardClick(photo) {
  // Если кликнули по уже выбранной карточке -> открываем лайтбокс
  if (props.selectedPhoto && props.selectedPhoto.id === photo.id) {
    emit('open-lightbox', photo)
  } else {
    // Иначе просто выбираем фото
    emit('select-photo', photo)
  }
}

function getImageUrl(imageName) {
  // изображения лежат в public/images/
  return `./images/${imageName}`
}

function handleImageError(e) {
  e.target.src = './images/placeholder.png'
//   e.target.src = 'https://placehold.co/400x300?text=No+Image'
}

// Путь к миниатюре (добавляем _thumb перед расширением)
function getThumbUrl(imageName) {
  // Разделяем имя на base и расширение
  const lastDot = imageName.lastIndexOf('.')
  if (lastDot === -1) return getImageUrl(imageName)
  const base = imageName.substring(0, lastDot)
  const ext = imageName.substring(lastDot)
  // console.log(`./images/${base}_thumb${ext}`)
  return `./images/${base}_thumb${ext}`
}

function formatDate(photo) {
  if (photo.year) {
    if (photo.month) {
      return `${photo.year} · ${monthStr(photo.month)}`
    }
    return `${photo.year}`
  }
  return 'Дата неизвестна'
}

</script>

<style scoped>

.photo-gallery {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: hidden;
}


.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  grid-auto-rows: max-content; /* строки подстроятся под размер карточек */
  gap: 16px;
  flex: 1;
  min-height: 0;
  overflow-y: auto; /* Включаем прокрутку */
  overflow-x: hidden;
  padding: 2px;
  padding-right: 8px;
  align-content: start;  
}

/* Стили для скроллбара (опционально) */
.photo-grid::-webkit-scrollbar {
  width: 8px;
}

.photo-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.photo-grid::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.photo-grid::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.photo-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 150px;   /* резервируем минимальный размер, пока грузится фото */
}

.photo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.photo-card.active {
  outline: 3px solid #3498db; 
  box-shadow: 0 0 0 3px #3498db;
}

.photo-thumb {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
  flex-shrink: 0;
}

.photo-info {
  padding: 10px;
  flex-grow: 1;        /* ДОБАВЛЕНО: занимает все оставшееся место в карточке */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.photo-info .desc {
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.photo-info .year {
  font-size: 0.8rem;
  color: #777;
}

@media (max-width: 768px) and (orientation: portrait) {
 
  /* Сетка фотографий */
  .photo-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
    height: auto;
    max-height: 50vh;
}

  .photo-card {
    border-radius: 10px;
  }

  .photo-info {
    padding: 8px;
  }

  .photo-info .desc {
    font-size: 0.75rem;
  }

  .photo-info .year {
    font-size: 0.7rem;
  }
}

@media (max-width: 768px) and (orientation: landscape) {

  .photo-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
}
  
  .photo-info .desc {
    font-size: 0.8rem;
  }
  
  .photo-info .year {
    font-size: 0.7rem;
  }
}
</style>