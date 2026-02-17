import toggler from '../helpers/toggler.js';
import {
    getModStyle,
    listEffects,
    getAllEffects,
} from "../helpers/common.mjs";

export class KnightRollDialog extends Dialog {
    static dialogRoll = 'systems/knight/templates/dialog/roll-sheet.html';

    constructor(actor, data={}) {
        const dialogData = {
            whoActivate:data?.whoActivate ?? 'none',
            roll:{
                html:undefined,
                id:actor,
                label:data?.label ?? '',
                base:data?.base ?? '',
                whatRoll:data?.whatRoll ?? [],
                difficulte:data?.difficulte ?? 0,
                succesBonus:data?.succesbonus ?? 0,
                modificateur:data?.modificateur ?? 0,
                wpnSelected:data?.wpn ?? '',
                wpnSecond:'',
                typeWpn:{
                    contact:[],
                    distance:[],
                    complexe:[],
                    grenade:[],
                    tourelle:[],
                    aicontact:[],
                    aidistance:[],
                },
                allWpn:[],
                allVariableWpn:[],
                btn:data?.btn ?? {},
                scoredice:data?.scoredice ?? {},
                style:{
                    pilonnage:{
                        type:'degats',
                        value:0,
                    },
                    precis:{
                        type:'',
                    },
                    puissant:{
                        type:'degats',
                        value:0,
                    },
                    suppression:{
                        type:'degats',
                        value:0,
                    }
                },
            },
            buttons:{},
        }

        const options = {
            baseApplication:'KnightRollDialog',
            id:actor,
            classes: ["dialog", "knight", "rollDialog"],
            width: 900,
            height:data?.height ?? 800,
            resizable: true
        };

        super(dialogData, options);
    }

    get rollData() {
        return this.data.roll;
    }

    get actor() {
        return canvas.tokens.get(this.rollData.id) ? canvas.tokens.get(this.rollData.id).actor : game.actors.get(this.rollData.id);
    }

    get who() {
        const actor = this.actor;

        return this.data.whoActivate !== 'none' ? game.actors.get(this.data.whoActivate) : actor;
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
        let style = this.rollData.html.find('label.style select').val();

        return style
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


    actualise() {
        this.#renderInitialization(this.data.roll.html);

        const wpns = this.#prepareWpn();

        const allWpns = this.rollData.typeWpn.contact.concat(this.rollData.typeWpn.distance, this.rollData.typeWpn.tourelle, this.rollData.typeWpn.aicontact, this.rollData.typeWpn.aidistance, this.rollData.typeWpn.grenade, this.rollData.typeWpn.complexe);
        const difference = foundry.utils.diffObject(allWpns, this.data.roll.allWpn);
        const difference2 = foundry.utils.diffObject(this.data.roll.allWpn, allWpns);
        if(!allWpns.find(itm => itm.id === this.rollData.wpnSelected)) this.data.roll.wpnSelected = '';

        if(!foundry.utils.isEmpty(difference) || !foundry.utils.isEmpty(difference2)) {
            this.data.roll.allWpn = allWpns;
            this.#cleanHtml();
            this.#updateWpnContact(this.rollData.typeWpn.contact);
            this.#updateWpnDistance(this.rollData.typeWpn.distance);
            this.#updateWpnTourelle(this.rollData.typeWpn.tourelle);
            this.#updateWpnAIContact(wpns.listaicontact);
            this.#updateWpnAIDistance(wpns.listaidistance);
            this.#updateWpnGrenade(this.rollData.typeWpn.grenade);
            this.#updateWpnComplexe(this.rollData.typeWpn.complexe);
            this.#renderWpn(this.data.roll.html);
            this.#updateBtnShow();
        }

        this.#updateBonusInterdits(undefined, this.data.roll.html);
    }

    async open() {
        this.#prepareTitle();
        this.#prepareButtons();
        this.#prepareMods();

        this.data.content = await renderTemplate(KnightRollDialog.dialogRoll, this.#prepareOptions());

        this.render(true);
    }

    /* -------------------------------------------- */

    /** @inheritdoc */
    activateListeners(html) {
        super.activateListeners(html);
        this.#renderHTML(html);
    }

    #renderHTML(html) {
        this.data.roll.html = html;
        toggler.init(this.id, html);
        this.#renderSTD(html);
        this.#renderWpn(html);

        html.find('.aspect button.btnCaracteristique.selected i').addClass('fa-solid fa-check');
        html.find('.aspect button.btnCaracteristique.base i').removeClass('fa-solid fa-check fa-check-double');
        html.find('.aspect button.btnCaracteristique.base i').addClass('fa-solid fa-check-double');

        html.find('.aspect button.btnCaracteristique').click(ev => {
            const tgt = $(ev.currentTarget);
            const isPJ = this.isPJ;
            const carac = tgt.data("value");
            const isSelected = tgt.hasClass('selected');
            const parents = tgt.parents('div.aspects');
            const hasAlreadyBase = $(parents.find('button.btnCaracteristique.base')).length > 0;

            if(!tgt.hasClass('wHover')) return;


            if(isPJ) {
                const isBase = tgt.hasClass('base');

                if(isSelected) {
                    tgt.removeClass('selected');
                    tgt.find('i').removeClass('fa-solid fa-check')

                    this.data.roll.whatRoll = this.rollData.whatRoll.filter(roll => roll !== carac);
                } else {
                    tgt.addClass(`selected`);

                    if(hasAlreadyBase) {
                        this.data.roll.whatRoll.push(carac);
                        tgt.find('i').removeClass('fa-solid fa-check fa-check-double')
                        tgt.find('i').addClass('fa-solid fa-check')
                    }
                    else {
                        this.data.roll.base = carac;
                        tgt.addClass('base');
                        tgt.find('i').addClass('fa-solid fa-check-double')
                    }
                }

                if(isBase) {
                    let whatRoll = this.rollData?.whatRoll ?? [];
                    tgt.removeClass('base');

                    if(whatRoll.length === 0) this.data.roll.base = "";
                    else if(whatRoll) {
                        for(let w of whatRoll) {
                            if($(parents.find(`button.btnCaracteristique.${w}`)).hasClass('wHover')) {
                                $(parents.find(`button.btnCaracteristique.${w}`)).addClass('base');
                                $(parents.find(`button.btnCaracteristique.${w} i`)).removeClass('fa-solid fa-check fa-check-double');
                                $(parents.find(`button.btnCaracteristique.${w} i`)).addClass('fa-solid fa-check-double');

                                this.data.roll.base = w;
                                this.data.roll.whatRoll = this.rollData.whatRoll.filter(roll => roll !== w);
                                break;
                            }
                        }
                    }
                }
            } else {
                if(isSelected) {
                    tgt.removeClass('selected base');
                    tgt.find('i').removeClass('fa-solid fa-check-double');
                    this.data.roll.base = '';
                } else {
                    if(hasAlreadyBase) {
                        $(parents.find('button.btnCaracteristique.base')).find('i').removeClass('fa-solid fa-check-double');
                        $(parents.find('button.btnCaracteristique.base')).removeClass('selected base');
                    }

                    tgt.addClass('selected base');
                    tgt.find('i').addClass('fa-solid fa-check-double');

                    this.data.roll.base = carac;
                }
            }
        });

        this.#updateBonusInterdits(undefined, html);
    }

    #renderSTD(html) {
        this.#renderInitialization(html);
        const allBtn = html.find('label.btn');
        const allScoredice = html.find('div.scoredice');

        html.find('label.selectWithInfo span.info').mouseenter(ev => {
            html.find('label.selectWithInfo span.hideInfo').css("display", "block");
        });

        html.find('label.selectWithInfo span.info').mouseleave(ev => {
            html.find('label.selectWithInfo span.hideInfo').css("display", "none");
        });

        for(let b of allBtn) {
            const name = $(b).data('name');
            const btn = this.rollData?.btn?.[name] ?? false;

            if(btn) {
                $(b).find('button').addClass('selected');
                $(b).find('button i').addClass('fa-solid fa-check');
            }
            else {
                $(b).find('button').removeClass('selected');
                $(b).find('button i').removeClass('fa-solid fa-check');
            }

            $(b).find('button').click(ev => {
                const tgt = $(ev.currentTarget);
                const name = $(tgt).parents('label.btn').data('name');
                const btn = this.rollData?.btn?.[name] ?? false;

                if(btn) {
                    this.data.roll.btn[name] = false;
                    tgt.removeClass('selected');
                    tgt.find('i').removeClass('fa-solid fa-check');
                }
                else {
                    this.data.roll.btn[name] = true;
                    tgt.addClass('selected');
                    tgt.find('i').addClass('fa-solid fa-check');
                }
            })
        }

        for(let b of allScoredice) {
            const key = $(b).data('key');
            const dice = this.rollData?.scoredice?.[key]?.dice ?? 0;
            const value = this.rollData?.scoredice?.[key]?.value ?? 0;

            $(b).find('input.dice').val(dice);
            $(b).find('input.value').val(value);

            $(b).find('input').change(ev => {
                const tgt = $(ev.currentTarget);
                const key = $(tgt).parents('div.scoredice').data('key');
                const subkey = $(tgt).data('key');
                const value = tgt.val();
                const exist = this.rollData?.scoredice?.[key] ?? undefined;

                if(!exist) this.data.roll.scoredice[key] = {dice:0, value:0};

                this.data.roll.scoredice[key][subkey] = value;
            })
        }
    }

    #renderWpn(html) {
        const parent = html.find('div.wpn');
        const allWpn = parent.find('div.button');

        html.find('div.wpn i.fa-minus-square').click(ev => {
            const tgt = $(ev.currentTarget);

            if(!tgt.hasClass('fa-plus-square')) {
                const child = tgt.parents('.summary').siblings('.cat').find('div.button').not('.selected');

                tgt.parents('.summary').siblings('.cat').find('h3.summary i').removeClass('fa-minus-square');
                tgt.parents('.summary').siblings('.cat').find('h3.summary i').addClass('fa-plus-square');

                child.hide({
                    complete: () => {},
                });

            }
        });

        for(let w of allWpn) {
            const id = $(w).data('id');

            if(id == this.rollData.wpnSelected) this.#selectWpn($(w).find('button.btnWpn'), true);

            if(id === this.rollData.wpnSecond) this.#selectWpn($(w).find('button.btnWpn'), true, true);
        }

        parent.find('button.btnWpn').click(ev => {
            const tgt = $(ev.currentTarget);
            const isSelected = tgt.hasClass('selected');
            const id = tgt.parents('div.button').data('id');
            if(this.rollData.wpnSecond === id) return;

            if(isSelected) this.#unselectWpn(tgt);
            else this.#selectWpn(tgt);

            if(isSelected) this.#updateBtnShow(true);
            else this.#updateBtnShow();
        });

        parent.find('button.btnWpn').on('contextmenu', ev => {
            ev.preventDefault();

            if(this.style !== 'akimbo') return;

            const tgt = $(ev.currentTarget);
            const isSelected = tgt.hasClass('doubleSelected');
            const id = tgt.parents('div.button').data('id');

            if(this.rollData.wpnSelected === id) return;

            if(isSelected) this.#unselectWpn(tgt, true);
            else this.#selectWpn(tgt, false, true);
        });

        const mainsWpn = parent.find('div.data .selectSimple.mains');
        const munitionsWpn = parent.find('div.data .selectSimple.munitions');
        const initWpn = parent.find('div.data button.active');
        const dgtsWpn = parent.find('div.data label.dgtsvariable');
        const violenceWpn = parent.find('div.data label.violencevariable');
        const dgtsBonusWpn = parent.find('div.data label.dgtsbonusvariable');
        const violenceBonusWpn = parent.find('div.data label.violencebonusvariable');
        const boost = parent.find('div.data div.boostsimple');
        const boostdegats = parent.find('div.data label.boostdegats');
        const boostviolence = parent.find('div.data label.boostviolence');

        for(let w of mainsWpn) {
            const parent = $(w).parents('div.button');
            const id = $(parent).data('id');
            const select = $(w).find('select');
            const wpn = this.rollData.allWpn.find(itm => itm.id === id);

            select.val(wpn.actuel);

            $(select).change(ev => {
                const tgt = $(ev.currentTarget);
                const value = tgt.val();

                this.#updateWpn(id, {['options2mains.actuel']:value});
            });
        }

        for(let w of munitionsWpn) {
            const parent = $(w).parents('div.button');
            const id = $(parent).data('id');
            const select = $(w).find('select');
            const wpn = this.rollData.allWpn.find(itm => itm.id === id);

            select.val(wpn.actuel);

            $(select).change(ev => {
                const tgt = $(ev.currentTarget);
                const value = tgt.val();

                this.#updateWpn(id, {['optionsmunitions.actuel']:value});
            });
        }

        for(let w of initWpn) {
            const parent = $(w).parents('div.button');
            const isSelected = $(w).hasClass('selected');
            const id = $(parent).data('id');
            const value = $(w).data('value');
            const wpn = this.rollData.allWpn.find(itm => itm.id === id);

            let options = wpn.options.find(itm => itm.value === value);

            if(isSelected || options.active) {
                $(w).find('i').removeClass('fa-solid fa-xmark red');
                $(w).find('i').addClass('fa-solid fa-check green');

                if(!isSelected) $(w).addClass('selected');
            } else {
                $(w).find('i').removeClass('fa-solid fa-check green');
                $(w).find('i').addClass('fa-solid fa-xmark red');
            }

            $(w).click(ev => {
                const tgt = $(ev.currentTarget);
                const isSelected = $(tgt).hasClass('selected');

                if(isSelected) {
                    $(tgt).removeClass('selected')
                    $(tgt).find('i').removeClass('fa-solid fa-check green');
                    $(tgt).find('i').addClass('fa-solid fa-xmark red');

                    options.active = false;
                } else {
                    $(tgt).addClass('selected')
                    $(w).find('i').removeClass('fa-solid fa-xmark red');
                    $(w).find('i').addClass('fa-solid fa-check green');

                    options.active = true;
                }
            });
        }

        for(let w of dgtsWpn) {
            const parent = $(w).parents('div.button');
            const select = $(w).find('select');
            const id = $(parent).data('id');
            const wpn = this.data.roll.allWpn.find(itm => itm.id === id);
            const allVariable = this.rollData.allVariableWpn.find(itm => itm.id === id);
            let options = wpn.options.find(itm => itm.classes.includes('dgtsvariable'));

            if(allVariable && options.list.hasOwnProperty(allVariable?.degats ?? options.selected)) $(select).val(allVariable?.degats ?? options.selected);
            else if(options.list.hasOwnProperty(wpn.degats.dice)) $(select).val(wpn.degats.dice);
            else wpn.degats = {dice:options.selected, fixe:options.selectvalue};

            $(select).change(ev => {
                const tgt = $(ev.currentTarget);
                const val = tgt.val();

                wpn.degats.dice = parseInt(val);

                if(!allVariable) {
                    this.data.roll.allVariableWpn.push({
                        id:id,
                        degats:val,
                    })
                } else allVariable.degats = val;
            });
        }

        for(let w of violenceWpn) {
            const parent = $(w).parents('div.button');
            const select = $(w).find('select');
            const id = $(parent).data('id');
            const wpn = this.data.roll.allWpn.find(itm => itm.id === id);
            const allVariable = this.rollData.allVariableWpn.find(itm => itm.id === id);
            let options = wpn.options.find(itm => itm.classes.includes('violencevariable'));

            if(allVariable && options.list.hasOwnProperty(allVariable?.violence ?? options.selected)) $(select).val(allVariable?.violence ?? options.selected);
            else if(options.list.hasOwnProperty(wpn.violence.dice)) $(select).val(wpn.violence.dice);
            else wpn.violence = {dice:options.selected, fixe:options.selectvalue};

            $(select).change(ev => {
                const tgt = $(ev.currentTarget);
                const val = tgt.val();

                wpn.violence.dice = parseInt(val);

                if(!allVariable) {
                    this.data.roll.allVariableWpn.push({
                        id:id,
                        violence:val,
                    })
                } else allVariable.violence = val;
            });
        }

        for(let w of dgtsBonusWpn) {
            const parent = $(w).parents('div.button');
            const select = $(w).find('select');
            const idBonus = $(w).data('id');
            const id = $(parent).data('id');
            const wpn = this.data.roll.allWpn.find(itm => itm.id === id);
            const allVariable = this.rollData.allVariableWpn.find(itm => itm.id === id);
            const moduleVariable = allVariable?.modules?.find(itm => itm.id === idBonus) ?? undefined;
            let options = wpn.options.find(itm => itm.classes.includes('dgtsbonusvariable') && itm.id === idBonus);

            if(moduleVariable && options.list.hasOwnProperty(moduleVariable?.degats ?? options.selected)) $(select).val(moduleVariable?.degats ?? options.selected);
            else if(options.list.hasOwnProperty(options.selected)) $(select).val(options.selected);
            else options.selected = options.selected;

            $(select).change(ev => {
                const tgt = $(ev.currentTarget);
                const val = tgt.val();

                options.selected = parseInt(val);

                if(!allVariable) {
                    this.data.roll.allVariableWpn.push({
                        id:id,
                        modules:[{
                            id:idBonus,
                            degats:val,
                        }]
                    })
                } else {
                    if(!moduleVariable) {
                        if(!allVariable.modules) {
                            allVariable.modules = [{
                                id:idBonus,
                                degats:val,
                            }]
                        } else {
                            allVariable.modules.push({
                                id:idBonus,
                                degats:val,
                            });
                        }
                    } else {
                        moduleVariable.degats = val;
                    }
                }
            });
        }

        for(let w of violenceBonusWpn) {
            const parent = $(w).parents('div.button');
            const select = $(w).find('select');
            const idBonus = $(w).data('id');
            const id = $(parent).data('id');
            const wpn = this.data.roll.allWpn.find(itm => itm.id === id);
            const allVariable = this.rollData.allVariableWpn.find(itm => itm.id === id);
            const moduleVariable = allVariable?.modules?.find(itm => itm.id === idBonus) ?? undefined;
            let options = wpn.options.find(itm => itm.classes.includes('violencebonusvariable') && itm.id === idBonus);

            if(moduleVariable && options.list.hasOwnProperty(moduleVariable?.violence ?? options.selected)) $(select).val(moduleVariable?.violence ?? options.selected);
            else if(options.list.hasOwnProperty(options.selected)) $(select).val(options.selected);
            else options.selected = options.selected;

            $(select).change(ev => {
                const tgt = $(ev.currentTarget);
                const val = tgt.val();

                options.selected = parseInt(val);

                if(!allVariable) {
                    this.data.roll.allVariableWpn.push({
                        id:id,
                        modules:[{
                            id:idBonus,
                            violence:val,
                        }]
                    })
                } else {
                    if(!moduleVariable) {
                        if(!allVariable.modules) {
                            allVariable.modules = [{
                                id:idBonus,
                                violence:val,
                            }]
                        } else {
                            allVariable.modules.push({
                                id:idBonus,
                                violence:val,
                            });
                        }
                    } else {
                        moduleVariable.violence = val;
                    }
                }
            });
        }

        for(let w of boost) {
            const parent = $(w).parents('div.button');
            const select1 = $(w).find('select.select1');
            const select2 = $(w).find('select.select2');
            const id = $(parent).data('id');
            const wpn = this.data.roll.allWpn.find(itm => itm.id === id);
            let options = wpn.options.find(itm => itm.classes.includes('boostsimple'));

            $(select1).val(options.selected1);
            $(select2).val(options.selected2);
            $(select1).change(ev => {
                const tgt = $(ev.currentTarget);
                const val = tgt.val();

                options.selected1 = val;
            });

            $(select2).change(ev => {
                const tgt = $(ev.currentTarget);
                const val = parseInt(tgt.val());

                options.selected2 = val;

                if(wpn.id.includes('longbow')) this.#calculateLongbow(id, parent);
            });
        }

        for(let w of boostdegats) {
            const parent = $(w).parents('div.button');
            const select = $(w).find('select');
            const id = $(parent).data('id');
            const wpn = this.data.roll.allWpn.find(itm => itm.id === id);
            let options = wpn.options.find(itm => itm.classes.includes('boostdegats'));

            $(select).val(options.selected);

            $(select).change(ev => {
                const tgt = $(ev.currentTarget);
                const val = parseInt(tgt.val());

                options.selected = val;

                if(wpn.id.includes('longbow')) this.#calculateLongbow(id, parent);
            });
        }

        for(let w of boostviolence) {
            const parent = $(w).parents('div.button');
            const select = $(w).find('select');
            const id = $(parent).data('id');
            const wpn = this.data.roll.allWpn.find(itm => itm.id === id);
            let options = wpn.options.find(itm => itm.classes.includes('boostviolence'));

            $(select).val(options.selected);

            $(select).change(ev => {
                const tgt = $(ev.currentTarget);
                const val = parseInt(tgt.val());

                options.selected = val;

                if(wpn.id.includes('longbow')) this.#calculateLongbow(id, parent);
            });
        }

        this.#renderLongbow(html);

        this.#sanitizeWpn(html.find('button.btnWpn'), html);
    }

    #renderLongbow(html) {
        const parent = html.find('div.wpnComplexe.longbow');
        const effets = parent.find('.liste a');
        const id = parent.data('id');
        const complexe = this.rollData.allWpn.find(itm => itm.id === id);

        const updateSelect = (selector, property) => {
            const select = parent.find(selector);
            if(complexe && complexe[property]) {
                if(property === 'portee') select.val(complexe[property]);
                else select.val(complexe[property].dice);
            }

            select.change(ev => {
                let value;
                if(property === 'portee') value = $(ev.currentTarget).val();
                else value = parseInt($(ev.currentTarget).val());

                this.#updateComplexeWpn(id, property, value);
                this.#calculateLongbow(id, parent);
            });
        };

        updateSelect('.longbow_dgts select', 'degats');
        updateSelect('.longbow_violence select', 'violence');
        updateSelect('.longbow_portee select', 'portee');

        if(complexe) {
            if(complexe.effets) {
                effets.each(function() {
                    const t = $(this);
                    const { raw, custom, liste, id } = t.data();

                    const isChecked = custom
                        ? complexe.effets.custom.some(itm => itm.id === id && itm.liste === liste)
                        : complexe.effets.raw.includes(raw);

                    if (isChecked) {
                        t.addClass('checked')
                            .find('i')
                            .addClass('fa-solid fa-check-double');
                    }
                });
            }
        }

        effets.click(ev => {
            const tgt = $(ev.currentTarget);
            const { raw, custom, liste, id: customID } = tgt.data();
            const isChecked = tgt.hasClass('checked');

            this.#toggleEffect(id, { raw, custom, liste, customID }, isChecked);

            tgt.toggleClass('checked');
            tgt.find('i').toggleClass('fa-solid fa-check-double');

            this.#calculateLongbow(id, parent);
        });

        if(complexe) this.#calculateLongbow(id, parent);
    }

    async #roll(data) {
        const actor = this.who;
        const armor = actor.items.find(itm => itm.type === 'armure');
        const armorIsWear = this.armorIsWear;
        const label = data.find('input.label').val();
        const base = this.rollData.base;
        const selected = [...new Set(this.rollData.whatRoll)].filter(v => v !== base);
        const weaponID = data.find('div.wpn .button .btnWpn.selected').parents('div.button').data('id');
        const weaponData = data.find('div.wpn .button .data');
        const weapon = this.wpnSelected;
        const difficulte = Number(data.find('label.score.difficulte input').val());
        const succesBonus = Number(data.find('label.score.succesBonus input').val());
        const modificateur = Number(data.find('label.score.modificateur input').val());
        const isModeHeroique = data.find('button.btn.modeheroique').hasClass('selected');
        const isEquilibrerBalance = data.find('button.btn.equilibrerbalance').hasClass('selected');
        const isNoOd = this.rollData.btn?.nood ?? false;

        console.error(succesBonus);
        let isAttaqueSurprise = this.rollData.btn?.attaquesurprise ?? false;
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
                dice:parseInt(data.find('div.scoredice.modificateurdegats input.dice').val()),
                fixe:parseInt(data.find('div.scoredice.modificateurdegats input.value').val()),
            },
            violence:{
                dice:parseInt(data.find('div.scoredice.modificateurviolence input.dice').val()),
                fixe:parseInt(data.find('div.scoredice.modificateurviolence input.fixe').val()),
            }
        };
        let maximize = {
            degats:data.find('button.btn.maximizedegats').hasClass('selected'),
            violence:data.find('button.btn.maximizeviolence').hasClass('selected'),
        }
        let goliath = 0;
        let ghost = 0;
        let odGhost = 0;
        let ersatzghost = 0;
        let odErsatzghost = 0;
        let flags = {};

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

        if(weapon) {
            const rollAllInOne = game.settings.get("knight", "oldRoll");
            const isGrenade = weapon.id.includes('grenade') ? true : false;
            const style = actor.system.combat.style;
            const modStyle = getModStyle(style);
            const capacitiesSelected = armor?.system?.capacites?.selected;
            let effets = weapon.effets.raw.concat(weapon?.structurelles?.raw ?? [], weapon?.ornementales?.raw ?? []);
            let custom = weapon.effets.custom.concat(weapon?.ornementales?.custom ?? [], weapon?.structurelles?.custom ?? []);
            const isTourelle = weapon?.tourelle ?? false;
            dices += modStyle.bonus.attaque;
            dices -= modStyle.malus.attaque;
            cout += weapon?.cout ?? 0;
            espoir += weapon?.espoir ?? 0;
            const isErsatzRogueActive = actor?.moduleErsatz?.rogue?.has ?? false;
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
                    if(this.#isEffetActive(effets, weapon.options, ['protectrice'])) {
                        dices += 2;
                    }
                    break;

                case 'acouvert':
                    if(this.#isEffetActive(effets, weapon.options, ['tirensecurite', 'interfaceguidage'])) {
                        dices += 3;
                    }
                    break;

                case 'pilonnage':
                    if(this.#isEffetActive(effets, weapon.options, ['deuxmains', 'munitionshypervelocite', 'systemerefroidissement']) && weapon.type === 'distance') {
                        dataStyle = {
                            type:data.find('.pilonnage select').val(),
                            value:parseInt(data.find('.pilonnage input').val()),
                        }
                    }
                    break;

                case 'precis':
                    if(this.#isEffetActive(effets, weapon.options, ['deuxmains', 'munitionshypervelocite', 'systemerefroidissement']) && weapon.type === 'contact') {
                        if(data.find('.precis select').val()){
                            dices += this.#getValueAspect(actor, data.find('.precis select').val());
                            carac.push(this.#getLabelRoll(data.find('.precis select').val()));
                        }
                    }
                    break;

                case 'puissant':
                    if((this.#isEffetActive(effets, weapon.options, ['lourd']) || (this.#isEffetActive(effets, weapon.options, ['deuxmains']) && this.#isEffetActive(effets, weapon.options, ['munitionshypervelocite', 'systemerefroidissement']))) && weapon.type === 'contact') {
                        if(data.find('.puissant select').val()){
                            dices -= Math.min(parseInt(data.find('.puissant input').val()), 6);

                            dataStyle = {
                                type:data.find('.puissant select').val(),
                                value:Math.min(parseInt(data.find('.puissant input').val()), 6),
                            }
                        }
                    }
                    break;

                case 'suppression':
                    if((this.#isEffetActive(effets, weapon.options, ['lourd']) || (this.#isEffetActive(effets, weapon.options, ['deuxmains']) && this.#isEffetActive(effets, weapon.options, ['munitionshypervelocite', 'systemerefroidissement']))) && weapon.type === 'distance') {
                        if(data.find('.suppression select').val()){
                            dataStyle = {
                                type:data.find('.suppression select').val(),
                                value:parseInt(data.find('.suppression input').val()),
                            }
                        }
                    }
                    break;
            }

            for(let w of weapon.options) {
                if((w.key !== 'btn' && w.special)) continue;

                w.active = weaponData.find(`button.${w.classes.split(' ')[0]}`).hasClass('selected');
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
                    ersatzghost += this.#getValueAspect(actor, actor.moduleErsatz.rogue.attaque);

                    if(!this.isPJ) ersatzghost = Math.ceil(ersatzghost/2);

                    odErsatzghost += this.#getODAspect(actor, actor.moduleErsatz.rogue.attaque);


                    flags['ersatzghost'] = {
                        id:actor.moduleErsatz.rogue._id,
                        value:true,
                    };
                }

                if(actor.moduleErsatz.rogue.interruption.actif) {
                    updates[`item.${actor.moduleErsatz.rogue._id}.system.active.base`] = false;
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

            if(dgtsVariable) {
                const dgtsVariableSelected = parseInt($(weaponData.find(`label.dgtsvariable select`)).val());
                let coutDgts = 0;

                weapon.degats = {
                    dice:dgtsVariableSelected,
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
                const violenceVariableSelected = parseInt($(weaponData.find(`label.violencevariable select`)).val());
                let coutViolence = 0;

                weapon.violence = {
                    dice:parseInt(violenceVariableSelected),
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
                const dgtsVariableSelected = parseInt($(weaponData.find(`label.dgtsbonusvariable select`)).val());
                const dgtsList = dgtsBonusVariable?.list ?? {};
                let coutDgts = 0;

                let v = 1;
                for(let l in dgtsList) {
                    coutDgts = v*dgtsBonusVariable.value;
                    v++;
                    if(l == dgtsVariableSelected) break;
                }

                cout += coutDgts;
            }

            if(violenceBonusVariable) {
                const violenceVariableSelected = parseInt($(weaponData.find(`label.violencebonusvariable select`)).val());
                let coutViolence = 0;

                let v = 1;

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

        this.data.roll.label = label;
        this.data.roll.difficulte = difficulte;
        this.data.roll.succesBonus = succesBonus;
        this.data.roll.modificateur = modificateur;

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
                label:`${game.i18n.localize('KNIGHT.ITEMS.MODULE.ERSATZ.ROGUE.Label')} : +${ersatzghost}D6+${odErsatzghost}`,
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
            }).doRoll(updates);
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
        const label = data.find('input.label').val();
        const base = this.rollData.base;
        const succesBonus = parseInt(data.find('label.score.succesBonus input').val());
        const modificateur = parseInt(data.find('label.score.modificateur input').val());
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

        this.data.roll.label = label;
        this.data.roll.succesBonus = succesBonus;
        this.data.roll.modificateur = modificateur;

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
                    button1: {
                      label: game.i18n.localize("KNIGHT.JETS.JetNormal"),
                      callback: async (data) => this.#roll(data),
                      icon: `<i class="fas fa-dice"></i>`
                    },
                    button2: {
                      label: game.i18n.localize("KNIGHT.JETS.JetEntraide"),
                      callback: async (data) => this.#entraide(data),
                      icon: `<i class="fas fa-dice-d6"></i>`
                    },
                    button3: {
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
                    button1: {
                      label: game.i18n.localize("KNIGHT.JETS.JetNormal"),
                      callback: async (data) => this.#roll(data),
                      icon: `<i class="fas fa-dice"></i>`
                    },
                    button3: {
                      label: game.i18n.localize("KNIGHT.AUTRE.Annuler"),
                      icon: `<i class="fas fa-times"></i>`
                    }
                }
                break;
        }

        this.data.buttons = results;
    }

    #prepareTitle() {
        this.data.title = `${this.actor.name} : ${game.i18n.localize("KNIGHT.JETS.Label")}`;
    }

    #prepareMods() {
        const actor = this.who;
        const system = actor.system;
        const otherMods = system.otherMods;
        const otherModsDice = Object.values(otherMods).find(itm => itm?.type === 'rollDice');

        if(otherModsDice) this.data.roll.modificateur += otherModsDice.value;
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
            classes:'grpBtn rowFour colFiveSeven',
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
            label:game.i18n.localize('KNIGHT.AUTRE.Difficulte'),
            value:this.rollData.difficulte,
            min:0
        });

        //SUCCES BONUS
        data.mods.push({
            key:'score',
            classes:'score succesBonus colTwo',
            label:`${game.i18n.localize('KNIGHT.JETS.Modificateur')} (${game.i18n.localize('KNIGHT.JETS.Succes')})`,
            value:this.rollData.succesBonus
        });

        //MODIFICATEUR
        data.mods.push({
            key:'score',
            classes:'score modificateur colThree',
            label:`${game.i18n.localize('KNIGHT.JETS.Modificateur')} (${game.i18n.localize('KNIGHT.JETS.Des')})`,
            value:this.rollData?.modificateur ?? 0,
        });

        if(isPJ) {
            //STYLES
            data.mods.push({
                key:'select',
                classes:'style selectWithInfo rowFourTwo',
                label:game.i18n.localize('KNIGHT.COMBAT.STYLES.Label'),
                selected:system.combat.style,
                info:game.i18n.localize(CONFIG.KNIGHT.styles[system.combat.style]),
                list:CONFIG.KNIGHT.LIST.style,
            });

            data.mods.push({
                key:'selectWithScore',
                classes:'pilonnage rowFourTwo colTwoFive',
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
                classes:'precis rowFourTwo',
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
                classes:'puissant rowFourTwo colTwoFive',
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
                classes:'suppression rowFourTwo colTwoFive',
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
        }

        //MODIFICATEUR AUX DEGATS
        data.mods.push({
            key:'scoredice',
            name:'moddegats',
            classes:'scoredice modificateurdegats colOne',
            label:game.i18n.localize('KNIGHT.JETS.ModificateurDegats'),
            dice:0,
            value:0,
        });

        //MODIFICATEUR A LA VIOLENCE
        data.mods.push({
            key:'scoredice',
            name:'modviolence',
            classes:'scoredice modificateurviolence colTwo',
            label:game.i18n.localize('KNIGHT.JETS.ModificateurViolence'),
            dice:0,
            value:0,
        });

        if(isPJ) {
            //BOUTON SANS OD
            buttons.grp.push({
                key:'btn',
                name:'nood',
                classes:'btn withoutod',
                btnclasses:'btn withoutod',
                label:game.i18n.localize('KNIGHT.JETS.NoOd'),
            });
        }

        //BOUTON ATTAQUE SURPRISE
        buttons.grp.push({
            key:'btn',
            name:'attaquesurprise',
            classes:'btn attaquesurprise',
            btnclasses:'btn attaquesurprise',
            label:game.i18n.localize('KNIGHT.JETS.AttackSurprise'),
        });

        //BOUTON MAXIMISER LES DEGATS
        buttons.grp.push({
            key:'btn',
            name:'maximizedegats',
            classes:'btn maximizedegats',
            btnclasses:'btn maximizedegats',
            label:game.i18n.localize('KNIGHT.JETS.MaximizeDegats'),
        })

        //BOUTON MAXIMISER LA VIOLENCE
        buttons.grp.push({
            key:'btn',
            name:'maximizeviolence',
            classes:'btn maximizeviolence',
            btnclasses:'btn maximizeviolence',
            label:game.i18n.localize('KNIGHT.JETS.MaximizeViolence'),
        });

        //BOUTON MODE HEROIQUE
        buttons.grp.push({
            key:'btn',
            name:'modeheroique',
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
        this.data.roll.allWpn = this.rollData.typeWpn.contact.concat(this.rollData.typeWpn.distance, this.rollData.typeWpn.tourelle, this.rollData.typeWpn.aicontact, this.rollData.typeWpn.aidistance, this.rollData.typeWpn.grenade, this.rollData.typeWpn.complexe);

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
            classes:'specialInfo rowFour colTwoFive',
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
        const weapons = items.filter(itm => itm.type == 'arme' && (itm.system.equipped || itm.system.tourelle.has || !isPJ || itm.system.whoActivate === this.data.whoActivate));
        const modules = this.#getWpnModules(items, type, this.data.whoActivate);
        const modulesContact = this.#getBonusModulesByType(actor, type, 'contact', this.data.whoActivate);
        const modulesDistance = this.#getBonusModulesByType(actor, type, 'distance', this.data.whoActivate);
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
                        const list = {};
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
                        const list = {};
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
                            selected:dataMVV.min.dice,
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
                            selected:dataMDV.min.dice,
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
                        classes:'btnWpn',
                        type:'contact',
                        id:`${ai}${list}c`,
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
                    };

                    let dataD = {
                        label:game.i18n.localize(CONFIG.KNIGHT.armesimprovisees[ai][list]),
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

        if(armure && addSpecial) {
            if(armure.system.special.selected?.porteurlumiere ?? undefined) {
                specialRaw = specialRaw.concat(armure.system.special.selected.porteurlumiere.bonus.effets.raw)
                specialCustom = specialCustom.concat(armure.system.special.selected.porteurlumiere.bonus.effets.custom)
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

        if(armure && addSpecial) {
            if(armure.system.special.selected?.porteurlumiere ?? undefined) {
                specialRaw = specialRaw.concat(armure.system.special.selected.porteurlumiere.bonus.effets.raw)
                specialCustom = specialCustom.concat(armure.system.special.selected.porteurlumiere.bonus.effets.custom)
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

    #renderInitialization(html) {
        const scores = ['difficulte', 'succesBonus', 'modificateur'];
        const actor = this.who;
        const style = actor.system.combat.style;
        const isPJ = this.isPJ;

        html.find('input.label').val(this.rollData.label);
        html.find('label.style select').val(style);
        html.find('label.style span.hideInfo').remove();
        html.find('label.style').append(`<span class="hideInfo" style="display:none;">${game.i18n.localize(CONFIG.KNIGHT.styles[style])}</span>`);

        const aspects = html.find('.aspect button.btnCaracteristique');

        for(let a of aspects) {
            const value = $(a).data('value');
            let setValue = `${this.#getValueAspect(actor, value)}`;

            if(value === this.rollData.base) $(a).addClass('selected base');
            else if(this.rollData.whatRoll.includes(value)) $(a).addClass('selected');

            if((actor.system.wear === 'armure' || actor.system.wear === 'ascension') && isPJ) setValue += ` + ${this.#getODAspect(actor, value)} ${game.i18n.localize('KNIGHT.ASPECTS.OD')}`
            else if(!isPJ) setValue += ` + ${this.#getODAspect(actor, value)} ${game.i18n.localize('KNIGHT.ASPECTS.Exceptionnel-short')}`

            $(a).find('span.value').text(setValue)

            this.#updateBonusInterdits(a, html);
        }

        for(let s of scores) {
            html.find(`label.score.${s} input`).val(this.rollData[s]);
        }

        html.find('.pilonnage select').val(this.rollData.style.pilonnage.type);
        html.find('.precis select').val(this.rollData.style.precis.type);
        html.find('.puissant select').val(this.rollData.style.puissant.type);
        html.find('.suppression select').val(this.rollData.style.suppression.type);

        html.find('.pilonnage input').val(this.rollData.style.pilonnage.value);
        html.find('.puissant input').val(this.rollData.style.puissant.value);
        html.find('.suppression input').val(this.rollData.style.suppression.value);

        if(style === 'akimbo') {
            this.rollData.html.find('span.specialInfo').text(game.i18n.localize("KNIGHT.COMBAT.STYLES.AKIMBO.SecondWpn"));
            this.rollData.html.find('span.specialInfo').show();
        }

        this.#updateStyleShow(style, undefined);
        this.#updateBtnShow(false, true);
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

        longbow.cout = cout;
        $(parent.find('button.btnWpn span p')).text(cout);

        if (longbow) {
            longbow.cout = cout;
        }
    }

    #selectWpn(tgt, init=false, double=false) {
        const id = tgt.parents('div.button').data('id');
        const parents = !double ?
            tgt.parents('div.dialog-content').find('div.wpn button.btnWpn.selected') :
            tgt.parents('div.dialog-content').find('div.wpn button.btnWpn.doubleSelected');
        const wpn = this.rollData.allWpn.find(itm => itm.id === id);
        if(!double) {
            this.data.roll.wpnSelected = id;
            tgt.addClass('selected');
            $(tgt.find('i')).addClass('fa-solid fa-check');
        }
        else {
            this.data.roll.wpnSecond = id;
            tgt.addClass('doubleSelected');
            $(tgt.find('i')).addClass('fa-solid fa-check-double');
        }

        if(!init) {
            $(tgt).siblings('.data').show({
                complete: () => {},
            });

            $(tgt).siblings('.bases').show({
                complete: () => {},
            });

            $(tgt).siblings('.effets').show({
                complete: () => {},
            });
        } else {
            $(tgt).siblings('.data').show();
            $(tgt).siblings('.bases').show();
            $(tgt).siblings('.effets').show();
        }

        if(!double) {
            this.rollData.html.find('input.label').val(wpn.label);
            this.data.roll.label = wpn.label;
        }

        for(let p of parents) {
            if(id !== $(p).parents('div.button').data('id')) {
                const w = this.rollData.allWpn.find(itm => itm.id === $(p).parents('div.button').data('id'));
                if(w) w.classes.replaceAll(' selected', '');
                $(p).removeClass('selected');
                $(p).find('i').removeClass('fa-solid fa-check');
                $(p).parents('div.button').removeClass('selected');
                $(p).parents('div.cat').removeClass('selected');

                $(p).siblings('.data').hide({
                    complete: () => {},
                });

                $(p).siblings('.bases').hide({
                    complete: () => {},
                });

                $(p).siblings('.effets').hide({
                    complete: () => {},
                });

                if($(p).parents('div.button').siblings('h2.summary').find('i').hasClass('fa-plus-square')) {
                    $(p).parents('div.button').hide({
                        complete: () => {},
                    });
                }

                if($(p).parents('div.button').siblings('h3.summary').find('i').hasClass('fa-plus-square')) {
                    $(p).parents('div.button').hide({
                        complete: () => {},
                    });
                }

                if($(p).parents('div.cat').siblings('h2.summary').find('i').hasClass('fa-plus-square')) {
                    $(p).parents('div.button').hide({
                        complete: () => {},
                    });

                    $(p).parents('div.cat').hide({
                        complete: () => {},
                    });
                }
            } else {
                $(p).parents('div.button').addClass('selected');
                $(p).parents('div.cat').addClass('selected');

                if($(p).parents('div.button').siblings('h2.summary').find('i').hasClass('fa-minus-square')) {
                    $(p).parents('div.button').show({
                        complete: () => {},
                    });
                }

                if($(p).parents('div.button').siblings('h3.summary').find('i').hasClass('fa-minus-square')) {
                    $(p).parents('div.button').show({
                        complete: () => {},
                    });
                }

                if($(p).parents('div.cat').siblings('h2.summary').find('i').hasClass('fa-minus-square')) {
                    $(p).parents('div.button').show({
                        complete: () => {},
                    });

                    $(p).parents('div.cat').show({
                        complete: () => {},
                    });
                }
            }
        }

        $(tgt).parents('div.button').addClass('selected');
        $(tgt).parents('div.cat').addClass('selected');
        if(!double) {
            if(wpn?.tourelle) {
                $(tgt).parents('div.grpWpn').siblings('div.aspects').hide({
                    complete: () => {
                        $(tgt).parents('div.grpWpn').siblings('label.style').addClass('rowThreeFive');
                        $(tgt).parents('div.grpWpn').siblings('label.style').removeClass('rowFourTwo rowFourSix');
                        $(tgt).parents('div.grpWpn').siblings('div.grpBtn').removeClass('rowFour rowThreeSeven rowThreeFive');
                        $(tgt).parents('div.grpWpn').siblings('div.grpBtn').addClass('rowTwoSix');
                    },
                });
            } else {
                $(tgt).parents('div.grpWpn').siblings('label.style').addClass('rowFourSix');
                $(tgt).parents('div.grpWpn').siblings('label.style').removeClass('rowThreeFive');

                $(tgt).parents('div.grpWpn').siblings('div.aspects').show({
                    complete: () => {
                    },
                });
            }
        }

        this.#updateStyleShow(undefined, wpn);
    }

    #unselectWpn(tgt, double=false) {
        const id = tgt.parents('div.button').data('id');

        if(id === this.rollData.wpnSelected && !double) this.rollData.wpnSelected = '';
        else if(id === this.rollData.wpnSecond && double) this.rollData.wpnSecond = '';

        if(!double) {
            tgt.removeClass('selected');
            $(tgt.find('i')).removeClass('fa-solid fa-check');
        }
        else {
            tgt.removeClass('doubleSelected');
            $(tgt.find('i')).removeClass('fa-solid fa-check-double');
        }

        $(tgt).parents('div.button').removeClass('selected');
        $(tgt).parents('div.cat').removeClass('selected');

        $(tgt).siblings('.data').hide({
            complete: () => {},
        });

        $(tgt).siblings('.bases').hide({
            complete: () => {},
        });

        $(tgt).siblings('.effets').hide({
            complete: () => {},
        });

        if($(tgt).parents('div.button').siblings('h2.summary').find('i').hasClass('fa-plus-square')) {
            $(tgt).parents('div.button').hide({
                complete: () => {},
            });
        }

        if($(tgt).parents('div.button').siblings('h3.summary').find('i').hasClass('fa-plus-square')) {
            $(tgt).parents('div.button').hide({
                complete: () => {},
            });
        }

        if($(tgt).parents('div.cat').siblings('h2.summary').find('i').hasClass('fa-plus-square')) {
            $(tgt).parents('div.button').hide({
                complete: () => {},
            });

            $(tgt).parents('div.cat').hide({
                complete: () => {},
            });
        }

        if(!this.rollData.wpnSelected) {
            $(tgt).parents('div.grpWpn').siblings('label.style').removeClass('rowThreeFive');
            $(tgt).parents('div.grpWpn').siblings('label.style').addClass('rowFourTwo');

            $(tgt).parents('div.grpWpn').siblings('div.aspects').show({
                complete: () => {
                },
            });
        }

        this.#updateStyleShow(undefined, undefined, true);
    }

    #updateStyleShow(style = undefined, wpn = undefined, forceUnselect = false) {
        const data = this.rollData;
        const html = data?.html;
        if (!html) return;

        // Cache DOM
        const $zones = {
          pilonnage:   html.find('.pilonnage'),
          precis:      html.find('.precis'),
          puissant:    html.find('.puissant'),
          suppression: html.find('.suppression'),
        };
        const hideAll = () => { Object.values($zones).forEach($z => $z.hide()); };
        const showOnly = (key) => {
          Object.entries($zones).forEach(([k, $z]) => $z[k === key ? 'show' : 'hide']());
        };

        // Entrées
        const getStyle = style ?? String(html.find('label.style select').val() ?? '').trim();
        const getWpn = wpn ?? data.allWpn.find(itm => itm.id === data.wpnSelected);

        if (!getWpn || forceUnselect) {
          hideAll();
          return;
        }

        // Effets
        const rawEffets = [
          ...(getWpn?.effets?.raw ?? []),
          ...(getWpn?.distance?.raw ?? []),
          ...(getWpn?.structurelles?.raw ?? []),
          ...(getWpn?.ornementales?.raw ?? []),
        ];
        const effetSet = new Set(rawEffets);
        const options = getWpn.options ?? {};
        const type = getWpn.type;

        const has = (effet) => this.#isEffetActive(effetSet, options, [effet]);
        const hasAny = (effets) => this.#isEffetActive(effetSet, options, effets);

        // Règles par style
        const rules = {
          pilonnage: () => type === 'distance' &&
            hasAny(['deuxmains', 'systemerefroidissement', 'munitionshypervelocite']),

          precis: () => type === 'contact' &&
            hasAny(['deuxmains', 'systemerefroidissement', 'munitionshypervelocite']),

          puissant: () => type === 'contact' && (
            has('lourd') ||
            (has('deuxmains') && hasAny(['systemerefroidissement', 'munitionshypervelocite']))
          ),

          suppression: () => type === 'distance' && (
            has('lourd') ||
            (has('deuxmains') && hasAny(['systemerefroidissement', 'munitionshypervelocite']))
          ),
        };

        const isKnownStyle = Object.prototype.hasOwnProperty.call(rules, getStyle);
        if (!isKnownStyle || !rules[getStyle]()) {
          hideAll();
          return;
        }

        // Affichage
        if (['pilonnage','precis','puissant','suppression'].includes(getStyle)) {
          showOnly(getStyle);
        } else {
          hideAll();
        }
    }

    #updateBtnShow(forceUnselect=false, init=false) {
        const html = this.rollData.html;
        const hasWpn = this.rollData.wpnSelected === '' ? false : true;
        const isPJ = this.isPJ;

        if(!hasWpn || forceUnselect) {
            if(init) {
                html.find('.modificateurdegats').hide();

                html.find('.modificateurviolence').hide();

                html.find('.maximizedegats').hide();

                html.find('.maximizeviolence').hide();

                html.find('.modeheroique').hide();

                html.find('.attaquesurprise').hide();

                html.find('.score.difficulte').show();

                html.find('.score.difficulte').show();

                html.find('.score.succesBonus').addClass('colTwo');
                html.find('.score.modificateur').addClass('colThree');
                html.find('.score.succesBonus').removeClass('colOne');
                html.find('.score.modificateur').removeClass('colTwo');
            } else {
                html.find('.modificateurdegats').hide({
                    complete: () => {},
                });

                html.find('.modificateurviolence').hide({
                    complete: () => {},
                });

                html.find('.maximizedegats').hide({
                    complete: () => {},
                });

                html.find('.maximizeviolence').hide({
                    complete: () => {},
                });

                html.find('.modeheroique').hide({
                    complete: () => {},
                });

                html.find('.attaquesurprise').hide({
                    complete: () => {},
                });

                html.find('.score.difficulte').show({
                    complete: () => {},
                });

                html.find('.score.succesBonus').addClass('colTwo');
                html.find('.score.modificateur').addClass('colThree');
                html.find('.score.succesBonus').removeClass('colOne');
                html.find('.score.modificateur').removeClass('colTwo');
            }

            if(!isPJ) html.find('.grpBtn').hide();

            html.find('div.grpBtn').addClass('rowFour');
            html.find('div.grpBtn').removeClass('rowThreeSeven rowThreeFive');
        } else {
            if(init) {
                html.find('.modificateurdegats').show();

                html.find('.modificateurviolence').show();

                html.find('.maximizedegats').show();

                html.find('.maximizeviolence').show();

                if(isPJ) {
                    html.find('.modeheroique').show();
                } else {
                    html.find('.modeheroique').hide();
                }

                html.find('.attaquesurprise').show();

                html.find('.score.difficulte').hide();

                html.find('.score.succesBonus').removeClass('colTwo');
                html.find('.score.modificateur').removeClass('colThree');
                html.find('.score.succesBonus').addClass('colOne');
                html.find('.score.modificateur').addClass('colTwo');
            } else {
                html.find('.modificateurdegats').show({
                    complete: () => {},
                });

                html.find('.modificateurviolence').show({
                    complete: () => {},
                });

                html.find('.maximizedegats').show({
                    complete: () => {},
                });

                html.find('.maximizeviolence').show({
                    complete: () => {},
                });

                if(isPJ) {
                    html.find('.modeheroique').show({
                        complete: () => {},
                    });
                } else {
                    html.find('.modeheroique').hide({
                        complete: () => {},
                    });
                }

                html.find('.attaquesurprise').show({
                    complete: () => {},
                });

                html.find('.score.difficulte').hide({
                    complete: () => {},
                });

                html.find('.score.succesBonus').removeClass('colTwo');
                html.find('.score.modificateur').removeClass('colThree');
                html.find('.score.succesBonus').addClass('colOne');
                html.find('.score.modificateur').addClass('colTwo');
            }

            if(!isPJ) html.find('.grpBtn').show();

            html.find('div.grpBtn').removeClass('rowFour rowThreeSeven rowThreeFive');
            if(isPJ) html.find('div.grpBtn').addClass('rowThreeSeven');
            else html.find('div.grpBtn').addClass('rowThreeFive');
        }
    }

    #updateBonusInterdits(b, html) {
        const attrMods = this.attrMods;
        const bonus = attrMods.bonus
        const interdits = attrMods.interdits;
        const btns = html.find('button.btnCaracteristique');

        if(!b) {
            for(let b of btns) {
                const value = $(b).data('value');

                if(interdits.includes(value)) {
                    const rData = this.rollData;
                    $(b).css('opacity', '0.5');
                    $(b).removeClass('wHover');
                    $(b).removeClass('selected base');
                    $(b).find('i').removeClass('fa-solid fa-check-double fa-check');

                    if(rData.base === value) {
                        if(rData.whatRoll.length !== 0) {
                            html.find(`button.btnCaracteristique.${rData.whatRoll[0]}`).addClass('base');

                            rData.base = rData.whatRoll[0];
                            rData.whatRoll.shift();
                        } else {
                            rData.base = '';
                        }
                    }

                    if(rData.whatRoll.includes(value)) {
                        $(b).find('i').removeClass('fa-solid fa-check-double fa-check');

                        rData.whatRoll = rData.whatRoll.filter(item => item !== value);
                    }
                } else if(!bonus.includes(value)) {
                    $(b).css('opacity', '1');

                    if(!$(b).hasClass('wHover')) $(b).addClass('wHover');
                }

                if(bonus.includes(value)) {
                    const rData = this.rollData;
                    $(b).css('opacity', '0.5');
                    $(b).removeClass('wHover');

                    if(rData.base === value) {
                        $(b).removeClass('base');
                        $(b).find('i').removeClass('fa-check-double');
                        $(b).find('i').addClass('fa-check');

                        if(rData.whatRoll.length !== 0) {
                            if(!$(b).hasClass('selected')) $(b).addClass('selected');
                            html.find(`button.btnCaracteristique.${rData.whatRoll[0]}`).addClass('base');

                            rData.base = rData.whatRoll[0];
                            rData.whatRoll.shift();
                            rData.whatRoll.push(value);
                        }
                    }
                } else if(!interdits.includes(value)) {
                    $(b).css('opacity', '1');

                    if(!$(b).hasClass('wHover')) $(b).addClass('wHover');
                }
            }
        } else {
            const value = $(b).data('value');

            if(interdits.includes(value)) {
                const rData = this.rollData;
                $(b).css('opacity', '0.5');
                $(b).removeClass('wHover');

                if(rData.base === value) {
                    $(b).removeClass('selected base');

                    if(rData.whatRoll.length !== 0) {
                        $(b).find('i').removeClass('fa-solid fa-check-double fa-check');
                        html.find(`button.btnCaracteristique.${rData.whatRoll[0]}`).addClass('base');

                        rData.base = rData.whatRoll[0];
                        rData.whatRoll.shift();
                    } else {
                        rData.base = '';
                    }
                }

                if(rData.whatRoll.includes(value)) {
                    $(b).find('i').removeClass('fa-solid fa-check-double fa-check');

                    rData.whatRoll = rData.whatRoll.filter(item => item !== value);
                }
            } else if(!bonus.includes(value)) {
                $(b).css('opacity', '1');

                if(!$(b).hasClass('wHover')) $(b).addClass('wHover');
            }

            if(bonus.includes(value)) {
                const rData = this.rollData;

                if(rData.base === value) {
                    if(rData.whatRoll.length !== 0) {
                        html.find(`button.btnCaracteristique.${rData.whatRoll[0]}`).addClass('base');

                        rData.base = rData.whatRoll[0];
                        rData.whatRoll.shift();
                    }
                }

                $(b).css('opacity', '0.5');
                $(b).removeClass('wHover');
                $(b).removeClass('base');
                $(b).find('i').removeClass('fa-solid fa-check-double');
                $(b).find('i').addClass('fa-solid fa-check');

                if(!$(b).hasClass('selected')) $(b).addClass('selected');

                rData.whatRoll.push(value);
            } else if(!interdits.includes(value)) {
                $(b).css('opacity', '1');

                if(!$(b).hasClass('wHover')) $(b).addClass('wHover');
            }
        }
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

        $(tgt).each((_, t) => {
            const $t = $(t);
            const isSelected = $t.hasClass('selected');
            const $button = $t.parents('div.button');
            const $cat = $t.parents('div.cat');

            if (isSelected) {
                $t.add($button).add($cat).show();
                $button.parents('div.button').siblings('div.button').show();
            } else {
                $button.removeClass('selected');
            }

            const $catIcon = $cat.find('h3 i');
            if ($catIcon.hasClass('fa-minus-square')) {
                $cat.find('h3').siblings().show();
            }
        });

        html.find('div.wpn.wpndistance').toggle(distance);
        html.find('div.wpn.wpncontact').toggle(contact);
        html.find('div.wpn.grenade').toggle(grenade);
        html.find('div.wpn.complexe').toggle(complexe);
        html.find('div.wpn.tourelle').toggle(tourelle);
        html.find('div.wpn.aicontact').toggle(aicontact);
        html.find('div.wpn.aidistance').toggle(aidistance);

        html.find('div.wpn.wpndistance')
        .toggleClass('colTwo', contact)
        .toggleClass('colOne', !contact);

        html.find('div.wpn.grenade')
        .toggleClass('colDuo', (!tourelle && (complexe || (contact && distance))) || (!tourelle && (!complexe && (!contact && !distance))))
        .toggleClass('colOne', tourelle && ((!distance && !contact) || (contact && distance) || complexe))
        .toggleClass('colTwo', (!complexe && ((!distance && contact) || (distance && !contact))));

        html.find('div.wpn.tourelle')
        .toggleClass('colDuo', (!grenade || ((grenade && !distance && contact && !complexe) || (grenade && !contact && distance && !complexe))))
        .toggleClass('colTwo', grenade && ((!distance && !contact) || (contact && distance) || complexe))

        html.find('label.selectWithInfo select').change(async ev => {
            const $tgt = $(ev.currentTarget);
            const style = $tgt.val();

            $tgt.siblings('span.hideInfo').remove();
            $tgt.parents('label.style').append(`<span class="hideInfo" style="display:none;">${game.i18n.localize(CONFIG.KNIGHT.styles[style])}</span>`);

            this.rollData.style.type = 'degats';
            this.rollData.style.value = 0;

            this.#updateStyleShow(style, undefined);

            if(style !== 'akimbo') {
                this.#unselectWpn($(this.rollData.html.find('.doubleSelected')), true);
                this.rollData.html.find('span.specialInfo').hide();
            }
            else {
                this.rollData.html.find('span.specialInfo').text(game.i18n.localize("KNIGHT.COMBAT.STYLES.AKIMBO.SecondWpn"));
                this.rollData.html.find('span.specialInfo').show();
            }

            if(this.actor.type === 'mechaarmure') await this.actor.update({['system.combat.style']: style});
            else await this.who.update({['system.combat.style']: style});
        });

        html.find('.precis select').change(ev => {
            const tgt = $(ev.currentTarget);
            const value = tgt.val();

            this.rollData.style.precis.type = value;
        });

        html.find('.pilonnage select').change(ev => {
            const tgt = $(ev.currentTarget);
            const value = tgt.val();

            this.rollData.style.pilonnage.type = value;
            this.actor.update({['system.combat.data.type']:value});
        });

        html.find('.pilonnage input').change(ev => {
            const tgt = $(ev.currentTarget);
            const value = parseInt(tgt.val());

            this.rollData.style.pilonnage.value = value;
            this.actor.update({['system.combat.data.tourspasses']:value});
        });

        html.find('.puissant select').change(ev => {
            const tgt = $(ev.currentTarget);
            const value = tgt.val();

            this.rollData.style.puissant.type = value;
        });

        html.find('.puissant input').change(ev => {
            const tgt = $(ev.currentTarget);
            const value = parseInt(tgt.val());

            this.rollData.style.puissant.value = value;
        });

        html.find('.suppression select').change(ev => {
            const tgt = $(ev.currentTarget);
            const value = tgt.val();

            this.rollData.style.suppression.type = value;
        });

        html.find('.suppression input').change(ev => {
            const tgt = $(ev.currentTarget);
            const value = parseInt(tgt.val());

            this.rollData.style.suppression.value = value;
        });

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
        this.data.roll.html.find('div.wpn.wpncontact .button').remove();
        this.data.roll.html.find('div.wpn.wpndistance .button').remove();
        this.data.roll.html.find('div.wpn.tourelle .button').remove();
        this.data.roll.html.find('div.wpn.aicontact .cat .button').remove();
        this.data.roll.html.find('div.wpn.aidistance .cat .button').remove();
        this.data.roll.html.find('div.wpn.grenade .button').remove();
        this.data.roll.html.find('div.complexe .button').remove();
    }

    #updateWpnContact(contact) {
        let htmlContact = ``;

        for(let w of contact) {
            htmlContact += this.#getWpnHTML(w);
        }

        this.data.roll.html.find('div.wpn.wpncontact').append(htmlContact);
    }

    #updateWpnDistance(distance) {
        let htmlDistance = ``;

        for(let w of distance) {
            htmlDistance += this.#getWpnHTML(w);
        }

        this.data.roll.html.find('div.wpn.wpndistance').append(htmlDistance);
    }

    #updateWpnTourelle(distance) {
        let htmlDistance = ``;

        for(let w of distance) {
            htmlDistance += this.#getWpnHTML(w);
        }

        this.data.roll.html.find('div.wpn.tourelle').append(htmlDistance);
    }

    #updateWpnAIContact(ai) {

        for(let w of ai) {
            let html = ``;

            for(let l of w.list) {
                html += this.#getWpnHTML(l);
            }

            this.data.roll.html.find(`div.wpn.aicontact div.cat.${w.id}`).append(html);
        }
    }

    #updateWpnAIDistance(ai) {
        for(let w of ai) {
            let html = ``;

            for(let l of w.list) {
                html += this.#getWpnHTML(l);
            }

            this.data.roll.html.find(`div.wpn.aidistance div.cat.${w.id}`).append(html);
        }
    }

    #updateWpnGrenade(grenade) {
        let htmlGrenade = ``;

        for(let w of grenade) {
            if(this.data.roll.html.find('div.wpn.grenade h2 i.fa-plus-square').length > 0) w.noShow = true;

            htmlGrenade += this.#getWpnHTML(w);
        }

        this.data.roll.html.find('div.wpn.grenade').append(htmlGrenade);
    }

    #updateWpnComplexe(complexe) {
        let htmlComplexe = ``;

        for(let w of complexe) {
            htmlComplexe += this.#getWpnComplexeHTML(w);
        }

        this.data.roll.html.find('div.complexe').append(htmlComplexe);
    }

    #updateWpn(id, update) {
        const wpn = this.rollData.allWpn.find(itm => itm.id === id);

        for(let upd in update) {
            if(id.includes('module')) {
                if(upd.includes('options2mains') && (wpn.type === 'contact' || wpn.type === 'distance')) {
                    this.actor.items.get(id).update({[`system.niveau.actuel.arme.${upd}`]:update[upd]});
                }

                if(upd.includes('munitions') && (wpn.type === 'contact' || wpn.type === 'distance')) {
                    this.actor.items.get(id).update({[`system.niveau.actuel.arme.${upd}`]:update[upd]});
                }
            } else {
                if(upd.includes('options2mains') && (wpn.type === 'contact' || wpn.type === 'distance')) {
                    this.actor.items.get(id).update({[`system.${upd}`]:update[upd]});
                }

                if(upd.includes('munitions') && (wpn.type === 'contact' || wpn.type === 'distance')) {
                    this.actor.items.get(id).update({[`system.${upd}`]:update[upd]});
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
}