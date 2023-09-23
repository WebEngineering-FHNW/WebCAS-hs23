const testReport    = (actual, expected, evalFunction) => {
    const testResult = evalFunction(actual, expected);
    if(testResult === false) {
        console.error("test failed, result was:", actual, "expected: ", expected);
    }
    document.writeln( String(testResult) );
};
const equals        = (a, b) => a === b;
const notEquals     = (a, b) => a !== b;
const testEquals    = (result, expected) => testReport(result, expected, equals);
const testNotEquals = (result, expected) => testReport(result, expected, notEquals);
