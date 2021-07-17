import {useContext, useState} from 'react';
import {StyledSelectContext} from './StyledSelectContext';

import styles from './StyledSelect.module.css';
import { useEffect } from 'react';

type StyledAttributesType={
    height?: string;
    maxHeight?: string;
    width?:string;
    maxWidth?:string;
    backgroundColor?: string;
    fontFamily?: string;
}

type ValidListArrayType = {
    Index: number;
    Value: string;
    IconUrl: string; 
}

type StyledSelectProps = {
    styledSelId: string;
    srcList: Array<Object>;
    defaultLabel?:string;
    stylesAttributes?: StyledAttributesType;
    defaultData ?: {
        index: number;
        value: {
            optIndex: number;
            optCaption: string;
        }
        iconUrl ?: string;
    }|undefined;
}

type StyledPickedOptionType = {
    id:string;
    value: {
        optIndex: number;
        optCaption: string;
    }
}

export function StyledSelect({styledSelId,
                            srcList,
                            defaultLabel="",
                            stylesAttributes={
                                width:"100%",
                                height:"35px",
                                maxWidth:"300px",
                                backgroundColor: "#FFFFFF",
                                fontFamily:"sans-serif"
                                },
                            defaultData
                            }:StyledSelectProps){

    const [visibleOptions, setVisibleOptions] = useState<boolean>(false);
    const [currentOption, setCurrentOption] = useState<string>("");
    const [selectIconDefaultUrl, setSelectIconDefaultUrl] = useState<string|undefined>('/assets/styledSelect/arrowdown.gif');

    const {buildValidList} = useContext(StyledSelectContext);
    const validListArray:Array<ValidListArrayType> = buildValidList(srcList)

    const {storeStyledSelectOption} = useContext(StyledSelectContext);

    useEffect(()=>{
        let paramDefaultIconUrl:string|undefined="/assets/styledSelect/arrowdown.gif";

        if (defaultLabel!=="" || typeof defaultLabel === undefined){
            setCurrentOption(defaultLabel);
        }else{
            setCurrentOption("Selecione");
        }

        // debugger;

        if (defaultData !== undefined){
            if (defaultData.iconUrl !== ""){
                paramDefaultIconUrl=defaultData.iconUrl;
            }

            // debugger;
            pickOption(styledSelId, defaultData.value.optIndex, defaultData.value.optCaption, paramDefaultIconUrl);
        }
    },[])

    function pickOption(id:string, index:number, value:string, iconUrl:string|undefined){
        const pickedOption:StyledPickedOptionType={
            id:id,
            value:{
                optIndex: index,
                optCaption: value
            }
        }
        setCurrentOption(value);                //just interface
        setSelectIconDefaultUrl(iconUrl);       //just interface
        storeStyledSelectOption(pickedOption);
        setVisibleOptions(false);
    }

    return (
        <div className={styles.divMainContent} 
            style={{
                width: stylesAttributes.width,
                maxWidth:stylesAttributes.maxWidth
            }} 
            onMouseLeave={()=>setVisibleOptions(false)}
        >
            <div className={`${styles.elementSelect} ${styles.applyRadius}`}
                 style={{
                    backgroundColor: stylesAttributes.backgroundColor,
                    fontFamily: stylesAttributes.fontFamily,
                    height:stylesAttributes.height,
                }}
                 onClick={()=>setVisibleOptions(!visibleOptions)}
            >
                <div className={styles.optionDesc}>{currentOption}</div>
                <div className={styles.optionIcon}><img src={selectIconDefaultUrl} alt="" className={styles.optionIconImg} /></div>
            </div>
            <div className={`${styles.optionsFrame} ${visibleOptions === false && styles.hideElement}`}>
                {
                    validListArray.map((el)=>
                    <div className={styles.elementSelect} 
                        style={{
                            backgroundColor: stylesAttributes.backgroundColor,
                            fontFamily: stylesAttributes.fontFamily,
                            height:stylesAttributes.height,
                        }}
                        key={el.Index}
                        onClick={()=>pickOption(styledSelId, el.Index, el.Value, el.IconUrl)}
                    >
                        <div className={styles.optionDesc}>{el.Value}</div>
                        <div className={styles.optionIcon}><img src={el.IconUrl} alt="" className={styles.optionIconImg} /></div>
                    </div>
                    )
                }
            </div>
        </div>
    )
}