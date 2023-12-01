import { FC, ReactNode, createContext, useContext, useState } from 'react';
import { IListPageState } from './type';

const context = createContext<IListPageState>({ isLoading: false, setLoading: () => {} });

export const useListPageContext = () => {
  const currentContext = useContext(context);

  return currentContext;
};

export const ListPageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setLoading] = useState(false);
  return <context.Provider value={{ isLoading, setLoading }}>{children}</context.Provider>;
};
