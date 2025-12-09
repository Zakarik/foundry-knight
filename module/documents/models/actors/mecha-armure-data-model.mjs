
import { BaseActorDataModel } from "../base/base-actor-data-model.mjs";
import { AspectsPCDataModel } from '../parts/aspects-pc-data-model.mjs';
import { DefensesDataModel } from '../parts/defenses-data-model.mjs';
import { ArmesImproviseesDataModel } from '../parts/armesimprovisees-data-model.mjs';
import { InitiativeDataModel } from '../parts/initiative-data-model.mjs';

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
              dice:new NumberField({ initial: 0, integer: true, nullable: false }),
              fixe:new NumberField({ initial: 1, integer: true, nullable: false }),
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

        case 'modeSiegeTower':
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
}