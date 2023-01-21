import { VertexShader } from '../core/webgl2.js';

export const coloredGeometry = new VertexShader(`
	#version 300 es
	precision highp float;

	layout (location = 0) in vec3 inVertex;
	layout (location = 1) in vec3 inColor;

	uniform mat4 transform;
	uniform mat4 projection;

	out vec3 color;

	void main() {
		color = inColor;
		gl_Position = vec4(inVertex, 1.0)*transform*projection;
	}
`);

export const celestialSphere = new VertexShader(`
	#version 300 es
	precision highp float;

	layout (location = 0) in vec3 inVertex;
	layout (location = 1) in vec3 inColor;

	uniform mat4 transform;
	uniform mat4 projection;

	out vec3 color;

	float correctY(float y) {
		return y;
	}

	vec3 addRefraction(vec3 vertex) {
		vertex.y = correctY(vertex.y);
		float base = sqrt(1.0 - vertex.y*vertex.y);
		vertex.xz = normalize(vertex.xz)*base;
		return vertex;
	}

	void main() {
		color = inColor;
		vec3 vertex = inVertex*mat3(transform);
		vertex = addRefraction(vertex);
		gl_Position = vec4(vertex, 1.0)*projection;
	}
`);

export const justGeometry = new VertexShader(`
	#version 300 es
	precision highp float;

	layout (location = 0) in vec3 inVertex;

	uniform mat4 transform;
	uniform mat4 projection;

	void main() {
		gl_Position = vec4(inVertex, 1.0)*transform*projection;
	}
`);

export const orthographic = new VertexShader(`
	#version 300 es
	precision highp float;

	layout (location = 0) in vec3 inVertex;
	layout (location = 1) in vec3 inColor;

	uniform vec2 screenPos;
	uniform float scale;
	uniform float screenRatio;

	out vec3 color;

	void main() {
		color = inColor;
		vec3 vertex = inVertex;
		vertex.x /= screenRatio;
		vertex.xy *= scale;
		vertex.xy += screenPos;
		gl_Position = vec4(vertex, 1.0);
	}
`);
