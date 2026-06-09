const JsTogglerMixin = (superclass) => class extends superclass {
    /** @inheritdoc */
    static DEFAULT_OPTIONS = {
        actions: {
            jsToggle: this.#onJsToggle,
        }
    };

    constructor(options = {}) {
        super(options);
        this.toggles = this.#loadJsToggler();
    }

    // ─── Storage ─────────────────────────────────────────────

    #loadJsToggler() {
        const dataset = localStorage.getItem('knight.togglers');
        if (dataset === null) return new Map();

        try {
            return new Map(Object.entries(JSON.parse(dataset)));
        } catch {
            return new Map();
        }
    }

    #saveJsToggler() {
        const obj = Object.fromEntries(this.toggles);
        localStorage.setItem('knight.togglers', JSON.stringify(obj));
    }

    #toggleKey(index) {
        return `${this.document.id}-${index}`;
    }

    // ─── Lifecycle ───────────────────────────────────────────

    _onRender(context, options) {
        super._onRender(context, options);
        this.#initToggler(this.element);
    }

    /**
     * Initialise l'état au render : pose directement display:none
     * sur les éléments qui doivent être repliés, sans animation.
     */
    #initToggler(element) {
        element.querySelectorAll('[data-action="jsToggle"]').forEach((el, index) => {
            const saved = this.toggles.get(this.#toggleKey(index));

            // Pas d'enregistrement → on garde l'état par défaut du HTML (plus = replié)
            if (saved === undefined) {
                if(el.classList.contains('fa-plus-square')) {
                    this.#getSiblings(el).forEach(s => {
                        s.style.setProperty('display', 'none');
                    });
                }
                return;
            }

            if (saved === true) {
                // État sauvegardé = replié
                el.classList.remove('fa-minus-square');
                el.classList.add('fa-plus-square');
                this.#getSiblings(el).forEach(s => {
                    s.style.setProperty('display', 'none');
                });
            } else {
                // État sauvegardé = déplié
                el.classList.remove('fa-plus-square');
                el.classList.add('fa-minus-square');
                // Rien à faire sur les siblings : ils sont déjà visibles par défaut
            }
        });
    }


    // ─── Action handler ──────────────────────────────────────

    static #onJsToggle(event, target) {
        this._toggleJs(target);

        const all = Array.from(this.element.querySelectorAll('[data-action="jsToggle"]'));
        const index = all.indexOf(target);
        this.toggles.set(this.#toggleKey(index), target.classList.contains('fa-plus-square'));

        this.#saveJsToggler();
    }

    _toggleJs(target) {
        target.classList.toggle('fa-plus-square');
        target.classList.toggle('fa-minus-square');

        const isCollapsed = target.classList.contains('fa-plus-square');
        const siblings = this.#getSiblings(target);

        if (isCollapsed) siblings.forEach(el => this._slideUp(el));
        else siblings.forEach(el => this._slideDown(el));
    }

    // ─── DOM helpers ─────────────────────────────────────────

    #getSiblings(target) {
        const main = target.closest('.header');
        if (!main) return [];
        return Array.from(main.parentElement.children).filter(c => c !== main);
    }

    #clearHandler(elem) {
        if (elem._endHandler) {
            elem.removeEventListener('transitionend', elem._endHandler);
            elem._endHandler = null;
        }
    }

    // ─── Animations ──────────────────────────────────────────

    _slideUp = elem => {
        this.#clearHandler(elem);

        // Partir de la hauteur réelle (et pas "auto", non-animable)
        const currentHeight = elem.getBoundingClientRect().height;

        elem.style.setProperty('overflow', 'hidden');
        elem.style.setProperty('height', `${currentHeight}px`);
        elem.style.setProperty('opacity', '1');

        // Force reflow
        void elem.offsetHeight;

        elem.style.setProperty('transition', `all ${'0.2s'} ease-out`);
        elem.style.setProperty('height', '0px');
        elem.style.setProperty('opacity', '0');

        elem._endHandler = (e) => {
            if (e.propertyName !== 'height') return;
            elem.style.setProperty('display', 'none');
            this.#clearHandler(elem);
        };
        elem.addEventListener('transitionend', elem._endHandler);
    }

    _slideDown = elem => {
        this.#clearHandler(elem);

        // 1. Reset complet pour mesurer la taille naturelle
        elem.style.removeProperty('display');
        elem.style.removeProperty('transition');
        elem.style.removeProperty('height');
        elem.style.removeProperty('overflow');
        elem.style.removeProperty('opacity');

        const targetHeight = elem.scrollHeight;

        // 2. État de départ (collapsed)
        elem.style.setProperty('overflow', 'hidden');
        elem.style.setProperty('height', '0px');
        elem.style.setProperty('opacity', '0');

        // 3. Force reflow
        void elem.offsetHeight;

        // 4. Anime vers la cible
        elem.style.setProperty('transition', `all ${'0.2s'} ease-out`);
        elem.style.setProperty('height', `${targetHeight}px`);
        elem.style.setProperty('opacity', '1');

        // 5. À la fin, libère la hauteur (revient à "auto")
        elem._endHandler = (e) => {
            if (e.propertyName !== 'height') return;
            elem.style.removeProperty('height');
            elem.style.removeProperty('overflow');
            elem.style.removeProperty('transition');
            elem.style.removeProperty('opacity');
            this.#clearHandler(elem);
        };
        elem.addEventListener('transitionend', elem._endHandler);
    }
};

export default JsTogglerMixin;
