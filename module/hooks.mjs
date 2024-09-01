export default class HooksKnight {
    /**
     * Do anything once the system is ready
     */
    static async ready() {
        // Settings Tool
        if (game.user.isGM) {
            new game.knight.documents.GmTool().render(true);
        }

        Object.defineProperty(game.user, "isFirstGM", {
            get: function () {
                return game.user.isGM && game.user.id === game.users.find((u) => u.active && u.isGM)?.id;
            },
        });

        if (game.user.isFirstGM && game.knight.migrations.needUpdate(game.knight.migrations.NEEDED_VERSION)) {
           //game.knight.migrations.migrateWorld({ force: false }).then();
        }
    }
}
