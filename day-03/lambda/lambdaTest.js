// requires lambda.js


let ok = [];

// id
ok.push( id(1) === 1 );
ok.push( id(id) === id );

// konst
ok.push( konst(42)(0) === 42 );
ok.push( konst(42)(1) === 42 );
ok.push( konst(42)(null) === 42 );

// kite
ok.push( snd(null)(42) === 42 );

// true

ok.push( T(1)(0) === 1 );
ok.push( F(1)(0) === 0 );

// and
ok.push( and(F)(F) === F );
ok.push( and(T)(F) === F );
ok.push( and(F)(T) === F );
ok.push( and(T)(T) === T );

// or
ok.push( or(F)(F) === F );
ok.push( or(T)(F) === T );
ok.push( or(F)(T) === T );
ok.push( or(T)(T) === T );

// flip
// flip(f)(x)(y) = f(y)(x)
//
// // not
//
// // beq
//
// // Pair
//
const dierk = Pair("Dierk")("König"); // immutable
ok.push( dierk(firstname) === "Dierk");
ok.push( dierk(lastname)  === "König");


// const tdierk = Triple("Dierk")("König")(50); // immutable
// ok.push( tdierk(tfirstname) === "Dierk");
// ok.push( tdierk(tlastname)  === "König");
// ok.push( tdierk(tage)       === 50);
//

// // either
//
const safeDiv = num => divisor =>
    divisor === 0
    ? Left("schlecht!")
    : Right(num / divisor);

( safeDiv(1)(1) )
      ( x => console.error(x))
      ( x => console.log(x));



// test result report
if ( ok.every( elem => elem) ) {
    document.writeln("All "+ ok.length +" tests ok.");
} else {
    document.writeln("Not all tests ok! Details:");
    for (let i = 0; i<ok.length; i++) {
        if(ok[i]) {
            document.writeln("Test "+ i +" ok");
        } else {
            document.writeln("Test "+ i +" failed");
        }
    }
}
