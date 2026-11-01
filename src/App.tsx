import { useState } from 'react';
import Backup from './Backup';
import { CATEGORIES, MENU, rsd, type Category, type Product } from './menu';
import { dayKey, isNew, isOpen, orderTotal, useOrders, type Item, type Order } from './orders';

type Tab = 'menu' | 'orders';

const time = (t: number) =>
  new Date(t).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });

export default function App() {
  const o = useOrders();
  const [tab, setTab] = useState<Tab>('menu');
  const today = dayKey(Date.now());
  const open = o.orders.filter((x) => x.day === today && isOpen(x));

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          ama coffee <span>· orders</span>
        </div>
        <nav className="tabs">
          <button className={tab === 'menu' ? 'on' : ''} onClick={() => setTab('menu')}>
            Menu
          </button>
          <button className={tab === 'orders' ? 'on' : ''} onClick={() => setTab('orders')}>
            Orders{open.length > 0 && <span className="badge">{open.length} open</span>}
          </button>
          <Backup orders={o.orders} deleted={o.deleted} onDone={o.clearDeleted} />
        </nav>
      </header>

      {tab === 'menu' ? (
        <main className="menu-screen">
          <Menu order={o.current} onAdd={o.add} />
          <CurrentOrder
            order={o.current}
            waiting={open}
            onOpen={o.open}
            onDelivered={(d) => o.current && o.setDelivered(o.current.id, d)}
            onRemoveItem={(uid) => o.current && o.removeItem(o.current.id, uid)}
            onToggle={(uid, opt) => o.current && o.toggleOption(o.current.id, uid, opt)}
            onPaid={(paid) => o.current && o.setPaid(o.current.id, paid)}
            onClose={o.close}
            onDelete={() => o.current && o.remove(o.current.id)}
          />
        </main>
      ) : (
        <OrdersList
          orders={o.orders}
          currentId={o.current?.id ?? null}
          onPaid={o.setPaid}
          onDelivered={o.setDelivered}
          onOpen={(id) => {
            o.open(id);
            setTab('menu');
          }}
        />
      )}
    </div>
  );
}

function Menu({ order, onAdd }: { order: Order | null; onAdd: (p: Product, opt?: Partial<Item>) => void }) {
  const inOrder = (id: string) => order?.items.filter((i) => i.productId === id).length ?? 0;
  const renderCat = (id: Category) => {
    const c = CATEGORIES.find((x) => x.id === id)!;
    return (
      <div key={c.id} className={`cat cat-${c.id}`}>
        <h2>{c.label}</h2>
        <div className="grid">
          {MENU.filter((p) => p.cat === c.id).map((p) => {
            const n = inOrder(p.id);
            const split =
              p.ice !== undefined
                ? ([['🧊 Ice', { ice: true }], ['No ice', { ice: false }]] as const)
                : p.chilli !== undefined
                  ? ([['🌶 Chilli', { chilli: true }], ['No chilli', { chilli: false }]] as const)
                  : null;
            return (
              <div key={p.id} className={`product ${n > 0 ? 'in' : ''}`}>
                <button className="product-main" onClick={() => onAdd(p)}>
                  <span className="name">{p.name}</span>
                  <span className="sub">{p.sub}</span>
                  <span className="price">
                    {rsd(p.price)}
                    {n > 0 && <span className="count">×{n}</span>}
                  </span>
                </button>
                {split && (
                  <div className="halves">
                    {split.map(([label, opt]) => (
                      <button key={label} onClick={() => onAdd(p, opt)}>
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <section className="menu">
      {renderCat('coffee')}
      {renderCat('food')}
      <div className="row">
        {renderCat('beans')}
        {renderCat('drinks')}
      </div>
    </section>
  );
}

type Group = { key: string; name: string; price: number; ice?: boolean; chilli?: boolean; fresh: boolean; uids: string[] };

// Same product with the same options shows as one line, "2×".
function group(o: Order): Group[] {
  const groups = new Map<string, Group>();
  for (const i of o.items) {
    const fresh = isNew(o, i);
    const key = `${i.productId}|${i.ice}|${i.chilli}|${fresh}`;
    const g = groups.get(key) ?? { key, name: i.name, price: i.price, ice: i.ice, chilli: i.chilli, fresh, uids: [] };
    g.uids.push(i.uid);
    groups.set(key, g);
  }
  return [...groups.values()];
}

function CurrentOrder(props: {
  order: Order | null;
  waiting: Order[];
  onOpen: (id: string) => void;
  onRemoveItem: (uid: string) => void;
  onToggle: (uid: string, opt: 'ice' | 'chilli') => void;
  onPaid: (paid: boolean) => void;
  onDelivered: (delivered: boolean) => void;
  onClose: () => void;
  onDelete: () => void;
}) {
  const { order } = props;
  const waiting = props.waiting.filter((w) => w.id !== order?.id);
  return (
    <aside className="current">
      {waiting.length > 0 && (
        <div className="waiting">
          <span>Open</span>
          {waiting.map((w) => (
            <button key={w.id} className={w.paid ? 'paid' : 'unpaid'} onClick={() => props.onOpen(w.id)}>
              #{w.no} <small>{w.paid ? 'paid' : rsd(orderTotal(w))}</small>
              {!w.delivered && <i title="Preparing">●</i>}
            </button>
          ))}
        </div>
      )}

      {!order ? (
        <div className="empty">
          <p>No open order.</p>
          <p className="hint">Tap a product to start a new one.</p>
        </div>
      ) : (
        <>
          <div className="current-head">
            <h2>Order #{order.no}</h2>
            <span className="time">{time(order.createdAt)}</span>
          </div>
          <div className="statuses">
            <button className={`status ${order.paid ? 'paid' : 'unpaid'}`} onClick={() => props.onPaid(!order.paid)}>
              {order.paid ? 'Paid ✓' : 'Not paid'}
            </button>
            <button className={`status ${order.delivered ? 'delivered' : 'preparing'}`} onClick={() => props.onDelivered(!order.delivered)}>
              {order.delivered ? 'Delivered ✓' : 'Preparing'}
            </button>
          </div>

          <ul className="lines">
            {order.items.length === 0 && <li className="hint">Empty. Tap products to add them.</li>}
            {group(order).map((g) => {
              const last = g.uids[g.uids.length - 1];
              return (
                <li key={g.key}>
                  <div className="line-main">
                    <span className="qty">{g.uids.length > 1 ? `${g.uids.length}×` : ''}</span>
                    <span className="name">
                      {g.name}
                      {g.fresh && <span className="new">NEW</span>}
                    </span>
                    <span className="price">{rsd(g.price * g.uids.length)}</span>
                    <button className="remove" onClick={() => props.onRemoveItem(last)} aria-label="Remove one">
                      −
                    </button>
                  </div>
                  <div className="line-opts">
                    {g.ice !== undefined && (
                      <button className={`opt ${g.ice ? 'ice' : 'hot'}`} onClick={() => props.onToggle(last, 'ice')}>
                        {g.ice ? '🧊 Ice' : 'No ice'}
                      </button>
                    )}
                    {g.chilli !== undefined && (
                      <button className={`opt ${g.chilli ? 'chilli' : 'mild'}`} onClick={() => props.onToggle(last, 'chilli')}>
                        {g.chilli ? '🌶 Chilli' : 'No chilli'}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="total">
            <span>Total</span>
            <strong>{rsd(orderTotal(order))}</strong>
          </div>

          {order.paid ? (
            <div className="finish">
              <button className="finish-paid" onClick={props.onClose}>
                Next customer
              </button>
            </div>
          ) : (
            <div className="finish">
              <button
                className="finish-paid"
                onClick={() => {
                  props.onPaid(true);
                  props.onClose();
                }}
              >
                Paid ✓ · next
              </button>
              <button className="finish-later" onClick={props.onClose}>
                Pay later · next
              </button>
            </div>
          )}
          <button
            className="delete"
            onClick={() => {
              if (confirm(`Delete order #${order.no}?`)) props.onDelete();
            }}
          >
            Delete order
          </button>
        </>
      )}
    </aside>
  );
}

function OrdersList(props: {
  orders: Order[];
  currentId: string | null;
  onPaid: (id: string, paid: boolean) => void;
  onDelivered: (id: string, delivered: boolean) => void;
  onOpen: (id: string) => void;
}) {
  const days = [...new Set(props.orders.map((o) => o.day))].sort().reverse();
  const today = dayKey(Date.now());
  if (!days.includes(today)) days.unshift(today);
  const [day, setDay] = useState(today);
  const [onlyOpen, setOnlyOpen] = useState(true);

  const ofDay = props.orders.filter((o) => o.day === day && o.items.length > 0);
  // Open orders oldest first, as a prep queue; all orders newest first.
  const shown = onlyOpen
    ? ofDay.filter(isOpen).sort((a, b) => a.createdAt - b.createdAt)
    : [...ofDay].sort((a, b) => b.createdAt - a.createdAt);
  const sum = (list: Order[]) => list.reduce((s, o) => s + orderTotal(o), 0);
  const paidTotal = sum(ofDay.filter((o) => o.paid));
  const unpaidTotal = sum(ofDay.filter((o) => !o.paid));

  const sold = new Map<string, number>();
  ofDay.forEach((o) => o.items.forEach((i) => sold.set(i.name, (sold.get(i.name) ?? 0) + 1)));

  const i = days.indexOf(day);
  const label = day === today ? 'Today' : new Date(day + 'T12:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <main className="orders-screen">
      <div className="day-bar">
        <button disabled={i >= days.length - 1} onClick={() => setDay(days[i + 1])}>
          ‹
        </button>
        <h2>{label}</h2>
        <button disabled={i <= 0} onClick={() => setDay(days[i - 1])}>
          ›
        </button>
        <div className="filter">
          <button className={onlyOpen ? 'on' : ''} onClick={() => setOnlyOpen(true)}>
            Open
          </button>
          <button className={!onlyOpen ? 'on' : ''} onClick={() => setOnlyOpen(false)}>
            All
          </button>
        </div>
      </div>

      <div className="sums">
        <div>
          <span>Orders</span>
          <strong>{ofDay.length}</strong>
        </div>
        <div>
          <span>Paid</span>
          <strong className="paid">{rsd(paidTotal)}</strong>
        </div>
        <div>
          <span>Not paid</span>
          <strong className="unpaid">{rsd(unpaidTotal)}</strong>
        </div>
        <div>
          <span>Total</span>
          <strong>{rsd(paidTotal + unpaidTotal)}</strong>
        </div>
      </div>

      <div className="orders-body">
        <ul className="order-cards">
          {shown.length === 0 && <li className="hint">{onlyOpen ? 'Nothing open: all paid and delivered.' : 'No orders.'}</li>}
          {shown.map((o) => (
            <li key={o.id} className={`${o.paid ? 'is-paid' : 'is-unpaid'} ${o.id === props.currentId ? 'is-current' : ''}`}>
              <div className="card-head">
                <strong>#{o.no}</strong>
                <span className="time">{time(o.createdAt)}</span>
                <span className="card-total">{rsd(orderTotal(o))}</span>
              </div>
              <p className="card-items">{summarize(o.items.filter((i) => !isNew(o, i)))}</p>
              {o.items.some((i) => isNew(o, i)) && (
                <p className="card-items card-new">
                  <span className="new">NEW</span> {summarize(o.items.filter((i) => isNew(o, i)))}
                </p>
              )}
              <div className="card-actions">
                <button className={`status ${o.paid ? 'paid' : 'unpaid'}`} onClick={() => props.onPaid(o.id, !o.paid)}>
                  {o.paid ? 'Paid ✓' : 'Not paid'}
                </button>
                <button className={`status ${o.delivered ? 'delivered' : 'preparing'}`} onClick={() => props.onDelivered(o.id, !o.delivered)}>
                  {o.delivered ? 'Delivered ✓' : 'Preparing'}
                </button>
                {o.day === today && (
                  <button className="open" onClick={() => props.onOpen(o.id)}>
                    {o.id === props.currentId ? 'Open now' : o.paid ? 'Open' : 'Open / add'}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        <aside className="sold">
          <h3>Sold</h3>
          {sold.size === 0 && <p className="hint">Nothing yet.</p>}
          <ul>
            {MENU.filter((p) => sold.has(p.name)).map((p) => (
              <li key={p.id}>
                <span>{p.name}</span>
                <strong>{sold.get(p.name)}</strong>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}

// "2× Cà phê sữa (ice), Bánh mì heo quay (no chilli)"
function summarize(items: Item[]) {
  const counts = new Map<string, number>();
  for (const i of items) {
    const opts = [i.ice === undefined ? '' : i.ice ? 'ice' : 'no ice', i.chilli === undefined ? '' : i.chilli ? 'chilli' : 'no chilli'].filter(Boolean);
    const key = opts.length ? `${i.name} (${opts.join(', ')})` : i.name;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts].map(([k, n]) => (n > 1 ? `${n}× ${k}` : k)).join(', ');
}
