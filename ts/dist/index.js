"use strict";
const imageUploader = document.getElementById("imageUpload");
const convertBtn = document.getElementById("convertGrayscale");
const previewImg = document.getElementById("uploadedImage");
const canvas = document.getElementById("grayscaleImage");
const ctx = canvas?.getContext("2d");
if (!imageUploader || !convertBtn || !previewImg || !canvas) {
    console.error({ imageUploader, convertBtn, previewImg, canvas });
    throw new Error(`Failed to find at least 1 of the above nodes`);
}
if (!ctx) {
    throw new Error(`Canvas context is not available.`);
}
setCanvasSize({ canvas });
function setCanvasSize({ canvas, height: h, width: w }) {
    const DEFAULT_CANVAS_WIDTH = 350;
    const DEFAULT_CANVAS_HEIGHT = 200;
    canvas.width = w ?? DEFAULT_CANVAS_WIDTH;
    canvas.height = h ?? DEFAULT_CANVAS_HEIGHT;
}
function resetCanvas(ctx) {
    ctx.reset();
    setCanvasSize({ canvas: ctx.canvas });
}
function convertToGrayscale(ctx) {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
        const luminance = pixels[i] * 0.2126 + pixels[i + 1] * 0.7152 + pixels[i + 2] * 0.0722;
        pixels[i] = pixels[i + 1] = pixels[i + 2] = luminance;
    }
    ctx.putImageData(imageData, 0, 0);
}
imageUploader.addEventListener("change", (e) => {
    const file = e.target.files?.item(0);
    if (!file || !file.type.startsWith("image/")) {
        alert("The file format is invalid");
        return;
    }
    const url = URL.createObjectURL(file);
    previewImg.src = url;
    previewImg.onload = () => URL.revokeObjectURL(url);
    resetCanvas(ctx);
});
convertBtn.addEventListener("click", () => {
    if (previewImg.src) {
        setCanvasSize({
            canvas,
            width: previewImg.naturalWidth,
            height: previewImg.naturalHeight,
        });
        ctx.drawImage(previewImg, 0, 0);
        convertToGrayscale(ctx);
    }
    else {
        alert("You have to upload image before converting to grayscale.");
    }
});
