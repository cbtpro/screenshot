export function brushLine(context, x, y, x1, y1) {
    context.moveTo(x, y);
    context.lineTo(x1, y1);
    context.stroke();
    return context;
}
export function setLineWidth(context, widthValue) {
    context.lineWidth = widthValue || 1;
    return context;
}
export function setLineCap(context, lineCap) {
    context.lineCap = lineCap || 'round';
    return context;
}
export function setStrokeStyle(context, strokeStyle) {
    context.strokeStyle = strokeStyle || '#000';
    return context;
}
export function getBrushPosition(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    var x = evt.clientX - rect.left * (canvas.width / rect.width);
    var y = evt.clientY - rect.top * (canvas.height / rect.height);
    return { x, y };
}