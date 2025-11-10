
function isBalanced(s) {
  const stack = [];
  const pairs = {')':'(', ']':'[', '}':'{'};

  for (const char of s) {
    if (['(','[','{'].includes(char)) {
      stack.push(char);
    } else if (pairs[char]) {
      if (stack.pop() !== pairs[char]) return false;
    }
  }
  return stack.length === 0;
}

// Ejemplo
console.log(isBalanced("([]{})")); // true
console.log(isBalanced("(]"));     // false
console.log(isBalanced("([)]"));   // false
