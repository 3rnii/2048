export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const getSuggestion = async (boardValues: (number | null)[][]): Promise<{
    recommended: string;
    reasoning: string;
}> => {
    const response = await fetch(`${API_BASE_URL}/prompt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ boardValues }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch suggestion');
    }

    const data = await response.json();
    return data;
};
