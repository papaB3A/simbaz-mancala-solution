import React, { useState, useEffect } from "react";
import Pit from "./Pit"; // Pit component for each pot
import Mancala from "./Mancala"; // Mancala component for each mancala

function GameBoard() {
  // State
  const [currentPlayer, setCurrentPlayer] = useState("btmPlayer");
  const [allPotsOrdered, setAllPotsOrdered] = useState([]);
  const [highlightedPot, setHighlightedPot] = useState(null);
  const [targetPot, setTargetPot] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [autoplayActive, setAutoplayActive] = useState(false);

  // This hook generates the pots when the component mounts
  useEffect(() => {
    const pots = generatePots();
    setAllPotsOrdered(pots);
  }, []);

  // Autoplay the game until there is a winner
  useEffect(() => {
    if (isGameOver || !autoplayActive) return;

    const autoplay = setInterval(() => {
      playTurn(currentPlayer);
      if (checkGameOver()) {
        clearInterval(autoplay);
        alert(`${currentPlayer} wins!`);
        setIsGameOver(true);
      } else {
        switchPlayer();
      }
    }, 1000);

    return () => clearInterval(autoplay);
  }, [currentPlayer, allPotsOrdered, isGameOver, autoplayActive]);

  // Generates all the pots and mancala with 4 beads
  const generatePots = () => {
    let pots = [];

    for (let i = 1; i <= 6; i++) {
      pots.push({ id: `topPot${i}`, type: "topPot", beads: 4, player: "topPlayer" });
    }
    pots.push({ id: "mancala2", type: "mancala", beads: 0 });
    for (let i = 6; i >= 1; i--) {
      pots.push({ id: `btmPot${i}`, type: "btmPot", beads: 4, player: "btmPlayer" });
    }
    pots.push({ id: "mancala1", type: "mancala", beads: 0 });

    return pots;
  };

  // Get beads for the mancala pots
  const getMancalaBeads = (id) => {
    const mancala = allPotsOrdered.find(pot => pot.id === id);
    return mancala ? mancala.beads : 0;
  };

  // Simulate the turn of the current player
  const playTurn = (player) => {
    let pots = [...allPotsOrdered];
    const potToPlay = pots.find(pot => pot.player === player && pot.beads > 0);

    if (!potToPlay) return;

    let beads = potToPlay.beads;
    potToPlay.beads = 0;
    let currentIndex = pots.indexOf(potToPlay);
    let currentPot = currentIndex;

    while (beads > 0) {
      currentPot = (currentPot + 1) % pots.length;
      const nextPot = pots[currentPot];

      if (nextPot.type !== "mancala" || (player === "btmPlayer" && currentPot !== 13) || (player === "topPlayer" && currentPot !== 6)) {
        pots[currentPot].beads += 1;
        beads--;
      }
    }

    if (pots[currentPot].beads === 1 && pots[currentPot].type !== "mancala" && pots[currentPot].player === player) {
      const oppositePotIndex = 12 - currentPot;
      const oppositePot = pots[oppositePotIndex];
      if (oppositePot.beads > 0) {
        pots[currentPot].beads += oppositePot.beads;
        oppositePot.beads = 0;
      }
    }

    setAllPotsOrdered([...pots]);
  };

  // Switch the current player
  const switchPlayer = () => {
    setCurrentPlayer(prev => (prev === "btmPlayer" ? "topPlayer" : "btmPlayer"));
  };

  // Check if the game is over
  const checkGameOver = () => {
    const btmPotsEmpty = allPotsOrdered.slice(7, 13).every(pot => pot.beads === 0);
    const topPotsEmpty = allPotsOrdered.slice(0, 6).every(pot => pot.beads === 0);

    return btmPotsEmpty || topPotsEmpty;
  };

  // Highlights the current pot with a white background color and determines the target pot
  const handleMouseOver = (potId) => {
    setHighlightedPot(potId);
    const targetId = getAnticlockwisePot(potId);
    setTargetPot(targetId);
  };

  // Resets the highlighted pot and target pot
  const handleMouseOut = () => {
    setHighlightedPot(null);
    setTargetPot(null);
  };

  // Returns the id of the anticlockwise pot from the current pot
  const getAnticlockwisePot = (currentPotId) => {
    const index = allPotsOrdered.findIndex(pot => pot.id === currentPotId);
    if (index === -1) return null;

    let steps = 0;
    let anticlockwiseIndex = index;

    while (steps < 4) {
      anticlockwiseIndex = (anticlockwiseIndex + 1) % allPotsOrdered.length;
      const pot = allPotsOrdered[anticlockwiseIndex];
      if (currentPlayer === "btmPlayer" && pot.id !== "mancala1") {
        steps++;
      } else if (currentPlayer === "topPlayer" && pot.id !== "mancala2") {
        steps++;
      }
    }
    return allPotsOrdered[anticlockwiseIndex].id;
  };

  // Start autoplay
  const startAutoplay = () => {
    setAutoplayActive(true);
    setIsGameOver(false);
  };

  // Stop autoplay
  const stopAutoplay = () => {
    setAutoplayActive(false);
  };

  return (
    <div className="gameContainer">
      <div className="papazBoard">
        <div id="sideSection1" className="section sideSection">
          <Mancala id="mancala1" beads={getMancalaBeads("mancala1")} />
        </div>
        <div className="section midSection">
          <div className="midRow topRow">
            {[...Array(6)].map((_, i) => (
              <Pit
                key={`topPot${i + 1}`}
                id={`topPot${i + 1}`}
                player="topPlayer"
                beads={allPotsOrdered[i]?.beads || 0}
                isHighlighted={highlightedPot === `topPot${i + 1}`}
                isTarget={targetPot === `topPot${i + 1}`}
                onMouseOver={() => handleMouseOver(`topPot${i + 1}`)}
                onMouseOut={handleMouseOut}
              />
            ))}
          </div>
          <div className="midRow btmRow">
            {[...Array(6)].map((_, i) => (
              <Pit
                key={`btmPot${i + 1}`}
                id={`btmPot${i + 1}`}
                player="btmPlayer"
                beads={allPotsOrdered[7 + i]?.beads || 0}
                isHighlighted={highlightedPot === `btmPot${i + 1}`}
                isTarget={targetPot === `btmPot${i + 1}`}
                onMouseOver={() => handleMouseOver(`btmPot${i + 1}`)}
                onMouseOut={handleMouseOut}
              />
            ))}
          </div>
        </div>
        <div id="sideSection3" className="section sideSection">
          <Mancala id="mancala2" beads={getMancalaBeads("mancala2")} />
        </div>
      </div>

      {/* Buttons outside the game board */}
      <div className="buttonContainer">
        <button onClick={startAutoplay} disabled={autoplayActive || isGameOver}>Start Autoplay</button>
        <button onClick={stopAutoplay} disabled={!autoplayActive}>Stop Autoplay</button>
      </div>
    </div>
  );
}

export default GameBoard;
