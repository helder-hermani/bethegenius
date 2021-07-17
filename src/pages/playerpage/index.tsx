import firebase from 'firebase';
import { useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import axios from '../../services/api';

import {updatePlayerData} from '../../contexts/globalGameFunctions';
import {useStyledSelect} from '../../components/StyledSelect/useStyledSelect'
import styles from './Index.module.scss';
import {SpecialitiesProps,NationalitiesProps,HabilitiesProps,ChatactersProps, PlayerProps} from '../../contexts/GlobalTypes';


import {FaCamera} from 'react-icons/fa';

import {PrimaryButton} from '../../components/PrimaryButton';
import {CharacterAvatar} from '../../components/CharacterAvatar';

import {habilities} from '../../innerData/habilities';

export function PlayerPage(){
    const Rotas = useHistory();
    const {getValue, StyledSelect} = useStyledSelect();

    const [dbSpecialities, setDbSpecialities] = useState<Array<SpecialitiesProps>>([]);
    const [dbNationalities, setDbNationalities] = useState<Array<NationalitiesProps>>([]);
    const [innerDbHabilities, setInnerDbHabilities] = useState<Array<HabilitiesProps>>([]);

    const [dbCharacters, setDbCharacters] = useState<Array<ChatactersProps>>([]);

    //DADOS DO USUÁRIO/PLAYER
    const [objPlayerData, setObjPlayerData] = useState<PlayerProps>();
    const [playerName, setPlayerName] = useState<string|null>("");
    const [playerEmail, setPlayerEmail] = useState<string|null>("");
    const [playerAvatarUrl, setPlayerAvatarUrl] = useState<string|null>("");
    const [playerBooks, setPlayerBooks] = useState<number>(0);
    const [playerQi, setPlayerQi] = useState<number>(0);
    const [playerInsights, setPlayerInsights] = useState<number>(0);
    const [playerJumps, setPlayerJumps] = useState<number>(0);
    const [playerOppositions, setPlayerOppositions] = useState<number>(0);
    const [playerSpecialityCaption, setPlayerSpecialityCaption] = useState<string>("");
    const [playerNationalityCaption, setPlayerNationalityCaption] = useState<string>("");
    const [playerNationalityFlag, setPlayerNationalityFlag] = useState<string>("");

    const [loadingNewAvatar, setLoadingNewAvatar] = useState<boolean>(false);

    const strCharactersFullList = localStorage.getItem("CharactersFullList");
    const [strPlayerInitialData, setStrPlayerInitialData] = useState<string|null>(localStorage.getItem("PlayerDatas"));

    const [changeSpeciality, setChangeSpeciality]= useState<boolean>(false);
    const [changeNationality, setChangeNationality]= useState<boolean>(false);
    
    useEffect(()=>{ //para o carregamento da página
        
        async function getSpecialities() {
            const resultSpecialities = await axios.get("/myapp/getspecialities");
            const specialityResult = resultSpecialities.data;
            setDbSpecialities(specialityResult);
            const resultNatiolaties = await axios.get("/myapp/getnationalities");
            const nationalityResult = resultNatiolaties.data;
            setDbNationalities(nationalityResult);
        }getSpecialities();

        const habilitiesList = habilities.filter(el=>el.index <= 2);
        setInnerDbHabilities(habilitiesList);

        if (strPlayerInitialData != null && strCharactersFullList != null){
            const jsonPlayerCurrentData = JSON.parse(strPlayerInitialData);
            const jsonCharactersFullList = JSON.parse(strCharactersFullList);

            setObjPlayerData(jsonPlayerCurrentData);

            fillPlayerDatas(jsonPlayerCurrentData);

            const arrPocketCouch:Array<string> = jsonPlayerCurrentData.userCouches.split(",");
            const objPocketCouches = jsonCharactersFullList.filter((el:ChatactersProps)=>(
                isCouch(el, arrPocketCouch)
            ));

            setDbCharacters(objPocketCouches);
        }   
    },[strPlayerInitialData]);

    useEffect(()=>{ //Para a atualização do select Especialidade
        const current = getValue("selSpecialities");

        if (objPlayerData !== undefined && current !== undefined && playerSpecialityCaption !== current.value.optCaption){
            setPlayerSpecialityCaption(current.value.optCaption);
            const editPlayerData = objPlayerData;
            editPlayerData.userSpeciality = current.value.optIndex;
            editPlayerData.specialityDesc = current.value.optCaption;
            updatePlayerData({playerDatas: editPlayerData, pushToDatabase: true});
            setStrPlayerInitialData(localStorage.getItem("PlayerDatas"));
        }
    },[changeSpeciality]);

    useEffect(()=>{ //Para a atualização do select Nacionalidade
        const current = getValue("selNationalities");

        if (objPlayerData !== undefined && current !== undefined && playerNationalityCaption !== current.value.optCaption){
            setPlayerNationalityCaption(current.value.optCaption);

            const countryEl = dbNationalities.filter(el=>el.id === current.value.optIndex);

            setPlayerNationalityFlag(countryEl[0].flagUrl);

            const editPlayerData = objPlayerData;
            editPlayerData.userNationality = current.value.optIndex;
            editPlayerData.country = current.value.optCaption;
            editPlayerData.flagUrl = countryEl[0].flagUrl;
            updatePlayerData({playerDatas: editPlayerData, pushToDatabase: true});
            setStrPlayerInitialData(localStorage.getItem("PlayerDatas"));
        }
    },[changeNationality]);

    function isCouch(el:ChatactersProps, arrPocket:Array<string>):Boolean{
        let i:number = 0;

        for (i=0;i<=arrPocket.length-1;i++){
            if (el.id === parseInt(arrPocket[i])){
                return true;
            }
        }
        return false;
    }

    function fillPlayerDatas(playerData:PlayerProps){
        console.log("Player Data na função fill: ", playerData);
        setPlayerName(playerData.userName);
        setPlayerEmail(playerData.userEmail);
        setPlayerAvatarUrl(playerData.userAvatarUrl);
        setPlayerBooks(playerData.userBooks);
        setPlayerQi(playerData.userQi);
        setPlayerInsights(playerData.userInsights);
        setPlayerJumps(playerData.userJumps);
        setPlayerOppositions(playerData.userOppositions);
        setPlayerSpecialityCaption(playerData.specialityDesc);
        setPlayerNationalityCaption(playerData.country);
        setPlayerNationalityFlag(playerData.flagUrl);
    }


    function uploadFileToFirebase(file:any){

        if (file !== undefined && (file.type==="image/jpeg" || file.type==="image/png" || file.type==="image/gif")){
            setLoadingNewAvatar(true);
            var storageRef = firebase.storage().ref();

            // Create the file metadata
            var metadata = {
                contentType: 'image/png;image/jpg'
            };

            // Upload file and metadata to the object 'images/mountains.jpg'
            var uploadTask = storageRef.child('playersavatars/' + playerEmail).put(file, metadata);

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
                }
            }, function(error) {

            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;

                case 'storage/canceled':
                // User canceled the upload
                break;

                case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
            }, function() {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log('File available at', downloadURL);
                uptadeUserAvatarUrl(downloadURL);
                setLoadingNewAvatar(false);                
            });

            });
        }
    }

    async function uptadeUserAvatarUrl(newUrl:string){
        const playerData:PlayerProps|undefined = objPlayerData;
        
        setPlayerAvatarUrl(newUrl);

        if (playerData !== undefined){
            playerData.userAvatarUrl = newUrl;
            playerData.userAvatarFromSocial=false;

            try{
                const resolve = await updatePlayerData({playerDatas: playerData, pushToDatabase: true});
                if (resolve.isAxiosError === true){throw "Erro ao atualizar banco de dados"}
            }catch(err){
                console.log(err);
            }
        }
    }

    function habilityValue(habilityCaption:string):number{
        switch (habilityCaption){
            case "Insight":
                return playerInsights;
            case "Pular Tema":
                return playerJumps;
            case "Opor-se ao Tema":
                return playerOppositions;
            default:
                return -1;
        }
    }


    return(
        <div className="divContainerPage setHeightViewPort">
            <menu className={styles.homeMenu}>
                <div>
                    <p>{playerName}</p>
                    <span>{playerEmail}</span>
                </div>
                <div onClick={()=>Rotas.push("/")}>
                    <PrimaryButton caption="IR PARA O JOGO" foreColor="#00FF00" />
                </div>
            </menu>
            <main className={styles.homeMain}>
                <div className={styles.playerProfile}>
                    <div  className={styles.playerProfileAvatar}>
                        <div className={styles.divPlayerProfileAvatarFotoNome}>
                            <div style={{backgroundImage: `url(${playerAvatarUrl})`}} className={`${styles.PlayerAvatar} ${loadingNewAvatar ? styles.loadingNewAvatar : ''}`} />
                            <div className={styles.divIconChangePic}>
                                <FaCamera size={24} color="rgba(255,255,255,.2)" />
                            </div>
                            <input
                                    className={styles.btnUpload}
                                    type="file" id="files"
                                    name="files"
                                    accept="image/png, image/jpeg"
                                    onChange={(e)=>uploadFileToFirebase(e.target.files?.[0])}
                                />
                        </div>
                        <p className={styles.playerName}>{playerName}</p>
                    </div>
                    <div className={styles.playerProfileData}>
                        <p><span>QI: {playerQi}</span></p>
                        <p><span>Books: {playerBooks} Bks</span></p>
                        <p><span>{playerSpecialityCaption}</span></p>
                        <p><span><img src={playerNationalityFlag} alt={playerNationalityCaption} />{playerNationalityCaption}</span></p>
                    </div>
                </div>
                <div className={styles.playerItems}>
                    <div className={styles.specialityNationalityOptions} onClick={()=>console.log(getValue("selSpecialities"))}>
                        <div onClick={()=>{setChangeSpeciality(!changeSpeciality)}}>
                            <StyledSelect 
                            srcList={dbSpecialities}
                            styledSelId="selSpecialities"
                            defaultLabel="Alterar Especialidade"
                            stylesAttributes={{width: "100%", height: "40px", fontFamily:"Montserrat, sans-serif"}}/>
                        </div>
                        <div onClick={()=>{setChangeNationality(!changeNationality)}}>
                            <StyledSelect srcList={dbNationalities} styledSelId="selNationalities" defaultLabel="Alterar Nacionalidade" stylesAttributes={{width: "100%", height: "40px", fontFamily:"Montserrat, sans-serif"}}/>
                        </div>
                    </div>
                    <div className={styles.frameHabilities}>
                        <h3>Suas Habilidades Especiais</h3>
                        <div className={styles.habilitiesCard}>
                            {
                                innerDbHabilities.map((el)=>(
                                    <div className={styles.habilitiesItem}>
                                        <img src={el.iconUrl} alt={el.shortDesc} />
                                        <div>
                                            <span><strong>{el.caption}</strong></span>
                                            <span>{el.shortDesc}</span>
                                        </div>
                                        <p>{habilityValue(el.caption)}</p>
                                    </div>
                                ))
                            }
                        </div>
                        <h3>Seus Coaches</h3>
                        <div className={styles.CharctersBoard}>
                        {
                            dbCharacters.map((el) => (
                                <div key={el.id} className={styles.charactersAvatar}>
                                    <CharacterAvatar charData={{name: el.name, avatarUrl: el.avatarUrl}} hasFloatBio={true} floatContent={`${el.specialityDesc} ${el.behaviourDesc} Nível: ${el.level}`} />
                                </div>
                            ))
                        }
                        </div>
                        <div className={styles.divBtnAdmHabilities}>
                            <PrimaryButton caption="Gerenciar Habilidades" width={"100"} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}