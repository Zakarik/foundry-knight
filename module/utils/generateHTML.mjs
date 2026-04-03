function localize(string) {
    return game.i18n.localize(string);
}

export default function concatHtml(type, data) {
    let concat = [];

    switch(type) {
        case 'degats':
        case 'violence':
            concat = concatDamage(type, data);
            break;
    }

    return concat;
}

function concatDamage(dmgType, data) {
    const templatePath = `systems/knight/templates/parts/damage`;
    const type = data.arme?.type ?? 'contact';
    const systemPath = data.systemPath;
    const systemData = data.arme[dmgType];
    const hasDeuxMains = data?.arme?.options2mains?.has ?? false;
    const hasVariable = systemData?.variable?.has ?? false;
    let concat = [];

    let title = dmgType === 'degats' ? localize(`KNIGHT.AUTRE.Degats`) : localize(`KNIGHT.AUTRE.Violence`);

    if(type === 'contact' && hasDeuxMains) title += ` - `+localize(`KNIGHT.ITEMS.ARME.DEUXMAINS.Unemain`);

    concat.push({
        path:`${templatePath}/header.hbs`,
        data:{title},
    });

    if(hasDeuxMains) {
        concat.push({
            path:`${templatePath}/dice.hbs`,
            data:{
                path:`${systemPath}.options2mains.1main.${dmgType}`,
                dice:systemData.options2mains['1main'][dmgType].dice,
                fixe:systemData.options2mains['1main'][dmgType].fixe,
            }
        });
    } else if(hasVariable) {
        concat.push({
            path:`${templatePath}/variable.hbs`,
            data:{
                path:`${systemPath}.${dmgType}`,
                min:{dice:systemData.variable.min.dice},
                max:{dice:systemData.variable.max.dice},
                fixe:systemData.fixe,
                cout:systemData.variable.cout,
            }
        });
    } else {
        concat.push({
            path:`${templatePath}/dice.hbs`,
            data:{
                path:`${systemPath}.${dmgType}`,
                dice:systemData.dice,
                fixe:systemData.fixe,
            }
        });
    }

    return concat;
}