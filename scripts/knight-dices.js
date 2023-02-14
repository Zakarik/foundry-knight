Hooks.on('diceSoNiceReady', (dice3d) => {
    dice3d.addSystem({id:"original",name:"☑ Knight Origine"},true);
    dice3d.addDicePreset({
      type:"d6",
      labels:[
        'systems/knight/ui/dices/d6s/d6_1.webp',
        'systems/knight/ui/dices/d6s/d6_2.webp',
        'systems/knight/ui/dices/d6s/d6_3.webp',
        'systems/knight/ui/dices/d6s/d6_4.webp',
        'systems/knight/ui/dices/d6s/d6_5.webp',
        'systems/knight/ui/dices/d6s/d6_6.webp'
      ],
    system:"original"
    });    

    dice3d.addSystem({id:"kaltg",name:"☑ Knight Alternative"},false);
    dice3d.addDicePreset({
      type:"d6",
      labels:[
        'systems/knight/ui/dices/d6at/d6_1.webp',
        'systems/knight/ui/dices/d6at/d6_2.webp',
        'systems/knight/ui/dices/d6at/d6_3.webp',
        'systems/knight/ui/dices/d6at/d6_4.webp',
        'systems/knight/ui/dices/d6at/d6_5.webp',
        'systems/knight/ui/dices/d6at/d6_6.webp'
      ],
    system:"kaltg"
    }); 

    dice3d.addSystem({id:"kaltn",name:"☑ Knight Negative"},false);
    dice3d.addDicePreset({
      type:"d6",
      labels:[
        'systems/knight/ui/dices/d6an/d6_1.webp',
        'systems/knight/ui/dices/d6an/d6_2.webp',
        'systems/knight/ui/dices/d6an/d6_3.webp',
        'systems/knight/ui/dices/d6an/d6_4.webp',
        'systems/knight/ui/dices/d6an/d6_5.webp',
        'systems/knight/ui/dices/d6an/d6_6.webp'
      ],
    system:"kaltn"
    }); 

    dice3d.addSystem({id:"kaltb",name:"☑ Knight Success Only"},false);
    dice3d.addDicePreset({
      type:"d6",
      labels:[
        'systems/knight/ui/dices/d6ab/d6_1.webp',
        'systems/knight/ui/dices/d6ab/d6_2.webp',
        'systems/knight/ui/dices/d6ab/d6_3.webp',
        'systems/knight/ui/dices/d6ab/d6_4.webp',
        'systems/knight/ui/dices/d6ab/d6_5.webp',
        'systems/knight/ui/dices/d6ab/d6_6.webp'
      ],
    system:"kaltb"
    }); 

    dice3d.addColorset({
      name: 'original',
      description: "☑ Knight Origine",
      category: "Knight Dice",
      texture:'none',
      material: "glass",
      foreground:'#ffffff',
      background:'#000000',
      outline:'#000000',
      edge:'#000000'
   },"preferred");

   dice3d.addColorset({
    name: 'kaltg',
    description: "☑ Knight Ghostery",
    category: "Knight Dice",
    texture:'none',
    material: "glass",
    foreground:'#d2420075',
    background:'#00000075',
    outline:'#00000075',
    edge:'#00000075'
 },"false");

  dice3d.addColorset({
    name: 'kaltb',
    description: "☑ Knight Negative",
    category: "Knight Dice",
    texture:'none',
    material: "glass",
    foreground:'#d24200',
    background:'#ffffff',
    outline:'#ffffff',
    edge:'#ffffff'
  },"false");

  dice3d.addColorset({
    name: 'kaltn',
    description: "☑ Knight Negative Ghostery",
    category: "Knight Dice",
    texture:'none',
    material: "glass",
    foreground:'#d24200',
    background:'#ffffff25',
    outline:'#ffffff25',
    edge:'#ffffff25'
  },"false");  

});
  