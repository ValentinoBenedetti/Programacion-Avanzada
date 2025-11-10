
function wordFreq(text) {
  const clean = text.toLowerCase().replace(/[.,:;!?]/g, '');
  const words = clean.split(/\s+/).filter(Boolean);
  const map = new Map();
  for (const w of words) {
    map.set(w, (map.get(w) || 0) + 1);
  }
  return map;
}

// Ejemplo
console.log(wordFreq("Hola, hola! chau.")); // Map { 'hola' => 2, 'chau' => 1 }
