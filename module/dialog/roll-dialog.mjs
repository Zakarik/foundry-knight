export class KnightRollDialog {
    static dialogRoll = 'systems/knight/templates/dialog/roll-sheet.html';

    constructor(actor, data={}) {
        this.actor = actor;
        this.label = data?.label ?? '';
        this.base = data?.base ?? '';
        this.whatRoll = data?.whatRoll ?? [];
        this.difficulte = data?.difficulte ?? 0;
        this.succesBonus = data?.succesBonus ?? 0;
        this.modificateur = data?.modificateur ?? 0;
    }

    async open() {
        const dialog = new Dialog({
            title:this.#prepareTitle(),
            buttons: this.#prepareButtons(),
            content:await renderTemplate(KnightRollDialog.dialogRoll, this.#prepareOptions()),
            render:(html) => this.#prepareRender(html),
        },
        {
            classes: ["dialog", "knight", "rollDialog"],
            baseApplication:`knightRollDialog/${this.actor.id}`,
            width: 900,
            height:800,
            resizable: true
        });

        dialog.render(true);

        return dialog;
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
                      callback: async () => {},
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
        const type = this.actor.type;
        const system = this.actor.system;
        const armorIsWear = system.wear === 'armure' || system.wear === 'ascension' ? true : false;
        const aspects = system.aspects;
        const whatRoll = this.whatRoll;

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

                        if(whatRoll.includes(c)) {
                            classes.push('selected');
                            n++;
                        }
                        if(c === this.base) {
                            classes.push(`selected`, 'base');
                            n++;
                        }

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
            classes:'score',
            label:game.i18n.localize('KNIGHT.AUTRE.Difficulte'),
            value:this.difficulte,
            min:0
        });

        //SUCCES BONUS
        data.mods.push({
            key:'score',
            classes:'score',
            label:game.i18n.localize('KNIGHT.BONUS.Succes'),
            value:this.succesBonus,
            min:0
        });

        //MODIFICATEUR
        data.mods.push({
            key:'score',
            classes:'score',
            label:game.i18n.localize('KNIGHT.JETS.Modificateur'),
            value:this.modificateur,
        });


        return data;
    }

    #prepareRender(html) {
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
}