/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Leaf,
  Minus,
  Plus,
  Search,
  ShoppingBasket,
  Truck,
  X,
} from "lucide-react";
import { cardIn, overlayIn, staggerGrid } from "@/components/motion/presets";

type Cat = "frutas" | "verduras" | "organicos";
type Tipo = "kg" | "un";

type Prod = {
  id: string;
  nome: string;
  cat: Cat;
  img: string;
  preco: number;
  tipo: Tipo;
  un?: string; // rótulo da unidade quando tipo === "un"
};

const PRODUTOS: Prod[] = [
  { id: "banana", nome: "Banana Prata", cat: "frutas", img: "banana", preco: 5.49, tipo: "kg" },
  { id: "maca", nome: "Maçã Gala", cat: "frutas", img: "maca", preco: 8.9, tipo: "kg" },
  { id: "morango", nome: "Morango", cat: "frutas", img: "morango", preco: 7.9, tipo: "un", un: "bandeja" },
  { id: "laranja", nome: "Laranja Pera", cat: "frutas", img: "laranja", preco: 4.29, tipo: "kg" },
  { id: "uva", nome: "Uva Rubi", cat: "frutas", img: "uva", preco: 12.9, tipo: "kg" },
  { id: "cereja", nome: "Cereja Importada", cat: "frutas", img: "cereja", preco: 39.9, tipo: "kg" },

  { id: "tomate", nome: "Tomate Italiano", cat: "verduras", img: "tomate", preco: 6.9, tipo: "kg" },
  { id: "cenoura", nome: "Cenoura", cat: "verduras", img: "cenoura", preco: 3.99, tipo: "kg" },
  { id: "batata", nome: "Batata", cat: "verduras", img: "batata", preco: 4.49, tipo: "kg" },
  { id: "alface", nome: "Alface Crespa", cat: "verduras", img: "alface", preco: 2.99, tipo: "un", un: "pé" },
  { id: "cebola", nome: "Cebola", cat: "verduras", img: "cebola", preco: 4.2, tipo: "kg" },

  { id: "couve", nome: "Couve Orgânica", cat: "organicos", img: "couve", preco: 3.5, tipo: "un", un: "maço" },
  { id: "mix", nome: "Mix de Legumes Orgânicos", cat: "organicos", img: "mix", preco: 11.9, tipo: "kg" },
  { id: "maca-verde", nome: "Maçã Verde Orgânica", cat: "organicos", img: "maca-verde", preco: 9.4, tipo: "kg" },
  { id: "abacate", nome: "Abacate Orgânico", cat: "organicos", img: "abacate", preco: 4.5, tipo: "un", un: "un" },
];

const TABS: { value: "todos" | Cat; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "frutas", label: "Frutas" },
  { value: "verduras", label: "Verduras e Legumes" },
  { value: "organicos", label: "Orgânicos" },
];

const brl = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;
const fmtKg = (q: number) => `${q.toFixed(1).replace(".", ",")} kg`;
const step = (p: Prod) => (p.tipo === "kg" ? 0.5 : 1);
const qtyLabel = (p: Prod, q: number) =>
  p.tipo === "kg" ? fmtKg(q) : `${q} ${p.un}${q > 1 && p.un !== "un" ? "s" : ""}`;

export default function FeiraFrescaDemo() {
  const [tab, setTab] = useState<"todos" | Cat>("todos");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);

  const lista = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUTOS.filter(
      (p) => (tab === "todos" || p.cat === tab) && (!q || p.nome.toLowerCase().includes(q))
    );
  }, [tab, query]);

  const add = (p: Prod) =>
    setCart((c) => ({ ...c, [p.id]: +(((c[p.id] ?? 0) + step(p)).toFixed(2)) }));
  const change = (p: Prod, dir: 1 | -1) =>
    setCart((c) => {
      const next = +(((c[p.id] ?? 0) + dir * step(p)).toFixed(2));
      if (next <= 0) {
        const { [p.id]: _drop, ...rest } = c;
        return rest;
      }
      return { ...c, [p.id]: next };
    });

  const itens = Object.entries(cart).map(([id, q]) => ({
    prod: PRODUTOS.find((p) => p.id === id)!,
    q,
  }));
  const totalItens = itens.reduce((n, { q, prod }) => n + (prod.tipo === "kg" ? 1 : q), 0);
  const totalR = itens.reduce((s, { prod, q }) => s + prod.preco * q, 0);

  return (
    <main className="min-h-screen bg-[#fafaf7] text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-700 text-white">
              <Leaf size={18} strokeWidth={2.2} />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-emerald-900">
              Feira<span className="text-emerald-600">Fresca</span>
            </span>
          </div>

          <div className="relative ml-auto hidden w-72 sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar fruta, verdura, legume…"
              className="w-full rounded-md border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => setOpen(true)}
            className="relative flex items-center gap-2 rounded-md bg-emerald-700 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
          >
            <ShoppingBasket size={17} />
            <span className="hidden sm:inline">Carrinho</span>
            {totalItens > 0 && (
              <motion.span
                key={totalItens}
                initial={{ scale: 1.4 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-bold text-emerald-950"
              >
                {totalItens}
              </motion.span>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <img src="/img/laura/hero.jpg" alt="" className="h-52 w-full object-cover sm:h-64" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-900/45 to-transparent" />
        <div className="absolute inset-0 mx-auto flex max-w-6xl flex-col justify-center px-5">
          <h1 className="max-w-md text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
            Do sítio à sua porta, no mesmo dia
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-emerald-50/90">
            <Truck size={15} /> Entrega hoje para pedidos até as 15h
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 pb-32 pt-6">
        {/* Busca mobile */}
        <div className="relative mb-4 sm:hidden">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar fruta, verdura, legume…"
            className="w-full rounded-md border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        {/* Abas com sublinhado */}
        <nav className="flex gap-6 overflow-x-auto border-b border-neutral-200">
          {TABS.map((t) => {
            const active = tab === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`relative whitespace-nowrap pb-3 text-sm font-semibold transition-colors ${
                  active ? "text-emerald-800" : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {t.label}
                {active && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-emerald-700"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Grade de produtos */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab + query}
            variants={staggerGrid}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
          >
            {lista.map((p) => {
              const q = cart[p.id] ?? 0;
              return (
                <motion.article
                  key={p.id}
                  variants={cardIn}
                  className="flex flex-col overflow-hidden rounded-md border border-neutral-200 bg-white"
                >
                  <div className="relative">
                    <img src={`/img/laura/${p.img}.jpg`} alt={p.nome} className="h-32 w-full object-cover sm:h-36" />
                    {p.tipo === "kg" && (
                      <span className="absolute left-2 top-2 rounded bg-white/90 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                        por peso
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-3">
                    <h3 className="text-sm font-semibold leading-snug text-neutral-900">{p.nome}</h3>
                    <div className="mt-1 text-sm">
                      <span className="font-bold text-emerald-800">{brl(p.preco)}</span>
                      <span className="text-neutral-500">{p.tipo === "kg" ? " /kg" : ` /${p.un}`}</span>
                    </div>

                    <div className="mt-3">
                      {q === 0 ? (
                        <button
                          onClick={() => add(p)}
                          className="w-full rounded-md border border-emerald-700 py-1.5 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-50"
                        >
                          Adicionar
                        </button>
                      ) : (
                        <div className="flex items-center justify-between rounded-md bg-emerald-700 px-1 py-1 text-white">
                          <button
                            onClick={() => change(p, -1)}
                            className="flex h-7 w-7 items-center justify-center rounded transition-colors hover:bg-emerald-800"
                            aria-label="menos"
                          >
                            <Minus size={15} />
                          </button>
                          <span className="text-sm font-semibold tabular-nums">{qtyLabel(p, q)}</span>
                          <button
                            onClick={() => change(p, 1)}
                            className="flex h-7 w-7 items-center justify-center rounded transition-colors hover:bg-emerald-800"
                            aria-label="mais"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {lista.length === 0 && (
          <p className="mt-16 text-center text-sm text-neutral-400">
            Nada encontrado para “{query}”.
          </p>
        )}
      </div>

      {/* Carrinho */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              variants={overlayIn}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                <h2 className="flex items-center gap-2 text-base font-bold">
                  <ShoppingBasket size={18} className="text-emerald-700" /> Seu carrinho
                </h2>
                <button onClick={() => setOpen(false)} className="rounded p-1 text-neutral-400 hover:bg-neutral-100">
                  <X size={18} />
                </button>
              </div>

              {itens.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-neutral-400">
                  <ShoppingBasket size={34} strokeWidth={1.4} />
                  <p className="text-sm">Seu carrinho está vazio.</p>
                </div>
              ) : (
                <div className="flex-1 divide-y divide-neutral-100 overflow-y-auto">
                  {itens.map(({ prod, q }) => (
                    <div key={prod.id} className="flex items-center gap-3 px-5 py-3">
                      <img
                        src={`/img/laura/${prod.img}.jpg`}
                        alt={prod.nome}
                        className="h-14 w-14 rounded-md object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{prod.nome}</p>
                        <p className="text-xs text-neutral-500">
                          {qtyLabel(prod, q)} × {brl(prod.preco)}
                          {prod.tipo === "kg" ? "/kg" : ""}
                        </p>
                        <div className="mt-1.5 inline-flex items-center gap-3 rounded-md border border-neutral-200 px-1">
                          <button onClick={() => change(prod, -1)} className="p-1 text-neutral-500 hover:text-emerald-700">
                            <Minus size={13} />
                          </button>
                          <span className="text-xs font-semibold tabular-nums">{qtyLabel(prod, q)}</span>
                          <button onClick={() => change(prod, 1)} className="p-1 text-neutral-500 hover:text-emerald-700">
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-emerald-800">{brl(prod.preco * q)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-neutral-200 px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Subtotal</span>
                  <motion.span
                    key={totalR}
                    initial={{ opacity: 0.5, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg font-extrabold text-emerald-900"
                  >
                    {brl(totalR)}
                  </motion.span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-neutral-400">
                  Itens vendidos por peso são cobrados por kg — o valor final é confirmado na
                  separação, conforme a balança.
                </p>
                <button
                  disabled={itens.length === 0}
                  className="mt-3 w-full rounded-md bg-emerald-700 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40"
                >
                  Finalizar pedido
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
