import { actions, subscribe } from './store/gameStore.js';
import { render } from './components/render.js';

const root = document.getElementById('app');
subscribe(() => render(root));
actions.startGame();
render(root);
