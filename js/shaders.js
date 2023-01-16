import { VertexShader, FragShader } from './webgl2.js';

export const vertex = new VertexShader(`
	#version 300 es
	precision highp float;

	layout (location = 0) in vec3 inVertex;
	layout (location = 1) in vec3 inColor;

	uniform mat4 transform;
	uniform mat4 locTime;
	uniform mat4 projection;

	out vec4 pos;

	void main() {
		pos = gl_Position = vec4(inVertex, 1.0)*transform*locTime*projection;
	}
`);

export const frag = new FragShader(`
	#version 300 es
	precision highp float;

	uniform vec3 color;
	uniform float side;

	in vec4 pos;
	out vec4 FragColor;

	void main() {
		if (pos.x*side > 0.0) discard;
		FragColor = vec4(color, 1.0);
	}
`);
