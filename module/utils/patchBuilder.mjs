// PatchBuilder: un seul point d’entrée pour construire et appliquer des patches Foundry
export class PatchBuilder {
    constructor() {
      this.patch = {};
    }

    // setProperty imbriqué
    set(path, value) {
      foundry.utils.setProperty(this.patch, path, value);
      return this;
    }

    // Préfixe "system." automatique
    sys(path, value) {
      return this.set(`system.${path}`, value);
    }

    // Toggle simple
    toggle(path, value = true) {
      return this.set(path, !!value);
    }

    // Toggle côté system.*
    toggleSys(path, value = true) {
      return this.sys(path, !!value);
    }

    // Pousser la même valeur sur plusieurs sous-chemins (séparés par "/")
    // Exemple: pb.multiSys("a/b/c", false) => set system.a=false, system.b=false, system.c=false
    multiSys(pathsOrString, value) {
      const paths = Array.isArray(pathsOrString)
        ? pathsOrString
        : String(pathsOrString).split('/').filter(Boolean);
      for (const p of paths) this.sys(p, value);
      return this;
    }

    // Fusionner un objet arbitraire dans le patch (clé à clé)
    merge(obj) {
      if (obj && typeof obj === 'object') {
        foundry.utils.mergeObject(this.patch, obj, { inplace: true, insertKeys: true, overwrite: true });
      }
      return this;
    }

    // Incrément/décrément avec clamp optionnel
    // docSnapshot: objet source pour lire la valeur courante (ex: actor.system)
    inc(path, by = 1, { min = -Infinity, max = Infinity } = {}, docSnapshot = null) {
      const cur = Number(foundry.utils.getProperty(docSnapshot ?? {}, path)) || 0;
      const next = Math.min(Math.max(cur + by, min), max);
      return this.set(path, next);
    }

    incSys(path, by = 1, opts = {}, docSnapshot = null) {
      return this.inc(`system.${path}`, by, opts, docSnapshot);
    }

    // Lire la valeur actuelle (utile si tu veux calculer au vol)
    get(path, docSnapshot = null) {
      return foundry.utils.getProperty(docSnapshot ?? {}, path);
    }

    // Construire le patch final
    build() {
      return this.patch;
    }

    // Appliquer sur un Document Foundry (Actor, Item, Scene, etc.)
    async applyTo(doc) {
      if (!doc) return;
      const p = this.build();
      if (!p || Object.keys(p).length === 0) return;
      return doc.update(p);
    }

    // Usine pratique si tu veux une instanciation fluide liée à un doc
    static for(doc) {
      const pb = new PatchBuilder();
      pb._target = doc ?? null;
      return pb;
    }

    async apply() {
      if (!this._target) return;
      return this.applyTo(this._target);
    }
}

export default PatchBuilder;