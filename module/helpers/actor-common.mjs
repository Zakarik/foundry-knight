import {
  listEffects,
  getSpecial,
  sum,
  getAllEffects,
} from "./common.mjs";

export async function prepareCharacterItems(actor, actorData, system, items) {
    const allEffects = getAllEffects();
    const wear = system?.wear ?? "civil";
    const isPj = actor.type === 'knight' ? true : false;
    const onArmor = wear === 'armure' || wear === 'ascension' || !isPj  ? true : false;

    const armorSpecial = getSpecial(actor);
    const armorSpecialRaw = armorSpecial?.raw || [];
    const armorSpecialCustom = armorSpecial?.custom || [];

    const avantage = [];
    const inconvenient = [];
    const avantageIA = [];
    const inconvenientIA = [];
    const motivationMineure = [];
    const langue = [];
    const contact = [];
    const blessures = [];
    const trauma = [];
    const overdrive = [];
    const module = [];
    const modulepassifs = [];
    const moduleErsatz = {};
    const moduleBonusDgts = {
      "contact":[],
      "distance":[]
    };
    const moduleBonusDgtsVariable = {
      "contact":[],
      "distance":[]
    };
    const moduleBonusViolence = {
      "contact":[],
      "distance":[]
    };
    const moduleBonusViolenceVariable = {
      "contact":[],
      "distance":[]
    };
    const armesDistanceModules = [];
    const armesContactEquipee = [];
    const armesDistanceEquipee = [];
    const armesContactRack = [];
    const armesDistanceRack = [];
    const armesContactArmoury = [];
    const armesDistanceArmoury = [];
    const armesTourelles = [];
    const evolutionsAchetables = [];
    const evolutionsCompanions = [];
    const evolutionsAAcheter = [];
    const cyberware = [];

    const carteHeroique = [];
    const capaciteHeroique = [];
    const distinctions = [];

    const capaciteultime = items.find(items => items.type === 'capaciteultime');

    let armureData = {};
    let armureLegendeData = {};
    let longbow = {};
    let art = {};
    let lion = {
      armure:{
        bonus:[0],
        malus:[0]
      },
      champDeForce:{
        bonus:[0],
        malus:[0]
      },
      defense:{
        bonus:[0],
        malus:[0]
      },
      reaction:{
        bonus:[0],
        malus:[0]
      },
      energie:{
        bonus:[0],
        malus:[0]
      },
      initiative:{
        bonus:[0],
        malus:[0]
      },
      armes:{
        contact:[],
        distance:[]
      },
      modules:[],
      bonusDgtsVariable:{
        "contact":[],
        "distance":[]
      },
      bonusViolenceVariable:{
        "contact":[],
        "distance":[]
      },
      bonusDgts:{
        "contact":[],
        "distance":[]
      },
      bonusViolence:{
        "contact":[],
        "distance":[]
      },
      slots:{
        tete:{
          used:0,
          value:0
        },
        torse:{
          used:0,
          value:0
        },
        brasGauche:{
          used:0,
          value:0
        },
        brasDroit:{
          used:0,
          value:0
        },
        jambeGauche:{
          used:0,
          value:0
        },
        jambeDroite:{
          used:0,
          value:0
        }
      }
    };
    let lionLegend = {
      armure:{
        bonus:[0],
        malus:[0]
      },
      champDeForce:{
        bonus:[0],
        malus:[0]
      },
      defense:{
        bonus:[0],
        malus:[0]
      },
      reaction:{
        bonus:[0],
        malus:[0]
      },
      energie:{
        bonus:[0],
        malus:[0]
      },
      initiative:{
        bonus:[0],
        malus:[0]
      },
      armes:{
        contact:[],
        distance:[]
      },
      modules:[],
      bonusDgtsVariable:{
        "contact":[],
        "distance":[]
      },
      bonusViolenceVariable:{
        "contact":[],
        "distance":[]
      },
      bonusDgts:{
        "contact":[],
        "distance":[]
      },
      bonusViolence:{
        "contact":[],
        "distance":[]
      },
      slots:{
        tete:{
          used:0,
          value:0
        },
        torse:{
          used:0,
          value:0
        },
        brasGauche:{
          used:0,
          value:0
        },
        brasDroit:{
          used:0,
          value:0
        },
        jambeGauche:{
          used:0,
          value:0
        },
        jambeDroite:{
          used:0,
          value:0
        }
      }
    };

    for (let i of items) {
      const data = i.system;

      // ARMURE.
      if (i.type === 'armure') {

        let passiveUltime = undefined;

        if(capaciteultime !== undefined) {
          const dataCapaciteUltime = capaciteultime.system;

          if(dataCapaciteUltime.type == 'passive') passiveUltime = dataCapaciteUltime.passives;
        }

        armureData.label = i.name;

        const armorEvolutions = data.evolutions;

        if(isPj) {
            const totalPG = +system.progression.gloire.total;

            for (let [key, evolution] of Object.entries(armorEvolutions.liste)) {
            const PGEvo = +evolution.value;
            const AlreadyEvo = evolution.applied;

            if(!AlreadyEvo && PGEvo <= totalPG) {
                evolutionsAchetables.push({
                value:PGEvo,
                id:key
                });
            }
            }
        }

        const companionsEvolutions = armorEvolutions?.special?.companions || false;

        if(companionsEvolutions) {
          const valueEvo = +companionsEvolutions.value;
          const nbreEvo = Math.floor(totalPG/+companionsEvolutions.value);
          const nbreEvoApplied = companionsEvolutions?.applied?.value || 0;

          if(nbreEvo > nbreEvoApplied) {
            for(let n = nbreEvoApplied+1; n <= nbreEvo;n++) {
              evolutionsCompanions.push({
                id:n,
                value:valueEvo*n
              });
            }
          }
        }

        const longbowEvolutions = armorEvolutions?.special?.longbow || false;

        if(longbowEvolutions) {
          const PGEvo1 = +longbowEvolutions['1'].value;
          const AlreadyEvo1 = longbowEvolutions['1'].applied;
          const description1 = longbowEvolutions['1'].description;

          if(!AlreadyEvo1) {
            evolutionsAAcheter.push({
              id:1,
              description:description1 ? description1.replaceAll('<p>', '').replaceAll('</p>', '') : '',
              value:PGEvo1
            });
          }

          const PGEvo2 = +longbowEvolutions['2'].value;
          const AlreadyEvo2 = longbowEvolutions['2'].applied;
          const description2 = longbowEvolutions['2'].description;

          if(!AlreadyEvo2) {
            evolutionsAAcheter.push({
              id:2,
              description:description2 ? description2.replaceAll('<p>', '').replaceAll('</p>', '') : '',
              value:PGEvo2
            });
          }

          const PGEvo3 = +longbowEvolutions['3'].value;
          const AlreadyEvo3 = longbowEvolutions['3'].applied;
          const description3 = longbowEvolutions['3'].description;

          if(!AlreadyEvo3) {
            evolutionsAAcheter.push({
              id:3,
              description:description3 ? description3.replaceAll('<p>', '').replaceAll('</p>', '') : '',
              value:PGEvo3
            });
          }

          const PGEvo4 = +longbowEvolutions['4'].value;
          const AlreadyEvo4 = longbowEvolutions['4'].applied;
          const description4 = longbowEvolutions['4'].description;

          if(!AlreadyEvo4) {
            evolutionsAAcheter.push({
              id:4,
              description:description4 ? description4.replaceAll('<p>', '').replaceAll('</p>', '') : '',
              value:PGEvo4
            });
          }
        }

        const capacites = data?.capacites?.selected;
        const specials = data.special.selected;

        for (let [key, special] of Object.entries(specials)) {
          switch(key) {
            case 'contrecoups':
              if(passiveUltime !== undefined) {
                if(passiveUltime.capacites.actif && passiveUltime.special.contrecoups.actif) {
                  data.special.selected[key].unactif = true;
                }
              }
              break;
          }
        }

        if(onArmor) {
          for (let [key, special] of Object.entries(specials)) {
            switch(key) {
              case 'contrecoups':
                system.restrictions.noArmeDistance = !special.armedistance.value ? true : false;
                system.restrictions.maxEffetsArmeContact = {
                  has:special.maxeffets.value,
                  value:special.maxeffets.max,
                };
                break;

              case 'recolteflux':
                if(passiveUltime !== undefined) {
                  if(passiveUltime.capacites.actif && passiveUltime.special.recolteflux.actif) {
                    data.special.selected[key] = {
                      conflit:{
                        base:passiveUltime.special.recolteflux.update.conflit.base,
                        tour:passiveUltime.special.recolteflux.update.conflit.tour,
                      },
                      horsconflit:{
                        base:passiveUltime.special.recolteflux.update.horsconflit.base
                      }
                    }
                  }
                }
                break;
            }
          }

          for (let c in capacites) {
            const dCapacite = capacites[c];

            switch(c) {
              case 'longbow':
                longbow = dCapacite;
                longbow.has = true;
                break;

              case 'borealis':
                armesDistanceEquipee.push({
                  _id:i._id,
                  name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.OFFENSIF.Label')}`,
                  type:'armure',
                  raw:'borealis',
                  system:{
                    subCapaciteName:'borealis',
                    capacite:true,
                    noRack:true,
                    type:'distance',
                    portee:dCapacite.offensif.portee,
                    degats:dCapacite.offensif.degats,
                    violence:dCapacite.offensif.violence,
                    effets:{
                      activable:dCapacite.offensif.effets.activable,
                      raw:dCapacite.offensif.effets.raw,
                      custom:dCapacite.offensif.effets.custom,
                      liste:listEffects(dCapacite.offensif.effets, allEffects, dCapacite.offensif.effets?.chargeur ?? null),
                      chargeur:dCapacite.offensif.effets?.chargeur ?? null
                    }
                  }
                });

                armesContactEquipee.push({
                  _id:i._id,
                  name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.OFFENSIF.Label')}`,
                  type:'armure',
                  raw:'borealis',
                  system:{
                    subCapaciteName:'borealis',
                    capacite:true,
                    noRack:true,
                    type:'contact',
                    portee:dCapacite.offensif.portee,
                    degats:dCapacite.offensif.degats,
                    violence:dCapacite.offensif.violence,
                    effets:{
                      activable:dCapacite.offensif.effets.activable,
                      raw:dCapacite.offensif.effets.raw,
                      custom:dCapacite.offensif.effets.custom,
                      liste:listEffects(dCapacite.offensif.effets, allEffects, dCapacite.offensif.effets?.chargeur ?? null),
                      chargeur:dCapacite.offensif.effets?.chargeur ?? null
                    }
                  }
                });
                break;

              case 'cea':
                armesDistanceEquipee.push({
                  _id:i._id,
                  name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.VAGUE.Label'),
                  type:'armure',
                  raw:'cea_vague',
                  system:{
                    subCapaciteName:'vague',
                    capacite:true,
                    noRack:true,
                    type:'distance',
                    portee:dCapacite.vague.portee,
                    degats:dCapacite.vague.degats,
                    violence:dCapacite.vague.violence,
                    effets:{
                      activable:dCapacite.vague.effets.activable,
                      raw:dCapacite.vague.effets.raw,
                      custom:dCapacite.vague.effets.custom,
                      liste:listEffects(dCapacite.vague.effets, allEffects, dCapacite.vague.effets?.chargeur ?? null),
                      chargeur:dCapacite.vague.effets?.chargeur ?? null
                    }
                  }
                },
                {
                  _id:i._id,
                  name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.SALVE.Label'),
                  type:'armure',
                  raw:'cea_salve',
                  system:{
                    subCapaciteName:'salve',
                    capacite:true,
                    noRack:true,
                    type:'distance',
                    portee:dCapacite.salve.portee,
                    degats:dCapacite.salve.degats,
                    violence:dCapacite.salve.violence,
                    effets:{
                      activable:dCapacite.salve.effets.activable,
                      raw:dCapacite.salve.effets.raw,
                      custom:dCapacite.salve.effets.custom,
                      liste:listEffects(dCapacite.salve.effets, allEffects, dCapacite.salve.effets?.chargeur ?? null),
                      chargeur:dCapacite.salve.effets?.chargeur ?? null
                    }
                  }
                },
                {
                  _id:i._id,
                  name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.RAYON.Label'),
                  type:'armure',
                  raw:'cea_rayon',
                  system:{
                    subCapaciteName:'rayon',
                    capacite:true,
                    noRack:true,
                    type:'distance',
                    portee:dCapacite.rayon.portee,
                    degats:dCapacite.rayon.degats,
                    violence:dCapacite.rayon.violence,
                    effets:{
                      activable:dCapacite.rayon.effets.activable,
                      raw:dCapacite.rayon.effets.raw,
                      custom:dCapacite.rayon.effets.custom,
                      liste:listEffects(dCapacite.rayon.effets, allEffects, dCapacite.rayon.effets?.chargeur ?? null),
                      chargeur:dCapacite.rayon.effets?.chargeur ?? null
                    }
                  }
                });

                armesContactEquipee.push({
                  _id:i._id,
                  name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.VAGUE.Label'),
                  type:'armure',
                  raw:'cea_vague',
                  system:{
                    subCapaciteName:'vague',
                    capacite:true,
                    noRack:true,
                    type:'contact',
                    portee:dCapacite.vague.portee,
                    degats:dCapacite.vague.degats,
                    violence:dCapacite.vague.violence,
                    effets:{
                      activable:dCapacite.vague.effets.activable,
                      raw:dCapacite.vague.effets.raw,
                      custom:dCapacite.vague.effets.custom,
                      liste:listEffects(dCapacite.vague.effets, allEffects, dCapacite.vague.effets?.chargeur ?? null),
                      chargeur:dCapacite.vague.effets?.chargeur ?? null
                    }
                  }
                },
                {
                  _id:i._id,
                  name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.SALVE.Label'),
                  type:'armure',
                  raw:'cea_salve',
                  system:{
                    subCapaciteName:'salve',
                    capacite:true,
                    noRack:true,
                    type:'contact',
                    portee:dCapacite.salve.portee,
                    degats:dCapacite.salve.degats,
                    violence:dCapacite.salve.violence,
                    effets:{
                      activable:dCapacite.salve.effets.activable,
                      raw:dCapacite.salve.effets.raw,
                      custom:dCapacite.salve.effets.custom,
                      liste:listEffects(dCapacite.salve.effets, allEffects, dCapacite.salve.effets?.chargeur ?? null),
                      chargeur:dCapacite.salve.effets?.chargeur ?? null
                    }
                  }
                },
                {
                  _id:i._id,
                  name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.RAYON.Label'),
                  type:'armure',
                  raw:'cea_rayon',
                  system:{
                    subCapaciteName:'rayon',
                    capacite:true,
                    noRack:true,
                    type:'contact',
                    portee:dCapacite.rayon.portee,
                    degats:dCapacite.rayon.degats,
                    violence:dCapacite.rayon.violence,
                    effets:{
                      activable:dCapacite.rayon.effets.activable,
                      raw:dCapacite.rayon.effets.raw,
                      custom:dCapacite.rayon.effets.custom,
                      liste:listEffects(dCapacite.rayon.effets, allEffects, dCapacite.rayon.effets?.chargeur ?? null),
                      chargeur:dCapacite.rayon.effets?.chargeur ?? null
                    }
                  }
                });
                break;

              case 'morph':
                if(dCapacite?.active?.polymorphieLame ?? false) {
                  armesContactEquipee.push({
                    _id:i._id,
                    name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Lame')}`,
                    type:'armure',
                    raw:'morph_lame',
                    system:{
                      subCapaciteName:'lame',
                      capacite:true,
                      noRack:true,
                      type:'contact',
                      portee:dCapacite.polymorphie.lame.portee,
                      degats:dCapacite.polymorphie.lame.degats,
                      violence:dCapacite.polymorphie.lame.violence,
                      effets:{
                        activable:dCapacite.polymorphie.lame.effets.activable,
                        raw:dCapacite.polymorphie.lame.effets.raw,
                        custom:dCapacite.polymorphie.lame.effets.custom,
                        liste:listEffects(dCapacite.polymorphie.lame.effets, allEffects, dCapacite.polymorphie.lame.effets?.chargeur ?? null),
                        chargeur:dCapacite.polymorphie.lame.effets?.chargeur ?? null,
                        chargeur2:dCapacite.polymorphie.lame.effets?.chargeur2 ?? null
                      }
                    }
                  });
                }

                if(dCapacite?.active?.polymorphieLame2 ?? false) {
                  armesContactEquipee.push({
                    _id:i._id,
                    name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Lame')} 2`,
                    type:'armure',
                    raw:'morph_lame2',
                    system:{
                      subCapaciteName:'lame2',
                      capacite:true,
                      noRack:true,
                      type:'contact',
                      portee:dCapacite.polymorphie.lame.portee,
                      degats:dCapacite.polymorphie.lame.degats,
                      violence:dCapacite.polymorphie.lame.violence,
                      effets:{
                        activable:dCapacite.polymorphie.lame.effets.activable,
                        raw:dCapacite.polymorphie.lame.effets.raw,
                        custom:dCapacite.polymorphie.lame.effets.custom,
                        liste:listEffects(dCapacite.polymorphie.lame.effets, allEffects, dCapacite.polymorphie.lame.effets?.chargeur2 ?? null, true),
                        chargeur:dCapacite.polymorphie.lame.effets?.chargeur ?? null,
                        chargeur2:dCapacite.polymorphie.lame.effets?.chargeur2 ?? null
                      }
                    }
                  });
                }

                if(dCapacite?.active?.polymorphieGriffe ?? false) {
                  armesContactEquipee.push({
                    _id:i._id,
                    name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Griffe')}`,
                    type:'armure',
                    raw:'morph_griffe',
                    system:{
                      subCapaciteName:'griffe',
                      capacite:true,
                      noRack:true,
                      type:'contact',
                      portee:dCapacite.polymorphie.griffe.portee,
                      degats:dCapacite.polymorphie.griffe.degats,
                      violence:dCapacite.polymorphie.griffe.violence,
                      effets:{
                        activable:dCapacite.polymorphie.griffe.effets.activable,
                        raw:dCapacite.polymorphie.griffe.effets.raw,
                        custom:dCapacite.polymorphie.griffe.effets.custom,
                        liste:listEffects(dCapacite.polymorphie.griffe.effets, allEffects, dCapacite.polymorphie.griffe.effets?.chargeur ?? null),
                        chargeur:dCapacite.polymorphie.griffe.effets?.chargeur ?? null,
                        chargeur2:dCapacite.polymorphie.griffe.effets?.chargeur2 ?? null
                      }
                    }
                  });
                }

                if(dCapacite?.active?.polymorphieGriffe2 ?? false) {
                  armesContactEquipee.push({
                    _id:i._id,
                    name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Griffe')} 2`,
                    type:'armure',
                    raw:'morph_griffe2',
                    system:{
                      subCapaciteName:'griffe2',
                      capacite:true,
                      noRack:true,
                      type:'contact',
                      portee:dCapacite.polymorphie.griffe.portee,
                      degats:dCapacite.polymorphie.griffe.degats,
                      violence:dCapacite.polymorphie.griffe.violence,
                      effets:{
                        activable:dCapacite.polymorphie.griffe.effets.activable,
                        raw:dCapacite.polymorphie.griffe.effets.raw,
                        custom:dCapacite.polymorphie.griffe.effets.custom,
                        liste:listEffects(dCapacite.polymorphie.griffe.effets, allEffects, dCapacite.polymorphie.griffe.effets?.chargeur2 ?? null, true),
                        chargeur:dCapacite.polymorphie.griffe.effets?.chargeur ?? null,
                        chargeur2:dCapacite.polymorphie.griffe.effets?.chargeur2 ?? null
                      }
                    }
                  });
                }

                if(dCapacite?.active?.polymorphieCanon ?? false) {
                  armesDistanceEquipee.push({
                    _id:i._id,
                    name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Canon')}`,
                    type:'armure',
                    raw:'morph_canon',
                    system:{
                      subCapaciteName:'canon',
                      capacite:true,
                      noRack:true,
                      type:'distance',
                      portee:dCapacite.polymorphie.canon.portee,
                      degats:dCapacite.polymorphie.canon.degats,
                      violence:dCapacite.polymorphie.canon.violence,
                      effets:{
                        activable:dCapacite.polymorphie.canon.effets.activable,
                        raw:dCapacite.polymorphie.canon.effets.raw,
                        custom:dCapacite.polymorphie.canon.effets.custom,
                        liste:listEffects(dCapacite.polymorphie.canon.effets, allEffects, dCapacite.polymorphie.canon.effets?.chargeur ?? null),
                        chargeur:dCapacite.polymorphie.canon.effets?.chargeur ?? null,
                        chargeur2:dCapacite.polymorphie.canon.effets?.chargeur2 ?? null
                      }
                    }
                  });
                }

                if(dCapacite?.active?.polymorphieCanon2 ?? false) {
                  armesDistanceEquipee.push({
                    _id:i._id,
                    name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Canon')} 2`,
                    type:'armure',
                    raw:'morph_canon2',
                    system:{
                      subCapaciteName:'canon2',
                      capacite:true,
                      noRack:true,
                      type:'distance',
                      portee:dCapacite.polymorphie.canon.portee,
                      degats:dCapacite.polymorphie.canon.degats,
                      violence:dCapacite.polymorphie.canon.violence,
                      effets:{
                        activable:dCapacite.polymorphie.canon.effets.activable,
                        raw:dCapacite.polymorphie.canon.effets.raw,
                        custom:dCapacite.polymorphie.canon.effets.custom,
                        liste:listEffects(dCapacite.polymorphie.canon.effets, allEffects, dCapacite.polymorphie.canon.effets?.chargeur2 ?? null, true),
                        chargeur:dCapacite.polymorphie.canon.effets?.chargeur ?? null,
                        chargeur2:dCapacite.polymorphie.canon.effets?.chargeur2 ?? null
                      }
                    }
                  });
                }
                break;
            }
          }
        }

        armureData = i;
      }

      // MODULE
      if (i.type === 'module') {
        const niveau = data.niveau.value;
        const isLion = data.isLion;
        const itemDataNiveau = data.niveau.actuel;
        const itemBonus = itemDataNiveau?.bonus || {has:false};
        const itemArme = itemDataNiveau?.arme || {has:false};
        const itemOD = itemDataNiveau?.overdrives || {has:false};
        const itemActive = data?.active?.base || false;

        if(itemBonus === false || itemArme === false || itemOD === false) continue;

        const itemErsatz = itemDataNiveau.ersatz;
        const eRogue = itemErsatz?.rogue ?? false;
        const eBard = itemErsatz?.bard ?? false;

        if(isLion) {
          lion.modules.push(i);

          if(data.permanent || itemActive) {
            if(itemBonus.has) {
              const iBArmure = itemBonus.armure;
              const iBCDF = itemBonus.champDeForce;
              const iBEnergie = itemBonus.energie;
              const iBDgts = itemBonus.degats;
              const iBDgtsVariable = iBDgts.variable;
              const iBViolence = itemBonus.violence;
              const iBViolenceVariable = iBViolence.variable;

              if(iBArmure.has) { lion.armure.bonus.push(iBArmure.value); }
              if(iBCDF.has) { lion.champDeForce.bonus.push(iBCDF.value); }
              if(iBEnergie.has) { lion.energie.bonus.push(iBEnergie.value); }
              if(iBDgts.has) {
                if(iBDgtsVariable.has) {
                  const dgtsDicePaliers = [0];
                  const dgtsFixePaliers = [0];

                  for(let i = iBDgtsVariable.min.dice;i <= iBDgtsVariable.max.dice;i++) {
                    dgtsDicePaliers.push(i);
                  }

                  for(let i = iBDgtsVariable.min.fixe;i <= iBDgtsVariable.max.fixe;i++) {
                    dgtsFixePaliers.push(i);
                  }

                  lion.bonusDgtsVariable[iBDgts.type].push({
                    label:i.name,
                    description:data.description,
                    selected:{
                      dice:iBDgtsVariable?.selected?.dice || 0,
                      fixe:iBDgtsVariable?.selected?.fixe || 0,
                      energie:{
                        dice:iBDgtsVariable?.selected?.energie.dice || 0,
                        fixe:iBDgtsVariable?.selected?.energie.fixe || 0,
                        paliers:{
                          dice:dgtsDicePaliers,
                          fixe:dgtsFixePaliers
                        }
                      }
                    },
                    min:{
                      dice:iBDgtsVariable.min.dice,
                      fixe:iBDgtsVariable.min.fixe
                    },
                    max:{
                      dice:iBDgtsVariable.max.dice,
                      fixe:iBDgtsVariable.max.fixe
                    }
                  });
                } else {
                  lion.bonusDgts[iBDgts.type].push({
                    label:i.name,
                    description:data.description,
                    dice:iBDgts.dice,
                    fixe:iBDgts.fixe
                  });
                }
              }
              if(iBViolence.has) {
                if(iBViolenceVariable.has) {
                  const violDicePaliers = [0];
                  const violFixePaliers = [0];

                  for(let i = iBViolenceVariable.min.dice;i <= iBViolenceVariable.max.dice;i++) {
                    violDicePaliers.push(i);
                  }

                  for(let i = iBViolenceVariable.min.fixe;i <= iBViolenceVariable.max.fixe;i++) {
                    violFixePaliers.push(i);
                  }

                  lion.bonusViolenceVariable[iBViolence.type].push({
                    label:i.name,
                    description:i.system.description,
                    selected:{
                      dice:iBViolenceVariable?.selected?.dice || 0,
                      fixe:iBViolenceVariable?.selected?.fixe || 0,
                      energie:{
                        dice:iBViolenceVariable?.selected?.energie.dice || 0,
                        fixe:iBViolenceVariable?.selected?.energie.fixe || 0,
                        paliers:{
                          dice:violDicePaliers,
                          fixe:violFixePaliers
                        }
                      }
                    },
                    min:{
                      dice:iBViolenceVariable.min.dice,
                      fixe:iBViolenceVariable.min.fixe
                    },
                    max:{
                      dice:iBViolenceVariable.max.dice,
                      fixe:iBViolenceVariable.max.fixe
                    }
                  });
                } else {
                  lion.bonusViolence[iBViolence.type].push({
                    label:i.name,
                    description:i.system.description,
                    dice:iBViolence.dice,
                    fixe:iBViolence.fixe
                  });
                }
              }
            }

            if(itemArme.has) {
              const moduleEffets = itemArme.effets;
              const moiduleEffetsRaw = moduleEffets.raw.concat(armorSpecialRaw);
              const moduleEffetsCustom = moduleEffets.custom.concat(armorSpecialCustom) || [];
              const moduleEffetsFinal = {
                raw:[...new Set(moiduleEffetsRaw)],
                custom:moduleEffetsCustom,
                liste:moduleEffets.liste
              };

              const moduleWpn = {
                _id:i._id,
                name:i.name,
                type:'module',
                system:{
                  noRack:true,
                  type:itemArme.type,
                  portee:itemArme.portee,
                  degats:itemArme.degats,
                  violence:itemArme.violence,
                  effets:{
                    raw:moiduleEffetsRaw,
                    custom:moduleEffetsCustom,
                    activable:moduleEffets.activable,
                    liste:moduleEffets.liste
                  }
                }
              }

              const bDefense = moduleEffetsFinal.raw.find(str => { if(str.includes('defense')) return str; });
              const bReaction = moduleEffetsFinal.raw.find(str => { if(str.includes('reaction')) return str; });

              if(bDefense !== undefined) lion.defense.bonus += +bDefense.split(' ')[1];
              if(bReaction !== undefined) lion.reaction.bonus += +bReaction.split(' ')[1];

              if(itemArme.type === 'contact') {
                const bMassive = itemArme.structurelles.raw.find(str => { if(str.includes('massive')) return true; });
                if(bMassive) lion.defense.malus += 1;

                lion.armes.contact.push(moduleWpn);
              }

              if(itemArme.type === 'distance') {
                lion.armes.distance.push(moduleWpn);
              }
            }
          }

          lion.slots.tete.used += i.system.slots.tete;
          lion.slots.brasGauche.used += i.system.slots.brasGauche;
          lion.slots.brasDroit.used += i.system.slots.brasDroit;
          lion.slots.torse.used += i.system.slots.torse;
          lion.slots.jambeDroite.used += i.system.slots.jambeDroite;
          lion.slots.jambeGauche.used += i.system.slots.jambeGauche;

        } else {
          if(itemDataNiveau.permanent || itemActive) {

            if(itemBonus.has) {
              const iBDgts = itemBonus.degats;
              const iBDgtsVariable = iBDgts.variable;
              const iBViolence = itemBonus.violence;
              const iBViolenceVariable = iBViolence.variable;

              if(iBDgts.has && onArmor) {
                if(iBDgtsVariable.has) {
                  const dgtsDicePaliers = [0];
                  const dgtsFixePaliers = [0];

                  for(let i = iBDgtsVariable.min.dice;i <= iBDgtsVariable.max.dice;i++) {
                    dgtsDicePaliers.push(i);
                  }

                  for(let i = iBDgtsVariable.min.fixe;i <= iBDgtsVariable.max.fixe;i++) {
                    dgtsFixePaliers.push(i);
                  }

                  moduleBonusDgtsVariable[iBDgts.type].push({
                    id:i._id,
                    label:i.name,
                    description:i.system.description,
                    selected:{
                      dice:iBDgtsVariable?.selected?.dice || 0,
                      fixe:iBDgtsVariable?.selected?.fixe || 0,
                      energie:{
                        dice:iBDgtsVariable?.selected?.energie.dice || 0,
                        fixe:iBDgtsVariable?.selected?.energie.fixe || 0,
                        paliers:{
                          dice:dgtsDicePaliers,
                          fixe:dgtsFixePaliers
                        }
                      }
                    },
                    min:{
                      dice:iBDgtsVariable.min.dice,
                      fixe:iBDgtsVariable.min.fixe
                    },
                    max:{
                      dice:iBDgtsVariable.max.dice,
                      fixe:iBDgtsVariable.max.fixe
                    },
                    energie:iBDgtsVariable.cout
                  });
                } else {
                  moduleBonusDgts[iBDgts.type].push({
                    id:i._id,
                    label:i.name,
                    description:i.system.description,
                    dice:iBDgts.dice,
                    fixe:iBDgts.fixe
                  });
                }
              }
              if(iBViolence.has && onArmor) {
                if(iBViolenceVariable.has) {
                  const violDicePaliers = [0];
                  const violFixePaliers = [0];

                  for(let i = iBViolenceVariable.min.dice;i <= iBViolenceVariable.max.dice;i++) {
                    violDicePaliers.push(i);
                  }

                  for(let i = iBViolenceVariable.min.fixe;i <= iBViolenceVariable.max.fixe;i++) {
                    violFixePaliers.push(i);
                  }

                  moduleBonusViolenceVariable[iBViolence.type].push({
                    id:i._id,
                    label:i.name,
                    description:i.system.description,
                    selected:{
                      dice:iBViolenceVariable?.selected?.dice || 0,
                      fixe:iBViolenceVariable?.selected?.fixe || 0,
                      energie:{
                        dice:iBViolenceVariable?.selected?.energie?.dice || 0,
                        fixe:iBViolenceVariable?.selected?.energie?.fixe || 0,
                        paliers:{
                          dice:violDicePaliers,
                          fixe:violFixePaliers
                        }
                      }
                    },
                    min:{
                      dice:iBViolenceVariable.min.dice,
                      fixe:iBViolenceVariable.min.fixe
                    },
                    max:{
                      dice:iBViolenceVariable.max.dice,
                      fixe:iBViolenceVariable.max.fixe
                    },
                    energie:iBViolenceVariable.cout
                  });
                } else {
                  moduleBonusViolence[iBViolence.type].push({
                    id:i._id,
                    label:i.name,
                    description:i.system.description,
                    dice:iBViolence.dice,
                    fixe:iBViolence.fixe
                  });
                }
              }
            }

            if(itemArme.has && onArmor) {
              const moduleArmeType = itemArme.type;
              const moduleEffets = itemArme.effets;
              const moduleEffetsRaw = moduleEffets.raw.concat(armorSpecialRaw);
              const moduleEffetsCustom = moduleEffets.custom.concat(armorSpecialCustom) || [];
              const moduleEffetsFinal = {
                raw:[...new Set(moduleEffetsRaw)],
                custom:moduleEffetsCustom,
                activable:moduleEffets.activable,
                liste:moduleEffets.liste,
                chargeur:moduleEffets?.chargeur,
              };

              const dataMunitions = itemArme?.optionsmunitions || {has:false};

              let degats = itemArme.degats;
              let violence = itemArme.violence;

              if(dataMunitions.has) {
                let actuel = dataMunitions.actuel;

                if(actuel === undefined) {
                  dataMunitions.actuel = "0";
                  actuel = "1";
                }

                for (let i = 0; i <= actuel; i++) {

                  const raw = dataMunitions.liste[i].raw.concat(armorSpecialRaw);
                  const custom = dataMunitions.liste[i].custom.concat(armorSpecialCustom);

                  data.niveau.actuel.arme.optionsmunitions.liste[i].raw = [...new Set(raw)];
                  data.niveau.actuel.arme.optionsmunitions.liste[i].custom = custom;
                }

                degats = dataMunitions.liste[actuel].degats;
                violence = dataMunitions.liste[actuel].violence;
              }

              const moduleWpn = {
                _id:i._id,
                name:i.name,
                type:'module',
                system:{
                  noRack:true,
                  type:itemArme.type,
                  portee:itemArme.portee,
                  degats:degats,
                  violence:violence,
                  optionsmunitions:dataMunitions,
                  effets:moduleEffetsFinal,
                  niveau:niveau,
                }
              };

              if(moduleArmeType === 'contact') {
                moduleWpn.system.structurelles = itemArme.structurelles;
                moduleWpn.system.ornementales = itemArme.ornementales;
              } else {
                moduleWpn.system.distance = itemArme.distance;
              }

              if(moduleArmeType === 'contact') { armesContactEquipee.push(moduleWpn); }

              if(itemArme.type === 'distance') {
                armesDistanceModules.push(moduleWpn);
                armesDistanceEquipee.push(moduleWpn);
              }
            }

            if(eRogue.has && onArmor) {
              moduleErsatz.rogue = eRogue;
              moduleErsatz.rogue.permanent = data.permanent;
              moduleErsatz.rogue.label = i.name;
              moduleErsatz.rogue._id = i._id;
              moduleErsatz.rogue.description = data.description;
            }

            if(eBard.has && onArmor) {
              moduleErsatz.bard = eBard;
              moduleErsatz.bard.permanent = data.permanent;
              moduleErsatz.bard.label = i.name;
              moduleErsatz.bard._id = i._id;
              moduleErsatz.bard.description = data.description;
            }
          }

          if(itemOD.has) overdrive.push(i);
          else module.push(i);
        }
      }

      // AVANTAGE.
      if (i.type === 'avantage') {
        if(data.type === 'standard') avantage.push(i);
        else if(data.type === 'ia') avantageIA.push(i);
      }

      // INCONVENIENT.
      if (i.type === 'inconvenient') {
        if(data.type === 'standard') inconvenient.push(i);
        else if(data.type === 'ia') inconvenientIA.push(i);
      }

      // MOTIVATION MINEURE
      if (i.type === 'motivationMineure') {
        motivationMineure.push(i);
      }

      // CAPACITE HEROIQUE
      if (i.type === 'capaciteheroique') {
        capaciteHeroique.push(i);
      }

      // CARTE HEROIQUE
      if (i.type === 'carteheroique') {
        carteHeroique.push(i);
      }

      // LANGUE
      if (i.type === 'langue') {
        langue.push(i);
      }

      // CONTACT
      if (i.type === 'contact') {
        contact.push(i);
      }

      // BLESSURE
      if (i.type === 'blessure') {
        blessures.push(i);
      }

      // TRAUMA
      if (i.type === 'trauma') trauma.push(i);

      // ARMES
      if (i.type === 'arme') {
        const type = data.type;
        const tourelle = data.tourelle;

        const armeRaw = data.effets.raw.concat(armorSpecialRaw);
        const armeCustom = data.effets.custom.concat(armorSpecialCustom);

        const armeE2Raw = data.effets2mains.raw.concat(armorSpecialRaw);
        const armeE2Custom = data.effets2mains.custom.concat(armorSpecialCustom);

        data.effets.raw = [...new Set(armeRaw)];
        data.effets.custom = armeCustom;

        data.effets2mains.raw = [...new Set(armeE2Raw)];
        data.effets2mains.custom = armeE2Custom;

        const dataMunitions = data.optionsmunitions,
              hasDM = dataMunitions?.has || false,
              actuelDM = Number(dataMunitions?.actuel || 0);

        if(hasDM && actuelDM != 0) {
          for (let i = 0; i <= dataMunitions.actuel; i++) {

            const raw = dataMunitions.liste[i].raw.concat(armorSpecialRaw);
            const custom = dataMunitions.liste[i].custom.concat(armorSpecialCustom);

            data.optionsmunitions.liste[i].raw = [...new Set(raw)];
            data.optionsmunitions.liste[i].custom = custom;
          }
        }

        const optionsmunitions = data.optionsmunitions.has;
        const munition = data.optionsmunitions.actuel;

        if(type === 'distance' && optionsmunitions === true) {
          data.degats.dice = data.optionsmunitions?.liste?.[munition]?.degats?.dice || 0;
          data.degats.fixe = data.optionsmunitions?.liste?.[munition]?.degats?.fixe || 0

          data.violence.dice = data.optionsmunitions?.liste?.[munition]?.violence?.dice || 0;
          data.violence.fixe = data.optionsmunitions?.liste?.[munition]?.violence?.fixe || 0;
        }

        if(wear !== 'ascension' && !tourelle.has) {
          const equipped = data?.equipped || false;
          const rack = data?.rack || false;

          const options2mains = data.options2mains.has;
          const main = data.options2mains.actuel;

          if(type === 'contact' && options2mains === true) {
            data.degats.dice = data?.options2mains?.[main]?.degats?.dice || 0;
            data.degats.fixe = data?.options2mains?.[main]?.degats?.fixe || 0;

            data.violence.dice = data?.options2mains?.[main]?.violence?.dice || 0;
            data.violence.fixe = data?.options2mains?.[main]?.violence?.fixe || 0;
          }

          if (type === 'contact' && equipped === false && rack === false) { armesContactArmoury.push(i); }
          if (type === 'contact' && equipped === false && rack === true) { armesContactRack.push(i); }
          else if (type === 'contact' && equipped === true) { armesContactEquipee.push(i); }
          else if (type === 'distance' && equipped === false && rack === false) { armesDistanceArmoury.push(i); }
          else if (type === 'distance' && equipped === false && rack === true) { armesDistanceRack.push(i); }
          else if (type === 'distance' && equipped === true) { armesDistanceEquipee.push(i); }
        }

        if(tourelle.has && type === 'distance') {
          armesTourelles.push(i);
        }
      }

      // ARMURE DE LEGENDE
      if (i.type === 'armurelegende') {
        armureLegendeData = i;
      }

      // ART
      if (i.type === 'art') {
        art = i;
      }

      // DISTINCTIONS
      if(i.type === 'distinction') distinctions.push(i);
      if(i.type === 'cyberware') {
        cyberware.push(i);

        if(!i.system.isActive) continue;

        if(i.system.arme.has) {
          const itemWpnCyberware = i.system.prepareForWpn(armorSpecialRaw, armorSpecialCustom);

          if(itemWpnCyberware.type === 'contact') armesContactEquipee.push(itemWpnCyberware.wpn);
          else if(itemWpnCyberware.type === 'distance') armesDistanceEquipee.push(itemWpnCyberware.wpn);
        }
      }
    }

    for(let i = 0;i < armesContactEquipee.length;i++) {
      armesContactEquipee[i].system.degats.module = {};
      armesContactEquipee[i].system.degats.module.fixe = moduleBonusDgts.contact;
      armesContactEquipee[i].system.degats.module.variable = moduleBonusDgtsVariable.contact;

      armesContactEquipee[i].system.violence.module = {};
      armesContactEquipee[i].system.violence.module.fixe = moduleBonusViolence.contact;
      armesContactEquipee[i].system.violence.module.variable = moduleBonusViolenceVariable.contact;
    };

    for(let i = 0;i < armesDistanceEquipee.length;i++) {
      armesDistanceEquipee[i].system.degats.module = {};
      armesDistanceEquipee[i].system.degats.module.fixe = moduleBonusDgts.distance;
      armesDistanceEquipee[i].system.degats.module.variable = moduleBonusDgtsVariable.distance;

      armesDistanceEquipee[i].system.violence.module = {};
      armesDistanceEquipee[i].system.violence.module.fixe = moduleBonusViolence.distance;
      armesDistanceEquipee[i].system.violence.module.variable = moduleBonusViolenceVariable.distance;
    };

    for (let [key, grenade] of Object.entries(system.combat.grenades.liste)){
      const effetsRaw = grenade.effets.raw.concat(armorSpecialRaw);
      const effetsCustom = grenade.effets.custom.concat(armorSpecialCustom);

      system.combat.grenades.liste[key].effets.raw = [...new Set(effetsRaw)];
      system.combat.grenades.liste[key].effets.custom = [...new Set(effetsCustom)];
    };

    for (let [kAI, armesimprovisees] of Object.entries(system.combat.armesimprovisees.liste)) {
      for (let [key, arme] of Object.entries(armesimprovisees.liste)) {
        arme.effets.raw = armorSpecialRaw;
        arme.effets.custom = armorSpecialCustom;
      }
    };

    const hasCompanions = armureData?.system?.capacites?.selected?.companions || false;

    if(hasCompanions) {
      const lionData = armureData.system.capacites.selected.companions.lion;
      const lionCDF = +lionData.champDeForce.base;
      const lionArmure = +lionData.armure.base;
      const lionDefense = +lionData.defense.base;
      const lionReaction = +lionData.reaction.base;
      const lionEnergie = +lionData.energie.base;
      const lionInitiativeB = +lionData.initiative.value;
      const lionSlots = lionData.slots;

      lionData.champDeForce.value = lionCDF+lion.champDeForce.bonus.reduce(sum)-lion.champDeForce.malus.reduce(sum);
      lionData.champDeForce.bonus = lion.champDeForce.bonus;
      lionData.champDeForce.malus = lion.champDeForce.malus;

      lionData.armure.value = lionArmure+lion.armure.bonus.reduce(sum)-lion.armure.malus.reduce(sum);
      lionData.armure.bonus = lion.armure.bonus;
      lionData.armure.malus = lion.armure.malus;

      lionData.defense.value = lionDefense+lion.defense.bonus.reduce(sum)-lion.defense.malus.reduce(sum);
      lionData.defense.bonus = lion.defense.bonus;
      lionData.defense.malus = lion.defense.malus;

      lionData.reaction.value = lionReaction+lion.reaction.bonus.reduce(sum)-lion.reaction.malus.reduce(sum);
      lionData.reaction.bonus = lion.reaction.bonus;
      lionData.reaction.malus = lion.reaction.malus;

      lionData.energie.value = lionEnergie+lion.energie.bonus.reduce(sum)-lion.energie.malus.reduce(sum);
      lionData.energie.bonus = lion.energie.bonus;
      lionData.energie.malus = lion.energie.malus;

      lionData.initiative.total = lionInitiativeB+lion.energie.bonus.reduce(sum)-lion.energie.malus.reduce(sum);
      lionData.initiative.bonus = lion.initiative.bonus;
      lionData.initiative.malus = lion.initiative.malus;

      lionData.bonusDgtsVariable = lion.bonusDgtsVariable;
      lionData.bonusDgts = lion.bonusDgts;

      lionData.bonusViolenceVariable = lion.bonusViolenceVariable;
      lionData.bonusViolence = lion.bonusViolence;

      lionData.modules = [];
      lionData.modules = lion.modules;

      if(!lionSlots) {
        lionData.slots = {};
        lionData.slots.tete = {
          used:0,
          value:8,
        };
        lionData.slots.torse = {
          used:0,
          value:10,
        };
        lionData.slots.brasGauche = {
          used:0,
          value:8,
        };
        lionData.slots.brasDroit = {
          used:0,
          value:8,
        };
        lionData.slots.jambeGauche = {
          used:0,
          value:8,
        };
        lionData.slots.jambeDroite = {
          used:0,
          value:8,
        };
      }

      lionData.slots.tete.used = lion.slots.tete.used;
      lionData.slots.torse.used = lion.slots.torse.used;
      lionData.slots.brasGauche.used = lion.slots.brasGauche.used;
      lionData.slots.brasDroit.used = lion.slots.brasDroit.used;
      lionData.slots.jambeDroite.used = lion.slots.jambeDroite.used;
      lionData.slots.jambeGauche.used = lion.slots.jambeGauche.used;
    };

    const hasCompanionsLegend = armureLegendeData?.system?.capacites?.selected?.companions || false;

    if(hasCompanionsLegend) {
      const lionData = armureLegendeData.system.capacites.selected.companions.lion;
      const lionCDF = +lionData.champDeForce.base;
      const lionArmure = +lionData.armure.base;
      const lionDefense = +lionData.defense.base;
      const lionReaction = +lionData.reaction.base;
      const lionEnergie = +lionData.energie.base;
      const lionInitiativeB = +lionData.initiative.value;
      const lionSlots = lionData.slots;

      lionData.champDeForce.value = lionCDF+lion.champDeForce.bonus.reduce(sum)-lion.champDeForce.malus.reduce(sum);
      lionData.champDeForce.bonus = lion.champDeForce.bonus;
      lionData.champDeForce.malus = lion.champDeForce.malus;

      lionData.armure.value = lionArmure+lion.armure.bonus.reduce(sum)-lion.armure.malus.reduce(sum);
      lionData.armure.bonus = lion.armure.bonus;
      lionData.armure.malus = lion.armure.malus;

      lionData.defense.value = lionDefense+lion.defense.bonus.reduce(sum)-lion.defense.malus.reduce(sum);
      lionData.defense.bonus = lion.defense.bonus;
      lionData.defense.malus = lion.defense.malus;

      lionData.reaction.value = lionReaction+lion.reaction.bonus.reduce(sum)-lion.reaction.malus.reduce(sum);
      lionData.reaction.bonus = lion.reaction.bonus;
      lionData.reaction.malus = lion.reaction.malus;

      lionData.energie.value = lionEnergie+lion.energie.bonus.reduce(sum)-lion.energie.malus.reduce(sum);
      lionData.energie.bonus = lion.energie.bonus;
      lionData.energie.malus = lion.energie.malus;

      lionData.initiative.total = lionInitiativeB+lion.energie.bonus.reduce(sum)-lion.energie.malus.reduce(sum);
      lionData.initiative.bonus = lion.initiative.bonus;
      lionData.initiative.malus = lion.initiative.malus;

      lionData.bonusDgtsVariable = lion.bonusDgtsVariable;
      lionData.bonusDgts = lion.bonusDgts;

      lionData.bonusViolenceVariable = lion.bonusViolenceVariable;
      lionData.bonusViolence = lion.bonusViolence;

      lionData.modules = [];
      lionData.modules = lion.modules;

      if(!lionSlots) {
        lionData.slots = {};
        lionData.slots.tete = {
          used:0,
          value:8,
        };
        lionData.slots.torse = {
          used:0,
          value:10,
        };
        lionData.slots.brasGauche = {
          used:0,
          value:8,
        };
        lionData.slots.brasDroit = {
          used:0,
          value:8,
        };
        lionData.slots.jambeGauche = {
          used:0,
          value:8,
        };
        lionData.slots.jambeDroite = {
          used:0,
          value:8,
        };
      }

      lionData.slots.tete.used = lion.slots.tete.used;
      lionData.slots.torse.used = lion.slots.torse.used;
      lionData.slots.brasGauche.used = lion.slots.brasGauche.used;
      lionData.slots.brasDroit.used = lion.slots.brasDroit.used;
      lionData.slots.jambeDroite.used = lion.slots.jambeDroite.used;
      lionData.slots.jambeGauche.used = lion.slots.jambeGauche.used;
    };

    if(capaciteultime) {
      const CUData = capaciteultime.system;

      if(CUData.type === 'active') {
        const CUAData = CUData.actives;

        if(CUAData.reaction > 0 || CUAData.defense > 0 ||
          CUAData.recuperation.PA || CUAData.recuperation.PS ||
          CUAData.recuperation.PE || (CUAData.jet.actif && CUAData.jet.isfixe) ||
          (CUAData.degats.actif && CUAData.degats.isfixe) ||
          (CUAData.violence.actif && CUAData.violence.isfixe) ||
          CUAData.effets.actif) CUData.actives.isActivable = true;
        else CUData.actives.isActivable = false;
      }
    }

    const hasContrecoups = armureData?.system?.special?.selected?.contrecoups;
    const hasWpnRestrictions = hasContrecoups !== undefined && hasContrecoups.armedistance.value === false ? true : false;
    const wpnWithRestrictions = hasWpnRestrictions ? armesDistanceModules : [];

    actorData.carteHeroique = carteHeroique;
    actorData.capaciteHeroique = capaciteHeroique;
    actorData.evolutionsCompanions = evolutionsCompanions;
    actorData.evolutionsAchetables = evolutionsAchetables;
    actorData.evolutionsAAcheter = evolutionsAAcheter;
    actorData.armureData = armureData;
    actorData.armureLegendeData = armureLegendeData;
    actorData.modules = module;
    actorData.modulespassifs = modulepassifs;
    actorData.moduleErsatz = moduleErsatz;
    actorData.moduleOD = overdrive;
    actorData.avantages = avantage;
    actorData.inconvenient = inconvenient;
    actorData.avantagesIA = avantageIA;
    actorData.inconvenientIA = inconvenientIA;
    actorData.motivationMineure = motivationMineure;
    actorData.langue = langue;
    actorData.contact = contact;
    actorData.blessure = blessures;
    actorData.trauma = trauma;
    actorData.longbow = longbow;
    actorData.armesContactEquipee = armesContactEquipee;
    actorData.armesContactRack = armesContactRack;
    actorData.armesContactArmoury = armesContactArmoury;
    actorData.cannotUseDistance = hasWpnRestrictions ? true : false;
    actorData.armesDistanceEquipee = hasWpnRestrictions ? wpnWithRestrictions : armesDistanceEquipee;
    actorData.armesDistanceRack = hasWpnRestrictions ? [] :armesDistanceRack;
    actorData.armesDistanceArmoury = hasWpnRestrictions ? [] :armesDistanceArmoury;
    actorData.armesTourelles = armesTourelles;
    actorData.art = art;
    actorData.distinctions = distinctions;
    actorData.capaciteultime = capaciteultime;
    actorData.cyberware = cyberware;
}