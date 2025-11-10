
function sortByMany(list, specs) {
  return [...list].sort((a, b) => {
    for (const {key, dir} of specs) {
      if (a[key] < b[key]) return dir === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return dir === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

// Ejemplo
const users = [
  { lastName:'Perez', age:30 },
  { lastName:'Gomez', age:25 },
  { lastName:'Perez', age:40 }
];
console.log(sortByMany(users, [{key:'lastName', dir:'asc'}, {key:'age', dir:'desc'}]));
