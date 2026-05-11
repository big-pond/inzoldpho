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
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
}

.lightbox-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.lightbox-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

.lightbox-close {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  font-size: 32px;
  color: white;
  cursor: pointer;
  padding: 8px;
  line-height: 1;
}

.lightbox-caption {
  position: absolute;
  bottom: -40px;
  left: 0;
  color: white;
  background: rgba(0,0,0,0.6);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
}
</style>