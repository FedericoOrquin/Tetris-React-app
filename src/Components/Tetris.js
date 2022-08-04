import React, {useState} from 'react'

import { createStage } from '../gameHelpers'

//components
import Display from './Display'
import Stage from './Stage'
import StartButton from './StartButton'

// Styled components
import { StyledTetrisWrapper,StyledTetris } from './styles/StyledTetris'

//custom hooks
import {usePlayer} from '../Hooks/usePlayer'
import {useStage} from '../Hooks/useStage'

const Tetris = () => {
 
  const [dropTime,setDropTime]= useState(null);
  const [gameOver,setGameOVer] = useState(false);
  
  const [player,updatePlayerPos,resetPlayer] = usePlayer();
  const [stage,setStage]=useStage(player);

 console.log('re-render')

 const movePlayer=dir =>{
    updatePlayerPos({x:dir,y:0});
 }

 const startGame = () =>{
    //reset everithing
    setStage(createStage());
    resetPlayer();
}

const drop = () =>{
    updatePlayerPos({x:0,y:1, collided:false})

 }
 const dropPlayer = () =>{
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
        }
    }
 }

    return (
    //this is the main container    
    <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e=> move(e)}>
        <StyledTetris>
            <Stage stage={stage}/>
            <aside>
                {gameOver ? (
                    <Display gameOver={gameOver} text='Game Over' />
                ) : (

                    <div>
                        <Display text="Score"/>
                        <Display text="Rows"/>
                        <Display text="Level"/>
                    </div>
                    )}
                <StartButton onClick={startGame} />
            </aside>
        </StyledTetris>
    </StyledTetrisWrapper>
  )
}

export default Tetris