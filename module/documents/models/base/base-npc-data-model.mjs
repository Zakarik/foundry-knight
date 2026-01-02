
import { BaseActorDataModel } from "./base-actor-data-model.mjs";
import { AspectsNPCDataModel } from '../parts/aspects-npc-data-model.mjs';
import { DefensesDataModel } from '../parts/defenses-data-model.mjs';
import { InitiativeDataModel } from '../parts/initiative-data-model.mjs';
import { Phase2DataModel } from '../parts/phase2-data-model.mjs';

export class BaseNPCDataModel extends BaseActorDataModel {
    static defineSchema() {
		const {SchemaField, StringField, EmbeddedDataField, NumberField, BooleanField, HTMLField} = foundry.data.fields;

        const base = super.defineSchema();
        const specific = {
            type:new StringField({initial:''}),
            histoire:new HTMLField({initial:""}),
            tactique:new HTMLField({initial:""}),
            pointsFaibles:new HTMLField({initial:""}),
            aspects:new EmbeddedDataField(AspectsNPCDataModel),
            limited:new SchemaField({
                showPointsFaibles:new BooleanField({initial:false}),
            }),
            combat:new SchemaField({
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
            defense:new EmbeddedDataField(DefensesDataModel),
            reaction:new EmbeddedDataField(DefensesDataModel),
            phase2:new EmbeddedDataField(Phase2DataModel),
            phase2Activate:new BooleanField({initial:false}),
            initiative:new EmbeddedDataField(InitiativeDataModel),
            options:new SchemaField({
                bouclier:new BooleanField({initial:true, nullable:false}),
                phase2:new BooleanField({initial:false, nullable:false}),
            }),
        };

        return foundry.utils.mergeObject(base, specific);
    }

    get actor() {
        return this.parent;
    }

    get actorId() {
      return this.actor?.token ? this.actor.token.id : this.actor.id;
    }

    get items() {
        return this.parent.items;
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

    togglePhase2() {
        const aspects = this.aspects;
        const phase2 = this.phase2;

        let update = {};

        if(this.phase2Activate) {
            update['system.phase2Activate'] = false;

            for(let a in phase2.aspects) {
              update[`system.aspects.${a}.value`] = aspects[a].value - phase2.aspects[a].value;
              update[`system.aspects.${a}.ae.mineur.value`] = aspects[a].ae.mineur.value - phase2.aspects[a].ae.mineur;
              update[`system.aspects.${a}.ae.majeur.value`] = aspects[a].ae.majeur.value - phase2.aspects[a].ae.majeur;
            }
        } else {
            update['system.phase2Activate'] = true;

            for(let a in phase2.aspects) {
              update[`system.aspects.${a}.value`] = aspects[a].value + phase2.aspects[a].value;
              update[`system.aspects.${a}.ae.mineur.value`] = aspects[a].ae.mineur.value + phase2.aspects[a].ae.mineur;
              update[`system.aspects.${a}.ae.majeur.value`] = aspects[a].ae.majeur.value + phase2.aspects[a].ae.majeur;
            }
        }

        this.actor.update(update);
    }

    async doCapacityDgt(id, args={}) {
      const {
        obliteration = false,
        tenebricide = false,
      } = args;
      const actor = this.actor;
      const capacite = actor.items.get(id);
      const label = capacite?.name ?? "";
      const listtargets = game.user.targets;
      const allTargets = [];
      const roll = new game.knight.RollKnight(actor, {
        name:`${label} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}`,
      }, false);
      const weapon = roll.prepareWpnContact({
        name:capacite.name,
        system:{
          degats:{dice:capacite.system.degats.system.dice, fixe:capacite.system.degats.system.fixe},
          effets:capacite.system.degats.system.effets,
        }
      });
      const options = weapon.options;

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

      for(let o of options) {
        if(obliteration && o.classes.includes('obliteration')) o.active = true;
        if(tenebricide && o.classes.includes('tenebricide')) o.active = true;
      }

      roll.setWeapon(weapon);
      let flags = roll.getRollData(weapon, {targets:allTargets});
      flags.notDebordement = true;

      await roll.doRollDamage(flags);
    }
}