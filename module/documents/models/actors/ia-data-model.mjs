export class IADataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const {StringField, HTMLField} = foundry.data.fields;

        return {
            caractere:new HTMLField({initial:''}),
            code:new StringField({initial:''})
        }
    }

    prepareBaseData() {

	}

	prepareDerivedData() {

    }
}