/**
 * Edit dialog
 * @extends {Application}
 */
export class KnightEditDialog extends Application {
    constructor(data, options) {
        super(options);
        this.data = data;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
          template: "systems/knight/templates/dialog/edit-sheet.html",
        classes: ["dialog", "knight", "editDialog"],
        width: 400,
        jQuery: true
      });
    }

    /** @inheritdoc */
    getData(options) {
      this.options.title = this.data.title;
      let buttons = Object.keys(this.data.buttons).reduce((obj, key) => {
        let b = this.data.buttons[key];
        b.cssClass = [key, this.data.default === key ? "default" : ""].filterJoin(" ");
        if ( b.condition !== false ) obj[key] = b;
        return obj;
      }, {});
      return {
        content: this.data.content,
        buttons: buttons
      }
    }

    /** @inheritdoc */
  activateListeners(html) {
    html.find(".button1").click(this._onClickButton.bind(this));
    html.find(".button2").click(this.close.bind(this));
    html.find("input").change(ev => {
      const type = $(ev.currentTarget).data("type");
      const val = $(ev.currentTarget).val();
      const aspectValue = html.find(".aspect").val();
      const inputs = html.find("input");

      if(type === "caracteristique" && val > aspectValue) {
          $(ev.currentTarget).val(aspectValue);
      }

      for(let i = 0;i < inputs.length;i++) {
        const data = $(inputs[i]).data("type");

        if(data === "caracteristique" && $(inputs[i]).val() > aspectValue) {
          $(inputs[i]).val(aspectValue);
        }
      }
    });
  }

  /**
   * Handle a left-mouse click on one of the dialog choice buttons
   * @param {MouseEvent} event    The left-mouse click event
   * @private
   */
   _onClickButton(event) {
    const id = event.currentTarget.dataset.button;
    const button = this.data.buttons[id];
    this.submit(button);
  }

  /**
   * Submit the Dialog by selecting one of its buttons
   * @param {Object} button     The configuration of the chosen button
   * @private
   */
   submit(button) {
    try {
      if (button.callback) button.callback(this.options.jQuery ? this.element : this.element[0]);
      this.close();
    } catch(err) {
      ui.notifications.error(err);
      throw new Error(err);
    }
  }

  /** @inheritdoc */
  async close(options) {
    if ( this.data.close ) this.data.close(this.options.jQuery ? this.element : this.element[0]);
    $(document).off('keydown.chooseDefault');
    return super.close(options);
  }
}
