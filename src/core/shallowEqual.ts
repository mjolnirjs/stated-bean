/* istanbul ignore file */

function is(x: unknown, y: unknown): boolean {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    // eslint-disable-next-line no-self-compare
    return x !== x && y !== y;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shallowEqual(objA: any, objB: any): boolean {
  if (is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (const element of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, element) || !is(objA[element], objB[element])) {
      return false;
    }
  }

  return true;
}

export { shallowEqual };
