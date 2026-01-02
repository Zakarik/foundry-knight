
import { BaseActorDataModel } from "../base/base-actor-data-model.mjs";
import { AspectsPCDataModel } from '../parts/aspects-pc-data-model.mjs';
import { DefensesDataModel } from '../parts/defenses-data-model.mjs';
import { ArmesImproviseesDataModel } from '../parts/armesimprovisees-data-model.mjs';
import { InitiativeDataModel } from '../parts/initiative-data-model.mjs';
import { SOCKET } from '../../../utils/socketHandler.mjs';
import {
  spawnTokenRightOfActor,
} from "../../../helpers/common.mjs";

export class MechaArmureDataModel extends BaseActorDataModel {
	static defineSchema() {
		const {SchemaField, EmbeddedDataField, StringField, NumberField, BooleanField, ObjectField, ArrayField, HTMLField} = foundry.data.fields;

    const base = super.defineSchema();
    const specific = {
      pilote:new StringField({initial:''}),
      vitesse:new EmbeddedDataField(DefensesDataModel),
      manoeuvrabilite:new EmbeddedDataField(DefensesDataModel),
      puissance:new EmbeddedDataField(DefensesDataModel),
      senseurs:new EmbeddedDataField(DefensesDataModel),
      systemes:new EmbeddedDataField(DefensesDataModel),
      aspects:new EmbeddedDataField(AspectsPCDataModel),
      defense:new EmbeddedDataField(DefensesDataModel),
      reaction:new EmbeddedDataField(DefensesDataModel),
      champDeForce:new SchemaField({
        base:new NumberField({ initial: 0, integer: true, nullable: false }),
        value:new NumberField({ initial: 0, integer: true, nullable: false }),
        mod:new NumberField({ initial: 0, integer: true, nullable: false }),
        bonus:new ObjectField({initial:{
          user:0,
        }}),
        malus:new ObjectField({initial:{
          user:0,
        }}),
      }),
      initiative:new EmbeddedDataField(InitiativeDataModel),
      resilience:new SchemaField({
        value:new NumberField({ initial: 0, integer: true, nullable: false }),
        max:new NumberField({ initial: 0, integer: true, nullable: false }),
        base:new NumberField({ initial: 0, integer: true, nullable: false }),
        mod:new NumberField({ initial: 0, integer: true, nullable: false }),
        bonus:new ObjectField({initial:{
          user:0,
        }}),
        malus:new ObjectField({initial:{
          user:0,
        }}),
      }),
      blindage:new SchemaField({
        value:new NumberField({ initial: 0, integer: true, nullable: false }),
        max:new NumberField({ initial: 0, integer: true, nullable: false }),
      }),
      energie:new SchemaField({
        value:new NumberField({ initial: 100, integer: true, nullable: false }),
        max:new NumberField({ initial: 100, integer: true, nullable: false }),
      }),
      configurations:new SchemaField({
        actuel:new StringField({initial:'c1'}),
        invocations:new ObjectField({}),
        save:new SchemaField({
          resilience:new NumberField({ initial: 0, integer: true, nullable: false }),
        }),
        liste:new SchemaField({
          base:new SchemaField({
            modules:new ObjectField(),
          }),
          c1:new SchemaField({
            name:new StringField({initial:''}),
            modules:new ObjectField(),
          }),
          c2:new SchemaField({
            name:new StringField({initial:''}),
            modules:new ObjectField(),
          }),
        }),
      }),
      modules:new SchemaField({
        actuel:new SchemaField({
          base:new StringField(),
          c1:new StringField(),
          c2:new StringField(),
        }),
        liste:new SchemaField({
          volMarkIV:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new NumberField({ initial: 0, integer: true, nullable: false }),
            activation:new StringField({initial:'Instantanee'}),
            duree:new StringField({initial:'Desactivation'}),
            bonus:new SchemaField({
              manoeuvrabilite:new NumberField({ initial: 3, integer: true, nullable: false }),
            }),
          }),
          sautMarkIV:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new NumberField({ initial: 0, integer: true, nullable: false }),
            activation:new StringField({initial:'Instantanee'}),
            duree:new StringField({initial:'Tour'}),
            resilience:new NumberField({ initial: 1, integer: true, nullable: false }),
          }),
          vagueSoin:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new NumberField({ initial: 1, integer: true, nullable: false }),
            activation:new StringField({initial:'Combat'}),
            duree:new StringField({initial:'Instantanee'}),
            portee:new StringField({initial:'Moyenne'}),
            soins:new SchemaField({
              sante:new NumberField({ initial: 40, integer: true, nullable: false }),
              cohesion:new NumberField({ initial: 150, integer: true, nullable: false }),
            }),
          }),
          canonMetatron:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new NumberField({ initial: 1, integer: true, nullable: false }),
            activation:new StringField({initial:'Combat'}),
            degats:new SchemaField({
              dice:new NumberField({ initial: 6, integer: true, nullable: false }),
              fixe:new NumberField({ initial: 12, integer: true, nullable: false }),
            }),
            violence:new SchemaField({
              dice:new NumberField({ initial: 6, integer: true, nullable: false }),
              fixe:new NumberField({ initial: 0, integer: true, nullable: false }),
            }),
            portee:new StringField({initial:'Moyenne'}),
            effets:new SchemaField({
              raw:new ArrayField(new StringField(), {
                initial:["parasitage 2", "degatscontinus 10", "briserlaresilience"]
              }),
              custom:new ArrayField(new ObjectField())
            }),
          }),
          canonNoe:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new NumberField({ initial: 3, integer: true, nullable: false }),
            activation:new StringField({initial:'Combat'}),
            duree:new StringField({initial:'Instantanee'}),
            portee:new StringField({initial:'Longue'}),
            reparations:new SchemaField({
              armure:new NumberField({ initial: 30, integer: true, nullable: false }),
              mechaarmure:new SchemaField({
                blindage:new NumberField({ initial: 20, integer: true, nullable: false }),
                resilience:new NumberField({ initial: 1, integer: true, nullable: false }),
              }),
            }),
          }),
          canonMagma:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new SchemaField({
              simple:new NumberField({ initial: 1, integer: true, nullable: false }),
              bande:new NumberField({ initial: 4, integer: true, nullable: false }),
            }),
            activation:new StringField({initial:'Combat'}),
            degats:new SchemaField({
              dice:new NumberField({ initial: 8, integer: true, nullable: false }),
              fixe:new NumberField({ initial: 12, integer: true, nullable: false }),
            }),
            violence:new SchemaField({
              dice:new NumberField({ initial: 12, integer: true, nullable: false }),
              fixe:new NumberField({ initial: 20, integer: true, nullable: false }),
            }),
            portee:new StringField({initial:'Longue'}),
            effets:new SchemaField({
              raw:new ArrayField(new StringField(), {
                initial:["dispersion 12", "fureur", "antianatheme", "briserlaresilience"]
              }),
              custom:new ArrayField(new ObjectField())
            }),
          }),
          lamesCinetiquesGeantes:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new NumberField({ initial: 1, integer: true, nullable: false }),
            activation:new StringField({initial:'Combat'}),
            degats:new SchemaField({
              dice:new NumberField({ initial: 10, integer: true, nullable: false }),
              fixe:new NumberField({ initial: 30, integer: true, nullable: false }),
            }),
            violence:new SchemaField({
              dice:new NumberField({ initial: 4, integer: true, nullable: false }),
              fixe:new NumberField({ initial: 6, integer: true, nullable: false }),
            }),
            portee:new StringField({initial:'Contact'}),
            effets:new SchemaField({
              raw:new ArrayField(new StringField()),
              custom:new ArrayField(new ObjectField())
            }),
            eff1:new SchemaField({
              value:new NumberField({ initial: 1, integer: true, nullable: false }),
              effets:new SchemaField({
                raw:new ArrayField(new StringField(), {
                  initial:["penetrant 10"]
                }),
                custom:new ArrayField(new ObjectField())
              }),
            }),
            eff2:new SchemaField({
              value:new NumberField({ initial: 2, integer: true, nullable: false }),
              effets:new SchemaField({
                raw:new ArrayField(new StringField(), {
                  initial:["ignorechampdeforce"]
                }),
                custom:new ArrayField(new ObjectField())
              }),
            })
          }),
          mitrailleusesSurtur:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new NumberField({ initial: 1, integer: true, nullable: false }),
            activation:new StringField({initial:'Combat'}),
            degats:new SchemaField({
              dice:new NumberField({ initial: 2, integer: true, nullable: false }),
              fixe:new NumberField({ initial: 6, integer: true, nullable: false }),
            }),
            violence:new SchemaField({
              dice:new NumberField({ initial: 6, integer: true, nullable: false }),
              fixe:new NumberField({ initial: 20, integer: true, nullable: false }),
            }),
            portee:new StringField({initial:'Moyenne'}),
            effets:new SchemaField({
              raw:new ArrayField(new StringField(), {
                initial:["ultraviolence", 'demoralisant']
              }),
              custom:new ArrayField(new ObjectField())
            }),
          }),
          tourellesLasersAutomatisees:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new NumberField({ initial: 2, integer: true, nullable: false }),
            activation:new StringField({initial:'Deplacement'}),
            degats:new SchemaField({
              dice:new NumberField({ initial: 6, integer: true, nullable: false }),
              fixe:new NumberField({ initial: 0, integer: true, nullable: false }),
            }),
            violence:new SchemaField({
              dice:new NumberField({ initial: 10, integer: true, nullable: false }),
              fixe:new NumberField({ initial: 0, integer: true, nullable: false }),
            }),
            portee:new StringField({initial:'Courte'}),
            effets:new SchemaField({
              raw:new ArrayField(new StringField(), {
                initial:["antianatheme"]
              }),
              custom:new ArrayField(new ObjectField())
            }),
          }),
          missilesJericho:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new NumberField({ initial: 6, integer: true, nullable: false }),
            activation:new StringField({initial:'Combat'}),
            degats:new SchemaField({
              dice:new NumberField({ initial: 12, integer: true, nullable: false }),
              fixe:new NumberField({ initial: 20, integer: true, nullable: false }),
            }),
            violence:new SchemaField({
              dice:new NumberField({ initial: 12, integer: true, nullable: false }),
              fixe:new NumberField({ initial: 40, integer: true, nullable: false }),
            }),
            portee:new StringField({initial:'Lointaine'}),
            effets:new SchemaField({
              raw:new ArrayField(new StringField(), {
                initial:["antianatheme", "fureur", "meurtrier", "demoralisant", "briserlaresilience"]
              }),
              custom:new ArrayField(new ObjectField())
            }),
          }),
          souffleDemoniaque:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new NumberField({ initial: 2, integer: true, nullable: false }),
            activation:new StringField({initial:'Combat'}),
            degats:new SchemaField({
              dice:new NumberField({ initial: 8, integer: true, nullable: false }),
              fixe:new NumberField({ initial: 30, integer: true, nullable: false }),
            }),
            violence:new SchemaField({
              dice:new NumberField({ initial: 1, integer: true, nullable: false }),
              fixe:new NumberField({ initial: 0, integer: true, nullable: false }),
            }),
            portee:new StringField({initial:'Contact'}),
            effets:new SchemaField({
              raw:new ArrayField(new StringField(), {
                initial:["parasitage 2", "briserlaresilience"]
              }),
              custom:new ArrayField(new ObjectField())
            }),
          }),
          poingsSoniques:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new NumberField({ initial: 1, integer: true, nullable: false }),
            activation:new StringField({initial:'Combat'}),
            degats:new SchemaField({
              dice:new NumberField({ initial: 6, integer: true, nullable: false }),
              fixe:new NumberField({ initial: 30, integer: true, nullable: false }),
            }),
            violence:new SchemaField({
              dice:new NumberField({ initial: 8, integer: true, nullable: false }),
              fixe:new NumberField({ initial: 20, integer: true, nullable: false }),
            }),
            portee:new StringField({initial:'Contact'}),
            effets:new SchemaField({
              raw:new ArrayField(new StringField()),
              custom:new ArrayField(new ObjectField())
            }),
          }),
          chocSonique:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new NumberField({ initial: 6, integer: true, nullable: false }),
            activation:new StringField({initial:'Combat'}),
            portee:new StringField({initial:'Courte'}),
            effets:new SchemaField({
              raw:new ArrayField(new StringField(), {
                initial:['choc 2', 'choc 4', 'choc 6']
              }),
              custom:new ArrayField(new ObjectField())
            }),
          }),
          bouclierAmrita:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new NumberField({ initial: 4, integer: true, nullable: false }),
            activation:new StringField({initial:'Deplacement'}),
            duree:new StringField({initial:''}),
            bonus:new SchemaField({
              resilience:new NumberField({ initial: 4, integer: true, nullable: false }),
              defense:new NumberField({ initial: 4, integer: true, nullable: false }),
              reaction:new NumberField({ initial: 4, integer: true, nullable: false }),
              champDeForce:new NumberField({ initial: 4, integer: true, nullable: false }),
            }),
          }),
          offering:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new SchemaField({
              min:new NumberField({ initial: 1, integer: true, nullable: false }),
              max:new NumberField({ initial: 5, integer: true, nullable: false }),
              actuel:new NumberField({ initial: 1, integer: true, nullable: false }),
            }),
            activation:new StringField({initial:'Combat'}),
            duree:new NumberField({ initial: 1, integer: true, nullable: false }),
            portee:new StringField({initial:'Moyenne'}),
          }),
          curse:new SchemaField({
            description:new StringField({initial:''}),
            special:new SchemaField({
              degats:new NumberField({ initial: 4, integer: true, nullable: false }),
              reussite:new NumberField({ initial: 4, integer: true, nullable: false }),
              baisserresilience:new SchemaField({
                roll:new NumberField({ initial: 1, integer: true, nullable: false }),
                fixe:new NumberField({ initial: 3, integer: true, nullable: false }),
              }),
              champdeforce:new NumberField({ initial: 1, integer: true, nullable: false }),
              annulerresilience:new NumberField({ initial: 1, integer: true, nullable: false }),
              choc:new StringField({initial:'1d3 + 1'}),
            }),
            activation:new StringField({initial:'Combat'}),
            duree:new NumberField({ initial: 1, integer: true, nullable: false }),
            portee:new StringField({initial:'Moyenne'}),
          }),
          podMiracle:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new NumberField({ initial: 5, integer: true, nullable: false }),
            activation:new StringField({initial:'Combat'}),
            portee:new StringField({initial:'Contact'}),
            blindage:new NumberField({ initial: 60, integer: true, nullable: false }),
            resilience:new NumberField({ initial: 1, integer: true, nullable: false }),
            champDeForce:new NumberField({ initial: 10, integer: true, nullable: false }),
            duree:new NumberField({ initial: 2, integer: true, nullable: false }),
            recuperation:new SchemaField({
              sante:new NumberField({ initial: 3, integer: true, nullable: false }),
              resilience:new NumberField({ initial: 1, integer: true, nullable: false }),
              armure:new NumberField({ initial: 3, integer: true, nullable: false }),
              blindage:new NumberField({ initial: 1, integer: true, nullable: false }),
            }),
          }),
          podInvulnerabilite:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new NumberField({ initial: 3, integer: true, nullable: false }),
            activation:new StringField({initial:'Combat'}),
            duree:new NumberField({ initial: 2, integer: true, nullable: false }),
            portee:new StringField({initial:'Courte'}),
          }),
          dronesEvacuation:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new SchemaField({
              min:new NumberField({ initial: 1, integer: true, nullable: false }),
              max:new NumberField({ initial: 5, integer: true, nullable: false }),
              actuel:new NumberField({ initial: 1, integer: true, nullable: false }),
            }),
            activation:new StringField({initial:'Deplacement'}),
            duree:new NumberField({ initial: 1, integer: true, nullable: false }),
            portee:new StringField({initial:'Zone'}),
          }),
          dronesAirain:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new NumberField({ initial: 5, integer: true, nullable: false }),
            activation:new StringField({initial:'Combat'}),
            duree:new StringField({initial:'Sanslimite'}),
            portee:new StringField({initial:'Longue'}),
          }),
          moduleEmblem:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new NumberField({ initial: 3, integer: true, nullable: false }),
            activation:new StringField({initial:'Deplacement'}),
            duree:new StringField({initial:''}),
            portee:new StringField({initial:'Longue'}),
          }),
          moduleInferno:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new NumberField({ initial: 5, integer: true, nullable: false }),
            activation:new StringField({initial:'Combat'}),
            cdf:new StringField({initial:'1d3'}),
            degats:new SchemaField({
              dice:new NumberField({ initial: 10, integer: true, nullable: false }),
              fixe:new NumberField({ initial: 20, integer: true, nullable: false }),
            }),
            violence:new SchemaField({
              dice:new NumberField({ initial: 10, integer: true, nullable: false }),
              fixe:new NumberField({ initial: 20, integer: true, nullable: false }),
            }),
            duree:new StringField({initial:'Instantanee'}),
            portee:new StringField({initial:'Courte'}),
            effets:new SchemaField({
              raw:new ArrayField(new StringField()),
              custom:new ArrayField(new ObjectField())
            }),
          }),
          moduleWraith:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new SchemaField({
              base:new NumberField({ initial: 3, integer: true, nullable: false }),
              prolonger:new NumberField({ initial: 1, integer: true, nullable: false }),
            }),
            activation:new StringField({initial:'Deplacement'}),
            duree:new StringField({initial:''}),
          }),
          stationDefenseAutomatise:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new NumberField({ initial: 12, integer: true, nullable: false }),
            activation:new StringField({initial:'Combat'}),
            duree:new StringField({initial:'Sanslimite'}),
            portee:new StringField({initial:'Moyenne'}),
            debordement:new NumberField({ initial: 10, integer: true, nullable: false }),
            blindage:new NumberField({ initial: 80, integer: true, nullable: false }),
            resilience:new NumberField({ initial: 1, integer: true, nullable: false }),
            champDeForce:new NumberField({ initial: 10, integer: true, nullable: false }),
          }),
          modeSiegeTower:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new NumberField({ initial: 4, integer: true, nullable: false }),
            activation:new StringField({initial:'Deplacement'}),
            duree:new StringField({initial:''}),
            bonus:new SchemaField({
              resilience:new NumberField({ initial: 10, integer: true, nullable: false }),
            }),
          }),
          nanoBrume:new SchemaField({
            description:new StringField({initial:''}),
            noyaux:new NumberField({ initial: 1, integer: true, nullable: false }),
            activation:new StringField({initial:'Deplacement'}),
            duree:new StringField({initial:'Tour'}),
            bonus:new SchemaField({
              defense:new NumberField({ initial: 3, integer: true, nullable: false }),
              reaction:new NumberField({ initial: 3, integer: true, nullable: false }),
            }),
          }),
        }),
      }),
      combat:new SchemaField({
        armesimprovisees:new EmbeddedDataField(ArmesImproviseesDataModel),
        style:new StringField({initial:"standard", nullable:false}),
        styleInfo:new StringField({initial:""}),
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
      otherMods:new ObjectField(),
    }

    return foundry.utils.mergeObject(base, specific);
  }

  static migrateData(source) {
      if(source.version < 1) {
          const mods = ['reaction', 'defense', 'initiative'];

          for(let m of mods) {
            if(!source[m]) continue;

              for(let b in source[m].bonus) {
                  source[m].bonus[b] = 0;
              }

              for(let b in source[m].malus) {
                  source[m].malus[b] = 0;
              }
          }

          for(let i in source.initiative.diceBonus) {
              source.initiative.diceBonus[i] = 0;
          }

          for(let i in source.initiative.diceMalus) {
              source.initiative.diceMalus[i] = 0;
          }

          for(let i in source.initiative.embuscade.diceBonus) {
              source.initiative.embuscade.diceBonus[i] = 0;
          }

          for(let i in source.initiative.embuscade.diceMalus) {
              source.initiative.embuscade.diceMalus[i] = 0;
          }

          for(let i in source.initiative.embuscade.bonus) {
              source.initiative.embuscade.bonus[i] = 0;
          }

          for(let i in source.initiative.embuscade.malus) {
              source.initiative.embuscade.malus[i] = 0;
          }

          source.version = 1;
      }

      return super.migrateData(source);
  }

  get piloteId() {
    return this.pilote;
  }

  get getPilote() {
    const piloteData = game.actors?.get(this.piloteId) || false;

    return piloteData;
  }

  prepareBaseData() {
    super.prepareBaseData();

    this.#modules();
	}

	prepareDerivedData() {
    this.#handlePilote();
    this.#derived();

    Object.defineProperty(this.initiative, 'complet', {
      value: `${this.initiative.dice}D6+${this.initiative.value}`,
    });
  }

  #handlePilote() {
    const data = this.getPilote;

    if(!data) return;

    Object.defineProperty(this, 'aspects', {
      value: data.system.aspects,
    });
  }

  #derived() {
    const list = CONFIG.KNIGHT.LIST.mechaarmures;

    for(let d of list) {
      const system = this[d];
      const base = system.base;
      const bonus = Object.values(system.bonus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
      const malus = Object.values(system.malus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
      const update = CONFIG.KNIGHT.LIST.hasMax[d] ? 'max' : 'value';

      Object.defineProperty(system, 'mod', {
        value: bonus-malus,
      });

      Object.defineProperty(system, update, {
        value: Math.max(base+bonus-malus, 0),
      });

      if(update === 'max') {
        if(system.value > system.max) {
          Object.defineProperty(system, 'value', {
            value: system.max
          });
        }
      }
    }

    let pilote = {};

    if(this.piloteId !== 0) {
      const piloteData = game.actors?.get(this.piloteId) || false;

      if(piloteData !== false) {
        const piloteSystem = piloteData.system;

        pilote.name = piloteData.name;
        pilote.surnom = piloteSystem.surnom;
        pilote.aspects = piloteSystem.aspects;

        const dataRD = ['reaction', 'defense'];

        for(let i = 0;i < dataRD.length;i++) {
            const isKraken = piloteSystem.options.kraken;
            const dataBonus = piloteSystem[dataRD[i]].bonus;
            const dataMalus = piloteSystem[dataRD[i]].malus;
            const dataMABonus = Object.values(this[dataRD[i]].bonus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
            const dataMAMalus = Object.values(this[dataRD[i]].malus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
            const base = piloteSystem[dataRD[i]].base;

            let bonus = isKraken ? 1 : 0;
            let malus = 0;

            for(const bonusList in dataBonus) {
              if(bonusList === 'user') bonus += dataBonus[bonusList];
            }

            for(const malusList in dataMalus) {
              if(malusList === 'user') malus += dataMalus[malusList];
            }

            bonus += dataMABonus;
            malus += dataMAMalus;

            if(dataRD[i] === 'defense') {
              const ODAura = +piloteSystem.aspects.aspects?.dame?.caracteristiques?.aura?.overdrive?.value || 0;

              if(ODAura >= 5) bonus += +piloteSystem.aspects.dame.caracteristiques.aura.value;
            }

            Object.defineProperty(this[dataRD[i]], 'value', {
              value: Math.max(base+bonus-malus, 0),
            });

            Object.defineProperty(this[dataRD[i]], 'valueWOMod', {
              value: base + bonus,
            });

            Object.defineProperty(this[dataRD[i]], 'malustotal', {
                value: malus,
            });

        }
      }
    }
  }

  #modules() {
    const configuration = this.configurations.actuel;
    const base = this.configurations.liste.base.modules;
    const c1 = this.configurations.liste.c1.modules;
    const c2 = this.configurations.liste.c2.modules;
    let merge = base;

    if(configuration === 'c1') merge = foundry.utils.mergeObject(foundry.utils.deepClone(base), c1);
    else if(configuration === 'c2') merge = foundry.utils.mergeObject(foundry.utils.deepClone(base), c2);

    for(let m in merge) {
      const data = merge[m];

      if(!data.active) continue;
      switch(m) {
        case 'volMarkIV':
          Object.defineProperty(this.manoeuvrabilite.bonus, m, {
              value: data.bonus.manoeuvrabilite,
              writable:true,
              enumerable:true,
              configurable:true
          });
          break;

        case 'bouclierAmrita':
          Object.defineProperty(this.champDeForce.bonus, m, {
              value: data.bonus.champDeForce,
              writable:true,
              enumerable:true,
              configurable:true
          });

          Object.defineProperty(this.defense.bonus, m, {
              value: data.bonus.defense,
              writable:true,
              enumerable:true,
              configurable:true
          });

          Object.defineProperty(this.reaction.bonus, m, {
              value: data.bonus.reaction,
              writable:true,
              enumerable:true,
              configurable:true
          });

          Object.defineProperty(this.resilience.bonus, m, {
              value: data.bonus.resilience,
              writable:true,
              enumerable:true,
              configurable:true
          });
          break;

        case 'nanoBrume':
          Object.defineProperty(this.defense.bonus, m, {
              value: data.bonus.defense,
              writable:true,
              enumerable:true,
              configurable:true
          });

          Object.defineProperty(this.reaction.bonus, m, {
              value: data.bonus.reaction,
              writable:true,
              enumerable:true,
              configurable:true
          });
          break;
      }
    }
  }

  useAI(type, name, num) {
    const label = game.i18n.localize(CONFIG.KNIGHT.armesimprovisees[name][num]);
    const wpn = type === 'distance' ? `${name}${num}d` : `${name}${num}c`;
    const whatRoll = [];
    let modificateur = 0;
    let base = '';

    whatRoll.push('force');

    if(type === 'distance') {
        modificateur = this.rollWpnDistanceMod;
        base = 'tir';
    }
    else base = 'combat';

    const actor = this.actorId;

    const dialog = new game.knight.applications.KnightRollDialog(actor, {
      label,
      wpn,
      base,
      whatRoll,
      modificateur
    });

    dialog.open();

    return dialog;
  }

  // Méthode à surcharger dans les enfants
  _getWeaponHandlers() {
      return {
        armesimprovisees: ({ type, name, num }) => this.useAI(type, name, num),
      };
  }

  changeConfiguration(type) {
    const actor = this.actor;

    actor.update({['system.configurations.actuel']:type});

    const exec = new game.knight.RollKnight(actor,
      {
      name:game.i18n.localize(`KNIGHT.MECHAARMURE.CONFIGURATIONS.Changement`),
      }).sendMessage({
          text:actor.system?.configurations.liste?.[type]?.name ?? '',
          sounds:CONFIG.sounds.notification,
      });
  }

  async activateCapacity(main, key, mainType, subkey=null) {
    const actor = this.actor;
    const idActor = actor.token ? actor.token.id : actor.id;
    const splitType = mainType.split('/');
    const type = splitType[0];
    const depense = await this._depenseNE(main, mainType, key, subkey);
    const config = this.configurations.liste[main].modules[key];
    const resilience = config.resilience;
    let label = game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`);
    let update = {}
    let dataWpn = {
      raw:[],
      custom:[]
    }
    let weapon;
    let options;
    let flags;
    let roll;
    let listtargets;
    let allTargets = [];
    let exec;
    let rollDice;
    let degatsD;
    let degatsF;
    let violenceD;
    let violenceF;
    let actuel = {};
    let save = {}
    let calcul;

    if(!depense.notConcerned && type !== 'attaque') {
      if(!depense.result) return;
      else update = foundry.utils.mergeObject(update, depense.update);
    }

    switch(type) {
      case 'activation':
        const noDesactivation = ['chocSonique', 'vagueSoin', 'canonNoe', 'podMiracle', 'dronesEvacuation'];
        const activation = config.active ? false : true;

        if(!noDesactivation.includes(key)) update[`system.configurations.liste.${main}.modules.${key}.active`] = activation;

        exec = new game.knight.RollKnight(this.actor,
          {
          name:activation ? game.i18n.localize(`KNIGHT.ACTIVATION.Label`) : game.i18n.localize(`KNIGHT.ACTIVATION.Desactivation`),
          }).sendMessage({
              text:game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`),
              sounds:CONFIG.sounds.notification,
        });

        switch(key) {
          case 'chocSonique':
            roll = new game.knight.RollKnight(this.actor, {
              name:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`,
            }, false);

            await roll.doRoll({}, config.effets);
            break;

          case 'podMiracle':
              const payload = {
                name: `${actor.name} : ${label}`,
                type: "mechaarmure",
                img:actor.img,
                system:{
                  "description":game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Description`),
                  "blindage":{
                    "value":config.blindage,
                    "max":config.blindage
                  },
                  "resilience":{
                    "value":config.resilience,
                    "base":config.resilience
                  },
                  "champDeForce":{
                    "base":config.champDeForce
                  },
                  "options":{
                    "isPod":true,
                    "noPilote":true,
                    "noEnergie":true,
                    "noInitiative":true,
                    "noRD":true,
                    "noCarac":true
                  }
                },
                permission:actor.ownership
              };

              const { id, uuid } = await SOCKET.executeAsGM('createSubActor', payload);
              const src = await fromUuid(uuid);
              await spawnTokenRightOfActor({ actor: src, refActor: actor });
            break;

          case 'modeSiegeTower':
            if(activation) {
              update[`system.configurations.save.resilience`] = this.resilience.value;
              update[`system.resilience.bonus.modeSiegeTower`] = config.bonus.resilience;
              update[`system.resilience.value`] = this.resilience.value+config.bonus.resilience;
            } else {
              actuel.resilience = this.resilience.value;
              save.resilience = this.configurations.save.resilience;
              calcul = config.bonus.resilience-(actuel.resilience - save.resilience);

              update[`system.configurations.save.resilience`] = 0;
              update[`system.resilience.bonus.modeSiegeTower`] = 0;

              if(calcul === 0) update[`system.resilience.value`] = save.resilience;
              else if(calcul > 0) update[`system.resilience.value`] = save.resilience-calcul;
            }
            break;
        }
        break;

      case 'attaque':
        const dialog = new game.knight.applications.KnightRollDialog(idActor, {
          label:label,
          wpn:`ma_${actor.id}_${key}`
        });

        dialog.open();
        break;

      case 'degats':
        listtargets = game.user.targets;

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

        degatsD = config.degats.dice;
        degatsF = config.degats.fixe;

        switch(key) {
          case 'tourellesLasersAutomatisees':
          case 'missilesJericho':
            dataWpn.raw = config.effets.raw;
            dataWpn.custom = config.effets.custom;
            break;

          case 'moduleInferno':
            roll = new game.knight.RollKnight(this.actor, {
              name:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)} - ${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Cdf`)}`,
              dices:`${config.cdf}`,
            }, false);

            rollDice = new Roll(`${config.cdf}D6`);
            await rollDice.evaluate();

            const rInfTour = rollDice.total > 1 ? game.i18n.localize(`KNIGHT.AUTRE.Tours`) : game.i18n.localize(`KNIGHT.AUTRE.Tour`);
            roll.sendMessage({text:`${rollDice.total} ${rInfTour}`, classes:'important'})
            break;
        }

        roll = new game.knight.RollKnight(this.actor, {
          name:label,
        }, false);

        weapon = roll.prepareWpnDistance({
          name:label,
          system:{
            degats:{dice:degatsD, fixe:degatsF},
            violence:{dice:0, fixe:0},
            effets:dataWpn,
          }
        });
        options = weapon.options;

        for(let o of options) {
          o.active = true;
        }

        flags = roll.getRollData(weapon, {targets:allTargets})
        roll.setWeapon(weapon);
        await roll.doRollDamage(flags);
        break;

      case 'violence':
        listtargets = game.user.targets;

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

        violenceD = config.degats.dice;
        violenceF = config.degats.fixe;

        switch(key) {
          case 'tourellesLasersAutomatisees':
            dataWpn.raw = config.effets.raw;
            dataWpn.custom = config.effets.custom;
            break;
          case 'moduleInferno':
            roll = new game.knight.RollKnight(this.actor, {
              name:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)} - ${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Cdf`)}`,
              dices:`${config.cdf}`,
            }, false);

            const rollDice = new Roll(`${config.cdf}D6`);
            await rollDice.evaluate();

            const rInfTour = rollDice.total > 1 ? game.i18n.localize(`KNIGHT.AUTRE.Tours`) : game.i18n.localize(`KNIGHT.AUTRE.Tour`);
            roll.sendMessage({text:`${rollDice.total} ${rInfTour}`, classes:'important'})
            break;
        }

        roll = new game.knight.RollKnight(this.actor, {
          name:label,
        }, false);

        weapon = roll.prepareWpnDistance({
          name:label,
          system:{
            degats:{dice:0, fixe:0},
            violence:{dice:violenceD, fixe:violenceF},
            effets:dataWpn,
          }
        });
        options = weapon.options;

        for(let o of options) {
          o.active = true;
        }

        flags = roll.getRollData(weapon, {targets:allTargets})
        roll.setWeapon(weapon);
        await roll.doRollViolence(flags);
        break;

      case 'special':
        switch(key) {
          case 'sautMarkIV':
            update[`system.resilience.value`] = this.resilience.value - resilience;
            update[`system.configurations.liste.${main}.modules.${key}.active`] = false;

            exec = new game.knight.RollKnight(this.actor,
              {
              name:game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`),
              }).sendMessage({
                  text:game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.SAUTMARKIV.Atterrissage`),
                  sounds:CONFIG.sounds.notification,
            });
            break;

          case 'moduleWraith':
            exec = new game.knight.RollKnight(this.actor,
              {
              name:game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`),
              }).sendMessage({
                  text:game.i18n.localize(`KNIGHT.AUTRE.Prolonger`),
                  sounds:CONFIG.sounds.notification,
            });
            break;

          case 'canonNoe':
            exec = new game.knight.RollKnight(this.actor,
              {
              name:game.i18n.localize(`KNIGHT.ACTIVATION.Label`),
              }).sendMessage({
                  text:game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`),
                  sounds:CONFIG.sounds.notification,
            });

            roll = new game.knight.RollKnight(this.actor, {
              name:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)} - ${game.i18n.localize(`KNIGHT.LATERAL.Resilience`)}`,
              dices:`${config.reparations.mechaarmure.resilience}D6`,
            }, false);

            await roll.doRoll();
            break;

          case 'canonMagma':
            roll = new game.knight.RollKnight(this.actor, {
              name:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)} - ${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.AneantirBande`)}`,
            }, false);

            weapon = roll.prepareWpnDistance({
              name:roll.name,
              system:{
                degats:{dice:0, fixe:0},
                violence:{dice:0, fixe:0},
                effets:{
                  raw:[`aneantirbande`]
                },
              }
            });
            options = weapon.options;

            for(let o of options) {
              o.active = true;
            }

            listtargets = game.user.targets;

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

            flags = roll.getRollData(weapon, {targets:allTargets})

            roll.setWeapon(weapon);
            roll.autoApplyEffects({
              noDmg:true,
              noViolence:true,
            });
            break;

          case 'stationDefenseAutomatise':
            const activation = config.active ? false : true;
            update[`system.configurations.liste.${main}.modules.${key}.active`] = activation;

            if(activation) {
              exec = new game.knight.RollKnight(actor,
                {
                name:game.i18n.localize(`KNIGHT.ACTIVATION.Label`),
                }).sendMessage({
                    text:game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`),
                    sounds:CONFIG.sounds.notification,
              });

              const payload = {
                name: `${actor.name} : ${label}`,
                type: "vehicule",
                img:actor.img,
                system:{
                  "description":game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Description`),
                  "armure":{
                    "value":80,
                    "base":80,
                  },
                  "resilience":{
                    "value":1,
                    "base":1,
                  },
                  "champDeForce":{
                    "base":10,
                  },
                  "debordement":{
                    'value':10
                  },
                  "options":{
                    "blindage":true,
                    "noPilote":true,
                    "noPassager":true,
                    "debordement":true
                  }
                },
                ownership:actor.ownership
              };

              const { id, uuid } = await SOCKET.executeAsGM('createSubActor', payload);
              const src = await fromUuid(uuid);

              await SOCKET.executeAsGM('giveItmToActor', {
                actor:uuid,
                items:[
                  new Item({
                    name:game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.PodMissile`),
                    type:'module',
                    img:'modules/knight-compendium/assets/modules/pod-missile.webp',
                    system:{
                      description:game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.PodMissileDescription`),
                      categorie:'distance',
                      niveau:{
                        details:{
                          n1:{
                            permanent:true,
                            rarete:'avance',
                            activation:'deplacement',
                            prix:30,
                            arme:{
                              has:true,
                              type:'distance',
                              portee:'longue',
                              degats:{
                                dice:6,
                                fixe:3
                              },
                              violence:{
                                dice:1,
                                fixe:6
                              },
                              effets:{
                                raw:['antivehicule', 'artillerie', 'autohit'],
                                liste:[],
                              }
                            },
                          }
                        }
                      }
                    }
                  }),
                  new Item({
                    name:game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.PodRoquette`),
                    type:'module',
                    img:'modules/knight-compendium/assets/modules/pod-roquette.webp',
                    system:{
                      description:game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.PodRoquetteDescription`),
                      categorie:'distance',
                      niveau:{
                        details:{
                          n1:{
                            permanent:true,
                            rarete:'avance',
                            activation:'deplacement',
                            prix:30,
                            arme:{
                              has:true,
                              type:'distance',
                              portee:'longue',
                              degats:{
                                dice:1,
                                fixe:6
                              },
                              violence:{
                                dice:8,
                                fixe:12
                              },
                              effets:{
                                raw:['demoralisant', 'autohit'],
                                liste:[],
                              }
                            },
                          }
                        }
                      }
                    }
                  })
                ]
              });
              const token = await spawnTokenRightOfActor({ actor: src, refActor: actor });

              update[`system.configurations.invocations.stationDefenseAutomatiseActor`] = uuid;
              update[`system.configurations.invocations.stationDefenseAutomatiseToken`] = token.uuid;
            } else {
              update[`system.configurations.invocations.stationDefenseAutomatiseActor`] = null;
              update[`system.configurations.invocations.stationDefenseAutomatiseToken`] = null;

              await SOCKET.executeAsGM('deleteActorOrToken', {
                actors:[
                  this.configurations.invocations.stationDefenseAutomatiseActor,
                  this.configurations.invocations.stationDefenseAutomatiseToken,
                ],
              });

              exec = new game.knight.RollKnight(this.actor,
                {
                name:game.i18n.localize(`KNIGHT.ACTIVATION.Desactivation`),
                }).sendMessage({
                    text:game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`),
                    sounds:CONFIG.sounds.notification,
              });
            }
            break;

          case 'missilesJericho':
            listtargets = game.user.targets;

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

            dataWpn.raw = config.effets.raw;
            dataWpn.custom = config.effets.custom;

            degatsD = config.degats.dice;
            degatsF = config.degats.fixe;
            violenceD = config.degats.dice;
            violenceF = config.degats.fixe;

            label += ` : ${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.ZoneExterieure`)}`

            roll = new game.knight.RollKnight(this.actor, {
              name:label,
            }, false);

            weapon = roll.prepareWpnDistance({
              name:label,
              system:{
                degats:{dice:degatsD, fixe:degatsF},
                violence:{dice:violenceD, fixe:violenceF},
                effets:dataWpn,
              }
            });
            options = weapon.options;

            for(let o of options) {
              o.active = true;
            }

            flags = roll.getRollData(weapon, {targets:allTargets})
            roll.setWeapon(weapon);

            if(splitType[1] === 'degats') {
              await roll.doRollDamage(flags);
            } else if(splitType[1] === 'violence') {
              await roll.doRollViolence(flags);
            }
            break;
        }
        break;

      case 'multi':
        switch(key) {
          case 'offering':
            let sublabel = ``;

            if(splitType[1] == `degats`) sublabel += ` : ${game.i18n.localize("KNIGHT.BONUS.Degats")} / ${game.i18n.localize("KNIGHT.BONUS.Violence")}`;
            else if(splitType[1] == `caracteristique`) sublabel += ` : ${game.i18n.localize("KNIGHT.BONUS.BonusCaracteristique")}`;
            else if(splitType[1] == `action`) sublabel += ` : ${game.i18n.localize("KNIGHT.BONUS.Action")}`;
            else if(splitType[1] == `cdf`) sublabel += ` : ${game.i18n.localize("KNIGHT.BONUS.ChampDeForce")}`;
            else if(splitType[1] == `noyaux`) {
              sublabel += ` : ${game.i18n.localize("KNIGHT.BONUS.Noyau")}`;
              sublabel += ` (${config.noyaux.actuel})`;
            }

            exec = new game.knight.RollKnight(this.actor,
              {
              name:game.i18n.localize(`KNIGHT.ACTIVATION.Label`),
              }).sendMessage({
                  text:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}${sublabel}`,
                  sounds:CONFIG.sounds.notification,
            });
            break;

          case 'curse':
            const noActivation = ['choc'];

            if(!noActivation.includes(splitType[1])) {
              exec = new game.knight.RollKnight(this.actor,
                {
                name:game.i18n.localize(`KNIGHT.ACTIVATION.Label`),
                }).sendMessage({
                    text:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`,
                    sounds:CONFIG.sounds.notification,
              });
            }

            roll = new game.knight.RollKnight(this.actor, {
              name:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`,
            }, false);

            switch(splitType[1]) {
              case "degats":
                roll.sendMessage({text:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.DiminueDegatsViolence`)} : ${config.special.degats}${game.i18n.localize(`KNIGHT.JETS.Des-short`)}6`});
                break;

              case "reussite":
                roll.sendMessage({text:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.RetireReussite`)} : ${config.special.reussite}`});
                break;

              case "baisserresilienceroll":
                rollDice = new Roll(`${config.special.baisserresilience.roll}D6`);
                await rollDice.evaluate();

                roll.sendMessage({text:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.BaisseResilience`)} : ${rollDice.total}`})
                break;

              case "baisserresiliencefixe":
                roll.sendMessage({text:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.BaisseResilience`)} : ${config.special.baisserresilience.fixe}`})
                break;

              case "champdeforce":
                roll.sendMessage({text:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.AnnuleChampDeForce`)}`})
                break;

              case "annulerresilience":
                roll.sendMessage({text:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.AnnuleResilience`)}`})
                break;

              case "choc":
                rollDice = new Roll(`${config.special.choc}`);
                await rollDice.evaluate();

                roll.name = `${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)} - ${game.i18n.localize(`KNIGHT.EFFETS.CHOC.Label`)}`;

                weapon = roll.prepareWpnDistance({
                  name:roll.name,
                  system:{
                    degats:{dice:0, fixe:0},
                    violence:{dice:0, fixe:0},
                    effets:{
                      raw:[`choc ${rollDice.total}`]
                    },
                  }
                });
                options = weapon.options;

                for(let o of options) {
                  o.active = true;
                }

                listtargets = game.user.targets;

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

                flags = roll.getRollData(weapon, {targets:allTargets})

                roll.setWeapon(weapon);
                roll.autoApplyEffects({
                  noDmg:true,
                  noViolence:true,
                });
                break;
            }
            break;
        }
        break;
    }

    if(!foundry.utils.isEmpty(update)) await actor.update(update);
  }

  async _depenseNE(main, mainType, key, subkey=null) {
    const splitType = mainType.split('/');
    const type = splitType[0];
    const label = game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`);
    const noyauxActuel = this.energie.value;
    const config = this.configurations.liste[main].modules[key];
    const complexe = ['moduleWraith', 'dronesEvacuation', 'canonMagma'];
    let noyaux = complexe.includes(key) ? config.noyaux[subkey] : config.noyaux;

    if(type === 'multi') {
      switch(key) {
        case 'offering':
          if(splitType[1] === 'degats' || splitType[1] === 'caracteristique') noyaux = 1;
          else if(splitType[1] === 'action' || splitType[1] === 'cdf') noyaux = 2;
          else if(splitType[1] === 'noyaux') noyaux = Number(noyaux.actuel);
          break;

        case 'curse':
          if(splitType[1] === 'degats' || splitType[1] === 'reussite') noyaux = 1;
          else if(splitType[1] === 'baisserresilienceroll' || splitType[1] === 'baisserresiliencefixe') noyaux = 2;
          else if(splitType[1] === 'champdeforce') noyaux = 3;
          else if(splitType[1] === 'annulerresilience' || splitType[1] === 'choc') noyaux = 5;
          break;
      }
    }

    if(noyaux === 0 || (type === 'activation' && config.active) || (type === 'special' && key === 'stationDefenseAutomatise' && config.active)) return {
      notConcerned:true,
    }

    if(type === 'special' && key === 'missilesJericho') noyaux += 1;

    let newEnergie = noyauxActuel - noyaux;

    if(newEnergie < 0) {
      const msgEnergie = {
        flavor:`${label}`,
        main:{
          total:`${game.i18n.localize(`KNIGHT.JETS.Notenergie`)}`
        }
      };

      const msgEnergieData = {
        user: game.user.id,
        speaker: {
          actor: this.actor?.id || null,
          token: this.actor?.token?.id || null,
          alias: this.actor?.name || null,
        },
        type: CONST.CHAT_MESSAGE_TYPES.OTHER,
        content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgEnergie),
        sound: CONFIG.sounds.dice
      };

      const rMode = game.settings.get("core", "rollMode");
      const msgFData = ChatMessage.applyRollMode(msgEnergieData, rMode);

      await ChatMessage.create(msgFData, {
        rollMode:rMode
      });

      return {
        notConcerned:false,
        result:false,
      };
    }

    if(newEnergie < 0) newEnergie = 0;

    let update = {};

    update[`system.energie.value`] = newEnergie;

    return {
      update:update,
      notConcerned:false,
      result:true,
    };
  }
}