import fetch from 'node-fetch';
import { outputJSON } from './u.mjs';

let data = await fetch('https://schale.gg/data/tw/students.min.json').then(d => d.json());

outputJSON(data, './src/data/students.min.tw.json');
