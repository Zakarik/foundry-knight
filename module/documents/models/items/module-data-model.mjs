import {
  getArmor,
  createSheet,
  deleteTokens,
  spawnTokenRightOfActor,
  getAllEffects,
  listEffects,
} from "../../../helpers/common.mjs";
import PatchBuilder from "../../../utils/patchBuilder.mjs";
import ArmureAPI from "../../../utils/armureAPI.mjs";
import ItemSpecialEffectsInternalMixinModel from "../base/mixin-item-specialEffects-internal-model.mjs";
import ArmeInternalMixinModel from "../base/mixin-arme-internal-model.mjs";
import BaseItemDataModel from "../base/base-item-data-model.mjs";
import { combine, prefixPath } from "../../../utils/field-builder.mjs";

export class ModuleDataModel extends ArmeInternalMixinModel(
  ItemSpecialEffectsInternalMixinModel(BaseItemDataModel),
) {
  static get baseDefinition() {
    const base = super.baseDefinition;

    const specific = {
      id: ["str"],
      active: [
        "schema",
        {
          base: ["bool", { initial: false }],
          pnj: ["bool", { initial: false }],
          pnjName: ["str"],
        },
      ],
      categorie: ["str", { initial: "effets" }],
      listes: ["obj"],
      isLion: ["bool", { initial: false }],
      slots: [
        "schema",
        {
          tete: ["num", { initial: 0, nullable: false, integer: true }],
          torse: ["num", { initial: 0, nullable: false, integer: true }],
          brasGauche: ["num", { initial: 0, nullable: false, integer: true }],
          brasDroit: ["num", { initial: 0, nullable: false, integer: true }],
          jambeGauche: ["num", { initial: 0, nullable: false, integer: true }],
          jambeDroite: ["num", { initial: 0, nullable: false, integer: true }],
        },
      ],
      niveau: [
        "schema",
        {
          value: ["num", { initial: 1, nullable: false, integer: true }],
          max: ["num", { initial: 1, nullable: false, integer: true }],
          actuel: ["obj"],
          details: [
            "tObj",
            [
              "schema",
              {
                whoActivate: ["str", { initial: "" }],
                addOrder: ["num", { initial: 0 }],
                permanent: ["bool", { initial: false }],
                rarete: ["str", { initial: "standard" }],
                prix: ["num", { initial: 0 }],
                activation: ["str", { initial: "aucune" }],
                duree: ["str", { initial: "" }],
                portee: ["str", { initial: "personnelle" }],
                listes: ["obj", {}],
                labels: ["obj", {}],
                energie: [
                  "schema",
                  {
                    tour: [
                      "schema",
                      {
                        value: ["num", { initial: 0 }],
                        label: ["str", { initial: "" }],
                      },
                    ],
                    minute: [
                      "schema",
                      {
                        value: ["num", { initial: 0 }],
                        label: ["str", { initial: "" }],
                      },
                    ],
                    label: ["num", { initial: 0 }],
                  },
                ],
                secondmode: [
                  "schema",
                  {
                    has: ["bool", { initial: false }],
                    activation: ["str", { initial: "aucune" }],
                  },
                ],
                arme: [
                  "schema",
                  {
                    has: ["bool", { initial: false }],
                    type: ["str", { initial: "contact" }],
                    portee: ["str", { initial: "contact" }],
                    energie: ["num", { initial: 0 }],
                    optionsmunitions: [
                      "schema",
                      {
                        has: ["bool", { initial: false }],
                        actuel: ["str", { initial: "0", nullable: false }],
                        value: ["num", { initial: 1, nullable: false, integer: true }],
                        liste: ["obj", {}],
                      },
                    ],
                    tourelle: [
                      "schema",
                      {
                        has: ["bool", { initial: false }],
                        attaque: [
                          "schema",
                          {
                            dice: ["num", { initial: 0, nullable: false, integer: true }],
                            fixe: ["num", { initial: 0, nullable: false, integer: true }],
                          },
                        ],
                      },
                    ],
                    degats: [
                      "schema",
                      {
                        addchair: ["bool", { initial: true }],
                        dice: ["num", { initial: 0, nullable: false, integer: true }],
                        fixe: ["num", { initial: 0, nullable: false, integer: true }],
                        variable: [
                          "schema",
                          {
                            has: ["bool", { initial: false }],
                            min: [
                              "schema",
                              {
                                dice: ["num", { initial: 0, nullable: false, integer: true }],
                                fixe: ["num", { initial: 0, nullable: false, integer: true }],
                              },
                            ],
                            max: [
                              "schema",
                              {
                                dice: ["num", { initial: 0, nullable: false, integer: true }],
                                fixe: ["num", { initial: 0, nullable: false, integer: true }],
                              },
                            ],
                            cout: ["num", { initial: 0, nullable: false, integer: true }],
                          },
                        ],
                      },
                    ],
                    violence: [
                      "schema",
                      {
                        dice: ["num", { initial: 0, nullable: false, integer: true }],
                        fixe: ["num", { initial: 0, nullable: false, integer: true }],
                        variable: [
                          "schema",
                          {
                            has: ["bool", { initial: false }],
                            min: [
                              "schema",
                              {
                                dice: ["num", { initial: 0, nullable: false, integer: true }],
                                fixe: ["num", { initial: 0, nullable: false, integer: true }],
                              },
                            ],
                            max: [
                              "schema",
                              {
                                dice: ["num", { initial: 0, nullable: false, integer: true }],
                                fixe: ["num", { initial: 0, nullable: false, integer: true }],
                              },
                            ],
                            cout: ["num", { initial: 0, nullable: false, integer: true }],
                          },
                        ],
                      },
                    ],
                    effets: [
                      "schema",
                      {
                        liste: ["arr", ["str", { initial: "", nullable: false }]],
                        raw: ["arr", ["str", { initial: "", nullable: false }]],
                        custom: ["arr", ["obj", {}]],
                        chargeur: ["num", { initial: null, nullable: true, integer: true }],
                        activable: ["arr", ["obj", {}]],
                      },
                    ],
                    effets2mains: [
                      "schema",
                      {
                        liste: ["arr", ["str", { initial: "", nullable: false }]],
                        raw: ["arr", ["str", { initial: "", nullable: false }]],
                        custom: ["arr", ["obj", {}]],
                        chargeur: ["num", { initial: null, nullable: true, integer: true }],
                        activable: ["arr", ["obj", {}]],
                      },
                    ],
                    distance: [
                      "schema",
                      {
                        liste: ["arr", ["str", { initial: "", nullable: false }]],
                        raw: ["arr", ["str", { initial: "", nullable: false }]],
                        custom: ["arr", ["obj", {}]],
                      },
                    ],
                    ornementales: [
                      "schema",
                      {
                        liste: ["arr", ["str", { initial: "", nullable: false }]],
                        raw: ["arr", ["str", { initial: "", nullable: false }]],
                        custom: ["arr", ["obj", {}]],
                      },
                    ],
                    structurelles: [
                      "schema",
                      {
                        liste: ["arr", ["str", { initial: "", nullable: false }]],
                        raw: ["arr", ["str", { initial: "", nullable: false }]],
                        custom: ["arr", ["obj", {}]],
                      },
                    ],
                  },
                ],
                pnj: [
                  "schema",
                  {
                    has: ["bool", { initial: false }],
                    liste: ["arr", ["str", { initial: "" }]],
                  },
                ],
                ersatz: [
                  "schema",
                  {
                    has: ["bool", { initial: false }],
                    rogue: [
                      "schema",
                      {
                        has: ["bool", { initial: false }],
                        interruption: [
                          "schema",
                          {
                            actif: ["bool", { initial: true }],
                          },
                        ],
                        reussites: ["num", { initial: 3 }],
                        attaque: "discretion",
                        degats: [
                          "schema",
                          {
                            caracteristique: ["str", { initial: "discretion" }],
                            od: ["bool", { initial: true }],
                            dice: ["bool", { initial: false }],
                            fixe: ["bool", { initial: true }],
                          },
                        ],
                      },
                    ],
                    bard: [
                      "schema",
                      {
                        has: ["bool", { initial: false }],
                      },
                    ],
                  },
                ],
                jetsimple: [
                  "schema",
                  {
                    has: ["bool", { initial: false }],
                    label: ["str", { initial: "" }],
                    jet: ["str", { initial: "0D0" }],
                    effets: [
                      "schema",
                      {
                        liste: ["arr", ["str", { initial: "", nullable: false }]],
                        raw: ["arr", ["str", { initial: "", nullable: false }]],
                        custom: ["arr", ["obj", {}]],
                        chargeur: ["num", { initial: null, nullable: true, integer: true }],
                        activable: ["arr", ["obj", {}]],
                      },
                    ],
                  },
                ],
                effets: [
                  "schema",
                  {
                    has: ["bool", { initial: false }],
                    liste: ["arr", ["str", { initial: "", nullable: false }]],
                    raw: ["arr", ["str", { initial: "", nullable: false }]],
                    custom: ["arr", ["obj", {}]],
                    chargeur: ["num", { initial: null, nullable: true, integer: true }],
                    activable: ["arr", ["obj", {}]],
                  },
                ],
                textarea: [
                  "schema",
                  {
                    duree: ["num", { initial: 22 }],
                  },
                ],
                effects: [
                  "schema",
                  {
                    has: ["bool", { initial: false }],
                    list: [
                      "arr",
                      [
                        "schema",
                        {
                          type: ["str", { initial: "", nullable: false }],
                          path: ["str", { initial: "", nullable: false }],
                          value: ["str", { initial: "0", nullable: false }],
                        },
                      ],
                    ],
                    defaultListValue: [
                      "schema",
                      {
                        type: ["str", { initial: "add", nullable: false }],
                        path: ["str", { initial: "", nullable: false }],
                        value: ["str", { initial: "0", nullable: false }],
                      },
                    ],
                  },
                ],
                mods: [
                  "schema",
                  {
                    has: ["bool", { initial: false }],
                    degats: [
                      "schema",
                      {
                        has: ["bool", { initial: false }],
                        type: ["str", { initial: "contact" }],
                        dice: ["num", { initial: 0 }],
                        fixe: ["num", { initial: 0 }],
                        variable: [
                          "schema",
                          {
                            has: ["bool", { initial: false }],
                            min: [
                              "schema",
                              {
                                dice: ["num", { initial: 0 }],
                                fixe: ["num", { initial: 0 }],
                              },
                            ],
                            max: [
                              "schema",
                              {
                                dice: ["num", { initial: 0 }],
                                fixe: ["num", { initial: 0 }],
                              },
                            ],
                            cout: ["num", { initial: 0 }],
                          },
                        ],
                      },
                    ],
                    violence: [
                      "schema",
                      {
                        has: ["bool", { initial: false }],
                        type: ["str", { initial: "contact" }],
                        dice: ["num", { initial: 0 }],
                        fixe: ["num", { initial: 0 }],
                        variable: [
                          "schema",
                          {
                            has: ["bool", { initial: false }],
                            min: [
                              "schema",
                              {
                                dice: ["num", { initial: 0 }],
                                fixe: ["num", { initial: 0 }],
                              },
                            ],
                            max: [
                              "schema",
                              {
                                dice: ["num", { initial: 0 }],
                                fixe: ["num", { initial: 0 }],
                              },
                            ],
                            cout: ["num", { initial: 0 }],
                          },
                        ],
                      },
                    ],
                    grenade: [
                      "schema",
                      {
                        has: ["bool", { initial: false }],
                        liste: [
                          "arr",
                          [
                            "schema",
                            {
                              id: ["str", { initial: "" }],
                              degats: [
                                "schema",
                                {
                                  dice: ["num", { initial: 0 }],
                                },
                              ],
                              violence: [
                                "schema",
                                {
                                  dice: ["num", { initial: 0 }],
                                },
                              ],
                            },
                          ],
                          {
                            initial: [
                              { id: "antiblindage", degats: { dice: 0 }, violence: { dice: 0 } },
                              { id: "explosive", degats: { dice: 0 }, violence: { dice: 0 } },
                              { id: "shrapnel", degats: { dice: 0 }, violence: { dice: 0 } },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          ],
          /*details:["obj", {
          initial:{
            n1:{
              whoActivate:"",
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
                    },
                  }}
              },
              arme:{
                has:false,
                type:"contact",
                portee:"contact",
                energie:0,
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
                  activable:[],
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
                        raw:[],
                        chargeur:null
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
                has:false,
                raw:[],
                custom:[],
                liste:[],
                chargeur:null,
              },
              textarea:{
                duree:22
              },
              other:{},
              effects:{
                  list:[],
                  defaultListValue:{
                      type:"add",
                      path:"",
                      value:"str",
                  },
              },
            }
          }
        }]*/
        },
      ],
      npc: [
        "schema",
        {
          modele: [
            "schema",
            {
              nom: ["str", { initial: "" }],
              special: ["str", { initial: "" }],
              type: ["str", { initial: "pnj" }],
              sante: ["num", { initial: 0 }],
              champDeForce: ["num", { initial: 0 }],
              defense: ["num", { initial: 0 }],
              reaction: ["num", { initial: 0 }],
              armure: ["num", { initial: 0 }],
              debordement: ["num", { initial: 0 }],
              initiative: [
                "schema",
                {
                  dice: ["num", { initial: 3 }],
                  fixe: ["num", { initial: 0 }],
                },
              ],
              jetSpecial: [
                "schema",
                {
                  has: ["bool", { initial: false }],
                  liste: ["arr", ["str", { initial: "" }]],
                },
              ],
              aspects: [
                "schema",
                {
                  has: ["bool", { initial: false }],
                  liste: [
                    "schema",
                    {
                      chair: [
                        "schema",
                        {
                          value: ["num", { initial: 0 }],
                          ae: [
                            "schema",
                            {
                              mineur: ["num", { initial: 0 }],
                              majeur: ["num", { initial: 0 }],
                            },
                          ],
                        },
                      ],
                      bete: [
                        "schema",
                        {
                          value: ["num", { initial: 0 }],
                          ae: [
                            "schema",
                            {
                              mineur: ["num", { initial: 0 }],
                              majeur: ["num", { initial: 0 }],
                            },
                          ],
                        },
                      ],
                      machine: [
                        "schema",
                        {
                          value: ["num", { initial: 0 }],
                          ae: [
                            "schema",
                            {
                              mineur: ["num", { initial: 0 }],
                              majeur: ["num", { initial: 0 }],
                            },
                          ],
                        },
                      ],
                      dame: [
                        "schema",
                        {
                          value: ["num", { initial: 0 }],
                          ae: [
                            "schema",
                            {
                              mineur: ["num", { initial: 0 }],
                              majeur: ["num", { initial: 0 }],
                            },
                          ],
                        },
                      ],
                      masque: [
                        "schema",
                        {
                          value: ["num", { initial: 0 }],
                          ae: [
                            "schema",
                            {
                              mineur: ["num", { initial: 0 }],
                              majeur: ["num", { initial: 0 }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
              armes: [
                "schema",
                {
                  has: ["bool", { initial: false }],
                  liste: ["arr", ["str", { initial: "" }]],
                },
              ],
            },
          ],
          liste: [
            "tObj",
            [
              "schema",
              {
                nom: ["str", { initial: "" }],
                special: ["str", { initial: "" }],
                type: ["str", { initial: "pnj" }],
                sante: ["num", { initial: 0 }],
                champDeForce: ["num", { initial: 0 }],
                defense: ["num", { initial: 0 }],
                reaction: ["num", { initial: 0 }],
                armure: ["num", { initial: 0 }],
                debordement: ["num", { initial: 0 }],
                initiative: [
                  "schema",
                  {
                    dice: ["num", { initial: 3 }],
                    fixe: ["num", { initial: 0 }],
                  },
                ],
                jetSpecial: [
                  "schema",
                  {
                    has: ["bool", { initial: false }],
                    liste: ["arr", ["str", { initial: "" }]],
                  },
                ],
                aspects: [
                  "schema",
                  {
                    has: ["bool", { initial: false }],
                    liste: [
                      "schema",
                      {
                        chair: [
                          "schema",
                          {
                            value: ["num", { initial: 0 }],
                            ae: [
                              "schema",
                              {
                                mineur: ["num", { initial: 0 }],
                                majeur: ["num", { initial: 0 }],
                              },
                            ],
                          },
                        ],
                        bete: [
                          "schema",
                          {
                            value: ["num", { initial: 0 }],
                            ae: [
                              "schema",
                              {
                                mineur: ["num", { initial: 0 }],
                                majeur: ["num", { initial: 0 }],
                              },
                            ],
                          },
                        ],
                        machine: [
                          "schema",
                          {
                            value: ["num", { initial: 0 }],
                            ae: [
                              "schema",
                              {
                                mineur: ["num", { initial: 0 }],
                                majeur: ["num", { initial: 0 }],
                              },
                            ],
                          },
                        ],
                        dame: [
                          "schema",
                          {
                            value: ["num", { initial: 0 }],
                            ae: [
                              "schema",
                              {
                                mineur: ["num", { initial: 0 }],
                                majeur: ["num", { initial: 0 }],
                              },
                            ],
                          },
                        ],
                        masque: [
                          "schema",
                          {
                            value: ["num", { initial: 0 }],
                            ae: [
                              "schema",
                              {
                                mineur: ["num", { initial: 0 }],
                                majeur: ["num", { initial: 0 }],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
                armes: [
                  "schema",
                  {
                    has: ["bool", { initial: false }],
                    liste: ["arr", ["str", { initial: "" }]],
                  },
                ],
              },
            ],
          ],
        },
      ],
      wpnNpc: [
        "schema",
        {
          modele: [
            "schema",
            {
              nom: ["str", { initial: "" }],
              type: ["str", { initial: "contact" }],
              portee: ["str", { initial: "contact" }],
              attaque: [
                "schema",
                {
                  dice: ["num", { initial: 0 }],
                  fixe: ["num", { initial: 0 }],
                },
              ],
              degats: [
                "schema",
                {
                  dice: ["num", { initial: 0 }],
                  fixe: ["num", { initial: 0 }],
                },
              ],
              violence: [
                "schema",
                {
                  dice: ["num", { initial: 0 }],
                  fixe: ["num", { initial: 0 }],
                },
              ],
              effets: [
                "schema",
                {
                  liste: ["arr", ["str", { initial: "", nullable: false }]],
                  raw: ["arr", ["str", { initial: "", nullable: false }]],
                  custom: ["arr", ["obj", {}]],
                  chargeur: ["num", { initial: null, nullable: true, integer: true }],
                  activable: ["arr", ["obj", {}]],
                },
              ],
            },
          ],
          liste: [
            "tObj",
            [
              "schema",
              {
                nom: ["str", { initial: "" }],
                type: ["str", { initial: "contact" }],
                portee: ["str", { initial: "contact" }],
                attaque: [
                  "schema",
                  {
                    dice: ["num", { initial: 0 }],
                    fixe: ["num", { initial: 0 }],
                  },
                ],
                degats: [
                  "schema",
                  {
                    dice: ["num", { initial: 0 }],
                    fixe: ["num", { initial: 0 }],
                  },
                ],
                violence: [
                  "schema",
                  {
                    dice: ["num", { initial: 0 }],
                    fixe: ["num", { initial: 0 }],
                  },
                ],
                effets: [
                  "schema",
                  {
                    liste: ["arr", ["str", { initial: "", nullable: false }]],
                    raw: ["arr", ["str", { initial: "", nullable: false }]],
                    custom: ["arr", ["obj", {}]],
                    chargeur: ["num", { initial: null, nullable: true, integer: true }],
                    activable: ["arr", ["obj", {}]],
                  },
                ],
              },
            ],
          ],
        },
      ],
      jSpeNpc: [
        "schema",
        {
          modele: [
            "schema",
            {
              nom: ["str", { initial: "" }],
              dice: ["num", { initial: 0 }],
              overdrive: ["num", { initial: 0 }],
            },
          ],
          liste: [
            "tObj",
            {
              nom: ["str", { initial: "" }],
              dice: ["num", { initial: 0 }],
              overdrive: ["num", { initial: 0 }],
            },
          ],
        },
      ],
    };

    return combine(base, specific);
  }

  static migrateData(source) {
    const ensureTables = (source) => {
      // on ne recrée pas la table si elle existe déjà (plusieurs niveaux migrés)
      if (!source.npc || Array.isArray(source.npc.liste)) source.npc = { liste: {} };
      if (!source.wpnNpc || Array.isArray(source.wpnNpc.liste)) source.wpnNpc = { liste: {} };
      if (!source.jSpeNpc || Array.isArray(source.jSpeNpc.liste)) source.jSpeNpc = { liste: {} };
    };

    const migrateWpnNpcToFlatTables = (source, data) => {
      const ids = [];

      for (const n in data.armes.liste) {
        const id = foundry.utils.randomID();
        source.wpnNpc.liste[id] = { ...data.armes.liste[n] };

        ids.push(id);
      }

      data.armes.liste = ids;
    };

    const migrateJSpeNpcToFlatTables = (source, data) => {
      const ids = [];

      for (const n in data.jetSpecial.liste) {
        const id = foundry.utils.randomID();
        source.jSpeNpc.liste[id] = { ...data.jetSpecial.liste[n] };

        ids.push(id);
      }

      data.jetSpecial.liste = ids;
    };

    const migrateNpcToFlatTables = (source, data) => {
      const ids = [];
      for (const n in data.pnj.liste) {
        const npcData = data.pnj.liste[n];
        migrateWpnNpcToFlatTables(source, npcData);
        migrateJSpeNpcToFlatTables(source, npcData);

        const id = foundry.utils.randomID();
        source.npc.liste[id] = { ...npcData };

        ids.push(id);
      }

      data.pnj.liste = ids;
    };

    const migrateNivToFlatTables = (source) => {
      const niv = source?.niveau?.details;

      for (const n in niv) {
        const data = niv[n];

        if (
          foundry.utils.getType(data?.pnj?.liste?.[0]) === "string" ||
          Object.keys(data?.pnj?.liste).length === 0
        )
          continue;

        try {
          migrateNpcToFlatTables(source, data);
        } catch (e) {
          console.error("MIGRATION ERROR:", e);
        }
        source.niveau.details[n] = data;
      }
    };

    const migrateEffects = (source) => {
      const niv = source?.niveau?.details;

      for (const n in niv) {
        const data = niv[n];
        const list = [];

        if (!data?.bonus?.has) continue;
        if (!data?.effects) {
          const bonus = data.bonus;
          const hasArmure = bonus?.armure?.has;
          const hasCDF = bonus?.champDeForce?.has;
          const hasEnergie = bonus?.energie?.has;
          const hasOD = bonus?.overdrives?.has;
          const hasSante = bonus?.sante?.has;

          if (hasArmure) {
            list.push({
              path: "system.armure.withArmor",
              type: "add",
              value: `${bonus?.armure?.value ?? 0}`,
            });
          }

          if (hasCDF) {
            list.push({
              path: "system.champDeForce.withArmor",
              type: "add",
              value: `${bonus?.champDeForce?.value ?? 0}`,
            });
          }

          if (hasEnergie) {
            list.push({
              path: "system.energie.withArmor",
              type: "add",
              value: `${bonus?.energie?.value ?? 0}`,
            });
          }

          if (hasSante) {
            list.push({
              path: "system.sante.withArmor",
              type: "add",
              value: `${bonus?.sante?.value ?? 0}`,
            });
          }

          if (hasOD) {
            const listOD = bonus.overdrives.aspects;

            for (const a in listOD) {
              const aOD = listOD[a];

              for (const c in aOD) {
                if (aOD[c] > 0) {
                  let path = `system.aspects.${a}.caracteristiques.${c}.overdrive`;

                  list.push({
                    path: path,
                    type: "add",
                    value: `${aOD?.[c] ?? 0}`,
                  });
                }
              }
            }
          }

          if (list.length > 0) {
            source.niveau.details[n].effects = {
              has: true,
              list: [],
            };

            source.niveau.details[n].effects.list = list;
          }
        }
      }
    };

    ensureTables(source);
    migrateNivToFlatTables(source);
    migrateEffects(source);

    return super.migrateData(source);
  }

  get listEffect() {
    return foundry.utils.getProperty(this, `niveau.details.${this.getNiveau}.effects.list`);
  }

  get hasEffects() {
    return true;
  }

  get wpnPath() {
    return `system.niveau.details.${this.getNiveau}.arme.`;
  }

  get allPossibleCategory() {
    const niv = this.niveau.details;
    let cfg = CONFIG.KNIGHT.module.categorie.normal;
    let result = false;

    for (let n in niv) {
      if (niv[n].rarete === "prestige") result = true;
    }

    if (result) {
      cfg = foundry.utils.mergeObject(cfg, CONFIG.KNIGHT.module.categorie.prestige);
    }

    return cfg;
  }

  get getNiveau() {
    return `n${this.niveau.value}`;
  }

  get niveauActuel() {
    return this.niveau.actuel;
  }

  #prepareNpcs() {
    const lvls = foundry.utils.getProperty(this, "niveau.details");

    for (const l in lvls) {
      const npcs = lvls[l].pnj.liste;
      const npcArray = [];

      for (const n of npcs) {
        const dataNpc = foundry.utils.getProperty(this, `npc.liste.${n}`);
        const wpnArray = [];
        const jSpeArray = [];

        for (const w of dataNpc.armes.liste) {
          const dataWpn = foundry.utils.getProperty(this, `wpnNpc.liste.${w}`);

          wpnArray.push({ id: w, ...dataWpn });
        }

        for (const j of dataNpc.jetSpecial.liste) {
          const dataJSpe = foundry.utils.getProperty(this, `jSpeNpc.liste.${j}`);

          jSpeArray.push({ id: j, ...dataJSpe });
        }

        Object.defineProperty(dataNpc.jetSpecial, "data", {
          value: jSpeArray,
        });

        Object.defineProperty(dataNpc.armes, "data", {
          value: wpnArray,
        });

        npcArray.push({ id: n, ...dataNpc });
      }

      Object.defineProperty(lvls[l].pnj, "data", {
        value: npcArray,
      });
    }
  }

  #prepareCustomGrenade(actor) {
    const listG = actor
      ? (actor.system?.combat?.grenades?.liste ?? {})
      : CONFIG.KNIGHT.LIST.grenades;
    const keysToRemoveSet = new Set(["flashbang", "iem"]);
    const allowed = Object.keys(listG).filter((k) => !keysToRemoveSet.has(k));
    const defaults = { degats: { dice: 0 }, violence: { dice: 0 }, custom: true };

    const levels = this.niveau?.details ?? {};
    for (const lvl of Object.values(levels)) {
      const gren = lvl?.bonus?.grenades;
      if (!gren || !gren.liste) continue;
      const dGrenade = gren.liste;

      // Nouveau dictionnaire: pour chaque clé autorisée, reprendre l’existant ou mettre le défaut
      const merged = Object.fromEntries(allowed.map((k) => [k, dGrenade[k] ?? { ...defaults }]));

      // Affectation simple: pas besoin de defineProperty
      gren.liste = merged;
    }
  }

  #prepareEffets() {
    const labels = getAllEffects();

    const npcArmes = this.wpnNpc.liste;

    for (const w in npcArmes) {
      const data = npcArmes[w];

      data.effets.liste = listEffects(data.effets, labels, data.effets.chargeur);
    }

    const niveaux = this.niveau.details;

    for (const n in niveaux) {
      const niveau = niveaux[n];
      const arme = niveau.arme;
      arme.effets.liste = listEffects(arme.effets, labels, arme.effets.chargeur);

      const effets = niveau.effets;
      effets.liste = listEffects(effets, labels, effets.chargeur);
    }
  }

  prepareBaseData() {
    const actor = this.actor;

    this.#prepareEffets();
    this.#prepareCustomGrenade(actor);
    this.#prepareNpcs();

    const niveau = Math.max(this.niveau.value, 1);

    const itemDataNiveau = this.niveau.details[niveau - 1];

    if (!itemDataNiveau) return;
    this.niveau.actuel = itemDataNiveau;
  }

  prepareDerivedData() {}

  async activate(value, type) {
    if (value) {
      const depense =
        this.actor.type === "vehicule" ? await this.usePEVehicule(type) : await this.usePE(type);

      if (!depense) return;
    }

    let pbM = new PatchBuilder();
    const dataModule = this.item,
      dataNiveau = this.niveauActuel;

    if (this.active.base === value) return;

    pbM.sys(`active.base`, value);
    let abort = false;

    if (dataNiveau.jetsimple.has && value) {
      const roll = new game.knight.RollKnight(
        this.actor,
        {
          name: `${dataNiveau.jetsimple.label}`,
          dices: `${dataNiveau.jetsimple.jet}`,
          item: dataModule,
          effectspath: "jetsimple.effets",
        },
        false,
      );

      if (this.hasOtherMunition("jetsimple")) {
        await roll.doRoll({}, dataNiveau.jetsimple.effets);
      } else {
        await roll.sendMessage({
          text: game.i18n.localize("KNIGHT.JETS.ChargeurVide"),
          classes: "important",
        });
      }
    }

    if (!this.hasOtherMunition("module") && value && dataNiveau.effets.has) {
      abort = true;
      const roll = new game.knight.RollKnight(
        this.actor,
        {
          name: `${dataModule.name}`,
        },
        false,
      );

      await roll.sendMessage({
        text: game.i18n.localize("KNIGHT.JETS.ChargeurVide"),
        classes: "important",
      });
    } else if (dataNiveau.effets.raw.find((itm) => itm.includes("chargeur")) && value) {
      const findModuleChargeur = dataNiveau.effets.raw.find((itm) => itm.includes("chargeur"));
      const chargeur = dataNiveau.effets?.chargeur ?? null;

      if (chargeur === null)
        pbM.sys(
          `niveau.details.${this.getNiveau}.effets.chargeur`,
          Math.max(parseInt(findModuleChargeur.split(" ")[1]) - 1, 0),
        );
      else
        pbM.sys(
          `niveau.details.${this.getNiveau}.effets.chargeur`,
          Math.max(parseInt(chargeur) - 1, 0),
        );
    }

    if (!abort) {
      await pbM.applyTo(dataModule);

      const exec = new game.knight.RollKnight(this.actor, {
        name: value
          ? game.i18n.localize(`KNIGHT.ACTIVATION.Label`)
          : game.i18n.localize(`KNIGHT.ACTIVATION.Desactivation`),
      }).sendMessage({
        text: name ? name : this.item.name,
        sounds: CONFIG.sounds.notification,
      });
    }
  }

  async activateNPC(value, type, index) {
    if (value) {
      const depense = await this.usePE(type);

      if (!depense) return;
    }

    const dataModule = this.item,
      data = this,
      dataNiveau = data.niveauActuel,
      dataPnj = dataNiveau.pnj.liste[index];

    let newActor;

    if (value) {
      const listeAspects = dataPnj.aspects.liste;

      const system = {
        aspects: dataPnj.aspects.has
          ? {
              chair: {
                value: listeAspects.chair.value,
                ae: {
                  mineur: {
                    value: listeAspects.chair.ae.mineur,
                  },
                  majeur: {
                    value: listeAspects.chair.ae.majeur,
                  },
                },
              },
              bete: {
                value: listeAspects.bete.value,
                ae: {
                  mineur: {
                    value: listeAspects.bete.ae.mineur,
                  },
                  majeur: {
                    value: listeAspects.bete.ae.majeur,
                  },
                },
              },
              machine: {
                value: listeAspects.machine.value,
                ae: {
                  mineur: {
                    value: listeAspects.machine.ae.mineur,
                  },
                  majeur: {
                    value: listeAspects.machine.ae.majeur,
                  },
                },
              },
              dame: {
                value: listeAspects.dame.value,
                ae: {
                  mineur: {
                    value: listeAspects.dame.ae.mineur,
                  },
                  majeur: {
                    value: listeAspects.dame.ae.majeur,
                  },
                },
              },
              masque: {
                value: listeAspects.masque.value,
                ae: {
                  mineur: {
                    value: listeAspects.masque.ae.mineur,
                  },
                  majeur: {
                    value: listeAspects.masque.ae.majeur,
                  },
                },
              },
            }
          : {},
        initiative: {
          diceBase: dataPnj.initiative.dice,
          bonus: { user: dataPnj.initiative.fixe },
        },
        sante: {
          base: dataPnj.sante,
          value: dataPnj.sante,
        },
        armure: {
          base: dataPnj.armure,
          value: dataPnj.armure,
        },
        champDeForce: {
          base: dataPnj.champDeForce,
        },
        reaction: {
          base: dataPnj.reaction,
        },
        defense: {
          base: dataPnj.defense,
        },
        options: {
          noAspects: dataPnj.aspects.has ? false : true,
          noArmesImprovisees: dataPnj.aspects.has ? false : true,
          noCapacites: true,
          noGrenades: true,
          noNods: true,
          espoir: false,
          bouclier: false,
          sante: false,
          energie: false,
          resilience: false,
        },
      };

      if (dataPnj.jetSpecial.has) {
        const jetsSpeciaux = [];

        system.options.jetsSpeciaux = true;

        for (let [key, jet] of Object.entries(dataPnj.jetSpecial.liste)) {
          jetsSpeciaux.push({
            name: jet.nom,
            value: `${jet.dice}D6+${jet.overdrive}`,
          });
        }

        system.jetsSpeciaux = jetsSpeciaux;
      }

      if (dataPnj.type === "bande") {
        system.debordement = {};
        system.debordement.value = dataPnj.debordement;
      }

      newActor = await createSheet(
        this.actor,
        dataPnj.type,
        `${this.actor.name} : ${dataPnj.nom}`,
        system,
        [],
        dataModule.img,
        dataModule.img,
        1,
      );

      if (dataPnj.armes.has && dataPnj.type !== "bande") {
        const items = [];

        for (let [key, arme] of Object.entries(dataPnj.armes.liste)) {
          const wpnType = arme.type === "tourelle" ? "distance" : arme.type;

          let wpn = {
            type: wpnType,
            portee: arme.portee,
            degats: {
              dice: arme.degats.dice,
              fixe: arme.degats.fixe,
            },
            violence: {
              dice: arme.violence.dice,
              fixe: arme.violence.fixe,
            },
            effets: {
              raw: arme.effets.raw,
              custom: arme.effets.custom,
            },
          };

          if (arme.type === "tourelle") {
            wpn["tourelle"] = {
              has: true,
              attaque: {
                dice: arme.attaque.dice,
                fixe: arme.attaque.fixe,
              },
            };
          }

          const nItem = {
            name: arme?.nom ?? game.i18n.localize("TYPES.Item.arme"),
            type: "arme",
            system: wpn,
          };

          items.push(nItem);
        }

        await newActor.createEmbeddedDocuments("Item", items);
      }

      await PatchBuilder.for(dataModule)
        .sys("active.pnj", true)
        .sys("active.pnjName", dataPnj.nom)
        .sys("id", newActor.id)
        .apply();

      await spawnTokenRightOfActor({ actor: newActor, refActor: this.actor });
    } else if (!value) {
      const actor = game.actors.get(dataModule.system.id);

      if (actor !== undefined) await actor.delete();

      if (actor?.id) await deleteTokens([actor.id]);

      await PatchBuilder.for(dataModule)
        .sys("active.pnj", false)
        .sys("active.pnjName", "")
        .sys("id", "")
        .apply();
    }
  }

  async supplementaire() {
    await this.usePE("supplementaire");
  }

  async usePE(type, forceEspoir = false) {
    if (!this.actor.isPJ) return this.usePE_NPC(type, forceEspoir);

    // Récupération armure + capacités (sécurisée)
    const getArmure = await getArmor(this.actor).catch((e) => {
      console.error("module usePE: getArmor a échoué", e);
      return null;
    });
    if (!getArmure) return;

    const niveauActuel = this.niveauActuel;
    const armure = new ArmureAPI(getArmure);
    const label = this.item.name;
    const actor = this?.actor ?? null;

    const remplaceEnergie = armure.espoirRemplaceEnergie;
    const getType = remplaceEnergie || forceEspoir ? "espoir" : "energie";
    const hasFlux = armure.hasFlux;

    const flux = hasFlux ? (actor?.system?.flux?.value ?? 0) : 0;
    const value = actor?.system?.[getType]?.value ?? 0;
    const espoir = actor?.system?.espoir?.value ?? 0;

    const sendLackMsg = async (i18nKey) => {
      const payload = {
        flavor: `${label}`,
        main: { total: `${game.i18n.localize(`KNIGHT.JETS.${i18nKey}`)}` },
      };
      const data = {
        user: game.user.id,
        speaker: {
          actor: actor?.id ?? null,
          token: actor?.token?.id ?? null,
          alias: actor?.name ?? null,
        },
        style: CONST.CHAT_MESSAGE_STYLES.OTHER,
        content: await renderTemplate("systems/knight/templates/dices/wpn.html", payload),
        sound: CONFIG.sounds.dice,
      };
      const rMode = game.settings.get("core", "rollMode");
      const msgData = ChatMessage.applyRollMode(data, rMode);
      await ChatMessage.create(msgData, { rollMode: rMode });
    };

    let cout = 0;

    switch (type) {
      case "other":
        cout += 0;
        break;

      case "tour":
      case "minute":
        cout += niveauActuel?.energie?.[type]?.value ?? 0;
        break;

      case "supplementaire":
        cout += niveauActuel?.energie?.supplementaire ?? 0;
        break;
    }

    let depenseEnergie = 0;
    let depenseFlux = 0;
    let depenseEspoir = 0;
    let substractEnergie = 0;
    let substractEspoir = 0;
    let substractFlux = 0;

    depenseEnergie += cout;

    if (remplaceEnergie && depenseEnergie > 0 && armure.ModuleCostDivided > 0) {
      depenseEnergie = Math.max(Math.floor(cout / armure.ModuleCostDivided), 1);

      if (depenseEnergie < 1) depenseEnergie = 1;
    }

    if (remplaceEnergie) depenseEnergie += depenseEspoir;

    substractEnergie = value - depenseEnergie;
    substractEspoir = espoir - depenseEspoir;
    substractFlux = flux - depenseFlux;
    if (substractEnergie < 0) {
      await sendLackMsg(`${remplaceEnergie || forceEspoir ? "Notespoir" : "Notenergie"}`);

      return false;
    } else if (substractEspoir < 0 && !remplaceEnergie) {
      await sendLackMsg(`Notespoir`);

      return false;
    } else if (substractFlux < 0 && hasFlux) {
      await sendLackMsg(`Notflux`);

      return false;
    } else {
      let pbE = new PatchBuilder();

      if (!remplaceEnergie)
        pbE.sys(`equipements.${actor.system.wear}.${getType}.value`, substractEnergie);
      else if (remplaceEnergie && !actor.system.espoir.perte.saufAgonie)
        pbE.sys("espoir.value", substractEnergie);

      if (!remplaceEnergie && depenseEspoir) pbE.sys("espoir.value", substractEspoir);

      if (depenseFlux && hasFlux) pbE.sys("flux.value", substractFlux);

      await pbE.applyTo(actor);

      return true;
    }
  }

  async usePE_NPC(type, forceEspoir = false) {
    // Récupération armure + capacités (sécurisée)
    const getArmure = await getArmor(this.actor);

    const niveauActuel = this.niveauActuel;
    const armure = getArmure ? new ArmureAPI(getArmure) : false;
    const label = this.item.name;
    const actor = this?.actor ?? null;

    const remplaceEnergie = armure ? armure.espoirRemplaceEnergie : false;
    const getType = remplaceEnergie || forceEspoir ? "espoir" : "energie";
    const hasFlux = armure ? armure.hasFlux : false;

    const flux = hasFlux ? (actor?.system?.flux?.value ?? 0) : 0;
    const value = actor?.system?.[getType]?.value ?? 0;
    const espoir = actor?.system?.espoir?.value ?? 0;

    const sendLackMsg = async (i18nKey) => {
      const payload = {
        flavor: `${label}`,
        main: { total: `${game.i18n.localize(`KNIGHT.JETS.${i18nKey}`)}` },
      };
      const data = {
        user: game.user.id,
        speaker: {
          actor: actor?.id ?? null,
          token: actor?.token?.id ?? null,
          alias: actor?.name ?? null,
        },
        style: CONST.CHAT_MESSAGE_STYLES.OTHER,
        content: await renderTemplate("systems/knight/templates/dices/wpn.html", payload),
        sound: CONFIG.sounds.dice,
      };
      const rMode = game.settings.get("core", "rollMode");
      const msgData = ChatMessage.applyRollMode(data, rMode);
      await ChatMessage.create(msgData, { rollMode: rMode });
    };

    let cout = 0;

    switch (type) {
      case "other":
        cout += 0;
        break;

      case "tour":
      case "minute":
        cout += niveauActuel?.energie?.[type]?.value ?? 0;
        break;

      case "supplementaire":
        cout += niveauActuel?.energie?.supplementaire ?? 0;
        break;
    }

    let depenseEnergie = 0;
    let depenseFlux = 0;
    let depenseEspoir = 0;
    let substractEnergie = 0;
    let substractEspoir = 0;
    let substractFlux = 0;

    depenseEnergie += cout;

    if (remplaceEnergie && depenseEnergie > 0 && armure.ModuleCostDivided > 0) {
      depenseEnergie = Math.max(Math.floor(cout / armure.ModuleCostDivided), 1);

      if (depenseEnergie < 1) depenseEnergie = 1;
    }

    if (remplaceEnergie) depenseEnergie += depenseEspoir;

    substractEnergie = value - depenseEnergie;
    substractEspoir = espoir - depenseEspoir;
    substractFlux = flux - depenseFlux;
    if (substractEnergie < 0) {
      await sendLackMsg(`${remplaceEnergie || forceEspoir ? "Notespoir" : "Notenergie"}`);

      return false;
    } else if (substractEspoir < 0 && !remplaceEnergie) {
      await sendLackMsg(`Notespoir`);

      return false;
    } else if (substractFlux < 0 && hasFlux) {
      await sendLackMsg(`Notflux`);

      return false;
    } else {
      let pbE = new PatchBuilder();

      if (!remplaceEnergie) pbE.sys(`${getType}.value`, substractEnergie);
      else if (remplaceEnergie && !actor.system.espoir.perte.saufAgonie)
        pbE.sys("espoir.value", substractEnergie);

      if (!remplaceEnergie && depenseEspoir) pbE.sys("espoir.value", substractEspoir);

      if (depenseFlux && hasFlux) pbE.sys("flux.value", substractFlux);

      await pbE.applyTo(actor);

      return true;
    }
  }

  async usePEVehicule(type, forceEspoir = false) {
    const niveauActuel = this.niveauActuel;
    const label = this.item.name;
    const actor = this?.actor ?? null;

    const getType = "energie";
    const value = actor?.system?.[getType]?.value ?? 0;

    const sendLackMsg = async (i18nKey) => {
      const payload = {
        flavor: `${label}`,
        main: { total: `${game.i18n.localize(`KNIGHT.JETS.${i18nKey}`)}` },
      };
      const data = {
        user: game.user.id,
        speaker: {
          actor: actor?.id ?? null,
          token: actor?.token?.id ?? null,
          alias: actor?.name ?? null,
        },
        style: CONST.CHAT_MESSAGE_STYLES.OTHER,
        content: await renderTemplate("systems/knight/templates/dices/wpn.html", payload),
        sound: CONFIG.sounds.dice,
      };
      const rMode = game.settings.get("core", "rollMode");
      const msgData = ChatMessage.applyRollMode(data, rMode);
      await ChatMessage.create(msgData, { rollMode: rMode });
    };

    let cout = 0;

    switch (type) {
      case "other":
        cout += 0;
        break;

      case "tour":
      case "minute":
        cout += niveauActuel?.energie?.[type]?.value ?? 0;
        break;

      case "supplementaire":
        cout += niveauActuel?.energie?.supplementaire ?? 0;
        break;
    }

    let depenseEnergie = 0;
    let substractEnergie = 0;

    depenseEnergie += cout;

    substractEnergie = value - depenseEnergie;

    if (substractEnergie < 0) {
      await sendLackMsg(`${"Notenergie"}`);

      return false;
    } else {
      let pbE = new PatchBuilder();
      pbE.sys(`energie.value`, substractEnergie);

      await pbE.applyTo(actor);

      return true;
    }
  }

  async usePEActivateEffets(armure, label, effet, forceEspoir = false) {
    const actor = this.actor;

    const remplaceEnergie = armure.espoirRemplaceEnergie;
    const getType = remplaceEnergie || forceEspoir ? "espoir" : "energie";

    const value = actor?.system?.[getType]?.value ?? 0;
    const espoir = actor?.system?.espoir?.value ?? 0;

    const sendLackMsg = async (i18nKey) => {
      const payload = {
        flavor: `${label}`,
        main: { total: `${game.i18n.localize(`KNIGHT.JETS.${i18nKey}`)}` },
      };
      const data = {
        user: game.user.id,
        speaker: {
          actor: actor?.id ?? null,
          token: actor?.token?.id ?? null,
          alias: actor?.name ?? null,
        },
        style: CONST.CHAT_MESSAGE_STYLES.OTHER,
        content: await renderTemplate("systems/knight/templates/dices/wpn.html", payload),
        sound: CONFIG.sounds.dice,
      };
      const rMode = game.settings.get("core", "rollMode");
      const msgData = ChatMessage.applyRollMode(data, rMode);
      await ChatMessage.create(msgData, { rollMode: rMode });
    };

    let depenseEnergie = Number(effet.cost);
    let depenseEspoir = 0;
    let substractEnergie = 0;
    let substractEspoir = 0;

    if (remplaceEnergie) depenseEnergie += depenseEspoir;

    substractEnergie = value - depenseEnergie;
    substractEspoir = espoir - depenseEspoir;
    if (substractEnergie < 0) {
      await sendLackMsg(`${remplaceEnergie || forceEspoir ? "Notespoir" : "Notenergie"}`);

      return false;
    } else if (substractEspoir < 0 && !remplaceEnergie) {
      await sendLackMsg(`Notespoir`);

      return false;
    } else {
      let pbE = new PatchBuilder();
      const pathEnergie =
        actor.type === "knight"
          ? `equipements.${actor.system.wear}.${getType}.value`
          : `${getType}.value`;

      if (!remplaceEnergie) pbE.sys(pathEnergie, substractEnergie);
      else if (remplaceEnergie && !actor.system.espoir.perte.saufAgonie)
        pbE.sys("espoir.value", substractEnergie);

      if (!remplaceEnergie && depenseEspoir) pbE.sys("espoir.value", substractEspoir);

      await pbE.applyTo(actor);

      return true;
    }
  }

  async add(type, id) {
    const niveau = this.getNiveau;
    const update = {};
    const nId = foundry.utils.randomID();

    switch (type) {
      case "pnj":
        const npc = foundry.utils.getProperty(this, `niveau.details.${niveau}.pnj.liste`);
        npc.push(nId);

        update[`system.npc.liste.${nId}`] = foundry.utils.getProperty(this, "npc.modele");
        update[`system.niveau.details.${niveau}.pnj.liste`] = npc;
        break;

      case "armes":
        const wpnArray = this.npc.liste[id].armes.liste;
        wpnArray.push(nId);

        update[`system.npc.liste.${id}.armes.liste`] = wpnArray;
        update[`system.wpnNpc.liste.${nId}`] = foundry.utils.getProperty(this, "wpnNpc.modele");
        break;

      case "jetSpecial": {
        const jSpeArray = this.npc.liste[id].jetSpecial.liste;
        jSpeArray.push(nId);

        update[`system.npc.liste.${id}.jetSpecial.liste`] = jSpeArray;
        update[`system.jSpeNpc.liste.${nId}`] = foundry.utils.getProperty(this, "jSpeNpc.modele");
        break;
      }
    }
    await this.item.update(update);
  }

  async delete(type, id, npc = null) {
    const niveau = this.getNiveau;
    const details = this.toObject().niveau.details;
    const lvl = details[niveau];
    if (!lvl) return;
    const update = {};

    switch (type) {
      case "pnj":
        const array = lvl.pnj.liste;
        const npcIndex = array.indexOf(id);

        if (npcIndex > -1) {
          array.splice(npcIndex, 1);
          update[`system.niveau.details`] = details;
          update[`system.npc.liste.=-${id}`] = null;
        }
        break;

      case "armes":
        if (!npc) return;
        const wpnArray = this.npc.liste[npc].armes.liste;
        const wpnIndex = wpnArray.indexOf(id);

        if (wpnIndex > -1) {
          wpnArray.splice(wpnIndex, 1);
          update[`system.npc.liste.${npc}.armes.liste`] = wpnArray;
          update[`system.wpnNpc.liste.-=${id}`] = null;
        }
        break;

      case "jetSpecial": {
        if (!npc) return;
        const jSpeArray = this.npc.liste[npc].jetSpecial.liste;
        const jSpeIndex = jSpeArray.indexOf(id);

        if (jSpeIndex > -1) {
          jSpeArray.splice(jSpeIndex, 1);
          update[`system.npc.liste.${npc}.jetSpecial.liste`] = jSpeArray;
          update[`system.jSpeNpc.liste.-=${id}`] = null;
        }
        break;
      }
    }

    await this.item.update(update);
  }

  getNpc(id) {
    const npcs = foundry.utils.getProperty(this, `npc.liste`);

    return npcs.find((itm) => itm.id === id);
  }

  getWpnNpc(id) {
    const wpns = foundry.utils.getProperty(this, `wpnNpc.liste`);

    return wpns.find((itm) => itm.id === id);
  }
}
