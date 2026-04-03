
import {
    capitalizeFirstLetter,
    getDefaultImg,
    convertJsonEffects,
  } from "../helpers/common.mjs";

const knighttoolsURL = `https://beta.knightools.fr/fr/`;

async function importFromKJS(features) {
  const includeFeatures = ['cyberware'];
  const token = game.settings.get("knight", "KJSToken");

  const kjsCompendium = async (name) => {
    let pack = game.packs.get(`world.kjs-${name}`);

    if (!pack) {
      pack = await CompendiumCollection.createCompendium({
        label:game.i18n.localize(`ITEM.Type${capitalizeFirstLetter(name)}`),
        name:`kjs-${name}`,
        type:'Item',
      });
    } else pack.configure({locked: false});

    return pack;
  }

  const kjsUrl = async (token, url) => {
    const responseKJS = await fetch(
      url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await responseKJS.json();

    return {
      next:data?.next,
      data:data?.results ?? [],
      count:data?.count ?? 0,
    }
  }

  const sanitize = (string) => {
    let result = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\s-]/g, "").toLowerCase();;

    switch(result) {
    }

    return result;
  }

  const kjsDataCyberware = async (pack, data, importedCompendium) => {
    const regexRecup = (text) => {
      const regex = /(\d+)D(\d+)(?:\+(\d+))?\s+points\s+d[e''](\w+).*?(\w+)\s+fois/i;
      const match = text.match(regex);

      if(match) {
          const nbDice = parseInt(match[1]);       // 1
          const nbFace = parseInt(match[2]);       // 3
          const bonus = parseInt(match[3]) || 0;   // 2 (ou 0 si absent)
          const type = match[4];                   // "espoir"
          const frequence = match[5];              // "une"

          const wordToNumber = {
              'une': 1, 'un': 1,
              'deux': 2,
              'trois': 3,
              'quatre': 4,
              'cinq': 5,
              'six': 6,
              'sept': 7,
              'huit': 8,
              'neuf': 9,
              'dix': 10
          };

          const frequenceNum = wordToNumber[frequence.toLowerCase()] ?? parseInt(frequence) ?? 0;

          return {
            nbDice,
            nbFace,
            bonus,
            type,
            frequenceNum
          }
      }
    }

    const regexWpn = (text) => {
        const armeRegex = /l['']arme\s+(.+?)\s*[,]?\s+(?:mais|et|qui|\.)/i;
        const noMetaArmure = /ne peut pas être utilisé en méta-armure/i.test(text);

        const match = text.match(armeRegex);

        if(match) {
            const nomArme = match[1];  // "épée cinétique"

            return {
                nomArme,
                noMetaArmure,
            }
        }
    }

    const regexModule = (text) => {
    if (/l['']équivalent\s+(?:du|d['']un)\s+module\s+.+?\s+ou\s+/i.test(text)) {
        return null;
    }

    const noMetaArmure = /ne peut pas être utilisé en méta-armure/i.test(text);

    const regexEffets = /l['']équivalent\s+(?:du|d['']un)\s+(module\s+(?:de\s+|d[''])?(.+?))\s+au\s+niveau\s+(\d+)\s+avec\s+(?:l['']effets?|les\s+effets?)\s+(.+?)(?:\s+qui\s|(?:\.\s)|(?:\.\s*$)|\s*$)/i;
    const matchEffets = text.match(regexEffets);

    if (matchEffets) {
        let degats = 0;
        let violence = 0;

        const rawEffets = matchEffets[4]
            .replace(/\s*Ne peut pas être utilisé en méta-armure\.?\s*/i, '')
            .split(/\s*,\s*|\s+et\s+/)
            .filter(e => e.trim());

        const effets = [];

        for (const e of rawEffets) {
            const matchDegats = e.trim().match(/^\+?(\d+)[dD]6?\s+aux?\s+dégâts$/i);
            const matchViolence = e.trim().match(/^\+?(\d+)[dD]6?\s+[àa]\s+la\s+violence$/i);

            if (matchDegats) {
                degats = parseInt(matchDegats[1]);
            } else if (matchViolence) {
                violence = parseInt(matchViolence[1]);
            } else {
                const parts = e.trim().match(/^(.+?)\s+(\d+)$/);
                const obj = parts
                    ? { name: parts[1].trim(), value: parseInt(parts[2]) }
                    : { name: e.trim(), value: 0 };
                effets.push(convertJsonEffects(obj));
            }
        }

        return {
            nomAvecModule: matchEffets[1].trim(),
            nomSansModule: matchEffets[2].trim(),
            niveau: parseInt(matchEffets[3]),
            effets,
            degats,
            violence,
            noMetaArmure,
        };
    }

    const regexSimple = /l['']équivalent\s+(?:du|d['']un)\s+(module\s+.+?)(?:\s+au\s+niveau\s+(\d+))?(?:\s*[.,]|\s*$)/i;
    const matchSimple = text.match(regexSimple);

    if (matchSimple) {
        return {
            nomAvecModule: matchSimple[1],
            nomSansModule: matchSimple[1]
                .replace(/^module\s+/i, "")
                .replace(/^(l['']|d['']|de\s+|des\s+|du\s+|le\s+|la\s+|les\s+)/i, ""),
            niveau: matchSimple[2] ? parseInt(matchSimple[2]) : 1,
            effets: [],
            degats: 0,
            violence: 0,
            noMetaArmure,
        };
    }

    return null;
    };

    const regexReserve = (text) => {
      const mapping = {
          'PE': 'system.energie',
          'PS': 'system.sante',
          'CdF': 'system.champDeForce',
      };

      const match = text.match(/réserve\s+de\s+(\d+)\s+(PE|PS|CdF)\s+supplémentaires/i);

      if (!match) return null;

      return {
          path: mapping[match[2]],
          value: parseInt(match[1]),
      };
    };

    const regexBonus = (text) => {
      const mapping = {
          'réaction': 'system.reaction',
          'défense': 'system.defense',
      };

      const match = text.match(/[Dd]urant\s+une\s+(?:scène|phase\s+de\s+conflit).*?bonus\s+de\s+\+(\d+)\s+en\s+(réaction|défense)/i);

      if (!match) return null;

      return {
          activable: true,
          path: mapping[match[2].toLowerCase()],
          value: parseInt(match[1]),
      };
    };



    function normalize(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    let item = {
      name:data.name,
      type:'cyberware',
      img:getDefaultImg('cyberware'),
      system:{
        marque:data.brand,
        categorie:data.type.name.toLowerCase(),
        description:`<p style='text-align:justify'>${data.description}</p><p>${data.effect}</p>`,
        prix:data.cost,
        effects:{
          list:[]
        }
      }
    };

    let folder = data.type;

    if(data.activation) {
      item.system.activation = {
        has:true,
        type:data.activation.toLowerCase(),
        energie:data.energy,
        duration:data.duration,
        permanent:data.duration === 'Toujours' ? true : false,
      }
    }

    if(data.optimized) {
      item.system.optimisation = {
        has:data.optimized
      };
    }

    if(data.characteristic) {
      item.system.effects.has = true;
      item.system.effects.list.push({
        type:'add',
        path:`system.aspects.${sanitize(data.characteristic.aspect)}.caracteristiques.${sanitize(data.characteristic.name)}`,
        value:1,
      })
    }

    const recuperation = regexRecup(data.effect);

    if(recuperation) {
      item.system.recuperation = {
        has:true,
        dice:recuperation.nbDice,
        face:recuperation.nbFace,
        type:recuperation.type,
        limite:{
          value:recuperation.frequenceNum,
          max:recuperation.frequenceNum,
        }
      }
    }

    const arme = regexWpn(data.effect);

    if(arme && importedCompendium.length > 0) {
        const find = importedCompendium.find(itm => normalize(itm.name) === normalize(arme.nomArme));
        if(find) {
            item.system.arme = {
                has:true,
                type:find.system.type,
                portee: find.system.portee,
                optionsmunitions: find.system.optionsmunitions,
                degats:find.system.degats,
                violence:find.system.violence,
                effets: find.system.effets,
                withMetaArmure:!arme.noMetaArmure,
            }
        }
        else {
            ui.notifications.error("KNIGHT.IMPORT.Notification-import-not-found", {format:{equipement:arme.nomArme, cyberware:data.name}});
        }
    } else if(arme) {
        ui.notifications.error("KNIGHT.IMPORT.Notification-import-not-found", {format:{equipement:arme.nomArme, cyberware:data.name}});
    }

    const module = regexModule(data.effect);

    if(module && importedCompendium.length > 0) {
        const find = importedCompendium.find(
          itm => normalize(itm.name) === normalize(module.nomAvecModule) ||
          normalize(itm.name) === normalize(module.nomSansModule))  ||
          importedCompendium.find(itm =>
            normalize(itm.name).includes(normalize(module.nomSansModule)) ||
            normalize(module.nomSansModule).includes(normalize(itm.name))
          );
        if(find) {
          let moduleDesc = find.system.description;

          if(module.niveau) {
            const niveauSuivant = module.niveau + 1;
            const regex = new RegExp(`<h2>\\s*Niveau\\s+${niveauSuivant}\\s*</h2>[\\s\\S]*$`, 'i');
            moduleDesc = moduleDesc.replace(regex, '');
          }

          item.system.description += `${moduleDesc}`

          const dataModule = find.system.niveau.details[`n${module.niveau}`];

          if(dataModule) {
            item.system.arme = dataModule.arme;
            if(module.effets) item.system.arme.effets.raw = module.effets;
            if(module.degats) item.system.arme.degats.dice += module.degats;
            if(module.violence) item.system.arme.violence.dice += module.violence;
            item.system.arme.withMetaArmure = !module.noMetaArmure;
            item.system.degats = dataModule.bonus.degats;
            item.system.degats.withMetaArmure = !module.noMetaArmure;
            item.system.violence = dataModule.bonus.violence;
            item.system.violence.withMetaArmure = !module.noMetaArmure;
          } else {
              ui.notifications.error("KNIGHT.IMPORT.Notification-import-error", {format:{name:data.name}});
          }
        }
        else {
            ui.notifications.error("KNIGHT.IMPORT.Notification-import-not-found", {format:{equipement:module?.nomAvecModule, cyberware:data.name}});
        }
    } else if(module) {
        ui.notifications.error("KNIGHT.IMPORT.Notification-import-not-found", {format:{equipement:module?.nomAvecModule, cyberware:data.name}});
    }

    const reserve = regexReserve(data.effect);

    if(reserve) {
      item.system.effects.has = true;
      item.system.effects.list.push({
        type:'add',
        path:reserve.path,
        value:reserve.value,
      });
    }

    const bonus = regexBonus(data.effect);

    if(bonus) {
      item.system.effects.has = true;
      item.system.effects.list.push({
        type:'add',
        path:bonus.path,
        value:bonus.value,
      });
    }

    const documents = await pack.getDocuments();
    const found = documents.find(itm => itm.getFlag('world', 'kjs') === data.slug);

    let create = null;
    let update = null;

    if(found) update = {
      _id:found.id,
      ...item,
    };
    else create = item;

    return {
      create,
      update,
      folder
    };
  }

  const kjsImportCompendiumData = async () => {
    const packs = game.packs;
    const list = ['standard', 'avance', 'rare'];
    const result = [];

    for(let p of list) {
      const packW = packs.get(`knight-compendium.weapons-${p}`);
      const packM = packs.get(`knight-compendium.modules-${p}`);
      if(packW) result.push(...await packW.getDocuments());
      if(packM) result.push(...await packM.getDocuments());
    }

    return result;
  }

  const kjsImportData = async (pack, type, data, importedCompendium) => {
    let result = undefined;

    switch(type) {
      case 'cyberware':
        result = await kjsDataCyberware(pack, data, importedCompendium);
        break;
    }

    return result;
  }

  const importedCompendium = await kjsImportCompendiumData();

  for(let f of features) {
    if(!includeFeatures.includes(f)) continue;
    const getActuelAuthorized = game.settings.get("knight", "PatreonAuthorized");

    if(!getActuelAuthorized.includes(f)) {
      const patreonAuthorized = getActuelAuthorized;
      patreonAuthorized.push(f);
      await game.settings.set("knight", "PatreonAuthorized", patreonAuthorized);
    }

    let url = `${knighttoolsURL}api/foundry/${f}/`;
    const pack = await kjsCompendium(f);
    const toCreate = [];
    const toUpdate = [];
    const progress = ui.notifications.info(`KNIGHT.IMPORT.Notification-import`, {format:{import:f},progress: true});
    let pct = 0;

    while (url) {
      const result = await kjsUrl(token, url);
      const count = result.count;

      for(let d of result.data) {
        pct += 1/count;
        const item = await kjsImportData(pack, f, d, importedCompendium);
        const findFolder = pack.folders.find(p => p.name === item.folder.name);
        let createFolder = {};

        if(!findFolder) {
          createFolder = await Folder.create({
            name: item.folder.name,
            type: "Item",
            folder: null, // null = racine, ou l'ID d'un dossier parent
          }, { pack: pack.collection });
        } else createFolder.id = findFolder.id;

        if(item.create) {
          toCreate.push({
            ...item.create,
            folder:createFolder.id,
            flags: { world: { kjs: d.slug } },
          });
        } else if(item.update) {
          toUpdate.push({
            ...item.update,
            folder:createFolder.id,
            flags: { world: { kjs: d.slug } },
          });
        }

        progress.update({pct: pct});
      }

      url = result.next;
    }

    if(toCreate.length > 0) await Item.implementation.createDocuments(toCreate, { pack: pack.collection });
    if(toUpdate.length > 0) await Item.implementation.updateDocuments(toUpdate, { pack: pack.collection });

    pack.configure({locked: true});
    ui.notifications.remove(progress);
    ui.notifications.success(`KNIGHT.IMPORT.Notification-fin-import`, {format:{import:f}});
  }

  foundry.utils.debouncedReload();
}

export class buttonToImportKJS extends FormApplication {
  constructor() {
    super();
    // 1. Générer un state unique
    const state = crypto.randomUUID();

    // 2. Ouvrir la page Django
    window.open(
      `${knighttoolsURL}users/foundry/token/${state}/`,
      "_blank"
    );

    // 3. Polling vers ton API Django
    async function pollForToken() {
      const response = await fetch(
        `${knighttoolsURL}api/foundry/status/${state}/`
      );

      if (!response.ok) return false;

      const data = await response.json();

      if (data.status === "pending") {
        return false;
      }

      if (data.status === "ok") {
        // :closed_lock_with_key: Stockage sécurisé côté Foundry
        await game.settings.set("knight", "KJSToken", data.token);

        ui.notifications.info("Connexion Foundry réussie");
        return {
          result:true,
          features:data.features,
        };
      }

      throw new Error("Unexpected status");
    }

    // 4. Boucle de polling
    const interval = setInterval(async () => {
      const done = await pollForToken();
      if (done?.result) {
        clearInterval(interval);
        importFromKJS(done.features);
      }
    }, 2000);

    this.close();
  }

  render() { return this; }
  async _updateObject() {}
}
