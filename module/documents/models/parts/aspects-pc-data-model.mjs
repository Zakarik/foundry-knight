import { CaracteristiqueDataModel } from './caracteristique-data-model.mjs';

export class AspectsPCDataModel extends foundry.abstract.DataModel {
	static defineSchema() {
      const {NumberField, StringField, SchemaField, EmbeddedDataField, ObjectField} = foundry.data.fields;
      let data = {};

      for(let a of CONFIG.KNIGHT.LIST.aspects) {
        let caracteristiques = {};

        for(let c of CONFIG.KNIGHT.LIST.caracteristiques[a]) {
          caracteristiques[c] = new EmbeddedDataField(CaracteristiqueDataModel);
        }

        data[a] = new SchemaField({
          base:new NumberField({ initial: 2, integer: true, nullable: false }),
          mod:new NumberField({ initial: 0, integer: true, nullable: false }),
          bonus:new ObjectField(),
          malus:new ObjectField(),
          max:new NumberField({ initial: 9, integer: true, nullable: false }),
          value:new NumberField({ initial: 0, integer: true, nullable: false }),
          description:new StringField({ initial: ""}),
          caracteristiques:new SchemaField(caracteristiques),
        });
      }

      return data;
    }

    prepareData() {
      for(let a in this) {
        const bonus = Object.values(this[a].bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        const malus = Object.values(this[a].malus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

        Object.defineProperty(this[a], 'mod', {
            value: bonus-malus,
        });

        const value = Math.max(this[a].base+this[a].mod, 0);

        Object.defineProperty(this[a], 'value', {
            value: Math.min(value, this[a].max),
        });

        for(let c in this[a].caracteristiques) {
          this[a].caracteristiques[c].prepareData(this[a].value);
        }
      }
    }
}