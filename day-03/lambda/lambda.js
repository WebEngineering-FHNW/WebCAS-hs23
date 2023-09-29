const id    = x => x;
const konst = x => y => x;

const fst = konst;
const snd = konst(id);

const T = konst;
const F = snd;

// const and = x => y => x ( y (T) (F) )   ( y (F) (F) );
// const and = x => y => x ( y (T) (F) )   ( F );
// const and = x => y => x ( y )           ( F );
const    and = x => y => x (y) (x);

// const or  = x => y => x ( y (T) (T)  )  ( y (T) (F) ) ;
// const or  = x => y => x ( T )  ( y (T) (F) ) ;
// const or  = x => y => x ( T )  ( y ) ;
// const or  = x =>  x ( T ) ;
const or  = x =>  x (x) ;

const not = x => x (F) (T);


const Pair = fn => ln => getter => getter (fn) (ln); // closure
// fst
// snd


const Left   = x => l => r => l(x);
const Right  = x => l => r => r(x);
// const either = id;


Left("hallo")
   ( x => console.log("left",  x))
   ( x => console.log("right", x));




