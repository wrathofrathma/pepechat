import { createApp } from 'vue'
import App from './App.vue'
import 'tailwindcss/tailwind.css'
import router from './routes';
import {sync} from 'vuex-router-sync';
import store from './store';

sync(store, router);

createApp(App)
    .use(router)
    .use(store)
    .directive('click-outside', {
        beforeMount(el, binding, vnode) {
            el.clickOutsideEvent = function (event: any) {
                if (!(el === event.target || el.contains(event.target))) {
                    binding.value(event, el);
                }
            }
            // Using click as our event was masking @click events for inner elements.
            document.body.addEventListener('mouseup', el.clickOutsideEvent);
        },
        unmounted(el) {
            document.body.removeEventListener('mouseup', el.clickOutsideEvent);
        }
    })
    .mount('#app')
