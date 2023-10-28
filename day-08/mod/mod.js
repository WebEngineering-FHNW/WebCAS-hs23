/**
 * @module mod/mod The mod module as an example for ES6 modules
 */

// put import and exports at the top

export { pi, a, b, setA, setB, Mod }

const pi = Math.PI;

// use module as a singleton

// make a single state that is only exposed as values, not references to objects

let a = null; // these variables are exported as read-only
let b = null;

/**
 * Setter for the "a" singleton property. **Beware of side effects**!
 * @impure
 * @template _T_
 * @param { _T_ } v - the value to set for "a"
 * @return  void
 */
const setA = v => a = v;

/** @type { <_T_> (v:_T_) => _T_ } */
const setB = v => b = v;

// x = 2 // introduction of new globals is not allowed in modules
// bundlers accept it, though, and produce code without the restriction.

const Mod = { setA, setB };
