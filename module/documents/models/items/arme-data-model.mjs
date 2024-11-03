export class ArmeDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const {HTMLField, SchemaField, StringField, NumberField, BooleanField, ArrayField, ObjectField} = foundry.data.fields;

    return {
      whoActivate: new StringField({}),
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

  useMunition() {
    const type = this.type;

    if(type === 'contact') {
      if(this.options2mains.has) {
        const actuel = this.options2mains?.actuel ?? '1main';
        const effets = actuel === '1main' ? this.effets : this.effets2mains;
        const findChargeur = effets.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeur) return;

        const chargeurMax = parseInt(findChargeur.split(' ')[1]);

        let chargeur = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        if(chargeur === 0) return;

        if(actuel === '1main') this.item.update({['system.effets.chargeur']:chargeur-1})
        else this.item.update({['system.effets2mains.chargeur']:chargeur-1})

      } else {
        const effets = this.effets;
        const findChargeur = effets.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeur) return;

        const chargeurMax = parseInt(findChargeur.split(' ')[1]);

        let chargeur = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        if(chargeur === 0) return;

        this.item.update({['system.effets.chargeur']:chargeur-1})
      }
    }
    else if(type === 'distance') {
      const effets = this.effets;
      const findChargeurBase = effets.raw.find(itm => itm.includes('chargeur'));

      if(findChargeurBase) {
        const chargeurMax = parseInt(findChargeurBase.split(' ')[1]);
        const chargeurActuel = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        if(chargeurActuel !== 0) this.item.update({['system.effets.chargeur']:chargeurActuel-1});
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

            if(chargeurMunition !== 0) this.item.update({[`system.optionsmunitions.liste.${actuel}.chargeur`]:chargeurMunition-1});
          }
        }
      }
    }
  }

  resetMunition() {
    const type = this.type;
    let update = {};

    if(type === 'contact') {
      if(this.options2mains.has) {
        const findChargeurBase = this.effets.raw.find(itm => itm.includes('chargeur'));
        const findChargeur2Mains = this.effets2mains.raw.find(itm => itm.includes('chargeur'));

        if(findChargeurBase) {
          const chargeurMaxBase = parseInt(findChargeurBase.split(' ')[1]);
          update['system.effets.chargeur'] = chargeurMaxBase;
        }

        if(!findChargeur2Mains) {
          const chargeurMax2Mains = parseInt(findChargeur2Mains.split(' ')[1]);
          update['system.effets2mains.chargeur'] = chargeurMax2Mains;
        }
      } else {
        const effets = this.effets;
        const findChargeur = effets.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeur) return;

        const chargeurMax = parseInt(findChargeur.split(' ')[1]);

        update['system.effets.chargeur'] = chargeurMax;
      }
    }
    else if(type === 'distance') {
      const effets = this.effets;
      const findChargeurBase = effets.raw.find(itm => itm.includes('chargeur'));

      if(findChargeurBase) {
        const chargeurMax = parseInt(findChargeurBase.split(' ')[1]);

        update['system.effets.chargeur'] = chargeurMax;
      };

      if(this.optionsmunitions.has) {
        const munition = this.optionsmunitions?.liste ?? {};

        for (const effet in munition) {
          const findChargeurMunition = munition[effet].raw.find(itm => itm.includes('chargeur'));

          if(!findChargeurMunition) continue;

          const chargeurMunitionMax = parseInt(findChargeurMunition.split(' ')[1]);

          update[`system.optionsmunitions.liste.${effet}.chargeur`] = chargeurMunitionMax;
        }
      }
    }

    this.item.update(update);


    if(!this.actor) return;

    const exec = new game.knight.RollKnight(this.actor,
    {
    name:this.item.name,
    }).sendMessage({
        text:game.i18n.localize('KNIGHT.JETS.RemplirChargeur'),
        classes:'important',
    });
  }

  prepareBaseData() {

  }

  prepareDerivedData() {

  }
}