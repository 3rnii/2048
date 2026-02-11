import TEST_IDS from '../../common/testIds';
import useViewModel from './Board.viewModel';

function Board() {
    const { renderTiles } = useViewModel();

    return (
        <div
            data-testid={TEST_IDS.BOARD}
            className="w-[min(90vw,70vmin)] max-w-full mx-auto p-15 sm:p-5 flex flex-col items-center justify-center min-h-0"
        >
            <div
                className="grid grid-cols-4 gap-1 sm:gap-2 p-1 sm:p-2 bg-gray-300 rounded-lg w-full aspect-square min-h-0"
            >
                { renderTiles() }
            </div>
        </div>
    );
};

export default Board;