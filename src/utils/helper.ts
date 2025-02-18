import domtoimage from 'dom-to-image';
import { changeDpiDataUrl } from 'changedpi';

export const extractUserName = (url: string): string => {
  return url.split('@')[1].split('/')[0];
};

export const extractPostID = (url: string): string => {
  const parts = url.split('/');
  const postIdIndex = parts.indexOf('post') + 1;
  const postId = parts[postIdIndex];

  return postId;
};

export const elementToImage = async (
  numOfElement: number
): Promise<string[]> => {
  const elements = [];
  const dataURLs = [];

  [...new Array(numOfElement)].map((value, index) => {
    const element = document.querySelector(`.instagram-${index}`);
    elements.push(element);
    return '-';
  });

  const BASE_DPI = 100;
  const scale = 5;
  try {
    for (const element of elements) {
      const options = {
        height: element.offsetHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${element.offsetWidth}px`,
          height: `${element.offsetHeight}px`,
        },
        width: element.offsetWidth * scale,
      };

      const dataURL = await domtoimage.toPng(element, options);
      const changedDataURL = changeDpiDataUrl(dataURL, BASE_DPI * scale);

      dataURLs.push(changedDataURL);
    }
  } catch (error) {
    console.log(error);
    return [];
  }

  return dataURLs;
};

// 290
export const calculateFontSize = (text: string) => {
  const maxLength = 290;
  const defaultFontSize = 1;
  const textLength = text.length;

  if (textLength <= maxLength) {
    // Increase font size for shorter text
    const scaleFactor = 0.9 - textLength / maxLength;
    let adjustedFontSize = defaultFontSize + scaleFactor;
    adjustedFontSize >= 2 && (adjustedFontSize = 1.7); // Limit maximum font size
    textLength <= 40 && (adjustedFontSize = 2)
    console.log(adjustedFontSize)
    return `${adjustedFontSize.toFixed(1)}rem`;
  } else {
    // Calculate a smaller font size for longer text
    const scaleFactor = maxLength / textLength;
    let adjustedFontSize = Number((defaultFontSize * scaleFactor).toFixed(1));
    adjustedFontSize <= 0.8 && (
      adjustedFontSize = adjustedFontSize + 0.2);
    textLength >= 340 && (
      adjustedFontSize = 0.85
    )
    return `${adjustedFontSize}rem`;
  }
};
