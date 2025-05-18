<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-menu">
        <div class="navbar-center">
          <router-link to="/maps" class="navbar-item">Maps</router-link>
          <router-link to="/players" class="navbar-item">Players</router-link>
        </div>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.navbar {
  background-color: #4a6fa5;
  padding: 1rem;
  display: flex;
  justify-content: center; /* Center the entire navbar content */
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand, .navbar-center {
  display: flex;
  align-items: center;
}

.navbar-center {
  justify-content: center; /* Center the navigation items */
  flex-grow: 1; /* Allow the center section to grow and take available space */
}

.navbar-item {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.navbar-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.navbar-item.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.3);
  font-weight: bold;
}
</style>
