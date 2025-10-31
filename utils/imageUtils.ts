/**
 * Converts a base64 encoded string to a data URL.
 * @param base64String The base64 encoded string.
 * @param mimeType The MIME type of the image (e.g., 'image/png').
 * @returns A data URL string.
 */
export const base64ToDataUrl = (base64String: string, mimeType: string): string => {
  return `data:${mimeType};base64,${base64String}`;
};

/**
 * Fetches an image from a URL and converts it to a base64 string.
 * @param imageUrl The URL of the image to convert.
 * @returns A promise that resolves to the base64 encoded string.
 */
export const urlToBase64 = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fetch(imageUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // result is a data URL (e.g., "data:image/png;base64,iVBORw..."). We need to strip the prefix.
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(blob);
      })
      .catch(error => {
        reject(`Failed to fetch and convert image: ${error}`);
      });
  });
};