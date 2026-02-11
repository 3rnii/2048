export const valueBgClass: Record<number, string> = {
    2: 'bg-amber-100 text-amber-900',
    4: 'bg-amber-200 text-amber-900',
    8: 'bg-orange-300 text-white',
    16: 'bg-orange-400 text-white',
    32: 'bg-orange-500 text-white',
    64: 'bg-red-400 text-white',
    128: 'bg-yellow-300 text-yellow-900',
    256: 'bg-yellow-400 text-yellow-900',
    512: 'bg-yellow-500 text-yellow-900',
    1024: 'bg-yellow-600 text-white',
    2048: 'bg-yellow-500 text-white',
};

export default ({ value }: { value?: number }) => {
    const bgClass = value !== undefined ? valueBgClass[value] : 'bg-gray-300 text-gray-700';

    return {
        tileStyle: bgClass
    }
};
