import TEST_IDS from "../../common/testIds";
import useSuggestionViewModel from "./Suggestion.viewModel";

export default () => {
    const { onClick, loading, text, hasResponse } = useSuggestionViewModel();

    return (
        <>
            <button 
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-dark-gray font-semibold rounded-lg flex items-center gap-2 transition-colors text-lg" 
                onClick={onClick} 
                data-testid={TEST_IDS.SUGGEST_BUTTON} 
                disabled={loading}
            >
                {loading ? (
                    <svg
                        className="w-5 h-5 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                        />
                        <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                ) : (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                    </svg>
                )}
                Suggest a Move
            </button>
            <div data-testid={TEST_IDS.SUGGESTION_RESPONSE} className="mt-4 text-center">
                 { hasResponse ? (
                    <>
                        <p><strong>{text.recommended}</strong></p>
                        <p>{text.reasoning}</p>
                    </>
                ) : null}
            </div>
        </>
    )
}