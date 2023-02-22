/**
 * Extend the base Item document to support attributes and groups with a custom template creation dialog.
 * @extends {Item}
 */
export class KnightItem extends Item {
    static async create(data, options = {}) {
        // Replace default image
        if (data.img === undefined) {

            switch(data.type) {
                case "arme":
                    data.img = "systems/knight/assets/icons/arme.svg";
                    break;

                case "effet":
                    data.img = "systems/knight/assets/icons/effet.svg";
                    break;

                case "armure":
                    data.img = "systems/knight/assets/icons/armure.svg";
                    break;

                case "avantage":
                    data.img = "systems/knight/assets/icons/avantage.svg";
                    break;

                case "inconvenient":
                    data.img = "systems/knight/assets/icons/inconvenient.svg";
                    break;

                case "motivationMineure":
                    data.img = "systems/knight/assets/icons/motivationMineure.svg";
                    break;

                case "langue":
                    data.img = "systems/knight/assets/icons/langue.svg";
                    break;

                case "contact":
                    data.img = "systems/knight/assets/icons/contact.svg";
                    break;

                case "blessure":
                    data.img = "systems/knight/assets/icons/blessureGrave.svg";
                    break;

                case "trauma":
                    data.img = "systems/knight/assets/icons/trauma.svg";
                    break;

                case "module":
                    data.img = "systems/knight/assets/icons/module.svg";
                    break;

                case "capacite":
                    data.img = "systems/knight/assets/icons/capacite.svg";
                    break;

                case "armurelegende":
                    data.img = "systems/knight/assets/icons/armureLegende.svg";
                    break;

                case "carteheroique":
                    data.img = "systems/knight/assets/icons/carteheroique.svg";
                    break;

                case "capaciteheroique":
                    data.img = "systems/knight/assets/icons/capaciteheroique.svg";
                    break;

                case "capaciteultime":
                    data.img = "systems/knight/assets/icons/capaciteultime.svg";
                    break;

                case "art":
                    data.img = "systems/knight/assets/icons/art.svg";
                    break;
            }

        }

        await super.create(data, options);
    }
}
