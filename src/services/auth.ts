const API_BASE_URL = "http://localhost:8080/api";

export interface AuthRequest {
  username: string;
  password: string;
}

export type RegisterRequest =
  | {
      username: string;
      email: string;
      password: string;
      role: "CITIZEN";
      firstName: string;
      lastName: string;
      address: string;
      phoneNumber: string;
      wardId: string; // required only for CITIZEN
    }
  | {
      username: string;
      email: string;
      password: string;
      role: "RECYCLER" | "AUTHORITY";
      firstName: string;
      lastName: string;
      address: string;
      phoneNumber: string;
      wardId?: never; // explicitly disallowed
    };

// Backend spec says "object", so we make it flexible
export interface AuthResponse {
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role: "CITIZEN" | "RECYCLER" | "AUTHORITY";
    firstName: string;
    lastName: string;
    address?: string;
    phoneNumber?: string;
    active?: boolean;
  };
  [key: string]: any; // fallback for extra fields
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private user: AuthResponse["user"] | null = null;

  private constructor() {
    // Only use localStorage in browser environment
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("clevo_token");
      const savedUser = localStorage.getItem("clevo_user");
      if (savedUser) {
        try {
          this.user = JSON.parse(savedUser);
        } catch {
          localStorage.removeItem("clevo_user");
        }
      }
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: AuthRequest): Promise<AuthResponse> {
    try {
      console.log("Making login request to:", `${API_BASE_URL}/auth/login`);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(credentials),
      });

      console.log("Login response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Login error response:", errorText);

        try {
          const errorData = JSON.parse(errorText);
          throw new Error(
            errorData.message || `Login failed: ${response.status}`,
          );
        } catch (parseError) {
          throw new Error(`Login failed: ${response.status} - ${errorText}`);
        }
      }

      const responseText = await response.text();
      console.log("Login response text:", responseText);

      let data: AuthResponse;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse login response:", parseError);
        throw new Error("Invalid response format from server");
      }

      if (data.token && typeof window !== "undefined") {
        this.token = data.token;
        localStorage.setItem("clevo_token", data.token);
      }

      if (data.user && typeof window !== "undefined") {
        this.user = data.user;
        localStorage.setItem("clevo_user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log(
        "Making registration request to:",
        `${API_BASE_URL}/auth/register`,
      );
      console.log("Registration data:", {
        ...userData,
        password: "[HIDDEN]",
      });

      // Validate data before sending
      this.validateRegistrationData(userData);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
      });

      console.log("Registration response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Registration error response:", errorText);

        try {
          const errorData = JSON.parse(errorText);
          throw new Error(
            errorData.message || `Registration failed: ${response.status}`,
          );
        } catch (parseError) {
          throw new Error(
            `Registration failed: ${response.status} - ${errorText}`,
          );
        }
      }

      const responseText = await response.text();
      console.log("Registration response text:", responseText);

      // Handle successful registration - don't expect token immediately
      let data: AuthResponse = {};

      // Try to parse response, but don't fail if it's empty or just a success message
      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.log(
            "Registration response is not JSON, treating as success message",
          );
          // If it's not JSON, assume it's a success message
          data = { message: responseText };
        }
      } else {
        // Empty response is also considered success for registration
        data = { message: "Registration successful" };
      }

      // For registration, we don't store token/user data
      // The user will need to log in separately
      console.log("Registration completed successfully");

      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  private validateRegistrationData(userData: RegisterRequest): void {
    // Basic validation
    if (!userData.username || userData.username.trim().length === 0) {
      throw new Error("Username is required");
    }
    if (!userData.email || userData.email.trim().length === 0) {
      throw new Error("Email is required");
    }
    if (!userData.password || userData.password.length === 0) {
      throw new Error("Password is required");
    }
    if (!userData.firstName || userData.firstName.trim().length === 0) {
      throw new Error("First name is required");
    }
    if (!userData.lastName || userData.lastName.trim().length === 0) {
      throw new Error("Last name is required");
    }
    if (!userData.address || userData.address.trim().length === 0) {
      throw new Error("Address is required");
    }
    if (!userData.phoneNumber || userData.phoneNumber.trim().length === 0) {
      throw new Error("Phone number is required");
    }

    // Role-specific validation
    if (
      userData.role === "CITIZEN" &&
      (!userData.wardId || userData.wardId.trim().length === 0)
    ) {
      throw new Error("Ward is required for citizens");
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error("Please enter a valid email address");
    }
  }

  logout(): void {
    this.token = null;
    this.user = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("clevo_token");
      localStorage.removeItem("clevo_user");
    }
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): AuthResponse["user"] | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    return headers;
  }
}

export const authService = AuthService.getInstance();
