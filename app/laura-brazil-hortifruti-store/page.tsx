/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  MapPin,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBasket,
  Sprout,
  Truck,
  X,
} from "lucide-react";
import { cardIn, overlayIn, staggerGrid } from "@/components/motion/presets";

/* ---- paleta terrosa (referência: hortifruti reais BR, não SaaS) ---- */
const INK = "#3b2a1a"; // espresso — texto/marca
const GREEN = "#356145"; // verde-pinho — CTA
const CLAY = "#c15c37"; // terracota — selos/promo
const CREAM = "#f7f2e8";

type Cat = "frutas" | "verduras" | "organicos";
type Tipo = "kg" | "un";

type Prod = {
  id: string;
  nome: string;
  sub: string;
  cat: Cat;
  img: string;
  preco: number;
  tipo: Tipo;
  un?: string;
  organico?: boolean;
};

const PRODUTOS: Prod[] = [
  { id: "banana", nome: "Banana Prata", sub: "Nacional", cat: "frutas", img: "banana", preco: 5.49, tipo: "kg" },
  { id: "maca", nome: "Maçã Gala", sub: "Serra Gaúcha", cat: "frutas", img: "maca", preco: 8.9, tipo: "kg" },
  { id: "morango", nome: "Morango", sub: "Bandeja 250g", cat: "frutas", img: "morango", preco: 7.9, tipo: "un", un: "bandeja" },
  { id: "laranja", nome: "Laranja Pera", sub: "Doce, para suco", cat: "frutas", img: "laranja", preco: 4.29, tipo: "kg" },
  { id: "uva", nome: "Uva Rubi", sub: "Sem semente", cat: "frutas", img: "uva", preco: 12.9, tipo: "kg" },
  { id: "cereja", nome: "Cereja", sub: "Importada", cat: "frutas", img: "cereja", preco: 39.9, tipo: "kg" },

  { id: "tomate", nome: "Tomate Italiano", sub: "Maduro", cat: "verduras", img: "tomate", preco: 6.9, tipo: "kg" },
  { id: "cenoura", nome: "Cenoura", sub: "Nacional", cat: "verduras", img: "cenoura", preco: 3.99, tipo: "kg" },
  { id: "batata", nome: "Batata", sub: "Lavada", cat: "verduras", img: "batata", preco: 4.49, tipo: "kg" },
  { id: "alface", nome: "Alface Crespa", sub: "Pé", cat: "verduras", img: "alface", preco: 2.99, tipo: "un", un: "pé" },
  { id: "cebola", nome: "Cebola", sub: "Nacional", cat: "verduras", img: "cebola", preco: 4.2, tipo: "kg" },

  { id: "couve", nome: "Couve", sub: "Maço", cat: "organicos", img: "couve", preco: 3.5, tipo: "un", un: "maço", organico: true },
  { id: "mix", nome: "Mix de Legumes", sub: "Da estação", cat: "organicos", img: "mix", preco: 11.9, tipo: "kg", organico: true },
  { id: "maca-verde", nome: "Maçã Verde", sub: "Ácida", cat: "organicos", img: "maca-verde", preco: 9.4, tipo: "kg", organico: true },
  { id: "abacate", nome: "Abacate", sub: "Cremoso", cat: "organicos", img: "abacate", preco: 4.5, tipo: "un", un: "un", organico: true },
];

type Chip = { label: string; img: string; match: (p: Prod) => boolean };
const CHIPS: Chip[] = [
  { label: "Todos", img: "hero", match: () => true },
  { label: "Frutas", img: "morango", match: (p) => p.cat === "frutas" },
  { label: "Verduras e legumes", img: "alface", match: (p) => p.cat === "verduras" },
  { label: "Orgânicos", img: "couve", match: (p) => p.cat === "organicos" },
  { label: "Frutas vermelhas", img: "cereja", match: (p) => ["morango", "uva", "cereja"].includes(p.id) },
  { label: "Folhosos", img: "mix", match: (p) => ["alface", "couve"].includes(p.id) },
];

const brl = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;
const fmtKg = (q: number) => `${q.toFixed(1).replace(".", ",")} kg`;
const step = (p: Prod) => (p.tipo === "kg" ? 0.5 : 1);
const qtyLabel = (p: Prod, q: number) =>
  p.tipo === "kg" ? fmtKg(q) : `${q} ${p.un}${q > 1 && p.un !== "un" ? "s" : ""}`;

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="30" height="32" viewBox="0 0 28 32" fill="none" aria-hidden>
        <path d="M14 31 C14 24 14 19 14 12" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <path d="M14 19 C7.5 19 3.5 14.5 4.2 8 C11 8.3 14.3 12.6 14 19 Z" fill={GREEN} />
        <path d="M14 14.5 C20 14 24 10 23.4 4.2 C17.4 4.2 14 8 14 14.5 Z" fill={INK} />
      </svg>
      <div className="leading-none">
        <div
          className="font-display text-[19px] font-bold tracking-[0.16em]"
          style={{ color: INK }}
        >
          COLHEITA
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="h-px w-4" style={{ backgroundColor: CLAY }} />
          <span className="text-[9px] font-semibold tracking-[0.34em] text-neutral-500">
            HORTIFRUTI
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ColheitaDemo() {
  const [chip, setChip] = useState(0);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);

  const lista = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUTOS.filter(
      (p) => CHIPS[chip].match(p) && (!q || p.nome.toLowerCase().includes(q))
    );
  }, [chip, query]);

  const add = (p: Prod) =>
    setCart((c) => ({ ...c, [p.id]: +(((c[p.id] ?? 0) + step(p)).toFixed(2)) }));
  const change = (p: Prod, dir: 1 | -1) =>
    setCart((c) => {
      const next = +(((c[p.id] ?? 0) + dir * step(p)).toFixed(2));
      if (next <= 0) {
        const { [p.id]: _d, ...rest } = c;
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
  const faltaFrete = Math.max(0, 120 - totalR);

  return (
    <main className="min-h-screen text-neutral-900" style={{ backgroundColor: CREAM }}>
      {/* Barra promo */}
      <div className="w-full text-center text-[12px] font-medium text-white" style={{ backgroundColor: INK }}>
        <div className="mx-auto max-w-6xl px-5 py-2">
          Frete grátis acima de R$ 120 · Entrega hoje para pedidos até as 15h
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-black/10 bg-[#fbf8f1]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
          <Logo />

          <button className="ml-2 hidden items-center gap-1.5 text-sm text-neutral-600 lg:flex">
            <MapPin size={16} style={{ color: CLAY }} />
            <span className="text-neutral-500">Entregar em</span>
            <span className="font-semibold text-neutral-800">São Paulo, SP</span>
            <ChevronDown size={14} />
          </button>

          <div className="relative ml-auto hidden w-80 md:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar fruta, verdura, legume…"
              className="w-full rounded-md border border-black/15 bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-[#356145]"
            />
          </div>

          <button
            onClick={() => setOpen(true)}
            className="relative ml-auto flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 md:ml-0"
            style={{ backgroundColor: GREEN }}
          >
            <ShoppingBasket size={17} />
            <span className="hidden sm:inline">Cesta</span>
            {totalItens > 0 && (
              <motion.span
                key={totalItens}
                initial={{ scale: 1.4 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold"
                style={{ backgroundColor: CLAY, color: "#fff" }}
              >
                {totalItens}
              </motion.span>
            )}
          </button>
        </div>
      </header>

      {/* Hero editorial */}
      <section className="mx-auto max-w-6xl px-5 pt-6">
        <div className="grid overflow-hidden rounded-lg border border-black/10 md:grid-cols-2">
          <div className="order-2 flex flex-col justify-center gap-3 bg-[#fbf8f1] p-7 sm:p-10 md:order-1">
            <span className="text-[11px] font-semibold tracking-[0.28em]" style={{ color: CLAY }}>
              DIRETO DA FEIRA
            </span>
            <h1 className="font-display text-3xl font-semibold leading-[1.1] sm:text-[40px]" style={{ color: INK }}>
              Do pé à sua porta,<br />colhido no mesmo dia.
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-neutral-600">
              Frutas, verduras e legumes escolhidos de manhã na feira e entregues
              refrigerados na sua casa até o fim da tarde.
            </p>
            <div className="mt-1 flex items-center gap-2 text-sm font-medium" style={{ color: GREEN }}>
              <Truck size={16} /> Entrega hoje · pedidos até as 15h
            </div>
          </div>
          <div className="relative order-1 h-44 md:order-2 md:h-auto">
            <img src="/img/laura/hero.jpg" alt="Caixas de frutas e verduras frescas" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Faixa de categorias (círculos) */}
      <section className="mx-auto max-w-6xl px-5 pt-8">
        <div className="flex gap-5 overflow-x-auto pb-1">
          {CHIPS.map((c, i) => {
            const active = chip === i;
            return (
              <button
                key={c.label}
                onClick={() => setChip(i)}
                className="flex w-16 shrink-0 flex-col items-center gap-2"
              >
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-full p-[3px] transition-all"
                  style={{ boxShadow: active ? `0 0 0 2px ${GREEN}` : "0 0 0 1px rgba(0,0,0,0.1)" }}
                >
                  <img src={`/img/laura/${c.img}.jpg`} alt={c.label} className="h-full w-full rounded-full object-cover" />
                </span>
                <span
                  className={`text-center text-[11px] leading-tight ${active ? "font-bold" : "font-medium text-neutral-500"}`}
                  style={active ? { color: INK } : undefined}
                >
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Busca mobile */}
      <div className="mx-auto max-w-6xl px-5 pt-5 md:hidden">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar fruta, verdura, legume…"
            className="w-full rounded-md border border-black/15 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#356145]"
          />
        </div>
      </div>

      {/* Grade */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-xl font-semibold" style={{ color: INK }}>
            {CHIPS[chip].label}
          </h2>
          <span className="text-sm text-neutral-400">{lista.length} itens</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={chip + query}
            variants={staggerGrid}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
          >
            {lista.map((p) => {
              const q = cart[p.id] ?? 0;
              return (
                <motion.article
                  key={p.id}
                  variants={cardIn}
                  className="flex flex-col overflow-hidden rounded-md border border-black/10 bg-white"
                >
                  <div className="relative">
                    <img src={`/img/laura/${p.img}.jpg`} alt={p.nome} className="h-32 w-full object-cover sm:h-36" />
                    <div className="absolute left-2 top-2 flex flex-col gap-1">
                      {p.organico && (
                        <span className="flex items-center gap-1 rounded bg-white/95 px-1.5 py-0.5 text-[10px] font-bold" style={{ color: GREEN }}>
                          <Sprout size={11} /> orgânico
                        </span>
                      )}
                      {p.tipo === "kg" && (
                        <span className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: CLAY }}>
                          por peso
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-3">
                    <h3 className="text-sm font-semibold leading-snug text-neutral-900">{p.nome}</h3>
                    <p className="text-xs text-neutral-400">{p.sub}</p>
                    <div className="mt-1.5 text-sm">
                      <span className="font-bold" style={{ color: GREEN }}>{brl(p.preco)}</span>
                      <span className="text-neutral-400">{p.tipo === "kg" ? " /kg" : ` /${p.un}`}</span>
                    </div>

                    <div className="mt-3">
                      {q === 0 ? (
                        <button
                          onClick={() => add(p)}
                          className="w-full rounded-md border py-1.5 text-sm font-semibold transition-colors hover:bg-black/[0.03]"
                          style={{ borderColor: GREEN, color: GREEN }}
                        >
                          Adicionar
                        </button>
                      ) : (
                        <div className="flex items-center justify-between rounded-md px-1 py-1 text-white" style={{ backgroundColor: GREEN }}>
                          <button onClick={() => change(p, -1)} className="flex h-7 w-7 items-center justify-center rounded hover:bg-black/15" aria-label="menos">
                            <Minus size={15} />
                          </button>
                          <span className="text-sm font-semibold tabular-nums">{qtyLabel(p, q)}</span>
                          <button onClick={() => change(p, 1)} className="flex h-7 w-7 items-center justify-center rounded hover:bg-black/15" aria-label="mais">
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
          <p className="mt-16 text-center text-sm text-neutral-400">Nada encontrado para “{query}”.</p>
        )}
      </section>

      {/* Faixa de confiança */}
      <section className="border-y border-black/10 bg-[#fbf8f1]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 py-7 sm:grid-cols-3">
          {[
            { icon: <Sprout size={20} />, t: "Direto do produtor", d: "Sem intermediário, colhido no dia" },
            { icon: <Truck size={20} />, t: "Entrega refrigerada", d: "Chega fresco, na temperatura certa" },
            { icon: <ShieldCheck size={20} />, t: "Não gostou, troca", d: "Qualquer item, sem burocracia" },
          ].map((f) => (
            <div key={f.t} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: "#eae2d1", color: GREEN }}>
                {f.icon}
              </span>
              <div>
                <p className="text-sm font-semibold" style={{ color: INK }}>{f.t}</p>
                <p className="text-xs text-neutral-500">{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: INK }} className="text-neutral-300">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 py-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="font-display text-lg font-bold tracking-[0.16em] text-white">COLHEITA</div>
            <p className="mt-2 text-xs leading-relaxed text-neutral-400">
              Hortifruti online. Da feira para a sua cozinha, todo dia.
            </p>
          </div>
          {[
            { h: "Institucional", l: ["Sobre nós", "Nossos produtores", "Trabalhe conosco"] },
            { h: "Ajuda", l: ["Central de atendimento", "Prazos de entrega", "Trocas e devoluções"] },
            { h: "Categorias", l: ["Frutas", "Verduras e legumes", "Orgânicos"] },
          ].map((col) => (
            <div key={col.h}>
              <p className="mb-3 text-sm font-semibold text-white">{col.h}</p>
              <ul className="space-y-2 text-xs text-neutral-400">
                {col.l.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-4 text-[11px] text-neutral-500 sm:flex-row">
            <span>© 2026 Colheita Hortifruti · CNPJ 00.000.000/0001-00</span>
            <div className="flex items-center gap-2">
              {["Pix", "Visa", "Master", "Elo"].map((m) => (
                <span key={m} className="rounded border border-white/15 px-2 py-1 text-neutral-300">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Cesta */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div variants={overlayIn} initial="hidden" animate="show" exit="exit" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/40" />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                <h2 className="flex items-center gap-2 text-base font-bold" style={{ color: INK }}>
                  <ShoppingBasket size={18} style={{ color: GREEN }} /> Sua cesta
                </h2>
                <button onClick={() => setOpen(false)} className="rounded p-1 text-neutral-400 hover:bg-neutral-100">
                  <X size={18} />
                </button>
              </div>

              {itens.length > 0 && (
                <div className="px-5 pt-3">
                  <div className="rounded-md px-3 py-2 text-xs" style={{ backgroundColor: "#f3ede0", color: INK }}>
                    {faltaFrete > 0 ? (
                      <>Faltam <b>{brl(faltaFrete)}</b> para o frete grátis.</>
                    ) : (
                      <>Você ganhou <b>frete grátis</b>. 🌿</>
                    )}
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/10">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(100, (totalR / 120) * 100)}%`, backgroundColor: GREEN }} />
                    </div>
                  </div>
                </div>
              )}

              {itens.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-neutral-400">
                  <ShoppingBasket size={34} strokeWidth={1.4} />
                  <p className="text-sm">Sua cesta está vazia.</p>
                </div>
              ) : (
                <div className="flex-1 divide-y divide-black/5 overflow-y-auto">
                  {itens.map(({ prod, q }) => (
                    <div key={prod.id} className="flex items-center gap-3 px-5 py-3">
                      <img src={`/img/laura/${prod.img}.jpg`} alt={prod.nome} className="h-14 w-14 rounded-md object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{prod.nome}</p>
                        <p className="text-xs text-neutral-500">
                          {qtyLabel(prod, q)} × {brl(prod.preco)}{prod.tipo === "kg" ? "/kg" : ""}
                        </p>
                        <div className="mt-1.5 inline-flex items-center gap-3 rounded-md border border-black/10 px-1">
                          <button onClick={() => change(prod, -1)} className="p-1 text-neutral-500 hover:text-[#356145]"><Minus size={13} /></button>
                          <span className="text-xs font-semibold tabular-nums">{qtyLabel(prod, q)}</span>
                          <button onClick={() => change(prod, 1)} className="p-1 text-neutral-500 hover:text-[#356145]"><Plus size={13} /></button>
                        </div>
                      </div>
                      <span className="text-sm font-bold" style={{ color: GREEN }}>{brl(prod.preco * q)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-black/10 px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Subtotal</span>
                  <motion.span key={totalR} initial={{ opacity: 0.5, y: -3 }} animate={{ opacity: 1, y: 0 }} className="font-display text-xl font-bold" style={{ color: INK }}>
                    {brl(totalR)}
                  </motion.span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-neutral-400">
                  Itens por peso são cobrados por kg — o valor final é confirmado na separação, conforme a balança.
                </p>
                <button
                  disabled={itens.length === 0}
                  className="mt-3 w-full rounded-md py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  style={{ backgroundColor: GREEN }}
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
