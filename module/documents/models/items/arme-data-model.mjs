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

  useMunition() {
    console.warn('test');
  }

  prepareBaseData() {

  }

  prepareDerivedData() {

  }
}