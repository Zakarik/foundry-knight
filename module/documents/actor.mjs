import {
  getDefaultImg,
} from "../helpers/common.mjs";
/**
 * Extend the base Actor document to support attributes and groups with a custom template creation dialog.
 * @extends {Actor}
 */
export class KnightActor extends Actor {

  /**
     * Create a new entity using provided input data
     * @override
     */
  static async create(data, context={}) {
    if (data.img === undefined) data.img = getDefaultImg(data.type);

    const createData = data instanceof Array ? data : [data];
    const created = await this.createDocuments(createData, context);
    return data instanceof Array ? created : created.shift();
  }

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();

    const version = game.version.split('.')[0];
    let effectStatus;
    let listEffect;

    /*if(window.EffectCounter !== undefined && this.permission === 3) {
      if(version < 11) {
        listEffect = this.getEmbeddedCollection('ActiveEffect').filter(e => e?.flags?.core?.statusId ?? undefined !== undefined);

        for(let eff of listEffect) {
          let statusId = eff.flags.core.statusId;
          let label = game.i18n.localize(CONFIG.statusEffects.find(se => se.id === statusId).label);
          let effect = existEffect(listEffect, label);
          let hasCounter = foundry.utils.getProperty(effect, "flags.statuscounter.counter");
          if(hasCounter !== undefined) {
            let effectCounter = hasCounter.value;
            let changes = [];

            switch(statusId) {
              case 'lumiere':
              case 'barrage':
                let keys = [`system.defense.malusValue`, `system.reaction.malusValue`]

                for(let k of keys) {
                  let v = effect.changes.find(v => v.key === k)?.value ?? undefined;

                  if(v !== undefined) {
                    if(Number(v) !== effectCounter) {
                      changes.push({
                        key: k,
                        mode: 2,
                        priority: 4,
                        value: effectCounter
                      });
                    }
                  }
                }
                break;
            }

            if(changes.length > 0) {
              updateEffect(this, [{
                "_id":effect._id,
                changes:changes
              }]);
            }
          }

        }
      }  else {
        effectStatus = foundry.utils.getProperty(this, "statuses");
        listEffect = this.getEmbeddedCollection('ActiveEffect');

        for(let eff of effectStatus) {
          let label = game.i18n.localize(CONFIG.statusEffects.find(se => se.id === eff).label);
          let effect = existEffect(listEffect, label);
          let hasCounter = foundry.utils.getProperty(effect, "flags.statuscounter.counter");
          if(hasCounter !== undefined) {
            let effectCounter = hasCounter.value;
            let changes = [];

            switch(eff) {
              case 'lumiere':
              case 'barrage':
                let keys = [`system.defense.malusValue`, `system.reaction.malusValue`]

                for(let k of keys) {
                  let v = effect.changes.find(v => v.key === k)?.value ?? undefined;

                  if(v !== undefined) {
                    if(Number(v) !== effectCounter) {
                      changes.push({
                        key: k,
                        mode: 2,
                        priority: 4,
                        value: effectCounter
                      });
                    }
                  }
                }
                break;
            }

            if(changes.length > 0) {
              updateEffect(this, [{
                "_id":effect._id,
                changes:changes
              }]);
            }
          }

        }
      }
    }*/
  }

  prepareDerivedData() {
    const actorData = this;

    //this._prepareKnightData(actorData);
  }

}