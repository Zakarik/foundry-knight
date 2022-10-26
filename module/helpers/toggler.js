class Toggler {
  constructor() {
    this.toggles = this._load();
  }

  init(id, html, selector) {
    html[0].querySelectorAll(selector).forEach((element, index) => {
      const visible = this.toggles.get(this._getKey(id, index));

      if ('undefined' !== typeof visible) {
        this._getSiblings(element).toggle(visible);

        if (!visible) {
          this._toggleClasses(element);
        }
      }

      element.addEventListener('click', e => {
        e.preventDefault();

        const target = e.currentTarget;

        this._toggleClasses(target);

        this._getSiblings(target).toggle({
          complete: () => this._setElementVisibility(id, index, element),
        });
      });
    });
  }

  clearForId(id) {
    this.toggles.forEach((value, key) => {
      if (key.includes(id)) {
        this.toggles.delete(key);
      }
    });

    this._save();
  }

  _getSiblings(element) {
    return $(element).parents('.header').siblings();
  }

  _toggleClasses(element) {
    element.classList.toggle('fa-plus-square');
    element.classList.toggle('fa-minus-square');
  }

  _setElementVisibility(id, index, element) {
    const target = this._getToggleTarget(element);

    this.toggles.set(this._getKey(id, index), 'none' !== target.style.display);

    this._save();
  }

  _getToggleTarget(element) {
    return element.parentElement.nextElementSibling;
  }

  _getKey(id, index) {
    return `${id}-${index}`;
  }

  _save() {
    const dataset = {};

    this.toggles.forEach((value, key) => {
      dataset[key] = value;
    });

    localStorage.setItem('knight.togglers', JSON.stringify(dataset));
  }

  _load() {
    const dataset = localStorage.getItem('knight.togglers');
    if (null === dataset) {
      return new Map();
    }

    const map = new Map();

    for (const [key, value] of Object.entries(JSON.parse(dataset))) {
      map.set(key, value);
    }

    return map;
  }
}

export default new Toggler();