<template>
  <div class="leaderboard-container">
    <h1>Leaderboard for map: {{ mapName }}</h1>

    <div v-if="loading" class="loading">Loading leaderboard data...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="tables-wrapper">
      <div class="table-container">
        <h2>Soldier Records</h2>
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Duration</th>
              <th>Name</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in soldierEntries" :key="'soldier-' + index">
              <td>{{ index + 1 }}</td>
              <td>{{ formatDuration(entry.duration) }}</td>
              <td class="name-cell">{{ entry.name }}</td>
              <td>{{ formatDate(entry.date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="table-container">
        <h2>Demoman Records</h2>
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Duration</th>
              <th>Name</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in demomanEntries" :key="'demoman-' + index">
              <td>{{ index + 1 }}</td>
              <td>{{ formatDuration(entry.duration) }}</td>
              <td class="name-cell">{{ entry.name }}</td>
              <td>{{ formatDate(entry.date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Leaderboard',
  props: {
    mapId: {
      type: Number,
      required: true
    },
    mapName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      soldierEntries: [],
      demomanEntries: [],
      loading: false,
      error: null
    };
  },
  mounted() {
    this.fetchLeaderboardData();
  },
  methods: {
    async fetchLeaderboardData() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`http://localhost:3000/maps/${this.mapId}/records`, { timeout: 10000 });
        const records = response.data;
        this.soldierEntries = records.filter(record => record.class === 'soldier');
        this.demomanEntries = records.filter(record => record.class === 'demoman');
      } catch (error) {
        this.error = 'Error fetching leaderboard data.';
        console.error('Error fetching leaderboard data:', error);
      } finally {
        this.loading = false;
      }
    },
    formatDuration(totalSeconds) {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);
      const milliseconds = Math.floor((totalSeconds % 1) * 1000);

      if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
      } else {
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
      }
    },
    formatDate(unixTimestamp) {
      const date = new Date(unixTimestamp * 1000);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    }
  }
};
</script>

<style scoped>
.leaderboard-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1, h2 {
  text-align: center;
  color: #333;
}

h1 {
  text-align: center;
  color: #d1d1d1;
  margin-bottom: 30px;
}

td {
  color: #333;
}

h2 {
  color: #d1d1d1;
  margin-top: 0;
  margin-bottom: 15px;
}

.tables-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.table-container {
  flex: 1;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
}

.leaderboard-table th, .leaderboard-table td {
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  text-align: left;
}

.leaderboard-table th {
  background-color: #4a6fa5;
  color: white;
  font-weight: 600;
}

.leaderboard-table tr:nth-child(even) {
  background-color: #f8f9fa;
}

.leaderboard-table tr:hover {
  background-color: #e9f7fe;
}

.leaderboard-table tr:last-child td {
  border-bottom: none;
}

.name-cell {
  max-width: 150px;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
  color: #666;
}

.error {
  color: #d32f2f;
}
</style>
