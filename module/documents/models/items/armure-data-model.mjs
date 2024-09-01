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
      })
    };
  }

  prepareBaseData() {
    if(this.generation === 4) {

      Object.defineProperty(this.jauges, 'sante', {
        value: false,
      });
    }

    this.capacites.prepareData();
  }
}