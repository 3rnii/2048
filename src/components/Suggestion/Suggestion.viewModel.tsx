import { useCallback, useContext, useEffect, useState } from "react";
import { GameContext } from "../../contexts/game/context";
import { AIResponse, AIResponseMovement } from "../../common/types";
import { getSuggestion } from "../../services/api";

const MOVE_SUGGESTION: Record<AIResponseMovement, string> = {
    "UP": "⬆️ Move Up!",
    "DOWN": "⬇️ Move Down!",
    "LEFT": "⬅️ Move Left!",
    "RIGHT": "➡️ Move Right!",
    "NO MOVES": "☹️ No Moves Available"
};

export default () => {
    const { getCurrentBoardValues, hasMoved, setLock } = useContext(GameContext);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<AIResponse>({});

    const onClick = useCallback(async () => {
        setLoading(true);
        setLock(true);
        try {
            const boardValues = getCurrentBoardValues();
            const result = await getSuggestion(boardValues);
            
            if (result) {
                setResponse(result as AIResponse);
            }
        } catch (error) {
            console.error('Failed to get suggestion:', error);
        } finally {
            setLoading(false);
            setLock(false)
        }
    }, [getCurrentBoardValues]);

    useEffect(() => {
        setResponse({});
    }, [hasMoved])

    return {
        onClick,
        loading,
        hasResponse: !!response.recommended && !!response.reasoning,
        text: {
            recommended: MOVE_SUGGESTION[response.recommended as AIResponseMovement] || '',
            reasoning: response.reasoning || ''
        }
    }
}