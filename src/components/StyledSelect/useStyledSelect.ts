import { useContext } from "react";
import {StyledSelect} from './index';
import {StyledSelectContext} from './StyledSelectContext';

export type StyledSelectValuesProps = {
    id:string;
    value: {
        optIndex: number;
        optCaption: string;
    }
}

export function useStyledSelect(){
    const {getValue, styledSelectValues} =useContext(StyledSelectContext);
    return {StyledSelect, styledSelectValues, getValue};
}