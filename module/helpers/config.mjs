export const KNIGHT = {};

/**
 * The set of Ability Scores used within the sytem.
 * @type {Object}
 */

 KNIGHT.LIST = {
    vehicules:['armure', 'energie', 'champDeForce'],
    bandes:['sante', 'bouclier'],
    creatures:['sante', 'armure', 'energie', 'bouclier'],
    mechaarmures:['resilience', 'vitesse', 'manoeuvrabilite', 'puissance', 'systemes', 'senseurs', 'champDeForce'],
    pnj:['sante', 'armure', 'energie', 'champDeForce', 'bouclier'],
    aspectsCaracteristiques:{
      "chair": "KNIGHT.ASPECTS.CHAIR.Label",
      "deplacement": "KNIGHT.ASPECTS.CHAIR.CARACTERISTIQUES.DEPLACEMENT.Label",
      "force": "KNIGHT.ASPECTS.CHAIR.CARACTERISTIQUES.FORCE.Label",
      "endurance": "KNIGHT.ASPECTS.CHAIR.CARACTERISTIQUES.ENDURANCE.Label",
      "bete": "KNIGHT.ASPECTS.BETE.Label",
      "hargne": "KNIGHT.ASPECTS.BETE.CARACTERISTIQUES.HARGNE.Label",
      "combat": "KNIGHT.ASPECTS.BETE.CARACTERISTIQUES.COMBAT.Label",
      "instinct": "KNIGHT.ASPECTS.BETE.CARACTERISTIQUES.INSTINCT.Label",
      "machine": "KNIGHT.ASPECTS.MACHINE.Label",
      "tir": "KNIGHT.ASPECTS.MACHINE.CARACTERISTIQUES.TIR.Label",
      "savoir": "KNIGHT.ASPECTS.MACHINE.CARACTERISTIQUES.SAVOIR.Label",
      "technique": "KNIGHT.ASPECTS.MACHINE.CARACTERISTIQUES.TECHNIQUE.Label",
      "dame": "KNIGHT.ASPECTS.DAME.Label",
      "aura": "KNIGHT.ASPECTS.DAME.CARACTERISTIQUES.AURA.Label",
      "parole": "KNIGHT.ASPECTS.DAME.CARACTERISTIQUES.PAROLE.Label",
      "sangFroid": "KNIGHT.ASPECTS.DAME.CARACTERISTIQUES.SANGFROID.Label",
      "masque": "KNIGHT.ASPECTS.MASQUE.Label",
      "discretion": "KNIGHT.ASPECTS.MASQUE.CARACTERISTIQUES.DISCRETION.Label",
      "dexterite": "KNIGHT.ASPECTS.MASQUE.CARACTERISTIQUES.DEXTERITE.Label",
      "perception": "KNIGHT.ASPECTS.MASQUE.CARACTERISTIQUES.PERCEPTION.Label",
    },
    aspects:['chair', 'bete', 'machine', 'dame', 'masque'],
    caracteristiques:{
      bete:['combat', 'hargne', 'instinct'],
      chair:['deplacement', 'force', 'endurance'],
      dame:['aura', 'parole', 'sangFroid'],
      machine:['tir', 'savoir', 'technique'],
      masque:['discretion', 'dexterite', 'perception'],
    },
    armesimprovisees:{
      ai1:{
        chair:[1, 2],
        force:1,
        liste:{
          1:{
            utilisation:3,
            degats:{
              dice:4,
            },
            violence:{
              dice:4,
            },
            effets:{
              raw:[],
              custom:[]
            },
          },
          2:{
            utilisation:1,
            degats:{
              dice:2,
            },
            violence:{
              dice:5,
            },
            effets:{
              raw:[],
              custom:[]
            },
          },
          3:{
            utilisation:2,
            degats:{
              dice:4,
            },
            violence:{
              dice:4,
            },
            effets:{
              raw:[],
              custom:[]
            },
          },
        }
      },
      ai2:{
        chair:[3, 4],
        force:2,
        liste:{
          1:{
            utilisation:3,
            degats:{
              dice:6,
            },
            violence:{
              dice:4,
            },
            effets:{
              raw:[],
              custom:[]
            },
          },
          2:{
            utilisation:1,
            degats:{
              dice:4,
            },
            violence:{
              dice:4,
            },
            effets:{
              raw:[],
              custom:[]
            },
          },
          3:{
            utilisation:2,
            degats:{
              dice:5,
            },
            violence:{
              dice:5,
            },
            effets:{
              raw:[],
              custom:[]
            },
          },
        }
      },
      ai3:{
        chair:[5, 6],
        force:3,
        liste:{
          1:{
            utilisation:3,
            degats:{
              dice:7,
            },
            violence:{
              dice:5,
            },
            effets:{
              raw:[],
              custom:[]
            },
          },
          2:{
            utilisation:1,
            degats:{
              dice:5,
            },
            violence:{
              dice:7,
            },
            effets:{
              raw:[],
              custom:[]
            },
          },
          3:{
            utilisation:2,
            degats:{
              dice:6,
            },
            violence:{
              dice:6,
            },
            effets:{
              raw:[],
              custom:[]
            },
          },
        },
      },
      ai4:{
        chair:[7, 8],
        force:4,
        liste:{
          1:{
            utilisation:1,
            degats:{
              dice:7,
            },
            violence:{
              dice:9,
            },
            effets:{
              raw:[],
              custom:[]
            },
          },
          2:{
            utilisation:2,
            degats:{
              dice:8,
            },
            violence:{
              dice:8,
            },
            effets:{
              raw:[],
              custom:[]
            },
          },
        },
      },
      ai5:{
        chair:[9, 10],
        force:5,
        liste:{
          1:{
            utilisation:1,
            degats:{
              dice:10,
            },
            violence:{
              dice:12,
            },
            effets:{
              raw:[],
              custom:[]
            },
          },
          2:{
            utilisation:2,
            degats:{
              dice:11,
            },
            violence:{
              dice:11,
            },
            effets:{
              raw:[],
              custom:[]
            },
          },
        },
      }
    },
    grenades:{
      antiblindage:{
        degats:{dice:3},
        violence:{dice:3},
        effets:{
          raw:['destructeur', 'dispersion 6', 'penetrant 6', 'percearmure 20'],
          custom:[],
        }
      },
      explosive:{
        degats:{dice:3},
        violence:{dice:3},
        effets:{
          raw:['antivehicule', 'choc 1', 'dispersion 3'],
          custom:[],
        }
      },
      flashbang:{
        degats:{dice:0},
        violence:{dice:0},
        effets:{
          raw:['aucundegatsviolence', 'barrage 2', 'choc 1', 'dispersion 6'],
          custom:[],
        }
      },
      iem:{
        degats:{dice:0},
        violence:{dice:0},
        effets:{
          raw:['aucundegatsviolence', 'dispersion 6', 'parasitage 2'],
          custom:[],
        }
      },
      shrapnel:{
        degats:{dice:3},
        violence:{dice:3},
        effets:{
          raw:['dispersion 6', 'meurtrier', 'ultraviolence'],
          custom:[],
        }
      },
    },
    hasMax:{
      armure:true,
      sante:true,
      energie:true,
      resilience:true,
      champDeForce:false,
      bouclier:false,
      vitesse:false,
      manoeuvrabilite:false,
      puissance:false,
      systemes:false,
      senseurs:false,
    },
    derived:{
      defense:'masque',
      reaction:'machine',
    },
    style:{
      'standard':"KNIGHT.COMBAT.STYLES.STANDARD.Label",
      'acouvert':"KNIGHT.COMBAT.STYLES.ACOUVERT.Label",
      'agressif':"KNIGHT.COMBAT.STYLES.AGRESSIF.Label",
      'akimbo':"KNIGHT.COMBAT.STYLES.AKIMBO.Label",
      'ambidextre':"KNIGHT.COMBAT.STYLES.AMBIDEXTRE.Label",
      'defensif':"KNIGHT.COMBAT.STYLES.DEFENSIF.Label",
      'pilonnage':"KNIGHT.COMBAT.STYLES.PILONNAGE.Label",
      'precis':"KNIGHT.COMBAT.STYLES.PRECIS.Label",
      'puissant':"KNIGHT.COMBAT.STYLES.PUISSANT.Label",
      'suppression':"KNIGHT.COMBAT.STYLES.SUPPRESSION.Label",
    },
    typecompanions:{
      labor:'KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.LABOR.Label',
      medic:'KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.MEDIC.Label',
      tech:'KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.TECH.Label',
      recon:'KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.RECON.Label',
      fighter:'KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.FIGHTER.Label',
    },
    options2mains:{
      '1main':'KNIGHT.ITEMS.ARME.DEUXMAINS.Unemain',
      '2main':'KNIGHT.ITEMS.ARME.DEUXMAINS.Deuxmains',
    },
    rarete:{
      standard:"KNIGHT.ITEMS.MODULE.RARETE.Standard",
      avance:"KNIGHT.ITEMS.MODULE.RARETE.Avance",
      rare:"KNIGHT.ITEMS.MODULE.RARETE.Rare",
      prestige:"KNIGHT.ITEMS.MODULE.RARETE.Prestige",
      espoir:"KNIGHT.ITEMS.MODULE.RARETE.Espoir",
    },
    typearmes:{
      contact:'KNIGHT.COMBAT.ARMES.CONTACT.Label',
      distance:'KNIGHT.COMBAT.ARMES.DISTANCE.Label'
    },
    typearmesmodules:{
      contact:'KNIGHT.ITEMS.MODULE.ARME.TYPE.Contact',
      distance:'KNIGHT.ITEMS.MODULE.ARME.TYPE.Distance',
      tourelle:'KNIGHT.ITEMS.MODULE.ARME.TYPE.Tourelle',
    },
    typebonus:{
      contact:'KNIGHT.BONUS.Contact',
      distance:'KNIGHT.BONUS.Distance'
    },
    porteerestreint:{
      courte:'KNIGHT.PORTEE.Courte',
      moyenne:'KNIGHT.PORTEE.Moyenne',
      longue:'KNIGHT.PORTEE.Longue',
      lointaine:'KNIGHT.PORTEE.Lointaine',
    },
    portee:{
      contact:'KNIGHT.PORTEE.Contact',
      courte:'KNIGHT.PORTEE.Courte',
      moyenne:'KNIGHT.PORTEE.Moyenne',
      longue:'KNIGHT.PORTEE.Longue',
      lointaine:'KNIGHT.PORTEE.Lointaine',
    },
    porteecomplet:{
      personnelle:'KNIGHT.PORTEE.Personnelle',
      contact:'KNIGHT.PORTEE.Contact',
      courte:'KNIGHT.PORTEE.Courte',
      moyenne:'KNIGHT.PORTEE.Moyenne',
      longue:'KNIGHT.PORTEE.Longue',
      lointaine:'KNIGHT.PORTEE.Lointaine',
    },
    typeavantage:{
      standard:'KNIGHT.AUTRE.Standard',
      ia:'KNIGHT.IA.Label'
    },
    typeeffet:{
      effets:'KNIGHT.EFFETS.Effet',
      distance:'KNIGHT.AMELIORATIONS.LABEL.DistanceLong',
      structurelles:'KNIGHT.AMELIORATIONS.LABEL.Structurelle',
      ornementales:'KNIGHT.AMELIORATIONS.LABEL.Ornementale',
    },
    activationsimple:{
      aucune:'KNIGHT.ACTIVATION.Aucune',
      deplacement:'KNIGHT.ACTIVATION.Deplacement',
      combat:'KNIGHT.ACTIVATION.Combat',
      tour:'KNIGHT.ACTIVATION.Tour',
    },
    activation:{
      aucune:'KNIGHT.ACTIVATION.Aucune',
      deplacement:'KNIGHT.ACTIVATION.Deplacement',
      combat:'KNIGHT.ACTIVATION.Combat',
      tourComplet:'KNIGHT.ACTIVATION.TourComplet',
    },
    activationcapacites:{
      aucune:'KNIGHT.ACTIVATION.Aucune',
      toutes:'KNIGHT.ACTIVATION.Toutes',
      deplacementcombat:'KNIGHT.ACTIVATION.DeplacementCombat',
      combat:'KNIGHT.ACTIVATION.Combat',
      deplacement:'KNIGHT.ACTIVATION.Deplacement',
      tour:'KNIGHT.ACTIVATION.Tour',
    },
    activation6sec:{
      aucune:'KNIGHT.ACTIVATION.Aucune',
      Tour6Sec:'KNIGHT.ACTIVATION.Tour6Sec',
      combat6Sec:'KNIGHT.ACTIVATION.Combat6Sec',
      deplacement6Sec:'KNIGHT.ACTIVATION.Deplacement6Sec',
    },
    activation6secsimple:{
      aucune:'KNIGHT.ACTIVATION.Aucune',
      toutes:'KNIGHT.ACTIVATION.Toutes',
      combat6Sec:'KNIGHT.ACTIVATION.Combat6Sec',
      deplacement6Sec:'KNIGHT.ACTIVATION.Deplacement6Sec',
    },
    activation3sec:{
      aucune:'KNIGHT.ACTIVATION.Aucune',
      tour6Sec:'KNIGHT.ACTIVATION.Tour6Sec',
      combat3Sec:'KNIGHT.ACTIVATION.Combat3Sec',
      deplacement3Sec:'KNIGHT.ACTIVATION.Deplacement3Sec',
    },
    typepnj:{
      pnj:'KNIGHT.TYPE.Pnj',
      bande:'KNIGHT.TYPE.Bande',
    },
    EFFETS:{
      attaque:[
        'artillerie',
        'barrage',
        'cadence',
        'chargeur',
        'choc',
        'defense',
        'demoralisant',
        'designation',
        'deuxmains',
        'dispersion',
        'enchaine',
        'esperance',
        'jumeleakimbo',
        'jumeleambidextrie',
        'leste',
        'lourd',
        'lumiere',
        'parasitage',
        'reaction',
        'soumission',
        'tirensecurite',
        'aucundegatsviolence',
        'arabesqueiridescentes',
        'armuregravee',
        'blasonchevalier',
        'boucliergrave',
        'chromeligneslumineuses',
        'codeknightgrave',
        'assassine',
        'connectee',
        'electrifiee',
        'indestructible',
        'jumelle',
        'lumineuse',
        'massive',
        'protectrice',
        'soeur',
        'canonlong',
        'chambredouble',
        'interfaceguidage',
        'jumelageakimbo',
        'jumelageambidextrie',
        'lunetteintelligente',
        'munitionsdrones',
        'munitionshypervelocite',
        'munitionsiem',
        'munitionssubsoniques',
        'pointeurlaser',
        'protectionarme',
        'revetementomega',
        'structurealpha',
        'systemerefroidissement',
      ],
      degats:[
        'affecteanatheme',
        'anatheme',
        'antianatheme',
        'antivehicule',
        'assassin',
        'assistanceattaque',
        'briserlaresilience',
        'degatscontinus',
        'destructeur',
        'dispersion',
        'enchaine',
        'ignorearmure',
        'ignorechampdeforce',
        'leste',
        'meurtrier',
        'obliteration',
        'orfevrerie',
        'percearmure',
        'penetrant',
        'silencieux',
        'tenebricide',
        'tirenrafale',
        'armeazurine',
        'armerougesang',
        'chenesculpte',
        'cranerieurgrave',
        'faucheusegravee',
        'fauconplumesluminescentes',
        'griffuresgravees',
        'masquebrisesculpte',
        'rouagescassesgraves',
        'agressive',
        'allegee',
        'assassine',
        'barbelee',
        'connectee',
        'massive',
        'sournoise',
        'surmesure',
        'chargeurballesgrappes',
        'chargeurmunitionsexplosives',
        'munitionshypervelocite',
        'munitionsiem',
        'munitionsnonletales',
        'munitionssubsoniques',
        'revetementomega',
        'excellence',
        'bourreau',
        'regularite',
        'sillonslignesfleches',
        'boostdegats',
      ],
      violence:[
        'affecteanatheme',
        'briserlaresilience',
        'assistanceattaque',
        'antianatheme',
        'percearmure',
        'fureur',
        'ultraviolence',
        'tenebricide',
        'devastation',
        'chargeurballesgrappes',
        'chargeurmunitionsexplosives',
        'munitionsiem',
        'munitionsnonletales',
        'connectee',
        'armeazurine',
        'armerougesang',
        'griffuresgravees',
        'masquebrisesculpte',
        'rouagescassesgraves',
        'fauconplumesluminescentes',
        'flammesstylisees',
        'boostviolence',
        'intimidanthum',
        'intimidantana',
      ],
    }
 }

 KNIGHT.listCaracteristiques = {
  "chair":['deplacement', 'force', 'endurance'],
  "bete":['hargne', 'combat', 'instinct'],
  "machine":['tir', 'savoir', 'technique'],
  "dame":['aura', 'parole', 'sangFroid'],
  "masque":['discretion', 'dexterite', 'perception']
 };

 KNIGHT.aspects = {
    "chair": "KNIGHT.ASPECTS.CHAIR.Label",
    "bete": "KNIGHT.ASPECTS.BETE.Label",
    "machine": "KNIGHT.ASPECTS.MACHINE.Label",
    "dame": "KNIGHT.ASPECTS.DAME.Label",
    "masque": "KNIGHT.ASPECTS.MASQUE.Label",
 };

 KNIGHT.mechaarmure = {
    'vitesse':'KNIGHT.VEHICULE.Vitesse',
    'manoeuvrabilite':'KNIGHT.VEHICULE.Manoeuvrabilite',
    'puissance':'KNIGHT.MECHAARMURE.Puissance',
    'systemes':'KNIGHT.MECHAARMURE.Systèmes',
    'senseurs':'KNIGHT.MECHAARMURE.Senseurs'
 }

 KNIGHT.caracteristiques = {
    "deplacement": "KNIGHT.ASPECTS.CHAIR.CARACTERISTIQUES.DEPLACEMENT.Label",
    "force": "KNIGHT.ASPECTS.CHAIR.CARACTERISTIQUES.FORCE.Label",
    "endurance": "KNIGHT.ASPECTS.CHAIR.CARACTERISTIQUES.ENDURANCE.Label",
    "hargne": "KNIGHT.ASPECTS.BETE.CARACTERISTIQUES.HARGNE.Label",
    "combat": "KNIGHT.ASPECTS.BETE.CARACTERISTIQUES.COMBAT.Label",
    "instinct": "KNIGHT.ASPECTS.BETE.CARACTERISTIQUES.INSTINCT.Label",
    "tir": "KNIGHT.ASPECTS.MACHINE.CARACTERISTIQUES.TIR.Label",
    "savoir": "KNIGHT.ASPECTS.MACHINE.CARACTERISTIQUES.SAVOIR.Label",
    "technique": "KNIGHT.ASPECTS.MACHINE.CARACTERISTIQUES.TECHNIQUE.Label",
    "aura": "KNIGHT.ASPECTS.DAME.CARACTERISTIQUES.AURA.Label",
    "parole": "KNIGHT.ASPECTS.DAME.CARACTERISTIQUES.PAROLE.Label",
    "sangFroid": "KNIGHT.ASPECTS.DAME.CARACTERISTIQUES.SANGFROID.Label",
    "discretion": "KNIGHT.ASPECTS.MASQUE.CARACTERISTIQUES.DISCRETION.Label",
    "dexterite": "KNIGHT.ASPECTS.MASQUE.CARACTERISTIQUES.DEXTERITE.Label",
    "perception": "KNIGHT.ASPECTS.MASQUE.CARACTERISTIQUES.PERCEPTION.Label",
 };

 KNIGHT.armesimprovisees = {
  "ai1":{
    "1":"KNIGHT.COMBAT.ARMESIMPROVISEES.AI1.1",
    "2":"KNIGHT.COMBAT.ARMESIMPROVISEES.AI1.2",
    "3":"KNIGHT.COMBAT.ARMESIMPROVISEES.AI1.3",
  },
  "ai2":{
    "1":"KNIGHT.COMBAT.ARMESIMPROVISEES.AI2.1",
    "2":"KNIGHT.COMBAT.ARMESIMPROVISEES.AI2.2",
    "3":"KNIGHT.COMBAT.ARMESIMPROVISEES.AI2.3",
  },
  "ai3":{
    "1":"KNIGHT.COMBAT.ARMESIMPROVISEES.AI3.1",
    "2":"KNIGHT.COMBAT.ARMESIMPROVISEES.AI3.2",
    "3":"KNIGHT.COMBAT.ARMESIMPROVISEES.AI3.3",
  },
  "ai4":{
    "1":"KNIGHT.COMBAT.ARMESIMPROVISEES.AI4.1",
    "2":"KNIGHT.COMBAT.ARMESIMPROVISEES.AI4.2",
  },
  "ai5":{
    "1":"KNIGHT.COMBAT.ARMESIMPROVISEES.AI5.1",
    "2":"KNIGHT.COMBAT.ARMESIMPROVISEES.AI5.2",
  }
 }

 KNIGHT.nods = {
   "soin": "KNIGHT.COMBAT.NODS.Soin",
   "armure": "KNIGHT.COMBAT.NODS.Armure",
   "energie": "KNIGHT.COMBAT.NODS.Energie",
 };

 KNIGHT.grenades = {
   "shrapnel": "KNIGHT.COMBAT.GRENADES.Shrapnel",
   "flashbang": "KNIGHT.COMBAT.GRENADES.Flashbang",
   "antiblindage": "KNIGHT.COMBAT.GRENADES.Antiblindage",
   "iem": "KNIGHT.COMBAT.GRENADES.Iem",
   "explosive": "KNIGHT.COMBAT.GRENADES.Explosive",
 };

 KNIGHT.effets = {
   "affecteanatheme": {
     "label":"KNIGHT.EFFETS.AFFECTEANATHEME.Label",
     "description":"KNIGHT.EFFETS.AFFECTEANATHEME.Description",
     "double":false
   },
   "anatheme": {
     "label":"KNIGHT.EFFETS.ANATHEME.Label",
     "description":"KNIGHT.EFFETS.ANATHEME.Description",
     "double":false
   },
   "antianatheme": {
     "label":"KNIGHT.EFFETS.ANTIANATHEME.Label",
     "description":"KNIGHT.EFFETS.ANTIANATHEME.Description",
     "double":false
   },
   "antivehicule": {
     "label":"KNIGHT.EFFETS.ANTIVEHICULE.Label",
     "description":"KNIGHT.EFFETS.ANTIVEHICULE.Description",
     "double":false
   },
   "artillerie": {
     "label":"KNIGHT.EFFETS.ARTILLERIE.Label",
     "description":"KNIGHT.EFFETS.ARTILLERIE.Description",
     "double":false
   },
   "assassin": {
     "label":"KNIGHT.EFFETS.ASSASSIN.Label",
     "description":"KNIGHT.EFFETS.ASSASSIN.Description",
     "double":true
   },
   "assistanceattaque": {
     "label":"KNIGHT.EFFETS.ASSISTANCEATTAQUE.Label",
     "description":"KNIGHT.EFFETS.ASSISTANCEATTAQUE.Description",
     "double":false
   },
   "aucundegatsviolence": {
     "label":"KNIGHT.EFFETS.AUCUNDEGATSVIOLENCE.Label",
     "description":"KNIGHT.EFFETS.AUCUNDEGATSVIOLENCE.Description",
     "double":false
   },
   "barrage": {
     "label":"KNIGHT.EFFETS.BARRAGE.Label",
     "description":"KNIGHT.EFFETS.BARRAGE.Description",
     "double":true
   },
   "bourreau": {
     "label":"KNIGHT.EFFETS.BOURREAU.Label",
     "description":"KNIGHT.EFFETS.BOURREAU.Description",
     "double":true,
     "max":3
   },
   "briserlaresilience": {
     "label":"KNIGHT.EFFETS.BRISERLARESILIENCE.Label",
     "description":"KNIGHT.EFFETS.BRISERLARESILIENCE.Description",
     "double":false
   },
   "cadence": {
     "label":"KNIGHT.EFFETS.CADENCE.Label",
     "description":"KNIGHT.EFFETS.CADENCE.Description",
     "double":true
   },
   "chargeur": {
     "label":"KNIGHT.EFFETS.CHARGEUR.Label",
     "description":"KNIGHT.EFFETS.CHARGEUR.Description",
     "double":true
   },
   "choc": {
     "label":"KNIGHT.EFFETS.CHOC.Label",
     "description":"KNIGHT.EFFETS.CHOC.Description",
     "double":true
   },
   "conviction": {
     "label":"KNIGHT.EFFETS.CONVICTION.Label",
     "description":"KNIGHT.EFFETS.CONVICTION.Description",
     "double":false
   },
   "defense": {
     "label":"KNIGHT.EFFETS.DEFENSE.Label",
     "description":"KNIGHT.EFFETS.DEFENSE.Description",
     "double":true
   },
   "degatscontinus": {
     "label":"KNIGHT.EFFETS.DEGATSCONTINUS.Label",
     "description":"KNIGHT.EFFETS.DEGATSCONTINUS.Description",
     "double":true
   },
   "demoralisant": {
     "label":"KNIGHT.EFFETS.DEMORALISANT.Label",
     "description":"KNIGHT.EFFETS.DEMORALISANT.Description",
     "double":false
   },
   "designation": {
     "label":"KNIGHT.EFFETS.DESIGNATION.Label",
     "description":"KNIGHT.EFFETS.DESIGNATION.Description",
     "double":false
   },
   "destructeur": {
     "label":"KNIGHT.EFFETS.DESTRUCTEUR.Label",
     "description":"KNIGHT.EFFETS.DESTRUCTEUR.Description",
     "double":false
   },
   "deuxmains": {
     "label":"KNIGHT.EFFETS.DEUXMAINS.Label",
     "description":"KNIGHT.EFFETS.DEUXMAINS.Description",
     "double":false
   },
   "devastation": {
     "label":"KNIGHT.EFFETS.DEVASTATION.Label",
     "description":"KNIGHT.EFFETS.DEVASTATION.Description",
     "double":true,
     "max":4
   },
   "dispersion": {
     "label":"KNIGHT.EFFETS.DISPERSION.Label",
     "description":"KNIGHT.EFFETS.DISPERSION.Description",
     "double":true
   },
   "enchaine": {
     "label":"KNIGHT.EFFETS.ENCHAINE.Label",
     "description":"KNIGHT.EFFETS.ENCHAINE.Description",
     "double":false
   },
   "esperance": {
     "label":"KNIGHT.EFFETS.ESPERANCE.Label",
     "description":"KNIGHT.EFFETS.ESPERANCE.Description",
     "double":false
   },
   "excellence": {
     "label":"KNIGHT.EFFETS.EXCELLENCE.Label",
     "description":"KNIGHT.EFFETS.EXCELLENCE.Description",
     "double":false
   },
   "fureur": {
     "label":"KNIGHT.EFFETS.FUREUR.Label",
     "description":"KNIGHT.EFFETS.FUREUR.Description",
     "double":false
   },
   "guidage": {
     "label":"KNIGHT.EFFETS.GUIDAGE.Label",
     "description":"KNIGHT.EFFETS.GUIDAGE.Description",
     "double":false
   },
   "ignorearmure": {
     "label":"KNIGHT.EFFETS.IGNOREARMURE.Label",
     "description":"KNIGHT.EFFETS.IGNOREARMURE.Description",
     "double":false
   },
   "ignorechampdeforce": {
     "label":"KNIGHT.EFFETS.IGNORECHAMPDEFORCE.Label",
     "description":"KNIGHT.EFFETS.IGNORECHAMPDEFORCE.Description",
     "double":false
   },
   "jumeleakimbo": {
     "label":"KNIGHT.EFFETS.JUMELEAKIMBO.Label",
     "description":"KNIGHT.EFFETS.JUMELEAKIMBO.Description",
     "double":false
   },
   "jumeleambidextrie": {
     "label":"KNIGHT.EFFETS.JUMELEAMBIDEXTRIE.Label",
     "description":"KNIGHT.EFFETS.JUMELEAMBIDEXTRIE.Description",
     "double":false
   },
   "leste": {
     "label":"KNIGHT.EFFETS.LESTE.Label",
     "description":"KNIGHT.EFFETS.LESTE.Description",
     "double":false
   },
   "lourd": {
     "label":"KNIGHT.EFFETS.LOURD.Label",
     "description":"KNIGHT.EFFETS.LOURD.Description",
     "double":false
   },
   "lumiere": {
     "label":"KNIGHT.EFFETS.LUMIERE.Label",
     "description":"KNIGHT.EFFETS.LUMIERE.Description",
     "double":true
   },
   "meurtrier": {
     "label":"KNIGHT.EFFETS.MEURTRIER.Label",
     "description":"KNIGHT.EFFETS.MEURTRIER.Description",
     "double":false
   },
   "obliteration": {
     "label":"KNIGHT.EFFETS.OBLITERATION.Label",
     "description":"KNIGHT.EFFETS.OBLITERATION.Description",
     "double":false
   },
   "orfevrerie": {
     "label":"KNIGHT.EFFETS.ORFEVRERIE.Label",
     "description":"KNIGHT.EFFETS.ORFEVRERIE.Description",
     "double":false
   },
   "parasitage": {
    "label":"KNIGHT.EFFETS.PARASITAGE.Label",
    "description":"KNIGHT.EFFETS.PARASITAGE.Description",
    "double":true
   },
   "penetrant": {
     "label":"KNIGHT.EFFETS.PENETRANT.Label",
     "description":"KNIGHT.EFFETS.PENETRANT.Description",
     "double":true
   },
   "percearmure": {
     "label":"KNIGHT.EFFETS.PERCEARMURE.Label",
     "description":"KNIGHT.EFFETS.PERCEARMURE.Description",
     "double":true
   },
   "precision": {
     "label":"KNIGHT.EFFETS.PRECISION.Label",
     "description":"KNIGHT.EFFETS.PRECISION.Description",
     "double":false
   },
   "reaction": {
     "label":"KNIGHT.EFFETS.REACTION.Label",
     "description":"KNIGHT.EFFETS.REACTION.Description",
     "double":true
   },
   "regularite": {
     "label":"KNIGHT.EFFETS.REGULARITE.Label",
     "description":"KNIGHT.EFFETS.REGULARITE.Description",
     "double":false
   },
   "silencieux": {
     "label":"KNIGHT.EFFETS.SILENCIEUX.Label",
     "description":"KNIGHT.EFFETS.SILENCIEUX.Description",
     "double":false
   },
   "soumission": {
     "label":"KNIGHT.EFFETS.SOUMISSION.Label",
     "description":"KNIGHT.EFFETS.SOUMISSION.Description",
     "double":false
   },
   "tenebricide": {
     "label":"KNIGHT.EFFETS.TENEBRICIDE.Label",
     "description":"KNIGHT.EFFETS.TENEBRICIDE.Description",
     "double":false
   },
   "tirenrafale": {
     "label":"KNIGHT.EFFETS.TIRENRAFALE.Label",
     "description":"KNIGHT.EFFETS.TIRENRAFALE.Description",
     "double":false
   },
   "tirensecurite": {
     "label":"KNIGHT.EFFETS.TIRENSECURITE.Label",
     "description":"KNIGHT.EFFETS.TIRENSECURITE.Description",
     "double":false
   },
   "ultraviolence": {
     "label":"KNIGHT.EFFETS.ULTRAVIOLENCE.Label",
     "description":"KNIGHT.EFFETS.ULTRAVIOLENCE.Description",
     "double":false
   }
 };

 KNIGHT.effetsfm4 = {
  "immobilisation": {
    "label":"KNIGHT.EFFETS.IMMOBILISATION.Label",
    "description":"KNIGHT.EFFETS.IMMOBILISATION.Description",
    "double":true
  },
  "boostdegats": {
    "label":"KNIGHT.EFFETS.BOOSTDEGATS.Label",
    "description":"KNIGHT.EFFETS.BOOSTDEGATS.Description",
    "double":true
  },
  "boostviolence": {
    "label":"KNIGHT.EFFETS.BOOSTVIOLENCE.Label",
    "description":"KNIGHT.EFFETS.BOOSTVIOLENCE.Description",
    "double":true
  },
  "intimidanthum": {
    "label":"KNIGHT.EFFETS.INTIMIDANTEHUMAINS.Label",
    "description":"KNIGHT.EFFETS.INTIMIDANTEHUMAINS.Description",
    "double":false
  },
  "intimidantana": {
    "label":"KNIGHT.EFFETS.INTIMIDANTEANATHEME.Label",
    "description":"KNIGHT.EFFETS.INTIMIDANTEANATHEME.Description",
    "double":false
  },
  "cdf": {
    "label":"KNIGHT.EFFETS.CDF.Label",
    "description":"KNIGHT.EFFETS.CDF.Description",
    "double":true
  },
  "retourflamme": {
    "label":"KNIGHT.EFFETS.RETOURFLAMME.Label",
    "description":"KNIGHT.EFFETS.RETOURFLAMME.Description",
    "double":false
  },
  "sansarmure": {
    "label":"KNIGHT.EFFETS.SANSARMURE.Label",
    "description":"KNIGHT.EFFETS.SANSARMURE.Description",
    "double":false
  }
 }

 KNIGHT.AMELIORATIONS = {
  distance:{
    "canonlong": {
      "label":"KNIGHT.AMELIORATIONS.CANONLONG.Label",
      "description":"KNIGHT.AMELIORATIONS.CANONLONG.Description",
      "double":false
    },
    "canonraccourci": {
      "label":"KNIGHT.AMELIORATIONS.CANONRACCOURCI.Label",
      "description":"KNIGHT.AMELIORATIONS.CANONRACCOURCI.Description",
      "double":false
    },
    "chambredouble": {
      "label":"KNIGHT.AMELIORATIONS.CHAMBREDOUBLE.Label",
      "description":"KNIGHT.AMELIORATIONS.CHAMBREDOUBLE.Description",
      "double":false
    },
    "chargeurballesgrappes": {
      "label":"KNIGHT.AMELIORATIONS.CHARGEURBALLESGRAPPES.Label",
      "description":"KNIGHT.AMELIORATIONS.CHARGEURBALLESGRAPPES.Description",
      "double":false
    },
    "chargeurmunitionsexplosives": {
      "label":"KNIGHT.AMELIORATIONS.CHARGEURMUNITIONSEXPLOSIVES.Label",
      "description":"KNIGHT.AMELIORATIONS.CHARGEURMUNITIONSEXPLOSIVES.Description",
      "double":false
    },
    "interfaceguidage": {
      "label":"KNIGHT.AMELIORATIONS.INTERFACEGUIDAGE.Label",
      "description":"KNIGHT.AMELIORATIONS.INTERFACEGUIDAGE.Description",
      "double":false
    },
    "jumelageakimbo": {
      "label":"KNIGHT.AMELIORATIONS.JUMELAGEAKIMBO.Label",
      "description":"KNIGHT.AMELIORATIONS.JUMELAGEAKIMBO.Description",
      "double":false,
      "text":true,
      "placeholder":"KNIGHT.ITEMS.ARME.Nom"
    },
    "jumelageambidextrie": {
      "label":"KNIGHT.AMELIORATIONS.JUMELAGEAMBIDEXTRIE.Label",
      "description":"KNIGHT.AMELIORATIONS.JUMELAGEAMBIDEXTRIE.Description",
      "double":false,
      "text":true,
      "placeholder":"KNIGHT.ITEMS.ARME.Nom"
    },
    "lunetteintelligente": {
      "label":"KNIGHT.AMELIORATIONS.LUNETTEINTELLIGENTE.Label",
      "description":"KNIGHT.AMELIORATIONS.LUNETTEINTELLIGENTE.Description",
      "double":false
    },
    "munitionsdrones": {
      "label":"KNIGHT.AMELIORATIONS.MUNITIONSDRONES.Label",
      "description":"KNIGHT.AMELIORATIONS.MUNITIONSDRONES.Description",
      "double":false
    },
    "munitionshypervelocite": {
      "label":"KNIGHT.AMELIORATIONS.MUNITIONSHYPERVELOCITE.Label",
      "description":"KNIGHT.AMELIORATIONS.MUNITIONSHYPERVELOCITE.Description",
      "double":false
    },
    "munitionsiem": {
      "label":"KNIGHT.AMELIORATIONS.MUNITIONSIEM.Label",
      "description":"KNIGHT.AMELIORATIONS.MUNITIONSIEM.Description",
      "double":false
    },
    "munitionsnonletales": {
      "label":"KNIGHT.AMELIORATIONS.MUNITIONSNONLETALES.Label",
      "description":"KNIGHT.AMELIORATIONS.MUNITIONSNONLETALES.Description",
      "double":false
    },
    "munitionssubsoniques": {
      "label":"KNIGHT.AMELIORATIONS.MUNITIONSSUBSONIQUES.Label",
      "description":"KNIGHT.AMELIORATIONS.MUNITIONSSUBSONIQUES.Description",
      "double":false
    },
    "pointeurlaser": {
      "label":"KNIGHT.AMELIORATIONS.POINTEURLASER.Label",
      "description":"KNIGHT.AMELIORATIONS.POINTEURLASER.Description",
      "double":false
    },
    "protectionarme": {
      "label":"KNIGHT.AMELIORATIONS.PROTECTIONARME.Label",
      "description":"KNIGHT.AMELIORATIONS.PROTECTIONARME.Description",
      "double":false
    },
    "revetementomega": {
      "label":"KNIGHT.AMELIORATIONS.REVETEMENTOMEGA.Label",
      "description":"KNIGHT.AMELIORATIONS.REVETEMENTOMEGA.Description",
      "double":false
    },
    "structurealpha": {
      "label":"KNIGHT.AMELIORATIONS.STRUCTUREALPHA.Label",
      "description":"KNIGHT.AMELIORATIONS.STRUCTUREALPHA.Description",
      "double":false
    },
    "systemerefroidissement": {
      "label":"KNIGHT.AMELIORATIONS.SYSTEMEREFROIDISSEMENT.Label",
      "description":"KNIGHT.AMELIORATIONS.SYSTEMEREFROIDISSEMENT.Description",
      "double":false
    },
  },
  ornementales:{
    "arabesqueiridescentes": {
      "label":"KNIGHT.AMELIORATIONS.ARABESQUESIRIDESCENTES.Label",
      "description":"KNIGHT.AMELIORATIONS.ARABESQUESIRIDESCENTES.Description",
      "double":false
    },
    "armeazurine": {
      "label":"KNIGHT.AMELIORATIONS.ARMEAZURINE.Label",
      "description":"KNIGHT.AMELIORATIONS.ARMEAZURINE.Description",
      "double":false
    },
    "armerougesang": {
      "label":"KNIGHT.AMELIORATIONS.ARMEROUGESANG.Label",
      "description":"KNIGHT.AMELIORATIONS.ARMEROUGESANG.Description",
      "double":false
    },
    "armuregravee": {
      "label":"KNIGHT.AMELIORATIONS.ARMUREGRAVEE.Label",
      "description":"KNIGHT.AMELIORATIONS.ARMUREGRAVEE.Description",
      "double":false
    },
    "blasonchevalier": {
      "label":"KNIGHT.AMELIORATIONS.BLASONCHEVALIER.Label",
      "description":"KNIGHT.AMELIORATIONS.BLASONCHEVALIER.Description",
      "double":false
    },
    "boucliergrave": {
      "label":"KNIGHT.AMELIORATIONS.BOUCLIERGRAVE.Label",
      "description":"KNIGHT.AMELIORATIONS.BOUCLIERGRAVE.Description",
      "double":false
    },
    "chenesculpte": {
      "label":"KNIGHT.AMELIORATIONS.CHENESCULPTE.Label",
      "description":"KNIGHT.AMELIORATIONS.CHENESCULPTE.Description",
      "double":false
    },
    "chromeligneslumineuses": {
      "label":"KNIGHT.AMELIORATIONS.CHROMELIGNESLUMINEUSES.Label",
      "description":"KNIGHT.AMELIORATIONS.CHROMELIGNESLUMINEUSES.Description",
      "double":false
    },
    "codeknightgrave": {
      "label":"KNIGHT.AMELIORATIONS.CODEKNIGHTGRAVE.Label",
      "description":"KNIGHT.AMELIORATIONS.CODEKNIGHTGRAVE.Description",
      "double":false
    },
    "cranerieurgrave": {
      "label":"KNIGHT.AMELIORATIONS.CRANERIEURGRAVE.Label",
      "description":"KNIGHT.AMELIORATIONS.CRANERIEURGRAVE.Description",
      "double":false
    },
    "faucheusegravee": {
      "label":"KNIGHT.AMELIORATIONS.FAUCHEUSEGRAVEE.Label",
      "description":"KNIGHT.AMELIORATIONS.FAUCHEUSEGRAVEE.Description",
      "double":false
    },
    "fauconplumesluminescentes": {
      "label":"KNIGHT.AMELIORATIONS.FAUCONPLUMESLUMINESCENTES.Label",
      "description":"KNIGHT.AMELIORATIONS.FAUCONPLUMESLUMINESCENTES.Description",
      "double":false
    },
    "flammesstylisees": {
      "label":"KNIGHT.AMELIORATIONS.FLAMMESSTYLISEES.Label",
      "description":"KNIGHT.AMELIORATIONS.FLAMMESSTYLISEES.Description",
      "double":false
    },
    "griffuresgravees": {
      "label":"KNIGHT.AMELIORATIONS.GRIFFURESGRAVEES.Label",
      "description":"KNIGHT.AMELIORATIONS.GRIFFURESGRAVEES.Description",
      "double":false
    },
    "masquebrisesculpte": {
      "label":"KNIGHT.AMELIORATIONS.MASQUEBRISESCULPTE.Label",
      "description":"KNIGHT.AMELIORATIONS.MASQUEBRISESCULPTE.Description",
      "double":false
    },
    "rouagescassesgraves": {
      "label":"KNIGHT.AMELIORATIONS.ROUAGESCASSESGRAVES.Label",
      "description":"KNIGHT.AMELIORATIONS.ROUAGESCASSESGRAVES.Description",
      "double":false
    },
    "sillonslignesfleches": {
      "label":"KNIGHT.AMELIORATIONS.SILLONSLIGNESFLECHES.Label",
      "description":"KNIGHT.AMELIORATIONS.SILLONSLIGNESFLECHES.Description",
      "double":false
    },
  },
  structurelles:{
    "agressive": {
      "label":"KNIGHT.AMELIORATIONS.AGRESSIVE.Label",
      "description":"KNIGHT.AMELIORATIONS.AGRESSIVE.Description",
      "double":false
    },
    "allegee": {
      "label":"KNIGHT.AMELIORATIONS.ALLEGEE.Label",
      "description":"KNIGHT.AMELIORATIONS.ALLEGEE.Description",
      "double":false
    },
    "assassine": {
      "label":"KNIGHT.AMELIORATIONS.ASSASSINE.Label",
      "description":"KNIGHT.AMELIORATIONS.ASSASSINE.Description",
      "double":false
    },
    "barbelee": {
      "label":"KNIGHT.AMELIORATIONS.BARBELEE.Label",
      "description":"KNIGHT.AMELIORATIONS.BARBELEE.Description",
      "double":false
    },
    "connectee": {
      "label":"KNIGHT.AMELIORATIONS.CONNECTEE.Label",
      "description":"KNIGHT.AMELIORATIONS.CONNECTEE.Description",
      "double":false
    },
    "electrifiee": {
      "label":"KNIGHT.AMELIORATIONS.ELECTRIFIEE.Label",
      "description":"KNIGHT.AMELIORATIONS.ELECTRIFIEE.Description",
      "double":false
    },
    "indestructible": {
      "label":"KNIGHT.AMELIORATIONS.INDESTRUCTIBLE.Label",
      "description":"KNIGHT.AMELIORATIONS.INDESTRUCTIBLE.Description",
      "double":false
    },
    "jumelle": {
      "label":"KNIGHT.AMELIORATIONS.JUMELLE.Label",
      "description":"KNIGHT.AMELIORATIONS.JUMELLE.Description",
      "double":false,
      "text":true,
      "placeholder":"KNIGHT.ITEMS.ARME.Nom"
    },
    "lumineuse": {
      "label":"KNIGHT.AMELIORATIONS.LUMINEUSE.Label",
      "description":"KNIGHT.AMELIORATIONS.LUMINEUSE.Description",
      "double":false
    },
    "massive": {
      "label":"KNIGHT.AMELIORATIONS.MASSIVE.Label",
      "description":"KNIGHT.AMELIORATIONS.MASSIVE.Description",
      "double":false
    },
    "protectrice": {
      "label":"KNIGHT.AMELIORATIONS.PROTECTRICE.Label",
      "description":"KNIGHT.AMELIORATIONS.PROTECTRICE.Description",
      "double":false
    },
    "soeur": {
      "label":"KNIGHT.AMELIORATIONS.SOEUR.Label",
      "description":"KNIGHT.AMELIORATIONS.SOEUR.Description",
      "double":false
    },
    "sournoise": {
      "label":"KNIGHT.AMELIORATIONS.SOURNOISE.Label",
      "description":"KNIGHT.AMELIORATIONS.SOURNOISE.Description",
      "double":false
    },
    "surmesure": {
      "label":"KNIGHT.AMELIORATIONS.SURMESURE.Label",
      "description":"KNIGHT.AMELIORATIONS.SURMESURE.Description",
      "double":false
    },
  }
 }

KNIGHT.styles = {
  "standard": "KNIGHT.COMBAT.STYLES.STANDARD.Info",
  "acouvert": "KNIGHT.COMBAT.STYLES.ACOUVERT.Info",
  "agressif": "KNIGHT.COMBAT.STYLES.AGRESSIF.Info",
  "akimbo": "KNIGHT.COMBAT.STYLES.AKIMBO.Info",
  "ambidextre": "KNIGHT.COMBAT.STYLES.AMBIDEXTRE.Info",
  "defensif": "KNIGHT.COMBAT.STYLES.DEFENSIF.Info",
  "pilonnage": "KNIGHT.COMBAT.STYLES.PILONNAGE.Info",
  "precis": "KNIGHT.COMBAT.STYLES.PRECIS.Info",
  "puissant": "KNIGHT.COMBAT.STYLES.PUISSANT.Info",
  "suppression": "KNIGHT.COMBAT.STYLES.SUPPRESSION.Info",
};

 KNIGHT.blessures = {
  "chair": "KNIGHT.ITEMS.BLESSURETRAUMA.CHAIR.Label",
  "bete": "KNIGHT.ITEMS.BLESSURETRAUMA.BETE.Label",
  "machine": "KNIGHT.ITEMS.BLESSURETRAUMA.MACHINE.Label",
  "dame": "KNIGHT.ITEMS.BLESSURETRAUMA.DAME.Label",
  "masque": "KNIGHT.ITEMS.BLESSURETRAUMA.MASQUE.Label",
  "deplacement": "KNIGHT.ITEMS.BLESSURETRAUMA.CHAIR.CARACTERISTIQUES.Deplacement",
  "force": "KNIGHT.ITEMS.BLESSURETRAUMA.CHAIR.CARACTERISTIQUES.Force",
  "endurance": "KNIGHT.ITEMS.BLESSURETRAUMA.CHAIR.CARACTERISTIQUES.Endurance",
  "hargne": "KNIGHT.ITEMS.BLESSURETRAUMA.BETE.CARACTERISTIQUES.Hargne",
  "combat": "KNIGHT.ITEMS.BLESSURETRAUMA.BETE.CARACTERISTIQUES.Combat",
  "instinct": "KNIGHT.ITEMS.BLESSURETRAUMA.BETE.CARACTERISTIQUES.Instinct",
  "tir": "KNIGHT.ITEMS.BLESSURETRAUMA.MACHINE.CARACTERISTIQUES.Tir",
  "savoir": "KNIGHT.ITEMS.BLESSURETRAUMA.MACHINE.CARACTERISTIQUES.Savoir",
  "technique": "KNIGHT.ITEMS.BLESSURETRAUMA.MACHINE.CARACTERISTIQUES.Technique",
  "aura": "KNIGHT.ITEMS.BLESSURETRAUMA.DAME.CARACTERISTIQUES.Aura",
  "parole": "KNIGHT.ITEMS.BLESSURETRAUMA.DAME.CARACTERISTIQUES.Parole",
  "sangFroid": "KNIGHT.ITEMS.BLESSURETRAUMA.DAME.CARACTERISTIQUES.SangFroid",
  "discretion": "KNIGHT.ITEMS.BLESSURETRAUMA.MASQUE.CARACTERISTIQUES.Discretion",
  "dexterite": "KNIGHT.ITEMS.BLESSURETRAUMA.MASQUE.CARACTERISTIQUES.Dexterite",
  "perception": "KNIGHT.ITEMS.BLESSURETRAUMA.MASQUE.CARACTERISTIQUES.Perception",
};

KNIGHT.evolutions = {
  "aAcheter":"KNIGHT.ITEMS.ARMURE.EVOLUTIONS.AAcheter",
  "noAAcheter":"KNIGHT.ITEMS.ARMURE.EVOLUTIONS.NoAAcheter",
  "supprime":"KNIGHT.AUTRE.Supprime",
  "noSupprime":"KNIGHT.AUTRE.NoSupprime"
}

KNIGHT.capacites = {
  "ascension": "KNIGHT.ITEMS.ARMURE.CAPACITES.ASCENSION.Label",
  "borealis": "KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.Label",
  "cea": "KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.Label",
  "changeling": "KNIGHT.ITEMS.ARMURE.CAPACITES.CHANGELING.Label",
  "companions": "KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.Label",
  "discord": "KNIGHT.ITEMS.ARMURE.CAPACITES.DISCORD.Label",
  "falcon": "KNIGHT.ITEMS.ARMURE.CAPACITES.FALCON.Label",
  "ghost": "KNIGHT.ITEMS.ARMURE.CAPACITES.GHOST.Label",
  "goliath": "KNIGHT.ITEMS.ARMURE.CAPACITES.GOLIATH.Label",
  "forward": "KNIGHT.ITEMS.ARMURE.CAPACITES.FORWARD.Label",
  "illumination": "KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.Label",
  "longbow": "KNIGHT.ITEMS.ARMURE.CAPACITES.LONGBOW.Label",
  "mechanic": "KNIGHT.ITEMS.ARMURE.CAPACITES.MECHANIC.Label",
  "morph": "KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.Label",
  "nanoc": "KNIGHT.ITEMS.ARMURE.CAPACITES.NANOC.Label",
  "oriflamme": "KNIGHT.ITEMS.ARMURE.CAPACITES.ORIFLAMME.Label",
  "puppet": "KNIGHT.ITEMS.ARMURE.CAPACITES.PUPPET.Label",
  "rage": "KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.Label",
  "record": "KNIGHT.ITEMS.ARMURE.CAPACITES.RECORD.Label",
  "rewind": "KNIGHT.ITEMS.ARMURE.CAPACITES.REWIND.Label",
  "sarcophage": "KNIGHT.ITEMS.ARMURE.CAPACITES.SARCOPHAGE.Label",
  "shrine": "KNIGHT.ITEMS.ARMURE.CAPACITES.SHRINE.Label",
  "totem": "KNIGHT.ITEMS.ARMURE.CAPACITES.TOTEM.Label",
  "type": "KNIGHT.ITEMS.ARMURE.CAPACITES.TYPE.Label",
  "vision": "KNIGHT.ITEMS.ARMURE.CAPACITES.VISION.Label",
  "warlord": "KNIGHT.ITEMS.ARMURE.CAPACITES.WARLORD.Label",
  "watchtower": "KNIGHT.ITEMS.ARMURE.CAPACITES.WATCHTOWER.Label",
  "windtalker": "KNIGHT.ITEMS.ARMURE.CAPACITES.WINDTALKER.Label",
  "zen": "KNIGHT.ITEMS.ARMURE.CAPACITES.ZEN.Label",
  "personnalise": "KNIGHT.ITEMS.ARMURE.CAPACITES.PERSONNALISE.Label",
};

KNIGHT.special = {
  "apeiron": "KNIGHT.ITEMS.ARMURE.SPECIAL.APEIRON.Label",
  "contrecoups":"KNIGHT.ITEMS.ARMURE.SPECIAL.CONTRECOUPS.Label",
  "impregnation":"KNIGHT.ITEMS.ARMURE.SPECIAL.IMPREGNATION.Label",
  "lenteetlourde": "KNIGHT.ITEMS.ARMURE.SPECIAL.LENTEETLOURDE.Label",
  "plusespoir": "KNIGHT.ITEMS.ARMURE.SPECIAL.PLUSESPOIR.Label",
  "porteurlumiere": "KNIGHT.ITEMS.ARMURE.SPECIAL.PORTEURLUMIERE.Label",
  "recolteflux": "KNIGHT.ITEMS.ARMURE.SPECIAL.RECOLTEFLUX.Label",
  "energiedeficiente": "KNIGHT.ITEMS.ARMURE.SPECIAL.ENERGIEDEFICIENTE.Label",
  "personnalise": "KNIGHT.ITEMS.ARMURE.SPECIAL.PERSONNALISE.Label"
};

KNIGHT.ascension = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.ASCENSION.Description",
  "duree":"KNIGHT.DUREE.ConflitSceneProlonger",
  "sansArmure":"KNIGHT.ITEMS.ARMURE.CAPACITES.ASCENSION.SansArmure",
  "noSansArmure":"KNIGHT.ITEMS.ARMURE.CAPACITES.ASCENSION.NoSansArmure"
}

KNIGHT.apeiron = {
  "description":"KNIGHT.ITEMS.ARMURE.SPECIAL.APEIRON.Description"
}

KNIGHT.borealis = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.Description",
  "support":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.SUPPORT.Description",
    "duree":"KNIGHT.DUREE.ConflitScene"
  },
  "offensif":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.OFFENSIF.Description",
    "duree":"KNIGHT.DUREE.Instantanee"
  },
  "utilitaire":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.UTILITAIRE.Description",
    "duree":"KNIGHT.DUREE.Minute"
  }
};

KNIGHT.cea = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.CHANGELING.Description",
  "duree":"KNIGHT.DUREE.Instantanee",
  "vague":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.VAGUE.Description"
  },
  "salve":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.SALVE.Description"
  },
  "rayon":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.RAYON.Description"
  },
};

KNIGHT.changeling = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.CHANGELING.Description",
  "duree":"KNIGHT.DUREE.Scene",
  "portee":"KNIGHT.ITEMS.ARMURE.CAPACITES.CHANGELING.Portee",
  "noDesactivation":"KNIGHT.ITEMS.ARMURE.CAPACITES.CHANGELING.NoDesactivationExplosive",
  "desactivation":"KNIGHT.ITEMS.ARMURE.CAPACITES.CHANGELING.DesactivationExplosive"
};

KNIGHT.companions = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.Description",
  "coups":"KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.Coups",
  "duree":"KNIGHT.DUREE.ConflitScene",
  "vol":"KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.CROW.Vol",
  "labor":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.LABOR.Description"
  },
  "medic":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.MEDIC.Description"
  },
  "tech":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.TECH.Description"
  },
  "fighter":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.FIGHTER.Description"
  },
  "recon":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.RECON.Description"
  }
};

KNIGHT.contrecoups = {
  "description":"KNIGHT.ITEMS.ARMURE.SPECIAL.CONTRECOUPS.Description",
  "relance":"KNIGHT.ITEMS.ARMURE.SPECIAL.CONTRECOUPS.Relance",
  "norelance":"KNIGHT.ITEMS.ARMURE.SPECIAL.CONTRECOUPS.NoRelance",
  "maxeffets":"KNIGHT.ITEMS.ARMURE.SPECIAL.CONTRECOUPS.MaxEffets",
  "nomaxeffets":"KNIGHT.ITEMS.ARMURE.SPECIAL.CONTRECOUPS.NoMaxEffets",
  "armedistance":"KNIGHT.ITEMS.ARMURE.SPECIAL.CONTRECOUPS.ArmeDistance",
  "noarmedistance":"KNIGHT.ITEMS.ARMURE.SPECIAL.CONTRECOUPS.NoArmeDistance",
  "dechirure":"KNIGHT.ITEMS.ARMURE.SPECIAL.CONTRECOUPS.TABLEAU.Dechirure",
  "disparition":"KNIGHT.ITEMS.ARMURE.SPECIAL.CONTRECOUPS.TABLEAU.Disparition",
  "incident":"KNIGHT.ITEMS.ARMURE.SPECIAL.CONTRECOUPS.TABLEAU.Incident",
  "siphon":"KNIGHT.ITEMS.ARMURE.SPECIAL.CONTRECOUPS.TABLEAU.Siphon",
  "sursaut":"KNIGHT.ITEMS.ARMURE.SPECIAL.CONTRECOUPS.TABLEAU.Sursaut",
  "fragmentation":"KNIGHT.ITEMS.ARMURE.SPECIAL.CONTRECOUPS.TABLEAU.Fragmentation",
  "desorientation":"KNIGHT.ITEMS.ARMURE.SPECIAL.CONTRECOUPS.TABLEAU.Desorientation",
  "desagregation":"KNIGHT.ITEMS.ARMURE.SPECIAL.CONTRECOUPS.TABLEAU.Desagregation",
  "defaillance":"KNIGHT.ITEMS.ARMURE.SPECIAL.CONTRECOUPS.TABLEAU.Defaillance",
};

KNIGHT.longbow = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.LONGBOW.Description",
  "effets3":"KNIGHT.ITEMS.ARMURE.CAPACITES.LONGBOW.EFFETS.AccesL3",
  "noeffets3":"KNIGHT.ITEMS.ARMURE.CAPACITES.LONGBOW.EFFETS.NoAccesL3",
};

KNIGHT.falcon = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.FALCON.Description",
  "duree":"KNIGHT.DUREE.Instantanee",
  "informations":"KNIGHT.ITEMS.ARMURE.CAPACITES.FALCON.INFORMATIONS.Details",
};

KNIGHT.forward = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.FORWARD.Description",
  "duree":"KNIGHT.DUREE.Tour6Seconde"
};

KNIGHT.ghost = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.GHOST.Description",
  "duree":"KNIGHT.DUREE.TourMinute",
  "interruption":"KNIGHT.ITEMS.ARMURE.CAPACITES.GHOST.Interruption",
  "nointerruption":"KNIGHT.ITEMS.ARMURE.CAPACITES.GHOST.NoInterruption",
  "odinclus":"KNIGHT.INCLUS.Od",
  "diceinclus":"KNIGHT.INCLUS.Dice",
  "fixeinclus":"KNIGHT.INCLUS.Fixe",
  "odnoinclus":"KNIGHT.NOINCLUS.Od",
  "dicenoinclus":"KNIGHT.NOINCLUS.Dice",
  "fixenoinclus":"KNIGHT.NOINCLUS.Fixe",
};

KNIGHT.goliath = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.GOLIATH.Description",
  "duree":"KNIGHT.DUREE.Minute",
  "armesrack":"KNIGHT.ITEMS.ARMURE.CAPACITES.GOLIATH.ArmesRack",
  "armesnorack":"KNIGHT.ITEMS.ARMURE.CAPACITES.GOLIATH.ArmesNoRack",
  "metrebonus":"KNIGHT.ITEMS.ARMURE.CAPACITES.GOLIATH.MetreBonus",
};

KNIGHT.illumination = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.Description",
  "duree":"KNIGHT.DUREE.Tour6Seconde",
  "blaze":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.BLAZE.Description"
  },
  "candle":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.CANDLE.Description"
  },
  "beacon":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.BEACON.Description"
  },
  "torch":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.TORCH.Description"
  },
  "projector":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.PROJECTOR.Description"
  },
  "lighthouse":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.LIGHTHOUSE.Description"
  },
  "lantern":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.LANTERN.Description"
  },
};

KNIGHT.impregnation = {
  "description":"KNIGHT.ITEMS.ARMURE.SPECIAL.IMPREGNATION.Description",
};

KNIGHT.lenteetlourde = {
  "description":"KNIGHT.ITEMS.ARMURE.SPECIAL.LENTEETLOURDE.Description",
};

KNIGHT.mechanic = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.MECHANIC.Description",
  "duree":"KNIGHT.DUREE.Instantanee",
  "portee":"KNIGHT.PORTEE.Longue",
};

KNIGHT.morph = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.Description",
  "duree":"KNIGHT.DUREE.ConflitScene",
  "vol":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.VOL.Description"
  },
  "phase":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.PHASE.Description",
    "duree":"KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.PHASE.Duree"
  },
  "etirement":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.ETIREMENT.Description",
    "portee":"KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.ETIREMENT.Portee"
  },
  "polymorphie":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Description"
  },
};

KNIGHT.nanoc = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.NANOC.Description",
  "duree":"KNIGHT.DUREE.Minute10",
};

KNIGHT.oriflamme = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.ORIFLAMME.Description",
  "duree":"KNIGHT.DUREE.Instantanee"
};

KNIGHT.personnalise = {
  "description":""
};

KNIGHT.rage = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.Description",
  "duree":"KNIGHT.DUREE.ConflitTuer",
  "comboBonus":"KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.COMBOS.Bonus",
  "comboNoBonus":"KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.COMBOS.NoBonus",
  "comboInterdits":"KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.COMBOS.Interdits",
  "comboNoInterdits":"KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.COMBOS.NoInterdits",
  "blaze":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.BLAZE.Description"
  },
  "nourri":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.NOURRI.Description",
  },
  "rage":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.RAGE.Description",
  },
  "fureur":{
    "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.FUREUR.Description",
  }
};

KNIGHT.record = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.RECORD.Description",
  "duree":"KNIGHT.DUREE.Instantanee"
};

KNIGHT.rewind = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.REWIND.Description",
  "duree":"KNIGHT.DUREE.Instantanee"
};

KNIGHT.sarcophage = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.SARCOPHAGE.Description",
  "b0":"KNIGHT.ITEMS.ARMURE.CAPACITES.SARCOPHAGE.LISTE.b0",
  "b1":"KNIGHT.ITEMS.ARMURE.CAPACITES.SARCOPHAGE.LISTE.b1",
  "b2":"KNIGHT.ITEMS.ARMURE.CAPACITES.SARCOPHAGE.LISTE.b2",
  "b3":"KNIGHT.ITEMS.ARMURE.CAPACITES.SARCOPHAGE.LISTE.b3",
  "b4":"KNIGHT.ITEMS.ARMURE.CAPACITES.SARCOPHAGE.LISTE.b4",
  "b5":"KNIGHT.ITEMS.ARMURE.CAPACITES.SARCOPHAGE.LISTE.b5",
  "b6":"KNIGHT.ITEMS.ARMURE.CAPACITES.SARCOPHAGE.LISTE.b6"
};

KNIGHT.plusespoir = {
  "description":"KNIGHT.ITEMS.ARMURE.SPECIAL.PLUSESPOIR.Description",
  "recuperation":"KNIGHT.ITEMS.ARMURE.SPECIAL.PLUSESPOIR.ESPOIR.Recuperation",
  "nonrecuperation":"KNIGHT.ITEMS.ARMURE.SPECIAL.PLUSESPOIR.ESPOIR.NonRecuperation",
  "perte":"KNIGHT.ITEMS.ARMURE.SPECIAL.PLUSESPOIR.ESPOIR.Perte",
  "nonperte":"KNIGHT.ITEMS.ARMURE.SPECIAL.PLUSESPOIR.ESPOIR.NonPerte",
};

KNIGHT.porteurlumiere = {
  "description":"KNIGHT.ITEMS.ARMURE.SPECIAL.PORTEURLUMIERE.Description",
}

KNIGHT.energiedeficiente = {
  "description":"KNIGHT.ITEMS.ARMURE.SPECIAL.ENERGIEDEFICIENTE.Description",
}

KNIGHT.recolteflux = {
  "description":"KNIGHT.ITEMS.ARMURE.SPECIAL.RECOLTEFLUX.Description",
}

KNIGHT.puppet = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.PUPPET.Description",
  "duree":"KNIGHT.DUREE.TourSeconde"
};

KNIGHT.discord = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.DISCORD.Description",
  "tour":{
    "duree":"KNIGHT.ITEMS.ARMURE.CAPACITES.DISCORD.Tour"
  },
  "scene":{
    "duree":"KNIGHT.ITEMS.ARMURE.CAPACITES.DISCORD.Scene"
  }
};

KNIGHT.shrine = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.SHRINE.Description",
  "duree":"KNIGHT.DUREE.Tour",
  "portee":{
    "personnelle": "KNIGHT.PORTEE.Personnelle",
    "moyenne": "KNIGHT.PORTEE.Moyenne"
  },
};

KNIGHT.totem = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.TOTEM.Description",
  "duree":"KNIGHT.DUREE.Tour6Seconde",
}

KNIGHT.type = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.TYPE.Description",
  "duree":"KNIGHT.DUREE.TourScene",
  "soldier":"KNIGHT.ITEMS.ARMURE.CAPACITES.TYPE.TYPE.Soldier",
  "hunter":"KNIGHT.ITEMS.ARMURE.CAPACITES.TYPE.TYPE.Hunter",
  "scholar":"KNIGHT.ITEMS.ARMURE.CAPACITES.TYPE.TYPE.Scholar",
  "herald":"KNIGHT.ITEMS.ARMURE.CAPACITES.TYPE.TYPE.Herald",
  "scout":"KNIGHT.ITEMS.ARMURE.CAPACITES.TYPE.TYPE.Scout",
};

KNIGHT.vision = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.VISION.Description",
  "duree":"KNIGHT.DUREE.Seconde"
};

KNIGHT.warlord = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.WARLORD.Description",
  "impulsions":{
    "action":{
      "bonus":"KNIGHT.ITEMS.ARMURE.CAPACITES.WARLORD.IMPULSIONS.ACTION.Bonus",
      "duree":"KNIGHT.DUREE.Tour"
    },
    "esquive":{
      "duree":"KNIGHT.DUREE.TourProlonge"
    },
    "force":{
      "duree":"KNIGHT.DUREE.TourProlonge"
    },
    "guerre":{
      "duree":"KNIGHT.DUREE.TourProlonge"
    },
    "energie":{
      "bonus":"KNIGHT.ITEMS.ARMURE.CAPACITES.WARLORD.IMPULSIONS.ENERGIE.Bonus",
      "duree":"KNIGHT.DUREE.Instantanee"
    },
  },
};

KNIGHT.watchtower = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.WATCHTOWER.Description",
  "duree":"KNIGHT.DUREE.Desactivation"
};

KNIGHT.windtalker = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.WINDTALKER.Description",
  "duree":"KNIGHT.DUREE.Instantanee"
};

KNIGHT.zen = {
  "description":"KNIGHT.ITEMS.ARMURE.CAPACITES.ZEN.Description"
};

KNIGHT.module = {
  "categorie":{
    "normal":{
      "amelioration":"KNIGHT.ITEMS.MODULE.CATEGORIE.Amelioration",
      "contact":"KNIGHT.ITEMS.MODULE.CATEGORIE.Contact",
      "automatise":"KNIGHT.ITEMS.MODULE.CATEGORIE.Automatise",
      "distance":"KNIGHT.ITEMS.MODULE.CATEGORIE.Distance",
      "defense":"KNIGHT.ITEMS.MODULE.CATEGORIE.Defense",
      "deplacement":"KNIGHT.ITEMS.MODULE.CATEGORIE.Deplacement",
      "tactique":"KNIGHT.ITEMS.MODULE.CATEGORIE.Tactique",
      "utilitaire":"KNIGHT.ITEMS.MODULE.CATEGORIE.Utilitaire",
      "visée":"KNIGHT.ITEMS.MODULE.CATEGORIE.Visée",
    },
    "prestige":{
      "aigle":"KNIGHT.ITEMS.MODULE.CATEGORIE.PrestigeAigle",
      "cerf":"KNIGHT.ITEMS.MODULE.CATEGORIE.PrestigeCerf",
      "cheval":"KNIGHT.ITEMS.MODULE.CATEGORIE.PrestigeCheval",
      "dragon":"KNIGHT.ITEMS.MODULE.CATEGORIE.PrestigeDragon",
      "corbeau":"KNIGHT.ITEMS.MODULE.CATEGORIE.PrestigeCorbeau",
      "lion":"KNIGHT.ITEMS.MODULE.CATEGORIE.PrestigeLion",
      "loup":"KNIGHT.ITEMS.MODULE.CATEGORIE.PrestigeLoup",
      "ours":"KNIGHT.ITEMS.MODULE.CATEGORIE.PrestigeOurs",
      "faucon":"KNIGHT.ITEMS.MODULE.CATEGORIE.PrestigeFaucon",
      "sanglier":"KNIGHT.ITEMS.MODULE.CATEGORIE.PrestigeSanglier",
      "serpent":"KNIGHT.ITEMS.MODULE.CATEGORIE.PrestigeSerpent",
      "taureau":"KNIGHT.ITEMS.MODULE.CATEGORIE.PrestigeTaureau"
    }
  },
  "rarete":{
    "standard":"KNIGHT.ITEMS.MODULE.RARETE.Standard",
    "avance":"KNIGHT.ITEMS.MODULE.RARETE.Avance",
    "rare":"KNIGHT.ITEMS.MODULE.RARETE.Rare",
    "prestige":"KNIGHT.ITEMS.MODULE.RARETE.Prestige",
    "espoir":"KNIGHT.ITEMS.MODULE.RARETE.Espoir",
  }
};