
import { fields } from '../../utils/field-builder.mjs';

export default class KnightCompanionData extends foundry.abstract.DataModel {
  static get baseDefinition() {
    const aspects = CONFIG.KNIGHT.LIST.aspects;
    const listAspects = {};

    for(const a of aspects) {
        listAspects[a] = ["schema", {
            value:["num", { initial:0, nullable:false, integer:true }],
            min:["num", { initial:0, nullable:false, integer:true }],
            max:["num", { initial:0, nullable:false, integer:true }],
            ae:["num", { initial:0, nullable:false, integer:true }],
            aeMin:["num", { initial:0, nullable:false, integer:true }],
        }];
    }

    return {
        uuid:["str", {initial:"", nullable:false }],
        evolutions:["num", { initial:1, nullable:false, integer:true }],
        active:["str", {initial:"", blank:true, choices:{
            lion:"KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.LION.Label",
            wolf:"KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.Label",
            crow:"KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.CROW.Label",
        }}],
        lion:["schema", {
            points:["schema", {
                aspects:["num", { initial:5, nullable:false, integer:true }],
                ae:["num", { initial:2, nullable:false, integer:true }],
            }],
            aspects:foundry.utils.deepClone(listAspects),
        }],
        wolf:["schema", {
            points:["schema", {
                aspects:["num", { initial:3, nullable:false, integer:true }],
                ae:["num", { initial:1, nullable:false, integer:true }],
                configuration:["num", { initial:2, nullable:false, integer:true }],
            }],
            aspects:foundry.utils.deepClone(listAspects),
            configurations:["schema", {
                labor:["schema", {
                    label:["str", { initial:"", nullable:false, }],
                    value:["num", { initial:0, nullable:false, integer:true }],
                    min:["num", { initial:0, nullable:false, integer:true }],
                    max:["num", { initial:0, nullable:false, integer:true }],
                }],
                tech:["schema", {
                    label:["str", { initial:"", nullable:false, }],
                    value:["num", { initial:0, nullable:false, integer:true }],
                    min:["num", { initial:0, nullable:false, integer:true }],
                    max:["num", { initial:0, nullable:false, integer:true }],
                }],
                recon:["schema", {
                    label:["str", { initial:"", nullable:false, }],
                    value:["num", { initial:0, nullable:false, integer:true }],
                    min:["num", { initial:0, nullable:false, integer:true }],
                    max:["num", { initial:0, nullable:false, integer:true }],
                }],
                medic:["schema", {
                    label:["str", { initial:"", nullable:false, }],
                    value:["num", { initial:0, nullable:false, integer:true }],
                    min:["num", { initial:0, nullable:false, integer:true }],
                    max:["num", { initial:0, nullable:false, integer:true }],
                }],
                fighter:["schema", {
                    label:["str", { initial:"", nullable:false, }],
                    value:["num", { initial:0, nullable:false, integer:true }],
                    min:["num", { initial:0, nullable:false, integer:true }],
                    max:["num", { initial:0, nullable:false, integer:true }],
                }],
            }]
        }],
        crow:["schema", {
            points:["schema", {
                aspects:["num", { initial:2, nullable:false, integer:true }],
                ae:["num", { initial:0, nullable:false, integer:true }],
            }],
            aspects:foundry.utils.deepClone(listAspects),
        }],
    }
  }

  static defineSchema() {
    return fields(this.baseDefinition);
  }

  _initialize(...args) {
    super._initialize(...args);
    this._prepareTranslations();
    this._prepareValues();
  }

  get armor() {
    return fromUuid(this.uuid);
  }

  _prepareTranslations() {
    const wolf = this.wolf.configurations;

    for(const w in wolf) {
        Object.defineProperty(wolf[w], 'label', {
            value:`KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.${w.toUpperCase()}.Label`,
            writable:true,
            enumerable:true,
            configurable:true
        });
    }
  }

  async _prepareValues() {
    const armor = await this.armor;
    const data = new game.knight.utils.ArmureAPI(armor);
    const capacity = data.getCapacite('companions');

    if(!capacity) return;

    const lion = capacity.lion;
    const wolf = capacity.wolf;
    const crow = capacity.crow;

    for(const a in lion.aspects) {
        Object.defineProperty(this.lion.aspects[a], 'min', {
            value:lion.aspects[a].value,
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.lion.aspects[a], 'value', {
            value:lion.aspects[a].value,
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.lion.aspects[a], 'max', {
            value:lion.aspects[a].value+2,
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.lion.aspects[a], 'ae', {
            value:lion.aspects[a].ae,
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.lion.aspects[a], 'aeMin', {
            value:lion.aspects[a].ae,
            writable:true,
            enumerable:true,
            configurable:true
        });
    }

    for(const a in wolf.aspects) {
        Object.defineProperty(this.wolf.aspects[a], 'min', {
            value:wolf.aspects[a].value,
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.wolf.aspects[a], 'value', {
            value:wolf.aspects[a].value,
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.wolf.aspects[a], 'max', {
            value:wolf.aspects[a].value+2,
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.wolf.aspects[a], 'ae', {
            value:lion.aspects[a].ae,
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.wolf.aspects[a], 'aeMin', {
            value:wolf.aspects[a].ae,
            writable:true,
            enumerable:true,
            configurable:true
        });
    }

    for(const c in wolf.configurations) {
        Object.defineProperty(this.wolf.configurations[c], 'min', {
            value:wolf.configurations[c].niveau,
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.wolf.configurations[c], 'value', {
            value:wolf.configurations[c].niveau,
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.wolf.configurations[c], 'max', {
            value:wolf.configurations[c].niveau+1,
            writable:true,
            enumerable:true,
            configurable:true
        });
    }

    for(const a in crow.aspects) {
        Object.defineProperty(this.crow.aspects[a], 'min', {
            value:crow.aspects[a].value,
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.crow.aspects[a], 'value', {
            value:crow.aspects[a].value,
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.crow.aspects[a], 'max', {
            value:crow.aspects[a].value+2,
            writable:true,
            enumerable:true,
            configurable:true
        });
    }
  }

  async update(formData) {
    for(let f in formData) {
        const str = f.replace('system.', '');

        if (f.endsWith(".value")) {
            const min = str.replace('.value', '.min').replace('system.', '');
            const max = str.replace('.value', '.max').replace('system.', '');
            const getMin = foundry.utils.getProperty(this, min);
            const getMax = foundry.utils.getProperty(this, max);

            if(getMin) {
                if(formData[f] < getMin) formData[f] = getMin;
            }

            if(getMax) {
                if(formData[f] > getMax) formData[f] = getMax;
            }
        }

        foundry.utils.setProperty(this, str, formData[f]);
    }
  }
}