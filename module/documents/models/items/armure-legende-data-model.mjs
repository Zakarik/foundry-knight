import {
  spawnTokenRightOfActor,
  spawnTokensRightOfActor,
  deleteTokens,
  createSheet,
  capitalizeFirstLetter,
  confirmationDialog,
} from "../../../helpers/common.mjs";

import PatchBuilder from "../../../utils/patchBuilder.mjs";
import ArmureAPI from "../../../utils/armureAPI.mjs";
import ArmureLegendeAPI from "../../../utils/armureLegendeAPI.mjs";
import { SOCKET } from '../../../utils/socketHandler.mjs';

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

  get actor() {
    return this.item?.actor;
  }

  get item() {
    return this.parent;
  }

  get mainArmure() {
    return this.actor.items.find(itm => itm.type === 'armure');
  }

  prepareBaseData() {

	}

	prepareDerivedData() {

  }

  async activateCapacity(args = {}) {
    const actor = this.actor;
    const mainArmure = this.mainArmure;
    const armure = this.item;

    // Déstructuration défensive + valeurs par défaut
    const {
      capacite = '',
      special = '',
      variant = '',
    } = args;

    // Gardes minimales (évite les plantages)
    if (!capacite) {
      console.warn('activateCapacity: capacite manquant');
      return;
    }

    // Helpers locaux réutilisables
    const deleteActorAndTokens = async (actorId) => {
      if (!actorId) return;
      const a = game.actors?.get(actorId);
      if (!a) return;
      try {
        await deleteTokens([a.id]);   // d’abord les tokens
      } catch (e) {
        console.warn('deleteTokens a échoué (continuation)', e);
      }
      try {
        await a.delete();             // puis l’acteur
      } catch (e) {
        console.warn('actor.delete a échoué (continuation)', e);
      }
    };

    const splitAE = (ae) => {
      const v = Number(ae) || 0;
      return {
        mineur: {
          value:v > 4 ? 0 : v,
        },
        majeur: {
          value:v < 5 ? 0 : v,
        }
      };
    };
    const getMainArmure = new ArmureAPI(mainArmure);
    const getArmure = new ArmureLegendeAPI(armure);
    const getCapacite = getArmure.getCapacite(capacite);
    const getName = getArmure.getCapaciteActiveName(capacite, special, variant);
    const getPath = getArmure.getCapaciteActivePath(capacite, special, variant);
    const value = getArmure.isCapaciteActive(capacite, special, variant) ? false : true;

    // Gestion du coût et de la dépense, seulement si value === true
    if (value) {
      let strDepense = capacite;
      if(special) strDepense += `/${special}`;
      if(variant) strDepense += `/${variant}`;

      // Tente la dépense
      const depense = await this.usePEActivateCapacity(getMainArmure, getArmure, strDepense);

      if (!depense) return; // on s’arrête si la dépense est refusée
    }

    let pb;
    let newActor;
    let sendMsg = true;
    let dialog;

    switch(capacite) {
      case 'ascension': {
        if (value) {
          // 1) Cloner proprement les données source via deepClone
          const clone = foundry.utils.deepClone(actor);
          // 2) Créer l’acteur d’ascension
          const { id, uuid } = await SOCKET.executeAsGM('createSubActor', clone);
          const src = await fromUuid(uuid);

          // 3) Editer nom et visuels
          const newName = `${getName} : ${actor.name}`;
          const armorImg = getArmure.img ?? src.img;

          // 4) Préparer l’état ascension sur l’acteur cloné
          await PatchBuilder.for(src)
            .merge({
              name:newName,
              img:armorImg,
              'prototypeToken.texture.src':armorImg,
              'prototypeToken.name':newName,
              'system.energie.value':actor?.system?.equipements?.armure?.capacites?.ascension?.energie ?? 0,
              'system.wear':'ascension',
              'system.equipements.ascension':actor?.system?.equipements?.armure ?? {}
            })
            .apply();

          // 5) Nettoyer/adapter les items
          const filteredItems = [];
          for (const it of src.items ?? []) {
            // retirer les items de rareté prestige
            if (it?.system?.niveau?.actuel?.rarete === 'prestige') filteredItems.push(it.id);

            if (it.type === 'armure') {
              // couper les jauges sur les armures du clone
              await PatchBuilder.for(it)
                .sys('jauges', {
                  sante:false,
                  espoir:false,
                  heroisme:false,
                })
                .sys('energie.base', actor?.system?.equipements?.armure?.capacites?.ascension?.energie ?? 0)
                .apply();
            }
          }

          SOCKET.executeAsGM('deleteItmInActor', {
            actor:uuid,
            items:filteredItems
          });
          // 6) Marquer l’état côté armure d’origine (update unique agrégé)
          await PatchBuilder.for(armure)
            .sys(getPath, {
              active:true,
              depense:actor?.system?.equipements?.armure?.capacites?.ascension?.energie ?? 0,
              ascensionId: src.id,
            })
            .apply();

          // 7) Spawner le token d’ascension
          await spawnTokenRightOfActor({ actor: src, refActor: actor });
        } else {
          // Désactivation: suppression + reset de l’état
          const ascensionId =
            getCapacite?.ascensionId ??
            getCapacite?.id ??
            null;
          await deleteActorAndTokens(ascensionId);
          await PatchBuilder.for(armure)
            .sys(getPath, {
              active: false,
              ascensionId: 0,
              depense: 0,
            })
            .apply();
        }
        break;
      }

      case "borealis":
      case "goliath":
      case "puppet":
      case "record":
      case "totem":
      case "watchtower":
      case "ghost":
      case "discord":
      case "nanoc":
        await PatchBuilder.for(armure)
          .sys(getPath, value)
          .apply();
        break;
      case "illumination":
        if(special === 'lantern' && variant === 'dgts') {
          const blaLabel = game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.LANTERN.Label")

          await this.rollDegats(blaLabel, [], [], {dice:getCapacite.lantern.degats});
          sendMsg = false;
        } else if(special === 'blaze' && variant === 'dgts') {
          const blaLabel = game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.BLAZE.Label")

          await this.rollDegats(blaLabel, [], [], {dice:getCapacite.blaze.degats});
          await this.rollViolence(blaLabel, [], [], {dice:getCapacite.blaze.violence});
          sendMsg = false;
        } else if(special !== 'candle') {
          await PatchBuilder.for(armure)
            .sys(getPath, value)
            .apply();
        }
        break;
      case "oriflamme":
        const oriLabel = game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.ORIFLAMME.Label")

        if(special.includes('degats')) this.rollDegats(oriLabel, getCapacite.effets.raw, getCapacite.effets.custom, getCapacite.degats);
        if(special.includes('violence')) this.rollViolence(oriLabel, getCapacite.effets.raw, getCapacite.effets.custom, getCapacite.violence);
        break;
      case 'changeling':
        // Cas "explosive": on désactive plusieurs flags et on applique des dégâts/violence
        if (special === 'explosive') {
          const pbC = new PatchBuilder();

          for (const p of getPath) {
            pbC.sys(p, false);
          }

          // Récupérer les effets depuis les capacités d'armure
          const effets = getCapacite?.desactivationexplosive?.effets ?? {};
          this.rollDegats(getName, effets.raw, effets.custom, getCapacite?.degats ?? {dice:1, fixe:0});
          this.rollViolence(getName, effets.raw, effets.custom, getCapacite?.violence ?? {dice:1, fixe:0});

          pbC.applyTo(armure);
        } else {
          // Cas simple: appliquer value sur le chemin fourni
          await PatchBuilder.for(armure)
            .sys(getPath, value)
            .apply();
        }
        break;
      case "companions":
        pb = new PatchBuilder();
        pb.sys(getPath, {
          [special]:value,
          base:value,
        });

        if(value) {
          switch(special) {
            case 'lion':
              const dataLion = getCapacite.lion;

              const dataLChair = dataLion.aspects.chair;
              const dataLBete = dataLion.aspects.bete;
              const dataLMachine = dataLion.aspects.machine;
              const dataLDame = dataLion.aspects.dame;
              const dataLMasque = dataLion.aspects.masque;
              const modules = actor.items.filter(itm => itm.type === 'module' && (itm.system?.isLion ?? false));
              newActor = await createSheet(
                actor,
                "pnj",
                `${actor.name} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.LION.Label")}`,
                {
                  "aspects": {
                    "chair":{
                      "value":dataLChair.value,
                      "ae":splitAE(dataLChair.ae),
                    },
                    "bete":{
                      "value":dataLBete.value,
                      "ae":splitAE(dataLBete.ae),
                    },
                    "machine":{
                      "value":dataLMachine.value,
                      "ae":splitAE(dataLMachine.ae),
                    },
                    "dame":{
                      "value":dataLDame.value,
                      "ae":splitAE(dataLDame.ae),
                    },
                    "masque":{
                      "value":dataLMasque.value,
                      "ae":splitAE(dataLMasque.ae),
                    }
                  },
                  "energie":{
                    "base":actor?.system?.equipements?.armure?.capacites?.companions?.energie ?? 0,
                    "value":actor?.system?.equipements?.armure?.capacites?.companions?.energie ?? 0,
                  },
                  "champDeForce":{
                    "base":dataLion.champDeForce.base,
                  },
                  "armure":{
                    "value":dataLion.armure.base,
                    "base":dataLion.armure.base
                  },
                  "initiative":{
                    "diceBase":dataLion.initiative.value
                  },
                  "defense":{
                    "base":dataLion.defense.value
                  },
                  "reaction":{
                    "base":dataLion.reaction.value
                  },
                  "options":{
                    "resilience":false,
                    "sante":false,
                    "espoir":false,
                    "bouclier":false,
                    "noCapacites":true,
                    "modules":true,
                    "phase2":false
                  }
                },
                [],
                dataLion.img,
                dataLion?.token ?? dataLion.img,
                1
              );

              await PatchBuilder.for(newActor)
                .sys('initiative.bonus.user', dataLion.initiative.fixe)
                .apply();

              const nLItems = modules;

              const nLItem = {
                name:dataLion.armes.contact.coups.label,
                type:'arme',
                system:{
                  type:'contact',
                  portee:dataLion.armes.contact.coups.portee,
                  degats:{
                    dice:dataLion.armes.contact.coups.degats.dice,
                    fixe:dataLion.armes.contact.coups.degats.fixe
                  },
                  violence:{
                    dice:dataLion.armes.contact.coups.violence.dice,
                    fixe:dataLion.armes.contact.coups.violence.fixe
                  },
                  effets:{
                    raw:dataLion.armes.contact.coups.effets.raw,
                    custom:dataLion.armes.contact.coups.effets.custom
                  }
              }};

              nLItems.push(nLItem);

              SOCKET.executeAsGM('giveItmToActor', {
                actor:newActor.uuid,
                items:nLItems
              });

              pb.sys('capacites.selected.companions.lion.id', newActor.id);

              await spawnTokenRightOfActor({actor:newActor, refActor:actor});
              break;

            case 'wolf':
              const dataWolf = getCapacite.wolf;

              const dataWChair = dataWolf.aspects.chair;
              const dataWBete = dataWolf.aspects.bete;
              const dataWMachine = dataWolf.aspects.machine;
              const dataWDame = dataWolf.aspects.dame;
              const dataWMasque = dataWolf.aspects.masque;
              const createdActors = [];
              const dataActor = {
                "aspects": {
                  "chair":{
                    "value":dataWChair.value
                  },
                  "bete":{
                    "value":dataWBete.value
                  },
                  "machine":{
                    "value":dataWMachine.value
                  },
                  "dame":{
                    "value":dataWDame.value
                  },
                  "masque":{
                    "value":dataWMasque.value
                  }
                },
                "energie":{
                  "base":actor?.system?.equipements?.armure?.capacites?.companions?.energie ?? 0,
                  "value":actor?.system?.equipements?.armure?.capacites?.companions?.energie ?? 0,
                },
                "champDeForce":{
                  "base":dataWolf.champDeForce.base,
                },
                "armure":{
                  "value":dataWolf.armure.base,
                  "base":dataWolf.armure.base
                },
                "initiative":{
                  "diceBase":dataWolf.initiative.value
                },
                "defense":{
                  "base":dataWolf.defense.base
                },
                "reaction":{
                  "base":dataWolf.reaction.base
                },
                "wolf":dataWolf.configurations,
                "configurationActive":'',
                "options":{
                  "resilience":false,
                  "sante":false,
                  "espoir":false,
                  "bouclier":false,
                  "modules":false,
                  "noCapacites":true,
                  "wolfConfiguration":true
                }
              };

              for(let i = 1;i < 4;i++) {
                newActor = await createSheet(
                  actor,
                  "pnj",
                  `${actor.name} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.Label")} ${i}`,
                  dataActor,
                  {},
                  dataWolf.img,
                  dataWolf?.token ?? dataWolf.img,
                  1
                );

                await PatchBuilder.for(newActor)
                  .sys('initiative.bonus.user', dataWolf.initiative.fixe)
                  .apply();
                const nWItems = [];
                const nWItem = {
                  name:dataWolf.armes.contact.coups.label,
                  type:'arme',
                  system:{
                    type:'contact',
                    portee:dataWolf.armes.contact.coups.portee,
                    degats:{
                      dice:dataWolf.armes.contact.coups.degats.dice,
                      fixe:dataWolf.armes.contact.coups.degats.fixe
                    },
                    violence:{
                      dice:dataWolf.armes.contact.coups.violence.dice,
                      fixe:dataWolf.armes.contact.coups.violence.fixe
                    },
                    effets:{
                      raw:dataWolf.armes.contact.coups.effets.raw,
                      custom:dataWolf.armes.contact.coups.effets.custom
                    }
                }};

                nWItems.push(nWItem);

                SOCKET.executeAsGM('giveItmToActor', {
                  actor:newActor.uuid,
                  items:nWItems
                });

                pb.sys(`capacites.selected.companions.wolf.id.id${i}`, newActor.id);
                createdActors.push(newActor);
              }

              await spawnTokensRightOfActor(createdActors, actor);
              break;

            case 'crow':
              const dataCrow = getCapacite.crow;

              const dataCChair = dataCrow.aspects.chair;
              const dataCBete = dataCrow.aspects.bete;
              const dataCMachine = dataCrow.aspects.machine;
              const dataCDame = dataCrow.aspects.dame;
              const dataCMasque = dataCrow.aspects.masque;

              newActor = await createSheet(
                actor,
                "bande",
                `${actor.name} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.CROW.Label")}`,
                {
                  "aspects": {
                    "chair":{
                      "value":dataCChair.value
                    },
                    "bete":{
                      "value":dataCBete.value
                    },
                    "machine":{
                      "value":dataCMachine.value
                    },
                    "dame":{
                      "value":dataCDame.value
                    },
                    "masque":{
                      "value":dataCMasque.value
                    }
                  },
                  "energie":{
                    "value":actor?.system?.equipements?.armure?.capacites?.companions?.energie ?? 0,
                    "max":actor?.system?.equipements?.armure?.capacites?.companions?.energie ?? 0,
                  },
                  "champDeForce":{
                    "base":dataCrow.champDeForce.base,
                  },
                  "sante":{
                    "value":dataCrow.cohesion.base,
                    "base":dataCrow.cohesion.base
                  },
                  "initiative":{
                    "diceBase":dataCrow.initiative.value
                  },
                  "defense":{
                    "base":dataCrow.defense.value
                  },
                  "reaction":{
                    "base":dataCrow.reaction.value
                  },
                  "debordement":{
                    "value":dataCrow.debordement.base
                  },
                  "options":{
                    "resilience":false,
                    "sante":false,
                    "espoir":false,
                    "bouclier":false,
                    "noCapacites":true,
                    "energie":true,
                    "modules":false
                  }
                },
                {},
                dataCrow.img,
                dataCrow?.token ?? dataCrow.img,
                1
              );
              await PatchBuilder.for(newActor)
                .sys('initiative.bonus.user', dataCrow.initiative.fixe)
                .apply();

              pb.sys(`capacites.selected.companions.crow.id`, newActor.id);

              await spawnTokenRightOfActor({actor:newActor, refActor:actor});
              break;
          }

          const msgCompanions = {
            flavor:`${getName}`,
            main:{
              total:`${game.i18n.format("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.Invocation", {type:game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.${special.toUpperCase()}.Label`)})}`
            }
          };

          const msgActiveCompanions = {
            user: game.user.id,
            speaker: {
              actor: actor?.id || null,
              token: actor?.token?.id || null,
              alias: actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgCompanions),
            sounds:CONFIG.sounds.notification,
          };

          await ChatMessage.create(msgActiveCompanions);
        } else {
          let recupValue = 0;

          switch(special) {
            case 'lion':
              const idLion = getCapacite.lion.id;
              const actorLion = game.actors?.get(idLion) || {};
              recupValue = actorLion?.system?.energie?.value || 0;

              this.givePE(recupValue, getMainArmure);

              await deleteTokens([actorLion.id]);

              if(Object.keys(actorLion).length != 0) await actorLion.delete();
              break;

            case 'wolf':
              const id1Wolf = getCapacite.wolf.id.id1;
              const id2Wolf = getCapacite.wolf.id.id2;
              const id3Wolf = getCapacite.wolf.id.id3;
              const actor1Wolf = game.actors?.get(id1Wolf) || {};
              const actor2Wolf = game.actors?.get(id2Wolf) || {};
              const actor3Wolf = game.actors?.get(id3Wolf) || {};

              recupValue = actor1Wolf?.system?.energie?.value || 0;

              this.givePE(recupValue, getMainArmure);

              await deleteTokens([actor1Wolf.id, actor2Wolf.id, actor3Wolf.id]);

              if(Object.keys(actor1Wolf).length != 0) await actor1Wolf.delete();
              if(Object.keys(actor2Wolf).length != 0) await actor2Wolf.delete();
              if(Object.keys(actor3Wolf).length != 0) await actor3Wolf.delete();
              break;

            case 'crow':
              const idCrow = getCapacite.crow.id;
              const actorCrow = game.actors?.get(idCrow) || {};

              recupValue = actorCrow?.system?.energie?.value || 0;

              this.givePE(recupValue, getMainArmure);

              await deleteTokens([actorCrow.id]);

              if(Object.keys(actorCrow).length != 0) await actorCrow.delete();
              break;
          }

          const msgCompanions = {
            flavor:`${getName}`,
            main:{
              total:`${game.i18n.format("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.Revocation", {type:game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.${special.toUpperCase()}.Label`)})}`
            }
          };

          const msgActiveCompanions = {
            user: game.user.id,
            speaker: {
              actor: actor?.id || null,
              token: actor?.token?.id || null,
              alias: actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgCompanions),
            sounds:CONFIG.sounds.notification,
          };

          await ChatMessage.create(msgActiveCompanions);
        }

        await pb.applyTo(armure);
        break;
      case "shrine":
        await PatchBuilder.for(armure)
          .sys(getPath, {
            base:value,
            [special]:value,
          })
          .apply();
        break;
      case "morph":
        pb = new PatchBuilder();

        if(!special) {
          pb.sys(getPath.split('.').slice(0, -1).join('.'), {
              'morph':value,
              'polymorphieLame':false,
              'polymorphieGriffe':false,
              'polymorphieCanon':false,
            })
          pb.sys(`${getPath.split('.').slice(0, -2).join('.')}.choisi`, {
              'vol':false,
              'phase':false,
              'etirement':false,
              'metal':false,
              'fluide':false,
              'polymorphie':false,
              'polymorphieLame':false,
              'polymorphieGriffe':false,
              'polymorphieCanon':false,
            })
        }
        else if(special !== 'polymorphieReset' && (special !== 'phase' || special !== 'phaseN2')) pb.sys(getPath, value);
        else if(special === 'polymorphieReset') {
          sendMsg = false;

          pb.sys(getPath, {
              'polymorphieLame':false,
              'polymorphieGriffe':false,
              'polymorphieCanon':false,
            })
        }

        if(variant === 'choix') sendMsg = false;

        await pb.applyTo(armure);
        break;
      case "rage":
        const rageInterdit = [];
        const rageBonus = [];

        if(!special) {
          pb = new PatchBuilder();

          pb.sys(getPath[0], value);

          if(value) {
            pb.sys(getPath[1], {
              colere:true,
            });

            if(getCapacite.colere.combosInterdits.has) {
              for (let [key, combo] of Object.entries(getCapacite.colere.combosInterdits.liste)){
                if(combo != "") {
                  rageInterdit.push(combo);
                }
              }
            }

            if(getCapacite.colere.combosBonus.has) {
              for (let [key, combo] of Object.entries(getCapacite.colere.combosBonus.liste)){
                if(combo != "") {
                  rageBonus.push(combo);
                }
              }
            }
          }
          else {
            pb.sys(getPath[1], {
              colere:false,
              rage:false,
              fureur:false,
            });
          }

          await pb.applyTo(armure);
          await PatchBuilder.for(actor)
            .sys('combos.interdits.caracteristiques.rage', value ? rageInterdit : [])
            .sys('combos.bonus.caracteristiques.rage', value ? rageBonus : [])
            .apply();
        } else if(special === 'niveau') {
          sendMsg = false;
          pb = new PatchBuilder();
          const nActuel = getCapacite?.niveau || false;

          if(variant === 'ennemi') {
            new game.knight.RollKnight(actor,
            {
              name:`${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.UP.Label")}`,
            }).sendMessage({
                text: game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.UP.Ennemi"),
                sounds:CONFIG.sounds.notification,
            });
          }

          if(nActuel.colere) {
            pb.sys(getPath, {
              colere:false,
              rage:true,
            });

            if(getCapacite.rage.combosInterdits.has) {
              for (let [key, combo] of Object.entries(getCapacite.rage.combosInterdits.liste)){
                if(combo != "") {
                  rageInterdit.push(combo);
                }
              }
            }

            if(getCapacite.rage.combosBonus.has) {
              for (let [key, combo] of Object.entries(getCapacite.rage.combosBonus.liste)){
                if(combo != "") {
                  rageBonus.push(combo);
                }
              }
            }
          } else if(nActuel.rage) {
            pb.sys(getPath, {
              colere:false,
              rage:false,
              fureur:true,
            });

            if(getCapacite.fureur.combosInterdits.has) {
              for (let [key, combo] of Object.entries(getCapacite.fureur.combosInterdits.liste)){
                if(combo != "") {
                  rageInterdit.push(combo);
                }
              }
            }

            if(getCapacite.fureur.combosBonus.has) {
              for (let [key, combo] of Object.entries(getCapacite.fureur.combosBonus.liste)){
                if(combo != "") {
                  rageBonus.push(combo);
                }
              }
            }
          }

          await pb.applyTo(armure);
          await PatchBuilder.for(this)
            .sys('combos.interdits.caracteristiques.rage', rageInterdit)
            .sys('combos.bonus.caracteristiques.rage', rageBonus)
            .apply();

          const exec = new game.knight.RollKnight(this,
            {
            name:game.i18n.localize(`KNIGHT.ACTIVATION.Label`),
            }).sendMessage({
                text:`${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.Label")} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.UP.Label")}`,
                sounds:CONFIG.sounds.notification,
            });
        } else if(special === 'degats') {
          sendMsg = false;
          const niveauActuel = Object.keys(getCapacite?.niveau ?? {}).find(k => getCapacite.niveau[k] === true) ?? null;
          const degatsRage = getCapacite[niveauActuel].subis;
          const degatsLabel = game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.SubirDegats");
          const sante = this.system.sante.value;

          const rDegats = new game.knight.RollKnight(this, {
            name:`${getName} : ${degatsLabel}`,
            dices:`${degatsRage}D6`,
          }, false);

          await rDegats.doRoll({['system.sante.value']:`@{max, 0} ${sante}-@{rollTotal}`});
        } else if(special === 'recuperation') {
          sendMsg = false;
          const recuperationRage = variant.split('/');
          const labelRecuperationRage = recuperationRage[0] === 'proche' ? game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.TUE.Proche") : `${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.TUE.${capitalizeFirstLetter(recuperationRage[0])}`)} : ${game.i18n.localize(`KNIGHT.TYPE.${capitalizeFirstLetter(recuperationRage[1])}`)}`;
          const getRecuperationRageDices = recuperationRage[0] === 'proche' ? {dice:0, face:6, fixe:1}: getCapacite.nourri[recuperationRage[0]][recuperationRage[1]];

          const rRecuperation = new game.knight.RollKnight(this, {
            name:game.i18n.localize("KNIGHT.GAINS.Espoir") + ` (${labelRecuperationRage})`,
            dices:`${getRecuperationRageDices.dice}D${getRecuperationRageDices.face}+${getRecuperationRageDices.fixe}`,
          }, false);

          this.givePE(await rRecuperation.doRoll(), getMainArmure, true);
        } else if(special === 'blaze') {
          const blaLabel = game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.BLAZE.Label")

          await this.rollDegats(blaLabel, [], [], {dice:getCapacite.blaze.degats});
          await this.rollViolence(blaLabel, [], [], {dice:getCapacite.blaze.violence});
        }
        break;
      case "warlord":
        if(special !== 'energie') {
          await PatchBuilder.for(armure)
            .sys(getPath, value)
            .apply();
        }
        break;
      case "zen":
        function collectTrueNames(data) {
          const out = [];
          for (const [branche, bloc] of Object.entries(data)) {
            const caracs = bloc && bloc.caracteristiques;
            if (!caracs || typeof caracs !== "object") continue;

            for (const [nom, details] of Object.entries(caracs)) {
              if (details && details.value === true) {
                out.push(nom);
              }
            }
          }
          return out;
        }

        const listC = collectTrueNames(getCapacite.aspects)

        const autre = [].concat(listC);
        autre.shift();

        dialog = new game.knight.applications.KnightRollDialog(actor._id, {
          label:getName,
          base:listC[0],
          whatRoll:autre,
          difficulte:5,
        });

        dialog.open();
        break;
      case "type":
        await PatchBuilder.for(armure)
          .sys(getPath, value)
          .apply();
        break;
      case "mechanic":
        const mechanic = getCapacite.reparation[special];
        const roll = new game.knight.RollKnight(this, {
          name:`${getName}`,
          dices:`${mechanic.dice}D6+${mechanic.fixe}`,
        }, false);

        await roll.doRoll();
        sendMsg = false;
        break;

      default:
        console.warn(`activateCapacityLegend: capacité inconnue "${capacite}"`);
        break;
    }

    if(sendMsg) {
      const exec = new game.knight.RollKnight(actor,
        {
        name:value ? game.i18n.localize(`KNIGHT.ACTIVATION.Label`) : game.i18n.localize(`KNIGHT.ACTIVATION.Desactivation`),
        }).sendMessage({
            text:getName,
            sounds:CONFIG.sounds.notification,
        });
    }
  }

  async activateSpecial(args = {}) {
    const actor = this.actor;
    const armure = this.item;

    // Déstructuration défensive + valeurs par défaut
    const {
      capacite = '',
      special = '',
      variant = '',
    } = args;

    // Gardes minimales (évite les plantages)
    if (!capacite) {
      console.warn('activateSpecial: special manquant');
      return;
    }

    const getArmure = new ArmureLegendeAPI(armure);
    const getSpecial = getArmure.getSpecial(capacite);
    const getName = getArmure.getSpecialActiveName(capacite, special, variant);

    let dialog;

    switch(capacite) {
      case 'contrecoups':
        dialog = new game.knight.applications.KnightRollDialog(actor._id, {
          label:getName,
          base:getSpecial.jet[special],
          difficulte:actor?.system?.equipements?.armure?.special?.[capacite],
          btn:{
            nood:true,
          }
        });

        dialog.open();
        break;

      case 'impregnation':
        dialog = new game.knight.applications.KnightRollDialog(actor._id, {
          label:getName,
          base:getSpecial.jets[`c1${special}`],
          whatRoll:[getSpecial.jets[`c2${special}`]],
        });

        dialog.open();
        break;

      case 'energiedeficiente':
        const roll = new game.knight.RollKnight(actor, {
          name:getName,
          dices:`${special}D6`,
        }, false);

        const rTotal = await roll.doRoll();

        this.givePE(rTotal, getArmure)
        break;

      case 'recolteflux':
        let flux = actor?.system?.flux?.value ?? 0;
        let bonus = 0;

        if(special === 'horsconflit') {
          const limiteFlux = getSpecial?.horsconflit?.limite ?? 0;

          bonus += (actor?.system?.equipements?.armure?.special?.flux ?? 0)*(getSpecial?.horsconflit?.base ?? 0);

          if((flux+bonus) > limiteFlux) bonus = limiteFlux - flux;;
        } else if(special === 'conflit') {
          if(variant === 'debut') bonus += getSpecial?.conflit?.base ?? 0;
          else if(variant === 'tour') bonus += getSpecial?.conflit?.tour ?? 0;
          else if(variant === 'hostile') bonus += getSpecial?.conflit?.hostile ?? 0;
          else if(variant === 'salopard') bonus += getSpecial?.conflit?.salopard ?? 0;
          else if(variant === 'patron') bonus += getSpecial?.conflit?.patron ?? 0;
        }

        flux += bonus;

        await PatchBuilder.for(this.actor)
          .sys("flux.value", flux)
          .apply();

        const dataMsg = {
          flavor:getName,
          main:{
            total:bonus
          }
        };

        const msg = {
          user: game.user.id,
          speaker: {
            actor: actor?.id || null,
            token: actor?.token?.id || null,
            alias: actor?.name || null,
          },
          type: CONST.CHAT_MESSAGE_TYPES.OTHER,
          content: await renderTemplate('systems/knight/templates/dices/wpn.html', dataMsg)
        };

        const rMode = game.settings.get("core", "rollMode");
        const msgFData = ChatMessage.applyRollMode(msg, rMode);

        await ChatMessage.create(msgFData, {
          rollMode:rMode
        });
        break;
    }
  }

  async prolongateCapacity(args = {}) {
    const actor = this.actor;
    const armure = this.item;
    const mainArmure = new ArmureAPI(this.mainArmure);
    // Déstructuration défensive + valeurs par défaut
    const {
      capacite = '',
      special = '',
      variant = '',
      forceEspoir = false,
    } = args;

    // Gardes minimales (évite les plantages)
    if (!capacite) {
      console.warn('prolongateCapacity: capacite manquant');
      return;
    }

    const getArmure = new ArmureLegendeAPI(armure);
    const getName = getArmure.getCapaciteActiveName(capacite, special, variant);

    const ask = await this.usePEProlongateCapacity({mainArmure, armure:getArmure, capacite, special, variant});
    if(!ask) return;

    let label = game.i18n.localize("KNIGHT.AUTRE.Prolonger");

    const exec = new game.knight.RollKnight(actor,
      {
      name:label,
      }).sendMessage({
          text:getName,
          sounds:CONFIG.sounds.notification,
      });
  }

  async usePEActivateCapacity(mainArmure, armure, capacite, forceEspoir = false) {
    const actor = this.actor;
    const split = capacite.split('/');
    const mainLabel = game.i18n.localize(CONFIG.KNIGHT.capacites[split[0]]);
    const subLabel = split[1] ? ` ${game.i18n.localize(CONFIG.KNIGHT[split[1]])}` : '';
    const label = subLabel ? `${mainLabel} : ${subLabel}` : mainLabel;

    const remplaceEnergie = mainArmure.espoirRemplaceEnergie;
    const getType = remplaceEnergie || forceEspoir ? 'espoir' : 'energie';
    const getCapacite = armure.getCapacite(split[0]);
    const hasFlux = armure.hasFlux;

    const flux = hasFlux ? actor?.system?.flux?.value ?? 0 : 0;
    const value = actor?.system?.[getType]?.value ?? 0;
    const espoir = actor?.system?.espoir?.value ?? 0;

    const sendLackMsg = async (i18nKey) => {
      const payload = {
        flavor: `${label}`,
        main: { total: `${game.i18n.localize(`KNIGHT.JETS.${i18nKey}`)}` }
      };
      const data = {
        user: game.user.id,
        speaker: {
          actor: actor?.id ?? null,
          token: actor?.token?.id ?? null,
          alias: actor?.name ?? null,
        },
        type: CONST.CHAT_MESSAGE_TYPES.OTHER,
        content: await renderTemplate('systems/knight/templates/dices/wpn.html', payload),
        sound: CONFIG.sounds.dice
      };
      const rMode = game.settings.get("core", "rollMode");
      const msgData = ChatMessage.applyRollMode(data, rMode);
      await ChatMessage.create(msgData, { rollMode: rMode });
    };

    let depenseEnergie = 0;
    let depenseFlux = 0;
    let depenseEspoir = 0;
    let substractEnergie = 0;
    let substractEspoir = 0;
    let substractFlux = 0;

    switch(split[0]) {
      case 'ascension':
        depenseEnergie = actor?.system?.equipements?.armure?.capacites?.ascension?.energie ?? 0;
        break;

      case 'borealis':
        depenseEnergie = split[1] === 'support' ?
          getCapacite[split[1]].energie.base + (getCapacite[split[1]].energie.allie * actor?.system?.equipements?.armure?.capacites?.borealis?.allie ?? 0) :
          getCapacite[split[1]].energie;
        break;

      case 'changeling':
        if(split[1] !== 'explosive') {
          depenseEnergie = split[1] === 'fauxEtre' ?
            getCapacite.energie[split[1]].value * actor?.system?.equipements?.armure?.capacites?.changeling?.fauxetres ?? 0 :
            getCapacite.energie[split[1]];
        }
        break;

      case 'companions':
        depenseEnergie = getCapacite.energie.base + actor?.system?.equipements?.armure?.capacites?.companions?.energie ?? 0;
        break;

      case 'discord':
        depenseEnergie = getCapacite[split[1]].energie;
        depenseFlux = getCapacite[split[1]].flux;
        break;

      case 'windtalker':
        depenseEnergie = getCapacite.energie;
        depenseFlux = getCapacite.flux;
        break;

      case 'falcon':
      case 'forward':
      case 'record':
      case 'rewind':
      case 'oriflamme':
      case 'watchtower':
        depenseEnergie = getCapacite.energie;
        break;

      case 'goliath':
        depenseEnergie = getCapacite.energie * actor?.system?.equipements?.armure?.capacites?.goliath?.metre ?? 0;
        break;

      case 'nanoc':
      case 'mechanic':
        depenseEnergie = getCapacite.energie[split[1]];
        break;

      case 'shrine':
        if(split[1] === 'distance' || split[1] === 'personnel') depenseEnergie = getCapacite.energie[split[1]];
        else if(split[1] === 'distance6' || split[1] === 'personnel6') depenseEnergie = getCapacite.energie[`${split[1]}tours`];
        break;

      case 'ghost':
        depenseEnergie = getCapacite.energie[split[1] === 'conflit' ? 'tour' : 'minute'];
        break;

      case 'type':
        depenseEnergie = getCapacite.energie[split[2] === 'conflit' ? 'tour' : 'scene'];
        break;

      case 'totem':
        depenseEnergie = getCapacite.energie.base * actor?.system?.equipements?.armure?.capacites?.totem?.nombre ?? 0;
        break;

      case 'puppet':
        depenseEnergie = getCapacite.energie.ordre + (actor?.system?.equipements?.armure?.capacites?.puppet?.cible ?? 0 * getCapacite.energie.supplementaire);
        break;

      case 'illumination':
        if(split[1] === 'candle') {
          const roll = new game.knight.RollKnight(actor, {
            name:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.CANDLE.SacrificeGainEspoir"),
            dices:`${getCapacite.candle.espoir.dice}D${getCapacite.candle.espoir.face}`,
          }, false);

          const total = await roll.doRoll();
          depenseEnergie = total;
        } else depenseEnergie = getCapacite[split[1]].espoir.base;
        break;

      case 'morph':
        if(split[1] === 'phase' && split[2] !== 'choix') depenseEnergie = getCapacite.phase.energie;
        else if(split[1] === 'phaseN2' && split[2] !== 'choix') depenseEnergie = getCapacite.phase.niveau2.energie;
        else if(split[1]) return true;
        else {
          depenseEnergie = getCapacite.energie;
          depenseEspoir = getCapacite.espoir;
        }
        break;

      case 'rage':
        if(split[1] === 'active') depenseEnergie = getCapacite.espoir;
        else if(split[1] === 'niveau' && split[2] === 'espoir') {
          const roll = new game.knight.RollKnight(actor, {
            name:`${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.Label")} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.UP.Espoir")}`,
            dices:'1D6',
          }, false);

          const total = await roll.doRoll();

          depenseEspoir = total;
        }
        break;

      case 'vision':
        depenseEnergie = actor?.system?.equipements?.armure?.capacites?.vision?.energie ?? 0;
        break;

      case 'warlord':
        if(split[2] === 'porteur') {
          depenseEnergie = getCapacite.impulsions[split[1]].energie[split[2]];
        } else {
          switch(split[1]) {
            case 'energie':
              depenseEnergie = actor?.system?.equipements?.armure?.capacites?.warlord?.energie?.nbre ?? 0;
              break;

            case 'action':
              depenseEnergie = getCapacite.impulsions[split[1]].energie[split[2]];
              break;

            case 'esquive':
            case 'guerre':
            case 'force':
              depenseEnergie = actor?.system?.equipements?.armure?.capacites?.warlord?.[split[1]]?.nbre ?? 0 * getCapacite.impulsions[split[1]].energie[split[2]];
              break;
          }
        }
        break;
    }

    if(remplaceEnergie) depenseEnergie += depenseEspoir;

    substractEnergie = value - depenseEnergie;
    substractEspoir = espoir - depenseEspoir;
    substractFlux = flux - depenseFlux;
    if(substractEnergie < 0) {
      await sendLackMsg(`${remplaceEnergie || forceEspoir ? 'Notespoir' : 'Notenergie'}`);

      return false;
    } else if(substractEspoir < 0 && !remplaceEnergie) {
      await sendLackMsg(`Notespoir`);

      return false;
    } else if(substractFlux < 0 && hasFlux) {
      await sendLackMsg(`Notflux`);

      return false;
    } else {
      let pbE = new PatchBuilder();

      if(!remplaceEnergie) pbE.sys(`equipements.${actor.system.wear}.${getType}.value`, substractEnergie);
      else if(remplaceEnergie && !actor.system.espoir.perte.saufAgonie) pbE.sys('espoir.value', substractEnergie);

      if(!remplaceEnergie && depenseEspoir) pbE.sys('espoir.value', substractEspoir);

      if(depenseFlux && hasFlux) pbE.sys('flux.value', substractFlux);

      await pbE.applyTo(actor);

      return true;
    }
  }

  async usePEProlongateCapacity(args = {}) {
    // Déstructuration défensive + valeurs par défaut
    const {
      mainArmure = undefined,
      armure = undefined,
      capacite = undefined,
      special = undefined,
      variant = undefined,
      forceEspoir = false,
    } = args;

    // Gardes minimales (évite les plantages)
    if (!capacite) {
      console.warn('_depenseProlongate: capacite manquante');
      return;
    }

    const actor = this.actor;
    const remplaceEnergie = mainArmure.espoirRemplaceEnergie;
    const hasFlux = armure.hasFlux;
    const getType = remplaceEnergie || forceEspoir ? 'espoir' : 'energie';
    const getCapacite = armure.getCapacite(capacite);

    const flux = hasFlux ? actor?.system?.flux?.value ?? 0 : 0;
    const energie = actor?.system?.[getType]?.value ?? 0;
    const espoir = actor?.system?.espoir?.value ?? 0;

    let depenseEnergie = 0;
    let depenseFlux = 0;
    let depenseEspoir = 0;

    let substractEnergie = 0;
    let substractFlux = 0;
    let substractEspoir = 0;

    let tmp = 0;
    let tmp2 = 0;

    switch(capacite) {
      case 'type':
        if(variant === 'conflit') depenseEnergie += getCapacite?.energie?.tour ?? 0;
        else depenseEnergie += getCapacite?.energie?.scene ?? 0;
        break;

      case 'shrine':
        if(special === 'distance6' || special === 'personnel6') depenseEnergie += getCapacite?.energie?.[`${special}tours`] ?? 0;
        else depenseEnergie += getCapacite?.energie?.[special] ?? 0;
        break;

      case 'nanoc':
        depenseEnergie += getCapacite.energie.prolonger;
        break;

      case 'changeling':
        if(getCapacite.active.fauxEtre) {
          tmp = getCapacite?.energie?.fauxEtre?.value ?? 0;
          tmp *= actor?.system?.equipements?.armure?.capacites?.changeling?.fauxetres ?? 0;

          depenseEnergie += tmp;
        }
        if(getCapacite.active.personnel) depenseEnergie += getCapacite.energie.personnel;
        if(getCapacite.active.etendue) depenseEnergie += getCapacite.energie.etendue;
        break;

      case 'companions':
        depenseEnergie += getCapacite.energie.prolonger;
        break;

      case 'discord':
        if(special === 'tour') {
          depenseEnergie += getCapacite.tour.energie;
          depenseFlux += getCapacite.tour.flux;
        } else if(special === 'scene') {
          depenseEnergie += getCapacite.scene.energie;
          depenseFlux += getCapacite.scene.flux;
        }
        break;

      case 'ghost':
        if(special === 'conflit') depenseEnergie += getCapacite.energie.tour;
        else if(special === 'horsconflit') depenseEnergie += getCapacite.energie.minute;
        break;

      case 'illumination':
        if(special === 'beacon') depenseEspoir += getCapacite.beacon.espoir.prolonger;
        else if(special === 'blaze') depenseEspoir += getCapacite.blaze.espoir.prolonger;
        else if(special === 'lantern') depenseEspoir += getCapacite.lantern.espoir.prolonger;
        else if(special === 'lighthouse') depenseEspoir += getCapacite.lighthouse.espoir.prolonger;
        else if(special === 'projector') depenseEspoir += getCapacite.projector.espoir.prolonger;
        else if(special === 'torch') depenseEspoir += getCapacite.torch.espoir.prolonger;
        break;

      case 'warlord':
        if(special === 'force') {
          tmp = getCapacite.active.force.allie ? getCapacite.impulsions.force.energie.prolonger : 0;
          tmp *= getCapacite.active.force.allie ? actor?.system?.equipements?.armure?.capacites?.warlord?.force?.nbre ?? 0 : 0;
          tmp += getCapacite.active.force.porteur ? getCapacite.impulsions.force.energie.porteur : 0;
          depenseEnergie += tmp;
        } else if(special === 'esquive') {
          tmp = getCapacite.active.esquive.allie ? getCapacite.impulsions.esquive.energie.prolonger : 0;
          tmp *= getCapacite.active.esquive.allie ? actor?.system?.equipements?.armure?.capacites?.warlord?.esquive?.nbre ?? 0 : 0;
          tmp += getCapacite.active.esquive.porteur ? getCapacite.impulsions.esquive.energie.porteur : 0;
          depenseEnergie += tmp;
        } else if(special === 'guerre') {
          tmp = getCapacite.active.guerre.allie ? getCapacite.impulsions.guerre.energie.prolonger : 0;
          tmp *= getCapacite.active.guerre.allie ? actor?.system?.equipements?.armure?.capacites?.warlord?.guerre?.nbre ?? 0 : 0;
          tmp += getCapacite.active.guerre.porteur ? getCapacite.impulsions.guerre.energie.porteur : 0;
          depenseEnergie += tmp;
        }
        break;

      case 'totem':
        tmp = getCapacite.energie.prolonger;
        tmp *= actor?.system?.equipements?.armure?.capacites?.totem?.nombre ?? 0;
        depenseEnergie += tmp;

        depenseFlux
        break;

      case 'puppet':
        tmp = getCapacite.energie.prolonger;
        tmp *= actor?.system?.equipements?.armure?.capacites?.puppet?.cible ?? 0;
        depenseEnergie += tmp;

        tmp2 = getCapacite.flux.prolonger;
        tmp2 *= actor?.system?.equipements?.armure?.capacites?.puppet?.cible ?? 0;
        depenseFlux += tmp2;
        break;
    }

    if(!depenseEnergie) depenseEnergie = 0;
    if(!depenseEspoir) depenseEspoir = 0;
    if(!depenseFlux) depenseFlux = 0;

    if(remplaceEnergie) depenseEnergie += depenseEspoir;

    substractEnergie = energie - depenseEnergie;
    substractEspoir = espoir - depenseEspoir;
    substractFlux = flux - depenseFlux;

    let label = game.i18n.localize(CONFIG.KNIGHT.capacites[capacite]);
    label += ` : ${game.i18n.localize("KNIGHT.AUTRE.Prolonger")}`;
    const sendLackMsg = async (i18nKey) => {
      const payload = {
        flavor: `${label}`,
        main: { total: `${game.i18n.localize(`KNIGHT.JETS.${i18nKey}`)}` }
      };
      const data = {
        user: game.user.id,
        speaker: {
          actor: actor?.id ?? null,
          token: actor?.token?.id ?? null,
          alias: actor?.name ?? null,
        },
        type: CONST.CHAT_MESSAGE_TYPES.OTHER,
        content: await renderTemplate('systems/knight/templates/dices/wpn.html', payload),
        sound: CONFIG.sounds.dice
      };
      const rMode = game.settings.get("core", "rollMode");
      const msgData = ChatMessage.applyRollMode(data, rMode);
      await ChatMessage.create(msgData, { rollMode: rMode });
    };

    if(substractEnergie < 0) {
      await sendLackMsg(`${remplaceEnergie || forceEspoir ? 'Notespoir' : 'Notenergie'}`);

      return false;
    } else if(substractEspoir < 0 && !remplaceEnergie) {
      await sendLackMsg(`Notespoir`);

      return false;
    } else if(substractFlux < 0 && hasFlux) {
      await sendLackMsg(`Notflux`);

      return false;
    } else {
      let pbE = new PatchBuilder();

      if(!remplaceEnergie) pbE.sys(`equipements.${actor.system.wear}.${getType}.value`, substractEnergie);
      else if(remplaceEnergie && !actor.system.espoir.perte.saufAgonie) pbE.sys('espoir.value', substractEnergie);

      if(!remplaceEnergie && depenseEspoir) pbE.sys('espoir.value', substractEspoir);

      if(depenseFlux && hasFlux) pbE.sys('flux.value', substractFlux);

      await pbE.applyTo(actor);

      return true;
    }
  }

  async givePE(gain, armure, forceEspoir=false) {
    const data = this.actor;
    const remplaceEnergie = armure.espoirRemplaceEnergie;

    const type = remplaceEnergie === true || forceEspoir ? 'espoir' : 'energie';
    const actuel = remplaceEnergie === true || forceEspoir ? +data.system.espoir.value : +data.system.energie.value;
    const total = remplaceEnergie === true || forceEspoir ? +data.system.espoir.max : +data.system.energie.max;
    let add = actuel+gain;

    if(add > total) {
      add = total;
    }

    let pbE = new PatchBuilder();

    if(type === 'espoir') pbE.sys('espoir.value', add);
    else pbE.sys(`equipements.${data.system.wear}.${type}.value`, add);

    await pbE.applyTo(data);

    return true;
  }

  async rollDegats(label, raw=[], custom=[], dices={dice:0, fixe:0}) {
    const actor = this.actor;
    const listtargets = game.user.targets;
    const allTargets = [];
    let activeTenebricide = true;

    if(listtargets && listtargets.size > 0) {
      for(let t of listtargets) {
        const actor = t.actor;

        allTargets.push({
            id:t.id,
            name:actor.name,
            aspects:actor.system.aspects,
            type:actor.type,
            effets:[],
        });
      }
   }

    const roll = new game.knight.RollKnight(actor, {
      name:`${label} : ${game.i18n.localize("KNIGHT.AUTRE.Degats")}`,
    }, false);
    const weapon = roll.prepareWpnDistance({
      name:`${label}`,
      system:{
        degats:{dice:dices.dice, fixe:dices.fixe},
        violence:{dice:0, fixe:0},
        effets:{raw:raw, custom:custom},
      }
    });

    if(weapon.effets.raw.includes('tenebricide') && !await confirmationDialog("active", "Activation", {effect:game.i18n.localize("KNIGHT.EFFETS.TENEBRICIDE.Label")})) activeTenebricide = false;
    const options = weapon.options;

    for(let o of options) {

      if(o.value === 'tenebricide') o.active = activeTenebricide;
      else o.active = true;
    }

    const flags = roll.getRollData(weapon, {targets:allTargets});
    roll.setWeapon(weapon);
    await roll.doRollDamage(flags);
  }

  async rollViolence(label, raw=[], custom=[], dices={dice:0, fixe:0}) {
    const actor = this.actor;
    const listtargets = game.user.targets;
    const allTargets = [];
    let activeTenebricide = true;

    if(listtargets && listtargets.size > 0) {
      for(let t of listtargets) {
        const actor = t.actor;

        allTargets.push({
            id:t.id,
            name:actor.name,
            aspects:actor.system.aspects,
            type:actor.type,
            effets:[],
        });
      }
   }

    const roll = new game.knight.RollKnight(actor, {
      name:`${label} : ${game.i18n.localize("KNIGHT.AUTRE.Violence")}`,
    }, false);
    const weapon = roll.prepareWpnDistance({
      name:`${label}`,
      system:{
        degats:{dice:0, fixe:0},
        violence:dices,
        effets:{raw:raw, custom:custom},
      }
    });

    if(weapon.effets.raw.includes('tenebricide') && !await confirmationDialog("active", "Activation", {effect:game.i18n.localize("KNIGHT.EFFETS.TENEBRICIDE.Label")})) activeTenebricide = false;
    const options = weapon.options;

    for(let o of options) {

      if(o.value === 'tenebricide') o.active = activeTenebricide;
      else o.active = true;
    }

    const flags = roll.getRollData(weapon, {targets:allTargets});
    roll.setWeapon(weapon);
    await roll.doRollViolence(flags);
  }
}