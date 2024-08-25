
export class ArmesImproviseesDataModel extends foundry.abstract.DataModel {
	static defineSchema() {
      const {NumberField, StringField, SchemaField, ArrayField} = foundry.data.fields;
      const list = CONFIG.KNIGHT.LIST.armesimprovisees;
      let armesimprovisees = {};

      for(let ai in list) {
        const liste = list[ai].liste;
        let wpn = {};

        for(let w in liste) {
          wpn[w] = new SchemaField({
            utilisation:new NumberField({initial:liste[w].utilisation, min:0, integer: true}),
            degats:new SchemaField({
              dice:new NumberField({initial:liste[w].degats.dice, min:0, integer: true, nullable:false}),
            }),
            violence:new SchemaField({
              dice:new NumberField({initial:liste[w].violence.dice, min:0, integer: true, nullable:false}),
            }),
            effets:new SchemaField({
              raw:new ArrayField(new StringField({initial:liste[w].effets.raw})),
              custom:new ArrayField(new StringField({initial:liste[w].effets.custom})),
            }),
          });
        }

        armesimprovisees[ai] = new SchemaField({
          chair:new ArrayField(new NumberField({initial:list[ai].chair})),
          force:new NumberField({initial:list[ai].force}),
          liste:new SchemaField(wpn),
        });
      }

      return {
        aspect:new StringField({ initial: "chair", nullable: false }),
        contact:new StringField({ initial: "contact", nullable: false }),
        distance:new StringField({ initial: "tir", nullable: false }),
        liste:new SchemaField(armesimprovisees),
      };
    }
}