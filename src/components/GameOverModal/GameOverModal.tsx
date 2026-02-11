import useGameOverModalViewModel from "./GameOverModal.viewModel";

function GameOverModal() {
   const { handleKeyDown, display, text, titleColor, resetGame }  = useGameOverModalViewModel();

    return display ? (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onKeyDown={handleKeyDown}
        >
            <div className="bg-white rounded-lg shadow-2xl p-8 text-center max-w-md w-full mx-4">
                <h2 className={`text-4xl font-bold mb-4 ${titleColor}`}>
                    {text.title}
                </h2>
                <p className="text-gray-700 text-lg mb-8">
                    {text.message}
                </p>
                <button
                    onClick={resetGame}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-dark-gray font-semibold rounded-lg transition-colors text-lg w-full"
                >
                    Start New Game
                </button>
            </div>
        </div>
    ) : null;
}

export default GameOverModal;