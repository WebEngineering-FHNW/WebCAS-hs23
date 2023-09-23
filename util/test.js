const testReport  = evalFunction => (actual, expected) => {
    const testResult = evalFunction(actual, expected);
    if(testResult === false) {
        console.error("test failed, result was:", actual, "expected: ", expected);
    }
    document.writeln( String(testResult) );
};
const equals        = (a, b) => a === b;
const notEquals     = (a, b) => a !== b;
const testEquals    = testReport (equals)    ;
const testNotEquals = testReport (notEquals) ;
