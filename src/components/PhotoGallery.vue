<template>
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