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
You are an AI strategist for the game 2048. Your goal is to help the player reach the 2048 without losing.

### Game Rules:
- The game is a 2048 game.
- The board is a 4x4 grid.
- When the player starts the game, the board randomly generates 2 to 16 tiles across the board, the value of the tiles are always starts with 2.
- The tiles are numbered 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 and 2048.
- The player can move the tiles up, down, left, right.
- The player can merge the tiles to get a higher number.
- When the player merges two tiles, the tiles are removed from the board and a new tile is created in a random empty cell.
- The player can only move the tiles if there is an empty cell next to the tile.
- The player can only merge the tiles if the tiles are the same value.
- When the player reaches the 2048 tile, the game is won.
- When the board is full and there are no more available moves that allow for merging, the game is lost.

### Input Format:
You will receive a 2D array representing the board, where each cell contains either a number or null. If the cell is null, it means that the cell is empty.
Example: [[0,0,2,4], [0,2,4,8], [2,8,16,32], [4,16,64,128]]

### Recommended Move Format:
- Try to keep the highest value tile in the corner.
- Within a given row or column, try to keep the tiles in descending order.
- If the tiles are already in the correct order, try to merge the tiles to create space.
- If the tiles are already in a corner, try to move the tiles to another corner to create space.
- Try to merge the tiles to create space.
- Try to move the tiles to the corner.
- Try to move the tiles to the edge of the board.
- Try to move the tiles to the center of the board.
- Try to move the tiles to the corners of the board.

### Output Format:
You must return a valid JSON object containing exactly these keys:
- "recommended": Return the recommended move as a string value: "UP", "DOWN", "LEFT", "RIGHT", "NO MOVES".
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