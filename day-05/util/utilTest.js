
// requires util.js

const test = (name, callback) => {
    // pre
    const ok     = [];
    // work
    const equals = (actual, expected, comment="") => {
        const result = actual === expected;
        ok.push(result);
        if (false === result) {
            console.error("assert equals failed in <"+ name+ ">. Expected <"+ expected+ "> but got <"+ actual +">. " + comment);
        }
    };
    const assert = { equals };
    callback(assert);
    // post
    report(name, ok);
};

// extending the prototype of many objects
test ("util-times-new", assert => {
    const collect = [];
    (10).times( n => collect.push(n) );
    assert.equals(collect.length, 10, "Exact number of callbacks.");
    assert.equals(collect[0], 0);
    assert.equals(collect[9], 9);
});

( () => {
    const ok = [];



    const collect = (10).times( n => n+1 );

    ok.push(collect.length === 10);
    ok.push(collect[0] === 1);
    ok.push(collect[9] === 10);

    report("util-times", ok);
}) ();
