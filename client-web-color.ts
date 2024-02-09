const colorInput = document.querySelector("#color") as HTMLInputElement;
colorInput.value = generateDefaultColor();
colorInput.addEventListener("change", updateColor);

let currentColor: { r: number; g: number; b: number } = { r: 0, g: 0, b: 0 };
export function getCurrentColor(): { r: number; g: number; b: number } {
	return currentColor;
}

updateColor();
function updateColor() {
	document.documentElement.style.setProperty("--color", colorInput.value);

	const h = colorInput.value;
	const r = Number("0x" + h[1] + h[2]);
	const g = Number("0x" + h[3] + h[4]);
	const b = Number("0x" + h[5] + h[6]);
	currentColor = { r, g, b };
}

function generateDefaultColor() {
	let r = Math.floor(Math.random() * 256).toString(16);
	let g = Math.floor(Math.random() * 256).toString(16);
	let b = Math.floor(Math.random() * 256).toString(16);
	if (r.length === 1) r = "0" + r;
	if (g.length === 1) g = "0" + g;
	if (b.length === 1) b = "0" + b;
	return "#" + r + g + b;
}
console.log(generateDefaultColor());
