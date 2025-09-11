const API_BASE_URL = 'http://localhost:8080/api';

export interface AuthRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: 'CITIZEN' | 'RECYCLER' | 'AUTHORITY';
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: 'CITIZEN' | 'RECYCLER' | 'AUTHORITY';
    firstName: string;
    lastName: string;
    active: boolean;
  };
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private user: AuthResponse['user'] | null = null;

  private constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('clevo_token');
    const savedUser = localStorage.getItem('clevo_user');
    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('clevo_user');
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
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data: AuthResponse = await response.json();
    
    // Store token and user data
    this.token = data.token;
    this.user = data.user;
    localStorage.setItem('clevo_token', data.token);
    localStorage.setItem('clevo_user', JSON.stringify(data.user));

    return data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data: AuthResponse = await response.json();
    
    // Store token and user data
    this.token = data.token;
    this.user = data.user;
    localStorage.setItem('clevo_token', data.token);
    localStorage.setItem('clevo_user', JSON.stringify(data.user));

    return data;
  }

  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('clevo_token');
    localStorage.removeItem('clevo_user');
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): AuthResponse['user'] | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }
}

export const authService = AuthService.getInstance();