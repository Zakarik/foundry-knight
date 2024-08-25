
export class ArmureSpecialDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const {StringField, NumberField, BooleanField, SchemaField, ArrayField, ObjectField} = foundry.data.fields;

    return {
      actuel: new StringField({initial: "personnalise"}),
      liste: new ObjectField(),
      selected: new ObjectField(),
      base: new SchemaField({
        personnalise: new SchemaField({
          label: new StringField(),
          description: new StringField()
        }),
        lenteetlourde: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          evolutions: new SchemaField({
            delete: new SchemaField({
              label: new StringField(),
              value: new BooleanField({initial: false})
            })
          })
        })
      }),
      c2038: new SchemaField({
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
          }),
          evolutions: new SchemaField({
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
        })
      }),
      c2038Sorcerer: new SchemaField({
        energiedeficiente: new SchemaField({
          min: new NumberField({initial: 1}),
          max: new NumberField({initial: 3})
        })
      }),
      c2038Necromancer: new SchemaField({
        plusespoir: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          espoir: new SchemaField({
            base: new NumberField({initial: 10}),
            recuperation: new SchemaField({
              label: new StringField(),
              value: new BooleanField({initial: false})
            }),
            perte: new SchemaField({
              label: new StringField(),
              value: new BooleanField({initial: false})
            })
          }),
          evolutions: new SchemaField({
            espoir: new SchemaField({
              base: new NumberField({initial: 10}),
              recuperation: new SchemaField({
                label: new StringField(),
                value: new BooleanField({initial: false})
              }),
              perte: new SchemaField({
                label: new StringField(),
                value: new BooleanField({initial: false})
              })
            })
          })
        })
      }),
      atlas: new SchemaField({
        impregnation: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          aspects: new ObjectField(),
          jets: new SchemaField({
            c1a: new StringField({initial: "sangFroid"}),
            c2a: new StringField({initial: "technique"}),
            c1b: new StringField({initial: "hargne"}),
            c2b: new StringField({initial: "technique"})
          }),
          evolutions: new SchemaField({
            aspects: new ObjectField(),
            jets: new SchemaField({
              c1a: new StringField({initial: "sangFroid"}),
              c2a: new StringField({initial: "technique"}),
              c1b: new StringField({initial: "hargne"}),
              c2b: new StringField({initial: "technique"})
            })
          })
        }),
        contrecoups: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          tableau: new SchemaField({
            c1: new SchemaField({
              l1: new StringField(),
              l2: new StringField(),
              l3: new StringField(),
              l4: new StringField(),
              l5: new StringField(),
              l6: new StringField()
            }),
            c2: new SchemaField({
              l1: new StringField(),
              l2: new StringField(),
              l3: new StringField(),
              l4: new StringField(),
              l5: new StringField(),
              l6: new StringField()
            }),
            c3: new SchemaField({
              l1: new StringField(),
              l2: new StringField(),
              l3: new StringField(),
              l4: new StringField(),
              l5: new StringField(),
              l6: new StringField()
            }),
            c4: new SchemaField({
              l1: new StringField(),
              l2: new StringField(),
              l3: new StringField(),
              l4: new StringField(),
              l5: new StringField(),
              l6: new StringField()
            }),
            c5: new SchemaField({
              l1: new StringField(),
              l2: new StringField(),
              l3: new StringField(),
              l4: new StringField(),
              l5: new StringField(),
              l6: new StringField()
            }),
            c6: new SchemaField({
              l1: new StringField(),
              l2: new StringField(),
              l3: new StringField(),
              l4: new StringField(),
              l5: new StringField(),
              l6: new StringField()
            })
          }),
          relance: new SchemaField({
            label: new StringField(),
            value: new BooleanField({initial: false})
          }),
          maxeffets: new SchemaField({
            label: new StringField(),
            value: new BooleanField({initial: true}),
            max: new NumberField({initial: 5})
          }),
          armedistance: new SchemaField({
            label: new StringField(),
            value: new BooleanField({initial: false})
          }),
          jet: new SchemaField({
            aspects: new ObjectField(),
            c1: new StringField({initial: "hargne"}),
            c2: new StringField({initial: "sangFroid"})
          }),
          evolutions: new SchemaField({
            tableau: new SchemaField({
              c1: new SchemaField({
                l1: new StringField(),
                l2: new StringField(),
                l3: new StringField(),
                l4: new StringField(),
                l5: new StringField(),
                l6: new StringField()
              }),
              c2: new SchemaField({
                l1: new StringField(),
                l2: new StringField(),
                l3: new StringField(),
                l4: new StringField(),
                l5: new StringField(),
                l6: new StringField()
              }),
              c3: new SchemaField({
                l1: new StringField(),
                l2: new StringField(),
                l3: new StringField(),
                l4: new StringField(),
                l5: new StringField(),
                l6: new StringField()
              }),
              c4: new SchemaField({
                l1: new StringField(),
                l2: new StringField(),
                l3: new StringField(),
                l4: new StringField(),
                l5: new StringField(),
                l6: new StringField()
              }),
              c5: new SchemaField({
                l1: new StringField(),
                l2: new StringField(),
                l3: new StringField(),
                l4: new StringField(),
                l5: new StringField(),
                l6: new StringField()
              }),
              c6: new SchemaField({
                l1: new StringField(),
                l2: new StringField(),
                l3: new StringField(),
                l4: new StringField(),
                l5: new StringField(),
                l6: new StringField()
              })
            }),
            relance: new SchemaField({
              label: new StringField(),
              value: new BooleanField({initial: false})
            }),
            maxeffets: new SchemaField({
              label: new StringField(),
              value: new BooleanField({initial: true}),
              max: new NumberField({initial: 5})
            }),
            armedistance: new SchemaField({
              label: new StringField(),
              value: new BooleanField({initial: false})
            }),
            jet: new SchemaField({
              aspects: new ObjectField(),
              c1: new StringField({initial: "hargne"}),
              c2: new StringField({initial: "sangFroid"})
            })
          })
        })
      }),
      atlasSpecial: new SchemaField({
        apeiron: new SchemaField({
          label: new StringField(),
          description: new StringField(),
          espoir: new SchemaField({
            bonus: new NumberField({initial: 15}),
            reduction: new SchemaField({
              value: new NumberField({initial: 1})
            })
          }),
          evolutions: new SchemaField({
            espoir: new SchemaField({
              bonus: new NumberField({initial: 15}),
              reduction: new SchemaField({
                value: new NumberField({initial: 1})
              })
            })
          })
        }),
        porteurlumiere: new SchemaField({
          label: new StringField(),
          bonus: new SchemaField({
            effets: new SchemaField({
              raw: new ArrayField(new StringField(), {initial: ["antianatheme", "tenebricide"]}),
              liste: new ArrayField(new StringField()),
              custom: new ArrayField(new ObjectField())
            })
          }),
          evolutions: new SchemaField({
            bonus: new SchemaField({
              effets: new SchemaField({
                raw: new ArrayField(new StringField(), {initial: ["antianatheme", "tenebricide"]}),
                liste: new ArrayField(new StringField()),
                custom: new ArrayField(new ObjectField())
              })
            })
          })
        })
      }),
    };
  }
}