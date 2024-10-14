export class SimpleDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const {HTMLField} = foundry.data.fields;

        return {
            description:new HTMLField({initial:''}),
        }
    }

    prepareBaseData() {

	}

	prepareDerivedData() {

    }
}