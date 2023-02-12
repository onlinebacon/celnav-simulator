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

const main = async () => {
    const startTime = new Date('2023-01-01T00:00:00Z')/1000;
    const maxTime = new Date('2024-01-01T00:00:00Z')/1000;
    const interval = 24*60*60;
    const timestamps = [];
    for (let time=startTime;;time+=interval) {
        timestamps.push(time);
        if (time >= maxTime) break;
    }
    const requests = timestamps.map((timestamp) => {
        const time = new Date(timestamp*1000);
        return getSunPosAt(time);
    });
    const responses = await Promise.all(requests);
    const raList = [];
    const decList = [];
    responses.forEach((res) => {
        raList.push(res.ra);
        decList.push(res.dec);
    });
    const data = { startTime, interval, raList, decList };
    const json = `export default ${JSON.stringify(data, null, '\t')};`;
    fs.writeFileSync('../js/db/sun.js', json);
};

main().catch(console.error);
