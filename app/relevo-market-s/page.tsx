import {
  SketchArrow,
  SketchBox,
  SketchFilter,
  SketchNote,
  SketchPaper,
} from "@/components/sketch/sketch";

// Hand-drawn "boceto" of the Relevo Market architecture. Same reusable kit as
// every sketch demo; only the scene changes. Solid boxes = Fase 1 core,
// dashed box = Fase 2, red pen = the one insight the client should catch:
// one component reused by type, fields swap — not two parallel screens.
export default function RelevoSketch() {
  return (
    <SketchPaper>
      <svg viewBox="0 0 980 660" className="h-auto w-full">
        <defs>
          <SketchFilter />
        </defs>

        {/* Title */}
        <text
          x="42"
          y="54"
          fontFamily="Caveat, cursive"
          fontSize={40}
          fontWeight={700}
          fill="#1f2937"
        >
          Relevo Market — cómo encaja la estructura
        </text>

        {/* Fase 1 caption */}
        <text
          x="52"
          y="112"
          fontFamily="Kalam, cursive"
          fontSize={17}
          fontWeight={700}
          fill="#0f766e"
        >
          Fase 1
        </text>

        {/* Source data types */}
        <SketchBox x={50} y={128} w={200} h={80} title="Maquinaria" sub="(tu base actual)" />
        <SketchBox x={50} y={250} w={200} h={80} title="Traspasos" sub="(base nueva)" />

        {/* Shared, reusable components */}
        <SketchBox x={440} y={120} w={230} h={62} title="Tarjeta reusable" />
        <SketchBox x={440} y={205} w={230} h={62} title="Ficha de detalle" />
        <SketchBox x={440} y={290} w={230} h={62} title="Formulario 3 pasos" />

        {/* Both types feed the same components */}
        <SketchArrow x1={252} y1={162} x2={436} y2={150} seed={0} />
        <SketchArrow x1={252} y1={200} x2={436} y2={232} seed={2} />
        <SketchArrow x1={252} y1={292} x2={436} y2={236} seed={1} />
        <SketchArrow x1={252} y1={318} x2={436} y2={318} seed={3} />

        {/* Red brace + the key insight */}
        <path
          d="M686 122 q12 2 12 16 v70 q0 14 13 16 q-13 2 -13 16 v70 q0 14 -12 16"
          fill="none"
          stroke="#c0392b"
          strokeWidth={2.2}
          filter="url(#rough-wobble)"
        />
        <SketchNote
          x={720}
          y={200}
          lines={[
            "1 solo componente,",
            "reutilizado por tipo —",
            "cambian los campos,",
            "no las pantallas",
          ]}
        />

        {/* Fase 2 caption + dashed box */}
        <text
          x="442"
          y="408"
          fontFamily="Kalam, cursive"
          fontSize={17}
          fontWeight={700}
          fill="#9ca3af"
        >
          Fase 2
        </text>
        <SketchArrow x1={555} y1={352} x2={555} y2={420} color="#9ca3af" seed={4} />
        <SketchBox
          x={440}
          y={422}
          w={230}
          h={62}
          title="Pagos + Analytics"
          dashed
          color="#9ca3af"
        />

        {/* Bottom-left red margin note = the sequencing plan */}
        <SketchNote
          x={54}
          y={398}
          size={25}
          lines={[
            "Primero valido el componente",
            "contra tu base de Maquinaria,",
            "luego lo extiendo a Traspasos.",
          ]}
        />
        <SketchArrow x1={150} y1={480} x2={150} y2={520} color="#c0392b" seed={5} />
        <SketchNote
          x={54}
          y={556}
          size={22}
          lines={["Si mañana sumas un 3er tipo,", "la estructura ya está lista."]}
        />
      </svg>
    </SketchPaper>
  );
}
