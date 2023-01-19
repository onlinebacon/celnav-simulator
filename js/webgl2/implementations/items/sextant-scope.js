import { sextantScope as geometry } from '../static-geometries.js';
import { orthographic as program } from '../programs.js';

export const draw = (ctx, camera) => {
    ctx.useProgram(program);
    ctx.drawGeometry(geometry);
	program.setFloatUniform('scale', 1);
	program.setFloatUniform('screenRatio', camera.ratio);
	program.setVec2Uniform('screenPos', [ 0, 0 ]);
};
