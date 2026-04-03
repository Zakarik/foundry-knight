
export default function prepareArmorLegend(item, ctx, collections) {
    foundry.utils.mergeObject(collections.armureLegendeData, item);
    collections.armureLegendeData.label = item.name;
    collections.armureLegendeData.id = item.id;
    collections.armureLegendeData._id = item.id;
}