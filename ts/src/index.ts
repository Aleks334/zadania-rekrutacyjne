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

if (!imageUploader || !convertBtn || !previewImg || !canvas) {
	console.error({ imageUploader, convertBtn, previewImg, canvas });
	throw new Error(`Failed to find at least 1 of the above nodes`);
}

if (!ctx) {
	throw new Error(`Canvas context is not available.`);
}

setCanvasDimensions({ canvas });

function setCanvasDimensions({ canvas, height: h, width: w }: CanvasDimensionsOptions) {
	const DEFAULT_CANVAS_WIDTH = 350;
	const DEFAULT_CANVAS_HEIGHT = 200;

	canvas.width = w ?? DEFAULT_CANVAS_WIDTH;
	canvas.height = h ?? DEFAULT_CANVAS_HEIGHT;
}

function resetCanvas(ctx: CanvasRenderingContext2D) {
	ctx.reset();
	setCanvasDimensions({ canvas: ctx.canvas });
}

function convertToGrayscale(ctx: CanvasRenderingContext2D) {
	const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
	const pixels = imageData.data;

	for (let i = 0; i < pixels.length; i += 4) {
		//https://en.wikipedia.org/wiki/Grayscale#Colourimetric_(perceptual_luminance-preserving)_conversion_to_greyscale
		const luminance = pixels[i] * 0.2126 + pixels[i + 1] * 0.7152 + pixels[i + 2] * 0.0722;

		pixels[i] = luminance;
		pixels[i + 1] = luminance;
		pixels[i + 2] = luminance;
	}

	ctx.putImageData(imageData, 0, 0);
}

imageUploader.addEventListener("change", function () {
	const file = this.files?.[0];

	const regex = new RegExp(this.accept);
	if (!file || !regex.test(file.type)) {
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
		setCanvasDimensions({ canvas, width: previewImg.naturalWidth, height: previewImg.naturalHeight });

		ctx.drawImage(previewImg, 0, 0);
		convertToGrayscale(ctx);
	} else {
		alert("You have to upload image before converting to grayscale.");
	}
});
