import { listEffects, getAllEffects } from "../../../helpers/common.mjs";

export class ArmureCapaciteDataModel extends foundry.abstract.DataModel {
  static get baseDefinition() {
    return {
      actuel: ["str", { initial: "personnalise" }],
      liste: ["obj", {}],
      base: [
        "schema",
        {
          borealis: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              support: [
                "schema",
                {
                  description: ["str", { initial: "" }],
                  energie: [
                    "schema",
                    {
                      base: ["num", { initial: 6 }],
                      allie: ["num", { initial: 2 }],
                    },
                  ],
                  activation: ["str", { initial: "tour" }],
                  duree: ["str", { initial: "" }],
                },
              ],
              offensif: [
                "schema",
                {
                  description: ["str", { initial: "" }],
                  energie: ["num", { initial: 2 }],
                  activation: ["str", { initial: "combat" }],
                  duree: ["str", { initial: "" }],
                  degats: [
                    "schema",
                    {
                      dice: ["num", { initial: 4 }],
                      fixe: ["num", { initial: 4 }],
                    },
                  ],
                  violence: [
                    "schema",
                    {
                      dice: ["num", { initial: 4 }],
                      fixe: ["num", { initial: 0 }],
                    },
                  ],
                  portee: ["str", { initial: "courte" }],
                  effets: [
                    "schema",
                    {
                      liste: ["arr", ["str", { initial: "" }]],
                      raw: [
                        "arr",
                        ["str", { initial: "" }],
                        {
                          initial: ["antianatheme", "degatscontinus 3"],
                        },
                      ],
                      custom: ["arr", ["obj", {}]],
                      chargeur: ["num", { initial: null }],
                    },
                  ],
                },
              ],
              utilitaire: [
                "schema",
                {
                  description: ["str", { initial: "" }],
                  energie: ["num", { initial: 6 }],
                  activation: ["str", { initial: "tour" }],
                  duree: ["str", { initial: "" }],
                },
              ],
              evolutions: [
                "schema",
                {
                  support: [
                    "schema",
                    {
                      description: ["str", { initial: "" }],
                      energie: [
                        "schema",
                        {
                          base: ["num", { initial: 6 }],
                          allie: ["num", { initial: 2 }],
                        },
                      ],
                      activation: ["str", { initial: "tour" }],
                      duree: ["str", { initial: "" }],
                    },
                  ],
                  offensif: [
                    "schema",
                    {
                      description: ["str", { initial: "" }],
                      energie: ["num", { initial: 2 }],
                      activation: ["str", { initial: "combat" }],
                      duree: ["str", { initial: "" }],
                      degats: [
                        "schema",
                        {
                          dice: ["num", { initial: 4 }],
                          fixe: ["num", { initial: 0 }],
                        },
                      ],
                      violence: [
                        "schema",
                        {
                          dice: ["num", { initial: 4 }],
                          fixe: ["num", { initial: 0 }],
                        },
                      ],
                      portee: ["str", { initial: "courte" }],
                      effets: [
                        "schema",
                        {
                          liste: ["arr", ["str", {}]],
                          raw: [
                            "arr",
                            ["str", {}],
                            { initial: ["antianatheme", "degatscontinus 3"] },
                          ],
                          custom: ["arr", ["obj", {}]],
                          chargeur: ["num", { initial: null }],
                        },
                      ],
                    },
                  ],
                  utilitaire: [
                    "schema",
                    {
                      description: ["str", { initial: "" }],
                      energie: ["num", { initial: 6 }],
                      activation: ["str", { initial: "tour" }],
                      duree: ["str", { initial: "" }],
                    },
                  ],
                  textarea: [
                    "schema",
                    {
                      descriptionESupport: ["num", { initial: 120 }],
                      descriptionEUtilitaire: ["num", { initial: 140 }],
                      descriptionEOffensif: ["num", { initial: 85 }],
                      dureeESupport: ["num", { initial: 50 }],
                      dureeEUtilitaire: ["num", { initial: 50 }],
                      dureeEOffensif: ["num", { initial: 50 }],
                    },
                  ],
                },
              ],
              textarea: [
                "schema",
                {
                  descriptionSupport: ["num", { initial: 120 }],
                  descriptionUtilitaire: ["num", { initial: 140 }],
                  descriptionOffensif: ["num", { initial: 85 }],
                  descriptionESupport: ["num", { initial: 120 }],
                  descriptionEUtilitaire: ["num", { initial: 140 }],
                  descriptionEOffensif: ["num", { initial: 85 }],
                  dureeSupport: ["num", { initial: 50 }],
                  dureeUtilitaire: ["num", { initial: 50 }],
                  dureeOffensif: ["num", { initial: 50 }],
                  dureeESupport: ["num", { initial: 50 }],
                  dureeEUtilitaire: ["num", { initial: 50 }],
                  dureeEOffensif: ["num", { initial: 50 }],
                },
              ],
            },
          ],
          changeling: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              activation: ["str", { initial: "tour6Sec" }],
              duree: ["str", { initial: "" }],
              portee: ["str", { initial: "" }],
              energie: [
                "schema",
                {
                  personnel: ["num", { initial: 6 }],
                  etendue: ["num", { initial: 8 }],
                  fauxEtre: [
                    "schema",
                    {
                      value: ["num", { initial: 3 }],
                      max: ["num", { initial: 4 }],
                    },
                  ],
                },
              ],
              desactivationexplosive: [
                "schema",
                {
                  label: ["str", { initial: "" }],
                  acces: ["bool", { initial: false }],
                  portee: ["str", { initial: "courte" }],
                  degats: [
                    "schema",
                    {
                      dice: ["num", { initial: 3 }],
                      fixe: ["num", { initial: 6 }],
                    },
                  ],
                  violence: [
                    "schema",
                    {
                      dice: ["num", { initial: 3 }],
                      fixe: ["num", { initial: 6 }],
                    },
                  ],
                  effets: [
                    "schema",
                    {
                      liste: ["arr", ["str", {}]],
                      raw: [
                        "arr",
                        ["str", {}],
                        {
                          initial: ["ignorearmure", "ignorechampdeforce", "dispersion 6", "choc 1"],
                        },
                      ],
                      custom: ["arr", ["obj", {}]],
                      chargeur: ["num", { initial: null }],
                    },
                  ],
                },
              ],
              evolutions: [
                "schema",
                {
                  activation: ["str", { initial: "tour6Sec" }],
                  duree: ["str", { initial: "" }],
                  portee: ["str", { initial: "" }],
                  energie: [
                    "schema",
                    {
                      personnel: ["num", { initial: 6 }],
                      etendue: ["num", { initial: 8 }],
                      fauxEtre: [
                        "schema",
                        {
                          value: ["num", { initial: 3 }],
                          max: ["num", { initial: 4 }],
                        },
                      ],
                    },
                  ],
                  desactivationexplosive: [
                    "schema",
                    {
                      label: ["str", { initial: "" }],
                      acces: ["bool", { initial: false }],
                      portee: ["str", { initial: "courte" }],
                      degats: [
                        "schema",
                        {
                          dice: ["num", { initial: 3 }],
                          fixe: ["num", { initial: 6 }],
                        },
                      ],
                      violence: [
                        "schema",
                        {
                          dice: ["num", { initial: 3 }],
                          fixe: ["num", { initial: 6 }],
                        },
                      ],
                      effets: [
                        "schema",
                        {
                          liste: ["arr", ["str", {}]],
                          raw: [
                            "arr",
                            ["str", { initial: "" }],
                            {
                              initial: [
                                "ignorearmure",
                                "ignorechampdeforce",
                                "dispersion 6",
                                "choc 1",
                              ],
                            },
                          ],
                          custom: ["arr", ["obj", {}]],
                        },
                      ],
                    },
                  ],
                  textarea: [
                    "schema",
                    {
                      duree: ["num", { initial: 50 }],
                      portee: ["num", { initial: 50 }],
                    },
                  ],
                },
              ],
              textarea: [
                "schema",
                {
                  duree: ["num", { initial: 50 }],
                  portee: ["num", { initial: 50 }],
                },
              ],
            },
          ],
          falcon: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              energie: ["num", { initial: 6 }],
              activation: ["str", { initial: "deplacement" }],
              duree: ["str", { initial: "" }],
              informations: ["str", { initial: "" }],
              textarea: [
                "schema",
                {
                  duree: ["num", { initial: 50 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  energie: ["num", { initial: 6 }],
                  activation: ["str", { initial: "deplacement" }],
                  duree: ["str", { initial: "" }],
                  informations: ["str", { initial: "" }],
                  textarea: [
                    "schema",
                    {
                      duree: ["num", { initial: 50 }],
                    },
                  ],
                },
              ],
            },
          ],
          goliath: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              energie: ["num", { initial: 2 }],
              activation: ["str", { initial: "deplacement" }],
              duree: ["str", { initial: "" }],
              taille: [
                "schema",
                {
                  value: ["num", { initial: 0 }],
                  max: ["num", { initial: 4 }],
                },
              ],
              armesRack: [
                "schema",
                {
                  label: ["str", { initial: "" }],
                  active: ["bool", { initial: true }],
                  value: ["num", { initial: 4 }],
                },
              ],
              bonus: [
                "schema",
                {
                  cdf: [
                    "schema",
                    {
                      value: ["num", { initial: 1 }],
                    },
                  ],
                  force: [
                    "schema",
                    {
                      value: ["num", { initial: 1 }],
                    },
                  ],
                  endurance: [
                    "schema",
                    {
                      value: ["num", { initial: 1 }],
                    },
                  ],
                  degats: [
                    "schema",
                    {
                      dice: ["num", { initial: 1 }],
                    },
                  ],
                  violence: [
                    "schema",
                    {
                      dice: ["num", { initial: 1 }],
                    },
                  ],
                },
              ],
              malus: [
                "schema",
                {
                  reaction: [
                    "schema",
                    {
                      value: ["num", { initial: 2 }],
                    },
                  ],
                  defense: [
                    "schema",
                    {
                      value: ["num", { initial: 1 }],
                    },
                  ],
                },
              ],
              evolutions: [
                "schema",
                {
                  energie: ["num", { initial: 2 }],
                  activation: ["str", { initial: "deplacement" }],
                  duree: ["str", { initial: "" }],
                  taille: [
                    "schema",
                    {
                      value: ["num", { initial: 0 }],
                      max: ["num", { initial: 4 }],
                    },
                  ],
                  armesRack: [
                    "schema",
                    {
                      label: ["str", { initial: "" }],
                      active: ["bool", { initial: true }],
                      value: ["num", { initial: 4 }],
                    },
                  ],
                  bonus: [
                    "schema",
                    {
                      cdf: [
                        "schema",
                        {
                          value: ["num", { initial: 1 }],
                        },
                      ],
                      force: [
                        "schema",
                        {
                          value: ["num", { initial: 1 }],
                        },
                      ],
                      endurance: [
                        "schema",
                        {
                          value: ["num", { initial: 1 }],
                        },
                      ],
                      degats: [
                        "schema",
                        {
                          dice: ["num", { initial: 1 }],
                        },
                      ],
                      violence: [
                        "schema",
                        {
                          dice: ["num", { initial: 1 }],
                        },
                      ],
                    },
                  ],
                  malus: [
                    "schema",
                    {
                      reaction: [
                        "schema",
                        {
                          value: ["num", { initial: 2 }],
                        },
                      ],
                      defense: [
                        "schema",
                        {
                          value: ["num", { initial: 1 }],
                        },
                      ],
                    },
                  ],
                  textarea: [
                    "schema",
                    {
                      duree: ["num", { initial: 50 }],
                    },
                  ],
                },
              ],
              textarea: [
                "schema",
                {
                  duree: ["num", { initial: 50 }],
                },
              ],
            },
          ],
          ghost: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              interruption: [
                "schema",
                {
                  actif: ["bool", { initial: true }],
                  label: ["str", { initial: "" }],
                },
              ],
              activation: ["str", { initial: "aucune" }],
              duree: ["str", { initial: "" }],
              energie: [
                "schema",
                {
                  tour: ["num", { initial: 2 }],
                  minute: ["num", { initial: 6 }],
                },
              ],
              bonus: [
                "schema",
                {
                  aspects: ["schema", {}],
                  reussites: ["num", { initial: 3 }],
                  attaque: ["str", { initial: "discretion" }],
                  degats: [
                    "schema",
                    {
                      caracteristique: ["str", { initial: "discretion" }],
                      inclus: [
                        "schema",
                        {
                          od: ["str", { initial: "" }],
                          dice: ["str", { initial: "" }],
                          fixe: ["str", { initial: "" }],
                        },
                      ],
                      od: ["bool", { initial: true }],
                      dice: ["bool", { initial: false }],
                      fixe: ["bool", { initial: true }],
                    },
                  ],
                },
              ],
              textarea: [
                "schema",
                {
                  duree: ["num", { initial: 50 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  interruption: [
                    "schema",
                    {
                      actif: ["bool", { initial: true }],
                      label: ["str", { initial: "" }],
                    },
                  ],
                  activation: ["str", { initial: "aucune" }],
                  duree: ["str", { initial: "" }],
                  energie: [
                    "schema",
                    {
                      tour: ["num", { initial: 2 }],
                      minute: ["num", { initial: 6 }],
                    },
                  ],
                  bonus: [
                    "schema",
                    {
                      aspects: ["schema", {}],
                      reussites: ["num", { initial: 3 }],
                      attaque: ["str", { initial: "discretion" }],
                      degats: [
                        "schema",
                        {
                          caracteristique: ["str", { initial: "discretion" }],
                          inclus: [
                            "schema",
                            {
                              od: ["str", { initial: "" }],
                              dice: ["str", { initial: "" }],
                              fixe: ["str", { initial: "" }],
                            },
                          ],
                          od: ["bool", { initial: true }],
                          dice: ["bool", { initial: false }],
                          fixe: ["bool", { initial: true }],
                        },
                      ],
                    },
                  ],
                  textarea: [
                    "schema",
                    {
                      duree: ["num", { initial: 50 }],
                    },
                  ],
                },
              ],
            },
          ],
          longbow: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              degats: [
                "schema",
                {
                  energie: ["num", { initial: 1 }],
                  min: ["num", { initial: 3 }],
                  max: ["num", { initial: 9 }],
                  adlfixe: ["num", { initial: 0 }],
                },
              ],
              violence: [
                "schema",
                {
                  energie: ["num", { initial: 1 }],
                  min: ["num", { initial: 1 }],
                  max: ["num", { initial: 7 }],
                  adlfixe: ["num", { initial: 0 }],
                },
              ],
              portee: [
                "schema",
                {
                  energie: ["num", { initial: 1 }],
                  min: ["str", { initial: "moyenne" }],
                  max: ["str", { initial: "lointaine" }],
                },
              ],
              effets: [
                "schema",
                {
                  base: [
                    "schema",
                    {
                      liste: ["arr", ["str", {}]],
                      raw: [
                        "arr",
                        ["str", { initial: "" }],
                        { initial: ["assistanceattaque", "deuxmains", "lourd"] },
                      ],
                      custom: ["arr", ["obj", {}]],
                      chargeur: ["num", { initial: null }],
                    },
                  ],
                  liste1: [
                    "schema",
                    {
                      energie: ["num", { initial: 2 }],
                      liste: ["arr", ["str", {}]],
                      raw: [
                        "arr",
                        ["str", { initial: "" }],
                        {
                          initial: [
                            "choc 1",
                            "degatscontinus 3",
                            "designation",
                            "percearmure 40",
                            "silencieux",
                            "ultraviolence",
                          ],
                        },
                      ],
                      custom: ["arr", ["obj", {}]],
                      chargeur: ["num", { initial: null }],
                    },
                  ],
                  liste2: [
                    "schema",
                    {
                      energie: ["num", { initial: 3 }],
                      liste: ["arr", ["str", {}]],
                      raw: [
                        "arr",
                        ["str", { initial: "" }],
                        {
                          initial: [
                            "antivehicule",
                            "artillerie",
                            "dispersion 3",
                            "lumiere 4",
                            "penetrant 6",
                            "percearmure 60",
                          ],
                        },
                      ],
                      custom: ["arr", ["obj", {}]],
                      chargeur: ["num", { initial: null }],
                    },
                  ],
                  liste3: [
                    "schema",
                    {
                      label: ["str", { initial: "" }],
                      acces: ["bool", { initial: false }],
                      energie: ["num", { initial: 6 }],
                      liste: ["arr", ["str", {}]],
                      raw: [
                        "arr",
                        ["str", { initial: "" }],
                        {
                          initial: [
                            "antianatheme",
                            "demoralisant",
                            "enchaine",
                            "fureur",
                            "ignorearmure",
                            "penetrant 10",
                          ],
                        },
                      ],
                      custom: ["arr", ["obj", {}]],
                      chargeur: ["num", { initial: null }],
                    },
                  ],
                },
              ],
              distance: [
                "schema",
                {
                  raw: ["str", {}],
                  custom: ["arr", ["obj", {}]],
                },
              ],
              specialEvolutions: [
                "schema",
                {
                  1: [
                    "schema",
                    {
                      value: ["num", { initial: 50 }],
                      description: ["str", { initial: "" }],
                      effets: [
                        "schema",
                        {
                          liste1: [
                            "schema",
                            {
                              liste: ["arr", ["str", {}]],
                              raw: [
                                "arr",
                                ["str", { initial: "" }],
                                {
                                  initial: [
                                    "choc 1",
                                    "degatscontinus 3",
                                    "designation",
                                    "percearmure 40",
                                    "silencieux",
                                    "ultraviolence",
                                  ],
                                },
                              ],
                              custom: ["arr", ["obj", {}]],
                            },
                          ],
                          liste2: [
                            "schema",
                            {
                              liste: ["arr", ["str", {}]],
                              raw: [
                                "arr",
                                ["str", { initial: "" }],
                                {
                                  initial: [
                                    "antivehicule",
                                    "artillerie",
                                    "dispersion 3",
                                    "lumiere 4",
                                    "penetrant 6",
                                    "percearmure 60",
                                  ],
                                },
                              ],
                              custom: ["arr", ["obj", {}]],
                            },
                          ],
                          liste3: [
                            "schema",
                            {
                              label: ["str", { initial: "" }],
                              acces: ["bool", { initial: true }],
                              liste: ["arr", ["str", {}]],
                              raw: [
                                "arr",
                                ["str", { initial: "" }],
                                {
                                  initial: [
                                    "antianatheme",
                                    "demoralisant",
                                    "enchaine",
                                    "fureur",
                                    "ignorearmure",
                                    "penetrant 10",
                                  ],
                                },
                              ],
                              custom: ["arr", ["obj", {}]],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  2: [
                    "schema",
                    {
                      value: ["num", { initial: 50 }],
                      description: ["str", { initial: "" }],
                      degats: [
                        "schema",
                        {
                          min: ["num", { initial: 5 }],
                          max: ["num", { initial: 14 }],
                        },
                      ],
                      violence: [
                        "schema",
                        {
                          min: ["num", { initial: 3 }],
                          max: ["num", { initial: 12 }],
                        },
                      ],
                    },
                  ],
                  3: [
                    "schema",
                    {
                      value: ["num", { initial: 50 }],
                      description: ["str", { initial: "" }],
                      effets: [
                        "schema",
                        {
                          base: [
                            "schema",
                            {
                              liste: ["arr", ["str", {}]],
                              raw: [
                                "arr",
                                ["str", { initial: "" }],
                                { initial: ["assistanceattaque", "deuxmains"] },
                              ],
                              custom: ["arr", ["obj", {}]],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  4: [
                    "schema",
                    {
                      value: ["num", { initial: 100 }],
                      description: ["str", { initial: "" }],
                      effets: [
                        "schema",
                        {
                          liste1: [
                            "schema",
                            {
                              energie: ["num", { initial: 1 }],
                            },
                          ],
                          liste2: [
                            "schema",
                            {
                              energie: ["num", { initial: 1 }],
                            },
                          ],
                          liste3: [
                            "schema",
                            {
                              energie: ["num", { initial: 4 }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          mechanic: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              activation: [
                "schema",
                {
                  contact: ["str", { initial: "deplacement" }],
                  distance: ["str", { initial: "deplacement" }],
                },
              ],
              portee: ["str", { initial: "" }],
              reparation: [
                "schema",
                {
                  contact: [
                    "schema",
                    {
                      duree: ["str", { initial: "" }],
                      dice: ["num", { initial: 3 }],
                      fixe: ["num", { initial: 6 }],
                    },
                  ],
                  distance: [
                    "schema",
                    {
                      duree: ["str", { initial: "" }],
                      dice: ["num", { initial: 2 }],
                      fixe: ["num", { initial: 6 }],
                    },
                  ],
                },
              ],
              energie: [
                "schema",
                {
                  contact: ["num", { initial: 4 }],
                  distance: ["num", { initial: 6 }],
                },
              ],
              textarea: [
                "schema",
                {
                  dureeContact: ["num", { initial: 50 }],
                  dureeDistance: ["num", { initial: 50 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  activation: ["str", { initial: "deplacement" }],
                  portee: ["str", { initial: "" }],
                  reparation: [
                    "schema",
                    {
                      contact: [
                        "schema",
                        {
                          duree: ["str", { initial: "" }],
                          dice: ["num", { initial: 3 }],
                          fixe: ["num", { initial: 6 }],
                        },
                      ],
                      distance: [
                        "schema",
                        {
                          duree: ["str", { initial: "" }],
                          dice: ["num", { initial: 2 }],
                          fixe: ["num", { initial: 6 }],
                        },
                      ],
                    },
                  ],
                  energie: [
                    "schema",
                    {
                      contact: ["num", { initial: 4 }],
                      distance: ["num", { initial: 6 }],
                    },
                  ],
                  textarea: [
                    "schema",
                    {
                      dureeContact: ["num", { initial: 50 }],
                      dureeDistance: ["num", { initial: 50 }],
                    },
                  ],
                },
              ],
            },
          ],
          nanoc: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              activation: ["str", { initial: "toutes" }],
              duree: ["str", { initial: "" }],
              energie: [
                "schema",
                {
                  base: ["num", { initial: 3 }],
                  detaille: ["num", { initial: 6 }],
                  mecanique: ["num", { initial: 9 }],
                  prolonger: ["num", { initial: 2 }],
                },
              ],
              textarea: [
                "schema",
                {
                  duree: ["num", { initial: 50 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  activation: ["str", { initial: "toutes" }],
                  duree: ["str", { initial: "" }],
                  energie: [
                    "schema",
                    {
                      base: ["num", { initial: 3 }],
                      detaille: ["num", { initial: 6 }],
                      mecanique: ["num", { initial: 9 }],
                      prolonger: ["num", { initial: 2 }],
                    },
                  ],
                  textarea: [
                    "schema",
                    {
                      duree: ["num", { initial: 50 }],
                    },
                  ],
                },
              ],
            },
          ],
          oriflamme: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              activation: ["str", { initial: "deplacement" }],
              duree: ["str", { initial: "" }],
              portee: ["str", { initial: "courte" }],
              energie: ["num", { initial: 12 }],
              degats: [
                "schema",
                {
                  dice: ["num", { initial: 6 }],
                  fixe: ["num", { initial: 6 }],
                },
              ],
              violence: [
                "schema",
                {
                  dice: ["num", { initial: 6 }],
                  fixe: ["num", { initial: 12 }],
                },
              ],
              effets: [
                "schema",
                {
                  liste: ["arr", ["str", {}]],
                  raw: [
                    "arr",
                    ["str", { initial: "" }],
                    { initial: ["antianatheme", "lumiere 2"] },
                  ],
                  custom: ["arr", ["obj", {}]],
                  chargeur: ["num", { initial: null }],
                },
              ],
              textarea: [
                "schema",
                {
                  duree: ["num", { initial: 50 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  activation: ["str", { initial: "deplacement" }],
                  duree: ["str", { initial: "" }],
                  portee: ["str", { initial: "courte" }],
                  energie: ["num", { initial: 12 }],
                  degats: [
                    "schema",
                    {
                      dice: ["num", { initial: 6 }],
                      fixe: ["num", { initial: 6 }],
                    },
                  ],
                  violence: [
                    "schema",
                    {
                      dice: ["num", { initial: 6 }],
                      fixe: ["num", { initial: 12 }],
                    },
                  ],
                  effets: [
                    "schema",
                    {
                      liste: ["arr", ["str", {}]],
                      raw: [
                        "arr",
                        ["str", { initial: "" }],
                        { initial: ["antianatheme", "lumiere 2"] },
                      ],
                      custom: ["arr", ["obj", {}]],
                    },
                  ],
                  textarea: [
                    "schema",
                    {
                      duree: ["num", { initial: 50 }],
                    },
                  ],
                },
              ],
            },
          ],
          shrine: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              activation: ["str", { initial: "aucune" }],
              duree: ["str", { initial: "" }],
              portee: ["str", { initial: "" }],
              energie: [
                "schema",
                {
                  personnel: ["num", { initial: 1 }],
                  distance: ["num", { initial: 2 }],
                  acces6tours: ["bool", { initial: false }],
                  personnel6tours: ["num", { initial: 5 }],
                  distance6tours: ["num", { initial: 10 }],
                },
              ],
              champdeforce: ["num", { initial: 6 }],
              requis: [
                "schema",
                {
                  force: ["num", { initial: 5 }],
                  chair: ["num", { initial: 10 }],
                },
              ],
              textarea: [
                "schema",
                {
                  duree: ["num", { initial: 50 }],
                  portee: ["num", { initial: 50 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  activation: ["str", { initial: "aucun" }],
                  duree: ["str", { initial: "" }],
                  portee: ["str", { initial: "" }],
                  energie: [
                    "schema",
                    {
                      personnel: ["num", { initial: 1 }],
                      distance: ["num", { initial: 2 }],
                      acces6tours: ["bool", { initial: false }],
                      personnel6tours: ["num", { initial: 5 }],
                      distance6tours: ["num", { initial: 10 }],
                    },
                  ],
                  champdeforce: ["num", { initial: 6 }],
                  requis: [
                    "schema",
                    {
                      force: ["num", { initial: 5 }],
                      chair: ["num", { initial: 10 }],
                    },
                  ],
                  textarea: [
                    "schema",
                    {
                      duree: ["num", { initial: 50 }],
                      portee: ["num", { initial: 50 }],
                    },
                  ],
                },
              ],
            },
          ],
          type: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              activation: ["str", { initial: "deplacement" }],
              duree: ["str", { initial: "" }],
              nbreType: ["num", { initial: 3 }],
              energie: [
                "schema",
                {
                  tour: ["num", { initial: 1 }],
                  scene: ["num", { initial: 6 }],
                },
              ],
              type: [
                "schema",
                {
                  soldier: [
                    "schema",
                    {
                      aspect: ["str", { initial: "chair" }],
                      liste: [
                        "schema",
                        {
                          deplacement: [
                            "schema",
                            {
                              value: ["num", { initial: 1 }],
                            },
                          ],
                          force: [
                            "schema",
                            {
                              value: ["num", { initial: 1 }],
                            },
                          ],
                          endurance: [
                            "schema",
                            {
                              value: ["num", { initial: 1 }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  hunter: [
                    "schema",
                    {
                      aspect: ["str", { initial: "bete" }],
                      liste: [
                        "schema",
                        {
                          hargne: [
                            "schema",
                            {
                              value: ["num", { initial: 1 }],
                            },
                          ],
                          combat: [
                            "schema",
                            {
                              value: ["num", { initial: 1 }],
                            },
                          ],
                          instinct: [
                            "schema",
                            {
                              value: ["num", { initial: 1 }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  scholar: [
                    "schema",
                    {
                      aspect: ["str", { initial: "machine" }],
                      liste: [
                        "schema",
                        {
                          tir: [
                            "schema",
                            {
                              value: ["num", { initial: 1 }],
                            },
                          ],
                          savoir: [
                            "schema",
                            {
                              value: ["num", { initial: 1 }],
                            },
                          ],
                          technique: [
                            "schema",
                            {
                              value: ["num", { initial: 1 }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  herald: [
                    "schema",
                    {
                      aspect: ["str", { initial: "dame" }],
                      liste: [
                        "schema",
                        {
                          aura: [
                            "schema",
                            {
                              value: ["num", { initial: 1 }],
                            },
                          ],
                          parole: [
                            "schema",
                            {
                              value: ["num", { initial: 1 }],
                            },
                          ],
                          sangFroid: [
                            "schema",
                            {
                              value: ["num", { initial: 1 }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  scout: [
                    "schema",
                    {
                      aspect: ["str", { initial: "masque" }],
                      liste: [
                        "schema",
                        {
                          discretion: [
                            "schema",
                            {
                              value: ["num", { initial: 1 }],
                            },
                          ],
                          dexterite: [
                            "schema",
                            {
                              value: ["num", { initial: 1 }],
                            },
                          ],
                          perception: [
                            "schema",
                            {
                              value: ["num", { initial: 1 }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
              textarea: [
                "schema",
                {
                  duree: ["num", { initial: 50 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  activation: ["str", { initial: "deplacement" }],
                  duree: ["str", { initial: "" }],
                  nbreType: ["num", { initial: 3 }],
                  energie: [
                    "schema",
                    {
                      tour: ["num", { initial: 1 }],
                      scene: ["num", { initial: 6 }],
                    },
                  ],
                  type: [
                    "schema",
                    {
                      soldier: [
                        "schema",
                        {
                          aspect: ["str", { initial: "chair" }],
                          liste: [
                            "schema",
                            {
                              deplacement: [
                                "schema",
                                {
                                  value: ["num", { initial: 1 }],
                                },
                              ],
                              force: [
                                "schema",
                                {
                                  value: ["num", { initial: 1 }],
                                },
                              ],
                              endurance: [
                                "schema",
                                {
                                  value: ["num", { initial: 1 }],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                      hunter: [
                        "schema",
                        {
                          aspect: ["str", { initial: "bete" }],
                          liste: [
                            "schema",
                            {
                              hargne: [
                                "schema",
                                {
                                  value: ["num", { initial: 1 }],
                                },
                              ],
                              combat: [
                                "schema",
                                {
                                  value: ["num", { initial: 1 }],
                                },
                              ],
                              instinct: [
                                "schema",
                                {
                                  value: ["num", { initial: 1 }],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                      scholar: [
                        "schema",
                        {
                          aspect: ["str", { initial: "machine" }],
                          liste: [
                            "schema",
                            {
                              tir: [
                                "schema",
                                {
                                  value: ["num", { initial: 1 }],
                                },
                              ],
                              savoir: [
                                "schema",
                                {
                                  value: ["num", { initial: 1 }],
                                },
                              ],
                              technique: [
                                "schema",
                                {
                                  value: ["num", { initial: 1 }],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                      herald: [
                        "schema",
                        {
                          aspect: ["str", { initial: "dame" }],
                          liste: [
                            "schema",
                            {
                              aura: [
                                "schema",
                                {
                                  value: ["num", { initial: 1 }],
                                },
                              ],
                              parole: [
                                "schema",
                                {
                                  value: ["num", { initial: 1 }],
                                },
                              ],
                              sangFroid: [
                                "schema",
                                {
                                  value: ["num", { initial: 1 }],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                      scout: [
                        "schema",
                        {
                          aspect: ["str", { initial: "masque" }],
                          liste: [
                            "schema",
                            {
                              discretion: [
                                "schema",
                                {
                                  value: ["num", { initial: 1 }],
                                },
                              ],
                              dexterite: [
                                "schema",
                                {
                                  value: ["num", { initial: 1 }],
                                },
                              ],
                              perception: [
                                "schema",
                                {
                                  value: ["num", { initial: 1 }],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  textarea: [
                    "schema",
                    {
                      duree: ["num", { initial: 50 }],
                    },
                  ],
                },
              ],
            },
          ],
          vision: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              activation: ["str", { initial: "deplacement6Sec" }],
              duree: ["str", { initial: "" }],
              energie: [
                "schema",
                {
                  min: ["num", { initial: 5 }],
                  max: ["num", { initial: 10 }],
                },
              ],
              textarea: [
                "schema",
                {
                  duree: ["num", { initial: 50 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  activation: ["str", { initial: "deplacement6Sec" }],
                  duree: ["str", { initial: "" }],
                  energie: [
                    "schema",
                    {
                      min: ["num", { initial: 5 }],
                      max: ["num", { initial: 10 }],
                    },
                  ],
                  textarea: [
                    "schema",
                    {
                      duree: ["num", { initial: 50 }],
                    },
                  ],
                },
              ],
            },
          ],
          warlord: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              impulsions: [
                "schema",
                {
                  selection: ["num", { initial: 3 }],
                  action: [
                    "schema",
                    {
                      activation: ["str", { initial: "deplacement" }],
                      duree: ["str", { initial: "" }],
                      bonus: [
                        "schema",
                        {
                          description: ["str", { initial: "" }],
                        },
                      ],
                      energie: [
                        "schema",
                        {
                          allie: ["num", { initial: 4 }],
                          porteur: ["num", { initial: 10 }],
                        },
                      ],
                    },
                  ],
                  esquive: [
                    "schema",
                    {
                      activation: ["str", { initial: "deplacement" }],
                      duree: ["str", { initial: "" }],
                      bonus: [
                        "schema",
                        {
                          reaction: ["num", { initial: 2 }],
                          defense: ["num", { initial: 2 }],
                        },
                      ],
                      energie: [
                        "schema",
                        {
                          allie: ["num", { initial: 3 }],
                          porteur: ["num", { initial: 2 }],
                          prolonger: ["num", { initial: 2 }],
                        },
                      ],
                    },
                  ],
                  force: [
                    "schema",
                    {
                      activation: ["str", { initial: "deplacement" }],
                      duree: ["str", { initial: "" }],
                      bonus: [
                        "schema",
                        {
                          champDeForce: ["num", { initial: 2 }],
                        },
                      ],
                      energie: [
                        "schema",
                        {
                          allie: ["num", { initial: 2 }],
                          porteur: ["num", { initial: 1 }],
                          prolonger: ["num", { initial: 1 }],
                        },
                      ],
                    },
                  ],
                  guerre: [
                    "schema",
                    {
                      activation: ["str", { initial: "deplacement" }],
                      duree: ["str", { initial: "" }],
                      bonus: [
                        "schema",
                        {
                          degats: ["num", { initial: 1 }],
                          violence: ["num", { initial: 1 }],
                        },
                      ],
                      energie: [
                        "schema",
                        {
                          allie: ["num", { initial: 1 }],
                          porteur: ["num", { initial: 1 }],
                          prolonger: ["num", { initial: 1 }],
                        },
                      ],
                    },
                  ],
                  energie: [
                    "schema",
                    {
                      activation: ["str", { initial: "deplacement" }],
                      duree: ["str", { initial: "" }],
                      bonus: [
                        "schema",
                        {
                          description: ["str", { initial: "" }],
                        },
                      ],
                      energie: [
                        "schema",
                        {
                          min: ["num", { initial: 1 }],
                          max: ["num", { initial: 5 }],
                        },
                      ],
                    },
                  ],
                },
              ],
              textarea: [
                "schema",
                {
                  dureeAction: ["num", { initial: 50 }],
                  dureeForce: ["num", { initial: 50 }],
                  dureeEnergie: ["num", { initial: 50 }],
                  dureeEsquive: ["num", { initial: 50 }],
                  dureeGuerre: ["num", { initial: 50 }],
                  bonusAction: ["num", { initial: 85 }],
                  bonusEnergie: ["num", { initial: 110 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  impulsions: [
                    "schema",
                    {
                      selection: ["num", { initial: 3 }],
                      action: [
                        "schema",
                        {
                          activation: ["str", { initial: "deplacement" }],
                          duree: ["str", { initial: "" }],
                          bonus: [
                            "schema",
                            {
                              description: ["str", { initial: "" }],
                            },
                          ],
                          energie: [
                            "schema",
                            {
                              allie: ["num", { initial: 4 }],
                              porteur: ["num", { initial: 10 }],
                            },
                          ],
                        },
                      ],
                      esquive: [
                        "schema",
                        {
                          activation: ["str", { initial: "deplacement" }],
                          duree: ["str", { initial: "" }],
                          bonus: [
                            "schema",
                            {
                              reaction: ["num", { initial: 2 }],
                              defense: ["num", { initial: 2 }],
                            },
                          ],
                          energie: [
                            "schema",
                            {
                              allie: ["num", { initial: 3 }],
                              porteur: ["num", { initial: 2 }],
                              prolonger: ["num", { initial: 2 }],
                            },
                          ],
                        },
                      ],
                      force: [
                        "schema",
                        {
                          activation: ["str", { initial: "deplacement" }],
                          duree: ["str", { initial: "" }],
                          bonus: [
                            "schema",
                            {
                              champDeForce: ["num", { initial: 2 }],
                            },
                          ],
                          energie: [
                            "schema",
                            {
                              allie: ["num", { initial: 2 }],
                              porteur: ["num", { initial: 1 }],
                              prolonger: ["num", { initial: 1 }],
                            },
                          ],
                        },
                      ],
                      guerre: [
                        "schema",
                        {
                          activation: ["str", { initial: "deplacement" }],
                          duree: ["str", { initial: "" }],
                          bonus: [
                            "schema",
                            {
                              degats: ["num", { initial: 1 }],
                              violence: ["num", { initial: 1 }],
                            },
                          ],
                          energie: [
                            "schema",
                            {
                              allie: ["num", { initial: 1 }],
                              porteur: ["num", { initial: 1 }],
                              prolonger: ["num", { initial: 1 }],
                            },
                          ],
                        },
                      ],
                      energie: [
                        "schema",
                        {
                          activation: ["str", { initial: "deplacement" }],
                          duree: ["str", { initial: "" }],
                          bonus: [
                            "schema",
                            {
                              description: ["str", { initial: "" }],
                            },
                          ],
                          energie: [
                            "schema",
                            {
                              min: ["num", { initial: 1 }],
                              max: ["num", { initial: 5 }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  textarea: [
                    "schema",
                    {
                      dureeAction: ["num", { initial: 50 }],
                      dureeForce: ["num", { initial: 50 }],
                      dureeEnergie: ["num", { initial: 50 }],
                      dureeEsquive: ["num", { initial: 50 }],
                      dureeGuerre: ["num", { initial: 50 }],
                      bonusAction: ["num", { initial: 85 }],
                      bonusEnergie: ["num", { initial: 110 }],
                    },
                  ],
                },
              ],
            },
          ],
          watchtower: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              activation: ["str", { initial: "deplacement3Sec" }],
              duree: ["str", { initial: "" }],
              energie: ["num", { initial: 2 }],
              textarea: [
                "schema",
                {
                  duree: ["num", { initial: 50 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  activation: ["str", { initial: "deplacement3Sec" }],
                  duree: ["str", { initial: "" }],
                  energie: ["num", { initial: 2 }],
                  textarea: [
                    "schema",
                    {
                      duree: ["num", { initial: 50 }],
                    },
                  ],
                },
              ],
            },
          ],
          personnalise: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
            },
          ],
        },
      ],
      c2038: [
        "schema",
        {
          cea: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              energie: ["num", { initial: 3 }],
              activation: ["str", { initial: "combat" }],
              duree: ["str", { initial: "" }],
              espoir: ["num", { initial: 1 }],
              vague: [
                "schema",
                {
                  degats: [
                    "schema",
                    {
                      dice: ["num", { initial: 3 }],
                      fixe: ["num", { initial: 0 }],
                    },
                  ],
                  violence: [
                    "schema",
                    {
                      dice: ["num", { initial: 3 }],
                      fixe: ["num", { initial: 0 }],
                    },
                  ],
                  portee: ["str", { initial: "" }],
                  effets: [
                    "schema",
                    {
                      liste: ["arr", ["str", {}]],
                      raw: [
                        "arr",
                        ["str", { initial: "" }],
                        { initial: ["parasitage 2", "dispersion 3", "destructeur", "choc 2"] },
                      ],
                      custom: ["arr", ["obj", {}]],
                      chargeur: ["num", { initial: null }],
                    },
                  ],
                },
              ],
              salve: [
                "schema",
                {
                  degats: [
                    "schema",
                    {
                      dice: ["num", { initial: 3 }],
                      fixe: ["num", { initial: 0 }],
                    },
                  ],
                  violence: [
                    "schema",
                    {
                      dice: ["num", { initial: 3 }],
                      fixe: ["num", { initial: 0 }],
                    },
                  ],
                  portee: ["str", { initial: "" }],
                  effets: [
                    "schema",
                    {
                      liste: ["arr", ["str", {}]],
                      raw: [
                        "arr",
                        ["str", { initial: "" }],
                        {
                          initial: ["ultraviolence", "meurtrier 3", "dispersion 3", "parasitage 1"],
                        },
                      ],
                      custom: ["arr", ["obj", {}]],
                      chargeur: ["num", { initial: null }],
                    },
                  ],
                },
              ],
              rayon: [
                "schema",
                {
                  degats: [
                    "schema",
                    {
                      dice: ["num", { initial: 4 }],
                      fixe: ["num", { initial: 0 }],
                    },
                  ],
                  violence: [
                    "schema",
                    {
                      dice: ["num", { initial: 2 }],
                      fixe: ["num", { initial: 0 }],
                    },
                  ],
                  portee: ["str", { initial: "" }],
                  effets: [
                    "schema",
                    {
                      liste: ["arr", ["str", {}]],
                      raw: [
                        "arr",
                        ["str", { initial: "" }],
                        { initial: ["parasitage 1", "percearmure 40"] },
                      ],
                      custom: ["arr", ["obj", {}]],
                      chargeur: ["num", { initial: null }],
                    },
                  ],
                },
              ],
              textarea: [
                "schema",
                {
                  descriptionVague: ["num", { initial: 70 }],
                  descriptionSalve: ["num", { initial: 75 }],
                  descriptionRayon: ["num", { initial: 150 }],
                  porteeVague: ["num", { initial: 50 }],
                  porteeSalve: ["num", { initial: 50 }],
                  porteeRayon: ["num", { initial: 50 }],
                  duree: ["num", { initial: 50 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  energie: ["num", { initial: 3 }],
                  activation: ["str", { initial: "combat" }],
                  duree: ["str", { initial: "" }],
                  espoir: ["num", { initial: 1 }],
                  vague: [
                    "schema",
                    {
                      degats: [
                        "schema",
                        {
                          dice: ["num", { initial: 3 }],
                          fixe: ["num", { initial: 0 }],
                        },
                      ],
                      violence: [
                        "schema",
                        {
                          dice: ["num", { initial: 3 }],
                          fixe: ["num", { initial: 0 }],
                        },
                      ],
                      portee: ["str", { initial: "" }],
                      effets: [
                        "schema",
                        {
                          liste: ["arr", ["str", {}]],
                          raw: [
                            "arr",
                            ["str", { initial: "" }],
                            { initial: ["parasitage 2", "dispersion 3", "destructeur", "choc 2"] },
                          ],
                          custom: ["arr", ["obj", {}]],
                        },
                      ],
                    },
                  ],
                  salve: [
                    "schema",
                    {
                      degats: [
                        "schema",
                        {
                          dice: ["num", { initial: 3 }],
                          fixe: ["num", { initial: 0 }],
                        },
                      ],
                      violence: [
                        "schema",
                        {
                          dice: ["num", { initial: 3 }],
                          fixe: ["num", { initial: 0 }],
                        },
                      ],
                      portee: ["str", { initial: "" }],
                      effets: [
                        "schema",
                        {
                          liste: ["arr", ["str", {}]],
                          raw: [
                            "arr",
                            ["str", { initial: "" }],
                            {
                              initial: [
                                "ultraviolence",
                                "meurtrier 3",
                                "dispersion 3",
                                "parasitage 1",
                              ],
                            },
                          ],
                          custom: ["arr", ["obj", {}]],
                        },
                      ],
                    },
                  ],
                  rayon: [
                    "schema",
                    {
                      degats: [
                        "schema",
                        {
                          dice: ["num", { initial: 4 }],
                          fixe: ["num", { initial: 0 }],
                        },
                      ],
                      violence: [
                        "schema",
                        {
                          dice: ["num", { initial: 2 }],
                          fixe: ["num", { initial: 0 }],
                        },
                      ],
                      portee: ["str", { initial: "" }],
                      effets: [
                        "schema",
                        {
                          liste: ["arr", ["str", {}]],
                          raw: [
                            "arr",
                            ["str", { initial: "" }],
                            { initial: ["parasitage 1", "percearmure 40"] },
                          ],
                          custom: ["arr", ["obj", {}]],
                        },
                      ],
                    },
                  ],
                  textarea: [
                    "schema",
                    {
                      descriptionVague: ["num", { initial: 70 }],
                      descriptionSalve: ["num", { initial: 75 }],
                      descriptionRayon: ["num", { initial: 150 }],
                      porteeVague: ["num", { initial: 50 }],
                      porteeSalve: ["num", { initial: 50 }],
                      porteeRayon: ["num", { initial: 50 }],
                      duree: ["num", { initial: 50 }],
                    },
                  ],
                },
              ],
            },
          ],
          discord: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              special: [
                "schema",
                {
                  c2038: ["str", { initial: "recolteflux" }],
                },
              ],
              malus: [
                "schema",
                {
                  reaction: ["num", { initial: 2 }],
                  defense: ["num", { initial: 2 }],
                  actions: ["num", { initial: 2 }],
                },
              ],
              tour: [
                "schema",
                {
                  flux: ["num", { initial: 1 }],
                  energie: ["num", { initial: 2 }],
                  activation: ["str", { initial: "deplacement" }],
                  duree: ["str", { initial: "" }],
                },
              ],
              scene: [
                "schema",
                {
                  flux: ["num", { initial: 3 }],
                  energie: ["num", { initial: 6 }],
                  activation: ["str", { initial: "deplacement" }],
                  duree: ["str", { initial: "" }],
                },
              ],
              textarea: [
                "schema",
                {
                  dureeTour: ["num", { initial: 50 }],
                  dureeScene: ["num", { initial: 50 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  malus: [
                    "schema",
                    {
                      reaction: ["num", { initial: 2 }],
                      defense: ["num", { initial: 2 }],
                      actions: ["num", { initial: 2 }],
                    },
                  ],
                  tour: [
                    "schema",
                    {
                      flux: ["num", { initial: 1 }],
                      energie: ["num", { initial: 2 }],
                      activation: ["str", { initial: "deplacement" }],
                      duree: ["str", { initial: "" }],
                    },
                  ],
                  scene: [
                    "schema",
                    {
                      flux: ["num", { initial: 3 }],
                      energie: ["num", { initial: 6 }],
                      activation: ["str", { initial: "deplacement" }],
                      duree: ["str", { initial: "" }],
                    },
                  ],
                  textarea: [
                    "schema",
                    {
                      dureeTour: ["num", { initial: 50 }],
                      dureeScene: ["num", { initial: 50 }],
                    },
                  ],
                },
              ],
            },
          ],
          puppet: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              special: [
                "schema",
                {
                  c2038: ["str", { initial: "recolteflux" }],
                },
              ],
              duree: ["str", { initial: "" }],
              activation: ["str", { initial: "deplacement" }],
              creatures: ["num", { initial: 3 }],
              energie: [
                "schema",
                {
                  ordre: ["num", { initial: 2 }],
                  supplementaire: ["num", { initial: 3 }],
                  prolonger: ["num", { initial: 1 }],
                },
              ],
              flux: [
                "schema",
                {
                  has: ["bool", { initial: true }],
                  ordre: ["num", { initial: 1 }],
                  supplementaire: ["num", { initial: 1 }],
                  prolonger: ["num", { initial: 1 }],
                },
              ],
              textarea: [
                "schema",
                {
                  duree: ["num", { initial: 50 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  duree: ["str", { initial: "" }],
                  activation: ["str", { initial: "deplacement" }],
                  creatures: ["num", { initial: 3 }],
                  energie: [
                    "schema",
                    {
                      ordre: ["num", { initial: 2 }],
                      supplementaire: ["num", { initial: 3 }],
                      prolonger: ["num", { initial: 1 }],
                    },
                  ],
                  flux: [
                    "schema",
                    {
                      has: ["bool", { initial: true }],
                      ordre: ["num", { initial: 1 }],
                      supplementaire: ["num", { initial: 1 }],
                      prolonger: ["num", { initial: 1 }],
                    },
                  ],
                  textarea: [
                    "schema",
                    {
                      duree: ["num", { initial: 50 }],
                    },
                  ],
                },
              ],
            },
          ],
          windtalker: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              special: [
                "schema",
                {
                  c2038: ["str", { initial: "recolteflux" }],
                },
              ],
              flux: ["num", { initial: 2 }],
              energie: ["num", { initial: 4 }],
              activation: ["str", { initial: "deplacement" }],
              duree: ["str", { initial: "" }],
              textarea: [
                "schema",
                {
                  duree: ["num", { initial: 50 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  flux: ["num", { initial: 2 }],
                  energie: ["num", { initial: 4 }],
                  activation: ["str", { initial: "deplacement" }],
                  duree: ["str", { initial: "" }],
                  textarea: [
                    "schema",
                    {
                      duree: ["num", { initial: 50 }],
                    },
                  ],
                },
              ],
            },
          ],
          zen: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              espoir: ["num", { initial: 0 }],
              difficulte: ["num", { initial: 5 }],
              aspects: [
                "schema",
                {
                  chair: [
                    "schema",
                    {
                      caracteristiques: [
                        "schema",
                        {
                          deplacement: [
                            "schema",
                            {
                              value: ["bool", { initial: false }],
                            },
                          ],
                          force: [
                            "schema",
                            {
                              value: ["bool", { initial: false }],
                            },
                          ],
                          endurance: [
                            "schema",
                            {
                              value: ["bool", { initial: false }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  bete: [
                    "schema",
                    {
                      caracteristiques: [
                        "schema",
                        {
                          hargne: [
                            "schema",
                            {
                              value: ["bool", { initial: true }],
                            },
                          ],
                          combat: [
                            "schema",
                            {
                              value: ["bool", { initial: false }],
                            },
                          ],
                          instinct: [
                            "schema",
                            {
                              value: ["bool", { initial: false }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  machine: [
                    "schema",
                    {
                      caracteristiques: [
                        "schema",
                        {
                          tir: [
                            "schema",
                            {
                              value: ["bool", { initial: false }],
                            },
                          ],
                          savoir: [
                            "schema",
                            {
                              value: ["bool", { initial: false }],
                            },
                          ],
                          technique: [
                            "schema",
                            {
                              value: ["bool", { initial: false }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  dame: [
                    "schema",
                    {
                      caracteristiques: [
                        "schema",
                        {
                          aura: [
                            "schema",
                            {
                              value: ["bool", { initial: false }],
                            },
                          ],
                          parole: [
                            "schema",
                            {
                              value: ["bool", { initial: false }],
                            },
                          ],
                          sangFroid: [
                            "schema",
                            {
                              value: ["bool", { initial: true }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  masque: [
                    "schema",
                    {
                      caracteristiques: [
                        "schema",
                        {
                          discretion: [
                            "schema",
                            {
                              value: ["bool", { initial: false }],
                            },
                          ],
                          dexterite: [
                            "schema",
                            {
                              value: ["bool", { initial: false }],
                            },
                          ],
                          perception: [
                            "schema",
                            {
                              value: ["bool", { initial: false }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
              evolutions: [
                "schema",
                {
                  espoir: ["num", { initial: 0 }],
                  difficulte: ["num", { initial: 5 }],
                  aspects: [
                    "schema",
                    {
                      chair: [
                        "schema",
                        {
                          caracteristiques: [
                            "schema",
                            {
                              deplacement: [
                                "schema",
                                {
                                  value: ["bool", { initial: false }],
                                },
                              ],
                              force: [
                                "schema",
                                {
                                  value: ["bool", { initial: false }],
                                },
                              ],
                              endurance: [
                                "schema",
                                {
                                  value: ["bool", { initial: false }],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                      bete: [
                        "schema",
                        {
                          caracteristiques: [
                            "schema",
                            {
                              hargne: [
                                "schema",
                                {
                                  value: ["bool", { initial: true }],
                                },
                              ],
                              combat: [
                                "schema",
                                {
                                  value: ["bool", { initial: false }],
                                },
                              ],
                              instinct: [
                                "schema",
                                {
                                  value: ["bool", { initial: false }],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                      machine: [
                        "schema",
                        {
                          caracteristiques: [
                            "schema",
                            {
                              tir: [
                                "schema",
                                {
                                  value: ["bool", { initial: false }],
                                },
                              ],
                              savoir: [
                                "schema",
                                {
                                  value: ["bool", { initial: false }],
                                },
                              ],
                              technique: [
                                "schema",
                                {
                                  value: ["bool", { initial: false }],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                      dame: [
                        "schema",
                        {
                          caracteristiques: [
                            "schema",
                            {
                              aura: [
                                "schema",
                                {
                                  value: ["bool", { initial: false }],
                                },
                              ],
                              parole: [
                                "schema",
                                {
                                  value: ["bool", { initial: false }],
                                },
                              ],
                              sangFroid: [
                                "schema",
                                {
                                  value: ["bool", { initial: true }],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                      masque: [
                        "schema",
                        {
                          caracteristiques: [
                            "schema",
                            {
                              discretion: [
                                "schema",
                                {
                                  value: ["bool", { initial: false }],
                                },
                              ],
                              dexterite: [
                                "schema",
                                {
                                  value: ["bool", { initial: false }],
                                },
                              ],
                              perception: [
                                "schema",
                                {
                                  value: ["bool", { initial: false }],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      c2038Necromancer: [
        "schema",
        {
          sarcophage: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              bonus: [
                "schema",
                {
                  paliers: ["num", { initial: 7 }],
                  liste: [
                    "schema",
                    {
                      b0: [
                        "schema",
                        {
                          pg: [
                            "schema",
                            {
                              min: ["num", { initial: 0 }],
                              max: ["num", { initial: 49 }],
                            },
                          ],
                          offert: ["str", { initial: "" }],
                        },
                      ],
                      b1: [
                        "schema",
                        {
                          pg: [
                            "schema",
                            {
                              min: ["num", { initial: 50 }],
                              max: ["num", { initial: 99 }],
                            },
                          ],
                          offert: ["str", { initial: "" }],
                        },
                      ],
                      b2: [
                        "schema",
                        {
                          pg: [
                            "schema",
                            {
                              min: ["num", { initial: 100 }],
                              max: ["num", { initial: 149 }],
                            },
                          ],
                          offert: ["str", { initial: "" }],
                        },
                      ],
                      b3: [
                        "schema",
                        {
                          pg: [
                            "schema",
                            {
                              min: ["num", { initial: 150 }],
                              max: ["num", { initial: 199 }],
                            },
                          ],
                          offert: ["str", { initial: "" }],
                        },
                      ],
                      b4: [
                        "schema",
                        {
                          pg: [
                            "schema",
                            {
                              min: ["num", { initial: 200 }],
                              max: ["num", { initial: 249 }],
                            },
                          ],
                          offert: ["str", { initial: "" }],
                        },
                      ],
                      b5: [
                        "schema",
                        {
                          pg: [
                            "schema",
                            {
                              min: ["num", { initial: 250 }],
                              max: ["num", { initial: 299 }],
                            },
                          ],
                          offert: ["str", { initial: "" }],
                        },
                      ],
                      b6: [
                        "schema",
                        {
                          pg: [
                            "schema",
                            {
                              min: ["num", { initial: 300 }],
                            },
                          ],
                          offert: ["str", { initial: "" }],
                        },
                      ],
                    },
                  ],
                },
              ],
              textarea: [
                "schema",
                {
                  b0: ["num", { initial: 50 }],
                  b1: ["num", { initial: 50 }],
                  b2: ["num", { initial: 50 }],
                  b3: ["num", { initial: 50 }],
                  b4: ["num", { initial: 50 }],
                  b5: ["num", { initial: 50 }],
                  b6: ["num", { initial: 50 }],
                },
              ],
            },
          ],
        },
      ],
      c2038Sorcerer: [
        "schema",
        {
          morph: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              energie: ["num", { initial: 10 }],
              activation: ["str", { initial: "aucune" }],
              duree: ["str", { initial: "" }],
              espoir: ["num", { initial: 1 }],
              capacites: ["num", { initial: 3 }],
              vol: [
                "schema",
                {
                  description: ["str", { initial: "" }],
                },
              ],
              phase: [
                "schema",
                {
                  description: ["str", { initial: "" }],
                  activation: ["str", { initial: "deplacement" }],
                  energie: ["num", { initial: 5 }],
                  duree: ["str", { initial: "" }],
                  niveau2: [
                    "schema",
                    {
                      acces: ["bool", { initial: false }],
                      activation: ["str", { initial: "aucune" }],
                      energie: ["num", { initial: 8 }],
                      duree: ["str", { initial: "" }],
                    },
                  ],
                },
              ],
              etirement: [
                "schema",
                {
                  description: ["str", { initial: "" }],
                  portee: ["str", { initial: "" }],
                  bonus: ["num", { initial: 3 }],
                },
              ],
              metal: [
                "schema",
                {
                  bonus: [
                    "schema",
                    {
                      champDeForce: ["num", { initial: 2 }],
                    },
                  ],
                },
              ],
              fluide: [
                "schema",
                {
                  bonus: [
                    "schema",
                    {
                      reaction: ["num", { initial: 2 }],
                      defense: ["num", { initial: 2 }],
                    },
                  ],
                },
              ],
              polymorphie: [
                "schema",
                {
                  description: ["str", { initial: "" }],
                  griffe: [
                    "schema",
                    {
                      portee: ["str", { initial: "contact" }],
                      type: ["str", { initial: "contact" }],
                      degats: [
                        "schema",
                        {
                          dice: ["num", { initial: 2 }],
                          fixe: ["num", { initial: 0 }],
                        },
                      ],
                      violence: [
                        "schema",
                        {
                          dice: ["num", { initial: 1 }],
                          fixe: ["num", { initial: 0 }],
                        },
                      ],
                      effets: [
                        "schema",
                        {
                          liste: ["arr", ["str", {}]],
                          raw: ["arr", ["str", {}]],
                          custom: ["arr", ["obj", {}]],
                          chargeur: ["num", { initial: null }],
                          chargeur2: ["num", { initial: null }],
                        },
                      ],
                    },
                  ],
                  lame: [
                    "schema",
                    {
                      portee: ["str", { initial: "contact" }],
                      type: ["str", { initial: "contact" }],
                      degats: [
                        "schema",
                        {
                          dice: ["num", { initial: 2 }],
                          fixe: ["num", { initial: 0 }],
                        },
                      ],
                      violence: [
                        "schema",
                        {
                          dice: ["num", { initial: 1 }],
                          fixe: ["num", { initial: 0 }],
                        },
                      ],
                      effets: [
                        "schema",
                        {
                          liste: ["arr", ["str", {}]],
                          raw: ["arr", ["str", {}]],
                          custom: ["arr", ["obj", {}]],
                          chargeur: ["num", { initial: null }],
                          chargeur2: ["num", { initial: null }],
                        },
                      ],
                    },
                  ],
                  canon: [
                    "schema",
                    {
                      portee: ["str", { initial: "moyenne" }],
                      type: ["str", { initial: "distance" }],
                      energie: ["num", { initial: 1 }],
                      degats: [
                        "schema",
                        {
                          dice: ["num", { initial: 3 }],
                          fixe: ["num", { initial: 3 }],
                        },
                      ],
                      violence: [
                        "schema",
                        {
                          dice: ["num", { initial: 3 }],
                          fixe: ["num", { initial: 3 }],
                        },
                      ],
                      effets: [
                        "schema",
                        {
                          liste: ["arr", ["str", {}]],
                          raw: [
                            "arr",
                            ["str", { initial: "" }],
                            { initial: ["destructeur", "meurtrier", "ultraviolence"] },
                          ],
                          custom: ["arr", ["obj", {}]],
                          chargeur: ["num", { initial: null }],
                          chargeur2: ["num", { initial: null }],
                        },
                      ],
                    },
                  ],
                },
              ],
              textarea: [
                "schema",
                {
                  duree: ["num", { initial: 50 }],
                  vol: ["num", { initial: 130 }],
                  phase: ["num", { initial: 115 }],
                  phaseDuree: ["num", { initial: 50 }],
                  phaseDuree2: ["num", { initial: 50 }],
                  etirement: ["num", { initial: 130 }],
                  etirementPortee: ["num", { initial: 50 }],
                  polymorphie: ["num", { initial: 205 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  energie: ["num", { initial: 10 }],
                  activation: ["str", { initial: "aucune" }],
                  duree: ["str", { initial: "" }],
                  espoir: ["num", { initial: 1 }],
                  capacites: ["num", { initial: 3 }],
                  vol: [
                    "schema",
                    {
                      description: ["str", { initial: "" }],
                    },
                  ],
                  phase: [
                    "schema",
                    {
                      description: ["str", { initial: "" }],
                      activation: ["str", { initial: "deplacement" }],
                      energie: ["num", { initial: 5 }],
                      duree: ["str", { initial: "" }],
                      niveau2: [
                        "schema",
                        {
                          acces: ["bool", { initial: false }],
                          activation: ["str", { initial: "aucune" }],
                          energie: ["num", { initial: 8 }],
                          duree: ["str", { initial: "" }],
                        },
                      ],
                    },
                  ],
                  etirement: [
                    "schema",
                    {
                      description: ["str", { initial: "" }],
                      portee: ["str", { initial: "" }],
                      bonus: ["num", { initial: 3 }],
                    },
                  ],
                  metal: [
                    "schema",
                    {
                      bonus: [
                        "schema",
                        {
                          champDeForce: ["num", { initial: 2 }],
                        },
                      ],
                    },
                  ],
                  fluide: [
                    "schema",
                    {
                      bonus: [
                        "schema",
                        {
                          reaction: ["num", { initial: 2 }],
                          defense: ["num", { initial: 2 }],
                        },
                      ],
                    },
                  ],
                  polymorphie: [
                    "schema",
                    {
                      description: ["str", { initial: "" }],
                      griffe: [
                        "schema",
                        {
                          portee: ["str", { initial: "contact" }],
                          type: ["str", { initial: "contact" }],
                          degats: [
                            "schema",
                            {
                              dice: ["num", { initial: 2 }],
                              fixe: ["num", { initial: 0 }],
                            },
                          ],
                          violence: [
                            "schema",
                            {
                              dice: ["num", { initial: 1 }],
                              fixe: ["num", { initial: 0 }],
                            },
                          ],
                          effets: [
                            "schema",
                            {
                              liste: ["arr", ["str", {}]],
                              raw: ["arr", ["str", {}]],
                              custom: ["arr", ["obj", {}]],
                            },
                          ],
                        },
                      ],
                      lame: [
                        "schema",
                        {
                          portee: ["str", { initial: "contact" }],
                          type: ["str", { initial: "contact" }],
                          degats: [
                            "schema",
                            {
                              dice: ["num", { initial: 2 }],
                              fixe: ["num", { initial: 0 }],
                            },
                          ],
                          violence: [
                            "schema",
                            {
                              dice: ["num", { initial: 1 }],
                              fixe: ["num", { initial: 0 }],
                            },
                          ],
                          effets: [
                            "schema",
                            {
                              liste: ["arr", ["str", {}]],
                              raw: ["arr", ["str", {}]],
                              custom: ["arr", ["obj", {}]],
                            },
                          ],
                        },
                      ],
                      canon: [
                        "schema",
                        {
                          portee: ["str", { initial: "moyenne" }],
                          type: ["str", { initial: "distance" }],
                          energie: ["num", { initial: 1 }],
                          degats: [
                            "schema",
                            {
                              dice: ["num", { initial: 3 }],
                              fixe: ["num", { initial: 3 }],
                            },
                          ],
                          violence: [
                            "schema",
                            {
                              dice: ["num", { initial: 3 }],
                              fixe: ["num", { initial: 3 }],
                            },
                          ],
                          effets: [
                            "schema",
                            {
                              liste: ["arr", ["str", {}]],
                              raw: [
                                "arr",
                                ["str", { initial: "" }],
                                { initial: ["destructeur", "meurtrier", "ultraviolence"] },
                              ],
                              custom: ["arr", ["obj", {}]],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  textarea: [
                    "schema",
                    {
                      duree: ["num", { initial: 50 }],
                      vol: ["num", { initial: 130 }],
                      phase: ["num", { initial: 115 }],
                      phaseDuree: ["num", { initial: 50 }],
                      phaseDuree2: ["num", { initial: 50 }],
                      etirement: ["num", { initial: 130 }],
                      etirementPortee: ["num", { initial: 50 }],
                      polymorphie: ["num", { initial: 205 }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      codex: [
        "schema",
        {
          companions: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              activation: ["str", { initial: "tour6Sec" }],
              duree: ["str", { initial: "" }],
              energie: [
                "schema",
                {
                  base: ["num", { initial: 16 }],
                  prolonger: ["num", { initial: 8 }],
                },
              ],
              textarea: [
                "schema",
                {
                  duree: ["num", { initial: 50 }],
                  labor: ["num", { initial: 85 }],
                  medic: ["num", { initial: 85 }],
                  tech: ["num", { initial: 85 }],
                  fighter: ["num", { initial: 85 }],
                  recon: ["num", { initial: 85 }],
                  crow: ["num", { initial: 52 }],
                },
              ],
              lion: [
                "schema",
                {
                  img: ["str", { initial: "systems/knight/assets/lion.jpg" }],
                  token: ["str", { initial: "systems/knight/assets/lion.jpg" }],
                  PG: ["num", { initial: 60 }],
                  aspects: [
                    "schema",
                    {
                      chair: [
                        "schema",
                        {
                          value: ["num", { initial: 7 }],
                          ae: ["num", { initial: 1 }],
                        },
                      ],
                      bete: [
                        "schema",
                        {
                          value: ["num", { initial: 6 }],
                          ae: ["num", { initial: 1 }],
                        },
                      ],
                      machine: [
                        "schema",
                        {
                          value: ["num", { initial: 7 }],
                          ae: ["num", { initial: 1 }],
                        },
                      ],
                      dame: [
                        "schema",
                        {
                          value: ["num", { initial: 4 }],
                          ae: ["num", { initial: 0 }],
                        },
                      ],
                      masque: [
                        "schema",
                        {
                          value: ["num", { initial: 4 }],
                          ae: ["num", { initial: 0 }],
                        },
                      ],
                    },
                  ],
                  champDeForce: [
                    "schema",
                    {
                      base: ["num", { initial: 10 }],
                      bonus: ["arr", ["num", {}]],
                      malus: ["arr", ["num", {}]],
                    },
                  ],
                  defense: [
                    "schema",
                    {
                      base: ["num", { initial: 4 }],
                      bonus: ["arr", ["num", {}]],
                      malus: ["arr", ["num", {}]],
                    },
                  ],
                  reaction: [
                    "schema",
                    {
                      base: ["num", { initial: 4 }],
                      bonus: ["arr", ["num", {}]],
                      malus: ["arr", ["num", {}]],
                    },
                  ],
                  armure: [
                    "schema",
                    {
                      base: ["num", { initial: 60 }],
                      bonus: ["arr", ["num", {}]],
                      malus: ["arr", ["num", {}]],
                    },
                  ],
                  energie: [
                    "schema",
                    {
                      base: ["num", { initial: 0 }],
                      bonus: ["arr", ["num", {}]],
                      malus: ["arr", ["num", {}]],
                    },
                  ],
                  initiative: [
                    "schema",
                    {
                      value: ["num", { initial: 3 }],
                      fixe: ["num", { initial: 2 }],
                    },
                  ],
                  armes: [
                    "schema",
                    {
                      contact: [
                        "schema",
                        {
                          coups: [
                            "schema",
                            {
                              label: ["str", { initial: "" }],
                              portee: ["str", { initial: "contact" }],
                              degats: [
                                "schema",
                                {
                                  dice: ["num", { initial: 1 }],
                                  fixe: ["num", { initial: 0 }],
                                },
                              ],
                              violence: [
                                "schema",
                                {
                                  dice: ["num", { initial: 1 }],
                                  fixe: ["num", { initial: 0 }],
                                },
                              ],
                              effets: [
                                "schema",
                                {
                                  liste: ["arr", ["str", {}]],
                                  raw: ["arr", ["str", {}]],
                                  custom: ["arr", ["obj", {}]],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                      distance: ["arr", ["obj", {}]],
                    },
                  ],
                  slots: [
                    "schema",
                    {
                      tete: [
                        "schema",
                        {
                          value: ["num", { initial: 8 }],
                        },
                      ],
                      torse: [
                        "schema",
                        {
                          value: ["num", { initial: 10 }],
                        },
                      ],
                      brasGauche: [
                        "schema",
                        {
                          value: ["num", { initial: 8 }],
                        },
                      ],
                      brasDroit: [
                        "schema",
                        {
                          value: ["num", { initial: 8 }],
                        },
                      ],
                      jambeGauche: [
                        "schema",
                        {
                          value: ["num", { initial: 8 }],
                        },
                      ],
                      jambeDroite: [
                        "schema",
                        {
                          value: ["num", { initial: 8 }],
                        },
                      ],
                    },
                  ],
                },
              ],
              wolf: [
                "schema",
                {
                  img: ["str", { initial: "systems/knight/assets/wolf.jpg" }],
                  token: ["str", { initial: "systems/knight/assets/wolf.jpg" }],
                  aspects: [
                    "schema",
                    {
                      chair: [
                        "schema",
                        {
                          value: ["num", { initial: 2 }],
                          ae: ["num", { initial: 0 }],
                        },
                      ],
                      bete: [
                        "schema",
                        {
                          value: ["num", { initial: 4 }],
                          ae: ["num", { initial: 0 }],
                        },
                      ],
                      machine: [
                        "schema",
                        {
                          value: ["num", { initial: 4 }],
                          ae: ["num", { initial: 0 }],
                        },
                      ],
                      dame: [
                        "schema",
                        {
                          value: ["num", { initial: 2 }],
                          ae: ["num", { initial: 0 }],
                        },
                      ],
                      masque: [
                        "schema",
                        {
                          value: ["num", { initial: 4 }],
                          ae: ["num", { initial: 0 }],
                        },
                      ],
                    },
                  ],
                  champDeForce: [
                    "schema",
                    {
                      base: ["num", { initial: 4 }],
                    },
                  ],
                  defense: [
                    "schema",
                    {
                      base: ["num", { initial: 4 }],
                    },
                  ],
                  reaction: [
                    "schema",
                    {
                      base: ["num", { initial: 4 }],
                    },
                  ],
                  armure: [
                    "schema",
                    {
                      base: ["num", { initial: 20 }],
                    },
                  ],
                  energie: [
                    "schema",
                    {
                      base: ["num", { initial: 0 }],
                    },
                  ],
                  initiative: [
                    "schema",
                    {
                      value: ["num", { initial: 3 }],
                      fixe: ["num", { initial: 2 }],
                    },
                  ],
                  armes: [
                    "schema",
                    {
                      contact: [
                        "schema",
                        {
                          coups: [
                            "schema",
                            {
                              label: ["str", { initial: "" }],
                              portee: ["str", { initial: "contact" }],
                              degats: [
                                "schema",
                                {
                                  dice: ["num", { initial: 1 }],
                                  fixe: ["num", { initial: 0 }],
                                },
                              ],
                              violence: [
                                "schema",
                                {
                                  dice: ["num", { initial: 1 }],
                                  fixe: ["num", { initial: 0 }],
                                },
                              ],
                              effets: [
                                "schema",
                                {
                                  liste: ["arr", ["str", {}]],
                                  raw: ["arr", ["str", {}]],
                                  custom: ["arr", ["obj", {}]],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  configurations: [
                    "schema",
                    {
                      labor: [
                        "schema",
                        {
                          niveau: ["num", { initial: 1 }],
                          description: ["str", { initial: "" }],
                          energie: ["num", { initial: 1 }],
                          bonus: [
                            "schema",
                            {
                              roll: ["num", { initial: 1 }],
                            },
                          ],
                        },
                      ],
                      medic: [
                        "schema",
                        {
                          niveau: ["num", { initial: 1 }],
                          description: ["str", { initial: "" }],
                          energie: ["num", { initial: 1 }],
                          bonus: [
                            "schema",
                            {
                              roll: ["num", { initial: 1 }],
                              soins: ["num", { initial: 2 }],
                            },
                          ],
                        },
                      ],
                      tech: [
                        "schema",
                        {
                          niveau: ["num", { initial: 1 }],
                          description: ["str", { initial: "" }],
                          energie: ["num", { initial: 2 }],
                          bonus: [
                            "schema",
                            {
                              roll: ["num", { initial: 1 }],
                              reparation: ["num", { initial: 3 }],
                            },
                          ],
                        },
                      ],
                      fighter: [
                        "schema",
                        {
                          niveau: ["num", { initial: 1 }],
                          description: ["str", { initial: "" }],
                          energie: ["num", { initial: 2 }],
                          degats: ["num", { initial: 1 }],
                          violence: ["num", { initial: 1 }],
                          bonus: [
                            "schema",
                            {
                              roll: ["num", { initial: 1 }],
                              effets: [
                                "schema",
                                {
                                  raw: [
                                    "arr",
                                    ["str", { initial: "" }],
                                    { initial: ["barrage 1"] },
                                  ],
                                  liste: ["arr", ["str", {}]],
                                  custom: ["arr", ["obj", {}]],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                      recon: [
                        "schema",
                        {
                          niveau: ["num", { initial: 1 }],
                          description: ["str", { initial: "" }],
                          energie: ["num", { initial: 1 }],
                          bonus: [
                            "schema",
                            {
                              roll: ["num", { initial: 1 }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
              crow: [
                "schema",
                {
                  img: ["str", { initial: "systems/knight/assets/crow.jpg" }],
                  token: ["str", { initial: "systems/knight/assets/crow.jpg" }],
                  capacites: ["str", { initial: "" }],
                  aspects: [
                    "schema",
                    {
                      chair: [
                        "schema",
                        {
                          value: ["num", { initial: 6 }],
                        },
                      ],
                      bete: [
                        "schema",
                        {
                          value: ["num", { initial: 4 }],
                        },
                      ],
                      machine: [
                        "schema",
                        {
                          value: ["num", { initial: 4 }],
                        },
                      ],
                      dame: [
                        "schema",
                        {
                          value: ["num", { initial: 0 }],
                        },
                      ],
                      masque: [
                        "schema",
                        {
                          value: ["num", { initial: 6 }],
                        },
                      ],
                    },
                  ],
                  champDeForce: [
                    "schema",
                    {
                      base: ["num", { initial: 2 }],
                    },
                  ],
                  defense: [
                    "schema",
                    {
                      base: ["num", { initial: 2 }],
                    },
                  ],
                  reaction: [
                    "schema",
                    {
                      base: ["num", { initial: 2 }],
                    },
                  ],
                  cohesion: [
                    "schema",
                    {
                      base: ["num", { initial: 50 }],
                    },
                  ],
                  debordement: [
                    "schema",
                    {
                      base: ["num", { initial: 2 }],
                    },
                  ],
                  energie: [
                    "schema",
                    {
                      base: ["num", { initial: 0 }],
                    },
                  ],
                  initiative: [
                    "schema",
                    {
                      value: ["num", { initial: 0 }],
                      fixe: ["num", { initial: 1 }],
                    },
                  ],
                },
              ],
              specialEvolutions: [
                "schema",
                {
                  activation: ["str", { initial: "tour6Sec" }],
                  duree: ["str", { initial: "" }],
                  adistribuer: ["num", { initial: 1 }],
                  description: ["str", { initial: "" }],
                  energie: [
                    "schema",
                    {
                      base: ["num", { initial: 16 }],
                      prolonger: ["num", { initial: 8 }],
                    },
                  ],
                  lion: [
                    "schema",
                    {
                      label: ["str", { initial: "" }],
                      aspects: [
                        "schema",
                        {
                          value: ["num", { initial: 5 }],
                          max: ["num", { initial: 2 }],
                        },
                      ],
                      ae: ["num", { initial: 2 }],
                      pg: ["num", { initial: 60 }],
                    },
                  ],
                  wolf: [
                    "schema",
                    {
                      label: ["str", { initial: "" }],
                      aspects: [
                        "schema",
                        {
                          value: ["num", { initial: 3 }],
                          max: ["num", { initial: 2 }],
                        },
                      ],
                      ae: ["num", { initial: 1 }],
                      bonus: ["num", { initial: 2 }],
                    },
                  ],
                  crow: [
                    "schema",
                    {
                      label: ["str", { initial: "" }],
                      aspects: [
                        "schema",
                        {
                          value: ["num", { initial: 2 }],
                          max: ["num", { initial: 2 }],
                        },
                      ],
                      cohesion: ["num", { initial: 50 }],
                      debordement: ["num", { initial: 2 }],
                      cdf: ["num", { initial: 2 }],
                    },
                  ],
                  textarea: [
                    "schema",
                    {
                      duree: ["num", { initial: 50 }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      atlas: [
        "schema",
        {
          ascension: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              duree: ["str", { initial: "" }],
              activation: ["str", { initial: "tour6Sec" }],
              portee: ["str", { initial: "contact" }],
              impregnation: ["num", { initial: 3 }],
              sansarmure: [
                "schema",
                {
                  acces: ["bool", { initial: false }],
                },
              ],
              special: [
                "schema",
                {
                  atlas: ["str", { initial: "impregnation" }],
                },
              ],
              energie: [
                "schema",
                {
                  min: ["num", { initial: 10 }],
                  max: ["num", { initial: 50 }],
                  limite: ["num", { initial: 0 }],
                },
              ],
              textarea: [
                "schema",
                {
                  duree: ["num", { initial: 75 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  duree: ["str", { initial: "" }],
                  activation: ["str", { initial: "Tour6Sec" }],
                  portee: ["str", { initial: "contact" }],
                  impregnation: ["num", { initial: 3 }],
                  sansarmure: [
                    "schema",
                    {
                      acces: ["bool", { initial: false }],
                      label: ["str", { initial: "" }],
                    },
                  ],
                  special: [
                    "schema",
                    {
                      atlas: ["str", { initial: "impregnation" }],
                    },
                  ],
                  energie: [
                    "schema",
                    {
                      min: ["num", { initial: 10 }],
                      max: ["num", { initial: 50 }],
                      limite: ["num", { initial: 0 }],
                    },
                  ],
                  textarea: [
                    "schema",
                    {
                      duree: ["num", { initial: 75 }],
                    },
                  ],
                },
              ],
            },
          ],
          forward: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              duree: ["str", { initial: "" }],
              activation: ["str", { initial: "aucune" }],
              special: [
                "schema",
                {
                  atlas: ["str", { initial: "contrecoups" }],
                },
              ],
              energie: ["num", { initial: 3 }],
              textarea: [
                "schema",
                {
                  duree: ["num", { initial: 50 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  duree: ["str", { initial: "" }],
                  activation: ["str", { initial: "aucune" }],
                  special: [
                    "schema",
                    {
                      atlas: ["str", { initial: "contrecoups" }],
                    },
                  ],
                  energie: ["num", { initial: 3 }],
                  textarea: [
                    "schema",
                    {
                      duree: ["num", { initial: 50 }],
                    },
                  ],
                },
              ],
            },
          ],
          record: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              duree: ["str", { initial: "" }],
              activation: ["str", { initial: "aucune" }],
              special: [
                "schema",
                {
                  atlas: ["str", { initial: "contrecoups" }],
                },
              ],
              energie: ["num", { initial: 12 }],
              textarea: [
                "schema",
                {
                  duree: ["num", { initial: 50 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  duree: ["str", { initial: "" }],
                  activation: ["str", { initial: "aucune" }],
                  special: [
                    "schema",
                    {
                      atlas: ["str", { initial: "contrecoups" }],
                    },
                  ],
                  energie: ["num", { initial: 12 }],
                  textarea: [
                    "schema",
                    {
                      duree: ["num", { initial: 50 }],
                    },
                  ],
                },
              ],
            },
          ],
          rewind: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              duree: ["str", { initial: "" }],
              activation: ["str", { initial: "aucune" }],
              special: [
                "schema",
                {
                  atlas: ["str", { initial: "contrecoups" }],
                },
              ],
              energie: ["num", { initial: 15 }],
              textarea: [
                "schema",
                {
                  duree: ["num", { initial: 50 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  duree: ["str", { initial: "" }],
                  activation: ["str", { initial: "aucune" }],
                  special: [
                    "schema",
                    {
                      atlas: ["str", { initial: "contrecoups" }],
                    },
                  ],
                  energie: ["num", { initial: 15 }],
                  textarea: [
                    "schema",
                    {
                      duree: ["num", { initial: 50 }],
                    },
                  ],
                },
              ],
            },
          ],
          totem: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              activation: ["str", { initial: "aucune" }],
              duree: ["str", { initial: "" }],
              portee: ["str", { initial: "courte" }],
              nombre: ["num", { initial: 2 }],
              impregnation: ["num", { initial: 1 }],
              special: [
                "schema",
                {
                  atlas: ["str", { initial: "impregnation" }],
                },
              ],
              energie: [
                "schema",
                {
                  base: ["num", { initial: 3 }],
                  prolonger: ["num", { initial: 1 }],
                },
              ],
              textarea: [
                "schema",
                {
                  duree: ["num", { initial: 50 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  activation: ["str", { initial: "aucune" }],
                  duree: ["str", { initial: "" }],
                  portee: ["str", { initial: "courte" }],
                  nombre: ["num", { initial: 2 }],
                  impregnation: ["num", { initial: 1 }],
                  energie: [
                    "schema",
                    {
                      base: ["num", { initial: 3 }],
                      prolonger: ["num", { initial: 1 }],
                    },
                  ],
                  textarea: [
                    "schema",
                    {
                      duree: ["num", { initial: 50 }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      atlasSpecial: [
        "schema",
        {
          illumination: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              activation: ["str", { initial: "deplacement" }],
              duree: ["str", { initial: "" }],
              nbreCapacitesSelected: ["num", { initial: 3 }],
              nbreCapacitesTotale: ["num", { initial: 7 }],
              blaze: [
                "schema",
                {
                  description: ["str", { initial: "" }],
                  degats: ["num", { initial: 2 }],
                  violence: ["num", { initial: 2 }],
                  portee: ["str", { initial: "contact" }],
                  espoir: [
                    "schema",
                    {
                      base: ["num", { initial: 2 }],
                      prolonger: ["num", { initial: 1 }],
                    },
                  ],
                },
              ],
              candle: [
                "schema",
                {
                  description: ["str", { initial: "" }],
                  portee: ["str", { initial: "contact" }],
                  espoir: [
                    "schema",
                    {
                      dice: ["num", { initial: 1 }],
                      face: ["num", { initial: 3 }],
                    },
                  ],
                },
              ],
              beacon: [
                "schema",
                {
                  description: ["str", { initial: "" }],
                  bonus: ["num", { initial: 2 }],
                  portee: ["str", { initial: "courte" }],
                  espoir: [
                    "schema",
                    {
                      base: ["num", { initial: 2 }],
                      prolonger: ["num", { initial: 1 }],
                    },
                  ],
                },
              ],
              torch: [
                "schema",
                {
                  description: ["str", { initial: "" }],
                  bonus: ["num", { initial: 2 }],
                  portee: ["str", { initial: "courte" }],
                  espoir: [
                    "schema",
                    {
                      base: ["num", { initial: 3 }],
                      prolonger: ["num", { initial: 1 }],
                    },
                  ],
                },
              ],
              projector: [
                "schema",
                {
                  description: ["str", { initial: "" }],
                  portee: ["str", { initial: "courte" }],
                  espoir: [
                    "schema",
                    {
                      base: ["num", { initial: 3 }],
                      prolonger: ["num", { initial: 1 }],
                    },
                  ],
                },
              ],
              lighthouse: [
                "schema",
                {
                  description: ["str", { initial: "" }],
                  portee: ["str", { initial: "courte" }],
                  espoir: [
                    "schema",
                    {
                      base: ["num", { initial: 4 }],
                      prolonger: ["num", { initial: 1 }],
                    },
                  ],
                },
              ],
              lantern: [
                "schema",
                {
                  description: ["str", { initial: "" }],
                  portee: ["str", { initial: "courte" }],
                  degats: ["num", { initial: 1 }],
                  effets: [
                    "schema",
                    {
                      raw: ["arr", ["str", { initial: "" }], { initial: ["esperance"] }],
                      liste: ["arr", ["str", {}]],
                      custom: ["arr", ["obj", {}]],
                      chargeur: ["num", { initial: null }],
                    },
                  ],
                  espoir: [
                    "schema",
                    {
                      base: ["num", { initial: 4 }],
                      prolonger: ["num", { initial: 1 }],
                    },
                  ],
                },
              ],
              textarea: [
                "schema",
                {
                  duree: ["num", { initial: 50 }],
                  blaze: ["num", { initial: 175 }],
                  candle: ["num", { initial: 125 }],
                  beacon: ["num", { initial: 110 }],
                  torch: ["num", { initial: 175 }],
                  projector: ["num", { initial: 190 }],
                  lighthouse: ["num", { initial: 140 }],
                  lantern: ["num", { initial: 120 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  activation: ["str", { initial: "deplacement" }],
                  duree: ["str", { initial: "" }],
                  nbreCapacitesSelected: ["num", { initial: 3 }],
                  nbreCapacitesTotale: ["num", { initial: 7 }],
                  blaze: [
                    "schema",
                    {
                      description: ["str", { initial: "" }],
                      degats: ["num", { initial: 2 }],
                      violence: ["num", { initial: 2 }],
                      portee: ["str", { initial: "contact" }],
                      espoir: [
                        "schema",
                        {
                          base: ["num", { initial: 2 }],
                          prolonger: ["num", { initial: 1 }],
                        },
                      ],
                    },
                  ],
                  candle: [
                    "schema",
                    {
                      description: ["str", { initial: "" }],
                      portee: ["str", { initial: "contact" }],
                      espoir: ["num", { initial: 1 }],
                    },
                  ],
                  beacon: [
                    "schema",
                    {
                      description: ["str", { initial: "" }],
                      bonus: ["num", { initial: 2 }],
                      portee: ["str", { initial: "courte" }],
                      espoir: [
                        "schema",
                        {
                          base: ["num", { initial: 2 }],
                          prolonger: ["num", { initial: 1 }],
                        },
                      ],
                    },
                  ],
                  torch: [
                    "schema",
                    {
                      description: ["str", { initial: "" }],
                      bonus: ["num", { initial: 2 }],
                      portee: ["str", { initial: "courte" }],
                      espoir: [
                        "schema",
                        {
                          base: ["num", { initial: 3 }],
                          prolonger: ["num", { initial: 1 }],
                        },
                      ],
                    },
                  ],
                  projector: [
                    "schema",
                    {
                      description: ["str", { initial: "" }],
                      portee: ["str", { initial: "courte" }],
                      espoir: [
                        "schema",
                        {
                          base: ["num", { initial: 3 }],
                          prolonger: ["num", { initial: 1 }],
                        },
                      ],
                    },
                  ],
                  lighthouse: [
                    "schema",
                    {
                      description: ["str", { initial: "" }],
                      portee: ["str", { initial: "courte" }],
                      espoir: [
                        "schema",
                        {
                          base: ["num", { initial: 4 }],
                          prolonger: ["num", { initial: 1 }],
                        },
                      ],
                    },
                  ],
                  lantern: [
                    "schema",
                    {
                      description: ["str", { initial: "" }],
                      portee: ["str", { initial: "courte" }],
                      degats: ["num", { initial: 1 }],
                      effets: [
                        "schema",
                        {
                          raw: ["arr", ["str", { initial: "" }], { initial: ["esperance"] }],
                          liste: ["arr", ["str", {}]],
                          custom: ["arr", ["obj", {}]],
                        },
                      ],
                      espoir: [
                        "schema",
                        {
                          base: ["num", { initial: 4 }],
                          prolonger: ["num", { initial: 1 }],
                        },
                      ],
                    },
                  ],
                  textarea: [
                    "schema",
                    {
                      duree: ["num", { initial: 50 }],
                      blaze: ["num", { initial: 175 }],
                      candle: ["num", { initial: 125 }],
                      beacon: ["num", { initial: 110 }],
                      torch: ["num", { initial: 175 }],
                      projector: ["num", { initial: 190 }],
                      lighthouse: ["num", { initial: 140 }],
                      lantern: ["num", { initial: 120 }],
                    },
                  ],
                },
              ],
            },
          ],
          rage: [
            "schema",
            {
              label: ["str", { initial: "" }],
              description: ["str", { initial: "" }],
              activation: ["str", { initial: "aucune" }],
              duree: ["str", { initial: "" }],
              espoir: ["num", { initial: 0 }],
              aspects: ["schema", {}],
              nourri: [
                "schema",
                {
                  label: ["str", { initial: "" }],
                  description: ["str", { initial: "" }],
                  humain: [
                    "schema",
                    {
                      hostile: [
                        "schema",
                        {
                          dice: ["num", { initial: 0 }],
                          face: ["num", { initial: 0 }],
                          fixe: ["num", { initial: 1 }],
                        },
                      ],
                      salopard: [
                        "schema",
                        {
                          dice: ["num", { initial: 1 }],
                          face: ["num", { initial: 3 }],
                          fixe: ["num", { initial: 0 }],
                        },
                      ],
                      patron: [
                        "schema",
                        {
                          dice: ["num", { initial: 1 }],
                          face: ["num", { initial: 6 }],
                          fixe: ["num", { initial: 3 }],
                        },
                      ],
                      bande: [
                        "schema",
                        {
                          dice: ["num", { initial: 1 }],
                          face: ["num", { initial: 6 }],
                          fixe: ["num", { initial: 0 }],
                        },
                      ],
                    },
                  ],
                  anatheme: [
                    "schema",
                    {
                      hostile: [
                        "schema",
                        {
                          dice: ["num", { initial: 1 }],
                          face: ["num", { initial: 6 }],
                          fixe: ["num", { initial: 0 }],
                        },
                      ],
                      salopard: [
                        "schema",
                        {
                          dice: ["num", { initial: 1 }],
                          face: ["num", { initial: 6 }],
                          fixe: ["num", { initial: 3 }],
                        },
                      ],
                      patron: [
                        "schema",
                        {
                          dice: ["num", { initial: 1 }],
                          face: ["num", { initial: 6 }],
                          fixe: ["num", { initial: 6 }],
                        },
                      ],
                      bande: [
                        "schema",
                        {
                          dice: ["num", { initial: 2 }],
                          face: ["num", { initial: 6 }],
                          fixe: ["num", { initial: 0 }],
                        },
                      ],
                    },
                  ],
                },
              ],
              colere: [
                "schema",
                {
                  label: ["str", { initial: "" }],
                  description: ["str", { initial: "" }],
                  degats: ["str", { initial: "bete" }],
                  violence: ["str", { initial: "bete" }],
                  egide: ["num", { initial: 3 }],
                  defense: ["num", { initial: 3 }],
                  reaction: ["num", { initial: 3 }],
                  subis: ["num", { initial: 0 }],
                  combosBonus: [
                    "schema",
                    {
                      has: ["bool", { initial: false }],
                      liste: [
                        "schema",
                        {
                          c1: ["str", { initial: "" }],
                          c2: ["str", { initial: "" }],
                          c3: ["str", { initial: "" }],
                        },
                      ],
                    },
                  ],
                  combosInterdits: [
                    "schema",
                    {
                      has: ["bool", { initial: false }],
                      liste: [
                        "schema",
                        {
                          c1: ["str", { initial: "" }],
                          c2: ["str", { initial: "" }],
                          c3: ["str", { initial: "" }],
                          c4: ["str", { initial: "" }],
                          c5: ["str", { initial: "" }],
                          c6: ["str", { initial: "" }],
                        },
                      ],
                    },
                  ],
                },
              ],
              rage: [
                "schema",
                {
                  label: ["str", { initial: "" }],
                  description: ["str", { initial: "" }],
                  degats: ["str", { initial: "bete" }],
                  violence: ["str", { initial: "bete" }],
                  egide: ["num", { initial: 3 }],
                  defense: ["num", { initial: 9 }],
                  reaction: ["num", { initial: 9 }],
                  subis: ["num", { initial: 0 }],
                  combosBonus: [
                    "schema",
                    {
                      has: ["bool", { initial: false }],
                      liste: [
                        "schema",
                        {
                          c1: ["str", { initial: "" }],
                          c2: ["str", { initial: "" }],
                          c3: ["str", { initial: "" }],
                        },
                      ],
                    },
                  ],
                  combosInterdits: [
                    "schema",
                    {
                      has: ["bool", { initial: true }],
                      liste: [
                        "schema",
                        {
                          c1: ["str", { initial: "sangFroid" }],
                          c2: ["str", { initial: "parole" }],
                          c3: ["str", { initial: "savoir" }],
                          c4: ["str", { initial: "technique" }],
                          c5: ["str", { initial: "discretion" }],
                          c6: ["str", { initial: "" }],
                        },
                      ],
                    },
                  ],
                },
              ],
              fureur: [
                "schema",
                {
                  label: ["str", { initial: "" }],
                  description: ["str", { initial: "" }],
                  degats: ["str", { initial: "bete" }],
                  violence: ["str", { initial: "bete" }],
                  egide: ["num", { initial: 6 }],
                  defense: ["num", { initial: 9 }],
                  reaction: ["num", { initial: 9 }],
                  subis: ["num", { initial: 1 }],
                  combosBonus: [
                    "schema",
                    {
                      has: ["bool", { initial: true }],
                      liste: [
                        "schema",
                        {
                          c1: ["str", { initial: "hargne" }],
                          c2: ["str", { initial: "" }],
                          c3: ["str", { initial: "" }],
                        },
                      ],
                    },
                  ],
                  combosInterdits: [
                    "schema",
                    {
                      has: ["bool", { initial: true }],
                      liste: [
                        "schema",
                        {
                          c1: ["str", { initial: "sangFroid" }],
                          c2: ["str", { initial: "parole" }],
                          c3: ["str", { initial: "savoir" }],
                          c4: ["str", { initial: "technique" }],
                          c5: ["str", { initial: "discretion" }],
                          c6: ["str", { initial: "" }],
                        },
                      ],
                    },
                  ],
                },
              ],
              blaze: [
                "schema",
                {
                  label: ["str", { initial: "" }],
                  description: ["str", { initial: "" }],
                  degats: ["num", { initial: 2 }],
                  violence: ["num", { initial: 2 }],
                  portee: ["str", { initial: "contact" }],
                  espoir: [
                    "schema",
                    {
                      base: ["num", { initial: 2 }],
                      prolonger: ["num", { initial: 1 }],
                    },
                  ],
                },
              ],
              textarea: [
                "schema",
                {
                  duree: ["num", { initial: 55 }],
                  nourri: ["num", { initial: 55 }],
                  rage: ["num", { initial: 210 }],
                  fureur: ["num", { initial: 325 }],
                  blaze: ["num", { initial: 180 }],
                },
              ],
              evolutions: [
                "schema",
                {
                  activation: ["str", { initial: "aucune" }],
                  duree: ["str", { initial: "" }],
                  espoir: ["num", { initial: 0 }],
                  aspects: ["schema", {}],
                  nourri: [
                    "schema",
                    {
                      label: ["str", { initial: "" }],
                      description: ["str", { initial: "" }],
                      humain: [
                        "schema",
                        {
                          hostile: [
                            "schema",
                            {
                              dice: ["num", { initial: 0 }],
                              face: ["num", { initial: 0 }],
                              fixe: ["num", { initial: 1 }],
                            },
                          ],
                          salopard: [
                            "schema",
                            {
                              dice: ["num", { initial: 1 }],
                              face: ["num", { initial: 3 }],
                              fixe: ["num", { initial: 0 }],
                            },
                          ],
                          patron: [
                            "schema",
                            {
                              dice: ["num", { initial: 1 }],
                              face: ["num", { initial: 6 }],
                              fixe: ["num", { initial: 3 }],
                            },
                          ],
                          bande: [
                            "schema",
                            {
                              dice: ["num", { initial: 1 }],
                              face: ["num", { initial: 6 }],
                              fixe: ["num", { initial: 0 }],
                            },
                          ],
                        },
                      ],
                      anatheme: [
                        "schema",
                        {
                          hostile: [
                            "schema",
                            {
                              dice: ["num", { initial: 1 }],
                              face: ["num", { initial: 6 }],
                              fixe: ["num", { initial: 0 }],
                            },
                          ],
                          salopard: [
                            "schema",
                            {
                              dice: ["num", { initial: 1 }],
                              face: ["num", { initial: 6 }],
                              fixe: ["num", { initial: 3 }],
                            },
                          ],
                          patron: [
                            "schema",
                            {
                              dice: ["num", { initial: 1 }],
                              face: ["num", { initial: 6 }],
                              fixe: ["num", { initial: 6 }],
                            },
                          ],
                          bande: [
                            "schema",
                            {
                              dice: ["num", { initial: 2 }],
                              face: ["num", { initial: 6 }],
                              fixe: ["num", { initial: 0 }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  colere: [
                    "schema",
                    {
                      label: ["str", { initial: "" }],
                      description: ["str", { initial: "" }],
                      degats: ["str", { initial: "bete" }],
                      violence: ["str", { initial: "bete" }],
                      egide: ["num", { initial: 3 }],
                      defense: ["num", { initial: 3 }],
                      reaction: ["num", { initial: 3 }],
                      subis: ["num", { initial: 0 }],
                      combosBonus: [
                        "schema",
                        {
                          has: ["bool", { initial: false }],
                          liste: [
                            "schema",
                            {
                              c1: ["str", { initial: "" }],
                              c2: ["str", { initial: "" }],
                              c3: ["str", { initial: "" }],
                            },
                          ],
                        },
                      ],
                      combosInterdits: [
                        "schema",
                        {
                          has: ["bool", { initial: false }],
                          liste: [
                            "schema",
                            {
                              c1: ["str", { initial: "" }],
                              c2: ["str", { initial: "" }],
                              c3: ["str", { initial: "" }],
                              c4: ["str", { initial: "" }],
                              c5: ["str", { initial: "" }],
                              c6: ["str", { initial: "" }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  rage: [
                    "schema",
                    {
                      label: ["str", { initial: "" }],
                      description: ["str", { initial: "" }],
                      degats: ["str", { initial: "bete" }],
                      violence: ["str", { initial: "bete" }],
                      egide: ["num", { initial: 3 }],
                      defense: ["num", { initial: 9 }],
                      reaction: ["num", { initial: 9 }],
                      subis: ["num", { initial: 0 }],
                      combosBonus: [
                        "schema",
                        {
                          has: ["bool", { initial: false }],
                          liste: [
                            "schema",
                            {
                              c1: ["str", { initial: "" }],
                              c2: ["str", { initial: "" }],
                              c3: ["str", { initial: "" }],
                            },
                          ],
                        },
                      ],
                      combosInterdits: [
                        "schema",
                        {
                          has: ["bool", { initial: true }],
                          liste: [
                            "schema",
                            {
                              c1: ["str", { initial: "sangFroid" }],
                              c2: ["str", { initial: "parole" }],
                              c3: ["str", { initial: "savoir" }],
                              c4: ["str", { initial: "technique" }],
                              c5: ["str", { initial: "discretion" }],
                              c6: ["str", { initial: "" }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  fureur: [
                    "schema",
                    {
                      label: ["str", { initial: "" }],
                      description: ["str", { initial: "" }],
                      degats: ["str", { initial: "bete" }],
                      violence: ["str", { initial: "bete" }],
                      egide: ["num", { initial: 6 }],
                      defense: ["num", { initial: 9 }],
                      reaction: ["num", { initial: 9 }],
                      subis: ["num", { initial: 1 }],
                      combosBonus: [
                        "schema",
                        {
                          has: ["bool", { initial: true }],
                          liste: [
                            "schema",
                            {
                              c1: ["str", { initial: "hargne" }],
                              c2: ["str", { initial: "" }],
                              c3: ["str", { initial: "" }],
                            },
                          ],
                        },
                      ],
                      combosInterdits: [
                        "schema",
                        {
                          has: ["bool", { initial: true }],
                          liste: [
                            "schema",
                            {
                              c1: ["str", { initial: "sangFroid" }],
                              c2: ["str", { initial: "parole" }],
                              c3: ["str", { initial: "savoir" }],
                              c4: ["str", { initial: "technique" }],
                              c5: ["str", { initial: "discretion" }],
                              c6: ["str", { initial: "" }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  blaze: [
                    "schema",
                    {
                      label: ["str", { initial: "" }],
                      description: ["str", { initial: "" }],
                      degats: ["num", { initial: 2 }],
                      violence: ["num", { initial: 2 }],
                      portee: ["str", { initial: "contact" }],
                      espoir: [
                        "schema",
                        {
                          base: ["num", { initial: 2 }],
                          prolonger: ["num", { initial: 1 }],
                        },
                      ],
                    },
                  ],
                  textarea: [
                    "schema",
                    {
                      duree: ["num", { initial: 55 }],
                      nourri: ["num", { initial: 55 }],
                      rage: ["num", { initial: 10 }],
                      colere: ["num", { initial: 210 }],
                      fureur: ["num", { initial: 325 }],
                      blaze: ["num", { initial: 180 }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  }

  static defineSchema() {
    return fields(this.baseDefinition);
  }

  get actor() {
    return this?.parent?.actor ?? undefined;
  }

  get armor() {
    return this?.parent ?? undefined;
  }

  get morph() {
    return this.selected.morph;
  }

  get type() {
    return this.selected.type;
  }

  get capaciteUltime() {
    let result = undefined;

    if (this.actor) {
      const ultime = this.actor.items.find((itm) => itm.type === "capaciteultime");

      if (ultime) result = ultime;
    }

    return result;
  }

  #prepareLabels() {
    const capacites = this.selected;
    const allLabels = getAllEffects();
    const ghost = capacites?.ghost ?? undefined;

    if (capacites.companions) {
      const lionWpn = capacites.companions.lion.armes.contact.coups;

      Object.defineProperty(lionWpn.effets, "liste", {
        value: listEffects(lionWpn.effets, allLabels),
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }

    if (ghost) {
      let interruption = "";

      if (ghost.interruption.actif)
        interruption = game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.GHOST.Interruption");
      else interruption = game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.GHOST.NoInterruption");

      Object.defineProperty(ghost.interruption, "label", {
        value: interruption,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
  }

  prepareData() {
    if (this.morph) {
      const choisi = this?.morph?.choisi ?? {};
      const active = this?.morph?.active ?? {};

      const nbreChoisi = Object.keys(choisi).filter(
        (key) =>
          key !== "polymorphieLame" &&
          key !== "polymorphieGriffe" &&
          key !== "polymorphieCanon" &&
          key !== "polymorphieLame2" &&
          key !== "polymorphieGriffe2" &&
          key !== "polymorphieCanon2" &&
          key !== "fait" &&
          this.morph.choisi[key],
      ).length;
      const nbrePolymorphieGuerre = Object.keys(active).filter(
        (key) =>
          (key === "polymorphieLame" ||
            key === "polymorphieGriffe" ||
            key === "polymorphieCanon" ||
            key === "polymorphieLame2" ||
            key === "polymorphieGriffe2" ||
            key === "polymorphieCanon2") &&
          this.morph.active[key],
      ).length;

      Object.defineProperty(this.selected.morph.polymorphie, "max", {
        value: nbrePolymorphieGuerre === 2 ? true : false,
        writable: true,
        enumerable: true,
        configurable: true,
      });

      if (this.selected.morph.choisi) {
        Object.defineProperty(this.selected.morph.choisi, "fait", {
          value: nbreChoisi === this.morph.capacites ? true : false,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
    }

    if (this.type && this.actor && this.capaciteUltime) {
      const ultime = this.capaciteUltime;
      const hasPassive = ultime.system?.passives?.capacites?.actif ?? false;
      const hasUltimeType = hasPassive
        ? (ultime.system?.passives?.capacites?.type?.actif ?? false)
        : false;

      if (hasUltimeType) {
        Object.defineProperty(this.selected.type, "legend", {
          value: true,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
    }

    for (let c in this.selected) {
      this.#prepareCapacity(c, this.selected[c]);
    }

    this.#prepareLabels();
  }

  #prepareCapacity = (capacity, data) => {
    const handlers = this.#handleCapacity();
    const handler = handlers[capacity];

    if (handler) handler.call(this, data);
  };

  #handleCapacity = () => {
    return {
      companions: (data) => this.companions(data),
      illumination: (data) => this.illumination(data),
      type: (data) => this.type(data),
      vision: (data) => this.vision(data),
      warlord: (data) => this.warlord(data),
    };
  };

  illumination(data) {
    const illumination = data;
    const max = illumination.nbreCapacitesSelected;
    const selectionne = illumination?.selectionne ?? 0;
    let choixFaits = false;

    if (selectionne >= max) choixFaits = true;
    else choixFaits = false;

    Object.defineProperty(illumination, "choixFaits", {
      value: choixFaits,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }

  companions(data) {
    const actor = this.actor;
    const armure = this.armor;
    const companions = data;

    if (!actor || !armure) return;

    const energieDisponible = armure.energieDisponiblePar10;

    Object.defineProperty(companions, "energieDisponible", {
      value: energieDisponible,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }

  type(data) {
    const type = data;
    const max = type.nbreType;
    const selectionne = type?.selectionne ?? 0;
    let choixFaits = false;

    if (selectionne >= max) choixFaits = true;
    else choixFaits = false;

    Object.defineProperty(type, "choixFaits", {
      value: choixFaits,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }

  vision(data) {
    const actor = this.actor;

    if (!actor) return;

    const aPE = actor.system?.equipements?.armure?.capacites?.vision?.energie ?? 0;
    const cPEMin = data?.energie?.min ?? 0;
    const cPEMax = data?.energie?.max ?? 0;

    if (aPE < cPEMin) {
      Object.defineProperty(actor.system.equipements.armure.capacites.vision, "energie", {
        value: cPEMin,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    } else if (aPE > cPEMax) {
      Object.defineProperty(actor.system.equipements.armure.capacites.vision, "energie", {
        value: cPEMax,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
  }

  warlord(data) {
    const impulsions = data.impulsions;
    const max = impulsions.selection;
    const selectionne = impulsions?.selectionne ?? 0;
    let choisi = false;

    if (selectionne >= max) choisi = true;
    else choisi = false;

    Object.defineProperty(impulsions, "choisi", {
      value: choisi,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
}
