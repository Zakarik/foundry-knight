import {
  capitalizeFirstLetter,
} from "../helpers/common.mjs";

export class ArmureLegendeAPI {
    /**
     * @param {Item} armureItem - l'Item d’armure (Document Foundry)
     */
    constructor(armureItem) {
      if (!armureItem) throw new Error('ArmureLegendeAPI: armureItem requis');
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
        case "warlord":
        case "type":
          result = data;
          break;

        case "illumination":
          if(special === 'candle') result = false;
          else result = data;
          break;

        case "morph":
          if(variant === 'choix') result = data;
          else result = special !== 'phase' && special !== 'phaseN2' ? data : false;

          break;

        case 'rage':
          result = special !== 'niveau' && special !== 'blaze' ? data : false;
          break;

        case "companions":
          result = data?.[special];
          break;

        case "shrine":
          result = data?.base;
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
export default ArmureLegendeAPI;