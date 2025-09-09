export class ArmureLegendeDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const {HTMLField, SchemaField, StringField, NumberField, BooleanField, ArrayField, ObjectField} = foundry.data.fields;

        return {
            capacites: new SchemaField({
              actuel: new StringField({initial: "personnalise"}),
              all: new SchemaField({
                type: new SchemaField({
                  label: new StringField(),
                  description: new StringField(),
                  activation: new StringField({initial: "deplacement"}),
                  duree: new StringField(),
                  nbreType: new NumberField({initial: 1}),
                  energie: new SchemaField({
                    tour: new NumberField({initial: 2}),
                    scene: new NumberField({initial: 12})
                  }),
                  type: new SchemaField({
                    soldier: new SchemaField({
                      aspect: new StringField({initial: "chair"}),
                      liste: new SchemaField({
                        deplacement: new SchemaField({
                          value: new NumberField({initial: 1})
                        }),
                        force: new SchemaField({
                          value: new NumberField({initial: 1})
                        }),
                        endurance: new SchemaField({
                          value: new NumberField({initial: 1})
                        })
                      })
                    }),
                    hunter: new SchemaField({
                      aspect: new StringField({initial: "bete"}),
                      liste: new SchemaField({
                        hargne: new SchemaField({
                          value: new NumberField({initial: 1})
                        }),
                        combat: new SchemaField({
                          value: new NumberField({initial: 1})
                        }),
                        instinct: new SchemaField({
                          value: new NumberField({initial: 1})
                        })
                      })
                    }),
                    scholar: new SchemaField({
                      aspect: new StringField({initial: "machine"}),
                      liste: new SchemaField({
                        tir: new SchemaField({
                          value: new NumberField({initial: 1})
                        }),
                        savoir: new SchemaField({
                          value: new NumberField({initial: 1})
                        }),
                        technique: new SchemaField({
                          value: new NumberField({initial: 1})
                        })
                      })
                    }),
                    herald: new SchemaField({
                      aspect: new StringField({initial: "dame"}),
                      liste: new SchemaField({
                        aura: new SchemaField({
                          value: new NumberField({initial: 1})
                        }),
                        parole: new SchemaField({
                          value: new NumberField({initial: 1})
                        }),
                        sangFroid: new SchemaField({
                          value: new NumberField({initial: 1})
                        })
                      })
                    }),
                    scout: new SchemaField({
                      aspect: new StringField({initial: "masque"}),
                      liste: new SchemaField({
                        discretion: new SchemaField({
                          value: new NumberField({initial: 1})
                        }),
                        dexterite: new SchemaField({
                          value: new NumberField({initial: 1})
                        }),
                        perception: new SchemaField({
                          value: new NumberField({initial: 1})
                        })
                      })
                    })
                  }),
                  textarea: new SchemaField({
                    duree: new NumberField({initial: 50})
                  })
                }),
                shrine: new SchemaField({
                  label: new StringField(),
                  description: new StringField(),
                  activation: new StringField({initial: "aucune"}),
                  duree: new StringField(),
                  portee: new StringField(),
                  energie: new SchemaField({
                    personnel: new NumberField({initial: 2}),
                    distance: new NumberField({initial: 4})
                  }),
                  champdeforce: new NumberField({initial: 6}),
                  requis: new SchemaField({
                    force: new NumberField({initial: 5}),
                    chair: new NumberField({initial: 10})
                  }),
                  textarea: new SchemaField({
                    duree: new StringField({initial: "50"}),
                    portee: new StringField({initial: "50"})
                  })
                }),
                nanoc: new SchemaField({
                  label: new StringField(),
                  description: new StringField(),
                  activation: new StringField({initial: "deplacementcombat"}),
                  duree: new StringField(),
                  energie: new SchemaField({
                    base: new NumberField({initial: 4}),
                    detaille: new NumberField({initial: 8})
                  }),
                  textarea: new SchemaField({
                    duree: new NumberField({initial: 50})
                  })
                }),
                mechanic: new SchemaField({
                  label: new StringField(),
                  description: new StringField(),
                  activation: new SchemaField({
                    contact: new StringField({initial: "deplacement"}),
                    distance: new StringField({initial: "deplacement"})
                  }),
                  portee: new StringField(),
                  reparation: new SchemaField({
                    contact: new SchemaField({
                      duree: new StringField(),
                      dice: new NumberField({initial: 4}),
                      fixe: new NumberField({initial: 6})
                    }),
                    distance: new SchemaField({
                      duree: new StringField(),
                      dice: new NumberField({initial: 3}),
                      fixe: new NumberField({initial: 6})
                    })
                  }),
                  energie: new SchemaField({
                    contact: new NumberField({initial: 6}),
                    distance: new NumberField({initial: 8})
                  }),
                  textarea: new SchemaField({
                    dureeContact: new NumberField({initial: 50}),
                    dureeDistance: new NumberField({initial: 50})
                  })
                }),
                warlord: new SchemaField({
                  label: new StringField(),
                  description: new StringField(),
                  base: new SchemaField({
                    action: new SchemaField({
                      activation: new StringField({initial: "deplacement"}),
                      duree: new StringField(),
                      bonus: new SchemaField({
                        description: new StringField()
                      }),
                      energie: new SchemaField({
                        allie: new NumberField({initial: 4}),
                        porteur: new NumberField({initial: 10})
                      })
                    })
                  }),
                  impulsions: new SchemaField({
                    selection: new NumberField({initial: 1}),
                    esquive: new SchemaField({
                      activation: new StringField({initial: "deplacement"}),
                      duree: new StringField(),
                      bonus: new SchemaField({
                        reaction: new NumberField({initial: 2}),
                        defense: new NumberField({initial: 2})
                      }),
                      energie: new SchemaField({
                        allie: new NumberField({initial: 3}),
                        porteur: new NumberField({initial: 2}),
                        prolonger: new NumberField({initial: 2})
                      })
                    }),
                    force: new SchemaField({
                      activation: new StringField({initial: "deplacement"}),
                      duree: new StringField(),
                      bonus: new SchemaField({
                        champDeForce: new NumberField({initial: 2})
                      }),
                      energie: new SchemaField({
                        allie: new NumberField({initial: 2}),
                        porteur: new NumberField({initial: 1}),
                        prolonger: new NumberField({initial: 1})
                      })
                    }),
                    guerre: new SchemaField({
                      activation: new StringField({initial: "deplacement"}),
                      duree: new StringField(),
                      bonus: new SchemaField({
                        degats: new NumberField({initial: 1}),
                        violence: new NumberField({initial: 1})
                      }),
                      energie: new SchemaField({
                        allie: new NumberField({initial: 1}),
                        porteur: new NumberField({initial: 1}),
                        prolonger: new NumberField({initial: 1})
                      })
                    }),
                    energie: new SchemaField({
                      activation: new StringField({initial: "deplacement"}),
                      duree: new StringField(),
                      bonus: new SchemaField({
                        description: new StringField()
                      }),
                      energie: new SchemaField({
                        min: new NumberField({initial: 1}),
                        max: new NumberField({initial: 5})
                      })
                    })
                  }),
                  textarea: new SchemaField({
                    dureeAction: new NumberField({initial: 50}),
                    dureeForce: new NumberField({initial: 50}),
                    dureeEnergie: new NumberField({initial: 50}),
                    dureeEsquive: new NumberField({initial: 50}),
                    dureeGuerre: new NumberField({initial: 50}),
                    bonusAction: new NumberField({initial: 85}),
                    bonusEnergie: new NumberField({initial: 110})
                  })
                }),
                falcon: new SchemaField({
                  label: new StringField(),
                  description: new StringField(),
                  energie: new NumberField({initial: 3}),
                  activation: new StringField({initial: "deplacement"}),
                  duree: new StringField(),
                  informations: new StringField(),
                  textarea: new SchemaField({
                    duree: new NumberField({initial: 50})
                  })
                }),
                ghost: new SchemaField({
                  label: new StringField(),
                  description: new StringField(),
                  interruption: new SchemaField({
                    actif: new BooleanField({initial: true}),
                    label: new StringField()
                  }),
                  activation: new StringField({initial: "aucune"}),
                  duree: new StringField(),
                  energie: new SchemaField({
                    tour: new NumberField({initial: 4}),
                    minute: new NumberField({initial: 10})
                  }),
                  bonus: new SchemaField({
                    aspects: new SchemaField({}),
                    reussites: new NumberField({initial: 3}),
                    attaque: new StringField({initial: "discretion"}),
                    degats: new SchemaField({
                      caracteristique: new StringField({initial: "discretion"}),
                      inclus: new SchemaField({
                        od: new StringField(),
                        dice: new StringField(),
                        fixe: new StringField()
                      }),
                      od: new BooleanField({initial: true}),
                      dice: new BooleanField({initial: false}),
                      fixe: new BooleanField({initial: true})
                    })
                  }),
                  textarea: new SchemaField({
                    duree: new NumberField({initial: 50})
                  })
                }),
                vision: new SchemaField({
                  label: new StringField(),
                  description: new StringField(),
                  activation: new StringField({initial: "deplacement6Sec"}),
                  duree: new StringField(),
                  energie: new SchemaField({
                    min: new NumberField({initial: 5}),
                    max: new NumberField({initial: 15})
                  }),
                  textarea: new SchemaField({
                    duree: new NumberField({initial: 50})
                  })
                }),
                changeling: new SchemaField({
                  label: new StringField(),
                  description: new StringField(),
                  activation: new StringField({initial: "tour6Sec"}),
                  duree: new StringField(),
                  portee: new StringField(),
                  energie: new SchemaField({
                    personnel: new NumberField({initial: 8}),
                    etendue: new NumberField({initial: 10}),
                    fauxEtre: new SchemaField({
                      value: new NumberField({initial: 4}),
                      max: new NumberField({initial: 4})
                    })
                  }),
                  textarea: new SchemaField({
                    duree: new NumberField({initial: 50}),
                    portee: new NumberField({initial: 50})
                  })
                }),
                oriflamme: new SchemaField({
                  label: new StringField(),
                  description: new StringField(),
                  activation: new StringField({initial: "deplacement"}),
                  duree: new StringField(),
                  portee: new StringField({initial: "moyenne"}),
                  energie: new NumberField({initial: 9}),
                  degats: new SchemaField({
                    dice: new NumberField({initial: 6}),
                    fixe: new NumberField({initial: 6})
                  }),
                  violence: new SchemaField({
                    dice: new NumberField({initial: 6}),
                    fixe: new NumberField({initial: 12})
                  }),
                  effets: new SchemaField({
                    liste: new ArrayField(new StringField()),
                    raw: new ArrayField(new StringField(), {initial: ["antianatheme", "lumiere 2"]}),
                    custom: new ArrayField(new ObjectField())
                  }),
                  textarea: new SchemaField({
                    duree: new NumberField({initial: 50})
                  })
                }),
                goliath: new SchemaField({
                  label: new StringField(),
                  description: new StringField(),
                  energie: new NumberField({initial: 4}),
                  activation: new StringField({initial: "deplacement"}),
                  duree: new StringField(),
                  taille: new SchemaField({
                    value: new NumberField({initial: 0}),
                    max: new NumberField({initial: 4})
                  }),
                  armesRack: new SchemaField({
                    label: new StringField(),
                    active: new BooleanField({initial: true}),
                    value: new NumberField({initial: 4})
                  }),
                  bonus: new SchemaField({
                    cdf: new SchemaField({
                      value: new NumberField({initial: 1})
                    }),
                    force: new SchemaField({
                      value: new NumberField({initial: 1})
                    }),
                    endurance: new SchemaField({
                      value: new NumberField({initial: 1})
                    }),
                    degats: new SchemaField({
                      dice: new NumberField({initial: 1})
                    }),
                    violence: new SchemaField({
                      dice: new NumberField({initial: 1})
                    })
                  }),
                  malus: new SchemaField({
                    reaction: new SchemaField({
                      value: new NumberField({initial: 2})
                    }),
                    defense: new SchemaField({
                      value: new NumberField({initial: 1})
                    })
                  }),
                  textarea: new SchemaField({
                    duree: new NumberField({initial: 50})
                  })
                }),
                puppet: new SchemaField({
                  label: new StringField(),
                  description: new StringField(),
                  special: new StringField({initial: "recolteflux"}),
                  duree: new StringField(),
                  activation: new StringField({initial: "deplacement"}),
                  creatures: new NumberField({initial: 3}),
                  energie: new SchemaField({
                    ordre: new NumberField({initial: 2}),
                    supplementaire: new NumberField({initial: 3}),
                    prolonger: new NumberField({initial: 1})
                  }),
                  flux: new SchemaField({
                    has: new BooleanField({initial: true}),
                    ordre: new NumberField({initial: 1}),
                    supplementaire: new NumberField({initial: 1}),
                    prolonger: new NumberField({initial: 1})
                  }),
                  textarea: new SchemaField({
                    duree: new NumberField({initial: 50})
                  })
                }),
                discord: new SchemaField({
                  label: new StringField(),
                  description: new StringField(),
                  special: new StringField({initial: "recolteflux"}),
                  malus: new SchemaField({
                    reaction: new NumberField({initial: 3}),
                    defense: new NumberField({initial: 3}),
                    actions: new NumberField({initial: 3})
                  }),
                  tour: new SchemaField({
                    flux: new NumberField({initial: 1}),
                    energie: new NumberField({initial: 2}),
                    activation: new StringField({initial: "deplacement"}),
                    duree: new StringField()
                  }),
                  scene: new SchemaField({
                    flux: new NumberField({initial: 3}),
                    energie: new NumberField({initial: 6}),
                    activation: new StringField({initial: "deplacement"}),
                    duree: new StringField()
                  }),
                  textarea: new SchemaField({
                    dureeTour: new NumberField({initial: 50}),
                    dureeScene: new NumberField({initial: 50})
                  })
                }),
                windtalker: new SchemaField({
                  label: new StringField(),
                  description: new StringField(),
                  special: new StringField({initial: "recolteflux"}),
                  flux: new NumberField({initial: 2}),
                  energie: new NumberField({initial: 4}),
                  activation: new StringField({initial: "deplacement"}),
                  duree: new StringField(),
                  textarea: new SchemaField({
                    duree: new NumberField({initial: 50})
                  })
                }),
                companions: new SchemaField({
                  label: new StringField(),
                  description: new StringField(),
                  activation: new StringField({initial: "tour6Sec"}),
                  duree: new StringField(),
                  nbreChoix: new NumberField({initial: 1}),
                  energie: new SchemaField({
                    base: new NumberField({initial: 16}),
                    prolonger: new NumberField({initial: 8})
                  }),
                  textarea: new SchemaField({
                    duree: new NumberField({initial: 50}),
                    labor: new NumberField({initial: 85}),
                    medic: new NumberField({initial: 85}),
                    tech: new NumberField({initial: 85}),
                    fighter: new NumberField({initial: 85}),
                    recon: new NumberField({initial: 85}),
                    crow: new NumberField({initial: 52})
                  }),
                  lion: new SchemaField({
                    img: new StringField({initial: "systems/knight/assets/lion.jpg"}),
                    PG: new NumberField({initial: 180}),
                    aspects: new SchemaField({
                      chair: new SchemaField({
                        value: new NumberField({initial: 7}),
                        ae: new NumberField({initial: 1})
                      }),
                      bete: new SchemaField({
                        value: new NumberField({initial: 6}),
                        ae: new NumberField({initial: 1})
                      }),
                      machine: new SchemaField({
                        value: new NumberField({initial: 7}),
                        ae: new NumberField({initial: 1})
                      }),
                      dame: new SchemaField({
                        value: new NumberField({initial: 4}),
                        ae: new NumberField({initial: 0})
                      }),
                      masque: new SchemaField({
                        value: new NumberField({initial: 4}),
                        ae: new NumberField({initial: 0})
                      })
                    }),
                    champDeForce: new SchemaField({
                      base: new NumberField({initial: 10}),
                      bonus: new ArrayField(new StringField()),
                      malus: new ArrayField(new StringField())
                    }),
                    defense: new SchemaField({
                      base: new NumberField({initial: 4}),
                      bonus: new ArrayField(new StringField()),
                      malus: new ArrayField(new StringField())
                    }),
                    reaction: new SchemaField({
                      base: new NumberField({initial: 4}),
                      bonus: new ArrayField(new StringField()),
                      malus: new ArrayField(new StringField())
                    }),
                    armure: new SchemaField({
                      base: new NumberField({initial: 60}),
                      bonus: new ArrayField(new StringField()),
                      malus: new ArrayField(new StringField())
                    }),
                    energie: new SchemaField({
                      base: new NumberField({initial: 0}),
                      bonus: new ArrayField(new StringField()),
                      malus: new ArrayField(new StringField())
                    }),
                    initiative: new SchemaField({
                      value: new NumberField({initial: 3}),
                      fixe: new NumberField({initial: 2})
                    }),
                    armes: new SchemaField({
                      contact: new SchemaField({
                        coups: new SchemaField({
                          label: new StringField(),
                          portee: new StringField({initial: "contact"}),
                          degats: new SchemaField({
                            dice: new NumberField({initial: 1}),
                            fixe: new NumberField({initial: 0})
                          }),
                          violence: new SchemaField({
                            dice: new NumberField({initial: 1}),
                            fixe: new NumberField({initial: 0})
                          }),
                          effets: new SchemaField({
                            liste: new ArrayField(new StringField()),
                            raw: new ArrayField(new StringField()),
                            custom: new ArrayField(new ObjectField())
                          })
                        })
                      }),
                      distance: new ArrayField(new StringField())
                    }),
                    slots: new SchemaField({
                      tete:new SchemaField({
                        value:new NumberField({initial:8}),
                      }),
                      torse:new SchemaField({
                        value:new NumberField({initial:10}),
                      }),
                      brasGauche:new SchemaField({
                        value:new NumberField({initial:8}),
                      }),
                      brasDroit:new SchemaField({
                        value:new NumberField({initial:8}),
                      }),
                      jambeGauche:new SchemaField({
                        value:new NumberField({initial:8}),
                      }),
                      jambeDroite:new SchemaField({
                        value:new NumberField({initial:8}),
                      })
                    })
                  }),
                  wolf: new SchemaField({
                    img: new StringField({initial: "systems/knight/assets/wolf.jpg"}),
                    aspects: new SchemaField({
                      chair: new SchemaField({
                        value: new NumberField({initial: 2}),
                        ae: new NumberField({initial: 0})
                      }),
                      bete: new SchemaField({
                        value: new NumberField({initial: 4}),
                        ae: new NumberField({initial: 0})
                      }),
                      machine: new SchemaField({
                        value: new NumberField({initial: 4}),
                        ae: new NumberField({initial: 0})
                      }),
                      dame: new SchemaField({
                        value: new NumberField({initial: 2}),
                        ae: new NumberField({initial: 0})
                      }),
                      masque: new SchemaField({
                        value: new NumberField({initial: 4}),
                        ae: new NumberField({initial: 0})
                      })
                    }),
                    champDeForce: new SchemaField({
                      base: new NumberField({initial: 4})
                    }),
                    defense: new SchemaField({
                      base: new NumberField({initial: 4})
                    }),
                    reaction: new SchemaField({
                      base: new NumberField({initial: 4})
                    }),
                    armure: new SchemaField({
                      base: new NumberField({initial: 20})
                    }),
                    energie: new SchemaField({
                      base: new NumberField({initial: 0})
                    }),
                    initiative: new SchemaField({
                      value: new NumberField({initial: 3}),
                      fixe: new NumberField({initial: 2})
                    }),
                    armes: new SchemaField({
                      contact: new SchemaField({
                        coups: new SchemaField({
                          label: new StringField(),
                          portee: new StringField({initial: "contact"}),
                          degats: new SchemaField({
                            dice: new NumberField({initial: 1}),
                            fixe: new NumberField({initial: 0})
                          }),
                          violence: new SchemaField({
                            dice: new NumberField({initial: 1}),
                            fixe: new NumberField({initial: 0})
                          }),
                          effets: new SchemaField({
                            liste: new ArrayField(new StringField()),
                            raw: new ArrayField(new StringField()),
                            custom: new ArrayField(new ObjectField())
                          })
                        })
                      })
                    }),
                    configurations: new SchemaField({
                      labor: new SchemaField({
                        niveau: new NumberField({initial: 1}),
                        description: new StringField(),
                        energie: new NumberField({initial: 1}),
                        bonus: new SchemaField({
                          roll: new NumberField({initial: 1})
                        })
                      }),
                      medic: new SchemaField({
                        niveau: new NumberField({initial: 1}),
                        description: new StringField(),
                        energie: new NumberField({initial: 1}),
                        bonus: new SchemaField({
                          roll: new NumberField({initial: 1}),
                          soins: new NumberField({initial: 2})
                        })
                      }),
                      tech: new SchemaField({
                        niveau: new NumberField({initial: 1}),
                        description: new StringField(),
                        energie: new NumberField({initial: 2}),
                        bonus: new SchemaField({
                          roll: new NumberField({initial: 1}),
                          reparation: new NumberField({initial: 3})
                        })
                      }),
                      fighter: new SchemaField({
                        niveau: new NumberField({initial: 1}),
                        description: new StringField(),
                        energie: new NumberField({initial: 2}),
                        degats: new NumberField({initial: 1}),
                        violence: new NumberField({initial: 1}),
                        bonus: new SchemaField({
                          roll: new NumberField({initial: 1}),
                          effets: new SchemaField({
                            raw: new ArrayField(new StringField(), {initial: ["barrage 1"]}),
                            liste: new ArrayField(new StringField()),
                            custom: new ArrayField(new ObjectField())
                          })
                        })
                      }),
                      recon: new SchemaField({
                        niveau: new NumberField({initial: 1}),
                        description: new StringField(),
                        energie: new NumberField({initial: 1}),
                        bonus: new SchemaField({
                          roll: new NumberField({initial: 1})
                        })
                      })
                    })
                  }),
                  crow: new SchemaField({
                    img: new StringField({initial: "systems/knight/assets/crow.jpg"}),
                    capacites: new StringField(),
                    aspects: new SchemaField({
                      chair: new SchemaField({
                        value: new NumberField({initial: 6})
                      }),
                      bete: new SchemaField({
                        value: new NumberField({initial: 4})
                      }),
                      machine: new SchemaField({
                        value: new NumberField({initial: 4})
                      }),
                      dame: new SchemaField({
                        value: new NumberField({initial: 0})
                      }),
                      masque: new SchemaField({
                        value: new NumberField({initial: 6})
                      })
                    }),
                    champDeForce: new SchemaField({
                      base: new NumberField({initial: 6})
                    }),
                    defense: new SchemaField({
                      base: new NumberField({initial: 2})
                    }),
                    reaction: new SchemaField({
                      base: new NumberField({initial: 2})
                    }),
                    cohesion: new SchemaField({
                      base: new NumberField({initial: 150})
                    }),
                    debordement: new SchemaField({
                      base: new NumberField({initial: 6})
                    }),
                    energie: new SchemaField({
                      base: new NumberField({initial: 0})
                    }),
                    initiative: new SchemaField({
                      value: new NumberField({initial: 0}),
                      fixe: new NumberField({initial: 1})
                    })
                  })
                }),
                rewind: new SchemaField({
                  label: new StringField(),
                  description: new StringField(),
                  duree: new StringField(),
                  activation: new StringField({initial: "aucune"}),
                  energie: new NumberField({initial: 18}),
                  textarea: new SchemaField({
                    duree: new NumberField({initial: 50})
                  })
                }),
                record: new SchemaField({
                  label: new StringField(),
                  description: new StringField(),
                  duree: new StringField(),
                  activation: new StringField({initial: "aucune"}),
                  energie: new NumberField({initial: 12}),
                  textarea: new SchemaField({
                    duree: new NumberField({initial: 50})
                  })
                }),
                totem: new SchemaField({
                  label: new StringField(),
                  description: new StringField(),
                  activation: new StringField({initial: "aucune"}),
                  duree: new StringField(),
                  portee: new StringField({initial: "courte"}),
                  nombre: new NumberField({initial: 2}),
                  impregnation: new NumberField({initial: 1}),
                  energie: new SchemaField({
                    base: new NumberField({initial: 4}),
                    prolonger: new NumberField({initial: 1})
                  }),
                  textarea: new SchemaField({
                    duree: new NumberField({initial: 50})
                  })
                }),
                personnalise: new SchemaField({
                  label: new StringField(),
                  description: new StringField()
                })
              }),
              liste: new ObjectField({}),
              selected: new ObjectField({})
            }),
            special: new SchemaField({
              all: new SchemaField({
                recolteflux: new SchemaField({
                  label: new StringField(),
                  description: new StringField(),
                  conflit: new SchemaField({
                    base: new NumberField({initial: 2}),
                    tour: new NumberField({initial: 1}),
                    hostile: new NumberField({initial: 2}),
                    salopard: new NumberField({initial: 3}),
                    patron: new NumberField({initial: 4}),
                    portee: new StringField({initial: "moyenne"})
                  }),
                  horsconflit: new SchemaField({
                    base: new NumberField({initial: 1}),
                    portee: new StringField({initial: "moyenne"}),
                    limite: new NumberField({initial: 10})
                  })
                })
              }),
              selected: new ObjectField({})
            })
        };
    }

    prepareBaseData() {

	}

	prepareDerivedData() {

    }
}