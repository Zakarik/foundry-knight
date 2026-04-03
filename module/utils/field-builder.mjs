// utils/field-builder.mjs
const F = foundry.data.fields;

const TYPES = {
    str:      (opts) => new F.StringField(opts),
    num:      (opts) => new F.NumberField(opts),
    bool:     (opts) => new F.BooleanField(opts),
    obj:      (opts) => new F.ObjectField(opts),
    html:     (opts) => new F.HTMLField(opts),
    arr:      (element, opts) => new F.ArrayField(element, opts),
    schema:   (fields) => new F.SchemaField(fields),
    embedded: (model) => new F.EmbeddedDataField(model),
};

function buildField(value) {
    // "str" → StringField avec defaults
    if (typeof value === "string") {
        return TYPES[value]?.() ?? TYPES.str({ initial: value });
    }

    // Déjà un DataField → on le retourne tel quel
    if (value instanceof F.DataField) return value;

    // Tableau → [type, arg1, arg2]
    if (Array.isArray(value)) {
        const [type, arg1, arg2] = value;

        if (type === "arr")      return TYPES.arr(buildField(arg1), arg2 ?? {});
        if (type === "embedded") return TYPES.embedded(arg1);
        if (type === "schema") {
            const built = {};
            for (const [k, v] of Object.entries(arg1)) {
                built[k] = buildField(v);
            }
            return TYPES.schema(built);
        }


        return TYPES[type]?.(arg1);
    }

    // Objet plat → SchemaField implicite
    if (typeof value === "object" && value !== null) {
        return TYPES.schema(fields(value));
    }
}


export function fields(def) {
    const result = {};
    for (const [key, val] of Object.entries(def)) {
        result[key] = buildField(val);
    }
    return result;
}

export function combine(...defs) {
    const result = {};
    for (const def of defs) {
        for (const [key, value] of Object.entries(def)) {
            // Si les deux sont des schemas, fusionner récursivement
            if (
                Array.isArray(result[key]) && result[key][0] === "schema" &&
                Array.isArray(value) && value[0] === "schema"
            ) {
                result[key] = ["schema", combine(result[key][1], value[1])];
            } else {
                result[key] = value;
            }
        }
    }
    return result;
}

