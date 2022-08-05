import React, {useState} from 'react'

import { createStage, checkCollision } from '../gameHelpers'

//components
import Display from './Display'
import Stage from './Stage'
import StartButton from './StartButton'

// Styled components
import { StyledTetrisWrapper,StyledTetris } from './styles/StyledTetris'

//custom hooks
import {usePlayer} from '../Hooks/usePlayer'
import {useStage} from '../Hooks/useStage'
import {useInterval} from '../Hooks/useInterval'
import {useGameStatus} from '../Hooks/useGameStatus'

const Tetris = () => {
 
  const [dropTime,setDropTime]= useState(null);
  const [gameOver,setGameOVer] = useState(false);
  
  const [player,updatePlayerPos,resetPlayer,playerRotate] = usePlayer();
  const [stage,setStage,rowsCleared]=useStage(player);
  const [score,setScore,rows,setRows,level,setLevel] = useGameStatus(rowsCleared);
    
 console.log('re-render')

 //move the tetromino horizontally
 const movePlayer=dir =>{
    if(!checkCollision(player,stage,{x:dir,y:0})){
    updatePlayerPos({x:dir,y:0});
    }
 }

 const startGame = () =>{
    //reset everything
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setGameOVer(false);
    setScore(0);
    setRows(0);
    setLevel(0)
}

//move the tetromino down and check if collision triggers game over
const drop = () =>{
    //increase level when player has cleared 10 rows
    if(rows > (level + 1) * 10){
        setLevel(prev => prev + 1);
        //also increase the speed
        setDropTime(1000 / (level +1) + 200)
    }
    if(!checkCollision(player,stage,{x:0,y:1})){

        updatePlayerPos({x:0,y:1, collided:false})
    }else{
        //Game Over
        if(player.pos.y < 1){
            console.log('GAME OVER!!')
            setGameOVer(true);
            setDropTime(null);
        }
        updatePlayerPos({x:0,y:0,collided:true});
    }    
 }

//when the key its released it sets the interval on againg 
const KeyUp = ({keyCode}) =>{
    if(!gameOver){
        if(keyCode === 40){
            console.log('interval on')
            setDropTime(1000 / (level +1) + 200);
        }
    }
}


//it stops the interval drop when the user presses the key down
 const dropPlayer = () =>{
    console.log('interval off')
    setDropTime(null);
    drop();
 }

 const move = ({keyCode}) =>{
    if(!gameOver){
        if(keyCode === 37){
            movePlayer(-1);
        }else if(keyCode === 39){
            movePlayer(1);
        }else if(keyCode === 40){
            dropPlayer();
        }else if(keyCode === 38){
            playerRotate(stage,1);
        }
    }
 }

 useInterval(()=>{
    drop();
 },dropTime)


    return (
    //this is the main container    
    <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e=> move(e)} onKeyUp={KeyUp}>
        <StyledTetris>
            <Stage stage={stage}/>
            <aside>
                {gameOver ? (
                    <Display gameOver={gameOver} text='Game Over' />
                ) : (

                    <div>
                        <Display text={`Score: ${score}`}/>
                        <Display text={`Rows: ${rows}`}/>
                        <Display text={`Level: ${level}`}/>
                    </div>
                    )}
                <StartButton callback={startGame} />
            </aside>
        </StyledTetris>
    </StyledTetrisWrapper>
  )
}

export default Tetris