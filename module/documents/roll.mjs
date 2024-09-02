// DATA
// name : Nom du jet
// dices : Formula du jet (uniquement les dés)
// bonus : Array contenant la liste des bonus (uniquement des valeurs numériques)
// carac : Array contenant la liste des caractéristiques / aspects utilisés
export class RollKnight {
    static template = 'systems/knight/templates/dices/roll.html';
    static tooltip = 'systems/knight/templates/dices/tooltip.html';
    static EPICFAIL = 2;
    static EPICSUCCESS = 1;
    static NORMAL = 0;

    constructor(actor, data={}, isSuccess=true) {
        this.actor = actor;
        this.name = data?.name ?? '';
        this.formula = data?.dices ?? '0D6';
        this.bonus = data?.bonus ?? [];
        this.carac = data?.carac ?? [];
        this.isSuccess = isSuccess;
    }

    async doRoll() {
        const roll = new Roll(this.formula);
        await roll.evaluate();
        await this.#processRoll(roll);
    }

    async #processRoll(roll) {
        if(!roll) return;

        const dices = roll.dice;
        let rolls = [];
        let rollState = RollKnight.NORMAL;
        let numbers = 0;
        let success = 0;

        let results = dices.reduce((acc, dice) => {
            numbers += dice.number;

            dice.results.forEach(result => {
                success += result.result%2 === 0 ? 1 : 0;

                acc.push({
                    value:result.result,
                    class:`d${dice._faces} ${result.result%2 === 0 ? 'success' : 'fail'}`,
                });
            });
            return acc;
        }, []);

        if(numbers === success) {
            const rEpicSuccess = new Roll(this.formula);
            await rEpicSuccess.evaluate();

            let epicSuccess = rEpicSuccess.dice.reduce((acc, dice) => {
                dice.results.forEach(result => {
                    success += result.result%2 === 0 ? 1 : 0;

                    acc.push({
                        value:result.result,
                        class:`d${dice._faces} ${result.result%2 === 0 ? 'success' : 'fail'}`,
                    });
                });
                return acc;
            }, []);

            results = results.concat(epicSuccess);
            rollState = RollKnight.EPICSUCCESS;
            rolls.push(rEpicSuccess);
        } else if(success === 0) rollState = RollKnight.EPICFAIL;

        this.#sendRoll(rolls, results, success, rollState);
    }

    async #sendRoll(rolls, results, success, rollState) {
        const chatRollMode = game.settings.get("core", "rollMode");
        const formula = rollState === RollKnight.EPICSUCCESS ? `${this.formula} + ${this.formula}` : this.formula;
        let content = {
            flavor:`${this.name}`,
            caracteristiques:`${this.carac.join(' / ')}`,
            isSuccess:this.isSuccess,
            total:success + this.bonus.reduce((acc, bonus) => acc + bonus, 0),
            base:formula,
            bonus:this.bonus,
            tooltip:await renderTemplate(RollKnight.tooltip, {parts:[{
                base:formula,
                bonus:this.bonus,
                totalBonus:this.bonus.reduce((acc, bonus) => acc + bonus, 0),
                total:success,
                results:results,
            }]}),
        };

        if(rollState === RollKnight.EPICSUCCESS) content.rollState = {
            label:game.i18n.localize('KNIGHT.JETS.Exploit'),
            class:'explode',
        }
        else if(rollState === RollKnight.EPICFAIL) content.rollState = {
            label:game.i18n.localize('KNIGHT.JETS.EchecCritique'),
            class:'epicFail',
        }

        let chatData = {
            user:game.user.id,
            type:CONST.CHAT_MESSAGE_TYPES.ROLL,
            speaker: {
                actor: this.actor?.id ?? null,
                token: this.actor?.token ?? null,
                alias: this.actor?.name ?? null,
                scene: this.actor?.token?.parent?.id ?? null
            },
            content:await renderTemplate(RollKnight.template, content),
            sound: CONFIG.sounds.dice,
            rolls:rolls,
            rollMode:chatRollMode,
        };

        await ChatMessage.create(chatData);
    }
}