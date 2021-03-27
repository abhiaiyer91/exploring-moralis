import { navigate } from "gatsby-link";
import { useMoralis } from "./useMoralis";

export function useAuth() {
  const { Moralis } = useMoralis();
  return {
    login: async () => {
      try {
        if (typeof window !== `undefined`) {
          await Moralis.Web3.authenticate();
          navigate("/");
        }
      } catch (e) {
        console.error(e.message, e);
      }
    },

    logout: async () => {
      try {
        if (typeof window !== `undefined`) {
          await Moralis.User.logOut();
          navigate("/login");
        }
      } catch (e) {
        console.error(e.message, e);
      }
    },

    currentUser: () => {
      if (typeof window !== `undefined`) {
        return Moralis.User.current();
      }
    },
  };
}
