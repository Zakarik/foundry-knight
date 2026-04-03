
const VehiculeMixinSheet = (superclass) => class extends superclass {

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    html.find('.passager-delete').click(ev => {
      const target = $(ev.currentTarget).parents(".value");
      const id = target.data("id");
      const data = this.actor.system;
      const oldPassager = data.equipage.passagers;
      oldPassager.splice(id,1);

      this.actor.update({[`system.equipage.passagers`]:oldPassager});
    });

    html.find('.pilote-delete').click(ev => {
      this.actor.update({[`system.equipage.pilote`]:{
        name:'',
        id:''
      }});

    });

    html.find('.passager-edit').click(ev => {
      const target = $(ev.currentTarget).parents(".value");
      const id = target.data("id");
      const data = this.actor.system;
      const pilote = data.equipage.pilote;
      const oldPassager = data.equipage.passagers;
      const passager = oldPassager[id];

      let update = {};

      update[`system.equipage.pilote`] = {
        id:passager.id,
        name:passager.name
      };

      if(pilote.id) {
        oldPassager.push({
          name:pilote.name,
          id:pilote.id
        });
      }

      update[`system.equipage.passagers`] = oldPassager.filter(itm => itm.id !== passager.id);

      this.actor.update(update);
    });

    html.find('.pilote-edit').click(ev => {
      const target = $(ev.currentTarget).parents(".value");
      const id = target.data("id");
      const data = this.actor.system;
      const oldPassager = data.equipage.passagers;
      oldPassager.push({
        name:data.equipage.pilote.name,
        id:data.equipage.pilote.id
      });

      let update = {};
      update[`system.equipage.passagers`] = oldPassager;
      update[`system.equipage.pilote`] = {
        id:'',
        name:''
      };

      this.actor.update(update);
    });

    html.find('.jetPilotage').click(ev => {
      const actorId = this.actor.system.equipage.pilote.id;
      const manoeuvrabilite = this.actor.system.manoeuvrabilite;
      const label = `${game.i18n.localize("KNIGHT.VEHICULE.Pilotage")} : ${this.actor.name}`

      if(actorId === '') return;
      const actor = this.actor.token ? this.actor.token.id : this.actor.id;

      const dialog = new game.knight.applications.KnightRollDialog(actor, {
        whoActivate:actorId,
        label:label,
        succesbonus:manoeuvrabilite,
      });

      dialog.open();
    });
  }
}