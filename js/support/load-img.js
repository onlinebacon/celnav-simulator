const loadImg = (src) => new Promise((done, fail) => {
    const img = document.createElement('img');
    img.onload = () => done(img);
    img.onerror = fail;
    img.src = src;
});

export default loadImg;
