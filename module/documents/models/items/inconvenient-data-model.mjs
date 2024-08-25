export class InconvenientDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const {HTMLField, NumberField, SchemaField, StringField, BooleanField} = foundry.data.fields;

    let aspects = {
      all:new SchemaField({
        has:new BooleanField({initial:false}),
        value:new NumberField({ initial: 9, integer: true, nullable: false }),
      }),
    };

    for(let a of CONFIG.KNIGHT.LIST.aspects) {
        aspects[a] = new SchemaField({
          has:new BooleanField({initial:false}),
          value:new NumberField({ initial: 9, integer: true, nullable: false }),
          max:new NumberField({ initial: 9, integer: true, nullable: false }),
        });
      }

      return {
          description:new HTMLField({initial:''}),
          type: new StringField({initial: "standard"}),
          limitations:new SchemaField({
            aspects:new SchemaField(aspects),
            espoir:new SchemaField({
              aucunGain:new BooleanField({initial:false}),
            }),
          }),
          malus: new SchemaField({
            sante: new NumberField({initial: 0, integer: true}),
            espoir: new NumberField({initial: 0, integer: true}),
            initiative: new SchemaField({
              dice: new NumberField({initial: 0, integer: true}),
              fixe: new NumberField({initial: 0, integer: true}),
              ifEmbuscade: new SchemaField({
                has: new BooleanField({initial: false}),
                dice: new NumberField({initial: 0, integer: true}),
                fixe: new NumberField({initial: 0, integer: true})
              })
            }),
            recuperation: new SchemaField({
              sante: new NumberField({initial: 0, integer: true}),
              armure: new NumberField({initial: 0, integer: true}),
              energie: new NumberField({initial: 0, integer: true}),
              espoir: new NumberField({initial: 0, integer: true})
            }),
            coutsAugmentes: new SchemaField({
              has: new BooleanField({initial: false}),
              aspect: new SchemaField({
                multiplie: new NumberField({initial: 0, integer: true}),
                value: new NumberField({initial: 0, integer: true})
              }),
              caracteristique: new SchemaField({
                multiplie: new NumberField({initial: 0, integer: true}),
                value: new NumberField({initial: 0, integer: true})
              })
            })
          })
      }
    }

    prepareBaseData() {

	}

	prepareDerivedData() {

    }
}