import React from "react";
import {ButtonHTMLAttributes} from 'react'
import styles from './Index.module.css';

type PrimaryButtonProps = {
    caption: string;
    enabled?: boolean;
    foreColor?: string;
    shadowColor?:string;
    width?:string;
    props?:ButtonHTMLAttributes<HTMLButtonElement>;
}


export function PrimaryButton({
    caption= "",
    enabled= true,
    foreColor= "#FFD15A",
    shadowColor= "rgba(250, 253, 109, 0.25)",
    width="100%",
    props
    }:PrimaryButtonProps){

        return(
            <button className={styles.primaryBtn} {...props} style={{width:width}}><span>{caption}</span></button>
        )

}