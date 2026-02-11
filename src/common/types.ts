export type Movement = 'up' | 'down' | 'left' | 'right';

export type Coordinate = [number, number];

export type Tile = {
    id?: string,
    position: Coordinate;
    value?: number;
}

export type GameState = 'new' | 'playing' | 'won' | 'lost';

export type AIResponseMovement = "UP" | "DOWN" | "LEFT" | "RIGHT" | "NO MOVES";

export type AIResponse = {
    recommended?: AIResponseMovement;
    reasoning?: string;
}