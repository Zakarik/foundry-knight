/**
 * Registre des armes personnalisées.
 * Permet d'enregistrer des handlers spécifiques pour différents types d'armes.
 * @type {Object}
 */
const registryWpn = {};

/**
 * Handler par défaut pour les armes.
 * Fournit une méthode activate vide qui peut être surchargée.
 * @type {Object}
 */
const wpnDefaultHandler = {
  async activate() {}
};

/**
 * Modèle de données de base pour tous les acteurs du système Knight.
 * Cette classe abstraite définit le schéma commun et les méthodes partagées
 * par tous les types d'acteurs (knight, creature, bande, ia, vehicule, mechaarmure).
 * @extends {foundry.abstract.TypeDataModel}
 */
export class BaseActorDataModel extends foundry.abstract.TypeDataModel {

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
		const {SchemaField, NumberField, BooleanField, ObjectField, HTMLField, ArrayField, StringField} = foundry.data.fields;

        return {
            // Numéro de version pour gérer les migrations de données
            version:new NumberField({initial:0, nullable:false, integer:true}),

            // Description complète visible par le propriétaire
            description:new HTMLField({initial:""}),

            // Description restreinte visible par les autres joueurs
            descriptionLimitee:new HTMLField({initial:""}),

            // Options d'affichage pour les permissions limitées
            limited:new SchemaField({
                showDescriptionFull:new BooleanField({initial:false}),
                showDescriptionLimited:new BooleanField({initial:false}),
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
            })
        }
    }

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
}
