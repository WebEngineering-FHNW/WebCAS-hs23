
// todo: implement the times function

Number.prototype.times = function (f) {
    return Array.from( {length: this}, (it, idx) => f(idx) );
};

