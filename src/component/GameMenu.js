import { useState,useEffect } from "react";
export default function GameMenu({setP1,setP2,setState}){
    const [Xselected,XisSelected] = useState(true);
    const [is1Ptype,HumanType] = useState(null);
      const createPlayers = ()=>{
        setP1(new player(Xselected?"x":"o",true));
        if(is1Ptype){
            setP2(new player(Xselected?"o":"x",true));
        }
        else {
            setP2(new player(Xselected?"o":"x",false));
        };
        setState(true);
      }
      useEffect(()=>{
          if(is1Ptype!=null){
              createPlayers();
          }
      },[is1Ptype]);
      useEffect(()=>{
        var tempstate = sessionStorage.getItem("state");
        if(JSON.parse(sessionStorage.getItem("P1"))!=null){
            setP1(JSON.parse(sessionStorage.getItem("P1")));
            if(!JSON.parse(sessionStorage.getItem("P2")).isHuman){
                setP2(new player(JSON.parse(sessionStorage.getItem("P2")).mark,false));
            }
            else setP2(JSON.parse(sessionStorage.getItem("P2")));
            setState(JSON.parse(tempstate));
        }
       
        
        
      },[]);
    return(
        <div className="menu-container">
            <div className="logo">
                <div className="x-mark"/>
                <div className="o-mark"/>
            </div>
            <div className="picker-container">
                <p>pick player's mark</p>
                <div className="picker ">
                    <div onClick={()=>XisSelected(true)} className={`pick-box ${Xselected?"selected":""} `}>
                        <div className="x-mark"/>
                    </div>
                    <div onClick={()=>XisSelected(false)} className={`pick-box ${Xselected?"":"selected"} `}>
                        <div className="o-mark"/>
                    </div>
                </div>
                <p>REMEMBER : X GOES FIRST</p>
            </div>
            <div className="button-container">
                <button onClick={()=>HumanType(false)}>new game (vs CPU)</button>
                <button onClick={()=>HumanType(true)}>new game (vs player)</button>
            </div>
        </div>
    );
}
function player (mark,isHuman){
    this.mark = mark;
    this.score = 0;
    this.opponent = "";
    this.isHuman = isHuman;
    this.selectedIndex = -1000;
    if(!isHuman){
        if(JSON.parse(sessionStorage.getItem("P1"))!=null){
            this.score = JSON.parse(sessionStorage.getItem("P2")).score;
        }
        this.evaluate = (b)=>{
                for (let row = 0; row < 3; row++)
            {
                if (b[row][0] == b[row][1] &&
                    b[row][1] == b[row][2])
                {
                    if (b[row][0] == this.mark)
                        return +10;
                    else if (b[row][0] == this.opponent)
                        return -10;
                }
            }
        
            // Checking for Columns for X or O victory.
            for (let col = 0; col < 3; col++)
            {
                if (b[0][col] == b[1][col] &&
                    b[1][col] == b[2][col])
                {
                    if (b[0][col] == this.mark)
                        return +10;
        
                    else if (b[0][col] == this.opponent)
                        return -10;
                }
            }
        
            // Checking for Diagonals for X or O victory.
            if (b[0][0] == b[1][1] && b[1][1] == b[2][2])
            {
                if (b[0][0] == this.mark)
                    return +10;
                else if (b[0][0] == this.opponent)
                    return -10;
            }
        
            if (b[0][2] == b[1][1] && b[1][1] == b[2][0])
            {
                if (b[0][2] == this.mark)
                    return +10;
                else if (b[0][2] == this.opponent)
                    return -10;
            }
        
            // Else if none of them have won then return 0
            return 0;
        }
        this.minimax = (board,depth,isMax)=>{
            let score = this.evaluate(board);
            
            // If Maximizer has won the game
            // return his/her evaluated score
            if (score == 10)
                return score //-depth;
          
            // If Minimizer has won the game
            // return his/her evaluated score
            if (score == -10)
                return score //+depth;
          
            // If there are no more moves and
            // no winner then it is a tie
            if (this.isMovesLeft(board) == false)
                return 0;
          
            // If this maximizer's move
            if (isMax)
            {
                let best = -1000;
          
                // Traverse all cells
                for(let i = 0; i < 3; i++)
                {
                    for(let j = 0; j < 3; j++)
                    {
                         
                        // Check if cell is empty
                        if (board[i][j]==undefined)
                        {
                             
                            // Make the move
                            board[i][j] = this.mark;
          
                            // Call minimax recursively
                            // and choose the maximum value
                            best = Math.max(best, this.minimax(board,
                                            depth + 1, !isMax));
          
                            // Undo the move
                            board[i][j] = undefined;
                        }
                    }
                }
                return best;
            }
          
            // If this minimizer's move
            else
            {
                let best = 1000;
          
                // Traverse all cells
                for(let i = 0; i < 3; i++)
                {
                    for(let j = 0; j < 3; j++)
                    {
                         
                        // Check if cell is empty
                        if (board[i][j] == undefined)
                        {
                             
                            // Make the move
                            board[i][j] = this.opponent;
          
                            // Call minimax recursively and
                            // choose the minimum value
                            best = Math.min(best, this.minimax(board,
                                            depth + 1, !isMax));
          
                            // Undo the move
                            board[i][j] = undefined;
                        }
                    }
                }
                return best;
            }
        }
        this.isMovesLeft=(board)=>{
            for(let i = 0; i < 3; i++)
                for(let j = 0; j < 3; j++)
                    if (board[i][j] == undefined)
                        return true;
                        
            return false;
        }
        this.findBestMove = (board)=>{
            let bestVal = -1000;
            let bestMove;
            // Traverse all cells, evaluate
            // minimax function for all empty
            // cells. And return the cell
            // with optimal value.
            for(let i = 0; i < 3; i++)
            {
                for(let j = 0; j < 3; j++)
                {
                    
                    // Check if cell is empty
                    if (board[i][j] == undefined)
                    {
                        
                        // Make the move
                        board[i][j] = this.mark;
        
                        // compute evaluation function
                        // for this move.
                        let moveVal = this.minimax(board, 0, false);
        
                        // Undo the move
                        board[i][j] = undefined;
        
                        // If the value of the current move
                        // is more than the best value, then
                        // update best
                        if (moveVal > bestVal)
                        {
                            bestVal = moveVal;
                            if(i==0){
                                bestMove = j;
                            }
                            else if(i==1){
                                bestMove = j+3;
                            }
                            else if(i==2){
                                bestMove = j+6;
                            }
                        }
                    }
                }
            }
            return bestMove;
            }
            }
  }