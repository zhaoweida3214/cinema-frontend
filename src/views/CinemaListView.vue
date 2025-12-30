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
  <div class="container py-6">
    <div class="header-section">
      <h2>选择影院与场次</h2>
      
      <div class="filters card">
        <div class="filter-group">
          <label class="form-label">选择影院</label>
          <select v-model="selectedCinemaId" @change="loadSchedules" class="form-control">
            <option v-for="c in cinemas" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label class="form-label">选择日期</label>
          <input type="date" v-model="date" @change="loadSchedules" class="form-control" />
        </div>
      </div>
    </div>

    <div v-if="schedules.length > 0" class="schedule-grid">
      <div
        v-for="s in schedules"
        :key="s.id"
        class="card schedule-card"
        @click="$router.push(`/schedules/${s.id}/seats`)"
      >
        <div class="movie-info">
          <h3 class="movie-title">{{ s.movieTitle }}</h3>
          <div class="schedule-meta">
            <span class="hall-badge">{{ s.hallName }}</span>
            <span class="time">{{ new Date(s.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</span>
          </div>
        </div>
        <div class="action-area">
          <span class="btn btn-primary btn-sm">选座购票</span>
        </div>
      </div>
    </div>
    
    <div v-else class="empty-state">
      <p>暂无排片信息</p>
    </div>
  </div>
</template>

<style scoped>
.py-6 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.header-section {
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 1.5rem;
  align-items: flex-end;
  padding: 1.5rem;
}

.filter-group {
  flex: 1;
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.schedule-card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.schedule-card:hover {
  border-color: var(--primary-color);
}

.movie-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.schedule-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.hall-badge {
  background-color: var(--bg-color);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  color: var(--text-light);
}

.time {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--primary-color);
}

.action-area {
  text-align: right;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: var(--text-light);
  background: var(--card-bg);
  border-radius: var(--radius);
  border: 1px dashed var(--border-color);
}

@media (max-width: 640px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
