import {
  listEffects,
  getAllEffects,
} from "../../helpers/common.mjs";

const EffectsMixin = (superclass) => class extends superclass {
    /** @inheritdoc */
    static DEFAULT_OPTIONS = {
        actions: {
            editEffects: this.#onEditEffects,
        }
    }

    get effectsPath() {
        return [];
    }

    get distancePath() {
        return [];
    }

    get effects2mainsPath() {
        return [];
    }

    get munitionsPath() {
        return [];
    }

    get structurellePath() {
        return [];
    }

    get ornementalePath() {
        return [];
    }

    static async #onEditEffects(event, target) {
        const tgt = target.dataset;
        const path = tgt.path;
        const canHaveLimitEffects = tgt.limitEffects;
        const item = this.item;
        const type = item.system.type;
        const actor = item.actor;
        const dataArmor = actor?.system?.dataArmor;
        const getArmor = dataArmor && canHaveLimitEffects ? new game.knight.utils.ArmureAPI(dataArmor) : undefined;
        const contrecoups = getArmor ? getArmor?.special?.contrecoups ?? undefined : undefined;
        const hasRestriction = contrecoups ? contrecoups?.maxeffets?.value ?? false : false;
        const maxEffets = type === 'contact' && hasRestriction ? contrecoups?.maxeffets?.max ?? undefined : undefined;
        const aspects = CONFIG.KNIGHT.listCaracteristiques;
        const data = foundry.utils.getProperty(this.item, `system.${path}`);

        await new game.knight.applications.KnightEffetsDialog({
            uuid:item.uuid,
            path:path,
        }, data).render({force:true});

        /*await new game.knight.applications.KnightEffetsDialog({
            actor:this.actor?._id || null,
            item:this.item._id,
            isToken:this.item?.parent?.isToken || false,
            token:this.item?.parent || null,
            raw:data.raw,
            custom:data.custom,
            activable:data.activable,
            toUpdate:path,
            aspects:aspects,
            maxEffets:maxEffets,
            title:`${this.item.name} : ${game.i18n.localize("KNIGHT.EFFETS.Edit")}`
        }).render({force:true});*/
    }

    _postContext(context) {
        super._postContext(context);
        const effects = this.effectsPath;
        const distance = this.distancePath;
        const effects2mains = this.effects2mainsPath;
        const structurelle = this.structurellePath;
        const ornementale = this.ornementalePath;
        const munitions = this.munitionsPath;
        const concat = [].concat(effects, distance, effects2mains, structurelle, ornementale);

        for(const e of concat) {
            const data = foundry.utils.getProperty(context.systemData, e);

            if(data) foundry.utils.setProperty(context.systemData, `${e}.liste`, listEffects(data, getAllEffects(), data?.chargeur));
        }
    }
}

export default EffectsMixin;