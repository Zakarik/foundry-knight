export class CapaciteUltimeDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const {StringField, HTMLField, SchemaField, BooleanField, NumberField, ArrayField, ObjectField} = foundry.data.fields;

        return {
            active:new BooleanField({initial:false}),
            description:new HTMLField({initial:''}),
            type:new StringField({initial:'passive'}),
            condition:new StringField({initial:''}),
            actives:new SchemaField({
                activation:new StringField({initial:''}),
                duree:new StringField({initial:''}),
                instant:new BooleanField({initial:true}),
                energie:new NumberField({initial:0, nullable:false, integer:true}),
                heroisme:new NumberField({initial:0, nullable:false, integer:true}),
                reaction:new NumberField({initial:0, nullable:false, integer:true}),
                defense:new NumberField({initial:0, nullable:false, integer:true}),
                recuperation:new SchemaField({
                  PA:new BooleanField({initial:false}),
                  PS:new BooleanField({initial:false}),
                  PE:new BooleanField({initial:false}),
                }),
                jet:new SchemaField({
                  actif:new BooleanField({initial:false}),
                  isfixe:new BooleanField({initial:false}),
                  fixe:new SchemaField({
                    label:new StringField({initial:''}),
                    dice:new NumberField({initial:0, nullable:false, integer:true}),
                    fixe:new NumberField({initial:0, nullable:false, integer:true}),
                  }),
                  variable:new SchemaField({
                    caracteristiques:new ArrayField(new StringField()),
                  }),
                }),
                degats:new SchemaField({
                  actif:new BooleanField({initial:false}),
                  isfixe:new BooleanField({initial:true}),
                  fixe:new SchemaField({
                    dice:new NumberField({initial:0, nullable:false, integer:true}),
                    fixe:new NumberField({initial:0, nullable:false, integer:true}),
                  }),
                  variable:new SchemaField({
                    energie:new NumberField({initial:0, nullable:false, integer:true}),
                    paliers:new ArrayField(new StringField()),
                  }),
                  effets:new SchemaField({
                    raw:new ArrayField(new StringField()),
                    custom:new ArrayField(new ObjectField()),
                    liste:new ArrayField(new StringField()),
                  }),
                }),
                violence:new SchemaField({
                    actif:new BooleanField({initial:false}),
                    isfixe:new BooleanField({initial:true}),
                  fixe:new SchemaField({
                    dice:new NumberField({initial:0, nullable:false, integer:true}),
                    fixe:new NumberField({initial:0, nullable:false, integer:true}),
                  }),
                  variable:new SchemaField({
                    energie:new NumberField({initial:0, nullable:false, integer:true}),
                    paliers:new ArrayField(new StringField()),
                  }),
                  effets:new SchemaField({
                    raw:new ArrayField(new StringField()),
                    custom:new ArrayField(new ObjectField()),
                    liste:new ArrayField(new StringField()),
                  }),
                }),
                effets:new SchemaField({
                  actif:new BooleanField({initial:false}),
                  raw:new ArrayField(new StringField()),
                  custom:new ArrayField(new ObjectField()),
                  liste:new ArrayField(new StringField()),
                }),
                textarea:new SchemaField({
                  activation:new NumberField({initial:20, nullable:false, integer:true}),
                  duree:new NumberField({initial:20, nullable:false, integer:true}),
                }),
            }),
            passives:new SchemaField({
                sante:new BooleanField({initial:false}),
                contact:new SchemaField({
                    actif:new BooleanField({initial:false}),
                    value:new NumberField({initial:0, nullable:false, integer:true}),
                }),
                capacites:new SchemaField({
                    actif:new BooleanField({initial:false}),
                    ascension:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            permanent:new BooleanField({initial:false}),
                            prestige:new BooleanField({initial:false}),
                        }),
                    }),
                    cea:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            vague:new SchemaField({
                                degats:new SchemaField({
                                    dice:new NumberField({initial:5, nullable:false, integer:true}),
                                    fixe:new NumberField({initial:0, nullable:false, integer:true}),
                                }),
                                violence:new SchemaField({
                                    dice:new NumberField({initial:5, nullable:false, integer:true}),
                                    fixe:new NumberField({initial:0, nullable:false, integer:true}),
                                }),
                                effets:new SchemaField({
                                    liste:new ArrayField(new StringField()),
                                    raw:new ArrayField(new StringField(), {initial:['parasitage 6']}),
                                    custom:new ArrayField(new ObjectField()),
                                }),
                            }),
                            salve:new SchemaField({
                                degats:new SchemaField({
                                    dice:new NumberField({initial:5, nullable:false, integer:true}),
                                    fixe:new NumberField({initial:0, nullable:false, integer:true}),
                                }),
                                violence:new SchemaField({
                                    dice:new NumberField({initial:5, nullable:false, integer:true}),
                                    fixe:new NumberField({initial:0, nullable:false, integer:true}),
                                }),
                                effets:new SchemaField({
                                    liste:new ArrayField(new StringField()),
                                    raw:new ArrayField(new StringField(), {initial:['dispersion 12']}),
                                    custom:new ArrayField(new ObjectField()),
                                }),
                            }),
                            rayon:new SchemaField({
                                degats:new SchemaField({
                                    dice:new NumberField({initial:5, nullable:false, integer:true}),
                                    fixe:new NumberField({initial:0, nullable:false, integer:true}),
                                }),
                                violence:new SchemaField({
                                    dice:new NumberField({initial:5, nullable:false, integer:true}),
                                    fixe:new NumberField({initial:0, nullable:false, integer:true}),
                                }),
                                effets:new SchemaField({
                                    liste:new ArrayField(new StringField()),
                                    raw:new ArrayField(new StringField(), {initial:['ignorechampdeforce']}),
                                    custom:new ArrayField(new ObjectField()),
                                }),
                            }),
                        }),
                    }),
                    changeling:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            duree:new StringField({initial:''}),
                            energie:new SchemaField({
                                personnel:new NumberField({initial:0, nullable:false, integer:true}),
                            }),
                            odbonus:new NumberField({initial:1, nullable:false, integer:true}),
                            caracteristique:new NumberField({initial:2, nullable:false, integer:true}),
                            textarea:new NumberField({initial:20, nullable:false, integer:true}),
                        }),
                    }),
                    companions:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            deployables:new NumberField({initial:3, nullable:false, integer:true}),
                        })
                    }),
                    ghost:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            desactivation:new BooleanField({initial:false}),
                        }),
                    }),
                    goliath:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            taille:new SchemaField({
                                max:new NumberField({initial:10, nullable:false, integer:true}),
                            }),
                            malus:new SchemaField({
                                reaction:new SchemaField({
                                    value:new NumberField({initial:0, nullable:false, integer:true}),
                                }),
                                defense:new SchemaField({
                                    value:new NumberField({initial:0, nullable:false, integer:true}),
                                }),
                            }),
                        }),
                    }),
                    mechanic:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            bonus:new NumberField({initial:2, nullable:false, integer:true}),
                        }),
                    }),
                    morph:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            vol:new SchemaField({
                                description:new StringField({initial:''}),
                                textarea:new NumberField({initial:20, nullable:false, integer:true}),
                            }),
                            etirement:new SchemaField({
                                portee:new StringField({initial:''}),
                                textarea:new NumberField({initial:20, nullable:false, integer:true}),
                            }),
                            metal:new SchemaField({
                                bonus:new SchemaField({
                                    champDeForce:new NumberField({initial:8, nullable:false, integer:true}),
                                }),
                            }),
                            fluide:new SchemaField({
                                bonus:new SchemaField({
                                    reaction:new NumberField({initial:5, nullable:false, integer:true}),
                                    defense:new NumberField({initial:5, nullable:false, integer:true}),
                                }),
                            }),
                            polymorphie:new SchemaField({
                                description:new StringField({initial:''}),
                                griffe:new SchemaField({
                                    degats:new SchemaField({
                                        dice:new NumberField({initial:2, nullable:false, integer:true}),
                                        fixe:new NumberField({initial:0, nullable:false, integer:true}),
                                    }),
                                    violence:new SchemaField({
                                        dice:new NumberField({initial:1, nullable:false, integer:true}),
                                        fixe:new NumberField({initial:0, nullable:false, integer:true}),
                                    }),
                                    effets:new SchemaField({
                                        liste:new ArrayField(new StringField()),
                                        raw:new ArrayField(new StringField()),
                                        custom:new ArrayField(new ObjectField()),
                                    }),
                                }),
                                lame:new SchemaField({
                                    degats:new SchemaField({
                                        dice:new NumberField({initial:2, nullable:false, integer:true}),
                                        fixe:new NumberField({initial:0, nullable:false, integer:true}),
                                    }),
                                    violence:new SchemaField({
                                        dice:new NumberField({initial:1, nullable:false, integer:true}),
                                        fixe:new NumberField({initial:0, nullable:false, integer:true}),
                                    }),
                                    effets:new SchemaField({
                                        liste:new ArrayField(new StringField()),
                                        raw:new ArrayField(new StringField()),
                                        custom:new ArrayField(new ObjectField()),
                                    }),
                                }),
                                canon:new SchemaField({
                                    degats:new SchemaField({
                                        dice:new NumberField({initial:3, nullable:false, integer:true}),
                                        fixe:new NumberField({initial:3, nullable:false, integer:true}),
                                    }),
                                    violence:new SchemaField({
                                        dice:new NumberField({initial:3, nullable:false, integer:true}),
                                        fixe:new NumberField({initial:3, nullable:false, integer:true}),
                                    }),
                                    effets:new SchemaField({
                                        liste:new ArrayField(new StringField()),
                                        raw:new ArrayField(new StringField()),
                                        custom:new ArrayField(new ObjectField()),
                                    }),
                                }),
                                textarea:new NumberField({initial:20, nullable:false, integer:true}),
                            }),
                        }),
                    }),
                    oriflamme:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            activation:new StringField({initial:'deplacement'}),
                            duree:new StringField({initial:''}),
                            portee:new StringField({initial:'longue'}),
                            energie:new NumberField({initial:6, nullable:false, integer:true}),
                            degats:new SchemaField({
                                dice:new NumberField({initial:8, nullable:false, integer:true}),
                                fixe:new NumberField({initial:12, nullable:false, integer:true}),
                            }),
                            violence:new SchemaField({
                                dice:new NumberField({initial:12, nullable:false, integer:true}),
                                fixe:new NumberField({initial:12, nullable:false, integer:true}),
                            }),
                            effets:new SchemaField({
                                liste:new ArrayField(new StringField()),
                                raw:new ArrayField(new StringField(), {initial:['antianatheme', 'lumiere 4']}),
                                custom:new ArrayField(new ObjectField()),
                            }),
                        })
                    }),
                    rage:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            colere:new SchemaField({
                                defense:new NumberField({initial:0, nullable:false, integer:true}),
                                reaction:new NumberField({initial:0, nullable:false, integer:true}),
                                subis:new NumberField({initial:0, nullable:false, integer:true}),
                                combosInterdits:new SchemaField({
                                    has:new BooleanField({initial:false}),
                                }),
                            }),
                            rage:new SchemaField({
                                defense:new NumberField({initial:0, nullable:false, integer:true}),
                                reaction:new NumberField({initial:0, nullable:false, integer:true}),
                                subis:new NumberField({initial:0, nullable:false, integer:true}),
                                combosInterdits:new SchemaField({
                                    has:new BooleanField({initial:false}),
                                }),
                            }),
                            fureur:new SchemaField({
                                defense:new NumberField({initial:0, nullable:false, integer:true}),
                                reaction:new NumberField({initial:0, nullable:false, integer:true}),
                                subis:new NumberField({initial:0, nullable:false, integer:true}),
                                combosInterdits:new SchemaField({
                                    has:new BooleanField({initial:false}),
                                }),
                            })
                        })
                    }),
                    type:new SchemaField({
                        actif:new BooleanField({initial:false}),
                    }),
                    vision:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            duree:new StringField({initial:''}),
                            energie:new SchemaField({
                                changer:new NumberField({initial:0, nullable:false, integer:true}),
                            }),
                            textarea:new NumberField({initial:20, nullable:false, integer:true}),
                        }),
                    }),
                    warlord:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            activer:new BooleanField({initial:false}),
                            prolonger:new BooleanField({initial:false}),
                        }),
                    }),
                }),
                special:new SchemaField({
                    recolteflux:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            conflit:new SchemaField({
                                base:new NumberField({initial:10, nullable:false, integer:true}),
                                tour:new NumberField({initial:5, nullable:false, integer:true}),
                            }),
                            horsconflit:new SchemaField({
                                base:new NumberField({initial:10, nullable:false, integer:true}),
                            }),
                        })
                    }),
                    contrecoups:new SchemaField({
                        actif:new BooleanField({initial:true}),
                    }),
                }),
            }),
        }
    }

    prepareBaseData() {

	}

	prepareDerivedData() {

    }
}