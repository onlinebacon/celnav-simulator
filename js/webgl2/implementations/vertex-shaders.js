import Constants from '../../constants.js';
import { VertexShader } from '../core/webgl2.js';

const c1 = Math.PI/180;
const c2 = 180/Math.PI;
const c3 = 5.11;
const c4 = 10.3*c1;
const c5 = 0.017*c1;

const sideProjection = (addX) => `{
	gl_Position.x = (gl_Position.x/gl_Position.w*2.0 + ${addX}.0)*gl_Position.w;
}`;

const celSphereSrc = `
	#version 300 es
	precision highp float;

	layout (location = 0) in vec3 inVertex;
	layout (location = 1) in vec3 inPivot;
	layout (location = 2) in vec3 inColor;
	layout (location = 3) in float inOpacity;

	uniform mat4 transform;
	uniform mat4 projection;

	uniform float celSphRad;
	uniform float scaleStars;

	out vec4 color;
	const vec3 bgColor = vec3(${ Constants.BG_COLOR.map(val => val.toFixed(3)) });

	float correctY(float y) {
		float h = asin(y)*${c2};
		if (h < -2.0 || h > 89.9) return y;
		float dif = (sin(h*${c1} + ${c5}/tan(h*${c1} + ${c4}/(h + ${c3}))) - y)*0.99;
		return y + dif;
	}

	vec3 addRefraction(vec3 vertex) {
		vertex.y = correctY(vertex.y);
		float base = sqrt(1.0 - vertex.y*vertex.y);
		vertex.xz = normalize(vertex.xz)*base;
		return vertex;
	}

	void main() {
		color = vec4(inColor, inOpacity);
		vec3 vertex = (inVertex - inPivot)*scaleStars + inPivot;
		vertex = vertex*mat3(transform);
		vertex = addRefraction(vertex);
		vertex *= celSphRad;
		gl_Position = vec4(vertex, 1.0)*projection;
		/* MAIN_END */
	}
`;

const justGeometrySrc = `
	#version 300 es
	precision highp float;

	layout (location = 0) in vec3 inVertex;

	uniform mat4 transform;
	uniform mat4 projection;

	void main() {
		gl_Position = vec4(inVertex, 1.0)*transform*projection;
		/* MAIN_END */
	}
`;

const orthographicSrc = `
	#version 300 es
	precision highp float;

	layout (location = 0) in vec3 inVertex;
	layout (location = 1) in vec3 inColor;

	uniform vec2 screenPos;
	uniform float scale;
	uniform float screenRatio;

	out vec4 color;

	void main() {
		color = vec4(inColor, 1.0);
		vec3 vertex = inVertex;
		vertex.x /= screenRatio;
		vertex.xy *= scale;
		vertex.xy += screenPos;
		gl_Position = vec4(vertex, 1.0);
		/* MAIN_END */
	}
`;

const sideVersion = (src, addX) => {
	src = src.replace(/\/\*\s*MAIN_END\s*\*\//, sideProjection(addX));
	return new VertexShader(src);
};

const sideL = (src) => sideVersion(src, 1);
const sideR = (src) => sideVersion(src, -1);

export const celestialSphere = new VertexShader(celSphereSrc);
export const celestialSphereL = sideL(celSphereSrc);
export const celestialSphereR = sideR(celSphereSrc);

export const justGeometry = new VertexShader(justGeometrySrc);
export const justGeometryL = sideL(justGeometrySrc);
export const justGeometryR = sideR(justGeometrySrc);

export const orthographic = new VertexShader(orthographicSrc);
export const orthographicL = sideL(orthographicSrc);
export const orthographicR = sideR(orthographicSrc);
