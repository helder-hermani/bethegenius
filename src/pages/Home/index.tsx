import { useState, ReactNode, useEffect } from 'react';
import axios from '../../services/api';
import {useHistory} from 'react-router-dom';

import styles from './Home.module.scss';

import TournamentSchema from '../../assets/misc/tournament-schema.png';
import LigaSchema from '../../assets/misc/league-schema.png';
import {PrimaryButton} from '../../components/PrimaryButton';
import {habilities} from '../../innerData/habilities';
import {infoCardsData} from '../../innerData/infocards'
import {CharacterAvatar} from '../../components/CharacterAvatar';
import {InfoCard} from '../../components/InfoCard';

import {ButtonBannerHability} from '../../components/ButtonBannerHability/index';
import {setNavigationToken} from '../../contexts/globalGameFunctions';
import {ChatactersProps} from '../../contexts/GlobalTypes';


export function Home(){
    const history = useHistory();
    const [infoModel, setInfoModel] = useState<string>("torneio");
    const [infoModelDesc, setInfoModelDesc] = useState<string>("Grupo com 8 personagens, que duelarão entre si. Vitória vale 3 pontos, empate 1 e derrota 0. Os 4 primeiros colocados se classificam para a fase de “mata-mata”.");
    const [infoModelImg, setInfoModelImg] = useState<ReactNode>(<img src={TournamentSchema} alt="Informação do jogo - Modo Torneio" />);
    
    const [showAllCharacters, setShowAllCharacters] = useState<Boolean>(false);

    const [dbChar, setDbChar] = useState<Array<ChatactersProps>>([]);
    const [dbFullChar, setDbFullChar] = useState<Array<ChatactersProps>>([]);
    const [dbShortChar, setDbShortChar] = useState<Array<ChatactersProps>>([]);

    const [isHiddenHomeMain, setIsHiddenHomeMain] = useState<Boolean>(true);

    useEffect(()=>{
        async function getChar(){
            const resolve = await axios.get("/myapp/characters");
            const charData = resolve.data;
            setDbFullChar(charData);
            
            const jsonToStr = JSON.stringify(charData)          
            localStorage.setItem("CharactersFullList",jsonToStr);

            setDbShortChar(charData.slice(0,6));
            setDbChar(charData.slice(0,6));
        }
        getChar();

        showHomeMain();
    },[]);

    function showHomeMain(){
        setTimeout(()=>{
            setIsHiddenHomeMain(false);
        },500)
    }


    function setShowMode(selectMode:string){
        if (selectMode==="torneio"){
            setInfoModel("torneio");
            setInfoModelDesc("Grupo com 10 personagens, que duelarão entre si. Vitória vale 3 pontos, empate 1 e derrota 0. Os 4 primeiros colocados se classificam para a fase de “mata-mata”.");
            setInfoModelImg(<img src={TournamentSchema} alt="Informação do jogo - Modo Torneio" />);
        }else if (selectMode==="liga"){
            setInfoModel("liga");
            setInfoModelDesc("Grupo geral com todos os personagens. A cada rodada, o ranking é atualizado. Vença, suba no ranking e se mantenha no topo!");
            setInfoModelImg(<img src={LigaSchema} alt="Informação do jogo - Modo Liga" />);
        }
    }

    function toggleShowCharacters(){
        showAllCharacters === true ? setDbChar(dbShortChar) : setDbChar(dbFullChar);
        setShowAllCharacters(!showAllCharacters);
    }

    function gotoPage(rota:string){
        const routeToken = setNavigationToken();
        history.push(`${rota}/${routeToken}`);
    }

    return(
        <div className="divContainerPage">
            <menu className={styles.homeMenu}>
                <div>
                    <p>Be the Genius</p>
                    <span>Prove quem é a pessoa mais inteligente da humanidade!</span>
                </div>
                <div onClick={()=>gotoPage("/login")}>
                    <PrimaryButton caption="JOGAR AGORA" foreColor="#00FF00" />
                </div>
            </menu>
            <main className={`${styles.homeMain} ${isHiddenHomeMain && styles.homeMainHidden}`}>
                <div className={styles.coverPix}>
                </div>

                <section className={styles.sectionMain}>
                    <div className={styles.frameInfoCards}>
                        {
                            infoCardsData.map((el)=>(
                                (
                                    <div key={el.index}>
                                        <InfoCard iconUrl={el.iconUrl} content={el.content} label={el.label} />
                                    </div>
                                )
                            ))
                        }
                        <div className={styles.infoModels}>
                            <div className={styles.infoModesHeader}>
                                <div className={infoModel === "torneio" ? styles.hightLightElement : ''} onClick={()=>setShowMode("torneio")}><p>Torneio</p></div>
                                <div className={infoModel === "liga" ? styles.hightLightElement : ''} onClick={()=>setShowMode("liga")}><p>Liga</p></div>
                            </div>
                            <div className={styles.infoModelDesc}>
                                <div className={styles.infoCardModel}>
                                    {infoModelImg}
                                    <p>{infoModelDesc}</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.divBtnJogar} onClick={()=>gotoPage("/login")}>
                            <PrimaryButton caption="JOGAR AGORA" width="100%"/>
                        </div>
                    </div>
                    <div className={styles.habilitiesCard}>
                        <div className={styles.habilitiesCardDesc}>
                            <p>A cada resposta correta você ganhará "Books", que poderão ser utilizados para adquirir as seguintes habilidades especiais:</p>
                        </div>
                        {
                            habilities.map((el)=> (
                                (
                                    <div key={el.index} className={styles.divBtnHabilities}>
                                        <ButtonBannerHability iconUrl={el.iconUrl} caption={el.caption} content={el.content} />
                                    </div>
                                )
                            ))
                        }
                    </div>
                </section>

                <section className={styles.sectionBannerCarachters}>
                    <p>30 personagens com níveis, especialidades e comportamentos diferentes. Dentre eles:</p>
                    <div className={styles.CharctersBoard}>
                        {
                            dbChar.map((el) => (
                                <div key={el.id} className={styles.chars}>
                                    <CharacterAvatar charData={{name: el.name, avatarUrl: el.avatarUrl}} hasFloatBio={true} floatContent={el.bio}/>
                                </div>
                            ))
                        }
                    </div>
                    <div className={styles.pShowCaracters} onClick={()=>toggleShowCharacters()}>
                        {
                            showAllCharacters === true ? (<p>Recolher</p>) : (<p>Mostar Todos</p>)
                        }
                    </div>
                    
                </section>

            </main>
            <footer>
                <p>Desenvolvido por Helder Hermani - julho/2021</p>
            </footer>
        </div>
    )
}