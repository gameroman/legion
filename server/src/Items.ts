import { Item, Stat, Target } from "./Item";

export const items:Item[] = [];

items[0] = new Item(0, "Potion", "Restores 50 HP", "potion.png", 2, Target.SELF, [{stat: Stat.HP, value: 50}]);

