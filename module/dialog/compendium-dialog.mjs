export class KnightCompendiumDialog extends FormApplication {
    /**
   * @param {Document} object                    A Document instance which should be managed by this form.
   * @param {DocumentSheetOptions} [options={}]  Optional configuration parameters for how the form behaves.
   */
  constructor(object, options={}) {
    super(object, options);

    this.object = {
      data:{
        armures:[],
        modules:[],
        armes:[],
        ai:[],
        distinctions:[],
        cartes:[],
        capacites:[],
      },
      header:{
        armures:[],
        modules:[],
        armes:[],
        ai:[],
        distinctions:[],
        cartes:[],
        capacites:[],
      },
      filters:{
        armures:[],
        modules:[],
        armes:[],
        ai:[],
        distinctions:[],
        cartes:[],
        capacites:[],
      },
      sort:{
        armures:{
          by:'name',
          type:'descendant'
        },
        modules:{
          by:'rarete',
          type:'descendant'
        },
        armes:{
          by:'rarete',
          type:'descendant'
        },
        ai:{
          by:'type',
          type:'descendant'
        },
        distinctions:{
          by:'name',
          type:'descendant'
        },
        cartes:{
          by:'name',
          type:'descendant'
        },
        capacites:{
          by:'name',
          type:'descendant'
        }
      },
      fmodules:{},
      farmures:{},
      farmes:{},
      fai:{},
      fdistinctions:{},
      fcartes:{},
      fcapacites:{},
      opened:{},
      search:'',
      check:{
        gen:{},
        rarete:{},
        raretem:{},
        categorie:{},
        type:{}
      },
      pg:{
        max:999,
        min:0,
      }
    };
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
        title:game.i18n.localize('KNIGHT.COMPENDIUM.Label'),
        classes: ["knightCompendium", "sheet", "compendium"],
        template: "systems/knight/templates/dialog/compendium-sheet.html",
        width: 1020,
        height: 720,
        resizable: true,
        tabs: [
          {navSelector: ".sheet-tabs", contentSelector: ".body", initial: "armure"}
        ],
        dragDrop: [{dragSelector: [".draggable", ".item-list .item"], dropSelector: null}]
    });
  }

  async getData(options = {}) {
    const context = super.getData();
    const generateHeader = this._generateHeader(context);
    const generateList = await this._generateList(context);

    return foundry.utils.mergeObject(context.object, {
      data:generateList.data,
      header:generateHeader,
      filters:generateList.filters,
      sort:this.object.sort,
      fmodules:this.object.fmodules,
      farmures:this.object.farmures,
      farmes:this.object.farmures,
      opened:this.object.opened,
      search:this.object.search,
      check:this.object.check,
      pg:this.object.pg,
    });
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find('nav a').click(async ev => {
      const target = $(ev.currentTarget);
      const tab = target.data('tab');
      const active = this._tabs[0].active;

      if(active !== tab) {
        this.object.search = '';
        html.find('div.filter div.search input').val('');
        //this._setSearch(tab, '', html);
        this._setAllFilter(tab, html, 'search', '');
      }
    });

    html.find('div.tab .header i').click(ev => {
      const target = $(ev.currentTarget);
      const header = target.parents(".summary");
      const tab = header.data("tab");
      const by = header.data("by");
      const type = target.data("type");

      this.object.sort[tab] = {
        by:by,
        type:type
      };

      this.render(true);
    });

    html.find('div.filter details summary').click(ev => {
      const target = $(ev.currentTarget);
      const gen = target.data("key");
      const isOpen = this.object.opened?.[gen] ?? false;
      const open = isOpen ? false : true;

      this.object.opened[gen] = open;
    });

    html.find('div.line span.name').click(async ev => {
      const header = $(ev.currentTarget).parents(".line");
      const uuid = header.data('uuid');
      const itm = await this._getFromUuid(uuid);

      itm.sheet.render(true);
    });

    html.find('div.filter details input[type="checkbox"]').click(ev => {
      const target = $(ev.currentTarget);
      const header = target.parents("details");
      const key = header.data('key');
      const tab = target.data('tab');

      this._setAllFilter(tab, html, key);

      this.render(true);
    });

    html.find('div.filter div.gloire input').keyup(ev => {
      const target = $(ev.currentTarget);
      const tab = target.data('tab');
      const type = target.data('type');
      const minOrMax = target.data('minormax');
      const value = target.val();

      //this._setInput(tab, type, minOrMax, value, html);
      this._setAllFilter(tab, html, type, value, minOrMax);
    });

    html.find('div.filter div.gloire input.max').change(ev => {
      const target = $(ev.currentTarget);
      const value = target.val();
      const min = parseInt(this.object.pg.min);

      if(value < min) target.val(min);
    });

    html.find('div.filter div.search input').keyup(ev => {
      const target = $(ev.currentTarget);
      const value = target.val();
      const tab = target.data('tab');

      //this._setSearch(tab, value, html);
      this._setAllFilter(tab, html, 'search', value);
    });
  }

  /** @inheritdoc */
  _canDragStart(selector) {
    return true;
  }

  async _onDragStart(event) {
    const li = event.currentTarget;
    if ( event.target.classList.contains("content-link") ) return;

    // Create drag data
    let dragData;

    // Owned Items
    if ( li.dataset.uuid ) {
        dragData = {
          uuid:li.dataset.uuid,
          type:li.dataset.type,
        };
    }

    // Active Effect
    if ( li.dataset.effectId ) {
      const effect = this.actor.effects.get(li.dataset.effectId);
      dragData = effect.toDragData();
    }

    if ( !dragData ) return;

    // Set data transfer
    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  }

  async _getFromUuid(uuid) {
    return await fromUuid(uuid);
  }

  _generateHeader(context) {
    const header = {
      armures:[
        {
          type:'',
          html:``
        },
        {
          type:'name',
          html:`${game.i18n.localize('KNIGHT.Nom')}`
        },
        {
          type:'generation',
          html:`${game.i18n.localize('KNIGHT.COMPENDIUM.Generation')}`
        },
        {
          type:'armure',
          html:`${game.i18n.localize('KNIGHT.AUTRE.PointArmure-short')}`
        },
        {
          type:'energie',
          html:`${game.i18n.localize('KNIGHT.AUTRE.PointEnergie-short')}`
        },
        {
          type:'champDeForce',
          html:`${game.i18n.localize('KNIGHT.LATERAL.ChampDeForce-short')}`
        },
      ],
      modules:[
        {
          type:'',
          html:``
        },
        {
          type:'name',
          html:`${game.i18n.localize('KNIGHT.Nom')}`
        },
        {
          type:'gloire',
          html:`${game.i18n.localize('KNIGHT.AUTRE.PointGloire-short')}`
        },
        {
          type:'categorie',
          html:`${game.i18n.localize('KNIGHT.ITEMS.MODULE.CATEGORIE.Label')}`
        },
        {
          type:'rarete',
          html:`${game.i18n.localize('KNIGHT.ITEMS.MODULE.RARETE.Label')}`
        },
      ],
      armes:[
        {
          type:'',
          html:``
        },
        {
          type:'name',
          html:`${game.i18n.localize('KNIGHT.Nom')}`
        },
        {
          type:'gloire',
          html:`${game.i18n.localize('KNIGHT.AUTRE.PointGloire-short')}`
        },
        {
          type:'subtype',
          html:`${game.i18n.localize('KNIGHT.ITEMS.MODULE.ARME.TYPE.Label')}`
        },
        {
          type:'rarete',
          html:`${game.i18n.localize('KNIGHT.ITEMS.MODULE.RARETE.Label')}`
        },
      ],
      ai:[
        {
          type:'',
          html:``
        },
        {
          type:'name',
          html:`${game.i18n.localize('KNIGHT.Nom')}`
        },
        {
          type:'categorie',
          html:`${game.i18n.localize('KNIGHT.COMPENDIUM.Categorie')}`
        },
        {
          type:'subtype',
          html:`${game.i18n.localize('KNIGHT.TYPE.Label')}`
        },
      ],
      distinctions:[
        {
          type:'',
          html:``
        },
        {
          type:'name',
          html:`${game.i18n.localize('KNIGHT.Nom')}`
        }
      ],
      cartes:[
        {
          type:'',
          html:``
        },
        {
          type:'name',
          html:`${game.i18n.localize('KNIGHT.Nom')}`
        }
      ],
      capacites:[
        {
          type:'',
          html:``
        },
        {
          type:'name',
          html:`${game.i18n.localize('KNIGHT.Nom')}`
        }
      ]
    }

    return header;
  }

  async _generateList(context) {
    //const packs = game.packs.contents;
    const sort = context.object.sort;
    const compendium = CONFIG.KNIGHTCOMPENDIUM;
    const armures = compendium.armures;
    const modules = compendium.modules;
    const armes = compendium.armes;
    const ai = compendium.ai;
    const distinctions = compendium.distinctions;
    const cartes = compendium.cartes;
    const capacites = compendium.capacites;
    const listGenerations = compendium.listGenerations;
    const listMRarete = compendium.listMRarete;
    const listMCategorie = compendium.listMCategorie;
    const listARarete = compendium.listARarete;
    const listAType = compendium.listAType;
    const listAIType = compendium.listAIType;
    const listAICategorie = compendium.listAICategorie;

    /*for(let p of packs) {
      if(p.visible) {
        const list = p.index.contents;

        for(let l of list) {
          const type = l.type;
          const uuid = l.uuid;
          const itm = 'Item';
          let rData;
          let name;
          let gloire;
          let rarete;
          let categorie;
          let data = {};
          data = {
            uuid:uuid,
            type:itm,
            all:[]
          };

          switch(type) {
            case 'armure':
              rData = await this._getFromUuid(uuid);
              name = rData.name;
              const gen = rData.system.generation;
              const armure = rData.system.armure.base;
              const energie = rData.system.energie.base;
              const champDeForce = rData.system.champDeForce.base;

              data.name = name;
              data.generation = gen;
              data.armure = armure;
              data.energie = energie;
              data.champDeForce = champDeForce;

              if(!listGenerations.includes(gen)) listGenerations.push(gen);

              data.all = [
                `<img src='${rData.img}'></img>`,
                `<span class='name'>${name}</span>`,
                `<span class='value'>${gen}</span>`,
                `<span class='value'>${armure}</span>`,
                `<span class='value'>${energie}</span>`,
                `<span class='value'>${champDeForce}</span>`,
              ];

              armures.push(data);
              break;

            case 'module':
              rData = await this._getFromUuid(uuid);
              name = rData.name;
              gloire = rData.system.prix;
              rarete = rData.system.rarete;
              categorie = rData.system.categorie;

              data.name = name;
              data.gloire = gloire;
              data.rarete = rarete;
              data.categorie = categorie;

              if(!listMRarete.includes(rarete)) listMRarete.push(rarete);
              if(!listMCategorie.includes(categorie)) listMCategorie.push(categorie);

              let labelCategorie = '';

              if(categorie !== '') {
                if(rarete === 'prestige') labelCategorie = game.i18n.localize(CONFIG.KNIGHT.module.categorie.prestige[categorie]);
                else labelCategorie = game.i18n.localize(CONFIG.KNIGHT.module.categorie.normal[categorie]);
              }

              data.all = [
                `<img src='${rData.img}'></img>`,
                `<span class='name'>${name}</span>`,
                `<span class='value'>${gloire}</span>`,
                `<span class='value'>${labelCategorie}</span>`,
                `<span class='value'>${game.i18n.localize(`KNIGHT.ITEMS.MODULE.RARETE.${rarete.charAt(0).toUpperCase() + rarete.slice(1)}`)}</span>`,
              ];

              modules.push(data);
              break;

            case 'arme':
              rData = await this._getFromUuid(uuid);
              name = rData.name;
              gloire = rData.system.prix;
              rarete = rData.system.rarete;
              categorie = rData.system.type;

              data.name = name;
              data.gloire = gloire;
              data.rarete = rarete;
              data.type = categorie;

              if(!listARarete.includes(rarete)) listARarete.push(rarete);
              if(!listAType.includes(categorie)) listAType.push(categorie);

              data.all = [
                `<img src='${rData.img}'></img>`,
                `<span class='name'>${name}</span>`,
                `<span class='value'>${gloire}</span>`,
                `<span class='value'>${game.i18n.localize(`KNIGHT.ITEMS.MODULE.ARME.TYPE.${categorie.charAt(0).toUpperCase() + categorie.slice(1)}`)}</span>`,
                `<span class='value'>${game.i18n.localize(`KNIGHT.ITEMS.MODULE.RARETE.${rarete.charAt(0).toUpperCase() + rarete.slice(1)}`)}</span>`,
              ];

              armes.push(data);
              break;

            case 'avantage':
            case 'inconvenient':
              rData = await this._getFromUuid(uuid);
              name = rData.name;
              categorie = rData.system.type;

              data.name = name;
              data.categorie = type;
              data.type = categorie;

              if(!listAIType.includes(categorie)) listAIType.push(categorie);
              if(!listAICategorie.includes(type)) listAICategorie.push(type);

              const label = categorie === 'standard' ? game.i18n.localize(`KNIGHT.AUTRE.Standard`) : game.i18n.localize(`KNIGHT.IA.Label`);

              data.all = [
                `<img src='${rData.img}'></img>`,
                `<span class='name'>${name}</span>`,
                `<span class='value'>${game.i18n.localize(`TYPES.Item.${type}`)}</span>`,
                `<span class='value'>${label}</span>`,
              ];

              ai.push(data);
              break;

            case 'distinction':
              rData = await this._getFromUuid(uuid);
              name = rData.name;

              data.name = name;

              data.all = [
                `<img src='${rData.img}'></img>`,
                `<span class='name'>${name}</span>`,
              ];

              distinctions.push(data);
              break;

            case 'carteheroique':
              rData = await this._getFromUuid(uuid);
              name = rData.name;

              data.name = name;

              data.all = [
                `<img src='${rData.img}'></img>`,
                `<span class='name'>${name}</span>`,
              ];

              cartes.push(data);
              break;

            case 'capaciteheroique':
              rData = await this._getFromUuid(uuid);
              name = rData.name;

              data.name = name;

              data.all = [
                `<img src='${rData.img}'></img>`,
                `<span class='name'>${name}</span>`,
              ];

              capacites.push(data);
              break;
          }
        }
      }
    }*/

    armures.sort((a, b) => {
      const by = sort.armures.by;

      const nameA = by === 'name' ? a[by].toUpperCase() : a[by]; // ignore upper and lowercase
      const nameB = by === 'name' ? b[by].toUpperCase() : b[by]; // ignore upper and lowercase

      if(by === 'name') {
        if(sort.armures.type === 'ascendant') {
          if (nameA.localeCompare(nameB) < 0) return 1;
          if (nameA.localeCompare(nameB) > 0) return -1;
        } else {
          if (nameA.localeCompare(nameB) < 0) return -1;
          if (nameA.localeCompare(nameB) > 0) return 1;
        }
      } else {
        if(sort.armures.type === 'ascendant') {
          if (nameA < nameB) return 1;
          if (nameA > nameB) return -1;
        } else {
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
        }
      }

      // names must be equal
      return 0;
    });

    modules.sort((a, b) => {
      const by = sort.modules.by;
      let nameA = '';
      let nameB = '';

      if(by === 'rarete') {
        if(a[by] === 'standard') nameA = 'a';
        else if(a[by] === 'avance') nameA = 'b';
        else if(a[by] === 'rare') nameA = 'c';
        else if(a[by] === 'espoir') nameA = 'e';
        else if(a[by] === 'prestige') nameA = 'd';

        if(b[by] === 'standard') nameB = 'a';
        else if(b[by] === 'avance') nameB = 'b';
        else if(b[by] === 'rare') nameB = 'c';
        else if(b[by] === 'espoir') nameB = 'e';
        else if(b[by] === 'prestige') nameB = 'd';
      } else {
        nameA = by === 'name' || by === 'categorie' ? a[by].toUpperCase() : a[by]; // ignore upper and lowercase
        nameB = by === 'name' || by === 'categorie' ? b[by].toUpperCase() : b[by]; // ignore upper and lowercase
      }

      if(by === 'name' || by === 'categorie') {
        if(sort.modules.type === 'ascendant') {
          if (nameA.localeCompare(nameB) < 0) return 1;
          if (nameA.localeCompare(nameB) > 0) return -1;
        } else {
          if (nameA.localeCompare(nameB) < 0) return -1;
          if (nameA.localeCompare(nameB) > 0) return 1;
        }
      } else {
        if(sort.modules.type === 'ascendant') {
          if (nameA < nameB) return 1;
          if (nameA > nameB) return -1;
        } else {
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
        }
      }

      // names must be equal
      return 0;
    });

    armes.sort((a, b) => {
      const by = sort.armes.by;
      let nameA = '';
      let nameB = '';

      if(by === 'rarete') {
        if(a[by] === 'standard') nameA = 'a';
        else if(a[by] === 'avance') nameA = 'b';
        else if(a[by] === 'rare') nameA = 'c';
        else if(a[by] === 'espoir') nameA = 'e';
        else if(a[by] === 'prestige') nameA = 'd';

        if(b[by] === 'standard') nameB = 'a';
        else if(b[by] === 'avance') nameB = 'b';
        else if(b[by] === 'rare') nameB = 'c';
        else if(b[by] === 'espoir') nameB = 'e';
        else if(b[by] === 'prestige') nameB = 'd';
      } else {
        nameA = by === 'name' || by === 'type' ? a[by].toUpperCase() : a[by]; // ignore upper and lowercase
        nameB = by === 'name' || by === 'type' ? b[by].toUpperCase() : b[by]; // ignore upper and lowercase
      }

      if(by === 'name' || by === 'type') {
        if(sort.armes.type === 'ascendant') {
          if (nameA.localeCompare(nameB) < 0) return 1;
          if (nameA.localeCompare(nameB) > 0) return -1;
        } else {
          if (nameA.localeCompare(nameB) < 0) return -1;
          if (nameA.localeCompare(nameB) > 0) return 1;
        }
      } else {
        if(sort.armes.type === 'ascendant') {
          if (nameA < nameB) return 1;
          if (nameA > nameB) return -1;
        } else {
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
        }
      }

      // names must be equal
      return 0;
    });

    ai.sort((a, b) => {
      const by = sort.ai.by;
      let nameA = '';
      let nameB = '';

      if(by === 'type') {
        if(a[by] === 'standard') nameA = 'a';
        else if(a[by] === 'ia') nameA = 'b';

        if(b[by] === 'standard') nameB = 'a';
        else if(b[by] === 'ia') nameB = 'b';
      } else {
        nameA = by === 'name' || by === 'type' ? a[by].toUpperCase() : a[by]; // ignore upper and lowercase
        nameB = by === 'name' || by === 'type' ? b[by].toUpperCase() : b[by]; // ignore upper and lowercase
      }

      if(by === 'name' || by === 'type') {
        if(sort.ai.type === 'ascendant') {
          if (nameA.localeCompare(nameB) < 0) return 1;
          if (nameA.localeCompare(nameB) > 0) return -1;
        } else {
          if (nameA.localeCompare(nameB) < 0) return -1;
          if (nameA.localeCompare(nameB) > 0) return 1;
        }
      } else {
        if(sort.ai.type === 'ascendant') {
          if (nameA < nameB) return 1;
          if (nameA > nameB) return -1;
        } else {
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
        }
      }

      // names must be equal
      return 0;
    });

    distinctions.sort((a, b) => {
      const by = sort.distinctions.by;
      let nameA = '';
      let nameB = '';

      nameA = a[by].toUpperCase(); // ignore upper and lowercase
      nameB = b[by].toUpperCase(); // ignore upper and lowercase

      if(sort.distinctions.type === 'ascendant') {
        if (nameA.localeCompare(nameB) < 0) return 1;
        if (nameA.localeCompare(nameB) > 0) return -1;
      } else {
        if (nameA.localeCompare(nameB) < 0) return -1;
        if (nameA.localeCompare(nameB) > 0) return 1;
      }

      // names must be equal
      return 0;
    });

    cartes.sort((a, b) => {
      const by = sort.cartes.by;
      let nameA = '';
      let nameB = '';

      nameA = a[by].toUpperCase(); // ignore upper and lowercase
      nameB = b[by].toUpperCase(); // ignore upper and lowercase

      if(sort.cartes.type === 'ascendant') {
        if (nameA.localeCompare(nameB) < 0) return 1;
        if (nameA.localeCompare(nameB) > 0) return -1;
      } else {
        if (nameA.localeCompare(nameB) < 0) return -1;
        if (nameA.localeCompare(nameB) > 0) return 1;
      }

      // names must be equal
      return 0;
    });

    capacites.sort((a, b) => {
      const by = sort.capacites.by;
      let nameA = '';
      let nameB = '';

      nameA = a[by].toUpperCase(); // ignore upper and lowercase
      nameB = b[by].toUpperCase(); // ignore upper and lowercase

      if(sort.capacites.type === 'ascendant') {
        if (nameA.localeCompare(nameB) < 0) return 1;
        if (nameA.localeCompare(nameB) > 0) return -1;
      } else {
        if (nameA.localeCompare(nameB) < 0) return -1;
        if (nameA.localeCompare(nameB) > 0) return 1;
      }

      // names must be equal
      return 0;
    });

    listGenerations.sort();
    listMCategorie.sort((a, b) => {
      const listPrestige = ['cheval', 'taureau', 'cerf', 'aigle', 'loup', 'sanglier', 'ours', 'serpent', 'lion', 'faucon', 'corbeau', 'dragon'];
      let nameA = '';
      let nameB = '';

      if(listPrestige.includes(a)) {
        nameA = `zz${a}`;
      } else nameA = a;

      if(listPrestige.includes(b)) {
        nameB= `zz${b}`;
      } else nameB = b;

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;

      // names must be equal
      return 0;
    });
    listMRarete.sort((a, b) => {
      let nameA = '';
      let nameB = '';

      switch(a) {
        case 'standard':
          nameA = 'a';
          break;
        case 'avance':
          nameA = 'b';
          break;
        case 'rare':
          nameA = 'c';
          break;
        case 'prestige':
          nameA = 'd';
          break;
        case 'espoir':
          nameA = 'e';
          break;
      }

      switch(b) {
        case 'standard':
          nameB = 'a';
          break;
        case 'avance':
          nameB = 'b';
          break;
        case 'rare':
          nameB = 'c';
          break;
        case 'prestige':
          nameB = 'd';
          break;
        case 'espoir':
          nameB = 'e';
          break;
      }

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;

      // names must be equal
      return 0;
    });
    listARarete.sort((a, b) => {
      let nameA = '';
      let nameB = '';

      switch(a) {
        case 'standard':
          nameA = 'a';
          break;
        case 'avance':
          nameA = 'b';
          break;
        case 'rare':
          nameA = 'c';
          break;
        case 'prestige':
          nameA = 'd';
          break;
        case 'espoir':
          nameA = 'e';
          break;
      }

      switch(b) {
        case 'standard':
          nameB = 'a';
          break;
        case 'avance':
          nameB = 'b';
          break;
        case 'rare':
          nameB = 'c';
          break;
        case 'prestige':
          nameB = 'd';
          break;
        case 'espoir':
          nameB = 'e';
          break;
      }

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;

      // names must be equal
      return 0;
    });

    return {
      data:{
        armures:armures,
        modules:modules,
        armes:armes,
        ai:ai,
        distinctions:distinctions,
        cartes:cartes,
        capacites:capacites,
      },
      filters:{
        armures:{
          generations:listGenerations
        },
        modules:{
          rarete:listMRarete,
          categorie:listMCategorie,
        },
        armes:{
          rarete:listARarete,
          type:listAType,
        },
        ai:{
          categorie:listAICategorie,
          type:listAIType,
        },
        distinctions:{},
        cartes:{},
        capacites:{}
      }
    }
  }

  _setAllFilter(tab, html, type, value='', minOrMax='') {
    if(type === 'search') this.object.search = value;
    if(type === 'pg') {
      if(value === '') value = 0;

      this.object[type][minOrMax] = value;
    }

    const search = this.object.search;
    const ltypes = html.find('div.filter details.type input[type="checkbox"]');
    const categories = html.find('div.filter details.categorie input[type="checkbox"]');
    const rarete = html.find('div.filter details.rarete input[type="checkbox"]');
    const raretem = html.find('div.filter details.raretem input[type="checkbox"]');
    const val = search.toLowerCase();
    const list = html.find(`div.tab.${tab} div.tofilter`);
    const tabC = `f${tab}`;
    let minPG = tab === 'modules' || tab === 'armes' ? parseInt(this.object.pg.min) : 0;
    let maxPG = tab === 'modules' || tab === 'armes' ?  parseInt(this.object.pg.max) : 0;

    let gens = {};
    let rare = {};
    let cat = {}
    let types = {}

    if(type === 'pg') {
      if(maxPG < minPG) {
        maxPG = minPG;
        this.object.pg.max = minPG;
      }
    }

    switch(tab) {
      case 'armures':
        const generations = html.find('div.filter.armures details.generations input[type="checkbox"]');

        if(type === 'generations') {
          gens = {
            1:true,
            2:true,
            3:true,
            4:true,
          };

          for(let g of generations) {
            const target = $(g);
            const gen = target.data('gen');
            const value = target.is(':checked');

            gens[gen] = value;
            this.object.check.gen[gen] = value;
          }
        } else gens =  this.object.check.gen;
        break;
      case 'modules':
        if(type === 'rarete') {
          rare = {
            'standard':true,
            'avance':true,
            'rare':true,
            'prestige':true,
            'espoir':true,
          };

          for(let g of raretem) {
            const target = $(g);
            const rarete = target.data('rarete');
            const value = target.is(':checked');

            rare[rarete] = value;
            this.object.check.raretem[rarete] = value;
          }
        } else rare = this.object.check.raretem;

        if(type === 'categorie') {
          for(let g of categories) {
            const target = $(g);
            const categorie = target.data('categorie');
            const value = target.is(':checked');

            this.object.check.categorie[categorie] = value;
            cat[categorie] = value;
          }
        } else cat = this.object.check.categorie;
        break;
      case 'armes':
        if(type === 'rarete') {
          rare = {
            'standard':true,
            'avance':true,
            'rare':true,
            'prestige':true,
            'espoir':true,
          };

          for(let g of rarete) {
            const target = $(g);
            const rarete = target.data('rarete');
            const value = target.is(':checked');

            rare[rarete] = value;
            this.object.check.rarete[rarete] = value;
          }
        } else rare = this.object.check.rarete;

        if(type === 'type') {
          for(let g of ltypes) {
            const target = $(g);
            const categorie = target.data('type');
            const value = target.is(':checked');

            this.object.check.type[categorie] = value;
            types[categorie] = value;
          }
        } else types = this.object.check.type;
        break;
      case 'ai':
        if(type === 'type') {
          for(let g of ltypes) {
            const target = $(g);
            const categorie = target.data('subtype');
            const value = target.is(':checked');

            this.object.check.type[categorie] = value;
            types[categorie] = value;
          }
        } else types = this.object.check.type;

        if(type === 'categorie') {
          for(let g of categories) {
            const target = $(g);
            const categorie = target.data('categorie');
            const value = target.is(':checked');

            this.object.check.categorie[categorie] = value;
            cat[categorie] = value;
          }
        } else cat = this.object.check.categorie;
        break;
    }

    let previous = 'fonce';
    let remove = 'clair';

    for(let h of list) {
      const target = $(h);
      const name = target.data('name').toLowerCase();
      const gen = target.data('gen');
      const rarete = target.data('rarete');
      const categorie = target.data('categorie');
      const catType = target.data('subtype');
      const gloire = parseInt(target.data('gloire'));
      const uuid = target.data('uuid');
      let r1 = val === '' || name.includes(val) ? true : false;
      let r2 = true;
      let r3 = true;
      let r4 = true;

      if(tab === 'armures') r2 = gens?.[gen] ?? true ? true : false;
      else if(tab === 'modules') {
        r2 = gloire >= minPG && gloire <= maxPG ? true : false;
        r3 = rare?.[rarete] ?? true ? true : false;
        r4 = cat?.[categorie] ?? true ? true : false;
      } else if(tab === 'armes') {
        r2 = gloire >= minPG && gloire <= maxPG ? true : false;
        r3 = rare?.[rarete] ?? true ? true : false;
        r4 = types?.[catType] ?? true ? true : false;
      } else if(tab === 'ai') {
        r3 = cat?.[categorie] ?? true ? true : false;
        r4 = types?.[catType] ?? true ? true : false;
      }

      if(r1 && r2 && r3 && r4) {
        target.show();
        target.addClass(previous);
        target.removeClass(remove);

        if(previous === 'fonce') {
          previous = 'clair';
          remove = 'fonce';
        } else {
          previous = 'fonce';
          remove = 'clair';
        }

        this.object[tabC][uuid] = false;
      } else {
        target.hide();
        this.object[tabC][uuid] = true;
      }
    }
  }
}