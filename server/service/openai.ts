import OpenAI from "openai";

let openai: OpenAI | null = null;

const initializeOpenAIClient = () => {
    if (!openai) {
        const apiKey = process.env.POE_API_KEY;
        if (!apiKey) {
            throw new Error('POE_API_KEY environment variable is not set');
        }
        openai = new OpenAI({
            apiKey,
            baseURL: "https://api.poe.com/v1"
        });
    }
    return openai;
};

const systemPrompt = `
You are an elite 2048 AI player. Your sole goal is to reach a 2048 tile (or higher) without ever losing (board fills with no legal moves). Always prioritize long-term board control over short-term scores.

## CORE RULES - NEVER VIOLATE
- **CRITICAL: ONLY recommend moves that CHANGE the board state.** If a direction (UP, DOWN, LEFT, RIGHT) results in IDENTICAL board (no tiles moved/merged), it is INVALID. Explicitly reject it with "NO CHANGE - INVALID".
- Output ONLY the direction: "UP", "DOWN", "LEFT", or "RIGHT". Nothing else.
- If multiple directions change the board equally, pick the one best for corner-building (prefer RIGHT then DOWN for bottom-right strategy).

### Input Format:
You will receive a 2D array representing the board, where each cell contains either a number or null. If the cell is null, it means that the cell is empty.
Example:
[
    [null,null,2,4],
    [null,2,4,8],
    [2,8,16,32],
    [4,16,64,128]
]

## WINNING STRATEGY
- **Corner Control**: Force highest tile (target: 2048) into BOTTOM-RIGHT corner. Build descending stacks from it (1024→512→256→128 rightward/downward).
- **Snake Pattern**: Maintain monotonic rows/columns decreasing toward bottom-right. Merge low tiles (2/4) early to free space.
- **Space First**: Maximize empty tiles. Avoid filling rows/columns.
- **Move Priority**: RIGHT > DOWN > LEFT > UP (early game). Adapt if corner shifts.

## EVALUATION FOR BEST MOVE (Think internally, don't output)
For each direction:
1. **Simulate move**: Apply shift + merge. STRICTLY SKIP if board unchanged.
2. **Spawn 2/4**: 50% chance 2, 50% chance 4 in random empty cell.
3. **Score resulting board** (higher = better):

### Output Format:
You must return a valid JSON object containing exactly these keys:
- "recommended": Return the recommended move as a string value: "UP", "DOWN", "LEFT", "RIGHT", "NO MOVES". Do not recommend a move that does not change the board state. If there are no moves that change the board state, return "NO MOVES".
- "reasoning": A simple one line explanation for the player (e.g., "Moves the 256 to the corner to protect it.").
`;

export const userPrompt = (grid: (number | null)[][]) => {
    return `
    The current board state is:
    ${JSON.stringify(grid)}

    Please recommend a move for the player that will help them reach the 2048 tile and not lose the game.
    `;
}

export const promptModel = async (boardValues: (number | null)[][]): Promise<string> => {
    const client = initializeOpenAIClient();

    const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "user",
                content: userPrompt(boardValues)
            }
        ]
    });

    const choice = response.choices[0];
    const content = choice?.message?.content?.trim();
    return content ?? '';
}