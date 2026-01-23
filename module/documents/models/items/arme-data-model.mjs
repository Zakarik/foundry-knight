import {
  convertJsonEffects
} from "../../../helpers/common.mjs";

import PatchBuilder from "../../../utils/patchBuilder.mjs";

export class ArmeDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const {HTMLField, SchemaField, StringField, NumberField, BooleanField, ArrayField, ObjectField} = foundry.data.fields;

    return {
      whoActivate: new StringField({}),
      chassis:new StringField({}),
      equipped:new BooleanField({initial:false}),
      rack:new BooleanField({initial:false}),
      description: new HTMLField({initial: ''}),
      rarete: new StringField({initial: 'standard'}),
      type: new StringField({initial: 'contact'}),
      portee: new StringField({initial: 'contact'}),
      prix: new NumberField({initial: 0}),
      energie: new NumberField({initial: 0}),
      listes: new SchemaField({}),
      gratuit: new BooleanField({initial:false}),
      options2mains: new SchemaField({
        has: new BooleanField({initial: false}),
        actuel: new StringField({initial: '1main'}),
        '1main': new SchemaField({
          degats: new SchemaField({
            dice: new NumberField({initial: 0}),
            fixe: new NumberField({initial: 0})
          }),
          violence: new SchemaField({
            dice: new NumberField({initial: 0}),
            fixe: new NumberField({initial: 0})
          })
        }),
        '2main': new SchemaField({
          degats: new SchemaField({
            dice: new NumberField({initial: 0}),
            fixe: new NumberField({initial: 0})
          }),
          violence: new SchemaField({
            dice: new NumberField({initial: 0}),
            fixe: new NumberField({initial: 0})
          })
        })
      }),
      optionsmunitions: new SchemaField({
        has: new BooleanField({initial: false}),
        actuel: new StringField({initial: '0'}),
        value: new NumberField({initial: 1}),
        liste: new ObjectField({})
      }),
      tourelle: new SchemaField({
        has: new BooleanField({initial: false}),
        attaque: new SchemaField({
          dice: new NumberField({initial: 0}),
          fixe: new NumberField({initial: 0})
        })
      }),
      degats: new SchemaField({
        addchair: new BooleanField({initial: true}),
        dice: new NumberField({initial: 0}),
        fixe: new NumberField({initial: 0}),
        variable: new SchemaField({
          has: new BooleanField({initial: false}),
          min: new SchemaField({
            dice: new NumberField({initial: 0}),
            fixe: new NumberField({initial: 0})
          }),
          max: new SchemaField({
            dice: new NumberField({initial: 0}),
            fixe: new NumberField({initial: 0})
          }),
          cout: new NumberField({initial: 0})
        })
      }),
      violence: new SchemaField({
        dice: new NumberField({initial: 0}),
        fixe: new NumberField({initial: 0}),
        variable: new SchemaField({
          has: new BooleanField({initial: false}),
          min: new SchemaField({
            dice: new NumberField({initial: 0}),
            fixe: new NumberField({initial: 0})
          }),
          max: new SchemaField({
            dice: new NumberField({initial: 0}),
            fixe: new NumberField({initial: 0})
          }),
          cout: new NumberField({initial: 0})
        })
      }),
      effets: new SchemaField({
        liste: new ArrayField(new StringField()),
        raw: new ArrayField(new StringField()),
        custom: new ArrayField(new ObjectField()),
        chargeur: new NumberField({initial: null})
      }),
      effets2mains: new SchemaField({
        liste: new ArrayField(new StringField()),
        raw: new ArrayField(new StringField()),
        custom: new ArrayField(new ObjectField()),
        chargeur: new NumberField({initial: null})
      }),
      distance: new SchemaField({
        liste: new ArrayField(new StringField()),
        raw: new ArrayField(new StringField()),
        custom: new ArrayField(new ObjectField())
      }),
      ornementales: new SchemaField({
        liste: new ArrayField(new StringField()),
        raw: new ArrayField(new StringField()),
        custom: new ArrayField(new ObjectField())
      }),
      structurelles: new SchemaField({
        liste: new ArrayField(new StringField()),
        raw: new ArrayField(new StringField()),
        custom: new ArrayField(new ObjectField())
      })
    }
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

  get qtyMunition() {
    const type = this.type;
    let result = 0;

    if(type === 'contact') {
      if(this.options2mains.has) {
        const actuel = this.options2mains?.actuel ?? '1main';
        const effets = actuel === '1main' ? this.effets : this.effets2mains;
        const findChargeur = effets.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeur) return;

        const chargeurMax = parseInt(findChargeur.split(' ')[1]);

        let chargeur = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        result = chargeur;

      } else {
        const effets = this.effets;
        const findChargeur = effets.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeur) return;

        const chargeurMax = parseInt(findChargeur.split(' ')[1]);

        let chargeur = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        result = chargeur;
      }
    }
    else if(type === 'distance') {
      const effets = this.effets;
      const findChargeurBase = effets.raw.find(itm => itm.includes('chargeur'));

      if(findChargeurBase) {
        const chargeurMax = parseInt(findChargeurBase.split(' ')[1]);
        const chargeurActuel = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        result = chargeurActuel;
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

            result = chargeurMunition;
          }
        }
      }
    }

    return result;
  }

  get allEffects() {
    const type = this.type;
    const options2mains = this.options2mains;
    const optionsmunitions = this.optionsmunitions;
    const effects = [];

    if(options2mains.has && options2mains.actuel === '2main') {
      effects.push(...this.effets2mains.raw);
    }

    if((options2mains.has && options2mains.actuel === '1main') || !options2mains.has) effects.push(...this.effets.raw);

    if(type === 'distance') {
      effects.push(...this.distance.raw);

      if(optionsmunitions.has) effects.push(...optionsmunitions.liste[optionsmunitions.actuel].raw)
    } else if(type === 'contact') effects.push(...this.ornementales.raw, ...this.structurelles.raw);

    return effects;
  }

  addMunition(index, type) {
    let data = undefined;
    let chargeur = undefined;
    let actuel = undefined;
    let path = '';
    let update = {};

    switch(type) {
      case 'base':
        data = this.effets;
        path = 'system.effets.chargeur';
        break;

      case '2mains':
        data = this.effets2mains;
        path = 'system.effets2mains.chargeur';
        break;

      case 'munition':
        data = this.optionsmunitions?.liste?.[munition] ?? undefined;
        path = `system.optionsmunitions.liste.${munition}.chargeur`;
        break;
    }

    chargeur = data?.raw?.[index] ?? undefined;
    actuel = data?.chargeur === null || data?.chargeur === undefined ? parseInt(chargeur.split(' ')[1]) : data.chargeur;

    if(!data || !chargeur) return;
    if(!chargeur.includes('chargeur')) return;

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

  removeMunition(index, type, munition) {
    let data = undefined;
    let chargeur = undefined;
    let actuel = undefined;
    let path = '';
    let update = {};

    switch(type) {
      case 'base':
        data = this.effets;
        path = 'system.effets.chargeur';
        break;

      case '2mains':
        data = this.effets2mains;
        path = 'system.effets2mains.chargeur';
        break;

      case 'munition':
        data = this.optionsmunitions?.liste?.[munition] ?? undefined;
        path = `system.optionsmunitions.liste.${munition}.chargeur`;
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

  useMunition(updates={}) {
    const type = this.type;

    if(type === 'contact') {
      if(this.options2mains.has) {
        const actuel = this.options2mains?.actuel ?? '1main';
        const effets = actuel === '1main' ? this.effets : this.effets2mains;
        const findChargeur = effets.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeur) return;

        const chargeurMax = parseInt(findChargeur.split(' ')[1]);

        let chargeur = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        if(actuel === '1main') {
          updates[`item.${this.item._id}.system.effets.chargeur`] = Math.max(chargeur-1, 0);
        } else {
          updates[`item.${this.item._id}.system.effets2mains.chargeur`] = Math.max(chargeur-1, 0);
        }
      } else {
        const effets = this.effets;
        const findChargeur = effets.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeur) return;

        const chargeurMax = parseInt(findChargeur.split(' ')[1]);

        let chargeur = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        updates[`item.${this.item._id}.system.effets.chargeur`] = Math.max(chargeur-1, 0);
      }
    }
    else if(type === 'distance') {
      const effets = this.effets;
      const findChargeurBase = effets.raw.find(itm => itm.includes('chargeur'));

      if(findChargeurBase) {
        const chargeurMax = parseInt(findChargeurBase.split(' ')[1]);
        const chargeurActuel = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        updates[`item.${this.item._id}.system.effets.chargeur`] = Math.max(chargeurActuel-1, 0);
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

            updates[`item.${this.item._id}.system.optionsmunitions.liste.${actuel}.chargeur`] = Math.max(chargeurMunition-1, 0);
          }
        }
      }
    }

    if(!this.actor) return;

    this.actor.render();
  }

  resetMunition() {
    let update = {};

    const findChargeurBase = this.effets.raw.find(itm => itm.includes('chargeur'));
    const findChargeur2Mains = this.effets2mains.raw.find(itm => itm.includes('chargeur'));

    if(findChargeurBase) {
      const chargeurMaxBase = parseInt(findChargeurBase.split(' ')[1]);

      update[`system.effets.chargeur`] = chargeurMaxBase;
    }

    if(findChargeur2Mains) {
      const chargeurMax2Mains = parseInt(findChargeur2Mains.split(' ')[1]);

      update[`system.effets2mains.chargeur`] = chargeurMax2Mains;
    }

    const munition = this.optionsmunitions?.liste ?? {};

    for (const effet in munition) {
      const findChargeurMunition = munition[effet].raw.find(itm => itm.includes('chargeur'));

      if(!findChargeurMunition) continue;

      const chargeurMunitionMax = parseInt(findChargeurMunition.split(' ')[1]);

      update[`system.optionsmunitions.liste.${effet}.chargeur`] = chargeurMunitionMax;
    }

    this.item.update(update);
  }

  prepareBaseData() {

  }

  prepareDerivedData() {

  }

  async importWpn(json, remplace=true) {
    const pb = await PatchBuilder.for(this.item)

    if(remplace) {
      pb.sys('options2mains.has', false);
      pb.sys('optionsmunitions.has', false);
      pb.sys('degats.variable.has', false);
      pb.sys('violence.variable.has', false);

      pb.sys('effets.raw', []);
      pb.sys('effets.custom', []);
      pb.sys('effets2mains.raw', []);
      pb.sys('effets2mains.custom', []);
      pb.sys('distance.raw', []);
      pb.sys('distance.custom', []);
      pb.sys('ornementales.raw', []);
      pb.sys('ornementales.custom', []);
      pb.sys('structurelles.raw', []);
      pb.sys('structurelles.custom', []);
    }

    pb.set('name',  json?.weapon_name ?? this.item.name);

    pb.sys('description', json?.weapon_description ?? this.description);

    pb.sys('chassis', json?.chassis ?? this.chassis);

    pb.sys('degats.dice', json?.damage_dice ?? 0);
    pb.sys('degats.fixe', json?.damage_flat ?? 0);

    pb.sys('violence.dice', json?.violence_dice ?? 0);
    pb.sys('violence.fixe', json?.violence_flat ?? 0);

    pb.sys('portee', json?.reach?.toLowerCase() ?? 'contact');

    pb.sys('prix', json?.gp ?? 0);

    const effects = [];

    for(let e of json?.effects ?? []) {
      const convert = convertJsonEffects(e);
      if(convert) effects.push(convert);
    }

    pb.sys('effets.raw', effects);

    pb.apply();
  }
}