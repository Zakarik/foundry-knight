export class RollKnight extends Roll {
  constructor(formula, data = {}, options = {}) {
    super(formula, data, options);

     this.data = this._prepareData(data);
     this.options = options;
     this.terms = this.constructor.parse(formula, this.data);
     this._dice = [];
     this._formula = this.constructor.getFormula(this.terms);
     this._evaluated = false;
     this._total = undefined;
     this._success = false;
     this._table = false;
     this._tableau = {};
     this._base = '';
     this._autre = [];
     this._pSuccess = 0;
     this._canExploit = true;
     this._canEFail = true;
     this._isExploit = false;
     this._isEFail = false;
     this._pRolls = [];
     this._flavor = undefined;
     this._difficulte = false;
     this._isRollSuccess = false;
     this._isRollFailed = false;
     this._details = ``;
     this._totalSuccess = 0;
     this._pairOrImpair = 0;
     this._hasMin = false;
     this._seuil = 0;
     this._min = 0;
     this._style = undefined;
  }


  static CHAT_TEMPLATE = "systems/knight/templates/dices/roll.html";
  static TOOLTIP_TEMPLATE = "systems/knight/templates/dices/tooltip.html";

  evaluate({minimize=false, maximize=false, async}={}) {
    if ( this._evaluated ) {
      throw new Error(`The ${this.constructor.name} has already been evaluated and is now immutable`);
    }
    this._evaluated = true;
    if ( CONFIG.debug.dice ) console.debug(`Evaluating roll with formula ${this.formula}`);

    // Migration path for async rolls
    if ( minimize || maximize ) async = false;
    if ( async === undefined ) {
      foundry.utils.logCompatibilityWarning("Roll#evaluate is becoming asynchronous. In the short term, you may pass "
        + "async=true or async=false to evaluation options to nominate your preferred behavior.", {since: 8, until: 10});
      async = true;
    }

    return async ? this._evaluate({minimize, maximize}) : this._evaluateSync({minimize, maximize});
  }

  async render({flavor, template=this.constructor.CHAT_TEMPLATE, isPrivate=false}={}) {
    if ( !this._evaluated ) await this.evaluate({async: true});
    const dices = this._table ? this.dice[0].results : 0;
    const rTable = this._table ? this._tableau[`c${dices[0].result}`][`l${dices[1].result}`] : '';
    const caracs = [this._base].concat(this._autre)[0] === '' ? [] : [this._base].concat(this._autre);

    const chatData = {
      formula: isPrivate ? "???" : this._formula,
      flavor: isPrivate ? null : this._flavor,
      style: isPrivate ? null : this._style,
      user: game.user.id,
      tooltip: isPrivate ? "" : await this.getTooltip(),
      caracs: isPrivate ? null : caracs,
      total: isPrivate ? "?" : Math.round(this.total * 100) / 100,
      totalSuccess: isPrivate ? "?" : Math.round(this._totalSuccess * 100) / 100,
      isExploit: isPrivate ? null : this._isExploit,
      isSuccess: this._success,
      isTable: this._table,
      rTable: rTable,
      isRollSuccess:isPrivate ? "" : this._isRollSuccess,
      isRollFailed:isPrivate ? "" :  this._isRollFailed,
      isRollEFailed:isPrivate ? "" :  this._isEFail,
      details:this._details,
    };

    return renderTemplate(template, chatData);
  }

  /** @override */
  async toMessage(messageData={}, {rollMode, create=true}={}) {
    // Perform the roll, if it has not yet been rolled
    if ( !this._evaluated ) await this.evaluate({async: true});

    let hasExploit = false;
    let nSuccess = 0;

    if(this._success) {
      const dices = this.dice[0].values;
      const operator = this?.terms[1]?.operator || '+';
      const mod = this?.terms[2]?.number || 0;

      let result = 0;
      for(let i = 0;i < dices.length;i++) {
        const r = dices[i];

        result += r%2 === this._pairOrImpair ? 1 : 0;
      }

      nSuccess = result;

      if(nSuccess === 0 && this._canEFail && !this._isExploit) {
        this._isEFail = true;
      }

      if(this._canExploit && dices.length === nSuccess && !this._isEFail) {
        hasExploit = true;

        const rolls = this.dice.map(function(d) {
          const r = d.getTooltipData().rolls;
          return r;
        });

        const c = new this.constructor(`${dices.length}d6${operator}${mod}`, this.data, this.options);
        c._success = true;
        c._flavor = this._flavor;
        c._canExploit = false;
        c._isExploit = true;
        c._base = this._base;
        c._autre = this._autre;
        c._pSuccess = nSuccess;
        c._pRolls = rolls;
        c._difficulte = this._difficulte;
        c._isRollSuccess = this._isRollSuccess;
        c._canEFail = this._canEFail;
        c._totalSuccess = nSuccess;
        c._pairOrImpair = this._pairOrImpair;

        c.toMessage(messageData);

      } else {
        switch(operator) {
          case '+':
            nSuccess += mod;
            break;
          case '-':
            nSuccess -= mod;
            break;
        }

        if((this._difficulte != false || this._difficulte != 0) && !this._isEFail) {
          if(nSuccess > this._difficulte) {
            this._isRollSuccess = true;
          } else {
            this._isRollFailed = true;
          }
        }
      }
    }

    if(!hasExploit) {
      this._totalSuccess += nSuccess;

      // Prepare chat data
      messageData = foundry.utils.mergeObject({
        user: game.user.id,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        content: this.total,
        sound: CONFIG.sounds.dice,
      }, messageData);
      messageData.roll = this;

      // Either create the message or just return the chat data
      const cls = getDocumentClass("ChatMessage");
      const msg = new cls(messageData);

      // Either create or return the data
      if ( create ) return cls.create(msg, { rollMode });
      else {
        if ( rollMode ) msg.applyRollMode(rollMode);
        return msg.toObject();
      }
    }
  }

  async getTooltip() {
    const isTable = this._table;
    const pSuccess = this._pSuccess;
    const pRolls = this._pRolls;
    const isExploit = this._isExploit;
    const formula = this._formula;
    const operator = this?.terms[1]?.expression;
    const mod = this?.terms[2]?.expression;
    const details = this._details;
    const pairOrImpair = this._pairOrImpair;
    const hasMin = this._hasMin;
    const seuil = this._seuil;
    const min = this._min;

    const parts = this._success ? this.dice.map(function(d) {
      const r = d.getTooltipData();

      if(isExploit) {
        r.rolls = r.rolls.concat(pRolls[0]);
      }

      let result = 0;

      for(let i = 0;i < r.rolls.length;i++) {
        const roll = +r.rolls[i].result;

        result += roll%2 === pairOrImpair ? 1 : 0;
        const reussite = pairOrImpair === 0 ? 0 : 1;
        const echec = pairOrImpair === 1 ? 0 : 1;

        r.rolls[i].classes = r.rolls[i].classes.replace(' min', '');
        r.rolls[i].classes = r.rolls[i].classes.replace(' max', '');

        if(roll%2 === reussite) {
          r.rolls[i].classes += ' max';
        } else if(roll%2 === echec) {
          r.rolls[i].classes += ' min';
        }
      }

      if(isExploit) {
        r.formula = `${pSuccess}d6 + ${formula}`;
      } else {
        r.formula = formula;
      }

      r.operator = operator;
      r.mod = mod;
      r.total = result;
      r.details = details;

      return r;
    }) : this.dice.map(function(d) {
      const r = d.getTooltipData()
      r.formula = formula;
      r.details = details;
      r.isTable = isTable;
      r.operator = operator;
      r.mod = mod;

      if(hasMin) {
        let result = 0;

        for(let i = 0;i < r.rolls.length;i++) {
          const roll = +r.rolls[i].result;

          if(roll <= seuil) { r.rolls[i].result = min; }

          result += +r.rolls[i].result;

          r.rolls[i].classes = r.rolls[i].classes.replace(' min', '');
        }

        r.total = result;
      }

      return r;
    });

    return renderTemplate(this.constructor.TOOLTIP_TEMPLATE, { parts });
  }

  static fromData(data) {
    // Create the Roll instance
    const roll = new this(data.formula, data.data, data.options);

    // Expand terms
    roll.terms = data.terms.map(t => {
      if ( t.class ) {
        if ( t.class === "DicePool" ) t.class = "PoolTerm"; // backwards compatibility
        return RollTerm.fromData(t);
      }
      return t;
    });

    // Repopulate evaluated state
    if ( data.evaluated ?? true ) {
      roll._total = data.total;
      roll._dice = (data.dice || []).map(t => DiceTerm.fromData(t));
      roll._evaluated = true;
    }

    roll._flavor = data.flavor;
    roll._style = data.style;
    roll._canExploit = data.canExploit;
    roll._isExploit = data.isExploit;
    roll._isEFail = data.isEFail;
    roll._success = data.success;
    roll._table = data.table;
    roll._tableau = data.tableau;
    roll._pSuccess = data.pSuccess;
    roll._pRolls = data.pRolls;
    roll._base = data.base;
    roll._autre = data.autre;
    roll._difficulte = data.difficulte;
    roll._isRollSuccess = data.isRollSuccess;
    roll._isRollFailed = data.isRollFailed;
    roll._details = data.details;
    roll._totalSuccess = data.totalSuccess;
    roll._pairOrImpair = data.pairOrImpair;
    roll._hasMin = data.hasMin;
    roll._seuil = data.seuil;
    roll._min = data.min;
    return roll;
  }

  async _evaluate({minimize=false, maximize=false}={}) {

    // Step 1 - Replace intermediate terms with evaluated numbers
    const intermediate = [];
    for ( let term of this.terms ) {
      if ( !(term instanceof RollTerm) ) {
        throw new Error("Roll evaluation encountered an invalid term which was not a RollTerm instance");
      }
      if ( term.isIntermediate ) {
        await term.evaluate({minimize, maximize, async: true});
        this._dice = this._dice.concat(term.dice);
        term = new NumericTerm({number: term.total, options: term.options});
      }
      intermediate.push(term);
    }
    this.terms = intermediate;

    // Step 2 - Simplify remaining terms
    this.terms = this.constructor.simplifyTerms(this.terms);

    // Step 3 - Evaluate remaining terms
    for ( let term of this.terms ) {
      if ( !term._evaluated ) await term.evaluate({minimize, maximize, async: true});
    }

    // Step 4 - Evaluate the final expression
    this._total = this._evaluateTotal();
    return this;
  }

  async evaluateSuccess() {
    if ( !this._evaluated ) await this.evaluate({async: true});

    let hasExploit = false;
    let nSuccess = 0;

    const dices = this.dice[0].values;
    const operator = this?.terms[1]?.operator || '+';
    const mod = this?.terms[2]?.number || 0;

    let result = 0;
    for(let i = 0;i < dices.length;i++) {
      const r = dices[i];

      result += r%2 === this._pairOrImpair ? 1 : 0;
    }

    nSuccess = result;

    if(nSuccess === 0 && this._canEFail && !this._isExploit) {
      this._isEFail = true;
    }

    if(this._canExploit && dices.length === nSuccess && !this._isEFail) {
      hasExploit = true;
      this._isExploit = true;

      const c = new this.constructor(`${dices.length}d6`, this.data, this.options);
      c._canExploit = false;
      c._isExploit = true;
      c._success = this._success;

      await c.evaluateSuccess();

      const rolls = c.dice.map(function(d) {
        const r = d.getTooltipData().rolls;
        return r;
      });

      this._pSuccess = nSuccess;
      nSuccess += c.totalSuccess;
      this._pRolls = rolls;
    }

    switch(operator) {
      case '+':
        this._totalSuccess += mod;
        break;
      case '-':
        this._totalSuccess -= mod;
        break;
    }

    if(this._difficulte != false && !this._isEFail) {
      if(result > this._difficulte) {
        this._isRollSuccess = true;
      } else {
        this._isRollFailed = true;
      }
    }

    this._totalSuccess += nSuccess;

    return this;
  }

  _evaluateTotal() {
    if(this._hasMin) {
      const terms = this.terms[0].results;

      for(let i = 0;i < terms.length;i++) {
        const roll = +terms[i].result;

        if(roll <= this._seuil) {
          terms[i].result = this._min;
        }
      }
    }

    const expression = this.terms.map(t => t.total).join(" ");
    const total = Roll.safeEval(expression);

    if ( !Number.isNumeric(total) ) {
      throw new Error(game.i18n.format("DICE.ErrorNonNumeric", {formula: this.formula}));
    }
    return total;
  }

  getSix() {
    const terms = this.terms[0].results;
    let result = 0;

    for(let i = 0;i < terms.length;i++) {
      const roll = +terms[i].result;

      if(roll === 6) { result += 1; }
    }

    return result;
  }

  toJSON() {
    return {
      class: this.constructor.name,
      options: this.options,
      dice: this._dice,
      formula: this._formula,
      terms: this.terms,
      isExploit: this._isExploit,
      isEFail: this._isEFail,
      base: this._base,
      autre: this._autre,
      success:this._success,
      table:this._table,
      tableau:this._tableau,
      pSuccess:this._pSuccess,
      pRolls:this._pRolls,
      total: this._total,
      totalSuccess: this._totalSuccess,
      difficulte: this._difficulte,
      isRollSuccess: this._isRollSuccess,
      isRollFailed: this._isRollFailed,
      details: this._details,
      flavor: this._flavor,
      style: this._style,
      evaluated: this._evaluated,
      pairOrImpair:this._pairOrImpair,
      hasMin:this._hasMin,
      seuil:this._seuil,
      min:this._min,
    }
  }

  static fromJSON(json) {
    const data = JSON.parse(json);
    const cls = CONFIG.Dice.rolls.find(cls => cls.name === data.class);
    if ( !cls ) throw new Error(`Unable to recreate ${data.class} instance from provided data`);
    return cls.fromData(data);
  }

  get totalSuccess() {
    return this._totalSuccess;
  }
}
