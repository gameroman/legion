import { Item, Stat } from "./Item";

export const items:Item[] = [];

items[0] = new Item(0, "Potion", "Restores 50 HP", "potion.png", [{stat: Stat.HP, value: 50}]);

