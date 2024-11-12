import React, { useState, useEffect } from "react";
import Pit from "./Pit"; //Pit component for each pot
import Mancala from "./Mancala";//Mncala component for each mancala

function GameBoard() {
  //State
  const [currentPlayer, setCurrentPlayer] = useState("btmPlayer");//keeps track of which player’s turn it is...initialized to btmPlayer
  const [allPotsOrdered, setAllPotsOrdered] = useState([]);//store all the potz and mancala...ordered
  const [highlightedPot, setHighlightedPot] = useState(null);//keeps track of current highlighted pot on hover
  const [targetPot, setTargetPot] = useState(null);//keeps track of the target pot...beads will be distributed to it

  //this hook generates the pots when the component mounts
  useEffect(() => {
    const pots = generatePots();
    setAllPotsOrdered(pots);
  }, []);//Empty dependency array...runs only once when the component mounts

  //generates all the pots and mancala with 4 beads
  const generatePots = () => {
    let pots = [];

    //6 pots for the top player (top row)
    for (let i = 1; i <= 6; i++) {
      pots.push({ id: `topPot${i}`, type: "topPot", beads: 4 });
    }
    //mancala for the top player
    pots.push({ id: "mancala2", type: "mancala", beads: 0 });
    for (let i = 6; i >= 1; i--) {
      pots.push({ id: `btmPot${i}`, type: "btmPot", beads: 4 });
    }
    //mancala for the btm player
    pots.push({ id: "mancala1", type: "mancala", beads: 0 });
    return pots;//Returns the array of pots and mancalaz
  };

  //returns the id of the target pot
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

  //highlights the current pot with a white bckgrd color and determines the target pot
  const handleMouseOver = (potId) => {
    setHighlightedPot(potId);
    const targetId = getAnticlockwisePot(potId);
    setTargetPot(targetId);
  };

  //resets the highlighted pot and target pot
  const handleMouseOut = () => {
    setHighlightedPot(null);
    setTargetPot(null);
  };

  const switchPlayer = () => {
    setCurrentPlayer(prev => (prev === "btmPlayer" ? "topPlayer" : "btmPlayer"));
  };

  return (
    <div className="papazBoard">
      <div id="sideSection1" className="section sideSection">
        <Mancala id="mancala1" beads={0} />
      </div>
      <div className="section midSection">
        <div className="midRow topRow">
          {[...Array(6)].map((_, i) => (
            <Pit
              key={`topPot${i + 1}`}
              id={`topPot${i + 1}`}
              player="topPlayer"
              beads={4}
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
              beads={4}
              isHighlighted={highlightedPot === `btmPot${i + 1}`}
              isTarget={targetPot === `btmPot${i + 1}`}
              onMouseOver={() => handleMouseOver(`btmPot${i + 1}`)}
              onMouseOut={handleMouseOut}
            />
          ))}
        </div>
      </div>
      <div id="sideSection3" className="section sideSection">
        <Mancala id="mancala2" beads={0} />
      </div>
    </div>
  );
}

export default GameBoard;


