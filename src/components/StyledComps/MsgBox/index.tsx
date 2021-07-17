import { ReactNode, useEffect, useState } from 'react';
import {FaInfo, FaTimes, FaExclamationCircle, FaCheckCircle} from 'react-icons/fa'
import styles from './Index.module.scss';

type MsgBoxTypeProps = "normal" | "success" | "error" | "warning";

type MsgBoxProps={
    type: MsgBoxTypeProps;   //normal, success, error, warning
    msg:string;
    iconSize?: number;
    timeAutoCloseSec?:number;
    reload?:Boolean;
}

export function MsgBox({type, msg, iconSize=16, timeAutoCloseSec=0, reload=false}:MsgBoxProps){
    let propTypeStile:string = "normal";
    let msgIcon:ReactNode = <FaInfo size={iconSize} color="#000000" />
    const [hideMsg, setHideMsg] = useState<string>("");

    useEffect(()=>{
        console.log("executando componente msgbox")
        setHideMsg("");
        if (timeAutoCloseSec >0){
            const timeToClose:number = timeAutoCloseSec*1000;
            setTimeout(()=>{
                setHideMsg("nonShowElement");
                console.log("apagou a caixa de mensagem. tempo esperado: ", timeToClose);
            },timeToClose);
            
        }
        setHideMsg("");
    },[type, msg, iconSize, timeAutoCloseSec, reload])

    switch(type){
        case "normal":
            propTypeStile = styles.normal;
            msgIcon = <FaInfo size={iconSize} color="#000000" />
            break;
        case "success":
            propTypeStile = styles.success;
            msgIcon = <FaCheckCircle size={iconSize} color="rgb(9, 73, 20)" />
            break;
        case "error":
            propTypeStile = styles.error;
            msgIcon = <FaTimes size={iconSize} color="#FF0000" />
            break;
        case "warning":
            propTypeStile = styles.warning;
            msgIcon = <FaExclamationCircle size={iconSize} color="rgb(139, 97, 5)" />
            break;
        default:
            propTypeStile = styles.normal;
            msgIcon = <FaInfo size={iconSize} color="#000000" />
            break;
    }

    return(
        <div className={`${hideMsg}`}>
            <div className={`${styles.msgBox} ${propTypeStile}`}>
                <span>{msgIcon}</span>
                <p>{msg}</p>
                {console.log(type)}
            </div>
        </div>
    )
}