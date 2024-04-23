import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '../../components/ui/textarea';
import { GoFilter } from 'react-icons/go';
import { FaArrowRight } from 'react-icons/fa';

import { v4 as uuidv4 } from 'uuid';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';
import TrySearching from './TrySearching';
import { useNavigate } from 'react-router-dom';

interface Component {
  title: string;
  href: string;
  description: string;
}

const components: Component[] = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description:
      'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
];

const ListItem: React.FC<Component> = ({ title, href, description }) => {
  return (
    <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-purple hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
      <a href={href}>
        <div className="text-sm font-medium leading-none ">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground ">
          {description}
        </p>
      </a>
    </div>
  );
};

const Search: React.FC = () => {
  const [showList, setShowList] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const handleClickOutside = (event: MouseEvent) => {
    if (
      filterRef.current &&
      !filterRef.current.contains(event.target as Node)
    ) {
      setShowList(false);
    }
  };
  const [promptValue, setPromptValue] = useState('');

  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleList = () => {
    setShowList(!showList);
  };

  const handleChange = (event: any) => {
    setPromptValue(event.target.value);
  };

  const handleSearch = async (prompt?: string) => {
    const id = uuidv4();

    localStorage.setItem(id, prompt || promptValue);

    navigate('/search/' + id);
  };

  return (
    <>
      <div className="py-4 h-full w-full">
        <div className="h-full w-full bg-vcharBlack rounded-lg border-1 border-gray-100 flex items-center justify-center">
          <div className="-translate-y-1/5  w-full flex items-center justify-center flex-col">
            <div className="noto-sans text-4xl">Let's dive deeper</div>
            <div
              className="mt-10 border border-e border-gray-500/20 rounded py-2 px-4 w-3/6"
              style={{ backgroundColor: '#202222' }}
            >
              <Textarea
                style={{ background: 'transparent' }}
                placeholder="Search for anything about stocks, companies or markets..."
                className="text-md noto-sans resize-none"
                onChange={handleChange}
                rows={1}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleSearch();
                  }
                }}
                autoFocus={true}
              />

              <div className="w-full flex items-center justify-between">
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          ref={filterRef}
                          className="px-3 py-2 max-w-fit rounded-full flex items-center justify-between cursor-pointer text-white/60 roboto-regular hover:bg-white/5"
                          onClick={toggleList}
                        >
                          <GoFilter className="mr-1.5" /> Filter
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>set a filter for your sources</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {showList && (
                    <div className="absolute z-50 top-110 left-65 bg-vcharBlack w-[400px] md:w-[500px] lg:w-[600px] mt-2 rounded-lg border text-gray-400  grid grid-cols-3 gap-4">
                      {components.map((component, index) => (
                        <ListItem
                          key={index}
                          title={component.title}
                          href={component.href}
                          description={component.description}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div
                  className="px-3 py-2 max-w-fit rounded-full flex items-center justify-between cursor-pointer text-white/80 roboto-regular hover:bg-white/10"
                  onClick={() => {
                    handleSearch();
                  }}
                >
                  <FaArrowRight />
                </div>
              </div>
            </div>
            <TrySearching handleSearch={handleSearch} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
