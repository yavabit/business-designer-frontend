import { createContext, useState, type SetStateAction } from "react";

const DnDContext = createContext([
  null,
  (value: SetStateAction<null>) => {
    console.warn('DnDContext', value);
  },
]);

export const DnDProvider = ({ children }: React.PropsWithChildren) => {
  const [type, setType] = useState(null);

  return (
    <DnDContext.Provider value={[type, setType]}>
      {children}
    </DnDContext.Provider>
  );
};

export default DnDContext;
