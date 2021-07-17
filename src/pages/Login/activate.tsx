import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useHistory} from 'react-router-dom';

import axios from '../../services/api';

import {MsgBox} from '../../components/StyledComps/MsgBox';
import {NewPlayerProps} from '../../contexts/GlobalTypes';

import {useLoginFunctions} from './useLoginFunctions';
import {useSpinnerClock} from '../../components/StyledComps/SpinnerClock/useSpinnerClock';

import styles from './Login.module.scss';

type ParamsProp={
    token:string;
}


export function ActivatePlayer(){
    const params:ParamsProp = useParams();
    const {token} = params;
    const Routes = useHistory();
    const {deleteActivation, createPlayer} = useLoginFunctions();
    const {SpinnerClock,setSpinnerClockOn,spinnerClockOn} = useSpinnerClock();

    const [msgBoxOn, setMsgBoxOn] = useState<boolean>(false);
    const [validToken, setValidToken]=useState<Boolean>(false);
    const [userEmail, setUserEmail]=useState<string>("");
    const [txtName, setTxtName]=useState<string>("");
    const [errorMsg, setErrorMsg]=useState<string>("");

    useEffect(()=>{
        async function checkValidade(){
            const resolve = await axios.post("/myapp/player/createuser/checkactivation",{token: token});
            const user = resolve.data;

            if (resolve.data.length > 0){
                setValidToken(true);
                const {atvEmail} = user[0];
                setUserEmail(atvEmail);
            }
        }checkValidade();
    },[])

    async function activateUser(name:string){
        if (name.trim()===""){
            setErrorMsg("Informe um nome válido");
            setMsgBoxOn(true);
        }else{
            debugger;
            setSpinnerClockOn(true);
            const resDel:any = await deleteActivation({mailTo:userEmail});

            if (resDel.status === 200){
                const newPlayerData:NewPlayerProps = {
                    newSocialLogin:false,
                    newProvider:"email",
                    newName: txtName,
                    newEmail: userEmail,
                    newAvatarUrl: "/assets/images/philosopher-queue-toleft.png",
                    newAvatarFromSocial: false
                    }

                    const resolve:any = await createPlayer(newPlayerData);

                    if (resolve.status === 200){
                        Routes.push("/login/activate/confirm/success");
                    }else{
                        setErrorMsg("Erro no processamento");
                        setMsgBoxOn(true);
                    }
                    setSpinnerClockOn(false);
            }else{
                setErrorMsg("Erro ao concluir ativação");
                setMsgBoxOn(true);
            }
        }
    }

    return(
        <div className="divContainerPage setHeightViewPort">
            <menu className={styles.homeMenu}>
            </menu>
            <main className={styles.homeMain}>
                <div className={styles.loginBackground}>
                    {
                        validToken ? (
                            <div className={styles.activationDiv}>
                                <h2>Prezado Genius,</h2>
                                <p>{userEmail}</p>
                                <p><strong>Obrigado por acessar o Be The Genius!</strong></p>
                                <p>Para confirmar seu acesso, por favor informe seu nome:</p>
                                <input type="text" value={txtName} autoFocus required onChange={(e)=>{
                                    setTxtName(e.target.value)
                                    setMsgBoxOn(false);
                                }}/>

                                <div style={{width: "100%"}} className={ !msgBoxOn ?  "nonShowElement" : ""}>
                                    <MsgBox msg={errorMsg}
                                            type="error"
                                            iconSize={24}
                                    />
                                </div>

                                <button className={styles.btnActivationLogin} onClick={()=>activateUser(txtName)}>
                                    <span>Ativar Cadastro Agora!</span>
                                </button>
                                <div style={{width: "30px", height:"30px", position: "relative", margin:"0 auto"}} className={ !spinnerClockOn ?  "nonShowElement" : ""}>
                                    <SpinnerClock percentualHeight={100} percentualwidth={100} />
                                </div>
                            </div>
                        ):
                        (
                            <div className={styles.activationDiv}>
                                <h2>Prezado Genius,</h2>
                                <p><strong>Link de ativação inválido.</strong></p>
                                <p>Provavelmente este endereço de e-mail já foi validado ou a autorização exiprou.</p>
                                <p>Caso já tenha ativado, basta acessar o Be The Genius e fazer login com seu e-mail.</p>
                                <p>Acesse e prove quem é a pessoa mais inteligente da humanidade!</p>
                                <button className={styles.btnActivationLogin} onClick={()=>Routes.push("/")}>
                                    <span>Acessar o Be The Genius agora!</span>
                                </button>
                            </div>
                        )
                    }
                </div>
            </main>
        </div>
    )
}