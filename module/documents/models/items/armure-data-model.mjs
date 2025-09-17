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


}