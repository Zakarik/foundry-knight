
import {
  listEffects,
  getAllEffects,
  SortByLabel,
} from "../../../helpers/common.mjs";

export class ArmureCapaciteDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const {StringField, NumberField, BooleanField, SchemaField, ArrayField, ObjectField} = foundry.data.fields;

    return {
      actuel: new StringField({initial: "personnalise"}),
      liste: new ObjectField({}),
      selected: new ObjectField({}),
      base: new SchemaField({
        borealis: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          support: new SchemaField({
            description: new StringField(),
            energie: new SchemaField({
              base: new NumberField({initial: 6}),
              allie: new NumberField({initial: 2})
            }),
            activation: new StringField({initial: "tour"}),
            duree: new StringField()
          }),
          offensif: new SchemaField({
            description: new StringField(),
            energie: new NumberField({initial: 2}),
            activation: new StringField({initial: "combat"}),
            duree: new StringField(),
            degats: new SchemaField({
              dice: new NumberField({initial: 4}),
              fixe: new NumberField({initial: 4})
            }),
            violence: new SchemaField({
              dice: new NumberField({initial: 4}),
              fixe: new NumberField({initial: 0})
            }),
            portee: new StringField({initial: "courte"}),
            effets: new SchemaField({
              liste: new ArrayField(new StringField()),
              raw: new ArrayField(new StringField(), {initial: ["antianatheme", "degatscontinus 3"]}),
              custom: new ArrayField(new ObjectField()),
              chargeur: new NumberField({initial: null})
            })
          }),
          utilitaire: new SchemaField({
            description: new StringField(),
            energie: new NumberField({initial: 6}),
            activation: new StringField({initial: "tour"}),
            duree: new StringField()
          }),
          evolutions: new SchemaField({
            support: new SchemaField({
              description: new StringField(),
              energie: new SchemaField({
                base: new NumberField({initial: 6}),
                allie: new NumberField({initial: 2})
              }),
              activation: new StringField({initial: "tour"}),
              duree: new StringField()
            }),
            offensif: new SchemaField({
              description: new StringField(),
              energie: new NumberField({initial: 2}),
              activation: new StringField({initial: "combat"}),
              duree: new StringField(),
              degats: new SchemaField({
                dice: new NumberField({initial: 4}),
                fixe: new NumberField({initial: 0})
              }),
              violence: new SchemaField({
                dice: new NumberField({initial: 4}),
                fixe: new NumberField({initial: 0})
              }),
              portee: new StringField({initial: "courte"}),
              effets: new SchemaField({
                liste: new ArrayField(new StringField()),
                raw: new ArrayField(new StringField(), {initial: ["antianatheme", "degatscontinus 3"]}),
                custom: new ArrayField(new ObjectField()),
                chargeur: new NumberField({initial: null})
              })
            }),
            utilitaire: new SchemaField({
              description: new StringField(),
              energie: new NumberField({initial: 6}),
              activation: new StringField({initial: "tour"}),
              duree: new StringField()
            }),
            textarea: new SchemaField({
              descriptionESupport: new NumberField({initial: 120}),
              descriptionEUtilitaire: new NumberField({initial: 140}),
              descriptionEOffensif: new NumberField({initial: 85}),
              dureeESupport: new NumberField({initial: 50}),
              dureeEUtilitaire: new NumberField({initial: 50}),
              dureeEOffensif: new NumberField({initial: 50})
            })
          }),
          textarea: new SchemaField({
            descriptionSupport: new NumberField({initial: 120}),
            descriptionUtilitaire: new NumberField({initial: 140}),
            descriptionOffensif: new NumberField({initial: 85}),
            descriptionESupport: new NumberField({initial: 120}),
            descriptionEUtilitaire: new NumberField({initial: 140}),
            descriptionEOffensif: new NumberField({initial: 85}),
            dureeSupport: new NumberField({initial: 50}),
            dureeUtilitaire: new NumberField({initial: 50}),
            dureeOffensif: new NumberField({initial: 50}),
            dureeESupport: new NumberField({initial: 50}),
            dureeEUtilitaire: new NumberField({initial: 50}),
            dureeEOffensif: new NumberField({initial: 50})
          })
        }),
        changeling: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          activation: new StringField({initial: "tour6Sec"}),
          duree: new StringField(),
          portee: new StringField(),
          energie: new SchemaField({
            personnel: new NumberField({initial: 6}),
            etendue: new NumberField({initial: 8}),
            fauxEtre: new SchemaField({
              value: new NumberField({initial: 3}),
              max: new NumberField({initial: 4})
            })
          }),
          desactivationexplosive: new SchemaField({
            label: new StringField(),
            acces: new BooleanField({initial: false}),
            portee: new StringField({initial: "courte"}),
            degats: new SchemaField({
              dice: new NumberField({initial: 3}),
              fixe: new NumberField({initial: 6})
            }),
            violence: new SchemaField({
              dice: new NumberField({initial: 3}),
              fixe: new NumberField({initial: 6})
            }),
            effets: new SchemaField({
              liste: new ArrayField(new StringField()),
              raw: new ArrayField(new StringField(), {initial: ["ignorearmure", "ignorechampdeforce", "dispersion 6", "choc 1"]}),
              custom: new ArrayField(new ObjectField()),
              chargeur: new NumberField({initial: null})
            })
          }),
          evolutions: new SchemaField({
            activation: new StringField({initial: "tour6Sec"}),
            duree: new StringField(),
            portee: new StringField(),
            energie: new SchemaField({
              personnel: new NumberField({initial: 6}),
              etendue: new NumberField({initial: 8}),
              fauxEtre: new SchemaField({
                value: new NumberField({initial: 3}),
                max: new NumberField({initial: 4})
              })
            }),
            desactivationexplosive: new SchemaField({
              label: new StringField(),
              acces: new BooleanField({initial: false}),
              portee: new StringField({initial: "courte"}),
              degats: new SchemaField({
                dice: new NumberField({initial: 3}),
                fixe: new NumberField({initial: 6})
              }),
              violence: new SchemaField({
                dice: new NumberField({initial: 3}),
                fixe: new NumberField({initial: 6})
              }),
              effets: new SchemaField({
                liste: new ArrayField(new StringField()),
                raw: new ArrayField(new StringField(), {initial: ["ignorearmure", "ignorechampdeforce", "dispersion 6", "choc 1"]}),
                custom: new ArrayField(new ObjectField())
              })
            }),
            textarea: new SchemaField({
              duree: new NumberField({initial: 50}),
              portee: new NumberField({initial: 50})
            })
          }),
          textarea: new SchemaField({
            duree: new NumberField({initial: 50}),
            portee: new NumberField({initial: 50})
          })
        }),
        falcon: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          energie: new NumberField({initial: 6}),
          activation: new StringField({initial: "deplacement"}),
          duree: new StringField(),
          informations: new StringField(),
          textarea: new SchemaField({
            duree: new NumberField({initial: 50})
          }),
          evolutions: new SchemaField({
            energie: new NumberField({initial: 6}),
            activation: new StringField({initial: "deplacement"}),
            duree: new StringField(),
            informations: new StringField(),
            textarea: new SchemaField({
              duree: new NumberField({initial: 50})
            })
          })
        }),
        goliath: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          energie: new NumberField({initial: 2}),
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
          evolutions: new SchemaField({
            energie: new NumberField({initial: 2}),
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
            tour: new NumberField({initial: 2}),
            minute: new NumberField({initial: 6})
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
          }),
          evolutions: new SchemaField({
            interruption: new SchemaField({
              actif: new BooleanField({initial: true}),
              label: new StringField()
            }),
            activation: new StringField({initial: "aucune"}),
            duree: new StringField(),
            energie: new SchemaField({
              tour: new NumberField({initial: 2}),
              minute: new NumberField({initial: 6})
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
          })
        }),
        longbow: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          degats: new SchemaField({
            energie: new NumberField({initial: 1}),
            min: new NumberField({initial: 3}),
            max: new NumberField({initial: 9})
          }),
          violence: new SchemaField({
            energie: new NumberField({initial: 1}),
            min: new NumberField({initial: 1}),
            max: new NumberField({initial: 7})
          }),
          portee: new SchemaField({
            energie: new NumberField({initial: 1}),
            min: new StringField({initial: "moyenne"}),
            max: new StringField({initial: "lointaine"})
          }),
          effets: new SchemaField({
            base: new SchemaField({
              liste: new ArrayField(new StringField()),
              raw: new ArrayField(new StringField(), {initial: ["assistanceattaque", "deuxmains", "lourd"]}),
              custom: new ArrayField(new ObjectField()),
              chargeur: new NumberField({initial: null})
            }),
            liste1: new SchemaField({
              energie: new NumberField({initial: 2}),
              liste: new ArrayField(new StringField()),
              raw: new ArrayField(new StringField(), {initial: ["choc 1", "degatscontinus 3", "designation", "percearmure 40", "silencieux", "ultraviolence"]}),
              custom: new ArrayField(new ObjectField()),
              chargeur: new NumberField({initial: null})
            }),
            liste2: new SchemaField({
              energie: new NumberField({initial: 3}),
              liste: new ArrayField(new StringField()),
              raw: new ArrayField(new StringField(), {initial: ["antivehicule", "artillerie", "dispersion 3", "lumiere 4", "penetrant 6", "percearmure 60"]}),
              custom: new ArrayField(new ObjectField()),
              chargeur: new NumberField({initial: null})
            }),
            liste3: new SchemaField({
              label: new StringField(),
              acces: new BooleanField({initial: false}),
              energie: new NumberField({initial: 6}),
              liste: new ArrayField(new StringField()),
              raw: new ArrayField(new StringField(), {initial: ["antianatheme", "demoralisant", "enchaine", "fureur", "ignorearmure", "penetrant 10"]}),
              custom: new ArrayField(new ObjectField()),
              chargeur: new NumberField({initial: null})
            })
          }),
          distance: new SchemaField({
            raw: new ArrayField(new StringField()),
            custom: new ArrayField(new ObjectField())
          }),
          specialEvolutions: new SchemaField({
            1: new SchemaField({
              value: new NumberField({initial: 50}),
              description: new StringField(),
              effets: new SchemaField({
                liste1: new SchemaField({
                  liste: new ArrayField(new StringField()),
                  raw: new ArrayField(new StringField(), {initial: ["choc 1", "degatscontinus 3", "designation", "percearmure 40", "silencieux", "ultraviolence"]}),
                  custom: new ArrayField(new ObjectField())
                }),
                liste2: new SchemaField({
                  liste: new ArrayField(new StringField()),
                  raw: new ArrayField(new StringField(), {initial: ["antivehicule", "artillerie", "dispersion 3", "lumiere 4", "penetrant 6", "percearmure 60"]}),
                  custom: new ArrayField(new ObjectField())
                }),
                liste3: new SchemaField({
                  label: new StringField(),
                  acces: new BooleanField({initial: true}),
                  liste: new ArrayField(new StringField()),
                  raw: new ArrayField(new StringField(), {initial: ["antianatheme", "demoralisant", "enchaine", "fureur", "ignorearmure", "penetrant 10"]}),
                  custom: new ArrayField(new ObjectField())
                })
              })
            }),
            2: new SchemaField({
              value: new NumberField({initial: 50}),
              description: new StringField(),
              degats: new SchemaField({
                min: new NumberField({initial: 5}),
                max: new NumberField({initial: 14})
              }),
              violence: new SchemaField({
                min: new NumberField({initial: 3}),
                max: new NumberField({initial: 12})
              })
            }),
            3: new SchemaField({
              value: new NumberField({initial: 50}),
              description: new StringField(),
              effets: new SchemaField({
                base: new SchemaField({
                  liste: new ArrayField(new StringField()),
                  raw: new ArrayField(new StringField(), {initial: ["assistanceattaque", "deuxmains"]}),
                  custom: new ArrayField(new ObjectField())
                })
              })
            }),
            4: new SchemaField({
              value: new NumberField({initial: 100}),
              description: new StringField(),
              effets: new SchemaField({
                liste1: new SchemaField({
                  energie: new NumberField({initial: 1})
                }),
                liste2: new SchemaField({
                  energie: new NumberField({initial: 1})
                }),
                liste3: new SchemaField({
                  energie: new NumberField({initial: 4})
                })
              })
            })
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
              dice: new NumberField({initial: 3}),
              fixe: new NumberField({initial: 6})
            }),
            distance: new SchemaField({
              duree: new StringField(),
              dice: new NumberField({initial: 2}),
              fixe: new NumberField({initial: 6})
            })
          }),
          energie: new SchemaField({
            contact: new NumberField({initial: 4}),
            distance: new NumberField({initial: 6})
          }),
          textarea: new SchemaField({
            dureeContact: new NumberField({initial: 50}),
            dureeDistance: new NumberField({initial: 50})
          }),
          evolutions: new SchemaField({
            activation: new StringField({initial: "deplacement"}),
            portee: new StringField(),
            reparation: new SchemaField({
              contact: new SchemaField({
                duree: new StringField(),
                dice: new NumberField({initial: 3}),
                fixe: new NumberField({initial: 6})
              }),
              distance: new SchemaField({
                duree: new StringField(),
                dice: new NumberField({initial: 2}),
                fixe: new NumberField({initial: 6})
              })
            }),
            energie: new SchemaField({
              contact: new NumberField({initial: 4}),
              distance: new NumberField({initial: 6})
            }),
            textarea: new SchemaField({
              dureeContact: new NumberField({initial: 50}),
              dureeDistance: new NumberField({initial: 50})
            })
          })
        }),
        nanoc: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          activation: new StringField({initial: "toutes"}),
          duree: new StringField(),
          energie: new SchemaField({
            base: new NumberField({initial: 3}),
            detaille: new NumberField({initial: 6}),
            mecanique: new NumberField({initial: 9}),
            prolonger: new NumberField({initial: 2})
          }),
          textarea: new SchemaField({
            duree: new NumberField({initial: 50})
          }),
          evolutions: new SchemaField({
            activation: new StringField({initial: "toutes"}),
            duree: new StringField(),
            energie: new SchemaField({
              base: new NumberField({initial: 3}),
              detaille: new NumberField({initial: 6}),
              mecanique: new NumberField({initial: 9}),
              prolonger: new NumberField({initial: 2})
            }),
            textarea: new SchemaField({
              duree: new NumberField({initial: 50})
            })
          })
        }),
        oriflamme: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          activation: new StringField({initial: "deplacement"}),
          duree: new StringField(),
          portee: new StringField({initial: "courte"}),
          energie: new NumberField({initial: 12}),
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
            custom: new ArrayField(new ObjectField()),
            chargeur: new NumberField({initial: null})
          }),
          textarea: new SchemaField({
            duree: new NumberField({initial: 50})
          }),
          evolutions: new SchemaField({
            activation: new StringField({initial: "deplacement"}),
            duree: new StringField(),
            portee: new StringField({initial: "courte"}),
            energie: new NumberField({initial: 12}),
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
          })
        }),
        shrine: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          activation: new StringField({initial: "aucune"}),
          duree: new StringField(),
          portee: new StringField(),
          energie: new SchemaField({
            personnel: new NumberField({initial: 1}),
            distance: new NumberField({initial: 2}),
            acces6tours: new BooleanField({initial: false}),
            personnel6tours: new NumberField({initial: 5}),
            distance6tours: new NumberField({initial: 10})
          }),
          champdeforce: new NumberField({initial: 6}),
          requis: new SchemaField({
            force: new NumberField({initial: 5}),
            chair: new NumberField({initial: 10})
          }),
          textarea: new SchemaField({
            duree: new NumberField({initial: 50}),
            portee: new NumberField({initial: 50})
          }),
          evolutions: new SchemaField({
            activation: new StringField({initial: "aucun"}),
            duree: new StringField(),
            portee: new StringField(),
            energie: new SchemaField({
              personnel: new NumberField({initial: 1}),
              distance: new NumberField({initial: 2}),
              acces6tours: new BooleanField({initial: false}),
              personnel6tours: new NumberField({initial: 5}),
              distance6tours: new NumberField({initial: 10})
            }),
            champdeforce: new NumberField({initial: 6}),
            requis: new SchemaField({
              force: new NumberField({initial: 5}),
              chair: new NumberField({initial: 10})
            }),
            textarea: new SchemaField({
              duree: new NumberField({initial: 50}),
              portee: new NumberField({initial: 50})
            })
          })
        }),
        type: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          activation: new StringField({initial: "deplacement"}),
          duree: new StringField(),
          nbreType: new NumberField({initial: 3}),
          energie: new SchemaField({
            tour: new NumberField({initial: 1}),
            scene: new NumberField({initial: 6})
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
          }),
          evolutions: new SchemaField({
            activation: new StringField({initial: "deplacement"}),
            duree: new StringField(),
            nbreType: new NumberField({initial: 3}),
            energie: new SchemaField({
              tour: new NumberField({initial: 1}),
              scene: new NumberField({initial: 6})
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
          })
        }),
        vision: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          activation: new StringField({initial: "deplacement6Sec"}),
          duree: new StringField(),
          energie: new SchemaField({
            min: new NumberField({initial: 5}),
            max: new NumberField({initial: 10})
          }),
          textarea: new SchemaField({
            duree: new NumberField({initial: 50})
          }),
          evolutions: new SchemaField({
            activation: new StringField({initial: "deplacement6Sec"}),
            duree: new StringField(),
            energie: new SchemaField({
              min: new NumberField({initial: 5}),
              max: new NumberField({initial: 10})
            }),
            textarea: new SchemaField({
              duree: new NumberField({initial: 50})
            })
          })
        }),
        warlord: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          impulsions: new SchemaField({
            selection: new NumberField({initial: 3}),
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
            }),
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
          }),
          evolutions: new SchemaField({
            impulsions: new SchemaField({
              selection: new NumberField({initial: 3}),
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
              }),
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
          })
        }),
        watchtower: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          activation: new StringField({initial: "deplacement3Sec"}),
          duree: new StringField(),
          energie: new NumberField({initial: 2}),
          textarea: new SchemaField({
            duree: new NumberField({initial: 50})
          }),
          evolutions: new SchemaField({
            activation: new StringField({initial: "deplacement3Sec"}),
            duree: new StringField(),
            energie: new NumberField({initial: 2}),
            textarea: new SchemaField({
              duree: new NumberField({initial: 50})
            })
          })
        }),
        personnalise: new SchemaField({
          label: new StringField(),
          description: new StringField()
        })
      }),
      c2038: new SchemaField({
        cea: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          energie: new NumberField({initial: 3}),
          activation: new StringField({initial: "combat"}),
          duree: new StringField(),
          espoir: new NumberField({initial: 1}),
          vague: new SchemaField({
            degats: new SchemaField({
              dice: new NumberField({initial: 3}),
              fixe: new NumberField({initial: 0})
            }),
            violence: new SchemaField({
              dice: new NumberField({initial: 3}),
              fixe: new NumberField({initial: 0})
            }),
            portee: new StringField(),
            effets: new SchemaField({
              liste: new ArrayField(new StringField()),
              raw: new ArrayField(new StringField(), {initial: ["parasitage 2", "dispersion 3", "destructeur", "choc 2"]}),
              custom: new ArrayField(new ObjectField()),
              chargeur: new NumberField({initial: null})
            })
          }),
          salve: new SchemaField({
            degats: new SchemaField({
              dice: new NumberField({initial: 3}),
              fixe: new NumberField({initial: 0})
            }),
            violence: new SchemaField({
              dice: new NumberField({initial: 3}),
              fixe: new NumberField({initial: 0})
            }),
            portee: new StringField(),
            effets: new SchemaField({
              liste: new ArrayField(new StringField()),
              raw: new ArrayField(new StringField(), {initial: ["ultraviolence", "meurtrier 3", "dispersion 3", "parasitage 1"]}),
              custom: new ArrayField(new ObjectField()),
              chargeur: new NumberField({initial: null})
            })
          }),
          rayon: new SchemaField({
            degats: new SchemaField({
              dice: new NumberField({initial: 4}),
              fixe: new NumberField({initial: 0})
            }),
            violence: new SchemaField({
              dice: new NumberField({initial: 2}),
              fixe: new NumberField({initial: 0})
            }),
            portee: new StringField(),
            effets: new SchemaField({
              liste: new ArrayField(new StringField()),
              raw: new ArrayField(new StringField(), {initial: ["parasitage 1", "percearmure 40"]}),
              custom: new ArrayField(new ObjectField()),
              chargeur: new NumberField({initial: null})
            })
          }),
          textarea: new SchemaField({
            descriptionVague: new NumberField({initial: 70}),
            descriptionSalve: new NumberField({initial: 75}),
            descriptionRayon: new NumberField({initial: 150}),
            porteeVague: new NumberField({initial: 50}),
            porteeSalve: new NumberField({initial: 50}),
            porteeRayon: new NumberField({initial: 50}),
            duree: new NumberField({initial: 50})
          }),
          evolutions: new SchemaField({
            energie: new NumberField({initial: 3}),
            activation: new StringField({initial: "combat"}),
            duree: new StringField(),
            espoir: new NumberField({initial: 1}),
            vague: new SchemaField({
              degats: new SchemaField({
                dice: new NumberField({initial: 3}),
                fixe: new NumberField({initial: 0})
              }),
              violence: new SchemaField({
                dice: new NumberField({initial: 3}),
                fixe: new NumberField({initial: 0})
              }),
              portee: new StringField(),
              effets: new SchemaField({
                liste: new ArrayField(new StringField()),
                raw: new ArrayField(new StringField(), {initial: ["parasitage 2", "dispersion 3", "destructeur", "choc 2"]}),
                custom: new ArrayField(new ObjectField())
              })
            }),
            salve: new SchemaField({
              degats: new SchemaField({
                dice: new NumberField({initial: 3}),
                fixe: new NumberField({initial: 0})
              }),
              violence: new SchemaField({
                dice: new NumberField({initial: 3}),
                fixe: new NumberField({initial: 0})
              }),
              portee: new StringField(),
              effets: new SchemaField({
                liste: new ArrayField(new StringField()),
                raw: new ArrayField(new StringField(), {initial: ["ultraviolence", "meurtrier 3", "dispersion 3", "parasitage 1"]}),
                custom: new ArrayField(new ObjectField())
              })
            }),
            rayon: new SchemaField({
              degats: new SchemaField({
                dice: new NumberField({initial: 4}),
                fixe: new NumberField({initial: 0})
              }),
              violence: new SchemaField({
                dice: new NumberField({initial: 2}),
                fixe: new NumberField({initial: 0})
              }),
              portee: new StringField(),
              effets: new SchemaField({
                liste: new ArrayField(new StringField()),
                raw: new ArrayField(new StringField(), {initial: ["parasitage 1", "percearmure 40"]}),
                custom: new ArrayField(new ObjectField())
              })
            }),
            textarea: new SchemaField({
              descriptionVague: new NumberField({initial: 70}),
              descriptionSalve: new NumberField({initial: 75}),
              descriptionRayon: new NumberField({initial: 150}),
              porteeVague: new NumberField({initial: 50}),
              porteeSalve: new NumberField({initial: 50}),
              porteeRayon: new NumberField({initial: 50}),
              duree: new NumberField({initial: 50})
            })
          })
        }),
        discord: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          special: new SchemaField({
            c2038: new StringField({initial: "recolteflux"})
          }),
          malus: new SchemaField({
            reaction: new NumberField({initial: 2}),
            defense: new NumberField({initial: 2}),
            actions: new NumberField({initial: 2})
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
          }),
          evolutions: new SchemaField({
            malus: new SchemaField({
              reaction: new NumberField({initial: 2}),
              defense: new NumberField({initial: 2}),
              actions: new NumberField({initial: 2})
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
          })
        }),
        puppet: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          special: new SchemaField({
            c2038: new StringField({initial: "recolteflux"})
          }),
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
          }),
          evolutions: new SchemaField({
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
          })
        }),
        windtalker: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          special: new SchemaField({
            c2038: new StringField({initial: "recolteflux"})
          }),
          flux: new NumberField({initial: 2}),
          energie: new NumberField({initial: 4}),
          activation: new StringField({initial: "deplacement"}),
          duree: new StringField(),
          textarea: new SchemaField({
            duree: new NumberField({initial: 50})
          }),
          evolutions: new SchemaField({
            flux: new NumberField({initial: 2}),
            energie: new NumberField({initial: 4}),
            activation: new StringField({initial: "deplacement"}),
            duree: new StringField(),
            textarea: new SchemaField({
              duree: new NumberField({initial: 50})
            })
          })
        }),
        zen: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          espoir: new NumberField({initial: 0}),
          difficulte: new NumberField({initial: 5}),
          aspects: new SchemaField({
            chair: new SchemaField({
              caracteristiques: new SchemaField({
                deplacement: new SchemaField({
                  value: new BooleanField({initial: false})
                }),
                force: new SchemaField({
                  value: new BooleanField({initial: false})
                }),
                endurance: new SchemaField({
                  value: new BooleanField({initial: false})
                })
              })
            }),
            bete: new SchemaField({
              caracteristiques: new SchemaField({
                hargne: new SchemaField({
                  value: new BooleanField({initial: true})
                }),
                combat: new SchemaField({
                  value: new BooleanField({initial: false})
                }),
                instinct: new SchemaField({
                  value: new BooleanField({initial: false})
                })
              })
            }),
            machine: new SchemaField({
              caracteristiques: new SchemaField({
                tir: new SchemaField({
                  value: new BooleanField({initial: false})
                }),
                savoir: new SchemaField({
                  value: new BooleanField({initial: false})
                }),
                technique: new SchemaField({
                  value: new BooleanField({initial: false})
                })
              })
            }),
            dame: new SchemaField({
              caracteristiques: new SchemaField({
                aura: new SchemaField({
                  value: new BooleanField({initial: false})
                }),
                parole: new SchemaField({
                  value: new BooleanField({initial: false})
                }),
                sangFroid: new SchemaField({
                  value: new BooleanField({initial: true})
                })
              })
            }),
            masque: new SchemaField({
              caracteristiques: new SchemaField({
                discretion: new SchemaField({
                  value: new BooleanField({initial: false})
                }),
                dexterite: new SchemaField({
                  value: new BooleanField({initial: false})
                }),
                perception: new SchemaField({
                  value: new BooleanField({initial: false})
                })
              })
            })
          }),
          evolutions: new SchemaField({
            espoir: new NumberField({initial: 0}),
            difficulte: new NumberField({initial: 5}),
            aspects: new SchemaField({
              chair: new SchemaField({
                caracteristiques: new SchemaField({
                  deplacement: new SchemaField({
                    value: new BooleanField({initial: false})
                  }),
                  force: new SchemaField({
                    value: new BooleanField({initial: false})
                  }),
                  endurance: new SchemaField({
                    value: new BooleanField({initial: false})
                  })
                })
              }),
              bete: new SchemaField({
                caracteristiques: new SchemaField({
                  hargne: new SchemaField({
                    value: new BooleanField({initial: true})
                  }),
                  combat: new SchemaField({
                    value: new BooleanField({initial: false})
                  }),
                  instinct: new SchemaField({
                    value: new BooleanField({initial: false})
                  })
                })
              }),
              machine: new SchemaField({
                caracteristiques: new SchemaField({
                  tir: new SchemaField({
                    value: new BooleanField({initial: false})
                  }),
                  savoir: new SchemaField({
                    value: new BooleanField({initial: false})
                  }),
                  technique: new SchemaField({
                    value: new BooleanField({initial: false})
                  })
                })
              }),
              dame: new SchemaField({
                caracteristiques: new SchemaField({
                  aura: new SchemaField({
                    value: new BooleanField({initial: false})
                  }),
                  parole: new SchemaField({
                    value: new BooleanField({initial: false})
                  }),
                  sangFroid: new SchemaField({
                    value: new BooleanField({initial: true})
                  })
                })
              }),
              masque: new SchemaField({
                caracteristiques: new SchemaField({
                  discretion: new SchemaField({
                    value: new BooleanField({initial: false})
                  }),
                  dexterite: new SchemaField({
                    value: new BooleanField({initial: false})
                  }),
                  perception: new SchemaField({
                    value: new BooleanField({initial: false})
                  })
                })
              })
            })
          })
        }),
      }),
      c2038Necromancer: new SchemaField({
        sarcophage: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          bonus: new SchemaField({
            paliers: new NumberField({initial: 7}),
            liste: new SchemaField({
              b0: new SchemaField({
                pg: new SchemaField({
                  min: new NumberField({initial: 0}),
                  max: new NumberField({initial: 49})
                }),
                offert: new StringField()
              }),
              b1: new SchemaField({
                pg: new SchemaField({
                  min: new NumberField({initial: 50}),
                  max: new NumberField({initial: 99})
                }),
                offert: new StringField()
              }),
              b2: new SchemaField({
                pg: new SchemaField({
                  min: new NumberField({initial: 100}),
                  max: new NumberField({initial: 149})
                }),
                offert: new StringField()
              }),
              b3: new SchemaField({
                pg: new SchemaField({
                  min: new NumberField({initial: 150}),
                  max: new NumberField({initial: 199})
                }),
                offert: new StringField()
              }),
              b4: new SchemaField({
                pg: new SchemaField({
                  min: new NumberField({initial: 200}),
                  max: new NumberField({initial: 249})
                }),
                offert: new StringField()
              }),
              b5: new SchemaField({
                pg: new SchemaField({
                  min: new NumberField({initial: 250}),
                  max: new NumberField({initial: 299})
                }),
                offert: new StringField()
              }),
              b6: new SchemaField({
                pg: new SchemaField({
                  min: new NumberField({initial: 300})
                }),
                offert: new StringField()
              })
            })
          }),
          textarea: new SchemaField({
            b0: new NumberField({initial: 50}),
            b1: new NumberField({initial: 50}),
            b2: new NumberField({initial: 50}),
            b3: new NumberField({initial: 50}),
            b4: new NumberField({initial: 50}),
            b5: new NumberField({initial: 50}),
            b6: new NumberField({initial: 50})
          })
        })
      }),
      c2038Sorcerer: new SchemaField({
        morph: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          energie: new NumberField({initial: 10}),
          activation: new StringField({initial: "aucune"}),
          duree: new StringField(),
          espoir: new NumberField({initial: 1}),
          capacites: new NumberField({initial: 3}),
          vol: new SchemaField({
            description: new StringField()
          }),
          phase: new SchemaField({
            description: new StringField(),
            activation: new StringField({initial: "deplacement"}),
            energie: new NumberField({initial: 5}),
            duree: new StringField(),
            niveau2: new SchemaField({
              acces: new BooleanField({initial: false}),
              activation: new StringField({initial: "aucune"}),
              energie: new NumberField({initial: 8}),
              duree: new StringField()
            })
          }),
          etirement: new SchemaField({
            description: new StringField(),
            portee: new StringField(),
            bonus: new NumberField({initial: 3})
          }),
          metal: new SchemaField({
            bonus: new SchemaField({
              champDeForce: new NumberField({initial: 2})
            })
          }),
          fluide: new SchemaField({
            bonus: new SchemaField({
              reaction: new NumberField({initial: 2}),
              defense: new NumberField({initial: 2})
            })
          }),
          polymorphie: new SchemaField({
            description: new StringField(),
            griffe: new SchemaField({
              portee: new StringField({initial: "contact"}),
              type: new StringField({initial: "contact"}),
              degats: new SchemaField({
                dice: new NumberField({initial: 2}),
                fixe: new NumberField({initial: 0})
              }),
              violence: new SchemaField({
                dice: new NumberField({initial: 1}),
                fixe: new NumberField({initial: 0})
              }),
              effets: new SchemaField({
                liste: new ArrayField(new StringField()),
                raw: new ArrayField(new StringField()),
                custom: new ArrayField(new ObjectField()),
                chargeur: new NumberField({initial: null})
              })
            }),
            lame: new SchemaField({
              portee: new StringField({initial: "contact"}),
              type: new StringField({initial: "contact"}),
              degats: new SchemaField({
                dice: new NumberField({initial: 2}),
                fixe: new NumberField({initial: 0})
              }),
              violence: new SchemaField({
                dice: new NumberField({initial: 1}),
                fixe: new NumberField({initial: 0})
              }),
              effets: new SchemaField({
                liste: new ArrayField(new StringField()),
                raw: new ArrayField(new StringField()),
                custom: new ArrayField(new ObjectField()),
                chargeur: new NumberField({initial: null})
              })
            }),
            canon: new SchemaField({
              portee: new StringField({initial: "moyenne"}),
              type: new StringField({initial: "distance"}),
              energie: new NumberField({initial: 1}),
              degats: new SchemaField({
                dice: new NumberField({initial: 3}),
                fixe: new NumberField({initial: 3})
              }),
              violence: new SchemaField({
                dice: new NumberField({initial: 3}),
                fixe: new NumberField({initial: 3})
              }),
              effets: new SchemaField({
                liste: new ArrayField(new StringField()),
                raw: new ArrayField(new StringField(), {initial: ["destructeur", "meurtrier", "ultraviolence"]}),
                custom: new ArrayField(new ObjectField()),
                chargeur: new NumberField({initial: null})
              })
            })
          }),
          textarea: new SchemaField({
            duree: new NumberField({initial: 50}),
            vol: new NumberField({initial: 130}),
            phase: new NumberField({initial: 115}),
            phaseDuree: new NumberField({initial: 50}),
            phaseDuree2: new NumberField({initial: 50}),
            etirement: new NumberField({initial: 130}),
            etirementPortee: new NumberField({initial: 50}),
            polymorphie: new NumberField({initial: 205})
          }),
          evolutions: new SchemaField({
            energie: new NumberField({initial: 10}),
            activation: new StringField({initial: "aucune"}),
            duree: new StringField(),
            espoir: new NumberField({initial: 1}),
            capacites: new NumberField({initial: 3}),
            vol: new SchemaField({
              description: new StringField()
            }),
            phase: new SchemaField({
              description: new StringField(),
              activation: new StringField({initial: "deplacement"}),
              energie: new NumberField({initial: 5}),
              duree: new StringField(),
              niveau2: new SchemaField({
                acces: new BooleanField({initial: false}),
                activation: new StringField({initial: "aucune"}),
                energie: new NumberField({initial: 8}),
                duree: new StringField()
              })
            }),
            etirement: new SchemaField({
              description: new StringField(),
              portee: new StringField(),
              bonus: new NumberField({initial: 3})
            }),
            metal: new SchemaField({
              bonus: new SchemaField({
                champDeForce: new NumberField({initial: 2})
              })
            }),
            fluide: new SchemaField({
              bonus: new SchemaField({
                reaction: new NumberField({initial: 2}),
                defense: new NumberField({initial: 2})
              })
            }),
            polymorphie: new SchemaField({
              description: new StringField(),
              griffe: new SchemaField({
                portee: new StringField({initial: "contact"}),
                type: new StringField({initial: "contact"}),
                degats: new SchemaField({
                  dice: new NumberField({initial: 2}),
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
              }),
              lame: new SchemaField({
                portee: new StringField({initial: "contact"}),
                type: new StringField({initial: "contact"}),
                degats: new SchemaField({
                  dice: new NumberField({initial: 2}),
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
              }),
              canon: new SchemaField({
                portee: new StringField({initial: "moyenne"}),
                type: new StringField({initial: "distance"}),
                energie: new NumberField({initial: 1}),
                degats: new SchemaField({
                  dice: new NumberField({initial: 3}),
                  fixe: new NumberField({initial: 3})
                }),
                violence: new SchemaField({
                  dice: new NumberField({initial: 3}),
                  fixe: new NumberField({initial: 3})
                }),
                effets: new SchemaField({
                  liste: new ArrayField(new StringField()),
                  raw: new ArrayField(new StringField(), {initial: ["destructeur", "meurtrier", "ultraviolence"]}),
                  custom: new ArrayField(new ObjectField())
                })
              })
            }),
            textarea: new SchemaField({
              duree: new NumberField({initial: 50}),
              vol: new NumberField({initial: 130}),
              phase: new NumberField({initial: 115}),
              phaseDuree: new NumberField({initial: 50}),
              phaseDuree2: new NumberField({initial: 50}),
              etirement: new NumberField({initial: 130}),
              etirementPortee: new NumberField({initial: 50}),
              polymorphie: new NumberField({initial: 205})
            })
          })
        })
      }),
      codex: new SchemaField({
        companions: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          activation: new StringField({initial: "tour6Sec"}),
          duree: new StringField(),
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
            token: new StringField({initial: "systems/knight/assets/lion.jpg"}),
            PG: new NumberField({initial: 60}),
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
              bonus: new ArrayField(new NumberField()),
              malus: new ArrayField(new NumberField())
            }),
            defense: new SchemaField({
              base: new NumberField({initial: 4}),
              bonus: new ArrayField(new NumberField()),
              malus: new ArrayField(new NumberField())
            }),
            reaction: new SchemaField({
              base: new NumberField({initial: 4}),
              bonus: new ArrayField(new NumberField()),
              malus: new ArrayField(new NumberField())
            }),
            armure: new SchemaField({
              base: new NumberField({initial: 60}),
              bonus: new ArrayField(new NumberField()),
              malus: new ArrayField(new NumberField())
            }),
            energie: new SchemaField({
              base: new NumberField({initial: 0}),
              bonus: new ArrayField(new NumberField()),
              malus: new ArrayField(new NumberField())
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
              distance: new ArrayField(new ObjectField())
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
            token: new StringField({initial: "systems/knight/assets/wolf.jpg"}),
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
            token: new StringField({initial: "systems/knight/assets/crow.jpg"}),
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
              base: new NumberField({initial: 2})
            }),
            defense: new SchemaField({
              base: new NumberField({initial: 2})
            }),
            reaction: new SchemaField({
              base: new NumberField({initial: 2})
            }),
            cohesion: new SchemaField({
              base: new NumberField({initial: 50})
            }),
            debordement: new SchemaField({
              base: new NumberField({initial: 2})
            }),
            energie: new SchemaField({
              base: new NumberField({initial: 0})
            }),
            initiative: new SchemaField({
              value: new NumberField({initial: 0}),
              fixe: new NumberField({initial: 1})
            })
          }),
          specialEvolutions: new SchemaField({
            activation: new StringField({initial: "tour6Sec"}),
            duree: new StringField(),
            adistribuer: new NumberField({initial: 1}),
            description: new StringField(),
            energie: new SchemaField({
              base: new NumberField({initial: 16}),
              prolonger: new NumberField({initial: 8})
            }),
            lion: new SchemaField({
              label: new StringField(),
              aspects: new SchemaField({
                value: new NumberField({initial: 5}),
                max: new NumberField({initial: 2})
              }),
              ae: new NumberField({initial: 2}),
              pg: new NumberField({initial: 60})
            }),
            wolf: new SchemaField({
              label: new StringField(),
              aspects: new SchemaField({
                value: new NumberField({initial: 3}),
                max: new NumberField({initial: 2})
              }),
              ae: new NumberField({initial: 1}),
              bonus: new NumberField({initial: 2})
            }),
            crow: new SchemaField({
              label: new StringField(),
              aspects: new SchemaField({
                value: new NumberField({initial: 2}),
                max: new NumberField({initial: 2})
              }),
              cohesion: new NumberField({initial: 50}),
              debordement: new NumberField({initial: 2}),
              cdf: new NumberField({initial: 2})
            }),
            textarea: new SchemaField({
              duree: new NumberField({initial: 50})
            })
          })
        })
      }),
      atlas: new SchemaField({
        ascension: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          duree: new StringField(),
          activation: new StringField({initial: "tour6Sec"}),
          portee: new StringField({initial: "contact"}),
          impregnation: new NumberField({initial: 3}),
          sansarmure: new SchemaField({
            acces: new BooleanField({initial: false})
          }),
          special: new SchemaField({
            atlas: new StringField({initial: "impregnation"})
          }),
          energie: new SchemaField({
            min: new NumberField({initial: 10}),
            max: new NumberField({initial: 50}),
            limite: new NumberField({initial: 0})
          }),
          textarea: new SchemaField({
            duree: new NumberField({initial: 75})
          }),
          evolutions: new SchemaField({
            duree: new StringField(),
            activation: new StringField({initial: "Tour6Sec"}),
            portee: new StringField({initial: "contact"}),
            impregnation: new NumberField({initial: 3}),
            sansarmure: new SchemaField({
              acces: new BooleanField({initial: false}),
              label: new StringField()
            }),
            special: new SchemaField({
              atlas: new StringField({initial: "impregnation"})
            }),
            energie: new SchemaField({
              min: new NumberField({initial: 10}),
              max: new NumberField({initial: 50}),
              limite: new NumberField({initial: 0})
            }),
            textarea: new SchemaField({
              duree: new NumberField({initial: 75})
            })
          })
        }),
        forward: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          duree: new StringField(),
          activation: new StringField({initial: "aucune"}),
          special: new SchemaField({
            atlas: new StringField({initial: "contrecoups"})
          }),
          energie: new NumberField({initial: 3}),
          textarea: new SchemaField({
            duree: new NumberField({initial: 50})
          }),
          evolutions: new SchemaField({
            duree: new StringField(),
            activation: new StringField({initial: "aucune"}),
            special: new SchemaField({
              atlas: new StringField({initial: "contrecoups"})
            }),
            energie: new NumberField({initial: 3}),
            textarea: new SchemaField({
              duree: new NumberField({initial: 50})
            })
          })
        }),
        record: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          duree: new StringField(),
          activation: new StringField({initial: "aucune"}),
          special: new SchemaField({
            atlas: new StringField({initial: "contrecoups"})
          }),
          energie: new NumberField({initial: 12}),
          textarea: new SchemaField({
            duree: new NumberField({initial: 50})
          }),
          evolutions: new SchemaField({
            duree: new StringField(),
            activation: new StringField({initial: "aucune"}),
            special: new SchemaField({
              atlas: new StringField({initial: "contrecoups"})
            }),
            energie: new NumberField({initial: 12}),
            textarea: new SchemaField({
              duree: new NumberField({initial: 50})
            })
          })
        }),
        rewind: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          duree: new StringField(),
          activation: new StringField({initial: "aucune"}),
          special: new SchemaField({
            atlas: new StringField({initial: "contrecoups"})
          }),
          energie: new NumberField({initial: 15}),
          textarea: new SchemaField({
            duree: new NumberField({initial: 50})
          }),
          evolutions: new SchemaField({
            duree: new StringField(),
            activation: new StringField({initial: "aucune"}),
            special: new SchemaField({
              atlas: new StringField({initial: "contrecoups"})
            }),
            energie: new NumberField({initial: 15}),
            textarea: new SchemaField({
              duree: new NumberField({initial: 50})
            })
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
          special: new SchemaField({
            atlas: new StringField({initial: "impregnation"})
          }),
          energie: new SchemaField({
            base: new NumberField({initial: 3}),
            prolonger: new NumberField({initial: 1})
          }),
          textarea: new SchemaField({
            duree: new NumberField({initial: 50})
          }),
          evolutions: new SchemaField({
            activation: new StringField({initial: "aucune"}),
            duree: new StringField(),
            portee: new StringField({initial: "courte"}),
            nombre: new NumberField({initial: 2}),
            impregnation: new NumberField({initial: 1}),
            energie: new SchemaField({
              base: new NumberField({initial: 3}),
              prolonger: new NumberField({initial: 1})
            }),
            textarea: new SchemaField({
              duree: new NumberField({initial: 50})
            })
          })
        })
      }),
      atlasSpecial: new SchemaField({
        illumination: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          activation: new StringField({initial: "deplacement"}),
          duree: new StringField(),
          nbreCapacitesSelected: new NumberField({initial: 3}),
          nbreCapacitesTotale: new NumberField({initial: 7}),
          blaze: new SchemaField({
            description: new StringField(),
            degats: new NumberField({initial: 2}),
            violence: new NumberField({initial: 2}),
            portee: new StringField({initial: "contact"}),
            espoir: new SchemaField({
              base: new NumberField({initial: 2}),
              prolonger: new NumberField({initial: 1})
            })
          }),
          candle: new SchemaField({
            description: new StringField(),
            portee: new StringField({initial: "contact"}),
            espoir: new SchemaField({
              dice: new NumberField({initial: 1}),
              face: new NumberField({initial: 3})
            })
          }),
          beacon: new SchemaField({
            description: new StringField(),
            bonus: new NumberField({initial: 2}),
            portee: new StringField({initial: "courte"}),
            espoir: new SchemaField({
              base: new NumberField({initial: 2}),
              prolonger: new NumberField({initial: 1})
            })
          }),
          torch: new SchemaField({
            description: new StringField(),
            bonus: new NumberField({initial: 2}),
            portee: new StringField({initial: "courte"}),
            espoir: new SchemaField({
              base: new NumberField({initial: 3}),
              prolonger: new NumberField({initial: 1})
            })
          }),
          projector: new SchemaField({
            description: new StringField(),
            portee: new StringField({initial: "courte"}),
            espoir: new SchemaField({
              base: new NumberField({initial: 3}),
              prolonger: new NumberField({initial: 1})
            })
          }),
          lighthouse: new SchemaField({
            description: new StringField(),
            portee: new StringField({initial: "courte"}),
            espoir: new SchemaField({
              base: new NumberField({initial: 4}),
              prolonger: new NumberField({initial: 1})
            })
          }),
          lantern: new SchemaField({
            description: new StringField(),
            portee: new StringField({initial: "courte"}),
            degats: new NumberField({initial: 1}),
            effets: new SchemaField({
              raw: new ArrayField(new StringField(), {initial: ["esperance"]}),
              liste: new ArrayField(new StringField()),
              custom: new ArrayField(new ObjectField()),
              chargeur: new NumberField({initial: null})
            }),
            espoir: new SchemaField({
              base: new NumberField({initial: 4}),
              prolonger: new NumberField({initial: 1})
            })
          }),
          textarea: new SchemaField({
            duree: new NumberField({initial: 50}),
            blaze: new NumberField({initial: 175}),
            candle: new NumberField({initial: 125}),
            beacon: new NumberField({initial: 110}),
            torch: new NumberField({initial: 175}),
            projector: new NumberField({initial: 190}),
            lighthouse: new NumberField({initial: 140}),
            lantern: new NumberField({initial: 120})
          }),
          evolutions: new SchemaField({
            activation: new StringField({initial: "deplacement"}),
            duree: new StringField(),
            nbreCapacitesSelected: new NumberField({initial: 3}),
            nbreCapacitesTotale: new NumberField({initial: 7}),
            blaze: new SchemaField({
              description: new StringField(),
              degats: new NumberField({initial: 2}),
              violence: new NumberField({initial: 2}),
              portee: new StringField({initial: "contact"}),
              espoir: new SchemaField({
                base: new NumberField({initial: 2}),
                prolonger: new NumberField({initial: 1})
              })
            }),
            candle: new SchemaField({
              description: new StringField(),
              portee: new StringField({initial: "contact"}),
              espoir: new NumberField({initial: 1})
            }),
            beacon: new SchemaField({
              description: new StringField(),
              bonus: new NumberField({initial: 2}),
              portee: new StringField({initial: "courte"}),
              espoir: new SchemaField({
                base: new NumberField({initial: 2}),
                prolonger: new NumberField({initial: 1})
              })
            }),
            torch: new SchemaField({
              description: new StringField(),
              bonus: new NumberField({initial: 2}),
              portee: new StringField({initial: "courte"}),
              espoir: new SchemaField({
                base: new NumberField({initial: 3}),
                prolonger: new NumberField({initial: 1})
              })
            }),
            projector: new SchemaField({
              description: new StringField(),
              portee: new StringField({initial: "courte"}),
              espoir: new SchemaField({
                base: new NumberField({initial: 3}),
                prolonger: new NumberField({initial: 1})
              })
            }),
            lighthouse: new SchemaField({
              description: new StringField(),
              portee: new StringField({initial: "courte"}),
              espoir: new SchemaField({
                base: new NumberField({initial: 4}),
                prolonger: new NumberField({initial: 1})
              })
            }),
            lantern: new SchemaField({
              description: new StringField(),
              portee: new StringField({initial: "courte"}),
              degats: new NumberField({initial: 1}),
              effets: new SchemaField({
                raw: new ArrayField(new StringField(), {initial: ["esperance"]}),
                liste: new ArrayField(new StringField()),
                custom: new ArrayField(new ObjectField())
              }),
              espoir: new SchemaField({
                base: new NumberField({initial: 4}),
                prolonger: new NumberField({initial: 1})
              })
            }),
            textarea: new SchemaField({
              duree: new NumberField({initial: 50}),
              blaze: new NumberField({initial: 175}),
              candle: new NumberField({initial: 125}),
              beacon: new NumberField({initial: 110}),
              torch: new NumberField({initial: 175}),
              projector: new NumberField({initial: 190}),
              lighthouse: new NumberField({initial: 140}),
              lantern: new NumberField({initial: 120})
            })
          })
        }),
        rage: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          activation: new StringField({initial: "aucune"}),
          duree: new StringField(),
          espoir: new NumberField({initial: 0}),
          aspects: new SchemaField({}),
          nourri: new SchemaField({
            label: new StringField(),
            description: new StringField(),
            humain: new SchemaField({
              hostile: new SchemaField({
                dice: new NumberField({initial: 0}),
                face: new NumberField({initial: 0}),
                fixe: new NumberField({initial: 1})
              }),
              salopard: new SchemaField({
                dice: new NumberField({initial: 1}),
                face: new NumberField({initial: 3}),
                fixe: new NumberField({initial: 0})
              }),
              patron: new SchemaField({
                dice: new NumberField({initial: 1}),
                face: new NumberField({initial: 6}),
                fixe: new NumberField({initial: 3})
              }),
              bande: new SchemaField({
                dice: new NumberField({initial: 1}),
                face: new NumberField({initial: 6}),
                fixe: new NumberField({initial: 0})
              })
            }),
            anatheme: new SchemaField({
              hostile: new SchemaField({
                dice: new NumberField({initial: 1}),
                face: new NumberField({initial: 6}),
                fixe: new NumberField({initial: 0})
              }),
              salopard: new SchemaField({
                dice: new NumberField({initial: 1}),
                face: new NumberField({initial: 6}),
                fixe: new NumberField({initial: 3})
              }),
              patron: new SchemaField({
                dice: new NumberField({initial: 1}),
                face: new NumberField({initial: 6}),
                fixe: new NumberField({initial: 6})
              }),
              bande: new SchemaField({
                dice: new NumberField({initial: 2}),
                face: new NumberField({initial: 6}),
                fixe: new NumberField({initial: 0})
              })
            })
          }),
          colere: new SchemaField({
            label: new StringField(),
            description: new StringField(),
            degats: new StringField({initial: "bete"}),
            violence: new StringField({initial: "bete"}),
            egide: new NumberField({initial: 3}),
            defense: new NumberField({initial: 3}),
            reaction: new NumberField({initial: 3}),
            subis: new NumberField({initial: 0}),
            combosBonus: new SchemaField({
              has: new BooleanField({initial: false}),
              liste: new SchemaField({
                c1: new StringField(),
                c2: new StringField(),
                c3: new StringField()
              })
            }),
            combosInterdits: new SchemaField({
              has: new BooleanField({initial: false}),
              liste: new SchemaField({
                c1: new StringField(),
                c2: new StringField(),
                c3: new StringField(),
                c4: new StringField(),
                c5: new StringField(),
                c6: new StringField()
              })
            })
          }),
          rage: new SchemaField({
            label: new StringField(),
            description: new StringField(),
            degats: new StringField({initial: "bete"}),
            violence: new StringField({initial: "bete"}),
            egide: new NumberField({initial: 3}),
            defense: new NumberField({initial: 9}),
            reaction: new NumberField({initial: 9}),
            subis: new NumberField({initial: 0}),
            combosBonus: new SchemaField({
              has: new BooleanField({initial: false}),
              liste: new SchemaField({
                c1: new StringField(),
                c2: new StringField(),
                c3: new StringField()
              })
            }),
            combosInterdits: new SchemaField({
              has: new BooleanField({initial: true}),
              liste: new SchemaField({
                c1: new StringField({initial: "sangFroid"}),
                c2: new StringField({initial: "parole"}),
                c3: new StringField({initial: "savoir"}),
                c4: new StringField({initial: "technique"}),
                c5: new StringField({initial: "discretion"}),
                c6: new StringField()
              })
            })
          }),
          fureur: new SchemaField({
            label: new StringField(),
            description: new StringField(),
            degats: new StringField({initial: "bete"}),
            violence: new StringField({initial: "bete"}),
            egide: new NumberField({initial: 6}),
            defense: new NumberField({initial: 9}),
            reaction: new NumberField({initial: 9}),
            subis: new NumberField({initial: 1}),
            combosBonus: new SchemaField({
              has: new BooleanField({initial: true}),
              liste: new SchemaField({
                c1: new StringField({initial: "hargne"}),
                c2: new StringField(),
                c3: new StringField()
              })
            }),
            combosInterdits: new SchemaField({
              has: new BooleanField({initial: true}),
              liste: new SchemaField({
                c1: new StringField({initial: "sangFroid"}),
                c2: new StringField({initial: "parole"}),
                c3: new StringField({initial: "savoir"}),
                c4: new StringField({initial: "technique"}),
                c5: new StringField({initial: "discretion"}),
                c6: new StringField()
              })
            })
          }),
          blaze: new SchemaField({
            label: new StringField(),
            description: new StringField(),
            degats: new NumberField({initial: 2}),
            violence: new NumberField({initial: 2}),
            portee: new StringField({initial: "contact"}),
            espoir: new SchemaField({
              base: new NumberField({initial: 2}),
              prolonger: new NumberField({initial: 1})
            })
          }),
          textarea: new SchemaField({
            duree: new NumberField({initial: 55}),
            nourri: new NumberField({initial: 55}),
            rage: new NumberField({initial: 210}),
            fureur: new NumberField({initial: 325}),
            blaze: new NumberField({initial: 180})
          }),
          evolutions: new SchemaField({
            activation: new StringField({initial: "aucune"}),
            duree: new StringField(),
            espoir: new NumberField({initial: 0}),
            aspects: new SchemaField({}),
            nourri: new SchemaField({
              label: new StringField(),
              description: new StringField(),
              humain: new SchemaField({
                hostile: new SchemaField({
                  dice: new NumberField({initial: 0}),
                  face: new NumberField({initial: 0}),
                  fixe: new NumberField({initial: 1})
                }),
                salopard: new SchemaField({
                  dice: new NumberField({initial: 1}),
                  face: new NumberField({initial: 3}),
                  fixe: new NumberField({initial: 0})
                }),
                patron: new SchemaField({
                  dice: new NumberField({initial: 1}),
                  face: new NumberField({initial: 6}),
                  fixe: new NumberField({initial: 3})
                }),
                bande: new SchemaField({
                  dice: new NumberField({initial: 1}),
                  face: new NumberField({initial: 6}),
                  fixe: new NumberField({initial: 0})
                })
              }),
              anatheme: new SchemaField({
                hostile: new SchemaField({
                  dice: new NumberField({initial: 1}),
                  face: new NumberField({initial: 6}),
                  fixe: new NumberField({initial: 0})
                }),
                salopard: new SchemaField({
                  dice: new NumberField({initial: 1}),
                  face: new NumberField({initial: 6}),
                  fixe: new NumberField({initial: 3})
                }),
                patron: new SchemaField({
                  dice: new NumberField({initial: 1}),
                  face: new NumberField({initial: 6}),
                  fixe: new NumberField({initial: 6})
                }),
                bande: new SchemaField({
                  dice: new NumberField({initial: 2}),
                  face: new NumberField({initial: 6}),
                  fixe: new NumberField({initial: 0})
                })
              })
            }),
            colere: new SchemaField({
              label: new StringField(),
              description: new StringField(),
              degats: new StringField({initial: "bete"}),
              violence: new StringField({initial: "bete"}),
              egide: new NumberField({initial: 3}),
              defense: new NumberField({initial: 3}),
              reaction: new NumberField({initial: 3}),
              subis: new NumberField({initial: 0}),
              combosBonus: new SchemaField({
                has: new BooleanField({initial: false}),
                liste: new SchemaField({
                  c1: new StringField(),
                  c2: new StringField(),
                  c3: new StringField()
                })
              }),
              combosInterdits: new SchemaField({
                has: new BooleanField({initial: false}),
                liste: new SchemaField({
                  c1: new StringField(),
                  c2: new StringField(),
                  c3: new StringField(),
                  c4: new StringField(),
                  c5: new StringField(),
                  c6: new StringField()
                })
              })
            }),
            rage: new SchemaField({
              label: new StringField(),
              description: new StringField(),
              degats: new StringField({initial: "bete"}),
              violence: new StringField({initial: "bete"}),
              egide: new NumberField({initial: 3}),
              defense: new NumberField({initial: 9}),
              reaction: new NumberField({initial: 9}),
              subis: new NumberField({initial: 0}),
              combosBonus: new SchemaField({
                has: new BooleanField({initial: false}),
                liste: new SchemaField({
                  c1: new StringField(),
                  c2: new StringField(),
                  c3: new StringField()
                })
              }),
              combosInterdits: new SchemaField({
                has: new BooleanField({initial: true}),
                liste: new SchemaField({
                  c1: new StringField({initial: "sangFroid"}),
                  c2: new StringField({initial: "parole"}),
                  c3: new StringField({initial: "savoir"}),
                  c4: new StringField({initial: "technique"}),
                  c5: new StringField({initial: "discretion"}),
                  c6: new StringField()
                })
              })
            }),
            fureur: new SchemaField({
              label: new StringField(),
              description: new StringField(),
              degats: new StringField({initial: "bete"}),
              violence: new StringField({initial: "bete"}),
              egide: new NumberField({initial: 6}),
              defense: new NumberField({initial: 9}),
              reaction: new NumberField({initial: 9}),
              subis: new NumberField({initial: 1}),
              combosBonus: new SchemaField({
                has: new BooleanField({initial: true}),
                liste: new SchemaField({
                  c1: new StringField({initial: "hargne"}),
                  c2: new StringField(),
                  c3: new StringField()
                })
              }),
              combosInterdits: new SchemaField({
                has: new BooleanField({initial: true}),
                liste: new SchemaField({
                  c1: new StringField({initial: "sangFroid"}),
                  c2: new StringField({initial: "parole"}),
                  c3: new StringField({initial: "savoir"}),
                  c4: new StringField({initial: "technique"}),
                  c5: new StringField({initial: "discretion"}),
                  c6: new StringField()
                })
              })
            }),
            blaze: new SchemaField({
              label: new StringField(),
              description: new StringField(),
              degats: new NumberField({initial: 2}),
              violence: new NumberField({initial: 2}),
              portee: new StringField({initial: "contact"}),
              espoir: new SchemaField({
                base: new NumberField({initial: 2}),
                prolonger: new NumberField({initial: 1})
              })
            }),
            textarea: new SchemaField({
              duree: new NumberField({initial: 55}),
              nourri: new NumberField({initial: 55}),
              rage: new NumberField({initial: 10}),
              colere: new NumberField({initial: 210}),
              fureur: new NumberField({initial: 325}),
              blaze: new NumberField({initial: 180})
            })
          })
        })
      })
    };
  }

  get actor() {
    return this?.parent?.parent?.actor ?? undefined;
  }

  get morph() {
    return this.selected.morph;
  }

  get type() {
    return this.selected.type;
  }

  get capaciteUltime() {
    let result = undefined;

    if(this.actor) {
      const ultime = this.actor.items.find(itm => itm.type === 'capaciteultime');

      if(ultime) result = ultime;
    }

    return result;
  }

  prepareLabels() {
    const capacites = this.selected;
    const allLabels = getAllEffects();

    if(capacites.companions) {
      const lionWpn = capacites.companions.lion.armes.contact.coups;

      Object.defineProperty(lionWpn.effets, 'liste', {
        value: listEffects(lionWpn.effets.raw, lionWpn.effets.custom, allLabels),
        writable:true,
        enumerable:true,
        configurable:true
      });

    }
  }

  prepareData() {
    if(this.morph) {
      const choisi = this?.morph?.choisi ?? {};
      const active = this?.morph?.active ?? {};

      const nbreChoisi = Object.keys(choisi).filter(key => (key !== 'polymorphieLame' && key !== 'polymorphieGriffe' && key !== 'polymorphieCanon' && key !== 'polymorphieLame2' && key !== 'polymorphieGriffe2' && key !== 'polymorphieCanon2' && key !== 'fait') && this.morph.choisi[key]).length;
      const nbrePolymorphieGuerre = Object.keys(active).filter(key => (key === 'polymorphieLame' || key === 'polymorphieGriffe' || key === 'polymorphieCanon' || key === 'polymorphieLame2' || key === 'polymorphieGriffe2' || key === 'polymorphieCanon2') && this.morph.active[key]).length;

      Object.defineProperty(this.selected.morph.polymorphie, 'max', {
        value: nbrePolymorphieGuerre === 2 ? true : false,
        writable:true,
        enumerable:true,
        configurable:true
      });

      if(this.selected.morph.choisi) {
        Object.defineProperty(this.selected.morph.choisi, 'fait', {
          value: nbreChoisi === this.morph.capacites ? true : false,
          writable:true,
          enumerable:true,
          configurable:true
        });
      }
    }

    if(this.type && this.actor && this.capaciteUltime) {
      const ultime = this.capaciteUltime;
      const hasPassive = ultime.system?.passives?.capacites?.actif ?? false;
      const hasUltimeType = hasPassive ? ultime.system?.passives?.capacites?.type?.actif ?? false : false;

      if(hasUltimeType) {
        Object.defineProperty(this.selected.type, 'legend', {
          value: true,
          writable:true,
          enumerable:true,
          configurable:true
        });
      }
    }

    this.prepareLabels();
  }

  prepareLabels() {
    const selected = this.selected;
    const ghost = selected?.ghost ?? undefined;

    if(ghost) {
      let interruption = '';

      if(ghost.interruption.actif) interruption = game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.GHOST.Interruption');
      else interruption = game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.GHOST.NoInterruption');

      Object.defineProperty(ghost.interruption, 'label', {
        value: interruption,
        writable:true,
        enumerable:true,
        configurable:true
      });
    }
  }
}