export class AvantageDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const {HTMLField, NumberField, SchemaField, StringField, BooleanField} = foundry.data.fields;

        return {
            description:new HTMLField({initial:''}),
            type:new StringField({initial:'standard'}),
            bonus:new SchemaField({
              sante:new NumberField({ initial: 0, integer: true, nullable: false }),
              espoir:new NumberField({ initial: 0, integer: true, nullable: false }),
              noDmgSante:new BooleanField({initial:false}),
              devasterAnatheme:new BooleanField({initial:false}),
              bourreauTenebres:new BooleanField({initial:false}),
              equilibrerBalance:new BooleanField({initial:false}),
              initiative:new SchemaField({
                dice:new NumberField({ initial: 0, integer: true, nullable: false }),
                fixe:new NumberField({ initial: 0, integer: true, nullable: false }),
                ifEmbuscade:new SchemaField({
                  has:new BooleanField({initial:false}),
                  dice:new NumberField({ initial: 0, integer: true, nullable: false }),
                  fixe:new NumberField({ initial: 0, integer: true, nullable: false }),
                }),
              }),
              recuperation:new SchemaField({
                sante:new NumberField({ initial: 0, integer: true, nullable: false }),
                armure:new NumberField({ initial: 0, integer: true, nullable: false }),
                energie:new NumberField({ initial: 0, integer: true, nullable: false }),
                espoir:new NumberField({ initial: 0, integer: true, nullable: false }),
              }),
              coutsReduits:new SchemaField({
                has:new BooleanField({initial:false}),
                aspect:new SchemaField({
                  divise:new NumberField({ initial: 0, integer: true, nullable: false }),
                  value:new NumberField({ initial: 0, integer: true, nullable: false }),
                }),
                caracteristique:new SchemaField({
                  divise:new NumberField({ initial: 0, integer: true, nullable: false }),
                  value:new NumberField({ initial: 0, integer: true, nullable: false }),
                }),
              }),
            }),
        }
    }

    prepareBaseData() {

	}

	prepareDerivedData() {

    }
}