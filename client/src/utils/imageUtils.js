export const createImageObjectURL = (imageData) => {
  if (imageData && Array.isArray(imageData)) {
    const blob = new Blob([new Uint8Array(imageData)], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  }
  return null;
};
