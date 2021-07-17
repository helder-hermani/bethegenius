import React from 'react';
import { FaThLarge } from 'react-icons/fa';

function formataData(valor){
    valor = new Date(valor);
    const options = {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false,
        timeZone: 'America/Sao_Paulo'
      };
    return Intl.DateTimeFormat('pt-BR', options).format(valor);
}

function isStillLoged(){
    const lastAccess = new Date(localStorage.getItem("appcondLastAction"));
    const currentTime = new Date();
    const hoursLogged = (currentTime - lastAccess)/3600000;
    console.log(hoursLogged);

    if (hoursLogged <= 2){
        return true
    }else{
        return false;
    }  
}

function closeAllFloatMenus(){
    const $floatMenu = document.querySelector("#float-menu");
    const $floatMenuUser = document.querySelector("#float-menu-user");
    $floatMenu.classList.remove("float-menu-show");
    $floatMenuUser.classList.remove("float-menu-user-show");
}

export default {isStillLoged, closeAllFloatMenus};
