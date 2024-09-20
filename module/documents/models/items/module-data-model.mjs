export class ModuleDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const {HTMLField, NumberField, SchemaField, StringField, ObjectField, BooleanField} = foundry.data.fields;

        return {
            id:new StringField(),
            active:new SchemaField({
              base:new BooleanField({initial:false}),
              pnj:new BooleanField({initial:false}),
              pnjName:new StringField(),
            }),
            description:new HTMLField({initial:''}),
            categorie:new StringField({initial:'effets'}),
            listes:new ObjectField(),
            isLion:new BooleanField({initial:false}),
            slots:new SchemaField({
              tete:new NumberField({initial:0, nullable:false, integer:true}),
              torse:new NumberField({initial:0, nullable:false, integer:true}),
              brasGauche:new NumberField({initial:0, nullable:false, integer:true}),
              brasDroit:new NumberField({initial:0, nullable:false, integer:true}),
              jambeGauche:new NumberField({initial:0, nullable:false, integer:true}),
              jambeDroite:new NumberField({initial:0, nullable:false, integer:true}),
            }),
            niveau:new SchemaField({
              value:new NumberField({initial:1, nullable:false, integer:true}),
              max:new NumberField({initial:1, nullable:false, integer:true}),
              details:new ObjectField({initial:{
                n1:{
                  addOrder:0,
                  permanent:false,
                  rarete:"standard",
                  prix:0,
                  activation:"aucune",
                  duree:"",
                  portee:"personnelle",
                  listes:{},
                  labels:{},
                  energie:{
                    tour:{
                      value:0,
                      label:""
                    },
                    minute:{
                      value:0,
                      label:""
                    },
                    supplementaire:0
                  },
                  secondmode:{
                    has:false,
                    activation:"aucune"
                  },
                  aspects:{
                    chair:{
                      liste:{
                        deplacement: {},
                        force: {},
                        endurance: {}
                      }
                    },
                    bete:{
                      liste:{
                        hargne: {},
                        combat: {},
                        instinct: {}
                      }
                    },
                    machine:{
                      liste:{
                        tir: {},
                        savoir: {},
                        technique: {}
                      }
                    },
                    dame:{
                      liste:{
                        aura: {},
                        parole: {},
                        sangFroid: {}
                      }
                    },
                    masque:{
                      liste:{
                        discretion: {},
                        dexterite: {},
                        perception: {}
                      }
                    }
                  },
                  bonus:{
                    has:false,
                    sante:{
                      has:false,
                      value:0
                    },
                    armure:{
                      has:false,
                      value:0
                    },
                    champDeForce:{
                      has:false,
                      value:0
                    },
                    energie:{
                      has:false,
                      value:0
                    },
                    degats:{
                      has:false,
                      type:"contact",
                      dice:0,
                      fixe:0,
                      variable:{
                        has:false,
                        min:{
                          dice:0,
                          fixe:0
                        },
                        max:{
                          dice:0,
                          fixe:0
                        },
                        cout:0
                      }
                    },
                    violence:{
                      has:false,
                      type:"contact",
                      dice:0,
                      fixe:0,
                      variable:{
                        has:false,
                        min:{
                          dice:0,
                          fixe:0
                        },
                        max:{
                          dice:0,
                          fixe:0
                        },
                        cout:0
                      }
                    },
                    overdrives:{
                      has:false,
                      aspects:{
                        chair:{
                          deplacement:0,
                          force:0,
                          endurance:0
                        },
                        bete:{
                          hargne:0,
                          combat:0,
                          instinct:0
                        },
                        machine:{
                          tir:0,
                          savoir:0,
                          technique:0
                        },
                        dame:{
                          aura:0,
                          parole:0,
                          sangFroid:0
                        },
                        masque:{
                          discretion:0,
                          dexterite:0,
                          perception:0
                        }
                      }
                    },
                    grenades:{
                      has:false,
                      liste:{
                        antiblindage: {
                          degats: {
                            dice: 0
                          },
                          violence: {
                            dice: 0
                          }
                        },
                        explosive: {
                          degats: {
                            dice: 0
                          },
                          violence: {
                            dice: 0
                          }
                        },
                        shrapnel: {
                          degats: {
                            dice: 0
                          },
                          violence: {
                            dice: 0
                          }
                        }
                      }
                    }
                  },
                  arme:{
                    has:false,
                    type:"contact",
                    portee:"contact",
                    optionsmunitions:{
                      has:false,
                      actuel:"0",
                      value:1,
                      liste:{}
                    },
                    degats:{
                      dice:0,
                      fixe:0,
                      variable:{
                        has:false,
                        min:{
                          dice:0,
                          fixe:0
                        },
                        max:{
                          dice:0,
                          fixe:0
                        },
                        cout:0
                      }
                    },
                    violence:{
                      dice:0,
                      fixe:0,
                      variable:{
                        has:false,
                        min:{
                          dice:0,
                          fixe:0
                        },
                        max:{
                          dice:0,
                          fixe:0
                        },
                        cout:0
                      }
                    },
                    effets:{
                      liste:[],
                      custom:[],
                      raw:[]
                    },
                    distance:{
                      liste:[],
                      custom:[],
                      raw:[]
                    },
                    structurelles:{
                      liste:[],
                      custom:[],
                      raw:[]
                    },
                    ornementales:{
                      liste:[],
                      custom:[],
                      raw:[]
                    }
                  },
                  overdrives:{
                    has:false,
                    aspects:{
                      chair:{
                        deplacement:0,
                        force:0,
                        endurance:0
                      },
                      bete:{
                        hargne:0,
                        combat:0,
                        instinct:0
                      },
                      machine:{
                        tir:0,
                        savoir:0,
                        technique:0
                      },
                      dame:{
                        aura:0,
                        parole:0,
                        sangFroid:0
                      },
                      masque:{
                        discretion:0,
                        dexterite:0,
                        perception:0
                      }
                    }
                  },
                  pnj:{
                    has:false,
                    modele:{
                      nom:"",
                      special:"",
                      type:"pnj",
                      sante:0,
                      champDeForce:0,
                      defense:0,
                      reaction:0,
                      armure:0,
                      debordement:0,
                      initiative:{
                        dice:3,
                        fixe:0
                      },
                      jetSpecial:{
                        has:false,
                        modele:{
                          nom:"",
                          dice:0,
                          overdrive:0
                        },
                        liste:{}
                      },
                      aspects:{
                        has:false,
                        liste:{
                          chair:{
                            value:0,
                            ae:{
                              mineur:0,
                              majeur:0
                            }
                          },
                          bete:{
                            value:0,
                            ae:{
                              mineur:0,
                              majeur:0
                            }
                          },
                          machine:{
                            value:0,
                            ae:{
                              mineur:0,
                              majeur:0
                            }
                          },
                          dame:{
                            value:0,
                            ae:{
                              mineur:0,
                              majeur:0
                            }
                          },
                          masque:{
                            value:0,
                            ae:{
                              mineur:0,
                              majeur:0
                            }
                          }
                        }
                      },
                      armes:{
                        has:false,
                        modele:{
                          nom:"",
                          type:"contact",
                          portee:"contact",
                          attaque:{
                            dice:0,
                            fixe:0
                          },
                          degats:{
                            dice:0,
                            fixe:0
                          },
                          violence:{
                            dice:0,
                            fixe:0
                          },
                          effets:{
                            liste:[],
                            custom:[],
                            raw:[]
                          }
                        },
                        liste:[]
                      }
                    },
                    liste:{}
                  },
                  ersatz:{
                    rogue:{
                      has:false,
                      interruption:{
                        actif:true
                      },
                      reussites:3,
                      attaque:"discretion",
                      degats:{
                        caracteristique:"discretion",
                        od:true,
                        dice:false,
                        fixe:true
                      }
                    },
                    bard:{
                      has:false
                    }
                  },
                  jetsimple:{
                    has:false,
                    label:"",
                    jet:"0D0",
                    effets:{
                      raw:[],
                      custom:[]
                    }
                  },
                  effets:{
                    raw:[],
                    custom:[],
                    liste:[]
                  },
                  textarea:{
                    duree:22
                  }
                }
              }}),
              actuel:new ObjectField(),
            }),
        }
    }

  prepareBaseData() {
    const niveau = this.niveau.value;
    const itemDataNiveau = this.niveau.details[`n${niveau}`];
    const itemBonus = itemDataNiveau?.bonus || {};
    const itemArme = itemDataNiveau?.arme || {};
    const itemOD = itemDataNiveau?.overdrives || {};
    const itemErsatz = itemDataNiveau?.ersatz || {};

    this.niveau.actuel.bonus = itemBonus;
    this.niveau.actuel.arme = itemArme;
    this.niveau.actuel.overdrives = itemOD;
    this.niveau.actuel.ersatz = itemErsatz;
    this.niveau.actuel.permanent = itemDataNiveau.permanent;
    this.niveau.actuel.duree = itemDataNiveau.duree;
    this.niveau.actuel.energie = itemDataNiveau.energie;
    this.niveau.actuel.rarete = itemDataNiveau.rarete;
    this.niveau.actuel.activation = itemDataNiveau.activation;
    this.niveau.actuel.portee = itemDataNiveau.portee;
    this.niveau.actuel.labels = itemDataNiveau.labels;
    this.niveau.actuel.pnj = itemDataNiveau.pnj;
    this.niveau.actuel.jetsimple = itemDataNiveau.jetsimple;
    this.niveau.actuel.effets = itemDataNiveau.effets
	}

	prepareDerivedData() {

    }
}