export const DICEFIELD = {
    dice: ["num", {initial:0, nullable:false, integer:true}],
    fixe: ["num", {initial:0, nullable:false, integer:true}],
}

//PREPARATION DES BLOCK DE CHAMPS
const ATKCARACFIELD = {
    fixe: ["str", { initial: "", nullable:false}],
    jet: ["str", { initial: "", nullable:false}],
    labelFixe: ["str", { initial: "", nullable:false}],
    labelJet: ["str", { initial: "", nullable:false}],
    odInclusFixe: ["bool", { initial: false}],
    odInclusJet: ["bool", { initial: false}],
}

const CONDITIONALFIELD = {
    condition: ["str", { initial: "", nullable:false}],
    has: ["bool", { initial: false}],
}

const VARIABLEDVFIELD = {
    has: ["bool", { initial: false}],
    min: ["schema", DICEFIELD],
    max: ["schema", DICEFIELD],
    cout: ["num", {initial:0, nullable:false, integer:true}],
}

const LISTEFFECTSFIELD = {
    activable:["bool", { initial: false}],
    active:["bool", { initial: false}],
    cost:["num", {initial:0, min:0, nullable:false, integer:true}],
    custom:["bool", { initial: false}],
    id:["num", {initial:0, nullable:false, integer:true}],
    complet:["str", { initial: "", nullable:false}],
    description:["html", { initial: ""}],
    index:["num", {initial:0, nullable:false, integer:true}],
    name:["str", { initial: "", nullable:false}],
    raw:["str", { initial: "", nullable:false}],
    chargeur:["num", {initial:0, nullable:false, integer:true}],
    chargeurMax:["num", {initial:0, nullable:false, integer:true}],
    isChargeur:["bool", { initial: false}],
    toComplete:["str", { initial: "", nullable:false}],
}

const CUSTOMEFFECTSFIELD = {
    attaque:["schema", {
        aspect:["schema", ATKCARACFIELD],
        carac:["schema", ATKCARACFIELD],
        conditionnel:["schema", CONDITIONALFIELD],
        jet:["num", {initial:0, nullable:false, integer:true}],
        reussite:["num", {initial:0, nullable:false, integer:true}],
    }],
    degats:["schema", {
        aspect:["schema", ATKCARACFIELD],
        carac:["schema", ATKCARACFIELD],
        conditionnel:["schema", CONDITIONALFIELD],
        jet:["num", {initial:0, nullable:false, integer:true}],
        reussite:["num", {initial:0, nullable:false, integer:true}],
    }],
    violence:["schema", {
        aspect:["schema", ATKCARACFIELD],
        carac:["schema", ATKCARACFIELD],
        conditionnel:["schema", CONDITIONALFIELD],
        jet:["num", {initial:0, nullable:false, integer:true}],
        reussite:["num", {initial:0, nullable:false, integer:true}],
    }],
    other:["schema", {
        cdf:["num", {initial:0, nullable:false, integer:true}],
    }],
    description:["html", { initial: ""}],
    label:["str", { initial: "", nullable:false}],
}

const ACTIVABLEFFECTSFIELD = {
    key:["str", { initial: "", nullable:false}],
    cost:["num", {initial:0, nullable:false, integer:true}],
}

//EXPORT DES CHAMPS PRINCIPAUX
export const EFFECTSFIELD = {
    liste: ["arr", ["schema", LISTEFFECTSFIELD]],
    raw: ["arr", ["str", { initial: "", nullable:false}],],
    custom: ["arr", ["schema", CUSTOMEFFECTSFIELD]],
    chargeur: ["num", {initial:null, nullable:true}],
    activable: ["arr", ["schema", ACTIVABLEFFECTSFIELD]],
}

export const DGTSVIOLENCEFIELD = {
    dice: ["num", {initial:0, nullable:false, integer:true}],
    fixe: ["num", {initial:0, nullable:false, integer:true}],
    variable: ["schema", VARIABLEDVFIELD],
}

export const OPTIONSMUNITIONS = {
    has: ["bool", { initial: false}],
    actuel: ["str", { initial: "0", nullable:false}],
    value: ["num", {initial:1, nullable:false, integer:true}],
    liste: ["arr", ["schema", {
        nom:["str", { initial: "", nullable:false}],
        degats:["schema", DICEFIELD],
        violence:["schema", DICEFIELD],
        liste: ["arr", ["schema", LISTEFFECTSFIELD]],
        raw: ["arr", ["str", { initial: "", nullable:false}]],
        custom:["arr", ["schema", CUSTOMEFFECTSFIELD]],
        chargeur: ["num", {initial:null, nullable:true}],
        activable: ["arr", ["schema", ACTIVABLEFFECTSFIELD]],
    }]],
}