import * as VertexShaders from './vertex-shaders.js';
import * as FragShaders from './frag-shaders.js';
import { Program } from '../core/webgl2.js';

export const celestialSphere = new Program({
	vertexShader: VertexShaders.celestialSphere,
	fragShader:   FragShaders.coloredGeometry,
});
export const celestialSphereL = new Program({
	vertexShader: VertexShaders.celestialSphereL,
	fragShader:   FragShaders.coloredGeometry,
});
export const celestialSphereR = new Program({
	vertexShader: VertexShaders.celestialSphereR,
	fragShader:   FragShaders.coloredGeometry,
});

export const variableColorGeometry = new Program({
	vertexShader: VertexShaders.justGeometry,
	fragShader:   FragShaders.justColor,
});
export const variableColorGeometryL = new Program({
	vertexShader: VertexShaders.justGeometryL,
	fragShader:   FragShaders.justColor,
});
export const variableColorGeometryR = new Program({
	vertexShader: VertexShaders.justGeometryR,
	fragShader:   FragShaders.justColor,
});

export const orthographic = new Program({
	vertexShader: VertexShaders.orthographic,
	fragShader:   FragShaders.justColor,
});
export const orthographicL = new Program({
	vertexShader: VertexShaders.orthographicL,
	fragShader:   FragShaders.justColor,
});
export const orthographicR = new Program({
	vertexShader: VertexShaders.orthographicR,
	fragShader:   FragShaders.justColor,
});

export const atmosphere = new Program({
	vertexShader: VertexShaders.atmosphere,
	fragShader:   FragShaders.coloredGeometry,
});
export const atmosphereL = new Program({
	vertexShader: VertexShaders.atmosphereL,
	fragShader:   FragShaders.coloredGeometry,
});
export const atmosphereR = new Program({
	vertexShader: VertexShaders.atmosphereR,
	fragShader:   FragShaders.coloredGeometry,
});

export const texturedGeometry = new Program({
	vertexShader: VertexShaders.texturedGeometry,
	fragShader:   FragShaders.textured,
});
export const texturedGeometryL = new Program({
	vertexShader: VertexShaders.texturedGeometryL,
	fragShader:   FragShaders.textured,
});
export const texturedGeometryR = new Program({
	vertexShader: VertexShaders.texturedGeometryR,
	fragShader:   FragShaders.textured,
});
