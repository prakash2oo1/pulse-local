const API_BASE_URL = 'http://localhost:3001/api';

export interface ApiSubmission {
  text: string;
  latitude: number;
  longitude: number;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  async getSubmissions(): Promise<ApiResponse<ApiSubmission[]>> {
    // Mock response
    return {
      success: true,
      data: [
        { text: "Sample submission 1", latitude: 37.7749, longitude: -122.4194 },
        { text: "Sample submission 2", latitude: 34.0522, longitude: -118.2437 }
      ],
    };
  }

  async submitData(submission: ApiSubmission): Promise<ApiResponse<null>> {
    // Mock response
    return { success: true };
  }
}

export const apiClient = new ApiClient();