const animate = ({ it, duration, fn, callback }) => {
    let reqFrame = null;
    let finished = false;
    const startedAt = Date.now();
    const frameLoop = () => {
        const unit = Math.min(1, (Date.now() - startedAt)/duration);
        it(fn(unit));
        if (unit < 1) {
            reqFrame = requestAnimationFrame(frameLoop);
        } else {
            finished = true;
            callback?.();
        }
    };
    frameLoop();
    const isFinished = () => finished;
    const stop = () => {
        if (finished) return false;
        cancelAnimationFrame(reqFrame);
        finished = true;
        return true;
    };
    const finish = () => {
        if (finished) return false;
        cancelAnimationFrame(reqFrame);
        it(fn(1));
        finished = true;
        callback?.();
        return true;
    };
    return { stop, finish, isFinished };
};

export const smooth = ({ duration, it, callback }) => {
    const fn = (unit) => (1 - Math.cos(unit*Math.PI))/2;
    return animate({ duration, it, fn, callback });
};
