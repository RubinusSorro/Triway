const fs = require('fs');
const path = require('path');

function readBounds() {
  const cfg = fs.readFileSync(path.join(__dirname, '../../constants/config.ts'), 'utf8');
  const ne = cfg.match(/northEast: \{ lat: ([\d.]+), lng: ([\d.]+) \}/);
  const sw = cfg.match(/southWest: \{ lat: ([\d.]+), lng: ([\d.]+) \}/);
  if (!ne || !sw) throw new Error('Could not read SERVICE_AREA.bounds from constants/config.ts');
  const b = { north: +ne[1], east: +ne[2], south: +sw[1], west: +sw[2] };
  return {
    ...b,
    photonBbox: `${b.west},${b.south},${b.east},${b.north}`, // minLon,minLat,maxLon,maxLat
    contains: (lat, lon) => lat >= b.south && lat <= b.north && lon >= b.west && lon <= b.east,
  };
}

module.exports = { readBounds };
