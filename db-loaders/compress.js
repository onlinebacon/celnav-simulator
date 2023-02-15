const compress = (data) => {
    if (typeof data === 'number') {
        if (Number.isInteger(data)) return data;
        return Number(data.toPrecision(6))
    };
    if (data instanceof Array) {
        return data.map(compress);
    }
    if (data instanceof Object) {
        const entries = Object.entries(data);
        const compressed = entries.map(([ key, val ]) => [ key, compress(val) ]);
        return Object.fromEntries(compressed);
    }
    return data;
};

module.exports = compress;
