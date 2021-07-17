import styles from './Index.module.scss';

type InfoCardProps = {
    iconUrl:string;
    content:string;
    label?:string;
}

export function InfoCard({iconUrl, content, label=""}:InfoCardProps){
    return(
        <div>
            <div className={styles.Desktop}>
                <div className={styles.infoCard}>
                    <div>
                        <img src={iconUrl} alt="Informação do jogo - Card1" />
                    </div>
                    <div>
                        <p>{content}</p>
                    </div>
                </div>
            </div>
            <div className={styles.Mobile}>
                <div className={styles.infoCard}>
                    <div>
                        <img src={iconUrl} alt="Informação do jogo - Card1" />
                    </div>
                    <div>
                        <p>{label}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}