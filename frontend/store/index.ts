import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

export type PhysicsObject = {
  id: string;
  type: 'cube' | 'sphere';
  position: [number, number, number];
  mass: number;
  color: string;
  charge: number; // For magnetic repulsion simulation
};

interface LabState {
  experimentId: string | null;
  setExperimentId: (id: string | null) => void;
  gravity: number;
  setGravity: (g: number) => void;
  objects: PhysicsObject[];
  setObjects: (objs: PhysicsObject[]) => void;
  addObject: (obj: PhysicsObject) => void;
  updateObject: (id: string, updates: Partial<PhysicsObject>) => void;
  removeObject: (id: string) => void;
  selectedObjectId: string | null;
  setSelectedObjectId: (id: string | null) => void;
}

export const useLabStore = create<LabState>((set) => ({
  experimentId: null,
  setExperimentId: (id) => set({ experimentId: id }),
  gravity: -9.81,
  setGravity: (gravity) => set({ gravity }),
  
  objects: [
    { id: 'obj-1', type: 'cube', position: [0, 5, 0], mass: 1, color: '#534AB7', charge: 0 },
    { id: 'obj-2', type: 'sphere', position: [2, 8, 0], mass: 2, color: '#9F97F0', charge: 5 },
  ],
  setObjects: (objects) => set({ objects }),
  addObject: (obj) => set((state) => ({ objects: [...state.objects, obj] })),
  updateObject: (id, updates) => set((state) => ({
    objects: state.objects.map(obj => obj.id === id ? { ...obj, ...updates } : obj)
  })),
  removeObject: (id) => set((state) => ({
    objects: state.objects.filter(obj => obj.id !== id),
    selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId
  })),
  selectedObjectId: null,
  setSelectedObjectId: (id) => set({ selectedObjectId: id })
}));
