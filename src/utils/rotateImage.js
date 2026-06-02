// src/utils/rotateImage.js
export async function rotateImageBlob(imageUrl, degrees = 90) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imageUrl;

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const rad = (degrees * Math.PI) / 180;

  const swap = degrees % 180 !== 0; // 90/270 swap W/H
  canvas.width = swap ? img.height : img.width;
  canvas.height = swap ? img.width : img.height;

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rad);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Rotate failed: empty blob"));
      resolve(blob);
    }, "image/jpeg", 0.95);
  });
}
