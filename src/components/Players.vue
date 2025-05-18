<template>
  <div class="players-container">
    <h1>Tempus top 50</h1>

    <div v-if="loading" class="loading">Loading players...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="tables-wrapper">

      <div class="table-container">
        <h2>Soldiers</h2>
        <table class="players-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Points</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(player, index) in soldierPlayers" :key="'soldier-' + player.id">
              <td>{{ index + 1 }}</td>
              <td>{{ player.points }}</td>
              <td class="name-cell">{{ player.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="table-container">
        <h2>Demomen</h2>
        <table class="players-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Points</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(player, index) in demomanPlayers" :key="'demoman-' + player.id">
              <td>{{ index + 1 }}</td>
              <td>{{ player.points }}</td>
              <td class="name-cell">{{ player.name }}</td>
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
  name: 'Players',
  data() {
    return {
      soldierPlayers: [],
      demomanPlayers: [],
      loading: false,
      error: null
    };
  },
  created() {
    this.fetchPlayers();
  },
  methods: {
    async fetchPlayers() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:3000/players/top50', { timeout: 10000 });
        const players = response.data;

        this.soldierPlayers = players
          .filter(p => p.class === 'soldier')
          .sort((a, b) => b.points - a.points)
          .slice(0, 50);

        this.demomanPlayers = players
          .filter(p => p.class === 'demoman')
          .sort((a, b) => b.points - a.points)
          .slice(0, 50);

      } catch (error) {
        this.error = 'Error fetching players.';
        console.error('Error fetching players:', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.players-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #d1d1d1;
  margin-bottom: 30px;
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

.players-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
}

.players-table th {
  background-color: #4a6fa5;
  color: white;
  padding: 12px;
  text-align: left;
  font-weight: 600;
}

.players-table td {
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
}

.players-table tr:nth-child(even) {
  background-color: #f8f9fa;
}

.players-table tr:hover {
  background-color: #e9f7fe;
}

.players-table tr:last-child td {
  border-bottom: none;
}

.name-cell {
  max-width: 150px;
  white-space: nowrap;
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
