import { useState } from 'react';
import { ReactNode, createContext } from 'react';
import {ChatactersProps} from '../GlobalTypes';

type CharactersProviderProps = {
    children: ReactNode;
}

type CharactersContextProps = {
    globalCharactersFullList: Array<ChatactersProps>;
    setGlobalCharactersFullList:(arg0:Array<ChatactersProps>)=>void;
}

export const GlobalCharactersContext = createContext({} as CharactersContextProps);

export function CharactersProvider({children}:CharactersProviderProps){
    const [globalCharactersFullList, setGlobalCharactersFullList] = useState<Array<ChatactersProps>>([]);

    return(
        <GlobalCharactersContext.Provider value={{globalCharactersFullList, setGlobalCharactersFullList}}>
            {children}
        </GlobalCharactersContext.Provider>
    )
}