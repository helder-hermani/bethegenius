import { useState, useEffect, FormEvent } from 'react';
import {useHistory, useParams} from 'react-router-dom';
import firebase from 'firebase/app';
import {auth} from '../../services/firebase';
import {baseURLDeploy} from '../../services/api'
import { v4 as uuid } from 'uuid';
// import {GlobalCharactersContext} from '../../contexts/globalContexts/Characters';

import {useStyledSelect} from '../../components/StyledSelect/useStyledSelect'
import {MsgBox} from '../../components/StyledComps/MsgBox';
import {useSpinnerClock} from '../../components/StyledComps/SpinnerClock/useSpinnerClock';

import {gameModes} from '../../innerData/gamemodes';

import IconFacebook from './assets/facebookicon.png';
import IconGoogle from './assets/googleicon.png';
import IconGame from './assets/gameicon.png';
import styles from './Login.module.scss';

import {useLoginFunctions} from './useLoginFunctions';
// import {DataMailProps} from './useLoginFunctions';

import {DataMailProps, MsgBoxTypeProps, NewPlayerProps} from '../../contexts/GlobalTypes';
import {setNavigationToken, checktNavigationToken} from '../../contexts/globalGameFunctions';

type StyledPickedOptionType = {
    id:string;
    value: {
        optIndex: number;
        optCaption: string;
    }
}


export function Login(){
    const Routes = useHistory();
    const [modo, setModo] = useState<StyledPickedOptionType>();
    const {getValue, StyledSelect} = useStyledSelect();
    const [clickStyledSel, setClickStyledSel] = useState<Boolean>(false);
    const [alertMsg, setAlertMsg] = useState<string>("teste de erro");
    const [typeAlertMsg, setTypeAlertMsg] = useState<MsgBoxTypeProps>("normal");
    const [iconSizeAlertMsg, setIconSizeAlertMsg] = useState<number|undefined>(16);
    const [timeoutAlertMsg, setTimeoutAlertMsg] = useState<number|undefined>(0);
    const [reloadAlertMsg, setReloadAlertMsg] = useState<Boolean>(false);
    const [hasError, setHasError] = useState<Boolean>(false);
    const [loginWithUser, setLoginWithUser] = useState<Boolean>(false);
    const [socialLogin, setSocialLogin] = useState<boolean>(false);
    const [emailLogin, setEmailLogin] = useState<any>("");

    const {SpinnerClock, spinnerClockOn, setSpinnerClockOn} = useSpinnerClock();

    //Funções de login
    const {seekPlayer, createPlayerValidation, sendActivateMail, doLogin, createPlayer} = useLoginFunctions();

    type ParamProps = {
        routetoken: string;
    }
    const params:ParamProps = useParams();

    useEffect(()=>{
        const {routetoken} = params;
        if (checktNavigationToken(routetoken)){
            const gameMode:StyledPickedOptionType|undefined = getValue("select-GameMode");
            console.log(gameMode);
            setModo(gameMode);
            if (gameMode?.value.optCaption=="Liga"){
                sendMsgBox("Indisponível. Desculpe-me, modo de jogo LIGA ainda em desenvolvimento.", "error")
            }else{
                resetMsgBox();
            }
        }else{
            alert("Você não está autenticado");
        }
    },[clickStyledSel])

    function sendMsgBox(msg:string, type:MsgBoxTypeProps, iconSize?:number, timeOut?:number){
        setReloadAlertMsg(!reloadAlertMsg)
        setHasError(false);
        setAlertMsg(msg);
        setTypeAlertMsg(type);
        setIconSizeAlertMsg(iconSize);
        setTimeoutAlertMsg(timeOut);
        setHasError(true);
    }

    function resetMsgBox(){
        setAlertMsg("");
        setTypeAlertMsg("normal");
        setHasError(false);
    }


    async function handleLoginGoogle() {
        resetMsgBox();
        setSocialLogin(true);
        setSpinnerClockOn(true);
        try{
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await auth.signInWithPopup(provider);
            const googleUser = result?.user;

            if (googleUser !== null && googleUser !== undefined){
                // setEmailLogin(googleUser.email)

                // debugger;

                try {
                    const playerData:any = await seekPlayer(googleUser.email);
                    if (playerData.isAxiosError === true){
                        console.log("erro banco de dados");
                        throw "Erro de acesso ao banco de dados."
                    }
                    
                    if (playerData.length===0 && googleUser !== undefined){
                        const newPlayerData:NewPlayerProps = {
                            newSocialLogin:false,
                            newProvider:"google",
                            newName: googleUser?.displayName,
                            newEmail: googleUser?.email,
                            newAvatarUrl: googleUser?.photoURL,
                            newAvatarFromSocial: true
                            }
                            
                        try{
                            const resolve:any = await createPlayer(newPlayerData);
                            debugger;

                            const newPlayerLogon:any = await seekPlayer(googleUser.email);

                            setSpinnerClockOn(false);
                            doLogin(newPlayerLogon);

                            if (resolve.isAxiosError === true) {throw "Erro na criação do usuário"}
                        }catch(err){
                            sendMsgBox(err,"error",36);
                            setSpinnerClockOn(false);
                        }
                    }else{
                        setSpinnerClockOn(false);
                        doLogin(playerData);
                    }
                }catch(err){
                    sendMsgBox(err, "error");        
                }
            }
        }catch(err){
            sendMsgBox("Desculpe-me, houver erro de autenticação com o Google. Selecione a opção de login 'Usuário do Game'.", "error");
        }
    }


    async function handleLoginFacebook() {
        resetMsgBox();
        setSocialLogin(true);
        try{
            const provider = new firebase.auth.FacebookAuthProvider();
            const result = await auth.signInWithPopup(provider);
            console.log(result.user);
        }catch(err){
            sendMsgBox("Desculpe-me, login com Facebook ainda em desenvolvimento. Selecione a opção de login 'Google' ou 'Usuário do Game'.", "error");
        }
    }

    async function handleLoginEmail(e:FormEvent) {
        e.preventDefault();

        if (isValidEmail(emailLogin)){
            resetMsgBox();
            setSocialLogin(false);
            setSpinnerClockOn(true);
            try{
                const playerData:any = await seekPlayer(emailLogin);

                if (playerData.isAxiosError === true){
                    console.log("erro banco de dados");
                    throw "Erro de acesso ao banco de dados."
                }
                
                if (playerData.length===0){
                    const activateToken = uuid();
                    const dataMail:DataMailProps = {
                        mailTo: emailLogin,
                        Url: `${baseURLDeploy}login/activate/${activateToken}`,
                        userToken: activateToken
                    }
                    
                    try{
                        const createValid:any = await createPlayerValidation(dataMail);

                        if (createValid.isAxiosError === true){throw "Erro no processo de criar ativação."}

                        sendActivateMail(dataMail);
                        sendMsgBox(`Foi enviado um e-mail de ativação para o endereço ${emailLogin}. Após a validação, o acesso será liberado.`,"success",36,10);
                        setSpinnerClockOn(false);
                    }catch(err){
                        sendMsgBox(err,"error",36);
                        setSpinnerClockOn(false);
                    }
                }else{
                    setSpinnerClockOn(false);
                    doLogin(playerData);
                }
            }catch(err){
                setSpinnerClockOn(false);
                sendMsgBox(err, "error",36);
            }
        }else{
            sendMsgBox("Informe um endereço de e-mail válido","error",36,10);
        }
    }

    function isValidEmail(email:string|null):boolean{
        if (email==="" || email === null){
            return false;
        }else{
            if (email.indexOf("@")<0){
                return false;   
            }else{
                if (email.indexOf("@") + 1 === email.length){
                    return false;
                }else{
                    const partsEmail = email.split("@");
                    if (partsEmail[1].indexOf(".") < 0){
                        return false;
                    }else{
                        if (partsEmail[1].indexOf(".") + 1 === partsEmail[1].length){
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    function showUserLoginFrame(){
        resetMsgBox();
        setLoginWithUser(!loginWithUser);
    }

    return(
        <div className="divContainerPage setHeightViewPort">
            <menu className={styles.homeMenu}>
            </menu>
            <main className={styles.homeMain}>
                <div className={styles.loginBackground}>
                    <div className={styles.loginBlocks}>
                        <p>Jogar no modo:</p>
                        <div className={styles.styledSelectContainer} onClick={()=>setClickStyledSel(!clickStyledSel)}>
                            <StyledSelect 
                                styledSelId="select-GameMode"
                                srcList={gameModes}
                                defaultLabel="Jogar no Modo"
                                defaultData={{index: gameModes[0].index,
                                                    value: {optIndex: gameModes[0].index,
                                                            optCaption: gameModes[0].value},
                                                 iconUrl: gameModes[0].iconUrl}}
                                stylesAttributes={{width: "100%", height: "40px", fontFamily:"Montserrat, sans-serif"}}
                                />
                            </div>
                    </div>
                    <div className={styles.loginBlocks}>
                        <p className={styles.pLoginWarning}>E-mails diferentes geram usuários difentes. Assim, para uma maior consistência, utilize sempre o mesmo canal de login.</p>
                        <button className={`${styles.btnLogin} ${styles.btnLoginFacebook}`} onClick={()=>handleLoginFacebook()}>
                            <img src={IconFacebook} alt="Login com Facebook" />
                            <span>Login com Facebook</span>
                        </button>
                        <button className={`${styles.btnLogin} ${styles.btnLoginGoogle}`} onClick={()=>handleLoginGoogle()}>
                            <img src={IconGoogle} alt="Login com Google" />
                            <span>Login com Google</span>
                        </button>
                        <button className={`${styles.btnLogin} ${styles.btnLoginGame}`} onClick={()=>showUserLoginFrame()}>
                            <img src={IconGame} alt="Login com e-mail" />
                            <span>Login com e-mail</span>
                        </button>
                        <div className={loginWithUser ? styles.frameLoginGame : "nonShowElement"}>
                            <form>
                                <input type="email" placeholder="Seu e-mail" required autoFocus value={emailLogin} onChange={(e)=>setEmailLogin(e.target.value)}  />
                                <div>
                                    <input type="submit" value="Acessar" onClick={(e)=>handleLoginEmail(e)} />
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className={`${styles.divSpinner} ${(!spinnerClockOn) ? 'nonShowElement' : ''}`}>
                        <SpinnerClock />
                    </div>
                    <div style={{width: "90%"}} className={ !hasError ?  "invisibleElement" : ""}>
                        <MsgBox type={typeAlertMsg} msg={alertMsg} iconSize={iconSizeAlertMsg} timeAutoCloseSec={timeoutAlertMsg} reload={reloadAlertMsg}/>
                    </div>
                </div>
               
            </main>
        </div>
    )
}