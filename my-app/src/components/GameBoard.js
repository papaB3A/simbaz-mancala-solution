import React, { useState, useEffect } from "react";
import Pit from "./Pit"; // Pit component for each pot
import Mancala from "./Mancala"; // Mancala component for each mancala

function GameBoard() {
  // State
  const [currentPlayer, setCurrentPlayer] = useState("btmPlayer"); // Tracks whose turn it is
  const [allPotsOrdered, setAllPotsOrdered] = useState([]); // Store all pots and mancala
  const [highlightedPot, setHighlightedPot] = useState(null); // Highlights pot on hover
  const [targetPot, setTargetPot] = useState(null); // Tracks the target pot
  const [isGameOver, setIsGameOver] = useState(false); // Whether the game is over
  const [autoplayActive, setAutoplayActive] = useState(false); // Controls autoplay

  // This hook generates the pots when the component mounts
  useEffect(() => {
    const pots = generatePots();
    setAllPotsOrdered(pots);
  }, []); // Runs only once when the component mounts

  // Autoplay the game until there is a winner
  useEffect(() => {
    if (isGameOver || !autoplayActive) return; // Don't autoplay if the game is over or autoplay is not active

    const autoplay = setInterval(() => {
      playTurn(currentPlayer); // Simulate the player's turn
      if (checkGameOver()) {
        clearInterval(autoplay);
        alert(`${currentPlayer} wins!`);
        setIsGameOver(true);
      } else {
        switchPlayer(); // Switch the player after each turn
      }
    }, 1000); // Run every 1 second for autoplay effect

    return () => clearInterval(autoplay); // Cleanup interval on component unmount
  }, [currentPlayer, allPotsOrdered, isGameOver, autoplayActive]);

  // Generates all the pots and mancala with 4 beads
  const generatePots = () => {
    let pots = [];

    // 6 pots for the top player (top row)
    for (let i = 1; i <= 6; i++) {
      pots.push({ id: `topPot${i}`, type: "topPot", beads: 4, player: "topPlayer" });
    }
    // Mancala for the top player
    pots.push({ id: "mancala2", type: "mancala", beads: 0 });
    // 6 pots for the bottom player (bottom row)
    for (let i = 6; i >= 1; i--) {
      pots.push({ id: `btmPot${i}`, type: "btmPot", beads: 4, player: "btmPlayer" });
    }
    // Mancala for the bottom player
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
    const pots = [...allPotsOrdered];
    // Find a pot to play (the first non-empty pot)
    const potToPlay = pots.find(pot => pot.player === player && pot.beads > 0);

    if (!potToPlay) return; // If no valid pots, skip the turn

    let beads = potToPlay.beads;
    potToPlay.beads = 0; // Empty the pot
    let currentIndex = allPotsOrdered.indexOf(potToPlay);
    let currentPot = currentIndex;

    // Distribute beads
    while (beads > 0) {
      currentPot = (currentPot + 1) % allPotsOrdered.length; // Move to the next pot
      const nextPot = allPotsOrdered[currentPot];

      // Skip opponent's mancala
      if (nextPot.type !== "mancala" || (player === "btmPlayer" && currentPot !== 13) || (player === "topPlayer" && currentPot !== 6)) {
        allPotsOrdered[currentPot].beads += 1; // Place a bead in the current pot
        beads--;
      }
    }

    // Check if the last bead landed in an empty pit on the player's side
    if (allPotsOrdered[currentPot].beads === 1 && allPotsOrdered[currentPot].type !== "mancala" && allPotsOrdered[currentPot].player === player) {
      const oppositePotIndex = 12 - currentPot; // Find the opposite pit for the capture
      const oppositePot = allPotsOrdered[oppositePotIndex];
      if (oppositePot.beads > 0) {
        // Capture beads from the opponent's opposite pit
        allPotsOrdered[currentPot].beads += oppositePot.beads; // Add captured beads to the current pot
        oppositePot.beads = 0; // Empty the opponent's opposite pit
      }
    }

    setAllPotsOrdered([...allPotsOrdered]); // Update the state after the turn is played
  };

  // Switch the current player
  const switchPlayer = () => {
    setCurrentPlayer(prev => (prev === "btmPlayer" ? "topPlayer" : "btmPlayer"));
  };

  // Check if the game is over
  const checkGameOver = () => {
    const btmPotsEmpty = allPotsOrdered.slice(7, 13).every(pot => pot.beads === 0);
    const topPotsEmpty = allPotsOrdered.slice(0, 6).every(pot => pot.beads === 0);
    
    if (btmPotsEmpty || topPotsEmpty) {
      // If either player has no beads in their pots, the game is over
      return true;
    }
    return false;
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
    setIsGameOver(false); // Reset game over state in case it's clicked after a game ends
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
                beads={allPotsOrdered[i]?.beads || 0} // Use beads from state
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
                beads={allPotsOrdered[7 + i]?.beads || 0} // Use beads from state
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
