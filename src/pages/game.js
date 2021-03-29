import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { Game } from "../components/TicTacToe";
import { useGameLogic } from "../hooks/useGameLogic";

export default function GamePage() {
  const { games, startGame } = useGameLogic({});

  const [gameBalance, setBalance] = useState(0);

  useEffect(() => {
    games().then((data) => {
      console.log(data);

      setBalance(data["0"]);
    });
  });

  return (
    <Layout>
      {gameBalance ? (
        <p>Game Balance: {gameBalance}</p>
      ) : (
        <button
          onClick={() => {
            return startGame()
              .then((data) => {
                console.log(data);
              })
              .catch((e) => {
                console.error(e);
              });
          }}
        >
          Start Game
        </button>
      )}

      <Game />
    </Layout>
  );
}
