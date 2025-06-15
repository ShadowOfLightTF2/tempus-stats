<template>
  <div id="app" @click="closeDropdown">
    <nav class="navbar navbar-expand-lg navbar-dark bg-custom">
      <div class="container justify-content-center">
        <ul class="navbar-nav">
          <li class="nav-item me-3">
            <router-link
              to="/"
              class="nav-link"
              style="color: var(--color-text); font-weight: bold"
            >
              <i class="bi bi-house"></i> Home
            </router-link>
          </li>
          <li class="nav-item me-3">
            <router-link
              to="/maps"
              class="nav-link"
              style="color: var(--color-text); font-weight: bold"
            >
              <i class="bi bi-globe"></i> Maps
            </router-link>
          </li>
          <li class="nav-item me-3">
            <router-link
              to="/players"
              class="nav-link"
              style="color: var(--color-text); font-weight: bold"
            >
              <i class="bi bi-trophy"></i> Players
            </router-link>
          </li>
          <li class="nav-item me-3">
            <router-link
              to="/lookup"
              class="nav-link"
              style="color: var(--color-text); font-weight: bold"
            >
              <i class="bi bi-search"></i> Lookup
            </router-link>
          </li>
        </ul>
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
              placeholder="Search..."
              class="search-input"
            />
          </div>
          <div
            class="search-results-dropdown"
            v-if="
              searchResults &&
              (searchResults.maps.length || searchResults.players.length)
            "
          >
            <div v-if="searchResults.maps.length">
              <h6>Maps</h6>
              <ul>
                <li
                  v-for="map in searchResults.maps"
                  :key="map.id"
                  @click="goToMap(map.id)"
                >
                  {{ map.name || `Map ID: ${map.id}` }}
                </li>
              </ul>
            </div>
            <div v-if="searchResults.players.length">
              <h6>Players</h6>
              <ul>
                <li
                  v-for="player in searchResults.players"
                  :key="player.id"
                  @click="goToPlayer(player.id)"
                >
                  {{ player.name || `Player ID: ${player.id}` }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center">
          <button
            v-if="!user || !Object.keys(user).length"
            class="btn login-button"
            @click="loginWithSteam"
          >
            <i class="bi bi-steam"></i> Login with Steam
          </button>
          <div v-if="user && Object.keys(user).length" class="dropdown">
            <button
              class="btn dropdown-toggle d-flex align-items-center"
              type="button"
              id="playerDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style="color: var(--color-text); font-weight: bold"
            >
              <img
                :src="user.avatar"
                alt="avatar"
                class="rounded-circle me-2"
                width="32"
                height="32"
                v-if="user.avatar"
              />
              <span>{{ user.name }}</span>
            </button>
            <ul
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="playerDropdown"
            >
              <li>
                <a class="dropdown-item clickable" @click="goToProfile" href="#"
                  >My profile</a
                >
              </li>
              <li>
                <div class="dropdown-item non-clickable">
                  <h6>Rank preference</h6>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      id="preferenceOverall"
                      name="rankPreference"
                      v-model="rankPreference"
                      value="overall"
                      @change="updateUserPreferences"
                    />
                    <label
                      class="form-check-label"
                      for="preferenceOverall"
                      style="
                        color: var(--color-text-clickable);
                        cursor: pointer;
                      "
                      >Overall</label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      id="preferenceSoldier"
                      name="rankPreference"
                      v-model="rankPreference"
                      value="soldier"
                      @change="updateUserPreferences"
                    />
                    <label
                      class="form-check-label"
                      for="preferenceSoldier"
                      style="
                        color: var(--color-text-clickable);
                        cursor: pointer;
                      "
                      >Soldier</label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      id="preferenceDemoman"
                      name="rankPreference"
                      v-model="rankPreference"
                      value="demoman"
                      @change="updateUserPreferences"
                    />
                    <label
                      class="form-check-label"
                      for="preferenceDemoman"
                      style="
                        color: var(--color-text-clickable);
                        cursor: pointer;
                      "
                      >Demoman</label
                    >
                  </div>
                </div>
              </li>
              <li>
                <div class="dropdown-item non-clickable">
                  <h6>Rank gender</h6>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      id="genderMale"
                      name="gender"
                      v-model="gender"
                      value="male"
                      @change="updateUserPreferences"
                    />
                    <label
                      class="form-check-label"
                      for="genderMale"
                      style="
                        color: var(--color-text-clickable);
                        cursor: pointer;
                      "
                      >Male</label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      id="genderFemale"
                      name="gender"
                      v-model="gender"
                      value="female"
                      @change="updateUserPreferences"
                    />
                    <label
                      class="form-check-label"
                      for="genderFemale"
                      style="
                        color: var(--color-text-clickable);
                        cursor: pointer;
                      "
                      >Female</label
                    >
                  </div>
                </div>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <a class="dropdown-item clickable" @click="logout" href="#"
                  >Logout</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
import Cookies from "js-cookie";
import debounce from "debounce";

const API_BASE_URL =
  process.env.VUE_APP_API_BASE_URL || "http://localhost:3000";

export default {
  name: "App",
  data() {
    return {
      searchQuery: "",
      searchResults: null,
      rankPreference: "overall",
      gender: "male",
    };
  },
  computed: {
    user() {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        return JSON.parse(userCookie);
      } else {
        return {};
      }
    },
  },
  methods: {
    closeDropdown() {
      this.searchResults = null;
    },

    loginWithSteam() {
      window.location.href = `${API_BASE_URL}/auth/steam`;
    },
    logout() {
      Cookies.remove("user");
      this.$router.push({ name: "Home" });
    },
    async updateUserPreferences() {
      if (this.user && this.user.steamid) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/users/update-user/${this.user.playerid}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                rankPref: this.rankPreference,
                gender: this.gender,
              }),
            }
          );
          if (!response.ok)
            throw new Error("Failed to update user preferences");
          const data = await response.json();
          console.log("User preferences updated:", data);

          const updatedUser = {
            ...this.user,
            rankpref: this.rankPreference,
            gender: this.gender,
          };

          Cookies.set("user", JSON.stringify(updatedUser), {
            expires: 3650,
            sameSite: "Lax",
          });
        } catch (error) {
          console.error("Error updating user preferences:", error);
        }
      }
    },

    async goToProfile() {
      if (this.user && this.user.steamid) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/players/login/${this.user.steamid}`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          if (!response.ok) throw new Error("Failed to fetch playerId");
          const data = await response.json();
          const playerId = data[0].id;
          if (playerId) {
            this.$router.push({ name: "PlayerPage", params: { playerId } });
          } else {
            throw new Error("playerId missing in response");
          }
        } catch (error) {
          console.error("Failed to login to backend:", error);
        }
      }
    },
    goToMap(mapId) {
      this.$router.push({ name: "Records", params: { mapId } });
      this.searchResults = null;
    },
    goToPlayer(playerId) {
      this.$router.push({ name: "PlayerPage", params: { playerId } });
      this.searchResults = null;
    },
    async fetchSearchResults() {
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

          if (data.players && data.players.length > 20)
            data.players = data.players.slice(0, 20);
          if (data.maps && data.maps.length > 5)
            data.maps = data.maps.slice(0, 5);

          this.searchResults = data;
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      } else {
        this.searchResults = null;
      }
    },
  },
  created() {
    this.debouncedSearch = debounce(this.fetchSearchResults, 500);
  },
  watch: {
    searchQuery() {
      this.debouncedSearch();
    },
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    const playerid = params.get("playerid");
    const name = params.get("name");
    const avatar = params.get("avatar");
    const steamid = params.get("steamid");

    const userCookie = Cookies.get("user");
    if (userCookie) {
      const user = JSON.parse(userCookie);
      this.rankPreference = user.rankpref;
      this.gender = user.gender;
    } else if (playerid) {
      console.log("URL parameters found, setting user data...");
      fetch(`${API_BASE_URL}/users/${playerid}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched user data:", data);
          this.rankPreference = data.rank_pref;
          this.gender = data.gender;

          const user = {
            name: name,
            avatar: avatar,
            steamid: steamid,
            playerid: data.player_id,
            rankpref: data.rank_pref,
            gender: data.gender,
          };

          Cookies.set("user", JSON.stringify(user), {
            expires: 3650,
            sameSite: "Lax",
          });

          this.$router.replace({ path: this.$route.path, query: {} });
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      console.log("No URL parameters or user cookie found.");
      this.logout();
    }
  },
};
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: var(--color-background) !important;
}

#app {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: var(--color-background);
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}

.navbar-dark .navbar-nav .nav-link:focus,
.navbar-dark .navbar-nav .nav-link:hover {
  background: var(--color-primary);
}

.navbar-dark .navbar-nav .router-link-exact-active {
  background: var(--color-primary);
  font-weight: bold;
}

.navbar-dark {
  font-size: large;
}

.bg-custom {
  background: var(--color-dark);
  border: 1px solid var(--color-border-soft);
}

.bg-dark-custom {
  background: var(--color-background);
}

.user {
  color: var(--color-text);
  font-weight: bold;
}

.form-check-input:checked {
  background: var(--color-primary) !important;
  border-color: var(--color-primary);
}

.login-button {
  color: var(--color-text) !important;
  font-weight: bold !important;
  border-radius: 0;
}

.login-button:hover {
  background: var(--color-primary) !important;
  border-radius: 0;
}

.bi-steam {
  color: var(--color-text);
}
</style>

<style scoped>
.row-divider {
  width: 100%;
  border: none;
  border-top: 1px solid var(--color-primary) !important;
  margin: 20px 0;
}

.dropdown-toggle {
  border-radius: 0;
  border: 0;
  background: var(--color-dark);
  color: var(--color-text);
}

.dropdown-toggle:hover {
  background: var(--color-primary);
  color: var(--color-text);
}

.dropdown-menu {
  background: var(--color-box);
  border: 1px solid var(--color-border);
}

.dropdown-item {
  color: var(--color-text);
  font-weight: bold;
}

.dropdown-item:hover,
.dropdown-item:focus {
  background: var(--color-primary);
}

.dropdown-menu .dropdown-item:hover,
.dropdown-menu .dropdown-item:focus {
  background: var(--color-primary);
  color: var(--color-text);
}

.dropdown-item.clickable {
  cursor: pointer;
  color: var(--color-text-clickable);
}

.dropdown-item.clickable:hover {
  background: var(--color-primary);
  color: var(--color-text);
}

.dropdown-item.non-clickable {
  cursor: default;
}

.dropdown-item.non-clickable:hover {
  background: transparent !important;
}

.dropdown-item .form-check {
  margin-left: 10px;
}

.dropdown-item h6 {
  font-weight: bold !important;
}

.search-container {
  position: relative;
  margin-left: 10px;
  margin-right: 10px;
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
  width: 200px;
  padding: 8px 8px 8px 36px;
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

.search-results-dropdown {
  position: absolute;
  background: var(--color-box);
  border: 1px solid rgba(68, 68, 68, 0.3);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  width: 300px;
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
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
