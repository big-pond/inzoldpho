<template>
  <div class="photo-grid">
    <div 
      v-for="photo in photos" 
      :key="photo.id"
      class="photo-card"
      :class="{ active: selectedPhoto?.id === photo.id }"
      @click="$emit('select-photo', photo)"
    >
      <img 
        :src="getImageUrl(photo.image)" 
        :alt="photo.description"
        class="photo-thumb"
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
const props = defineProps({
  photos: Array,
  selectedPhoto: Object
})

const emit = defineEmits(['select-photo'])

function getImageUrl(imageName) {
  // изображения лежат в public/images/
  return `/images/${imageName}`
}

function handleImageError(e) {
  e.target.src = 'https://placehold.co/400x300?text=No+Image'
}

function formatDate(photo) {
  if (photo.year) {
    if (photo.month) {
      return `${photo.year} · ${photo.month} месяц`
    }
    return `${photo.year}`
  }
  return 'Дата неизвестна'
}
</script>