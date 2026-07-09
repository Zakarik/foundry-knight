import {
    getModStyle,
    listEffects,
    getAllEffects,
} from "../../helpers/common.mjs";
import ArmureAPI from "../../utils/armureAPI.mjs";
import ArmureLegendeAPI from "../../utils/armureLegendeAPI.mjs";
import KnightRollData from "../models/roll-model.mjs";
import JsTogglerMixin from "../../sheets/bases/mixin-js-toggler.mjs";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class KnightRollDialog extends JsTogglerMixin(HandlebarsApplicationMixin(ApplicationV2)) {
    static dialogRoll = 'systems/knight/templates/dialog/parts/roll/roll-sheet.html';

    static DEFAULT_OPTIONS = {
        classes: ["dialog", "knight", "rollDialog"],
        position: { width: 900, height: 800 },
        window: {
            resizable: true,
            title: "KNIGHT.JETS.Label"
        },
        tag: "form",
        form: {
            submitOnChange: true,
            handler: KnightRollDialog.#onSubmit,
        },
        baseApplication: "KnightRollDialog",
        actions: {
            rollNormal: KnightRollDialog.#onRollNormal,
            rollEntraide: KnightRollDialog.#onRollEntraide,
            rollCancel: KnightRollDialog.#onRollCancel,
            caracteristique: KnightRollDialog.#onCaracteristique,
            weapon: KnightRollDialog.#onWeapon,
            longbow: KnightRollDialog.#onLongbow,
            option: KnightRollDialog.#onOptions,
            toggle: KnightRollDialog.#onToggle,
        },
    };

    static PARTS = {
        header:{
            template: "systems/knight/templates/dialog/parts/roll/header.hbs",
        },
        aspects: {
            template: "systems/knight/templates/dialog/parts/roll/aspects.hbs",
        },
        mods: {
            template: "systems/knight/templates/dialog/parts/roll/mods.hbs",
        },
        footer: {
            template: "systems/knight/templates/dialog/parts/roll/footer.hbs",
        },
    };

    constructor(actor, data={}, options={}) {
        super(foundry.utils.mergeObject({ id: `KnightRollDialog-${actor}` }, options));

        this.document = {
            id:`${actor}-0`
        }

        this.system = new KnightRollData({
            uuid:actor,
            roll:data,
        });

        if (data?.height) this.options.position.height = data.height;
    }

    get rollData() {
        return this.system.roll;
    }

    get actor() {
        return fromUuidSync(this.system.uuid);
    }

    get who() {
        const actor = this.actor;

        return this.system.whoActivate !== 'none' ? game.actors.get(this.system.whoActivate) : actor;
    }

    get html() {
        return this.rollData.html;
    }

    get isPJ() {
        const who = this.who;
        const type = who.type;
        let result = false;

        if(type === 'knight') result = true;
        else if(type === 'mechaarmure') {
            if(who?.system?.piloteId) {
                const pilote = game.actors.get(who.system.piloteId);

                if(pilote) {
                    if(pilote.type === 'knight') result = true;
                }
            }
        }

        return result;
    }

    get attrMods() {
        const wear = this.actor.system.wear;
        const armorIsWear = wear === 'armure' || wear === 'ascension' ? true : false;
        const armureData = this.actor.items.find(itm => itm.type === 'armure');
        let result = {
            bonus:[],
            interdits:[]
        };

        if(armureData && armorIsWear) {
            const d = armureData?.system?.capacites?.selected?.rage;

            if(d) {
                const nc = d?.niveau?.colere;
                const nr = d?.niveau?.rage;
                const nf = d?.niveau?.fureur;
                const c = d?.colere;
                const r = d?.rage;
                const f = d?.fureur;

                if(nc) {
                    if(c.combosBonus.has) {
                        result.bonus = Object.values(c.combosBonus.liste).filter(v => v !== "");;
                    }

                    if(c.combosInterdits.has) {
                        result.interdits = Object.values(c.combosInterdits.liste).filter(v => v !== "");;
                    }
                }

                if(nr) {
                    if(r.combosBonus.has) {
                        result.bonus = Object.values(r.combosBonus.liste).filter(v => v !== "");;
                    }

                    if(r.combosInterdits.has) {
                        result.interdits = Object.values(r.combosInterdits.liste).filter(v => v !== "");;
                    }
                }

                if(nf) {
                    if(f.combosBonus.has) {
                        result.bonus = Object.values(f.combosBonus.liste).filter(v => v !== "");;
                    }

                    if(f.combosInterdits.has) {
                        result.interdits = Object.values(f.combosInterdits.liste).filter(v => v !== "");;
                    }
                }
            }
        }

        return result;
    }

    get armorIsWear() {
        const wear = this.who.system?.wear ?? '';
        let result = false;

        if(wear === 'armure' || wear === 'ascension' || !this.isPJ) result = true;

        return result;
    }

    get style() {
        const actor = this.who;
        const system = actor.system;

        return system.combat.style;
    }

    get wpnSelected() {
        const wpnSelected = this.rollData?.wpnSelected;
        return wpnSelected ? this.rollData.allWpn.find(itm => itm.id === wpnSelected) : undefined;
    }

    get wpnIsTourelle() {
        const wpn = this.wpnSelected;

        if(wpn?.tourelle) return true;
        else return false;
    }

    get nbreTotemShow() {
        let totem = 0;

        if(!this.isPJ || !this.armorIsWear) return totem;

        const system = this.who.system;
        const armor = system.dataArmor;
        const armorLegend = system.dataArmorLegend;
        const armorAPI = armor ? new ArmureAPI(armor) : undefined;
        //const armorLegendAPI = armorLegend ? new ArmureLegendeAPI(armorLegend) : undefined;

        if(armorAPI) {
            const totemAPI = armorAPI.getCapacite('totem');

            if(!totemAPI?.active) return totem;

            totem = system?.equipements?.armure?.capacites?.totem?.nombre ?? 0;
        }

        return totem;
    }

    get nbreTotemTotal() {
        let totem = 0;

        if(!this.isPJ) return totem;

        const system = this.who.system;
        const armor = system.dataArmor;
        const armorLegend = system.dataArmorLegend;
        const armorAPI = armor ? new ArmureAPI(armor) : undefined;
        //const armorLegendAPI = armorLegend ? new ArmureLegendeAPI(armorLegend) : undefined;

        if(armorAPI) {
            const totemAPI = armorAPI.getCapacite('totem');
            totem = totemAPI?.nombre ?? 0;
        }

        return totem;
    }

    get nbreTotemLShow() {
        let totem = 0;

        if(!this.isPJ || !this.armorIsWear) return totem;

        const system = this.who.system;
        const armor = system.dataArmor;
        const armorLegend = system.dataArmorLegend;
        const armorAPI = armorLegend ? new ArmureLegendeAPI(armorLegend) : undefined;

        if(armorAPI) {
            const totemAPI = armorAPI.getCapacite('totem');

            if(!totemAPI?.active) return totem;

            totem = system?.equipements?.armure?.capacites?.totem?.nombre ?? 0;
        }

        return totem;
    }

    get nbreTotemLTotal() {
        let totem = 0;

        if(!this.isPJ) return totem;

        const system = this.who.system;
        const armor = system.dataArmor;
        const armorLegend = system.dataArmorLegend;
        const armorAPI = armorLegend ? new ArmureLegendeAPI(armorLegend) : undefined;

        if(armorAPI) {
            const totemAPI = armorAPI.getCapacite('totem');
            totem = totemAPI?.nombre ?? 0;
        }

        return totem;
    }

    async actualise() {
        // Détection de changement structurel
        if(this.#needFullRerender()) {
            await this.#fullRerender();
            return;
        }

        this.#renderInitialization(this.rollData.html);

        const wpns = this.#prepareWpn();

        const allWpns = this.rollData.typeWpn.contact.concat(this.rollData.typeWpn.distance, this.rollData.typeWpn.tourelle, this.rollData.typeWpn.aicontact, this.rollData.typeWpn.aidistance, this.rollData.typeWpn.grenade, this.rollData.typeWpn.complexe);
        const difference = foundry.utils.diffObject(allWpns, this.rollData.allWpn);
        const difference2 = foundry.utils.diffObject(this.rollData.allWpn, allWpns);
        if(!allWpns.find(itm => itm.id === this.rollData.wpnSelected)) this.rollData.wpnSelected = '';

        if(!foundry.utils.isEmpty(difference) || !foundry.utils.isEmpty(difference2)) {
            this.rollData.allWpn = allWpns;
            this.#cleanHtml();
            this.#updateWpnContact(this.rollData.typeWpn.contact);
            this.#updateWpnDistance(this.rollData.typeWpn.distance);
            this.#updateWpnTourelle(this.rollData.typeWpn.tourelle);
            this.#updateWpnAIContact(wpns.listaicontact);
            this.#updateWpnAIDistance(wpns.listaidistance);
            this.#updateWpnGrenade(this.rollData.typeWpn.grenade);
            this.#updateWpnComplexe(this.rollData.typeWpn.complexe);
            this.#renderWpn(this.rollData.html);
            this.#updateBtnShow();
        }

        this.#updateTotem();
        this.#updateBonusInterdits(undefined, this.rollData.html);
    }

    async open() {
        //this.#prepareTitle();
        this.#prepareButtons();
        this.#prepareMods();

        this.system.roll.structure = this.#getStructureSignature();

        return this.render({ force: true });
    }

    /* -------------------------------------------- */

    static #onRollNormal(event, target) {
        this.#roll();
    }

    static #onRollEntraide(event, target) {
        this.#entraide();
    }

    static #onRollCancel(event, target) {
        this.close();
    }

    static #onCaracteristique(event, target) {
        const isPJ = this.isPJ;
        const carac = target.dataset.value;
        const isSelected = target.classList.contains('selected');
        const parents = target.closest('div.aspects');
        const hasAlreadyBase = !!parents.querySelector('button.btnCaracteristique.base');

        if(!target.classList.contains('wHover')) return;

        const icon = target.querySelector('i');

        if(isPJ) {
            const isBase = target.classList.contains('base');

            if(isSelected) {
                target.classList.remove('selected');
                icon?.classList.remove('fa-solid', 'fa-check');

                this.rollData.whatRoll = this.rollData.whatRoll.filter(roll => roll !== carac);
            } else {
                target.classList.add('selected');

                if(hasAlreadyBase) {
                    this.rollData.whatRoll.push(carac);
                    icon?.classList.remove('fa-solid', 'fa-check', 'fa-check-double');
                    icon?.classList.add('fa-solid', 'fa-check');
                }
                else {
                    this.rollData.base = carac;
                    target.classList.add('base');
                    icon?.classList.add('fa-solid', 'fa-check-double');
                }
            }

            if(isBase) {
                const whatRoll = this.rollData?.whatRoll ?? [];
                target.classList.remove('base');

                if(whatRoll.length === 0) this.rollData.base = "";
                else {
                    for(const w of whatRoll) {
                        const btn = parents.querySelector(`button.btnCaracteristique.${w}`);

                        if(btn?.classList.contains('wHover')) {
                            btn.classList.add('base');

                            const btnIcon = btn.querySelector('i');
                            btnIcon.classList.remove('fa-solid', 'fa-check', 'fa-check-double');
                            btnIcon.classList.add('fa-solid', 'fa-check-double');

                            this.rollData.base = w;
                            this.rollData.whatRoll = this.rollData.whatRoll.filter(roll => roll !== w);
                            break;
                        }
                    }
                }
            }
        } else {
            if(isSelected) {
                target.classList.remove('selected', 'base');
                icon?.classList.remove('fa-solid', 'fa-check-double');
                this.rollData.base = '';
            } else {
                if(hasAlreadyBase) {
                    const baseBtn = parents.querySelector('button.btnCaracteristique.base');
                    baseBtn.querySelector('i').classList.remove('fa-solid', 'fa-check-double');
                    baseBtn.classList.remove('selected', 'base');
                }

                target.classList.add('selected', 'base');
                icon?.classList.add('fa-solid', 'fa-check-double');

                this.rollData.base = carac;
            }
        }
    }

    static #onWeapon(event, target) {
        const isSelected = target.classList.contains('selected');
        const id = target.closest('div.button')?.dataset.id;

        if(this.rollData.wpnSecond === id) return;

        if(isSelected) this.#unselectWpn(target);
        else this.#selectWpn(target);

        if(isSelected) this.#updateBtnShow(true);
        else this.#updateBtnShow();
    }

    static #onOptions(event, target) {
        const parent = target.closest('div.button');

        if(!parent) return;

        const id = parent.dataset.id;
        const value = target.dataset.value;
        const wpn = this.rollData.allWpn.find(itm => itm.id === id);

        if(!wpn) return;

        const isSelected = target.classList.contains('selected');
        const tgtIcon = target.querySelector('i');
        let options = wpn.options.find(itm => itm.value === value);

        if(isSelected) {
            target.classList.remove('selected');
            tgtIcon?.classList.remove('fa-solid', 'fa-check', 'green');
            tgtIcon?.classList.add('fa-solid', 'fa-xmark', 'red');

            options.active = false;
        } else {
            target.classList.add('selected');
            tgtIcon?.classList.remove('fa-solid', 'fa-xmark', 'red');
            tgtIcon?.classList.add('fa-solid', 'fa-check', 'green');

            options.active = true;
        }
    }

    static #onLongbow(event, target) {
        const longbow = target.closest('div.wpnComplexe.longbow');
        const id = longbow.dataset.id;
        const { raw, custom, liste, id: customID } = target.dataset;
        const isChecked = target.classList.contains('checked');

        this.#toggleEffect(id, { raw, custom: custom === 'true', liste, customID }, isChecked);

        target.classList.toggle('checked');
        target.querySelector('i')?.classList.toggle('fa-solid');
        target.querySelector('i')?.classList.toggle('fa-check-double');

        this.#calculateLongbow(id, longbow);
        return;
    }

    static #onToggle(event, target) {
        const name = target.closest('label.btn')?.dataset.name;
        const btn = this.rollData?.btn?.[name] ?? false;
        const i = target.querySelector('i');

        if(btn) {
            this.rollData.btn[name] = false;
            target.classList.remove('selected');
            i?.classList.remove('fa-solid', 'fa-check');
        }
        else {
            this.rollData.btn[name] = true;
            target.classList.add('selected');
            i?.classList.add('fa-solid', 'fa-check');
        }
    }


    /** @inheritdoc */
    async _preparePartContext(partId, context, options) {
        context = await super._preparePartContext(partId, context, options);
        switch(partId) {
            case 'footer':
                context.isPJ = this.isPJ;
                break;
        }

        return await super._preparePartContext(partId, context, options);
    }

    /** @inheritDoc */
    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        // S'assure que les données sont préparées (le 1er rendu vient de open(),
        // mais un éventuel re-render direct doit aussi initialiser les boutons/title).
        //if (!this.system.title) this.#prepareTitle();
        if (foundry.utils.isEmpty(this.system.buttons)) this.#prepareButtons();

        const rollOptions = this.#prepareOptions();
        return foundry.utils.mergeObject(context, {
            ...rollOptions,
            buttons: this.system.buttons,
        });
    }

    /** @inheritDoc */
    async _onFirstRender(context, options) {
        await super._onFirstRender(context, options);

        this.element.addEventListener('change', this.#onChange.bind(this));
    }

    /** @inheritDoc */
    _onRender(context, options) {
        super._onRender(context, options);
        this.#renderHTML(this.element);
        console.error('test');
    }

    /* -------------------------------------------- */
    async #onChange(event) {
        const tgt = event.target;

        // --- scoredice ---
        if(tgt.matches('div.scoredice input')) {
            const key = tgt.closest('div.scoredice')?.dataset.key;
            const subkey = tgt.dataset.key;

            if(key && subkey) {
                if(!this.rollData?.scoredice?.[key]) {
                    this.rollData.scoredice[key] = { dice: 0, value: 0 };
                }
                this.rollData.scoredice[key][subkey] = tgt.value;
            }
            return;
        }

        // À partir d'ici, tout dépend d'une arme
        const button = tgt.closest('div.button');

        if(button) {
            const id = button.dataset.id;
            const wpn = this.rollData.allWpn.find(itm => itm.id === id);

            if(wpn) {
                // --- mains (2 mains) ---
                if(tgt.matches('div.data .selectSimple.mains select')) {
                    this.#updateWpn(id, {['options2mains.actuel']: tgt.value});
                    return;
                }

                // --- munitions ---
                if(tgt.matches('div.data .selectSimple.munitions select')) {
                    this.#updateWpn(id, {['optionsmunitions.actuel']: tgt.value});
                    return;
                }

                // --- dégâts variable ---
                if(tgt.matches('div.data label.dgtsvariable select')) {
                    const val = tgt.value;
                    wpn.degats.dice = parseInt(val);

                    const allVariable = this.rollData.allVariableWpn.find(itm => itm.id === id);
                    if(!allVariable) this.rollData.allVariableWpn.push({ id, degats: val });
                    else allVariable.degats = val;
                    return;
                }

                // --- violence variable ---
                if(tgt.matches('div.data label.violencevariable select')) {
                    const val = tgt.value;
                    wpn.violence.dice = parseInt(val);

                    const allVariable = this.rollData.allVariableWpn.find(itm => itm.id === id);
                    if(!allVariable) this.rollData.allVariableWpn.push({ id, violence: val });
                    else allVariable.violence = val;
                    return;
                }

                // --- dégâts bonus variable (modules) ---
                if(tgt.matches('div.data label.dgtsbonusvariable select')) {
                    const idBonus = tgt.closest('label.dgtsbonusvariable')?.dataset.id;
                    const val = tgt.value;
                    const options = wpn.options.find(itm => itm.classes.includes('dgtsbonusvariable') && itm.id === idBonus);
                    options.selected = parseInt(val);

                    this.#setModuleVariable(id, idBonus, { degats: val });
                    return;
                }

                // --- violence bonus variable (modules) ---
                if(tgt.matches('div.data label.violencebonusvariable select')) {
                    const idBonus = tgt.closest('label.violencebonusvariable')?.dataset.id;
                    const val = tgt.value;
                    const options = wpn.options.find(itm => itm.classes.includes('violencebonusvariable') && itm.id === idBonus);
                    options.selected = parseInt(val);

                    this.#setModuleVariable(id, idBonus, { violence: val });
                    return;
                }

                // --- boost simple (select1 / select2) ---
                if(tgt.matches('div.data div.boostsimple select.select1')) {
                    const options = wpn.options.find(itm => itm.classes.includes('boostsimple'));
                    options.selected1 = tgt.value;
                    return;
                }
                if(tgt.matches('div.data div.boostsimple select.select2')) {
                    const options = wpn.options.find(itm => itm.classes.includes('boostsimple'));
                    options.selected2 = parseInt(tgt.value);
                    if(wpn.id.includes('longbow')) this.#calculateLongbow(id, button);
                    return;
                }

                // --- boost dégâts ---
                if(tgt.matches('div.data label.boostdegats select')) {
                    const options = wpn.options.find(itm => itm.classes.includes('boostdegats'));
                    options.selected = parseInt(tgt.value);
                    if(wpn.id.includes('longbow')) this.#calculateLongbow(id, button);
                    return;
                }

                // --- boost violence ---
                if(tgt.matches('div.data label.boostviolence select')) {
                    const options = wpn.options.find(itm => itm.classes.includes('boostviolence'));
                    options.selected = parseInt(tgt.value);
                    if(wpn.id.includes('longbow')) this.#calculateLongbow(id, button);
                    return;
                }
            }
        }

        // --- longbow : selects ---
        const longbow = tgt.closest('div.wpnComplexe.longbow');

        if(longbow) {
            const id = longbow.dataset.id;

            const map = {
                '.longbow_dgts select':     { property: 'degats',  parse: true },
                '.longbow_violence select': { property: 'violence', parse: true },
                '.longbow_portee select':   { property: 'portee',  parse: false },
            };

            for(const [selector, { property, parse }] of Object.entries(map)) {
                if(tgt.matches(selector)) {
                    const value = parse ? parseInt(tgt.value) : tgt.value;
                    this.#updateComplexeWpn(id, property, value);
                    this.#calculateLongbow(id, longbow);
                    return;
                }
            }
        }

        if(tgt.matches('label.selectWithInfo select')) {
            const style = tgt.value;

            // remplace le span.hideInfo
            const label = tgt.closest('label.style');
            this.#updateStyleShow(style);

            const root = this.rollData.html;

            if(style !== 'akimbo') {
                root.querySelectorAll('.doubleSelected').forEach(w => this.#unselectWpn(w, true))
                root.querySelectorAll('span.specialInfo').forEach(s => s.style.display = 'none');
            } else {
                const txt = game.i18n.localize("KNIGHT.COMBAT.STYLES.AKIMBO.SecondWpn");
                root.querySelectorAll('span.specialInfo').forEach(s => {
                    s.textContent = txt;
                    s.style.display = '';
                });
            }

            const target = this.actor.type === 'mechaarmure' ? this.actor : this.who;
            await target.update({ 'system.combat.style': style });
            return;
        }

        // --- pilonnage : type (select) + persistance acteur ---
        if(tgt.matches('.pilonnage select')) {
            this.actor.update({ 'system.combat.data.type': tgt.value });
            return;
        }

        // --- pilonnage : value (input) + persistance acteur ---
        if(tgt.matches('.pilonnage input')) {
            const value = parseInt(tgt.value);
            this.actor.update({ 'system.combat.data.tourspasses': value });
            return;
        }
    }

    #setModuleVariable(id, idBonus, data) {
        let allVariable = this.rollData.allVariableWpn.find(itm => itm.id === id);

        if(!allVariable) {
            this.rollData.allVariableWpn.push({ id, modules: [{ id: idBonus, ...data }] });
            return;
        }
        if(!allVariable.modules) {
            allVariable.modules = [{ id: idBonus, ...data }];
            return;
        }
        const moduleVariable = allVariable.modules.find(itm => itm.id === idBonus);
        if(!moduleVariable) allVariable.modules.push({ id: idBonus, ...data });
        else Object.assign(moduleVariable, data);
    }

    /* -------------------------------------------- */

    #renderInitialization(html) {
        const scores = ['difficulte', 'succesBonus', 'modificateur'];
        const actor = this.who;
        const style = actor.system.combat.style;
        const isPJ = this.isPJ;

        const labelInput = html.querySelector('input.label');
        if(labelInput) labelInput.value = this.rollData.label;

        const styleSelect = html.querySelector('label.style select');
        if(styleSelect) styleSelect.value = style;

        const aspects = html.querySelectorAll('.aspect button.btnCaracteristique');

        for(const a of aspects) {
            const value = a.dataset.value;
            let setValue = `${this.#getValueAspect(actor, value)}`;

            if(value === this.rollData.base) a.classList.add('selected', 'base');
            else if(this.rollData.whatRoll.includes(value)) a.classList.add('selected');

            if((actor.system.wear === 'armure' || actor.system.wear === 'ascension') && isPJ) setValue += ` + ${this.#getODAspect(actor, value)} ${game.i18n.localize('KNIGHT.ASPECTS.OD')}`;
            else if(!isPJ) setValue += ` + ${this.#getODAspect(actor, value)} ${game.i18n.localize('KNIGHT.ASPECTS.Exceptionnel-short')}`;

            const spanValue = a.querySelector('span.value');
            if(spanValue) spanValue.textContent = setValue;

            this.#updateBonusInterdits(a, html);
        }

        for(const s of scores) {
            const input = html.querySelector(`label.score.${s} input`);
            if(input) input.value = this.rollData[s];
        }

        const setSelectValue = (selector, value) => {
            const el = html.querySelector(selector);
            if(el) el.value = value;
        };

        setSelectValue('.pilonnage select', this.rollData.style.pilonnage.type);
        setSelectValue('.precis select', this.rollData.style.precis.type);
        setSelectValue('.puissant select', this.rollData.style.puissant.type);
        setSelectValue('.suppression select', this.rollData.style.suppression.type);

        setSelectValue('.pilonnage input', this.rollData.style.pilonnage.value);
        setSelectValue('.puissant input', this.rollData.style.puissant.value);
        setSelectValue('.suppression input', this.rollData.style.suppression.value);

        if(style === 'akimbo') {
            const specialInfo = html.querySelector('span.specialInfo');
            if(specialInfo) {
                specialInfo.textContent = game.i18n.localize("KNIGHT.COMBAT.STYLES.AKIMBO.SecondWpn");
                specialInfo.style.display = '';
            }
        }

        this.#updateStyleShow(style, undefined);
        this.#updateBtnShow(false, true);
    }

    #renderHTML(html) {
        this.rollData.html = html;
        this.#renderSTD(html);
        this.#renderWpn(html);

        html.querySelectorAll('.aspect button.btnCaracteristique.selected i')
            .forEach(i => i.classList.add('fa-solid', 'fa-check'));

        html.querySelectorAll('.aspect button.btnCaracteristique.base i')
            .forEach(i => {
                i.classList.remove('fa-solid', 'fa-check', 'fa-check-double');
                i.classList.add('fa-solid', 'fa-check-double');
            });

        this.#updateBonusInterdits(undefined, html);
        this.#updateTotem();
    }

    #renderSTD(html) {
        this.#renderInitialization(html);
        const allBtn = html.querySelectorAll('label.btn');
        const allScoredice = html.querySelectorAll('div.scoredice');

        for(const b of allBtn) {
            const name = b.dataset.name;
            const btn = this.rollData?.btn?.[name] ?? false;

            const button = b.querySelector('button');
            const icon = b.querySelector('button i');

            if(btn) {
                button?.classList.add('selected');
                icon?.classList.add('fa-solid', 'fa-check');
            }
            else {
                button?.classList.remove('selected');
                icon?.classList.remove('fa-solid', 'fa-check');
            }
        }

        for(const b of allScoredice) {
            const key = b.dataset.key;
            const dice = this.rollData?.scoredice?.[key]?.dice ?? 0;
            const value = this.rollData?.scoredice?.[key]?.value ?? 0;

            const inputDice = b.querySelector('input.dice');
            const inputValue = b.querySelector('input.value');

            if(inputDice) inputDice.value = dice;
            if(inputValue) inputValue.value = value;
        }
    }

    #renderWpn(html) {
        const parent = html;
        const allWpn = html.querySelectorAll('div.wpn div.button');

        for(const w of allWpn) {
            const id = w.dataset.id;
            const btn = w.querySelector('button.btnWpn');

            if(id == this.rollData.wpnSelected) this.#selectWpn(btn, true);

            if(id === this.rollData.wpnSecond) this.#selectWpn(btn, true, true);
        }

        parent.querySelectorAll('div.wpn button.btnWpn').forEach(btn => {
            btn.addEventListener('contextmenu', ev => {
                ev.preventDefault();

                if(this.style !== 'akimbo') return;

                const tgt = ev.currentTarget;
                const isSelected = tgt.classList.contains('doubleSelected');
                const id = tgt.closest('div.button')?.dataset.id;

                if(this.rollData.wpnSelected === id) return;

                if(isSelected) this.#unselectWpn(ev.currentTarget, true);
                else this.#selectWpn(ev.currentTarget, false, true);
            });
        });

        const mainsWpn = parent.querySelectorAll('div.wpn div.data .selectSimple.mains');
        const munitionsWpn = parent.querySelectorAll('div.wpn div.data .selectSimple.munitions');
        const initWpn = parent.querySelectorAll('div.wpn div.data button.active');
        const dgtsWpn = parent.querySelectorAll('div.wpn div.data label.dgtsvariable');
        const violenceWpn = parent.querySelectorAll('div.wpn div.data label.violencevariable');
        const dgtsBonusWpn = parent.querySelectorAll('div.wpn div.data label.dgtsbonusvariable');
        const violenceBonusWpn = parent.querySelectorAll('div.wpn div.data label.violencebonusvariable');
        const boost = parent.querySelectorAll('div.wpn div.data div.boostsimple');
        const boostdegats = parent.querySelectorAll('div.wpn div.data label.boostdegats');
        const boostviolence = parent.querySelectorAll('div.wpn div.data label.boostviolence');

        for(const w of mainsWpn) {
            const button = w.closest('div.button');
            const id = button?.dataset.id;
            const select = w.querySelector('select');
            const wpn = this.rollData.allWpn.find(itm => itm.id === id);

            select.value = wpn.actuel;
        }

        for(const w of munitionsWpn) {
            const button = w.closest('div.button');
            const id = button?.dataset.id;
            const select = w.querySelector('select');
            const wpn = this.rollData.allWpn.find(itm => itm.id === id);

            select.value = wpn.actuel;
        }

        for(const w of initWpn) {
            const button = w.closest('div.button');
            const isSelected = w.classList.contains('selected');
            const id = button?.dataset.id;
            const value = w.dataset.value;
            const wpn = this.rollData.allWpn.find(itm => itm.id === id);
            const icon = w.querySelector('i');

            let options = wpn.options.find(itm => itm.value === value);

            if(isSelected || options.active) {
                icon?.classList.remove('fa-solid', 'fa-xmark', 'red');
                icon?.classList.add('fa-solid', 'fa-check', 'green');

                if(!isSelected) w.classList.add('selected');
            } else {
                icon?.classList.remove('fa-solid', 'fa-check', 'green');
                icon?.classList.add('fa-solid', 'fa-xmark', 'red');
            }
        }

        for(const w of dgtsWpn) {
            const button = w.closest('div.button');
            const select = w.querySelector('select');
            const id = button?.dataset.id;
            const wpn = this.rollData.allWpn.find(itm => itm.id === id);
            const allVariable = this.rollData.allVariableWpn.find(itm => itm.id === id);
            let options = wpn.options.find(itm => itm.classes.includes('dgtsvariable'));

            if(allVariable && options.list.hasOwnProperty(allVariable?.degats ?? options.selected)) select.value = allVariable?.degats ?? options.selected;
            else if(options.list.hasOwnProperty(wpn.degats.dice)) select.value = wpn.degats.dice;
            else wpn.degats = {dice:options.selected, fixe:options.selectvalue};
        }

        for(const w of violenceWpn) {
            const button = w.closest('div.button');
            const select = w.querySelector('select');
            const id = button?.dataset.id;
            const wpn = this.rollData.allWpn.find(itm => itm.id === id);
            const allVariable = this.rollData.allVariableWpn.find(itm => itm.id === id);
            let options = wpn.options.find(itm => itm.classes.includes('violencevariable'));

            if(allVariable && options.list.hasOwnProperty(allVariable?.violence ?? options.selected)) select.value = allVariable?.violence ?? options.selected;
            else if(options.list.hasOwnProperty(wpn.violence.dice)) select.value = wpn.violence.dice;
            else wpn.violence = {dice:options.selected, fixe:options.selectvalue};
        }

        for(const w of dgtsBonusWpn) {
            const button = w.closest('div.button');
            const select = w.querySelector('select');
            const idBonus = w.dataset.id;
            const id = button?.dataset.id;
            const wpn = this.rollData.allWpn.find(itm => itm.id === id);
            const allVariable = this.rollData.allVariableWpn.find(itm => itm.id === id);
            const moduleVariable = allVariable?.modules?.find(itm => itm.id === idBonus) ?? undefined;
            let options = wpn.options.find(itm => itm.classes.includes('dgtsbonusvariable') && itm.id === idBonus);

            if(moduleVariable && options.list.hasOwnProperty(moduleVariable?.degats ?? options.selected)) select.value = moduleVariable?.degats ?? options.selected;
            else if(options.list.hasOwnProperty(options.selected)) select.value = options.selected;
            else options.selected = options.selected;
        }

        for(const w of violenceBonusWpn) {
            const button = w.closest('div.button');
            const select = w.querySelector('select');
            const idBonus = w.dataset.id;
            const id = button?.dataset.id;
            const wpn = this.rollData.allWpn.find(itm => itm.id === id);
            const allVariable = this.rollData.allVariableWpn.find(itm => itm.id === id);
            const moduleVariable = allVariable?.modules?.find(itm => itm.id === idBonus) ?? undefined;
            let options = wpn.options.find(itm => itm.classes.includes('violencebonusvariable') && itm.id === idBonus);

            if(moduleVariable && options.list.hasOwnProperty(moduleVariable?.violence ?? options.selected)) select.value = moduleVariable?.violence ?? options.selected;
            else if(options.list.hasOwnProperty(options.selected)) select.value = options.selected;
            else options.selected = options.selected;
        }

        for(const w of boost) {
            const button = w.closest('div.button');
            const select1 = w.querySelector('select.select1');
            const select2 = w.querySelector('select.select2');
            const id = button?.dataset.id;
            const wpn = this.rollData.allWpn.find(itm => itm.id === id);
            let options = wpn.options.find(itm => itm.classes.includes('boostsimple'));

            select1.value = options.selected1;
            select2.value = options.selected2;
        }

        for(const w of boostdegats) {
            const button = w.closest('div.button');
            const select = w.querySelector('select');
            const id = button?.dataset.id;
            const wpn = this.rollData.allWpn.find(itm => itm.id === id);
            let options = wpn.options.find(itm => itm.classes.includes('boostdegats'));

            select.value = options.selected;
        }

        for(const w of boostviolence) {
            const button = w.closest('div.button');
            const select = w.querySelector('select');
            const id = button?.dataset.id;
            const wpn = this.rollData.allWpn.find(itm => itm.id === id);
            let options = wpn.options.find(itm => itm.classes.includes('boostviolence'));

            select.value = options.selected;
        }

        this.#renderLongbow(html);

        this.#sanitizeWpn(parent.querySelectorAll('div.wpn button.btnWpn'), html);
    }

    #renderLongbow(html) {
        const parent = html.querySelector('div.wpnComplexe.longbow');
        if(!parent) return;

        const id = parent.dataset.id;
        const complexe = this.rollData.allWpn.find(itm => itm.id === id);
        if(!complexe) return;

        const initSelect = (selector, property) => {
            const select = parent.querySelector(selector);
            if(!select || !complexe[property]) return;

            if(property === 'portee') select.value = complexe[property];
            else select.value = complexe[property].dice;
        };

        initSelect('.longbow_dgts select', 'degats');
        initSelect('.longbow_violence select', 'violence');
        initSelect('.longbow_portee select', 'portee');

        // --- état initial des effets ---
        if(complexe.effets) {
            const effets = parent.querySelectorAll('.liste a');

            for(const a of effets) {
                const { raw, custom, liste, id: effetID } = a.dataset;

                const isChecked = custom
                    ? complexe.effets.custom.some(itm => itm.id === effetID && itm.liste === liste)
                    : complexe.effets.raw.includes(raw);

                if(isChecked) {
                    a.classList.add('checked');
                    a.querySelector('i')?.classList.add('fa-solid', 'fa-check-double');
                }
            }
        }

        this.#calculateLongbow(id, parent);
    }

    async #roll(data) {
        const actor = this.who;
        const armor = actor.items.find(itm => itm.type === 'armure');
        const armorIsWear = this.armorIsWear;
        const dataErsatzRogue = this.#getErsatzRogue(actor);
        const rollData = this.rollData;
        const { difficulte, succesBonus, modificateur, label, base, whatRoll, moddegats, modviolence } = rollData;
        const selected = [...new Set(whatRoll)].filter(v => v !== base);
        const weapon = this.wpnSelected;
        const weaponID = weapon.id;
        const isModeHeroique = rollData?.btn?.modeheroique ?? false;
        const isEquilibrerBalance = rollData?.btn?.equilibrerbalance ?? false;
        const isNoOd = rollData?.btn?.nood ?? false;
        const isMaximizeDgts = rollData?.btn?.maximizedegats ?? false;
        const isMaximizeViolence = rollData?.btn?.maximizeviolence ?? false;
        const nbreTotem = this.nbreTotemShow;
        const nbreTotemL = this.nbreTotemLShow;

        let isAttaqueSurprise = rollData.btn?.attaquesurprise ?? false;
        let carac = base ? [this.#getLabelRoll(base)] : [];
        let dices = this.#getValueAspect(actor, base);
        let bonus = [];
        let tags = [];
        let cout = 0;
        let espoir = 0;
        let doRoll = true;
        let msg = '';
        let classes = '';
        let updates = {};
        let dataStyle = {}
        let dataMod = {
            degats:{
                dice:moddegats.dice,
                fixe:moddegats.value,
            },
            violence:{
                dice:moddegats.dice,
                fixe:moddegats.value,
            }
        };
        let maximize = {
            degats:isMaximizeDgts,
            violence:isMaximizeViolence,
        }
        let goliath = 0;
        let ghost = 0;
        let odGhost = 0;
        let ersatzghost = 0;
        let odErsatzghost = 0;
        let flags = {};
        let isErsatzRogueActive = false;
        let isTourelle = false;

        if((armorIsWear) && !isNoOd) bonus.push(this.#getODAspect(actor, base));

        if(armorIsWear && armor) {
            const dataCapacites = actor.system?.equipements?.armure?.capacites ?? {};
            const capacitiesSelected = armor.system?.capacites?.selected;
            const dataGoliath = capacitiesSelected?.goliath ?? {};
            const isGoliathActive = capacitiesSelected?.goliath?.active ?? false;

            if(isGoliathActive && (base === 'endurance' || base === 'force')) {
                const meter = parseInt(dataCapacites?.goliath?.metre ?? 0);
                const bGoliath = parseInt(dataGoliath?.bonus?.[base]?.value ?? 0);

                goliath += (meter*bGoliath);
            }
        }

        for(let s of selected) {
            dices += this.#getValueAspect(actor, s);
            carac.push(this.#getLabelRoll(s));

            if(armorIsWear && !isNoOd) bonus.push(this.#getODAspect(actor, s));

            if(armorIsWear && armor) {
                const dataCapacites = actor.system?.equipements?.armure?.capacites ?? {};
                const capacitiesSelected = armor.system?.capacites?.selected;
                const dataGoliath = capacitiesSelected?.goliath ?? {};
                const isGoliathActive = capacitiesSelected?.goliath?.active ?? false;

                if(isGoliathActive && (s === 'endurance' || s === 'force')) {
                    const meter = parseInt(dataCapacites?.goliath?.metre ?? 0);
                    const bGoliath = parseInt(dataGoliath?.bonus?.[s]?.value ?? 0);

                    goliath += (meter*bGoliath);
                }
            }
        }

        if(nbreTotem) {
            for(let i = 0;i < nbreTotem;i++) {
                const totemCarac = data.find(`label.totem${i} select`).val();

                if(totemCarac) {
                    dices += this.#getValueAspect(actor, totemCarac);
                    carac.push(this.#getLabelRoll(totemCarac));
                }
            }
        }

        if(nbreTotemL) {
            for(let i = 0;i < nbreTotemL;i++) {
                const totemCarac = data.find(`label.totemL${i} select`).val();

                if(totemCarac) {
                    dices += this.#getValueAspect(actor, totemCarac);
                    carac.push(this.#getLabelRoll(totemCarac));
                }
            }
        }

        if(weapon) {
            const rollAllInOne = game.settings.get("knight", "oldRoll");
            const isGrenade = weapon.id.includes('grenade') ? true : false;
            const style = actor.system.combat.style;
            const modStyle = getModStyle(style);
            const capacitiesSelected = armor?.system?.capacites?.selected;
            const noMalusStyle = actor?.system?.combat?.noMalusStyle ?? false;
            let effets = weapon.effets.raw.concat(weapon?.structurelles?.raw ?? [], weapon?.ornementales?.raw ?? []);
            let custom = weapon.effets.custom.concat(weapon?.ornementales?.custom ?? [], weapon?.structurelles?.custom ?? []);
            isTourelle = weapon?.tourelle ?? false;
            dices += modStyle.bonus.attaque;
            dices -= noMalusStyle ? 0 : modStyle.malus.attaque;
            cout += weapon?.cout ?? 0;
            espoir += weapon?.espoir ?? 0;
            isErsatzRogueActive = dataErsatzRogue?.has ?? false;
            const isGhostActive = armor && !isTourelle ? (capacitiesSelected?.ghost?.active?.conflit
                || capacitiesSelected?.ghost?.active?.horsconflit)
                ?? false : false;

            if(rollAllInOne) flags['rollAll'] = true;

            if(isGrenade) {
                const actGrenade = actor.system?.combat?.grenades?.quantity?.value ?? 0;

                updates['system.combat.grenades.quantity.value'] = actGrenade-1;
            }

            if(isTourelle) {
                carac = [];
                bonus = [weapon.tourelle.fixe];
                dices = weapon.tourelle.dice;
            }

            if(weapon.eff1) {
                let toAddRaw = [];
                let toAddCustom = [];

                for(let r of weapon.eff1.raw) {
                    if(weapon.options.find(itm => itm.value === r && (itm?.active ?? true))) toAddRaw.push(r);
                }

                for(let r of weapon.eff1.custom) {
                    if(weapon.options.find(itm => itm.value === r && (itm?.active ?? true))) toAddCustom.push(r);
                }

                weapon.effets.raw = weapon.effets.raw.concat(toAddRaw);
                weapon.effets.custom = weapon.effets.custom.concat(toAddCustom);
                effets = effets.concat(toAddRaw);

                cout += toAddRaw.length*weapon.eff1.value;
                cout += toAddCustom.length*weapon.eff1.value;
            }

            if(weapon.eff2) {
                let toAddRaw = [];
                let toAddCustom = [];

                for(let r of weapon.eff2.raw) {
                    if(weapon.options.find(itm => itm.value === r && (itm?.active ?? true))) toAddRaw.push(r);
                }

                for(let r of weapon.eff2.custom) {
                    if(weapon.options.find(itm => itm.value === r && (itm?.active ?? true))) toAddCustom.push(r);
                }

                weapon.effets.raw = weapon.effets.raw.concat(toAddRaw);
                weapon.effets.custom = weapon.effets.custom.concat(toAddCustom);
                effets = effets.concat(toAddRaw);

                cout += toAddRaw.length*weapon.eff2.value;
                cout += toAddCustom.length*weapon.eff2.value;
            }

            switch(style) {
                case 'akimbo':
                    if(noMalusStyle) break;

                    const secondId = this.rollData.wpnSecond;

                    if(secondId) flags['secondWpn'] = this.rollData.allWpn.find(itm => itm.id === secondId);

                    if(this.#isEffetActive(effets, weapon.options, ['jumelle', 'jumeleakimbo', 'jumelageakimbo']) &&
                    (
                        (weapon.type === 'distance' && this.#getODAspect(actor, 'tir') >= 3 && armorIsWear) ||
                        (weapon.type === 'contact' && this.#getODAspect(actor, 'combat') >= 3 && armorIsWear))
                    ) {
                        dices += 3;
                    }
                    else if((this.#isEffetActive(effets, weapon.options, ['jumelle', 'jumeleakimbo', 'jumelageakimbo']) ||
                        (weapon.type === 'distance' && this.#getODAspect(actor, 'tir') >= 3 && armorIsWear) ||
                        (weapon.type === 'contact' && this.#getODAspect(actor, 'combat') >= 3 && armorIsWear))) {
                        dices += 2;
                    }
                    break;

                case 'ambidextre':
                    if(noMalusStyle) break;

                    if(this.#isEffetActive(effets, weapon.options, ['jumeleambidextrie', 'soeur', 'jumelageambidextrie']) &&
                    (
                        (weapon.type === 'distance' && this.#getODAspect(actor, 'tir') >= 4 && armorIsWear) ||
                        (weapon.type === 'contact' && this.#getODAspect(actor, 'combat') >= 4 && armorIsWear))
                    ) {
                        dices += 3;
                    }
                    else if((this.#isEffetActive(effets, weapon.options, ['jumeleambidextrie', 'soeur', 'jumelageambidextrie']) ||
                        (weapon.type === 'distance' && this.#getODAspect(actor, 'tir') >= 4 && armorIsWear) ||
                        (weapon.type === 'contact' && this.#getODAspect(actor, 'combat') >= 4 && armorIsWear))) {
                        dices += 2;
                    }
                    break;

                case 'defensif':
                    if(noMalusStyle) break;

                    if(this.#isEffetActive(effets, weapon.options, ['protectrice'])) {
                        dices += 2;
                    }
                    break;

                case 'acouvert':
                    if(noMalusStyle) break;

                    if(this.#isEffetActive(effets, weapon.options, ['tirensecurite', 'interfaceguidage'])) {
                        dices += 3;
                    }
                    break;

                case 'pilonnage':
                    if(this.#isEffetActive(effets, weapon.options, ['deuxmains', 'munitionshypervelocite', 'systemerefroidissement']) && weapon.type === 'distance') {
                        dataStyle = rollData.style.pilonnage;
                    }
                    break;

                case 'precis':
                    if(this.#isEffetActive(effets, weapon.options, ['deuxmains', 'munitionshypervelocite', 'systemerefroidissement']) && weapon.type === 'contact') {
                        dices += this.#getValueAspect(actor, rollData.style.precis.type);
                        carac.push(this.#getLabelRoll(rollData.style.precis.type));
                    }
                    break;

                case 'puissant':
                    if((this.#isEffetActive(effets, weapon.options, ['lourd']) || (this.#isEffetActive(effets, weapon.options, ['deuxmains']) && this.#isEffetActive(effets, weapon.options, ['munitionshypervelocite', 'systemerefroidissement']))) && weapon.type === 'contact') {
                        if(!noMalusStyle) dices -= Math.min(rollData.style.puissant.value, 6);

                        dataStyle = rollData.style.puissant;
                    }
                    break;

                case 'suppression':
                    if((this.#isEffetActive(effets, weapon.options, ['lourd']) || (this.#isEffetActive(effets, weapon.options, ['deuxmains']) && this.#isEffetActive(effets, weapon.options, ['munitionshypervelocite', 'systemerefroidissement']))) && weapon.type === 'distance') {
                        dataStyle = rollData.style.suppression;
                    }
                    break;
            }

            if(isModeHeroique) {
                weapon.effets.raw.push('modeheroique');

                weapon.options.push({
                    classes:'modeheroique',
                    active:true,
                });

                tags.push({
                    key:'modeheroique',
                    label:`${game.i18n.localize('KNIGHT.JETS.ModeHeroique')}`,
                });
            }

            if(armorIsWear && armor && isGhostActive) {
                if (((weapon.type === 'contact' && !this.#isEffetActive(effets, weapon.options, ['lumiere'])) || (weapon.type === 'distance' && (this.#isEffetActive(effets, weapon.options, ['silencieux']) || this.#isEffetActive(effets, weapon.options, ['munitionssubsoniques']) || this.#isEffetActive(effets, weapon.options, ['assassine']))))) {
                    ghost += this.#getValueAspect(actor, 'discretion');

                    if(!this.isPJ) ghost = Math.ceil(ghost/2);

                    odGhost += this.#getODAspect(actor, 'discretion');

                    flags['ghost'] = true;
                }

                if(isGhostActive && (capacitiesSelected?.ghost?.interruption?.actif ?? true)) {
                    updates['armure.system.capacites.selected.ghost.active.conflit'] = false;
                    updates['armure.system.capacites.selected.ghost.active.horsconflit'] = false;
                }
            }

            if(armorIsWear && isErsatzRogueActive && !isTourelle) {
                if((weapon.type === 'contact' && !this.#isEffetActive(effets, weapon.options, ['lumiere'])) || (weapon.type === 'distance' && (this.#isEffetActive(effets, weapon.options, ['silencieux']) || this.#isEffetActive(effets, weapon.options, ['munitionssubsoniques']) || this.#isEffetActive(effets, weapon.options, ['assassine'])))) {
                    ersatzghost += this.#getValueAspect(actor, dataErsatzRogue.attaque);

                    if(!this.isPJ) ersatzghost = Math.ceil(ersatzghost/2);

                    odErsatzghost += this.#getODAspect(actor, dataErsatzRogue.attaque);


                    flags['ersatzghost'] = {
                        id:dataErsatzRogue._id,
                        value:true,
                    };
                }
            }

            if((this.#isEffetActive(effets, weapon.options, ['munitionsdrones']))) {
                bonus.push(3);
            }

            if((this.#isEffetActive(effets, weapon.options, ['pointeurlaser']))) {
                dices += 3;
            }

            if((this.#isEffetActive(effets, weapon.options, ['cadence', 'chromeligneslumineuses']))) {
                dices -= 3;
            }

            if((this.#isEffetActive(effets, weapon.options, ['fatal']))) {
                dices -= 2;
            }

            if((this.#isEffetActive(effets, weapon.options, ['sournois']))) {
                isAttaqueSurprise = true;
            }

            if((this.#isEffetActive(effets, weapon.options, ['titanicide']))) {
                cout += 3;
            }

            if(this.actor.type === 'mechaarmure') {
                if(!this.#isEffetActive(effets, weapon.options, ['antivehicule'])) weapon.effets.raw.push('antivehicule');

                dices += this.actor.system.puissance.value;
            }

            const dgtsVariable = weapon.options.find(itm => itm.classes.includes('dgtsvariable') && itm.key === 'select');
            const violenceVariable = weapon.options.find(itm => itm.classes.includes('violencevariable') && itm.key === 'select');
            const dgtsBonusVariable = weapon.options.find(itm => itm.classes.includes('dgtsbonusvariable') && itm.key === 'select');
            const violenceBonusVariable = weapon.options.find(itm => itm.classes.includes('violencebonusvariable') && itm.key === 'select');
            const boost = weapon.options.find(itm => itm.classes.includes('boostsimple') && itm.key === 'duoselect');
            const boostdegats = weapon.options.find(itm => itm.classes.includes('boostdegats') && itm.key === 'select');
            const boostviolence = weapon.options.find(itm => itm.classes.includes('boostviolence') && itm.key === 'select');
            const findVariable = rollData?.allVariableWpn?.find(itm => itm.id === weaponID);

            if(dgtsVariable) {
                const dgtsVariableSelected = findVariable.degats;
                let coutDgts = 0;

                weapon.degats = {
                    dice:Number(dgtsVariableSelected),
                    fixe:dgtsVariable.selectvalue,
                }

                let v = 0;

                for(let l in dgtsVariable.list) {
                    coutDgts = v*dgtsVariable.value;
                    v++;
                    if(l == dgtsVariableSelected) break;
                }

                cout += coutDgts;
            }

            if(violenceVariable) {
                const violenceVariableSelected = findVariable.violence;
                let coutViolence = 0;

                weapon.violence = {
                    dice:Number(violenceVariableSelected),
                    fixe:violenceVariable.selectvalue,
                }
                let v = 0;

                for(let l in violenceVariable.list) {
                    coutViolence = v*violenceVariable.value;
                    v++;
                    if(l == violenceVariableSelected) break;
                }

                cout += coutViolence;
            }

            if(dgtsBonusVariable) {
                const dgtsVariableSelected = Number(findVariable?.modules?.find(itm => itm.id === dgtsBonusVariable.id)?.degats ?? 0);
                const dgtsList = dgtsBonusVariable?.list ?? {};
                let coutDgts = 0;

                let v = 0;
                for(let l in dgtsList) {
                    coutDgts = v*dgtsBonusVariable.value;
                    v++;
                    if(l == dgtsVariableSelected) break;
                }

                cout += coutDgts;
            }

            if(violenceBonusVariable) {
                const violenceVariableSelected = Number(findVariable?.modules?.find(itm => itm.id === dgtsBonusVariable.id)?.violence ?? 0);
                let coutViolence = 0;

                let v = 0;

                for(let l in violenceBonusVariable.list) {
                    coutViolence = v*violenceBonusVariable.value;
                    v++;
                    if(l == violenceVariableSelected) break;
                }

                cout += coutViolence;
            }

            if(boost) {
                const boostSelected = parseInt(boost.selected2);

                if(!weapon.id.includes('longbow')) cout += boostSelected*boost.value;
            }

            if(boostdegats) {
                const boostDegatsSelected = parseInt(boostdegats.selected);

                if(!weapon.id.includes('longbow')) cout += boostDegatsSelected*boostdegats.value;
            }

            if(boostviolence) {
                const boostViolenceSelected = parseInt(boostviolence.selected);

                if(!weapon.id.includes('longbow')) cout += boostViolenceSelected*boostviolence.value;
            }

            for(let c of custom) {
                const attaque = c.attaque;
                let add = false;

                if(attaque.jet) {
                    add = true;
                    dices += attaque.jet;
                }

                if(attaque.reussite) {
                    add = true;
                    bonus.push(attaque.reussite);
                }

                if(attaque.carac.jet) {
                    add = true;
                    dices += this.#getValueAspect(actor, attaque.carac.jet);

                    if(attaque.carac.odInclusJet && armorIsWear) dices += this.#getODAspect(actor, attaque.carac.jet);
                }

                if(attaque.carac.fixe) {
                    add = true;
                    bonus.push(this.#getValueAspect(actor, attaque.carac.fixe));

                    if(attaque.carac.odInclusFixe && armorIsWear) bonus.push(this.#getODAspect(actor, attaque.carac.fixe));
                }

                if(attaque.aspect.jet) {
                    add = true;
                    dices += this.#getValueAspect(actor, attaque.aspect.jet);

                    if(attaque.aspect.odInclusJet && armorIsWear) dices += this.#getODAspect(actor, attaque.aspect.jet);
                }

                if(attaque.aspect.fixe) {
                    add = true;
                    bonus.push(this.#getValueAspect(actor, attaque.aspect.fixe));

                    if(attaque.aspect.odInclusFixe && armorIsWear) bonus.push(this.#getODAspect(actor, attaque.aspect.fixe));
                }
            }

            if(this.#isEffetActive(effets, weapon.options, ['chargeur'])) {
                const isCapacite = /capacite_/.test(weapon.id) ? true : false;
                const isModule = /module_/.test(weapon.id) ? true : false;
                const getWpn = isCapacite || isModule ? this.actor.items.get(weapon.id.split('_')[1]) : this.actor.items.get(weapon.id);

                if(getWpn) {
                    if(isCapacite) {
                        if(!getWpn.system.hasMunition(weapon.id.split('_')[2], weapon)) {
                            doRoll = false;
                            msg = game.i18n.localize('KNIGHT.JETS.ChargeurVide');
                            classes = 'important';
                        }
                    } else if(isModule) {
                        if(!getWpn.system.hasMunition) {
                            doRoll = false;
                            msg = game.i18n.localize('KNIGHT.JETS.ChargeurVide');
                            classes = 'important';
                        }
                    } else if(!getWpn.system.hasMunition) {
                        doRoll = false;
                        msg = game.i18n.localize('KNIGHT.JETS.ChargeurVide');
                        classes = 'important';
                    }
                }

            }
        }

        if(modificateur !== 0) {
            dices += modificateur;

            tags.push({
                key:'modificateur',
                label:`${game.i18n.localize('KNIGHT.JETS.Modificateur')} : ${modificateur}`,
            });
        }

        if(succesBonus !== 0) {
            bonus.push(succesBonus);

            tags.push({
                key:'succesbonus',
                label:`${game.i18n.localize('KNIGHT.JETS.Succes')} : ${succesBonus}`,
            });
        }

        if(difficulte > 0) {
            tags.push({
                key:'difficulte',
                label:`${game.i18n.localize('KNIGHT.AUTRE.Difficulte')} : ${difficulte}`,
            });
        }

        if(isEquilibrerBalance) {
            tags.push({
                key:'equilibrerbalance',
                label:`${game.i18n.localize('KNIGHT.EFFETS.EQUILIBRERBALANCE.Label')}`,
            });
        }

        if(dices < 1) dices = 1;

        const depenseEnergie = this.#depenseEnergie(cout);

        if(cout > 0) {
            if(espoir > 0 && depenseEnergie.espoir) cout += espoir;

            tags.push({
                key:'energie',
                label:depenseEnergie.espoir ? `${game.i18n.localize('KNIGHT.JETS.Depenseespoir')} : ${depenseEnergie.depense}` : `${game.i18n.localize('KNIGHT.JETS.Depenseenergie')} : ${depenseEnergie.depense}`,
            });

            if(depenseEnergie.substract < 0) {
                doRoll = false
                msg = depenseEnergie.msg;
                classes = depenseEnergie.classes;
            }
            else {
                for (let key in depenseEnergie.update) {
                    updates[key] = depenseEnergie.update[key];
                }
            }
        }

        if(espoir > 0 && doRoll) {
            if(cout === 0 || (cout > 0 && !depenseEnergie.espoir)) {
                const depenseEspoir = this.#depenseEnergie(cout, true);
                tags.push({
                    key:'espoir',
                    label:`${game.i18n.localize('KNIGHT.JETS.Depenseespoir')} : ${depenseEspoir.depense}`,
                });

                if(depenseEspoir.substract < 0) {
                    doRoll = false
                    msg = depenseEspoir.msg;
                    classes = depenseEspoir.classes;
                }
                else updates = foundry.utils.mergeObject(updates, depenseEspoir.update);
            }
        }

        if(goliath > 0) {
            tags.push({
                key:'goliath',
                label:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.GOLIATH.Label')} : +${goliath}`,
            });

            bonus.push(goliath);
        }

        if(ghost > 0) {
            tags.push({
                key:'ghost',
                label:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.GHOST.Label')} : +${ghost}D6+${odGhost}`,
            });

            dices += ghost;
            bonus.push(odGhost);
        }

        if(ersatzghost > 0) {
            tags.push({
                key:'ersatzghost',
                label:`${dataErsatzRogue.name} : +${ersatzghost}D6+${odErsatzghost}`,
            });

            dices += ersatzghost;
            bonus.push(odErsatzghost);
        }

        if(isAttaqueSurprise) {
            tags.push({
                key:'attaquesurprise',
                label:`${game.i18n.localize('KNIGHT.JETS.AttackSurprise')}`,
            })
        }

        if(doRoll) {
            const exec = new game.knight.RollKnight(actor,
            {
            name:label,
            dices:`${dices}D6`,
            carac:carac,
            bonus:bonus,
            weapon,
            style:actor.type === 'vehicule' ? this.who.system.combat.style : actor.system.combat.style,
            tags:tags,
            surprise:isAttaqueSurprise,
            dataStyle:dataStyle,
            dataMod,
            maximize,
            difficulte,
            addFlags:flags,
            }).doRoll(updates).then(() => {
                if(armorIsWear && isErsatzRogueActive && !isTourelle) {
                    if(dataErsatzRogue.interruption.actif) {
                        switch(dataErsatzRogue.item.type) {
                            case 'module':
                                dataErsatzRogue.item.system.activate(false, '')
                                break;

                            case 'cyberware':
                                dataErsatzRogue.item.system.activate();
                                break;
                        }
                    }
                }
            });

        } else {
            const exec = new game.knight.RollKnight(actor,
            {
            name:label,
            }).sendMessage({
                text:msg,
                classes:classes,
            });

        }

        this.render(true);
    }

    #entraide(data) {
        const actor = this.actor;
        const rollData = this.rollData;
        const { difficulte, succesBonus, modificateur, label, base, whatRoll } = rollData;
        let carac = base ? [this.#getLabelRoll(base)] : [];
        let dices = this.#getValueAspect(actor, base);
        let bonus = [];
        let tags = [];

        if(modificateur > 0) {
            dices += modificateur;

            tags.push({
                key:'modificateur',
                label:`${game.i18n.localize('KNIGHT.JETS.Modificateur')} : ${modificateur}`,
            });
        }

        if(succesBonus > 0) {
            bonus.push(succesBonus);

            tags.push({
                key:'succesbonus',
                label:`${game.i18n.localize('KNIGHT.BONUS.Succes')} : ${succesBonus}`,
            });
        }

        const exec = new game.knight.RollKnight(actor,
        {
        name:label,
        dices:`${dices}D6`,
        carac:carac,
        bonus:bonus,
        style:actor.system.combat.style,
        tags:tags,
        exploit:false,
        }).doRoll();

        this.render(true);
    }

    #prepareButtons() {
        let results = {};

        switch(this.actor.type) {
            case 'knight':
                results = {
                    rollNormal: {
                      label: game.i18n.localize("KNIGHT.JETS.JetNormal"),
                      callback: async (data) => this.#roll(data),
                      icon: `<i class="fas fa-dice"></i>`
                    },
                    rollEntraide: {
                      label: game.i18n.localize("KNIGHT.JETS.JetEntraide"),
                      callback: async (data) => this.#entraide(data),
                      icon: `<i class="fas fa-dice-d6"></i>`
                    },
                    rollCancel: {
                      label: game.i18n.localize("KNIGHT.AUTRE.Annuler"),
                      icon: `<i class="fas fa-times"></i>`
                    }
                }
                break;

            case 'creature':
            case 'pnj':
            case 'bande':
            case 'vehicule':
            case 'mechaarmure':
                results = {
                    rollNormal: {
                      label: game.i18n.localize("KNIGHT.JETS.JetNormal"),
                      callback: async (data) => this.#roll(data),
                      icon: `<i class="fas fa-dice"></i>`
                    },
                    rollCancel: {
                      label: game.i18n.localize("KNIGHT.AUTRE.Annuler"),
                      icon: `<i class="fas fa-times"></i>`
                    }
                }
                break;
        }

        this.system.buttons = results;
    }

    #prepareTitle() {
        this.system.title = `${this.actor.name} : ${game.i18n.localize("KNIGHT.JETS.Label")}`;
    }

    #prepareMods() {
        const actor = this.who;
        const system = actor.system;
        const otherMods = system.otherMods;
        const otherModsDice = Object.values(otherMods).find(itm => itm?.type === 'rollDice');

        if(otherModsDice) this.rollData.modificateur += otherModsDice.value;
    }

    #prepareOptions() {
        const actor = this.who;
        const system = actor.system;
        const armorIsWear = this.armorIsWear ? true : false;
        const aspects = system.aspects;
        const isPJ = this.isPJ;

        let data = {
            label:this.rollData.label,
            mods:[],
        };

        let buttons = {
            key:'grpBtn',
            classes:'grpBtn colFiveSeven',
            grp:[],
        };

        let grpWpn = {
            key:'grpWpn',
            classes:'grpWpn',
            grp:[],
        }


        if(isPJ) {
            data.aspects = {};
            for(let a in aspects) {
                data.aspects[a] = {
                    label:game.i18n.localize(CONFIG.KNIGHT.aspects[a]),
                    caracteristiques:{},
                }

                for(let c in aspects[a].caracteristiques) {
                    let classes = ['btnCaracteristique', 'wHover', c];

                    data.aspects[a].caracteristiques[c] = {
                        label:game.i18n.localize(CONFIG.KNIGHT.caracteristiques[c]),
                        classes:classes.join(' '),
                        data:c,
                        value:armorIsWear ? `${aspects[a].caracteristiques[c].value} + ${aspects[a].caracteristiques[c].overdrive.value} ${game.i18n.localize('KNIGHT.ASPECTS.OD')}` : `${aspects[a].caracteristiques[c].value}`,
                    }
                }
            }
        } else {
            data.aspects = {};

            for(let a in aspects) {
                let classes = ['btnCaracteristique', 'wHover', a];

                data.aspects[a] = {
                    label:game.i18n.localize(CONFIG.KNIGHT.aspects[a]),
                    classes:classes.join(' '),
                    data:a,
                    value:`${aspects[a].value} + ${aspects[a].ae.mineur.value+aspects[a].ae.majeur.value}`,
                }
            }
        }

        //DIFFICULTE
        data.mods.push({
            key:'score',
            classes:'score difficulte colOne',
            path:'roll.difficulte',
            label:game.i18n.localize('KNIGHT.AUTRE.Difficulte'),
            value:this.rollData.difficulte,
            min:0
        });

        //SUCCES BONUS
        data.mods.push({
            key:'score',
            classes:'score succesBonus colTwo',
            path:'roll.succesBonus',
            label:`${game.i18n.localize('KNIGHT.JETS.Modificateur')} (${game.i18n.localize('KNIGHT.JETS.Succes')})`,
            value:this.rollData.succesBonus
        });

        //MODIFICATEUR
        data.mods.push({
            key:'score',
            classes:'score modificateur colThree',
            path:'roll.modificateur',
            label:`${game.i18n.localize('KNIGHT.JETS.Modificateur')} (${game.i18n.localize('KNIGHT.JETS.Des')})`,
            value:this.rollData?.modificateur ?? 0,
        });

        if(isPJ) {
            //STYLES
            data.mods.push({
                key:'select',
                classes:'style selectWithInfo',
                label:game.i18n.localize('KNIGHT.COMBAT.STYLES.Label'),
                selected:system.combat.style,
                info:game.i18n.localize(CONFIG.KNIGHT.styles[system.combat.style]),
                list:CONFIG.KNIGHT.LIST.style,
            });

            data.mods.push({
                key:'selectWithScore',
                classes:'pilonnage colTwoFive',
                selectPath:`roll.style.pilonnage.type`,
                valuePath:`roll.style.pilonnage.value`,
                label:`${game.i18n.localize('KNIGHT.COMBAT.STYLES.PILONNAGE.FullLabel')}`,
                select:{
                    selected:system.combat.data.type,
                    list:{
                        'degats':'KNIGHT.AUTRE.Degats',
                        'violence':'KNIGHT.AUTRE.Violence',
                    }
                },
                score:{
                    label:`${game.i18n.localize('KNIGHT.COMBAT.STYLES.PILONNAGE.Tourspasses')}`,
                    value:system.combat.data.tourspasses,
                    min:0,
                }
            });

            this.rollData.style.pilonnage.type = system.combat.data.type;
            this.rollData.style.pilonnage.value = system.combat.data.tourspasses;

            data.mods.push({
                key:'select',
                classes:'precis',
                path:`roll.style.precis.type`,
                label:`${game.i18n.localize('KNIGHT.COMBAT.STYLES.PRECIS.FullLabel')}`,
                selected:'',
                hasBlank:true,
                list:{
                    'dexterite':CONFIG.KNIGHT.caracteristiques.dexterite,
                    'savoir':CONFIG.KNIGHT.caracteristiques.savoir,
                    'instinct':CONFIG.KNIGHT.caracteristiques.instinct,
                    'sangFroid':CONFIG.KNIGHT.caracteristiques.sangFroid,
                }
            });

            data.mods.push({
                key:'selectWithScore',
                classes:'puissant colTwoFive',
                selectPath:`roll.style.puissant.type`,
                valuePath:`roll.style.puissant.value`,
                label:`${game.i18n.localize('KNIGHT.COMBAT.STYLES.PUISSANT.FullLabel')}`,
                select:{
                    selected:'degats',
                    list:{
                        'degats':'KNIGHT.AUTRE.Degats',
                        'violence':'KNIGHT.AUTRE.Violence',
                    }
                },
                score:{
                    label:`${game.i18n.localize('KNIGHT.COMBAT.STYLES.PUISSANT.Sacrifice')}`,
                    value:0,
                    min:0,
                }
            });

            data.mods.push({
                key:'selectWithScore',
                classes:'suppression colTwoFive',
                selectPath:`roll.style.suppression.type`,
                valuePath:`roll.style.suppression.value`,
                label:`${game.i18n.localize('KNIGHT.COMBAT.STYLES.SUPPRESSION.FullLabel')}`,
                select:{
                    selected:'degats',
                    list:{
                        'degats':'KNIGHT.AUTRE.Degats',
                        'violence':'KNIGHT.AUTRE.Violence',
                    }
                },
                score:{
                    label:`${game.i18n.localize('KNIGHT.COMBAT.STYLES.SUPPRESSION.Sacrifice')}`,
                    value:0,
                    min:0,
                }
            });

            //ON PREPARE LE TOTEM (ON VERRA PLUS TARD SI ON AFFICHE)
            for(let i = 0;i < this.nbreTotemTotal;i++) {
                data.mods.push({
                    key:'select',
                    classes:`totem totem${i} rowSixSeven`,
                    path:`roll.totem.t${i}`,
                    label:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.TOTEM.Totem')} ${i+1}`,
                    selected:'',
                    hasBlank:true,
                    list:CONFIG.KNIGHT.caracteristiques,
                });
            }

            for(let i = 0;i < this.nbreTotemLTotal;i++) {
                data.mods.push({
                    key:'select',
                    classes:`totem totemL${i} rowSixSeven`,
                    path:`roll.totemL.t${i}`,
                    label:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.TOTEM.Totem')} ${i+1}`,
                    selected:'',
                    hasBlank:true,
                    list:CONFIG.KNIGHT.caracteristiques,
                });
            }
        }

        //MODIFICATEUR AUX DEGATS
        data.mods.push({
            key:'scoredice',
            name:'roll.moddegats',
            classes:'scoredice modificateurdegats colOne',
            label:game.i18n.localize('KNIGHT.JETS.ModificateurDegats'),
            dice:this.rollData?.moddegats?.dice ?? 0,
            value:this.rollData?.moddegats?.value ?? 0,
        });

        //MODIFICATEUR A LA VIOLENCE
        data.mods.push({
            key:'scoredice',
            name:'roll.modviolence',
            classes:'scoredice modificateurviolence colTwo',
            label:game.i18n.localize('KNIGHT.JETS.ModificateurViolence'),
            dice:this.rollData?.modviolence?.dice ?? 0,
            value:this.rollData?.modviolence?.value ?? 0,
        });

        if(isPJ) {
            //BOUTON SANS OD
            buttons.grp.push({
                key:'btn',
                name:'nood',
                action:'toggle',
                classes:'btn withoutod',
                btnclasses:'btn withoutod',
                label:game.i18n.localize('KNIGHT.JETS.NoOd'),
            });
        }

        //BOUTON ATTAQUE SURPRISE
        buttons.grp.push({
            key:'btn',
            name:'attaquesurprise',
            action:'toggle',
            classes:'btn attaquesurprise',
            btnclasses:'btn attaquesurprise',
            label:game.i18n.localize('KNIGHT.JETS.AttackSurprise'),
        });

        //BOUTON MAXIMISER LES DEGATS
        buttons.grp.push({
            key:'btn',
            name:'maximizedegats',
            action:'toggle',
            classes:'btn maximizedegats',
            btnclasses:'btn maximizedegats',
            label:game.i18n.localize('KNIGHT.JETS.MaximizeDegats'),
        })

        //BOUTON MAXIMISER LA VIOLENCE
        buttons.grp.push({
            key:'btn',
            name:'maximizeviolence',
            action:'toggle',
            classes:'btn maximizeviolence',
            btnclasses:'btn maximizeviolence',
            label:game.i18n.localize('KNIGHT.JETS.MaximizeViolence'),
        });

        //BOUTON MODE HEROIQUE
        buttons.grp.push({
            key:'btn',
            name:'modeheroique',
            action:'toggle',
            classes:'btn modeheroique',
            btnclasses:'btn modeheroique',
            label:game.i18n.localize('KNIGHT.JETS.ModeHeroique'),
        });

        //BOUTON ÉQUILIBRER LA BALANCE
        if(game.settings.get('knight', 'advcampaign') && this.actor.items.find(itm =>
            itm.type === 'avantage' &&
            itm.system.type === 'standard' &&
            (
              itm.system.bonus?.equilibrerBalance
            )
          )) {
            buttons.grp.push({
                key:'btn',
                name:'equilibrerbalance',
                action:'toggle',
                classes:'btn equilibrerbalance',
                btnclasses:'btn equilibrerbalance',
                label:game.i18n.localize('KNIGHT.EFFETS.EQUILIBRERBALANCE.Label'),
            });

            this.rollData.btn.equilibrerbalance = true;
        }

        //ON AJOUTE LE GROUPE BOUTON S'IL Y A DES BOUTONS
        if(buttons.grp.length > 0) data.mods.push(buttons);

        //ARMES
        const wpns = this.#prepareWpn();
        this.rollData.allWpn = this.rollData.typeWpn.contact.concat(this.rollData.typeWpn.distance, this.rollData.typeWpn.tourelle, this.rollData.typeWpn.aicontact, this.rollData.typeWpn.aidistance, this.rollData.typeWpn.grenade, this.rollData.typeWpn.complexe);

        grpWpn.grp.push({
            key:'wpn',
            classes:'wpn contact colOne wpncontact',
            label:game.i18n.localize('KNIGHT.COMBAT.ARMES.CONTACT.Label'),
            list:this.rollData.typeWpn.contact,
        });

        grpWpn.grp.push({
            key:'wpn',
            classes:'wpn distance colTwo wpndistance',
            label:game.i18n.localize('KNIGHT.COMBAT.ARMES.DISTANCE.Label'),
            list:this.rollData.typeWpn.distance,
        });

        grpWpn.grp.push({
            key:'complexe',
            classes:'wpn complexe allCol',
            label:wpns.complexeLabel ? wpns.complexeLabel : game.i18n.localize('KNIGHT.ARMURE.Label'),
            list:this.rollData.typeWpn.complexe,
        });

        grpWpn.grp.push({
            key:'wpn',
            classes:'wpn distance colDuo grenade',
            label:game.i18n.localize('KNIGHT.COMBAT.GRENADES.Label'),
            list:this.rollData.typeWpn.grenade,
        });

        grpWpn.grp.push({
            key:'wpn',
            classes:'wpn distance colDuo tourelle',
            label:game.i18n.localize('KNIGHT.COMBAT.ARMES.TOURELLE.Label'),
            list:this.rollData.typeWpn.tourelle,
        });

        data.mods.push({
            key:'info',
            classes:'specialInfo rowTwo colTwoFive',
        })

        if(this.actor.type === 'mechaarmure') {
            grpWpn.grp.push({
                key:'wpn',
                classes:'wpn contact colOne aicontact',
                label:game.i18n.localize('KNIGHT.COMBAT.ARMESIMPROVISEES.LabelContact'),
                list:this.rollData.typeWpn.aicontact,
            });

            grpWpn.grp.push({
                key:'wpn',
                classes:'wpn distance colTwo aidistance',
                label:game.i18n.localize('KNIGHT.COMBAT.ARMESIMPROVISEES.LabelDistance'),
                list:this.rollData.typeWpn.aidistance,
            });
        }
        else {
            grpWpn.grp.push({
                key:'wpn',
                classes:'wpn contact colOne aicontact',
                label:game.i18n.localize('KNIGHT.COMBAT.ARMESIMPROVISEES.LabelContact'),
                list:wpns.listaicontact,
            });

            grpWpn.grp.push({
                key:'wpn',
                classes:'wpn distance colTwo aidistance',
                label:game.i18n.localize('KNIGHT.COMBAT.ARMESIMPROVISEES.LabelDistance'),
                list:wpns.listaidistance,
            });
        }


        //ON AJOUTE LE GROUPE WPN S'IL Y A DES ARMES
        if(grpWpn.grp.length > 0) data.mods.push(grpWpn);

        return data;
    }

    #prepareWpn() {
        const actor = this.actor;
        const type = actor.type;
        const isPJ = this.isPJ;
        const wearArmor = this.armorIsWear || type === 'vehicule' || !isPJ ? true : false;
        const items = actor.items;
        const armure = items.find(itm => itm.type === 'armure');
        const weapons = items.filter(itm => itm.type == 'arme' && (itm.system.equipped || itm.system.tourelle.has || !isPJ || itm.system.whoActivate === this.system.whoActivate));
        const modules = this.#getWpnModules(items, type, this.system.whoActivate);
        const modulesContact = this.#getBonusModulesByType(actor, type, 'contact', this.system.whoActivate);
        const modulesDistance = this.#getBonusModulesByType(actor, type, 'distance', this.system.whoActivate);
        const cyberwareContact = this.#getBonusCyberwareByType(actor, 'contact');
        const cyberwareDistance = this.#getBonusCyberwareByType(actor, 'distance');
        const cyberware = this.#getWpnCyberware(items);
        const armesImprovisees = actor.system?.combat?.armesimprovisees?.liste ?? {};
        const grenades = actor.system?.combat?.grenades?.liste ?? {};
        const capacites = armure ? armure.system?.capacites?.selected ?? {} : {};
        const pnjCapacites = items.filter(itm => itm.type == 'capacite' && itm.system.attaque.has);
        const configurationMechaArmure = actor.system?.configurations?.actuel ?? 'c1';
        const modulesMechaArmure = actor.system?.configurations?.liste ?? {};
        const listeModulesMechaArmure = configurationMechaArmure === 'c1' ? foundry.utils.mergeObject(foundry.utils.deepClone(modulesMechaArmure?.base?.modules ?? {}), modulesMechaArmure?.c1?.modules ?? {}) : foundry.utils.mergeObject(foundry.utils.deepClone(modulesMechaArmure?.base?.modules ?? {}), modulesMechaArmure?.c2?.modules ?? {});
        const labels = getAllEffects();
        const actGrenade = actor.system?.combat?.grenades?.quantity?.value ?? 0;
        let contact = [];
        let distance = [];
        let aicontact = [];
        let aidistance = [];
        let listaicontact = [];
        let listaidistance = [];
        let grenade = [];
        let complexe = [];
        let tourelle = [];

        let bonusContact = {
            degats:{
                dice:0,
                fixe:0,
                titleDice:[],
                titleFixe:[],
            },
            violence:{
                dice:0,
                fixe:0,
                titleDice:[],
                titleFixe:[],
            },
            options:[],
        }
        let bonusDistance = {
            degats:{
                dice:0,
                fixe:0,
                titleDice:[],
                titleFixe:[],
            },
            violence:{
                dice:0,
                fixe:0,
                titleDice:[],
                titleFixe:[],
            },
            options:[],
        }

        if(wearArmor) {
            for(let m of modulesContact) {
                const dataM = m.system.niveau.actuel.bonus;

                if(dataM.violence.has) {
                    if(dataM.violence.variable.has) {
                        const dataMVV = dataM.violence.variable;
                        const list = {
                            0:`0${game.i18n.localize('KNIGHT.JETS.Des-short')}6`
                        };
                        let classes = [];

                        for (let i = dataMVV.min.dice; i <= dataMVV.max.dice; i++) {
                            list[i] = dataMVV?.min?.fixe ?? 0 ? `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6+${dataMVV.min.fixe}` : `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
                        }

                        classes.push('selectDouble', 'violencebonusvariable');

                        if(!dataM?.degats?.variable?.has ?? false) classes.push('full');

                        bonusContact.options.push({
                            key:'select',
                            id:m.id,
                            name:m.name,
                            classes:classes.join(' '),
                            label:`${m.name} : ${game.i18n.localize('KNIGHT.AUTRE.Violence')}`,
                            list:list,
                            selected:dataMVV.min.dice,
                            value:dataMVV?.cout ?? 0,
                            selectvalue:Math.max(dataMVV?.min?.fixe ?? 0, dataMVV?.max?.fixe ?? 0),
                        });
                    } else {
                        bonusContact.violence.dice += dataM.violence.dice;
                        bonusContact.violence.fixe += dataM.violence.fixe;
                        if(dataM.violence.dice > 0) bonusContact.violence.titleDice.push(m.name);
                        if(dataM.violence.fixe > 0) bonusContact.violence.titleFixe.push(m.name);
                    }
                }

                if(dataM.degats.has) {
                    if(dataM.degats.variable.has) {
                        const dataMDV = dataM.degats.variable;
                        const list = {
                            0:`0${game.i18n.localize('KNIGHT.JETS.Des-short')}6`
                        };
                        let classes = [];

                        for (let i = dataMDV.min.dice; i <= dataMDV.max.dice; i++) {
                            list[i] = dataMDV?.min?.fixe ?? 0 ? `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6+${dataMDV.min.fixe}` : `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
                        }

                        classes.push('selectDouble', 'dgtsbonusvariable');

                        if(!dataM?.violence?.variable?.has ?? false) classes.push('full');

                        bonusContact.options.push({
                            key:'select',
                            id:m.id,
                            classes:classes.join(' '),
                            name:m.name,
                            label:`${m.name} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}`,
                            list:list,
                            selected:dataMDV.min.dice,
                            value:dataMDV?.cout ?? 0,
                            selectvalue:Math.max(dataMDV?.min?.fixe ?? 0, dataMDV?.max?.fixe ?? 0),
                        });
                    } else {
                        bonusContact.degats.dice += dataM.degats.dice;
                        bonusContact.degats.fixe += dataM.degats.fixe;
                        if(dataM.degats.dice > 0) bonusContact.degats.titleDice.push(m.name);
                        if(dataM.degats.fixe > 0) bonusContact.degats.titleFixe.push(m.name);
                    }
                }

            }

            for(let m of modulesDistance) {
                const dataM = m.system.niveau.actuel.bonus;

                if(dataM.violence.has) {
                    if(dataM.violence.variable.has) {
                        const dataMVV = dataM.violence.variable;
                        const list = {};
                        let classes = [];

                        for (let i = dataMVV.min.dice; i <= dataMVV.max.dice; i++) {
                            list[i] = dataMVV?.min?.fixe ?? 0 ? `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6+${dataMVV.min.fixe}` : `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
                        }

                        classes.push('selectDouble', 'violencebonusvariable');

                        if(!dataM?.degats?.variable?.has ?? false) classes.push('full');

                        bonusDistance.options.push({
                            key:'select',
                            id:m.id,
                            name:m.name,
                            classes:classes.join(' '),
                            label:`${m.name} : ${game.i18n.localize('KNIGHT.AUTRE.Violence')}`,
                            list:list,
                            selected:0,
                            value:dataMVV?.cout ?? 0,
                            selectvalue:Math.max(dataMVV?.min?.fixe ?? 0, dataMVV?.max?.fixe ?? 0),
                        });
                    } else {
                        bonusDistance.violence.dice += dataM.violence.dice;
                        bonusDistance.violence.fixe += dataM.violence.fixe;
                        if(dataM.violence.dice > 0) bonusDistance.violence.titleDice.push(m.name);
                        if(dataM.violence.fixe > 0) bonusDistance.violence.titleFixe.push(m.name);
                    }
                }

                if(dataM.degats.has) {
                    if(dataM.degats.variable.has) {
                        const dataMDV = dataM.degats.variable;
                        const list = {};
                        let classes = [];

                        for (let i = dataMDV.min.dice; i <= dataMDV.max.dice; i++) {
                            list[i] = dataMDV?.min?.fixe ?? 0 ? `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6+${dataMDV.min.fixe}` : `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
                        }

                        classes.push('selectDouble', 'dgtsbonusvariable');

                        if(!dataM?.violence?.variable?.has ?? false) classes.push('full');

                        bonusDistance.options.push({
                            key:'select',
                            id:m.id,
                            classes:classes.join(' '),
                            name:m.name,
                            label:`${m.name} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}`,
                            list:list,
                            selected:0,
                            value:dataMDV?.cout ?? 0,
                            selectvalue:Math.max(dataMDV?.min?.fixe ?? 0, dataMDV?.max?.fixe ?? 0),
                        });
                    } else {
                        bonusDistance.degats.dice += dataM.degats.dice;
                        bonusDistance.degats.fixe += dataM.degats.fixe;
                        if(dataM.degats.dice > 0) bonusDistance.degats.titleDice.push(m.name);
                        if(dataM.degats.fixe > 0) bonusDistance.degats.titleFixe.push(m.name);
                    }
                }
            }
        }

        for(let m of cyberwareContact) {
            const dataM = m.system;

            if(dataM.violence.has) {
                if(
                    (dataM.violence.withMetaArmure) ||
                    (!dataM.violence.withMetaArmure && !wearArmor)) {
                    if(dataM.violence.variable.has) {
                        const dataMVV = dataM.violence.variable;
                        const list = {
                            0:`0${game.i18n.localize('KNIGHT.JETS.Des-short')}6`
                        };
                        let classes = [];

                        for (let i = dataMVV.min.dice; i <= dataMVV.max.dice; i++) {
                            list[i] = dataMVV?.min?.fixe ?? 0 ? `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6+${dataMVV.min.fixe}` : `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
                        }

                        classes.push('selectDouble', 'violencebonusvariable');

                        if(!dataM?.degats?.variable?.has ?? false) classes.push('full');

                        bonusContact.options.push({
                            key:'select',
                            id:m.id,
                            name:m.name,
                            classes:classes.join(' '),
                            label:`${m.name} : ${game.i18n.localize('KNIGHT.AUTRE.Violence')}`,
                            list:list,
                            selected:0,
                            value:dataMVV?.cout ?? 0,
                            selectvalue:Math.max(dataMVV?.min?.fixe ?? 0, dataMVV?.max?.fixe ?? 0),
                        });
                    } else {
                        bonusContact.violence.dice += dataM.violence.dice;
                        bonusContact.violence.fixe += dataM.violence.fixe;
                        if(dataM.violence.dice > 0) bonusContact.violence.titleDice.push(m.name);
                        if(dataM.violence.fixe > 0) bonusContact.violence.titleFixe.push(m.name);
                    }
                }
            }

            if(dataM.degats.has) {
                if(
                    (dataM.degats.withMetaArmure) ||
                    (!dataM.degats.withMetaArmure && !wearArmor)) {
                    if(dataM.degats.variable.has) {
                        const dataMDV = dataM.degats.variable;
                        const list = {
                            0:`0${game.i18n.localize('KNIGHT.JETS.Des-short')}6`
                        };
                        let classes = [];

                        for (let i = dataMDV.min.dice; i <= dataMDV.max.dice; i++) {
                            list[i] = dataMDV?.min?.fixe ?? 0 ? `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6+${dataMDV.min.fixe}` : `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
                        }

                        classes.push('selectDouble', 'dgtsbonusvariable');

                        if(!dataM?.violence?.variable?.has ?? false) classes.push('full');

                        bonusContact.options.push({
                            key:'select',
                            id:m.id,
                            classes:classes.join(' '),
                            name:m.name,
                            label:`${m.name} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}`,
                            list:list,
                            selected:0,
                            value:dataMDV?.cout ?? 0,
                            selectvalue:Math.max(dataMDV?.min?.fixe ?? 0, dataMDV?.max?.fixe ?? 0),
                        });
                    } else {
                        bonusContact.degats.dice += dataM.degats.dice;
                        bonusContact.degats.fixe += dataM.degats.fixe;
                        if(dataM.degats.dice > 0) bonusContact.degats.titleDice.push(m.name);
                        if(dataM.degats.fixe > 0) bonusContact.degats.titleFixe.push(m.name);
                    }
                }
            }

        }

        for(let m of cyberwareDistance) {
            const dataM = m.system;

            if(dataM.violence.has) {
                if(dataM.violence.variable.has) {
                    const dataMVV = dataM.violence.variable;
                    const list = {
                        0:`0${game.i18n.localize('KNIGHT.JETS.Des-short')}6`
                    };
                    let classes = [];

                    for (let i = dataMVV.min.dice; i <= dataMVV.max.dice; i++) {
                        list[i] = dataMVV?.min?.fixe ?? 0 ? `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6+${dataMVV.min.fixe}` : `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
                    }

                    classes.push('selectDouble', 'violencebonusvariable');

                    if(!dataM?.degats?.variable?.has ?? false) classes.push('full');

                    bonusDistance.options.push({
                        key:'select',
                        id:m.id,
                        name:m.name,
                        classes:classes.join(' '),
                        label:`${m.name} : ${game.i18n.localize('KNIGHT.AUTRE.Violence')}`,
                        list:list,
                        selected:0,
                        value:dataMVV?.cout ?? 0,
                        selectvalue:Math.max(dataMVV?.min?.fixe ?? 0, dataMVV?.max?.fixe ?? 0),
                    });
                } else {
                    bonusDistance.violence.dice += dataM.violence.dice;
                    bonusDistance.violence.fixe += dataM.violence.fixe;
                    if(dataM.violence.dice > 0) bonusDistance.violence.titleDice.push(m.name);
                    if(dataM.violence.fixe > 0) bonusDistance.violence.titleFixe.push(m.name);
                }
            }

            if(dataM.degats.has) {
                if(dataM.degats.variable.has) {
                    const dataMDV = dataM.degats.variable;
                    const list = {
                        0:`0${game.i18n.localize('KNIGHT.JETS.Des-short')}6`
                    };
                    let classes = [];

                    for (let i = dataMDV.min.dice; i <= dataMDV.max.dice; i++) {
                        list[i] = dataMDV?.min?.fixe ?? 0 ? `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6+${dataMDV.min.fixe}` : `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
                    }

                    classes.push('selectDouble', 'dgtsbonusvariable');

                    if(!dataM?.violence?.variable?.has ?? false) classes.push('full');

                    bonusDistance.options.push({
                        key:'select',
                        id:m.id,
                        classes:classes.join(' '),
                        name:m.name,
                        label:`${m.name} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}`,
                        list:list,
                        selected:0,
                        value:dataMDV?.cout ?? 0,
                        selectvalue:Math.max(dataMDV?.min?.fixe ?? 0, dataMDV?.max?.fixe ?? 0),
                    });
                } else {
                    bonusDistance.degats.dice += dataM.degats.dice;
                    bonusDistance.degats.fixe += dataM.degats.fixe;
                    if(dataM.degats.dice > 0) bonusDistance.degats.titleDice.push(m.name);
                    if(dataM.degats.fixe > 0) bonusDistance.degats.titleFixe.push(m.name);
                }
            }
        }

        for(let wpn of weapons) {
            const system = wpn.system;

            if(system.type === 'contact') contact.push(this.#addWpnContact(wpn, bonusContact));
            else if(system.type === 'distance' && (system?.tourelle?.has ?? false)) tourelle.push(this.#addWpnDistance(wpn, {}, false));
            else if(system.type === 'distance') distance.push(this.#addWpnDistance(wpn, bonusDistance));
        }

        for(let ai in armesImprovisees) {
            const system = armesImprovisees[ai];

            if(actor.type === 'mechaarmure') {
                for(let list in system.liste) {
                    aicontact.push(this.#addWpnContact({
                        name:game.i18n.localize(CONFIG.KNIGHT.armesimprovisees[ai][list]),
                        id:`${ai}${list}c`,
                        system:{
                            type:'contact',
                            options:[],
                            degats:{
                                dice:system.liste[list].degats.dice,
                                fixe:0
                            },
                            violence:{
                                dice:system.liste[list].violence.dice,
                                fixe:0
                            },
                            effets:{
                                raw:[],
                                custom:[],
                            },
                        }
                    }, {}));

                    aidistance.push(this.#addWpnDistance({
                        name:game.i18n.localize(CONFIG.KNIGHT.armesimprovisees[ai][list]),
                        id:`${ai}${list}d`,
                        system:{
                            type:'distance',
                            options:[],
                            degats:{
                                dice:system.liste[list].degats.dice,
                                fixe:0
                            },
                            violence:{
                                dice:system.liste[list].violence.dice,
                                fixe:0
                            },
                            effets:{
                                raw:[],
                                custom:[],
                            },
                        }
                    }, {}));
                }

            }
            else {
                let maindataC = {
                    label:isPJ ? `${game.i18n.localize('KNIGHT.COMBAT.ARMESIMPROVISEES.ODForce')} ${system.force}` : `${game.i18n.localize('KNIGHT.COMBAT.ARMESIMPROVISEES.Chair')} ${system.chair.join(' / ')}`,
                    id:ai,
                    list:[],
                }

                let maindataD = {
                    label:isPJ ? `${game.i18n.localize('KNIGHT.COMBAT.ARMESIMPROVISEES.ODForce')} ${system.force}` : `${game.i18n.localize('KNIGHT.COMBAT.ARMESIMPROVISEES.Chair')} ${system.chair.join(' / ')}`,
                    id:ai,
                    list:[],
                }

                for(let list in system.liste) {
                    let dataC = {
                        label:game.i18n.localize(CONFIG.KNIGHT.armesimprovisees[ai][list]),
                        action:'weapon',
                        classes:'btnWpn',
                        type:'contact',
                        id:`${ai}${list}c`,
                        options:[],
                        degats:{
                            addchair:true,
                            dice:system.liste[list].degats.dice,
                            fixe:0
                        },
                        violence:{
                            dice:system.liste[list].violence.dice,
                            fixe:0
                        },
                        effets:{
                            raw:[],
                            custom:[],
                        },
                    };

                    let dataD = {
                        label:game.i18n.localize(CONFIG.KNIGHT.armesimprovisees[ai][list]),
                        action:'weapon',
                        classes:'btnWpn',
                        type:'distance',
                        id:`${ai}${list}d`,
                        options:[],
                        degats:{
                            dice:system.liste[list].degats.dice,
                            fixe:0
                        },
                        violence:{
                            dice:system.liste[list].violence.dice,
                            fixe:0
                        },
                        effets:{
                            raw:[],
                            custom:[],
                        },
                    }

                    aicontact.push(dataC);
                    aidistance.push(dataD);

                    maindataC.list.push(dataC);
                    maindataD.list.push(dataD);
                }

                listaicontact.push(maindataC);
                listaidistance.push(maindataD);
            }
        }

        if(actGrenade > 0) {
            const listeBonusGrenade = actor.items.filter(itm =>
                itm?.type === 'module'
                && (itm?.system?.niveau?.actuel?.bonus?.has ?? false)
                && (itm?.system?.niveau?.actuel?.bonus?.grenades?.has ?? false));

            const bonusGrenade = listeBonusGrenade.map(itm => itm?.system?.niveau?.actuel?.bonus?.grenades?.liste);

            for(let g in grenades) {
                const system = grenades[g];

                let wpn = {};

                if(system.custom) wpn.name = system.label;
                else wpn.name = game.i18n.localize(CONFIG.KNIGHT.grenades[g]);

                for(let b of bonusGrenade) {
                    let d = 0;
                    let v = 0;

                    d = b?.[g]?.degats?.dice ?? 0
                    v = b?.[g]?.violence?.dice ?? 0

                    system.degats.dice += parseInt(d);
                    system.violence.dice += parseInt(v);
                }

                wpn.system = system;
                wpn.id = `grenade_${g}`;

                grenade.push(this.#addWpnDistance(wpn, bonusDistance));
            }
        }

        if(wearArmor) {
            for(let m of modules) {
                const system = m.system.niveau.actuel.arme;
                let wpn = {
                    name:m.name,
                    system:system,
                    id:`module_${m.id}`
                };

                if(system.type === 'contact') contact.push(this.#addWpnContact(wpn, bonusContact, false));
                else if(system.type === 'distance') distance.push(this.#addWpnDistance(wpn, bonusDistance, false));
            }

            for(let c in capacites) {
                const dataC = capacites[c];
                let systemC = {}
                let systemD = {}

                switch(c) {
                    case 'borealis':
                        systemC = {
                            degats:{
                                dice:dataC.offensif.degats.dice,
                                fixe:0
                            },
                            violence:{
                                dice:dataC.offensif.violence.dice,
                                fixe:0,
                            },
                            type:'contact',
                            effets:{
                                raw:dataC.offensif.effets.raw,
                                custom:dataC.offensif.effets.custom,
                            },
                            energie:dataC.offensif.energie,
                            portee:dataC.offensif.portee,
                        }

                        systemD = {
                            degats:{
                                dice:dataC.offensif.degats.dice,
                                fixe:0
                            },
                            violence:{
                                dice:dataC.offensif.violence.dice,
                                fixe:0,
                            },
                            type:'distance',
                            effets:{
                                raw:dataC.offensif.effets.raw,
                                custom:dataC.offensif.effets.custom,
                            },
                            energie:dataC.offensif.energie,
                            portee:dataC.offensif.portee,
                        }

                        let wpnC = {
                            name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.OFFENSIF.Label')}`,
                            system:systemC,
                            id:`capacite_${armure.id}_${c}C`
                        };

                        let wpnD = {
                            name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.OFFENSIF.Label')}`,
                            system:systemD,
                            id:`capacite_${armure.id}_${c}D`
                        };

                        contact.push(this.#addWpnContact(wpnC, bonusContact));
                        distance.push(this.#addWpnDistance(wpnD, bonusDistance));
                        break;

                    case 'cea':
                        let systemVagueC = {
                            degats:{
                                dice:dataC.vague.degats.dice,
                                fixe:0
                            },
                            violence:{
                                dice:dataC.vague.violence.dice,
                                fixe:0,
                            },
                            type:'contact',
                            effets:{
                                raw:dataC.vague.effets.raw,
                                custom:dataC.vague.effets.custom,
                            },
                            energie:dataC.energie,
                            espoir:dataC.espoir,
                            portee:dataC.vague.portee,
                        }

                        let systemVagueD = {
                            degats:{
                                dice:dataC.vague.degats.dice,
                                fixe:0
                            },
                            violence:{
                                dice:dataC.vague.violence.dice,
                                fixe:0,
                            },
                            type:'distance',
                            effets:{
                                raw:dataC.vague.effets.raw,
                                custom:dataC.vague.effets.custom,
                            },
                            energie:dataC.energie,
                            espoir:dataC.espoir,
                            portee:dataC.vague.portee,
                        }

                        let systemSalveC = {
                            degats:{
                                dice:dataC.salve.degats.dice,
                                fixe:0
                            },
                            violence:{
                                dice:dataC.salve.violence.dice,
                                fixe:0,
                            },
                            type:'contact',
                            effets:{
                                raw:dataC.salve.effets.raw,
                                custom:dataC.salve.effets.custom,
                            },
                            energie:dataC.energie,
                            espoir:dataC.espoir,
                            portee:dataC.salve.portee,
                        }

                        let systemSalveD = {
                            degats:{
                                dice:dataC.salve.degats.dice,
                                fixe:0
                            },
                            violence:{
                                dice:dataC.salve.violence.dice,
                                fixe:0,
                            },
                            type:'distance',
                            effets:{
                                raw:dataC.salve.effets.raw,
                                custom:dataC.salve.effets.custom,
                            },
                            energie:dataC.energie,
                            espoir:dataC.espoir,
                            portee:dataC.salve.portee,
                        }

                        let systemRayonC = {
                            degats:{
                                dice:dataC.rayon.degats.dice,
                                fixe:0
                            },
                            violence:{
                                dice:dataC.rayon.violence.dice,
                                fixe:0,
                            },
                            type:'contact',
                            effets:{
                                raw:dataC.rayon.effets.raw,
                                custom:dataC.rayon.effets.custom,
                            },
                            energie:dataC.energie,
                            espoir:dataC.espoir,
                            portee:dataC.rayon.portee,
                        }

                        let systemRayonD = {
                            degats:{
                                dice:dataC.rayon.degats.dice,
                                fixe:0
                            },
                            violence:{
                                dice:dataC.rayon.violence.dice,
                                fixe:0,
                            },
                            type:'distance',
                            effets:{
                                raw:dataC.rayon.effets.raw,
                                custom:dataC.rayon.effets.custom,
                            },
                            energie:dataC.energie,
                            espoir:dataC.espoir,
                            portee:dataC.rayon.portee,
                        }

                        this.#updatePassiveUltime(items, 'vague', systemVagueC);
                        this.#updatePassiveUltime(items, 'vague', systemVagueD);

                        this.#updatePassiveUltime(items, 'salve', systemSalveC);
                        this.#updatePassiveUltime(items, 'salve', systemSalveD);

                        this.#updatePassiveUltime(items, 'rayon', systemRayonC);
                        this.#updatePassiveUltime(items, 'rayon', systemRayonD);

                        let wpnVagueC = {
                            name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.VAGUE.Label'),
                            system:systemVagueC,
                            id:`capacite_${armure.id}_${c}VagueC`
                        };

                        let wpnVagueD = {
                            name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.VAGUE.Label'),
                            system:systemVagueD,
                            id:`capacite_${armure.id}_${c}VagueD`
                        };

                        let wpnSalveC = {
                            name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.SALVE.Label'),
                            system:systemSalveC,
                            id:`capacite_${armure.id}_${c}SalveC`
                        };

                        let wpnSalveD = {
                            name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.SALVE.Label'),
                            system:systemSalveD,
                            id:`capacite_${armure.id}_${c}SalveD`
                        };

                        let wpnRayonC = {
                            name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.RAYON.Label'),
                            system:systemRayonC,
                            id:`capacite_${armure.id}_${c}RayonC`
                        };

                        let wpnRayonD = {
                            name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.RAYON.Label'),
                            system:systemRayonD,
                            id:`capacite_${armure.id}_${c}RayonD`
                        };

                        contact.push(this.#addWpnContact(wpnVagueC, bonusContact));
                        distance.push(this.#addWpnDistance(wpnVagueD, bonusDistance));

                        contact.push(this.#addWpnContact(wpnSalveC, bonusContact));
                        distance.push(this.#addWpnDistance(wpnSalveD, bonusDistance));

                        contact.push(this.#addWpnContact(wpnRayonC, bonusContact));
                        distance.push(this.#addWpnDistance(wpnRayonD, bonusDistance));
                        break;

                    case 'morph':
                        const systemLame = {
                            degats:{
                                dice:dataC.polymorphie.lame.degats.dice,
                                fixe:dataC.polymorphie.lame.degats.fixe,
                            },
                            violence:{
                                dice:dataC.polymorphie.lame.violence.dice,
                                fixe:dataC.polymorphie.lame.violence.fixe,
                            },
                            type:'contact',
                            effets:{
                                raw:dataC.polymorphie.lame.effets.raw,
                                custom:dataC.polymorphie.lame.effets.custom,
                            },
                            portee:dataC.polymorphie.lame.portee,
                        }

                        const systemGriffe = {
                            degats:{
                                dice:dataC.polymorphie.griffe.degats.dice,
                                fixe:dataC.polymorphie.griffe.degats.fixe,
                            },
                            violence:{
                                dice:dataC.polymorphie.griffe.violence.dice,
                                fixe:dataC.polymorphie.griffe.violence.fixe,
                            },
                            type:'contact',
                            effets:{
                                raw:dataC.polymorphie.griffe.effets.raw,
                                custom:dataC.polymorphie.griffe.effets.custom,
                            },
                            portee:dataC.polymorphie.griffe.portee,
                        }

                        const systemCanon = {
                            degats:{
                                dice:dataC.polymorphie.canon.degats.dice,
                                fixe:dataC.polymorphie.canon.degats.fixe,
                            },
                            violence:{
                                dice:dataC.polymorphie.canon.violence.dice,
                                fixe:dataC.polymorphie.canon.violence.fixe,
                            },
                            type:'distance',
                            effets:{
                                raw:dataC.polymorphie.canon.effets.raw,
                                custom:dataC.polymorphie.canon.effets.custom,
                            },
                            portee:dataC.polymorphie.canon.portee,
                        }

                        this.#updatePassiveUltime(items, 'lame', systemLame);
                        this.#updatePassiveUltime(items, 'griffe', systemGriffe);
                        this.#updatePassiveUltime(items, 'canon', systemCanon);

                        let wpnLame = {
                            name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Lame')}`,
                            system:systemLame,
                            id:`capacite_${armure.id}_${c}Lame`
                        };

                        let wpnGriffe = {
                            name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Griffe')}`,
                            system:systemGriffe,
                            id:`capacite_${armure.id}_${c}Griffe`
                        };

                        let wpnCanon = {
                            name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Canon')}`,
                            system:systemCanon,
                            id:`capacite_${armure.id}_${c}Canon`
                        };

                        let wpnLame2 = {
                            name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Lame')} 2`,
                            system:systemLame,
                            id:`capacite_${armure.id}_${c}Lame2`
                        };

                        let wpnGriffe2 = {
                            name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Griffe')} 2`,
                            system:systemGriffe,
                            id:`capacite_${armure.id}_${c}Griffe2`
                        };

                        let wpnCanon2 = {
                            name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Canon')} 2`,
                            system:systemCanon,
                            id:`capacite_${armure.id}_${c}Canon2`
                        };

                        if(dataC?.active?.polymorphieLame ?? false) contact.push(this.#addWpnContact(wpnLame, bonusContact));
                        if(dataC?.active?.polymorphieGriffe ?? false) contact.push(this.#addWpnContact(wpnGriffe, bonusContact));
                        if(dataC?.active?.polymorphieCanon ?? false) distance.push(this.#addWpnDistance(wpnCanon, bonusContact));

                        if(dataC?.active?.polymorphieLame2 ?? false) contact.push(this.#addWpnContact(wpnLame2, bonusContact));
                        if(dataC?.active?.polymorphieGriffe2 ?? false) contact.push(this.#addWpnContact(wpnGriffe2, bonusContact));
                        if(dataC?.active?.polymorphieCanon2 ?? false) distance.push(this.#addWpnDistance(wpnCanon2, bonusContact));
                        break;

                    case 'longbow':
                        const dgtsMin = dataC.degats.min;
                        const dgtsMax = dataC.degats.max;
                        const degatsList = Object.fromEntries(Array.from({length: dgtsMax - dgtsMin + 1}, (_, i) => [dgtsMin + i, `${dgtsMin + i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`]));
                        const violenceMin = dataC.violence.min;
                        const violenceMax = dataC.violence.max;
                        const violenceList = Object.fromEntries(Array.from({length: violenceMax - violenceMin + 1}, (_, i) => [violenceMin + i, `${violenceMin + i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`]));
                        const rangeList = {moyenne:game.i18n.localize('KNIGHT.PORTEE.Moyenne'), longue:game.i18n.localize('KNIGHT.PORTEE.Longue'), lointaine:game.i18n.localize('KNIGHT.PORTEE.Lointaine')};
                        const getComplexeWpn = this.rollData?.allWpn?.find(itm => itm.id === `capacite_${armure.id}_${c}`) ?? {};
                        const porteeMin = dataC.portee.min;
                        const porteeMax = dataC.portee.max;
                        let rangeToNumber = {};
                        let register = false;
                        let value = 0;

                        for(let r in CONFIG.KNIGHT.LIST.portee) {
                            if(r === porteeMin && !register) register = true;

                            if(register) {
                                rangeToNumber[r] = value;
                                value++;
                            }

                            if(r === porteeMax && register) break;
                        }

                        const possibility = {
                            possibility:{
                                portee:{
                                    list:rangeList,
                                    energie:rangeToNumber,
                                    min:porteeMin,
                                },
                                degats:{
                                    list:degatsList,
                                    energie:dataC.degats.energie,
                                    min:dgtsMin,
                                },
                                violence:{
                                    list:violenceList,
                                    energie:dataC.violence.energie,
                                    min:violenceMin,
                                },
                                classes:'twoCol',
                                effets:{
                                    bases:dataC.effets.base.raw,
                                },
                                liste1:{
                                    energie:dataC.effets.liste1.energie,
                                    raw:dataC.effets.liste1.raw,
                                    custom:dataC.effets.liste1.custom,
                                    liste:listEffects(dataC.effets.liste1, labels),
                                    selected:[]
                                },
                                liste2:{
                                    energie:dataC.effets.liste2.energie,
                                    raw:dataC.effets.liste2.raw,
                                    custom:dataC.effets.liste2.custom,
                                    liste:listEffects(dataC.effets.liste2, labels),
                                    selected:[]
                                },
                            }
                        }

                        if(dataC.effets.liste3.acces) {
                            possibility.possibility.liste3 = {
                                energie:dataC.effets.liste3.energie,
                                raw:dataC.effets.liste3.raw,
                                custom:dataC.effets.liste3.custom,
                                liste:listEffects(dataC.effets.liste3, labels),
                                selected:[]
                            };

                            possibility.possibility.classes = 'threeCol';
                        }

                        const wpnLongbow = {
                            name:dataC.label,
                            id:`capacite_${armure.id}_${c}`,
                            system:{
                                energie:0,
                                portee:dataC.portee.min,
                                type:'distance',
                                degats:{
                                    dice:dgtsMin,
                                    fixe:game.settings.get("knight", "adl") ? dataC.degats.adlfixe : 0,
                                },
                                violence:{
                                    dice:violenceMin,
                                    fixe:game.settings.get("knight", "adl") ? dataC.violence.adlfixe : 0,
                                },
                                effets:{
                                    raw:dataC.effets.base.raw,
                                    custom:dataC.effets.base.custom,
                                },
                                distance:{
                                    raw:dataC.distance.raw,
                                    custom:dataC.distance.custom,
                                }
                            }
                        }

                        let getWpnLongbow = this.#addWpnDistance(wpnLongbow, bonusDistance);
                        foundry.utils.mergeObject(getWpnLongbow, possibility);
                        foundry.utils.mergeObject(getWpnLongbow, getComplexeWpn);

                        complexe.push(getWpnLongbow);
                        break;
                }
            }
        }

        for(let c of cyberware) {
            const cybWpn = c.system.wpn;
            let wpn = {
                name:c.name,
                system:cybWpn,
                id:`${c.id}`
            };

            if(cybWpn.type === 'contact') contact.push(this.#addWpnContact(wpn, bonusContact, false));
            else if(cybWpn.type === 'distance') distance.push(this.#addWpnDistance(wpn, bonusDistance, false));
        }

        for(let c of pnjCapacites) {
            const type = c.system.attaque.type;

            let wpn = {
                name:c.name,
                system:c.system.attaque,
                id:`pnjcapacite_${c.id}`
            };

            if(type === 'contact') contact.push(this.#addWpnContact(wpn, bonusContact));
            else if(type === 'distance') distance.push(this.#addWpnDistance(wpn, bonusDistance));
        }

        for(let m in listeModulesMechaArmure) {
            const data = listeModulesMechaArmure[m];
            let wpn = {};

            switch(m) {
                case 'lamesCinetiquesGeantes':
                    wpn = {
                        id:`ma_${actor.id}_lamesCinetiquesGeantes`,
                        name:game.i18n.localize('KNIGHT.MECHAARMURE.MODULES.LAMESCINETIQUESGEANTES.Label'),
                        system:data,
                    }

                    wpn.system.energie = data?.noyaux ?? 0;

                    contact.push(this.#addWpnContact(wpn, bonusContact));
                    break;

                case 'canonMetatron':
                    wpn = {
                        id:`ma_${actor.id}_canonMetatron`,
                        name:game.i18n.localize('KNIGHT.MECHAARMURE.MODULES.CANONMETATRON.Label'),
                        system:data,
                    }

                    wpn.system.energie = data?.noyaux ?? 0;

                    distance.push(this.#addWpnDistance(wpn, bonusDistance));
                    break;

                case 'canonMagma':
                    wpn = {
                        id:`ma_${actor.id}_canonMagma`,
                        name:game.i18n.localize('KNIGHT.MECHAARMURE.MODULES.CANONMAGMA.Label'),
                        system:data,
                    }

                    wpn.system.energie = data?.noyaux?.simple ?? 0;

                    distance.push(this.#addWpnDistance(wpn, bonusDistance));
                    break;

                case 'mitrailleusesSurtur':
                    wpn = {
                        id:`ma_${actor.id}_mitrailleusesSurtur`,
                        name:game.i18n.localize('KNIGHT.MECHAARMURE.MODULES.MITRAILLEUSESSURTUR.Label'),
                        system:data,
                    }

                    wpn.system.energie = data?.noyaux ?? 0;

                    distance.push(this.#addWpnDistance(wpn, bonusDistance));
                    break;

                case 'souffleDemoniaque':
                    wpn = {
                        id:`ma_${actor.id}_souffleDemoniaque`,
                        name:game.i18n.localize('KNIGHT.MECHAARMURE.MODULES.SOUFFLEDEMONIAQUE.Label'),
                        system:data,
                    }

                    wpn.system.energie = data?.noyaux ?? 0;

                    distance.push(this.#addWpnDistance(wpn, bonusDistance));
                    break;

                case 'poingsSoniques':
                    wpn = {
                        id:`ma_${actor.id}_poingsSoniques`,
                        name:game.i18n.localize('KNIGHT.MECHAARMURE.MODULES.POINGSSONIQUES.Label'),
                        system:data,
                    }

                    wpn.system.energie = data?.noyaux ?? 0;

                    contact.push(this.#addWpnContact(wpn, bonusContact));
                    break;
            }
        }

        this.rollData.typeWpn.contact = contact;
        this.rollData.typeWpn.distance = distance;
        this.rollData.typeWpn.aicontact = aicontact;
        this.rollData.typeWpn.aidistance = aidistance;
        this.rollData.typeWpn.grenade = grenade;
        this.rollData.typeWpn.tourelle = tourelle;
        this.rollData.typeWpn.complexe = complexe;

        return {
            listaicontact,
            listaidistance,
            complexeLabel:armure?.name ?? '',
        }
    }

    #addWpnContact(wpn, modules, addSpecial=true) {
        const getWpn = this.rollData.allWpn.find(itm => itm.id === wpn.id);
        const armure = this.actor.items.find(itm => itm.type === 'armure');
        const armureLegend = this.actor.items.find(itm => itm.type === 'armurelegende');
        const avantages = this.actor.items.filter(itm =>
            itm.type === 'avantage' &&
            itm.system.type === 'standard' &&
            (
              itm.system.bonus?.devasterAnatheme ||
              itm.system.bonus?.bourreauTenebres
            )
          );

          // Les trois flags à surveiller
          const flags = ['devasterAnatheme', 'bourreauTenebres'];

          // Résultat: tableau unique de 0..3 clés
          const tableauAvantages = [...new Set(
            avantages.flatMap(itm =>
              flags.filter(f => itm.system.bonus?.[f])
            )
          )];
        const system = wpn.system;
        let raw = [];
        let specialRaw = [];
        let specialCustom = [];
        let data = {
            label:wpn.name,
            portee:system?.portee ?? '',
            action:'weapon',
            classes:'btnWpn',
            options:[],
            type:'contact',
            cout:system?.energie ?? 0,
            espoir:system?.espoir ?? 0,
            bonus:{
                degats:{
                    dice:modules?.degats?.dice ?? 0,
                    fixe:modules?.degats?.fixe ?? 0,
                    titleDice:modules?.degats?.titleDice ?? '',
                    titleFixe:modules?.degats?.titleFixe ?? '',
                },
                violence:{
                    dice:modules?.violence?.dice ?? 0,
                    fixe:modules?.violence?.fixe ?? 0,
                    titleDice:modules?.violence?.titleDice ?? '',
                    titleFixe:modules?.violence?.titleFixe ?? '',
                }
            }
        };
        let raw1 = system?.eff1?.effets?.raw ?? [];
        let raw2 = system?.eff2?.effets?.raw ?? [];
        let custom1 = system?.eff1?.effets?.custom ?? [];
        let custom2 = system?.eff2?.effets?.custom ?? [];

        data.id = wpn.id;

        if(armure && addSpecial && this.armorIsWear) {
            if(armure.system.special.selected?.porteurlumiere ?? undefined) {
                specialRaw = specialRaw.concat(armure.system.special.selected.porteurlumiere.bonus.effets.raw)
                specialCustom = specialCustom.concat(armure.system.special.selected.porteurlumiere.bonus.effets.custom)
            }

            if(armure?.system?.capacites?.selected?.goliath ?? undefined) {
                if(armure?.system?.capacites?.selected?.goliath?.active) {
                    const taille = foundry.utils.getProperty(this.actor, 'system.equipements.armure.capacites.goliath.metre');

                    if(taille >= 4) specialRaw.push('antivehicule');
                }
            }
        }

        if(armureLegend && addSpecial && this.armorIsWear) {
            if(armureLegend?.system?.capacites?.selected?.goliath ?? undefined) {
                if(armureLegend?.system?.capacites?.selected?.goliath?.active) {
                    const taille = foundry.utils.getProperty(this.actor, 'system.equipements.armure.capacites.goliath.metre');

                    if(taille >= 4) specialRaw.push('antivehicule');
                }
            }
        }

        if(!system?.options2mains?.has ?? false) {
            data.effets = {
                raw:system?.effets?.raw ?? [],
                custom:system?.effets?.custom ?? [],
            };
            data.structurelles = {
                raw:system?.structurelles?.raw ?? [],
                custom:system?.structurelles?.custom ?? [],
            };
            data.ornementales = {
                raw:system?.ornementales?.raw ?? [],
                custom:system?.ornementales?.custom ?? [],
            };

            data.effets.raw = data.effets.raw.concat(specialRaw);
            data.effets.custom = data.effets.custom.concat(specialCustom);

            raw = data.effets.raw.concat(system?.structurelles?.raw ?? [], system?.ornementales?.raw ?? []);

            if(!system?.degats?.variable?.has ?? false) data.degats = {dice:system?.degats?.dice ?? 0, fixe:system?.degats?.fixe ?? 0};
            else {
                const list = {};
                const min = system?.degats?.variable?.min?.dice ?? 0;
                const max = system?.degats?.variable?.max?.dice ?? min;
                let classes = [];

                for (let i = min; i <= max; i++) {
                    list[i] = system?.degats?.variable?.min?.fixe ?? 0 ? `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6+${min.fixe}` : `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
                }

                classes.push('selectDouble', 'dgtsvariable');

                if(!system?.violence?.variable?.has ?? false) classes.push('full');

                data.options.push({
                    key:'select',
                    classes:classes.join(' '),
                    label:game.i18n.localize('KNIGHT.AUTRE.Degats'),
                    list:list,
                    selected:min,
                    value:system?.degats?.variable?.cout ?? 0,
                    selectvalue:system?.degats?.variable?.min?.fixe ?? 0,
                });

                data.degats = {dice:min, fixe:system?.degats?.variable?.min?.fixe ?? 0};
            }

            if(!system?.violence?.variable?.has ?? false) data.violence = {dice:system?.violence?.dice ?? 0, fixe:system?.violence?.fixe ?? 0};
            else {
                const list = {};
                const min = system?.violence?.variable?.min?.dice ?? 0;
                const max = system?.violence?.variable?.max?.dice ?? min;
                let classes = [];

                for (let i = min; i <= max; i++) {
                    list[i] = system?.violence?.variable?.min?.fixe ?? 0 ? `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6+${min.fixe}` : `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
                }

                classes.push('selectDouble', 'violencevariable');

                if(!system?.degats?.variable?.has ?? false) classes.push('full');

                data.options.push({
                    key:'select',
                    classes:classes.join(' '),
                    label:game.i18n.localize('KNIGHT.AUTRE.Violence'),
                    list:list,
                    selected:min,
                    value:system?.violence?.variable?.cout ?? 0,
                    selectvalue:system?.violence?.variable?.min?.fixe ?? 0,
                });

                data.violence = {dice:min, fixe:system?.violence?.variable?.min?.fixe ?? 0};
            }

        } else {
            const list = {};

            list['1main'] = game.i18n.localize('KNIGHT.ITEMS.ARME.DEUXMAINS.Unemain');
            list['2main'] = game.i18n.localize('KNIGHT.ITEMS.ARME.DEUXMAINS.Deuxmains');

            data.actuel = system.options2mains.actuel;

            if(system.options2mains.actuel === '1main') {
                data.degats = {dice:system?.options2mains?.['1main']?.degats?.dice ?? 0, fixe:system?.options2mains?.['1main']?.degats.fixe ?? 0};
                data.violence = {dice:system?.options2mains?.['1main']?.violence?.dice ?? 0, fixe:system?.options2mains?.['1main']?.violence?.fixe ?? 0};

                data.effets = {
                    raw:system?.effets?.raw ?? [],
                    custom:system?.effets?.custom ?? [],
                };
                data.structurelles = {
                    raw:system?.structurelles?.raw ?? [],
                    custom:system?.structurelles?.custom ?? [],
                };
                data.ornementales = {
                    raw:system?.ornementales?.raw ?? [],
                    custom:system?.ornementales?.custom ?? [],
                };

                data.effets.raw = data.effets.raw.concat(specialRaw);
                data.effets.custom = data.effets.custom.concat(specialCustom);

                raw = data.effets.raw.concat(system?.structurelles?.raw, system?.ornementales?.raw);
            }
            else {
                data.degats = {dice:system?.options2mains?.['2main']?.degats?.dice ?? 0, fixe:system?.options2mains?.['2main']?.degats.fixe ?? 0};
                data.violence = {dice:system?.options2mains?.['2main']?.violence?.dice ?? 0, fixe:system?.options2mains?.['2main']?.violence?.fixe ?? 0};

                data.effets = {
                    raw:system?.effets2mains?.raw ?? [],
                    custom:system?.effets2mains?.custom ?? [],
                };
                data.structurelles = {
                    raw:system?.structurelles?.raw ?? [],
                    custom:system?.structurelles?.custom ?? [],
                };
                data.ornementales = {
                    raw:system?.ornementales?.raw ?? [],
                    custom:system?.ornementales?.custom ?? [],
                };

                data.effets.raw = data.effets.raw.concat(specialRaw);
                data.effets.custom = data.effets.custom.concat(specialCustom);

                raw = data.effets.raw.concat(system.structurelles.raw, system.ornementales.raw);
            }

            let classes = [];
            classes.push('selectSimple mains full');

            data.options.push({
                key:'select',
                classes:classes.join(' '),
                list:list,
                selected:data.actuel,
            });
        }

        if(tableauAvantages.includes('devasterAnatheme')) {
            data.options.push({
                key:'btn',
                classes:'devasteranatheme full active',
                label:game.i18n.localize('KNIGHT.ITEMS.AVANTAGE.DevasterAnatheme'),
                value:'devasteranatheme',
                active:getWpn?.options?.find(itm => itm.value === 'devasterAnatheme')?.active ?? false,
            });
        }

        if(tableauAvantages.includes('bourreauTenebres')) {
            data.options.push({
                key:'btn',
                classes:'bourreautenebres full active',
                label:game.i18n.localize('KNIGHT.ITEMS.AVANTAGE.BourreauTenebres'),
                value:'bourreautenebres',
                active:getWpn?.options?.find(itm => itm.value === 'bourreautenebres')?.active ?? false,
            });
        }

        data.degats.addchair = system?.degats?.addchair ?? true;
        data.options = modules.options ? modules.options.concat(data.options) : data.options;

        if(this.#hasEffet(raw, 'boost')) {
            let classes = ['doubleCol', 'selectDouble', 'boostsimple', 'full'];
            const getOption = getWpn ? getWpn.options.find(itm => itm.classes.includes('boostsimple')) : undefined;
            const boostEntry = raw.find(entry => entry.includes("boost"));
            const boostValue = parseInt(boostEntry.split(' ')[1]);
            const list1 = {
                'degats':game.i18n.localize("KNIGHT.AUTRE.Degats"),
                'violence':game.i18n.localize("KNIGHT.AUTRE.Violence")
            };
            const list2 = Array.from({length: boostValue+1}, (_, index) => [index, `${index}D6`]).reduce((acc, [key, value]) => ({...acc, [key]: value}), {});

            data.options.push({
                key:'duoselect',
                classes:classes.join(' '),
                label:game.i18n.localize(CONFIG.KNIGHT.effetsadl.boost.label),
                list1,
                list2,
                selected1:getOption ? getOption.selected1 : 'degats',
                selected2:getOption ? getOption.selected2 : 0,
                value:1,
                select1value:'degats',
                select2value:0,
            });
        }

        if(this.#hasEffet(raw, 'boostviolence')) {
            let classes = ['selectDouble', 'boostviolence'];
            const getOption = getWpn ? getWpn.options.find(itm => itm.classes.includes('boostviolence')) : undefined;
            const boostViolenceEntry = raw.find(entry => entry.includes("boostviolence"));
            const boostViolenceValue = parseInt(boostViolenceEntry.split(' ')[1]);
            const list = Array.from({length: boostViolenceValue+1}, (_, index) => [index, `${index}D6`]).reduce((acc, [key, value]) => ({...acc, [key]: value}), {});

            if(!this.#hasEffet(raw, 'boostdegats')) classes.push('full');

            data.options.push({
                key:'select',
                classes:classes.join(' '),
                label:game.i18n.localize(CONFIG.KNIGHT.effetsfm4.boostviolence.label),
                list,
                selected:getOption ? getOption.selected : 0,
                value:1,
                selectvalue:0,
            });
        }

        if(this.#hasEffet(raw, 'boostdegats')) {
            let classes = ['selectDouble', 'boostdegats'];
            const getOption = getWpn ? getWpn.options.find(itm => itm.classes.includes('boostdegats')) : undefined;
            const boostDegatsEntry = raw.find(entry => entry.includes("boostdegats"));
            const boostDegatsValue = parseInt(boostDegatsEntry.split(' ')[1]);
            const list = Array.from({length: boostDegatsValue+1}, (_, index) => [index, `${index}D6`]).reduce((acc, [key, value]) => ({...acc, [key]: value}), {});

            if(!this.#hasEffet(raw, 'boostviolence')) classes.push('full');

            data.options.push({
                key:'select',
                classes:classes.join(' '),
                label:game.i18n.localize(CONFIG.KNIGHT.effetsfm4.boostdegats.label),
                list,
                selected:getOption ? getOption.selected : 0,
                value:1,
                selectvalue:0,
            });
        }

        if(this.#hasEffet(raw, 'soeur')) {
            let classes = ['jumelageambidextrie', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.SOEUR.Label'),
                value:'soeur',
                active:getWpn?.options?.find(itm => itm.value === 'soeur')?.active ?? false,
            });
        } else if(this.#hasEffet(raw, 'jumelageambidextrie')) {
            let classes = ['jumelageambidextrie', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.JUMELAGEAMBIDEXTRIE.Label'),
                value:'jumelageambidextrie',
                active:getWpn?.options?.find(itm => itm.value === 'jumelageambidextrie')?.active ?? true,
            });
        }

        if(this.#hasEffet(raw, 'barrage')) {
            let classes = ['barrage', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.BARRAGE.Label'),
                value:'barrage',
                active:getWpn?.options?.find(itm => itm.value === 'barrage')?.active ?? false,
            });
        }

        if(this.#hasEffet(raw, 'chromeligneslumineuses')) {
            let classes = ['cadence', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.CHROMELIGNESLUMINEUSES.Label'),
                value:'chromeligneslumineuses',
                active:getWpn?.options?.find(itm => itm.value === 'chromeligneslumineuses')?.active ?? false,
            });
        } else if(this.#hasEffet(raw, 'cadence')) {
            let classes = ['cadence', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.CADENCE.Label'),
                value:'cadence',
                active:getWpn?.options?.find(itm => itm.value === 'cadence')?.active ?? false,
            });
        }

        if(this.#hasEffet(raw, 'guidage')) {
            let classes = ['guidage', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.GUIDAGE.Label'),
                value:'guidage',
                active:getWpn?.options?.find(itm => itm.value === 'guidage')?.active ?? true,
            });
        }

        if(this.#hasEffet(raw, 'cranerieurgrave')) {
            let classes = ['obliteration', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.CRANERIEURGRAVE.Label'),
                value:'cranerieurgrave',
                active:getWpn?.options?.find(itm => itm.value === 'cranerieurgrave')?.active ?? false,
            });
        } else if(this.#hasEffet(raw, 'obliteration')) {
            let classes = ['obliteration', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.OBLITERATION.Label'),
                value:'obliteration',
                active:getWpn?.options?.find(itm => itm.value === 'obliteration')?.active ?? false,
            });
        }

        if(this.#hasEffet(raw, 'cataclysme')) {
            let classes = ['cataclysme', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.CATACLYSME.Label'),
                value:'cataclysme',
                active:getWpn?.options?.find(itm => itm.value === 'cataclysme')?.active ?? false,
            });
        }

        if(this.#hasEffet(raw, 'fatal')) {
            let classes = ['fatal', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.FATAL.Label'),
                value:'fatal',
                active:false,
            });
        }

        if(this.#hasEffet(raw, 'nonletal')) {
            let classes = ['nonletal', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.NONLETAL.Label'),
                value:'nonletal',
                active:false,
            });
        }

        if(this.#hasEffet(raw, 'sournois')) {
            let classes = ['sournois', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.SOURNOIS.Label'),
                value:'sournois',
                active:false,
            });
        }

        if(this.#hasEffet(raw, 'titanicide')) {
            let classes = ['titanicide', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.TITANICIDE.Label'),
                value:'titanicide',
                active:false,
            });
        }

        const localize = getAllEffects();

        if(raw1 || custom1) data.eff1 = {
            value:system?.eff1?.value ?? 0,
            raw:raw1,
            custom:custom1
        }

        if(raw2 || custom2) data.eff2 = {
            value:system?.eff2?.value ?? 0,
            raw:raw2,
            custom:custom2
        }

        for(let r of raw1) {
            const loc = localize[r.split(' ')[0]];
            let classes = [r.split(' ')[0], 'active', 'full', 'effets1'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${r.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                value:r,
                active:false,
            });
        }

        for(let r of raw2) {
            const loc = localize[r.split(' ')[0]];
            let classes = [r.split(' ')[0], 'active', 'full', 'effets2'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${r.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                value:r,
                active:false,
            });
        }

        for(let r in custom1) {
            let dataCustom = custom1[r];
            let classes = [`${dataCustom.label.split(' ')[0]}_${r}_e1`, 'active', 'full', 'effets1'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:`${dataCustom.label}`,
                value:dataCustom.label,
                active:false,
            });
        }

        for(let r in custom2) {
            let dataCustom = custom2[r];
            let classes = [`${dataCustom.label.split(' ')[0]}_${r}_e2`, 'active', 'full', 'effets2'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:`${dataCustom.label}`,
                value:dataCustom.label,
                active:false,
            });
        }

        data.options.sort((a, b) => {
            if (a.classes.includes('violencevariable')) return -1;
            if (b.classes.includes('violencevariable')) return 1;
            if (a.classes.includes('dgtsvariable')) return -1;
            if (b.classes.includes('dgtsvariable')) return 1;
            if (a.key === 'select') return -1;
            if (b.key === 'select') return 1;
            if (a.classes.includes('roll')) return -1;
            if (b.classes.includes('roll')) return 1;
            if (a.key === 'btn' && b.key !== 'btn') return 1;
            if (a.key !== 'btn' && b.key === 'btn') return -1;
            return a.label.localeCompare(b.label);
        });

        return data;
    }

    #addWpnDistance(wpn, modules, addSpecial=true) {
        const getWpn = this.rollData.allWpn.find(itm => itm.id === wpn.id);
        const armure = this.actor.items.find(itm => itm.type === 'armure');
        const armureLegend = this.actor.items.find(itm => itm.type === 'armurelegende');
        const avantages = this.actor.items.filter(itm =>
            itm.type === 'avantage' &&
            itm.system.type === 'standard' &&
            (
              itm.system.bonus?.devasterAnatheme ||
              itm.system.bonus?.bourreauTenebres
            )
          );

          // Les trois flags à surveiller
          const flags = ['devasterAnatheme', 'bourreauTenebres'];

          // Résultat: tableau unique de 0..3 clés
          const tableauAvantages = [...new Set(
            avantages.flatMap(itm =>
              flags.filter(f => itm.system.bonus?.[f])
            )
          )];
        const system = wpn.system;
        let raw = [];
        let specialRaw = [];
        let specialCustom = [];

        let data = {
            id:wpn?.id ?? '',
            label:wpn.name,
            action:'weapon',
            classes:'btnWpn',
            options:[],
            type:'distance',
            cout:system?.energie ?? 0,
            espoir:system?.espoir ?? 0,
            effets:{
                raw:system?.effets?.raw ?? [],
                custom:system?.effets?.custom ?? [],
            },
            distance:{
                raw:system?.distance?.raw ?? [],
                custom:system?.distance?.custom ?? [],
            },
            bonus:{
                degats:{
                    dice:modules?.degats?.dice ?? 0,
                    fixe:modules?.degats?.fixe ?? 0,
                    titleDice:modules?.degats?.titleDice ?? '',
                    titleFixe:modules?.degats?.titleFixe ?? '',
                },
                violence:{
                    dice:modules?.violence?.dice ?? 0,
                    fixe:modules?.violence?.fixe ?? 0,
                    titleDice:modules?.violence?.titleDice ?? '',
                    titleFixe:modules?.violence?.titleFixe ?? '',
                }
            }
        };

        if(system?.portee ?? undefined) data.portee = system.portee;
        data.id = wpn.id;

        if(armure && addSpecial && this.armorIsWear) {
            if(armure.system.special.selected?.porteurlumiere ?? undefined) {
                specialRaw = specialRaw.concat(armure.system.special.selected.porteurlumiere.bonus.effets.raw)
                specialCustom = specialCustom.concat(armure.system.special.selected.porteurlumiere.bonus.effets.custom)
            }

            if(armure?.system?.capacites?.selected?.goliath ?? undefined) {
                if(armure?.system?.capacites?.selected?.goliath?.active) {
                    const taille = foundry.utils.getProperty(this.actor, 'system.equipements.armure.capacites.goliath.metre');

                    if(taille >= 4) specialRaw.push('antivehicule');
                }
            }
        }

        if(armureLegend && addSpecial && this.armorIsWear) {
            if(armureLegend?.system?.capacites?.selected?.goliath ?? undefined) {
                if(armureLegend?.system?.capacites?.selected?.goliath?.active) {
                    const taille = foundry.utils.getProperty(this.actor, 'system.equipements.armure.capacites.goliath.metre');

                    if(taille >= 4) specialRaw.push('antivehicule');
                }
            }
        }

        data.effets.raw = data.effets.raw.concat(specialRaw, system?.distance?.raw ?? []);
        data.effets.custom = data.effets.custom.concat(specialCustom, system?.distance?.custom ?? []);
        raw = data.effets.raw;

        if(wpn.id === this.rollData.wpnSelected) data.classes += ' selected';

        if(!system?.optionsmunitions?.has ?? false) {

            if(!system?.degats?.variable?.has ?? false) data.degats = {dice:system?.degats?.dice ?? 0, fixe:system?.degats?.fixe ?? 0};
            else {
                const list = {};
                const min = system.degats.variable.min;
                const max = system.degats.variable.max;
                let classes = [];

                for (let i = min.dice; i <= max.dice; i++) {
                    list[i] = min.fixe ? `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6+${min.fixe}` : `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
                }

                classes.push('selectDouble', 'dgtsvariable');

                if(!system.violence.variable.has) classes.push('full');

                data.options.push({
                    key:'select',
                    classes:classes.join(' '),
                    label:game.i18n.localize('KNIGHT.AUTRE.Degats'),
                    list:list,
                    selected:min.dice,
                    value:system.degats.variable.cout,
                    selectvalue:min.fixe,
                });

                data.degats = {dice:min.dice, fixe:min.fixe};
            }

            if(!system?.violence?.variable?.has ?? false) data.violence = {dice:system?.violence?.dice ?? 0, fixe:system?.violence?.fixe ?? 0};
            else {
                const list = {};
                const min = system.violence.variable.min;
                const max = system.violence.variable.max;
                let classes = [];

                for (let i = min.dice; i <= max.dice; i++) {
                    list[i] = min.fixe ? `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6+${min.fixe}` : `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
                }

                classes.push('selectDouble', 'violencevariable');

                if(!system.degats.variable.has) classes.push('full');

                data.options.push({
                    key:'select',
                    classes:classes.join(' '),
                    label:game.i18n.localize('KNIGHT.AUTRE.Violence'),
                    list:list,
                    selected:min.dice,
                    value:system.violence.variable.cout,
                    selectvalue:min.fixe,
                });

                data.violence = {dice:min.dice, fixe:min.fixe};
            }

        } else {
            const listMunitions = system.optionsmunitions.liste;
            const list = {};

            data.munitions = {};

            for(let m in listMunitions) {
                list[m] = `${game.i18n.localize('KNIGHT.ITEMS.ARME.MUNITIONS.Label')} : ${listMunitions[m].nom}`;
                data.munitions[m] = listMunitions[m];
            }

            data.actuel = system.optionsmunitions.actuel;

            data.degats = data.munitions[data.actuel].degats;
            data.violence = data.munitions[data.actuel].violence;
            raw = raw.concat(data.munitions[data.actuel].raw);

            data.effets = {
                raw:raw,
                custom:system.effets.custom.concat(data.munitions[data.actuel].custom),
            };

            let classes = [];
            classes.push('selectSimple munitions full');

            data.options.push({
                key:'select',
                classes:classes.join(' '),
                list:list,
                selected:data.actuel,
            });
        }

        if(system?.tourelle?.has ?? false) {
            data.tourelle = {
                dice:system.tourelle.attaque.dice,
                fixe:system.tourelle.attaque.fixe,
            }
        }

        if(tableauAvantages.includes('devasterAnatheme')) {
            data.options.push({
                key:'btn',
                classes:'devasteranatheme full active',
                label:game.i18n.localize('KNIGHT.ITEMS.AVANTAGE.DevasterAnatheme'),
                value:'devasteranatheme',
                active:getWpn?.options?.find(itm => itm.value === 'devasterAnatheme')?.active ?? false,
            });
        }

        if(tableauAvantages.includes('bourreauTenebres')) {
            data.options.push({
                key:'btn',
                classes:'bourreautenebres full active',
                label:game.i18n.localize('KNIGHT.ITEMS.AVANTAGE.BourreauTenebres'),
                value:'bourreautenebres',
                active:getWpn?.options?.find(itm => itm.value === 'bourreautenebres')?.active ?? false,
            });
        }

        data.options = modules.options ? modules.options.concat(data.options) : data.options;

        if(this.#hasEffet(raw, 'boost')) {
            let classes = ['doubleCol', 'selectDouble', 'boostsimple', 'full'];
            const getOption = getWpn ? getWpn.options.find(itm => itm.classes.includes('boostsimple')) : undefined;
            const boostEntry = raw.find(entry => entry.includes("boost"));
            const boostValue = parseInt(boostEntry.split(' ')[1]);
            const list1 = {
                'degats':game.i18n.localize("KNIGHT.AUTRE.Degats"),
                'violence':game.i18n.localize("KNIGHT.AUTRE.Violence")
            };
            const list2 = Array.from({length: boostValue+1}, (_, index) => [index, `${index}D6`]).reduce((acc, [key, value]) => ({...acc, [key]: value}), {});

            data.options.push({
                key:'duoselect',
                classes:classes.join(' '),
                label:game.i18n.localize(CONFIG.KNIGHT.effetsadl.boost.label),
                list1,
                list2,
                selected1:getOption ? getOption.selected1 : 'degats',
                selected2:getOption ? getOption.selected2 : 0,
                value:1,
                select1value:'degats',
                select2value:0,
            });
        }

        if(this.#hasEffet(raw, 'boostviolence')) {
            let classes = ['selectDouble', 'boostviolence'];
            const getOption = getWpn ? getWpn.options.find(itm => itm.classes.includes('boostviolence')) : undefined;
            const boostViolenceEntry = raw.find(entry => entry.includes("boostviolence"));
            const boostViolenceValue = parseInt(boostViolenceEntry.split(' ')[1]);
            const list = Array.from({length: boostViolenceValue+1}, (_, index) => [index, `${index}D6`]).reduce((acc, [key, value]) => ({...acc, [key]: value}), {});

            if(!this.#hasEffet(raw, 'boostdegats')) classes.push('full');

            data.options.push({
                key:'select',
                classes:classes.join(' '),
                label:game.i18n.localize(CONFIG.KNIGHT.effetsfm4.boostviolence.label),
                list,
                selected:getOption ? getOption.selected : 0,
                value:1,
                selectvalue:0,
            });
        }

        if(this.#hasEffet(raw, 'boostdegats')) {
            let classes = ['selectDouble', 'boostdegats'];
            const getOption = getWpn ? getWpn.options.find(itm => itm.classes.includes('boostdegats')) : undefined;
            const boostDegatsEntry = raw.find(entry => entry.includes("boostdegats"));
            const boostDegatsValue = parseInt(boostDegatsEntry.split(' ')[1]);
            const list = Array.from({length: boostDegatsValue+1}, (_, index) => [index, `${index}D6`]).reduce((acc, [key, value]) => ({...acc, [key]: value}), {});

            if(!this.#hasEffet(raw, 'boostviolence')) classes.push('full');

            data.options.push({
                key:'select',
                classes:classes.join(' '),
                label:game.i18n.localize(CONFIG.KNIGHT.effetsfm4.boostdegats.label),
                list,
                selected:getOption ? getOption.selected : 0,
                value:1,
                selectvalue:0,
            });
        }

        if(this.#hasEffet(raw, 'soeur')) {
            let classes = ['jumelageambidextrie', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.SOEUR.Label'),
                value:'soeur',
                active:getWpn?.options?.find(itm => itm.value === 'soeur')?.active ?? true,
            });
        } else if(this.#hasEffet(raw, 'jumelageambidextrie')) {
            let classes = ['jumelageambidextrie', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.JUMELAGEAMBIDEXTRIE.Label'),
                value:'jumelageambidextrie',
                active:getWpn?.options?.find(itm => itm.value === 'jumelageambidextrie')?.active ?? true,
            });
        }

        if(this.#hasEffet(raw, 'barrage')) {
            let classes = ['barrage', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.BARRAGE.Label'),
                value:'barrage',
                active:getWpn?.options?.find(itm => itm.value === 'barrage')?.active ?? false,
            });
        }

        if(this.#hasEffet(raw, 'chargeurballesgrappes')) {
            let classes = ['chargeurballesgrappes', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.CHARGEURBALLESGRAPPES.Label'),
                value:'chargeurballesgrappes',
                active:getWpn?.options?.find(itm => itm.value === 'chargeurballesgrappes')?.active ?? true,
            });
        }

        if(this.#hasEffet(raw, 'chargeurmunitionsexplosives')) {
            let classes = ['chargeurmunitionsexplosives', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.CHARGEURMUNITIONSEXPLOSIVES.Label'),
                value:'chargeurmunitionsexplosives',
                active:getWpn?.options?.find(itm => itm.value === 'chargeurmunitionsexplosives')?.active ?? true,
            });
        }

        if(this.#hasEffet(raw, 'munitionsiem')) {
            let classes = ['munitionsiem', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.MUNITIONSIEM.Label'),
                value:'munitionsiem',
                active:getWpn?.options?.find(itm => itm.value === 'munitionsiem')?.active ?? true,
            });
        }

        if(this.#hasEffet(raw, 'munitionsnonletales')) {
            let classes = ['munitionsnonletales', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.MUNITIONSNONLETALES.Label'),
                value:'munitionsnonletales',
                active:getWpn?.options?.find(itm => itm.value === 'munitionsnonletales')?.active ?? true,
            });
        }

        if(this.#hasEffet(raw, 'munitionshypervelocite')) {
            let classes = ['munitionshypervelocite', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.MUNITIONSHYPERVELOCITE.Label'),
                value:'munitionshypervelocite',
                active:getWpn?.options?.find(itm => itm.value === 'munitionshypervelocite')?.active ?? true,
            });
        }

        if(this.#hasEffet(raw, 'pointeurlaser')) {
            let classes = ['pointeurlaser', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.POINTEURLASER.Label'),
                value:'pointeurlaser',
                active:getWpn?.options?.find(itm => itm.value === 'pointeurlaser')?.active ?? true,
            });
        }

        if(this.#hasEffet(raw, 'munitionsdrones')) {
            let classes = ['munitionsdrones', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.MUNITIONSDRONES.Label'),
                value:'munitionsdrones',
                active:getWpn?.options?.find(itm => itm.value === 'munitionsdrones')?.active ?? true,
            });
        }

        if(this.#hasEffet(raw, 'munitionssubsoniques')) {
            let classes = ['munitionssubsoniques', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.MUNITIONSSUBSONIQUES.Label'),
                value:'munitionssubsoniques',
                active:getWpn?.options?.find(itm => itm.value === 'munitionssubsoniques')?.active ?? true,
            });
        }

        if(this.#hasEffet(raw, 'chromeligneslumineuses')) {
            let classes = ['cadence', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.CHROMELIGNESLUMINEUSES.Label'),
                value:'chromeligneslumineuses',
                active:getWpn?.options?.find(itm => itm.value === 'chromeligneslumineuses')?.active ?? false,
            });
        } else if(this.#hasEffet(raw, 'cadence')) {
            let classes = ['cadence', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.CADENCE.Label'),
                value:'cadence',
                active:getWpn?.options?.find(itm => itm.value === 'cadence')?.active ?? false,
            });
        }

        if(this.#hasEffet(raw, 'guidage')) {
            let classes = ['guidage', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.GUIDAGE.Label'),
                value:'guidage',
                active:getWpn?.options?.find(itm => itm.value === 'guidage')?.active ?? true,
            });
        }

        if(this.#hasEffet(raw, 'cranerieurgrave')) {
            let classes = ['obliteration', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.CRANERIEURGRAVE.Label'),
                value:'cranerieurgrave',
                active:getWpn?.options?.find(itm => itm.value === 'cranerieurgrave')?.active ?? false,
            });
        } else if(this.#hasEffet(raw, 'obliteration')) {
            let classes = ['obliteration', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.OBLITERATION.Label'),
                value:'obliteration',
                active:getWpn?.options?.find(itm => itm.value === 'obliteration')?.active ?? false,
            });
        }

        if(this.#hasEffet(raw, 'cataclysme')) {
            let classes = ['cataclysme', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.CATACLYSME.Label'),
                value:'cataclysme',
                active:getWpn?.options?.find(itm => itm.value === 'cataclysme')?.active ?? false,
            });
        }

        if(this.#hasEffet(raw, 'fatal')) {
            let classes = ['fatal', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.FATAL.Label'),
                value:'fatal',
                active:false,
            });
        }

        if(this.#hasEffet(raw, 'nonletal')) {
            let classes = ['nonletal', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.NONLETAL.Label'),
                value:'nonletal',
                active:false,
            });
        }

        if(this.#hasEffet(raw, 'sournois')) {
            let classes = ['sournois', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.SOURNOIS.Label'),
                value:'sournois',
                active:false,
            });
        }

        if(this.#hasEffet(raw, 'titanicide')) {
            let classes = ['titanicide', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.TITANICIDE.Label'),
                value:'titanicide',
                active:false,
            });
        }

        data.options.sort((a, b) => {
            if (a.key === 'select') return -1;
            if (b.key === 'select') return 1;
            if (a.classes.includes('roll')) return -1;
            if (b.classes.includes('roll')) return 1;
            if (a.key === 'btn' && b.key !== 'btn') return 1;
            if (a.key !== 'btn' && b.key === 'btn') return -1;
            return a.label.localeCompare(b.label);
        });

        return data;
    }

    #updateComplexeWpn(id, property, value) {
        const complexe = this.rollData.allWpn.find(itm => itm.id === id);
        const wpn = this.rollData.allWpn.find(itm => itm.id === id);

        if (property === 'portee') {
            wpn[property] = value;
        } else {
            wpn[property].dice = value;
        }

        if(complexe) {
            complexe[property] = property === 'portee' ? value : { dice: value };
        }
    }

    #toggleEffect(wpnId, effectData, isAdding) {
        const { raw, custom, liste, customID } = effectData;
        const wpn = this.rollData.allWpn.find(itm => itm.id === wpnId);

        if (!isAdding) {
            if (custom) {
                const tempCustom = { ...wpn.possibility[liste].custom[customID], liste, id: customID };
                wpn.effets.custom.push(tempCustom);
                wpn.possibility[liste].selected.push(tempCustom);

            } else {
                wpn.effets.raw.push(raw);
                wpn.possibility[liste].selected.push(raw);
            }
        } else {
            if (custom) {
                wpn.effets.custom = wpn.effets.custom.filter(item => item.id !== customID || item.liste !== liste);
                wpn.possibility[liste].selected = wpn.possibility[liste].selected.filter(item => item !== raw);
            } else {
                wpn.effets.raw = wpn.effets.raw.filter(item => item !== raw);
                wpn.possibility[liste].selected = wpn.possibility[liste].selected.filter(item => item !== raw);
            }
        }
    }

    #calculateLongbow(id, parent) {
        const longbow = this.rollData.allWpn.find(itm => itm.id === id);

        const { degats, violence, portee, effets, possibility } = longbow;
        const { energie: dgtsEnergie, min: dgtsMin } = possibility.degats;
        const { energie: violenceEnergie, min: violenceMin } = possibility.violence;
        const { energie: porteeEnergie } = possibility.portee;
        const { energie: liste1Energie } = possibility.liste1;
        const { energie: liste2Energie } = possibility.liste2;
        const liste3Energie = possibility.liste3?.energie ?? 0;
        const boost = longbow.options.find(itm => itm.classes.includes('boostsimple') && itm.key === 'duoselect');
        const boostdegats = longbow.options.find(itm => itm.classes.includes('boostdegats') && itm.key === 'select');
        const boostviolence = longbow.options.find(itm => itm.classes.includes('boostviolence') && itm.key === 'select');

        let cout = 0;

        cout += (degats.dice - dgtsMin) * dgtsEnergie;
        cout += (violence.dice - violenceMin) * violenceEnergie;
        cout += porteeEnergie[portee];

        const calculateEffetsCost = (effetsList, possibilityList, energie) => {
            return effetsList.reduce((acc, effet) => {
                if (possibilityList.includes(effet)) {
                    return acc + energie;
                }
                return acc;
            }, 0);
        };

        cout += calculateEffetsCost(effets.raw, possibility.liste1.raw, liste1Energie);
        cout += calculateEffetsCost(effets.raw, possibility.liste2.raw, liste2Energie);
        if (possibility.liste3) {
            cout += calculateEffetsCost(effets.raw, possibility.liste3.raw, liste3Energie);
        }

        cout += effets.custom.reduce((acc, e) => {
            switch(e.liste) {
                case 'liste1': return acc + liste1Energie;
                case 'liste2': return acc + liste2Energie;
                case 'liste3': return acc + liste3Energie;
                default: return acc;
            }
        }, 0);

        if(boost) {
            const boostSelected = parseInt(boost.selected2);

            cout += boostSelected*boost.value;
        }

        if(boostdegats) {
            const boostDegatsSelected = parseInt(boostdegats.selected);

            cout += boostDegatsSelected*boostdegats.value;
        }

        if(boostviolence) {
            const boostViolenceSelected = parseInt(boostviolence.selected);

            cout += boostViolenceSelected*boostviolence.value;
        }

        const p = parent.querySelector('button.btnWpn span p');
        if(p) p.textContent = cout;

        if (longbow) {
            longbow.cout = cout;
        }
    }

    // Équivalent de jQuery .siblings(selector)
    #siblings(element, selector) {
        if(!element?.parentElement) return [];
        return Array.from(element.parentElement.children)
            .filter(el => el !== element && el.matches(selector));
    }

    // Vérifie si un sibling (h2/h3.summary) contient une icône donnée
    #summaryHasIcon(element, summarySelector, iconClass) {
        if(!element) return false;
        const summary = this.#siblings(element, summarySelector)[0];
        return summary?.querySelector('i')?.classList.contains(iconClass) ?? false;
    }

    #selectWpn(target, init=false, double=false) {
        const button = target.closest('div.button');
        const id = button?.dataset.id;
        const grpWpn = target.closest('div.grpWpn');
        const selectorParents = !double ? 'div.wpn button.btnWpn.selected' : 'div.wpn button.btnWpn.doubleSelected';
        const parents = grpWpn ? grpWpn.querySelectorAll(selectorParents) : [];
        const wpn = this.rollData.allWpn.find(itm => itm.id === id);

        const icon = target.querySelector('i');

        if(!double) {
            this.rollData.wpnSelected = id;
            target.classList.add('selected');
            icon?.classList.add('fa-solid', 'fa-check');
        }
        else {
            this.rollData.wpnSecond = id;
            target.classList.add('doubleSelected');
            icon?.classList.add('fa-solid', 'fa-check-double');
        }

        // siblings .data / .bases / .effets → show
        for(const cls of ['.data', '.bases', '.effets']) {
            this.#siblings(target, cls).forEach(el => el.style.display = '');
            if(!init) this.#siblings(target, cls).forEach(el => this._slideDown(el));
        }

        if(!double) {
            const labelInput = this.rollData.html.querySelector('input.label');
            if(labelInput) labelInput.value = wpn.label;
            this.rollData.label = wpn.label;
        }

        for(const p of parents) {
            const pButton = p.closest('div.button');
            const pCat = p.closest('div.cat');
            const pId = pButton?.dataset.id;

            if(id !== pId) {
                const w = this.rollData.allWpn.find(itm => itm.id === pId);
                if(w) w.classes = w.classes.replaceAll(' selected', '');

                p.classList.remove('selected', 'doubleSelected');
                p.querySelector('i')?.classList.remove('fa-solid', 'fa-check');
                pButton?.classList.remove('selected');
                pCat?.classList.remove('selected');

                for(const cls of ['.data', '.bases', '.effets']) {
                    this.#siblings(p, cls).forEach(el => this._slideUp(el));
                }

                if(this.#summaryHasIcon(pButton, 'h2.summary', 'fa-plus-square')) {
                    if(pButton) this._slideUp(pButton);
                }
                if(this.#summaryHasIcon(pButton, 'h3.summary', 'fa-plus-square')) {
                    if(pButton) this._slideUp(pButton);
                }
                if(this.#summaryHasIcon(pCat, 'h2.summary', 'fa-plus-square')) {
                    if(pButton) this._slideUp(pButton);
                    if(pCat) this._slideUp(pCat);
                }
            } else {
                pButton?.classList.add('selected');
                pCat?.classList.add('selected');

                if(this.#summaryHasIcon(pButton, 'h2.summary', 'fa-minus-square')) {
                    if(pButton) this._slideDown(pButton);
                }
                if(this.#summaryHasIcon(pButton, 'h3.summary', 'fa-minus-square')) {
                    if(pButton) this._slideDown(pButton);
                }
                if(this.#summaryHasIcon(pCat, 'h2.summary', 'fa-minus-square')) {
                    if(pButton) this._slideDown(pButton);
                    if(pCat) this._slideDown(pCat);
                }
            }
        }

        button?.classList.add('selected');
        target.closest('div.cat')?.classList.add('selected');

        if(!double) {
            const aspects = this.#siblings(grpWpn, 'div.aspects');
            const totem = this.#siblings(grpWpn, 'label.totem');
            const grpBtn = this.#siblings(grpWpn, 'div.grpBtn');

            if(wpn?.tourelle) {
                aspects.forEach(el => el.style.display = 'none');
                totem.forEach(el => {
                    el.classList.add('rowSevenEight');
                    el.classList.remove('rowSixSeven');
                });
                grpBtn.forEach(el => {
                    el.classList.remove('rowTwo', 'rowFour', 'rowOneFour', 'rowThreeFive');
                    el.classList.add('rowTwoSix');
                });
            } else {
                totem.forEach(el => {
                    el.classList.add('rowSevenEight');
                    el.classList.remove('rowSixSeven');
                });
                aspects.forEach(el => this._slideUp(el));
            }
        }

        this.#updateStyleShow(undefined, wpn);
    }

    #unselectWpn(target, double=false) {
        const button = target.closest('div.button');
        const cat = target.closest('div.cat');
        const grpWpn = target.closest('div.grpWpn');
        const id = button?.dataset.id;

        if(id === this.rollData.wpnSelected && !double) this.rollData.wpnSelected = '';
        else if(id === this.rollData.wpnSecond && double) this.rollData.wpnSecond = '';

        const icon = target.querySelector('i');

        if(!double) {
            target.classList.remove('selected');
            icon?.classList.remove('fa-solid', 'fa-check');
        }
        else {
            target.classList.remove('doubleSelected');
            icon?.classList.remove('fa-solid', 'fa-check-double');
        }

        button?.classList.remove('selected');
        cat?.classList.remove('selected');

        // siblings .data / .bases / .effets → slideUp
        for(const cls of ['.data', '.bases', '.effets']) {
            this.#siblings(target, cls).forEach(el => this._slideUp(el));
        }

        if(this.#summaryHasIcon(button, 'h2.summary', 'fa-plus-square')) {
            if(button) this._slideUp(button);
        }
        if(this.#summaryHasIcon(button, 'h3.summary', 'fa-plus-square')) {
            if(button) this._slideUp(button);
        }
        if(this.#summaryHasIcon(cat, 'h2.summary', 'fa-plus-square')) {
            if(button) this._slideUp(button);
            if(cat) this._slideUp(cat);
        }

        if(!this.rollData.wpnSelected) {
            const totem = this.#siblings(grpWpn, 'label.totem');
            const aspects = this.#siblings(grpWpn, 'div.aspects');

            totem.forEach(el => {
                el.classList.remove('rowSevenEight');
                el.classList.add('rowSixSeven');
            });

            aspects.forEach(el => this._slideDown(el));
        }

        this.#updateStyleShow(undefined, undefined, true);
    }

    #updateStyleShow(style = undefined, wpn = undefined, forceUnselect = false) {
        const data = this.rollData;
        const html = data?.html;
        if(!html) return;

        const root = html;

        const zones = {
            pilonnage:   root.querySelector('.pilonnage'),
            precis:      root.querySelector('.precis'),
            puissant:    root.querySelector('.puissant'),
            suppression: root.querySelector('.suppression'),
        };

        const hideAll = () => {
            for(const z of Object.values(zones)) this._hide(z);
        };
        const showOnly = (key) => {
            for(const [k, z] of Object.entries(zones)) {
                if(k === key) this._show(z);
                else this._hide(z);
            }
        };


        // Source de vérité : rollData
        const currentStyle = style ?? this.style;
        const currentWpn   = wpn   ?? data.allWpn.find(itm => itm.id === data.wpnSelected);

        if(!currentWpn || forceUnselect) {
            hideAll();
            return;
        }

        const rawEffets = [
            ...(currentWpn?.effets?.raw ?? []),
            ...(currentWpn?.distance?.raw ?? []),
            ...(currentWpn?.structurelles?.raw ?? []),
            ...(currentWpn?.ornementales?.raw ?? []),
        ];
        const effetSet = new Set(rawEffets);
        const options  = currentWpn.options ?? {};
        const type     = currentWpn.type;

        const has    = (effet)  => this.#isEffetActive(effetSet, options, [effet]);
        const hasAny = (effets) => this.#isEffetActive(effetSet, options, effets);

        const DEUX_MAINS_LIKE = ['deuxmains', 'systemerefroidissement', 'munitionshypervelocite'];

        const rules = {
            pilonnage:   () => type === 'distance' && hasAny(DEUX_MAINS_LIKE),
            precis:      () => type === 'contact'  && hasAny(DEUX_MAINS_LIKE),
            puissant:    () => type === 'contact'  && (has('lourd') || (has('deuxmains') && hasAny(['systemerefroidissement', 'munitionshypervelocite']))),
            suppression: () => type === 'distance' && (has('lourd') || (has('deuxmains') && hasAny(['systemerefroidissement', 'munitionshypervelocite']))),
        };

        if(!Object.hasOwn(rules, currentStyle) || !rules[currentStyle]()) {
            hideAll();
            return;
        }

        showOnly(currentStyle);
    }

    #updateBtnShow(forceUnselect=false, init=false) {
        const html = this.rollData.html;
        const hasWpn = this.rollData.wpnSelected === '' ? false : true;
        const isPJ = this.isPJ;

        const modDmg = html.querySelector('.modificateurdegats');
        const modVio = html.querySelector('.modificateurviolence');
        const maxDmg = html.querySelector('.maximizedegats');
        const maxVio = html.querySelector('.maximizeviolence');
        const modHer = html.querySelector('.modeheroique');
        const attSur = html.querySelector('.attaquesurprise');
        const scoDif = html.querySelector('.score.difficulte');
        const sucBon = html.querySelector('.score.succesBonus');
        const sucMod = html.querySelector('.score.modificateur');
        const grpBtn = html.querySelector('.grpBtn');

        if(!hasWpn || forceUnselect) {
            if(init) {
                const toHide = [modDmg, modVio, maxDmg, maxVio, modHer, attSur];

                toHide.forEach(h => this._hide(h));
                this._show(scoDif);

                sucBon.classList.add('colTwo');
                sucMod.classList.add('colOne');

                sucBon.classList.remove('colOne');
                sucMod.classList.remove('colTwo');
            } else {
                const toHide = [modDmg, modVio, maxDmg, maxVio, modHer, attSur];

                toHide.forEach(h => this._slideUp(h));

                this._slideDown(scoDif);

                sucBon.classList.add('colTwo');
                sucMod.classList.add('colThree');

                sucBon.classList.remove('colOne');
                sucMod.classList.remove('colTwo');
            }

            if(!isPJ) this._hide(grpBtn)
            grpBtn.classList.add('rowTwo');
            grpBtn.classList.remove('rowOneFour');
            grpBtn.classList.remove('rowThreeFive');
        } else {
            if(init) {
                const toShow = [modDmg, modVio, maxDmg, maxVio, attSur];

                toShow.forEach(h => this._show(h));
                this._hide(scoDif);

                if(isPJ) {
                    this._show(modHer);
                } else {
                    this._hide(modHer);
                }

                sucBon.classList.remove('colTwo');
                sucMod.classList.remove('colThree');

                sucBon.classList.add('colOne');
                sucMod.classList.add('colTwo');
            } else {
                const toShow = [modDmg, modVio, maxDmg, maxVio, attSur];

                toShow.forEach(h => this._slideDown(h));

                if(isPJ) {
                    this._slideDown(modHer);
                } else {
                    this._slideUp(modHer);
                }

                this._slideUp(scoDif);

                sucBon.classList.remove('colTwo');
                sucMod.classList.remove('colThree');

                sucBon.classList.add('colOne');
                sucMod.classList.add('colTwo');
            }

            if(!isPJ) this._show(grpBtn);

            grpBtn.classList.remove('rowTwo', 'rowFour', 'rowOneFour', 'rowThreeFive');

            if(isPJ) grpBtn.classList.add('rowOneFour');
            else grpBtn.classList.add('rowThreeFive');
        }
    }

    #reconcileBonusInterdits() {
        const { bonus, interdits } = this.attrMods;
        const rData = this.rollData;

        // Retire les interdits de whatRoll + dédoublonne (cf. le [...new Set()] de #roll)
        rData.whatRoll = [...new Set(rData.whatRoll.filter(v => !interdits.includes(v)))];

        // Si la base est interdite, elle cède sa place au 1er whatRoll dispo
        if(interdits.includes(rData.base)) {
            rData.base = rData.whatRoll.shift() ?? '';
        }

        // Si la base est un bonus, elle bascule en whatRoll et cède sa place
        if(bonus.includes(rData.base) && rData.whatRoll.length !== 0) {
            const old = rData.base;
            rData.base = rData.whatRoll.shift();
            if(!rData.whatRoll.includes(old)) rData.whatRoll.push(old);
        }
    }

    #renderBonusInterdits(html) {
        const { bonus, interdits } = this.attrMods;
        const rData = this.rollData;
        const root = html instanceof jQuery ? html[0] : html;

        for(const btn of root.querySelectorAll('button.btnCaracteristique')) {
            const value = btn.dataset.value;
            const i = btn.querySelector('i');
            const isInterdit = interdits.includes(value);
            const isBonus    = bonus.includes(value);
            const isBase     = rData.base === value;
            const isSelected = rData.whatRoll.includes(value);

            // Opacité + hover
            const dimmed = isInterdit || isBonus;
            btn.style.opacity = dimmed ? '0.5' : '1';
            btn.classList.toggle('wHover', !dimmed);

            // Reset des classes/icônes pilotées par l'état
            btn.classList.remove('base', 'selected');
            i?.classList.remove('fa-solid', 'fa-check-double', 'fa-check');

            if(isInterdit) continue; // interdit = rien d'autre

            if(isBase) {
                btn.classList.add('base');
                i?.classList.add('fa-solid', 'fa-check-double');   // base = double
            } else if(isSelected) {
                btn.classList.add('selected');
                i?.classList.add('fa-solid', 'fa-check');           // selected = simple
            } else if(isBonus) {
                i?.classList.add('fa-solid', 'fa-check');           // bonus = simple
            }
        }
    }

    #updateBonusInterdits(b, html) {
        this.#reconcileBonusInterdits();
        this.#renderBonusInterdits(html);
    }

    #sanitizeWpn(tgt, html) {
        const { distance, contact, grenade, complexe, aidistance, aicontact, tourelle } = {
            distance: this.rollData.typeWpn.distance.length > 0,
            contact: this.rollData.typeWpn.contact.length > 0,
            grenade: this.rollData.typeWpn.grenade.length > 0,
            complexe: this.rollData.typeWpn.complexe.length > 0,
            tourelle: this.rollData.typeWpn.tourelle.length > 0,
            aidistance: this.rollData.typeWpn.aidistance.length > 0,
            aicontact: this.rollData.typeWpn.aicontact.length > 0,
        };

        // Normalise tgt en tableau d'éléments
        const targets = tgt == null
            ? []
            : (tgt instanceof Element ? [tgt] : Array.from(tgt));

        for(const t of targets) {
            const isSelected = t.classList.contains('selected');
            const button = t.closest('div.button');
            const cat = t.closest('div.cat');

            if(isSelected) {
                this._show(t);
                if(button) this._show(button);
                if(cat) this._show(cat);

                // $button.parents('div.button').siblings('div.button')
                // => les div.button frères du div.button parent de button
                const parentButton = button?.parentElement?.closest('div.button');
                if(parentButton) {
                    this.#siblings(parentButton, 'div.button').forEach(el => this._show(el));
                }
            } else {
                button?.classList.remove('selected');
            }

            // $cat.find('h3 i').hasClass('fa-minus-square')
            const catIcon = cat?.querySelector('h3 i');
            if(catIcon?.classList.contains('fa-minus-square')) {
                // $cat.find('h3').siblings().show()
                const h3 = cat.querySelector('h3');
                if(h3) this.#siblings(h3, '*').forEach(el => this._show(el));
            }
        }

        // toggle visibilité des zones
        const setVisible = (selector, visible) => {
            const el = html.querySelector(selector);
            if(el) visible ? this._show(el) : this._hide(el);
        };

        setVisible('div.wpn.wpndistance', distance);
        setVisible('div.wpn.wpncontact', contact);
        setVisible('div.wpn.grenade', grenade);
        setVisible('div.wpn.complexe', complexe);
        setVisible('div.wpn.tourelle', tourelle);
        setVisible('div.wpn.aicontact', aicontact);
        setVisible('div.wpn.aidistance', aidistance);

        // classes colonnes
        const wpndistance = html.querySelector('div.wpn.wpndistance');
        if(wpndistance) {
            wpndistance.classList.toggle('colTwo', contact);
            wpndistance.classList.toggle('colOne', !contact);
        }

        const grenadeEl = html.querySelector('div.wpn.grenade');
        if(grenadeEl) {
            grenadeEl.classList.toggle('colDuo',
                (!tourelle && (complexe || (contact && distance))) ||
                (!tourelle && (!complexe && (!contact && !distance))));
            grenadeEl.classList.toggle('colOne',
                tourelle && ((!distance && !contact) || (contact && distance) || complexe));
            grenadeEl.classList.toggle('colTwo',
                (!complexe && ((!distance && contact) || (distance && !contact))));
        }

        const tourelleEl = html.querySelector('div.wpn.tourelle');
        if(tourelleEl) {
            tourelleEl.classList.toggle('colDuo',
                (!grenade || ((grenade && !distance && contact && !complexe) ||
                            (grenade && !contact && distance && !complexe))));
            tourelleEl.classList.toggle('colTwo',
                grenade && ((!distance && !contact) || (contact && distance) || complexe));
        }

        this.#updateStyleShow(undefined, undefined);
    }

    #getValueAspect(actor, name) {
        let whatName = this.isPJ ? name : this.#convertCaracToAspect(name);
        let result = 0;

        switch(whatName) {
            case 'chair':
            case 'bete':
            case 'machine':
            case 'dame':
            case 'masque':
                result = actor.system.aspects[whatName].value;
                break;

            case 'deplacement':
            case 'force':
            case 'endurance':
                result = actor.system.aspects.chair.caracteristiques[whatName].value;
                break;

            case 'combat':
            case 'hargne':
            case 'instinct':
                result = actor.system.aspects.bete.caracteristiques[whatName].value;
                break;

            case 'tir':
            case 'savoir':
            case 'technique':
                result = actor.system.aspects.machine.caracteristiques[whatName].value;
                break;

            case 'parole':
            case 'aura':
            case 'sangFroid':
                result = actor.system.aspects.dame.caracteristiques[whatName].value;
                break;

            case 'discretion':
            case 'dexterite':
            case 'perception':
                result = actor.system.aspects.masque.caracteristiques[whatName].value;
                break;

            default:
                result = 0;
                break;
        }

        return result;
    }

    #getODAspect(actor, name) {
        let whatName = this.isPJ ? name : this.#convertCaracToAspect(name);
        let result = 0;

        switch(whatName) {
            case 'chair':
            case 'bete':
            case 'machine':
            case 'dame':
            case 'masque':
                result = actor.system.aspects[whatName].ae.majeur.value+actor.system.aspects[whatName].ae.mineur.value;
                break;

            case 'deplacement':
            case 'force':
            case 'endurance':
                result = actor.system.aspects.chair.caracteristiques[whatName].overdrive.value;
                break;

            case 'combat':
            case 'hargne':
            case 'instinct':
                result = actor.system.aspects.bete.caracteristiques[whatName].overdrive.value;
                break;

            case 'tir':
            case 'savoir':
            case 'technique':
                result = actor.system.aspects.machine.caracteristiques[whatName].overdrive.value;
                break;

            case 'parole':
            case 'aura':
            case 'sangFroid':
                result = actor.system.aspects.dame.caracteristiques[whatName].overdrive.value;
                break;

            case 'discretion':
            case 'dexterite':
            case 'perception':
                result = actor.system.aspects.masque.caracteristiques[whatName].overdrive.value;
                break;
        }

        return result;
    }

    #convertCaracToAspect(name) {
        const aspect = {
            'chair':'chair',
            'bete':'bete',
            'machine':'machine',
            'dame':'dame',
            'masque':'masque',
            'deplacement':'chair',
            'force':'chair',
            'endurance':'chair',
            'combat':'bete',
            'hargne':'bete',
            'instinct':'bete',
            'tir':'machine',
            'savoir':'machine',
            'technique':'machine',
            'parole':'dame',
            'aura':'dame',
            'sangFroid':'dame',
            'discretion':'masque',
            'dexterite':'masque',
            'perception':'masque',
        }[name];

        return aspect;
    }

    #getLabelRoll(name) {
        let result = '';

        switch(name) {
            case 'chair':
            case 'bete':
            case 'machine':
            case 'dame':
            case 'masque':
                result = game.i18n.localize(CONFIG.KNIGHT.aspects[name]);
                break;

            default:
                result = game.i18n.localize(CONFIG.KNIGHT.caracteristiques[name]);
                break;
        }

        return result;
    }

    #searchOptions(list, searched) {
        let result = list.find(itm => itm.value === searched);

        return result;
    }

    #hasEffet(list, searched) {
        let result = false;

        if(list.some(effet => effet.includes(searched))) result = true;

        return result;
    }

    #isEffetActive(effets, options, data=[]) {
        let result = false;

        for(let d of data) {
            if(d === 'cadence' && this.#hasEffet(effets, 'chromeligneslumineuses')) continue;
            if(d === 'silencieux' && this.#hasEffet(effets, 'assassine')) continue;
            if(d === 'silencieux' && this.#hasEffet(effets, 'munitionssubsoniques')) continue;
            if(d === 'choc' && this.#hasEffet(effets, 'electrifiee')) continue;
            if(d === 'jumeleakimbo' && this.#hasEffet(effets, 'jumelle')) continue;
            if(d === 'jumeleakimbo' && this.#hasEffet(effets, 'jumelageakimbo')) continue;
            if(d === 'jumeleambidextrie' && this.#hasEffet(effets, 'soeur')) continue;
            if(d === 'jumeleambidextrie' && this.#hasEffet(effets, 'jumelageambidextrie')) continue;
            if(d === 'assistanceattaque' && this.#hasEffet(effets, 'connectee')) continue;
            if(d === 'assistanceattaque' && this.#hasEffet(effets, 'munitionshypervelocite')) continue;
            if(d === 'tirenrafale' && this.#hasEffet(effets, 'systemerefroidissement')) continue;
            if(d === 'tirensecurite' && this.#hasEffet(effets, 'interfaceguidage')) continue;

            if(this.#hasEffet(effets, d) && !this.#searchOptions(options, d)) result = true;
            else if(this.#hasEffet(effets, d) && this.#searchOptions(options, d).active) result = true;
        }

        return result;
    }

    #getWpnHTML(data={}) {
        let addStartStyle = "";
        if(data.noShow) addStartStyle += "style='display:none;'";

        const start = `
        <div class="button" data-id="${data.id}" ${addStartStyle}>
            <button type="action" class="${data.classes}">
                <i></i>
                ${data.label}
            </button>
            <div class="data" style="display:none;">`;
        let mid = ``;
        const end = `</div></div>`;

        for(let o of data.options) {
            switch(o.key) {
                case 'select':
                    const list = o.list;

                    mid += `<label class="${o.classes}" data-value="${o.value}" data-id="${o.id}">`

                    if(o.label) mid += `<span>${o.label}</span>`;

                    mid += `<select data-value="${o.selectvalue}">`

                    if(o.hasBlank) {
                        if(o.selected === '') mid += `<option value ='' selected></option>`;
                        else mid += `<option value =''></option>`;
                    }

                    for(let l in list) {
                        if(list[l].selected) mid += `<option value='${l}' selected>${list[l]}</option>`;
                        else  mid += `<option value='${l}'>${list[l]}</option>`;
                    }

                    mid += `</select></label>`;
                    break;

                case 'duoselect':
                    const list1 = o.list1;
                    const list2 = o.list2;

                    mid += `<div class="${o.classes}" data-value="${o.value}" data-id="${o.id}">`

                    if(o.label) mid += `<span>${o.label}</span>`;

                    mid += `<select class="select1" data-value="${o.select1value}">`

                    if(o.hasBlank) {
                        if(o.selected1 === '') mid += `<option value ='' selected></option>`;
                        else mid += `<option value =''></option>`;
                    }

                    for(let l in list1) {
                        if(list1[l].selected) mid += `<option value='${l}' selected>${list1[l]}</option>`;
                        else  mid += `<option value='${l}'>${list1[l]}</option>`;
                    }

                    mid += `</select>`;

                    mid += `<select class="select2" data-value="${o.select2value}">`

                    if(o.hasBlank) {
                        if(o.selected2 === '') mid += `<option value ='' selected></option>`;
                        else mid += `<option value =''></option>`;
                    }

                    for(let l in list2) {
                        if(list2[l].selected) mid += `<option value='${l}' selected>${list2[l]}</option>`;
                        else  mid += `<option value='${l}'>${list2[l]}</option>`;
                    }

                    mid += `</select></div>`;
                    break;

                case 'btn':
                    mid += `<button type="action" class="${o.classes}" data-value="${o.value}" title="${o.title}">`

                    if(o.special !== 'roll') mid += `<i></i>`;

                    mid += `${o.label}</button>`;
                    break;
            }
        }

        return start+mid+end;
    }

    #getWpnComplexeHTML(data={}) {
        const labels = getAllEffects();

        if(data.id === this.rollData.wpnSelected) data.classes += ' selected';

        const start = `<div class="wpn wpnComplexe longbow button" data-id="${data.id}">
                <button type="action" class="${data.classes}">
                    <i></i>
                    ${data.label}
                    <span>${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.LONGBOW.Cout')} : ${data.cout} ${game.i18n.localize('KNIGHT.AUTRE.PointEnergie-short')}</span>
                </button>`;

        const dgtsList = data.possibility.degats.list;
        const violenceList = data.possibility.violence.list;
        const porteeList = data.possibility.portee.list;
        let bases = `<div class="bases" style="display:none;">
        <label class="longbow_dgts">
            <span>${game.i18n.localize('KNIGHT.AUTRE.Degats')}</span>
            <select>`

        for(let l in dgtsList) {
            bases += parseInt(l) == data.degats.dice ? `<option value="${l}" selected>${dgtsList[l]}</option>` : `<option value="${l}">${dgtsList[l]}</option>`;
        }

        bases += `</select>
                    </label>
                    <label class="longbow_violence">
                        <span>${game.i18n.localize('KNIGHT.AUTRE.Violence')}</span>
                        <select>`;

        for(let l in violenceList) {
            bases += parseInt(l) == data.violence.dice ? `<option value="${l}" selected>${violenceList[l]}</option>` : `<option value="${l}">${violenceList[l]}</option>`;
        }

        bases += `</select>
                    </label>
                    <label class="longbow_portee">
                        <span>${game.i18n.localize('KNIGHT.PORTEE.Label')}</span>
                        <select>`;

        for(let l in porteeList) {
            bases += parseInt(l) == data.portee ? `<option value="${l}" selected>${porteeList[l]}</option>` : `<option value="${l}">${porteeList[l]}</option>`;
        }

        bases += `</select>
                    </label>
                </div>`;

        let mid = `<div class="data" style="display:none;">`;

        for(let o of data.options) {
            switch(o.key) {
                case 'select':
                    const list = o.list;

                    mid += `<label class="${o.classes}" data-value="${o.value}" data-id="${o.id}">`

                    if(o.label) mid += `<span>${o.label}</span>`;

                    mid += `<select data-value="${o.selectvalue}">`

                    if(o.hasBlank) {
                        if(o.selected === '') mid += `<option value ='' selected></option>`;
                        else mid += `<option value =''></option>`;
                    }

                    for(let l in list) {
                        if(list[l].selected) mid += `<option value='${l}' selected>${list[l]}</option>`;
                        else  mid += `<option value='${l}'>${list[l]}</option>`;
                    }

                    mid += `</select></label>`;
                    break;

                case 'btn':
                    mid += `<button type="action" class="${o.classes}" data-value="${o.value}" title="${o.title}">`

                    if(o.special !== 'roll') mid += `<i></i>`;

                    mid += `${o.label}</button>`;
                    break;
            }
        }

        mid += `</div>`;

        let effets = `<div class="effets ${data.possibility.classes}" style="display:none;">`;

        if(data.possibility.liste1) {
            effets += `<div class="liste liste1">
                        <header>
                            <span></span>
                            <span class="label">${game.i18n.localize('KNIGHT.EFFETS.Label')}</span>
                            <span class="score">${data.possibility.liste1.energie} ${game.i18n.localize('KNIGHT.AUTRE.PointEnergie-short')}</span>
                        </header>
                        <div class="block">`;

            const effetsList = listEffects(data.possibility.liste1, labels);

            for(let l of effetsList) {
                effets += `<a title="${l.description}" data-raw="${l.raw}">
                                    <i></i>
                                    ${l.name}
                                </a>`;
            }

            effets += `</div></div>`;
        }

        if(data.possibility.liste2) {
            effets += `<div class="liste liste2">
                        <header>
                            <span></span>
                            <span class="label">${game.i18n.localize('KNIGHT.EFFETS.Label')}</span>
                            <span class="score">${data.possibility.liste2.energie} ${game.i18n.localize('KNIGHT.AUTRE.PointEnergie-short')}</span>
                        </header>
                        <div class="block">`;

            const effetsList = listEffects(data.possibility.liste2, labels);

            for(let l of effetsList) {
                effets += `<a title="${l.description}" data-raw="${l.raw}">
                                    <i></i>
                                    ${l.name}
                                </a>`;
            }

            effets += `</div></div>`;
        }

        if(data.possibility.liste3) {
            effets += `<div class="liste liste3">
                        <header>
                            <span></span>
                            <span class="label">${game.i18n.localize('KNIGHT.EFFETS.Label')}</span>
                            <span class="score">${data.possibility.liste3.energie} ${game.i18n.localize('KNIGHT.AUTRE.PointEnergie-short')}</span>
                        </header>
                        <div class="block">`;

            const effetsList = listEffects(data.possibility.liste3, labels);

            for(let l of effetsList) {
                effets += `<a title="${l.description}" data-raw="${l.raw}">
                                    <i></i>
                                    ${l.name}
                                </a>`;
            }

            effets += `</div></div>`;
        }

        let end = `</div></div>`;

        return start+bases+mid+effets+end;
    }

    #cleanHtml() {
        const html = this.rollData.html;
        const selectors = [
            'div.wpn.wpncontact .button',
            'div.wpn.wpndistance .button',
            'div.wpn.tourelle .button',
            'div.wpn.aicontact .cat .button',
            'div.wpn.aidistance .cat .button',
            'div.wpn.grenade .button',
            'div.complexe .button',
        ];
        for(const sel of selectors) html.querySelectorAll(sel).forEach(el => el.remove());
    }

    #updateWpnContact(contact) {
        const target = this.rollData.html.querySelector('div.wpn.wpncontact');
        if(target) target.insertAdjacentHTML('beforeend', contact.map(w => this.#getWpnHTML(w)).join(''));
    }

    #updateWpnDistance(distance) {
        const target = this.rollData.html.querySelector('div.wpn.wpndistance');
        if(target) target.insertAdjacentHTML('beforeend', distance.map(w => this.#getWpnHTML(w)).join(''));
    }

    #updateWpnTourelle(distance) {
        const target = this.rollData.html.querySelector('div.wpn.tourelle');
        if(target) target.insertAdjacentHTML('beforeend', distance.map(w => this.#getWpnHTML(w)).join(''));
    }

    #updateWpnComplexe(complexe) {
        const target = this.rollData.html.querySelector('div.complexe');
        if(target) target.insertAdjacentHTML('beforeend', complexe.map(w => this.#getWpnComplexeHTML(w)).join(''));
    }

    #updateWpnAIContact(ai) {
        const html = this.rollData.html;

        for(const w of ai) {
            let content = '';

            for(const l of w.list) {
                content += this.#getWpnHTML(l);
            }

            html.querySelector(`div.wpn.aicontact div.cat.${w.id}`)
                ?.insertAdjacentHTML('beforeend', content);
        }
    }

    #updateWpnAIDistance(ai) {
        const html = this.rollData.html;

        for(const w of ai) {
            let content = '';

            for(const l of w.list) {
                content += this.#getWpnHTML(l);
            }

            html.querySelector(`div.wpn.aidistance div.cat.${w.id}`)
                ?.insertAdjacentHTML('beforeend', content);
        }
    }

    #updateWpnGrenade(grenade) {
        const html = this.rollData.html;
        const collapsed = !!html.querySelector('div.wpn.grenade h2 i.fa-plus-square');
        let htmlGrenade = '';
        for(const w of grenade) {
            if(collapsed) w.noShow = true;
            htmlGrenade += this.#getWpnHTML(w);
        }
        html.querySelector('div.wpn.grenade')?.insertAdjacentHTML('beforeend', htmlGrenade);
    }

    #updateWpn(id, update) {
        const wpn = this.rollData.allWpn.find(itm => itm.id === id);

        for(let upd in update) {
            if(id.includes('module')) {
                if(upd.includes('options2mains') && (wpn.type === 'contact' || wpn.type === 'distance')) {
                    this.actor.updateEmbeddedDocuments("Item", [{
                        _id: id,
                        [`system.niveau.actuel.arme.${upd}`]: update[upd]
                    }]);
                }

                if(upd.includes('munitions') && (wpn.type === 'contact' || wpn.type === 'distance')) {
                    this.actor.updateEmbeddedDocuments("Item", [{
                        _id: id,
                        [`system.niveau.actuel.arme.${upd}`]:update[upd]
                    }]);
                }
            } else {
                if(upd.includes('options2mains') && (wpn.type === 'contact' || wpn.type === 'distance')) {
                    this.actor.updateEmbeddedDocuments("Item", [{
                        _id: id,
                        [`system.${upd}`]:update[upd]
                    }]);
                }

                if(upd.includes('munitions') && (wpn.type === 'contact' || wpn.type === 'distance')) {
                    this.actor.updateEmbeddedDocuments("Item", [{
                        _id: id,
                        [`system.${upd}`]:update[upd]
                    }]);
                }
            }
        }
    }

    #depenseEnergie(amount, forceEspoir=false) {
        const baseActor = this.actor;
        const actor = baseActor.type === 'vehicule' ? this.who : this.actor;
        const isPJ = this.isPJ;
        const armure = actor.items.find(itm => itm.type === 'armure');
        const remplaceEnergie = forceEspoir ? true : armure?.system?.espoir?.remplaceEnergie || false;
        const actuel = remplaceEnergie ? Number(actor.system.espoir.value) : Number(actor.system.energie.value);
        const type = remplaceEnergie ? 'espoir' : 'energie';
        const hasJauge = isPJ && actor.type !== 'mechaarmure' ? actor.system.jauges[type] : true;
        const lNot = remplaceEnergie ? game.i18n.localize('KNIGHT.JETS.Notespoir') : game.i18n.localize('KNIGHT.JETS.Notenergie');
        let update = {};
        let msg = '';
        let classes = '';
        let coutCalcule = amount;
        let substract = 0;

        if(remplaceEnergie && coutCalcule > 0) {
            coutCalcule = armure.system.espoir.cout > 0 ? Math.max(Math.floor(coutCalcule / armure.system.espoir.cout), 1) : coutCalcule;
            if(coutCalcule < 1) coutCalcule = 1;
        }

        substract = actuel-coutCalcule;

        if(substract < 0 || !hasJauge) {
            msg = lNot;
            classes = 'important'
        } else {
            if(remplaceEnergie && !actor?.system?.espoir?.perte?.saufAgonie) update[`system.espoir.value`] = substract;
            else if(!remplaceEnergie && baseActor.type === 'knight') update[`system.equipements.${actor.system.wear}.energie.value`] = substract;
            else if(!remplaceEnergie && baseActor.type !== 'knight') update[`system.energie.value`] = substract;
        }

        return {
            msg:msg,
            classes:classes,
            update:update,
            substract:substract,
            espoir:remplaceEnergie,
            depense:coutCalcule,
        };
    }

    #updatePassiveUltime(items, name, data) {
        const capaciteultime = items.find(items => items.type === 'capaciteultime');

        if(!capaciteultime) return;
        const type = capaciteultime.system.type;

        if(type !== 'passive') return;
        const system = capaciteultime.system.passives;

        if(!system.capacites.actif) return;

        switch(name) {
            case 'vague':
            case 'rayon':
            case 'salve':
                if(!system.capacites.cea.actif) return;

                Object.assign(data, {
                    degats:{
                        dice:system.capacites.cea.update[name].degats.dice,
                        fixe:system.capacites.cea.update[name].degats.fixe,
                    },
                    violence:{
                        dice:system.capacites.cea.update[name].violence.dice,
                        fixe:system.capacites.cea.update[name].violence.fixe,
                    },
                    effets:{
                        raw:[...data.effets.raw, ...system.capacites.cea.update[name].effets.raw],
                        custom:[...data.effets.custom, ...system.capacites.cea.update[name].effets.custom],
                    }
                });
                break;

            case 'lame':
            case 'canon':
            case 'griffe':
                if(!system.capacites.morph.actif) return;

                Object.assign(data, {
                    degats:{
                        dice:system.capacites.morph.update.polymorphie[name].degats.dice,
                        fixe:system.capacites.morph.update.polymorphie[name].degats.fixe,
                    },
                    violence:{
                        dice:system.capacites.morph.update.polymorphie[name].violence.dice,
                        fixe:system.capacites.morph.update.polymorphie[name].violence.fixe,
                    },
                    effets:{
                        raw:[...data.effets.raw, ...system.capacites.morph.update.polymorphie[name].effets.raw],
                        custom:[...data.effets.custom, ...system.capacites.morph.update.polymorphie[name].effets.custom],
                    }
                });
                break;
        }
    }

    #updateTotem() {
        this.#prepareTotem(this.rollData.html, this.nbreTotemTotal, this.nbreTotemShow, 'totem');
        this.#prepareTotem(this.rollData.html, this.nbreTotemLTotal, this.nbreTotemLShow, 'totemL');
    }

    #getBonusModulesByType(actor, type, bonusType, whoActivate) {
        return actor.items.filter(itm => {
            if (itm.type !== 'module') return false;

            // Commun
            const actif = itm.system?.active?.base ?? false;
            const permanent = itm.system?.niveau?.actuel?.permanent ?? false;
            const bonus = itm.system?.niveau?.actuel?.bonus;

            if (!bonus?.has) return false;
            if (!actif && !permanent) return false;

            // Condition spéciale véhicule
            if (type === 'vehicule' &&
                itm.system?.niveau?.actuel?.whoActivate !== whoActivate) {
                return false;
            }

            // Vérifie degats ou violence
            const degatsOK =
                (bonus.degats?.has ?? false) &&
                (bonus.degats?.type ?? 'contact') === bonusType;

            const violenceOK =
                (bonus.violence?.has ?? false) &&
                (bonus.violence?.type ?? 'contact') === bonusType;

            return degatsOK || violenceOK;
        });
    }

    #getBonusCyberwareByType(actor, bonusType) {
        return actor.items.filter(itm => {
            if (itm.type !== 'cyberware') return false;

            // Commun
            const actif = itm.system?.isActive ?? false;
            const degats = itm.system?.degats;
            const violence = itm.system?.violence;

            if (!degats?.has && !violence?.has) return false;
            if (!actif) return false;

            // Vérifie degats ou violence
            const degatsOK = (degats?.type ?? 'contact') === bonusType;

            const violenceOK = (violence?.type ?? 'contact') === bonusType;

            return degatsOK || violenceOK;
        });
    }

    #getWpnModules(items, type, whoActivate) {
        return items.filter(itm => {
            if (itm.type !== 'module') return false;

            const actif = itm.system?.active?.base ?? false;
            const permanent = itm.system?.niveau?.actuel?.permanent ?? false;
            const arme = itm.system?.niveau?.actuel?.arme?.has ?? false;

            // Exclure si pas d'arme
            if (!arme) return false;

            // Condition spéciale pour les véhicules
            if (type === 'vehicule') {
                const activateur = itm.system?.niveau?.actuel?.whoActivate;
                if (activateur !== whoActivate) return false;
                return true;
            }

            // Côté non-vehicle : actif OU permanent
            return actif || permanent;
        });
    }

    #getWpnCyberware(items) {
        return items.filter(itm => {
            if(itm.type !== 'cyberware') return false;

            if(itm.system.isActive && itm.system.arme.has) return true;
        })
    }

    #getErsatzRogue(actor) {
        const module = actor.items.find(itm => itm.type === 'module' && itm?.system?.active?.base && itm?.system?.niveau?.actuel?.ersatz?.rogue?.has);
        let result = null;

        if(module) {
            result = {
                ...module.system.niveau.actuel.ersatz.rogue,
                name:module.name,
                _id:module._id,
                item:module,
            }
        } else if(actor.system.hasCyberware) {
            const cyberware = actor.items.find(itm => itm.type === 'cyberware' && itm?.system?.isActive && itm?.system?.module?.has && itm?.system?.module?.ersatz?.rogue?.has);

            if(cyberware) {
                result = {
                    ...cyberware.system.module.ersatz.rogue,
                    name:cyberware.name,
                    _id:cyberware._id,
                    item:cyberware,
                }
            }
        }

        return result;
    }

    #prepareTotem(html, nbreTotal, nbreShow, search) {
        for(let n = 0;n < nbreTotal;n++) {
            const totem = html.querySelector(`label.${search}${n}`);
            if(!totem) continue;
            const select = totem.querySelector('select');

            totem.style.display = n < nbreShow ? '' : 'none';

            if(select) {
                select.value = this?.rollData?.[search]?.[`t${n}`] ?? '';
            }
        }
    }

    #getStructureSignature() {
        return {
            nbreTotemTotal: this.nbreTotemTotal,
            nbreTotemLTotal: this.nbreTotemLTotal,
            // Ajoute ici tout ce qui modifie la STRUCTURE du template
            // (pas juste les valeurs), ex: présence de styles spéciaux PJ/PNJ
            isPJ: this.isPJ,
            armorIsWear: this.armorIsWear,
        };
    }

    #needFullRerender() {
        const current = this.#getStructureSignature();
        const previous = this.rollData.structure;

        const changed = !foundry.utils.isEmpty(
            foundry.utils.diffObject(previous, current)
        ) || !foundry.utils.isEmpty(
            foundry.utils.diffObject(current, previous)
        );

        return changed;
    }

    async #fullRerender() {
        // On sauvegarde la signature
        this.rollData.structure = this.#getStructureSignature();

        // On re-prépare boutons / mods / titre au cas où ils dépendent de l'état
        //this.#prepareTitle();
        this.#prepareButtons();

        // On régénère le contenu HTML complet (totems inclus)
        this.system.content = await renderTemplate(
            KnightRollDialog.dialogRoll,
            this.#prepareOptions()
        );

        // render(true) va réinjecter content + rappeler activateListeners
        // qui ré-attache tous les listeners et restaure l'état via
        // #renderInitialization / #renderHTML
        this.render(true);
    }

    static async #onSubmit(event, form, formData, options={}) {
        await this.system.update(formData.object);
    }
}