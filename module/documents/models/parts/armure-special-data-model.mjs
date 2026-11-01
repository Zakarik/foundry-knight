import { fields } from "../../../utils/field-builder.mjs";

export class ArmureSpecialDataModel extends foundry.abstract.DataModel {
  static get base() {
    return [
      "schema",
      {
        personnalise: [
          "schema",
          {
            label: ["str", {}],
            description: ["str", {}],
          },
        ],
        lenteetlourde: [
          "schema",
          {
            label: ["str", {}],
            description: ["str", {}],
            evolutions: [
              "schema",
              {
                delete: [
                  "schema",
                  {
                    label: ["str", {}],
                    value: ["bool", { initial: false }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  }

  static get c2038() {
    return [
      "schema",
      {
        recolteflux: [
          "schema",
          {
            label: ["str", {}],
            description: ["str", {}],
            conflit: [
              "schema",
              {
                base: ["num", { initial: 2 }],
                tour: ["num", { initial: 1 }],
                hostile: ["num", { initial: 2 }],
                salopard: ["num", { initial: 3 }],
                patron: ["num", { initial: 4 }],
                portee: ["str", { initial: "moyenne" }],
              },
            ],
            horsconflit: [
              "schema",
              {
                base: ["num", { initial: 1 }],
                portee: ["str", { initial: "moyenne" }],
                limite: ["num", { initial: 10 }],
              },
            ],
            evolutions: [
              "schema",
              {
                conflit: [
                  "schema",
                  {
                    base: ["num", { initial: 2 }],
                    tour: ["num", { initial: 1 }],
                    hostile: ["num", { initial: 2 }],
                    salopard: ["num", { initial: 3 }],
                    patron: ["num", { initial: 4 }],
                    portee: ["str", { initial: "moyenne" }],
                  },
                ],
                horsconflit: [
                  "schema",
                  {
                    base: ["num", { initial: 1 }],
                    portee: ["str", { initial: "moyenne" }],
                    limite: ["num", { initial: 10 }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  }

  static get c2038Sorcerer() {
    return [
      "schema",
      {
        energiedeficiente: [
          "schema",
          {
            min: ["num", { initial: 1 }],
            max: ["num", { initial: 3 }],
          },
        ],
      },
    ];
  }

  static get c2038Necromancer() {
    return [
      "schema",
      {
        plusespoir: [
          "schema",
          {
            label: ["str", {}],
            description: ["str", {}],
            espoir: [
              "schema",
              {
                base: ["num", { initial: 10 }],
                recuperation: [
                  "schema",
                  {
                    label: ["str", {}],
                    value: ["bool", { initial: false }],
                  },
                ],
                perte: [
                  "schema",
                  {
                    label: ["str", {}],
                    value: ["bool", { initial: false }],
                  },
                ],
              },
            ],
            evolutions: [
              "schema",
              {
                espoir: [
                  "schema",
                  {
                    base: ["num", { initial: 10 }],
                    recuperation: [
                      "schema",
                      {
                        label: ["str", {}],
                        value: ["bool", { initial: false }],
                      },
                    ],
                    perte: [
                      "schema",
                      {
                        label: ["str", {}],
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
    ];
  }

  static get atlas() {
    return [
      "schema",
      {
        impregnation: [
          "schema",
          {
            label: ["str", {}],
            description: ["str", {}],
            aspects: ["obj", {}],
            jets: [
              "schema",
              {
                c1a: ["str", { initial: "sangFroid" }],
                c2a: ["str", { initial: "technique" }],
                c1b: ["str", { initial: "hargne" }],
                c2b: ["str", { initial: "technique" }],
              },
            ],
            evolutions: [
              "schema",
              {
                aspects: ["obj", {}],
                jets: [
                  "schema",
                  {
                    c1a: ["str", { initial: "sangFroid" }],
                    c2a: ["str", { initial: "technique" }],
                    c1b: ["str", { initial: "hargne" }],
                    c2b: ["str", { initial: "technique" }],
                  },
                ],
              },
            ],
          },
        ],
        contrecoups: [
          "schema",
          {
            unactif: ["bool", { initial: false }],
            label: ["str", {}],
            description: ["str", {}],
            tableau: [
              "schema",
              {
                c1: [
                  "schema",
                  {
                    l1: ["str", {}],
                    l2: ["str", {}],
                    l3: ["str", {}],
                    l4: ["str", {}],
                    l5: ["str", {}],
                    l6: ["str", {}],
                  },
                ],
                c2: [
                  "schema",
                  {
                    l1: ["str", {}],
                    l2: ["str", {}],
                    l3: ["str", {}],
                    l4: ["str", {}],
                    l5: ["str", {}],
                    l6: ["str", {}],
                  },
                ],
                c3: [
                  "schema",
                  {
                    l1: ["str", {}],
                    l2: ["str", {}],
                    l3: ["str", {}],
                    l4: ["str", {}],
                    l5: ["str", {}],
                    l6: ["str", {}],
                  },
                ],
                c4: [
                  "schema",
                  {
                    l1: ["str", {}],
                    l2: ["str", {}],
                    l3: ["str", {}],
                    l4: ["str", {}],
                    l5: ["str", {}],
                    l6: ["str", {}],
                  },
                ],
                c5: [
                  "schema",
                  {
                    l1: ["str", {}],
                    l2: ["str", {}],
                    l3: ["str", {}],
                    l4: ["str", {}],
                    l5: ["str", {}],
                    l6: ["str", {}],
                  },
                ],
                c6: [
                  "schema",
                  {
                    l1: ["str", {}],
                    l2: ["str", {}],
                    l3: ["str", {}],
                    l4: ["str", {}],
                    l5: ["str", {}],
                    l6: ["str", {}],
                  },
                ],
              },
            ],
            relance: [
              "schema",
              {
                label: ["str", {}],
                value: ["bool", { initial: false }],
              },
            ],
            maxeffets: [
              "schema",
              {
                label: ["str", {}],
                value: ["bool", { initial: true }],
                max: ["num", { initial: 5 }],
              },
            ],
            armedistance: [
              "schema",
              {
                label: ["str", {}],
                value: ["bool", { initial: false }],
              },
            ],
            jet: [
              "schema",
              {
                aspects: ["obj", {}],
                c1: ["str", { initial: "hargne" }],
                c2: ["str", { initial: "sangFroid" }],
              },
            ],
            evolutions: [
              "schema",
              {
                tableau: [
                  "schema",
                  {
                    c1: [
                      "schema",
                      {
                        l1: ["str", {}],
                        l2: ["str", {}],
                        l3: ["str", {}],
                        l4: ["str", {}],
                        l5: ["str", {}],
                        l6: ["str", {}],
                      },
                    ],
                    c2: [
                      "schema",
                      {
                        l1: ["str", {}],
                        l2: ["str", {}],
                        l3: ["str", {}],
                        l4: ["str", {}],
                        l5: ["str", {}],
                        l6: ["str", {}],
                      },
                    ],
                    c3: [
                      "schema",
                      {
                        l1: ["str", {}],
                        l2: ["str", {}],
                        l3: ["str", {}],
                        l4: ["str", {}],
                        l5: ["str", {}],
                        l6: ["str", {}],
                      },
                    ],
                    c4: [
                      "schema",
                      {
                        l1: ["str", {}],
                        l2: ["str", {}],
                        l3: ["str", {}],
                        l4: ["str", {}],
                        l5: ["str", {}],
                        l6: ["str", {}],
                      },
                    ],
                    c5: [
                      "schema",
                      {
                        l1: ["str", {}],
                        l2: ["str", {}],
                        l3: ["str", {}],
                        l4: ["str", {}],
                        l5: ["str", {}],
                        l6: ["str", {}],
                      },
                    ],
                    c6: [
                      "schema",
                      {
                        l1: ["str", {}],
                        l2: ["str", {}],
                        l3: ["str", {}],
                        l4: ["str", {}],
                        l5: ["str", {}],
                        l6: ["str", {}],
                      },
                    ],
                  },
                ],
                relance: [
                  "schema",
                  {
                    label: ["str", {}],
                    value: ["bool", { initial: false }],
                  },
                ],
                maxeffets: [
                  "schema",
                  {
                    label: ["str", {}],
                    value: ["bool", { initial: true }],
                    max: ["num", { initial: 5 }],
                  },
                ],
                armedistance: [
                  "schema",
                  {
                    label: ["str", {}],
                    value: ["bool", { initial: false }],
                  },
                ],
                jet: [
                  "schema",
                  {
                    aspects: ["obj", {}],
                    c1: ["str", { initial: "hargne" }],
                    c2: ["str", { initial: "sangFroid" }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  }

  static get atlasSpecial() {
    return [
      "schema",
      {
        apeiron: [
          "schema",
          {
            label: ["str", {}],
            description: ["str", {}],
            espoir: [
              "schema",
              {
                bonus: ["num", { initial: 15 }],
                reduction: [
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
                espoir: [
                  "schema",
                  {
                    bonus: ["num", { initial: 15 }],
                    reduction: [
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
        porteurlumiere: [
          "schema",
          {
            label: ["str", {}],
            bonus: [
              "schema",
              {
                effets: [
                  "schema",
                  {
                    raw: [
                      "arr",
                      ["str", { initial: "" }],
                      { initial: ["antianatheme", "tenebricide"] },
                    ],
                    liste: ["arr", ["str", {}]],
                    custom: ["arr", ["obj", {}]],
                  },
                ],
              },
            ],
            evolutions: [
              "schema",
              {
                bonus: [
                  "schema",
                  {
                    effets: [
                      "schema",
                      {
                        raw: [
                          "arr",
                          ["str", { initial: "" }],
                          { initial: ["antianatheme", "tenebricide"] },
                        ],
                        liste: ["arr", ["str", {}]],
                        custom: ["arr", ["obj", {}]],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  }

  static get baseDefinition() {
    return {
      actuel: ["str", { initial: "personnalise" }],
      liste: ["obj", {}],
      selected: ["obj", {}],
      base: this.base,
      c2038: this.c2038,
      c2038Sorcerer: this.c2038Sorcerer,
      c2038Necromancer: this.c2038Necromancer,
      atlas: this.atlas,
      atlasSpecial: this.atlasSpecial,
    };
  }

  static defineSchema() {
    return fields(this.baseDefinition);
  }
}
