<template>
  <div class="player-page">
    <div v-if="playerNotFound" class="player-not-found">
      <p>No player found</p>
      <button @click="returnToAllPlayers" class="return-button">Return to All Players</button>
    </div>
    <div v-else>
      <div v-if="player" class="profile-banner">
        <div class="profile-left">
          <img :src="`/avatars/${player.avatar}`" alt="Avatar" class="avatar" onerror="this.src='/avatars/golly.jpg'" />
          <div class="profile-info">
            <h1 v-if="player.name" class="player-name">{{ player.name }}</h1>
            <p class="country">
              <img
                :src="getFlagImageUrl(player.country_code)"
                alt="flag"
                class="flag-icon"
                @error="handleImageError"
              />
              {{ player.country }} ({{ player.country_code }})
            </p>
            <button class="update-button">Update</button>
          </div>
        </div>
        <div class="profile-right">
          <div class="profile-overview">
            <div class="stat-block">
              <h3>Overall Rank</h3>
              <p>#{{ player.overall_rank }}</p>
            </div>
            <div class="stat-block">
              <h3>Soldier Rank</h3>
              <p>#{{ player.soldier_rank }}</p>
            </div>
            <div class="stat-block">
              <h3>Demoman Rank</h3>
              <p>#{{ player.demoman_rank }}</p>
            </div>
            <div class="stat-block">
              <h3>Overall Points</h3>
              <p>{{ player.overall_points }}</p>
            </div>
            <div class="stat-block">
              <h3>Soldier Points</h3>
              <p>{{ player.soldier_points }}</p>
            </div>
            <div class="stat-block">
              <h3>Demoman Points</h3>
              <p>{{ player.demoman_points }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="main-content-wrapper">
        <div class="stats-boxes">
          <div class="completion-stats">
            <div class="stat-box">
              <h3>Soldier completion</h3>
              <p>{{ soldierCompletion }}%</p>
            </div>
            <div class="stat-box">
              <h3>Demoman completion</h3>
              <p>{{ demomanCompletion }}%</p>
            </div>
          </div>
          <div class="achievement-stats">
            <div class="stat-box">
              <h3>Top times</h3>
              <p>{{ topTimesAmount }}</p>
            </div>
            <div class="stat-box">
              <h3>World records</h3>
              <p>{{ worldRecordAmount }}</p>
            </div>
          </div>
        </div>
        <div class="tabs-container">
          <div class="tabs-header">
            <button
              v-for="(tab, index) in tabs"
              :key="index"
              @click="currentTab = tab"
              :class="{ 'active': currentTab === tab }"
            >
              {{ tab }}
            </button>
          </div>
          <div class="tabs-content">
            <div v-if="currentTab === 'Recent runs'" class="records-section">
              <div v-if="loading" class="loading">Loading records...</div>
              <div v-if="error" class="error">
                <span>{{ error }}</span>
                <button @click="error = null" class="close-button">X</button>
              </div>
              <div v-else class="tables-wrapper"></div>
              <ul>
                <li v-for="record in recentRecords" :key="record.id" class="record-item">
                  <div class="record-class-map">
                    <img
                      :src="`/icons/${record.class}.png`"
                      :alt="record.class"
                      class="class-icon"
                      loading="lazy"
                    />
                    <span class="record-map">{{ record.map_name }}</span>
                  </div>
                  <div class="record-time-detail">
                    <span class="record-detail record-duration"
                          :class="getRankClass(record.rank)" >
                      {{ record.duration }} - {{ getMedal(record.rank) }} #{{ record.rank }}
                    </span>
                    <span class="record-detail">{{ formatDate(record.date) }}</span>
                  </div>
                </li>
              </ul>
            </div>
            <div v-if="currentTab === 'Recent top times'" class="records-section">
              <ul>
                <li v-for="record in displayRecords('topTimes')" :key="record.id" class="record-item">
                  <div class="record-class-map">
                    <img
                      :src="`/icons/${record.class}.png`"
                      :alt="record.class"
                      class="class-icon"
                      loading="lazy"
                    />
                    <span class="record-map">{{ record.map_name }}</span>
                  </div>
                  <div class="record-time-detail">
                    <span class="record-detail record-duration"
                          :class="getRankClass(record.rank)" >
                      {{ record.duration }} - {{ getMedal(record.rank) }} #{{ record.rank }}
                    </span>
                    <span class="record-detail">{{ formatDate(record.date) }}</span>
                  </div>
                </li>
              </ul>
            </div>
            <div v-if="currentTab === 'Recent world records'" class="records-section">
              <ul>
                <li v-for="record in displayRecords('worldRecords')" :key="record.id" class="record-item">
                  <div class="record-class-map">
                    <img
                      :src="`/icons/${record.class}.png`"
                      :alt="record.class"
                      class="class-icon"
                      loading="lazy"
                    />
                    <span class="record-map">{{ record.map_name }}</span>
                  </div>
                  <div class="record-time-detail">
                    <span class="record-detail record-duration"
                          :class="getRankClass(record.rank)" >
                      {{ record.duration }} - {{ getMedal(record.rank) }} #{{ record.rank }}
                    </span>
                    <span class="record-detail">{{ formatDate(record.date) }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'PlayerPage',
  props: {
    playerId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      player: {
        id: null,
        steamid: null,
        avatar: null,
        name: null,
        country: "unknown",
        country_code: "unknown",
        overall_rank: null,
        soldier_rank: null,
        demoman_rank: null,
        overall_points: null,
        soldier_points: null,
        demoman_points: null
      },
      recentRecords: [],
      topTimes: [],
      worldRecords: [],
      tabs: ['Recent runs', 'Recent top times', 'Recent world records'],
      currentTab: 'Recent runs',
      loading: false,
      error: null,
      playerNotFound: false,      
      soldierCompletion: 0, 
      demomanCompletion: 0,
      topTimesAmount: 0,
      worldRecordAmount: 0
    };
  },
  async mounted() {
    await Promise.all([      
      this.fetchPlayerData(this.playerId),
      this.fetchPlayerRanks(this.playerId),
      this.fetchAllRecords(this.playerId)
    ]);    
    document.title = this.player.name + ' - Tempus stats';
  },
  methods: {
    getDisplayRecords(records) {
      if (records.length > 0) return records;

      const placeholderTime = {
        duration: null,
        date: Math.floor(Date.now() / 1000),
        rank: null,
        map_name: "You'll get it soon :)"
      };
      return [
        { ...placeholderTime, class: "soldier" },
        { ...placeholderTime, duration: 0, class: "demoman" }
      ];
    },
    displayRecords(type) {
      return this.getDisplayRecords(this[type]);
    },
    getRankClass(rank) {
      if (rank === 1) return 'rank-gold';
      if (rank === 2) return 'rank-silver';
      if (rank === 3) return 'rank-bronze';
      if (rank >= 4 && rank <= 10) return 'rank-blue';
      return '';
    },
    getMedal(rank) {
      if (rank === 1) return '🥇';
      if (rank === 2) return '🥈';
      if (rank === 3) return '🥉';
      return '';
    },
    getFlagImageUrl(countryCode) {
      if (countryCode === 'unknown') {
        return '/icons/default-flag.jpg';
      }
      return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;
    },
    handleImageError(event) {
      event.target.src = '/icons/default-flag.jpg';
    },
    returnToAllPlayers() {
      this.$router.push('/players');
    },
    async fetchPlayerData(playerId) {    
      try {
        const response = await axios.get(`http://localhost:3000/players/${playerId}`);
        if (response.data.length === 0) {
          this.playerNotFound = true;
          return;
        }
        const playerData = response.data[0];
        this.player = {
          ...this.player,
          ...playerData,
          avatar: playerData.steam_avatar || 'golly.jpg',
          country: playerData.country || 'unknown',
          country_code: playerData.country_code || 'unknown',
        }
      } catch (error) {
        this.error = 'Failed to fetch player data. Please try again later.';
        console.error('Error fetching player data:', error);
        this.playerNotFound = true;
      }
    },
    async fetchPlayerRanks(playerId) {
      try {
        const response = await axios.get(`http://localhost:3000/players/${playerId}/ranks`);
        const playerRanks = response.data[0];
        this.player.overall_rank = playerRanks.overal_rank;
        this.player.soldier_rank = playerRanks.soldier_rank;
        this.player.demoman_rank = playerRanks.demoman_rank;
        this.player.overall_points = playerRanks.soldier_points + playerRanks.demoman_points;
        this.player.soldier_points = playerRanks.soldier_points;
        this.player.demoman_points = playerRanks.demoman_points;
      } catch (error) {
        this.error = 'Failed to fetch player ranks. Please try again later.';
        console.error('Error fetching player ranks:', error);
      }
    },
    async fetchAllRecords(playerId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`http://localhost:3000/players/${playerId}/records`);
        const records = response.data.filter(record => record && record.date !== null);

        this.recentRecords = records
          .sort((a, b) => b.date - a.date)
          .slice(0, 20)
          .map(this.formatRecord);

        this.topTimes = records
          .filter(record => record.rank >= 1 && record.rank <= 10)
          .sort((a, b) => b.date - a.date)
          .slice(0, 20)
          .map(this.formatRecord);

        this.worldRecords = records
          .filter(record => record.rank === 1)
          .sort((a, b) => b.date - a.date)
          .slice(0, 20)
          .map(this.formatRecord);
      } catch (error) {
        this.error = 'Failed to fetch player records. Please try again later.';
        console.error('Error fetching records:', error);
      } finally {        
        this.loading = false;
      }
    },
    formatRecord(record) {
      const totalSeconds = record.duration;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);
      const milliseconds = Math.floor((totalSeconds % 1) * 1000);

      let formattedDuration;
      if (hours > 0) {
        formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
      } else {
        formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
      }

      return { ...record, duration: formattedDuration };
    },
    formatDate(unixTimestamp) {
      const now = Date.now() / 1000;
      const secondsDifference = Math.floor(now - unixTimestamp);

      const secondsInMinute = 60;
      const secondsInHour = 3600;
      const secondsInDay = 86400;
      const secondsInWeek = 604800;
      const secondsInMonth = 2592000;
      const secondsInYear = 31536000;

      const pluralize = (value, unit) => {
        return `${value} ${unit}${value === 1 ? '' : 's'} ago`;
      };

      if (secondsDifference < secondsInMinute) {
        return pluralize(secondsDifference, 'second');
      } else if (secondsDifference < secondsInHour) {
        const minutes = Math.floor(secondsDifference / secondsInMinute);
        return pluralize(minutes, 'minute');
      } else if (secondsDifference < secondsInDay) {
        const hours = Math.floor(secondsDifference / secondsInHour);
        return pluralize(hours, 'hour');
      } else if (secondsDifference < secondsInWeek) {
        const days = Math.floor(secondsDifference / secondsInDay);
        return pluralize(days, 'day');
      } else if (secondsDifference < secondsInMonth) {
        const weeks = Math.floor(secondsDifference / secondsInWeek);
        return pluralize(weeks, 'week');
      } else if (secondsDifference < secondsInYear) {
        const months = Math.floor(secondsDifference / secondsInMonth);
        return pluralize(months, 'month');
      } else {
        const years = Math.floor(secondsDifference / secondsInYear);
        return pluralize(years, 'year');
      }
    },
  }
};
</script>

<style>

.player-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  color: #fff;
}

.profile-banner {
  display: flex;
  background: linear-gradient(135deg, #4a6fa5, #2a2a2a);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.4);
  margin-bottom: 30px;
}

.profile-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 20px;
  max-width: 33.33%;
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  margin-bottom: 10px;
  border: 3px solid #4a6fa5;
}

.profile-info h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.player-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.profile-info p {
  margin: 5px 0;
  color: #ccc;
}

.profile-right {
  flex: 2;
  display: flex;
  flex-direction: column;
}

.profile-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
}

.stat-block {
  background: #1d1d1d;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  transition: transform 0.2s ease;
}

.stat-block:hover {
  transform: translateY(-5px);
}

.stat-block h3 {
  margin: 0 0 10px;
  color: #aaa;
  font-weight: 500;
}

.stat-block p {
  font-size: 1.4rem;
  font-weight: bold;
  color: #4ddbff;
}

.flag-icon {
  width: 24px;
  height: 18px;
  margin-right: 6px;
  vertical-align: middle;
  border-radius: 2px;
}

.update-button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #4a6fa5;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

.update-button:hover {
  background-color: #3a5a8f;
}

.main-content-wrapper {
  display: flex;
  width: 100%;
}

.stats-boxes {
  width: 30%;
  background-color: #1d1d1d;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.tabs-container {
  width: 70%;
  margin-left: 20px;
}

.tabs-header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.tabs-header button {
  padding: 10px 20px;
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: color 0.2s ease;
}

.tabs-header button.active {
  color: #4ddbff;
  border-bottom: 2px solid #4ddbff;
}

.tabs-content {
  flex: 1;
  background: #1d1d1d;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: opacity 0.3s ease;
  width: 100%;
}

.records-section h2 {
  color: #fff;
  margin-bottom: 15px;
}

.records-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background: #2a2a2a;
  border-radius: 5px;
}

.record-class-map {
  display: flex;
  align-items: center;
  flex: 1;
}

.record-map {
  margin-left: 10px;
}

.record-time-detail {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.record-detail {
  color: #ccc;
  font-size: 0.9rem;
}

.record-duration {
  font-weight: bold;
  color: #4ddbff;
}

.class-icon {
  width: 24px;
  height: 24px;
}

.error {
  color: #ff6b6b;
  padding: 15px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 5px;
  margin-bottom: 15px;
  text-align: center;
  position: relative;
}

.close-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  color: #ff6b6b;
  font-size: 1rem;
  cursor: pointer;
  padding: 0 5px;
}

.close-button:hover {
  color: #ff0000;
}

.player-not-found {
  text-align: center;
  padding: 20px;
  background: #292929;
  color: #fff;
  border-radius: 8px;
  margin: 20px auto;
  max-width: 500px;
}

.return-button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #4a6fa5;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

.return-button:hover {
  background-color: #3a5a8f;
}

.rank-gold {
  color: #FFD700;
  font-weight: bold;
}

.rank-silver {
  color: #C0C0C0;
  font-weight: bold;
}

.rank-bronze {
  color: #CD7F32;
  font-weight: bold;
}

.rank-blue {
  color: #30869b;
}

.content-wrapper {
  display: flex;
  gap: 20px;
  width: 100%;
}

.stat-box {
  background-color: #2a2a2a;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
  margin-bottom: 10px;
  border-radius: 5px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.stat-box h3 {
  margin: 0 0 2px;
  color: #aaa;
  font-weight: 500;
}

.stat-box p {
  font-size: 1.4rem;
  font-weight: bold;
  color: #4ddbff;
}

.completion-stats, .achievement-stats, .rankup-stats {
  gap: 10px;
  margin-bottom: 10px;
}

.completion-stats .stat-box, .achievement-stats .stat-box {
  flex: 1;
}

</style>