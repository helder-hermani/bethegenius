import {useHistory} from 'react-router-dom';

import styles from './Login.module.scss';

export function ActivationConfirm(){
    const Routes = useHistory();

    return(
        <div className="divContainerPage setHeightViewPort">
            <menu className={styles.homeMenu}>
            </menu>
            <main className={styles.homeMain}>
                <div className={styles.loginBackground}>
                    <div className={styles.activationDiv}>
                        <h1>Cadastro Ativado, obrigado!</h1>
                        <p>Agora, é só provar quem é a pessoa mais inteligente da humanidade!</p>
                        <button className={styles.btnActivationLogin} onClick={()=>Routes.push("/")}>
                            <span>Ir para o Be The Genius</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}