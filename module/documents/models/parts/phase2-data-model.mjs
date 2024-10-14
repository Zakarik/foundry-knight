
export class Phase2DataModel extends foundry.abstract.DataModel {
	static defineSchema() {
    const {NumberField, SchemaField} = foundry.data.fields;
    const data = {
        armure:new NumberField({initial:0, nullable:false, integer:true}),
        energie:new NumberField({initial:0, nullable:false, integer:true}),
        sante:new NumberField({initial:0, nullable:false, integer:true}),
    };
    let aspects = {};

    for(let a of CONFIG.KNIGHT.LIST.aspects) {
        aspects[a] = new SchemaField({
        value:new NumberField({ initial: 0, min:0, integer: true, nullable: false }),
        ae:new SchemaField({
          mineur:new NumberField({ initial: 0, min:0, integer: true, nullable: false }),
          majeur:new NumberField({ initial: 0, min:0, integer: true, nullable: false }),
        }),
      });
    }

    data.aspects = new SchemaField(aspects);

    return data;
  }
}