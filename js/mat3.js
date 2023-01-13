const IX = 0, IY = 1, IZ = 2;
const JX = 3, JY = 4, JZ = 5;
const KX = 6, KY = 7, KZ = 8;

const toRad = (deg) => deg*(Math.PI/180);

const mulMat3Mat3 = (a, b, dst = a) => {
	const [ aix, aiy, aiz, ajx, ajy, ajz, akx, aky, akz ] = a;
	const [ bix, biy, biz, bjx, bjy, bjz, bkx, bky, bkz ] = b;
	dst[0] = aix*bix + aiy*bjx + aiz*bkx;
	dst[1] = aix*biy + aiy*bjy + aiz*bky;
	dst[2] = aix*biz + aiy*bjz + aiz*bkz;
	dst[3] = ajx*bix + ajy*bjx + ajz*bkx;
	dst[4] = ajx*biy + ajy*bjy + ajz*bky;
	dst[5] = ajx*biz + ajy*bjz + ajz*bkz;
	dst[6] = akx*bix + aky*bjx + akz*bkx;
	dst[7] = akx*biy + aky*bjy + akz*bky;
	dst[8] = akx*biz + aky*bjz + akz*bkz;
	return dst;
};

const _rotateXMat3 = (mat, sin, cos, dst) => {
	const [ ix, iy, iz, jx, jy, jz, kx, ky, kz ] = mat;
	dst[0] = ix;
	dst[1] = iy*cos + iz*sin;
	dst[2] = iz*cos - iy*sin;
	dst[3] = jx;
	dst[4] = jy*cos + jz*sin;
	dst[5] = jz*cos - jy*sin;
	dst[6] = kx;
	dst[7] = ky*cos + kz*sin;
	dst[8] = kz*cos - ky*sin;
	return dst;
};

const _rotateYMat3 = (mat, sin, cos, dst) => {
	const [ ix, iy, iz, jx, jy, jz, kx, ky, kz ] = mat;
	dst[0] = ix*cos - iz*sin;
	dst[1] = iy;
	dst[2] = iz*cos + ix*sin;
	dst[3] = jx*cos - jz*sin;
	dst[4] = jy;
	dst[5] = jz*cos + jx*sin;
	dst[6] = kx*cos - kz*sin;
	dst[7] = ky;
	dst[8] = kz*cos + kx*sin;
	return dst;
};

const _rotateZMat3 = (mat, sin, cos, dst) => {
	const [ ix, iy, iz, jx, jy, jz, kx, ky, kz ] = mat;
	dst[0] = ix*cos + iy*sin;
	dst[1] = iy*cos - ix*sin;
	dst[2] = iz;
	dst[3] = jx*cos + jy*sin;
	dst[4] = jy*cos - jx*sin;
	dst[5] = jz;
	dst[6] = kx*cos + ky*sin;
	dst[7] = ky*cos - kx*sin;
	dst[8] = kz;
	return dst;
};

const alignIHatOnZPlane = (mat, inv) => {
	let x = mat[IX];
	let y = mat[IY];
	const rad = Math.sqrt(x*x + y*y);
	if (rad === 0) return;
	const cos = x/rad;
	const sin = y/rad;
	_rotateZMat3(mat, sin, cos, mat);
	_rotateZMat3(inv, sin, cos, inv);
};

const alignIHatOnYPlane = (mat, inv) => {
	let x = mat[IX];
	let z = mat[IZ];
	const rad = Math.sqrt(x*x + z*z);
	if (rad === 0) return;
	const cos = x/rad;
	const sin = -z/rad;
	_rotateYMat3(mat, sin, cos, mat);
	_rotateYMat3(inv, sin, cos, inv);
};

const alignJHatOnXPlane = (mat, inv) => {
	let y = mat[JY];
	let z = mat[JZ];
	const rad = Math.sqrt(y*y + z*z);
	if (rad === 0) return;
	const cos = y/rad;
	const sin = z/rad;
	_rotateXMat3(mat, sin, cos, mat);
	_rotateXMat3(inv, sin, cos, inv);
};
