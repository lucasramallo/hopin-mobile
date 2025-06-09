import { create } from 'zustand';
import { Customer, Trip } from '../service/CustomerStorageService';

interface StoreState {
  trip: Trip | null;
  customer: Customer | null;
  needToReloadHistory: boolean,
  setCurrentTrip: (trip: Trip) => void;
  resetCurrentTrip: () => void;
  setCurrentCustomer: (customer: Customer) => void;
  resetCurrentCustomer: () => void;
  setNeedToReloadHistory: (needToReloadHistory: boolean) => void;
  resetNeedToReloadHistory: () => void;
}

const useStore = create<StoreState>((set) => ({
  trip: null,
  customer: null,
  needToReloadHistory: false,

  setCurrentTrip: (trip: Trip) => set({ trip }),
  resetCurrentTrip: () => set({ trip: null }),

  setCurrentCustomer: (customer: Customer) => set({ customer }),
  resetCurrentCustomer: () => set({ customer: null }),

  setNeedToReloadHistory: (needToReloadHistory: boolean) => set({ needToReloadHistory }),
  resetNeedToReloadHistory: () => set({ needToReloadHistory: false }),
}));

export default useStore;
