const rInput = document.querySelector("#r") as HTMLInputElement;
const gInput = document.querySelector("#g") as HTMLInputElement;
const bInput = document.querySelector("#b") as HTMLInputElement;

rInput.value = Math.floor(Math.random() * 256).toFixed(0);
gInput.value = Math.floor(Math.random() * 256).toFixed(0);
bInput.value = Math.floor(Math.random() * 256).toFixed(0);

rInput.addEventListener("change", updateTextcolor);
gInput.addEventListener("change", updateTextcolor);
bInput.addEventListener("change", updateTextcolor);
updateTextcolor();
function updateTextcolor() {
  const { r, g, b } = getCurrentColor();
  document.documentElement.style.setProperty("--color", `rgb(${r},${g},${b})`);
}

export function getCurrentColor(): { r: number; g: number; b: number } {
  return {
    r: Number(rInput.value),
    g: Number(gInput.value),
    b: Number(bInput.value),
  };
}
