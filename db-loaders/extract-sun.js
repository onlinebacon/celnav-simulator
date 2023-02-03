const http = require('http');
const fs = require('fs');

const APIURL = 'http://skilltrek.com:8080';

const postRequest = (path, payload) => new Promise((done, fail) => {
    const url = APIURL + path;
    const json = JSON.stringify(payload);
    const buff = Buffer.from(json, 'utf-8');
    const req = http.request(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': buff.length,
        },
    }, res => {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('error', fail);
        res.on('end', () => {
            try {
                const buff = Buffer.concat(chunks);
                const json = buff.toString('utf-8');
                const body = JSON.parse(json);
                done(body);
            } catch (e) {
                fail(e);
            }
        });
    });
    req.on('error', fail);
    req.write(buff);
    req.end();
});

const getObjectTime = (date) => {
    const yr = date.getFullYear();
    const mon = date.getMonth() + 1;
    const day = date.getDate();
    const hr = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();
    return { yr, mon, day, hr, min, sec };
};

const getSunPosAt = async (date) => {
    const data = await postRequest('/radec', {
        name: 'Sun',
        utctime: getObjectTime(date),
    });
    return data;
};

const makeRequest = async (t0, t1, i, n) => {
    const b = i/n;
    const a = 1 - b;
    const t = new Date(t0*a + t1*b);
    const { ra, dec } = await getSunPosAt(t);
    return { t: t.getTime()/1000, ra, dec };
};

const main = async () => {
    const t0 = new Date('2023-01-01T00:00:00Z');
    const t1 = new Date('2024-01-01T00:00:00Z');
    const n = 100;
    const requests = [...new Array(n + 1)].map(async (_, i) => {
        return makeRequest(t0, t1, i, n);
    });
    const values = await Promise.all(requests);
    const json = `export default ${JSON.stringify(values, null, '\t')};`;
    fs.writeFileSync('../js/db/sun.js', json);
};

main().catch(console.error);
