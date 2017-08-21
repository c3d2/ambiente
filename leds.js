const dgram = require('dgram');

class LEDs {
  constructor (addr, port) {
    const sock = dgram.createSocket('udp4');
    this.send = data => {
      sock.send(data, port, addr);
    };
  }

  write (priority, pixels) {
    // Packet to send (not zeroed)
    const data = Buffer.allocUnsafe(4 + 3 * pixels.length);
    // Build header
    data.writeUInt8(priority, 0);
    data.writeUInt8(0, 1);  // CMD_SET_PIXEL_COLORS
    data.writeUInt16BE(3 * pixels.length, 2);
    // Build pixel data
    let offset = 4;
    for (let pixel of pixels) {
      for (let component of ['b', 'g', 'r']) {
        let value = Math.min(
          255,
          Math.max(
            0,
            Math.floor(
              pixel[component]
            )
          )
        );
        data.writeUInt8(value, offset);
        offset++;
      }
    }

    this.send(data);
  }
}

module.exports = LEDs;
