export class EffetDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const {HTMLField, NumberField, SchemaField, StringField, BooleanField} = foundry.data.fields;

        return {
            description:new HTMLField({initial:''}),
            type:new StringField({initial:'effets'}),
            attaque:new SchemaField({
                reussite:new NumberField({initial:0, nullable:false, integer:true}),
                jet:new NumberField({initial:0, nullable:false, integer:true}),
                carac:new SchemaField({
                  fixe:new StringField({initial:''}),
                  labelFixe:new StringField({initial:''}),
                  odInclusFixe:new BooleanField({initial:false}),
                  jet:new StringField({initial:''}),
                  labelJet:new StringField({initial:''}),
                  odInclusJet:new BooleanField({initial:false}),
                }),
                aspect:new SchemaField({
                  fixe:new StringField({initial:''}),
                  labelFixe:new StringField({initial:''}),
                  aeInclusFixe:new BooleanField({initial:false}),
                  jet:new StringField({initial:''}),
                  labelJet:new StringField({initial:''}),
                  aeInclusJet:new BooleanField({initial:false}),
                }),
                conditionnel:new SchemaField({
                  has:new BooleanField({initial:false}),
                  label:new StringField({initial:''}),
                  condition:new StringField({initial:''}),
                }),
            }),
            degats:new SchemaField({
                fixe:new NumberField({initial:0, nullable:false, integer:true}),
                jet:new NumberField({initial:0, nullable:false, integer:true}),
                carac:new SchemaField({
                  fixe:new StringField({initial:''}),
                  labelFixe:new StringField({initial:''}),
                  odInclusFixe:new BooleanField({initial:false}),
                  jet:new StringField({initial:''}),
                  labelJet:new StringField({initial:''}),
                  odInclusJet:new BooleanField({initial:false}),
                }),
                aspect:new SchemaField({
                  fixe:new StringField({initial:''}),
                  labelFixe:new StringField({initial:''}),
                  aeInclusFixe:new BooleanField({initial:false}),
                  jet:new StringField({initial:''}),
                  labelJet:new StringField({initial:''}),
                  aeInclusJet:new BooleanField({initial:false}),
                }),
                conditionnel:new SchemaField({
                  has:new BooleanField({initial:false}),
                  label:new StringField({initial:''}),
                  condition:new StringField({initial:''}),
                }),
            }),
            violence:new SchemaField({
                fixe:new NumberField({initial:0, nullable:false, integer:true}),
                jet:new NumberField({initial:0, nullable:false, integer:true}),
                carac:new SchemaField({
                  fixe:new StringField({initial:''}),
                  labelFixe:new StringField({initial:''}),
                  odInclusFixe:new BooleanField({initial:false}),
                  jet:new StringField({initial:''}),
                  labelJet:new StringField({initial:''}),
                  odInclusJet:new BooleanField({initial:false}),
                }),
                aspect:new SchemaField({
                  fixe:new StringField({initial:''}),
                  labelFixe:new StringField({initial:''}),
                  aeInclusFixe:new BooleanField({initial:false}),
                  jet:new StringField({initial:''}),
                  labelJet:new StringField({initial:''}),
                  aeInclusJet:new BooleanField({initial:false}),
                }),
                conditionnel:new SchemaField({
                  has:new BooleanField({initial:false}),
                  label:new StringField({initial:''}),
                  condition:new StringField({initial:''}),
                }),
            }),
        }
    }

    prepareBaseData() {

	}

	prepareDerivedData() {

    }
}