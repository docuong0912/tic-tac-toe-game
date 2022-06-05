//import css
import './App.css';
import './css/GameMenu.css';
import './css/GameState.css';
//import component
import GameMenu from './component/GameMenu';
import GameState from './component/GameState';
//import hooks
import { useState,useEffect } from 'react';

function App() {
  const [player1,setP1] = useState();
  const [player2,setP2] = useState();
  const [state,setState] = useState(false);
  useEffect(()=>{
    sessionStorage.setItem("state",JSON.stringify(state));
  },[state]);
  return (
    state ? <GameState P1={player1} P2={player2} setState={setState}/>: <GameMenu setP1={setP1} setP2={setP2} setState={setState}/>
  );
}

export default App;
