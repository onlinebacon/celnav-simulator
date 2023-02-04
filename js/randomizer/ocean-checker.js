const { PI } = Math;
const TAU = PI*2;

const imageURL = './img/watermap.png';

const loadImage = (src) => new Promise((done) => {
    const img = document.createElement('img');
    img.onload = () => done(img);
    img.src = src;
});

const buildBitMatrix = (image) => {
    const { width, height } = image;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    const { data } = ctx.getImageData(0, 0, width, height);
    const matrix = new Array(height);
    for (let y=0; y<height; ++y) {
        const row = new Array(width);
        for (let x=0; x<width; ++x) {
            const i = (y*width + x)*4;
            row[x] = data[i] > 127;
        }
        matrix[y] = row;
    }
    return { matrix, width, height };
};

let bitmap = null;

export const coordIsOverWater = async ([ lat, lon ]) => {
    if (!bitmap) {
        const img = await loadImage(imageURL);
        bitmap = buildBitMatrix(img);
    }
    let x = ((lon + PI)%TAU)/TAU*bitmap.width | 0;
    let y = (PI/2 - lat)/PI*bitmap.height | 0;
    y = Math.max(0, Math.min(bitmap.height - 1, y));
    return bitmap.matrix[y][x];
};
