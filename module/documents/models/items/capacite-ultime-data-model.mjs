import BaseItemDataModel from "../base/base-item-data-model.mjs";
import ItemSpecialEffectsPathMixinModel from "../base/mixin-item-specialEffects-path-model.mjs";
import ItemSpecialEffectsInternalMixinModel from "../base/mixin-item-specialEffects-internal-model.mjs";
import { listEffects, getAllEffects, capitalizeFirstLetter } from "../../../helpers/common.mjs";
import { combine } from "../../../utils/field-builder.mjs";

export class CapaciteUltimeDataModel extends ItemSpecialEffectsPathMixinModel(
  ItemSpecialEffectsInternalMixinModel(BaseItemDataModel),
) {
  static get baseDefinition() {
    const base = super.baseDefinition;
    const specific = {
      active: ["bool", { initial: false }],
      type: ["str", { initial: "passive" }],
      condition: ["html", { initial: "" }],
      actives: [
        "schema",
        {
          activation: ["str", { initial: "" }],
          duree: ["str", { initial: "" }],
          instant: ["bool", { initial: true }],
          energie: ["num", { initial: 0, nullable: false, integer: true }],
          heroisme: ["num", { initial: 0, nullable: false, integer: true }],
          reaction: ["num", { initial: 0, nullable: false, integer: true }],
          defense: ["num", { initial: 0, nullable: false, integer: true }],
          recuperation: [
            "schema",
            {
              PA: ["bool", { initial: false }],
              PS: ["bool", { initial: false }],
              PE: ["bool", { initial: false }],
            },
          ],
          jet: [
            "schema",
            {
              actif: ["bool", { initial: false }],
              isfixe: ["bool", { initial: false }],
              fixe: [
                "schema",
                {
                  label: ["str", { initial: "" }],
                  dice: ["num", { initial: 0, nullable: false, integer: true }],
                  fixe: ["num", { initial: 0, nullable: false, integer: true }],
                },
              ],
              variable: [
                "schema",
                {
                  caracteristiques: ["arr", ["str", { initial: "" }]],
                  select: ["str", { initial: "" }],
                },
              ],
            },
          ],
          degats: [
            "schema",
            {
              actif: ["bool", { initial: false }],
              isfixe: ["bool", { initial: true }],
              fixe: [
                "schema",
                {
                  dice: ["num", { initial: 0, nullable: false, integer: true }],
                  fixe: ["num", { initial: 0, nullable: false, integer: true }],
                },
              ],
              variable: [
                "schema",
                {
                  energie: ["num", { initial: 0, nullable: false, integer: true }],
                  select: [
                    "schema",
                    {
                      dice: ["num", { initial: 0, nullable: false, integer: true }],
                      fixe: ["num", { initial: 0, nullable: false, integer: true }],
                    },
                  ],
                  paliers: ["arr", ["str", { initial: "" }]],
                },
              ],
              effets: [
                "schema",
                {
                  raw: ["arr", ["str", { initial: "" }]],
                  custom: ["arr", ["obj"]],
                  liste: ["arr", ["str", { initial: "" }]],
                },
              ],
            },
          ],
          violence: [
            "schema",
            {
              actif: ["bool", { initial: false }],
              isfixe: ["bool", { initial: true }],
              fixe: [
                "schema",
                {
                  dice: ["num", { initial: 0, nullable: false, integer: true }],
                  fixe: ["num", { initial: 0, nullable: false, integer: true }],
                },
              ],
              variable: [
                "schema",
                {
                  energie: ["num", { initial: 0, nullable: false, integer: true }],
                  select: [
                    "schema",
                    {
                      dice: ["num", { initial: 0, nullable: false, integer: true }],
                      fixe: ["num", { initial: 0, nullable: false, integer: true }],
                    },
                  ],
                  paliers: ["arr", ["str", { initial: "" }]],
                },
              ],
              effets: [
                "schema",
                {
                  raw: ["arr", ["str", { initial: "" }]],
                  custom: ["arr", ["obj"]],
                  liste: ["arr", ["str", { initial: "" }]],
                },
              ],
            },
          ],
          effets: [
            "schema",
            {
              actif: ["bool", { initial: false }],
              raw: ["arr", ["str", { initial: "" }]],
              custom: ["arr", ["obj"]],
              liste: ["arr", ["str", { initial: "" }]],
            },
          ],
          textarea: [
            "schema",
            {
              activation: ["num", { initial: 20, nullable: false, integer: true }],
              duree: ["num", { initial: 20, nullable: false, integer: true }],
            },
          ],
        },
      ],
      passives: [
        "schema",
        {
          sante: ["bool", { initial: false }],
          contact: [
            "schema",
            {
              actif: ["bool", { initial: false }],
              value: ["num", { initial: 0, nullable: false, integer: true }],
            },
          ],
          capacites: [
            "schema",
            {
              actif: ["bool", { initial: false }],
              ascension: [
                "schema",
                {
                  actif: ["bool", { initial: false }],
                  update: [
                    "schema",
                    {
                      permanent: ["bool", { initial: false }],
                      prestige: ["bool", { initial: false }],
                    },
                  ],
                },
              ],
              cea: [
                "schema",
                {
                  actif: ["bool", { initial: false }],
                  update: [
                    "schema",
                    {
                      vague: [
                        "schema",
                        {
                          degats: [
                            "schema",
                            {
                              dice: ["num", { initial: 5, nullable: false, integer: true }],
                              fixe: ["num", { initial: 0, nullable: false, integer: true }],
                            },
                          ],
                          violence: [
                            "schema",
                            {
                              dice: ["num", { initial: 5, nullable: false, integer: true }],
                              fixe: ["num", { initial: 0, nullable: false, integer: true }],
                            },
                          ],
                          effets: [
                            "schema",
                            {
                              raw: ["arr", ["str"], { initial: ["parasitage 6"] }],
                              custom: ["arr", ["obj"]],
                              liste: ["arr", ["str", { initial: "" }]],
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
                              dice: ["num", { initial: 5, nullable: false, integer: true }],
                              fixe: ["num", { initial: 0, nullable: false, integer: true }],
                            },
                          ],
                          violence: [
                            "schema",
                            {
                              dice: ["num", { initial: 5, nullable: false, integer: true }],
                              fixe: ["num", { initial: 0, nullable: false, integer: true }],
                            },
                          ],
                          effets: [
                            "schema",
                            {
                              raw: ["arr", ["str"], { initial: ["dispersion 12"] }],
                              custom: ["arr", ["obj"]],
                              liste: ["arr", ["str", { initial: "" }]],
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
                              dice: ["num", { initial: 5, nullable: false, integer: true }],
                              fixe: ["num", { initial: 0, nullable: false, integer: true }],
                            },
                          ],
                          violence: [
                            "schema",
                            {
                              dice: ["num", { initial: 5, nullable: false, integer: true }],
                              fixe: ["num", { initial: 0, nullable: false, integer: true }],
                            },
                          ],
                          effets: [
                            "schema",
                            {
                              raw: ["arr", ["str"], { initial: ["ignorechampdeforce"] }],
                              custom: ["arr", ["obj"]],
                              liste: ["arr", ["str", { initial: "" }]],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
              changeling: [
                "schema",
                {
                  actif: ["bool", { initial: false }],
                  update: [
                    "schema",
                    {
                      duree: ["str", { initial: "" }],
                      energie: [
                        "schema",
                        {
                          personnel: ["num", { initial: 0, nullable: false, integer: true }],
                        },
                      ],
                      odbonus: ["num", { initial: 1, nullable: false, integer: true }],
                      caracteristique: ["num", { initial: 2, nullable: false, integer: true }],
                      textarea: ["num", { initial: 20, nullable: false, integer: true }],
                    },
                  ],
                },
              ],
              companions: [
                "schema",
                {
                  actif: ["bool", { initial: false }],
                  update: [
                    "schema",
                    {
                      deployables: ["num", { initial: 3, nullable: false, integer: true }],
                    },
                  ],
                },
              ],
              ghost: [
                "schema",
                {
                  actif: ["bool", { initial: false }],
                  update: [
                    "schema",
                    {
                      desactivation: ["bool", { initial: false }],
                    },
                  ],
                },
              ],
              goliath: [
                "schema",
                {
                  actif: ["bool", { initial: false }],
                  update: [
                    "schema",
                    {
                      taille: [
                        "schema",
                        {
                          max: ["num", { initial: 10, nullable: false, integer: true }],
                        },
                      ],
                      malus: [
                        "schema",
                        {
                          reaction: [
                            "schema",
                            {
                              value: ["num", { initial: 0, nullable: false, integer: true }],
                            },
                          ],
                          defense: [
                            "schema",
                            {
                              value: ["num", { initial: 0, nullable: false, integer: true }],
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
                  actif: ["bool", { initial: false }],
                  update: [
                    "schema",
                    {
                      bonus: ["num", { initial: 2, nullable: false, integer: true }],
                    },
                  ],
                },
              ],
              morph: [
                "schema",
                {
                  actif: ["bool", { initial: false }],
                  update: [
                    "schema",
                    {
                      vol: [
                        "schema",
                        {
                          description: ["str", { initial: "" }],
                          textarea: ["num", { initial: 20, nullable: false, integer: true }],
                        },
                      ],
                      etirement: [
                        "schema",
                        {
                          portee: ["str", { initial: "" }],
                          textarea: ["num", { initial: 20, nullable: false, integer: true }],
                        },
                      ],
                      metal: [
                        "schema",
                        {
                          bonus: [
                            "schema",
                            {
                              champDeForce: ["num", { initial: 8, nullable: false, integer: true }],
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
                              reaction: ["num", { initial: 5, nullable: false, integer: true }],
                              defense: ["num", { initial: 5, nullable: false, integer: true }],
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
                              degats: [
                                "schema",
                                {
                                  dice: ["num", { initial: 2, nullable: false, integer: true }],
                                  fixe: ["num", { initial: 0, nullable: false, integer: true }],
                                },
                              ],
                              violence: [
                                "schema",
                                {
                                  dice: ["num", { initial: 1, nullable: false, integer: true }],
                                  fixe: ["num", { initial: 0, nullable: false, integer: true }],
                                },
                              ],
                              effets: [
                                "schema",
                                {
                                  raw: ["arr", ["str"]],
                                  custom: ["arr", ["obj"]],
                                  liste: ["arr", ["str", { initial: "" }]],
                                },
                              ],
                            },
                          ],
                          lame: [
                            "schema",
                            {
                              degats: [
                                "schema",
                                {
                                  dice: ["num", { initial: 2, nullable: false, integer: true }],
                                  fixe: ["num", { initial: 0, nullable: false, integer: true }],
                                },
                              ],
                              violence: [
                                "schema",
                                {
                                  dice: ["num", { initial: 1, nullable: false, integer: true }],
                                  fixe: ["num", { initial: 0, nullable: false, integer: true }],
                                },
                              ],
                              effets: [
                                "schema",
                                {
                                  raw: ["arr", ["str"]],
                                  custom: ["arr", ["obj"]],
                                  liste: ["arr", ["str", { initial: "" }]],
                                },
                              ],
                            },
                          ],
                          canon: [
                            "schema",
                            {
                              degats: [
                                "schema",
                                {
                                  dice: ["num", { initial: 2, nullable: false, integer: true }],
                                  fixe: ["num", { initial: 0, nullable: false, integer: true }],
                                },
                              ],
                              violence: [
                                "schema",
                                {
                                  dice: ["num", { initial: 1, nullable: false, integer: true }],
                                  fixe: ["num", { initial: 0, nullable: false, integer: true }],
                                },
                              ],
                              effets: [
                                "schema",
                                {
                                  raw: ["arr", ["str"]],
                                  custom: ["arr", ["obj"]],
                                  liste: ["arr", ["str", { initial: "" }]],
                                },
                              ],
                            },
                          ],
                          textarea: ["num", { initial: 20, nullable: false, integer: true }],
                        },
                      ],
                    },
                  ],
                },
              ],
              oriflamme: [
                "schema",
                {
                  actif: ["bool", { initial: false }],
                  update: [
                    "schema",
                    {
                      activation: ["str", { initial: "deplacement" }],
                      duree: ["str", { initial: "" }],
                      portee: ["str", { initial: "longue" }],
                      energie: ["num", { initial: 6, nullable: false, integer: true }],
                      degats: [
                        "schema",
                        {
                          dice: ["num", { initial: 8, nullable: false, integer: true }],
                          fixe: ["num", { initial: 12, nullable: false, integer: true }],
                        },
                      ],
                      violence: [
                        "schema",
                        {
                          dice: ["num", { initial: 12, nullable: false, integer: true }],
                          fixe: ["num", { initial: 12, nullable: false, integer: true }],
                        },
                      ],
                      effets: [
                        "schema",
                        {
                          raw: ["arr", ["str"]],
                          custom: ["arr", ["obj"]],
                          liste: [
                            "arr",
                            ["str", { initial: "" }],
                            { initial: ["antianatheme", "lumiere 4"] },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
              rage: [
                "schema",
                {
                  actif: ["bool", { initial: false }],
                  update: [
                    "schema",
                    {
                      colere: [
                        "schema",
                        {
                          defense: ["num", { initial: 0, nullable: false, integer: true }],
                          reaction: ["num", { initial: 0, nullable: false, integer: true }],
                          subis: ["num", { initial: 0, nullable: false, integer: true }],
                          combosInterdits: [
                            "schema",
                            {
                              has: ["bool", { initial: false }],
                            },
                          ],
                        },
                      ],
                      rage: [
                        "schema",
                        {
                          defense: ["num", { initial: 0, nullable: false, integer: true }],
                          reaction: ["num", { initial: 0, nullable: false, integer: true }],
                          subis: ["num", { initial: 0, nullable: false, integer: true }],
                          combosInterdits: [
                            "schema",
                            {
                              has: ["bool", { initial: false }],
                            },
                          ],
                        },
                      ],
                      fureur: [
                        "schema",
                        {
                          defense: ["num", { initial: 0, nullable: false, integer: true }],
                          reaction: ["num", { initial: 0, nullable: false, integer: true }],
                          subis: ["num", { initial: 0, nullable: false, integer: true }],
                          combosInterdits: [
                            "schema",
                            {
                              has: ["bool", { initial: false }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
              type: [
                "schema",
                {
                  actif: ["bool", { initial: false }],
                },
              ],
              vision: [
                "schema",
                {
                  actif: ["bool", { initial: false }],
                  update: [
                    "schema",
                    {
                      duree: ["str", { initial: "" }],
                      energie: [
                        "schema",
                        {
                          changer: ["num", { initial: 0, nullable: false, integer: true }],
                        },
                      ],
                      textarea: ["num", { initial: 20, nullable: false, integer: true }],
                    },
                  ],
                },
              ],
              warlord: [
                "schema",
                {
                  actif: ["bool", { initial: false }],
                  update: [
                    "schema",
                    {
                      activer: ["bool", { initial: false }],
                      prolonger: ["bool", { initial: false }],
                    },
                  ],
                },
              ],
            },
          ],
          special: [
            "schema",
            {
              recolteflux: [
                "schema",
                {
                  actif: ["bool", { initial: false }],
                  update: [
                    "schema",
                    {
                      conflit: [
                        "schema",
                        {
                          base: ["num", { initial: 10, nullable: false, integer: true }],
                          tour: ["num", { initial: 5, nullable: false, integer: true }],
                        },
                      ],
                      horsconflit: [
                        "schema",
                        {
                          base: ["num", { initial: 10, nullable: false, integer: true }],
                        },
                      ],
                    },
                  ],
                },
              ],
              contrecoups: [
                "schema",
                {
                  actif: ["bool", { initial: false }],
                },
              ],
            },
          ],
        },
      ],
    };

    return combine(base, specific);
  }

  static migrateData(source) {
    if (!source?.effects) {
      const list = [];
      console.error("test1");

      const type = source.type;
      const isPassive = type === "passive" ? true : false;

      console.error(isPassive);

      if (isPassive) {
        const contact = source?.passives?.contact?.actif;
        const noDmgSante = source?.passives?.sante;

        console.error(noDmgSante);

        if (contact) {
          list.push({
            path: `system.contact`,
            type: "add",
            value: source?.passives?.contact?.value ?? 0,
          });
        }

        if (noDmgSante) {
          list.push({
            path: `system.combat.noDmgSante`,
            type: "override",
            value: true,
          });

          list.push({
            path: `system.sante.pourcentage.withArmor`,
            type: "add",
            value: 50,
          });
        }
      } else {
        const reaction = source?.actives?.reaction ?? 0;
        const defense = source?.actives?.defense ?? 0;

        if (reaction > 0) {
          list.push({
            path: `system.reaction.withArmor`,
            type: "add",
            value: reaction,
          });
        }

        if (defense > 0) {
          list.push({
            path: `system.defense.withArmor`,
            type: "add",
            value: defense,
          });
        }
      }

      if (list.length > 0)
        source.effects = {
          list: list,
        };
    }

    console.error("test3");

    return super.migrateData(source);
  }

  get listEffect() {
    return this.effects.list;
  }

  prepareBaseData() {
    super.prepareBaseData();

    if (this.actives.instant) {
      Object.defineProperty(this, "active", {
        value: false,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
  }

  prepareDerivedData() {
    super.prepareDerivedData();

    this._prepareEffets();
  }

  _prepareEffets() {
    const bEffets = [
      "passives.capacites.cea.update.rayon.effets",
      "passives.capacites.cea.update.salve.effets",
      "passives.capacites.cea.update.vague.effets",
      "passives.capacites.morph.update.polymorphie.lame.effets",
      "passives.capacites.morph.update.polymorphie.canon.effets",
      "passives.capacites.morph.update.polymorphie.griffe.effets",
      "passives.capacites.oriflamme.update.effets",
      "actives.degats.effets",
      "actives.violence.effets",
      "actives.effets",
    ];

    const labels = getAllEffects();

    for (const e of bEffets) {
      const data = foundry.utils.getProperty(this, e);

      Object.defineProperty(data, "liste", {
        value: listEffects(data, labels, data?.chargeur),
      });
    }
  }

  async activate() {
    const label = this.item.name;
    const isActive = this.active;
    const dataCU = this.actives;
    const isInstant = dataCU.instant;
    const energie = dataCU.energie;
    const heroisme = dataCU.heroisme;
    const dataActor = this.actor.system;
    const actorHeroisme = dataActor?.heroisme?.value ?? 0;
    let update = {};
    let updateActor = {};

    if (!isActive) {
      const useHeroisme = await this.useHeroismeActivate();

      if (!useHeroisme) return;

      const usePE = await this.usePEActivate();

      if (!usePE) return;
    }

    if (isActive && !isInstant) update[`system.active`] = false;
    else if (!isActive && !isInstant) update[`system.active`] = true;

    if (!isActive) {
      if (dataCU.recuperation.PA) updateActor[`system.armure.value`] = dataActor.armure.max;
      if (dataCU.recuperation.PS) updateActor[`system.sante.value`] = dataActor.sante.max;
      if (dataCU.recuperation.PE) updateActor[`system.energie.value`] = dataActor.energie.max;

      if (dataCU.jet.actif && dataCU.jet.isfixe) {
        const roll = new game.knight.RollKnight(
          this.actor,
          {
            name: `${label}`,
            dices: `${dataCU.jet.fixe.dice}D6+${dataCU.jet.fixe.fixe}`,
          },
          false,
        );

        const rTotal = await roll.doRoll();
      }

      if (dataCU.dgts.actif && dataCU.dgts.isfixe) {
        const roll = new game.knight.RollKnight(
          this.actor,
          {
            name: `${label} : ${game.i18n.localize("KNIGHT.AUTRE.Degats")}`,
            dices: `${dataCU.dgts.fixe.dice}D6+${dataCU.dgts.fixe.fixe}`,
          },
          false,
        );
        const weapon = roll.prepareWpnDistance({
          name: label,
          system: {
            degats: { dice: dataCU.dgts.fixe.dice, fixe: dataCU.dgts.fixe.fixe },
            violence: { dice: 0, fixe: 0 },
            effets: dataCU.dgts.effets,
          },
        });
        const options = weapon.options;

        for (let o of options) {
          o.active = true;
        }
        const flags = roll.getRollData(weapon);
        roll.setWeapon(weapon);

        await roll.doRollDamage(flags);
      }

      if (dataCU.viol.actif && dataCU.viol.isfixe) {
        const roll = new game.knight.RollKnight(
          this.actor,
          {
            name: `${label} : ${game.i18n.localize("KNIGHT.AUTRE.Violence")}`,
            dices: `${dataCU.viol.fixe.dice}D6+${dataCU.viol.fixe.fixe}`,
          },
          false,
        );
        const weapon = roll.prepareWpnDistance({
          name: label,
          system: {
            degats: { dice: 0, fixe: 0 },
            violence: { dice: dataCU.viol.fixe.dice, fixe: dataCU.viol.fixe.fixe },
            effets: dataCU.viol.effets,
          },
        });
        const options = weapon.options;

        for (let o of options) {
          o.active = true;
        }
        const flags = roll.getRollData(weapon);
        roll.setWeapon(weapon);

        await roll.doRollViolence(flags);
      }

      if (dataCU.effets.actif) {
        const roll = new game.knight.RollKnight(
          this.actor,
          {
            name: `${label}`,
            dices: `0D6`,
          },
          false,
        );

        const rTotal = await roll.doRoll({}, dataCU.effets);
      }
    }

    if (!foundry.utils.isEmpty(update)) this.item.update(update);
    if (!foundry.utils.isEmpty(updateActor)) this.actor.update(updateActor);
  }

  async roll(special, variant = "") {
    const actor = this.actor;
    const label = this.item.name;
    const dataCU = this.actives;
    const dataRoll = dataCU[special];
    let energieBonus = 0;

    if (!dataRoll.isfixe) {
      const useHeroisme = await this.useHeroismeActivate();

      if (!useHeroisme) return;

      if (special === "degats" || special === "violence") {
        energieBonus = dataRoll.variable.energie * (variant + 1);
      }

      const usePE = await this.usePEActivate(energieBonus);

      if (!usePE) return;

      switch (special) {
        case "jet":
          const id = this.actor.system.actorUuid;

          const dialog = new game.knight.applications.KnightRollDialog(id, {
            label: label,
            base: dataRoll.variable.caracteristiques[variant],
          });

          dialog.open();
          break;

        case "degats":
        case "violence":
          const paliersRoll = dataRoll.variable.paliers[variant];
          const split = paliersRoll.split("D6+");
          const rollDice = Number(split[0]);
          const rollFixe = Number(split[1]);
          const rollApply = { dice: rollDice, fixe: rollFixe };
          const rollSimple = { dice: 0, fixe: 0 };

          const rRoll = new game.knight.RollKnight(
            actor,
            {
              name: `${label} : ${game.i18n.localize(`KNIGHT.AUTRE.${capitalizeFirstLetter(special)}`)}`,
            },
            false,
          );
          const wpn = rRoll.prepareWpnDistance({
            name: label,
            system: {
              degats: special === "degats" ? rollApply : rollSimple,
              violence: special === "violence" ? rollApply : rollSimple,
              effets: dataRoll.effets,
            },
          });
          const optionsWpn = wpn.options;

          for (let o of optionsWpn) {
            o.active = true;
          }
          const flagsWpn = rRoll.getRollData(wpn);
          rRoll.setWeapon(wpn);

          if (special === "degats") await rRoll.doRollDamage(flagsWpn);
          else await rRoll.doRollViolence(flagsWpn);
          break;
      }
    }
  }

  async ascension() {
    const actor = this.actor;
    const armure = actor.system.dataArmor;
    const isPermanent = this.passives.capacites.ascension.update.permanent;
    const isPrestige = this.passives.capacites.ascension.update.prestige;
    const name = game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.ASCENSION.Label");

    const exist = Array.from(game.actors).find(
      (actors) => actors.id === armure.system.capacites.selected.ascension.ascensionId,
    );

    if (!exist && isPermanent) {
      let data = actor.system;
      data.wear = "armure";
      data.isAscension = true;
      data.proprietaire = context._id;
      let clone = foundry.utils.deepClone(actor);
      let newActor = await Actor.create(clone);

      let update = {};
      update["name"] = `${name} : ${actor.name}`;
      update["img"] = armure.img;
      update["system.wear"] = "ascension";
      update["system.equipements.ascension"] = actor.system.equipements.armure;

      if (!isPrestige) {
        for (let item of newActor.items) {
          const rareteWpn = item.system?.rarete ?? "";
          const rareteMdl = item.system?.niveau?.actuel?.rarete ?? "";

          if (
            ((rareteWpn === "prestige" || rareteMdl === "prestige") && !prestige) ||
            item.type === "capaciteultime"
          )
            item.delete();
        }
      }

      newActor.update(update);
      armure.update({
        [`system.capacites.selected.ascension`]: {
          ascensionId: newActor.id,
        },
      });
    } else if (isPermanent) {
      let clone = foundry.utils.deepClone(actor);

      const update = {};
      update["name"] = `${name} : ${actor.name}`;
      update["system"] = clone.system;
      update["img"] = armure.img;
      update["system.wear"] = "ascension";
      update["system.equipements.ascension"] = this.actor.system.equipements.armure;

      exist.update(update);

      let ascension = exist.items.find((items) => items.type === "armure");

      for (let item of exist.items) {
        await item.delete();
      }

      for (let item of actor.items) {
        const rareteWpn = item.system?.rarete ?? "";
        const rareteMdl = item.system?.niveau?.actuel?.rarete ?? "";
        if (
          ((rareteWpn === "prestige" || rareteMdl === "prestige") && !prestige) ||
          item.type === "capaciteultime"
        )
          continue;

        await Item.create(foundry.utils.deepClone(item), { parent: exist });
      }

      for (let item of exist.items.filter((items) => items.type === "armure")) {
        let itmUpdate = {};
        itmUpdate["system"] = ascension.system;
        itmUpdate["system.jauges.sante"] = false;
        itmUpdate["system.jauges.espoir"] = false;
        itmUpdate["system.jauges.heroisme"] = false;

        item.update(itmUpdate);
      }
    }
  }

  async usePEActivate(toAdd = 0, forceEspoir = false) {
    const actor = this.actor;
    const armure = actor.system.dataArmor;
    const label = this.item.name;

    const remplaceEnergie = armure?.espoirRemplaceEnergie ?? false;
    const getType = remplaceEnergie || forceEspoir ? "espoir" : "energie";

    const value = Number(actor?.system?.[getType]?.value ?? 0);
    const espoir = Number(actor?.system?.espoir?.value ?? 0);

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

    const isFinite = (number, defaut = 0) => {
      return Number.isFinite(number) ? number : defaut;
    };

    let depenseEnergie = this.actives.energie + toAdd;
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

      if (!remplaceEnergie)
        pbE.sys(`equipements.${actor.system.wear}.${getType}.value`, substractEnergie);
      else if (remplaceEnergie && !actor.system.espoir.perte.saufAgonie)
        pbE.sys("espoir.value", substractEnergie);

      if (!remplaceEnergie && depenseEspoir) pbE.sys("espoir.value", substractEspoir);

      await pbE.applyTo(actor);

      return true;
    }
  }

  async useHeroismeActivate() {
    const actor = this.actor;
    const label = this.item.name;
    const dataCU = this.actives;
    const heroisme = dataCU?.heroisme ?? 0;
    const actorHeroisme = dataActor?.heroisme?.value ?? 0;
    const newValue = actorHeroisme - heroisme;

    if (newValue < 0) {
      const msgHeroisme = {
        flavor: `${label}`,
        main: {
          total: `${game.i18n.localize("KNIGHT.JETS.Notheroisme")}`,
        },
      };

      const msgHeroismeData = {
        user: game.user.id,
        speaker: {
          actor: actor?.id || null,
          token: actor?.token?.id || null,
          alias: actor?.name || null,
        },
        style: CONST.CHAT_MESSAGE_STYLES.OTHER,
        content: await renderTemplate("systems/knight/templates/dices/wpn.html", msgHeroisme),
        sound: CONFIG.sounds.dice,
      };

      const rMode = game.settings.get("core", "rollMode");
      const msgFData = ChatMessage.applyRollMode(msgHeroismeData, rMode);

      await ChatMessage.create(msgFData, {
        rollMode: rMode,
      });

      return false;
    } else {
      let pbE = new PatchBuilder();
      pbE.sys("heroisme.value", newValue);
      await pbE.applyTo(actor);

      return true;
    }
  }
}
