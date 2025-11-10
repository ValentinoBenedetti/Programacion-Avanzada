
function sumUnique(nums) {
  const set = new Set();
  for (const n of nums) {
    if (Number.isFinite(n)) {
      set.add(n);
    }
  }
  return [...set].reduce((acc, n) => acc + n, 0);
}

// Ejemplo
console.log(sumUnique([1, 2, 2, 3]));        // 6
console.log(sumUnique([1, '2', 2, 3, 'a'])); // 6
