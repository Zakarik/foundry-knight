
const registryWpn = {};

const wpnDefaultHandler = {
  async activate() {}
};

export class BaseActorDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
		const {SchemaField, NumberField, BooleanField, ObjectField, HTMLField} = foundry.data.fields;

        return {
            version:new NumberField({initial:0, nullable:false, integer:true}),
            description:new HTMLField({initial:""}),
            descriptionLimitee:new HTMLField({initial:""}),
            limited:new SchemaField({
                showDescriptionFull:new BooleanField({initial:false}),
                showDescriptionLimited:new BooleanField({initial:false}),
            }),
            otherMods:new ObjectField(),
        }
    }

    get actor() {
        return this.parent;
    }

    get actorId() {
        return this.actor?.token ? this.actor.token.id : this.actor.id;
    }

    get items() {
        return this.parent.items;
    }

    useStdWpn(itemId, args={}) {
        const actor = this.actor;
        const item = actor.items.get(itemId);
        const label = item.name;
        const {
            type,
            name,
        } = args;
        let modificateur = 0;
        let id = itemId;

        if(item) {
            switch(item.type) {
                case 'module':
                    id = `module_${id}`;
                    if(item.system?.niveau?.actuel?.arme?.type === 'distance') modificateur += this.rollWpnDistanceMod;
                    break;

                case 'armure':
                    switch(name) {
                      case 'rayon':
                      case 'salve':
                      case 'vague':
                        id = type === 'distance' ? `capacite_${id}_cea${name.charAt(0).toUpperCase() + name.substr(1)}D` : `capacite_${id}_cea${name.charAt(0).toUpperCase() + name.substr(1)}C`;

                        if(type === 'distance') modificateur += this.rollWpnDistanceMod;
                        break;

                      case 'borealis':
                        id = type === 'distance' ? `capacite_${id}_borealisD` : `capacite_${id}_borealisC`;

                        if(type === 'distance') modificateur += this.rollWpnDistanceMod;
                        break;

                      case 'lame':
                      case 'griffe':
                      case 'canon':
                      case 'lame2':
                      case 'griffe2':
                      case 'canon2':
                        id = `capacite_${id}_morph${name.charAt(0).toUpperCase() + name.substr(1)}`;
                        break;
                    }
                    break;

                case 'arme':
                    if(item.system.type === 'distance') modificateur += this.rollWpnDistanceMod;
                    break;

                case 'capacite':
                    if(item.system.attaque.type === 'distance') modificateur += this.rollWpnDistanceMod;

                    id = `pnjcapacite_${id}`;
                    break;
            }
        }

        const actorId = this.actorId;
        let rollData = {
            label:label,
            wpn:id,
            modificateur
        };

        if(actor.type === 'vehicule' && item) {
            rollData.whoActivate = item.type === 'module' ? item.system?.niveau?.actuel?.whoActivate : item.system.whoActivate;
        }

        const dialog = new game.knight.applications.KnightRollDialog(actorId, rollData);

        dialog.open();

        return dialog
    }

    useWpn(wpnType = '', args = {}) {
        const handlers = this._getWeaponHandlers();
        const handler = handlers[wpnType];

        if (handler) {
            return handler.call(this, args);
        }

        // Fallback commun
        return this.useStdWpn(args.id, { type: args.type, name: args.num });
    }

    // Méthode à surcharger dans les enfants
    _getWeaponHandlers() {
        return {};
    }
}