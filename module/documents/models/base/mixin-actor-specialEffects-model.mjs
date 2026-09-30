const ActorSpecialEffectsMixinModel = (superclass) =>
  class extends superclass {
    _sumSpecialEffects(type, path) {
      const listSpecial = ["initiative"];

      if (listSpecial.includes(type)) {
        this.#sumSpecial(type, path);
        return;
      }

      const getOverride = foundry.utils.getProperty(this, `${path}.override`);
      const override = Object.values(getOverride ?? {}).reduce(
        (max, curr) => Math.max(max, Number(curr) || 0),
        0,
      );

      if (!override) {
        const getDivide = foundry.utils.getProperty(this, `${path}.divide`) ?? {};

        const divide = Object.values(getDivide).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        const base = this.#baseInit(type, path, divide);
        const { mod, bonus, malus } = this.#sumMod(type, path, base);

        switch (type) {
          case "sante":
          case "espoir":
            foundry.utils.setProperty(this, `${path}.max`, base + mod);
            break;

          case "defense":
            foundry.utils.setProperty(this, `${path}.value`, Math.max(base + mod, 0));
            foundry.utils.setProperty(this, `${path}.valueWOMod`, base + bonus);
            foundry.utils.setProperty(this, `${path}.malustotal`, malus);
            break;

          case "reaction":
            foundry.utils.setProperty(this, `${path}.value`, Math.max(base + mod, 0));
            foundry.utils.setProperty(this, `${path}.valueWOMod`, base + bonus);
            foundry.utils.setProperty(this, `${path}.malustotal`, malus);
            break;

          case "contact":
            foundry.utils.setProperty(this, `${path}.value`, Math.max(base + mod, 0));
            break;
        }
      } else {
        switch (type) {
          case "sante":
          case "espoir":
            foundry.utils.setProperty(this, `${path}.max`, override);
            break;

          case "defense":
          case "reaction":
            foundry.utils.setProperty(this, `${path}.value`, override);
            foundry.utils.setProperty(this, `${path}.valueWOMod`, override);
            break;

          case "contact":
            foundry.utils.setProperty(this, `${path}.value`, override);
            break;
        }
      }
    }

    #baseInit(type, path, divide) {
      if (!this.isPJ) return foundry.utils.getProperty(this, `${path}.base`);
      else {
        const aspect = {
          sante: "chair",
          defense: "bete",
          reaction: "machine",
          contact: "dame",
          initiative: "masque",
        }[type];
        const options = this.options;
        let base = 0;

        switch (type) {
          case "sante":
            base = options?.kraken ? 8 : 6;
            base = base * this.#sumWithoutOD(aspect) + 10;

            if (divide) base = Math.floor(base / divide);

            foundry.utils.setProperty(this, `${path}.base`, base);
            break;

          case "defense":
          case "reaction":
            base = this.#sumWithOD(aspect);
            base += options?.kraken ? 1 : 0;

            if (divide) base = Math.floor(base / divide);

            foundry.utils.setProperty(this, `${path}.base`, base);
            break;

          case "contact":
            base = this.#sumWithoutOD(aspect);

            if (divide) base = Math.floor(base / divide);
            break;

          case "initiative":
            base = this.#sumWithOD(aspect);

            if (divide) base = Math.floor(base / divide);
            break;

          case "espoir":
            base = 50;

            if (divide) base = Math.floor(base / divide);
            break;
        }

        return base;
      }
    }

    #sumMod(type, path, base) {
      const strBonus = `${path}.bonus`;
      const strMalus = `${path}.malus`;

      const strPourcentageBonus = `${path}.pourcentage.bonus`;
      const strPourcentageMalus = `${path}.pourcentage.malus`;

      const getBonus = foundry.utils.getProperty(this, strBonus) ?? {};
      const getMalus = foundry.utils.getProperty(this, strMalus) ?? {};

      const getPourcentageBonus = foundry.utils.getProperty(this, strPourcentageBonus) ?? {};
      const getPourcentageMalus = foundry.utils.getProperty(this, strPourcentageMalus) ?? {};

      let baseBonus = Object.entries(getBonus)
        .filter(
          ([key, curr]) =>
            !key.startsWith("module") && !key.startsWith("armure") && !key.startsWith("od"),
        )
        .reduce((acc, [key, curr]) => acc + (Number(curr) || 0), 0);
      let baseMalus = Object.entries(getMalus)
        .filter(
          ([key, curr]) =>
            !key.startsWith("module") && !key.startsWith("armure") && !key.startsWith("od"),
        )
        .reduce((acc, [key, curr]) => acc + (Number(curr) || 0), 0);

      let bonus = Object.entries(getBonus)
        .filter(
          ([key, curr]) =>
            key.startsWith("module") && key.startsWith("armure") && key.startsWith("od"),
        )
        .reduce((acc, [key, curr]) => acc + (Number(curr) || 0), 0);

      let malus = Object.entries(getMalus)
        .filter(
          ([key, curr]) =>
            key.startsWith("module") && key.startsWith("armure") && key.startsWith("od"),
        )
        .reduce((acc, [key, curr]) => acc + (Number(curr) || 0), 0);

      let pourcentageBonus = Object.entries(getPourcentageBonus).reduce(
        (acc, [key, curr]) => acc + (Number(curr) || 0),
        0,
      );

      let pourcentageMalus = Object.entries(getPourcentageMalus).reduce(
        (acc, [key, curr]) => acc + (Number(curr) || 0),
        0,
      );

      bonus += baseBonus;
      malus += baseMalus;

      if (this.isPJ) {
        let CUBonus = 0;

        switch (type) {
          case "sante":
            const pourcentageBonusTotal = this.#getPourcentageMod(
              base,
              baseBonus - baseMalus,
              pourcentageBonus,
            );
            const pourcentageMalusTotal = this.#getPourcentageMod(
              base,
              baseBonus - baseMalus,
              pourcentageMalus,
            );

            if (this.armorISwear) {
              if (this.#getOD("chair", "endurance") >= 3) {
                foundry.utils.setProperty(this, `${path}.bonus.odEndurance`, 6);
                bonus += 6;
              }

              CUBonus += this.#getBonusCU(type, base, baseBonus - baseMalus);
            }

            if (pourcentageBonusTotal > 0) bonus += pourcentageBonusTotal;
            if (pourcentageMalusTotal > 0) malus += pourcentageMalusTotal;

            if (CUBonus > 0) {
              foundry.utils.setProperty(this, `${path}.bonus.capaciteUltime`, CUBonus);
              bonus += CUBonus;
            }
            break;

          case "reaction":
            let isWatchtower = false;
            if (this.dataArmor)
              isWatchtower =
                this.dataArmor?.system?.capacites?.selected?.watchtower?.active ?? false;

            foundry.utils.setProperty(this, `${path}.iswatchtower`, isWatchtower);

            if (isWatchtower) {
              const modWatchtower = Math.ceil((base + bonus - malus) / 2);
              malus += modWatchtower;
              foundry.utils.setProperty(this, `${path}.malus.watchtower`, modWatchtower);
            }
            break;

          case "contact":
            if (this.armorISwear) {
              CUBonus += this.#getBonusCU(type);
            }

            if (CUBonus > 0) {
              foundry.utils.setProperty(this, `${path}.bonus.capaciteUltime`, CUBonus);
              bonus += CUBonus;
            }
            break;
        }
      }

      let mod = bonus - malus;

      foundry.utils.setProperty(this, `${path}.mod`, mod);

      return {
        mod,
        bonus,
        malus,
      };
    }

    #sumWithoutOD(aspect) {
      return Object.values(this.aspects[aspect].caracteristiques).reduce((acc, curr) => {
        const valeurTotale = curr.value;
        return valeurTotale > acc ? valeurTotale : acc;
      }, 0);
    }

    #sumWithOD(aspect) {
      return Object.values(this.aspects[aspect].caracteristiques).reduce((acc, curr) => {
        const valeurTotale = this?.armorISwear ? curr.value + curr.overdrive.value : curr.value;
        return valeurTotale > acc ? valeurTotale : acc;
      }, 0);
    }

    #getOD(aspect, caracteristique) {
      return foundry.utils.getProperty(
        this,
        `aspects.${aspect}.caracteristiques.${caracteristique}.overdrive.value`,
      );
    }

    #getBonusCU(type, base = 0, mod = 0) {
      let bonus = 0;

      if (!this.capaciteUltime) return bonus;

      switch (type) {
        case "sante":
          if (this.capaciteUltime.type === "passive" && this.capaciteUltime.passive.sante)
            bonus += Math.floor((base + mod) / 2);
          break;

        case "contact":
          if (this.capaciteUltime.type === "passive" && this.capaciteUltime.passive.contact.active)
            bonus += this.capaciteUltime?.contact?.value ?? 0;
          break;
      }

      return bonus;
    }

    #getPourcentageMod(base = 0, mod = 0, pourcentage = 0) {
      return pourcentage > 0 ? Math.floor((base + mod) * (pourcentage / 100)) : 0;
    }

    #sumSpecial(type, path) {
      switch (type) {
        case "initiative":
          const isEmbuscadeSubis = foundry.utils.getProperty(this, `options.embuscadeSubis`);
          const isEmbuscadePris = foundry.utils.getProperty(this, `options.embuscadePris`);

          const getOverrideInitBonus = foundry.utils.getProperty(this, `${path}.override`);
          const getOverrideInitDice = foundry.utils.getProperty(this, `${path}.diceOverride`);

          let overrideInitBonus = Object.values(getOverrideInitBonus ?? {}).reduce(
            (max, curr) => Math.max(max, Number(curr) || 0),
            0,
          );
          let overrideInitDice = Object.values(getOverrideInitBonus ?? {}).reduce(
            (max, curr) => Math.max(max, Number(curr) || 0),
            0,
          );

          let baseSumInitiative = 0;
          let diceSumInitiative = 0;

          let divideInitEmbuscadeDice = 0;
          let divideInitEmbuscadeBonus = 0;

          if (isEmbuscadeSubis) {
            const getDivideInitBonusEmbuscade =
              foundry.utils.getProperty(this, `${path}.embuscade.divide`) ?? {};
            const getDivideInitDiceEmbuscade =
              foundry.utils.getProperty(this, `${path}.embuscade.diceDivide`) ?? {};

            const divideInitBonusEmbuscade = Object.values(getDivideInitBonusEmbuscade).reduce(
              (acc, curr) => acc + (Number(curr) || 0),
              0,
            );
            const divideInitDiceEmbuscade = Object.values(getDivideInitDiceEmbuscade).reduce(
              (acc, curr) => acc + (Number(curr) || 0),
              0,
            );

            divideInitEmbuscadeDice += divideInitDiceEmbuscade;
            divideInitEmbuscadeBonus += divideInitBonusEmbuscade;

            const getOverrideInitBonusEmbuscade = foundry.utils.getProperty(
              this,
              `${path}.embuscade.override`,
            );
            const getOverrideInitDiceEmbuscade = foundry.utils.getProperty(
              this,
              `${path}.embuscade.diceOverride`,
            );

            overrideInitBonus = Math.max(
              overrideInitBonus,
              Object.values(getOverrideInitBonusEmbuscade ?? {}).reduce(
                (max, curr) => Math.max(max, Number(curr) || 0),
                0,
              ),
            );
            overrideInitDice = Math.max(
              overrideInitBonus,
              Object.values(getOverrideInitDiceEmbuscade ?? {}).reduce(
                (max, curr) => Math.max(max, Number(curr) || 0),
                0,
              ),
            );
          }

          if (!overrideInitBonus) {
            const getDivideInitBonus = foundry.utils.getProperty(this, `${path}.divide`) ?? {};

            const divideInitBonus = Object.values(getDivideInitBonus).reduce(
              (acc, curr) => acc + (Number(curr) || 0),
              0,
            );
            const sumDivideInitBonus = divideInitBonus + divideInitEmbuscadeBonus;
            const baseInitiative = this.#baseInit(type, path, sumDivideInitBonus);
            const modInitiative = this.#sumSpecialMod(
              "initiativeBonus",
              path,
              isEmbuscadeSubis,
              isEmbuscadePris,
            ).mod;

            baseSumInitiative = baseInitiative + modInitiative;
          } else baseSumInitiative = getOverrideInitBonus;

          if (!overrideInitDice) {
            const getDivideInitDice = foundry.utils.getProperty(this, `${path}.diceDivide`) ?? {};

            const divideInitDice = Object.values(getDivideInitDice).reduce(
              (acc, curr) => acc + (Number(curr) || 0),
              0,
            );
            const sumDivideInitDice = divideInitDice + divideInitEmbuscadeDice;

            const diceBaseInitiative = sumDivideInitDice
              ? Math.floor(foundry.utils.getProperty(this, `${path}.diceBase`) / sumDivideInitDice)
              : foundry.utils.getProperty(this, `${path}.diceBase`);

            const diceModInitiative = this.#sumSpecialMod(
              "initiativeDice",
              path,
              isEmbuscadeSubis,
              isEmbuscadePris,
            ).diceMod;

            diceSumInitiative = diceBaseInitiative + diceModInitiative;
          } else diceSumInitiative = getOverrideInitDice;

          foundry.utils.setProperty(this, `${path}.dice`, diceSumInitiative);
          foundry.utils.setProperty(this, `${path}.value`, baseSumInitiative);
          foundry.utils.setProperty(
            this,
            `${path}.complet`,
            `${diceSumInitiative}D6+${baseSumInitiative}`,
          );
          break;
      }
    }

    #sumSpecialMod(type, path, isEmbuscadeSubis = false, isEmbuscadePris = false) {
      let mod = 0;
      let diceMod = 0;

      switch (type) {
        case "initiativeBonus":
          const getInitiativeFixeBonus = foundry.utils.getProperty(this, `${path}.bonus`);
          const getInitiativeFixeMalus = foundry.utils.getProperty(this, `${path}.malus`);

          let initiativeFixeBonus = Object.values(getInitiativeFixeBonus).reduce(
            (acc, curr) => acc + (Number(curr) || 0),
            0,
          );
          let initiativeFixeMalus = Object.values(getInitiativeFixeMalus).reduce(
            (acc, curr) => acc + (Number(curr) || 0),
            0,
          );

          if (this.armorISwear) {
            const odInstinct = this.#getOD("bete", "instinct");

            if (odInstinct >= 3) {
              const multiOdInstinct = 3 * odInstinct;

              foundry.utils.setProperty(this, `${path}.bonus.odInstinct`, multiOdInstinct);

              initiativeFixeBonus += multiOdInstinct;
            }
          }

          if (isEmbuscadeSubis) {
            const getInitiativeFixeBonusEmbuscade = foundry.utils.getProperty(
              this,
              `${path}.embuscade.bonus`,
            );
            const getInitiativeFixeMalusEmbuscade = foundry.utils.getProperty(
              this,
              `${path}.embuscade.malus`,
            );

            initiativeFixeBonus += Object.values(getInitiativeFixeBonusEmbuscade).reduce(
              (acc, curr) => acc + (Number(curr) || 0),
              0,
            );
            initiativeFixeMalus += Object.values(getInitiativeFixeMalusEmbuscade).reduce(
              (acc, curr) => acc + (Number(curr) || 0),
              0,
            );
          }

          if (isEmbuscadePris) {
            foundry.utils.setProperty(this, `${path}.bonus.embuscade`, 10);

            initiativeFixeBonus += 10;
          }

          mod = initiativeFixeBonus - initiativeFixeMalus;

          foundry.utils.setProperty(this, `${path}.mod`, mod);
          break;

        case "initiativeDice":
          const getInitiativeDiceBonus = foundry.utils.getProperty(this, `${path}.diceBonus`);
          const getInitiativeDiceMalus = foundry.utils.getProperty(this, `${path}.diceMalus`);

          let initiativeDiceBonus = Object.values(getInitiativeDiceBonus).reduce(
            (acc, curr) => acc + (Number(curr) || 0),
            0,
          );
          let initiativeDiceMalus = Object.values(getInitiativeDiceMalus).reduce(
            (acc, curr) => acc + (Number(curr) || 0),
            0,
          );

          if (isEmbuscadeSubis) {
            const getInitiativeFixeDiceBonusEmbuscade = foundry.utils.getProperty(
              this,
              `${path}.embuscade.diceBonus`,
            );
            const getInitiativeFixeDiceMalusEmbuscade = foundry.utils.getProperty(
              this,
              `${path}.embuscade.diceMalus`,
            );

            initiativeDiceBonus += Object.values(getInitiativeFixeDiceBonusEmbuscade).reduce(
              (acc, curr) => acc + (Number(curr) || 0),
              0,
            );
            initiativeDiceMalus += Object.values(getInitiativeFixeDiceMalusEmbuscade).reduce(
              (acc, curr) => acc + (Number(curr) || 0),
              0,
            );
          }

          diceMod = initiativeDiceBonus - initiativeDiceMalus;

          foundry.utils.setProperty(this, `${path}.diceMod`, diceMod);
          break;
      }

      return {
        diceMod,
        mod,
      };
    }
  };

export default ActorSpecialEffectsMixinModel;
