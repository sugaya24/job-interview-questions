import {
  Dispatch,
  FC,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

type AutoCompleteContextProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  cursorIdx: number;
  setCursorIdx: Dispatch<SetStateAction<number>>;
};

const AutoCompleteContext = createContext({} as AutoCompleteContextProps);

export const AutoCompleteContextProvider: FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cursorIdx, setCursorIdx] = useState<number>(-1);

  return (
    <AutoCompleteContext.Provider
      value={{ isOpen, setIsOpen, cursorIdx, setCursorIdx }}
    >
      {children}
    </AutoCompleteContext.Provider>
  );
};

export const useAutoCompleteContext = () => useContext(AutoCompleteContext);
