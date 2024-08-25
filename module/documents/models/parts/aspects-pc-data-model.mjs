import { CaracteristiqueDataModel } from './caracteristique-data-model.mjs';

export class AspectsPCDataModel extends foundry.abstract.DataModel {
	static defineSchema() {
      const {NumberField, StringField, SchemaField, EmbeddedDataField} = foundry.data.fields;
      let data = {};

      for(let a of CONFIG.KNIGHT.LIST.aspects) {
        let caracteristiques = {};

        for(let c of CONFIG.KNIGHT.LIST.caracteristiques[a]) {
          caracteristiques[c] = new EmbeddedDataField(CaracteristiqueDataModel);
        }

        data[a] = new SchemaField({
          base:new NumberField({ initial: 0, integer: true, nullable: false }),
          bonus:new NumberField({ initial: 0, integer: true, nullable: false }),
          malus:new NumberField({ initial: 0, integer: true, nullable: false }),
          max:new NumberField({ initial: 0, integer: true, nullable: false }),
          value:new NumberField({ initial: 0, integer: true, nullable: false }),
          description:new StringField({ initial: ""}),
          caracteristiques:new SchemaField(caracteristiques),
        });
      }

      return data;
    }

    prepareData() {
      for(let a in this) {
        const value = Math.max(this[a].base+this[a].bonus-this[a].malus, 0);

        Object.defineProperty(this[a], 'value', {
            value: value,
        });

        for(let c in this[a].caracteristiques) {
          Object.defineProperty(this[a].caracteristiques[c], 'value', {
            value: Math.max(Math.min(value, this[a].caracteristiques[c].base+this[a].caracteristiques[c].bonus-this[a].caracteristiques[c].malus), 0),
          });

          Object.defineProperty(this[a].caracteristiques[c].overdrive, 'value', {
            value: Math.max(this[a].caracteristiques[c].overdrive.base+this[a].caracteristiques[c].overdrive.bonus-this[a].caracteristiques[c].overdrive.malus, 0),
          });
        }
      }
    }
}