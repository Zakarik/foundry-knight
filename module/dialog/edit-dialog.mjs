export async function KnightEditDialog({ title, content, aspectInitial, callback }) {
    return foundry.applications.api.DialogV2.wait({
        window: { title },
        classes: ["knight", "editDialog"],
        position: { width: 400 },
        content,
        buttons: [
            {
                action: "validate",
                label: "Valider",
                default: true,
                callback: (event, button, dialog) => {
                    const form = dialog.element.querySelector("form") ?? dialog.element;
                    const data = {};
                    form.querySelectorAll("input").forEach(input => {
                        data[input.name || input.dataset.key] = input.value;
                    });

                    return data;
                }
            },
            {
                action: "cancel",
                label: "Annuler"
            }
        ],
        render: (event, dialog) => {
            // équivalent de activateListeners
            const root = dialog.element;
            const aspectEl = root.querySelector(".aspect");

            root.querySelectorAll("input").forEach(input => {
                input.addEventListener("change", ev => {
                    const type = ev.currentTarget.dataset.type;
                    const aspectValue = Number(aspectEl?.value ?? 0);

                    if (type === "caracteristique" && Number(ev.currentTarget.value) > aspectValue) {
                        ev.currentTarget.value = aspectValue;
                    }

                    root.querySelectorAll('input[data-type="caracteristique"]').forEach(i => {
                        if (Number(i.value) > aspectValue) i.value = aspectValue;
                    });
                });
            });
        },
        rejectClose: false // pour ne pas throw si on ferme via la croix
    });
}