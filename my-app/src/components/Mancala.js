// import React from "react";

// function Mancala({ id, beads }) {
//   return (
//     <div id={id} className="pot mancala">
//       <div className="beadContainer">
//         {[...Array(beads)].map((_, i) => (
//           <div key={i} className="bead" />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Mancala;

import React from "react";

//Displays a Mancala pot
function Mancala({ id, beads }) {
  return (
    <div id={id} className="pot mancala">
      <div className="beadContainer">
        {[...Array(beads)].map((_, i) => (
          <div key={`${id}Bead${i + 1}`} className="bead"></div>
        ))}
      </div>
    </div>
  );
}

export default Mancala;
