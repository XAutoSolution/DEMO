"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, MapPin, Plus, Search, Store, Tractor, X } from "lucide-react";
import { TypeToggle } from "@/components/ui/type-toggle";
import { ListingCard, type Listing } from "@/components/ui/listing-card";
import { StepForm, type Step } from "@/components/ui/step-form";
import {
  cardIn,
  overlayIn,
  panelIn,
  staggerGrid,
} from "@/components/motion/presets";

type Tipo = "maquinaria" | "traspasos";

const ACCENT: Record<Tipo, string> = {
  maquinaria: "#0f766e",
  traspasos: "#b45309",
};

const ICON: Record<Tipo, React.ReactNode> = {
  maquinaria: <Tractor size={44} strokeWidth={1.4} />,
  traspasos: <Store size={44} strokeWidth={1.4} />,
};

const DATA: Record<Tipo, Listing[]> = {
  maquinaria: [
    {
      id: "m1",
      title: "Excavadora Caterpillar 320",
      price: "68.500 €",
      location: "Zaragoza",
      badge: "Maquinaria",
      accent: ACCENT.maquinaria,
      icon: ICON.maquinaria,
      description:
        "Excavadora de cadenas revisada, mantenimiento al día y listo para obra.",
      specs: [
        { label: "Año", value: "2019" },
        { label: "Horas de uso", value: "4.200 h" },
        { label: "Estado", value: "Muy bueno" },
        { label: "Potencia", value: "122 kW" },
      ],
    },
    {
      id: "m2",
      title: "Tractor John Deere 6110M",
      price: "42.900 €",
      location: "Lleida",
      badge: "Maquinaria",
      accent: ACCENT.maquinaria,
      icon: ICON.maquinaria,
      description:
        "Tractor agrícola con pocas horas, transmisión PowrQuad y cabina completa.",
      specs: [
        { label: "Año", value: "2021" },
        { label: "Horas de uso", value: "1.850 h" },
        { label: "Estado", value: "Como nuevo" },
        { label: "Potencia", value: "110 CV" },
      ],
    },
    {
      id: "m3",
      title: "Retroexcavadora JCB 3CX",
      price: "31.200 €",
      location: "Sevilla",
      badge: "Maquinaria",
      accent: ACCENT.maquinaria,
      icon: ICON.maquinaria,
      description:
        "Mixta polivalente para construcción, neumáticos nuevos y martillo incluido.",
      specs: [
        { label: "Año", value: "2017" },
        { label: "Horas de uso", value: "6.900 h" },
        { label: "Estado", value: "Bueno" },
        { label: "Potencia", value: "74 kW" },
      ],
    },
  ],
  traspasos: [
    {
      id: "t1",
      title: "Bar-Cafetería en Malasaña",
      price: "45.000 €",
      location: "Madrid",
      badge: "Traspaso",
      accent: ACCENT.traspasos,
      icon: ICON.traspasos,
      description:
        "Local en zona de máximo paso, licencia de cocina y terraza autorizada.",
      specs: [
        { label: "Superficie", value: "85 m²" },
        { label: "Alquiler", value: "1.900 €/mes" },
        { label: "Facturación", value: "22.000 €/mes" },
        { label: "Motivo", value: "Jubilación" },
      ],
    },
    {
      id: "t2",
      title: "Peluquería en Chamberí",
      price: "18.500 €",
      location: "Madrid",
      badge: "Traspaso",
      accent: ACCENT.traspasos,
      icon: ICON.traspasos,
      description:
        "Salón reformado con clientela fija, 5 puestos y reserva online activa.",
      specs: [
        { label: "Superficie", value: "60 m²" },
        { label: "Alquiler", value: "1.200 €/mes" },
        { label: "Facturación", value: "9.500 €/mes" },
        { label: "Motivo", value: "Cambio de ciudad" },
      ],
    },
    {
      id: "t3",
      title: "Restaurante en Gràcia",
      price: "72.000 €",
      location: "Barcelona",
      badge: "Traspaso",
      accent: ACCENT.traspasos,
      icon: ICON.traspasos,
      description:
        "Restaurante de 12 mesas, cocina equipada y buenas reseñas consolidadas.",
      specs: [
        { label: "Superficie", value: "120 m²" },
        { label: "Alquiler", value: "2.600 €/mes" },
        { label: "Facturación", value: "38.000 €/mes" },
        { label: "Motivo", value: "Nuevo proyecto" },
      ],
    },
  ],
};

const FILTERS: Record<Tipo, string[]> = {
  maquinaria: ["Agrícola", "Construcción", "Menos de 5.000 h", "Cerca de mí"],
  traspasos: ["Hostelería", "Belleza", "Retail", "Menos de 50.000 €"],
};

const STEPS: Record<Tipo, Step[]> = {
  maquinaria: [
    {
      title: "Tipo y datos",
      fields: [
        {
          label: "Tipo de máquina",
          type: "select",
          options: ["Excavadora", "Tractor", "Retroexcavadora", "Otro"],
        },
        { label: "Marca y modelo", placeholder: "Ej. Caterpillar 320" },
        { label: "Año", placeholder: "2019" },
      ],
    },
    {
      title: "Detalles",
      fields: [
        { label: "Horas de uso", placeholder: "4.200 h" },
        {
          label: "Estado",
          type: "select",
          options: ["Como nuevo", "Muy bueno", "Bueno", "Para reparar"],
        },
        { label: "Ubicación", placeholder: "Zaragoza" },
      ],
    },
    {
      title: "Precio y fotos",
      fields: [
        { label: "Precio", placeholder: "68.500 €" },
        { label: "Fotos", type: "file" },
        { label: "Descripción", type: "textarea", placeholder: "Cuéntanos más…" },
      ],
    },
  ],
  traspasos: [
    {
      title: "Tipo y datos",
      fields: [
        {
          label: "Tipo de negocio",
          type: "select",
          options: ["Bar-Cafetería", "Restaurante", "Peluquería", "Retail", "Otro"],
        },
        { label: "Nombre del local", placeholder: "Ej. Bar Malasaña" },
        { label: "Zona", placeholder: "Madrid centro" },
      ],
    },
    {
      title: "Detalles",
      fields: [
        { label: "Metros cuadrados", placeholder: "85 m²" },
        { label: "Alquiler mensual", placeholder: "1.900 €/mes" },
        { label: "Facturación mensual", placeholder: "22.000 €/mes" },
      ],
    },
    {
      title: "Precio y motivo",
      fields: [
        { label: "Precio del traspaso", placeholder: "45.000 €" },
        { label: "Fotos", type: "file" },
        {
          label: "Motivo del traspaso",
          type: "textarea",
          placeholder: "Ej. Jubilación",
        },
      ],
    },
  ],
};

export default function RelevoMarketDemo() {
  const [tipo, setTipo] = useState<Tipo>("maquinaria");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Listing | null>(null);
  const [publishing, setPublishing] = useState(false);
  const accent = ACCENT[tipo];

  const listings = useMemo(() => {
    const base = DATA[tipo];
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.specs.some((s) => s.value.toLowerCase().includes(q))
    );
  }, [tipo, query]);

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-white"
              style={{ backgroundColor: accent }}
            >
              R
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Relevo Market
            </span>
          </div>
          <button
            onClick={() => setPublishing(true)}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white transition-transform active:scale-95"
            style={{ backgroundColor: accent }}
          >
            <Plus size={16} /> Publicar anuncio
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TypeToggle
            options={[
              { value: "maquinaria", label: "Maquinaria" },
              { value: "traspasos", label: "Traspasos" },
            ]}
            value={tipo}
            onChange={(v) => {
              setTipo(v);
              setQuery("");
            }}
            accent={accent}
          />
          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre o ciudad…"
              className="w-full rounded-full border border-neutral-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-neutral-400"
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          <AnimatePresence mode="popLayout">
            {FILTERS[tipo].map((f) => (
              <motion.span
                key={`${tipo}-${f}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.18 }}
                className="cursor-pointer rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 hover:border-neutral-400"
              >
                {f}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* Catalog grid */}
        <div className="mt-6 text-sm text-neutral-500">
          {listings.length} anuncios ·{" "}
          <span className="font-medium" style={{ color: accent }}>
            {tipo === "maquinaria" ? "Maquinaria" : "Traspasos"}
          </span>{" "}
          — misma tarjeta, cambian los campos según el tipo
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tipo}
            variants={staggerGrid}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {listings.map((l) => (
              <motion.button
                key={l.id}
                variants={cardIn}
                whileHover={{ y: -4 }}
                onClick={() => setSelected(l)}
                className="text-left"
              >
                <ListingCard listing={l} />
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>

        {listings.length === 0 && (
          <p className="mt-10 text-center text-sm text-neutral-400">
            No hay resultados para “{query}”.
          </p>
        )}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            variants={overlayIn}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6"
          >
            <motion.div
              variants={panelIn}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg overflow-hidden rounded-t-2xl bg-white sm:rounded-2xl"
            >
              <div
                className="relative flex h-44 items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${selected.accent}22, ${selected.accent}0a)`,
                }}
              >
                <div style={{ color: selected.accent }}>{selected.icon}</div>
                <span
                  className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: selected.accent }}
                >
                  {selected.badge}
                </span>
                <button
                  onClick={() => setSelected(null)}
                  className="absolute right-4 top-4 rounded-full bg-white/80 p-1.5 text-neutral-600 hover:bg-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold">{selected.title}</h2>
                <p className="mt-1 flex items-center gap-1 text-sm text-neutral-500">
                  <MapPin size={14} /> {selected.location}
                </p>
                <div
                  className="mt-3 text-2xl font-bold"
                  style={{ color: selected.accent }}
                >
                  {selected.price}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  {selected.description}
                </p>

                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl bg-neutral-50 p-4 text-sm">
                  {selected.specs.map((s) => (
                    <div key={s.label}>
                      <dt className="text-xs text-neutral-400">{s.label}</dt>
                      <dd className="font-medium text-neutral-800">{s.value}</dd>
                    </div>
                  ))}
                </dl>

                {/* Contact gated until login — the marketplace blind-spot feature */}
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-white p-4">
                  <Lock size={18} className="text-neutral-400" />
                  <p className="text-sm text-neutral-500">
                    El teléfono y correo del propietario se muestran al{" "}
                    <span className="font-semibold text-neutral-700">
                      iniciar sesión
                    </span>
                    .
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Publish flow */}
      <AnimatePresence>
        {publishing && (
          <motion.div
            variants={overlayIn}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={() => setPublishing(false)}
            className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6"
          >
            <motion.div
              variants={panelIn}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-t-2xl bg-white p-6 sm:rounded-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Publicar anuncio</h2>
                <button
                  onClick={() => setPublishing(false)}
                  className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="mb-4">
                <TypeToggle
                  options={[
                    { value: "maquinaria", label: "Maquinaria" },
                    { value: "traspasos", label: "Traspasos" },
                  ]}
                  value={tipo}
                  onChange={setTipo}
                  accent={accent}
                />
              </div>
              {/* Same form shell, fields swap by type */}
              <StepForm key={tipo} steps={STEPS[tipo]} accent={accent} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
