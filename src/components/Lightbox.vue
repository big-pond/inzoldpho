<template>
  <Teleport to="body">
    <div v-if="visible" class="lightbox" @click.self="close">
        <div class="lightbox-content">
            <img :src="imageUrl" :alt="alt" class="lightbox-image">
            <button class="lightbox-close" @click="close">✕</button>
            <div class="lightbox-caption" v-if="caption">{{ caption }}</div>
        </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  imageUrl: String,
  alt: String,
  caption: String
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>

<style scoped>

.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.95); /* Чуть темнее для лучшего фокуса на фото */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
}

.lightbox-content {
  position: relative;
  max-width: 90%;
  max-height: 85%; /* Оставляем 15% высоты под подпись */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-image {
  max-width: 100%;
  max-height: 80vh; /* Удерживаем картинку в рамках экрана */
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

/* Кнопка закрытия: делаем её удобной для пальца (минимальная зона клика 44x44px) */
.lightbox-close {
  position: fixed; /* Фиксируем относительно экрана, а не картинки */
  top: 16px;
  right: 16px;
  width: 48px;     /* Идеальный размер для тапа пальцем */
  height: 48px;
  background: rgba(255, 255, 255, 0.2); /* Полупрозрачный фон, чтобы не терялась */
  border: none;
  border-radius: 50%; /* Круглая кнопка */
  font-size: 24px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  backdrop-filter: blur(4px); /* Красивое размытие фона за кнопкой */
  transition: background-color 0.2s, transform 0.1s;
  z-index: 1010; /* Кнопка всегда поверх картинки */
}

.lightbox-close:active {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(0.95); /* Визуальный отклик на нажатие */
}

/* Подпись под фото */
.lightbox-caption {
  position: absolute;
  bottom: -45px; /* Выносим под картинку */
  left: 50%;
  transform: translateX(-50%); /* Идеальное центрирование */
  color: white;
  background: rgba(0,0,0,0.75);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  max-width: 95%;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ==========================================================================
   АДАПТИВ: Альбомная (ландшафтная) ориентация на мобильных устройствах
   ========================================================================== */
@media (max-width: 932px) and (orientation: landscape) {
  .lightbox {
    padding: 12px; /* Безопасные отступы от краев экрана */
  }

  .lightbox-content {
    max-width: 85%; /* Оставляем зазор справа для кнопки закрытия */
    max-height: 100%;
    justify-content: center;
  }

  .lightbox-image {
    max-height: 82vh; /* Максимально растягиваем картинку по высоте */
  }

  .lightbox-close {
    /* Сдвигаем кнопку в правый верхний угол с учетом челок/вырезов (Safe Area) */
    top: 12px;
    right: 12px;
    width: 42px; /* Чуть компактнее, но все еще удобно для пальца */
    height: 42px;
    font-size: 20px;
  }

  .lightbox-caption {
    /* В ландшафте критически мало места снизу, переносим подпись НА картинку в самый низ */
    bottom: 8px; 
    font-size: 12px;
    padding: 4px 12px;
    background: rgba(0, 0, 0, 0.8);
    box-shadow: 0 2px 8px rgba(0,0,0,0.5);
  }
}

/* ==========================================================================
   АДАПТИВ: Портретная ориентация на мобильных устройствах
   ========================================================================== */
@media (max-width: 768px) and (orientation: portrait) {
  .lightbox-close {
    top: 16px;
    right: 16px;
  }
  
  .lightbox-caption {
    font-size: 13px;
    bottom: -50px; /* Даем больше места под картинкой */
  }
}
</style>
