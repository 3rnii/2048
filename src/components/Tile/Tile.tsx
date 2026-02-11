import TEST_IDS from '../../common/testIds';
import useTileViewModel from './Tile.viewModel';

function Tile({ value }: { value?: number }) {
    const { tileStyle } = useTileViewModel({ value });


    return (
        <div
            data-testid={TEST_IDS.TILE}
            className={`
                w-full h-full min-w-0 min-h-0 flex items-center justify-center
                rounded font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl
                transition-all duration-150 shadow-sm
                ${tileStyle}
            `}
        >
            {value}
        </div>
    );
}
export default Tile;