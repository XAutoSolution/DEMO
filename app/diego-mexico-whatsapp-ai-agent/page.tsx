/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Clock,
  FileText,
  Lock,
  Paperclip,
  RotateCcw,
  Send,
  ShieldCheck,
} from "lucide-react";

const WA = "#008069";
const WA_OUT = "#D9FDD3";
const WA_BG = "#EFEAE2";
const TEAMS = "#5B5FC7";

type Row = { k: string; v: string; hot?: boolean };
type Audit = { t: string; ev: string; who: string; amt?: string; hot?: boolean };

type Msg = {
  id: string;
  from: "bot" | "me";
  kind: "text" | "report" | "doc" | "auth" | "confirm" | "done";
  time: string;
  text?: string;
  title?: string;
  amount?: string;
  rows?: Row[];
  foot?: string;
  bar?: number;
  doc?: { name: string; meta: string; where: string; img: string };
  audit?: Audit;
  pauseAfter?: boolean;
  teams?: boolean;
};

const SCRIPT: Msg[] = [
  {
    id: "rep",
    from: "bot",
    kind: "report",
    time: "07:00",
    title: "Informe diario · mar 22 jul",
    rows: [
      { k: "Saldo consolidado", v: "$2,847,320" },
      { k: "Ingresos de ayer", v: "$412,000" },
      { k: "Egresos de ayer", v: "$188,450" },
      { k: "Por cobrar vencido", v: "$96,200", hot: true },
      { k: "Proyectos activos", v: "4" },
    ],
    foot: "Finanzas_2026.xlsx · SharePoint · act. 06:58",
    audit: { t: "07:00:04", ev: "Informe diario enviado", who: "sistema" },
  },
  {
    id: "q1",
    from: "me",
    kind: "text",
    time: "09:11",
    text: "¿cuánto llevamos gastado en Montecristo?",
  },
  {
    id: "a1",
    from: "bot",
    kind: "report",
    time: "09:11",
    title: "Proyecto Montecristo",
    rows: [
      { k: "Gastado", v: "$1,284,900" },
      { k: "Presupuesto", v: "$1,600,000" },
      { k: "Mayor rubro", v: "Obra civil $742,300" },
      { k: "Último pago", v: "18 jul · C. Peniche" },
    ],
    bar: 80,
    foot: "Disponible: $315,100",
    audit: { t: "09:11:22", ev: "Consulta de gasto por proyecto", who: "Diego O." },
  },
  {
    id: "q2",
    from: "me",
    kind: "text",
    time: "09:12",
    text: "mándame el contrato de arrendamiento de Itzimná",
  },
  {
    id: "doc",
    from: "bot",
    kind: "doc",
    time: "09:12",
    doc: {
      name: "Contrato_Arrendamiento_Itzimna.pdf",
      meta: "2.4 MB · 14 págs",
      where: "Teams › Legal › Contratos 2026",
      img: "/img/diego/prop1.jpg",
    },
    audit: { t: "09:12:47", ev: "Documento enviado por WhatsApp", who: "Diego O." },
  },
  {
    id: "auth",
    from: "bot",
    kind: "auth",
    time: "09:13",
    title: "Solicitud de autorización",
    amount: "$186,000 MXN",
    rows: [
      { k: "Proveedor", v: "Constructora Peniche" },
      { k: "Concepto", v: "Obra civil · avance 60%" },
      { k: "Proyecto", v: "Montecristo" },
      { k: "Solicita", v: "Ana G. · Administración" },
    ],
    audit: {
      t: "09:13:58",
      ev: "Solicitud de autorización creada",
      who: "Ana G.",
      amt: "$186,000",
    },
    pauseAfter: true,
  },
  { id: "tap1", from: "me", kind: "text", time: "09:14", text: "Aprobar" },
  {
    id: "conf",
    from: "bot",
    kind: "confirm",
    time: "09:14",
    text: "El monto supera los $50,000 MXN. Confirme para registrar la autorización.",
    audit: { t: "09:14:06", ev: "Confirmación por monto solicitada", who: "sistema" },
    pauseAfter: true,
  },
  { id: "tap2", from: "me", kind: "text", time: "09:14", text: "CONFIRMAR" },
  {
    id: "done",
    from: "bot",
    kind: "done",
    time: "09:14",
    title: "Autorización registrada",
    rows: [
      { k: "Monto", v: "$186,000 MXN" },
      { k: "Proveedor", v: "Constructora Peniche" },
      { k: "Autorizó", v: "Diego O. · 22/07 09:14" },
    ],
    foot: "Notifiqué al equipo en Teams.",
    audit: {
      t: "09:14:19",
      ev: "PAGO AUTORIZADO",
      who: "Diego O.",
      amt: "$186,000",
      hot: true,
    },
    teams: true,
  },
];

const ALLOW = [
  { n: "Diego O.", r: "Dirección", tel: "+52 999 ••• 4471", img: "/img/diego/av-diego.jpg" },
  { n: "Ana G.", r: "Administración", tel: "+52 999 ••• 2210", img: "/img/diego/av-ana.jpg" },
  { n: "Luis M.", r: "Obra", tel: "+52 999 ••• 8834", img: "/img/diego/av-luis.jpg" },
];

function BotMark({ size = 34 }: { size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
      style={{ width: size, height: size, backgroundColor: "#0b5c4a" }}
    >
      TR
    </span>
  );
}

function Ticks() {
  return <CheckCheck size={13} style={{ color: "#53bdeb" }} />;
}

export default function DiegoAgenteDemo() {
  const [step, setStep] = useState(1);
  const [typing, setTyping] = useState(false);
  const [paused, setPaused] = useState(false);
  const [auto, setAuto] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  // ?auto=1 releases the approval gates on its own, so a screen capture can run
  // the whole flow hands-free. Without it the client taps the buttons.
  useEffect(() => {
    setAuto(new URLSearchParams(window.location.search).has("auto"));
  }, []);

  useEffect(() => {
    if (paused || step >= SCRIPT.length) return;
    const next = SCRIPT[step];
    let inner: ReturnType<typeof setTimeout>;
    const outer = setTimeout(
      () => {
        if (next.from === "bot") {
          setTyping(true);
          inner = setTimeout(() => {
            setTyping(false);
            setStep((s) => s + 1);
            if (next.pauseAfter) setPaused(true);
          }, 780);
        } else {
          setStep((s) => s + 1);
          if (next.pauseAfter) setPaused(true);
        }
      },
      next.from === "bot" ? 620 : 780,
    );
    return () => {
      clearTimeout(outer);
      clearTimeout(inner);
    };
  }, [step, paused]);

  useEffect(() => {
    if (!paused || !auto) return;
    const t = setTimeout(() => setPaused(false), 1700);
    return () => clearTimeout(t);
  }, [paused, auto]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [step, typing]);

  const shown = SCRIPT.slice(0, step);
  const gate = paused ? SCRIPT[step - 1].id : null;
  const audits = shown.flatMap((m) => (m.audit ? [m.audit] : []));
  const teamsUp = shown.some((m) => m.teams);

  const replay = () => {
    setStep(1);
    setTyping(false);
    setPaused(false);
  };

  return (
    <main className="min-h-screen bg-[#f2f1ee] px-4 py-6 text-neutral-900 sm:px-8">
      <div className="mx-auto max-w-[1060px]">
        {/* Barra superior */}
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-neutral-300 pb-4">
          <div>
            <p className="font-display text-[24px] leading-none font-semibold tracking-tight">
              Tabula Rasa
            </p>
            <p className="mt-1.5 text-[12px] tracking-wide text-neutral-500 uppercase">
              Agente corporativo · WhatsApp + Teams + SharePoint
            </p>
          </div>
          <button
            onClick={replay}
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900"
          >
            <RotateCcw size={13} />
            Reiniciar
          </button>
        </header>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Teléfono */}
          <div className="mx-auto w-full max-w-[372px] shrink-0">
            <div className="rounded-[26px] border border-neutral-800 bg-neutral-900 p-2 shadow-xl">
              <div className="overflow-hidden rounded-[18px]">
                <div
                  className="flex items-center gap-2.5 px-3 py-2.5 text-white"
                  style={{ backgroundColor: WA }}
                >
                  <ArrowLeft size={17} className="opacity-80" />
                  <BotMark size={32} />
                  <div className="min-w-0 leading-tight">
                    <p className="truncate text-[13.5px] font-semibold">Tabula Rasa · Agente</p>
                    <p className="text-[11px] text-white/70">en línea</p>
                  </div>
                </div>

                <div
                  ref={scroller}
                  className="h-[520px] space-y-2 overflow-y-auto px-3 py-3"
                  style={{ backgroundColor: WA_BG }}
                >
                  <div className="flex justify-center pb-1">
                    <span className="rounded bg-white/70 px-2 py-0.5 text-[10.5px] text-neutral-500">
                      hoy
                    </span>
                  </div>

                  {shown.map((m) => (
                    <Bubble
                      key={m.id}
                      m={m}
                      gate={gate}
                      onApprove={() => setPaused(false)}
                    />
                  ))}

                  <AnimatePresence>
                    {typing && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex"
                      >
                        <div className="flex items-center gap-1 rounded-md rounded-tl-none bg-white px-3 py-2.5 shadow-sm">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="h-1.5 w-1.5 rounded-full bg-neutral-400"
                              animate={{ opacity: [0.25, 1, 0.25] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.16 }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-2 bg-[#f0f2f5] px-3 py-2">
                  <Paperclip size={16} className="text-neutral-400" />
                  <div className="flex-1 rounded-md bg-white px-3 py-1.5 text-[12.5px] text-neutral-400">
                    Escribe un mensaje
                  </div>
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ backgroundColor: WA }}
                  >
                    <Send size={13} className="text-white" />
                  </span>
                </div>
              </div>
            </div>

            {gate && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-center text-[12px] text-neutral-500"
              >
                {gate === "auth"
                  ? "El agente espera la decisión del director."
                  : "Falta la confirmación por monto."}
              </motion.p>
            )}
          </div>

          {/* Panel derecho */}
          <div className="flex-1 space-y-4">
            {/* Teams */}
            <section className="rounded-md border border-neutral-200 bg-white">
              <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-2.5">
                <span
                  className="flex h-5 w-5 items-center justify-center rounded text-[11px] font-bold text-white"
                  style={{ backgroundColor: TEAMS }}
                >
                  T
                </span>
                <p className="text-[13px] font-semibold">Microsoft Teams</p>
                <p className="text-[12px] text-neutral-400">Tabula Rasa › Finanzas</p>
              </div>

              <div className="space-y-3 px-4 py-3.5">
                <div className="flex gap-2.5">
                  <img
                    src="/img/diego/av-ana.jpg"
                    alt="Ana G."
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[12.5px]">
                      <span className="font-semibold">Ana G.</span>{" "}
                      <span className="text-neutral-400">09:02</span>
                    </p>
                    <p className="text-[12.5px] text-neutral-600">
                      Subí la factura de Peniche a Contratos 2026.
                    </p>
                  </div>
                </div>

                <AnimatePresence>
                  {teamsUp && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="flex gap-2.5"
                    >
                      <BotMark size={32} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[12.5px]">
                          <span className="font-semibold">Agente Tabula Rasa</span>{" "}
                          <span className="text-neutral-400">09:14</span>
                        </p>
                        <div
                          className="mt-1 rounded-md border-l-2 border border-neutral-200 bg-neutral-50 px-3 py-2.5"
                          style={{ borderLeftColor: "#0b5c4a" }}
                        >
                          <p className="text-[13px] font-semibold">
                            Pago autorizado · Constructora Peniche
                          </p>
                          <p className="mt-1 text-[12.5px] tabular-nums text-neutral-600">
                            $186,000 MXN · Proyecto Montecristo
                          </p>
                          <p className="mt-1.5 text-[11.5px] text-neutral-500">
                            Autorizó Diego O. desde WhatsApp · registro 09:14:19
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* Log de auditoría */}
            <section className="rounded-md border border-neutral-200 bg-white">
              <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-neutral-400" />
                  <p className="text-[13px] font-semibold">Log de auditoría</p>
                </div>
                <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] tabular-nums text-neutral-500">
                  {audits.length} eventos
                </span>
              </div>

              <div className="divide-y divide-neutral-100">
                {audits.map((a) => (
                  <motion.div
                    key={a.t}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-baseline gap-3 px-4 py-2"
                  >
                    <span className="w-[58px] shrink-0 text-[11.5px] tabular-nums text-neutral-400">
                      {a.t}
                    </span>
                    <span
                      className={`flex-1 text-[12.5px] ${a.hot ? "font-semibold text-emerald-700" : "text-neutral-700"}`}
                    >
                      {a.ev}
                    </span>
                    <span className="w-[62px] shrink-0 text-right text-[11.5px] text-neutral-400">
                      {a.who}
                    </span>
                    <span className="w-[64px] shrink-0 text-right text-[12px] font-medium tabular-nums text-neutral-600">
                      {a.amt ?? ""}
                    </span>
                  </motion.div>
                ))}
              </div>

              <p className="border-t border-neutral-100 px-4 py-2.5 text-[11.5px] text-neutral-500">
                La decisión se escribe acá antes de notificar. Si Teams falla, el registro
                ya existe.
              </p>
            </section>

            {/* Lista blanca */}
            <section className="rounded-md border border-neutral-200 bg-white">
              <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-2.5">
                <ShieldCheck size={14} className="text-neutral-400" />
                <p className="text-[13px] font-semibold">Números autorizados</p>
              </div>
              <div className="divide-y divide-neutral-100">
                {ALLOW.map((p) => (
                  <div key={p.n} className="flex items-center gap-2.5 px-4 py-2.5">
                    <img
                      src={p.img}
                      alt={p.n}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[12.5px] font-medium">{p.n}</p>
                      <p className="text-[11.5px] text-neutral-500">{p.r}</p>
                    </div>
                    <span className="text-[12px] tabular-nums text-neutral-500">{p.tel}</span>
                  </div>
                ))}
              </div>
              <p className="border-t border-neutral-100 px-4 py-2.5 text-[11.5px] text-neutral-500">
                Cualquier número fuera de la lista se ignora y queda registrado. Arriba de
                $50,000 MXN se pide confirmación extra.
              </p>
            </section>
          </div>
        </div>

        <p className="mt-6 border-t border-neutral-300 pt-4 text-[11.5px] leading-relaxed text-neutral-500">
          Boceto funcional del flujo, con datos de ejemplo. Todavía no está conectado al
          Excel real ni a la cuenta de Twilio de Tabula Rasa.
        </p>
      </div>
    </main>
  );
}

function Bubble({
  m,
  gate,
  onApprove,
}: {
  m: Msg;
  gate: string | null;
  onApprove: () => void;
}) {
  const mine = m.from === "me";
  const live = gate === m.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${mine ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[87%] px-2.5 py-2 shadow-sm ${
          mine ? "rounded-md rounded-tr-none" : "rounded-md rounded-tl-none bg-white"
        }`}
        style={mine ? { backgroundColor: WA_OUT } : undefined}
      >
        {m.kind === "text" && (
          <p className="text-[13px] leading-snug whitespace-pre-line">{m.text}</p>
        )}

        {(m.kind === "report" || m.kind === "done") && (
          <div className="w-[248px]">
            <div className="flex items-center gap-1.5">
              {m.kind === "done" && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600">
                  <Check size={11} className="text-white" strokeWidth={3} />
                </span>
              )}
              <p className="text-[13px] font-semibold tracking-tight">{m.title}</p>
            </div>

            <div className="mt-2 space-y-1">
              {m.rows?.map((r) => (
                <div key={r.k} className="flex items-baseline justify-between gap-3">
                  <span className="text-[12px] text-neutral-500">{r.k}</span>
                  <span
                    className={`text-[12.5px] font-medium tabular-nums ${r.hot ? "text-red-600" : ""}`}
                  >
                    {r.v}
                  </span>
                </div>
              ))}
            </div>

            {m.bar !== undefined && (
              <div className="mt-2.5">
                <div className="h-1.5 w-full overflow-hidden rounded-sm bg-neutral-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.bar}%` }}
                    transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-sm"
                    style={{ backgroundColor: WA }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-neutral-500">{m.bar}% del presupuesto</p>
              </div>
            )}

            {m.foot && (
              <p className="mt-2 border-t border-neutral-100 pt-1.5 text-[10.5px] text-neutral-400">
                {m.foot}
              </p>
            )}
          </div>
        )}

        {m.kind === "doc" && m.doc && (
          <div className="w-[248px]">
            <img
              src={m.doc.img}
              alt=""
              className="h-24 w-full rounded-sm object-cover"
            />
            <div className="mt-2 flex items-center gap-2">
              <FileText size={16} className="shrink-0 text-red-600" />
              <div className="min-w-0">
                <p className="truncate text-[12.5px] font-medium">{m.doc.name}</p>
                <p className="text-[11px] text-neutral-500">{m.doc.meta}</p>
              </div>
            </div>
            <p className="mt-1.5 text-[10.5px] text-neutral-400">{m.doc.where}</p>
          </div>
        )}

        {m.kind === "auth" && (
          <div className="w-[248px]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} style={{ color: WA }} />
              <p className="text-[13px] font-semibold tracking-tight">{m.title}</p>
            </div>

            <p className="mt-1.5 text-[22px] leading-none font-extrabold tracking-tight tabular-nums">
              {m.amount}
            </p>

            <div className="mt-2 space-y-1">
              {m.rows?.map((r) => (
                <div key={r.k} className="flex items-baseline justify-between gap-3">
                  <span className="text-[12px] text-neutral-500">{r.k}</span>
                  <span className="text-right text-[12px] font-medium">{r.v}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-neutral-100 pt-2.5">
              <motion.button
                onClick={live ? onApprove : undefined}
                disabled={!live}
                animate={live ? { scale: [1, 1.035, 1] } : { scale: 1 }}
                transition={live ? { duration: 1.5, repeat: Infinity } : undefined}
                className="rounded-md py-1.5 text-[12.5px] font-semibold text-white disabled:opacity-40"
                style={{ backgroundColor: WA }}
              >
                Aprobar
              </motion.button>
              <button
                disabled={!live}
                className="rounded-md border border-neutral-300 py-1.5 text-[12.5px] font-medium text-neutral-600 disabled:opacity-40"
              >
                Rechazar
              </button>
            </div>
          </div>
        )}

        {m.kind === "confirm" && (
          <div className="w-[248px]">
            <div className="flex items-start gap-1.5">
              <Lock size={13} className="mt-0.5 shrink-0 text-amber-600" />
              <p className="text-[12.5px] leading-snug">{m.text}</p>
            </div>
            <motion.button
              onClick={live ? onApprove : undefined}
              disabled={!live}
              animate={live ? { scale: [1, 1.035, 1] } : { scale: 1 }}
              transition={live ? { duration: 1.5, repeat: Infinity } : undefined}
              className="mt-2.5 w-full rounded-md py-1.5 text-[12.5px] font-semibold tracking-wide text-white disabled:opacity-40"
              style={{ backgroundColor: WA }}
            >
              CONFIRMAR
            </motion.button>
          </div>
        )}

        <div className="mt-1 flex items-center justify-end gap-1">
          <span className="text-[10px] text-neutral-400">{m.time}</span>
          {mine && <Ticks />}
        </div>
      </div>
    </motion.div>
  );
}
