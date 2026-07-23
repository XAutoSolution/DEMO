import {
  SketchArrow,
  SketchBox,
  SketchFilter,
  SketchNote,
  SketchPaper,
} from "@/components/sketch/sketch";

// Boceto a mano del agente de Tabula Rasa. Mismo kit que todo sketch, sólo
// cambia la escena. Caneta roja = las dos decisiones que definen el proyecto:
// (1) permisos de aplicación para que el informe de las 7 salga solo,
// (2) el log de auditoría es la fuente de verdad, Teams sólo avisa.
export default function DiegoAgenteSketch() {
  return (
    <SketchPaper>
      <svg viewBox="0 0 960 550" className="h-auto w-full">
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
          Agente Tabula Rasa - cómo queda armado
        </text>

        {/* Piezas */}
        <SketchBox x={40} y={216} w={196} h={96} title="WhatsApp" sub="vía Twilio" />
        <SketchBox x={350} y={210} w={254} h={110} title="Agente" sub="Flask + Claude" />
        <SketchBox x={700} y={96} w={222} h={88} title="Excel" sub="en SharePoint" />
        <SketchBox x={700} y={330} w={222} h={80} title="Teams" sub="aviso al equipo" />
        <SketchBox
          x={350}
          y={430}
          w={254}
          h={82}
          title="Log de auditoría"
          sub="fecha, hora, usuario"
        />

        {/* Flujo */}
        <SketchArrow x1={240} y1={244} x2={344} y2={240} seed={0} />
        <SketchArrow x1={344} y1={292} x2={240} y2={296} seed={1} />
        <SketchArrow x1={610} y1={236} x2={694} y2={178} seed={2} />
        <SketchArrow x1={610} y1={300} x2={694} y2={348} seed={3} />
        <SketchArrow x1={477} y1={326} x2={477} y2={424} seed={4} />

        {/* El informe automático */}
        <SketchNote
          x={568}
          y={142}
          color="#0f766e"
          size={16}
          font="Kalam"
          lines={["7:00 AM ->", "informe diario"]}
        />

        {/* Clave roja 1: permisos de aplicación */}
        <SketchNote
          x={648}
          y={238}
          size={20}
          lines={[
            "permisos de aplicación,",
            "no delegados: el informe",
            "de las 7 sale sin que",
            "nadie tenga sesión abierta",
          ]}
        />
        <SketchArrow x1={702} y1={222} x2={748} y2={194} color="#c0392b" seed={5} />

        {/* Seguridad */}
        <SketchNote
          x={44}
          y={344}
          color="#6b7280"
          size={16}
          font="Kalam"
          lines={["lista blanca de números", "+ confirmación arriba", "de $50,000 MXN"]}
        />

        {/* Clave roja 2: fuente de verdad */}
        <SketchNote
          x={44}
          y={436}
          size={21}
          lines={["la decisión se guarda acá", "primero. Teams sólo avisa."]}
        />
        <SketchArrow x1={278} y1={466} x2={344} y2={470} color="#c0392b" seed={6} />

        {/* Orden de trabajo */}
        <SketchNote
          x={650}
          y={462}
          color="#6b7280"
          size={16}
          font="Kalam"
          lines={[
            "orden: primero la conexión",
            "de datos, después las lecturas,",
            "al final las autorizaciones",
          ]}
        />
      </svg>
    </SketchPaper>
  );
}
