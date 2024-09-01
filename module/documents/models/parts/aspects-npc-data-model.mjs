
export class AspectsNPCDataModel extends foundry.abstract.DataModel {
	static defineSchema() {
    const {NumberField, SchemaField} = foundry.data.fields;
    let data = {};

    for(let a of CONFIG.KNIGHT.LIST.aspects) {
      data[a] = new SchemaField({
        max:new NumberField({ initial: 20, min:0, integer: true, nullable: false }),
        value:new NumberField({ initial: 0, min:0, integer: true, nullable: false }),
        ae:new SchemaField({
          mineur:new SchemaField({
            value:new NumberField({ initial: 0, min:0, integer: true, nullable: false }),
            max:new NumberField({ initial: 10, min:0, integer: true, nullable: false }),
          }),
          majeur:new SchemaField({
            value:new NumberField({ initial: 0, min:0, integer: true, nullable: false }),
            max:new NumberField({ initial: 10, min:0, integer: true, nullable: false }),
          }),
        }),
      });
    }

    return data;
  }
}