const ArmeMixinSheet = (superclass) => class extends superclass {
    /** @inheritdoc */
    static DEFAULT_OPTIONS = {
        actions: {
          chargeurClick: this.#onChargeurClick,
          addMunitions: this.#onAddMunitions,
        }
    };

  /* -------------------------------------------- */

  static #onChargeurClick(event, target) {
    const data = target.dataset;
    const btn = target.closest(".btnChargeur");
    const typeBtn = data.typeBtn;
    const dataBtn = btn.dataset;
    const index = dataBtn.index;
    const type = dataBtn.type;
    const munition = dataBtn.munition;
    const pnj = dataBtn.pnj;
    const wpn = dataBtn.wpn;

    const item = this.item;

    if(!item) return;

    switch(typeBtn) {
      case 'plus':
        item.system.addMunition(index, type, munition, pnj, wpn);
        break;

      case 'minus':
        item.system.removeMunition(index, type, munition, pnj, wpn);
        break;
    }
  }

  static #onAddMunitions(event, target) {
    const tgt = target.dataset;
    const path = tgt.path;

    console.error(path);

    if(!path) return;

    const list = foundry.utils.getProperty(this.item, `system.${path}.liste`);
    const value = foundry.utils.getProperty(this.item, `system.${path}.value`);
    const length = Math.max(Object.entries(list).length, value);
    const update = {};

    for(let n = 0;n < length;n++) {
      const isExist = list?.[n];
      if(!isExist) {
        update[`system.optionsmunitions.liste.${n}`] = {
          nom:game.i18n.localize("KNIGHT.Nom"),
          degats:{
            dice:0,
            fixe:0
          },
          violence:{
            dice:0,
            fixe:0
          },
          raw:[],
          custom:[],
          liste:[]
        }
      } else if(isExist && n >= value) {
        update[`system.optionsmunitions.liste.-=${n}`] = null;
      }
    }

    this.item.update(update);
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
      super.activateListeners(html);


      html.find('img.info').click(ev => {
        const span = $(ev.currentTarget).siblings("span.hideInfo")
        const width = $(ev.currentTarget).parents("form.flexcol").width() / 2;
        const isW50 = $(ev.currentTarget).parents("div.effets").width();
        let position = "";
        let borderRadius = "border-top-right-radius";

        if(isW50 <= width) {
          if($(ev.currentTarget).parents("div.effets").position().left < width) {
            position = "right";
            borderRadius = "border-top-right-radius";
          } else {
            position = "left";
            borderRadius = "border-top-left-radius";
          }
        } else {
          if($(ev.currentTarget).parent().position().left < width) {
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

      // Everything below here is only needed if the sheet is editable
      if ( !this.isEditable ) return;

      html.find('input.dgtsF').change(async ev => {
        const target = $(ev.currentTarget);
        const path = target.data("path");
        const value = Number(target.val());
        let update = {};

        update[path] = value;

        await this.item.update(update);
      });
  }
}

export default ArmeMixinSheet;