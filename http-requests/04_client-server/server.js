const http = require('http');

const users = {
  hleb: { name: 'Hleb Haiduk', city: 'Poznan', born: 1998 },
  markus: { name: 'Markus Aurelius', city: 'Rome', born: 121 }
};

const routing = {
  '/api/user': (name) => users[name],
  '/api/userBorn': (name) => users[name].born
};

http
  .createServer((req, res) => {
    const splittedUrl = req.url.split('/');
    const urlParam = splittedUrl.pop();
    const controller = routing[splittedUrl.join('/')];

    let result = null;

    if (controller) {
      result = controller(urlParam);
    } else {
      result = { error: 'not found' };
    }

    res.end(JSON.stringify(result));
  })
  .listen(2000);
