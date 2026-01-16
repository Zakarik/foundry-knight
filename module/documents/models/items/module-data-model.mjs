import {
  getArmor,
  createSheet,
  deleteTokens,
  spawnTokenRightOfActor,
} from "../../../helpers/common.mjs";
import PatchBuilder from "../../../utils/patchBuilder.mjs";
import ArmureAPI from "../../../utils/armureAPI.mjs";

export class ModuleDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
    const {HTMLField, NumberField, SchemaField, StringField, ObjectField, BooleanField, ArrayField} = foundry.data.fields;

    return {
        id:new StringField(),
        active:new SchemaField({
          base:new BooleanField({initial:false}),
          pnj:new BooleanField({initial:false}),
          pnjName:new StringField(),
        }),
        description:new HTMLField({initial:''}),
        categorie:new StringField({initial:'effets'}),
        listes:new ObjectField(),
        isLion:new BooleanField({initial:false}),
        slots:new SchemaField({
          tete:new NumberField({initial:0, nullable:false, integer:true}),
          torse:new NumberField({initial:0, nullable:false, integer:true}),
          brasGauche:new NumberField({initial:0, nullable:false, integer:true}),
          brasDroit:new NumberField({initial:0, nullable:false, integer:true}),
          jambeGauche:new NumberField({initial:0, nullable:false, integer:true}),
          jambeDroite:new NumberField({initial:0, nullable:false, integer:true}),
        }),
        niveau:new SchemaField({
          value:new NumberField({initial:1, nullable:false, integer:true}),
          max:new NumberField({initial:1, nullable:false, integer:true}),
          details:new ObjectField({initial:{
            n1:{
              whoActivate:"",
              addOrder:0,
              permanent:false,
              rarete:"standard",
              prix:0,
              activation:"aucune",
              duree:"",
              portee:"personnelle",
              listes:{},
              labels:{},
              energie:{
                tour:{
                  value:0,
                  label:""
                },
                minute:{
                  value:0,
                  label:""
                },
                supplementaire:0
              },
              secondmode:{
                has:false,
                activation:"aucune"
              },
              aspects:{
                chair:{
                  liste:{
                    deplacement: {},
                    force: {},
                    endurance: {}
                  }
                },
                bete:{
                  liste:{
                    hargne: {},
                    combat: {},
                    instinct: {}
                  }
                },
                machine:{
                  liste:{
                    tir: {},
                    savoir: {},
                    technique: {}
                  }
                },
                dame:{
                  liste:{
                    aura: {},
                    parole: {},
                    sangFroid: {}
                  }
                },
                masque:{
                  liste:{
                    discretion: {},
                    dexterite: {},
                    perception: {}
                  }
                }
              },
              bonus:{
                has:false,
                sante:{
                  has:false,
                  value:0
                },
                armure:{
                  has:false,
                  value:0
                },
                champDeForce:{
                  has:false,
                  value:0
                },
                energie:{
                  has:false,
                  value:0
                },
                degats:{
                  has:false,
                  type:"contact",
                  dice:0,
                  fixe:0,
                  variable:{
                    has:false,
                    min:{
                      dice:0,
                      fixe:0
                    },
                    max:{
                      dice:0,
                      fixe:0
                    },
                    cout:0
                  }
                },
                violence:{
                  has:false,
                  type:"contact",
                  dice:0,
                  fixe:0,
                  variable:{
                    has:false,
                    min:{
                      dice:0,
                      fixe:0
                    },
                    max:{
                      dice:0,
                      fixe:0
                    },
                    cout:0
                  }
                },
                overdrives:{
                  has:false,
                  aspects:{
                    chair:{
                      deplacement:0,
                      force:0,
                      endurance:0
                    },
                    bete:{
                      hargne:0,
                      combat:0,
                      instinct:0
                    },
                    machine:{
                      tir:0,
                      savoir:0,
                      technique:0
                    },
                    dame:{
                      aura:0,
                      parole:0,
                      sangFroid:0
                    },
                    masque:{
                      discretion:0,
                      dexterite:0,
                      perception:0
                    }
                  }
                },
                grenades:{
                  has:false,
                  liste:new ObjectField({initial:{
                    antiblindage: {
                      degats: {
                        dice: 0
                      },
                      violence: {
                        dice: 0
                      }
                    },
                    explosive: {
                      degats: {
                        dice: 0
                      },
                      violence: {
                        dice: 0
                      }
                    },
                    shrapnel: {
                      degats: {
                        dice: 0
                      },
                      violence: {
                        dice: 0
                      }
                    },
                  }})
                }
              },
              arme:{
                has:false,
                type:"contact",
                portee:"contact",
                energie:0,
                optionsmunitions:{
                  has:false,
                  actuel:"0",
                  value:1,
                  liste:{}
                },
                degats:{
                  dice:0,
                  fixe:0,
                  variable:{
                    has:false,
                    min:{
                      dice:0,
                      fixe:0
                    },
                    max:{
                      dice:0,
                      fixe:0
                    },
                    cout:0
                  }
                },
                violence:{
                  dice:0,
                  fixe:0,
                  variable:{
                    has:false,
                    min:{
                      dice:0,
                      fixe:0
                    },
                    max:{
                      dice:0,
                      fixe:0
                    },
                    cout:0
                  }
                },
                effets:{
                  liste:[],
                  custom:[],
                  raw:[],
                  chargeur:null,
                },
                distance:{
                  liste:[],
                  custom:[],
                  raw:[]
                },
                structurelles:{
                  liste:[],
                  custom:[],
                  raw:[]
                },
                ornementales:{
                  liste:[],
                  custom:[],
                  raw:[]
                }
              },
              overdrives:{
                has:false,
                aspects:{
                  chair:{
                    deplacement:0,
                    force:0,
                    endurance:0
                  },
                  bete:{
                    hargne:0,
                    combat:0,
                    instinct:0
                  },
                  machine:{
                    tir:0,
                    savoir:0,
                    technique:0
                  },
                  dame:{
                    aura:0,
                    parole:0,
                    sangFroid:0
                  },
                  masque:{
                    discretion:0,
                    dexterite:0,
                    perception:0
                  }
                }
              },
              pnj:{
                has:false,
                modele:{
                  nom:"",
                  special:"",
                  type:"pnj",
                  sante:0,
                  champDeForce:0,
                  defense:0,
                  reaction:0,
                  armure:0,
                  debordement:0,
                  initiative:{
                    dice:3,
                    fixe:0
                  },
                  jetSpecial:{
                    has:false,
                    modele:{
                      nom:"",
                      dice:0,
                      overdrive:0
                    },
                    liste:{}
                  },
                  aspects:{
                    has:false,
                    liste:{
                      chair:{
                        value:0,
                        ae:{
                          mineur:0,
                          majeur:0
                        }
                      },
                      bete:{
                        value:0,
                        ae:{
                          mineur:0,
                          majeur:0
                        }
                      },
                      machine:{
                        value:0,
                        ae:{
                          mineur:0,
                          majeur:0
                        }
                      },
                      dame:{
                        value:0,
                        ae:{
                          mineur:0,
                          majeur:0
                        }
                      },
                      masque:{
                        value:0,
                        ae:{
                          mineur:0,
                          majeur:0
                        }
                      }
                    }
                  },
                  armes:{
                    has:false,
                    modele:{
                      nom:"",
                      type:"contact",
                      portee:"contact",
                      attaque:{
                        dice:0,
                        fixe:0
                      },
                      degats:{
                        dice:0,
                        fixe:0
                      },
                      violence:{
                        dice:0,
                        fixe:0
                      },
                      effets:{
                        liste:[],
                        custom:[],
                        raw:[],
                        chargeur:null
                      }
                    },
                    liste:[]
                  }
                },
                liste:{}
              },
              ersatz:{
                rogue:{
                  has:false,
                  interruption:{
                    actif:true
                  },
                  reussites:3,
                  attaque:"discretion",
                  degats:{
                    caracteristique:"discretion",
                    od:true,
                    dice:false,
                    fixe:true
                  }
                },
                bard:{
                  has:false
                }
              },
              jetsimple:{
                has:false,
                label:"",
                jet:"0D0",
                effets:{
                  raw:[],
                  custom:[],
                  chargeur:null,
                }
              },
              effets:{
                has:false,
                raw:[],
                custom:[],
                liste:[],
                chargeur:null,
              },
              textarea:{
                duree:22
              }
            }
          }}),
          actuel:new ObjectField(),
        }),
    }
  }

  get actor() {
    return this.item?.actor;
  }

  get item() {
    return this.parent;
  }

  get getNiveau() {
    return this.niveau.value;
  }

  get niveauActuel() {
    return this.niveau.actuel;
  }

  get getMunition() {
    const jetsSimpleFindChargeur = this.niveau.details[`n${this.getNiveau}`].jetsimple.effets.raw.find(itm => itm.includes('chargeur'));
    const jetsSimpleChargeur = this.niveau.details[`n${this.getNiveau}`].jetsimple.effets?.chargeur;

    return {
      jetsimple:jetsSimpleChargeur === null || jetsSimpleChargeur === undefined ? parseInt(jetsSimpleFindChargeur.split(' ')[1]) : parseInt(jetsSimpleChargeur),
    }
  }

  get hasMunition() {
    const niveau = this.niveau.value;
    const actuel = this.niveau?.details?.[`n${niveau}`];

    if(!actuel) return true;
    const arme = actuel.arme;
    const type = arme.type;
    let result = true;

    if(type === 'contact') {
        const effets = arme.effets;
        const findChargeur = effets.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeur) return;

        const chargeurMax = parseInt(findChargeur.split(' ')[1]);

        let chargeur = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        if(chargeur === 0) result = false;
    }
    else if(type === 'distance') {
      const effets = arme.effets;
      const findChargeurBase = effets.raw.find(itm => itm.includes('chargeur'));

      if(findChargeurBase) {
        const chargeurMax = parseInt(findChargeurBase.split(' ')[1]);
        const chargeurActuel = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        if(chargeurActuel !== 0 && result) result = true;
        else result = false;
      };

      if(arme.optionsmunitions.has) {
        const actuel = arme.optionsmunitions.actuel;
        const munition = arme.optionsmunitions?.liste?.[actuel];

        if(munition) {
          const effetsMunition = munition;
          const findChargeurMunition = munition.raw.find(itm => itm.includes('chargeur'));

          if(findChargeurMunition) {
            const chargeurMunitionMax = parseInt(findChargeurMunition.split(' ')[1]);

            let chargeurMunition = effetsMunition?.chargeur !== null && effetsMunition?.chargeur !== undefined ? parseInt(effetsMunition.chargeur) : chargeurMunitionMax;

            if(chargeurMunition !== 0 && result) result = true;
            else result = false;
          }
        }
      }
    }

    return result;
  }

  get allWpnEffects() {
    const arme = this.niveauActuel.arme;
    let effects = [];

    if(!arme.has) return effects;

    if(arme.type === 'contact') effects.push(...arme.effets.raw, ...arme.ornementales.raw, ...arme.structurelles.raw);
    else if(arme.type === 'distance') {
      effects.push(...arme.effets.raw, ...arme.distance.raw);

      if(arme.optionsmunitions.has) effects.push(...arme.optionsmunitions.liste[arme.optionsmunitions.actuel].raw)
    }

    return effects;
  }

  qtyMunition() {
    const niveau = this.niveau.value;
    const actuel = this.niveau?.details?.[`n${niveau}`];

    if(!actuel) return;
    const arme = actuel.arme;
    const type = arme.type;
    let result = 0;

    if(type === 'contact') {
      const effets = arme.effets;
      const findChargeur = effets.raw.find(itm => itm.includes('chargeur'));

      if(!findChargeur) return;

      const chargeurMax = parseInt(findChargeur.split(' ')[1]);

      let chargeur = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

      result = chargeur;
    }
    else if(type === 'distance') {
      const effets = arme.effets;
      const findChargeurBase = effets.raw.find(itm => itm.includes('chargeur'));

      if(findChargeurBase) {
        const chargeurMax = parseInt(findChargeurBase.split(' ')[1]);
        const chargeurActuel = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        result = chargeurActuel;
      };

      if(arme.optionsmunitions.has) {
        const actuel = arme.optionsmunitions.actuel;
        const munition = arme.optionsmunitions?.liste?.[actuel];

        if(munition) {
          const effetsMunition = munition;
          const findChargeurMunition = munition.raw.find(itm => itm.includes('chargeur'));

          if(findChargeurMunition) {
            const chargeurMunitionMax = parseInt(findChargeurMunition.split(' ')[1]);

            let chargeurMunition = effetsMunition?.chargeur !== null && effetsMunition?.chargeur !== undefined ? parseInt(effetsMunition.chargeur) : chargeurMunitionMax;

            result = chargeurMunition;
          }
        }
      }
    }

    return result;
  }

  hasOtherMunition(type) {
    const actuel = this.niveau?.details?.[`n${this.getNiveau}`];
    let result = true;
    let effets = undefined;
    let findChargeur = undefined;
    let chargeur = null;

    switch(type) {
      case 'jetsimple':
        effets = actuel.jetsimple.effets;
        findChargeur = effets.raw.find(itm => itm.includes('chargeur'));
        chargeur = effets?.chargeur ?? null;

        if(findChargeur) {
          if(chargeur !== null) {
            if(chargeur === 0) {
              result = false;
            }
          }
        }
        break;

      case 'module':
        effets = actuel.effets;
        findChargeur = effets.raw.find(itm => itm.includes('chargeur'));
        chargeur = effets?.chargeur ?? null;

        if(findChargeur) {
          if(chargeur !== null) {
            if(chargeur === 0) {
              result = false;
            }
          }
        }
        break;
    }

    return result;
  }

  addMunition(index, type, munition, pnj, wpn) {
    const niveau = this.niveau.value;
    let data = undefined;
    let path = '';
    let chargeur = undefined;
    let actuel = undefined;
    let update = {};

    switch(type) {
      case 'base':
        path = `system.niveau.details.n${niveau}.arme.effets.chargeur`;
        data = this.niveau.details[`n${niveau}`].arme.effets;
        break;

      case 'munition':
        path = `system.niveau.details.n${niveau}.arme.optionsmunitions.liste.${munition}.chargeur`;
        data = this.niveau.details[`n${niveau}`].arme.optionsmunitions?.liste?.[munition] ?? undefined;
        break;

      case 'module':
        path = `system.niveau.details.n${niveau}.effets.chargeur`;
        data = this.niveau.details[`n${niveau}`].effets;
        break;

      case 'pnjwpn':
        path = `system.niveau.details.n${niveau}.pnj.liste.${pnj}.armes.liste.${wpn}.effets.chargeur`;
        data = this.niveau.details[`n${niveau}`].pnj.liste?.[pnj]?.armes?.liste?.[wpn]?.effets ?? undefined;
        break;

      case 'jetsimple':
        path = `system.niveau.details.n${niveau}.jetsimple.effets.chargeur`;
        data = this.niveau.details[`n${niveau}`].jetsimple.effets;
        break;
    }

    if(!data) return;

    chargeur = data?.raw?.[index] ?? undefined;

    if(!chargeur.includes('chargeur')) return;

    actuel = data?.chargeur === null || data?.chargeur === undefined ? parseInt(chargeur.split(' ')[1]) : data.chargeur;

    update[path] = Math.min(actuel+1, parseInt(chargeur.split(' ')[1]));

    this.item.update(update);

    const exec = new game.knight.RollKnight(this.actor,
    {
    name:this.item.name,
    }).sendMessage({
        text:game.i18n.localize('KNIGHT.JETS.Remet1Charge'),
        classes:'important',
    });
  }

  removeMunition(index, type, munition=undefined, pnj=undefined, wpn=undefined) {
    const niveau = this.niveau.value;
    let data = undefined;
    let path = '';
    let chargeur = undefined;
    let actuel = undefined;
    let update = {};

    switch(type) {
      case 'base':
        path = `system.niveau.details.n${niveau}.arme.effets.chargeur`;
        data = this.niveau.details[`n${niveau}`].arme.effets;
        break;

      case 'munition':
        path = `system.niveau.details.n${niveau}.arme.optionsmunitions.liste.${munition}.chargeur`;
        data = this.niveau.details[`n${niveau}`].arme.optionsmunitions?.liste?.[munition] ?? undefined;
        break;

      case 'module':
        path = `system.niveau.details.n${niveau}.effets.chargeur`;
        data = this.niveau.details[`n${niveau}`].effets;
        break;

      case 'pnjwpn':
        path = `system.niveau.details.n${niveau}.pnj.liste.${pnj}.armes.liste.${wpn}.effets.chargeur`;
        data = this.niveau.details[`n${niveau}`].pnj.liste?.[pnj]?.armes?.liste?.[wpn]?.effets ?? undefined;
        break;

      case 'jetsimple':
        path = `system.niveau.details.n${niveau}.jetsimple.effets.chargeur`;
        data = this.niveau.details[`n${niveau}`].jetsimple.effets;
        break;
    }

    if(!data) return;
    chargeur = data?.raw?.[index] ?? undefined;

    if(!chargeur.includes('chargeur')) return;

    actuel = data?.chargeur === null || data?.chargeur === undefined ? parseInt(chargeur.split(' ')[1]) : data.chargeur;
    update[path] = Math.max(actuel-1, 0);

    this.item.update(update);

    const exec = new game.knight.RollKnight(this.actor,
    {
    name:this.item.name,
    }).sendMessage({
        text:game.i18n.localize('KNIGHT.JETS.Retire1Charge'),
        classes:'important',
    });
  }

  resetMunition() {
    const niveau = this.niveau.value;
    const actuel = this.niveau?.details?.[`n${niveau}`];
    const basePath = `system.niveau.details.n${niveau}`;
    let update = {};

    if(!actuel) return;
    const arme = actuel.arme;
    const effets = arme.effets;
    const findChargeur = effets.raw.find(itm => itm.includes('chargeur'));
    const munition = arme.optionsmunitions?.liste ?? {};

    if(findChargeur) {
      const chargeurMax = parseInt(findChargeur.split(' ')[1]);

      update[`${basePath}.arme.effets.chargeur`] = chargeurMax;
    }

    for (const effet in munition) {
      const findChargeurMunition = munition[effet].raw.find(itm => itm.includes('chargeur'));

      if(!findChargeurMunition) continue;

      const chargeurMunitionMax = parseInt(findChargeurMunition.split(' ')[1]);

      update[`${basePath}.arme.optionsmunitions.liste.${effet}.chargeur`] = chargeurMunitionMax;
    }

    const findChargeurModule = actuel.effets.raw.find(itm => itm.includes('chargeur'));

    if(findChargeurModule) {
      const chargeurModuleMax = parseInt(findChargeurModule.split(' ')[1]);

      update[`${basePath}.effets.chargeur`] = chargeurModuleMax;
    }

    const findChargeurSimple = actuel.jetsimple.effets.raw.find(itm => itm.includes('chargeur'));

    if(findChargeurSimple) {
      const chargeurSimpleMax = parseInt(findChargeurSimple.split(' ')[1]);

      update[`${basePath}.jetsimple.effets.chargeur`] = chargeurSimpleMax;
    }

    const listPNJ = actuel.pnj.liste;

    for(let pnj in listPNJ) {
      const wpns = listPNJ[pnj].armes.liste;

      for(let wpn in wpns) {
        const findChargeurWpn = wpns[wpn].effets.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeurWpn) continue;

        const chargerWpnMax = parseInt(findChargeurWpn.split(' ')[1]);

        update[`${basePath}.pnj.liste.${pnj}.armes.liste.${wpn}.effets.chargeur`] = chargerWpnMax;
      }
    }

    if(!foundry.utils.isEmpty(update)) this.item.update(update);
  }

  useMunition(data, weapon, updates={}) {
    const niveau = this.niveau.value;
    const actuel = this.niveau?.details?.[`n${niveau}`];

    if(!actuel) return;
    const arme = actuel.arme;
    const type = arme.type;
    const basePath = `item.${this.item._id}.system.niveau.details.n${niveau}`;

    if(type === 'contact') {
      const effets = arme.effets;
      const findChargeur = effets.raw.find(itm => itm.includes('chargeur'));

      if(!findChargeur) return;

      const chargeurMax = parseInt(findChargeur.split(' ')[1]);

      let chargeur = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

      updates[`${basePath}.arme.effets.chargeur`] = Math.max(chargeur-1, 0);
    }
    else if(type === 'distance') {
      const effets = arme.effets;
      const findChargeurBase = effets.raw.find(itm => itm.includes('chargeur'));

      if(findChargeurBase) {
        const chargeurMax = parseInt(findChargeurBase.split(' ')[1]);
        const chargeurActuel = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        updates[`${basePath}.arme.effets.chargeur`] = Math.max(chargeurActuel-1, 0);
      };

      if(arme.optionsmunitions.has) {
        const actuel = arme.optionsmunitions.actuel;
        const munition = arme.optionsmunitions?.liste?.[actuel];

        if(munition) {
          const effetsMunition = munition;
          const findChargeurMunition = munition.raw.find(itm => itm.includes('chargeur'));

          if(findChargeurMunition) {
            const chargeurMunitionMax = parseInt(findChargeurMunition.split(' ')[1]);

            let chargeurMunition = effetsMunition?.chargeur !== null && effetsMunition?.chargeur !== undefined ? parseInt(effetsMunition.chargeur) : chargeurMunitionMax;

            updates[`${basePath}.arme.optionsmunitions.liste.chargeur`] = Math.max(chargeurMunition-1, 0);
          }
        }
      }
    }
  }

  prepareBaseData() {
    //GERE LES EVENTUELLES GRENADES PERSONNALISEES
    const actor = this.actor;

    const listG = actor ? actor.system?.combat?.grenades?.liste ?? {} : CONFIG.KNIGHT.LIST.grenades;
    const keysToRemoveSet = new Set(['flashbang', 'iem']);
    const allowed = Object.keys(listG).filter(k => !keysToRemoveSet.has(k));
    const defaults = { degats: { dice: 0 }, violence: { dice: 0 }, custom: true };

    const levels = this.niveau?.details ?? {};
    for (const lvl of Object.values(levels)) {
      const gren = lvl?.bonus?.grenades;
      if (!gren || !gren.liste) continue;
      const dGrenade = gren.liste;

      // Nouveau dictionnaire: pour chaque clé autorisée, reprendre l’existant ou mettre le défaut
      const merged = Object.fromEntries(
        allowed.map(k => [k, dGrenade[k] ?? { ...defaults }])
      );

      // Affectation simple: pas besoin de defineProperty
      gren.liste = merged;
    }
    //FIN GRENADES PERSONNALISEES

    const niveau = Math.max(this.niveau.value, 1);

    const itemDataNiveau = this.niveau.details[`n${niveau}`];
    const itemBonus = itemDataNiveau?.bonus || {};
    const itemArme = itemDataNiveau?.arme || {};
    const itemOD = itemDataNiveau?.overdrives || {};
    const itemErsatz = itemDataNiveau?.ersatz || {};

    this.niveau.actuel.bonus = itemBonus;
    this.niveau.actuel.arme = itemArme;
    this.niveau.actuel.overdrives = itemOD;
    this.niveau.actuel.ersatz = itemErsatz;
    this.niveau.actuel.permanent = itemDataNiveau.permanent;
    this.niveau.actuel.duree = itemDataNiveau.duree;
    this.niveau.actuel.energie = itemDataNiveau.energie;
    this.niveau.actuel.rarete = itemDataNiveau.rarete;
    this.niveau.actuel.activation = itemDataNiveau.activation;
    this.niveau.actuel.portee = itemDataNiveau.portee;
    this.niveau.actuel.labels = itemDataNiveau.labels;
    this.niveau.actuel.pnj = itemDataNiveau.pnj;
    this.niveau.actuel.jetsimple = itemDataNiveau.jetsimple;
    this.niveau.actuel.effets = itemDataNiveau.effets
    this.niveau.actuel.whoActivate = itemDataNiveau.whoActivate
	}

	prepareDerivedData() {}

  async activate(value, type) {

    if(value) {
      const depense = this.actor.type === 'vehicule' ? await this.usePEVehicule(type) : await this.usePE(type);

      if(!depense) return;
    }

    let pbM = new PatchBuilder();
    const dataModule = this.item,
          dataNiveau = this.niveauActuel;

    pbM.sys(`active.base`, value)
    let abort = false;

    if(dataNiveau.jetsimple.has && value) {
      const roll = new game.knight.RollKnight(this.actor, {
        name:`${dataNiveau.jetsimple.label}`,
        dices:`${dataNiveau.jetsimple.jet}`,
        item:dataModule,
        effectspath:'jetsimple.effets',
      }, false);

      if(this.hasOtherMunition('jetsimple')) {
        await roll.doRoll({}, dataNiveau.jetsimple.effets);
      } else {
        await roll.sendMessage({
            text:game.i18n.localize('KNIGHT.JETS.ChargeurVide'),
            classes:'important',
        });
      }
    }

    if(!this.hasOtherMunition('module') && value && dataNiveau.effets.has) {
      abort = true;
      const roll = new game.knight.RollKnight(this.actor, {
        name:`${dataModule.name}`,
      }, false);

      await roll.sendMessage({
        text:game.i18n.localize('KNIGHT.JETS.ChargeurVide'),
        classes:'important',
      });

    } else if(dataNiveau.effets.raw.find(itm => itm.includes('chargeur')) && value) {
      const findModuleChargeur = dataNiveau.effets.raw.find(itm => itm.includes('chargeur'));
      const chargeur = dataNiveau.effets?.chargeur ?? null;

      if(chargeur === null) pbM.sys(`niveau.details.n${this.getNiveau}.effets.chargeur`, Math.max(parseInt(findModuleChargeur.split(' ')[1])-1, 0))
      else pbM.sys(`niveau.details.n${this.getNiveau}.effets.chargeur`, Math.max(parseInt(chargeur)-1, 0))
    }

    if(!abort) {
      await pbM.applyTo(dataModule);

      const exec = new game.knight.RollKnight(this.actor,
        {
        name:value ? game.i18n.localize(`KNIGHT.ACTIVATION.Label`) : game.i18n.localize(`KNIGHT.ACTIVATION.Desactivation`),
        }).sendMessage({
            text:name ? name : this.item.name,
            sounds:CONFIG.sounds.notification,
        });
    }

  }

  async activateNPC(value, type, index) {
    if(value) {
      const depense = await this.usePE(type);

      if(!depense) return;
    }

    const dataModule = this.item,
          data = this,
          dataNiveau = data.niveauActuel,
          dataPnj = dataNiveau.pnj.liste[index];

    let newActor;

    if(value) {
      const listeAspects = dataPnj.aspects.liste;

      const system = {
        aspects:dataPnj.aspects.has ? {
          'chair':{
            'value':listeAspects.chair.value,
            'ae':{
              'mineur':{
                'value':listeAspects.chair.ae.mineur
              },
              'majeur':{
                'value':listeAspects.chair.ae.majeur
              }
            }
          },
          'bete':{
            'value':listeAspects.bete.value,
            'ae':{
              'mineur':{
                'value':listeAspects.bete.ae.mineur
              },
              'majeur':{
                'value':listeAspects.bete.ae.majeur
              }
            }
          },
          'machine':{
            'value':listeAspects.machine.value,
            'ae':{
              'mineur':{
                'value':listeAspects.machine.ae.mineur
              },
              'majeur':{
                'value':listeAspects.machine.ae.majeur
              }
            }
          },
          'dame':{
            'value':listeAspects.dame.value,
            'ae':{
              'mineur':{
                'value':listeAspects.dame.ae.mineur
              },
              'majeur':{
                'value':listeAspects.dame.ae.majeur
              }
            }
          },
          'masque':{
            'value':listeAspects.masque.value,
            'ae':{
              'mineur':{
                'value':listeAspects.masque.ae.mineur
              },
              'majeur':{
                'value':listeAspects.masque.ae.majeur
              }
            }
          }
        } : {},
        initiative:{
          diceBase:dataPnj.initiative.dice,
          bonus:{user:dataPnj.initiative.fixe}
        },
        sante:{
          base:dataPnj.sante,
          value:dataPnj.sante
        },
        armure:{
          base:dataPnj.armure,
          value:dataPnj.armure
        },
        champDeForce:{
          base:dataPnj.champDeForce
        },
        reaction:{
          base:dataPnj.reaction
        },
        defense:{
          base:dataPnj.defense
        },
        options:{
          noAspects:dataPnj.aspects.has ? false : true,
          noArmesImprovisees:dataPnj.aspects.has ? false : true,
          noCapacites:true,
          noGrenades:true,
          noNods:true,
          espoir:false,
          bouclier:false,
          sante:false,
          energie:false,
          resilience:false
        }
      };

      if(dataPnj.jetSpecial.has) {
        const jetsSpeciaux = [];

        system.options.jetsSpeciaux = true;

        for (let [key, jet] of Object.entries(dataPnj.jetSpecial.liste)) {
          jetsSpeciaux.push({
            name:jet.nom,
            value:`${jet.dice}D6+${jet.overdrive}`
          });
        }

        system.jetsSpeciaux = jetsSpeciaux;
      }

      if(dataPnj.type === 'bande') {
        system.debordement = {};
        system.debordement.value = dataPnj.debordement;
      }

      newActor = await createSheet(
        this.actor,
        dataPnj.type,
        `${this.title} : ${dataPnj.nom}`,
        system,
        {},
        dataModule.img,
        dataModule.img,
        1
      );

      if(dataPnj.armes.has && dataPnj.type !== 'bande') {
        const items = [];

        for (let [key, arme] of Object.entries(dataPnj.armes.liste)) {
          const wpnType = arme.type === 'tourelle' ? 'distance' : arme.type;

          let wpn = {
            type:wpnType,
            portee:arme.portee,
            degats:{
              dice:arme.degats.dice,
              fixe:arme.degats.fixe
            },
            violence:{
              dice:arme.violence.dice,
              fixe:arme.violence.fixe
            },
            effets:{
              raw:arme.effets.raw,
              custom:arme.effets.custom
            }
          };

          if(arme.type === 'tourelle') {
            wpn['tourelle'] = {
              has:true,
              attaque:{
                dice:arme.attaque.dice,
                fixe:arme.attaque.fixe
              }
            }
          }

          const nItem = {
            name:arme?.nom ?? game.i18n.localize('TYPES.Item.arme'),
            type:'arme',
            system:wpn,
            };

            items.push(nItem);
        }

        await newActor.createEmbeddedDocuments("Item", items);
      }

      await PatchBuilder.for(dataModule)
        .sys('active.pnj', true)
        .sys('active.pnjName', dataPnj.nom)
        .sys('id', newActor.id)
        .apply();

      await spawnTokenRightOfActor({actor:newActor, refActor:this.actor});

    } else if(!value) {
      const actor = game.actors.get(dataModule.system.id);

      if(actor !== undefined) await actor.delete();

      if(actor?.id) await deleteTokens([actor.id]);

      await PatchBuilder.for(dataModule)
        .sys('active.pnj', false)
        .sys('active.pnjName', '')
        .sys('id', '')
        .apply();
    }
  }

  async supplementaire() {
    await this.usePE('supplementaire');
  }

  async usePE(type, forceEspoir = false) {
    // Récupération armure + capacités (sécurisée)
    const getArmure = await getArmor(this.actor).catch(e => {
      console.error('module usePE: getArmor a échoué', e);
      return null;
    });
    if (!getArmure) return;

    const niveauActuel = this.niveauActuel;
    const armure = new ArmureAPI(getArmure);
    const label = this.item.name;
    const actor = this?.actor ?? null;

    const remplaceEnergie = armure.espoirRemplaceEnergie;
    const getType = remplaceEnergie || forceEspoir ? 'espoir' : 'energie';
    const hasFlux = armure.hasFlux;

    const flux = hasFlux ? actor?.system?.flux?.value ?? 0 : 0;
    const value = actor?.system?.[getType]?.value ?? 0;
    const espoir = actor?.system?.espoir?.value ?? 0;

    const sendLackMsg = async (i18nKey) => {
      const payload = {
        flavor: `${label}`,
        main: { total: `${game.i18n.localize(`KNIGHT.JETS.${i18nKey}`)}` }
      };
      const data = {
        user: game.user.id,
        speaker: {
          actor: actor?.id ?? null,
          token: actor?.token?.id ?? null,
          alias: actor?.name ?? null,
        },
        type: CONST.CHAT_MESSAGE_TYPES.OTHER,
        content: await renderTemplate('systems/knight/templates/dices/wpn.html', payload),
        sound: CONFIG.sounds.dice
      };
      const rMode = game.settings.get("core", "rollMode");
      const msgData = ChatMessage.applyRollMode(data, rMode);
      await ChatMessage.create(msgData, { rollMode: rMode });
    };

    let cout = 0;

    switch(type) {
      case 'other':
        cout += 0;
        break;

      case 'tour':
      case 'minute':
        cout += niveauActuel?.energie?.[type]?.value ?? 0;
        break;

      case 'supplementaire':
        cout += niveauActuel?.energie?.supplementaire ?? 0;
        break;
    }

    let depenseEnergie = 0;
    let depenseFlux = 0;
    let depenseEspoir = 0;
    let substractEnergie = 0;
    let substractEspoir = 0;
    let substractFlux = 0;

    depenseEnergie += cout;

    if(remplaceEnergie && depenseEnergie > 0 && armure.ModuleCostDivided > 0) {
      depenseEnergie = Math.max(Math.floor(cout / armure.ModuleCostDivided), 1);

      if(depenseEnergie < 1) depenseEnergie = 1;
    }

    if(remplaceEnergie) depenseEnergie += depenseEspoir;

    substractEnergie = value - depenseEnergie;
    substractEspoir = espoir - depenseEspoir;
    substractFlux = flux - depenseFlux;
    if(substractEnergie < 0) {
      await sendLackMsg(`${remplaceEnergie || forceEspoir ? 'Notespoir' : 'Notenergie'}`);

      return false;
    } else if(substractEspoir < 0 && !remplaceEnergie) {
      await sendLackMsg(`Notespoir`);

      return false;
    } else if(substractFlux < 0 && hasFlux) {
      await sendLackMsg(`Notflux`);

      return false;
    } else {
      let pbE = new PatchBuilder();

      if(!remplaceEnergie) pbE.sys(`equipements.${actor.system.wear}.${getType}.value`, substractEnergie);
      else if(remplaceEnergie && !actor.system.espoir.perte.saufAgonie) pbE.sys('espoir.value', substractEnergie);

      if(!remplaceEnergie && depenseEspoir) pbE.sys('espoir.value', substractEspoir);

      if(depenseFlux && hasFlux) pbE.sys('flux.value', substractFlux);

      await pbE.applyTo(actor);

      return true;
    }
  }

  async usePEVehicule(type, forceEspoir = false) {
    const niveauActuel = this.niveauActuel;
    const label = this.item.name;
    const actor = this?.actor ?? null;

    const getType = 'energie';
    const value = actor?.system?.[getType]?.value ?? 0;

    const sendLackMsg = async (i18nKey) => {
      const payload = {
        flavor: `${label}`,
        main: { total: `${game.i18n.localize(`KNIGHT.JETS.${i18nKey}`)}` }
      };
      const data = {
        user: game.user.id,
        speaker: {
          actor: actor?.id ?? null,
          token: actor?.token?.id ?? null,
          alias: actor?.name ?? null,
        },
        type: CONST.CHAT_MESSAGE_TYPES.OTHER,
        content: await renderTemplate('systems/knight/templates/dices/wpn.html', payload),
        sound: CONFIG.sounds.dice
      };
      const rMode = game.settings.get("core", "rollMode");
      const msgData = ChatMessage.applyRollMode(data, rMode);
      await ChatMessage.create(msgData, { rollMode: rMode });
    };

    let cout = 0;

    switch(type) {
      case 'other':
        cout += 0;
        break;

      case 'tour':
      case 'minute':
        cout += niveauActuel?.energie?.[type]?.value ?? 0;
        break;

      case 'supplementaire':
        cout += niveauActuel?.energie?.supplementaire ?? 0;
        break;
    }

    let depenseEnergie = 0;
    let substractEnergie = 0;

    depenseEnergie += cout;

    substractEnergie = value - depenseEnergie;

    if(substractEnergie < 0) {
      await sendLackMsg(`${'Notenergie'}`);

      return false;
    } else {
      let pbE = new PatchBuilder();
      pbE.sys(`energie.value`, substractEnergie);

      await pbE.applyTo(actor);

      return true;
    }
  }
}