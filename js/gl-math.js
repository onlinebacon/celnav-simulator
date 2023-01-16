const tmp = new Array(16);

const copyMat4 = (mat, dst) => {
	for (let i=0; i<16; ++i) dst[i] = mat[i];
};

const clearMat4 = (t) => {
	t[0x0] = t[0x5] = t[0xA] = t[0xF] = 1;
	t[0x1] = t[0x2] = t[0x3] = t[0x4] = 0;
	t[0x6] = t[0x7] = t[0x8] = t[0x9] = 0;
	t[0xB] = t[0xC] = t[0xD] = t[0xE] = 0;
};

const mat4RotateX = (mat, sin, cos, dst) => {
	const [
		ix, iy, iz, iw,
		jx, jy, jz, jw,
		kx, ky, kz, kw,
		lx, ly, lz, lw,
	] = mat;

	dst[0x0] = ix;
	dst[0x1] = iy*cos - iz*sin;
	dst[0x2] = iz*cos + iy*sin;
	dst[0x3] = iw;

	dst[0x4] = jx;
	dst[0x5] = jy*cos - jz*sin;
	dst[0x6] = jz*cos + jy*sin;
	dst[0x7] = jw;

	dst[0x8] = kx;
	dst[0x9] = ky*cos - kz*sin;
	dst[0xA] = kz*cos + ky*sin;
	dst[0xB] = kw;

	dst[0xC] = lx;
	dst[0xD] = ly*cos - lz*sin;
	dst[0xE] = lz*cos + ly*sin;
	dst[0xF] = lw;
};

const mat4RotateY = (mat, sin, cos, dst) => {
	const [
		ix, iy, iz, iw,
		jx, jy, jz, jw,
		kx, ky, kz, kw,
		lx, ly, lz, lw,
	] = mat;

	dst[0x0] = ix*cos + iz*sin;
	dst[0x1] = iy;
	dst[0x2] = iz*cos - ix*sin;
	dst[0x3] = iw;

	dst[0x4] = jx*cos + jz*sin;
	dst[0x5] = jy;
	dst[0x6] = jz*cos - jx*sin;
	dst[0x7] = jw;

	dst[0x8] = kx*cos + kz*sin;
	dst[0x9] = ky;
	dst[0xA] = kz*cos - kx*sin;
	dst[0xB] = kw;

	dst[0xC] = lx*cos + lz*sin;
	dst[0xD] = ly;
	dst[0xE] = lz*cos - lx*sin;
	dst[0xF] = lw;
};

const mat4RotateZ = (mat, sin, cos, dst) => {
	const [
		ix, iy, iz, iw,
		jx, jy, jz, jw,
		kx, ky, kz, kw,
		lx, ly, lz, lw,
	] = mat;

	dst[0x0] = ix*cos - iy*sin;
	dst[0x1] = iy*cos + ix*sin;
	dst[0x2] = iz;
	dst[0x3] = iw;

	dst[0x4] = jx*cos - jy*sin;
	dst[0x5] = jy*cos + jx*sin;
	dst[0x6] = jz;
	dst[0x7] = jw;

	dst[0x8] = kx*cos - ky*sin;
	dst[0x9] = ky*cos + kx*sin;
	dst[0xA] = kz;
	dst[0xB] = kw;

	dst[0xC] = lx*cos - ly*sin;
	dst[0xD] = ly*cos + lx*sin;
	dst[0xE] = lz;
	dst[0xF] = lw;
};

const mat4AlignIHatOnZPlane = (mat, inv) => {
	const [ x, y ] = mat;
	const rad = Math.sqrt(x*x + y*y);
	if (rad === 0) return;
	const cos = x/rad;
	const sin = -y/rad;
	mat4RotateZ(mat, sin, cos, mat);
	mat4RotateZ(inv, sin, cos, inv);
};

const mat4AlignIHatOnYPlane = (mat, inv) => {
	const [ x, _y, z ] = mat;
	const rad = Math.sqrt(x*x + z*z);
	if (rad === 0) return;
	const cos = x/rad;
	const sin = z/rad;
	mat4RotateY(mat, sin, cos, mat);
	mat4RotateY(inv, sin, cos, inv);
};

const mat4AlignJHatOnXPlane = (mat, inv) => {
	const y = mat[5];
	const z = mat[6];
	const rad = Math.sqrt(y*y + z*z);
	if (rad === 0) return;
	const cos = y/rad;
	const sin = -z/rad;
	mat4RotateX(mat, sin, cos, mat);
	mat4RotateX(inv, sin, cos, inv);
};

const invertTransform = (mat, dst) => {
	copyMat4(mat, tmp);
	clearMat4(dst);
	dst[0xC] = -tmp[0xC];
	dst[0xD] = -tmp[0xD];
	dst[0xE] = -tmp[0xE];
	tmp[0xC] = tmp[0xD] = tmp[0xE] = 0;
	mat4AlignIHatOnZPlane(tmp, dst);
	mat4AlignIHatOnYPlane(tmp, dst);
	mat4AlignJHatOnXPlane(tmp, dst);
};

export class Mat4 extends Array {
	constructor() {
		super(16);
		this.clear();
	}
	clear() {
		clearMat4(this);
		return this;
	}
	set(values) {
		copyMat4(values, this);
		return this;
	}
	translate([ x, y, z ], dst = this) {
		if (dst !== this) {
			copyMat4(this, dst);
		}
		dst[0xC] += x;
		dst[0xD] += y;
		dst[0xE] += z;
		return dst;
	}
	scaleTransform(value, dst = this) {
		if (dst !== this) {
			copyMat4(this, dst);
		}
		for (let i=0; i<16; ++i) {
			if ((i & 3) !== 3) {
				dst[i] *= value;
			}
		}
		return dst;
	}
	rotateX(angle, dst = this) {
		mat4RotateX(this, Math.sin(angle), Math.cos(angle), dst);
		return dst;
	}
	rotateY(angle, dst = this) {
		mat4RotateY(this, Math.sin(angle), Math.cos(angle), dst);
		return dst;
	}
	rotateZ(angle, dst = this) {
		mat4RotateZ(this, Math.sin(angle), Math.cos(angle), dst);
		return dst;
	}
	invertTransform(dst = this) {
		invertTransform(this, dst);
		return dst;
	}
	apply(mat, dst = this) {
		const [
			aix, aiy, aiz, aiw,
			ajx, ajy, ajz, ajw,
			akx, aky, akz, akw,
			alx, aly, alz, alw,
		] = this;
		
		const [
			bix, biy, biz, biw,
			bjx, bjy, bjz, bjw,
			bkx, bky, bkz, bkw,
			blx, bly, blz, blw,
		] = mat;
	
		dst[0x0] = aix*bix + aiy*bjx + aiz*bkx + aiw*blx;
		dst[0x1] = aix*biy + aiy*bjy + aiz*bky + aiw*bly;
		dst[0x2] = aix*biz + aiy*bjz + aiz*bkz + aiw*blz;
		dst[0x3] = aix*biw + aiy*bjw + aiz*bkw + aiw*blw;
	
		dst[0x4] = ajx*bix + ajy*bjx + ajz*bkx + ajw*blx;
		dst[0x5] = ajx*biy + ajy*bjy + ajz*bky + ajw*bly;
		dst[0x6] = ajx*biz + ajy*bjz + ajz*bkz + ajw*blz;
		dst[0x7] = ajx*biw + ajy*bjw + ajz*bkw + ajw*blw;
	
		dst[0x8] = akx*bix + aky*bjx + akz*bkx + akw*blx;
		dst[0x9] = akx*biy + aky*bjy + akz*bky + akw*bly;
		dst[0xA] = akx*biz + aky*bjz + akz*bkz + akw*blz;
		dst[0xB] = akx*biw + aky*bjw + akz*bkw + akw*blw;
	
		dst[0xC] = alx*bix + aly*bjx + alz*bkx + alw*blx;
		dst[0xD] = alx*biy + aly*bjy + alz*bky + alw*bly;
		dst[0xE] = alx*biz + aly*bjz + alz*bkz + alw*blz;
		dst[0xF] = alx*biw + aly*bjw + alz*bkw + alw*blw;
		return dst;
	}
}

export class Vec4 extends Array {
	constructor([ x = 0, y = 0, z = 0, w = 1 ] = []) {
		super(4);
		this[0] = x;
		this[1] = y;
		this[2] = z;
		this[3] = w;
	}
	rotateX(angle, dst = this) {
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);
		const [ x, y, z, w ] = this;
		dst[0] = x;
		dst[1] = y*cos - z*sin;
		dst[2] = z*cos + y*sin;
		dst[3] = w;
		return dst;
	}
	rotateY(angle, dst = this) {
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);
		const [ x, y, z, w ] = this;
		dst[0] = x*cos + z*sin;
		dst[1] = y;
		dst[2] = z*cos - x*sin;
		dst[3] = w;
		return dst;
	}
	rotateZ(angle, dst = this) {
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);
		const [ x, y, z, w ] = this;
		dst[0] = x*cos - y*sin;
		dst[1] = y*cos + x*sin;
		dst[2] = z;
		dst[3] = w;
		return dst;
	}
}
