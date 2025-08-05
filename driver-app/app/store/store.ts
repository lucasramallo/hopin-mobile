import { create } from "zustand";
import { Driver } from "../service/service";

interface StoreState {
    user: Driver | null;
    setCurrentUser: (driver: Driver | null) => void;
}

const useStore = create<StoreState>(set => ({
    user: null,
    setCurrentUser: (driver: Driver | null) => set({ user: driver })
}));

export default useStore;
