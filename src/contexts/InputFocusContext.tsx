import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

type TInputFocusContext = {
  isFocus: boolean;
  setIsFocus: Dispatch<SetStateAction<boolean>>;
};

const InputFocusContext = createContext({} as TInputFocusContext);

export const InputFocusContextProvider: React.FC = ({ children }) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <InputFocusContext.Provider value={{ isFocus, setIsFocus }}>
      {children}
    </InputFocusContext.Provider>
  );
};

export const useInputFocusContext = () => useContext(InputFocusContext);
