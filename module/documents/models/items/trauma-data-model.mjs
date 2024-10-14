export class TraumaDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const {HTMLField, NumberField, SchemaField, StringField, ArrayField, ObjectField, BooleanField} = foundry.data.fields;
        let data = {};

        for(let a of CONFIG.KNIGHT.LIST.aspects) {
            let caracteristiques = {};

            for(let c of CONFIG.KNIGHT.LIST.caracteristiques[a]) {
              caracteristiques[c] = new SchemaField({
                value:new NumberField({ initial: 0, integer: true, nullable: false }),
              });
            }

            data[a] = new SchemaField({
              value:new NumberField({ initial: 0, integer: true, nullable: false }),
              caracteristiques:new SchemaField(caracteristiques),
            });
          }

        return {
            description:new HTMLField({initial:''}),
            gainEspoir:new SchemaField({
                value:new NumberField({initial:0, nullable:false, integer:true}),
                applique:new BooleanField({initial:false}),
            }),
            aspects:new SchemaField(data),
        }
    }

  prepareBaseData() {

	}

	prepareDerivedData() {

    }
}