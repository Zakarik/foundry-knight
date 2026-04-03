/**
 * Modèle de données de base pour tous les items du système Knight.
 * Cette classe abstraite définit le schéma commun et les méthodes partagées
 * @extends {foundry.abstract.TypeDataModel}
 */
export class BaseItemDataModel extends foundry.abstract.TypeDataModel {

    /**
     * Définit le schéma de données commun à tous les items.
     * @returns {Object} Le schéma de données avec les champs suivants :
     * - description : Description HTML complète de l'item
     */
    static defineSchema() {
        const {HTMLField} = foundry.data.fields;

        return {
            // Description complète visible par le propriétaire
            description:new HTMLField({initial:""}),
        }
    }

    get actor() {
        return this.item?.actor;
    }

    get item() {
        return this.parent;
    }
}