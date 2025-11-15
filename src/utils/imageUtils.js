// src/utils/imageUtils.js

/**
 * Зургийг Base64 болгох
 * Firebase Storage шаардлагагүй
 */
export const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    // Зургийн хэмжээ шалгах (5MB хүртэл)
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error("Зургийн хэмжээ 5MB-аас бага байх ёстой"));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Олон зураг Base64 болгох
 */
export const convertMultipleImagesToBase64 = async (files) => {
  const promises = Array.from(files).map((file) => convertImageToBase64(file));

  return Promise.all(promises);
};

/**
 * Зургийг багасгаж Base64 болгох (Optimized)
 */
export const compressAndConvertImage = (
  file,
  maxWidth = 800,
  quality = 0.8
) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Хэмжээ багасгах
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Base64 болгох (compressed)
        const base64 = canvas.toDataURL("image/jpeg", quality);
        resolve(base64);
      };

      img.onerror = reject;
      img.src = e.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
