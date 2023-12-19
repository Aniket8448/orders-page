// main.js or main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from '../src/router/index';
import { createPinia } from 'pinia';
import './assets/tailwind.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
