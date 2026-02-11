import { useCallback, useContext, useEffect } from 'react';
import { GameContext } from '../../contexts/game/context';
import Tile from '../Tile/Tile';

export default function BoardViewModel() {
    const { startGame, getTileAtPosition, move, status, resetGame, isLocked } = useContext(GameContext);

     const handleKeyDown = useCallback((e: KeyboardEvent) => {  
             if (isLocked) {
                 e.preventDefault();
                 return;
             }
             
             if (status === 'won' || status === 'lost') {
                 switch (e.code) {
                     case "Space":
                     case "Enter":
                         resetGame();
                         break;
                     default:
                         break;
                 }
                 return;
             }
     
             switch (e.code) {
                 case "ArrowUp":
                 case "KeyW":
                     e.preventDefault();
                     move('up');
                     break;
                 case "ArrowDown":
                 case "KeyS":
                     e.preventDefault();
                     move('down');
                     break;
                 case "ArrowLeft":
                 case "KeyA":
                     e.preventDefault();
                     move('left');
                     break;
                 case "ArrowRight":
                 case "KeyD":
                     e.preventDefault();
                     move('right');
                     break;
                 default:
                     break;
             }
         }, [move]);

             const renderTiles = () => {
                 return Array.from({ length: 16 }, (_, index) => {
                     const row = Math.floor(index / 4);
                     const col = index % 4;
                     const tile = getTileAtPosition([col, row]);
                     return (
                         <div
                             key={tile?.id ?? index}
                             className="aspect-square bg-gray-200 rounded min-h-0 relative overflow-hidden"
                         >
                             {tile ? <Tile key={tile.id} {...tile} /> : null}
                         </div>
                     );
                 })
             }

                 useEffect(() => {
                     startGame();
                 }, []);
             
                 useEffect(() => {
                     window.addEventListener('keydown', handleKeyDown);
             
                     return () => window.removeEventListener('keydown', handleKeyDown);
                 }, [handleKeyDown]);

    return {
        renderTiles
    };
}