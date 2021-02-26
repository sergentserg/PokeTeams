import { POKE_API_URL } from 'src/shared/util/constants';
import fetchLoad from '../../shared/util/fetchLoad';

class ItemState {
  constructor() {
    this.item = [];
  }

  async init() {
    let res = await fetchLoad(`${POKE_API_URL}/item-attribute/holdable-active`);
    let data = await res.json();
    this.items = data.items;

    res = await fetchLoad(`${POKE_API_URL}/item-attribute/holdable`);
    data = await res.json();
    this.items.concat(data.items);
  }

  getItems() {
    return this.items;
  }

  async getItem(name) {
    const res = await fetchLoad(`${POKE_API_URL}/item/${name}`);
    const item = await res.json();
    return item;
  }
}

export const itemState = new ItemState();
