import { FragShader } from '../core/webgl2.js';

export const coloredGeometry = new FragShader(`
	#version 300 es
	precision highp float;

	in vec4 color;

	out vec4 FragColor;
	
	void main() {
		FragColor = color;
	}
`);

export const justColor = new FragShader(`
	#version 300 es
	precision highp float;

	uniform vec3 color;

	out vec4 FragColor;
	
	void main() {
		FragColor = vec4(color, 1.0);
	}
`);

export const textured = new FragShader(`
	#version 300 es
	precision highp float;

	in vec2 uv;
	uniform sampler2D u_texture;
	out vec4 FragColor;

	void main() {
		vec4 color = texture(u_texture, uv);
		color[3] = 0.1;
		FragColor = color;
	}
`);
