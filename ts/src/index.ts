const imageUploader = document.getElementById("imageUpload") as HTMLInputElement;
const convertBtn = document.getElementById("convertGrayscale") as HTMLButtonElement;
const previewImg = document.getElementById("uploadedImage") as HTMLImageElement;
const canvas = document.getElementById("grayscaleImage") as HTMLCanvasElement;

imageUploader.addEventListener("change", () => {
	const file = imageUploader.files?.[0];
	const url = file && URL.createObjectURL(file);
	previewImg.src = url ?? "";
});
