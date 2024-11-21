const API_URL =
  process.env.NEXT_PUBLIC_PROD_BACKEND_API_URL || "https://backend-695i.onrender.com/api";

// Define the Rule type for audience rules
type Rule = {
  field: string; // The field to filter (e.g., "last_visit", "visits")
  operator: string; // The operator (e.g., ">", "<", "=", "!=")
  value: any; // The value to compare against
  condition: "AND" | "OR"; // Logical condition to combine rules
};

// Define the Audience type
type Audience = {
  rules: Rule[]; // An array of rules
};

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `API Error: ${response.status} ${response.statusText} - ${
          data.message || "No additional details"
        }`
      );
    }
    return data;
  } catch (error) {
    console.error(`API Request Error [${endpoint}]:`, error);
    throw error;
  }
};

// Fetch all campaigns
export const fetchCampaigns = async (): Promise<any> => {
  return apiRequest("/campaigns");
};

// Create a campaign
export const createCampaign = async (audience: Audience): Promise<any> => {
  return apiRequest("/campaigns", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(audience),
  });
};

// Check audience size
export const checkAudienceSize = async (audience: Audience): Promise<number> => {
  const data = await apiRequest("/audiences/size", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(audience),
  });
  return data.size;
};