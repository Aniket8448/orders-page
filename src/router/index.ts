import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router';
import TrackOrderStatus from '../components/track-order-status.vue';

const routes = [
    { path: '/', component: TrackOrderStatus },
    { path: '/track/:orderId', component: TrackOrderStatus }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
