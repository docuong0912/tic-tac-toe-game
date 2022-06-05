import redo from '../images/Path.png';
import { useEffect,useRef,useState } from "react";
export default function GameState({P1,P2,setState}){
    const n = 3;
    const [turn,Setturn] = useState(P1.mark=='x'?P1:P2);
    const [board,setBoard] = useState( ()=>{
        return JSON.parse(sessionStorage.getItem("board"))||Array.from({length: n},()=> Array.from({length: n}, () => undefined));
    });
    const [winIndex,setWinIndex] = useState([]);
    const [win,Whowon] = useState(null);
    const [finished,gameFinished] = useState(false);
    const [reset,isReset] = useState(false);
    const itemsRef = useRef([]);
    const [drawScore,setDrawScore] = useState(0);
    const winstate = (
        <>
             <div className={win!=null?win.mark+"-mark ":""}></div>
            <p className={win!=null?win.mark+"-win":""}>Takes the round</p>
        </>
    );
    const drawstate = <p>round tied</p>;
    useEffect(()=>{
        P2.opponent = P1.mark;

        if(!P2.isHuman && turn == P2){
            P2.selectedIndex = P2.findBestMove(board);
            updateBoard(P2);
            Setturn(P1);
        }
    },[win,finished,reset]);
    useEffect(()=>{
        if(checkGameState(board)){
            resetRound();
            return;
        }
        if(JSON.parse(sessionStorage.getItem("turn"))!=null){
            if(!P2.isHuman )
            Setturn(JSON.parse(sessionStorage.getItem("turn"))==P1?P2:P1);
            else  Setturn(JSON.parse(sessionStorage.getItem("turn")));
            setDrawScore(JSON.parse(sessionStorage.getItem("draw")));
            for(let i =0;i<itemsRef.current.length;i++){
                itemsRef.current[i].childNodes[0].classList.add(sessionStorage.getItem("i"+i+"Childclass"));
                itemsRef.current[i].classList.add(sessionStorage.getItem("i"+i+"class"));
               
            }
        }  
    },[]);
    const saveSession = ()=>{
    
        sessionStorage.setItem("board",JSON.stringify(board));
        sessionStorage.setItem("draw",JSON.stringify(drawScore));
        sessionStorage.setItem("turn",JSON.stringify(turn));
        sessionStorage.setItem("P1",JSON.stringify(P1));
        sessionStorage.setItem("P2",JSON.stringify(P2));
       
        for(let i=0;i<itemsRef.current.length;i++){
            if(itemsRef.current[i].classList.contains("played")){
                sessionStorage.setItem("i"+i+"class","played");
            }
            else sessionStorage.setItem("i"+i+"class","notplayed");
            if(itemsRef.current[i].childNodes[0].classList.contains("x-mark")){
                sessionStorage.setItem("i"+i+"Childclass","x-mark");
            }
            else if(itemsRef.current[i].childNodes[0].classList.contains("o-mark")){
                sessionStorage.setItem("i"+i+"Childclass","o-mark");
            }
            else{sessionStorage.setItem("i"+i+"Childclass","nothing");}
           
            
        }
    }
    useEffect(()=>{
        saveSession();
    },[board]);
    useEffect(()=>{
        
        for(let i=0;i<3;i++){
            if(win!=null)
            itemsRef.current[winIndex[i]].classList.add("win","win-"+win.mark);
        }
        
    },[win,reset]);
    const updateBoard = (player) =>{
        
        var tempBoard = [...board];
         
            if(player.selectedIndex<3){
                tempBoard[0][player.selectedIndex] = player.mark;
            }
            else if(player.selectedIndex>=3&&player.selectedIndex<6){
                tempBoard[1][player.selectedIndex-3]= player.mark;
            }
            else tempBoard[2][player.selectedIndex-6]= player.mark;
        setBoard(tempBoard);
        if(!finished)
        redraw(player);
        if(checkGameState(board)){
            if(!P2.isHuman)
            Whowon(turn==P1?P2:P1);
            else Whowon(turn);
           
        }
    }
    const redraw = (player)=>{
        
            if(!itemsRef.current[player.selectedIndex].classList.contains("played")){
                itemsRef.current[player.selectedIndex].classList.add("played");
                itemsRef.current[player.selectedIndex].childNodes[0].classList.add(player.mark+"-mark"); 
                
            }
    }
    const setMove=(index)=>{
        
        if(itemsRef.current[index].classList.contains("played")) return;
       if(!P2.isHuman ){
            P1.selectedIndex= index;
            updateBoard(turn);
            P2.selectedIndex = P2.findBestMove(board);
            Setturn(turn=>turn==P1?P2:P1);
            updateBoard(P2);
            Setturn(turn=>turn==P1?P2:P1);
            
        } 
       else{
           console.log(turn);
           turn.selectedIndex = index;
           updateBoard(turn);
           Setturn(turn==P1?P2:P1);
       }  
       
    }
    const checkFinish =(board)=>{
        for(let i = 0; i < 3 ;i++){
            for(let j =0;j<3;j++){
                if(board[i][j]===undefined||board[i][j]===null){
                    return false;
                }
            }
        }
        return true;
    }
    const checkGameState = (b)=>{
        if(checkFinish(board)){
            gameFinished(true);
            return;
       }
        for (let row = 0; row < 3; row++)
        {  
            if(b[row][0] !=undefined && b[row][1] !=undefined &&b[row][2]!=undefined)
            if (b[row][0] == b[row][1] && b[row][1] == b[row][2])
            {
                if(row == 0)
                setWinIndex([row,row+1,row+2]);
                else if(row == 1)
                setWinIndex([row+2,row+3,row+4]);
                else setWinIndex([row+4,row+5,row+6]);

                return true;
            }
        }
     
        for (let col = 0; col < 3; col++)
        {
            if(b[0][col] !=undefined && b[1][col] !=undefined &&b[2][col]!=undefined)
            if (b[0][col] == b[1][col] && b[1][col] == b[2][col])
            {
                setWinIndex([col,col+3,col+6]);
                return true;
            }
        }
     
        // Checking for Diagonals for X or O victory.
        if(b[0][0] !=undefined && b[1][1] !=undefined &&b[2][2]!=undefined)
        if (b[0][0] === b[1][1] && b[1][1] === b[2][2])
        {
            setWinIndex([0,4,8]);
            return true;
        }
        if(b[0][2] !=undefined && b[1][1] !=undefined &&b[2][0]!=undefined)
        if (b[0][2] === b[1][1] && b[1][1] === b[2][0])
        {
            setWinIndex([2,4,6]);
            return true;
        }
        return false;
        
    }
    const resetRound = ()=>{
        setBoard(Array.from({length: n},()=> Array.from({length: n}, () => undefined)));
        for(let i=0;i<3;i++)
        if(win!=null)
        itemsRef.current[winIndex[i]].classList.remove("win","win-"+win.mark);
        for(let i = 0;i < 9;i++){
            itemsRef.current[i].childNodes[0].removeAttribute("class");
            itemsRef.current[i].classList.remove("played");
        }
        if(win!=null)
        win.score++;
        else if(finished) setDrawScore(score=>score+1);
        else{
            P1.score = 0;
            P2.score = 0;
            setDrawScore(0);
        }
        gameFinished(false);
        Whowon(null);
        Setturn(P1.mark=="x"?P1:P2);
        setWinIndex([]);
        
    }
   
    return(
        <div className="game-container">
            <div className="game-header">
                <div className="logo">
                    <div className="x-mark"/>
                    <div className="o-mark"/>
                </div>
                <div className="turn">
                    {<div className={`${turn.mark}-mark`}/>}
                    <p>turn</p>
                </div>
                <button onClick={()=>isReset(true)} className='reset-btn'>
                    <img src = {redo} alt=" redo"/>
                </button>
                <div className={`result-container ${reset ? "show-result" : ""}`}>\
                    <div className='final-result'>
                        <div className='result'>
                            <p>restart game?</p>
                        </div>
                        <div>
                            <button onClick={()=>isReset(false)} className='quit-btn'>no,cancel</button>
                            <button onClick={()=>{resetRound();isReset(false)}} className='cont-btn'>yes,restart</button>
                        </div>
                    </div>
                   
                </div>
            </div>
            
            <div className='game-board'>
                {
                    Array(9).fill().map((item,key)=>{
                        return <div ref={el => itemsRef.current[key] = el} onClick={()=>{ setMove(key)}} id={key} className='cell' key={key} ><div></div></div>})
                }
            </div>
            <div className={`result-container ${(win!=null||finished) ? "show-result" : ""}`}>
                <div className='final-result'>
                    <div className='result'>
                       {
                           win == null ? drawstate : winstate
                       }
                    </div>
                    
                    <div>
                        <button onClick={()=>{setState(false);sessionStorage.clear()}} className='quit-btn'>Quit</button>
                        <button onClick={resetRound} className='cont-btn'>next round</button>
                    </div>
                </div>
               
                
            </div>
            <div className='score-container'>
                <div className='myScore'>
                    <p>x{P1.mark=="x"?"(you)":""}</p>
                    <p>{P1.mark=="x"?P1.score:P2.score}</p>
                </div>
                <div className='tie'>
                    <p>tie</p>
                    <p>{drawScore}</p>
                </div>
                <div className='opponentScore'>
                    <p>o{P1.mark=="o"?"(you)":""}</p>
                    <p>{P1.mark=="o"?P1.score:P2.score}</p>
                </div>
            </div>
        </div>
    );
}