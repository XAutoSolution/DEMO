import {
  SketchArrow,
  SketchBox,
  SketchFilter,
  SketchNote,
  SketchPaper,
} from "@/components/sketch/sketch";

// Boceto "à mão" da loja de hortifruti da Laura. Mesmo kit de todo sketch;
// só muda a cena. Caixas sólidas = Fase 1, caixa tracejada = Fase 2,
// caneta vermelha = a única sacada que o cliente tem que captar:
// um só card pra produto por kg e por unidade — muda o cálculo, não a tela.
export default function LauraHortifrutiSketch() {
  return (
    <SketchPaper>
      <svg viewBox="0 0 960 600" className="h-auto w-full">
        <defs>
          <SketchFilter />
        </defs>

        {/* Título */}
        <text
          x="40"
          y="50"
          fontFamily="Caveat, cursive"
          fontSize={38}
          fontWeight={700}
          fill="#1f2937"
        >
          Feira Fresca — como a loja se encaixa
        </text>

        {/* Fase 1 */}
        <text x="48" y="98" fontFamily="Kalam, cursive" fontSize={17} fontWeight={700} fill="#0f766e">
          Fase 1
        </text>

        {/* Fonte de dados */}
        <SketchBox x={46} y={150} w={200} h={92} title="Dados de produto" sub="(sua API / base)" />

        {/* Componentes compartilhados */}
        <SketchBox x={400} y={132} w={234} h={72} title="Card de produto" sub="reusável" />
        <SketchBox x={400} y={256} w={234} h={64} title="Catálogo + busca" />
        <SketchBox x={400} y={356} w={234} h={64} title="Carrinho" sub="(tempo real)" />

        {/* Fluxo */}
        <SketchArrow x1={248} y1={196} x2={396} y2={172} seed={0} />
        <SketchArrow x1={517} y1={206} x2={517} y2={252} seed={1} />
        <SketchArrow x1={517} y1={322} x2={517} y2={352} seed={2} />

        {/* Chave vermelha: um card, cálculo muda por tipo */}
        <path
          d="M640 138 q11 2 11 15 v9 q0 13 12 15 q-12 2 -12 15 v9 q0 13 -11 15"
          fill="none"
          stroke="#c0392b"
          strokeWidth={2.2}
          filter="url(#rough-wobble)"
        />
        <SketchNote
          x={676}
          y={150}
          lines={[
            "1 só card pra tudo —",
            "fruta por kg, verdura",
            "por unidade. Muda o",
            "cálculo, não a tela.",
          ]}
        />

        {/* SEO em verde perto do catálogo */}
        <SketchNote
          x={660}
          y={286}
          color="#0f766e"
          size={16}
          font="Kalam"
          lines={["cada produto vira", "página própria → Google acha"]}
        />

        {/* Nota vermelha de sequenciamento (margem) */}
        <SketchNote
          x={46}
          y={306}
          size={23}
          lines={[
            "Primeiro catálogo +",
            "carrinho de pé com",
            "seus dados. Pagamento",
            "é a Fase 2.",
          ]}
        />
        <SketchArrow x1={252} y1={386} x2={392} y2={392} color="#c0392b" seed={5} />

        {/* Fase 2 tracejada */}
        <text x="402" y="452" fontFamily="Kalam, cursive" fontSize={17} fontWeight={700} fill="#9ca3af">
          Fase 2
        </text>
        <SketchArrow x1={517} y1={420} x2={517} y2={458} color="#9ca3af" seed={4} />
        <SketchBox x={400} y={462} w={234} h={58} title="Checkout + pagamento" dashed color="#9ca3af" />
      </svg>
    </SketchPaper>
  );
}
