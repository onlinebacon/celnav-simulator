const refTable = `
  r  |  g  |  b  |  bv
 155 | 176 | 255 | -0.32    
 185 | 201 | 255 | +0.00
 224 | 229 | 255 | +0.30
 246 | 243 | 255 | +0.50
 255 | 248 | 252 | +0.59
 255 | 238 | 221 | +0.82
 255 | 195 | 139 | +1.41
 255 | 198 | 109 | +2.00
`;

const parseTable = (src) => {
    const lines = src.trim().split(/\s*\n\s*/).map(line => line.toLowerCase().split(/\s*\|\s*/));
    const fields = lines[0];
    const rows = lines.slice(1).map(line => {
        const entries = fields.map((field, i) => {
            return [ field, Number(line[i]) ];
        });
        return Object.fromEntries(entries);
    });
    return rows;
};

const parseRGB = (row) => {
    const { r, g, b } = row;
    return [ r, g, b ].map(val => val/255);
};

const interpolateRGB = ([ r1, g1, b1 ], [ r2, g2, b2 ], val1, val2, val) => {
    const t = (val - val1)/(val2 - val1);
    const i = 1 - t;
    return [ r1*i + r2*t, g1*i + g2*t, b1*i + b2*t ];
};

const table = parseTable(refTable).map(row => {
    return { bv: row.bv, rgb: parseRGB(row) };
});

const first = table.at(0);
const last = table.at(-1);

const bvToRgb = (bv) => {
    if (bv <= first.bv) return first.rgb;
    if (bv >= last.bv) return last.rgb;
    let i = 0;
    let j = table.length - 1;
    while (j - i > 1) {
        const m = (i + j) >> 1;
        const item = table[m];
        if (bv < item.bv) {
            j = m;
        } else {
            i = m;
        }
    }
    const a = table[i];
    const b = table[j];
    return interpolateRGB(a.rgb, b.rgb, a.bv, b.bv, bv);
};

export default bvToRgb;
