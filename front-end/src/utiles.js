

export const formatFileSize = (fileSize) => {
  fileSize = fileSize / 1024;
  if (fileSize < 1024) {
    return Math.ceil(fileSize) + 'kb';
  }
  fileSize = (fileSize / 1024);
  if (fileSize < 1024) {
    return fileSize.toFixed(1) + 'mb';
  }
  fileSize = fileSize / 1024;
  return fileSize.toFixed(1) + 'gb';
}

export function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
}