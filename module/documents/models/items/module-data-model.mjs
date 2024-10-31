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
                  raw:[],
                  chargeur:null,
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
                  custom:[],
                  chargeur:null,
                }
              },
              effets:{
                raw:[],
                custom:[],
                liste:[],
                chargeur:null,
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

  get actor() {
    return this.item?.actor;
  }

  get item() {
    return this.parent;
  }

  get hasMunition() {
    const niveau = this.niveau.value;
    const actuel = this.niveau?.details?.[`n${niveau}`];

    if(!actuel) return true;
    const arme = actuel.arme;
    const type = arme.type;
    let result = true;

    if(type === 'contact') {
        const effets = arme.effets;
        const findChargeur = effets.raw.find(itm => itm.includes('chargeur'));

        if(!findChargeur) return;

        const chargeurMax = parseInt(findChargeur.split(' ')[1]);

        let chargeur = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        if(chargeur === 0) result = false;
    }
    else if(type === 'distance') {
      const effets = arme.effets;
      const findChargeurBase = effets.raw.find(itm => itm.includes('chargeur'));

      if(findChargeurBase) {
        const chargeurMax = parseInt(findChargeurBase.split(' ')[1]);
        const chargeurActuel = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        if(chargeurActuel !== 0 && result) result = true;
        else result = false;
      };

      if(arme.optionsmunitions.has) {
        const actuel = arme.optionsmunitions.actuel;
        const munition = arme.optionsmunitions?.liste?.[actuel];

        if(munition) {
          const effetsMunition = munition;
          const findChargeurMunition = munition.raw.find(itm => itm.includes('chargeur'));

          if(findChargeurMunition) {
            const chargeurMunitionMax = parseInt(findChargeurMunition.split(' ')[1]);

            let chargeurMunition = effetsMunition?.chargeur !== null && effetsMunition?.chargeur !== undefined ? parseInt(effetsMunition.chargeur) : chargeurMunitionMax;

            if(chargeurMunition !== 0 && result) result = true;
            else result = false;
          }
        }
      }
    }

    return result;
  }

  resetMunition() {
    const niveau = this.niveau.value;
    const actuel = this.niveau?.details?.[`n${niveau}`];
    let update = {};

    if(!actuel) return;
    const arme = actuel.arme;
    const type = arme.type;

    if(type === 'contact') {
      const effets = arme.effets;
      const findChargeur = effets.raw.find(itm => itm.includes('chargeur'));

      if(!findChargeur) return;

      const chargeurMax = parseInt(findChargeur.split(' ')[1]);

      update[`system.niveau.details.n${niveau}.arme.effets.chargeur`] = chargeurMax;
    }
    else if(type === 'distance') {
      const effets = arme.effets;
      const findChargeurBase = effets.raw.find(itm => itm.includes('chargeur'));

      if(findChargeurBase) {
        const chargeurMax = parseInt(findChargeurBase.split(' ')[1]);

        update[`system.niveau.details.n${niveau}.arme.effets.chargeur`] = chargeurMax;
      };

      if(arme.optionsmunitions.has) {
        const actuel = arme.optionsmunitions.actuel;
        const munition = arme.optionsmunitions?.liste ?? {};

        for (const effet in munition) {
          const findChargeurMunition = munition[effet].raw.find(itm => itm.includes('chargeur'));

          if(!findChargeurMunition) continue;

          const chargeurMunitionMax = parseInt(findChargeurMunition.split(' ')[1]);

          update[`system.niveau.details.n${niveau}.arme.optionsmunitions.liste.${actuel}.chargeur`] = chargeurMunitionMax;
        }
      }
    }

    this.item.update(update);

    if(!this.actor) return;

    const exec = new game.knight.RollKnight(this.actor,
    {
    name:this.item.name,
    }).sendMessage({
        text:game.i18n.localize('KNIGHT.JETS.RemplirChargeur'),
        classes:'important',
    });
  }

  useMunition() {
    const niveau = this.niveau.value;
    const actuel = this.niveau?.details?.[`n${niveau}`];

    if(!actuel) return;
    const arme = actuel.arme;
    const type = arme.type;

    if(type === 'contact') {
      const effets = arme.effets;
      const findChargeur = effets.raw.find(itm => itm.includes('chargeur'));

      if(!findChargeur) return;

      const chargeurMax = parseInt(findChargeur.split(' ')[1]);

      let chargeur = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

      if(chargeur === 0) return;

      this.item.update({[`system.niveau.details.n${niveau}.arme.effets.chargeur`]:chargeur-1})
    }
    else if(type === 'distance') {
      const effets = arme.effets;
      const findChargeurBase = effets.raw.find(itm => itm.includes('chargeur'));

      if(findChargeurBase) {
        const chargeurMax = parseInt(findChargeurBase.split(' ')[1]);
        const chargeurActuel = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

        if(chargeurActuel !== 0) this.item.update({[`system.niveau.details.n${niveau}.arme.effets.chargeur`]:chargeurActuel-1});
      };

      if(arme.optionsmunitions.has) {
        const actuel = arme.optionsmunitions.actuel;
        const munition = arme.optionsmunitions?.liste?.[actuel];

        if(munition) {
          const effetsMunition = munition;
          const findChargeurMunition = munition.raw.find(itm => itm.includes('chargeur'));

          if(findChargeurMunition) {
            const chargeurMunitionMax = parseInt(findChargeurMunition.split(' ')[1]);

            let chargeurMunition = effetsMunition?.chargeur !== null && effetsMunition?.chargeur !== undefined ? parseInt(effetsMunition.chargeur) : chargeurMunitionMax;

            if(chargeurMunition !== 0) this.item.update({[`system.niveau.details.n${niveau}.arme.optionsmunitions.liste.${actuel}.chargeur`]:chargeurMunition-1});
          }
        }
      }
    }
  }

  prepareBaseData() {
    const niveau = Math.max(this.niveau.value, 1);

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