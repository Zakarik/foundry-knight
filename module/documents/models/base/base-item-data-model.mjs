import { fields } from '../../../utils/field-builder.mjs';
/**
 * Modèle de données de base pour tous les items du système Knight.
 * Cette classe abstraite définit le schéma commun et les méthodes partagées
 * @extends {foundry.abstract.TypeDataModel}
 */
export class BaseItemDataModel extends foundry.abstract.TypeDataModel {
    // Pour Héritage
    // Extension : on ajoute/modifie
    static get baseDefinition() {
        return {
            // Description complète visible par le propriétaire
            description:["html", { initial: ""}],
        };
    }
    /**
     * Définit le schéma de données commun à tous les items.
     * @returns {Object} Le schéma de données avec les champs suivants :
     * - description : Description HTML complète de l'item
     */
    static defineSchema() {
        return fields(this.baseDefinition);
    }

    get actor() {
        return this.item?.actor;
    }

    get item() {
        return this.parent;
    }
}