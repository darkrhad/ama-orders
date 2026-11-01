import { useEffect, useState } from 'react';
import type { Product } from './menu';

// One line per unit, so each coffee or bánh mì keeps its own option.
// Name and price are copied in, so changing the menu doesn't rewrite history.
export type Item = {
  uid: string;
  productId: string;
  name: string;
  price: number;
  ice?: boolean;
  chilli?: boolean;
  addedAt?: number;
};

export type Order = {
  id: string;
  no: number; // per day, from 1
  day: string; // YYYY-MM-DD, local
  createdAt: number;
  items: Item[];
  paid: boolean;
  payment?: Payment;
  delivered?: boolean;
  deliveredAt?: number; // last time it was marked delivered
};

// Still needs something: payment or delivery.
export const isOpen = (o: Order) => o.items.length > 0 && !(o.paid && o.delivered);

export type Payment = 'cash' | 'card';

// Added after the order was delivered (a table asking for more): still to make.
export const isNew = (o: Order, i: Item) =>
  !o.delivered && o.deliveredAt !== undefined && (i.addedAt ?? 0) > o.deliveredAt;

type State = { orders: Order[]; currentId: string | null };

const KEY = 'ama-orders-v1';

export const dayKey = (t: number) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const orderTotal = (o: Order) => o.items.reduce((s, i) => s + i.price, 0);

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through to an empty book
  }
  return { orders: [], currentId: null };
}

export function useOrders() {
  const [state, setState] = useState<State>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // storage full or blocked: keep working in memory
    }
  }, [state]);

  // An open order from an earlier day is closed, so the first tap of the day starts #1.
  const current =
    state.orders.find((o) => o.id === state.currentId && o.day === dayKey(Date.now())) ?? null;

  const updateOrder = (id: string, fn: (o: Order) => Order) =>
    setState((s) => ({ ...s, orders: s.orders.map((o) => (o.id === id ? fn(o) : o)) }));

  const add = (p: Product, opt: Partial<Item> = {}) => {
    const item: Item = { uid: uid(), productId: p.id, name: p.name, price: p.price, ice: p.ice, chilli: p.chilli, addedAt: Date.now(), ...opt };
    setState((s) => {
      const today = dayKey(Date.now());
      // A paid order is never added to: the extras would hide as paid. Start a new one instead.
      const open = s.orders.find((o) => o.id === s.currentId && o.day === today && !o.paid);
      if (open) {
        // More items for a delivered order go back to the kitchen.
        const next = { ...open, items: [...open.items, item], delivered: false };
        return { ...s, orders: s.orders.map((o) => (o.id === open.id ? next : o)) };
      }
      const no = Math.max(0, ...s.orders.filter((o) => o.day === today).map((o) => o.no)) + 1;
      const order: Order = { id: uid(), no, day: today, createdAt: Date.now(), items: [item], paid: false };
      return { orders: [...s.orders, order], currentId: order.id };
    });
  };

  return {
    orders: state.orders,
    current,
    add,
    removeItem: (orderId: string, itemUid: string) =>
      updateOrder(orderId, (o) => ({ ...o, items: o.items.filter((i) => i.uid !== itemUid) })),
    toggleOption: (orderId: string, itemUid: string, opt: 'ice' | 'chilli') =>
      updateOrder(orderId, (o) => ({
        ...o,
        items: o.items.map((i) => (i.uid === itemUid ? { ...i, [opt]: !i[opt] } : i)),
      })),
    // null = not paid yet
    setPaid: (orderId: string, payment: Payment | null) =>
      updateOrder(orderId, (o) => ({ ...o, paid: payment !== null, payment: payment ?? undefined })),
    setDelivered: (orderId: string, delivered: boolean) =>
      updateOrder(orderId, (o) => (delivered ? { ...o, delivered, deliveredAt: Date.now() } : { ...o, delivered })),
    open: (orderId: string) => setState((s) => ({ ...s, currentId: orderId })),
    close: () => setState((s) => ({ ...s, currentId: null })),
    remove: (orderId: string) =>
      setState((s) => ({
        orders: s.orders.filter((o) => o.id !== orderId),
        currentId: s.currentId === orderId ? null : s.currentId,
      })),
  };
}
