export class VehiculeDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const {SchemaField, EmbeddedDataField, StringField, NumberField, BooleanField, ObjectField, ArrayField, HTMLField} = foundry.data.fields;

    return {
        version:new NumberField({initial:0, nullable:false, integer:true}),
        description:new HTMLField({initial:""}),
        descriptionLimitee:new HTMLField({initial:""}),
        manoeuvrabilite:new NumberField({ initial: 0, integer: true, nullable: false }),
        vitesse:new NumberField({ initial: 0, integer: true, nullable: false }),
        passagers:new NumberField({ initial: 0, integer: true, nullable: false }),
        limited:new SchemaField({
          showDescriptionFull:new BooleanField({initial:false}),
          showDescriptionLimited:new BooleanField({initial:false}),
        }),
        champDeForce: new SchemaField({
            value:new NumberField({ initial: 0, integer: true, nullable: false }),
            base:new NumberField({ initial: 0, integer: true, nullable: false }),
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
        }),
        energie:new SchemaField({
            base:new NumberField({initial:0, nullable:false, integer:true}),
            value:new NumberField({initial:0, nullable:false, integer:true}),
            max:new NumberField({initial:0, nullable:false, integer:true}),
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
        }),
        armure:new SchemaField({
            base:new NumberField({initial:0, nullable:false, integer:true}),
            value:new NumberField({initial:0, nullable:false, integer:true}),
            max:new NumberField({initial:16, nullable:false, integer:true}),
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
        }),
        initiative:new SchemaField({
            dice:new NumberField({initial:0, nullable:false, integer:true}),
            value:new NumberField({initial:0, nullable:false, integer:true}),
            embuscade:new SchemaField({
                dice:new NumberField({initial:0, nullable:false, integer:true}),
                value:new NumberField({initial:0, nullable:false, integer:true}),
            }),
        }),
        reaction:new SchemaField({
            value:new NumberField({initial:0, nullable:false, integer:true}),
            mod:new NumberField({initial:0, nullable:false, integer:true}),
        }),
        defense:new SchemaField({
            value:new NumberField({initial:0, nullable:false, integer:true}),
            mod:new NumberField({initial:0, nullable:false, integer:true}),
        }),
        equipage:new SchemaField({
            value:new NumberField({initial:0, nullable:false, integer:true}),
            max:new NumberField({initial:0, nullable:false, integer:true}),
            pilote:new SchemaField({
                name:new StringField({ initial: "" }),
                id:new StringField({ initial: "" }),
            }),
            passagers:new ArrayField(new ObjectField()),
        }),
        otherMods:new ObjectField(),
    }
  }

  get pilote() {
    if(!this.equipage.pilote.id) return undefined;
    if(!game.actors.get(this.equipage.pilote.id)) return undefined;

    return game.actors.get(this.equipage.pilote.id);
  }
  static migrateData(source) {
      if(source.version < 1) {
          const mods = ['armure', 'energie', 'champDeForce'];

          for(let m of mods) {
            if(!source[m]) continue;

              for(let b in source[m].bonus) {
                  source[m].bonus[b] = 0;
              }

              for(let b in source[m].malus) {
                  source[m].malus[b] = 0;
              }
          }

          source.version = 1;
      }

      return super.migrateData(source);
  }

  prepareBaseData() {
	}

	prepareDerivedData() {
    this.#setPilote();
    this.#setDefenses();
    this.#setDerived();
  }

  #setPilote() {
    const pilote = this.pilote;

    if(!pilote) return;

    if(!pilote) {
      Object.defineProperty(this.equipage.pilote, 'id', {
        value: '',
      });

      Object.defineProperty(this.equipage.pilote, 'name', {
        value: '',
      });
    } else {
      const defenseBonus = pilote.system.defense?.bonus?.user ?? 0;
      const defenseMalus = pilote.system.defense?.malus?.user ?? 0;
      const reactionBonus = pilote.system.reaction?.bonus?.user ?? 0;
      const reactionMalus = pilote.system.reaction?.malus?.user ?? 0;
      const manoeuvrabilite = this.manoeuvrabilite;

      Object.defineProperty(this.defense, 'mod', {
        value: defenseBonus-defenseMalus,
      });

      Object.defineProperty(this.reaction, 'mod', {
        value: reactionBonus-reactionMalus+manoeuvrabilite,
      });
    }
  }

  #setDefenses() {
    const pilote = this.pilote;

    if(!pilote) return;

    Object.defineProperty(this.reaction, 'value', {
      value: Math.max(pilote.system.reaction.value+this.reaction.mod),
    });

    Object.defineProperty(this.defense, 'value', {
      value: Math.max(pilote.system.defense.value+this.defense.mod),
    });

    Object.defineProperty(this.initiative, 'complet', {
      value: `${pilote.system.initiative.dice}D6+${pilote.system.initiative.value}`,
    });
  }

  #setDerived() {
    const list = CONFIG.KNIGHT.LIST.vehicules;

    for(let d of list) {
      const system = this[d];
      const base = system.base;
      const bonus = system.bonus?.user ?? 0;
      const malus = system.malus?.user ?? 0;
      const update = CONFIG.KNIGHT.LIST.hasMax[d] ? 'max' : 'value';

      Object.defineProperty(system, update, {
        value: Math.max(base+bonus-malus, 0),
      });
    }
  }
}