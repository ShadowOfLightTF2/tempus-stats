<template>
  <div class="maps-container">
    <h1>Maps</h1>
    <div v-if="loading" class="loading">Loading maps...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="table-container">
      <table class="maps-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Records</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(map, index) in maps" :key="'map-' + index">
            <td>{{ map.id }}</td>
            <td>{{ map.name }}</td>
            <td>
              <button @click="goToLeaderboard(map.id, map.name)">View Records</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Maps',
  data() {
    return {
      maps: [],
      loading: false,
      error: null,
    };
  },
  created() {
    this.fetchMapsData();
  },
  methods: {
    async fetchMapsData() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:3000/maps', { timeout: 10000 });
        this.maps = response.data;
      } catch (error) {
        this.error = 'Error fetching maps data.';
        console.error('Error fetching maps data:', error);
      } finally {
        this.loading = false;
      }
    },
    goToLeaderboard(mapId, mapName) {
      console.log("Navigating to Leaderboard with mapId:", mapId, "and mapName:", mapName);
      this.$router.push({
        name: 'Leaderboard',
        params: { mapId: mapId },
        query: { mapName: mapName }
      });
    }
  },
};
</script>

<style scoped>
.maps-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #d1d1d1;
  margin-bottom: 30px;
}

td {  
  color: #333;
}

.table-container {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.maps-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
}

.maps-table th {
  background-color: #4a6fa5;
  color: white;
  padding: 12px;
  text-align: left;
  font-weight: 600;
}

.maps-table td {
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.maps-table tr:nth-child(even) {
  background-color: #f8f9fa;
}

.maps-table tr:hover {
  background-color: #e9f7fe;
}

.maps-table tr:last-child td {
  border-bottom: none;
}

button {
  background-color: #4a6fa5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>