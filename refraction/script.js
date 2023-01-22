const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let scr_size_x = 1300;
let scr_size_y = 900;
let scr_margin_top  = 20.5;
let scr_margin_left = 20.5;
let scr_margin_bottom = 20.5;
let scr_margin_right  = 20.5;
let scr_x0 = scr_margin_left;
let scr_x1 = scr_size_x - scr_margin_right;
let scr_y0 = scr_size_y - scr_margin_bottom;
let scr_y1 = scr_margin_top;
let val_x0 = - 0.034;
let val_x1 = 1;
let val_y0 = 0;
let val_y1 = 0.013;
canvas.width  = scr_size_x;
canvas.height = scr_size_y;
const TO_RAD = Math.PI/180;
const TO_DEG = 180/Math.PI;
const toRad = (deg) => deg*TO_RAD;
const toDeg = (rad) => rad*TO_DEG;
const cot = (deg) => 1/Math.tan(deg*TO_RAD);
const plotX = (x) => (x - val_x0)/(val_x1 - val_x0)*(scr_x1 - scr_x0) + scr_x0;
const plotY = (y) => (y - val_y0)/(val_y1 - val_y0)*(scr_y1 - scr_y0) + scr_y0;
const unplotX = (x) => (x - scr_x0)/(scr_x1 - scr_x0)*(val_x1 - val_x0) + val_x0;
const unplotY = (y) => (y - scr_y0)/(scr_y1 - scr_y0)*(val_y1 - val_y0) + val_y0;
const { sin, tan, asin } = Math;
const myEq = (x) => {
	const c1 = TO_RAD;
	const c2 = TO_DEG;
	const c3 = 5.11;
	const c4 = 10.3*c1;
	const c5 = 0.017*c1;
	const h = asin(x)*c2;
	return (sin(h*c1 + c5/tan(h*c1 + c4/(h + c3))) - x)*0.99;
};
const drawAxes = () => {
	ctx.strokeStyle = '#fff';
	ctx.beginPath();
	ctx.moveTo(scr_x0, scr_y1);
	ctx.lineTo(scr_x0, scr_y0);
	ctx.lineTo(scr_x1, scr_y0);
	ctx.stroke();
};
const almanacEquation = (ha) => {
	const angle = ha + 7.31/(ha + 4.4);
	const rad = angle*(Math.PI/180);
	return 1/Math.tan(rad);
};
const plotValues = (values, color) => {
	ctx.strokeStyle = color;
	ctx.beginPath();
	for (let i=0; i<values.length; ++i) {
		let [ x, y ] = values[i];
		x = plotX(x);
		y = plotY(y);
		if (i === 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		}
	}
	ctx.stroke();
	ctx.fillStyle = color;
	for (let [ x, y ] of values) {
		x = plotX(x);
		y = plotY(y);
		ctx.beginPath();
		ctx.arc(x, y, 2, 0, Math.PI*2);
		ctx.fill();
	}
};
const generateXValues = () => {
	const n = 100;
	return [...new Array(n)].map((_, i) => {
		return Math.pow(i/(n - 1), 1.1)*(val_x1 - val_x0) + val_x0;
	});
};
const generateAlamancValues = () => {
	const n = 1000;
	const values = [...new Array(n)].map((_, i) => {
		const a = i/(n - 1)*91 - 1;
		const h = a - almanacEquation(a)/60;
		const y1 = Math.sin(toRad(h));
		const y2 = Math.sin(toRad(a));
		return [ y1, y2 - y1 ];
	});
	return values;
};
const almanacValues = generateAlamancValues();
const textarea = document.querySelector('textarea');
const getUserValues = () => {
	const fn = myEq;
	const values = generateXValues().map(x => [ x, fn(x) ]);
	return values;
};
const render = () => {
	ctx.fillStyle = '#222';
	ctx.fillRect(0, 0, scr_size_x, scr_size_y);
	plotValues(stellariumValues, 'rgba(255, 192, 0, 0.5)');
	try {
		plotValues(getUserValues(), 'rgba(192, 255, 0, 0.5)');
	} catch {}
	drawAxes();
};
const stringifyAngle = (angle) => {
	let total = Math.round(Math.abs(angle*60*60*10));
	let dec = total%10;
	total = (total/10) | 0;
	let sec = total%60;
	total = (total/60) | 0;
	let min = total%60;
	let deg = (total/60) | 0;
	return `${angle >= 0 ? '+' : '-'}${deg}°${min}'${sec}.${dec}"`;
};
const predict = (deg, min, sec) => {
	const sign = deg >= 0 ? 1 : -1;
	const angle = sign*(deg + min/60 + sec/3600);
	const y0 = sin(toRad(angle));
	const y1 = y0 + myEq(y0);
	const res = toDeg(asin(y1));
	console.log(stringifyAngle(res));
};
canvas.addEventListener('click', e => {
	const x = Math.min(val_x1, unplotX(e.offsetX));
	const y = myEq(x);
	const angle = toDeg(asin(x));
	const newAngle = toDeg(asin(x + y));
	console.log('Alt:  ', stringifyAngle(angle));
	console.log('Pred.:', stringifyAngle(newAngle));
});
textarea.addEventListener('input', () => {
	localStorage.setItem('fn', textarea.value);
	render();
});
if (localStorage.getItem('fn')) {
	textarea.value = localStorage.getItem('fn');
}
render();
