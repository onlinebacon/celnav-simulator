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

export const uniformColor = new FragShader(`
	#version 300 es
	precision highp float;

	uniform vec3 color;

	out vec4 FragColor;
	
	void main() {
		FragColor = vec4(color, 1.0);
	}
`);
