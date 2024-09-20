import toggler from '../helpers/toggler.js';
import {
    getModStyle,
} from "../helpers/common.mjs";

export class KnightRollDialog {
    static dialogRoll = 'systems/knight/templates/dialog/roll-sheet.html';

    constructor(actor, data={}) {
        this.id = actor;
        this.label = data?.label ?? '';
        this.base = data?.base ?? '';
        this.whatRoll = data?.whatRoll ?? [];
        this.difficulte = data?.difficulte ?? 0;
        this.succesBonus = data?.succesBonus ?? 0;
        this.modificateur = data?.modificateur ?? 0;

        this.dialog = undefined;
        this.html = undefined;
        this.wpnSelected = data?.wpn ?? '';
        this.allWpn = [];
    }

    get actor() {
        return canvas.tokens.get(this.id) ? canvas.tokens.get(this.id).actor : game.actors.get(this.id);
    }

    async open() {
        const dialog = new Dialog({
            title:this.#prepareTitle(),
            buttons: this.#prepareButtons(),
            content:await renderTemplate(KnightRollDialog.dialogRoll, this.#prepareOptions()),
            render:(html) => this.#prepareRender(html),
            close:(html) => {},
        },
        {
            classes: ["dialog", "knight", "rollDialog"],
            baseApplication:`knightRollDialog`,
            id:`${this.id}`,
            width: 900,
            height:800,
            resizable: true
        });

        dialog.render(true);

        this.dialog = dialog;

        return dialog;
    }

    actualise() {
        const wpns = this.#prepareWpn();

        this.allWpn = wpns.contact.concat(wpns.distance);
        this.#updateWpnContact(wpns.contact);
    }

    #prepareTitle() {
        return `${this.actor.name} : ${game.i18n.localize("KNIGHT.JETS.Label")}`;
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
                      callback: async () => {},
                      icon: `<i class="fas fa-dice-d6"></i>`
                    },
                    button3: {
                      label: game.i18n.localize("KNIGHT.AUTRE.Annuler"),
                      icon: `<i class="fas fa-times"></i>`
                    }
                }
                break;

            case 'pnj':
                results = {
                    button1: {
                      label: game.i18n.localize("KNIGHT.JETS.JetNormal"),
                      callback: async () => {},
                      icon: `<i class="fas fa-dice"></i>`
                    },
                    button3: {
                      label: game.i18n.localize("KNIGHT.AUTRE.Annuler"),
                      icon: `<i class="fas fa-times"></i>`
                    }
                }
                break;
        }

        return results;
    }

    #prepareOptions() {
        const actor = this.actor;

        const type = actor.type;
        const system = actor.system;
        const armorIsWear = system.wear === 'armure' || system.wear === 'ascension' ? true : false;
        const aspects = system.aspects;

        let data = {
            label:this.label,
            mods:[],
        };

        switch(type) {
            case 'knight':
                data.aspects = {};

                for(let a in aspects) {
                    data.aspects[a] = {
                        label:game.i18n.localize(CONFIG.KNIGHT.aspects[a]),
                        caracteristiques:{},
                    }

                    let n = 0;

                    for(let c in aspects[a].caracteristiques) {
                        let classes = ['btnCaracteristique', c];

                        data.aspects[a].caracteristiques[c] = {
                            label:game.i18n.localize(CONFIG.KNIGHT.caracteristiques[c]),
                            classes:classes.join(' '),
                            data:c,
                            value:armorIsWear ? `${aspects[a].caracteristiques[c].value} + ${aspects[a].caracteristiques[c].overdrive.value} ${game.i18n.localize('KNIGHT.ASPECTS.OD')}` : `${aspects[a].caracteristiques[c].value}`,
                        }
                    }
                }
            break;
        }

        //DIFFICULTE
        data.mods.push({
            key:'score',
            classes:'score difficulte colOne',
            label:game.i18n.localize('KNIGHT.AUTRE.Difficulte'),
            value:this.difficulte,
            min:0
        });

        //SUCCES BONUS
        data.mods.push({
            key:'score',
            classes:'score succesBonus colTwo',
            label:game.i18n.localize('KNIGHT.BONUS.Succes'),
            value:this.succesBonus,
            min:0
        });

        //MODIFICATEUR
        data.mods.push({
            key:'score',
            classes:'score modificateur colThree',
            label:game.i18n.localize('KNIGHT.JETS.Modificateur'),
            value:this.modificateur,
        });

        //STYLES
        data.mods.push({
            key:'select',
            classes:'style selectWithInfo',
            label:game.i18n.localize('KNIGHT.COMBAT.STYLES.Label'),
            selected:system.combat.style,
            info:game.i18n.localize(CONFIG.KNIGHT.styles[system.combat.style]),
            list:CONFIG.KNIGHT.LIST.style,
        })

        //ARMES
        const wpns = this.#prepareWpn();

        this.allWpn = wpns.contact.concat(wpns.distance);

        data.mods.push({
            key:'wpn',
            classes:'wpn contact colOne',
            label:game.i18n.localize('KNIGHT.COMBAT.ARMES.CONTACT.Label'),
            list:wpns.contact,
        });

        return data;
    }

    #prepareRender(html) {
        this.html = html;
        toggler.init(this.id, html);
        this.#renderSTD(html);
        this.#renderWpn(html);

        html.find('.aspect button.btnCaracteristique.selected i').addClass('fa-solid fa-check');
        html.find('.aspect button.btnCaracteristique.base i').removeClass('fa-solid fa-check');
        html.find('.aspect button.btnCaracteristique.base i').addClass('fa-solid fa-check-double');

        html.find('.aspect button.btnCaracteristique').click(ev => {
            const tgt = $(ev.currentTarget);
            const carac = tgt.data("value");
            const parents = tgt.parents('div.aspects');
            const hasAlreadyBase = $(parents.find('button.btnCaracteristique.base')).length > 0;
            const isSelected = tgt.hasClass('selected');
            const isBase = tgt.hasClass('base');

            if(isSelected) {
                tgt.removeClass('selected');
                tgt.find('i').removeClass('fa-solid fa-check')

                this.whatRoll = this.whatRoll.filter(roll => roll !== carac);
            } else {
                tgt.addClass(`selected`);

                if(hasAlreadyBase) {
                    this.whatRoll.push(carac);
                    tgt.find('i').addClass('fa-solid fa-check')
                }
                else {
                    this.base = carac;
                    tgt.addClass('base');
                    tgt.find('i').addClass('fa-solid fa-check-double')
                }
            }

            if(isBase) {
                tgt.removeClass('base');

                if(this.whatRoll) {
                    $(parents.find(`button.btnCaracteristique.${this.whatRoll[0]}`)).addClass('base');
                    $(parents.find(`button.btnCaracteristique.${this.whatRoll[0]} i`)).removeClass('fa-solid fa-check');
                    $(parents.find(`button.btnCaracteristique.${this.whatRoll[0]} i`)).addClass('fa-solid fa-check-double');

                    this.base = this.whatRoll[0];
                    this.whatRoll.shift();
                }
            }
        });
    }

    #renderSTD(html) {
        const scores = ['difficulte', 'succesBonus', 'modificateur'];
        const actor = this.actor;

        html.find('input.label').val(this.label);
        html.find('label.style select').val(actor.system.combat.style);
        html.find('label.style span.hideInfo').remove();
        html.find('label.style').append(`<span class="hideInfo" style="display:none;">${game.i18n.localize(CONFIG.KNIGHT.styles[actor.system.combat.style])}</span>`);

        const aspects = html.find('.aspect button.btnCaracteristique');

        for(let a of aspects) {
            const value = $(a).data('value');
            let setValue = `${this.#getRawValueAspect(actor, value)}`;

            if(value === this.base) $(a).addClass('selected base');
            else if(this.whatRoll.includes(value)) $(a).addClass('selected');

            if(actor.system.wear === 'armure' || actor.system.wear === 'ascension') setValue += ` + ${this.#getODAspect(actor, value)} ${game.i18n.localize('KNIGHT.ASPECTS.OD')}`

            $(a).find('span.value').text(setValue)
        }

        for(let s of scores) {
            html.find(`label.score.${s} input`).val(this[s]);
        }

        html.find('label.selectWithInfo span.info').mouseenter(ev => {
            html.find('label.selectWithInfo span.hideInfo').css("display", "block");
        });

        html.find('label.selectWithInfo span.info').mouseleave(ev => {
            html.find('label.selectWithInfo span.hideInfo').css("display", "none");
        });

        html.find('label.selectWithInfo select').change(async ev => {
            const tgt = $(ev.currentTarget);
            await actor.update({['system.combat.style']:tgt.val()});
            tgt.siblings('span.hideInfo').remove();
            tgt.parents('label.style').append(`<span class="hideInfo" style="display:none;">${game.i18n.localize(CONFIG.KNIGHT.styles[actor.system.combat.style])}</span>`);
        });
    }

    #renderWpn(html) {
        const parent = html.find('div.wpn');
        const allWpn = parent.find('div.button');

        for(let w of allWpn) {
            const id = $(w).data('id');

            if(id === this.wpnSelected) this.#selectWpn($(w).find('button.btnWpn'));
            else this.#unselectWpn($(w).find('button.btnWpn').removeClass('selected'));
        }

        parent.find('button.btnWpn').click(ev => {
            const tgt = $(ev.currentTarget);
            const isSelected = tgt.hasClass('selected');

            if(isSelected) this.#unselectWpn(tgt);
            else this.#selectWpn(tgt);
        });

        const initWpn = parent.find('div.data button.active');
        const dgtsWpn = parent.find('div.data label.dgtsvariable');
        const violenceWpn = parent.find('div.data label.violencevariable');

        for(let w of initWpn) {
            const parent = $(w).parents('div.button');
            const isSelected = $(w).hasClass('selected');
            const id = $(parent).data('id');
            const value = $(w).data('value');
            const wpn = this.allWpn.find(itm => itm.id === id);
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
            const wpn = this.allWpn.find(itm => itm.id === id);
            let options = wpn.options.find(itm => itm.classes.includes('dgtsvariable'));

           if(options.list.hasOwnProperty(wpn.degats.dice)) $(select).val(wpn.degats.dice);
           else wpn.degats = {dice:options.selected, fixe:options.selectvalue};

            $(select).change(ev => {
                const tgt = $(ev.currentTarget);
                const val = tgt.val();

                wpn.degats.dice = parseInt(val);
            });
        }

        for(let w of violenceWpn) {
            const parent = $(w).parents('div.button');
            const select = $(w).find('select');
            const id = $(parent).data('id');
            const wpn = this.allWpn.find(itm => itm.id === id);
            let options = wpn.options.find(itm => itm.classes.includes('violencevariable'));

           if(options.list.hasOwnProperty(wpn.violence.dice)) $(select).val(wpn.violence.dice);
           else wpn.violence = {dice:options.selected, fixe:options.selectvalue};

            $(select).change(ev => {
                const tgt = $(ev.currentTarget);
                const val = tgt.val();

                wpn.violence.dice = parseInt(val);
            });
        }
    }

    #selectWpn(tgt) {
        const id = tgt.parents('div.button').data('id');
        const parents = tgt.parents('div.dialog-content').find('div.wpn button.btnWpn.selected');

        this.wpnSelected = id;
        tgt.addClass('selected');
        $(tgt.find('i')).addClass('fa-solid fa-check');
        tgt.siblings('.data').show();

        for(let p of parents) {
            if(id !== $(p).parents('div.button').data('id')) {
                $(p).removeClass('selected');
                $(p).find('i').removeClass('fa-solid fa-check');
                $(p).siblings('.data').hide();
            }
        }
    }

    #unselectWpn(tgt) {
        const id = tgt.parents('div.button').data('id');

        if(id === this.wpnSelected) this.wpnSelected = '';

        tgt.removeClass('selected');
        $(tgt.find('i')).removeClass('fa-solid fa-check');
        tgt.siblings('.data').hide();
    }

    #prepareWpn() {
        const items = this.actor.items;
        const weapons = items.filter(itm => itm.type == 'arme' && itm.system.equipped)
        let contact = [];
        let distance = [];

        for(let wpn of weapons) {
            const system = wpn.system;

            if(!system.tourelle.has) {
                if(system.type === 'contact') {
                    contact.push(this.#addWpnContact(wpn));
                }
            }
        }

        return {
            contact,
            distance,
        }
    }

    #addWpnContact(wpn) {
        const system = wpn.system;

        let data = {
            label:wpn.name,
            portee:system.portee,
            classes:'btnWpn',
            options:[],
            type:'contact',
        };

        data.id = wpn.id;

        if(wpn.id === this.wpnSelected) data.classes += ' selected';

        if(!system.options2mains.has) {
            data.effets = {
                raw:system.effets.raw,
                custom:system.effets.custom,
            };
            data.structurelles = {
                raw:system.structurelles.raw,
                custom:system.structurelles.custom,
            };
            data.ornementales = {
                raw:system.ornementales.raw,
                custom:system.ornementales.custom,
            };
            const raw = system.effets.raw.concat(system.structurelles.raw, system.ornementales.raw);

            if(!system.degats.variable.has) data.degats = {dice:system.degats.dice, fixe:system.degats.fixe};
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

            if(!system.violence.variable.has) data.violence = {dice:system.violence.dice, fixe:system.violence.fixe};
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

            if(this.#hasEffet(raw, 'tirenrafale')) {
                let classes = ['tirenrafale', 'center', 'roll', 'full'];

                data.options.push({
                    key:'btn',
                    special:'roll',
                    classes:classes.join(' '),
                    label:game.i18n.localize('KNIGHT.EFFETS.TIRENRAFALE.Label'),
                    title:game.i18n.localize('KNIGHT.EFFETS.TIRENRAFALE.Relance'),
                });
            }

            if(this.#hasEffet(raw, 'soeur')) {
                let classes = ['jumelageambidextrie', 'active', 'full'];

                data.options.push({
                    key:'btn',
                    classes:classes.join(' '),
                    label:game.i18n.localize('KNIGHT.AMELIORATIONS.SOEUR.Label'),
                    value:'soeur',
                    active:true,
                });
            } else if(this.#hasEffet(raw, 'jumelageambidextrie')) {
                let classes = ['jumelageambidextrie', 'active', 'full'];

                data.options.push({
                    key:'btn',
                    classes:classes.join(' '),
                    label:game.i18n.localize('KNIGHT.AMELIORATIONS.JUMELAGEAMBIDEXTRIE.Label'),
                    value:'jumelageambidextrie',
                    active:true,
                });
            }

            if(this.#hasEffet(raw, 'barrage')) {
                let classes = ['barrage', 'active', 'full'];

                data.options.push({
                    key:'btn',
                    classes:classes.join(' '),
                    label:game.i18n.localize('KNIGHT.EFFETS.BARRAGE.Label'),
                    value:'barrage',
                    active:false,
                });
            }

            if(this.#hasEffet(raw, 'briserlaresilience')) {
                let classes = ['briserlaresilience', 'active', 'full'];

                data.options.push({
                    key:'btn',
                    classes:classes.join(' '),
                    label:game.i18n.localize('KNIGHT.EFFETS.BRISERLARESILIENCE.Label'),
                    value:'briserlaresilience',
                    active:false,
                });
            }

            if(this.#hasEffet(raw, 'chromeligneslumineuses')) {
                let classes = ['cadence', 'active', 'full'];

                data.options.push({
                    key:'btn',
                    classes:classes.join(' '),
                    label:game.i18n.localize('KNIGHT.AMELIORATIONS.CHROMELIGNESLUMINEUSES.Label'),
                    value:'chromeligneslumineuses',
                    active:false,
                });
            } else if(this.#hasEffet(raw, 'cadence')) {
                let classes = ['cadence', 'active', 'full'];

                data.options.push({
                    key:'btn',
                    classes:classes.join(' '),
                    label:game.i18n.localize('KNIGHT.EFFETS.CADENCE.Label'),
                    value:'cadence',
                    active:false,
                });
            }

            if(this.#hasEffet(raw, 'guidage')) {
                let classes = ['guidage', 'active', 'full'];

                data.options.push({
                    key:'btn',
                    classes:classes.join(' '),
                    label:game.i18n.localize('KNIGHT.EFFETS.GUIDAGE.Label'),
                    value:'guidage',
                    active:true,
                });
            }

            if(this.#hasEffet(raw, 'cranerieurgrave')) {
                let classes = ['obliteration', 'active', 'full'];

                data.options.push({
                    key:'btn',
                    classes:classes.join(' '),
                    label:game.i18n.localize('KNIGHT.AMELIORATIONS.CRANERIEURGRAVE.Label'),
                    value:'cranerieurgrave',
                    active:false,
                });
            } else if(this.#hasEffet(raw, 'obliteration')) {
                let classes = ['obliteration', 'active', 'full'];

                data.options.push({
                    key:'btn',
                    classes:classes.join(' '),
                    label:game.i18n.localize('KNIGHT.EFFETS.OBLITERATION.Label'),
                    value:'obliteration',
                    active:false,
                });
            }

            if(this.#hasEffet(raw, 'tenebricide')) {
                let classes = ['tenebricide', 'active', 'full'];

                data.options.push({
                    key:'btn',
                    classes:classes.join(' '),
                    label:game.i18n.localize('KNIGHT.EFFETS.TENEBRICIDE.Label'),
                    value:'tenebricide',
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

        } else {
            data['2main'] = true;
            data.actuel = system.options2mains.actuel;
            data.degats1main = system.options2mains['1main'].degats;
            data.degats2main = system.options2mains['2main'].degats;
            data.violence1main = system.options2mains['1main'].violence;
            data.violence2main = system.options2mains['2main'].violence;

            data.effets1main = system.effets;
            data.effets2main = system.effets2mains;
            const list = {};
            let classes = [];
            classes.push('selectSimple mains full');

            list['1main'] = game.i18n.localize('KNIGHT.ITEMS.ARME.DEUXMAINS.Unemain');
            list['2main'] = game.i18n.localize('KNIGHT.ITEMS.ARME.DEUXMAINS.Deuxmains');

            data.options.push({
                key:'select',
                classes:classes.join(' '),
                list:list,
                selected:data.actuel,
            });
        }

        return data;
    }

    #updateWpnContact() {
        const allWpn = this.#prepareWpn();
        const contact = allWpn.contact;
        let htmlContact = ``;

        html.find('div.wpn.contact button').remove();

        for(let w of contact) {
            htmlContact += this.#getWpnHTML(w);
        }

        html.find('div.wpn.contact').append(htmlContact);
    }

    async #roll(data) {
        const actor = this.actor;
        const label = data.find('input.label').val();
        const base = this.base;
        const selected = this.whatRoll;
        const weaponID = data.find('div.wpn .button .btnWpn.selected').parents('div.button').data('id');
        const weaponData = data.find('div.wpn .button .data');
        const weapon = weaponID ? this.allWpn.find(itm => itm.id === weaponID) : undefined
        const difficulte = parseInt(data.find('label.score.difficulte input').val());
        const succesBonus = parseInt(data.find('label.score.succesBonus input').val());
        const modificateur = parseInt(data.find('label.score.modificateur input').val());
        let carac = base ? [this.#getLabelRoll(base)] : [];
        let dices = this.#getValueAspect(actor, base);
        let bonus = [];
        let tags = [];

        if(actor.system.wear === 'armure' || actor.system.wear === 'ascension') bonus.push(this.#getODAspect(actor, base));

        for(let s of selected) {
            dices += this.#getValueAspect(actor, s);
            carac.push(this.#getLabelRoll(s));

            if(actor.system.wear === 'armure' || actor.system.wear === 'ascension') bonus.push(this.#getODAspect(actor, s));
        }

        if(weapon) {
            const style = actor.system.combat.style;
            const modStyle = getModStyle(style);
            const effets = weapon.effets.raw.concat(weapon.structurelles.raw, weapon.ornementales.raw);
            dices += modStyle.bonus.attaque;
            dices -= modStyle.malus.attaque;

            if(style === 'akimbo' && this.#isEffetActive(effets, weapon.options, ['jumelle', 'jumeleakimbo', 'jumelageakimbo'])) {
                dices += 2;
            }

            if(style === 'ambidextre' && this.#isEffetActive(effets, weapon.options, ['jumeleambidextrie', 'soeur', 'jumelageambidextrie'])) {
                dices += 2;
            }

            if(style === 'defensif' && this.#isEffetActive(effets, weapon.options, ['protectrice'])) {
                dices += 2;
            }

            if(style === 'acouvert' && this.#isEffetActive(effets, weapon.options, ['tirensecurite', 'interfaceguidage'])) {
                dices += 3;
            }

            for(let w of weapon.options) {
                if(w.key !== 'btn' && w.special) continue;

                w.active = weaponData.find(`button.${w.classes.split(' ')[0]}`).hasClass('selected');
            }

            if(weapon.options.find(itm => itm.classes.includes('dgtsvariable') && itm.key === 'select')) {
                weapon.degats = {
                    dice:parseInt($(weaponData.find(`label.dgtsvariable select`)).val()),
                    fixe:weapon.options.find(itm => itm.classes.includes('dgtsvariable') && itm.key === 'select').selectvalue,
                }
            }

            if(weapon.options.find(itm => itm.classes.includes('violencevariable') && itm.key === 'select')) {
                weapon.violence = {
                    dice:parseInt($(weaponData.find(`label.violencevariable select`)).val()),
                    fixe:weapon.options.find(itm => itm.classes.includes('violencevariable') && itm.key === 'select').selectvalue,
                }
            }
        }

        dices += modificateur;
        bonus.push(succesBonus);

        if(modificateur > 0) tags.push({
            key:'modificateur',
            label:`${game.i18n.localize('KNIGHT.JETS.Modificateur')} : ${modificateur}`,
        });

        if(succesBonus > 0) tags.push({
            key:'succesbonus',
            label:`${game.i18n.localize('KNIGHT.BONUS.Succes')} : ${succesBonus}`,
        });

        if(difficulte > 0) tags.push({
            key:'difficulte',
            label:`${game.i18n.localize('KNIGHT.AUTRE.Difficulte')} : ${difficulte}`,
        });

        this.label = label;
        this.difficulte = difficulte;
        this.succesBonus = succesBonus;
        this.modificateur = modificateur;

        if(dices < 1) dices = 1;

        const exec = new game.knight.RollKnight(actor,
        {
        name:label,
        dices:`${dices}D6`,
        carac:carac,
        bonus:bonus,
        weapon,
        style:actor.system.combat.style,
        tags:tags,
        }).doRoll();

        this.dialog.render(true);
    }

    #getRawValueAspect(actor, name) {
        let result = 0;

        switch(name) {
            case 'chair':
            case 'bete':
            case 'machine':
            case 'dame':
            case 'masque':
                result = actor.system.aspects[name].value;
                break;

            case 'deplacement':
            case 'force':
            case 'endurance':
                result = actor.system.aspects.chair.caracteristiques[name].value;
                break;

            case 'combat':
            case 'hargne':
            case 'instinct':
                result = actor.system.aspects.bete.caracteristiques[name].value;
                break;

            case 'tir':
            case 'savoir':
            case 'technique':
                result = actor.system.aspects.machine.caracteristiques[name].value;
                break;

            case 'parole':
            case 'aura':
            case 'sangFroid':
                result = actor.system.aspects.dame.caracteristiques[name].value;
                break;

            case 'discretion':
            case 'dexterite':
            case 'perception':
                result = actor.system.aspects.masque.caracteristiques[name].value;
                break;

            default:
                result = 0;
                break;
        }

        return result;
    }

    #getValueAspect(actor, name) {
        let result = 0;

        switch(name) {
            case 'chair':
            case 'bete':
            case 'machine':
            case 'dame':
            case 'masque':
                result = actor.system.aspects[name].value;
                break;

            case 'deplacement':
            case 'force':
            case 'endurance':
                result = actor.system.aspects.chair.caracteristiques[name].value;
                break;

            case 'combat':
            case 'hargne':
            case 'instinct':
                result = actor.system.aspects.bete.caracteristiques[name].value;
                break;

            case 'tir':
            case 'savoir':
            case 'technique':
                result = actor.system.aspects.machine.caracteristiques[name].value;
                break;

            case 'parole':
            case 'aura':
            case 'sangFroid':
                result = actor.system.aspects.dame.caracteristiques[name].value;
                break;

            case 'discretion':
            case 'dexterite':
            case 'perception':
                result = actor.system.aspects.masque.caracteristiques[name].value;
                break;

            default:
                result = 0;
                break;
        }

        return result;
    }

    #getODAspect(actor, name) {
        let result = 0;

        switch(name) {
            case 'chair':
            case 'bete':
            case 'machine':
            case 'dame':
            case 'masque':
                result = actor.system.aspects[name].value;
                break;

            case 'deplacement':
            case 'force':
            case 'endurance':
                result = actor.system.aspects.chair.caracteristiques[name].overdrive.value;
                break;

            case 'combat':
            case 'hargne':
            case 'instinct':
                result = actor.system.aspects.bete.caracteristiques[name].overdrive.value;
                break;

            case 'tir':
            case 'savoir':
            case 'technique':
                result = actor.system.aspects.machine.caracteristiques[name].overdrive.value;
                break;

            case 'parole':
            case 'aura':
            case 'sangFroid':
                result = actor.system.aspects.dame.caracteristiques[name].overdrive.value;
                break;

            case 'discretion':
            case 'dexterite':
            case 'perception':
                result = actor.system.aspects.masque.caracteristiques[name].overdrive.value;
                break;
        }

        return result;
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
        const start = `
        <div class="button" data-id="${data.id}">
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

                    mid += `<label class="${o.classes}" data-value="${o.value}">`

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

        return start+mid+end;
    }
}