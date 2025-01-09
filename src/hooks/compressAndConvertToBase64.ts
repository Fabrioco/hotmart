import imageCompression from "browser-image-compression";

export const compressAndConvertToBase64 = async (file: File) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  const compressedFile = await imageCompression(file, options);

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(compressedFile);
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result.toString());
      } else {
        reject("Erro ao converter a imagem para Base64");
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
