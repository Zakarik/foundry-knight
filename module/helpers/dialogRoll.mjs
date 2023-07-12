import { actorIsPj } from "./common.mjs";

export function getKnightRoll(actor, hasEntraide=true) {
    const hasInstance = Object.values(ui.windows).find((app) => app instanceof game.knight.applications.KnightRollDialog);
    const isExist = !hasInstance ? false : true;

    let result = {};

    if(hasEntraide) {
      result = hasInstance ?? new game.knight.applications.KnightRollDialog({
        title:actor.name+" : "+game.i18n.localize("KNIGHT.JETS.Label"),
        buttons: {
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
      });
    } else {
      result = hasInstance ?? new game.knight.applications.KnightRollDialog({
        title:actor.name+" : "+game.i18n.localize("KNIGHT.JETS.Label"),
        buttons: {
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
      });
    }

    return {instance:result, previous:isExist};
}

/*
DATA :
- (string) base : Base du jet
- (array) autre : Autres caractéristiques
- (array) lock : Caractéristiques verrouillées
- (int) difficulte : Difficulté du jet

- (booleen) isWpn : Est une arme
- (string) idWpn : ID de l'arme
- (string) nameWpn : Nom de l'arme
- (string) typeWpn : Type de l'arme (contact, distance, tourelle, armesimprovisees - l'idWpn sera soit 'contact', soit 'distance' dans ce cas, longbow, grenades)
- (int) num : Numéro de l'arme dans l'array

- (booleen) noOd : Si les OD doivent être désactivés ou non

- (int) modificateurTemp : S'il y a un modificateurs (en dés) temporaire au jet
- (int) succesTemp : S'il y a un modificateurs (en succès) temporaire au jet

- (int) modificateur : Modificateur non temporaire (en dés).
- (int) succesBonus : Modificateur non temporaire (en succès).
- (int) degatsDice : Modificateur non temporaire (en dés) aux dégâts.
- (int) degatsFixe : Modificateur non temporaire (fixe) aux dégâts.
- (int) violenceDice : Modificateur non temporaire (en dés) en violence.
- (int) violenceFixe : Modificateur non temporaire (fixe) en violence.
*/
export function actualiseRoll() {
    const toActualise = Object.values(ui.windows).find((app) => app instanceof game.knight.applications.KnightRollDialog) ?? false;

    if(toActualise !== false) {
        toActualise.actualise();
    }
}

export function dialogRoll(label, actor, data={}) {
    const queryInstance = getKnightRoll(actor, actorIsPj(actor));
    const rollApp = queryInstance.instance;

    rollApp.setLabel(label);
    rollApp.setAct(actor);
    rollApp.setR(data);
    rollApp.render(true);

    if(queryInstance.previous) rollApp.bringToTop();
}