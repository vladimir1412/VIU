import { createApp } from 'vue';
import App from '@/App.vue';
import '@shoelace-style/shoelace/dist/themes/light.css';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path';

setBasePath('node_modules/@shoelace-style/shoelace/dist/assets');
createApp(App).mount('#app');
