import {
  getArmor,
  spawnTokenRightOfActor,
  spawnTokensRightOfActor,
  deleteTokens,
  createSheet,
  capitalizeFirstLetter,
  confirmationDialog,
} from "../../../helpers/common.mjs";

import PatchBuilder from "../../../utils/patchBuilder.mjs";
import ArmureAPI from "../../../utils/armureAPI.mjs";

import { ArmureCapaciteDataModel } from '../parts/armure-capacite-data-model.mjs';
import { ArmureSpecialDataModel } from '../parts/armure-special-data-model.mjs';

export class ArmureDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const {StringField, NumberField, BooleanField, SchemaField, HTMLField, ObjectField, EmbeddedDataField} = foundry.data.fields;

    return {
      description:new HTMLField({initial:''}),
      generation: new NumberField({initial: 1}),
      jauges: new SchemaField({
        armure: new BooleanField({initial: true}),
        champDeForce: new BooleanField({initial: true}),
        egide: new BooleanField({initial: false}),
        energie: new BooleanField({initial: true}),
        espoir: new BooleanField({initial: true}),
        flux: new BooleanField({initial: false}),
        sante: new BooleanField({initial: true}),
        heroisme: new BooleanField({initial: true})
      }),
      armure: new SchemaField({
        base: new NumberField({initial: 0}),
      }),
      champDeForce: new SchemaField({
        base: new NumberField({initial: 0}),
      }),
      egide: new SchemaField({
        value: new NumberField({initial: 0})
      }),
      energie: new SchemaField({
        base: new NumberField({initial: 0}),
      }),
      espoir: new SchemaField({
        bonus: new BooleanField({initial: false}),
        value: new NumberField({initial: 0}),
        remplaceEnergie: new BooleanField({initial: false}),
        cout: new NumberField({initial: 2})
      }),
      flux: new SchemaField({
        value: new NumberField({initial: 0})
      }),
      capacites: new EmbeddedDataField(ArmureCapaciteDataModel),
      special: new EmbeddedDataField(ArmureSpecialDataModel),
      slots: new SchemaField({
        tete: new SchemaField({
          value: new NumberField({initial: 0}),
          bonus: new ObjectField(),
          malus: new ObjectField()
        }),
        torse: new SchemaField({
          value: new NumberField({initial: 0}),
          bonus: new ObjectField(),
          malus: new ObjectField()
        }),
        brasGauche: new SchemaField({
          value: new NumberField({initial: 0}),
          bonus: new ObjectField(),
          malus: new ObjectField()
        }),
        brasDroit: new SchemaField({
          value: new NumberField({initial: 0}),
          bonus: new ObjectField(),
          malus: new ObjectField()
        }),
        jambeGauche: new SchemaField({
          value: new NumberField({initial: 0}),
          bonus: new ObjectField(),
          malus: new ObjectField()
        }),
        jambeDroite: new SchemaField({
          value: new NumberField({initial: 0}),
          bonus: new ObjectField(),
          malus: new ObjectField()
        })
      }),
      overdrives: new SchemaField({
        chair: new SchemaField({
          liste: new SchemaField({
            deplacement: new SchemaField({value: new NumberField({initial: 0})}),
            force: new SchemaField({value: new NumberField({initial: 0})}),
            endurance: new SchemaField({value: new NumberField({initial: 0})})
          })
        }),
        bete: new SchemaField({
          liste: new SchemaField({
            hargne: new SchemaField({value: new NumberField({initial: 0})}),
            combat: new SchemaField({value: new NumberField({initial: 0})}),
            instinct: new SchemaField({value: new NumberField({initial: 0})})
          })
        }),
        machine: new SchemaField({
          liste: new SchemaField({
            tir: new SchemaField({value: new NumberField({initial: 0})}),
            savoir: new SchemaField({value: new NumberField({initial: 0})}),
            technique: new SchemaField({value: new NumberField({initial: 0})})
          })
        }),
        dame: new SchemaField({
          liste: new SchemaField({
            aura: new SchemaField({value: new NumberField({initial: 0})}),
            parole: new SchemaField({value: new NumberField({initial: 0})}),
            sangFroid: new SchemaField({value: new NumberField({initial: 0})})
          })
        }),
        masque: new SchemaField({
          liste: new SchemaField({
            discretion: new SchemaField({value: new NumberField({initial: 0})}),
            dexterite: new SchemaField({value: new NumberField({initial: 0})}),
            perception: new SchemaField({value: new NumberField({initial: 0})})
          })
        })
      }),
      evolutions: new SchemaField({
        paliers: new NumberField({initial: 0}),
        liste: new ObjectField(),
        special: new ObjectField()
      }),
      archivage: new ObjectField()
    };
  }

  get actor() {
    return this.item?.actor;
  }

  get item() {
    return this.parent;
  }

  get hasMunition() {
    const type = this.type;
    let result = true;

    if(type === 'contact') {
      if(this.options2mains.has) {
        const actuel = this.options2mains?.actuel ?? '1main';
        const effets = actuel === '1main' ? this.effets : this.effets2mains;
        const findChargeur = effets.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeur) return;

        const chargeurMax = parseInt(findChargeur.split(' ')[1]);

        let chargeur = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        if(chargeur === 0) result = false;

      } else {
        const effets = this.effets;
        const findChargeur = effets.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeur) return;

        const chargeurMax = parseInt(findChargeur.split(' ')[1]);

        let chargeur = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        if(chargeur === 0) result = false;
      }
    }
    else if(type === 'distance') {
      const effets = this.effets;
      const findChargeurBase = effets.raw.find(itm => itm.includes('chargeur'));

      if(findChargeurBase) {
        const chargeurMax = parseInt(findChargeurBase.split(' ')[1]);
        const chargeurActuel = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        if(chargeurActuel !== 0 && result) result = true;
        else result = false;
      };

      if(this.optionsmunitions.has) {
        const actuel = this.optionsmunitions.actuel;
        const munition = this.optionsmunitions?.liste?.[actuel];

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

  get energieDisponiblePar10() {
    const remplaceEnergie = this.espoir.remplaceEnergie;
    let total = 0;

    if(this.actor) {
      total = remplaceEnergie
        ? this?.actor?.espoir?.value
        : this?.actor?.system?.energie?.value;

      total = Number(total) || 0; // sécurise en nombre
    }

    const n = Math.floor(total / 10); // nombre de dizaines complètes
    return Array.from({ length: n }, (_, i) => (i + 1) * 10);
  }

  qtyMunition(type, weapon) {
    const capacite = type
    .replaceAll(/borealis[DC]/g, 'borealis')
    .replaceAll(/cea(Vague|Salve|Rayon)(C|D)/g, '$1')
    .replaceAll(/morph(Griffe|Lame|Canon)/g, '$1')
    .toLowerCase();

    let result = 0;

    switch(capacite) {
      case 'borealis':
        const mainStd = this.#getDataCapacite(capacite);
        const dataStd = mainStd.data;
        const findChargeurStd = dataStd.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeurStd) return;

        const chargeurStdMax = parseInt(findChargeurStd.split(' ')[1]);

        let chargeurStd = dataStd?.chargeur !== null && dataStd?.chargeur !== undefined ? parseInt(dataStd.chargeur) : chargeurStdMax;

        result = chargeurStd;
        break;

      case 'salve':
      case 'vague':
      case 'rayon':
        const mainCea = this.#getDataCapacite('cea', capacite);
        const dataCea = mainCea.data;
        const findChargeurCea = dataCea.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeurCea) return;

        const chargeurCeaMax = parseInt(findChargeurCea.split(' ')[1]);

        let chargeurCea = dataCea?.chargeur !== null && dataCea?.chargeur !== undefined ? parseInt(dataCea.chargeur) : chargeurCeaMax;

        result = chargeurCea;
        break;

      case 'griffe':
      case 'lame':
      case 'canon':
        const mainMorph = this.#getDataCapacite('morph', capacite);
        const dataMorph = mainMorph.data;
        const findChargeurMorph = dataMorph.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeurMorph) return;

        const chargeurMorphMax = parseInt(findChargeurMorph.split(' ')[1]);

        let chargeurMorph = dataMorph?.chargeur !== null && dataMorph?.chargeur !== undefined ? parseInt(dataMorph.chargeur) : chargeurMorphMax;

        result = chargeurMorph;
        break;
    }

    return result;
  }

  hasMunition(type, weapon) {
    const capacite = type
    .replaceAll(/borealis[DC]/g, 'borealis')
    .replaceAll(/cea(Vague|Salve|Rayon)(C|D)/g, '$1')
    .replaceAll(/morph(Griffe|Lame|Canon)/g, '$1')
    .toLowerCase();
    let result = true;

    switch(capacite) {
      case 'borealis':
        const mainStd = this.#getDataCapacite(capacite);
        const dataStd = mainStd.data;
        const findChargeurStd = dataStd.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeurStd) return;

        const chargeurStdMax = parseInt(findChargeurStd.split(' ')[1]);

        let chargeurStd = dataStd?.chargeur !== null && dataStd?.chargeur !== undefined ? parseInt(dataStd.chargeur) : chargeurStdMax;

        if(chargeurStd === 0) result = false;
        break;

      case 'salve':
      case 'vague':
      case 'rayon':
        const mainCea = this.#getDataCapacite('cea', capacite);
        const dataCea = mainCea.data;
        const findChargeurCea = dataCea.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeurCea) return;

        const chargeurCeaMax = parseInt(findChargeurCea.split(' ')[1]);

        let chargeurCea = dataCea?.chargeur !== null && dataCea?.chargeur !== undefined ? parseInt(dataCea.chargeur) : chargeurCeaMax;

        if(chargeurCea === 0) result = false;
        break;

      case 'griffe':
      case 'lame':
      case 'canon':
        const mainMorph = this.#getDataCapacite('morph', capacite);
        const dataMorph = mainMorph.data;
        const findChargeurMorph = dataMorph.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeurMorph) return;

        const chargeurMorphMax = parseInt(findChargeurMorph.split(' ')[1]);

        let chargeurMorph = dataMorph?.chargeur !== null && dataMorph?.chargeur !== undefined ? parseInt(dataMorph.chargeur) : chargeurMorphMax;

        if(chargeurMorph === 0) result = false;
        break;

      case 'longbow':
        const mainLBBase = this.#getDataCapacite('longbow', 'base');
        const mainLBListe1 = this.#getDataCapacite('longbow', 'liste1');
        const mainLBListe2 = this.#getDataCapacite('longbow', 'liste2');
        const mainLBListe3 = this.#getDataCapacite('longbow', 'liste3');
        const dataLongbowBase = mainLBBase.data;
        const dataLongbowListe1 = mainLBListe1.data;
        const dataLongbowListe2 = mainLBListe2.data;
        const dataLongbowListe3 = mainLBListe3.data;
        const findChargeurLongbowBase = dataLongbowBase.raw.find(itm => itm.includes('chargeur'));
        const findChargeurLongbowListe1 = weapon?.possibility?.liste1?.selected?.find(itm => itm.includes('chargeur')) ?? undefined;
        const findChargeurLongbowListe2 = weapon?.possibility?.liste2?.selected?.find(itm => itm.includes('chargeur')) ?? undefined;
        const findChargeurLongbowListe3 = weapon?.possibility?.liste3?.selected?.find(itm => itm.includes('chargeur')) ?? undefined;

        if(findChargeurLongbowBase) {
          const chargeurLBMax = parseInt(findChargeurLongbowBase.split(' ')[1]);

          let chargeurLb = dataLongbowBase?.chargeur !== null && dataLongbowBase?.chargeur !== undefined ? parseInt(dataLongbowBase.chargeur) : chargeurLBMax;

          if(chargeurLb === 0) result = false;
        }

        if(findChargeurLongbowListe1) {
          const chargeurL1Max = parseInt(findChargeurLongbowListe1.split(' ')[1]);

          let chargeurL1 = dataLongbowListe1?.chargeur !== null && dataLongbowListe1?.chargeur !== undefined ? parseInt(dataLongbowListe1.chargeur) : chargeurL1Max;

          if(chargeurL1 === 0) result = false;
        }

        if(findChargeurLongbowListe2) {
          const chargeurL2Max = parseInt(findChargeurLongbowListe2.split(' ')[1]);

          let chargeurL2 = dataLongbowListe2?.chargeur !== null && dataLongbowListe2?.chargeur !== undefined ? parseInt(dataLongbowListe2.chargeur) : chargeurL2Max;

          if(chargeurL2 === 0) result = false;
        }

        if(findChargeurLongbowListe3) {
          const chargeurL3Max = parseInt(findChargeurLongbowListe3.split(' ')[1]);

          let chargeurL3 = dataLongbowListe3?.chargeur !== null && dataLongbowListe3?.chargeur !== undefined ? parseInt(dataLongbowListe3.chargeur) : chargeurL3Max;

          if(chargeurL3 === 0) result = false;
        }

        break;
    }

    return result;
  }

  addMunition(index, type) {
    const split = type.split('_');
    const capacite = split[0];
    const subcapacite = split[1];
    const dataCapacite = this.#getDataCapacite(capacite, subcapacite);
    let data = dataCapacite.data;
    let chargeur = undefined;
    let actuel = undefined;
    let name = dataCapacite.name;


    chargeur = data?.raw?.[index] ?? undefined;
    actuel = data?.chargeur === null || data?.chargeur === undefined ? parseInt(chargeur.split(' ')[1]) : data.chargeur;

    if(!data || !chargeur) return;
    if(!chargeur.includes('chargeur')) return;

    this.item.update({[dataCapacite.path]:Math.min(actuel+1, parseInt(chargeur.split(' ')[1]))})

    const exec = new game.knight.RollKnight(this.actor,
    {
    name:name,
    }).sendMessage({
        text:game.i18n.localize('KNIGHT.JETS.Remet1Charge'),
        classes:'important',
    });
  }

  removeMunition(index, type) {
    const split = type.split('_');
    const capacite = split[0];
    const subcapacite = split[1];
    const dataCapacite = this.#getDataCapacite(capacite, subcapacite);
    let data = dataCapacite.data;
    let chargeur = undefined;
    let actuel = undefined;
    let name = dataCapacite.name;

    if(!data) return;

    chargeur = data?.raw?.[index] ?? undefined;

    if(!data || !chargeur) return;
    if(!chargeur.includes('chargeur')) return;

    actuel = data?.chargeur === null || data?.chargeur === undefined ? parseInt(chargeur.split(' ')[1]) : data.chargeur;

    this.item.update({[dataCapacite.path]:Math.min(actuel-1, parseInt(chargeur.split(' ')[1]))})

    const exec = new game.knight.RollKnight(this.actor,
    {
    name:name,
    }).sendMessage({
        text:game.i18n.localize('KNIGHT.JETS.Retire1Charge'),
        classes:'important',
    });
  }

  useMunition(type, weapon, updates={}) {
    const capacite = type
    .replaceAll(/borealis[DC]/g, 'borealis')
    .replaceAll(/cea(Vague|Salve|Rayon)(C|D)/g, '$1')
    .replaceAll(/morph(Griffe|Lame|Canon)/g, '$1')
    .toLowerCase();

    switch(capacite) {
      case 'borealis':
        const mainStd = this.#getDataCapacite(capacite);
        const dataStd = mainStd.data;
        const findChargeurStd = dataStd.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeurStd) return;

        const chargeurStdMax = parseInt(findChargeurStd.split(' ')[1]);

        let chargeurStd = dataStd?.chargeur !== null && dataStd?.chargeur !== undefined ? parseInt(dataStd.chargeur) : chargeurStdMax;

        updates[`armure.${mainStd.path}`] = Math.max(chargeurStd-1, 0);
        break;

      case 'salve':
      case 'vague':
      case 'rayon':
        const mainCea = this.#getDataCapacite('cea', capacite);
        const dataCea = mainCea.data;
        const findChargeurCea = dataCea.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeurCea) return;

        const chargeurCeaMax = parseInt(findChargeurCea.split(' ')[1]);

        let chargeurCea = dataCea?.chargeur !== null && dataCea?.chargeur !== undefined ? parseInt(dataCea.chargeur) : chargeurCeaMax;

        updates[`armure.${mainCea.path}`] = Math.max(chargeurCea-1, 0);
        break;

      case 'griffe':
      case 'lame':
      case 'canon':
        const mainMorph = this.#getDataCapacite('morph', capacite);
        const dataMorph = mainMorph.data;
        const findChargeurMorph = dataMorph.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeurMorph) return;

        const chargeurMorphMax = parseInt(findChargeurMorph.split(' ')[1]);

        let chargeurMorph = dataMorph?.chargeur !== null && dataMorph?.chargeur !== undefined ? parseInt(dataMorph.chargeur) : chargeurMorphMax;
        updates[`armure.${mainMorph.path}`] = Math.max(chargeurMorph-1, 0);
        break;

      case 'longbow':
        const mainLBBase = this.#getDataCapacite('longbow', 'base');
        const mainLBListe1 = this.#getDataCapacite('longbow', 'liste1');
        const mainLBListe2 = this.#getDataCapacite('longbow', 'liste2');
        const mainLBListe3 = this.#getDataCapacite('longbow', 'liste3');
        const dataLongbowBase = mainLBBase.data;
        const dataLongbowListe1 = mainLBListe1.data;
        const dataLongbowListe2 = mainLBListe2.data;
        const dataLongbowListe3 = mainLBListe3.data;
        const findChargeurLongbowBase = dataLongbowBase.raw.find(itm => itm.includes('chargeur'));
        const findChargeurLongbowListe1 = weapon?.possibility?.liste1?.selected?.find(itm => itm.includes('chargeur')) ?? undefined;
        const findChargeurLongbowListe2 = weapon?.possibility?.liste2?.selected?.find(itm => itm.includes('chargeur')) ?? undefined;
        const findChargeurLongbowListe3 = weapon?.possibility?.liste3?.selected?.find(itm => itm.includes('chargeur')) ?? undefined;

        if(findChargeurLongbowBase) {
          const chargeurLBMax = parseInt(findChargeurLongbowBase.split(' ')[1]);

          let chargeurLb = dataLongbowBase?.chargeur !== null && dataLongbowBase?.chargeur !== undefined ? parseInt(dataLongbowBase.chargeur) : chargeurLBMax;

          updates[`armure.${mainLBBase.path}`] = Math.max(chargeurLb-1, 0);
        }

        if(findChargeurLongbowListe1) {
          const chargeurL1Max = parseInt(findChargeurLongbowListe1.split(' ')[1]);

          let chargeurL1 = dataLongbowListe1?.chargeur !== null && dataLongbowListe1?.chargeur !== undefined ? parseInt(dataLongbowListe1.chargeur) : chargeurL1Max;

          updates[`armure.${mainLBListe1.path}`] = Math.max(chargeurL1-1, 0);
        }

        if(findChargeurLongbowListe2) {
          const chargeurL2Max = parseInt(findChargeurLongbowListe2.split(' ')[1]);

          let chargeurL2 = dataLongbowListe2?.chargeur !== null && dataLongbowListe2?.chargeur !== undefined ? parseInt(dataLongbowListe2.chargeur) : chargeurL2Max;

          updates[`armure.${mainLBListe2.path}`] = Math.max(chargeurL2-1, 0);
        }

        if(findChargeurLongbowListe3) {
          const chargeurL3Max = parseInt(findChargeurLongbowListe3.split(' ')[1]);

          let chargeurL3 = dataLongbowListe3?.chargeur !== null && dataLongbowListe3?.chargeur !== undefined ? parseInt(dataLongbowListe3.chargeur) : chargeurL3Max;

          updates[`armure.${mainLBListe3.path}`] = Math.max(chargeurL3-1, 0);
        }

        break;
    }

    /*if(!this.actor) return;

    this.actor.render();*/

    /*const type = this.type;

    if(type === 'contact') {
      if(this.options2mains.has) {
        const actuel = this.options2mains?.actuel ?? '1main';
        const effets = actuel === '1main' ? this.effets : this.effets2mains;
        const findChargeur = effets.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeur) return;

        const chargeurMax = parseInt(findChargeur.split(' ')[1]);

        let chargeur = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        if(actuel === '1main') {
          Object.defineProperty(this.effets, 'chargeur', {
            value: Math.max(chargeur-1, 0),
            writable:true,
            enumerable:true,
            configurable:true
          });
        } else {
          Object.defineProperty(this.effets2mains, 'chargeur', {
            value: Math.max(chargeur-1, 0),
            writable:true,
            enumerable:true,
            configurable:true
          });
        }
      } else {
        const effets = this.effets;
        const findChargeur = effets.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeur) return;

        const chargeurMax = parseInt(findChargeur.split(' ')[1]);

        let chargeur = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        Object.defineProperty(this.effets, 'chargeur', {
          value: Math.max(chargeur-1, 0),
          writable:true,
          enumerable:true,
          configurable:true
        });
      }
    }
    else if(type === 'distance') {
      const effets = this.effets;
      const findChargeurBase = effets.raw.find(itm => itm.includes('chargeur'));

      if(findChargeurBase) {
        const chargeurMax = parseInt(findChargeurBase.split(' ')[1]);
        const chargeurActuel = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        Object.defineProperty(this.effets, 'chargeur', {
          value: Math.max(chargeurActuel-1, 0),
          writable:true,
          enumerable:true,
          configurable:true
        });
      };

      if(this.optionsmunitions.has) {
        const actuel = this.optionsmunitions.actuel;
        const munition = this.optionsmunitions?.liste?.[actuel];

        if(munition) {
          const effetsMunition = munition;
          const findChargeurMunition = munition.raw.find(itm => itm.includes('chargeur'));

          if(findChargeurMunition) {
            const chargeurMunitionMax = parseInt(findChargeurMunition.split(' ')[1]);

            let chargeurMunition = effetsMunition?.chargeur !== null && effetsMunition?.chargeur !== undefined ? parseInt(effetsMunition.chargeur) : chargeurMunitionMax;

            Object.defineProperty(this.optionsmunitions.liste[actuel], 'chargeur', {
              value: Math.max(chargeurMunition-1, 0),
              writable:true,
              enumerable:true,
              configurable:true
            });
          }
        }
      }
    }

    if(!this.actor) return;

    this.actor.render();*/
  }

  resetMunition() {
    const list = ['borealis', 'cea', 'changeling', 'illumination', 'longbow', 'morph', 'oriflamme'];
    const capacites = this.capacites.selected;
    let updates = {};

    for(const l of list) {
      if(capacites?.[l] ?? undefined) {
        switch(l) {
          case 'borealis':
          case 'changeling':
          case 'illumination':
          case 'oriflamme':
            const std = this.#getDataCapacite(l, undefined);

            const findChargeurStd = std.data.raw.find(itm => itm.includes('chargeur'));

            if(findChargeurStd) {
              updates[`${dataStd.path}`] = parseInt(findChargeurStd.split(' ')[1]);
            }
            break;

          case 'cea':
            const salve = this.#getDataCapacite(l, 'salve');
            const vague = this.#getDataCapacite(l, 'vague');
            const rayon = this.#getDataCapacite(l, 'rayon');

            const findChargeurSalve = salve.data.raw.find(itm => itm.includes('chargeur'));
            const findChargeurVague = vague.data.raw.find(itm => itm.includes('chargeur'));
            const findChargeurRayon = rayon.data.raw.find(itm => itm.includes('chargeur'));

            if(findChargeurSalve) {
              updates[`${salve.path}`] = parseInt(findChargeurSalve.split(' ')[1]);
            }

            if(findChargeurVague) {
              updates[`${vague.path}`] = parseInt(findChargeurVague.split(' ')[1]);
            }

            if(findChargeurRayon) {
              updates[`${rayon.path}`] = parseInt(findChargeurRayon.split(' ')[1]);
            }
            break;

          case 'longbow':
            const lbBase = this.#getDataCapacite(l, 'base');
            const lbListe1 = this.#getDataCapacite(l, 'liste1');
            const lbListe2 = this.#getDataCapacite(l, 'liste2');
            const lbListe3 = this.#getDataCapacite(l, 'liste3');

            const findChargeurLbBase = lbBase.data.raw.find(itm => itm.includes('chargeur'));
            const findChargeurLbListe1 = lbListe1.data.raw.find(itm => itm.includes('chargeur'));
            const findChargeurLbListe2 = lbListe2.data.raw.find(itm => itm.includes('chargeur'));
            const findChargeurLbListe3 = lbListe3.data.raw.find(itm => itm.includes('chargeur'));

            if(findChargeurLbBase) {
              updates[`${lbBase.path}`] = parseInt(findChargeurLbBase.split(' ')[1]);
            }

            if(findChargeurLbListe1) {
              updates[`${lbListe1.path}`] = parseInt(findChargeurLbListe1.split(' ')[1]);

            }

            if(findChargeurLbListe2) {
              updates[`${lbListe2.path}`] = parseInt(findChargeurLbListe2.split(' ')[1]);
            }

            if(findChargeurLbListe3) {
              updates[`${lbListe3.path}`] = parseInt(findChargeurLbListe3.split(' ')[1]);
            }
            break;

          case 'morph':
            const griffe = this.#getDataCapacite(l, 'griffe');
            const lame = this.#getDataCapacite(l, 'lame');
            const canon = this.#getDataCapacite(l, 'canon');

            const findChargeurGriffe = griffe.data.raw.find(itm => itm.includes('chargeur'));
            const findChargeurLame = lame.data.raw.find(itm => itm.includes('chargeur'));
            const findChargeurCanon = canon.data.raw.find(itm => itm.includes('chargeur'));

            if(findChargeurGriffe) {
              updates[`${griffe.path}`] = parseInt(findChargeurGriffe.split(' ')[1]);
            }

            if(findChargeurLame) {
              updates[`${lame.path}`] = parseInt(findChargeurLame.split(' ')[1]);
            }

            if(findChargeurCanon) {
              updates[`${canon.path}`] = parseInt(findChargeurCanon.split(' ')[1]);
            }
            break;
        }
      }
    }

    if(!foundry.utils.isEmpty(updates)) this.item.update(updates);
  }

  #getDataCapacite(capacite, subcapacite) {
    const basePath = this.capacites.selected;
    const baseStringPath = 'system.capacites.selected'
    let name = this.item.name
    let data = undefined;
    let path = '';

    switch(capacite) {
      case 'borealis':
        name = `${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.OFFENSIF.Label')}`
        data = basePath.borealis.offensif.effets;
        path = `${baseStringPath}.borealis.offensif.effets.chargeur`;
        break;

      case 'cea':
        name = `${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${capacite.toUpperCase()}.Label`)} - ${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${capacite.toUpperCase()}.${subcapacite.toUpperCase()}.Label`)}`
        data = basePath.cea[subcapacite].effets;
        path = `${baseStringPath}.cea.${subcapacite}.effets.chargeur`;
        break;

      case 'changeling':
        name = `${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CHANGELING.Label')}`
        data = basePath.changeling.desactivationexplosive.effets;
        path = `${baseStringPath}.changeling.desactivationexplosive.effets.chargeur`;
        break;

      case 'illumination':
        name = `${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.LANTERN.Label')}`
        data = basePath.illumination.lantern.effets;
        path = `${baseStringPath}.illumination.lantern.effets.chargeur`;
        break;

      case 'longbow':
        name = `${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.LONGBOW.Label')}`
        data = basePath.longbow.effets[subcapacite];
        path = `${baseStringPath}.longbow.effets.${subcapacite}.chargeur`;
        break;

      case 'morph':
        name = `${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${capacite.toUpperCase()}.Label`)} - ${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${capacite.toUpperCase()}.CAPACITES.POLYMORPHIE.${subcapacite.charAt(0).toUpperCase() + subcapacite.slice(1).toLowerCase()}`)}`
        data = basePath.morph.polymorphie[subcapacite].effets;
        path = `${baseStringPath}.morph.polymorphie.${subcapacite}.effets.chargeur`;
        break;

      case 'oriflamme':
        name = `${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.ORIFLAMME.Label')}`
        data = basePath.oriflamme.effets;
        path = `${baseStringPath}.oriflamme.effets.chargeur`;
        break;
    }

    return {
      name,
      data,
      path
    }
  }

  prepareBaseData() {
    if(this.generation === 4) {
      Object.defineProperty(this.jauges, 'sante', {
        value: false,
      });
    }

    Object.defineProperty(this.jauges, 'egide', {
      value: game.settings.get("knight", "acces-egide"),
    });

    this.capacites.prepareData();
  }

  async activateCapacity(args = {}) {
    const actor = this.actor;
    const armure = this.item;

    // Déstructuration défensive + valeurs par défaut
    const {
      capacite = '',
      special = '',
      variant = '',
    } = args;

    // Gardes minimales (évite les plantages)
    if (!capacite) {
      console.warn('activateCapacity: capacite manquant');
      return;
    }

    // Helpers locaux réutilisables
    const deleteActorAndTokens = async (actorId) => {
      if (!actorId) return;
      const a = game.actors?.get(actorId);
      if (!a) return;
      try {
        await deleteTokens([a.id]);   // d’abord les tokens
      } catch (e) {
        console.warn('deleteTokens a échoué (continuation)', e);
      }
      try {
        await a.delete();             // puis l’acteur
      } catch (e) {
        console.warn('actor.delete a échoué (continuation)', e);
      }
    };

    const batchDeleteItemsBy = async (actorDoc, toDelete) => {
      if (!actorDoc) return;

      if (toDelete.length) {
        await actorDoc.deleteEmbeddedDocuments('Item', toDelete);
      }
    };

    const activateAll = (arr) => {
      if (!Array.isArray(arr)) return;
      for (const o of arr) o.active = true;
    };

    const splitAE = (ae) => {
      const v = Number(ae) || 0;
      return {
        mineur: {
          value:v > 4 ? 0 : v,
        },
        majeur: {
          value:v < 5 ? 0 : v,
        }
      };
    };

    const asInt = (v, d = 0) => Number.isFinite(v) ? Math.trunc(v) : d;

    const getArmure = new ArmureAPI(armure);
    const getCapacite = getArmure.getCapacite(capacite);
    const getName = getArmure.getCapaciteActiveName(capacite, special, variant);
    const getPath = getArmure.getCapaciteActivePath(capacite, special, variant);
    const value = getArmure.isCapaciteActive(capacite, special, variant) ? false : true;
    //Number.isFinite(getArmure.getCout(capacite, special, variant)) ? Number(energie) : 0;

    // Gestion du coût et de la dépense, seulement si value === true
    if (value) {
      let strDepense = capacite;
      if(special) strDepense += `/${special}`;
      if(variant) strDepense += `/${variant}`;

      // Tente la dépense
      const depense = await this.usePEActivateCapacity(getArmure, strDepense);

      if (!depense) return; // on s’arrête si la dépense est refusée
    }

    let pb;
    let newActor;
    let sendMsg = true;
    let dialog;

    switch(capacite) {
      case 'ascension': {
        if (value) {
          // 1) Cloner proprement les données source via deepClone
          const clone = foundry.utils.deepClone(actor);
          // 2) Créer l’acteur d’ascension
          const src = await Actor.create(clone);

          // 3) Editer nom et visuels
          const newName = `${getName} : ${actor.name}`;
          const armorImg = getArmure.img ?? src.img;

          // 4) Préparer l’état ascension sur l’acteur cloné
          await PatchBuilder.for(src)
            .merge({
              name:newName,
              img:armorImg,
              'prototypeToken.texture.src':armorImg,
              'prototypeToken.name':newName,
              'system.energie.value':actor?.system?.equipements?.armure?.capacites?.ascension?.energie ?? 0,
              'system.wear':'ascension',
              'system.equipements.ascension':actor?.system?.equipements?.armure ?? {}
            })
            .apply();

          // 5) Nettoyer/adapter les items
          const filteredItems = [];
          for (const it of src.items ?? []) {
            // retirer les items de rareté prestige
            if (it?.system?.niveau?.actuel?.rarete === 'prestige') filteredItems.push(it.id);

            if (it.type === 'armure') {
              // couper les jauges sur les armures du clone
              await PatchBuilder.for(it)
                .sys('jauges', {
                  sante:false,
                  espoir:false,
                  heroisme:false,
                })
                .sys('energie.base', actor?.system?.equipements?.armure?.capacites?.ascension?.energie ?? 0)
                .apply();
            }
          }

          await batchDeleteItemsBy(src, filteredItems);
          // 6) Marquer l’état côté armure d’origine (update unique agrégé)
          await PatchBuilder.for(armure)
            .sys(getPath, {
              active:true,
              depense:actor?.system?.equipements?.armure?.capacites?.ascension?.energie ?? 0,
              ascensionId: src.id,
            })
            .apply();

          // 7) Spawner le token d’ascension
          await spawnTokenRightOfActor({ actor: src, refActor: actor });
        } else {
          // Désactivation: suppression + reset de l’état
          const ascensionId =
            getCapacite?.ascensionId ??
            getCapacite?.id ??
            null;
          await deleteActorAndTokens(ascensionId);
          await PatchBuilder.for(armure)
            .sys(getPath, {
              active: false,
              ascensionId: 0,
              depense: 0,
            })
            .apply();
        }
        break;
      }

      case "borealis":
      case "goliath":
      case "puppet":
      case "record":
      case "totem":
      case "watchtower":
      case "ghost":
      case "discord":
      case "nanoc":
        await PatchBuilder.for(armure)
          .sys(getPath, value)
          .apply();
        break;
      case "illumination":
        if(special === 'lantern' && variant === 'dgts') {
          const blaLabel = game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.LANTERN.Label")

          await this.rollDegats(blaLabel, [], [], {dice:getCapacite.lantern.degats});
          sendMsg = false;
        } else if(special === 'blaze' && variant === 'dgts') {
          const blaLabel = game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.BLAZE.Label")

          await this.rollDegats(blaLabel, [], [], {dice:getCapacite.blaze.degats});
          await this.rollViolence(blaLabel, [], [], {dice:getCapacite.blaze.violence});
          sendMsg = false;
        } else if(special !== 'candle') {
          await PatchBuilder.for(armure)
            .sys(getPath, value)
            .apply();
        }
        break;
      case "oriflamme":
        const oriLabel = game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.ORIFLAMME.Label")

        if(special.includes('degats')) this.rollDegats(oriLabel, getCapacite.effets.raw, getCapacite.effets.custom, getCapacite.degats);
        if(special.includes('violence')) this.rollViolence(oriLabel, getCapacite.effets.raw, getCapacite.effets.custom, getCapacite.violence);
        break;
      case 'changeling':
        // Cas "explosive": on désactive plusieurs flags et on applique des dégâts/violence
        if (special === 'explosive') {
          const pbC = new PatchBuilder();

          for (const p of getPath) {
            pbC.sys(p, false);
          }

          // Récupérer les effets depuis les capacités d'armure
          const effets = getCapacite?.desactivationexplosive?.effets ?? {};
          this.rollDegats(getName, effets.raw, effets.custom, getCapacite?.degats ?? {dice:1, fixe:0});
          this.rollViolence(getName, effets.raw, effets.custom, getCapacite?.violence ?? {dice:1, fixe:0});

          pbC.applyTo(armure);
        } else {
          // Cas simple: appliquer value sur le chemin fourni
          await PatchBuilder.for(armure)
            .sys(getPath, value)
            .apply();
        }
        break;
      case "companions":
        pb = new PatchBuilder();
        pb.sys(getPath, {
          [special]:value,
          base:value,
        });

        if(value) {
          switch(special) {
            case 'lion':
              const dataLion = getCapacite.lion;

              const dataLChair = dataLion.aspects.chair;
              const dataLBete = dataLion.aspects.bete;
              const dataLMachine = dataLion.aspects.machine;
              const dataLDame = dataLion.aspects.dame;
              const dataLMasque = dataLion.aspects.masque;
              const modules = actor.items.filter(itm => itm.type === 'module' && (itm.system?.isLion ?? false));
              newActor = await createSheet(
                actor,
                "pnj",
                `${actor.name} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.LION.Label")}`,
                {
                  "aspects": {
                    "chair":{
                      "value":dataLChair.value,
                      "ae":splitAE(dataLChair.ae),
                    },
                    "bete":{
                      "value":dataLBete.value,
                      "ae":splitAE(dataLBete.ae),
                    },
                    "machine":{
                      "value":dataLMachine.value,
                      "ae":splitAE(dataLMachine.ae),
                    },
                    "dame":{
                      "value":dataLDame.value,
                      "ae":splitAE(dataLDame.ae),
                    },
                    "masque":{
                      "value":dataLMasque.value,
                      "ae":splitAE(dataLMasque.ae),
                    }
                  },
                  "energie":{
                    "base":actor?.system?.equipements?.armure?.capacites?.companions?.energie ?? 0,
                    "value":actor?.system?.equipements?.armure?.capacites?.companions?.energie ?? 0,
                  },
                  "champDeForce":{
                    "base":dataLion.champDeForce.base,
                  },
                  "armure":{
                    "value":dataLion.armure.base,
                    "base":dataLion.armure.base
                  },
                  "initiative":{
                    "diceBase":dataLion.initiative.value
                  },
                  "defense":{
                    "base":dataLion.defense.value
                  },
                  "reaction":{
                    "base":dataLion.reaction.value
                  },
                  "options":{
                    "resilience":false,
                    "sante":false,
                    "espoir":false,
                    "bouclier":false,
                    "noCapacites":true,
                    "modules":true,
                    "phase2":false
                  }
                },
                [],
                dataLion.img,
                dataLion?.token ?? dataLion.img,
                1
              );

              await PatchBuilder.for(newActor)
                .sys('initiative.bonus.user', dataLion.initiative.fixe)
                .apply();

              const nLItems = modules;

              const nLItem = {
                name:dataLion.armes.contact.coups.label,
                type:'arme',
                system:{
                  type:'contact',
                  portee:dataLion.armes.contact.coups.portee,
                  degats:{
                    dice:dataLion.armes.contact.coups.degats.dice,
                    fixe:dataLion.armes.contact.coups.degats.fixe
                  },
                  violence:{
                    dice:dataLion.armes.contact.coups.violence.dice,
                    fixe:dataLion.armes.contact.coups.violence.fixe
                  },
                  effets:{
                    raw:dataLion.armes.contact.coups.effets.raw,
                    custom:dataLion.armes.contact.coups.effets.custom
                  }
              }};

              nLItems.push(nLItem);

              await newActor.createEmbeddedDocuments("Item", nLItems);

              pb.sys('capacites.selected.companions.lion.id', newActor.id);

              await spawnTokenRightOfActor({actor:newActor, refActor:actor});
              break;

            case 'wolf':
              const dataWolf = getCapacite.wolf;

              const dataWChair = dataWolf.aspects.chair;
              const dataWBete = dataWolf.aspects.bete;
              const dataWMachine = dataWolf.aspects.machine;
              const dataWDame = dataWolf.aspects.dame;
              const dataWMasque = dataWolf.aspects.masque;
              const createdActors = [];
              const dataActor = {
                "aspects": {
                  "chair":{
                    "value":dataWChair.value
                  },
                  "bete":{
                    "value":dataWBete.value
                  },
                  "machine":{
                    "value":dataWMachine.value
                  },
                  "dame":{
                    "value":dataWDame.value
                  },
                  "masque":{
                    "value":dataWMasque.value
                  }
                },
                "energie":{
                  "base":actor?.system?.equipements?.armure?.capacites?.companions?.energie ?? 0,
                  "value":actor?.system?.equipements?.armure?.capacites?.companions?.energie ?? 0,
                },
                "champDeForce":{
                  "base":dataWolf.champDeForce.base,
                },
                "armure":{
                  "value":dataWolf.armure.base,
                  "base":dataWolf.armure.base
                },
                "initiative":{
                  "diceBase":dataWolf.initiative.value
                },
                "defense":{
                  "base":dataWolf.defense.base
                },
                "reaction":{
                  "base":dataWolf.reaction.base
                },
                "wolf":dataWolf.configurations,
                "configurationActive":'',
                "options":{
                  "resilience":false,
                  "sante":false,
                  "espoir":false,
                  "bouclier":false,
                  "modules":false,
                  "noCapacites":true,
                  "wolfConfiguration":true
                }
              };

              for(let i = 1;i < 4;i++) {
                newActor = await createSheet(
                  actor,
                  "pnj",
                  `${actor.name} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.Label")} ${i}`,
                  dataActor,
                  {},
                  dataWolf.img,
                  dataWolf?.token ?? dataWolf.img,
                  1
                );

                await PatchBuilder.for(newActor)
                  .sys('initiative.bonus.user', dataWolf.initiative.fixe)
                  .apply();
                const nWItems = [];
                const nWItem = {
                  name:dataWolf.armes.contact.coups.label,
                  type:'arme',
                  system:{
                    type:'contact',
                    portee:dataWolf.armes.contact.coups.portee,
                    degats:{
                      dice:dataWolf.armes.contact.coups.degats.dice,
                      fixe:dataWolf.armes.contact.coups.degats.fixe
                    },
                    violence:{
                      dice:dataWolf.armes.contact.coups.violence.dice,
                      fixe:dataWolf.armes.contact.coups.violence.fixe
                    },
                    effets:{
                      raw:dataWolf.armes.contact.coups.effets.raw,
                      custom:dataWolf.armes.contact.coups.effets.custom
                    }
                }};

                nWItems.push(nWItem);

                await newActor.createEmbeddedDocuments("Item", nWItems);

                pb.sys(`capacites.selected.companions.wolf.id.id${i}`, newActor.id);
                createdActors.push(newActor);
              }

              await spawnTokensRightOfActor(createdActors, actor);
              break;

            case 'crow':
              const dataCrow = getCapacite.crow;

              const dataCChair = dataCrow.aspects.chair;
              const dataCBete = dataCrow.aspects.bete;
              const dataCMachine = dataCrow.aspects.machine;
              const dataCDame = dataCrow.aspects.dame;
              const dataCMasque = dataCrow.aspects.masque;

              newActor = await createSheet(
                actor,
                "bande",
                `${actor.name} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.CROW.Label")}`,
                {
                  "aspects": {
                    "chair":{
                      "value":dataCChair.value
                    },
                    "bete":{
                      "value":dataCBete.value
                    },
                    "machine":{
                      "value":dataCMachine.value
                    },
                    "dame":{
                      "value":dataCDame.value
                    },
                    "masque":{
                      "value":dataCMasque.value
                    }
                  },
                  "energie":{
                    "value":actor?.system?.equipements?.armure?.capacites?.companions?.energie ?? 0,
                    "max":actor?.system?.equipements?.armure?.capacites?.companions?.energie ?? 0,
                  },
                  "champDeForce":{
                    "base":dataCrow.champDeForce.base,
                  },
                  "sante":{
                    "value":dataCrow.cohesion.base,
                    "base":dataCrow.cohesion.base
                  },
                  "initiative":{
                    "diceBase":dataCrow.initiative.value
                  },
                  "defense":{
                    "base":dataCrow.defense.value
                  },
                  "reaction":{
                    "base":dataCrow.reaction.value
                  },
                  "debordement":{
                    "value":dataCrow.debordement.base
                  },
                  "options":{
                    "resilience":false,
                    "sante":false,
                    "espoir":false,
                    "bouclier":false,
                    "noCapacites":true,
                    "energie":true,
                    "modules":false
                  }
                },
                {},
                dataCrow.img,
                dataCrow?.token ?? dataCrow.img,
                1
              );
              await PatchBuilder.for(newActor)
                .sys('initiative.bonus.user', dataCrow.initiative.fixe)
                .apply();

              pb.sys(`capacites.selected.companions.crow.id`, newActor.id);

              await spawnTokenRightOfActor({actor:newActor, refActor:actor});
              break;
          }

          const msgCompanions = {
            flavor:`${getName}`,
            main:{
              total:`${game.i18n.format("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.Invocation", {type:game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.${special.toUpperCase()}.Label`)})}`
            }
          };

          const msgActiveCompanions = {
            user: game.user.id,
            speaker: {
              actor: actor?.id || null,
              token: actor?.token?.id || null,
              alias: actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgCompanions),
            sounds:CONFIG.sounds.notification,
          };

          await ChatMessage.create(msgActiveCompanions);
        } else {
          let recupValue = 0;

          switch(special) {
            case 'lion':
              const idLion = getCapacite.lion.id;
              const actorLion = game.actors?.get(idLion) || {};
              recupValue = actorLion?.system?.energie?.value || 0;

              this.givePE(recupValue, getArmure);

              await deleteTokens([actorLion.id]);

              if(Object.keys(actorLion).length != 0) await actorLion.delete();
              break;

            case 'wolf':
              const id1Wolf = getCapacite.wolf.id.id1;
              const id2Wolf = getCapacite.wolf.id.id2;
              const id3Wolf = getCapacite.wolf.id.id3;
              const actor1Wolf = game.actors?.get(id1Wolf) || {};
              const actor2Wolf = game.actors?.get(id2Wolf) || {};
              const actor3Wolf = game.actors?.get(id3Wolf) || {};

              recupValue = actor1Wolf?.system?.energie?.value || 0;

              this.givePE(recupValue, getArmure);

              await deleteTokens([actor1Wolf.id, actor2Wolf.id, actor3Wolf.id]);

              if(Object.keys(actor1Wolf).length != 0) await actor1Wolf.delete();
              if(Object.keys(actor2Wolf).length != 0) await actor2Wolf.delete();
              if(Object.keys(actor3Wolf).length != 0) await actor3Wolf.delete();
              break;

            case 'crow':
              const idCrow = getCapacite.crow.id;
              const actorCrow = game.actors?.get(idCrow) || {};

              recupValue = actorCrow?.system?.energie?.value || 0;

              this.givePE(recupValue, getArmure);

              await deleteTokens([actorCrow.id]);

              if(Object.keys(actorCrow).length != 0) await actorCrow.delete();
              break;
          }

          const msgCompanions = {
            flavor:`${getName}`,
            main:{
              total:`${game.i18n.format("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.Revocation", {type:game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.${special.toUpperCase()}.Label`)})}`
            }
          };

          const msgActiveCompanions = {
            user: game.user.id,
            speaker: {
              actor: actor?.id || null,
              token: actor?.token?.id || null,
              alias: actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgCompanions),
            sounds:CONFIG.sounds.notification,
          };

          await ChatMessage.create(msgActiveCompanions);
        }

        await pb.applyTo(armure);
        break;
      case "shrine":
        await PatchBuilder.for(armure)
          .sys(getPath, {
            base:value,
            [special]:value,
          })
          .apply();
        break;
      case "morph":
        pb = new PatchBuilder();

        if(!special) {
          pb.sys(getPath.split('.').slice(0, -1).join('.'), {
              'morph':value,
              'polymorphieLame':false,
              'polymorphieGriffe':false,
              'polymorphieCanon':false,
            })
          pb.sys(`${getPath.split('.').slice(0, -2).join('.')}.choisi`, {
              'vol':false,
              'phase':false,
              'etirement':false,
              'metal':false,
              'fluide':false,
              'polymorphie':false,
              'polymorphieLame':false,
              'polymorphieGriffe':false,
              'polymorphieCanon':false,
            })
        }
        else if(special !== 'polymorphieReset' && (special !== 'phase' || special !== 'phaseN2')) pb.sys(getPath, value);
        else if(special === 'polymorphieReset') {
          sendMsg = false;

          pb.sys(getPath, {
              'polymorphieLame':false,
              'polymorphieGriffe':false,
              'polymorphieCanon':false,
            })
        }

        if(variant === 'choix') sendMsg = false;

        await pb.applyTo(armure);
        break;
      case "rage":
        const rageInterdit = [];
        const rageBonus = [];

        if(!special) {
          pb = new PatchBuilder();

          pb.sys(getPath[0], value);

          if(value) {
            pb.sys(getPath[1], {
              colere:true,
            });

            if(getCapacite.colere.combosInterdits.has) {
              for (let [key, combo] of Object.entries(getCapacite.colere.combosInterdits.liste)){
                if(combo != "") {
                  rageInterdit.push(combo);
                }
              }
            }

            if(getCapacite.colere.combosBonus.has) {
              for (let [key, combo] of Object.entries(getCapacite.colere.combosBonus.liste)){
                if(combo != "") {
                  rageBonus.push(combo);
                }
              }
            }
          }
          else {
            pb.sys(getPath[1], {
              colere:false,
              rage:false,
              fureur:false,
            });
          }

          await pb.applyTo(armure);
          await PatchBuilder.for(actor)
            .sys('combos.interdits.caracteristiques.rage', value ? rageInterdit : [])
            .sys('combos.bonus.caracteristiques.rage', value ? rageBonus : [])
            .apply();
        } else if(special === 'niveau') {
          sendMsg = false;
          pb = new PatchBuilder();
          const nActuel = getCapacite?.niveau || false;

          if(variant === 'ennemi') {
            new game.knight.RollKnight(actor,
            {
              name:`${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.UP.Label")}`,
            }).sendMessage({
                text: game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.UP.Ennemi"),
                sounds:CONFIG.sounds.notification,
            });
          }

          if(nActuel.colere) {
            pb.sys(getPath, {
              colere:false,
              rage:true,
            });

            if(getCapacite.rage.combosInterdits.has) {
              for (let [key, combo] of Object.entries(getCapacite.rage.combosInterdits.liste)){
                if(combo != "") {
                  rageInterdit.push(combo);
                }
              }
            }

            if(getCapacite.rage.combosBonus.has) {
              for (let [key, combo] of Object.entries(getCapacite.rage.combosBonus.liste)){
                if(combo != "") {
                  rageBonus.push(combo);
                }
              }
            }
          } else if(nActuel.rage) {
            pb.sys(getPath, {
              colere:false,
              rage:false,
              fureur:true,
            });

            if(getCapacite.fureur.combosInterdits.has) {
              for (let [key, combo] of Object.entries(getCapacite.fureur.combosInterdits.liste)){
                if(combo != "") {
                  rageInterdit.push(combo);
                }
              }
            }

            if(getCapacite.fureur.combosBonus.has) {
              for (let [key, combo] of Object.entries(getCapacite.fureur.combosBonus.liste)){
                if(combo != "") {
                  rageBonus.push(combo);
                }
              }
            }
          }

          await pb.applyTo(armure);
          await PatchBuilder.for(this)
            .sys('combos.interdits.caracteristiques.rage', rageInterdit)
            .sys('combos.bonus.caracteristiques.rage', rageBonus)
            .apply();

          const exec = new game.knight.RollKnight(this,
            {
            name:game.i18n.localize(`KNIGHT.ACTIVATION.Label`),
            }).sendMessage({
                text:`${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.Label")} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.UP.Label")}`,
                sounds:CONFIG.sounds.notification,
            });
        } else if(special === 'degats') {
          sendMsg = false;
          const niveauActuel = Object.keys(getCapacite?.niveau ?? {}).find(k => getCapacite.niveau[k] === true) ?? null;
          const degatsRage = getCapacite[niveauActuel].subis;
          const degatsLabel = game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.SubirDegats");
          const sante = this.system.sante.value;

          const rDegats = new game.knight.RollKnight(this, {
            name:`${getName} : ${degatsLabel}`,
            dices:`${degatsRage}D6`,
          }, false);

          await rDegats.doRoll({['system.sante.value']:`@{max, 0} ${sante}-@{rollTotal}`});
        } else if(special === 'recuperation') {
          sendMsg = false;
          const recuperationRage = variant.split('/');
          const labelRecuperationRage = recuperationRage[0] === 'proche' ? game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.TUE.Proche") : `${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.TUE.${capitalizeFirstLetter(recuperationRage[0])}`)} : ${game.i18n.localize(`KNIGHT.TYPE.${capitalizeFirstLetter(recuperationRage[1])}`)}`;
          const getRecuperationRageDices = recuperationRage[0] === 'proche' ? {dice:0, face:6, fixe:1}: getCapacite.nourri[recuperationRage[0]][recuperationRage[1]];

          const rRecuperation = new game.knight.RollKnight(this, {
            name:game.i18n.localize("KNIGHT.GAINS.Espoir") + ` (${labelRecuperationRage})`,
            dices:`${getRecuperationRageDices.dice}D${getRecuperationRageDices.face}+${getRecuperationRageDices.fixe}`,
          }, false);

          this.givePE(await rRecuperation.doRoll(), getArmure, true);
        } else if(special === 'blaze') {
          const blaLabel = game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.BLAZE.Label")

          await this.rollDegats(blaLabel, [], [], {dice:getCapacite.blaze.degats});
          await this.rollViolence(blaLabel, [], [], {dice:getCapacite.blaze.violence});
        }
        break;
      case "warlord":
        if(special !== 'energie') {
          await PatchBuilder.for(armure)
            .sys(getPath, value)
            .apply();
        }
        break;
      case "zen":
        function collectTrueNames(data) {
          const out = [];
          for (const [branche, bloc] of Object.entries(data)) {
            const caracs = bloc && bloc.caracteristiques;
            if (!caracs || typeof caracs !== "object") continue;

            for (const [nom, details] of Object.entries(caracs)) {
              if (details && details.value === true) {
                out.push(nom);
              }
            }
          }
          return out;
        }

        const listC = collectTrueNames(getCapacite.aspects)

        const autre = [].concat(listC);
        autre.shift();

        dialog = new game.knight.applications.KnightRollDialog(actor._id, {
          label:getName,
          base:listC[0],
          whatRoll:autre,
          difficulte:5,
        });

        dialog.open();
        break;
      case "type":
        await PatchBuilder.for(armure)
          .sys(getPath, value)
          .apply();
        break;
      case "mechanic":
        const mechanic = getCapacite.reparation[special];
        const roll = new game.knight.RollKnight(this, {
          name:`${getName}`,
          dices:`${mechanic.dice}D6+${mechanic.fixe}`,
        }, false);

        await roll.doRoll();
        break;

      default:
        console.warn(`activateCapacity: capacité inconnue "${capacite}"`);
        break;
    }

    if(sendMsg) {
      const exec = new game.knight.RollKnight(actor,
        {
        name:value ? game.i18n.localize(`KNIGHT.ACTIVATION.Label`) : game.i18n.localize(`KNIGHT.ACTIVATION.Desactivation`),
        }).sendMessage({
            text:getName,
            sounds:CONFIG.sounds.notification,
        });
    }
  }

  async activateSpecial(args = {}) {
    const actor = this.actor;
    const armure = this.item;

    // Déstructuration défensive + valeurs par défaut
    const {
      capacite = '',
      special = '',
      variant = '',
    } = args;

    // Gardes minimales (évite les plantages)
    if (!capacite) {
      console.warn('activateSpecial: special manquant');
      return;
    }

    const getArmure = new ArmureAPI(armure);
    const getSpecial = getArmure.getSpecial(capacite);
    const getName = getArmure.getSpecialActiveName(capacite, special, variant);

    let dialog;

    switch(capacite) {
      case 'contrecoups':
        dialog = new game.knight.applications.KnightRollDialog(actor._id, {
          label:getName,
          base:getSpecial.jet[special],
          difficulte:actor?.system?.equipements?.armure?.special?.[capacite],
          btn:{
            nood:true,
          }
        });

        dialog.open();
        break;

      case 'impregnation':
        dialog = new game.knight.applications.KnightRollDialog(actor._id, {
          label:getName,
          base:getSpecial.jets[`c1${special}`],
          whatRoll:[getSpecial.jets[`c2${special}`]],
        });

        dialog.open();
        break;

      case 'energiedeficiente':
        const roll = new game.knight.RollKnight(actor, {
          name:getName,
          dices:`${special}D6`,
        }, false);

        const rTotal = await roll.doRoll();

        this.givePE(rTotal, getArmure)
        break;

      case 'recolteflux':
        let flux = actor?.system?.flux?.value ?? 0;
        let bonus = 0;

        if(special === 'horsconflit') {
          const limiteFlux = getSpecial?.horsconflit?.limite ?? 0;

          bonus += (actor?.system?.equipements?.armure?.special?.flux ?? 0)*(getSpecial?.horsconflit?.base ?? 0);

          if((flux+bonus) > limiteFlux) bonus = limiteFlux - flux;;
        } else if(special === 'conflit') {
          if(variant === 'debut') bonus += getSpecial?.conflit?.base ?? 0;
          else if(variant === 'tour') bonus += getSpecial?.conflit?.tour ?? 0;
          else if(variant === 'hostile') bonus += getSpecial?.conflit?.hostile ?? 0;
          else if(variant === 'salopard') bonus += getSpecial?.conflit?.salopard ?? 0;
          else if(variant === 'patron') bonus += getSpecial?.conflit?.patron ?? 0;
        }

        flux += bonus;

        await PatchBuilder.for(this)
          .sys("flux.value", flux)
          .apply();

        const dataMsg = {
          flavor:getName,
          main:{
            total:bonus
          }
        };

        const msg = {
          user: game.user.id,
          speaker: {
            actor: actor?.id || null,
            token: actor?.token?.id || null,
            alias: actor?.name || null,
          },
          type: CONST.CHAT_MESSAGE_TYPES.OTHER,
          content: await renderTemplate('systems/knight/templates/dices/wpn.html', dataMsg)
        };

        const rMode = game.settings.get("core", "rollMode");
        const msgFData = ChatMessage.applyRollMode(msg, rMode);

        await ChatMessage.create(msgFData, {
          rollMode:rMode
        });
        break;
    }
  }

  async prolongateCapacity(args = {}) {
    const actor = this.actor;
    const armure = this.item;
    // Déstructuration défensive + valeurs par défaut
    const {
      capacite = '',
      special = '',
      variant = '',
      forceEspoir = false,
    } = args;

    // Gardes minimales (évite les plantages)
    if (!capacite) {
      console.warn('prolongateCapacity: capacite manquant');
      return;
    }

    const getArmure = new ArmureAPI(armure);
    const getName = getArmure.getCapaciteActiveName(capacite, special, variant);

    const ask = await this.usePEProlongateCapacity({armure:getArmure, capacite, special, variant});
    if(!ask) return;

    let label = game.i18n.localize("KNIGHT.AUTRE.Prolonger");

    const exec = new game.knight.RollKnight(actor,
      {
      name:label,
      }).sendMessage({
          text:getName,
          sounds:CONFIG.sounds.notification,
      });
  }

  async usePEActivateCapacity(armure, capacite, forceEspoir = false) {
    const actor = this.actor;
    const split = capacite.split('/');
    const mainLabel = game.i18n.localize(CONFIG.KNIGHT.capacites[split[0]]);
    const subLabel = split[1] ? ` ${game.i18n.localize(CONFIG.KNIGHT[split[1]])}` : '';
    const label = subLabel ? `${mainLabel} : ${subLabel}` : mainLabel;

    const remplaceEnergie = armure.espoirRemplaceEnergie;
    const getType = remplaceEnergie || forceEspoir ? 'espoir' : 'energie';
    const getCapacite = armure.getCapacite(split[0]);
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

    let depenseEnergie = 0;
    let depenseFlux = 0;
    let depenseEspoir = 0;
    let substractEnergie = 0;
    let substractEspoir = 0;
    let substractFlux = 0;

    switch(split[0]) {
      case 'ascension':
        depenseEnergie = actor?.system?.equipements?.armure?.capacites?.ascension?.energie ?? 0;
        break;

      case 'borealis':
        depenseEnergie = split[1] === 'support' ?
          getCapacite[split[1]].energie.base + (getCapacite[split[1]].energie.allie * actor?.system?.equipements?.armure?.capacites?.borealis?.allie ?? 0) :
          getCapacite[split[1]].energie;
        break;

      case 'changeling':
        if(split[1] !== 'explosive') {
          depenseEnergie = split[1] === 'fauxEtre' ?
            getCapacite.energie[split[1]].value * actor?.system?.equipements?.armure?.capacites?.changeling?.fauxetres ?? 0 :
            getCapacite.energie[split[1]];
        }
        break;

      case 'companions':
        depenseEnergie = getCapacite.energie.base + actor?.system?.equipements?.armure?.capacites?.companions?.energie ?? 0;
        break;

      case 'discord':
        depenseEnergie = getCapacite[split[1]].energie;
        depenseFlux = getCapacite[split[1]].flux;
        break;

      case 'windtalker':
        depenseEnergie = getCapacite.energie;
        depenseFlux = getCapacite.flux;
        break;

      case 'falcon':
      case 'forward':
      case 'record':
      case 'rewind':
      case 'oriflamme':
      case 'watchtower':
        depenseEnergie = getCapacite.energie;
        break;

      case 'goliath':
        depenseEnergie = getCapacite.energie * actor?.system?.equipements?.armure?.capacites?.goliath?.metre ?? 0;
        break;

      case 'nanoc':
      case 'mechanic':
        depenseEnergie = getCapacite.energie[split[1]];
        break;

      case 'shrine':
        if(split[1] === 'distance' || split[1] === 'personnel') depenseEnergie = getCapacite.energie[split[1]];
        else if(split[1] === 'distance6' || split[1] === 'personnel6') depenseEnergie = getCapacite.energie[`${split[1]}tours`];
        break;

      case 'ghost':
        depenseEnergie = getCapacite.energie[split[1] === 'conflit' ? 'tour' : 'minute'];
        break;

      case 'type':
        depenseEnergie = getCapacite.energie[split[2] === 'conflit' ? 'tour' : 'scene'];
        break;

      case 'totem':
        depenseEnergie = getCapacite.energie.base * actor?.system?.equipements?.armure?.capacites?.totem?.nombre ?? 0;
        break;

      case 'puppet':
        depenseEnergie = getCapacite.energie.ordre + (actor?.system?.equipements?.armure?.capacites?.puppet?.cible ?? 0 * getCapacite.energie.supplementaire);
        break;

      case 'illumination':
        if(split[1] === 'candle') {
          const roll = new game.knight.RollKnight(actor, {
            name:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.CANDLE.SacrificeGainEspoir"),
            dices:`${getCapacite.candle.espoir.dice}D${getCapacite.candle.espoir.face}`,
          }, false);

          const total = await roll.doRoll();
          depenseEnergie = total;
        } else depenseEnergie = getCapacite[split[1]].espoir.base;
        break;

      case 'morph':
        if(split[1] === 'phase' && split[2] !== 'choix') depenseEnergie = getCapacite.phase.energie;
        else if(split[1] === 'phaseN2' && split[2] !== 'choix') depenseEnergie = getCapacite.phase.niveau2.energie;
        else if(split[1]) return true;
        else {
          depenseEnergie = getCapacite.energie;
          depenseEspoir = getCapacite.espoir;
        }
        break;

      case 'rage':
        if(split[1] === 'active') depenseEnergie = getCapacite.espoir;
        else if(split[1] === 'niveau' && split[2] === 'espoir') {
          const roll = new game.knight.RollKnight(actor, {
            name:`${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.Label")} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.UP.Espoir")}`,
            dices:'1D6',
          }, false);

          const total = await roll.doRoll();

          depenseEspoir = total;
        }
        break;

      case 'vision':
        depenseEnergie = actor?.system?.equipements?.armure?.capacites?.vision?.energie ?? 0;
        break;

      case 'warlord':
        if(split[2] === 'porteur') {
          depenseEnergie = getCapacite.impulsions[split[1]].energie[split[2]];
        } else {
          switch(split[1]) {
            case 'energie':
              depenseEnergie = actor?.system?.equipements?.armure?.capacites?.warlord?.energie?.nbre ?? 0;
              break;

            case 'action':
              depenseEnergie = getCapacite.impulsions[split[1]].energie[split[2]];
              break;

            case 'esquive':
            case 'guerre':
            case 'force':
              depenseEnergie = actor?.system?.equipements?.armure?.capacites?.warlord?.[split[1]]?.nbre ?? 0 * getCapacite.impulsions[split[1]].energie[split[2]];
              break;
          }
        }
        break;
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

  async usePEProlongateCapacity(args = {}) {
    // Déstructuration défensive + valeurs par défaut
    const {
      armure = undefined,
      capacite = undefined,
      special = undefined,
      variant = undefined,
      forceEspoir = false,
    } = args;

    // Gardes minimales (évite les plantages)
    if (!capacite) {
      console.warn('_depenseProlongate: capacite manquante');
      return;
    }

    const actor = this.actor;
    const remplaceEnergie = armure.espoirRemplaceEnergie;
    const hasFlux = armure.hasFlux;
    const getType = remplaceEnergie || forceEspoir ? 'espoir' : 'energie';
    const getCapacite = armure.getCapacite(capacite);

    const flux = hasFlux ? actor?.system?.flux?.value ?? 0 : 0;
    const energie = actor?.system?.[getType]?.value ?? 0;
    const espoir = actor?.system?.espoir?.value ?? 0;

    let depenseEnergie = 0;
    let depenseFlux = 0;
    let depenseEspoir = 0;

    let substractEnergie = 0;
    let substractFlux = 0;
    let substractEspoir = 0;

    let tmp = 0;
    let tmp2 = 0;

    switch(capacite) {
      case 'changeling':
        if(getCapacite.active.fauxEtre) {
          tmp = getCapacite?.energie?.fauxEtre?.value ?? 0;
          tmp *= actor?.system?.equipements?.armure?.capacites?.changeling?.fauxetres ?? 0;

          depenseEnergie += tmp;
        }
        if(getCapacite.active.personnel) depenseEnergie += getCapacite.energie.personnel;
        if(getCapacite.active.etendue) depenseEnergie += getCapacite.energie.etendue;
        break;

      case 'companions':
        depenseEnergie += getCapacite.energie.prolonger;
        break;

      case 'discord':
        if(special === 'tour') {
          depenseEnergie += getCapacite.tour.energie;
          depenseFlux += getCapacite.tour.flux;
        } else if(special === 'scene') {
          depenseEnergie += getCapacite.scene.energie;
          depenseFlux += getCapacite.scene.flux;
        }
        break;

      case 'ghost':
        if(special === 'conflit') depenseEnergie += getCapacite.energie.tour;
        else if(special === 'horsconflit') depenseEnergie += getCapacite.energie.minute;
        break;

      case 'illumination':
        if(special === 'beacon') depenseEspoir += getCapacite.beacon.espoir.prolonger;
        else if(special === 'blaze') depenseEspoir += getCapacite.blaze.espoir.prolonger;
        else if(special === 'lantern') depenseEspoir += getCapacite.lantern.espoir.prolonger;
        else if(special === 'lighthouse') depenseEspoir += getCapacite.lighthouse.espoir.prolonger;
        else if(special === 'projector') depenseEspoir += getCapacite.projector.espoir.prolonger;
        else if(special === 'torch') depenseEspoir += getCapacite.torch.espoir.prolonger;
        break;

      case 'warlord':
        if(special === 'force') {
          tmp = getCapacite.active.force.allie ? getCapacite.impulsions.force.energie.prolonger : 0;
          tmp *= getCapacite.active.force.allie ? actor?.system?.equipements?.armure?.capacites?.warlord?.force?.nbre ?? 0 : 0;
          tmp += getCapacite.active.force.porteur ? getCapacite.impulsions.force.energie.porteur : 0;
          depenseEnergie += tmp;
        } else if(special === 'esquive') {
          tmp = getCapacite.active.esquive.allie ? getCapacite.impulsions.esquive.energie.prolonger : 0;
          tmp *= getCapacite.active.esquive.allie ? actor?.system?.equipements?.armure?.capacites?.warlord?.esquive?.nbre ?? 0 : 0;
          tmp += getCapacite.active.esquive.porteur ? getCapacite.impulsions.esquive.energie.porteur : 0;
          depenseEnergie += tmp;
        } else if(special === 'guerre') {
          tmp = getCapacite.active.guerre.allie ? getCapacite.impulsions.guerre.energie.prolonger : 0;
          tmp *= getCapacite.active.guerre.allie ? actor?.system?.equipements?.armure?.capacites?.warlord?.guerre?.nbre ?? 0 : 0;
          tmp += getCapacite.active.guerre.porteur ? getCapacite.impulsions.guerre.energie.porteur : 0;
          depenseEnergie += tmp;
        }
        break;

      case 'totem':
        tmp = getCapacite.energie.prolonger;
        tmp *= actor?.system?.equipements?.armure?.capacites?.totem?.nombre ?? 0;
        depenseEnergie += tmp;

        depenseFlux
        break;

      case 'puppet':
        tmp = getCapacite.energie.prolonger;
        tmp *= actor?.system?.equipements?.armure?.capacites?.puppet?.cible ?? 0;
        depenseEnergie += tmp;

        tmp2 = getCapacite.flux.prolonger;
        tmp2 *= actor?.system?.equipements?.armure?.capacites?.puppet?.cible ?? 0;
        depenseFlux += tmp2;
        break;
    }

    if(!depenseEnergie) depenseEnergie = 0;
    if(!depenseEspoir) depenseEspoir = 0;
    if(!depenseFlux) depenseFlux = 0;

    if(remplaceEnergie) depenseEnergie += depenseEspoir;

    substractEnergie = energie - depenseEnergie;
    substractEspoir = espoir - depenseEspoir;
    substractFlux = flux - depenseFlux;

    let label = game.i18n.localize(CONFIG.KNIGHT.capacites[capacite]);
    label += ` : ${game.i18n.localize("KNIGHT.AUTRE.Prolonger")}`;
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

  async givePE(gain, armure, forceEspoir=false) {
    const data = this.actor;
    const remplaceEnergie = armure.espoirRemplaceEnergie;

    const type = remplaceEnergie === true || forceEspoir ? 'espoir' : 'energie';
    const actuel = remplaceEnergie === true || forceEspoir ? +data.system.espoir.value : +data.system.energie.value;
    const total = remplaceEnergie === true || forceEspoir ? +data.system.espoir.max : +data.system.energie.max;
    let add = actuel+gain;

    if(add > total) {
      add = total;
    }

    let pbE = new PatchBuilder();

    if(type === 'espoir') pbE.sys('espoir.value', add);
    else pbE.sys(`equipements.${data.system.wear}.${type}.value`, add);

    await pbE.applyTo(data);

    return true;
  }

  async rollDegats(label, raw=[], custom=[], dices={dice:0, fixe:0}) {
    const actor = this.actor;
    const listtargets = game.user.targets;
    const allTargets = [];
    let activeTenebricide = true;

    if(listtargets && listtargets.size > 0) {
      for(let t of listtargets) {
        const actor = t.actor;

        allTargets.push({
            id:t.id,
            name:actor.name,
            aspects:actor.system.aspects,
            type:actor.type,
            effets:[],
        });
      }
   }

    const roll = new game.knight.RollKnight(actor, {
      name:`${label} : ${game.i18n.localize("KNIGHT.AUTRE.Degats")}`,
    }, false);
    const weapon = roll.prepareWpnDistance({
      name:`${label}`,
      system:{
        degats:{dice:dices.dice, fixe:dices.fixe},
        violence:{dice:0, fixe:0},
        effets:{raw:raw, custom:custom},
      }
    });

    if(weapon.effets.raw.includes('tenebricide') && !await confirmationDialog("active", "Activation", {effect:game.i18n.localize("KNIGHT.EFFETS.TENEBRICIDE.Label")})) activeTenebricide = false;
    const options = weapon.options;

    for(let o of options) {

      if(o.value === 'tenebricide') o.active = activeTenebricide;
      else o.active = true;
    }

    const flags = roll.getRollData(weapon, {targets:allTargets});
    roll.setWeapon(weapon);
    await roll.doRollDamage(flags);
  }

  async rollViolence(label, raw=[], custom=[], dices={dice:0, fixe:0}) {
    const actor = this.actor;
    const listtargets = game.user.targets;
    const allTargets = [];
    let activeTenebricide = true;

    if(listtargets && listtargets.size > 0) {
      for(let t of listtargets) {
        const actor = t.actor;

        allTargets.push({
            id:t.id,
            name:actor.name,
            aspects:actor.system.aspects,
            type:actor.type,
            effets:[],
        });
      }
   }

    const roll = new game.knight.RollKnight(actor, {
      name:`${label} : ${game.i18n.localize("KNIGHT.AUTRE.Violence")}`,
    }, false);
    const weapon = roll.prepareWpnDistance({
      name:`${label}`,
      system:{
        degats:{dice:0, fixe:0},
        violence:dices,
        effets:{raw:raw, custom:custom},
      }
    });

    if(weapon.effets.raw.includes('tenebricide') && !await confirmationDialog("active", "Activation", {effect:game.i18n.localize("KNIGHT.EFFETS.TENEBRICIDE.Label")})) activeTenebricide = false;
    const options = weapon.options;

    for(let o of options) {

      if(o.value === 'tenebricide') o.active = activeTenebricide;
      else o.active = true;
    }

    const flags = roll.getRollData(weapon, {targets:allTargets});
    roll.setWeapon(weapon);
    await roll.doRollViolence(flags);
  }
}