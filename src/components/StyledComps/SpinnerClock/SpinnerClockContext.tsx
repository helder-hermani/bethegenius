import {createContext, useState, ReactNode} from 'react';

type SpinnerClockProviderProps = {
    children: ReactNode;
}

type SpinnerClockContextProps = {
    spinnerClockOn: Boolean;
    setSpinnerClockOn: (arg0:boolean) => void;
}

export const SpinnerClockContext = createContext({} as SpinnerClockContextProps);

export function SpinnerClockProvider({children}:SpinnerClockProviderProps){
    const [spinnerClockOn, setSpinnerClockOn] = useState<Boolean>(false);

    return(
        <SpinnerClockContext.Provider value={{spinnerClockOn, setSpinnerClockOn}}>
            {children}
        </SpinnerClockContext.Provider>
    )
}