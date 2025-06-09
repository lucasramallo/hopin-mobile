import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

enum Status {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

interface Price {
  amount: number;
  currency: string;
}

interface Driver {
  id: string;
  name: string;
}

interface Trip {
  id: string;
  customerId: string;
  driver: Driver;
  payment: Price;
  status: Status;
  origin: string;
  destination: string;
  rating?: number;
  createdAt: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  role: Role;
  creditCardNumber?: string;
  creditCardExpiry?: string;
  creditCardCVV?: string;
  trips?: Trip[];
}

const CUSTOMER_KEY = '@CurrentCustomer';

class CustomerStorageService {
  async saveCustomer(customer: Customer): Promise<void> {
    try {
      const customerJson = JSON.stringify(customer);
      await AsyncStorage.setItem(CUSTOMER_KEY, customerJson);
    } catch (error) {
      console.error('Error saving customer to AsyncStorage:', error);
      throw new Error('Failed to save customer');
    }
  }

  async getCustomer(): Promise<Customer | null> {
    try {
      const customerJson = await AsyncStorage.getItem(CUSTOMER_KEY);
      if (customerJson) {
        return JSON.parse(customerJson) as Customer;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving customer from AsyncStorage:', error);
      return null;
    }
  }

  async clearCustomer(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CUSTOMER_KEY);
    } catch (error) {
      console.error('Error clearing customer from AsyncStorage:', error);
      throw new Error('Failed to clear customer');
    }
  }

  async addTrip(trip: Omit<Trip, 'createdAt' | 'driver'>): Promise<void> {
    try {
      const customer = await this.getCustomer();
      if (!customer) {
        throw new Error('No customer logged in');
      }

      const newTrip: Trip = {
        ...trip,
        driver: { id: uuidv4(), name: 'Jane Driver' },

        createdAt: new Date().toISOString(),
      };

      customer.trips = customer.trips ? [...customer.trips, newTrip] : [newTrip];
      await this.saveCustomer(customer);
    } catch (error) {
      console.error('Error adding trip to customer:', error);
      throw new Error('Failed to add trip');
    }
  }

  async updateTrip(updatedTrip: Partial<Trip> & { id: string }): Promise<void> {
    try {
      const customer = await this.getCustomer();
      if (!customer || !customer.trips) {
        throw new Error('No customer or trips found');
      }

      const updatedTrips = customer.trips.map(trip => {
        if (trip.id === updatedTrip.id) {
          return {
            ...trip,
            ...updatedTrip,
          };
        }
        return trip;
      });

      customer.trips = updatedTrips;
      await this.saveCustomer(customer);
    } catch (error) {
      console.error('Error updating trip:', error);
      throw new Error('Failed to update trip');
    }
  }


  async getTrips(): Promise<Trip[]> {
    try {
      const customer = await this.getCustomer();
      if (!customer) {
        return [];
      }
      return customer.trips || [];
    } catch (error) {
      console.error('Error retrieving trips from AsyncStorage:', error);
      return [];
    }
  }
}

export const customerStorageService = new CustomerStorageService();
export { Customer, Driver, Price, Role, Status, Trip };
