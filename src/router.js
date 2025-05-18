import { createRouter, createWebHistory } from 'vue-router';
import Leaderboard from './components/Leaderboard.vue';
import Maps from './components/Maps.vue';
import Players from './components/Players.vue';
import PlayerPage from './components/PlayerPage.vue';

const routes = [
  {
    path: '/maps',
    name: 'Maps',
    component: Maps,
  },
  {
    path: '/maps/:mapId',
    name: 'Leaderboard',
    component: Leaderboard,
    props: route => ({
      mapId: Number(route.params.mapId),
      mapName: route.query.mapName
    })
  },
    {
    path: '/players',
    name: 'Players',
    component: Players
  },
  {
    path: '/players/:playerId',
    name: 'PlayerPage',
    component: PlayerPage,
    props: route => ({
      playerId: Number(route.params.playerId)
    })
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
