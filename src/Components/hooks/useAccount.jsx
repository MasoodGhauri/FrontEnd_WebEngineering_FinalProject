// store.js
import create from 'zustand';

const useUserDataStore = create((set) => ({
  data: {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: '',
    expertise: '',
  },
  setData: (newData) => set((state) => ({ data: { ...state.data, ...newData } })),
  getData : () => set((state) => ({ data: { ...state.data } })),
}));

export default useUserDataStore;
