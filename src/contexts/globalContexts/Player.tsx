import { useState } from 'react';
import { ReactNode, createContext } from 'react';
import {PlayerProps} from '../GlobalTypes';

type PlayerProviderProps = {
    children: ReactNode;
}

type PlayerContextProps = {
    globalPlayerData: PlayerProps|undefined;
    setGlobalPlayerData:(arg0:PlayerProps)=>void;
}

export const GlobalPlayerContext = createContext({} as PlayerContextProps);

export function PlayersProvider({children}:PlayerProviderProps){
    const [globalPlayerData, setGlobalPlayerData] = useState<PlayerProps|undefined>();

    return(
        <GlobalPlayerContext.Provider value={{globalPlayerData, setGlobalPlayerData}}>
            {children}
        </GlobalPlayerContext.Provider>
    )
}