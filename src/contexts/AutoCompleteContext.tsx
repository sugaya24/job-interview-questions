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
};

const AutoCompleteContext = createContext({} as AutoCompleteContextProps);

export const AutoCompleteContextProvider: FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AutoCompleteContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </AutoCompleteContext.Provider>
  );
};

export const useAutoCompleteContext = () => useContext(AutoCompleteContext);
