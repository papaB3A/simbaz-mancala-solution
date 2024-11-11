import './App.css';
import Header from "./components/Header.js";
import Header from "./components/Instructions.js";
import Header from "./components/GameBoard.js";

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
