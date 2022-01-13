import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { localService } from '../services/storageHandler';

const history = createWebHistory(process.env.BASE_URL);

const router = createRouter({
  history,
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localService.get('jwt');
  if (to.meta.requiresAuth && !isAuthenticated) next({ name: 'Login' });
  else next();
});

export default router;
