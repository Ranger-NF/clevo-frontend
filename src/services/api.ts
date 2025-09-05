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

export interface UpdateBookingStatusRequest {
  status: string;
}

// API service functions
export const recyclerApi = {
  // Get slots for a recycler
  getRecyclerSlots: async (recyclerId: string): Promise<PickupSlot[]> => {
    const response = await fetch(`${API_BASE_URL}/recycler/slots/${recyclerId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recycler slots');
    }
    return response.json();
  },

  // Create a new pickup slot
  createSlot: async (slot: PickupSlot): Promise<PickupSlot> => {
    const response = await fetch(`${API_BASE_URL}/recycler/slots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slot),
    });
    if (!response.ok) {
      throw new Error('Failed to create slot');
    }
    return response.json();
  },

  // Update a pickup slot
  updateSlot: async (id: string, slot: PickupSlot): Promise<PickupSlot> => {
    const response = await fetch(`${API_BASE_URL}/recycler/slots/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slot),
    });
    if (!response.ok) {
      throw new Error('Failed to update slot');
    }
    return response.json();
  },

  // Delete a pickup slot
  deleteSlot: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/recycler/slots/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete slot');
    }
  },

  // Get bookings by ward
  getBookingsByWard: async (wardId: string): Promise<Booking[]> => {
    const response = await fetch(`${API_BASE_URL}/recycler/bookings/ward/${wardId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return response.json();
  },
};

export const bookingApi = {
  // Update booking status
  updateBookingStatus: async (bookingId: string, statusRequest: UpdateBookingStatusRequest): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/recycler/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statusRequest),
    });
    if (!response.ok) {
      throw new Error('Failed to update booking status');
    }
    return response.text();
  },
};