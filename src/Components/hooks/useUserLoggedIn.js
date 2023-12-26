import { create } from "zustand";

const useUserLoggedIn = create((set) => ({
  user: {},
  token: "",
  setUser: (data) => {
    set({ user: data.user, token: data.token });
  },
}));

export default useUserLoggedIn;

