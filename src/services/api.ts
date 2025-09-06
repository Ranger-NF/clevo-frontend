const API_BASE_URL = 'http://localhost:8080/api';

// Types based on the OpenAPI schema
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'CITIZEN' | 'RECYCLER' | 'AUTHORITY';
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  active: boolean;
}

export interface Ward {
  id: string;
  name: string;
  description: string;
  authority: User;
}

export interface WasteCategory {
  id: string;
  name: string;
  description: string;
  ecoPointsPerUnit: number;
}

export interface PickupSlot {
  id?: string;
  recycler: User;
  ward: Ward;
  startTime: string;
  endTime: string;
  capacity: number;
  currentBookingsCount: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  citizen: User;
  pickupSlot: PickupSlot;
  wasteCategory: WasteCategory;
  estimatedQuantity: number;
  actualQuantity: number;
  status: 'PENDING' | 'CONFIRMED' | 'COLLECTED' | 'CANCELLED';
  confirmationCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reward {
  id: number;
  name: string;
  points: number;
}

export interface UpdateBookingStatusRequest {
  status: string;
}

export interface BookingRequest {
  slotId: string;
  wasteCategoryId: string;
  estimatedQuantity: number;
}

export interface RewardRedeemRequest {
  rewardId: number;
}

export interface WasteCategoryRequest {
  name: string;
  description: string;
}

export interface WardRequest {
  name: string;
  description: string;
}

// Recycler API
export const recyclerApi = {
  getRecyclerSlots: async (recyclerId: string): Promise<PickupSlot[]> => {
    const response = await fetch(`${API_BASE_URL}/recycler/slots/${recyclerId}`);
    if (!response.ok) throw new Error('Failed to fetch recycler slots');
    return response.json();
  },

  createSlot: async (slot: PickupSlot): Promise<PickupSlot> => {
    const response = await fetch(`${API_BASE_URL}/recycler/slots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slot),
    });
    if (!response.ok) throw new Error('Failed to create slot');
    return response.json();
  },

  updateSlot: async (id: string, slot: PickupSlot): Promise<PickupSlot> => {
    const response = await fetch(`${API_BASE_URL}/recycler/slots/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slot),
    });
    if (!response.ok) throw new Error('Failed to update slot');
    return response.json();
  },

  deleteSlot: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/recycler/slots/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete slot');
  },

  getBookingsByWard: async (wardId: string): Promise<Booking[]> => {
    const response = await fetch(`${API_BASE_URL}/recycler/bookings/ward/${wardId}`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
  },
};

// Booking API
export const bookingApi = {
  updateBookingStatus: async (bookingId: string, statusRequest: UpdateBookingStatusRequest): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/recycler/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusRequest),
    });
    if (!response.ok) throw new Error('Failed to update booking status');
    return response.text();
  },
};

// Citizen API
export const citizenApi = {
  getSlots: async (): Promise<PickupSlot[]> => {
    const response = await fetch(`${API_BASE_URL}/citizen/slots`);
    if (!response.ok) throw new Error('Failed to fetch slots');
    return response.json();
  },

  getBookings: async (): Promise<Booking[]> => {
    const response = await fetch(`${API_BASE_URL}/citizen/bookings`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
  },

  bookSlot: async (booking: BookingRequest): Promise<Booking> => {
    const response = await fetch(`${API_BASE_URL}/citizen/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    if (!response.ok) throw new Error('Failed to book slot');
    return response.json();
  },

  getTotalRewards: async (): Promise<number> => {
    const response = await fetch(`${API_BASE_URL}/citizen/rewards/total`);
    if (!response.ok) throw new Error('Failed to fetch total rewards');
    return response.json();
  },

  getAvailableRewards: async (): Promise<Reward[]> => {
    const response = await fetch(`${API_BASE_URL}/citizen/rewards/available`);
    if (!response.ok) throw new Error('Failed to fetch available rewards');
    return response.json();
  },

  redeemReward: async (request: RewardRedeemRequest): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/citizen/rewards/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to redeem reward');
    return response.text();
  },
};

// Authority API
export const authorityApi = {
  listUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/authority/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  activateUser: async (id: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/authority/users/${id}/activate`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to activate user');
    return response.json();
  },

  deactivateUser: async (id: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/authority/users/${id}/deactivate`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to deactivate user');
    return response.json();
  },

  listWards: async (): Promise<Ward[]> => {
    const response = await fetch(`${API_BASE_URL}/authority/wards`);
    if (!response.ok) throw new Error('Failed to fetch wards');
    return response.json();
  },

  addWard: async (ward: WardRequest): Promise<Ward> => {
    const response = await fetch(`${API_BASE_URL}/authority/wards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ward),
    });
    if (!response.ok) throw new Error('Failed to add ward');
    return response.json();
  },

  listWasteCategories: async (): Promise<WasteCategory[]> => {
    const response = await fetch(`${API_BASE_URL}/authority/waste-categories`);
    if (!response.ok) throw new Error('Failed to fetch waste categories');
    return response.json();
  },

  addWasteCategory: async (category: WasteCategoryRequest): Promise<WasteCategory> => {
    const response = await fetch(`${API_BASE_URL}/authority/waste-categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    if (!response.ok) throw new Error('Failed to add waste category');
    return response.json();
  },

  // Dashboard APIs
  getWasteTrend: async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/authority/dashboard/waste-trend`);
    if (!response.ok) throw new Error('Failed to fetch waste trend');
    return response.json();
  },

  getWasteByType: async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/authority/dashboard/waste-by-type`);
    if (!response.ok) throw new Error('Failed to fetch waste by type');
    return response.json();
  },

  getWasteByRegion: async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/authority/dashboard/waste-by-region`);
    if (!response.ok) throw new Error('Failed to fetch waste by region');
    return response.json();
  },

  getEcoPointsDistribution: async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/authority/dashboard/eco-points-distribution`);
    if (!response.ok) throw new Error('Failed to fetch eco points distribution');
    return response.json();
  },
};