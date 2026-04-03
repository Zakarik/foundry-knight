const {SchemaField, ArrayField, NumberField, StringField, HTMLField, BooleanField} = foundry.data.fields;

//PREPARATION DES BLOCK DE CHAMPS
class AtkCaracField extends SchemaField {
    constructor() {
        super({
            fixe: new StringField({initial:""}),
            jet: new StringField({initial:""}),
            labelFixe: new StringField({initial:""}),
            labelJet: new StringField({initial:""}),
            odInclusFixe: new BooleanField({initial:false}),
            odInclusJet: new BooleanField({initial:false}),
        });
    }
}

class ConditionalField  extends SchemaField {
    constructor() {
        super({
            condition: new StringField({initial:""}),
            has: new BooleanField({initial:false}),
        });
    }
}

class VariableDVField extends SchemaField {
    constructor() {
        super({
            has: new BooleanField({initial: false}),
            min: new SchemaField({
                dice: new NumberField({initial: 0}),
                fixe: new NumberField({initial: 0}),
            }),
            max: new SchemaField({
                dice: new NumberField({initial: 0}),
                fixe: new NumberField({initial: 0}),
            }),
            cout: new NumberField({initial: 0}),
        })
    }
}

class ListeEffectsField extends SchemaField {
    constructor() {
        super({
            activable:new BooleanField({initial:false}),
            active:new BooleanField({initial:false}),
            cost:new NumberField({initial:0, min:0}),
            custom:new BooleanField({initial:false}),
            id:new NumberField({initial:0}),
            complet:new StringField({initial:""}),
            description:new HTMLField({initial:""}),
            index:new NumberField({initial:0}),
            name:new StringField({initial:""}),
            raw:new StringField({initial:""}),
            chargeur:new NumberField({initial:0}),
            chargeurMax:new NumberField({initial:0}),
            isChargeur:new BooleanField({initial:false}),
            toComplete:new StringField({initial:""}),
        });
    }
}

class CustomEffectsField extends SchemaField {
    constructor() {
        super({
            attaque:new SchemaField({
                aspect:new AtkCaracField(),
                carac:new AtkCaracField(),
                conditionnel:new ConditionalField(),
                jet:new NumberField({initial:0}),
                reussite:new NumberField({initial:0}),
            }),
            degats:new SchemaField({
                aspect:new AtkCaracField(),
                carac:new AtkCaracField(),
                conditionnel:new ConditionalField(),
                jet:new NumberField({initial:0}),
                fixe:new NumberField({initial:0}),
            }),
            violence:new SchemaField({
                aspect:new AtkCaracField(),
                carac:new AtkCaracField(),
                conditionnel:new ConditionalField(),
                jet:new NumberField({initial:0}),
                fixe:new NumberField({initial:0}),
            }),
            other:new SchemaField({
                cdf:new NumberField({initial:0})
            }),
            description:new HTMLField({initial:""}),
            label:new StringField({initial:""}),
        });
    }
}

class ActivableEffectsField extends SchemaField {
    constructor() {
        super({
            key:new StringField({initial:""}),
            cost:new NumberField({initial:0}),
        });
    }
}

//EXPORT DES CHAMPS PRINCIPAUX
export class EffectsField extends SchemaField {
    constructor() {
        super({
            liste: new ArrayField(new ListeEffectsField()),
            raw: new ArrayField(new StringField()),
            custom: new ArrayField(new CustomEffectsField()),
            chargeur: new NumberField({nullable: true, initial: null}),
            activable: new ArrayField(new ActivableEffectsField()),
        });
    }
}

export class DgtsViolenceBaseField extends SchemaField {
    constructor() {
        super({
            dice: new NumberField({initial: 0}),
            fixe: new NumberField({initial: 0}),
        });
    }
}

export class DgtsViolenceField extends SchemaField {
    constructor() {
        super({
            dice: new NumberField({initial: 0}),
            fixe: new NumberField({initial: 0}),
            variable: new VariableDVField(),
        });
    }
}

export class OptionsMunitions extends SchemaField {
    constructor() {
        super({
            has: new BooleanField({initial: false}),
            actuel: new StringField({initial: '0'}),
            value: new NumberField({initial: 1}),
            liste: new ArrayField(new SchemaField({
                nom:new StringField({initial:""}),
                degats:new DgtsViolenceBaseField(),
                violence:new DgtsViolenceBaseField(),
                liste: new ArrayField(new ListeEffectsField()),
                raw: new ArrayField(new StringField()),
                custom: new ArrayField(new CustomEffectsField()),
                chargeur: new NumberField({nullable: true, initial: null}),
                activable: new ArrayField(new ActivableEffectsField()),
            })),
        });
    }
}