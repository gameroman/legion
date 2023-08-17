import { Item, Stat, Target } from "./Item";

export const items:Item[] = [];

items[0] = new Item(0, "Potion", "Restores 50 HP", "potion.png", "potion_heal", 2, Target.SELF, [{stat: Stat.HP, value: 50}]);
items[1] = new Item(0, "Ether", "Restores 10 MP", "ether.png", "potion_heal", 3, Target.SELF, [{stat: Stat.MP, value: 10}]);

