import { AspectsPCDataModel } from '../parts/aspects-pc-data-model.mjs';
import { DefensesDataModel } from '../parts/defenses-data-model.mjs';
import { ArmesImproviseesDataModel } from '../parts/armesimprovisees-data-model.mjs';
import { InitiativeDataModel } from '../parts/initiative-data-model.mjs';

export class MechaArmureDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const {SchemaField, EmbeddedDataField, StringField, NumberField, BooleanField, ObjectField, ArrayField, HTMLField} = foundry.data.fields;

        return {
            description:new HTMLField({initial:""}),
            descriptionLimitee:new HTMLField({initial:""}),
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
              actuel:new SchemaField({
                base:new StringField({initial:''}),
                c1:new StringField({initial:''}),
                c2:new StringField({initial:''}),
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
              actuel:new StringField({initial:''}),
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
        }
    }

  prepareBaseData() {

	}

	prepareDerivedData() {
    this.#derived();

    Object.defineProperty(this.initiative, 'complet', {
      value: `${this.initiative.dice}D6+${this.initiative.value}`,
    });
  }

  #derived() {
    const list = CONFIG.KNIGHT.LIST.mechaarmures;

    for(let d of list) {
      const system = this[d];
      const base = system.base;
      const bonus = system.bonus?.user ?? 0;
      const malus = system.malus?.user ?? 0;
      const update = CONFIG.KNIGHT.LIST.hasMax[d] ? 'max' : 'value';

      Object.defineProperty(system, 'mod', {
        value: bonus-malus,
      });

      Object.defineProperty(system, update, {
        value: Math.max(base+bonus-malus, 0),
      });
    }
  }
}