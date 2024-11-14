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
        determineWinner();
        setIsGameOver(true);
        setAutoplayActive(false);
      }
    }, 500);

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
  const playTurn = (player) => {
    let pots = [...allPotsOrdered];
    const eligiblePots = pots.filter(pot => pot.player === player && pot.beads > 0 && pot.type !== "mancala");

    if (eligiblePots.length === 0) {
      switchPlayer();
      return;
    }

    // Choose a random pot with beads for autoplay
    const randomPotIndex = Math.floor(Math.random() * eligiblePots.length);
    const potToPlay = eligiblePots[randomPotIndex];


    let beads = potToPlay.beads;
    potToPlay.beads = 0;
    let currentIndex = pots.indexOf(potToPlay);

    let currentPot = currentIndex;
    while (beads > 0) {
      currentPot = (currentPot + 1) % pots.length;
      const nextPot = pots[currentPot];

      // Skip opponent's mancala
      if ((player === "btmPlayer" && nextPot.id === "mancala2") || (player === "topPlayer" && nextPot.id === "mancala1")) {
        continue;
      }

      nextPot.beads++;
      beads--;
    }

    const lastPot = pots[currentPot];

    // Last bead in own empty pot rule
    if (lastPot.beads === 1 && lastPot.type !== "mancala" && lastPot.player === player) {
      const oppositePotIndex = 12 - currentPot;
      const oppositePot = pots[oppositePotIndex];
      if (oppositePot && oppositePot.beads > 0) { // Check if oppositePot exists
        lastPot.beads += oppositePot.beads;
        oppositePot.beads = 0;
      }
    }

    // Free turn rule
    const playerMancalaId = player === "btmPlayer" ? "mancala1" : "mancala2";
    if (lastPot.id === playerMancalaId) {
      setAllPotsOrdered([...pots]); // Update state and let the same player play again
      return; // Don't switch players
    }


    setAllPotsOrdered([...pots]);
    switchPlayer();
  };
  

  // Switch the current player
  const switchPlayer = () => {
    setCurrentPlayer(prev => (prev === "btmPlayer" ? "topPlayer" : "btmPlayer"));
  };

  // Check if the game is over
  const checkGameOver = () => {
    const btmPotsEmpty = allPotsOrdered.slice(7, 13).every(pot => pot.beads === 0);
    const topPotsEmpty = allPotsOrdered.slice(0, 6).every(pot => pot.beads === 0);

    if (btmPotsEmpty) {
      let topPlayerRemainingBeads = 0;
      for (let i = 0; i < 6; i++) {
        topPlayerRemainingBeads += allPotsOrdered[i].beads;
        allPotsOrdered[i].beads = 0;
      }
      const mancala2 = allPotsOrdered.find(pot => pot.id === "mancala2");
      mancala2.beads += topPlayerRemainingBeads;
    } else if (topPotsEmpty) {
      let btmPlayerRemainingBeads = 0;
      for (let i = 7; i < 13; i++) {
        btmPlayerRemainingBeads += allPotsOrdered[i].beads;
        allPotsOrdered[i].beads = 0;
      }
      const mancala1 = allPotsOrdered.find(pot => pot.id === "mancala1");
      mancala1.beads += btmPlayerRemainingBeads;
    }

    setAllPotsOrdered([...allPotsOrdered]);

    return btmPotsEmpty || topPotsEmpty;
  };

  // Determine the winner based on Mancala bead count
  const determineWinner = () => {
    const topMancalaBeads = getMancalaBeads("mancala2");
    const btmMancalaBeads = getMancalaBeads("mancala1");

    if (topMancalaBeads > btmMancalaBeads) {
      alert("Top Player wins!");
    } else if (btmMancalaBeads > topMancalaBeads) {
      alert("Bottom Player wins!");
    } else {
      alert("It's a tie!");
    }
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
    setAllPotsOrdered(generatePots());
    setCurrentPlayer("btmPlayer");
    setIsGameOver(false);
    setAutoplayActive(true);
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
        <button onClick={startAutoplay} disabled={autoplayActive || isGameOver}></button>
        <button className="pause" onClick={stopAutoplay} disabled={!autoplayActive}></button>
      </div>
    </div>
  );
}

export default GameBoard;