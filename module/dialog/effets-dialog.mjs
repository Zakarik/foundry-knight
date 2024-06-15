/**
 * Effets dialog
 * @extends {Application}
 */
export class KnightEffetsDialog extends FormApplication {
  constructor(object={}, options={}) {
  super(options);
      this.object.actor = object.actor;
      this.object.id = object.item;
      this.object.raw = object?.raw === undefined ? [] : object.raw
      this.object.isToken = object?.isToken || false;
      this.object.token = object?.token || null;
      this.object.custom = object?.custom === undefined ? [] : object.custom;
      this.object.toUpdate = object.toUpdate;
      this.object.aspects = object.aspects;
      this.object.typeEffets = object.typeEffets;
      this.object.maxEffets = object.maxEffets;
      this.object.data = {
        custom:{
          nom:'',
          description:'Description',
          attaque:{
            reussite:0,
            jet:0,
            carac:{
              fixe:'',
              labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe"),
              odInclusFixe:false,
              jet:'',
              labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusJet"),
              odInclusJet:false
            },
            aspect:{
              fixe:'',
              labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe"),
              aeInclusFixe:false,
              jet:'',
              labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusJet"),
              aeInclusJet:false
            },
            conditionnel:{
              has:false,
              label:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.Nocondition"),
              condition:''
            }
          },
          degats:{
            fixe:0,
            jet:0,
            carac:{
              fixe:'',
              labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe"),
              odInclusFixe:false,
              jet:'',
              labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusJet"),
              odInclusJet:false
            },
            aspect:{
              fixe:'',
              labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe"),
              aeInclusFixe:false,
              jet:'',
              labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusJet"),
              aeInclusJet:false
            },
            conditionnel:{
              has:false,
              label:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.Nocondition"),
              condition:''
            }
          },
          violence:{
            fixe:0,
            jet:0,
            carac:{
              fixe:'',
              labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe"),
              odInclusFixe:false,
              jet:'',
              labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusJet"),
              odInclusJet:false
            },
            aspect:{
              fixe:'',
              labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe"),
              aeInclusFixe:false,
              jet:'',
              labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusJet"),
              aeInclusJet:false
            },
            conditionnel:{
              has:false,
              label:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.Nocondition"),
              condition:''
            }
          },
          other:{
            cdf:0
          }
        }
      },
      this.object.title = object.title
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
        template: "systems/knight/templates/dialog/effets-sheet.html",
        classes: ["dialog", "knight", "effetsDialog"],
        title: "",
        width: 700,
        height: 500,
        resizable: true,
        closeOnSubmit: false,
        submitOnClose: false,
        submitOnChange: true,
    });
  }

  async getData(options = null) {
    const tEffets = this.object.typeEffets;
    const possibles = CONFIG.KNIGHT.effets;
    const distance = CONFIG.KNIGHT.AMELIORATIONS.distance;
    const structurelles = CONFIG.KNIGHT.AMELIORATIONS.structurelles;
    const ornements = CONFIG.KNIGHT.AMELIORATIONS.ornementales;
    const raw = this.object?.raw || [];
    const custom = this.object?.custom || [];
    const liste = [];
    let ePossibles = [];

    if(tEffets === undefined || tEffets === 'effets') {
      for (let [key, effet] of Object.entries(possibles)){
        if(!raw.includes(key) || effet.double) {
          ePossibles.push({
            key:key,
            double:effet.double,
            name:game.i18n.localize(effet.label),
            description:game.i18n.localize(CONFIG.KNIGHT.effets[key].description),
            max:effet.max
          });
        }
      }

      for(let n = 0;n < raw.length;n++) {
        const split = raw[n].split(" ");
        const secondSplit = split[0].split("<space>");
        const name = game.i18n.localize(CONFIG.KNIGHT.effets[secondSplit[0]].label);
        const sub = split[1];
        const other = Object.values(secondSplit);
        let complet = name;

        if(other.length > 1) {
          other.splice(0, 1);
          complet += ` ${other.join(" ").replace("<space>", " ")}`;
        }

        if(sub != undefined) { complet += " "+sub; }

        liste.push({
          id:n,
          name:complet,
          description:game.i18n.localize(CONFIG.KNIGHT.effets[secondSplit[0]].description),
          custom:false
        });
      }

      for(let n = 0;n < custom.length;n++) {
        liste.push({
          id:n,
          name:custom[n].label,
          description:custom[n].description,
          custom:true
        });
      }
    }

    if(tEffets === 'distance') {
      for (let [key, effet] of Object.entries(distance)){
        if(!raw.includes(key) || effet.double) {
          ePossibles.push({
            key:key,
            double:effet.double,
            text:effet.text,
            placeholder:game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[key].placeholder),
            name:game.i18n.localize(effet.label),
            description:game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[key].description)
          });
        }
      }

      for(let n = 0;n < raw.length;n++) {
        const split = raw[n].split(" ");
        const secondSplit = split[0].split("<space>");
        const name = game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[secondSplit[0]].label);
        const sub = split[1];
        const other = Object.values(secondSplit);
        let complet = name;

        if(other.length > 1) {
          other.splice(0, 1);
          complet += ` ${other.join(" ").replace("<space>", " ")}`;
        }

        if(sub != undefined) { complet += " "+sub; }

        liste.push({
          id:n,
          name:complet,
          description:game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[secondSplit[0]].description),
          custom:false
        });
      }

      for(let n = 0;n < custom.length;n++) {
        liste.push({
          id:n,
          name:custom[n].label,
          description:custom[n].description,
          custom:true
        });
      }
    }

    if(tEffets === 'structurelles') {
      for (let [key, effet] of Object.entries(structurelles)){
        if(!raw.includes(key) || effet.double) {
          ePossibles.push({
            key:key,
            double:effet.double,
            name:game.i18n.localize(effet.label),
            description:game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[key].description)
          });
        }
      }

      for(let n = 0;n < raw.length;n++) {
        const split = raw[n].split(" ");
        const secondSplit = split[0].split("<space>");
        const name = game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[secondSplit[0]].label);
        const sub = split[1];
        const other = Object.values(secondSplit);
        let complet = name;

        if(other.length > 1) {
          other.splice(0, 1);
          complet += ` ${other.join(" ").replace("<space>", " ")}`;
        }

        if(sub != undefined) { complet += " "+sub; }

        liste.push({
          id:n,
          name:complet,
          description:game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[secondSplit[0]].description),
          custom:false
        });
      }

      for(let n = 0;n < custom.length;n++) {
        liste.push({
          id:n,
          name:custom[n].label,
          description:custom[n].description,
          custom:true
        });
      }
    }

    if(tEffets === 'ornementales') {
      for (let [key, effet] of Object.entries(ornements)){
        if(!raw.includes(key) || effet.double) {
          ePossibles.push({
            key:key,
            double:effet.double,
            name:game.i18n.localize(effet.label),
            description:game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.ornementales[key].description)
          });
        }
      }

      for(let n = 0;n < raw.length;n++) {
        const split = raw[n].split(" ");
        const secondSplit = split[0].split("<space>");
        const name = game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.ornementales[secondSplit[0]].label);
        const sub = split[1];
        const other = Object.values(secondSplit);
        let complet = name;

        if(other.length > 1) {
          other.splice(0, 1);
          complet += ` ${other.join(" ").replace("<space>", " ")}`;
        }

        if(sub != undefined) { complet += " "+sub; }

        liste.push({
          id:n,
          name:complet,
          description:game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.ornementales[secondSplit[0]].description),
          custom:false
        });
      }

      for(let n = 0;n < custom.length;n++) {
        liste.push({
          id:n,
          name:custom[n].label,
          description:custom[n].description,
          custom:true
        });
      }
    }

    function _sortByName(x, y){
      if (x.name.toLowerCase() < y.name.toLowerCase()) {return -1;}
      if (x.name.toLowerCase() > y.name.toLowerCase()) {return 1;}
      return 0;
    }

    liste.sort(_sortByName);

    this.options.title = this.object.title;

    return {
        ...super.getData(options),
        cssClass:this.options.classes.join(" "),
        object: {
          actor:this.object.actor,
          id:this.object.id,
          raw:this.object.raw,
          custom:this.object.custom,
          toUpdate:this.object.toUpdate,
          aspects:this.object.aspects,
          typeEffets:this.object.typeEffets,
          maxEffets:this.object.maxEffets,
          data:{
            liste:liste,
            ePossibles:ePossibles,
            custom:this.object.data.custom
          },
          title:""
        },
        options: this.options,
        title: this.title
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find('img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents(".effetsDialog").width() / 2;
      let position = "";
      let borderRadius = "border-top-right-radius";

      if($(ev.currentTarget).parent().position().left > width) {
        position = "right";
        borderRadius = "border-top-right-radius";
      } else {
        position = "left";
        borderRadius = "border-top-left-radius";
      }

      span.width($(html).width()/2).css(position, "0px").css(borderRadius, "0px").toggle("display");
      $(ev.currentTarget).toggleClass("clicked");
    });

    if (!this.isEditable) {
      return;
    }

    html.find("button.valider").click(async ev => {
      ev.preventDefault();
      ev.stopPropagation();

      let objectToUpdate;

      const actor = this.object.actor;
      const item = this.object.id;
      const isToken = this.object.isToken;
      const token = this.object.token;

      if(item === null && !isToken) objectToUpdate = game.actors.get(actor);
      else if(item == null && token !== null) objectToUpdate = token;
      else if(!isToken) {
        if(actor === null) objectToUpdate = game.items.get(item);
        else if(game.actors.get(actor) !== undefined) objectToUpdate = game.actors.get(actor).items.get(item);
      }
      else if(token !== null) objectToUpdate = token.items.get(item);

      if(objectToUpdate === undefined && actor === null) {
        for(let g of game.packs) {
          const get = g.get(item);

          if(get !== undefined) {
            objectToUpdate = get;
            break;
          }
        }
      } else if(objectToUpdate === undefined && actor !== null) {
        for(let g of game.packs) {
          const get = g.get(actor);

          if(get !== undefined) {
            objectToUpdate = get.items.get(item);
            break;
          }
        }
      }

      if(objectToUpdate === undefined) return;

      const update = {
        [`${this.object.toUpdate}.raw`]:this.object.raw,
        [`${this.object.toUpdate}.custom`]:this.object.custom
      }

      objectToUpdate.update(update);

      await this.close({ submit: true, force: true });
    });

    html.find("button.annuler").click(async ev => {
      ev.preventDefault();
      ev.stopPropagation();

      await this.close({ submit: false, force: true });
    });

    html.find('a.add').click(ev => {
      const countEffets = this.object.raw.length;

      if(this.object.maxEffets !== undefined) {
        if(countEffets === this.object.maxEffets) return;
      }

      const label = $(ev.currentTarget).data("label");
      const double = $(ev.currentTarget).data("double") || false;
      const text = $(ev.currentTarget).data("text") || false;
      let raw = this.object.raw;
      let complet = "";

      if(raw === "") { this.object.raw = []; }

      complet = label;

      if(text) { complet += `<space>(${html.find('input.text'+label).val().replace(" ", "<space>")})`; }
      if(double) { complet += " "+html.find('input.double'+label).val(); }

      this.object.raw.push(complet);

      this.render();
    });

    html.find('.effetCustom button.ajouter').click(ev => {
      ev.preventDefault();
      ev.stopPropagation();
      const custom = this.object.custom === undefined ? [] : this.object.custom;
      const dataCustom = this.object.data.custom;

      custom.push({
        label:dataCustom.nom === undefined || dataCustom.nom === "" ? game.i18n.localize("KNIGHT.AUTRE.NonNomme") : dataCustom.nom,
        description:dataCustom.description === undefined ? '' : dataCustom.description,
        attaque:{
          reussite:dataCustom.attaque.reussite === undefined ? 0 : dataCustom.attaque.reussite,
          jet:dataCustom.attaque.jet === undefined ? 0 : dataCustom.attaque.jet,
          carac:{
            labelFixe:dataCustom.attaque.carac?.labelFixe === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe") : dataCustom.attaque.carac.labelFixe,
            odInclusFixe:dataCustom.attaque.carac?.odInclusFixe === undefined ? false : dataCustom.attaque.carac.odInclusFixe,
            labelJet:dataCustom.attaque.carac?.labelJet === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe") : dataCustom.attaque.carac.labelJet,
            odInclusJet:dataCustom.attaque.carac?.odInclusJet === undefined ? false : dataCustom.attaque.carac.odInclusJet,
            fixe:dataCustom.attaque.carac?.fixe === undefined ? '' : dataCustom.attaque.carac.fixe,
            jet:dataCustom.attaque.carac?.jet === undefined ? '' : dataCustom.attaque.carac.jet
          },
          aspect:{
            labelFixe:dataCustom.attaque.aspect?.labelFixe === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe") : dataCustom.attaque.aspect.labelFixe,
            odInclusFixe:dataCustom.attaque.aspect?.odInclusFixe === undefined ? false : dataCustom.attaque.aspect.aeInclusFixe,
            labelJet:dataCustom.attaque.aspect?.labelJet === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe") : dataCustom.attaque.aspect.labelJet,
            odInclusJet:dataCustom.attaque.aspect?.odInclusJet === undefined ? false : dataCustom.attaque.aspect.aeInclusJet,
            fixe:dataCustom.attaque.aspect?.fixe === undefined ? '' : dataCustom.attaque.aspect.fixe,
            jet:dataCustom.attaque.aspect?.jet === undefined ? '' : dataCustom.attaque.aspect.jet
          },
          conditionnel:{
            has:dataCustom.attaque.conditionnel.has === undefined ? false : dataCustom.attaque.conditionnel.has,
            condition:dataCustom.attaque.conditionnel.condition === undefined ? '' : dataCustom.attaque.conditionnel.condition
          },
        },
        degats:{
          fixe:dataCustom.degats.fixe === undefined ? 0 : dataCustom.degats.fixe,
          jet:dataCustom.degats.jet === undefined ? 0 : dataCustom.degats.jet,
          carac:{
            labelFixe:dataCustom.degats.carac?.labelFixe === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe") : dataCustom.degats.carac.labelFixe,
            odInclusFixe:dataCustom.degats.carac?.odInclusFixe === undefined ? false : dataCustom.degats.carac.odInclusFixe,
            labelJet:dataCustom.degats.carac?.labelJet === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe") : dataCustom.degats.carac.labelJet,
            odInclusJet:dataCustom.degats.carac?.odInclusJet === undefined ? false : dataCustom.degats.carac.odInclusJet,
            fixe:dataCustom.degats.carac?.fixe === undefined ? '' : dataCustom.degats.carac.fixe,
            jet:dataCustom.degats.carac?.jet === undefined ? '' : dataCustom.degats.carac.jet
          },
          aspect:{
            labelFixe:dataCustom.degats.aspect?.labelFixe === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe") : dataCustom.degats.aspect.labelFixe,
            odInclusFixe:dataCustom.degats.aspect?.odInclusFixe === undefined ? false : dataCustom.degats.aspect.aeInclusFixe,
            labelJet:dataCustom.degats.aspect?.labelJet === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe") : dataCustom.degats.aspect.labelJet,
            odInclusJet:dataCustom.degats.aspect?.odInclusJet === undefined ? false : dataCustom.degats.aspect.aeInclusJet,
            fixe:dataCustom.degats.aspect?.fixe === undefined ? '' : dataCustom.degats.aspect.fixe,
            jet:dataCustom.degats.aspect?.jet === undefined ? '' : dataCustom.degats.aspect.jet
          },
          conditionnel:{
            has:dataCustom.degats.conditionnel.has === undefined ? false : dataCustom.degats.conditionnel.has,
            condition:dataCustom.degats.conditionnel.condition === undefined ? '' : dataCustom.degats.conditionnel.condition
          },
        },
        violence:{
          fixe:dataCustom.violence.fixe === undefined ? 0 : dataCustom.violence.fixe,
          jet:dataCustom.violence.jet === undefined ? 0 : dataCustom.violence.jet,
          carac:{
            labelFixe:dataCustom.violence.carac?.labelFixe === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe") : dataCustom.violence.carac.labelFixe,
            odInclusFixe:dataCustom.violence.carac?.odInclusFixe === undefined ? false : dataCustom.violence.carac.odInclusFixe,
            labelJet:dataCustom.violence.carac?.labelJet === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe") : dataCustom.violence.carac.labelJet,
            odInclusJet:dataCustom.violence.carac?.odInclusJet === undefined ? false : dataCustom.violence.carac.odInclusJet,
            fixe:dataCustom.violence.carac?.fixe === undefined ? '' : dataCustom.violence.carac.fixe,
            jet:dataCustom.violence.carac?.jet === undefined ? '' : dataCustom.violence.carac.jet
          },
          aspect:{
            labelFixe:dataCustom.violence.aspect?.labelFixe === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe") : dataCustom.violence.aspect.labelFixe,
            odInclusFixe:dataCustom.violence.aspect?.odInclusFixe === undefined ? false : dataCustom.violence.aspect.aeInclusFixe,
            labelJet:dataCustom.violence.aspect?.labelJet === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe") : dataCustom.violence.aspect.labelJet,
            odInclusJet:dataCustom.violence.aspect?.odInclusJet === undefined ? false : dataCustom.violence.aspect.aeInclusJet,
            fixe:dataCustom.violence.aspect?.fixe === undefined ? '' : dataCustom.violence.aspect.fixe,
            jet:dataCustom.violence.aspect?.jet === undefined ? '' : dataCustom.violence.aspect.jet
          },
          conditionnel:{
            has:dataCustom.violence.conditionnel.has === undefined ? false : dataCustom.violence.conditionnel.has,
            condition:dataCustom.violence.conditionnel.condition === undefined ? '' : dataCustom.violence.conditionnel.condition
          },
        },
        other:{
          cdf:dataCustom.other.cdf === undefined ? 0 : dataCustom.other.cdf,
        }
      })

      this.object.custom = custom;
      this.object.data.custom = {
        nom:'',
        description:'',
        attaque:{
          reussite:0,
          jet:0,
          carac:{
            labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe"),
            labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusJet"),
            odInclusFixe:false,
            odInclusJet:false,
            fixe:'',
            jet:''
          },
          aspect:{
            labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe"),
            labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusJet"),
            odInclusFixe:false,
            odInclusJet:false,
            fixe:'',
            jet:''
          },
          conditionnel:{
            label:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.Nocondition"),
            has:false,
            condition:''
          },
        },
        degats:{
          fixe:0,
          jet:0,
          carac:{
            labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe"),
            labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusJet"),
            odInclusFixe:false,
            odInclusJet:false,
            fixe:'',
            jet:''
          },
          aspect:{
            labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe"),
            labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusJet"),
            odInclusFixe:false,
            odInclusJet:false,
            fixe:'',
            jet:''
          },
          conditionnel:{
            label:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.Nocondition"),
            has:false,
            condition:''
          },
        },
        violence:{
          fixe:0,
          jet:0,
          carac:{
            labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe"),
            labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusJet"),
            odInclusFixe:false,
            odInclusJet:false,
            fixe:'',
            jet:''
          },
          aspect:{
            labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe"),
            labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusJet"),
            odInclusFixe:false,
            odInclusJet:false,
            fixe:'',
            jet:''
          },
          conditionnel:{
            label:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.Nocondition"),
            has:false,
            condition:''
          },
        },
        other:{
          cdf:0,
        }
      };

      this.render();
    });

    html.find('.effetCustom button.update').click(ev => {
      ev.preventDefault();
      ev.stopPropagation();
      const custom = this.object.custom === undefined ? [] : this.object.custom;
      const dataCustom = this.object.data.custom;
      const index = dataCustom.index;
      const isExist = custom?.[index] || false;

      if(!isExist) return;

      custom[index] = {
        label:dataCustom.nom === undefined || dataCustom.nom === "" ? game.i18n.localize("KNIGHT.AUTRE.NonNomme") : dataCustom.nom,
        description:dataCustom.description === undefined ? '' : dataCustom.description,
        attaque:{
          reussite:dataCustom.attaque.reussite === undefined ? 0 : dataCustom.attaque.reussite,
          jet:dataCustom.attaque.jet === undefined ? 0 : dataCustom.attaque.jet,
          carac:{
            labelFixe:dataCustom.attaque.carac?.labelFixe === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe") : dataCustom.attaque.carac.labelFixe,
            odInclusFixe:dataCustom.attaque.carac?.odInclusFixe === undefined ? false : dataCustom.attaque.carac.odInclusFixe,
            labelJet:dataCustom.attaque.carac?.labelJet === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe") : dataCustom.attaque.carac.labelJet,
            odInclusJet:dataCustom.attaque.carac?.odInclusJet === undefined ? false : dataCustom.attaque.carac.odInclusJet,
            fixe:dataCustom.attaque.carac?.fixe === undefined ? '' : dataCustom.attaque.carac.fixe,
            jet:dataCustom.attaque.carac?.jet === undefined ? '' : dataCustom.attaque.carac.jet
          },
          aspect:{
            labelFixe:dataCustom.attaque.aspect?.labelFixe === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe") : dataCustom.attaque.aspect.labelFixe,
            odInclusFixe:dataCustom.attaque.aspect?.odInclusFixe === undefined ? false : dataCustom.attaque.aspect.aeInclusFixe,
            labelJet:dataCustom.attaque.aspect?.labelJet === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe") : dataCustom.attaque.aspect.labelJet,
            odInclusJet:dataCustom.attaque.aspect?.odInclusJet === undefined ? false : dataCustom.attaque.aspect.aeInclusJet,
            fixe:dataCustom.attaque.aspect?.fixe === undefined ? '' : dataCustom.attaque.aspect.fixe,
            jet:dataCustom.attaque.aspect?.jet === undefined ? '' : dataCustom.attaque.aspect.jet
          },
          conditionnel:{
            has:dataCustom.attaque.conditionnel.has === undefined ? false : dataCustom.attaque.conditionnel.has,
            condition:dataCustom.attaque.conditionnel.condition === undefined ? '' : dataCustom.attaque.conditionnel.condition
          },
        },
        degats:{
          fixe:dataCustom.degats.fixe === undefined ? 0 : dataCustom.degats.fixe,
          jet:dataCustom.degats.jet === undefined ? 0 : dataCustom.degats.jet,
          carac:{
            labelFixe:dataCustom.degats.carac?.labelFixe === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe") : dataCustom.degats.carac.labelFixe,
            odInclusFixe:dataCustom.degats.carac?.odInclusFixe === undefined ? false : dataCustom.degats.carac.odInclusFixe,
            labelJet:dataCustom.degats.carac?.labelJet === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe") : dataCustom.degats.carac.labelJet,
            odInclusJet:dataCustom.degats.carac?.odInclusJet === undefined ? false : dataCustom.degats.carac.odInclusJet,
            fixe:dataCustom.degats.carac?.fixe === undefined ? '' : dataCustom.degats.carac.fixe,
            jet:dataCustom.degats.carac?.jet === undefined ? '' : dataCustom.degats.carac.jet
          },
          aspect:{
            labelFixe:dataCustom.degats.aspect?.labelFixe === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe") : dataCustom.degats.aspect.labelFixe,
            odInclusFixe:dataCustom.degats.aspect?.odInclusFixe === undefined ? false : dataCustom.degats.aspect.aeInclusFixe,
            labelJet:dataCustom.degats.aspect?.labelJet === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe") : dataCustom.degats.aspect.labelJet,
            odInclusJet:dataCustom.degats.aspect?.odInclusJet === undefined ? false : dataCustom.degats.aspect.aeInclusJet,
            fixe:dataCustom.degats.aspect?.fixe === undefined ? '' : dataCustom.degats.aspect.fixe,
            jet:dataCustom.degats.aspect?.jet === undefined ? '' : dataCustom.degats.aspect.jet
          },
          conditionnel:{
            has:dataCustom.degats.conditionnel.has === undefined ? false : dataCustom.degats.conditionnel.has,
            condition:dataCustom.degats.conditionnel.condition === undefined ? '' : dataCustom.degats.conditionnel.condition
          },
        },
        violence:{
          fixe:dataCustom.violence.fixe === undefined ? 0 : dataCustom.violence.fixe,
          jet:dataCustom.violence.jet === undefined ? 0 : dataCustom.violence.jet,
          carac:{
            labelFixe:dataCustom.violence.carac?.labelFixe === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe") : dataCustom.violence.carac.labelFixe,
            odInclusFixe:dataCustom.violence.carac?.odInclusFixe === undefined ? false : dataCustom.violence.carac.odInclusFixe,
            labelJet:dataCustom.violence.carac?.labelJet === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe") : dataCustom.violence.carac.labelJet,
            odInclusJet:dataCustom.violence.carac?.odInclusJet === undefined ? false : dataCustom.violence.carac.odInclusJet,
            fixe:dataCustom.violence.carac?.fixe === undefined ? '' : dataCustom.violence.carac.fixe,
            jet:dataCustom.violence.carac?.jet === undefined ? '' : dataCustom.violence.carac.jet
          },
          aspect:{
            labelFixe:dataCustom.violence.aspect?.labelFixe === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe") : dataCustom.violence.aspect.labelFixe,
            odInclusFixe:dataCustom.violence.aspect?.odInclusFixe === undefined ? false : dataCustom.violence.aspect.aeInclusFixe,
            labelJet:dataCustom.violence.aspect?.labelJet === undefined ? game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe") : dataCustom.violence.aspect.labelJet,
            odInclusJet:dataCustom.violence.aspect?.odInclusJet === undefined ? false : dataCustom.violence.aspect.aeInclusJet,
            fixe:dataCustom.violence.aspect?.fixe === undefined ? '' : dataCustom.violence.aspect.fixe,
            jet:dataCustom.violence.aspect?.jet === undefined ? '' : dataCustom.violence.aspect.jet
          },
          conditionnel:{
            has:dataCustom.violence.conditionnel.has === undefined ? false : dataCustom.violence.conditionnel.has,
            condition:dataCustom.violence.conditionnel.condition === undefined ? '' : dataCustom.violence.conditionnel.condition
          },
        },
        other:{
          cdf:dataCustom.other.cdf === undefined ? 0 : dataCustom.other.cdf,
        }
      };

      this.object.custom = custom;
      this.object.data.custom = {
        nom:'',
        description:'',
        attaque:{
          reussite:0,
          jet:0,
          carac:{
            labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe"),
            labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusJet"),
            odInclusFixe:false,
            odInclusJet:false,
            fixe:'',
            jet:''
          },
          aspect:{
            labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe"),
            labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusJet"),
            odInclusFixe:false,
            odInclusJet:false,
            fixe:'',
            jet:''
          },
          conditionnel:{
            label:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.Nocondition"),
            has:false,
            condition:''
          },
        },
        degats:{
          fixe:0,
          jet:0,
          carac:{
            labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe"),
            labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusJet"),
            odInclusFixe:false,
            odInclusJet:false,
            fixe:'',
            jet:''
          },
          aspect:{
            labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe"),
            labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusJet"),
            odInclusFixe:false,
            odInclusJet:false,
            fixe:'',
            jet:''
          },
          conditionnel:{
            label:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.Nocondition"),
            has:false,
            condition:''
          },
        },
        violence:{
          fixe:0,
          jet:0,
          carac:{
            labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe"),
            labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusJet"),
            odInclusFixe:false,
            odInclusJet:false,
            fixe:'',
            jet:''
          },
          aspect:{
            labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe"),
            labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusJet"),
            odInclusFixe:false,
            odInclusJet:false,
            fixe:'',
            jet:''
          },
          conditionnel:{
            label:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.Nocondition"),
            has:false,
            condition:''
          },
        },
        other:{
          cdf:0,
        }
      };

      this.render();
    });

    html.find('.effetCustom button.supprimer').click(ev => {
      this.object.data.custom = {
        edit:false,
        index:0,
        nom:'',
        description:'',
        attaque:{
          reussite:0,
          jet:0,
          carac:{
            labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe"),
            labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusJet"),
            odInclusFixe:false,
            odInclusJet:false,
            fixe:'',
            jet:''
          },
          aspect:{
            labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe"),
            labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusJet"),
            odInclusFixe:false,
            odInclusJet:false,
            fixe:'',
            jet:''
          },
          conditionnel:{
            label:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.Nocondition"),
            has:false,
            condition:''
          },
        },
        degats:{
          fixe:0,
          jet:0,
          carac:{
            labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe"),
            labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusJet"),
            odInclusFixe:false,
            odInclusJet:false,
            fixe:'',
            jet:''
          },
          aspect:{
            labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe"),
            labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusJet"),
            odInclusFixe:false,
            odInclusJet:false,
            fixe:'',
            jet:''
          },
          conditionnel:{
            label:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.Nocondition"),
            has:false,
            condition:''
          },
        },
        violence:{
          fixe:0,
          jet:0,
          carac:{
            labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe"),
            labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusJet"),
            odInclusFixe:false,
            odInclusJet:false,
            fixe:'',
            jet:''
          },
          aspect:{
            labelFixe:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe"),
            labelJet:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusJet"),
            odInclusFixe:false,
            odInclusJet:false,
            fixe:'',
            jet:''
          },
          conditionnel:{
            label:game.i18n.localize("KNIGHT.EFFETS.CUSTOM.Nocondition"),
            has:false,
            condition:''
          },
        },
      };

      this.render();
    });

    html.find('.effetCustom select').change(ev => {
      ev.preventDefault();
      ev.stopPropagation();
      const type = $(ev.currentTarget).data("type");
      const subtype = $(ev.currentTarget).data("subtype");
      const isPnj = $(ev.currentTarget).data("pnj");
      const val = $(ev.currentTarget).val();

      if(isPnj) {
        this.object.data.custom[type].aspect[subtype] = val;
      } else {
        this.object.data.custom[type].carac[subtype] = val;
      }

      if(val === '' && subtype === 'fixe' && !isPnj) {
        this.object.data.custom[type].carac.odInclusFixe = false;
        this.object.data.custom[type].carac.labelFixe = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe");
      }

      if(val === '' && subtype === 'jet' && !isPnj) {
        this.object.data.custom[type].carac.odInclusJet = false;
        this.object.data.custom[type].carac.labelJet = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusJet");
      }

      if(val === '' && subtype === 'fixe' && isPnj) {
        this.object.data.custom[type].aspect.odInclusFixe = false;
        this.object.data.custom[type].aspect.labelFixe = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe");
      }

      if(val === '' && subtype === 'jet' && isPnj) {
        this.object.data.custom[type].aspect.odInclusJet = false;
        this.object.data.custom[type].aspect.labelJet = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusJet");
      }

      this.render();
    });

    html.find('.effetCustom button.unselected').click(ev => {
      ev.preventDefault();
      ev.stopPropagation();
      const type = $(ev.currentTarget).data("type");
      const subtype = $(ev.currentTarget).data("subtype");
      const data = this.object.data.custom[type];

      if(subtype === 'conditionnel') {
        data[subtype].has = true;
        data[subtype].label = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.Condition");
      } else if(subtype === 'odInclusJet' && data.carac.jet !== '') {
        data.carac[subtype] = true;
        data.carac.labelJet = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.OdInclusJet");
      } else if(subtype === 'odInclusFixe' && data.carac.fixe !== '') {
        data.carac[subtype] = true;
        data.carac.labelFixe = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.OdInclusFixe");
      } else if(subtype === 'aeInclusJet' && data.aspect.jet !== '') {
        data.aspect[subtype] = true;
        data.aspect.labelJet = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.AeInclusJet");
      } else if(subtype === 'aeInclusFixe' && data.aspect.fixe !== '') {
        data.aspect[subtype] = true;
        data.aspect.labelFixe = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.AeInclusFixe");
      }

      this.render();
    });

    html.find('.effetCustom button.selected').click(ev => {
      ev.preventDefault();
      ev.stopPropagation();
      const type = $(ev.currentTarget).data("type");
      const subtype = $(ev.currentTarget).data("subtype");
      const data = this.object.data.custom[type];

      if(subtype === 'conditionnel') {
        this.object.data.custom[type][subtype].has = false;
        this.object.data.custom[type][subtype].label = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.Nocondition");
      } else if(subtype === 'odInclusJet' && data.carac.jet !== '') {
        this.object.data.custom[type].carac[subtype] = false;
        this.object.data.custom[type].carac.labelJet = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusJet");
      } else if(subtype === 'odInclusFixe' && data.carac.fixe !== '') {
        this.object.data.custom[type].carac[subtype] = false;
        this.object.data.custom[type].carac.labelFixe = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe");
      } else if(subtype === 'aeInclusJet' && data.aspect.jet !== '') {
        this.object.data.custom[type].aspect[subtype] = false;
        this.object.data.custom[type].aspect.labelJet = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusJet");
      } else if(subtype === 'aeInclusFixe' && data.aspect.fixe !== '') {
        this.object.data.custom[type].aspect[subtype] = false;
        this.object.data.custom[type].aspect.labelFixe = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe");
      }

      this.render();
    });

    html.find('img.delete').click(ev => {
      const index = $(ev.currentTarget).data("index");
      const custom = $(ev.currentTarget).data("custom");
      const customBase = this.object.custom === undefined ? [] : this.object.custom;

      const rawData = [].concat(this.object.raw);
      const customData = [].concat(customBase);

      if(!custom) {
        rawData.splice(index, 1);
        this.object.raw = rawData;
      } else {
        customData.splice(index, 1);
        this.object.custom = customData;
      }

      this.render();
    });

    html.find('img.edit').click(ev => {
      const index = $(ev.currentTarget).data("index");
      const data = this.object.custom[index];

      this.object.data.custom = {
        edit:true,
        index:index,
        nom:data.label,
        description:data.description,
        attaque:data.attaque,
        degats:data.degats,
        violence:data.violence,
        other:data.other,
      };

      this.render();
    });
  }

  async _render(force = false, options = {}) {
    return super._render(force, options);
}

  async close(options={}) {
    const states = Application.RENDER_STATES;
    if ( !options.force && ![states.RENDERED, states.ERROR].includes(this._state) ) return;

    // Trigger saving of the form
    const submit = options.submit ?? this.options.submitOnClose;

    if ( submit ) await this.submit({preventClose: true, preventRender: true});

    // Close any open FilePicker instances
    for ( let fp of this.filepickers ) {
      fp.close();
    }
    this.filepickers = [];

    // Close any open MCE editors
    for ( let ed of Object.values(this.editors) ) {
      if ( ed.mce ) ed.mce.destroy();
    }
    this.editors = {};

    // Close the application itself
    return super.close(options);
  }

  async _updateObject(event, formData) {
    this.object.data.custom = {
      edit:this.object.data.custom.edit,
      index:this.object.data.custom.index,
      nom:formData['custom.nom'],
      description:formData['custom.description'],
      attaque:{
        reussite:formData['custom.attaque.reussite'],
        jet:formData['custom.attaque.jet'],
        carac:{
          labelFixe:this.object.data.custom.attaque.carac.labelFixe,
          odInclusFixe:this.object.data.custom.attaque.carac.odInclusFixe,
          labelJet:this.object.data.custom.attaque.carac.labelJet,
          odInclusJet:this.object.data.custom.attaque.carac.odInclusJet,
          fixe:this.object.data.custom.attaque.carac.fixe,
          jet:this.object.data.custom.attaque.carac.jet
        },
        aspect:{
          fixe:this.object.data.custom.attaque.aspect.fixe,
          labelFixe:this.object.data.custom.attaque.aspect.labelFixe,
          aeInclusFixe:this.object.data.custom.attaque.aspect.aeInclusFixe,
          jet:this.object.data.custom.attaque.aspect.jet,
          labelJet:this.object.data.custom.attaque.aspect.labelJet,
          aeInclusJet:this.object.data.custom.attaque.aspect.aeInclusJet
        },
        conditionnel:{
          label:this.object.data.custom.attaque.conditionnel.label,
          has:this.object.data.custom.attaque.conditionnel.has,
          condition:formData['custom.attaque.conditionnel.condition']
        },
      },
      degats:{
        fixe:formData['custom.degats.fixe'],
        jet:formData['custom.degats.jet'],
        carac:{
          labelFixe:this.object.data.custom.degats.carac.labelFixe,
          odInclusFixe:this.object.data.custom.degats.carac.odInclusFixe,
          labelJet:this.object.data.custom.degats.carac.labelJet,
          odInclusJet:this.object.data.custom.degats.carac.odInclusJet,
          fixe:this.object.data.custom.degats.carac.fixe,
          jet:this.object.data.custom.degats.carac.jet
        },
        aspect:{
          fixe:this.object.data.custom.degats.aspect.fixe,
          labelFixe:this.object.data.custom.degats.aspect.labelFixe,
          aeInclusFixe:this.object.data.custom.degats.aspect.aeInclusFixe,
          jet:this.object.data.custom.degats.aspect.jet,
          labelJet:this.object.data.custom.degats.aspect.labelJet,
          aeInclusJet:this.object.data.custom.degats.aspect.aeInclusJet
        },
        conditionnel:{
          label:this.object.data.custom.degats.conditionnel.label,
          has:this.object.data.custom.degats.conditionnel.has,
          condition:formData['custom.degats.conditionnel.condition']
        },
      },
      violence:{
        fixe:formData['custom.violence.fixe'],
        jet:formData['custom.violence.jet'],
        carac:{
          labelFixe:this.object.data.custom.violence.carac.labelFixe,
          odInclusFixe:this.object.data.custom.violence.carac.odInclusFixe,
          labelJet:this.object.data.custom.violence.carac.labelJet,
          odInclusJet:this.object.data.custom.violence.carac.odInclusJet,
          fixe:this.object.data.custom.violence.carac.fixe,
          jet:this.object.data.custom.violence.carac.jet
        },
        aspect:{
          fixe:this.object.data.custom.violence.aspect.fixe,
          labelFixe:this.object.data.custom.violence.aspect.labelFixe,
          aeInclusFixe:this.object.data.custom.violence.aspect.aeInclusFixe,
          jet:this.object.data.custom.violence.aspect.jet,
          labelJet:this.object.data.custom.violence.aspect.labelJet,
          aeInclusJet:this.object.data.custom.violence.aspect.aeInclusJet
        },
        conditionnel:{
          label:this.object.data.custom.violence.conditionnel.label,
          has:this.object.data.custom.violence.conditionnel.has,
          condition:formData['custom.violence.conditionnel.condition']
        },
      },
      other:{
        cdf:formData['custom.other.cdf']
      }
    };
  }
}
