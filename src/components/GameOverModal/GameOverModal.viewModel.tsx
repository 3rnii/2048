import { useContext, KeyboardEvent } from "react";
import { GameContext } from "../../contexts/game/context";

export default () => {
    const { status, resetGame } = useContext(GameContext);
    const display = status === 'won' || status === 'lost';

    const isWon = status === 'won';
    const title = isWon ? '🎉 You Won! 🎉' : '😢 Game Over 😢';
    const message = isWon 
        ? 'Congratulations! You reached 2048!' 
        : 'No more moves available. Better luck next time!';
    const titleColor = isWon ? 'text-green-600' : 'text-red-600';

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return {
        handleKeyDown,
        resetGame,
        display,
        text: {
            title,
            message,

        },
        titleColor
    }
}