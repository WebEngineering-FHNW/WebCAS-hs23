export { Iterator, Fib , MyIterator}

const MyIterator = {
    [Symbol.iterator]:
        () => {
        let value  = 0;
        return {
                next: () => {
                    value++;
                    return {value:value, done: false}
                }
            }
        }
};
console.log("hi");
for (const x of MyIterator) {
    if(x > 100) break;
    if(x < 90)  continue;
    console.log(x);
}



const Iterator = (startValue, whileFn, incrementFn) => {
    const next = () => {
        const proceed = whileFn(startValue);
        let   value = undefined;
        if (proceed) {
            value = startValue;
            startValue = incrementFn(startValue);
        }
        return { value: value, done: !proceed };

    };
    return {
        [Symbol.iterator]: () => ({ next })
    };
};

const Fib = n => {
    let prev = 1;
    return Iterator(0, i => i < n, i => {
        const result = prev + i;
        prev = i;
        return result;
    });
};
