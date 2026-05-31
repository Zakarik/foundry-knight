import {
    getAllEffects,
} from "../../helpers/common.mjs";

import JsTogglerMixin from "../../sheets/bases/mixin-js-toggler.mjs";
import KnightEffetsData from "../models/effets-model.mjs";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class KnightEffetsDialog extends JsTogglerMixin(HandlebarsApplicationMixin(ApplicationV2)) {
  constructor(data={}, options={}) {
    super(options);
    this.document = new KnightEffetsData(data);

    const {
      uuid,
      raw,
      activable,
      maxEffets,
      type,
      name,
    } = data;

    this.data = {
      uuid,
      raw,
      activable,
      maxEffets,
      type,
      name,
    }
  }

  static DEFAULT_OPTIONS = {
    position: { width: 900, height: 500 },
    window: { resizable: true },
    classes: ["dialog", "knight", "effetsDialog"],
      form: {
          submitOnChange: true,
      },
  };

  static PARTS = {
    left: {
        template: "systems/knight/templates/dialog/parts/effects/left.hbs"
    },
    right: {
        template: "systems/knight/templates/dialog/parts/effects/right.hbs"
    },
  };

  #buildCustom() {
    const i18n = CONFIG.LIST.aspectsCaracteristiques;
    const attaque = [];
    const degats = [];
    const violence = [];
  }

  #buildAttaque(document, item, i18n) {
    const attaque = [];

    attaque.push({
      type:'h2',
      i18n:'KNIGHT.BONUS.Attaque',
    });

    attaque.push({
      type:'number',
      i18n:'KNIGHT.BONUS.Succes',
      name:'system.custom.attaque.reussite',
      value:document.custom.attaque.reussite,
      min:0,
    });

    attaque.push({
      type:'numberWithSpan',
      i18n:'KNIGHT.BONUS.Jet',
      span:'KNIGHT.JETS.Des-short',
      name:'system.custom.attaque.jet',
      value:document.custom.attaque.jet,
      min:0,
    });

    attaque.push({
      type:'select',
      i18n:'KNIGHT.EFFETS.CUSTOM.CaracFixe',
      name:'system.custom.attaque.carac.fixe',
      value:document.custom.attaque.carac.fixe,
      choices:document.schema.getField('custom.attaque.carac.fixe').choices.map(k => ({ key: k, label:i18n[k]  })),
    });

    attaque.push({
      type:'button',
      i18n:'KNIGHT.EFFETS.CUSTOM.OdInclusFixe',
      name:'system.custom.attaque.carac.odInclusFixe',
      value:document.custom.attaque.carac.odInclusFixe,
    });

    attaque.push({
      type:'select',
      i18n:'KNIGHT.EFFETS.CUSTOM.CaracJet',
      name:'system.custom.attaque.carac.jet',
      value:document.custom.attaque.carac.jet,
      choices:document.schema.getField('custom.attaque.carac.jet').choices.map(k => ({ key: k, label:i18n[k]  })),
    });

    attaque.push({
      type:'button',
      i18n:'KNIGHT.EFFETS.CUSTOM.OdInclusJet',
      name:'system.custom.attaque.carac.odInclusJet',
      value:document.custom.attaque.carac.odInclusJet,
    });

    attaque.push({
      type:'select',
      i18n:'KNIGHT.EFFETS.CUSTOM.AspectFixe',
      name:'system.custom.attaque.aspect.fixe',
      value:document.custom.attaque.aspect.fixe,
      choices:document.schema.getField('custom.attaque.aspect.fixe').choices.map(k => ({ key: k, label:i18n[k]  })),
    });

    attaque.push({
      type:'button',
      i18n:'KNIGHT.EFFETS.CUSTOM.AeInclusFixe',
      name:'system.custom.attaque.aspect.aeInclusFixe',
      value:document.custom.attaque.aspect.aeInclusFixe,
    });

    attaque.push({
      type:'select',
      i18n:'KNIGHT.EFFETS.CUSTOM.AspectJet',
      name:'system.custom.attaque.aspect.jet',
      value:document.custom.attaque.aspect.jet,
      choices:document.schema.getField('custom.attaque.aspect.jet').choices.map(k => ({ key: k, label:i18n[k]  })),
    });

    attaque.push({
      type:'button',
      i18n:'KNIGHT.EFFETS.CUSTOM.AeInclusJet',
      name:'system.custom.attaque.aspect.aeInclusJet',
      value:document.custom.attaque.aspect.aeInclusJet,
    });

    attaque.push({
      type:'button',
      i18n:'KNIGHT.EFFETS.CUSTOM.Condition',
      name:'system.custom.attaque.conditionnel.has',
      value:document.custom.attaque.conditionnel.has,
    });

    attaque.push({
      type:'textarea',
      name:'system.custom.attaque.conditionnel.condition',
      hide:document.custom.attaque.conditionnel.has,
      value:document.custom.attaque.conditionnel.condition,
    });
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const document = this.document;

    return {
      ...context,
      fields: document.schema.fields,
      system: document,
    };
  }
}