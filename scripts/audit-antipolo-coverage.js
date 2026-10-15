const { readBounds } = require('./lib/serviceArea');

const HEADERS = { 'User-Agent': 'TriwayDemo/1.0 (student project)' };
const WIDE = '120.95,14.35,121.50,14.85'; // wider than the service area on purpose
const B = readBounds();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const BARANGAYS = [
  { name: 'Bagong Nayon', aliases: ['Bagong Nayon'], queries: ['Barangay Bagong Nayon, Antipolo, Rizal'] },
  { name: 'Beverly Hills', aliases: ['Beverly Hills'], queries: ['Barangay Beverly Hills, Antipolo, Rizal'] },
  { name: 'Calawis', aliases: ['Calawis'], queries: ['Barangay Calawis, Antipolo, Rizal'] },
  { name: 'Cupang', aliases: ['Cupang'], queries: ['Barangay Cupang, Antipolo, Rizal'] },
  { name: 'Dalig', aliases: ['Dalig'], queries: ['Barangay Dalig, Antipolo, Rizal'] },
  { name: 'Dela Paz', aliases: ['Dela Paz'], queries: ['Barangay Dela Paz, Antipolo, Rizal'] },
  { name: 'Inarawan', aliases: ['Inarawan'], queries: ['Barangay Inarawan, Antipolo, Rizal'] },
  { name: 'Mambugan', aliases: ['Mambugan'], queries: ['Barangay Mambugan, Antipolo, Rizal'] },
  { name: 'Mayamot', aliases: ['Mayamot'], queries: ['Barangay Mayamot, Antipolo, Rizal'] },
  { name: 'Muntingdilaw', aliases: ['Muntingdilaw', 'Munting Dilao'], queries: ['Barangay Muntingdilaw, Antipolo, Rizal', 'Barangay Munting Dilao, Antipolo, Rizal'] },
  { name: 'San Isidro', aliases: ['San Isidro'], queries: ['Barangay San Isidro, Antipolo, Rizal'] },
  { name: 'San Jose', aliases: ['San Jose'], queries: ['Barangay San Jose, Antipolo, Rizal'] },
  {
    name: 'San Juan',
    aliases: ['San Juan'],
    queries: [
      'San Juan Barangay Hall, Antipolo, Rizal',
      'Barangay San Juan, Antipolo',
      'Barangay San Juan, Antipolo, Rizal',
    ],
  },
  { name: 'San Luis', aliases: ['San Luis'], queries: ['Barangay San Luis, Antipolo, Rizal'] },
  {
    name: 'San Roque',
    aliases: ['San Roque'],
    queries: [
      'San Roque Barangay Hall, Antipolo, Rizal',
      'Barangay San Roque, Antipolo',
      'Barangay San Roque, Antipolo, Rizal',
    ],
  },
  { name: 'Santa Cruz', aliases: ['Santa Cruz', 'Sta. Cruz'], queries: ['Barangay Santa Cruz, Antipolo, Rizal', 'Barangay Sta. Cruz, Antipolo, Rizal'] },
].map((b) => ({ kind: 'barangay', ...b }));

const PLACES = [
  { name: 'Masinag Junction', zone: 1, aliases: ['Masinag Junction', 'Masinag'] },
  { name: 'SM City Masinag', zone: 1, aliases: ['SM City Masinag', 'SM Masinag'] },
  { name: 'Sta. Lucia East Grand Mall', zone: 1, aliases: ['Sta. Lucia East Grand Mall', 'Sta. Lucia', 'Santa Lucia'] },
  { name: 'Cogeo Public Market', zone: 1, aliases: ['Cogeo Public Market', 'Cogeo Market'] },
  { name: 'Cogeo Gate 2', zone: 1, aliases: ['Cogeo Gate 2', 'Cogeo'] },
  { name: 'Sen. Lorenzo Sumulong Memorial Circle', zone: 2, aliases: ['Sen. Lorenzo Sumulong Memorial Circle', 'Senator L. Sumulong Memorial Circle', 'Sumulong Memorial Circle', 'Sumulong Circle'] },
  { name: 'Antipolo Cathedral', zone: 2, aliases: ['Antipolo Cathedral', 'Cathedral'] },
  { name: 'Hinulugang Taktak', zone: 2, aliases: ['Hinulugang Taktak', 'Taktak'] },
  { name: 'Antipolo City Hall', zone: 2, aliases: ['Antipolo City Hall', 'City Hall'] },
  { name: 'Rizal Provincial Capitol', zone: 2, aliases: ['Rizal Provincial Capitol', 'Provincial Capitol', 'Capitol'] },
  { name: 'Robinsons Place Antipolo', zone: 2, aliases: ['Robinsons Place Antipolo', 'Robinsons Antipolo'] },
  { name: 'Ynares Center', zone: 2, aliases: ['Ynares Center', 'Ynares'] },
  { name: 'Victory Park and Shop', zone: 2, aliases: ['Victory Park and Shop', 'Victory Park'] },
  { name: 'Cloud 9 Antipolo', zone: 3, aliases: ['Cloud 9 Antipolo', 'Cloud 9'] },
  { name: 'Boso-Boso Church', zone: 3, aliases: ['Boso-Boso Church', 'Bosoboso Church', 'Boso-Boso', 'Bosoboso'] },
  { name: 'Pinto Art Museum', zone: 3, aliases: ['Pinto Art Museum', 'Pinto Art'] },
  { name: "Luljetta's Hanging Gardens", zone: 3, aliases: ["Luljetta's Hanging Gardens", "Luljetta"] },
].map((p) => ({
  kind: `zone ${p.zone}`,
  name: p.name,
  aliases: p.aliases,
  queries: [`${p.name}, Antipolo, Rizal`],
}));

function labelContainsName(label, aliases) {
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, ' ');
  const l = norm(label);
  return aliases.some((a) => l.includes(norm(a)));
}

async function find(q) {
  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=1&lang=en&bbox=${WIDE}`;
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return null;
    const json = await res.json();
    const f = json.features && json.features[0];
    if (!f) return null;
    const [lon, lat] = f.geometry.coordinates; // Photon is [lon, lat]
    const p = f.properties;
    return {
      lat, lon,
      label: [p.name, p.street, p.locality, p.city].filter(Boolean).join(', '),
      looksAntipolo: JSON.stringify(p).toLowerCase().includes('antipolo'),
      extent: p.extent, // [west, north, east, south] when Photon has it
    };
  } catch (err) {
    return null;
  }
}

(async () => {
  console.log(`Current bounds: N ${B.north}  S ${B.south}  E ${B.east}  W ${B.west}\n`);
  const allItems = [...BARANGAYS, ...PLACES];
  const auditResults = [];

  for (let idx = 0; idx < allItems.length; idx++) {
    const item = allItems[idx];
    let bestHit = null;
    let matchingHit = null;

    for (const q of item.queries) {
      const hit = await find(q);
      await sleep(1300);
      if (hit && hit.looksAntipolo) {
        if (!bestHit) bestHit = hit;
        if (labelContainsName(hit.label, item.aliases)) {
          matchingHit = hit;
          break; // Stop querying if we found an Antipolo hit that contains the searched name
        }
      } else if (!bestHit && hit) {
        bestHit = hit;
      }
    }

    const hit = matchingHit || bestHit;
    auditResults.push({ item, hit });
  }

  // Check duplicate coordinates across all results
  const coordGroups = new Map();
  for (const res of auditResults) {
    if (res.hit) {
      const key = `${res.hit.lat.toFixed(5)},${res.hit.lon.toFixed(5)}`;
      if (!coordGroups.has(key)) coordGroups.set(key, []);
      coordGroups.get(key).push(res.item.name);
    }
  }

  let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;
  const track = (lat, lon) => {
    minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat);
    minLon = Math.min(minLon, lon); maxLon = Math.max(maxLon, lon);
  };

  for (const { item, hit } of auditResults) {
    if (!hit) {
      console.log(`[${item.kind}] ${item.name}: NOT FOUND`);
      continue;
    }

    const flags = [];
    if (!hit.looksAntipolo) flags.push('NOT CLEARLY ANTIPOLO, CHECK BY HAND');

    // (a) Flag if label does not contain the searched name
    if (!labelContainsName(hit.label, item.aliases)) {
      flags.push('LABEL DOES NOT CONTAIN SEARCHED NAME');
    }

    // Specific flag for Cogeo Public Market resolving to Antipolo Public Market
    if (item.name === 'Cogeo Public Market' && hit.label.toLowerCase().includes('antipolo public market')) {
      flags.push('RESOLVED TO ANTIPOLO PUBLIC MARKET INSTEAD OF COGEO');
    }

    // (b) Flag if duplicate coordinates exist
    const key = `${hit.lat.toFixed(5)},${hit.lon.toFixed(5)}`;
    const duplicates = (coordGroups.get(key) || []).filter((n) => n !== item.name);
    if (duplicates.length > 0) {
      flags.push(`IDENTICAL COORDINATES WITH ${duplicates.join(', ')}`);
    }

    if (!B.contains(hit.lat, hit.lon)) flags.push('OUTSIDE CURRENT BOUNDS');

    if (hit.extent) {
      const [w, n, e, s] = hit.extent;
      if (!B.contains(n, w) || !B.contains(s, e)) flags.push('EXTENT STICKS OUT OF BOUNDS');
      if (hit.looksAntipolo && !flags.includes('LABEL DOES NOT CONTAIN SEARCHED NAME')) {
        track(n, w);
        track(s, e);
      }
    }

    if (hit.looksAntipolo && !flags.includes('LABEL DOES NOT CONTAIN SEARCHED NAME')) {
      track(hit.lat, hit.lon);
    }

    console.log(`[${item.kind}] ${item.name}\n  -> ${hit.label}\n  -> ${hit.lat.toFixed(5)}, ${hit.lon.toFixed(5)} ${flags.length ? '  !! ' + flags.join(' | ') : ''}`);
  }

  const pad = 0.01;
  console.log('\nRange of results that looked like Antipolo (verify by hand before using):');
  console.log(`  lat ${minLat.toFixed(4)} to ${maxLat.toFixed(4)}   lon ${minLon.toFixed(4)} to ${maxLon.toFixed(4)}`);
  console.log(`  Suggested bounds with ${pad} padding:`);
  console.log(`  northEast: { lat: ${(maxLat + pad).toFixed(2)}, lng: ${(maxLon + pad).toFixed(2)} }, southWest: { lat: ${(minLat - pad).toFixed(2)}, lng: ${(minLon - pad).toFixed(2)} }`);
})();
