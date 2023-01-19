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
	layout (location = 2) in vec3 inNormal;

	uniform mat4 transform;
	uniform mat4 projection;

	out vec3 color;

	float correctAlt(float alt) {
		float zenith = ${Math.PI} - alt;
		zenith = zenith*1.0;
		return ${Math.PI} - zenith;
	}

	vec3 addRefraction(vec3 normal, vec3 vertex) {
		float alt0 = asin(vertex.y);
		float alt1 = correctAlt(alt0);
		float yScale = tan(alt1)/tan(alt0);
		vertex.y *= yScale;
		return normalize(vertex);
	}

	void main() {
		color = inColor;
		vec3 normal = inNormal*mat3(transform);
		vec3 vertex = inVertex*mat3(transform);
		vertex = addRefraction(normal, vertex);
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
