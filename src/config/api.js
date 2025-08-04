const API_CONFIG = {
  // LOCAL_API: "http://localhost:8080/",
  // VPS http://94.130.107.9
  PRIMARY_API: "https://arcade-enhancement-hockey-goal.trycloudflare.com",
  FALLBACK_API:
    "https://xo4xjqevs42mbp46utxi3dua3y0lwywt.lambda-url.eu-north-1.on.aws",
  TIMEOUT: 5000,
};

// Simple API call with automatic fallback
export const makeAPICall = async (endpoint, options = {}) => {
  // Try primary API first
  try {
    const response = await fetch(`${API_CONFIG.PRIMARY_API}${endpoint}`, {
      ...options,
      timeout: API_CONFIG.TIMEOUT,
    });

    if (response.ok || response.status < 500) {
      return response;
    }
    throw new Error(`Primary API failed: ${response.status}`);
  } catch (error) {
    console.log(`Primary API failed, trying fallback...`);

    // Try fallback API
    try {
      const response = await fetch(`${API_CONFIG.FALLBACK_API}${endpoint}`, {
        ...options,
        timeout: API_CONFIG.TIMEOUT,
      });

      if (response.ok) {
        console.log("Fallback API successful");
      }
      return response;
    } catch (fallbackError) {
      console.error("Both APIs failed:", error.message, fallbackError.message);
      throw error;
    }
  }
};

export default API_CONFIG;
