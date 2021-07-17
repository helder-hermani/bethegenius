import axios from '../services/api';
import {PlayerProps, ChatactersProps} from './GlobalTypes';

type getUpdatePlayerDataProps = {
    playerDatas?:PlayerProps;
    pushToDatabase?:Boolean;
    getFromDatabase?:Boolean;
}

export async function updatePlayerData({playerDatas, pushToDatabase=false}:getUpdatePlayerDataProps){
    const strPlayerDatas = JSON.stringify(playerDatas);
    localStorage.setItem("PlayerDatas", strPlayerDatas);

    if (pushToDatabase){
        try {
            const resolve = await axios.post("/myapp/player/updatedata", playerDatas);
            return resolve.data;
        }catch(err){
            return err;
        }
    }
}

export async function getPlayerDatasStr({getFromDatabase=false}:getUpdatePlayerDataProps){
    const strPlayerDatas:string|null =  localStorage.getItem("PlayerDatas");

    if (strPlayerDatas != null){
        const jsonPlayerDatas = JSON.parse(strPlayerDatas);

        if (getFromDatabase){
            try {
                const resolve = await axios.post("/myapp/player/seek", jsonPlayerDatas);
                return resolve.data;
            }catch(err){
                return err;
            }
        }else{
            return jsonPlayerDatas;
        }
    }
}

export function makeCoachesArrStr(choaches:Array<ChatactersProps>){
    let strCoaches:string="";

    choaches.map(el=>{
        strCoaches = strCoaches + el.id + ",";
    })

    return strCoaches.substr(0,strCoaches.length-1);
}