import {useState, ReactNode} from 'react';

import styles from './Index.module.scss';
import {FaSortDown, FaSortUp} from 'react-icons/fa';

import Icon from '../../assets/icons/icon-parthenon.jpg'

type ButtonBannerHabilityProps = {
    iconUrl: string;
    caption: string;
    content: string;
    border?: string;
    backgroundColor ?: string;
    fontColor?:string;
}

console.log(typeof Icon);

export function ButtonBannerHability({
    iconUrl,
    caption,
    content,
    border,
    backgroundColor,
    fontColor}:ButtonBannerHabilityProps){
    const [showFrame, setShowFrame] = useState<boolean>(false);
    return (
        <div>
            <div className={styles.habilityCardButton} onClick={()=>setShowFrame(!showFrame)}>
                <img src={iconUrl} alt="Ícone de banner board" />
                <p>{caption}</p>
                {showFrame===false ? (<FaSortDown size={24} color="#535360"/>) : (<FaSortUp size={24} color="#535360"/>)}
            </div>
            <div className={showFrame===false ? styles.hideElement : styles.habilitiesCardDesc}>
                <p>{content}</p>
            </div>
        </div>
    )
}