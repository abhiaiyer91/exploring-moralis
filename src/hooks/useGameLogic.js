import { useMoralis } from "./useMoralis";
import { useAuth } from "./useAuth";
import { useEffect, useState } from "react";

const tictactoeconfig = require("../abi/TicTacToe.json");

export function useGameLogic({ initialStakes = "100000" }) {
  const { Moralis } = useMoralis();
  const { currentUser } = useAuth();

  const user = currentUser();

  async function initialize() {
    const web3 = await Moralis.Web3.enable();

    return new web3.eth.Contract(
      tictactoeconfig.abi,
      tictactoeconfig.networks["5"].address
    );
  }

  return {
    games: async () => {
      const contract = await initialize();

      console.log(contract, "###", user.get("ethAddress"));

      return contract?.methods?.get_game_status(user.get("ethAddress")).call({
        from: user.get("ethAddress"),
      });
    },

    startGame: async () => {
      const contract = await initialize();
      console.log(initialStakes);
      return contract?.methods?.start().send({
        from: user.get("ethAddress"),
        value: initialStakes,
      });
    },
  };
}
