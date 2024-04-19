import { CgChevronRight } from 'react-icons/cg';

export default function TrySearching({
  handleSearch,
}: {
  handleSearch: (query: string) => void;
}) {
  return (
    <>
      <div className="p-5">
        <div className="inline light  text-xs font-medium text-textOff dark:text-textOffDark selection:bg-super/50 selection:text-textMain dark:selection:bg-superDuper/10 dark:selection:text-superDark">
          <div className="flex flex-row space-x-1">
            <CgChevronRight className="w-4 h-4 mt-0.4" />
            <div className="noto-sans"> Try searching for..</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-2">
        <button
          type="button"
          className="border border-borderMain/50 dark:border-borderMainDark/50 text-textOff dark:text-textOffDark md:hover:text-textMain md:dark:hover:text-textMainDark  focus:outline-none outline-none outline-transparent transition duration-300 ease-in-out  select-none items-center relative group/button justify-center text-center rounded-full cursor-point active:scale-95 origin-center whitespace-nowrap inline-flex text-xs font-medium px-sm  h-6"
          onClick={() => handleSearch('Why is IRCTC stock dropping?')}
        >
          <div className="flex items-center leading-none justify-center gap-xs">
            <div className="text-align-center relative">
              🪕 Why is IRCTC stock dropping?
            </div>
          </div>
        </button>
        <button
          type="button"
          className="border border-borderMain/50 dark:border-borderMainDark/50 text-textOff dark:text-textOffDark md:hover:text-textMain md:dark:hover:text-textMainDark  focus:outline-none outline-none outline-transparent transition duration-300 ease-in-out  select-none items-center relative group/button justify-center text-center rounded-full cursor-point active:scale-95 origin-center whitespace-nowrap inline-flex text-xs font-medium px-sm  h-6"
          onClick={() =>
            handleSearch('Give me some technical analysis of Tata Motors')
          }
        >
          <div className="flex items-center leading-none justify-center gap-xs">
            <div className="text-align-center relative">
              👁️ Give me some technical analysis of Tata Motors
            </div>
          </div>
        </button>
        <button
          type="button"
          className="border border-borderMain/50 dark:border-borderMainDark/50 text-textOff dark:text-textOffDark md:hover:text-textMain md:dark:hover:text-textMainDark  focus:outline-none outline-none outline-transparent transition duration-300 ease-in-out  select-none  relative group/button justify-center text-center items-center rounded-full cursor-point active:scale-95 origin-center whitespace-nowrap inline-flex text-xs px-sm font-medium h-6"
          onClick={() =>
            handleSearch('What impacts will election have on market this year?')
          }
        >
          <div className="flex items-center leading-none justify-center gap-xs">
            <div className="text-align-center relative">
              🌵 What impacts will election have on market this year?
            </div>
          </div>
        </button>
      </div>
    </>
  );
}
