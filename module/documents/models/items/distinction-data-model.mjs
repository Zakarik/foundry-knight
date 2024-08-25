export class DistinctionDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const {HTMLField, NumberField} = foundry.data.fields;

        return {
            description:new HTMLField({initial:''}),
            espoir:new NumberField({initial:0, nullable:false, integer:true}),
            egide:new NumberField({initial:0, nullable:false, integer:true}),
        }
    }

    prepareBaseData() {

	}

	prepareDerivedData() {

    }
}