type CanvasDimensionsOptions = {
	canvas: HTMLCanvasElement;
	width?: number;
	height?: number;
};

const imageUploader = document.getElementById("imageUpload") as HTMLInputElement | null;
const convertBtn = document.getElementById("convertGrayscale") as HTMLButtonElement | null;
const previewImg = document.getElementById("uploadedImage") as HTMLImageElement | null;
const canvas = document.getElementById("grayscaleImage") as HTMLCanvasElement | null;
const ctx = canvas?.getContext("2d");

canvas && setCanvasDimensions({ canvas });

function setCanvasDimensions({ canvas, height: h, width: w }: CanvasDimensionsOptions) {
	const DEFAULT_CANVAS_WIDTH = 350;
	const DEFAULT_CANVAS_HEIGHT = 200;

	canvas.width = w ?? DEFAULT_CANVAS_WIDTH;
	canvas.height = h ?? DEFAULT_CANVAS_HEIGHT;
}

function resetCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
	ctx.reset();
	setCanvasDimensions({ canvas });
}

imageUploader?.addEventListener("change", function () {
	const file = this.files?.[0];

	const regex = new RegExp("image/*");
	if (!file || !regex.test(file.type)) return;

	const url = URL.createObjectURL(file);

	if (canvas && ctx) {
		resetCanvas(canvas, ctx);
	}

	if (previewImg) {
		previewImg.src = url;
		previewImg.onload = () => URL.revokeObjectURL(url);
	}
});

convertBtn?.addEventListener("click", () => {
	if (!ctx || !canvas || !previewImg?.src) return;

	setCanvasDimensions({ canvas, width: previewImg.naturalWidth, height: previewImg.naturalHeight });

	ctx.drawImage(previewImg, 0, 0);

	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const pixels = imageData.data;

	for (let i = 0; i < pixels.length; i += 4) {
		//https://en.wikipedia.org/wiki/Grayscale#Colourimetric_(perceptual_luminance-preserving)_conversion_to_greyscale
		const luminance = pixels[i] * 0.2126 + pixels[i + 1] * 0.7152 + pixels[i + 2] * 0.0722;

		pixels[i] = luminance;
		pixels[i + 1] = luminance;
		pixels[i + 2] = luminance;
	}

	ctx.putImageData(imageData, 0, 0);
});
