import { AspectsNPCDataModel } from '../parts/aspects-npc-data-model.mjs';
import { ArmesImproviseesDataModel } from '../parts/armesimprovisees-data-model.mjs';
import { GrenadesDataModel } from '../parts/grenades-data-model.mjs';
import { NodsDataModel } from '../parts/nods-data-model.mjs';
import { DefensesDataModel } from '../parts/defenses-data-model.mjs';
import { InitiativeDataModel } from '../parts/initiative-data-model.mjs';
import { Phase2DataModel } from '../parts/phase2-data-model.mjs';

export class PNJDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
  const {SchemaField, EmbeddedDataField, StringField, NumberField, BooleanField, ObjectField, ArrayField, HTMLField} = foundry.data.fields;

      return {
        age:new StringField({ initial: ""}),
        archetype:new StringField({ initial: ""}),
        metaarmure:new StringField({ initial: ""}),
        blason:new StringField({ initial: ""}),
        surnom:new StringField({initial:""}),
        section:new StringField({initial:""}),
        hautfait:new StringField({initial:""}),
        type:new StringField({initial:""}),
        histoire:new HTMLField({initial:""}),
        description:new HTMLField({initial:""}),
        descriptionLimitee:new HTMLField({initial:""}),
        tactique:new HTMLField({initial:""}),
        pointsFaibles:new HTMLField({initial:""}),
        armure: new SchemaField({
            base:new NumberField({initial:0, min:0, nullable:false, integer:true}),
            bonusValue:new NumberField({initial:0, nullable:false, integer:true}),
            malusValue:new NumberField({initial:0, nullable:false, integer:true}),
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
        art: new SchemaField({
            oeuvres:new ObjectField(),
        }),
        aspects:new EmbeddedDataField(AspectsNPCDataModel),
        combat:new SchemaField({
            armesimprovisees:new EmbeddedDataField(ArmesImproviseesDataModel),
            grenades:new EmbeddedDataField(GrenadesDataModel),
            nods:new EmbeddedDataField(NodsDataModel),
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
        }),
        bouclier:new EmbeddedDataField(DefensesDataModel),
        champDeForce:new EmbeddedDataField(DefensesDataModel),
        defense:new EmbeddedDataField(DefensesDataModel),
        reaction:new EmbeddedDataField(DefensesDataModel),
        egide:new EmbeddedDataField(DefensesDataModel),
        phase2:new EmbeddedDataField(Phase2DataModel),
        sante:new SchemaField({
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
        espoir:new SchemaField({
            value:new NumberField({initial:0, nullable:false, integer:true}),
            max:new NumberField({initial:50, nullable:false, integer:true}),
        }),
        resilience:new SchemaField({
            value:new NumberField({initial:0, nullable:false, integer:true}),
            max:new NumberField({initial:50, nullable:false, integer:true}),
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
        initiative:new EmbeddedDataField(InitiativeDataModel),
        bonusSiEmbuscade:new SchemaField({
          bonusInitiative:new SchemaField({
            dice:new NumberField({ initial: 0, integer: true, nullable: false }),
            fixe:new NumberField({ initial: 0, integer: true, nullable: false }),
          }),
        }),
        options:new SchemaField({
            armure:new BooleanField({initial:true, nullable:false}),
            bouclier:new BooleanField({initial:true, nullable:false}),
            champDeForce:new BooleanField({initial:true, nullable:false}),
            energie:new BooleanField({initial:true, nullable:false}),
            espoir:new BooleanField({initial:true, nullable:false}),
            modules:new BooleanField({initial:false, nullable:false}),
            notFirstMenu:new BooleanField({initial:false, nullable:false}),
            noSecondMenu:new BooleanField({initial:false, nullable:false}),
            phase2:new BooleanField({initial:true, nullable:false}),
            resilience:new BooleanField({initial:true, nullable:false}),
            sante:new BooleanField({initial:true, nullable:false}),
            embuscadeSubis:new BooleanField({initial:false, nullable:false}),
            embuscadePris:new BooleanField({initial:false, nullable:false}),
        }),
      }
  }

  get aspect() {
    let data = {}

    for(let a of CONFIG.KNIGHT.LIST.aspects) {
        data[a] = {
            value:this.aspects[a].value,
            mineur:this.aspects[a].ae.mineur.value,
            majeur:this.aspects[a].ae.majeur.value,
        }
    }

    return data;
  }

  prepareBaseData() {

	}

	prepareDerivedData() {
    this.#derived();
    this.#defenses();
  }

  #derived() {
    const list = CONFIG.KNIGHT.LIST.pnj;

    for(let d of list) {
      const system = this[d];
      const base = system.base;
      const bonus = system?.bonus?.user ?? 0;
      const malus = system?.malus?.user ?? 0;
      const update = CONFIG.KNIGHT.LIST.hasMax[d] ? 'max' : 'value';

      Object.defineProperty(system, 'mod', {
        value: bonus-malus,
      });

      Object.defineProperty(system, update, {
        value: Math.max(base+bonus-malus, 0),
      });
    }

    console.warn(this.aspect.masque.majeur)

    // INITIATIVE
    if(this.aspect.masque.majeur > 0) {
      Object.defineProperty(this.initiative, 'base', {
          value: 0,
      });

      Object.defineProperty(this.initiative, 'dice', {
          value: 0,
      });

      Object.defineProperty(this.initiative, 'value', {
          value: 30,
      });
    } else {
      let initiativeDice = this.initiative.diceBase;
      let initiativeBonus = this?.initiative?.bonus?.user ?? 0;
      let initiativeMalus = this?.initiative?.malus?.user ?? 0;

      const hasEmbuscadeSubis = this.options.embuscadeSubis;
      const hasEmbuscadePris = this.options.embuscadePris;

      if(hasEmbuscadeSubis) {
        const bonusDice = this.bonusSiEmbuscade.bonusInitiative.dice;
        const bonusFixe = this.bonusSiEmbuscade.bonusInitiative.fixe;

        initiativeDice += bonusDice;
        initiativeBonus += bonusFixe;
      }

      if(hasEmbuscadePris) {
        initiativeBonus += 10;
      }

      Object.defineProperty(this.initiative, 'base', {
          value: 0,
      });

      Object.defineProperty(this.initiative, 'diceMod', {
          value: 0,
      });

      Object.defineProperty(this.initiative, 'mod', {
          value: initiativeBonus-initiativeMalus,
      });

      this.initiative.prepareData();
    }
  }

  #defenses() {
      const defenses = ['defense', 'reaction'];

      for(let d of defenses) {
          const aspect = this.aspect[CONFIG.KNIGHT.LIST.derived[d]];

          const base = this[d].base;
          const bonus = this[d]?.bonus?.user ?? 0;
          const malus = this[d]?.malus?.user ?? 0;

          Object.defineProperty(this[d], 'mod', {
              value: bonus-malus+aspect.value+aspect.mineur+aspect.majeur,
          });

          Object.defineProperty(this[d], 'value', {
              value: Math.max(base+this[d].mod, 0),
          });
      }
  }
}