import './App.css';
import Header from "./components/Header.js";
import Instructions from "./components/Instructions.js";
import GameBoard from "./components/GameBoard.js";
import PlayButton from './components/GameButton.js';
import WinMessage from './components/GameMessage.js';
function App() {
  return (
    <div className="App">
      <Header/>
      <Instructions/>
      <GameBoard/>
      <PlayButton/>
      <WinMessage/>

    </div>
  );
}

export default App;
