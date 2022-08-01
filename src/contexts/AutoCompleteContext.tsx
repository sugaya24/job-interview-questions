import { ITag } from '@/models/Tag';
import {
  Dispatch,
  FC,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type AutoCompleteContextProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  cursorIdx: number;
  setCursorIdx: Dispatch<SetStateAction<number>>;
  tagsList: ITag[];
};

const AutoCompleteContext = createContext({} as AutoCompleteContextProps);

export const AutoCompleteContextProvider: FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cursorIdx, setCursorIdx] = useState<number>(-1);
  const [tagsList, setTagsList] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      await fetch(`/api/tags`)
        .then(async (res) => res.json())
        .then((data) => setTagsList(data));
    };
    fetchTags();
    return () => {
      fetchTags();
    };
  }, []);

  return (
    <AutoCompleteContext.Provider
      value={{ isOpen, setIsOpen, cursorIdx, setCursorIdx, tagsList }}
    >
      {children}
    </AutoCompleteContext.Provider>
  );
};

export const useAutoCompleteContext = () => useContext(AutoCompleteContext);
