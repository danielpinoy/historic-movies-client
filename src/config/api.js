const API_CONFIG = {
  // LOCAL_API: "http://localhost:8080/",
  // VPS_API: http://94.130.107.9
  PRIMARY_API:
    "https://xo4xjqevs42mbp46utxi3dua3y0lwywt.lambda-url.eu-north-1.on.aws",
  FALLBACK_API:
    "https://xo4xjqevs42mbp46utxi3dua3y0lwywt.lambda-url.eu-north-1.on.aws",
  TIMEOUT: 5000,
};

let workingAPI = null;
let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 5 * 60 * 1000;

// Test if an API endpoint is working
const testAPIHealth = async (apiUrl) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const response = await fetch(`${apiUrl}/`, {
      method: "HEAD",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log(`API health check failed for ${apiUrl}:`, error.message);
    return false;
  }
};

// Get the working API URL with automatic fallback
export const getWorkingAPI = async () => {
  const now = Date.now();

  if (workingAPI && now - lastHealthCheck < HEALTH_CHECK_INTERVAL) {
    return workingAPI;
  }

  console.log(" Checking API health...");

  // Test primary API first
  const primaryWorking = await testAPIHealth(API_CONFIG.PRIMARY_API);

  if (primaryWorking) {
    console.log(" Using VPS API (Primary)");
    workingAPI = API_CONFIG.PRIMARY_API;
    lastHealthCheck = now;
    return workingAPI;
  }

  // Test fallback API
  console.log(" Primary API down, testing fallback...");
  const fallbackWorking = await testAPIHealth(API_CONFIG.FALLBACK_API);

  if (fallbackWorking) {
    console.log("Using Lambda API (Fallback)");
    workingAPI = API_CONFIG.FALLBACK_API;
    lastHealthCheck = now;
    return workingAPI;
  }

  // If both fail, return primary and let the request fail naturally
  console.log(" Both APIs appear down, defaulting to primary");
  workingAPI = API_CONFIG.PRIMARY_API;
  lastHealthCheck = now;
  return workingAPI;
};

// Make API calls with automatic fallback
export const makeAPICall = async (endpoint, options = {}) => {
  let apiUrl;

  try {
    // Get working API
    apiUrl = await getWorkingAPI();

    const response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      timeout: API_CONFIG.TIMEOUT,
    });

    // If request succeeds, return it
    if (response.ok || response.status < 500) {
      return response;
    }

    throw new Error(`API responded with ${response.status}`);
  } catch (error) {
    console.log(`Request failed to ${apiUrl}, trying fallback...`);

    // If primary failed, try fallback directly
    const fallbackUrl =
      apiUrl === API_CONFIG.PRIMARY_API
        ? API_CONFIG.FALLBACK_API
        : API_CONFIG.PRIMARY_API;

    try {
      const fallbackResponse = await fetch(`${fallbackUrl}${endpoint}`, {
        ...options,
        timeout: API_CONFIG.TIMEOUT,
      });

      // Update working API cache if fallback succeeds
      if (fallbackResponse.ok) {
        workingAPI = fallbackUrl;
        lastHealthCheck = Date.now();
        console.log(` Fallback successful with ${fallbackUrl}`);
      }

      return fallbackResponse;
    } catch (fallbackError) {
      console.error(
        " Both API endpoints failed:",
        error.message,
        fallbackError.message
      );
      throw error; // Throw original error
    }
  }
};

// Reset API health check (useful for manual retry)
export const resetAPIHealth = () => {
  workingAPI = null;
  lastHealthCheck = 0;
  console.log(" API health check reset");
};

export default API_CONFIG;
