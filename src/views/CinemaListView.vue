<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCinemas, getSchedules } from '@/api/cinema'
import { useRouter } from 'vue-router'

const cinemas = ref<any[]>([])
const schedules = ref<any[]>([])
const selectedCinemaId = ref<number | null>(null)
const date = ref(new Date().toISOString().split('T')[0])

onMounted(async () => {
  const res = await getCinemas()
  cinemas.value = res.data.data
  if (cinemas.value.length > 0) {
    selectedCinemaId.value = cinemas.value[0].id
    loadSchedules()
  }
})

const loadSchedules = async () => {
  if (selectedCinemaId.value) {
    const res = await getSchedules({ cinemaId: selectedCinemaId.value, date: date.value })
    schedules.value = res.data.data
  }
}
</script>

<template>
  <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
    <h2>选择影院与场次</h2>

    <div style="margin: 10px 0;">
      <select v-model="selectedCinemaId" @change="loadSchedules" style="padding: 5px; margin-right: 10px;">
        <option v-for="c in cinemas" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>

      <input type="date" v-model="date" @change="loadSchedules" style="padding: 5px;" />
    </div>

    <div style="margin-top: 20px;">
      <div
        v-for="s in schedules"
        :key="s.id"
        style="border: 1px solid #ccc; padding: 10px; margin: 10px 0; cursor: pointer;"
        @click="$router.push(`/schedules/${s.id}/seats`)"
      >
        <strong>{{ s.movieTitle }}</strong> · {{ s.hallName }} · {{ new Date(s.startTime).toLocaleString() }}
      </div>
    </div>
  </div>
</template>
