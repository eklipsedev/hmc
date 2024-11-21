export const cleanHTMLString = (htmlString) => {
  const cleanedHtml = htmlString
    .replace(/<br\s*\/?>/gi, '') // Remove <br> tags
    .replace(/<p>\s*<\/p>/gi, ''); // Remove empty <p> tags

  return cleanedHtml;
};
