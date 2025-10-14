
export class DefensesDataModel extends foundry.abstract.DataModel {
	static defineSchema() {
      const {NumberField, ObjectField, BooleanField} = foundry.data.fields;

      return {
        base:new NumberField({initial:0, min:0, nullable:false, integer:true}),
        value:new NumberField({initial:0, nullable:false, integer:true}),
        valueWOMod:new NumberField({initial:0, nullable:false, integer:true}),
        mod:new NumberField({initial:0, nullable:false, integer:true}),
        malustotal:new NumberField({initial:0, nullable:false, integer:true}),
        iswatchtower:new BooleanField({initial:false}),
        bonus:new ObjectField({
          initial:{
            user:0,
            system:0,
          }
        }),
        malus:new ObjectField({
          initial:{
            user:0,
            system:0,
          }
        }),
      };
    }
}