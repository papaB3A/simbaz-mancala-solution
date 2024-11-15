const Person = (props) => {
    return (
        <> 
            <h1 className="inst">Step: {props.step}</h1>
            <h2 className="tile">Title: {props.title}</h2>
            <h2>Content: {props.content}</h2>
        </>
    );
};

const Instructions = () => {
    return (
        <div className="Instructions">
            <Person 
                step={1} 
                title="Vocabulary and Set Up" 
                content="You will see two rows of six (pits),
                 with a long (mancala) on each end. The board is divided into two parts: Your side and mancala, and your opponent's side and mancala. Your side is the six pits closest to you, and your mancala is to your right. The same is for your opponent; their side is the six pits closest to them and their mancala is to their right."
            />
            <Person 
                step={2} 
                title="Basic Gameplay" 
                content="Mancala is a really easy game to play! During a turn, a player grabs all of the stones in a pit on their side and drops them, one by one, in succeeding (subsequent) holes in a counter-clockwise direction. Players MAY place stones in their own mancala (it counts as a pit), but they MUST skip over their opponent's mancala. Players MAY place stones in pits on their opponent's side. This continues until the player has no more stones in their hand. It is then their opponent's turn."
            />
            <Person 
                step={3} 
                title="Scoring and Winning" 
                content="The game is over when a player (not both) has no more stones on their side. His opponent then takes all of the stones on his side and places them in his mancala. The winner is the person with the most stones in their mancala after counting."
            />
            <Person 
                step={4} 
                title="Exceptions" 
                content="If, when dropping stones in pits, you drop a stone into your own mancala and that is the last stone in your hand, then you get to go again. If, when dropping stones into pits, you drop a stone into a pit that was previously empty, and the pit is on your side, AND that was the last stone in your hand, you take all of the stones in the pit directly above, and place them into your mancala."
            />
            <Person 
                step={5}
                title="Good Luck!" 
                content="Now you are ready to play Mancala! Have fun and strategize wisely."
            />
        </div>
    );
};

export default Instructions;
