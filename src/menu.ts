// The menu. Prices are in RSD and are placeholders: change them here.
// `ice` / `chilli` / `cilantro` give the product that option, with its default value.

export type Category = 'food' | 'coffee' | 'beans' | 'drinks';

export type Product = {
  id: string;
  name: string;
  sub: string;
  price: number;
  cat: Category;
  ice?: boolean;
  chilli?: boolean;
  cilantro?: boolean;
};

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'coffee', label: 'Vietnamese coffee' },
  { id: 'food', label: 'Food' },
  { id: 'beans', label: 'Beans 0.5 kg' },
  { id: 'drinks', label: 'Drinks' },
];

export const MENU: Product[] = [
  { id: 'cf-sua', cat: 'coffee', name: 'Cà phê sữa', sub: 'Coffee, condensed milk', price: 320, ice: true },
  { id: 'cf-muoi', cat: 'coffee', name: 'Cà phê muối', sub: 'Salted coffee', price: 390, ice: true },
  { id: 'cf-dua', cat: 'coffee', name: 'Cà phê dừa', sub: 'Coconut coffee', price: 420, ice: true },
  { id: 'cf-trung', cat: 'coffee', name: 'Cà phê trứng', sub: 'Egg coffee', price: 420, ice: false },
  { id: 'bac-xiu', cat: 'coffee', name: 'Bạc xỉu', sub: 'Milk with a little coffee', price: 340, ice: true },
  { id: 'bac-xiu-muoi', cat: 'coffee', name: 'Bạc xỉu kem muối', sub: 'Salted cream', price: 390, ice: true },

  { id: 'bm-heo-quay', cat: 'food', name: 'Bánh mì heo quay', sub: 'Roast pork baguette', price: 690, chilli: true, cilantro: true },
  { id: 'bm-opla', cat: 'food', name: 'Bánh mì ốp la', sub: 'Fried egg baguette', price: 550, chilli: true, cilantro: true },
  { id: 'cha-gio', cat: 'food', name: 'Chả giò', sub: 'Fried spring rolls', price: 490, chilli: true },
  { id: 'bun-thit-nuong', cat: 'food', name: 'Bún thịt nướng', sub: 'Noodles, grilled pork', price: 890, chilli: true },
  { id: 'com-tam', cat: 'food', name: 'Cơm tấm', sub: 'Broken rice, pork', price: 890, chilli: true },
  { id: 'pho-ga', cat: 'food', name: 'Phở gà', sub: 'Chicken noodle soup', price: 790, chilli: true },

  { id: 'beans-dray-sap', cat: 'beans', name: 'Dray Sap', sub: '70% Robusta', price: 1800 },
  { id: 'beans-serepok', cat: 'beans', name: 'Serepok', sub: '100% Robusta', price: 2200 },
  { id: 'beans-yokdon', cat: 'beans', name: 'YokDon', sub: '100% Robusta', price: 2200 },

  { id: 'coca-cola', cat: 'drinks', name: 'Coca-Cola', sub: '0.33 l', price: 250 },
  { id: 'coca-cola-zero', cat: 'drinks', name: 'Coca-Cola Zero', sub: '0.33 l', price: 250 },
  { id: 'fruit-juice', cat: 'drinks', name: 'Fruit juice', sub: '100% fruit', price: 280 },
  { id: 'tra-xanh', cat: 'drinks', name: 'Trà xanh', sub: 'Green tea', price: 250, ice: true },
];

const rsdFormat = new Intl.NumberFormat('sr-RS', { maximumFractionDigits: 0 });
export const rsd = (n: number) => `${rsdFormat.format(n)} RSD`;
