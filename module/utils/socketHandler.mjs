
const SYSTEM = 'knight';

export let SOCKET;

export function knightSocketReady() {
	/* globals socketlib */
	SOCKET = socketlib.registerSystem(SYSTEM);

	SOCKET.register('createSubActor', createSubActor);
	SOCKET.register('giveItmToActor', giveItmToActor);
	SOCKET.register('createToken', createToken);
	SOCKET.register('deleteActorOrToken', deleteActorOrToken);
	SOCKET.register('deleteItmInActor', deleteItmInActor);
}

async function createSubActor(payload={}) {
    if(!payload) return;

    let actor = await Actor.create(payload);

    return { id: actor.id, uuid: actor.uuid };
}

async function giveItmToActor(payload={}) {
    const actor = await fromUuid(payload.actor);
    const items = payload.items;

    actor.createEmbeddedDocuments("Item", items);
}

async function deleteItmInActor(payload={}) {
    const actor = await fromUuid(payload.actor);
    const items = payload.items;

    actor.deleteEmbeddedDocuments('Item', items);
}

async function createToken(payload={}) {
    const scene = await fromUuid(payload.scene);
    const data = payload.data;

    const created = await scene.createEmbeddedDocuments("Token", data);

    return created?.[0];
}

async function deleteActorOrToken(payload={}) {
    for(let a of payload.actors) {
        const actor = await fromUuid(a);
        if(!actor) continue;

        actor.delete();
    }
}