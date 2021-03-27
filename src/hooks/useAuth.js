import { navigate } from "gatsby-link";
import { useMoralis } from "./useMoralis";

export function useAuth() {
  const { Moralis } = useMoralis();
  return {
    login: async () => {
      try {
        await Moralis?.Web3.authenticate();
        navigate("/");
      } catch (e) {
        console.error(e.message, e);
      }
    },

    logout: async () => {
      try {
        await Moralis?.User.logOut();
        navigate("/login");
      } catch (e) {
        console.error(e.message, e);
      }
    },

    currentUser: () => {
      return Moralis?.User.current();
    },
  };
}
