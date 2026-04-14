import { DefensesDataModel } from '../parts/defenses-data-model.mjs';
import { InitiativeDataModel } from '../parts/initiative-data-model.mjs';
import { ArmesImproviseesDataModel } from '../parts/armesimprovisees-data-model.mjs';
import { fields } from '../../../utils/field-builder.mjs';

/**
 * Modèle de données de base pour tous les acteurs du système Knight.
 * Cette classe abstraite définit le schéma commun et les méthodes partagées
 * par tous les types d'acteurs (knight, creature, bande, ia, vehicule, mechaarmure).
 * @extends {foundry.abstract.TypeDataModel}
 */
export default class BaseActorDataModel extends foundry.abstract.TypeDataModel {
    // Pour Héritage
    // Extension : on ajoute/modifie
    static get baseDefinition() {
        return {
            // Numéro de version pour gérer les migrations de données
            version:["num", { initial: 0, nullable:false, integer:true}],
            // Description complète visible par le propriétaire
            description:["html", { initial: ""}],
            // Description restreinte visible par les autres joueurs
            descriptionLimitee:["html", { initial: ""}],
            defense:["embedded", DefensesDataModel],
            reaction:["embedded", DefensesDataModel],
            initiative:["embedded", InitiativeDataModel],

            // Options d'affichage pour les permissions limitées
            limited:["schema", {
                showDescriptionFull:["bool", { initial: false}],
                showDescriptionLimited:["bool", { initial: false}],
             }],


            combat:["schema", {
                data:["schema", {
                    degatsbonus:["schema", {
                        dice:["num", { initial: 0, nullable:false, integer:true}],
                        fixe:["num", { initial: 0, nullable:false, integer:true}],
                    }],
                    violencebonus:["schema", {
                        dice:["num", { initial: 0, nullable:false, integer:true}],
                        fixe:["num", { initial: 0, nullable:false, integer:true}],
                    }],
                    modificateur:["num", { initial: 0, nullable:false, integer:true}],
                    sacrifice:["num", { initial: 0, nullable:false, integer:true}],
                    succesbonus:["num", { initial: 0, nullable:false, integer:true}],
                    tourspasses:["num", { initial: 1, nullable:false, integer:true}],
                    type:["str", { initial: "degats"}],
                }],
                armesimprovisees:["embedded", ArmesImproviseesDataModel],
            }],
            sante:["schema", {
                base:["num", { initial: 0, nullable:false, integer:true}],
                mod:["num", { initial: 0, nullable:false, integer:true}],
                value:["num", { initial: 0, nullable:false, integer:true}],
                max:["num", { initial: 16, nullable:false, integer:true}],
                bonusValue:["num", { initial: 0, nullable:false, integer:true}],
                malusValue:["num", { initial: 0, nullable:false, integer:true}],
                override:["obj", {}],
                bonus:["obj", {
                    initial:{
                        user:0,
                    }
                }],
                malus:["obj", {
                    initial:{
                        user:0,
                    }
                }],
            }],
            armure: ["schema", {
                base:["num", { initial: 0, min:0, nullable:false, integer:true}],
                mod:["num", { initial: 0, nullable:false, integer:true}],
                value:["num", { initial: 0, nullable:false, integer:true}],
                max:["num", { initial: 0, nullable:false, integer:true}],
                bonus:["obj", {
                    initial:{
                        user:0,
                    }
                }],
                malus:["obj", {
                    initial:{
                        user:0,
                    }
                }],
            }],
            energie:["schema", {
                base:["num", { initial: 0, nullable:false, integer:true}],
                mod:["num", { initial: 0, nullable:false, integer:true}],
                value:["num", { initial: 0, nullable:false, integer:true}],
                max:["num", { initial: 0, nullable:false, integer:true}],
                bonus:["obj", {
                    initial:{
                        user:0,
                    }
                }],
                malus:["obj", {
                    initial:{
                        user:0,
                    }
                }],
            }],

            // Stockage libre pour des modificateurs additionnels
            otherMods:["obj", {}],

            // Système d'immunités aux statuts
            immunity:["schema", {
                // Immunités définies manuellement par l'utilisateur
                manuel:["arr",
                    ["schema", {
                        key:["str", { initial: ""}],      // Clé du statut (ex: 'choc', 'soumission')
                        value:["num", { initial: null, nullable:true }], // Niveau d'immunité si partielle,
                        protectedBy:["str", { initial: null, nullable:true}],
                    }]
                ],
                // Immunités calculées automatiquement (ex: via overdrive)
                auto:["arr",
                    ["schema", {
                        key:["str", { initial: ""}],      // Clé du statut (ex: 'choc', 'soumission')
                        value:["num", { initial: null, nullable:true }], // Niveau d'immunité si partielle,
                        protectedBy:["str", { initial: null, nullable:true}],
                    }]
                ],
                // Fusion des immunités manuelles et automatiques (calculé dynamiquement)
                merge:["arr",
                    ["schema", {
                        key:["str", { initial: ""}],      // Clé du statut (ex: 'choc', 'soumission')
                        value:["num", { initial: null, nullable:true }], // Niveau d'immunité si partielle,
                        protectedBy:["str", { initial: null, nullable:true}],
                    }]
                ],
            }],

            options:["schema", {
                embuscadeSubis:["bool", {initial:false, nullable:false}],
                embuscadePris:["bool", {initial:false, nullable:false}],
            }],
            bonusSiEmbuscade:["schema", {
                dice:["num", { initial: 0, nullable:false, integer:true}],
                fixe:["num", { initial: 0, nullable:false, integer:true}],
            }],
            langues:["schema", {
                value:["num", { initial: 1, nullable:false, integer:true}],
                mod:["num", { initial: 0, nullable:false, integer:true}],
                bonus:["obj", {
                    "initial":{
                        user:0,
                        system:0,
                    }
                }],
            }],
        };
    }

    /**
     * Définit le schéma de données commun à tous les acteurs.
     * @returns {Object} Le schéma de données avec les champs suivants :
     * - version : Numéro de version pour la migration des données
     * - description : Description HTML complète de l'acteur
     * - descriptionLimitee : Description HTML visible en mode limité
     * - limited : Options d'affichage pour les joueurs avec accès limité
     * - otherMods : Modificateurs divers stockés en objet libre
     * - immunity : Gestion des immunités aux statuts (manuel, auto, merge)
     */
    static defineSchema() {
        return fields(this.baseDefinition);
    }
    /*static defineSchema() {
		const {SchemaField, NumberField, BooleanField, ObjectField, HTMLField, ArrayField, StringField, EmbeddedDataField} = foundry.data.fields;

        return {
            // Numéro de version pour gérer les migrations de données
            version:new NumberField({initial:0, nullable:false, integer:true}),

            // Description complète visible par le propriétaire
            description:new HTMLField({initial:""}),

            // Description restreinte visible par les autres joueurs
            descriptionLimitee:new HTMLField({initial:""}),
            defense:new EmbeddedDataField(DefensesDataModel),
            reaction:new EmbeddedDataField(DefensesDataModel),
            initiative:new EmbeddedDataField(InitiativeDataModel),

            // Options d'affichage pour les permissions limitées
            limited:new SchemaField({
                showDescriptionFull:new BooleanField({initial:false}),
                showDescriptionLimited:new BooleanField({initial:false}),
            }),

            combat:new SchemaField({
                data:new SchemaField({
                    degatsbonus:new SchemaField({
                        dice:new NumberField({ initial: 0, integer: true, nullable: false }),
                        fixe:new NumberField({ initial: 0, integer: true, nullable: false }),
                    }),
                    violencebonus:new SchemaField({
                        dice:new NumberField({ initial: 0, integer: true, nullable: false }),
                        fixe:new NumberField({ initial: 0, integer: true, nullable: false }),
                    }),
                    modificateur:new NumberField({ initial: 0, integer: true, nullable: false }),
                    sacrifice:new NumberField({ initial: 0, integer: true, nullable: false }),
                    succesbonus:new NumberField({ initial: 0, integer: true, nullable: false }),
                    tourspasses:new NumberField({ initial: 1, integer: true, nullable: false }),
                    type:new StringField({ initial: "degats"}),
                }),
                armesimprovisees:new EmbeddedDataField(ArmesImproviseesDataModel),
            }),
            sante:new SchemaField({
                base:new NumberField({initial:0, nullable:false, integer:true}),
                mod:new NumberField({initial:0, nullable:false, integer:true}),
                value:new NumberField({initial:0, nullable:false, integer:true}),
                max:new NumberField({initial:16, nullable:false, integer:true}),
                bonusValue:new NumberField({initial:0, nullable:false, integer:true}),
                malusValue:new NumberField({initial:0, nullable:false, integer:true}),
                override:new ObjectField(),
                bonus:new ObjectField({
                    initial:{
                        user:0,
                    }
                }),
                malus:new ObjectField({
                    initial:{
                        user:0,
                    }
                }),
            }),
            armure: new SchemaField({
                base:new NumberField({initial:0, min:0, nullable:false, integer:true}),
                mod:new NumberField({initial:0, nullable:false, integer:true}),
                value:new NumberField({initial:0, nullable:false, integer:true}),
                max:new NumberField({initial:0, nullable:false, integer:true}),
                bonus:new ObjectField({
                    initial:{
                    user:0,
                    }
                }),
                malus:new ObjectField({
                    initial:{
                    user:0,
                    }
                }),
            }),
            energie:new SchemaField({
                base:new NumberField({initial:0, nullable:false, integer:true}),
                mod:new NumberField({initial:0, nullable:false, integer:true}),
                value:new NumberField({initial:0, nullable:false, integer:true}),
                max:new NumberField({initial:16, nullable:false, integer:true}),
                bonus:new ObjectField({
                    initial:{
                        user:0,
                    }
                }),
                malus:new ObjectField({
                    initial:{
                        user:0,
                    }
                }),
            }),

            // Stockage libre pour des modificateurs additionnels
            otherMods:new ObjectField(),

            // Système d'immunités aux statuts
            immunity:new SchemaField({
                // Immunités définies manuellement par l'utilisateur
                manuel:new ArrayField(new SchemaField({
                    key:new StringField({initial:''}),      // Clé du statut (ex: 'choc', 'soumission')
                    value:new NumberField({initial:null, nullable:true}), // Niveau d'immunité si partielle,
                    protectedBy:new StringField({initial:null, nullable:true}),
                })),
                // Immunités calculées automatiquement (ex: via overdrive)
                auto:new ArrayField(new SchemaField({
                    key:new StringField({initial:''}),
                    value:new NumberField({initial:null, nullable:true}),
                    protectedBy:new StringField({initial:null, nullable:true}),
                })),
                // Fusion des immunités manuelles et automatiques (calculé dynamiquement)
                merge:new ArrayField(new SchemaField({
                    key:new StringField({initial:''}),
                    value:new NumberField({initial:null, nullable:true}),
                    protectedBy:new StringField({initial:null, nullable:true}),
                })),
            }),

            options:new SchemaField({
                embuscadeSubis:new BooleanField({initial:false, nullable:false}),
                embuscadePris:new BooleanField({initial:false, nullable:false}),
            }),
            bonusSiEmbuscade:new SchemaField({
                bonusInitiative:new SchemaField({
                    dice:new NumberField({ initial: 0, integer: true, nullable: false }),
                    fixe:new NumberField({ initial: 0, integer: true, nullable: false }),
                }),
            }),
            langues:new SchemaField({
                value:new NumberField({initial:1, nullable:false, integer:true}),
                mod:new NumberField({initial:0, nullable:false, integer:true}),
                bonus:new ObjectField({
                    initial:{
                      user:0,
                      system:0,
                    }
                }),
            }),
        }
    }*/

    /* -------------------------------------------- */
    /*  Getters                                     */
    /* -------------------------------------------- */

    /**
     * Récupère l'acteur parent de ce modèle de données.
     * @returns {Actor} L'acteur Foundry associé à ce modèle
     */
    get actor() {
        return this.parent;
    }

    /**
     * Récupère l'identifiant unique de l'acteur.
     * Utilise l'ID du token si l'acteur est lié à un token, sinon l'ID de l'acteur.
     * @returns {string} L'identifiant de l'acteur ou du token
     */
    get actorId() {
        return this.actor?.token ? this.actor.token.id : this.actor.id;
    }

    /**
     * Récupère la collection d'items de l'acteur.
     * @returns {Collection<Item>} La collection d'items appartenant à l'acteur
     */
    get items() {
        return this.parent.items;
    }

    get armes() {
        const base = this.items.filter(items => items.type === 'arme');
        let all = base;

        if(this.hasCyberware) {
            const wearArmor = this.actor.type === 'knight' ? this?.wear ?? 'tenueCivile' : 'armure';
            const isWearingArmor = wearArmor === 'armure' ? true : false;
            const wpnCyberware = this.items.filter(items =>
                items.type === 'cyberware' &&
                items.system.arme.has &&
                (
                    (items.system.arme.withMetaArmure && isWearingArmor) ||
                    (!items.system.arme.withMetaArmure && !isWearingArmor)
                ) &&
                items.system.isActive
            ).map(item => {
                return {
                    ...item,
                    system: {
                        ...item.system.arme,
                        equipped:true,
                    }
                };
            });

            all = all.concat(wpnCyberware)
        }

        return all;
    }
    /**
     * Calcule le modificateur aux jets d'armes à distance basé sur les statuts actifs.
     * Actuellement, seul le statut 'fumigene' applique un malus de -3.
     * @returns {number} Le modificateur total à appliquer aux jets de distance
     */
    get rollWpnDistanceMod() {
        const statuses = this.actor.statuses;
        let modificateur = 0;

        // Le fumigène réduit la visibilité, malus aux attaques à distance
        if(statuses.has('fumigene')) modificateur -= 3;

        return modificateur;
    }

    get immunityList() {
        return this?.immunity?.merge ?? [];
    }

    get cyberware() {
        return this.items.filter(items => items.type === 'cyberware');
    }

    get hasCyberware() {
        return false;
    }

    prepareBaseData() {
        super.prepareBaseData();

        //HOOK pour le début de PrepareData
        this._startPrepareData();

        //On applique les effets du cyberware
        this.applyCyberware();

        //HOOK pour la fin de PrepareData
        this._EndPrepareData();
    }

    _startPrepareData() {}
    _EndPrepareData() {}

    prepareDerivedData() {
        super.prepareDerivedData();

        //HOOK pour le début de PrepareDerivedData
        this._startPrepareDerivedData();

        //On gère les aspects
        if(this.aspects) this.aspects.prepareData();

        //On gère le cyberware
        this.#cyberware();

        //On gère les immunités
        this._setStatusImmunity();

        //HOOK pour la fin de PrepareDerivedData
        this._EndPrepareDerivedData();

        //On gère les traductions
        this._applyTranslation();
    }

    _startPrepareDerivedData() {}
    _EndPrepareDerivedData() {}

    /* -------------------------------------------- */
    /*  Méthodes liées au Cyberware            */
    /* -------------------------------------------- */

    #cyberware() {
        if(!this.hasCyberware) return;

        const cyberware = this.items.filter(items => items.type === 'cyberware' && (items.system.categorie === 'utilitaire' || items.system.categorie === 'combat'));

        if(cyberware.length) {
            Object.defineProperty(this.equipements[this.wear].energie.bonus, 'cyberware', {
                value: 20,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }
    }

    applyCyberware() {
        if(!this.hasCyberware) return;

        const getActiveEffects = () => {
            const getAllCyberwareEffects = this.cyberware
                .filter(c => (c.system.activation.has && c.system.active) || (c.system.activation.has && c.system.activation.permanent) || !c.system.activation.has)
                .flatMap(c => c.system.getAllEffects);

            return getAllCyberwareEffects;
        };

        const sanitizePath = (cyberware) => {
            let sanitized = cyberware.path;
            let apply = true;

            if (sanitized.startsWith("system.")) {
                sanitized = sanitized.substring("system.".length);
            }

            if(this.actor.type === 'knight') {
                const conditionnal = ['sante', 'champDeForce', 'armure', 'energie', 'reaction', 'defense'];

                if (conditionnal.some(k => sanitized.includes(k))) {
                    const wear = this?.wear ?? 'tenueCivile';

                    if(!sanitized.includes('.withArmor') && wear === 'armure') apply = false;
                }
            }

            sanitized = sanitized.replaceAll('.withArmor', '');

            switch(cyberware.type) {
                case 'decrease':
                    sanitized = `${sanitized}.malus`;
                    break;

                case 'override':
                    sanitized = `${sanitized}.override`;
                    break;

                default:
                    sanitized = `${sanitized}.bonus`;
                    break;
            }

            return {
                apply,
                path:sanitized,
            }
        }

        const processSpecialUpdate = (cyberware, path, toUpdate) => {
            let finalPath = path;
            if (finalPath.startsWith("system.")) {
                finalPath = finalPath.substring("system.".length);
            }

            if(finalPath.includes('noMalusStyle')) {
                toUpdate[finalPath] = cyberware.value === true || cyberware.value.toLowerCase() === "true";
            }
        }

        const processSTDUpdate = (toUpdate) => {
            for(let up in toUpdate) {
                let parts = up.split('.');
                let parent = parts.reduce((obj, key) => {
                    if (!obj[key]) obj[key] = {};
                    return obj[key];
                }, this);

                if (parent) {
                    Object.defineProperty(parent, 'cyberware', {
                        value: toUpdate[up],
                        writable: true,
                        configurable: true,
                        enumerable: true
                    });
                }
            }
        }

        const processSPEUpdate = (toUpdate) => {
            for(let up in toUpdate) {
                const parts = up.split('.');
                const lastKey = parts.pop();
                const parent = parts.reduce((obj, key) => {
                    if (!obj[key]) obj[key] = {};
                    return obj[key];
                }, this);

                if (parent) {
                    Object.defineProperty(parent, lastKey, {
                        value: toUpdate[up],
                        writable: true,
                        configurable: true,
                        enumerable: true
                    });
                }
            }
        }

        const allCyberwareEffects = getActiveEffects();
        const toUpdate = {};
        const speUpdate = {};

        for(let c of allCyberwareEffects) {
            if(!c.path) continue;

            const processPath = sanitizePath(c);

            if(!processPath.apply) continue;
            let path = processPath.path;
            const SPECIALCFG = CONFIG?.KNIGHT?.EFFECTS?.INPUTTYPE?.[c.path];

            if(SPECIALCFG) processSpecialUpdate(c, c.path, speUpdate);
            else if(c.type === 'override') {
                if(toUpdate[path]) toUpdate[path] = Math.max(Number(c.value), toUpdate[path]);
                else toUpdate[path] = Number(c.value);
            } else {
                if(toUpdate[path]) toUpdate[path] += Number(c.value);
                else toUpdate[path] = Number(c.value);
            }
        }

        if(!foundry.utils.isEmpty(toUpdate)) processSTDUpdate(toUpdate);
        if(!foundry.utils.isEmpty(speUpdate)) processSPEUpdate(speUpdate);
    }

    /* -------------------------------------------- */
    /*  Méthodes d'utilisation des armes            */
    /* -------------------------------------------- */

    /**
     * Utilise une arme standard et ouvre le dialogue de jet de dés.
     * Gère les différents types d'items (module, armure, arme, capacite) et
     * construit l'identifiant approprié pour le système de jet.
     *
     * @param {string} itemId - L'identifiant de l'item à utiliser
     * @param {Object} [args={}] - Arguments optionnels
     * @param {string} [args.type] - Type d'attaque ('distance' ou 'contact')
     * @param {string} [args.name] - Nom spécifique de l'arme/capacité
     * @returns {KnightRollDialog} L'instance du dialogue de jet ouvert
     */
    useStdWpn(itemId, args={}) {
        const actor = this.actor;
        const item = actor.items.get(itemId);
        const label = item.name;
        const {
            type,
            name,
        } = args;
        let modificateur = 0;
        let id = itemId;

        if(item) {
            switch(item.type) {
                // Modules d'armure avec armes intégrées
                case 'module':
                    id = `module_${id}`;
                    if(item.system?.niveau?.actuel?.arme?.type === 'distance') modificateur += this.rollWpnDistanceMod;
                    break;

                // Capacités spéciales de l'armure
                case 'armure':
                    switch(name) {
                      // Capacité CEA (Rayon, Salve, Vague)
                      case 'rayon':
                      case 'salve':
                      case 'vague':
                        // Suffixe D pour distance, C pour contact
                        id = type === 'distance' ? `capacite_${id}_cea${name.charAt(0).toUpperCase() + name.substr(1)}D` : `capacite_${id}_cea${name.charAt(0).toUpperCase() + name.substr(1)}C`;

                        if(type === 'distance') modificateur += this.rollWpnDistanceMod;
                        break;

                      // Capacité Borealis
                      case 'borealis':
                        id = type === 'distance' ? `capacite_${id}_borealisD` : `capacite_${id}_borealisC`;

                        if(type === 'distance') modificateur += this.rollWpnDistanceMod;
                        break;

                      // Capacité Morph (transformations d'armes)
                      case 'lame':
                      case 'griffe':
                      case 'canon':
                      case 'lame2':
                      case 'griffe2':
                      case 'canon2':
                        id = `capacite_${id}_morph${name.charAt(0).toUpperCase() + name.substr(1)}`;
                        break;
                    }
                    break;

                // Armes classiques
                case 'arme':
                    if(item.system.type === 'distance') modificateur += this.rollWpnDistanceMod;
                    break;

                // Capacités de PNJ
                case 'capacite':
                    if(item.system.attaque.type === 'distance') modificateur += this.rollWpnDistanceMod;

                    id = `pnjcapacite_${id}`;
                    break;
            }
        }

        const actorId = this.actorId;
        let rollData = {
            label:label,
            wpn:id,
            modificateur
        };

        // Pour les véhicules, on doit savoir qui active l'arme
        if(actor.type === 'vehicule' && item) {
            rollData.whoActivate = item.type === 'module' ? item.system?.niveau?.actuel?.whoActivate : item.system.whoActivate;
        }

        // Création et ouverture du dialogue de jet
        const dialog = new game.knight.applications.KnightRollDialog(actorId, rollData);

        dialog.open();

        return dialog
    }

    /**
     * Point d'entrée principal pour l'utilisation des armes.
     * Délègue au handler approprié selon le type d'arme, ou utilise le fallback standard.
     *
     * @param {string} [wpnType=''] - Le type d'arme à utiliser
     * @param {Object} [args={}] - Arguments passés au handler
     * @param {string} [args.id] - Identifiant de l'item
     * @param {string} [args.type] - Type d'attaque
     * @param {string} [args.num] - Numéro/nom de l'arme
     * @returns {*} Le résultat du handler d'arme
     */
    useWpn(wpnType = '', args = {}) {
        const handlers = this._getWeaponHandlers();
        const handler = handlers[wpnType];

        if (handler) {
            return handler.call(this, args);
        }

        // Fallback vers la méthode standard si pas de handler spécifique
        return this.useStdWpn(args.id, { type: args.type, name: args.num });
    }

    /**
     * Retourne les handlers d'armes spécifiques à ce type d'acteur.
     * Cette méthode est destinée à être surchargée dans les classes enfants
     * pour fournir des comportements personnalisés selon le type d'acteur.
     *
     * @returns {Object} Un objet mappant les types d'armes à leurs handlers
     * @protected
     */
    _getWeaponHandlers() {
        return {};
    }

    /* -------------------------------------------- */
    /*  Méthodes de gestion des statuts             */
    /* -------------------------------------------- */

    /**
     * Calcule et définit les immunités aux statuts de l'acteur.
     * Les immunités sont déterminées selon le type d'acteur et ses caractéristiques.
     * Pour les chevaliers, les immunités dépendent de l'overdrive d'Endurance
     * et du mode de jeu (ADL ou standard).
     *
     * Règles d'immunité pour les chevaliers (en armure ou ascension) :
     *
     * Mode ADL (À dos de Lion) :
     * - Endurance OD 2+ : Immunité totale à la Soumission
     * - Endurance OD 4+ : Immunité totale au Choc
     *
     * Mode Standard :
     * - Endurance OD 2+ : Immunité au Choc niveau 1
     * - Endurance OD 4+ : Immunité totale au Choc
     *
     * @returns {void}
     */
    _setStatusImmunity() {
        const actor = this.actor;
        const type = actor.type;
        const immunity = [];

        switch(type) {
            case 'knight':
                const wear = this.wear ?? undefined;

                // Sans équipement, pas d'immunité
                if(!wear) return;

                // Les immunités ne s'appliquent qu'en armure ou en ascension
                if(wear === 'armure' || wear === 'ascension') {
                    // Récupération du paramètre ADL (Arsenal de Légende - règles alternatives)
                    const adl = game.settings.get("knight", "adl");

                    // Niveau d'overdrive en Endurance (aspect Chair)
                    const endurance = this.aspects?.chair?.caracteristiques?.endurance?.overdrive?.value ?? 0;
                    const protectedBy = game.i18n.localize('KNIGHT.ASPECTS.CHAIR.CARACTERISTIQUES.ENDURANCE.Full');

                    if(adl) {
                        // Règles ADL : immunités différentes
                        if(endurance >= 2) immunity.push({
                            key:'soumission',
                            protectedBy,
                        });

                        if(endurance >= 4) immunity.push({
                            key:'choc',
                            protectedBy,
                        }, {
                            key:'electrifiee',
                            protectedBy,
                        });
                    } else {
                        // Règles standard : immunité progressive au choc
                        if(endurance >= 2) immunity.push({
                            key:'choc',
                            value:1,
                            protectedBy,
                        }, {
                            key:'electrifiee',
                            protectedBy,
                        });

                        if(endurance >= 4) immunity.push({
                            key:'choc',
                            value:2,
                            protectedBy,
                        });
                    }
                }
                break;

            case 'pnj':
            case 'creature':
            case 'bande':
                const chairAE = this.aspects?.chair?.ae?.majeur?.value ?? 0;

                if(chairAE > 0) {
                    const protectedBy = game.i18n.localize('KNIGHT.JETS.CHAIR.Majeur');

                    immunity.push({
                        key:'choc',
                        protectedBy,
                    }, {
                        key:'electrifiee',
                        protectedBy,
                    }, {
                        key:'barrage',
                        protectedBy
                    }, {
                        key:'meurtrier',
                        protectedBy
                    });
                }

                if(this.colosse) {
                    const protectedBy = game.i18n.localize('KNIGHT.Colosse');

                    immunity.push({
                        key:'soumission',
                        protectedBy,
                    });
                }
                break;

            case 'mechaarmure':
                const protectedBy = game.i18n.localize('KNIGHT.Colosse');

                immunity.push({
                    key:'soumission',
                    protectedBy,
                });
                break;
        }

        // Fusion des immunités automatiques avec les immunités manuelles
        // Utilisation de Object.defineProperty pour écraser la propriété calculée
        Object.defineProperty(this.immunity, 'merge', {
            value: immunity.concat(this.immunity.manuel),
            writable:true,
            enumerable:true,
            configurable:true
        });
    }

    /* -------------------------------------------- */
    /*  Méthodes de gestion des traductions             */
    /* -------------------------------------------- */

    _applyTranslation() {
        const translations = {};

        Object.defineProperty(this.actor, 'translations', {
            value: translations,
            writable:true,
            enumerable:true,
            configurable:true
        });
    }

    givePE(energy, autoApply=true) {
      let path = `system.energie.value`;
      let value = this.energie.value;
      let update = {}

      update[path] = `${value+energy}`;

      if(autoApply) this.actor.update(energy);
      else return update;
    }
}
