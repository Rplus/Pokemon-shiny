import fs from 'fs';
import fetch from 'node-fetch';
import { outputJSON, writeFile } from './u.mjs';
import { json2csv } from 'json-2-csv';

// https://docs.google.com/spreadsheets/d/13UreWc5Nq4yiLYvDRt2RyPWXsDx9y4pMWhSD0JsnHCw/gviz/tq?tqx=out:csv&tq&gid=0
// https://docs.google.com/spreadsheets/d/13UreWc5Nq4yiLYvDRt2RyPWXsDx9y4pMWhSD0JsnHCw/gviz/tq?tqx=out:json&sheet=shiny

