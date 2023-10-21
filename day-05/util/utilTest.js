
// requires util.js

const test = (name, callback) => {
    // pre
    const ok = [];
    // work
    callback(ok);
    // post
    report(name, ok);
};

test ("util-times-new", ok => {
    const collect = [];
    (10).times( n => collect.push(n) );
    ok.push(collect.length === 11);
    ok.push(collect[0] === 0);
    ok.push(collect[9] === 9);
});


// extending the prototype of many objects
( () => {
    const ok = [];


    const collect = [];

    (10).times( n => collect.push(n) );

    ok.push(collect.length === 11);
    ok.push(collect[0] === 0);
    ok.push(collect[9] === 9);

    report("util-times", ok);
}) ();

( () => {
    const ok = [];



    const collect = (10).times( n => n+1 );

    ok.push(collect.length === 10);
    ok.push(collect[0] === 1);
    ok.push(collect[9] === 10);

    report("util-times", ok);
}) ();
