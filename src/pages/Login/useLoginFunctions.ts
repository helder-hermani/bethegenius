import { useContext } from 'react';
import axios from '../../services/api';
import {useHistory} from 'react-router-dom';
import {GlobalPlayerContext} from '../../contexts/globalContexts/Player';
import {GlobalCharactersContext} from '../../contexts/globalContexts/Characters';
import {makeCoachesArrStr, updatePlayerData} from '../../contexts/globalGameFunctions';
import {ChatactersProps,DataMailProps, NewPlayerProps, PlayerProps} from '../../contexts/GlobalTypes';

type useLoginFunctionsProps = {
    seekPlayer:(arg:string|null) => Promise<Array<PlayerProps>>;
    createPlayerValidation:(arg:DataMailProps)=>Promise<void>;
    sendActivateMail:(arg:DataMailProps)=>Promise<void>;
    deleteActivation:(arg:DataMailProps)=>Promise<void>;
    createPlayer:(arg:NewPlayerProps)=>Promise<void>;
    drawCoaches:(fullList:Array<ChatactersProps>, qtdCoaches:number) => Array<ChatactersProps>;
    doLogin: (userData: Array<PlayerProps>) => void;
}

// export function useLoginFunctions():useLoginFunctionsProps{
export function useLoginFunctions():useLoginFunctionsProps{
    const Routes = useHistory();
    const {setGlobalPlayerData} = useContext(GlobalPlayerContext);

    async function seekPlayer(userEmail:string|null) {
        try {
            const user = await axios.post("/myapp/player/seek", {userEmail: userEmail});
            const playerData = user.data;
            return playerData;
        }catch(err){
            return err;
        }
    }

    async function createPlayerValidation(dataMail:DataMailProps){
        try {
            const resolve = await axios.post("/myapp/player/createuser/activate", dataMail);
            return resolve.data;
        }catch(err){
            return err;
        }
    }

    async function sendActivateMail(dataMail:DataMailProps){
        await axios.post("/myapp/player/createuser/sendmail",dataMail);
        console.log("e-mail enviado")
        // return resolve.data;
    }

    async function deleteActivation(dataMail:DataMailProps){
        debugger;
        try{
            const resolve = await axios.post("/myapp/player/createuser/deleteactivate",dataMail);
            return resolve;
        }catch(err){
            return err;
        }
    }

    async function createPlayer({newSocialLogin, newProvider, newName, newEmail, newAvatarUrl, newAvatarFromSocial}:NewPlayerProps){

        // debugger;
        try {
            const getStdSettings = await axios.get("/myapp/getstandardsettings");
            // const {setInitialInsigths, setInitialJump, setInitialOpposition, setInitialBooks, setInitialQi} = getStdSettings.data;
            const {setInitialInsigths, setInitialJump, setInitialOpposition, setInitialBooks, setInitialQi} = getStdSettings.data[0];

            const newPlayer:PlayerProps = {            
                userSocialLogin:newSocialLogin,
                userProvider:newProvider,
                userName:newName,
                userEmail:newEmail,
                userAvatarUrl:newAvatarUrl,
                userQi: setInitialQi,
                userBooks: setInitialBooks,
                userInsights:setInitialInsigths,
                userJumps:setInitialJump,
                userOppositions:setInitialOpposition,
                userCouches:"",
                userNationality:0,
                userSpeciality:0,
                userAvatarFromSocial:newAvatarFromSocial,
                specialityDesc: "",
                specialityUrl: "",
                country: "",
                flagUrl:"",
                backgroundUrl: ""
            }
    
            try {
                const resolve = await axios.post("/myapp/player/create", newPlayer);
                return resolve;
            }catch(err){
                return err;
            }
        }catch(err){
            debugger;
            return err;
        }        
    }

    async function doLogin(userData: Array<PlayerProps>|PlayerProps){
        //Anteriormente, foi verificado se o usuário já existe. Se existe, já foi capturado os dados. Se não existe, criou-se um novo
        //Logo, por um ou outro caso, já se tem os dados do usuário

        // debugger;

        const strCharactersFullList = localStorage.getItem("CharactersFullList");
        if (strCharactersFullList != null){
            const strToJson = JSON.parse(strCharactersFullList);
            
            
            // userData[0].userCouches = makeCoachesArrStr(drawCoaches(globalCharactersFullList,3));
            if (Array.isArray(userData)){
                userData[0].userCouches = makeCoachesArrStr(drawCoaches(strToJson,3));
                //Salvar no localStorage os dados do usuário
                setGlobalPlayerData(userData[0]);
                const playerSaveInLocal = updatePlayerData({playerDatas: userData[0]});
            }else{
                userData.userCouches = makeCoachesArrStr(drawCoaches(strToJson,3));
                //Salvar no localStorage os dados do usuário
                setGlobalPlayerData(userData);
                const playerSaveInLocal = updatePlayerData({playerDatas: userData});
            }
                        

            

            //Encaminhar para a página do usuário
            Routes.push("/player/page");
        }
    }

    function drawCoaches(fullList:Array<ChatactersProps>, qtdCoaches:number){
        let coachesBox:Array<ChatactersProps>=[];
        let i:number = 1;

        for (i=1; i<=qtdCoaches; i++){
            const randomIndex = Math.floor(Math.random() * (fullList.length - 0)) + 0;
            const pickedCoach:Array<ChatactersProps> = fullList.splice(randomIndex,1);
            coachesBox = coachesBox.concat(pickedCoach);
        }

        return coachesBox;
    }

    return {seekPlayer, createPlayerValidation, sendActivateMail, deleteActivation, createPlayer, drawCoaches, doLogin}
}