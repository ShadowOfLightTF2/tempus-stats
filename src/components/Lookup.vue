<template>
  <div
    class="container records-container py-4 d-flex flex-column align-items-center bg-dark-custom"
  >
    <!-- Search section remains unchanged -->
    <div class="search-section">
      <div class="search-container" @click.stop>
        <div class="search-input-wrapper">
          <svg
            class="search-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            v-model="searchQuery"
            @input="onSearch"
            placeholder="Search for players..."
            class="search-input"
          />
        </div>
        <div
          class="search-results-dropdown"
          v-if="searchResults && searchResults.players.length"
        >
          <div>
            <h6>Players</h6>
            <ul>
              <li
                v-for="player in searchResults.players"
                :key="player.id"
                @click="selectPlayer(player.id)"
                v-html="sanitize(player.name) || `Player ID: ${player.id}`"
              ></li>
            </ul>
          </div>
        </div>
      </div>
      <div
        v-if="searchResults && searchResults.players.length"
        class="dropdown-overlay"
        @click="searchResults = null"
        style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 999;
          background: transparent;
        "
      ></div>
    </div>
    <hr class="row-divider" style="width: 75%" />

    <!-- Player Name Display -->
    <div
      v-if="playerId"
      class="player-name-display"
      @click="goToPlayer(playerId)"
    >
      <h2
        class="clickable"
        v-html="sanitize(selectedPlayerName) || 'Selected Player'"
      ></h2>
    </div>
    <hr class="row-divider" style="width: 75%" v-if="playerId" />

    <!-- Filter Section -->
    <div class="filter-section">
      <div class="filter-content">
        <!-- Soldier and Demoman Tiers -->
        <div class="filter-columns">
          <div class="filter-group">
            <h6 class="filter-title text-light mb-2">Soldier Tiers</h6>
            <div class="tier-filter-container">
              <div class="tier-filters">
                <label
                  v-for="tier in availableTiers"
                  :key="'soldier-tier-' + tier"
                  class="tier-checkbox"
                >
                  <input
                    type="checkbox"
                    :value="tier"
                    v-model="selectedSoldierTiers"
                    @change="onFilterChange"
                  />
                  <span :class="`tier-badge tier-${tier}`">{{ tier }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="filter-group">
            <h6 class="filter-title text-light mb-2">Demoman Tiers</h6>
            <div class="tier-filter-container">
              <div class="tier-filters">
                <label
                  v-for="tier in availableTiers"
                  :key="'demo-tier-' + tier"
                  class="tier-checkbox"
                >
                  <input
                    type="checkbox"
                    :value="tier"
                    v-model="selectedDemomanTiers"
                    @change="onFilterChange"
                  />
                  <span :class="`tier-badge tier-${tier}`">{{ tier }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Soldier and Demoman Ratings -->
        <div class="filter-columns">
          <div class="filter-group">
            <h6 class="filter-title text-light mb-2">Soldier Ratings</h6>
            <div class="rating-filter-container">
              <div class="rating-filters">
                <label
                  v-for="rating in availableRatings"
                  :key="'soldier-rating-' + rating"
                  class="rating-checkbox"
                >
                  <input
                    type="checkbox"
                    :value="rating"
                    v-model="selectedSoldierRatings"
                    @change="onFilterChange"
                  />
                  <span :class="`rating-badge rating-${rating}`">{{
                    rating
                  }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="filter-group">
            <h6 class="filter-title text-light mb-2">Demoman Ratings</h6>
            <div class="rating-filter-container">
              <div class="rating-filters">
                <label
                  v-for="rating in availableRatings"
                  :key="'demo-rating-' + rating"
                  class="rating-checkbox"
                >
                  <input
                    type="checkbox"
                    :value="rating"
                    v-model="selectedDemomanRatings"
                    @change="onFilterChange"
                  />
                  <span :class="`rating-badge rating-${rating}`">{{
                    rating
                  }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Groups Filter -->
        <div class="filter-group">
          <h6 class="filter-title text-light mb-2">Placement</h6>
          <div class="group-filter-container">
            <div class="group-filters">
              <label class="group-checkbox">
                <input
                  type="checkbox"
                  value="WR"
                  v-model="selectedGroups"
                  @change="onFilterChange"
                />
                <span class="group-badge group-wr">WR</span>
              </label>
              <label class="group-checkbox">
                <input
                  type="checkbox"
                  value="TT"
                  v-model="selectedGroups"
                  @change="onFilterChange"
                />
                <span class="group-badge group-tt">TT</span>
              </label>
              <label
                v-for="group in availableGroups"
                :key="'group-' + group"
                class="group-checkbox"
              >
                <input
                  type="checkbox"
                  :value="group"
                  v-model="selectedGroups"
                  @change="onFilterChange"
                />
                <span :class="`group-badge group-${group}`">G{{ group }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Class and Type Filters -->
        <div class="filter-columns">
          <div class="filter-group">
            <h6 class="filter-title text-light mb-2">Class</h6>
            <div class="class-filter-container">
              <label
                v-for="classOption in ['soldier', 'demoman']"
                :key="classOption"
                class="class-checkbox"
              >
                <input
                  type="checkbox"
                  :value="classOption"
                  v-model="selectedClasses"
                  @change="onFilterChange"
                />
                <span>{{ classOption }}</span>
              </label>
            </div>
          </div>
          <div class="filter-group">
            <h6 class="filter-title text-light mb-2">Type</h6>
            <div class="type-filter-container">
              <label
                v-for="typeOption in ['map', 'course', 'bonus']"
                :key="typeOption"
                class="type-checkbox"
              >
                <input
                  type="checkbox"
                  :value="typeOption"
                  v-model="selectedTypes"
                  @change="onFilterChange"
                />
                <span>{{ typeOption }}</span>
              </label>
            </div>
          </div>
          <!-- Sort by Date Dropdown -->
          <div class="filter-group">
            <h6 class="filter-title text-light mb-2">Sort by</h6>
            <div class="dropdown">
              <button
                class="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ selectedSortOption }}
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li v-for="option in dropdownOptions" :key="option.value">
                  <a
                    class="dropdown-item"
                    href="#"
                    @click.prevent="selectSortOption(option.value)"
                    >{{ option.label }}</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="filter-actions">
          <button
            type="button"
            @click="clearAllFilters"
            class="btn btn-secondary"
          >
            Clear filters
          </button>
          <span class="text-light"
            >Displaying {{ filteredSortedItems.length }} of
            {{ totalRecordsLength() }} records</span
          >
        </div>
      </div>
    </div>
    <hr class="row-divider" style="width: 75%" />

    <!-- Loading and Error States -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading records...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- Table Section -->
    <div
      v-else
      class="tables-wrapper d-flex flex-column flex-md-row justify-content-center"
    >
      <div v-if="playerId != null" class="table-wrapper">
        <div class="table-responsive">
          <table class="table table-dark">
            <thead>
              <tr>
                <th>Map</th>
                <th>Type</th>
                <th>Class</th>
                <th></th>
                <th></th>
                <th>Time</th>
                <th>Rank</th>
                <th>Completion</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in filteredRecords" :key="record.id">
                <td class="clickable" @click="goToMap(record.map_id)">
                  {{ record.map_name }}
                </td>
                <td>{{ getRecordType(record.type) }}</td>
                <td>
                  <img
                    :src="`/tempus-plaza/icons/${record.class}.png`"
                    :alt="`${record.class}`"
                    class="class-icon"
                  />
                </td>
                <td>T{{ record.tier }}</td>
                <td>R{{ record.rating }}</td>
                <td>{{ formatDuration(record.duration) }}</td>
                <td :class="getRankColorClass(record.placement)">
                  {{ record.rank }}
                </td>
                <td>{{ record.completion_count }}</td>
                <td class="text-small">
                  {{ formatDate(new Date(record.date * 1000)) }}
                </td>
              </tr>
            </tbody>
          </table>
          <div class="maps-footer">
            <button
              v-if="displayCount < filteredSortedItems.length"
              @click="showMore"
              class="btn btn-dark update-button show-more-btn"
            >
              Show more
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DOMPurify from "dompurify";
import Cookies from "js-cookie";
import { formatDuration } from "@/utils/calculations.js";
const API_BASE_URL =
  import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:3000";
export default {
  name: "PlayerRecords",
  data: () => ({
    playerId: null,
    selectedPlayerName: null,
    records: [],
    loading: false,
    error: null,
    selectedClasses: [],
    selectedTypes: [],
    filteredRecords: [],
    selectedSoldierTiers: [],
    selectedSoldierRatings: [],
    selectedDemomanTiers: [],
    selectedDemomanRatings: [],
    availableTiers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    availableRatings: [1, 2, 3, 4],
    availableGroups: [1, 2, 3, 4, 5],
    selectedGroups: [],
    sortByDate: "newest",
    searchQuery: "",
    searchResults: null,
    debounceTimer: null,
    cachedRecords: {
      records: [],
      courseRecords: [],
      bonusRecords: [],
    },
    dropdownOptions: [
      { value: "newest", label: "Newest" },
      { value: "oldest", label: "Oldest" },
      { value: "highestRank", label: "Highest Rank" },
      { value: "lowestRank", label: "Lowest Rank" },
      { value: "highestPercentage", label: "Highest %" },
      { value: "lowestPercentage", label: "Lowest %" },
      { value: "shortestDuration", label: "Shortest Duration" },
      { value: "longestDuration", label: "Longest Duration" },
    ],
    validPlacements: [],
    displayCount: 300,
  }),
  computed: {
    user() {
      const userCookie = Cookies.get("user");
      if (!userCookie) return null;
      try {
        return JSON.parse(userCookie);
      } catch (e) {
        console.error("Malformed user cookie:", e);
        return null;
      }
    },
    filteredSortedItems() {
      let recordsToFilter = [];

      if (this.selectedTypes.length === 0) {
        recordsToFilter = [
          ...this.cachedRecords.records,
          ...this.cachedRecords.courseRecords,
          ...this.cachedRecords.bonusRecords,
        ];
      } else {
        if (this.selectedTypes.includes("map")) {
          recordsToFilter.push(...this.cachedRecords.records);
        }
        if (this.selectedTypes.includes("course")) {
          recordsToFilter.push(...this.cachedRecords.courseRecords);
        }
        if (this.selectedTypes.includes("bonus")) {
          recordsToFilter.push(...this.cachedRecords.bonusRecords);
        }
      }

      const filtered = recordsToFilter.filter((record) => {
        if (
          this.selectedClasses.length > 0 &&
          !this.selectedClasses.includes(record.class)
        ) {
          return false;
        }

        if (record.class === "soldier") {
          if (
            this.selectedSoldierTiers.length > 0 &&
            !this.selectedSoldierTiers.includes(record.tier)
          ) {
            return false;
          }
          if (
            this.selectedSoldierRatings.length > 0 &&
            !this.selectedSoldierRatings.includes(record.rating)
          ) {
            return false;
          }
        } else if (record.class === "demoman") {
          if (
            this.selectedDemomanTiers.length > 0 &&
            !this.selectedDemomanTiers.includes(record.tier)
          ) {
            return false;
          }
          if (
            this.selectedDemomanRatings.length > 0 &&
            !this.selectedDemomanRatings.includes(record.rating)
          ) {
            return false;
          }
        }

        if (this.selectedGroups.length > 0) {
          if (!this.validPlacements.includes(record.placement)) {
            return false;
          }
        }

        return true;
      });

      return filtered.sort((a, b) => {
        if (this.sortByDate === "newest") {
          return b.date - a.date;
        } else if (this.sortByDate === "oldest") {
          return a.date - b.date;
        } else if (this.sortByDate === "highestRank") {
          return a.rank - b.rank;
        } else if (this.sortByDate === "lowestRank") {
          return b.rank - a.rank;
        } else if (this.sortByDate === "highestPercentage") {
          return b.completion_count / b.rank - a.completion_count / a.rank;
        } else if (this.sortByDate === "lowestPercentage") {
          return a.completion_count / a.rank - b.completion_count / b.rank;
        } else if (this.sortByDate === "shortestDuration") {
          return a.duration - b.duration;
        } else if (this.sortByDate === "longestDuration") {
          return b.duration - a.duration;
        }
        return 0;
      });
    },
    selectedSortOption() {
      const option = this.dropdownOptions.find(
        (opt) => opt.value === this.sortByDate
      );
      return option ? option.label : "Newest";
    },
  },
  watch: {
    playerId(newPlayerId) {
      if (newPlayerId) {
        this.fetchRecords();
      }
    },
    selectedGroups: {
      handler() {
        const placements = [];
        this.selectedGroups.forEach((group) => {
          if (group === "WR") {
            placements.push(1);
          } else if (group === "TT") {
            placements.push(...[2, 3, 4, 5, 6, 7, 8, 9, 10]);
          } else {
            placements.push(10 + Number(group));
          }
        });
        this.validPlacements = placements;
      },
      immediate: true,
    },
  },
  mounted() {
    document.title = "Tempus plaza - Lookup";

    const userCookie = Cookies.get("user");
    let user = null;
    if (userCookie) {
      try {
        user = JSON.parse(userCookie);
      } catch (e) {
        console.error("Malformed user cookie:", e);
      }
    }
    if (user && user.playerid) {
      this.playerId = user.playerid;
      this.selectedPlayerName = user.name;
      this.fetchRecords();
    }
  },
  methods: {
    goToPlayer(playerId) {
      this.$router.push({
        name: "PlayerPage",
        params: { playerId: playerId },
      });
    },
    goToMap(mapId) {
      this.$router.push({
        name: "Records",
        params: { mapId: mapId },
      });
    },
    getRecordType(type) {
      const firstLetter = type.slice(0, 1).toUpperCase();
      switch (firstLetter) {
        case "M":
          return "🌍";
        case "C":
          return "🚩";
        case "B":
          return "⭐";
        default:
          return "";
      }
    },

    sanitize(str) {
      return DOMPurify.sanitize(str || "");
    },
    showMore() {
      this.displayCount += 300;
      this.applyFilters();
    },
    getRankColorClass(placement) {
      if (placement === 1) return "placement-rank-gold";
      else if (placement === 2) return "placement-rank-silver";
      else if (placement === 3) return "placement-rank-bronze";
      else if (placement >= 4 && placement <= 10) return "placement-rank-tt";
      else if (placement === 11) return "placement-group-1";
      else if (placement === 12) return "placement-group-2";
      else if (placement === 13) return "placement-group-3";
      else if (placement === 14) return "placement-group-4";
      else if (placement === 15) return "placement-group-5";
      return "";
    },
    totalRecordsLength() {
      return (
        this.cachedRecords.records.length +
        this.cachedRecords.courseRecords.length +
        this.cachedRecords.bonusRecords.length
      );
    },
    formatDate(date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      //return `${day}/${month}/${year}`;
      return `${year}/${month}/${day}`;
    },
    async onSearch() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(async () => {
        if (this.searchQuery.trim()) {
          try {
            const response = await fetch(`${API_BASE_URL}/search`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ query: this.searchQuery }),
            });

            if (!response.ok) throw new Error("Failed to fetch search results");
            const data = await response.json();

            if (data.players && data.players.length > 20) {
              data.players = data.players.slice(0, 20);
            }

            this.searchResults = { players: data.players };
          } catch (error) {
            console.error("Error fetching search results:", error);
          }
        } else {
          this.searchResults = null;
        }
      }, 500);
    },
    selectPlayer(playerId) {
      this.playerId = playerId;
      this.selectedPlayerName = this.searchResults.players.find(
        (player) => player.id === playerId
      ).name;
      this.searchQuery = "";
      this.searchResults = null;
    },
    selectSortOption(value) {
      this.sortByDate = value;
      this.applyFilters();
    },
    async fetchRecords() {
      this.loading = true;
      this.error = null;
      const playerId = this.playerId;
      if (!playerId) {
        this.error = "Please select a player first.";
        this.loading = false;
        return;
      }

      try {
        const urls = [
          `${API_BASE_URL}/players/${playerId}/records`,
          `${API_BASE_URL}/players/${playerId}/course-records`,
          `${API_BASE_URL}/players/${playerId}/bonus-records`,
        ];

        const responses = await Promise.all(urls.map((url) => fetch(url)));
        const data = await Promise.all(
          responses.map((response) => {
            if (!response.ok) throw new Error("Failed to fetch records");
            return response.json();
          })
        );

        this.cachedRecords = {
          records: data[0],
          courseRecords: data[1],
          bonusRecords: data[2],
        };

        this.records = this.cachedRecords.records;
        this.applyFilters();
      } catch (error) {
        this.error = "Error fetching records.";
        console.error("Error fetching records:", error);
      } finally {
        this.loading = false;
      }
    },
    applyFilters() {
      this.filteredRecords = this.filteredSortedItems.slice(
        0,
        this.displayCount
      );
    },
    clearAllFilters() {
      this.selectedClasses = [];
      this.selectedTypes = [];
      this.selectedSoldierTiers = [];
      this.selectedSoldierRatings = [];
      this.selectedDemomanTiers = [];
      this.selectedDemomanRatings = [];
      this.applyFilters();
    },
    onFilterChange() {
      this.applyFilters();
    },
    formatDuration(unixTimestamp) {
      return formatDuration(unixTimestamp);
    },
  },
  beforeDestroy() {
    clearTimeout(this.debounceTimer);
  },
};
</script>

<style scoped>
.bg-dark-custom {
  background: var(--color-background);
}

.clickable {
  cursor: pointer;
  color: var(--color-text-clickable) !important;
}

.clickable:hover {
  background-color: var(--color-primary) !important;
}

.text-small {
  font-size: 0.8rem;
}

.search-section {
  width: 100%;
  max-width: 500px;
}

.search-container {
  position: relative;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #888;
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 16px 16px 16px 50px;
  background: var(--color-box);
  border: 2px solid rgba(68, 68, 68, 0.3);
  border-radius: 12px;
  color: #ffffff;
  font-size: 16px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.1);
}

.search-input::placeholder {
  color: #888;
}

.row-divider {
  border: none;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--color-primary),
    transparent
  ) !important;
  margin: 30px 0;
  opacity: 0.6;
}

.filter-section {
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid rgba(68, 68, 68, 0.3);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 0 0 1px var(--color-border, #444);
  width: fit-content;
  max-width: 100%;
}

.filter-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.filter-columns {
  display: flex;
  gap: 48px;
  align-items: flex-start;
}

.filter-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.filter-title {
  font-weight: bold;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
}

.class-filter-container,
.type-filter-container {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.class-checkbox,
.type-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0;
  background-color: var(--color-border-soft);
  border-radius: 8px;
}

.class-checkbox input,
.type-checkbox input {
  display: none;
}

.class-checkbox span,
.type-checkbox span {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 13px;
  border: 2px solid rgba(68, 68, 68, 0.3);
  color: #ffffff;
  text-transform: capitalize;
  transition: all 0.3s ease;
  min-width: 80px;
  text-align: center;
}

.class-checkbox input:checked + span,
.type-checkbox input:checked + span {
  border: 2px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-primary);
}

.class-checkbox:hover input:not(:checked) + span,
.type-checkbox:hover input:not(:checked) + span {
  border-radius: 8px;
  background-color: var(--color-primary);
}

.search-results-dropdown {
  position: absolute;
  background: var(--color-box);
  border: 1px solid rgba(68, 68, 68, 0.3);
  border-radius: 12px;
  box-shadow: 0 0 0 1px var(--color-box, #444);
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 8px;
}

.search-results-dropdown ul {
  list-style: none;
  padding: 8px;
  margin: 0;
}

.search-results-dropdown li {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 4px;
  background: var(--color-box);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-results-dropdown li:hover {
  background: var(--color-primary);
  transform: translateX(4px);
}

.search-results-dropdown li:last-child {
  margin-bottom: 0;
}

.search-results-dropdown h6 {
  margin: 12px 16px 8px;
  font-size: 12px;
  font-weight: bold;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.form-select {
  padding: 12px 16px;
  background: var(--color-row-odd);
  border: 2px solid rgba(68, 68, 68, 0.3);
  border-radius: 8px;
  color: #ffffff;
  font-weight: bold;
  transition: all 0.3s ease;
}

.form-select:focus {
  border-color: var(--color-primary);
}

.form-option:hover {
  background: red !important;
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 8px;
}

.btn-secondary {
  border: 1px solid var(--color-dark);
  font-weight: bold;
}

.btn-secondary:hover {
  border: 1px solid var(--color-dark);
  background: var(--color-primary);
}

.tier-filter-container,
.rating-filter-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.tier-filters,
.rating-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.tier-checkbox,
.rating-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0;
}

.tier-checkbox:hover,
.rating-checkbox:hover,
.group-checkbox:hover {
  border-radius: 4px;
  border-color: var(--color-border, #444);
  box-shadow: 0 0 0 1px var(--color-border, #444);
}

.tier-checkbox input,
.rating-checkbox input {
  display: none;
}

.tier-checkbox input:checked + .tier-badge,
.rating-checkbox input:checked + .rating-badge {
  border-color: var(--color-border, #444);
  box-shadow: 0 0 0 1px var(--color-border, #444);
}

.tier-badge,
.rating-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 12px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  min-width: 28px;
  text-align: center;
}

.tier-badge.tier-0,
.tier-color.tier-0 {
  background: var(--color-dark);
  color: var(--color-text);
}

.tier-badge.tier-1,
.tier-color.tier-1 {
  background: #6ed0f681;
  color: var(--color-text);
}

.tier-badge.tier-2,
.tier-color.tier-2 {
  background: #56b3e977;
  color: var(--color-text);
}

.tier-badge.tier-3,
.tier-color.tier-3 {
  background: #45b8ad6e;
  color: var(--color-text);
}

.tier-badge.tier-4,
.tier-color.tier-4 {
  background: #65c18b75;
  color: var(--color-text);
}

.tier-badge.tier-5,
.tier-color.tier-5 {
  background: #a3d97775;
  color: var(--color-text);
}

.tier-badge.tier-6,
.tier-color.tier-6 {
  background: #f3e68370;
  color: var(--color-text);
}

.tier-badge.tier-7,
.tier-color.tier-7 {
  background: #f6c26767;
  color: var(--color-text);
}

.tier-badge.tier-8,
.tier-color.tier-8 {
  background: #f08d5b65;
  color: var(--color-text);
}

.tier-badge.tier-9,
.tier-color.tier-9 {
  background: #e6695e6b;
  color: var(--color-text);
}

.tier-badge.tier-10,
.tier-color.tier-10 {
  background: #d6454569;
  color: var(--color-text);
}

.rating-badge.rating-1,
.rating-color.rating-1 {
  background: #94c47d69;
  color: var(--color-text);
}

.rating-badge.rating-2,
.rating-color.rating-2 {
  background: #abd0996b;
  color: var(--color-text);
}

.rating-badge.rating-3,
.rating-color.rating-3 {
  background: #c3b29365;
  color: var(--color-text);
}

.rating-badge.rating-4,
.rating-color.rating-4 {
  background: #e0666669;
  color: var(--color-text);
}

.group-badge.group-wr {
  background: #ffd700 !important;
  color: var(--color-dark) !important;
}

.group-badge.group-tt {
  background: #30869b !important;
  color: var(--color-dark) !important;
}

.group-badge.group-1 {
  background: #ff9797af !important;
  color: var(--color-dark) !important;
}

.group-badge.group-2 {
  background: #f7cf84 !important;
  color: var(--color-dark) !important;
}

.group-badge.group-3 {
  background: #d27d2dbb !important;
  color: var(--color-dark) !important;
}

.group-badge.group-4 {
  background: #b3b3b3ce !important;
  color: var(--color-dark) !important;
}

.group-badge.group-5 {
  background: #e4e4e4ce !important;
  color: var(--color-dark) !important;
}

.placement-rank-gold {
  color: #ffd700 !important;
}

.placement-rank-silver {
  color: #c0c0c0 !important;
}

.placement-rank-bronze {
  color: #cd7f32 !important;
}

.placement-rank-tt {
  color: #30869b !important;
}

.placement-group-1 {
  color: #ff9797af !important;
}

.placement-group-2 {
  color: #f7cf84 !important;
}

.placement-group-3 {
  color: #d27d2dbb !important;
}

.placement-group-4 {
  color: #b3b3b3ce !important;
}

.placement-group-5 {
  color: #e4e4e4ce !important;
}

.group-filter-container,
.rating-filter-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.group-filters,
.rating-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.group-checkbox,
.rating-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0;
}

.group-checkbox input,
.rating-checkbox input {
  display: none;
}

.group-checkbox input:checked + .group-badge,
.rating-checkbox input:checked + .rating-badge {
  border-color: var(--color-border, #444);
  box-shadow: 0 0 0 1px var(--color-border, #444);
}

.group-badge,
.rating-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 12px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  min-width: 28px;
  text-align: center;
}

.group-badge.group-1,
.group-color.group-1 {
  background: #6ed0f681;
  color: var(--color-text);
}

.group-badge.group-2,
.group-color.group-2 {
  background: #56b3e977;
  color: var(--color-text);
}

.group-badge.group-3,
.group-color.group-3 {
  background: #45b8ad6e;
  color: var(--color-text);
}

.group-badge.group-4,
.group-color.group-4 {
  background: #65c18b75;
  color: var(--color-text);
}

.group-badge.group-5,
.group-color.group-5 {
  background: #a3d97775;
  color: var(--color-text);
}

.dropdown-menu {
  background-color: var(--color-row);
  border: 1px solid var(--color-border);
}

.dropdown-item {
  font-weight: bold;
  color: var(--color-text);
  background-color: var(--color-row);
}

.dropdown-item:hover {
  color: var(--color-text);
  background-color: var(--color-primary);
}

.class-icon {
  width: 25px;
  height: 25px;
  margin: 8px;
}

.table-responsive {
  box-shadow: 0 0 0 1px var(--color-border, #444);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  overflow: hidden;
  margin-bottom: 0px;
}

.table-dark {
  margin: 0px;
  background: transparent;
}

.table-dark thead {
  background: linear-gradient(
    90deg,
    var(--color-primary),
    var(--color-box)
  ) !important;
}

.table-dark th {
  color: var(--color-text);
  background: transparent;
  text-align: center;
  font-weight: bold;
  padding: 16px 12px;
  border-top: 1px solid var(--color-border-soft);
  border-bottom: 1px solid var(--color-border-soft);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  vertical-align: middle;
}

.table-dark td {
  background: var(--color-box);
  color: var(--color-text);
  font-weight: 500;
  padding: 6px 12px;
  text-align: center;
  vertical-align: middle;
}
.table-dark tr:nth-child(odd) td {
  background: var(--color-row-odd);
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.alert-danger {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 8px;
  color: #ff6b6b;
}

.player-name-display {
  text-align: center;
}

.player-name-display h2 {
  color: var(--color-text);
  font-size: 2rem;
}

.show-more-btn {
  background: var(--color-primary);
  font-weight: bold;
  width: 100%;
  border-radius: 0 0 0 0;
}

@media (max-width: 767.98px) {
  .filter-section {
    padding: 20px;
    width: 100%;
    margin: 0 16px;
  }

  .filter-columns {
    flex-direction: column;
    gap: 24px;
    width: 100%;
  }

  .tables-wrapper {
    flex-direction: column;
    align-items: center;
    padding: 0 16px;
  }
}
</style>
