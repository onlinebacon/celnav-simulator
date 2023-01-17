import { VertexShader, FragShader } from './webgl2.js';

export const hrzVertex = new VertexShader(`
	#version 300 es
	precision highp float;

	layout (location = 0) in vec3 inVertex;

	uniform mat4 transform;
	uniform mat4 projection;

	void main() {
		gl_Position = vec4(inVertex, 1.0)*transform*projection;
	}
`);

export const celSphereVertex = new VertexShader(`
	#version 300 es
	precision highp float;

	layout (location = 0) in vec3 inVertex;
	layout (location = 1) in vec3 inColor;

	uniform mat4 transform;
	uniform mat4 projection;

	void main() {
		gl_Position = vec4(inVertex, 1.0)*transform*projection;
	}
`);

export const frag = new FragShader(`
	#version 300 es
	precision highp float;

	uniform vec3 color;

	out vec4 FragColor;
	
	void main() {
		FragColor = vec4(color, 1.0);
	}
`);
