/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Minus, Plus, Search, ShoppingBasket, X } from "lucide-react";
import { overlayIn } from "@/components/motion/presets";

const INK = "#3b2a1a";
const GREEN = "#356145";
const CLAY = "#c15c37";

type Cat = "frutas" | "verduras" | "organicos";

type Prod = {
  id: string;
  nome: string;
  sub: string;
  cat: Cat;
  img: string;
  preco: number;
  de?: number;
  tipo: "kg" | "un";
  un?: string;
  organico?: boolean;
  esgotado?: boolean;
  vendidos: number;
};

const PRODUTOS: Prod[] = [
  { id: "banana", nome: "Banana Prata", sub: "Nacional", cat: "frutas", img: "banana", preco: 5.49, de: 6.99, tipo: "kg", vendidos: 320 },
  { id: "maca", nome: "Maçã Gala", sub: "Serra Gaúcha", cat: "frutas", img: "maca", preco: 8.9, tipo: "kg", vendidos: 265 },
  { id: "morango", nome: "Morango", sub: "Bandeja 250 g", cat: "frutas", img: "morango", preco: 7.9, tipo: "un", un: "bandeja", vendidos: 410 },
  { id: "laranja", nome: "Laranja Pera", sub: "Doce, para suco", cat: "frutas", img: "laranja", preco: 4.29, tipo: "kg", vendidos: 298 },
  { id: "uva", nome: "Uva Rubi", sub: "Sem semente", cat: "frutas", img: "uva", preco: 12.9, tipo: "kg", vendidos: 150 },
  { id: "cereja", nome: "Cereja", sub: "Importada", cat: "frutas", img: "cereja", preco: 39.9, tipo: "kg", esgotado: true, vendidos: 40 },

  { id: "tomate", nome: "Tomate Italiano", sub: "Maduro", cat: "verduras", img: "tomate", preco: 6.9, de: 8.9, tipo: "kg", vendidos: 380 },
  { id: "cenoura", nome: "Cenoura", sub: "Nacional", cat: "verduras", img: "cenoura", preco: 3.99, tipo: "kg", vendidos: 240 },
  { id: "batata", nome: "Batata", sub: "Lavada", cat: "verduras", img: "batata", preco: 4.49, tipo: "kg", vendidos: 355 },
  { id: "alface", nome: "Alface Crespa", sub: "Pé", cat: "verduras", img: "alface", preco: 2.99, tipo: "un", un: "pé", vendidos: 275 },
  { id: "cebola", nome: "Cebola", sub: "Nacional", cat: "verduras", img: "cebola", preco: 4.2, tipo: "kg", vendidos: 210 },

  { id: "couve", nome: "Couve", sub: "Maço", cat: "organicos", img: "couve", preco: 3.5, tipo: "un", un: "maço", organico: true, vendidos: 190 },
  { id: "mix", nome: "Mix de Legumes", sub: "Da estação", cat: "organicos", img: "mix", preco: 11.9, de: 14.5, tipo: "kg", organico: true, vendidos: 120 },
  { id: "maca-verde", nome: "Maçã Verde", sub: "Ácida", cat: "organicos", img: "maca-verde", preco: 9.4, tipo: "kg", organico: true, vendidos: 145 },
  { id: "abacate", nome: "Abacate", sub: "Cremoso", cat: "organicos", img: "abacate", preco: 4.5, tipo: "un", un: "un", organico: true, vendidos: 175 },
];

const DEPTOS: { id: "todos" | Cat; label: string }[] = [
  { id: "todos", label: "Todos os itens" },
  { id: "frutas", label: "Frutas" },
  { id: "verduras", label: "Verduras e legumes" },
  { id: "organicos", label: "Orgânicos" },
];

const brl = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;
const fmtKg = (q: number) => `${q.toFixed(1).replace(".", ",")} kg`;
const step = (p: Prod) => (p.tipo === "kg" ? 0.5 : 1);
const qtyLabel = (p: Prod, q: number) =>
  p.tipo === "kg" ? fmtKg(q) : `${q} ${p.un}${q > 1 && p.un !== "un" ? "s" : ""}`;

export default function ColheitaDemo() {
  const [depto, setDepto] = useState<"todos" | Cat>("todos");
  const [query, setQuery] = useState("");
  const [soOrganico, setSoOrganico] = useState(false);
  const [soOferta, setSoOferta] = useState(false);
  const [soPeso, setSoPeso] = useState(false);
  const [ordem, setOrdem] = useState<"vendidos" | "menor" | "maior">("vendidos");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);

  const contagem = (id: "todos" | Cat) =>
    id === "todos" ? PRODUTOS.length : PRODUTOS.filter((p) => p.cat === id).length;

  const lista = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = PRODUTOS.filter(
      (p) =>
        (depto === "todos" || p.cat === depto) &&
        (!q || p.nome.toLowerCase().includes(q)) &&
        (!soOrganico || p.organico) &&
        (!soOferta || p.de) &&
        (!soPeso || p.tipo === "kg")
    );
    if (ordem === "menor") return [...out].sort((a, b) => a.preco - b.preco);
    if (ordem === "maior") return [...out].sort((a, b) => b.preco - a.preco);
    return [...out].sort((a, b) => b.vendidos - a.vendidos);
  }, [depto, query, soOrganico, soOferta, soPeso, ordem]);

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
  const totalR = itens.reduce((s, { prod, q }) => s + prod.preco * q, 0);
  const nItens = itens.length;

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* ---- Cabeçalho utilitário ---- */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-[1240px] items-center gap-5 px-5 py-3">
          <a className="flex shrink-0 items-center gap-2">
            <svg width="26" height="28" viewBox="0 0 28 32" fill="none" aria-hidden>
              <path d="M14 31 C14 24 14 19 14 12" stroke={INK} strokeWidth="2" strokeLinecap="round" />
              <path d="M14 19 C7.5 19 3.5 14.5 4.2 8 C11 8.3 14.3 12.6 14 19 Z" fill={GREEN} />
              <path d="M14 14.5 C20 14 24 10 23.4 4.2 C17.4 4.2 14 8 14 14.5 Z" fill={INK} />
            </svg>
            <span className="font-display text-[22px] font-semibold" style={{ color: INK }}>
              Colheita
            </span>
          </a>

          <div className="relative hidden flex-1 md:block">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar em 15 itens: banana, tomate, orgânicos…"
              className="w-full rounded-md border border-neutral-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#356145]"
            />
          </div>

          <button className="hidden text-sm font-medium text-neutral-600 hover:text-neutral-900 lg:block">
            Entrar
          </button>

          <button
            onClick={() => setOpen(true)}
            className="ml-auto flex items-center gap-2.5 rounded-md px-3.5 py-2.5 text-sm font-semibold text-white md:ml-0"
            style={{ backgroundColor: GREEN }}
          >
            <span className="relative">
              <ShoppingBasket size={18} />
              {nItens > 0 && (
                <motion.span
                  key={nItens}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                  className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold"
                  style={{ backgroundColor: CLAY }}
                >
                  {nItens}
                </motion.span>
              )}
            </span>
            <motion.span key={totalR} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} className="tabular-nums">
              {nItens > 0 ? brl(totalR) : "Cesta"}
            </motion.span>
          </button>
        </div>

        {/* linha de entrega */}
        <div className="border-t border-neutral-100 bg-[#fbfaf7]">
          <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-6 gap-y-1 px-5 py-2 text-[13px]">
            <span className="text-neutral-500">
              Entregar em <b className="font-semibold text-neutral-800">São Paulo, SP</b>
            </span>
            <span className="hidden text-neutral-500 sm:inline">
              Entrega <b className="font-semibold" style={{ color: GREEN }}>hoje, 18h–21h</b>
            </span>
            <button className="text-neutral-400 underline underline-offset-2 hover:text-neutral-700">
              alterar
            </button>
            <span className="ml-auto hidden text-neutral-500 lg:inline">
              Frete grátis acima de R$ 120
            </span>
          </div>
        </div>
      </header>

      {/* busca mobile */}
      <div className="px-5 py-3 md:hidden">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar produto…"
            className="w-full rounded-md border border-neutral-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#356145]"
          />
        </div>
      </div>

      <div className="mx-auto flex max-w-[1240px] gap-7 px-5 py-6">
        {/* ---- Coluna lateral ---- */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Departamentos
          </p>
          <ul className="mb-6 space-y-0.5">
            {DEPTOS.map((d) => {
              const on = depto === d.id;
              return (
                <li key={d.id}>
                  <button
                    onClick={() => setDepto(d.id)}
                    className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-[13px] ${
                      on ? "font-semibold" : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                    style={on ? { backgroundColor: "#f0f4f0", color: GREEN } : undefined}
                  >
                    {d.label}
                    <span className="text-[11px] text-neutral-400">{contagem(d.id)}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Filtrar
          </p>
          <div className="space-y-2 text-[13px] text-neutral-700">
            {[
              { l: "Só orgânicos", v: soOrganico, set: setSoOrganico },
              { l: "Em oferta", v: soOferta, set: setSoOferta },
              { l: "Vendidos por peso", v: soPeso, set: setSoPeso },
            ].map((f) => (
              <label key={f.l} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={f.v}
                  onChange={(e) => f.set(e.target.checked)}
                  className="h-3.5 w-3.5 accent-[#356145]"
                />
                {f.l}
              </label>
            ))}
          </div>

          <div className="mt-6 border-t border-neutral-200 pt-4 text-[12px] leading-relaxed text-neutral-500">
            Itens marcados <b style={{ color: CLAY }}>por peso</b> são cobrados por kg. O valor
            fecha na separação, conforme a balança.
          </div>
        </aside>

        {/* ---- Catálogo ---- */}
        <section className="min-w-0 flex-1">
          <div className="mb-1 text-[12px] text-neutral-400">
            Início / {DEPTOS.find((d) => d.id === depto)!.label}
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-[26px] font-semibold" style={{ color: INK }}>
              {DEPTOS.find((d) => d.id === depto)!.label}
            </h1>
            <span className="text-[13px] text-neutral-400">
              Mostrando {lista.length} de {PRODUTOS.length} itens
            </span>
            <div className="relative ml-auto">
              <select
                value={ordem}
                onChange={(e) => setOrdem(e.target.value as typeof ordem)}
                className="appearance-none rounded-md border border-neutral-300 bg-white py-1.5 pl-3 pr-8 text-[13px] outline-none focus:border-[#356145]"
              >
                <option value="vendidos">Mais vendidos</option>
                <option value="menor">Menor preço</option>
                <option value="maior">Maior preço</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            </div>
          </div>

          {/* filtros mobile */}
          <div className="mb-4 flex gap-2 overflow-x-auto lg:hidden">
            {DEPTOS.map((d) => (
              <button
                key={d.id}
                onClick={() => setDepto(d.id)}
                className={`whitespace-nowrap rounded border px-3 py-1.5 text-[13px] ${
                  depto === d.id ? "border-[#356145] font-semibold text-[#356145]" : "border-neutral-300 text-neutral-600"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-4">
            {lista.map((p) => {
              const q = cart[p.id] ?? 0;
              return (
                <article key={p.id} className="flex flex-col">
                  <div className="relative mb-2 overflow-hidden rounded-md border border-neutral-200">
                    <img
                      src={`/img/laura/${p.img}.jpg`}
                      alt={p.nome}
                      className={`h-32 w-full object-cover ${p.esgotado ? "opacity-40 grayscale" : ""}`}
                    />
                    {/* um selo só por foto — empilhar vira poluição */}
                    {!p.esgotado && p.de ? (
                      <span className="absolute left-1.5 top-1.5 rounded px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: CLAY }}>
                        oferta
                      </span>
                    ) : !p.esgotado && p.organico ? (
                      <span className="absolute left-1.5 top-1.5 rounded bg-white/95 px-1.5 py-0.5 text-[10px] font-bold" style={{ color: GREEN }}>
                        orgânico
                      </span>
                    ) : null}
                    {p.esgotado && (
                      <span className="absolute inset-x-0 bottom-0 bg-neutral-800/85 py-1 text-center text-[11px] font-semibold text-white">
                        Esgotado
                      </span>
                    )}
                  </div>

                  <h3 className="text-[13.5px] font-semibold leading-tight">{p.nome}</h3>
                  <p className="mb-1 text-[11.5px] text-neutral-400">{p.sub}</p>

                  <div className="mb-2 mt-auto flex flex-wrap items-baseline gap-x-1.5">
                    {p.de && (
                      <span className="text-[11.5px] text-neutral-400 line-through">{brl(p.de)}</span>
                    )}
                    <span className="text-[16px] font-bold" style={{ color: p.esgotado ? "#a3a3a3" : INK }}>
                      {brl(p.preco)}
                    </span>
                    <span className="text-[12px] text-neutral-400">{p.tipo === "kg" ? "/kg" : `/${p.un}`}</span>
                    {p.tipo === "kg" && !p.esgotado && (
                      <span className="rounded-sm px-1 py-[1px] text-[9.5px] font-semibold" style={{ backgroundColor: "#f6ece6", color: CLAY }}>
                        por peso
                      </span>
                    )}
                  </div>

                  {p.esgotado ? (
                    <button disabled className="w-full cursor-not-allowed rounded-md border border-neutral-200 py-1.5 text-[13px] font-medium text-neutral-300">
                      Indisponível
                    </button>
                  ) : q === 0 ? (
                    <button
                      onClick={() => add(p)}
                      className="w-full rounded-md border py-1.5 text-[13px] font-semibold transition-colors hover:bg-[#f0f4f0]"
                      style={{ borderColor: GREEN, color: GREEN }}
                    >
                      Adicionar
                    </button>
                  ) : (
                    <div className="flex items-center justify-between rounded-md px-1 py-1 text-white" style={{ backgroundColor: GREEN }}>
                      <button onClick={() => change(p, -1)} className="flex h-6 w-6 items-center justify-center rounded hover:bg-black/20" aria-label="menos">
                        <Minus size={14} />
                      </button>
                      <span className="text-[12.5px] font-semibold tabular-nums">{qtyLabel(p, q)}</span>
                      <button onClick={() => change(p, 1)} className="flex h-6 w-6 items-center justify-center rounded hover:bg-black/20" aria-label="mais">
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {lista.length === 0 && (
            <p className="py-20 text-center text-sm text-neutral-400">
              Nenhum item com esses filtros.
            </p>
          )}
        </section>
      </div>

      <footer className="mt-10 border-t border-neutral-200 py-6">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-2 px-5 text-[12px] text-neutral-400 sm:flex-row sm:items-center">
          <span>Colheita Hortifruti · CNPJ 00.000.000/0001-00 · São Paulo, SP</span>
          <span className="sm:ml-auto">Pagamento: Pix, crédito e débito na entrega</span>
        </div>
      </footer>

      {/* ---- Cesta ---- */}
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
              <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                <h2 className="text-[15px] font-bold" style={{ color: INK }}>
                  Sua cesta {nItens > 0 && <span className="font-normal text-neutral-400">· {nItens} itens</span>}
                </h2>
                <button onClick={() => setOpen(false)} className="rounded p-1 text-neutral-400 hover:bg-neutral-100">
                  <X size={18} />
                </button>
              </div>

              {itens.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 text-neutral-400">
                  <ShoppingBasket size={32} strokeWidth={1.4} />
                  <p className="text-sm">Sua cesta está vazia.</p>
                </div>
              ) : (
                <div className="flex-1 divide-y divide-neutral-100 overflow-y-auto">
                  {itens.map(({ prod, q }) => (
                    <div key={prod.id} className="flex gap-3 px-5 py-3">
                      <img src={`/img/laura/${prod.img}.jpg`} alt={prod.nome} className="h-14 w-14 rounded-md border border-neutral-200 object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold">{prod.nome}</p>
                        <p className="text-[11.5px] text-neutral-500">
                          {qtyLabel(prod, q)} × {brl(prod.preco)}{prod.tipo === "kg" ? "/kg" : ""}
                        </p>
                        <div className="mt-1.5 inline-flex items-center gap-3 rounded border border-neutral-200 px-1">
                          <button onClick={() => change(prod, -1)} className="p-0.5 text-neutral-500 hover:text-[#356145]"><Minus size={12} /></button>
                          <span className="text-[11.5px] font-semibold tabular-nums">{qtyLabel(prod, q)}</span>
                          <button onClick={() => change(prod, 1)} className="p-0.5 text-neutral-500 hover:text-[#356145]"><Plus size={12} /></button>
                        </div>
                      </div>
                      <span className="text-[13px] font-bold" style={{ color: INK }}>{brl(prod.preco * q)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-neutral-200 px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Subtotal</span>
                  <motion.span key={totalR} initial={{ opacity: 0.5, y: -3 }} animate={{ opacity: 1, y: 0 }} className="text-[19px] font-bold tabular-nums" style={{ color: INK }}>
                    {brl(totalR)}
                  </motion.span>
                </div>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-neutral-400">
                  Itens por peso são cobrados por kg — o valor final é confirmado na separação.
                </p>
                <button
                  disabled={itens.length === 0}
                  className="mt-3 w-full rounded-md py-2.5 text-sm font-semibold text-white disabled:opacity-40"
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
