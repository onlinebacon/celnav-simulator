import * as VertexShaders from './vertex-shaders.js';
import * as FragShaders from './frag-shaders.js';
import { Program } from '../core/webgl2.js';

export const fixedColorGeometry = new Program({
	vertexShader: VertexShaders.coloredGeometry,
	fragShader:   FragShaders.coloredGeometry,
});

export const celestialSphere = new Program({
	vertexShader: VertexShaders.celestialSphere,
	fragShader:   FragShaders.coloredGeometry,
});

export const variableColorGeometry = new Program({
	vertexShader: VertexShaders.justGeometry,
	fragShader:   FragShaders.justColor,
});

export const orthographic = new Program({
	vertexShader: VertexShaders.orthographic,
	fragShader:   FragShaders.justColor,
});
