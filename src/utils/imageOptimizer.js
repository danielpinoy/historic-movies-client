const CLOUDINARY_CLOUD_NAME = "diuwbgio8";

/**
 * Optimizes image URLs using Cloudinary
 * @param {string} originalUrl - The original image URL
 * @param {object} options - Optimization options
 * @returns {string} - Optimized Cloudinary URL
 */
export const optimizeImage = (originalUrl, options = {}) => {
  // Return placeholder if no URL
  if (!originalUrl) {
    return "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Image";
  }

  // Default optimization settings
  const {
    width = 300,
    height = 450,
    crop = "fill", // How to fit the image
    format = "auto",
    quality = "auto",
    flags = "",
  } = options;

  // Build transformation string
  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `c_${crop}`,
    `f_${format}`,
    `q_${quality}`,
    flags,
  ]
    .filter(Boolean)
    .join(",");

  // Encode the original URL
  const encodedUrl = encodeURIComponent(originalUrl);

  // Return Cloudinary fetch URL
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/${transformations}/${encodedUrl}`;
};

/**
 * Different image sizes for different use cases
 */
export const ImageSizes = {
  // For movie cards in grid
  card: { width: 300, height: 450 },

  // For hero section large image
  hero: { width: 600, height: 800 },

  // For small thumbnails
  thumbnail: { width: 150, height: 225 },

  // For movie detail page
  detail: { width: 500, height: 750 },
};

/**
 * Prebuilt optimization functions for common use cases
 */
export const optimizeMovieCard = (originalUrl) => {
  return optimizeImage(originalUrl, ImageSizes.card);
};

export const optimizeHeroImage = (originalUrl) => {
  return optimizeImage(originalUrl, ImageSizes.hero);
};

export const optimizeThumbnail = (originalUrl) => {
  return optimizeImage(originalUrl, ImageSizes.thumbnail);
};

export const optimizeDetailImage = (originalUrl) => {
  return optimizeImage(originalUrl, ImageSizes.detail);
};

/**
 * Advanced: Progressive loading with multiple quality levels
 */
export const getProgressiveUrls = (originalUrl) => {
  return {
    // Low quality placeholder (loads instantly)
    placeholder: optimizeImage(originalUrl, {
      width: 50,
      height: 75,
      quality: 30,
      flags: "blur:300",
    }),

    // Medium quality (loads fast)
    medium: optimizeImage(originalUrl, {
      width: 300,
      height: 450,
      quality: 60,
    }),

    // High quality (final image)
    high: optimizeImage(originalUrl, {
      width: 300,
      height: 450,
      quality: "auto",
    }),
  };
};
