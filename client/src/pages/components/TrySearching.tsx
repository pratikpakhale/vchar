import { CgChevronRight } from 'react-icons/cg';

function Button({
  handleSearch,
  text,
}: {
  handleSearch: (query: string) => void;
  text: string;
}) {
  return (
    <button
      type="button"
      className="border border-borderMain/50  text-textOff  md:hover:text-textMain   focus:outline-none outline-none outline-transparent transition duration-300 ease-in-out  select-none items-center relative group/button justify-center text-center rounded-full cursor-point active:scale-95 origin-center whitespace-nowrap inline-flex text-xs font-medium px-sm px-3 h-6"
      onClick={() => handleSearch(text)}
    >
      <div className="flex items-center leading-none justify-center gap-xs">
        <div className="text-align-center relative">{text}</div>
      </div>
    </button>
  );
}

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
        <Button
          handleSearch={handleSearch}
          text="What impacts will election have on market this year?"
        />
        <Button
          handleSearch={handleSearch}
          text="What are elon musk's contributions to the world?"
        />
        <Button
          handleSearch={handleSearch}
          text="Why did AsterDM price drop?"
        />
      </div>
    </>
  );
}
