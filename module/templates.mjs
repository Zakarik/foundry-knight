/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const PreloadTemplates = async function() {

  const path = `systems/knight/templates`;

  // Define template paths to load
  const templatePaths = [
    `${path}/items/armures/capacites/personnalise.html`,
    `${path}/items/armures/capacites/ascension.html`,
    `${path}/items/armures/capacites/borealis.html`,
    `${path}/items/armures/capacites/shrine.html`,
    `${path}/items/armures/capacites/cea.html`,
    `${path}/items/armures/capacites/changeling.html`,
    `${path}/items/armures/capacites/companions.html`,
    `${path}/items/armures/capacites/discord.html`,
    `${path}/items/armures/capacites/falcon.html`,
    `${path}/items/armures/capacites/forward.html`,
    `${path}/items/armures/capacites/record.html`,
    `${path}/items/armures/capacites/rewind.html`,
    `${path}/items/armures/capacites/goliath.html`,
    `${path}/items/armures/capacites/ghost.html`,
    `${path}/items/armures/capacites/illumination.html`,
    `${path}/items/armures/capacites/longbow.html`,
    `${path}/items/armures/capacites/mechanic.html`,
    `${path}/items/armures/capacites/morph.html`,
    `${path}/items/armures/capacites/nanoc.html`,
    `${path}/items/armures/capacites/oriflamme.html`,
    `${path}/items/armures/capacites/puppet.html`,
    `${path}/items/armures/capacites/rage.html`,
    `${path}/items/armures/capacites/sarcophage.html`,
    `${path}/items/armures/capacites/totem.html`,
    `${path}/items/armures/capacites/type.html`,
    `${path}/items/armures/capacites/vision.html`,
    `${path}/items/armures/capacites/warlord.html`,
    `${path}/items/armures/capacites/watchtower.html`,
    `${path}/items/armures/capacites/windtalker.html`,
    `${path}/items/armures/capacites/zen.html`,
    `${path}/items/armures/special/personnalise.html`,
    `${path}/items/armures/special/apeiron.html`,
    `${path}/items/armures/special/contrecoups.html`,
    `${path}/items/armures/special/impregnation.html`,
    `${path}/items/armures/special/lenteetlourde.html`,
    `${path}/items/armures/special/plusespoir.html`,
    `${path}/items/armures/special/porteurlumiere.html`,
    `${path}/items/armures/special/recolteflux.html`,
    `${path}/items/armures/evolutions/borealis.html`,
    `${path}/items/armures/evolutions/oriflamme.html`,
    `${path}/items/armures/evolutions/changeling.html`,
    `${path}/items/armures/evolutions/goliath.html`,
    `${path}/items/armures/evolutions/falcon.html`,
    `${path}/items/armures/evolutions/ghost.html`,
    `${path}/items/armures/evolutions/longbow.html`,
    `${path}/items/armures/evolutions/mechanic.html`,
    `${path}/items/armures/evolutions/nanoc.html`,
    `${path}/items/armures/evolutions/shrine.html`,
    `${path}/items/armures/evolutions/type.html`,
    `${path}/items/armures/evolutions/vision.html`,
    `${path}/items/armures/evolutions/warlord.html`,
    `${path}/items/armures/evolutions/watchtower.html`,
    `${path}/items/armures/evolutions/cea.html`,
    `${path}/items/armures/evolutions/discord.html`,
    `${path}/items/armures/evolutions/puppet.html`,
    `${path}/items/armures/evolutions/windtalker.html`,
    `${path}/items/armures/evolutions/zen.html`,
    `${path}/items/armures/evolutions/morph.html`,
    `${path}/items/armures/evolutions/companions.html`,
    `${path}/items/armures/evolutions/ascension.html`,
    `${path}/items/armures/evolutions/forward.html`,
    `${path}/items/armures/evolutions/record.html`,
    `${path}/items/armures/evolutions/rewind.html`,
    `${path}/items/armures/evolutions/totem.html`,
    `${path}/items/armures/evolutions/illumination.html`,
    `${path}/items/armures/evolutions/rage.html`,
    `${path}/items/armures/evolutions/lenteetlourde.html`,
    `${path}/items/armures/evolutions/plusespoir.html`,
    `${path}/items/armures/evolutions/porteurlumiere.html`,
    `${path}/items/armures/evolutions/impregnation.html`,
    `${path}/items/armures/evolutions/contrecoups.html`,
    `${path}/items/armures/evolutions/apeiron.html`,
    `${path}/items/armures/evolutions/recolteflux.html`,
    `${path}/actors/capacites/ascension.html`,
    `${path}/actors/capacites/sarcophage.html`,
    `${path}/actors/capacites/shrine.html`,
    `${path}/actors/capacites/personnalise.html`,
    `${path}/actors/capacites/borealis.html`,
    `${path}/actors/capacites/changeling.html`,
    `${path}/actors/capacites/companions.html`,
    `${path}/actors/capacites/cea.html`,
    `${path}/actors/capacites/discord.html`,
    `${path}/actors/capacites/falcon.html`,
    `${path}/actors/capacites/forward.html`,
    `${path}/actors/capacites/ghost.html`,
    `${path}/actors/capacites/goliath.html`,
    `${path}/actors/capacites/illumination.html`,
    `${path}/actors/capacites/longbow.html`,
    `${path}/actors/capacites/mechanic.html`,
    `${path}/actors/capacites/morph.html`,
    `${path}/actors/capacites/oriflamme.html`,
    `${path}/actors/capacites/puppet.html`,
    `${path}/actors/capacites/rage.html`,
    `${path}/actors/capacites/record.html`,
    `${path}/actors/capacites/rewind.html`,
    `${path}/actors/capacites/totem.html`,
    `${path}/actors/capacites/warlord.html`,
    `${path}/actors/capacites/watchtower.html`,
    `${path}/actors/capacites/windtalker.html`,
    `${path}/actors/capacites/zen.html`,
    `${path}/actors/capacites/nanoc.html`,
    `${path}/actors/capacites/type.html`,
    `${path}/actors/capacites/vision.html`,
    `${path}/actors/special/apeiron.html`,
    `${path}/actors/special/contrecoups.html`,
    `${path}/actors/special/impregnation.html`,
    `${path}/actors/special/lenteetlourde.html`,
    `${path}/actors/special/personnalise.html`,
    `${path}/actors/special/plusespoir.html`,
    `${path}/actors/special/porteurlumiere.html`,
    `${path}/actors/special/recolteflux.html`,
    `${path}/actors/subtab/armes.html`,
    `${path}/actors/subtab/longbow.html`,
    `${path}/dialog/ask-sheet.html`,
    `${path}/items/armuresLegende/capacites/personnalise.html`,
    `${path}/items/armuresLegende/capacites/shrine.html`,
    `${path}/items/armuresLegende/capacites/changeling.html`,
    `${path}/items/armuresLegende/capacites/companions.html`,
    `${path}/items/armuresLegende/capacites/discord.html`,
    `${path}/items/armuresLegende/capacites/falcon.html`,
    `${path}/items/armuresLegende/capacites/record.html`,
    `${path}/items/armuresLegende/capacites/rewind.html`,
    `${path}/items/armuresLegende/capacites/goliath.html`,
    `${path}/items/armuresLegende/capacites/ghost.html`,
    `${path}/items/armuresLegende/capacites/mechanic.html`,
    `${path}/items/armuresLegende/capacites/nanoc.html`,
    `${path}/items/armuresLegende/capacites/oriflamme.html`,
    `${path}/items/armuresLegende/capacites/puppet.html`,
    `${path}/items/armuresLegende/capacites/totem.html`,
    `${path}/items/armuresLegende/capacites/type.html`,
    `${path}/items/armuresLegende/capacites/vision.html`,
    `${path}/items/armuresLegende/capacites/warlord.html`,
    `${path}/items/armuresLegende/capacites/windtalker.html`,
    `${path}/items/armuresLegende/special/recolteflux.html`,
    `${path}/actors/capacitesLegende/personnalise.html`,
    `${path}/actors/capacitesLegende/shrine.html`,
    `${path}/actors/capacitesLegende/changeling.html`,
    `${path}/actors/capacitesLegende/companions.html`,
    `${path}/actors/capacitesLegende/discord.html`,
    `${path}/actors/capacitesLegende/falcon.html`,
    `${path}/actors/capacitesLegende/record.html`,
    `${path}/actors/capacitesLegende/rewind.html`,
    `${path}/actors/capacitesLegende/goliath.html`,
    `${path}/actors/capacitesLegende/ghost.html`,
    `${path}/actors/capacitesLegende/mechanic.html`,
    `${path}/actors/capacitesLegende/nanoc.html`,
    `${path}/actors/capacitesLegende/oriflamme.html`,
    `${path}/actors/capacitesLegende/puppet.html`,
    `${path}/actors/capacitesLegende/totem.html`,
    `${path}/actors/capacitesLegende/type.html`,
    `${path}/actors/capacitesLegende/vision.html`,
    `${path}/actors/capacitesLegende/warlord.html`,
    `${path}/actors/capacitesLegende/windtalker.html`,
    `${path}/actors/specialLegende/recolteflux.html`,
    `${path}/actors/mechaarmure/volMarkIV.html`,
    `${path}/actors/mechaarmure/sautMarkIV.html`,
    `${path}/actors/mechaarmure/vagueSoin.html`,
    `${path}/actors/mechaarmure/canonMetatron.html`,
    `${path}/actors/mechaarmure/canonNoe.html`,
    `${path}/actors/mechaarmure/canonMagma.html`,
    `${path}/actors/mechaarmure/lamesCinetiquesGeantes.html`,
    `${path}/actors/mechaarmure/mitrailleusesSurtur.html`,
    `${path}/actors/mechaarmure/tourellesLasersAutomatisees.html`,
    `${path}/actors/mechaarmure/missilesJericho.html`,
    `${path}/actors/mechaarmure/souffleDemoniaque.html`,
    `${path}/actors/mechaarmure/poingsSoniques.html`,
    `${path}/actors/mechaarmure/chocSonique.html`,
    `${path}/actors/mechaarmure/bouclierAmrita.html`,
    `${path}/actors/mechaarmure/offering.html`,
    `${path}/actors/mechaarmure/curse.html`,
    `${path}/actors/mechaarmure/podMiracle.html`,
    `${path}/actors/mechaarmure/podInvulnerabilite.html`,
    `${path}/actors/mechaarmure/dronesEvacuation.html`,
    `${path}/actors/mechaarmure/dronesAirain.html`,
    `${path}/actors/mechaarmure/moduleEmblem.html`,
    `${path}/actors/mechaarmure/moduleInferno.html`,
    `${path}/actors/mechaarmure/moduleWraith.html`,
    `${path}/actors/mechaarmure/stationDefenseAutomatise.html`,
    `${path}/actors/mechaarmure/modeSiegeTower.html`,
    `${path}/actors/mechaarmure/nanoBrume.html`,
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};