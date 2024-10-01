import '@master/css';
// import './app.css';
import '@lib/i18n.js';
import { mount } from 'svelte';
import App from './App.svelte';

const app = mount(App, {
	target: document.getElementById('app'),
});

export default app;
