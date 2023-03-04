export const canvas = document.createElement('canvas');
export const gl = canvas.getContext('webgl2');

let frame = () => {};

gl.enable(gl.DEPTH_TEST);
gl.enable(gl.BLEND);
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0, 0, 0, 1);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

class Shader {
	constructor(src, type) {
		this.id = Symbol();
		const ptr = gl.createShader(type);
		gl.shaderSource(ptr, src.trim());
		gl.compileShader(ptr);
		const info = gl.getShaderInfoLog(ptr);
		if (info) throw new Error(info);
		this.ptr = ptr;
	}
}

export class VertexShader extends Shader {
	constructor(src) {
		super(src, gl.VERTEX_SHADER);
	}
}

export class FragShader extends Shader {
	constructor(src) {
		super(src, gl.FRAGMENT_SHADER);
	}
}

export class Texture {
	constructor({ img }) {
		const ptr = gl.createTexture();
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, ptr);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_BASE_LEVEL, 0);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LOD, 2);
	}
	activate() {
		return 0;
	}
}

export class Program {
	constructor({ vertexShader, fragShader }) {
		this.id = Symbol();
		this.vertexShader = vertexShader;
		this.fragShader = fragShader;
		const ptr = gl.createProgram();
		gl.attachShader(ptr, vertexShader.ptr);
		gl.attachShader(ptr, fragShader.ptr);
		gl.linkProgram(ptr);
		this.ptr = ptr;
		this.uniformMap = {};
	}
	setTextureUniform(name, texture) {
		const index = texture.activate();
		gl.uniform1i(this.getLocation(name), index);
	}
	setFloatUniform(name, value) {
		gl.uniform1f(this.getLocation(name), value);
		return this;
	}
	setVec2Uniform(name, value) {
		gl.uniform2fv(this.getLocation(name), value);
		return this;
	}
	setVec3Uniform(name, value) {
		gl.uniform3fv(this.getLocation(name), value);
		return this;
	}
	setVec4Uniform(name, value) {
		gl.uniform4fv(this.getLocation(name), value);
		return this;
	}
	setMat3Uniform(name, value) {
		gl.uniformMatrix3fv(this.getLocation(name), true, value);
		return this;
	}
	setMat4Uniform(name, value) {
		gl.uniformMatrix4fv(this.getLocation(name), true, value);
		return this;
	}
	setVec3Uniform(name, value) {
		gl.uniform3fv(this.getLocation(name), value);
		return this;
	}
	getLocation(name) {
		const { uniformMap, ptr } = this;
		return uniformMap[name] ?? (
			uniformMap[name] = gl.getUniformLocation(ptr, name)
		);
	}
}

export class Geometry {
	constructor({ attr, element, layout }) {
		this.id = Symbol();
		const attrArr = new Float32Array(attr);
		const elementArr = new Uint16Array(element);
		const ptr = gl.createVertexArray();	
		const attrBuff = gl.createBuffer();
		const elementBuff = gl.createBuffer();
		const BPE = Float32Array.BYTES_PER_ELEMENT;
		const size = layout.reduce((a, b) => a + b, 0);
		const stride = size*BPE;
		gl.bindVertexArray(ptr);
		gl.bindBuffer(gl.ARRAY_BUFFER, attrBuff);
		gl.bufferData(gl.ARRAY_BUFFER, attrArr, gl.STATIC_DRAW);
		let sum = 0;
		layout.forEach((size, i) => {
			gl.vertexAttribPointer(i, size, gl.FLOAT, false, stride, sum);
			sum += size*BPE;
		});
		layout.forEach((_, i) => gl.enableVertexAttribArray(i));
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuff);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elementArr, gl.STATIC_DRAW);
		this.ptr = ptr;
		this.element = elementArr;
	}
}

class Context {
	constructor() {
		this.program = null;
	}
	useProgram(program) {
		if (program === this.program) {
			return;
		}
		gl.useProgram(program.ptr);
	}
	drawGeometry({ ptr, element }) {
		gl.bindVertexArray(ptr);
		gl.drawElements(gl.TRIANGLES, element.length, gl.UNSIGNED_SHORT, 0);
	}
	leftMode() {
		const width = canvas.width >> 1;
		gl.viewport(0, 0, width, canvas.height);
	};
	rightMode() {
		const x = canvas.width >> 1;
		const width = canvas.width - x;
		gl.viewport(x, 0, width, canvas.height);
	};
	fullMode() {
		gl.viewport(0, 0, canvas.width, canvas.height);
	};
}

const ctx = new Context();

const clear = () => {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

const render = () => {
	clear();
	frame(ctx);
};

let started = false;

const frameLoop = () => {
	if (started) render();
	requestAnimationFrame(frameLoop);
};

frameLoop();

export const resize = (width, height) => {
	canvas.width = width;
	canvas.height = height;
	gl.viewport(0, 0, width, height);
};

/**
 * @typedef {function(Context)} FrameFunc
 * @param {FrameFunc} fn
 */
export const setFrame = (fn) => {
	frame = fn;
};

/**
 * @typedef {function(Context)} OnceFunc
 * @param {FrameFunc} fn
 */
export const once = (fn) => {
	fn(ctx);
};

export const setBackgroundColor = ([ r, g, b ]) => {
	gl.clearColor(r, g, b, 1);
};

export const start = () => {
	started = true;
};
