export class KnightCompendiumDialog extends FormApplication {
    /**
   * @param {Document} object                    A Document instance which should be managed by this form.
   * @param {DocumentSheetOptions} [options={}]  Optional configuration parameters for how the form behaves.
   */
  constructor(object, options={}) {
    super(object, options);
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
        classes: ["knightCompendium", "sheet", "compendium"],
        template: "systems/knight/templates/compendium.html",
        width: 920,
        height: 720,
        tabs: [
          {navSelector: ".sheet-tabs", contentSelector: ".body", initial: "armure"}
        ],
        dragDrop: [{dragSelector: [".draggable", ".item-list .item"], dropSelector: null}],
    });
  }

  async getData(options = {}) {
    const context = super.getData();
    const packs = game.packs.contents;
    const all = [];
    const armures = [];

    for(let p of packs) {
        if(p.visible) {
          const list = p.index.contents;

          for(let l of list) {
            const type = l.type;
            const uuid = l.uuid;
            const itm = 'Item';
            const name = l.name;
            let data = {};
            data = {
              uuid:uuid,
              type:itm,
              name:name
            }

            switch(type) {
              case 'armure':
                const rData = await this._getFromUuid(uuid);

                data['img'] = rData.img;
                data['PA'] = rData.system.armure.base;
                data['PE'] = rData.system.energie.base;
                data['CDF'] = rData.system.champDeForce.base;

                armures.push(data);
                break;
            }
          }
        }
    }

    context.object['armures'] = armures;

    return context.object;
  }

  activateListeners(html) {
    super.activateListeners(html);
  }

  /** @inheritdoc */
  async _onDragStart(event) {
    const li = event.currentTarget;
    if ( event.target.classList.contains("content-link") ) return;

    // Create drag data
    let dragData;

    // Owned Items
    if ( li.dataset.uuid ) {
        dragData = {
          uuid:li.dataset.uuid,
          type:li.dataset.type,
        };
    }

    // Active Effect
    if ( li.dataset.effectId ) {
      const effect = this.actor.effects.get(li.dataset.effectId);
      dragData = effect.toDragData();
    }

    if ( !dragData ) return;

    // Set data transfer
    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  }

  async _getFromUuid(uuid) {
    return await fromUuid(uuid);
  }

}