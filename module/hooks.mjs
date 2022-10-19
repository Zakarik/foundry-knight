export default class HooksKnight {
    /**
     * Do anything once the system is ready
     */
    static async ready() {
        // Settings Tool
        if (game.user.isGM) {
            new game.knight.documents.GmTool().render(true);
        }
    }
}
