import React, { useState, useEffect, useCallback } from "react";
import Pit from "./Pit";
import Mancala from "./Mancala";

function GameBoard() {
  const [gameState, setGameState] = useState({
    playerOne: Array(6).fill(4), // 6 pits with 4 beads each
    playerTwo: Array(6).fill(4), // 6 pits with 4 beads each
    mancala: { playerOne: 0, playerTwo: 0 }, // Mancalas start with 0 beads
    currentPlayer: "playerOne", // Player One starts
  });

  const [gameOver, setGameOver] = useState(false);
  const [autoplayInterval, setAutoplayInterval] = useState(null);

  // Auto-play logic
  useEffect(() => {
    const intervalId = autoPlayGame();
    setAutoplayInterval(intervalId);

    return () => clearInterval(autoplayInterval);
  }, []);

  

  // Memoized endGame function to avoid re-creating it on every render
  const endGame = useCallback(() => {
    setGameOver(true);
    clearInterval(autoplayInterval);

    // Calculate the final score for both players
    const playerOneTotal =
      gameState.mancala.playerOne +
      gameState.playerOne.reduce((sum, count) => sum + count, 0);
    const playerTwoTotal =
      gameState.mancala.playerTwo +
      gameState.playerTwo.reduce((sum, count) => sum + count, 0);

    // Determine the winner
    let winner = null;
    if (playerOneTotal > playerTwoTotal) {
      winner = "Player One";
    } else if (playerTwoTotal > playerOneTotal) {
      winner = "Player Two";
    } else {
      winner = "It's a tie!";
    }

    alert(
      `Game Over! ${winner} wins with ${playerOneTotal} (p1) vs ${playerTwoTotal} (p2)`
    );
  }, [gameState, autoplayInterval]);

  // Check if the game is over whenever gameState changes
  useEffect(() => {
    const playerOneEmpty = gameState.playerOne.every((count) => count === 0);
    const playerTwoEmpty = gameState.playerTwo.every((count) => count === 0);

    if (playerOneEmpty || playerTwoEmpty) {
      endGame();
    }
  }, [gameState, endGame]);

  // Function to distribute beads when a pit is clicked
  const distributeBeads = (player, index) => {
    setGameState((prevState) => {
      const newGameState = { ...prevState };
      const playerPits =
        player === "playerOne"
          ? [...newGameState.playerOne]
          : [...newGameState.playerTwo];
      let beads = playerPits[index];
      playerPits[index] = 0;
      let currentIndex = index + 1;

      while (beads > 0) {
        if (currentIndex < 6) {
          // Drop bead in the next pit
          playerPits[currentIndex]++;
          beads--;
        } else if (currentIndex === 6) {
          // Drop bead in the player's Mancala
          if (newGameState.currentPlayer === player) {
            newGameState.mancala[player]++;
            beads--;
          }
        } else if (currentIndex > 6 && currentIndex < 13) {
          // Drop bead in opponent's pits
          const opponentIndex = 12 - currentIndex;
          const opponentPits =
            player === "playerOne"
              ? [...newGameState.playerTwo]
              : [...newGameState.playerOne];
          opponentPits[opponentIndex]++;
          if (player === "playerOne") {
            newGameState.playerTwo = opponentPits;
          } else {
            newGameState.playerOne = opponentPits;
          }
          beads--;
        } else if (currentIndex === 13) {
          // Drop bead in opponent's Mancala
          if (newGameState.currentPlayer !== player) {
            newGameState.mancala[
              player === "playerOne" ? "playerTwo" : "playerOne"
            ]++;
            beads--;
          }
        } else if (currentIndex >= 13) {
          currentIndex = 0;
          playerPits[currentIndex]++;
          beads--;
        }

        currentIndex++;
      }

      // Update player pits
      if (player === "playerOne") {
        newGameState.playerOne = playerPits;
      } else {
        newGameState.playerTwo = playerPits;
      }

      // Switch player
      newGameState.currentPlayer =
        newGameState.currentPlayer === "playerOne" ? "playerTwo" : "playerOne";

      return newGameState;
    });
  };

  // Function to make an automated move for the current player
  const automatedMove = (player) => {
    const currentPots =
      player === "playerOne" ? gameState.playerOne : gameState.playerTwo;
    const possibleMoves = currentPots.reduce((acc, count, index) => {
      if (count > 0) acc.push(index);
      return acc;
    }, []);

    if (possibleMoves.length > 0) {
      const randomIndex = Math.floor(Math.random() * possibleMoves.length);
      const potIndex = possibleMoves[randomIndex];
      distributeBeads(player, potIndex);
      return true;
    }
    return false;
  };

  // Autoplay logic
  const autoPlayGame = () => {
    const intervalId = setInterval(() => {
      if (gameOver) {
        clearInterval(intervalId);
        return;
      }

      if (!automatedMove(gameState.currentPlayer)) {
        // Switch player if no valid moves
        setGameState((prevState) => ({
          ...prevState,
          currentPlayer:
            prevState.currentPlayer === "playerOne" ? "playerTwo" : "playerOne",
        }));
      }
    }, 1500);
    return intervalId;
  };

  // Generate HTML for pits dynamically
  const generatePotHTML = (beadCounts, player) => {
    const reversedBeadCounts =
      player === "playerOne" ? beadCounts.slice().reverse() : beadCounts;

    return reversedBeadCounts.map((count, index) => (
      <Pit
        key={`p${player}${index}`}
        count={count}
        player={player}
        index={index}
        onClick={() => {
          if (!gameOver && gameState.currentPlayer === player)
            distributeBeads(player, player === "playerOne" ? 5 - index : index);
        }}
      />
    ));
  };

  return (
    <div className="board">
      <div className="section endsection">
        <Mancala count={gameState.mancala.playerOne} player="playerOne" />
      </div>
      <div className="section midsection">
        <div className="midrow botmid">{generatePotHTML(gameState.playerOne, "playerOne")}</div>
        <div className="midrow topmid">{generatePotHTML(gameState.playerTwo, "playerTwo")}</div>
      </div>
      <div className="section endsection">
        <Mancala count={gameState.mancala.playerTwo} player="playerTwo" />
      </div>
    </div>
  );
}

export default GameBoard;