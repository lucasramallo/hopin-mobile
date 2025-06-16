import { create } from "zustand";
import { Driver } from "../service/service";

interface StoreState {
    user: Driver | null;
    setCurrentUser: (driver: Driver) => void;
}

const useStore = create<StoreState>(set => ({
    user: null,
    setCurrentUser: (driver: Driver) => set({ user: driver })
}));

export default useStore;
