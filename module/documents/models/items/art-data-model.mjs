export class ArtDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const {HTMLField, NumberField, SchemaField, ArrayField, StringField, BooleanField, ObjectField} = foundry.data.fields;

        return {
            description:new HTMLField({initial:''}),
            aspects:new SchemaField({
                chair:new ArrayField(new StringField(), {initial:["deplacement", "force", "endurance"]}),
                bete:new ArrayField(new StringField(), {initial:["hargne", "combat", "instinct"]}),
                machine:new ArrayField(new StringField(), {initial:["tir", "savoir", "technique"]}),
                dame:new ArrayField(new StringField(), {initial:["aura", "parole", "sangFroid"]}),
                masque:new ArrayField(new StringField(), {initial:["discretion", "dexterite", "perception"]}),
            }),
            jet:new SchemaField({
                c1:new StringField({initial:'chair'}),
                c2:new StringField({initial:'chair'}),
            }),
            pratique:new SchemaField({
                has:new BooleanField({initial:false}),
                base:new StringField({initial:''}),
                apprenti:new StringField({initial:''}),
                initie:new StringField({initial:''}),
                maitre:new StringField({initial:''}),
            }),
            oeuvre:new SchemaField({
                has:new BooleanField({initial:false}),
                base:new StringField({initial:''}),
                temps:new SchemaField({
                    court:new StringField({initial:''}),
                    moyen:new StringField({initial:''}),
                    long:new StringField({initial:''}),
                }),
                liste:new ObjectField(),
                textarea:new SchemaField({
                    base:new NumberField({initial:50, nullable:false, integer:true}),
                    apprenti:new NumberField({initial:50, nullable:false, integer:true}),
                    initie:new NumberField({initial:50, nullable:false, integer:true}),
                    maitre:new NumberField({initial:50, nullable:false, integer:true}),
                    oeuvrebase:new NumberField({initial:50, nullable:false, integer:true}),
                })
            }),
        }
    }

    prepareBaseData() {

	}

	prepareDerivedData() {

    }
}