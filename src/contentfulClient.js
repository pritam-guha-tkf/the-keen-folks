import { createClient } from 'contentful';

const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const deliveryAccessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
const previewAccessToken = import.meta.env.VITE_CONTENTFUL_PREVIEW_ACCESS_TOKEN;

export const isPreviewMode = () => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    return params.get('preview') === 'true' && !!previewAccessToken;
  }
  return false;
};

const inPreview = isPreviewMode();

const activeToken = inPreview ? previewAccessToken : deliveryAccessToken;
const host = inPreview ? 'preview.contentful.com' : 'cdn.contentful.com';

let client = null;

if (spaceId && activeToken) {
  client = createClient({
    space: spaceId,
    accessToken: activeToken,
    host: host,
  });
  if (inPreview) {
    console.log("Contentful client is in PREVIEW MODE.");
  } else {
    console.log("Contentful client is in DELIVERY MODE.");
  }
} else {
  console.error(
    "Contentful Space ID or an appropriate Access Token (Delivery/Preview) is missing. " +
    "Please check your .env file and ensure VITE_CONTENTFUL_PREVIEW_ACCESS_TOKEN is set for preview mode."
  );
}

export default client;