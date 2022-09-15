'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

const PORT = 8000;

const MIME_TYPES = {
  default: 'application/octet-stream',
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  json: 'application/json',
  css: 'text/css',
  png: 'image/png',
  jpg: 'image/jpg',
  gif: 'image/gif',
  ico: 'image/x-icon',
  svg: 'image/svg+xml'
};

const STATIC_PATH = path.join(process.cwd(), './static');

const toBool = [() => true, () => false];

const prepareFile = async (url) => {
  const paths = [STATIC_PATH, url];

  if (url.endsWith('/')) {
    paths.push('index.html');
  }

  const filePath = path.join(...paths);
  const pathTraversla = 
};

console.log(`Server running at http://127.0.0.1:${PORT}/`);
