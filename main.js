const LEDs = require('./leds');

var spaceOpen = false;
require('./spaceapi')
  .startPolling('http://www1.hq.c3d2.de/spaceapi.json', json => {
    spaceOpen = json.hasOwnProperty('open') ? json.open
      : (json.hasOwnProperty('state') && json.state.hasOwnProperty('open') ? json.state.open
       : false);
  });

// Resolve addr, or else this will result in 1 DNS lookup per pixel packet
const leds = new LEDs('172.22.99.206', 2342);

const W = 226;
const pixels = [];
for (let i = 0; i < W; i++) {
  pixels.push({ r: 0, g: 0, b: 0 });
}

const PULSE = 5000;
setInterval(() => {
  const t = Date.now() % PULSE;
  if (spaceOpen) {
    for (let i = 0; i < W; i++) {
      pixels[i].r -= 1;
      pixels[i].g -= 1;
      pixels[i].b -= 1;
    }

    pixels[Math.floor(pixels.length * Math.random())] = { r: 255, g: 255, b: 255 };
  } else {
    for (let i = 0; i < W; i++) {
      pixels[i].r = (1 - Math.sin(t * Math.PI / PULSE)) * 255;
      pixels[i].g = 0;
      pixels[i].b = 0;
    }
  }

  leds.write(1, pixels);
}, 1000 / 60);
