import { useState } from 'react';
import {ReactNode, createContext} from 'react';

type StyledSelectContextProviderProps = {
    children: ReactNode;
}

type ValidListArrayType = {
    Index: number;
    Value: string;
    IconUrl: string; 
}

type StyledSelectValuesProps = {
    id:string;
    value: {
        optIndex: number;
        optCaption: string;
    }
}
// type StyledSelectValuesProps = {
//     id:string;
//     value:string;
// }

type StyledSelectContextProps = {
    buildValidList: (arg0:Array<Object>)=>Array<ValidListArrayType>;
    storeStyledSelectOption: (arg0:StyledSelectValuesProps) => void;
    getValue: (arg0:string) => StyledSelectValuesProps|undefined;
    // getValue: (arg0:string) => string;
    styledSelectValues:Array<StyledSelectValuesProps>|undefined;
}

export const StyledSelectContext = createContext({} as StyledSelectContextProps);

export function StyledSelectContextProvider({children}:StyledSelectContextProviderProps){

    const [styledSelectValues, setStyledSelectValues] = useState<Array<StyledSelectValuesProps>|undefined>([{id:"", value:{optIndex: -1, optCaption:""}}])

    function objError(){
        return {
            Index:999,
            Value:"Erro de Valores",
            IconUrl:""
        }
    }

    function validIconUrl(propValue:string){
        if (typeof propValue != 'string' || propValue.indexOf("/") < 0){
            return '';
        }else{
            return propValue;
        }
    }


    function buildValidList(recievedArrayOfObject:Array<Object>) {       
        // let tempReturn:ValidListArrayType;
        let validObjReturn:Array<ValidListArrayType>=[];
        
        // tempReturn = objError();

        recievedArrayOfObject.forEach((el)=>{
            const propsRecievedObj = Object.entries(el);
            const recievedQtdProps:number = propsRecievedObj.length;
            let validObj:ValidListArrayType;
            
            //Validação 1: Os objetos passados precisam ter pelo menos 2 propriedades (index e valor)
            if (recievedQtdProps<2) return [objError()];

            const prop1Value:any = propsRecievedObj[0][1];    //Valor da primeira propriedade
            const prop2Value:any = propsRecievedObj[1][1];    //Valor da segunda propriedade
            let prop3Value:string = "/assets/styledSelect/defaulticon.gif";                         //Atribui por padrão a terceira propriedade
            
            //Validação 2: A primeira propriedade precisar ser número e a segunda string
            if (typeof prop1Value != 'number' || typeof prop2Value != 'string') return [objError()];

            //Validação 3: Se o o objeto recebido tiver 2 propriedades OU
            //             se a terceira propriedade não for string OU
            //             se a terceira propriedade não tiver formato de URL, atribui valor "" (valor de IconUrl, que é opcional)
            
            if (recievedQtdProps>2){
                prop3Value=validIconUrl(propsRecievedObj[2][1]);
            }


            //Constrói o objeto formatado
            validObj = {
                Index: prop1Value,
                Value: prop2Value,
                IconUrl: prop3Value
            }

            validObjReturn.push(validObj);

        });

        return validObjReturn;
    }

    function storeStyledSelectOption(selectedOption:StyledSelectValuesProps){
        let current:Array<StyledSelectValuesProps>|undefined = styledSelectValues;

        let currentSelectValue:Array<StyledSelectValuesProps>|undefined = current?.filter(el => el.id === selectedOption.id)
 
        if (currentSelectValue?.length===0) {
            current?.push(selectedOption);  
        } else {
            if (typeof currentSelectValue != undefined){
                let currentValue = currentSelectValue??[0];
                currentValue[0] = {
                    id:selectedOption.id,
                    value: {
                        optIndex: selectedOption.value.optIndex,
                        optCaption: selectedOption.value.optCaption
                    }
                }

                const newValue:Array<StyledSelectValuesProps>|undefined = styledSelectValues?.filter(el => el.id != selectedOption.id)
                newValue?.push(currentValue[0]);
                current=newValue;
            }
        }


        setStyledSelectValues(current);
    }

    function getValue(selectId:string){
        const currentSelectValue:Array<StyledSelectValuesProps>|undefined = styledSelectValues?.filter(el => el.id === selectId);

        const valor = currentSelectValue?.[0];

        // let valor:string = "";
        // currentSelectValue?.map(el=>{
        //     valor=el.value;
        // })
        
        return valor;
    }

    return (
        <StyledSelectContext.Provider value={{buildValidList, storeStyledSelectOption, getValue, styledSelectValues}}>
            {children}
        </StyledSelectContext.Provider>
    )
}