import { useState } from 'react';
import styles from './Index.module.scss';

type CharacterAvatarProps = {
    charData: {
        avatarUrl: string;
        name: string;
        level?:number;
        behaviourDesc?: string;
        specialityDesc?: string;
        country?: string; 
    }
    // avatarUrl: string;
    // name: string;
    hasFloatBio?:boolean;
    floatContent?:string|undefined|null;
}

// export function CharacterAvatar({avatarUrl, name, hasFloatBio=false, floatContent=""}:CharacterAvatarProps){
export function CharacterAvatar({charData, hasFloatBio=false, floatContent=""}:CharacterAvatarProps){
    const [showFloatBio, setShowFloatBio] = useState<Boolean>(false);

    return(
        <div className={styles.charactersAvatar} onMouseOver={()=>setShowFloatBio(true)} onMouseLeave={()=>setShowFloatBio(false)}>
            <div className={styles.cardAvatar}>
                <img src={charData.avatarUrl} alt={charData.name} />
            </div>
            <p className={styles.pAvatarName}>{charData.name}</p>
            <p className={styles.pAvatarName}>{charData.specialityDesc}</p>
            <p className={styles.pAvatarName}>{charData.country}</p>
            <p className={styles.pAvatarName}>{charData.behaviourDesc}</p>
            {
                charData.level != undefined && <p className={styles.pAvatarName}>Nível: {charData.level}</p>
            }

            {
                (showFloatBio === true && hasFloatBio===true) && (
                <div className={styles.floatBio} >
                    <div>
                        <p>{charData.name}</p>
                    </div>
                    <p>{floatContent}</p>
                </div>
                )
            }
        </div>
    )
}