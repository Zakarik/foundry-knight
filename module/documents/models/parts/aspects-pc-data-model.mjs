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
          optimisation:new SchemaField({
            bonus:new ObjectField(),
            malus:new ObjectField(),
          }),
          override:new ObjectField(),
          divide:new ObjectField(),
          max:new NumberField({ initial: 9, integer: true, nullable: false }),
          bonusMax:new ObjectField(),
          malusMax:new ObjectField(),
          overrideMax:new ObjectField(),
          divideMax:new ObjectField(),
          value:new NumberField({ initial: 0, integer: true, nullable: false }),
          description:new StringField({ initial: ""}),
          caracteristiques:new SchemaField(caracteristiques),
        });
      }

      return data;
    }

    prepareData() {
      this.#prepareMax();
      this.#prepareValue();
    }

    #prepareValue() {
      for(let a in this) {
        const override = Object.values(this[a].override).reduce((max, curr) => Math.max(max, Number(curr) || 0), 0);

        if(!override) {
          const divide = Object.values(this[a].divide).reduce((max, curr) => Math.max(max, Number(curr) || 0), 0);
          const bonus = Object.values(this[a].bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
          const malus = Object.values(this[a].malus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
          const bonusOpti = Object.values(this[a].optimisation.bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
          const malusOpti = Object.values(this[a].optimisation.malus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
          const base = divide > 0 ? Math.floor(this[a].base/divide) : this[a].base;

          Object.defineProperty(this[a], 'mod', {
              value: bonus-malus,
          });

          const value = Math.max(base+this[a].mod, 0);

          Object.defineProperty(this[a], 'value', {
              value: Math.max(Math.min(value, this[a].max)+(bonusOpti-malusOpti), 0),
          });

          for(let c in this[a].caracteristiques) {
            this[a].caracteristiques[c].prepareData(this[a].value);
          }
        } else {
          Object.defineProperty(this[a], 'value', {
              value: override,
          });

          for(let c in this[a].caracteristiques) {
            this[a].caracteristiques[c].prepareData(this[a].value);
          }
        }
      }
    }

    #prepareMax() {
      for(let a in this) {
        const override = Object.values(this[a].overrideMax).reduce((max, curr) => Math.max(max, Number(curr) || 0), 0);

        if(!override) {
          const divide = Object.values(this[a].divideMax).reduce((max, curr) => Math.max(max, Number(curr) || 0), 0);
          const bonus = Object.values(this[a].bonusMax).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
          const malus = Object.values(this[a].malusMax).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
          const base = divide > 0 ? Math.floor(this[a].max / divide) : this[a].max;
          const mod = bonus - malus;
          const max = Math.max(base + mod, 0);

          Object.defineProperty(this[a], 'max', {
              value: max,
          });
        } else {
          Object.defineProperty(this[a], 'max', {
              value: override,
          });
        }
      }
    }
}