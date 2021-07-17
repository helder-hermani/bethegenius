export type SpecialitiesProps = {
    id:number;
    specialityDesc: string;
    specialityUrl: string;
}

export type NationalitiesProps = {
    id:number;
    country: string;
    flagUrl: string;
    backgroundUrl:string;
}

export type HabilitiesProps = {
    index: number;
    iconUrl: string;
    caption : string;
    content: string;
    shortDesc: string;
}

export type MsgBoxTypeProps = "normal" | "success" | "error" | "warning";

export type ChatactersProps = {
    id: number;
    name: string;
    avatarUrl: string;
    nationality: number;
    speciality: number;
    speciality2: string|null;
    level: number;
    behaviour: number;
    qi: number|null;
    bio?: string|null;
    price: number;
    behaviourDesc: string;
    specialityDesc: string;
    country: string;
    flagUrl: string;
}

export type PlayerProps = {
    userAvatarUrl: string|null;
    userAvatarFromSocial: boolean;
    userBooks: number;
    userCouches: string;
    userEmail: string|null;
    userId?: number;
    userInsights: number;
    userJumps: number;
    userName: string|null;
    userNationality: number;
    userOppositions: number;
    userProvider: string;
    userQi: number;
    userSocialLogin: Boolean;
    userSpeciality: number;
    specialityDesc: string;
    specialityUrl: string;
    country: string;
    flagUrl: string;
    backgroundUrl: string;
}

export type NewPlayerProps = {
    newSocialLogin:Boolean;
    newProvider:string;
    newName: string|null;
    newEmail: string|null;
    newAvatarUrl: string|null;
    newAvatarFromSocial:boolean;
}

export type DataMailProps = {
    mailTo: string|null;
    Url?: string;
    userToken?: string;
}