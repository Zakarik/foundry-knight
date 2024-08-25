
export class DefensesDataModel extends foundry.abstract.DataModel {
	static defineSchema() {
      const {NumberField, ObjectField} = foundry.data.fields;

      return {
        base:new NumberField({initial:0, min:0, nullable:false, integer:true}),
        bonusValue:new NumberField({initial:0, nullable:false, integer:true}),
        malusValue:new NumberField({initial:0, nullable:false, integer:true}),
        value:new NumberField({initial:0, nullable:false, integer:true}),
        mod:new NumberField({initial:0, nullable:false, integer:true}),
        bonus:new ObjectField({
          initial:{
            user:0,
          }
        }),
        malus:new ObjectField({
          initial:{
            user:0,
          }
        }),
      };
    }
}