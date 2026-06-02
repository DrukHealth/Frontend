// src/utils/cropImage.js
import { convertToPixelCrop } from "react-image-crop";

export async function getCroppedImg(imageSrc, crop, imgRef) {
  if (!crop?.width || !crop?.height || !imgRef) {
    throw new Error("Invalid crop or missing image reference.");
  }

  const pixelCrop = convertToPixelCrop(crop, imgRef.width, imgRef.height);

  const scaleX = imgRef.naturalWidth / imgRef.width;
  const scaleY = imgRef.naturalHeight / imgRef.height;

  const realCrop = {
    x: Math.round(pixelCrop.x * scaleX),
    y: Math.round(pixelCrop.y * scaleY),
    width: Math.round(pixelCrop.width * scaleX),
    height: Math.round(pixelCrop.height * scaleY),
  };

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imageSrc;

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = realCrop.width;
  canvas.height = realCrop.height;

  ctx.drawImage(
    img,
    realCrop.x,
    realCrop.y,
    realCrop.width,
    realCrop.height,
    0,
    0,
    realCrop.width,
    realCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Crop failed: empty blob"));
      resolve(blob);
    }, "image/jpeg", 0.95);
  });
}
