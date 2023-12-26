// store.js
import {create}from 'zustand';

const useAccount = create((set) => ({
  data: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    expertise: '',
    profilePicture: '',
  },
  setData: (newData) => set((state) => ({ data: { ...state.data, ...newData } })),
  getData : () => set((state) => ({ data: { ...state.data } })),
}));

export default useAccount;
