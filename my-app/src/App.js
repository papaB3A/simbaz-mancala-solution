import './App.css';
import Header from "./components/Header.js";
import Instructions from "./components/Instructions.js";
import GameBoard from "./components/GameBoard.js";
function App() {
  return (
    <div className="App">
      <Header/>
      <Instructions/>
      <GameBoard/>
    </div>
  );
}

export default App;
