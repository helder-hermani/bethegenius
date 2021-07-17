import {SpinnerClockContext} from './SpinnerClockContext';
import {SpinnerClock} from './index';
import {useContext, ReactNode} from 'react';


export function useSpinnerClock(){
    const {spinnerClockOn, setSpinnerClockOn} = useContext(SpinnerClockContext);
    
    return {SpinnerClock, spinnerClockOn, setSpinnerClockOn}
}