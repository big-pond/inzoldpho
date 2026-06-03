<template>
  <Teleport to="body">
    <div v-if="visible" class="lightbox" @click.self="close">
      <!-- Стрелка НАЗАД (скрыта на первом слайде) -->
      <button 
        v-if="currentIndex > 0" 
        class="nav-btn prev-btn" 
        @click="prevPhoto"
        aria-label="Предыдущее фото"
      >‹</button>

      <div 
        class="lightbox-content"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
      >
        <img 
          v-if="currentPhoto"
          :key="currentPhoto.id"
          :src="`./images/${currentPhoto.image}`" 
          :alt="currentPhoto.description" 
          class="lightbox-image"
        >
        <div class="lightbox-caption" v-if="currentPhoto">
          {{ currentPhoto.description }} — {{ formatFullDate(currentPhoto) }}
          <span class="counter">({{ currentIndex + 1 }} / {{ photos.length }})</span>
        </div>
      </div>

      <!-- Стрелка ВПЕРЕД (скрыта на последнем слайде) -->
      <button 
        v-if="currentIndex < photos.length - 1" 
        class="nav-btn next-btn" 
        @click="nextPhoto"
        aria-label="Следующее фото"
      >›</button>

      <!-- Кнопка закрытия -->
      <button class="lightbox-close" @click="close">✕</button>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { monthStr } from '../utils/dateUtils' // ФИКС: Импортируем утилиту для даты внутрь лайтбокса

const props = defineProps({
  visible: Boolean,
  photos: {
    type: Array,
    default: () => []
  },
  currentIndex: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close', 'update:currentIndex'])

// Получаем текущий объект фото на основе индекса
const currentPhoto = computed(() => props.photos[props.currentIndex] || null)

function formatFullDate(photo) {
  let date = `${photo.year} год`
  if (photo.month && photo.day) date += `, ${monthStr(photo.month)} месяц, ${photo.day} число`
  else if (photo.month) date += `, ${monthStr(photo.month)} месяц`
  return date
}

function nextPhoto() {
  if (props.currentIndex < props.photos.length - 1) {
    emit('update:currentIndex', props.currentIndex + 1)
  }
}

function prevPhoto() {
  if (props.currentIndex > 0) {
    emit('update:currentIndex', props.currentIndex - 1)
  }
}

function close() {
  emit('close')
}

// --- Управление стрелками клавиатуры (Десктоп) ---
function handleKeyDown(e) {
  if (!props.visible) return
  if (e.key === 'ArrowRight') nextPhoto()
  if (e.key === 'ArrowLeft') prevPhoto()
  if (e.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', handleKeyDown))
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown))

// --- Управление свайпами (Мобильные устройства) ---
const touchStartX = ref(0)
const touchEndX = ref(0)
const minSwipeDistance = 50 // Минимальное расстояние в пикселях для срабатывания свайпа


function handleTouchStart(e) {
  // Проверяем, что касание существует, и берем первый палец
  if (e.changedTouches && e.changedTouches.length > 0) {
    touchStartX.value = e.changedTouches[0].screenX
  }
}

function handleTouchEnd(e) {
  if (e.changedTouches && e.changedTouches.length > 0) {
    touchEndX.value = e.changedTouches[0].screenX
    handleSwipe()
  }
}
function handleSwipe() {
  const distance = touchEndX.value - touchStartX.value
  if (distance < -minSwipeDistance) {
    nextPhoto()
  }
  if (distance > minSwipeDistance) {
    prevPhoto()
  }
}
</script>

<style scoped>

.lightbox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
  user-select: none; /* Запрещаем выделение текста при свайпах */
}

.lightbox-content {
  position: relative;
  max-width: 90%;
  max-height: 85%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

/* Кнопка закрытия */
.lightbox-close {
  position: fixed;
  top: 16px;
  right: 16px;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  font-size: 24px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  backdrop-filter: blur(4px);
  transition: background-color 0.2s, transform 0.1s;
  z-index: 1010;
}

.lightbox-close:active {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(0.95);
}

/* Кнопки навигации (Стрелки влево/вправо на больших экранах) */
.nav-btn {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  font-size: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  z-index: 1005;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.prev-btn { left: 24px; }
.next-btn { right: 24px; }

/* Подпись под фото */
.lightbox-caption {
  position: absolute;
  bottom: -20px;
  transform: translateY(100%) translateX(-50%); /* Корректный сдвиг вниз */
  left: 50%;
  color: white;
  background: rgba(0,0,0,0.75);
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 14px;
  text-align: center;
  white-space: normal;   /* Разрешаем тексту переноситься */
  width: 90vw;           /* Ограничиваем ширину подписи шириной экрана */
  max-width: 600px;      /* Чтобы на десктопах не растягивалось слишком сильно */
  box-sizing: border-box;
}

.counter {
  margin-left: 8px;
  opacity: 0.7;
  font-size: 12px;
  display: inline-block; /* Удерживает счетчик рядом со словом */
}

/* --- АДАПТИВ ДЛЯ МОБИЛЬНЫХ (LANDSCAPE) --- */
@media (max-width: 932px) and (orientation: landscape) {
  .lightbox-content {
    max-width: 85%;
    max-height: 85%;
  }

  .lightbox-image {
    max-height: 75vh;
  }

  .lightbox-close {
    top: 12px;
    right: 12px;
    width: 42px;
    height: 42px;
    font-size: 20px;
  }

  .lightbox-caption {
    position: absolute;
    bottom: 8px;        /* В ландшафте накладываем ПОВЕРХ фото внизу */
    transform: translateX(-50%);
    left: 50%;
    width: 80%;         /* Сужаем, чтобы не упереться в кнопку закрытия */
    font-size: 12px;
    padding: 6px 12px;
    background: rgba(0, 0, 0, 0.85);
    border-radius: 8px;
  }

  /* На смартфонах в ландшафте скрываем стрелки, так как есть свайпы, 
     чтобы случайно не нажать на них при удержании телефона */
  .nav-btn {
    display: none;
  }
}

/* --- АДАПТИВ ДЛЯ МОБИЛЬНЫХ (PORTRAIT) --- */
@media (max-width: 768px) and (orientation: portrait) {
  .lightbox-content {
    max-height: 75%;    /* Выделяем больше пространства под картинкой */
  }

  .lightbox-image {
    max-height: 70vh;   /* Удерживаем картинку, давая место тексту снизу */
  }

  .lightbox-caption {
    font-size: 13px;
    width: 85vw;        /* Подпись займет максимум 85% ширины экрана смартфона */
    bottom: -12px;      /* Аккуратный отступ под изображением */
    border-radius: 10px;
  }
  /* В портрете стрелки тоже скрываем в пользу удобных свайпов */
  .nav-btn {
    display: none;
  }
}
</style>
