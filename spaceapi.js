const fetch = require('node-fetch');

function startPolling (url, callback, successInterval = 1000, errorInterval = 10000) {
  const next = () => startPolling(url, callback, successInterval, errorInterval);

  fetch(url)
    .then(res => res.json())
    .then(json => callback(json))
    .then(() => setTimeout(next, successInterval))
    .catch(e => {
      console.error(e.stack);
      setTimeout(next, errorInterval);
    });
}

module.exports = {
  startPolling
};
