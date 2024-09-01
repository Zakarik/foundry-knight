export class ArmeDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const {HTMLField, SchemaField, StringField, NumberField, BooleanField, ArrayField, ObjectField} = foundry.data.fields;

    return {
      equipped:new BooleanField({initial:false}),
      rack:new BooleanField({initial:false}),
      description: new HTMLField({initial: ''}),
      rarete: new StringField({initial: 'standard'}),
      type: new StringField({initial: 'contact'}),
      portee: new StringField({initial: 'contact'}),
      prix: new NumberField({initial: 0}),
      energie: new NumberField({initial: 0}),
      listes: new SchemaField({}),
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
        liste: new SchemaField({})
      }),
      tourelle: new SchemaField({
        has: new BooleanField({initial: false}),
        attaque: new SchemaField({
          dice: new NumberField({initial: 0}),
          fixe: new NumberField({initial: 0})
        })
      }),
      degats: new SchemaField({
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
        custom: new ArrayField(new ObjectField())
      }),
      effets2mains: new SchemaField({
        liste: new ArrayField(new StringField()),
        raw: new ArrayField(new StringField()),
        custom: new ArrayField(new ObjectField())
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

  prepareBaseData() {

  }

  prepareDerivedData() {

  }
}