<template>
    <div ref="mapContainer" class="map-container"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import OSM from 'ol/source/OSM'
import { fromLonLat, /*toLonLat*/ } from 'ol/proj'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import LineString from 'ol/geom/LineString'
import { Style, Circle, Fill, Stroke/*, Icon */} from 'ol/style'

const props = defineProps({
  lat: Number,
  lon: Number,
  direct: Number
})

const mapContainer = ref(null)
let map = null
let vectorLayer = null
let vectorSource = null

// Функция для отрисовки точки и направления
function updateMapLocation(lat, lon, direct) {
  if (!map || !vectorSource) return

  // Очищаем предыдущие объекты
  vectorSource.clear()

  if (lat === undefined || lon === undefined) return

  const centerCoord = fromLonLat([lon, lat])

  // Создаём точку (маркер)
  const markerFeature = new Feature({
    geometry: new Point(centerCoord)
  })
  markerFeature.setStyle(new Style({
    image: new Circle({
      radius: 8,
      fill: new Fill({ color: '#e74c3c' }),
      stroke: new Stroke({ color: '#fff', width: 2 })
    })
  }))

  vectorSource.addFeature(markerFeature)

  // Рисуем линию направления
  if (direct !== undefined && direct !== null) {
    // Вычисляем конечную точку на небольшом расстоянии (примерно 150 метров)
    // Используем приближение для сферических координат: смещение в градусах
    const distanceDeg = 0.0025
    const rad = direct * Math.PI / 180
    const deltaLon = distanceDeg * Math.sin(rad)
    const deltaLat = distanceDeg * Math.cos(rad)
    
    const endLon = lon + deltaLon
    const endLat = lat + deltaLat
    const endCoord = fromLonLat([endLon, endLat])

    const lineFeature = new Feature({
      geometry: new LineString([centerCoord, endCoord])
    })
    lineFeature.setStyle(new Style({
      stroke: new Stroke({
        color: '#2980b9',
        width: 3,
        lineDash: [4, 6]
      })
    }))
    vectorSource.addFeature(lineFeature)

    // Добавим кружок на конце направления
    const arrowFeature = new Feature({
      geometry: new Point(endCoord)
    })
    arrowFeature.setStyle(new Style({
      image: new Circle({
        radius: 5,
        fill: new Fill({ color: '#2980b9' }),
        stroke: new Stroke({ color: '#fff', width: 1.5 })
      })
    }))
    vectorSource.addFeature(arrowFeature)
  }

  // Центрируем и устанавливаем зум
  map.getView().setCenter(centerCoord)
  map.getView().setZoom(15)
}
onMounted(() => {
  // Создаём источник и слой для векторных данных
  vectorSource = new VectorSource()
  vectorLayer = new VectorLayer({
    source: vectorSource
  })

  // Инициализируем карту
  map = new Map({
    target: mapContainer.value,
    layers: [
      new TileLayer({
        source: new OSM()
      }),
      vectorLayer
    ],
    view: new View({
      center: fromLonLat([37.6176, 55.7558]), // временный центр (Москва)
      zoom: 5
    })
  })
  
  // Если данные уже пришли (например, выбранное фото изначально), обновим карту
  if (props.lat && props.lon) {
    updateMapLocation(props.lat, props.lon, props.direct)
  }
})


watch(
  () => [props.lat, props.lon, props.direct], 
  () => {
    if (props.lat && props.lon && map && vectorSource) {
      updateMapLocation(props.lat, props.lon, props.direct)
    }
  },
  { immediate: true }  // Чтобы отработало сразу после монтирования
)
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 400px;
  background-color: #e9f0f5;
}
</style>
