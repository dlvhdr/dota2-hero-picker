import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import wiki from 'wikijs';
import parseInfo from 'infobox-parser';
import bot2 from 'nodemw';

// wiki({
// 	apiUrl: 'http://dota2.gamepedia.com/api.php',
//   format: 'json',
//   origin: '*',
// }).page('Abaddon').then(page => page.rawInfo()).then(console.log);

// wiki({
// 	apiUrl: 'http://dota2.gamepedia.com/api.php',
//   format: 'json',
//   origin: '*',
// }).page('Abaddon').then(page => page).then(console.log);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
