import {
  createContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

interface IDnDContext {
  type: string;
  setType: Dispatch<SetStateAction<string>>;
}

const DnDContext = createContext<IDnDContext>({
  type: "",
  setType: (value: SetStateAction<string>) => {
    console.warn("DnDContext", value);
  },
});

export const DnDProvider = ({ children }: React.PropsWithChildren) => {
  const [type, setType] = useState("");

  return (
    <DnDContext.Provider value={{ type, setType }}>
      {children}
    </DnDContext.Provider>
  );
};

export default DnDContext;
