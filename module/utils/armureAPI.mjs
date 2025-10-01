import {
  capitalizeFirstLetter,
} from "../helpers/common.mjs";

export class ArmureAPI {
    /**
     * @param {Item} armureItem - l'Item d’armure (Document Foundry)
     */
    constructor(armureItem) {
      if (!armureItem) throw new Error('ArmureAPI: armureItem requis');
      this.item = armureItem;
      this._sysCache = null; // snapshot optionnel
    }

    // Accès système (snapshot local pour éviter un GET réseau)
    get sys() {
      // on retourne un snapshot immuable (deepClone) pour lecture sûre si nécessaire
      return this.item.system;
    }
    snapshot() {
      if (!this._sysCache) this._sysCache = foundry.utils.deepClone(this.item.system);
      return this._sysCache;
    }
    clearSnapshot() { this._sysCache = null; }

    // -------------------------
    // LECTURE STANDARD (getters)
    // -------------------------
    get img() {
        return this.item.img ?? "";
    }

    get generation() { return this.sys.generation ?? 1; }

    // jauges on/off
    get gauges() { return this.sys.jauges ?? {}; }
    get hasArmure() { return !!this.gauges.armure; }
    get hasCDF()    { return !!this.gauges.champDeForce; }
    get hasEgide()  { return !!this.gauges.egide; }
    get hasEnergie(){ return !!this.gauges.energie; }
    get hasEspoir() { return !!this.gauges.espoir; }
    get hasFlux()   { return !!this.gauges.flux; }
    get hasSante()  { return !!this.gauges.sante; }
    get hasHeroisme()   { return !!this.gauges.heroisme; }

    // valeurs numériques
    get armure() { return Number(this.sys.armure?.base ?? 0); }
    get cdf()    { return Number(this.sys.champDeForce?.base ?? 0); }
    get egide()      { return Number(this.sys.egide?.value ?? 0); }
    get energie()    { return Number(this.sys.energie?.base ?? 0); }
    get espoir()     { return Number(this.sys.espoir?.value ?? 0); }
    get flux()       { return Number(this.sys.flux?.value ?? 0); }

    // espoir config
    get espoirBonus()   { return !!this.sys.espoir?.bonus; }
    get espoirCout()    { return Number(this.sys.espoir?.cout ?? 2); }
    get espoirRemplaceEnergie() { return !!this.sys.espoir?.remplaceEnergie; }

    // slots
    get slots() { return this.sys.slots ?? {}; }
    get slotTete()    { return Number(this.slots.tete?.value ?? 0); }
    get slotTorse()   { return Number(this.slots.torse?.value ?? 0); }
    get slotBrasG()   { return Number(this.slots.brasGauche?.value ?? 0); }
    get slotBrasD()   { return Number(this.slots.brasDroit?.value ?? 0); }
    get slotJambeG()  { return Number(this.slots.jambeGauche?.value ?? 0); }
    get slotJambeD()  { return Number(this.slots.jambeDroite?.value ?? 0); }

    // overdrives familles (lecture rapide)
    get overdrives() { return this.sys.overdrives ?? {}; }
    get OD() { return {
      chair: {
        deplacement: Number(this.overdrives?.chair?.liste?.deplacement?.value ?? 0),
        force:       Number(this.overdrives?.chair?.liste?.force?.value ?? 0),
        endurance:   Number(this.overdrives?.chair?.liste?.endurance?.value ?? 0),
      },
      bete: {
        hargne: Number(this.overdrives?.bete?.liste?.hargne?.value ?? 0),
        combat: Number(this.overdrives?.bete?.liste?.combat?.value ?? 0),
        instinct: Number(this.overdrives?.bete?.liste?.instinct?.value ?? 0),
      },
      machine: {
        tir: Number(this.overdrives?.machine?.liste?.tir?.value ?? 0),
        savoir: Number(this.overdrives?.machine?.liste?.savoir?.value ?? 0),
        technique: Number(this.overdrives?.machine?.liste?.technique?.value ?? 0),
      },
      dame: {
        aura: Number(this.overdrives?.dame?.liste?.aura?.value ?? 0),
        parole: Number(this.overdrives?.dame?.liste?.parole?.value ?? 0),
        sangFroid: Number(this.overdrives?.dame?.liste?.sangFroid?.value ?? 0),
      },
      masque: {
        discretion: Number(this.overdrives?.masque?.liste?.discretion?.value ?? 0),
        dexterite: Number(this.overdrives?.masque?.liste?.dexterite?.value ?? 0),
        perception: Number(this.overdrives?.masque?.liste?.perception?.value ?? 0),
      },
    };}

    // profils “packagés” utiles
    get profile() {
      const s = this.sys;
      return {
        // on/off
        hasArmure: !!s.jauges?.armure,
        hasCDF: !!s.jauges?.champDeForce,
        hasEgide: !!s.jauges?.egide,
        hasEnrthir: !!s.jauges?.energie,
        hasEspoir: !!s.jauges?.espoir,
        hasFlux: !!s.jauges?.flux,
        hasSante: !!s.jauges?.sante,
        hasHeroisme: !!s.jauges?.heroisme,
        // valeurs
        armure: Number(s.armure?.base ?? 0),
        champDeForce: Number(s.champDeForce?.base ?? 0),
        egide: Number(s.egide?.value ?? 0),
        energie: Number(s.energie?.base ?? 0),
        espoir: Number(s.espoir?.value ?? 0),
        flux: Number(s.flux?.value ?? 0),
        // slots
        slots: {
          tete: Number(s.slots?.tete?.value ?? 0),
          torse: Number(s.slots?.torse?.value ?? 0),
          brasGauche: Number(s.slots?.brasGauche?.value ?? 0),
          brasDroit: Number(s.slots?.brasDroit?.value ?? 0),
          jambeGauche: Number(s.slots?.jambeGauche?.value ?? 0),
          jambeDroite: Number(s.slots?.jambeDroite?.value ?? 0),
        },
        // espoir conf
        espoirBonus: !!s.espoir?.bonus,
        espoirCout: Number(s.espoir?.cout ?? 2),
        espoirRemplaceEnergie: !!s.espoir?.remplaceEnergie,
      };
    }

    // --------------
    // RECHERCHES
    // --------------
    get capacites() {
        // Sécurisé: si le chemin n'existe pas, retourne un objet vide
        return foundry.utils.getProperty(this.sys, 'capacites.selected') ?? {};
    }

    get special() {
        // Sécurisé: si le chemin n'existe pas, retourne un objet vide
        return foundry.utils.getProperty(this.sys, 'special.selected') ?? {};
    }

    get ListCapaciteProlongated() {
      const list = [
        'totem',
        'companions',
        'changeling',
        'ghost',
        'illumination',
        'nanoc',
        'puppet',
        'discord',
        'shrine',
        'type',
        'warlord',
      ];

      return list;
    }

    get listSpecial() {
      const root = foundry.utils.getProperty(this.sys, 'special.selected');

      if (!root || typeof root !== 'object') return null;
      return Object.keys(root);
    }

    /**
     * Retourne la capacité (enfant direct) sous la clé donnée, ou null si absente.
     * @param {string} key - Clé directe dans l'objet ciblé (ex: "bouclier")
     * @param {string} [path='capacites.selected'] - Chemin vers l'objet parent
     */
    getCapacite(key, path = 'capacites.selected') {
        const root = foundry.utils.getProperty(this.sys, path);
        if (!root || typeof root !== 'object') return null;
        return Object.prototype.hasOwnProperty.call(root, key) ? root[key] : null;
    }

    /**
     * Retourne la capacité (enfant direct) sous la clé donnée, ou null si absente.
     * @param {string} key - Clé directe dans l'objet ciblé (ex: "bouclier")
     * @param {string} [path='capacites.selected'] - Chemin vers l'objet parent
     */
    getSpecial(key, path = 'special.selected') {
        const root = foundry.utils.getProperty(this.sys, path);
        if (!root || typeof root !== 'object') return null;
        return Object.prototype.hasOwnProperty.call(root, key) ? root[key] : null;
    }

    getCapaciteActiveName(capacite, special = '', variant = '') {
      const baseStr = `KNIGHT.ITEMS.ARMURE.CAPACITES`;
      let result = ``;

      const translate = (str) => {
        return game.i18n.localize(str);
      }

      switch(capacite) {
        case 'illumination':
          result = translate(`${baseStr}.${capacite.toUpperCase()}.Label`)
          result += ` : ${translate(`${baseStr}.${capacite.toUpperCase()}.${special.toUpperCase()}.Label`)}`;
          break;

        case 'changeling':
          if(special === 'explosive') {
            result = translate(`${baseStr}.${capacite.toUpperCase()}.Label`);
            result += ` : ${translate(`${baseStr}.${capacite.toUpperCase()}.DesactivationExplosive`)}`;
          }
          else result = translate(`${baseStr}.${capacite.toUpperCase()}.Label`);
          break;

        case 'morph':
          if(!special) result = translate(`${baseStr}.${capacite.toUpperCase()}.Label`);
          else if(variant !== 'choix') {
            result = translate(`${baseStr}.${capacite.toUpperCase()}.CAPACITES.${special.includes('polymorphie') ? 'POLYMORPHIE' : special.replace('N2', '').toUpperCase()}.${special === 'phaseN2' ? 'Label2' : 'Label'}`);
            if(special.includes('polymorphie')) result += ` : ${translate(`${baseStr}.${capacite.toUpperCase()}.CAPACITES.POLYMORPHIE.${capitalizeFirstLetter(special.replace('polymorphie', ''))}`)}`
          }
          break;

        case 'warlord':
          result = translate(`${baseStr}.${capacite.toUpperCase()}.Label`);
          result += ` : ${translate(`${baseStr}.${capacite.toUpperCase()}.IMPULSIONS.${special.toUpperCase()}.Label`)}`;
          break;

        case 'type':
          result = translate(`${baseStr}.${capacite.toUpperCase()}.Label`);
          result += ` : ${translate(`${baseStr}.${capacite.toUpperCase()}.TYPE.${capitalizeFirstLetter(special)}`)}`;
          break;

        case 'discord':
          result = translate(`${baseStr}.${capacite.toUpperCase()}.Label`);
          result += special === 'tour' ? ` : ${game.i18n.localize("KNIGHT.DUREE.UnTour")}` : ` : ${game.i18n.localize("KNIGHT.DUREE.ConflitPhase")}`;
          break;

        case 'mechanic':
          result = translate(`${baseStr}.${capacite.toUpperCase()}.Label`);
          result += ` : ${translate(`KNIGHT.AUTRE.${capitalizeFirstLetter(special)}`)}`
          break;

        case 'nanoc':
          result = translate(`${baseStr}.${capacite.toUpperCase()}.Label`);
          result += ` : ${translate(`${baseStr}.${capacite.toUpperCase()}.Objet${capitalizeFirstLetter(special)}`)}`;
          break;

        default:
          result = translate(`${baseStr}.${capacite.toUpperCase()}.Label`);
          break;
      }

      return result;
    }

    getSpecialActiveName(capacite, special = '', variant = '') {
      const baseStr = `KNIGHT.ITEMS.ARMURE.SPECIAL`;
      let result = ``;

      const translate = (str) => {
        return game.i18n.localize(str);
      }

      switch(capacite) {
        default:
          result = translate(`${baseStr}.${capacite.toUpperCase()}.Label`);
          break;
      }

      return result;
    }

    getCapaciteActivePath(capacite, special = '', variant = '') {
      const baseStr = `capacites.selected`;
      let result;

      switch(capacite) {
        case 'ascension':
            result = `${baseStr}.${capacite}`;
            break;

        case 'rage':
            result = !special ? [
              `${baseStr}.${capacite}.active`,
              `${baseStr}.${capacite}.niveau`,
            ] : `${baseStr}.${capacite}.${special}`;
            break;

        case 'changeling':
          if(special === 'explosive') {
            result = [
              `${baseStr}.${capacite}.active.personnel`,
              `${baseStr}.${capacite}.active.etendue`,
              `${baseStr}.${capacite}.active.fauxEtre`,
            ];
          } else {
            result = `${baseStr}.${capacite}.active.${special}`;
          }
          break;

        case 'discord':
        case 'nanoc':
        case "borealis":
        case "illumination":
          result = `${baseStr}.${capacite}.active.${special}`;
          break;

        case "morph":
          if(special !== 'polymorphieReset' && variant !== 'choix') result = `${baseStr}.${capacite}.active.${!special ? 'morph' : special}`;
          else if(special !== 'polymorphieReset' && variant === 'choix') result = `${baseStr}.${capacite}.choisi.${special}`;
          else if(special === 'polymorphieReset') result = `${baseStr}.${capacite}.active`;
          break;

        case 'ghost':
          result = `${baseStr}.${capacite}.active.${special}`;
          break;

        case 'warlord':
          result = variant ? `${baseStr}.${capacite}.active.${special}.${variant}` : `${baseStr}.${capacite}.active.${special}`;
          break;

        case 'type':
          result = `${baseStr}.${capacite}.type.${special}.${variant}`;
          break;

        default:
          result = `${baseStr}.${capacite}.active`;
          break;
      }

      return result;
    }

    /**
     * Indique si une capacité existe (clé directe).
     */
    hasCapacite(key, path = 'capacites.selected') {
        const root = foundry.utils.getProperty(this.sys, path);
        return !!(root && typeof root === 'object' && Object.prototype.hasOwnProperty.call(root, key));
    }

    isCapaciteActive(capacite, special = '', variant = '') {
      const path = this.getCapaciteActivePath(capacite, special, variant);
      const data = Array.isArray(path) ? foundry.utils.getProperty(this.sys, path[0]) : foundry.utils.getProperty(this.sys, path)
      let result = false;

      switch(capacite) {
        case 'ascension': {
          result = data.active;
          break;
        }

        case "borealis":
        case "goliath":
        case "puppet":
        case "record":
        case "totem":
        case "watchtower":
        case 'changeling':
        case "ghost":
        case "discord":
        case "nanoc":
        case "illumination":
        case "warlord":
        case "type":
          result = data;
          break;

        case "morph":
          result = special !== 'phase' && special !== 'phaseN2' ? data : false;
          break;

        case 'rage':
          result = special !== 'niveau' && special !== 'blaze' ? data : false;
          break;

        case "companions":
          result = data[special];
          break;

        case "shrine":
          result = data.base;
          break;
      }

      return result;
    }

    capaciteCanBeProlongated(capacite, special = '', variant = '') {
      const isActive = this.isCapaciteActive(capacite, special, variant);
      const canBeProlongated = this.ListCapaciteProlongated;

      if(!isActive) return false;

      if(canBeProlongated.includes(capacite)) {
        if(capacite === 'warlord' && special === 'action') return false;
        else return true;
      }
      else return false;
    }

    // --------------
    // Utilitaires divers
    // --------------
    get(path) { return foundry.utils.getProperty(this.item, path); }
    getSys(path) { return foundry.utils.getProperty(this.sys, path); }
    cloneSys() { return foundry.utils.deepClone(this.sys); }
}

// Export par défaut si tu préfères
export default ArmureAPI;