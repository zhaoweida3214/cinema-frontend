<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCinemas, getSchedules } from '@/api/cinema'
import { useRouter } from 'vue-router'
import { toast } from '@/utils/toast'

const cinemas = ref<any[]>([])
const schedules = ref<any[]>([])
const selectedCinemaId = ref<number | null>(null)
const date = ref(new Date().toISOString().split('T')[0])
const loading = ref(true)
const schedulesLoading = ref(false)

// 获取未来几天的日期
const getQuickDates = () => {
  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    const label = i === 0 ? '今天' : i === 1 ? '明天' : i === 2 ? '后天' : `${d.getMonth() + 1}/${d.getDate()}`
    dates.push({ date: dateStr, label })
  }
  return dates
}

const quickDates = getQuickDates()

onMounted(async () => {
  try {
    const res = await getCinemas()
    cinemas.value = res.data.data
    if (cinemas.value.length > 0) {
      selectedCinemaId.value = cinemas.value[0].id
      await loadSchedules()
    }
  } catch (error) {
    toast.error('加载影院列表失败')
  } finally {
    loading.value = false
  }
})

const loadSchedules = async () => {
  if (!selectedCinemaId.value) return
  
  schedulesLoading.value = true
  try {
    const res = await getSchedules({ cinemaId: selectedCinemaId.value, date: date.value })
    schedules.value = res.data.data
  } catch (error) {
    toast.error('加载排片失败')
  } finally {
    schedulesLoading.value = false
  }
}

const selectQuickDate = (dateStr: string) => {
  date.value = dateStr
  loadSchedules()
}
</script>

<template>
  <div class="container py-6">
    <div class="header-section">
      <h2>🎬 选择影院与场次</h2>
      
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

      <!-- 快捷日期选择 -->
      <div class="quick-dates">
        <button 
          v-for="d in quickDates" 
          :key="d.date"
          @click="selectQuickDate(d.date)"
          :class="['quick-date-btn', { active: date === d.date }]"
        >
          {{ d.label }}
        </button>
      </div>
    </div>

    <!-- 加载骨架屏 -->
    <div v-if="schedulesLoading" class="schedule-grid">
      <div v-for="i in 6" :key="i" class="card schedule-skeleton">
        <div class="skeleton-title"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text short"></div>
      </div>
    </div>

    <!-- 排片列表 -->
    <div v-else-if="schedules.length > 0" class="schedule-grid">
      <div
        v-for="(s, index) in schedules"
        :key="s.id"
        class="card schedule-card"
        @click="$router.push(`/schedules/${s.id}/seats`)"
        :style="{ animationDelay: `${index * 0.05}s` }"
      >
        <div class="movie-info">
          <h3 class="movie-title">{{ s.movieTitle }}</h3>
          <div class="schedule-meta">
            <span class="hall-badge">🎭 {{ s.hallName }}</span>
            <span class="time">🕒 {{ new Date(s.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</span>
          </div>
        </div>
        <div class="action-area">
          <span class="btn btn-primary btn-sm">选座购票 →</span>
        </div>
      </div>
    </div>
    
    <div v-else class="empty-state">
      <div class="empty-icon">💭</div>
      <p>暂无排片信息</p>
      <p class="text-sm text-muted">请尝试选择其他日期</p>
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
  margin-bottom: 1rem;
}

.filter-group {
  flex: 1;
}

/* 快捷日期选择 */
.quick-dates {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.quick-date-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--border-color);
  background: white;
  border-radius: var(--radius);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  color: var(--text-color);
}

.quick-date-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
}

.quick-date-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
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
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}

.schedule-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-4px) !important;
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.15) !important;
}

.movie-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.schedule-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
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

/* 加载骨架屏 */
.schedule-skeleton {
  padding: 1.5rem;
  pointer-events: none;
}

.skeleton-title,
.skeleton-text {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-title {
  height: 24px;
  width: 70%;
  margin-bottom: 1rem;
}

.skeleton-text {
  height: 16px;
  margin-bottom: 0.5rem;
}

.skeleton-text.short {
  width: 50%;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: var(--text-light);
  background: var(--card-bg);
  border-radius: var(--radius);
  border: 1px dashed var(--border-color);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

@media (max-width: 640px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .quick-dates {
    justify-content: center;
  }
}
</style>
