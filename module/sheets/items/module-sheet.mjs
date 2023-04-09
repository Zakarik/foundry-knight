import {
  SortByLabel,
  listEffects,
  compareArrays
 } from "../../helpers/common.mjs";
import toggler from '../../helpers/toggler.js';
/**
 * @extends {ItemSheet}
 */
export class ModuleSheet extends ItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["knight", "sheet", "item", "module"],
      template: "systems/knight/templates/items/module-sheet.html",
      width: 700,
      height: 715,
      scrollY: [".attributes"],
      dragDrop: [{dragSelector: null, dropSelector: ".flexcol"}],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();


    const hasLvl = context.data.system?.niveau?.details ?? false;


    if(!hasLvl) {
      const update = {};
      const system = context.data.system;
      update[`system.niveau.value`] = 1;
      update[`system.niveau.max`] = 1;
      update[`system.niveau.liste`] = [1];
      update[`system.niveau.details`] = {
          "n1":{
              "permanent":system.permanent,
              "rarete":system.rarete,
              "prix":system.prix,
              "energie":system.energie,
              "activation":system.activation,
              "duree":system.duree,
              "portee":system.portee,
              "listes":{},
              "labels":{},
              "aspects":{
              "chair":{
                  "liste":{
                  "deplacement": {},
                  "force": {},
                  "endurance": {}
                  }
              },
              "bete":{
                  "liste":{
                  "hargne": {},
                  "combat": {},
                  "instinct": {}
                  }
              },
              "machine":{
                  "liste":{
                  "tir": {},
                  "savoir": {},
                  "technique": {}
                  }
              },
              "dame":{
                  "liste":{
                  "aura": {},
                  "parole": {},
                  "sangFroid": {}
                  }
              },
              "masque":{
                  "liste":{
                  "discretion": {},
                  "dexterite": {},
                  "perception": {}
                  }
              }
              },
              "bonus":system.bonus,
              "arme":system.arme,
              "overdrives":system.overdrives,
              "pnj":system.pnj,
              "ersatz":system.ersatz,
              "jetsimple":system.jetsimple,
              "textarea":system.textarea
          }
      };
      update[`system.-=permanent`] = null;
      update[`system.-=rarete`] = null;
      update[`system.-=prix`] = null;
      update[`system.-=energie`] = null;
      update[`system.-=activation`] = null;
      update[`system.-=duree`] = null;
      update[`system.-=portee`] = null;
      update[`system.-=labels`] = null;
      update[`system.-=aspects`] = null;
      update[`system.-=bonus`] = null;
      update[`system.-=arme`] = null;
      update[`system.-=overdrives`] = null;
      update[`system.-=pnj`] = null;
      update[`system.-=ersatz`] = null;
      update[`system.-=jetsimple`] = null;
      update[`system.-=textarea`] = null;

      this.item.update(update);
    } else {
      this._listeCategorie(context);
      this._listeRarete(context);
      this._translate(context);
      this._prepareEffetsListe(context);
      this._prepareEnergieTranslate(context);
    }

    if(this.item.isOwned) context.data.system.noEditLvl = true;

    context.systemData = context.data.system;

    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
	activateListeners(html) {
    super.activateListeners(html);

    toggler.init(this.id, html);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    html.find('button.nbreniveau').click(ev => {
      const target = $(ev.currentTarget);
      const value = target.data("value");
      const getData = this.getData().data.system.niveau;
      const data = getData.details;
      const length = Math.max(value, Object.keys(data).length);
      const update = {};
      const liste = [];

      for(let i = 1; i <= length;i++) {

        if(i > value) {
          update[`system.niveau.details.-=n${i}`] = null;
        } else {
          const isExist = data?.[`n${i}`] ?? false;

          liste.push(i);

          if(!isExist) {
            update[`system.niveau.details.n${i}`] = data.n1;
          }
        }
      }

      update['system.niveau.liste'] = liste;

      if(getData.value > value) update['system.niveau.value'] = value;

      this.item.update(update);
    });

    html.find('.button').click(ev => {
      const value = $(ev.currentTarget).data("value");
      const type = $(ev.currentTarget).data("type");
      const subtype = $(ev.currentTarget).data("subtype") || false;
      const name = $(ev.currentTarget).data("name") === 'array' ? $(ev.currentTarget).data("num") : $(ev.currentTarget).data("name") || false;
      const subname = $(ev.currentTarget).data("subname") || false;
      const special = $(ev.currentTarget).data("special") || false;
      const header = $(ev.currentTarget).parents(".niveaux");
      const key = header.data("key");

      let result = true;

      if(value) { result = false; }

      let update = {};

      if(subtype === false) {
        update = {
          system:{
            niveau:{
              details:{
                [key]:{
                  [type]:result
                }
              }
            }

          }
        };
      } else if(name === false) {
        update = {
          system:{
            niveau:{
              details:{
                [key]:{
                  [type]:{
                    [subtype]:result
                  }
                }
              }
            }
          }
        };
      } else if(subname === false) {
        update = {
          system:{
            niveau:{
              details:{
                [key]:{
                  [type]:{
                    [subtype]:{
                      [name]:result
                    }
                  }
                }
              }
            }
          }
        };
      } else if(special === false) {
        update = {
          system:{
            niveau:{
              details:{
                [key]:{
                  [type]:{
                    [subtype]:{
                      [name]:{
                        [subname]:result
                      }
                    }
                  }
                }
              }
            }
          }
        };
      } else {
        update = {
          system:{
            niveau:{
              details:{
                [key]:{
                  [type]:{
                    [subtype]:{
                      [name]:{
                        [subname]:{
                          [special]:result
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        };
      }

      this.item.update(update);
    });

    html.find('div.effets a.edit').click(async ev => {
      const stringPath = $(ev.currentTarget).data("path");
      const type = $(ev.currentTarget).data("type");
      let data = this.getData().data;
      let path = data;

      stringPath.split(".").forEach(function(key){
        path = path[key];

      });

      let label = '';

      switch(type) {
        case 'distance':
          label = label = `${this.object.name} : ${game.i18n.localize("KNIGHT.AMELIORATIONS.LABEL.Distance")}`
          break;

        case 'ornementales':
          label = `${this.object.name} : ${game.i18n.localize("KNIGHT.AMELIORATIONS.LABEL.Ornementales")}`
          break;

        case 'structurelles':
          label = `${this.object.name} : ${game.i18n.localize("KNIGHT.AMELIORATIONS.LABEL.Structurelles")}`
          break;

        default:
          label = `${this.object.name} : ${game.i18n.localize("KNIGHT.EFFETS.Edit")}`
          break;
      }

      await new game.knight.applications.KnightEffetsDialog({actor:this.actor?._id || null, item:this.item._id, isToken:this.item?.parent?.isToken || false, token:this.item?.parent || null, raw:path.raw, custom:path.custom, toUpdate:stringPath, aspects:CONFIG.KNIGHT.listCaracteristiques, typeEffets:type, title:label}).render(true);
    });

    html.find('img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents("div.baseW").width() / 2;
      const isW50 = $(ev.currentTarget).parents("div.effets").width();
      let position = "";
      let borderRadius = "border-top-right-radius";

      if(isW50 <= width) {
        if($(ev.currentTarget).parents("div.effets").position().left > width) {
          position = "right";
          borderRadius = "border-top-right-radius";
        } else {
          position = "left";
          borderRadius = "border-top-left-radius";
        }
      } else {
        if($(ev.currentTarget).parent().position().left > width) {
          position = "right";
          borderRadius = "border-top-right-radius";
        } else {
          position = "left";
          borderRadius = "border-top-left-radius";
        }
      }

      span.width($(html).width()/2).css(position, "0px").css(borderRadius, "0px").toggle("display");
      $(ev.currentTarget).toggleClass("clicked");
    });

    html.find('a.create').click(ev => {
      const type = $(ev.currentTarget).data("type");
      const id = $(ev.currentTarget).data("id");
      const data = this.getData().data.system;
      const pnj = data.pnj;
      const modele = pnj.modele;
      const header = $(ev.currentTarget).parents(".niveaux");
      const key = header.data("key");


      switch(type) {
        case 'pnj':
          const liste = pnj.liste;

          this.item.update({[`system.niveau.details.${key}.pnj.liste.${Object.keys(liste).length}`]:modele});
          break;

        case 'jetSpecifiques':
          const jModele = modele.jetSpecial.modele;
          const jListe = pnj.liste[id].jetSpecial.liste;

          this.item.update({[`system.niveau.details.${key}.pnj.liste.${id}.jetSpecial.liste.${Object.keys(jListe).length}`]:jModele});
          break;

        case 'armes':
          const aModele = modele.armes.modele;
          const aListe = pnj.liste[id].armes.liste;

          this.item.update({[`system.niveau.details.${key}.pnj.liste.${id}.armes.liste.${Object.keys(aListe).length}`]:aModele});
          break;
      };
    });

    html.find('a.delete').click(ev => {
      const type = $(ev.currentTarget).data("type");
      const nPnj = $(ev.currentTarget).data("pnj");
      const id = $(ev.currentTarget).data("id");
      const header = $(ev.currentTarget).parents(".niveaux");
      const key = header.data("key");

      switch(type) {
        case 'pnj':
          this.item.update({[`system.niveau.details.${key}.pnj.liste.-=${id}`]:null});
          break;

        case 'jetSpecifiques':
          this.item.update({[`system.niveau.details.${key}.pnj.liste.${nPnj}.jetSpecial.liste.-=${id}`]:null});
          break;

        case 'armes':
          this.item.update({[`system.niveau.details.${key}.pnj.liste.${nPnj}.armes.liste.-=${id}`]:null});
          break;
      };
    });

    html.find('select.typePNJ').change(ev => {
      const id = $(ev.currentTarget).data("id");
      const value = $(ev.currentTarget).val();
      const header = $(ev.currentTarget).parents(".niveaux");
      const key = header.data("key");

      const dice = value === 'bande' ? 0 : 3;
      const fixe = value === 'bande' ? 1 : 0;
      const update = {};
      update[`system.niveau.details.${key}.pnj.liste`] = {
        [id]:{initiative:{dice:dice, fixe:fixe}}
      };

      this.item.update(update);
    });

    html.find('input.dgtsF').change(ev => {
      const target = $(ev.currentTarget);
      const header = target.parents(".niveaux");
      const key = header.data("key");
      const value = target.val();

      if(target.hasClass("dgtsMax")) {
        html.find(`div.niveau_${key} input.dgtsMin`).val(value);
        html.find(`div.niveau_${key} input.dgtsFBase`).val(value);
      } else if(target.hasClass("dgtsMin")) {
        html.find(`div.niveau_${key} input.dgtsMax`).val(value);
        html.find(`div.niveau_${key} input.dgtsFBase`).val(value);
      } else if(target.hasClass("dgtsFBase")) {
        html.find(`div.niveau_${key} input.dgtsMin`).val(value);
        html.find(`div.niveau_${key} input.dgtsMax`).val(value);
      }
    });

    html.find('input.violenceF').change(ev => {
      const target = $(ev.currentTarget);
      const header = target.parents(".niveaux");
      const key = header.data("key");
      const value = target.val();

      if(target.hasClass("violenceMax")) {
        html.find(`div.niveau_${key} input.violenceMin`).val(value);
        html.find(`div.niveau_${key} input.violenceFBase`).val(value);
      } else if(target.hasClass("violenceMin")) {
        html.find(`div.niveau_${key} input.violenceMax`).val(value);
        html.find(`div.niveau_${key} input.violenceFBase`).val(value);
      } else if(target.hasClass("violenceFBase")) {
        html.find(`div.niveau_${key} input.violenceMin`).val(value);
        html.find(`div.niveau_${key} input.violenceMax`).val(value);
      }
    });

    html.find('input.dgtsD').change(ev => {
      const target = $(ev.currentTarget);
      const header = target.parents(".niveaux");
      const key = header.data("key");
      const value = target.val();

      html.find(`div.niveau_${key} input.dgtsDBase`).val(value);
    });

    html.find('input.violenceD').change(ev => {
      const target = $(ev.currentTarget);
      const header = target.parents(".niveaux");
      const key = header.data("key");
      const value = target.val();

      html.find(`div.niveau_${key} input.violenceDBase`).val(value);
    });

    html.find('textarea').blur(async ev => {
      const textarea = $(ev.currentTarget);
      const header = textarea.parents(".niveaux");
      const key = header.data("key");
      const type = textarea.data("type");
      const min = textarea.data("min");

      textarea.height(min);
      const height = ev.currentTarget.scrollHeight+1;

      textarea.height(Math.max(height, min));

      this.item.update({[`system.niveau.details.${key}.textarea.${type}`]:Math.max(height, min)});
    });
  }

  _listeCategorie(context) {
    const normal = CONFIG.KNIGHT.module.categorie.normal;
    const prestige = CONFIG.KNIGHT.module.categorie.prestige;
    const cat = [];
    const catObject = {};

    const niveaux = context.data.system.niveau.details;

    for (let [key, categorie] of Object.entries(normal)) {
      cat.push(
        {
          key:key,
          label:game.i18n.localize(categorie)
        }
      );
    }

    for(const niv in niveaux) {
      const data = niveaux[niv];

      if(data.rarete === 'prestige') {

        for (let [key, categorie] of Object.entries(prestige)) {
          cat.push(
            {
              key:key,
              label:game.i18n.localize(categorie)
            }
          );
        }
        break;
      }
    }

    cat.sort(SortByLabel);

    for (let i = 0;i < cat.length;i++) {
      catObject[cat[i].key] = {};
      catObject[cat[i].key] = cat[i].label;
    };

    context.data.system.listes.categorie = catObject;
  }

  _listeRarete(context) {
    const rare = CONFIG.KNIGHT.module.rarete;
    const rar = [];
    const rarObject = {};

    const niveaux = context.data.system.niveau.details;

    for (let [key, rarete] of Object.entries(rare)) {
      rar.push(
        {
          key:key,
          label:game.i18n.localize(rarete)
        }
      );
    }

    for(const niv in niveaux) {
      const data = niveaux[niv];

      for (let i = 0;i < rar.length;i++) {
        rarObject[rar[i].key] = {};
        rarObject[rar[i].key] = rar[i].label;
      };

      data.listes.rarete = rarObject;
    }
  }

  _translate(context) {
    const system = context.data.system;
    const niveaux = system.niveau.details;

    for(const niv in niveaux) {
      const data = niveaux[niv];

      data.label = niv.substring(2, 1);

      const duree = data.permanent;
      const bonus = data?.bonus?.has || false;
      const pnj = data.pnj;
      const armure = data?.bonus?.armure?.has || false;
      const champDeForce = data?.bonus?.champDeForce?.has || false;
      const energie = data?.bonus?.energie?.has || false;
      const degats = data?.bonus.degats;
      const violence = data?.bonus.violence;
      const arme = data.arme;
      const overdrives = data.overdrives;
      const bonusOverdrives = data.bonus.overdrives;
      const bonusGrenades = data.bonus.grenades;
      const ersatz = data.ersatz;
      const eRogue = ersatz.rogue;
      const eBard = ersatz.bard;
      const jetSimple = data.jetsimple;
      const effets = data.effets;

      const pHas = pnj?.has || false;
      const pLis = pnj?.liste?.length || 0;

      const dHas = degats?.has || false;
      const dVar = degats?.variable?.has ||false;

      const vHas = violence?.has || false;
      const vVar = violence?.variable?.has || false;

      const aHas = data?.arme?.has || false;
      const aDeg = arme?.degats?.variable?.has || false;
      const aVio = arme?.violence?.variable?.has || false;

      const oHas = overdrives?.has || false;

      const oBHas = bonusOverdrives?.has || false;

      const gBHas = bonusGrenades?.has || false;

      const eRHas = eRogue?.has || false;
      const eBHas = eBard?.has || false;

      const jSimple = jetSimple.has;

      const eHas = effets?.has || false;

      if(duree) { data.labels.duree = game.i18n.localize("KNIGHT.ITEMS.MODULE.DUREE.Permanent"); }
      else { data.labels.duree = game.i18n.localize("KNIGHT.ITEMS.MODULE.DUREE.NotPermanent"); }

      if(bonus) { data.labels.bonus = game.i18n.localize("KNIGHT.ITEMS.MODULE.BONUS.Has"); }
      else { data.labels.bonus = game.i18n.localize("KNIGHT.ITEMS.MODULE.BONUS.Hasnt"); }

      if(pHas) { data.labels.pnj = game.i18n.localize("KNIGHT.ITEMS.MODULE.PNJ.Has"); }
      else { data.labels.pnj = game.i18n.localize("KNIGHT.ITEMS.MODULE.PNJ.Hasnt"); }

      if(pLis > 1) { data.labels.pnjTitle = game.i18n.localize("KNIGHT.ITEMS.MODULE.PNJ.LabelP"); }
      else { data.labels.pnjTitle = game.i18n.localize("KNIGHT.ITEMS.MODULE.PNJ.LabelS"); }

      if(armure) { data.labels.armure = game.i18n.localize("KNIGHT.ITEMS.MODULE.ARMURE.Bonus"); }
      else { data.labels.armure = game.i18n.localize("KNIGHT.ITEMS.MODULE.ARMURE.NoBonus"); }

      if(champDeForce) { data.labels.champDeForce = game.i18n.localize("KNIGHT.ITEMS.MODULE.CDF.Bonus"); }
      else { data.labels.champDeForce = game.i18n.localize("KNIGHT.ITEMS.MODULE.CDF.NoBonus"); }

      if(energie) { data.labels.energie = game.i18n.localize("KNIGHT.ITEMS.MODULE.ENERGIE.Bonus"); }
      else { data.labels.energie = game.i18n.localize("KNIGHT.ITEMS.MODULE.ENERGIE.NoBonus"); }

      if(dHas) { data.labels.degatsBonus = game.i18n.localize("KNIGHT.ITEMS.MODULE.DEGATS.Bonus"); }
      else { data.labels.degatsBonus = game.i18n.localize("KNIGHT.ITEMS.MODULE.DEGATS.NoBonus"); }

      if(dVar) { data.labels.degatsVariable = game.i18n.localize("KNIGHT.ITEMS.MODULE.DEGATS.Variable"); }
      else { data.labels.degatsVariable = game.i18n.localize("KNIGHT.ITEMS.MODULE.DEGATS.NoVariable"); }

      if(vHas) { data.labels.violenceBonus = game.i18n.localize("KNIGHT.ITEMS.MODULE.VIOLENCE.Bonus"); }
      else { data.labels.violenceBonus = game.i18n.localize("KNIGHT.ITEMS.MODULE.VIOLENCE.NoBonus"); }

      if(vVar) { data.labels.violenceVariable = game.i18n.localize("KNIGHT.ITEMS.MODULE.VIOLENCE.Variable"); }
      else { data.labels.violenceVariable = game.i18n.localize("KNIGHT.ITEMS.MODULE.VIOLENCE.NoVariable"); }

      if(aHas) { data.labels.arme = game.i18n.localize("KNIGHT.ITEMS.MODULE.ARME.Has"); }
      else { data.labels.arme = game.i18n.localize("KNIGHT.ITEMS.MODULE.ARME.Hasnt"); }

      if(aDeg) { data.labels.armeDegatsVariable = game.i18n.localize("KNIGHT.ITEMS.MODULE.ARME.DEGATS.Variable"); }
      else { data.labels.armeDegatsVariable = game.i18n.localize("KNIGHT.ITEMS.MODULE.ARME.DEGATS.NoVariable"); }

      if(aVio) { data.labels.armeViolenceVariable = game.i18n.localize("KNIGHT.ITEMS.MODULE.ARME.VIOLENCE.Variable"); }
      else { data.labels.armeViolenceVariable = game.i18n.localize("KNIGHT.ITEMS.MODULE.ARME.VIOLENCE.NoVariable"); }

      if(oHas) { data.labels.overdrives = game.i18n.localize("KNIGHT.ITEMS.MODULE.OVERDRIVES.Has"); }
      else { data.labels.overdrives = game.i18n.localize("KNIGHT.ITEMS.MODULE.OVERDRIVES.Hasnt"); }

      if(oBHas) { data.labels.bonusOverdrives = game.i18n.localize("KNIGHT.ITEMS.MODULE.OVERDRIVES.Hasbonus"); }
      else { data.labels.bonusOverdrives = game.i18n.localize("KNIGHT.ITEMS.MODULE.OVERDRIVES.Hasntbonus"); }

      if(gBHas) { data.labels.bonusGrenades = game.i18n.localize("KNIGHT.ITEMS.MODULE.GRENADES.Has"); }
      else { data.labels.bonusGrenades = game.i18n.localize("KNIGHT.ITEMS.MODULE.GRENADES.Hasnt"); }

      if(eRHas) { data.labels.ersatzRogue = game.i18n.localize("KNIGHT.ITEMS.MODULE.ERSATZ.ROGUE.Has"); }
      else { data.labels.ersatzRogue = game.i18n.localize("KNIGHT.ITEMS.MODULE.ERSATZ.ROGUE.Hasnt"); }

      if(eBHas) { data.labels.ersatzBard = game.i18n.localize("KNIGHT.ITEMS.MODULE.ERSATZ.BARD.Has"); }
      else { data.labels.ersatzBard = game.i18n.localize("KNIGHT.ITEMS.MODULE.ERSATZ.BARD.Hasnt"); }

      if(jSimple) { data.labels.jetSimple = game.i18n.localize("KNIGHT.ITEMS.MODULE.JETSIMPLE.Has"); }
      else { data.labels.jetSimple = game.i18n.localize("KNIGHT.ITEMS.MODULE.JETSIMPLE.Hasnt"); }

      if(eHas) { data.labels.effets = game.i18n.localize("KNIGHT.ITEMS.MODULE.EFFETS.Has"); }
      else { data.labels.effets = game.i18n.localize("KNIGHT.ITEMS.MODULE.EFFETS.Hasnt"); }
    }
  }

  _prepareEffetsListe(context) {
    const system = context.data.system;
    const niveaux = system.niveau.details;

    for(const niv in niveaux) {
      const data = niveaux[niv];

      const beffets = data.effets || false;
      const effets = data.arme.effets || false;
      const distance = data.arme.distance || false;
      const structurelles = data.arme.structurelles || false;
      const ornementales = data.arme.ornementales || false;
      const effetsJetSimple = data.jetsimple.effets || false;
      const pnjListe = data.pnj.liste;

      if(beffets !== false) {
        const raw = beffets.raw;
        const custom = beffets.custom;
        const labelsE = CONFIG.KNIGHT.effets;

        beffets.liste = listEffects(raw, custom, labelsE);
      }

      if(effets !== false) {
        const raw = effets.raw;
        const custom = effets.custom;
        const labelsE = CONFIG.KNIGHT.effets;

        effets.liste = listEffects(raw, custom, labelsE);
      }

      if(distance !== false) {
        const raw = distance.raw;
        const custom = distance.custom;
        const labelsD = CONFIG.KNIGHT.AMELIORATIONS.distance;

        distance.liste = listEffects(raw, custom, labelsD);
      }

      if(structurelles !== false) {
        const raw = structurelles.raw;
        const custom = structurelles.custom;
        const labelsS = CONFIG.KNIGHT.AMELIORATIONS.structurelles;

        structurelles.liste = listEffects(raw, custom, labelsS);
      }

      if(ornementales !== false) {
        const raw = ornementales.raw;
        const custom = ornementales.custom;
        const labelsO = CONFIG.KNIGHT.AMELIORATIONS.structurelles;

        ornementales.liste = listEffects(raw, custom, labelsO);
      }

      if(effetsJetSimple !== false) {
        const raw = effetsJetSimple.raw;
        const custom = effetsJetSimple.custom;
        const labelsE = CONFIG.KNIGHT.effets;

        effetsJetSimple.liste = listEffects(raw, custom, labelsE);
      }

      for (let [key, pnj] of Object.entries(pnjListe)) {
        const pnjArmes = pnj?.armes?.liste ?? false;

        if(pnjArmes !== false) {
          for (let [kArme, arme] of Object.entries(pnjArmes)) {
            const rArme = arme.effets.raw;
            const cArme = arme.effets.custom;
            const labelsA = CONFIG.KNIGHT.effets;

            arme.effets.liste = listEffects(rArme, cArme, labelsA);
          }
        }
      }
    }

  }

  _prepareEnergieTranslate(context) {
    const system = context.data.system;
    const niveaux = system.niveau.details;
    const update = {};

    for(const niv in niveaux) {
      const data = niveaux[niv];
      const energie = data.energie;

      if(energie.tour.label === "") update["system.energie.tour.label"] = `${game.i18n.localize("KNIGHT.AUTRE.Tour")}`;
      if(energie.minute.label === "") update["system.energie.minute.label"] = `${game.i18n.localize("KNIGHT.AUTRE.Minute")}`;
    }

    if (!foundry.utils.isEmpty(update)) this.item.update(update);
  }
}
