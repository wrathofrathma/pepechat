import { createApp } from 'vue'
import App from './App.vue'
import 'tailwindcss/tailwind.css'
import router from './routes';
import {sync} from 'vuex-router-sync';
import store from './store';

sync(store, router);

createApp(App).use(router).mount('#app')
