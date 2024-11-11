export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result.replace('data:', '').replace(/^.+,/, '');
      resolve(base64);
    };

    reader.onerror = () => {
      reject(new Error('Lỗi khi đọc ảnh'));
    };

    reader.readAsDataURL(file);
  });
};