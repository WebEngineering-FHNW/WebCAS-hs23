const id    = x => x;
const konst = x => y => x;

const snd = konst(id);

const T = konst;
const F = snd;

const a = true;
const b = false;

//if(y) { return true} else { return false }

// const and = x => y => x ( y (T) (F) )   ( y (F) (F) );
// const and = x => y => x ( y (T) (F) )   ( F );
// const and = x => y => x ( y )           ( F );
const    and = x => y => x (y) (x);


//
// const or  =
//
// const Pair =
//
//
// const Left  =
// const Right =
// const either =




