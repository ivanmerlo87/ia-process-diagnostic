"use client";

import { useMemo, useState } from "react";

type CompanySize = "micro" | "pyme" | "midmarket" | "enterprise";
type ProcessArea = "ventas" | "operaciones" | "atencion" | "administracion";
type DataReadiness = "baja" | "media" | "alta";
type Urgency = "baja" | "media" | "alta";
type Pain =
  | "demoras"
  | "errores"
  | "seguimiento"
  | "carga-manual"
  | "info-dispersa"
  | "dependencia-personas";

type Inputs = {
  companySize: CompanySize;
  processArea: ProcessArea;
  peopleInvolved: number;
  weeklyHoursLost: number;
  monthlyVolume: number;
  averageTicketUsd: number;
  systemsConnected: number;
  dataReadiness: DataReadiness;
  urgency: Urgency;
  pains: Pain[];
};

const initialState: Inputs = {
  companySize: "pyme",
  processArea: "operaciones",
  peopleInvolved: 3,
  weeklyHoursLost: 18,
  monthlyVolume: 320,
  averageTicketUsd: 120,
  systemsConnected: 2,
  dataReadiness: "media",
  urgency: "alta",
  pains: ["demoras", "carga-manual", "info-dispersa"],
};

const companySizeLabel: Record<CompanySize, string> = {
  micro: "1 a 10 personas",
  pyme: "11 a 50 personas",
  midmarket: "51 a 250 personas",
  enterprise: "250+ personas",
};

const processLabel: Record<ProcessArea, string> = {
  ventas: "Ventas y follow-up",
  operaciones: "Operaciones",
  atencion: "Atención al cliente",
  administracion: "Administración",
};

const dataReadinessLabel: Record<DataReadiness, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
};

const urgencyLabel: Record<Urgency, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
};

const painLabels: Record<Pain, string> = {
  demoras: "Demoras y cuellos de botella",
  errores: "Errores frecuentes",
  seguimiento: "Falta de seguimiento",
  "carga-manual": "Carga manual repetitiva",
  "info-dispersa": "Información dispersa",
  "dependencia-personas": "Dependencia de personas clave",
};

function currency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)));
}

function number(value: number) {
  return new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 1,
  }).format(value);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function DiagnosticStudio() {
  const [inputs, setInputs] = useState<Inputs>(initialState);

  const results = useMemo(() => {
    const readinessScore =
      inputs.dataReadiness === "alta" ? 18 : inputs.dataReadiness === "media" ? 12 : 6;
    const urgencyScore =
      inputs.urgency === "alta" ? 15 : inputs.urgency === "media" ? 9 : 4;
    const hoursScore = clamp(inputs.weeklyHoursLost * 1.4, 0, 28);
    const volumeScore = clamp(inputs.monthlyVolume / 18, 0, 18);
    const painsScore = clamp(inputs.pains.length * 4, 0, 16);
    const systemsScore = clamp(inputs.systemsConnected * 2.5, 0, 10);
    const totalScore = Math.round(
      readinessScore + urgencyScore + hoursScore + volumeScore + painsScore + systemsScore,
    );

    const automationPotential =
      inputs.processArea === "atencion"
        ? 0.62
        : inputs.processArea === "ventas"
          ? 0.48
          : inputs.processArea === "administracion"
            ? 0.58
            : 0.54;

    const monthlyHoursRecoverable = inputs.weeklyHoursLost * 4.2 * automationPotential;
    const hourlyValue = Math.max(8, inputs.averageTicketUsd * 0.07);
    const monthlyValue = monthlyHoursRecoverable * hourlyValue;

    const useCases = buildUseCases(inputs, totalScore);
    const track =
      totalScore >= 78
        ? "Quick win comercializable"
        : totalScore >= 58
          ? "Diagnóstico con alto potencial"
          : "Caso posible, pero necesita orden"
      ;
    const nextStep =
      totalScore >= 78
        ? "Conviene mapear el proceso esta semana y definir un piloto corto."
        : totalScore >= 58
          ? "Conviene hacer un diagnóstico guiado para despejar datos, actores y fricciones."
          : "Antes de automatizar conviene ordenar información, responsable y flujo base."
      ;

    return {
      totalScore: clamp(totalScore, 0, 100),
      monthlyHoursRecoverable,
      monthlyValue,
      useCases,
      track,
      nextStep,
    };
  }, [inputs]);

  const whatsappText = encodeURIComponent(
    [
      "Hola Ivan, usé el diagnóstico de procesos con IA.",
      `Área: ${processLabel[inputs.processArea]}.`,
      `Tamaño: ${companySizeLabel[inputs.companySize]}.`,
      `Horas perdidas por semana: ${number(inputs.weeklyHoursLost)}.`,
      `Volumen mensual: ${number(inputs.monthlyVolume)}.`,
      `Score del diagnóstico: ${results.totalScore}/100.`,
      `Track sugerido: ${results.track}.`,
      `Uso más prometedor: ${results.useCases[0]}.`,
    ].join(" "),
  );

  function setField<K extends keyof Inputs>(field: K, value: Inputs[K]) {
    setInputs((current) => ({ ...current, [field]: value }));
  }

  function togglePain(pain: Pain) {
    setInputs((current) => ({
      ...current,
      pains: current.pains.includes(pain)
        ? current.pains.filter((item) => item !== pain)
        : [...current.pains, pain],
    }));
  }

  return (
    <section className="diagnostic-shell">
      <div className="builder-card">
        <div className="panel-head">
          <p className="eyebrow">Diagnóstico guiado</p>
          <h2>Mapeá el proceso antes de hablar de herramientas</h2>
          <p>
            Esta herramienta ordena señal comercial real: fricción, volumen,
            urgencia y preparación operativa.
          </p>
        </div>

        <div className="field-cluster">
          <label>
            <span>Tamaño de la empresa</span>
            <select
              value={inputs.companySize}
              onChange={(event) =>
                setField("companySize", event.target.value as CompanySize)
              }
            >
              <option value="micro">1 a 10 personas</option>
              <option value="pyme">11 a 50 personas</option>
              <option value="midmarket">51 a 250 personas</option>
              <option value="enterprise">250+ personas</option>
            </select>
          </label>

          <label>
            <span>Área más afectada</span>
            <select
              value={inputs.processArea}
              onChange={(event) =>
                setField("processArea", event.target.value as ProcessArea)
              }
            >
              <option value="ventas">Ventas y follow-up</option>
              <option value="operaciones">Operaciones</option>
              <option value="atencion">Atención al cliente</option>
              <option value="administracion">Administración</option>
            </select>
          </label>
        </div>

        <div className="slider-grid">
          <RangeField
            label="Personas involucradas"
            min={1}
            max={15}
            step={1}
            value={inputs.peopleInvolved}
            onChange={(value) => setField("peopleInvolved", value)}
          />
          <RangeField
            label="Horas perdidas por semana"
            min={1}
            max={60}
            step={1}
            value={inputs.weeklyHoursLost}
            onChange={(value) => setField("weeklyHoursLost", value)}
          />
          <RangeField
            label="Volumen mensual del proceso"
            min={20}
            max={2000}
            step={10}
            value={inputs.monthlyVolume}
            onChange={(value) => setField("monthlyVolume", value)}
          />
          <RangeField
            label="Valor económico promedio por caso (USD)"
            min={20}
            max={1000}
            step={10}
            value={inputs.averageTicketUsd}
            onChange={(value) => setField("averageTicketUsd", value)}
          />
          <RangeField
            label="Sistemas que hoy intervienen"
            min={1}
            max={8}
            step={1}
            value={inputs.systemsConnected}
            onChange={(value) => setField("systemsConnected", value)}
          />
        </div>

        <div className="field-cluster">
          <label>
            <span>Calidad y disponibilidad de datos</span>
            <select
              value={inputs.dataReadiness}
              onChange={(event) =>
                setField("dataReadiness", event.target.value as DataReadiness)
              }
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </label>

          <label>
            <span>Urgencia del problema</span>
            <select
              value={inputs.urgency}
              onChange={(event) => setField("urgency", event.target.value as Urgency)}
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </label>
        </div>

        <div className="pain-section">
          <span>Principales dolores del proceso</span>
          <div className="chip-grid">
            {(Object.keys(painLabels) as Pain[]).map((pain) => {
              const active = inputs.pains.includes(pain);

              return (
                <button
                  key={pain}
                  type="button"
                  className={active ? "chip active" : "chip"}
                  onClick={() => togglePain(pain)}
                >
                  {painLabels[pain]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="results-card">
        <div className="score-ring">
          <span>Score</span>
          <strong>{results.totalScore}</strong>
          <small>/ 100</small>
        </div>

        <div className="results-grid">
          <article>
            <span>Horas recuperables / mes</span>
            <strong>{number(results.monthlyHoursRecoverable)}</strong>
          </article>
          <article>
            <span>Valor económico / mes</span>
            <strong>{currency(results.monthlyValue)}</strong>
          </article>
        </div>

        <div className="result-callout">
          <span>Track recomendado</span>
          <strong>{results.track}</strong>
          <p>{results.nextStep}</p>
        </div>

        <div className="playbook-card">
          <span>Casos con más lógica</span>
          <ul>
            {results.useCases.map((useCase) => (
              <li key={useCase}>{useCase}</li>
            ))}
          </ul>
        </div>

        <div className="snapshot-card">
          <span>Lectura rápida</span>
          <ul>
            <li>Área: {processLabel[inputs.processArea]}</li>
            <li>Tamaño: {companySizeLabel[inputs.companySize]}</li>
            <li>Datos: {dataReadinessLabel[inputs.dataReadiness]}</li>
            <li>Urgencia: {urgencyLabel[inputs.urgency]}</li>
          </ul>
        </div>

        <a
          className="cta-button"
          href={`https://wa.me/5491123963538?text=${whatsappText}`}
          target="_blank"
          rel="noreferrer"
        >
          Enviar diagnóstico por WhatsApp
        </a>
      </aside>
    </section>
  );
}

function RangeField({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="range-field">
      <span>{label}</span>
      <div className="range-meta">
        <strong>{number(value)}</strong>
        <small>
          {number(min)} - {number(max)}
        </small>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function buildUseCases(inputs: Inputs, score: number) {
  const baseByArea: Record<ProcessArea, string[]> = {
    ventas: [
      "Asistente de follow-up comercial con priorización de leads",
      "Resumen automático de reuniones y próximos pasos",
      "Calificación inicial de consultas y derivación a ventas",
    ],
    operaciones: [
      "Orquestación de tareas repetitivas entre sistemas",
      "Copiloto operativo para validación y control de desvíos",
      "Extracción automática de datos desde mails, PDFs o formularios",
    ],
    atencion: [
      "Asistente de atención inicial en WhatsApp con triage",
      "Base de respuestas y resolución guiada por contexto",
      "Escalamiento automático de casos sensibles o urgentes",
    ],
    administracion: [
      "Carga documental y conciliación asistida",
      "Validación automática de comprobantes o legajos",
      "Copiloto interno para consultas repetitivas del equipo",
    ],
  };

  const results = [...baseByArea[inputs.processArea]];

  if (inputs.pains.includes("info-dispersa")) {
    results.unshift("Buscador interno con IA sobre documentos, políticas y conversaciones");
  }

  if (inputs.pains.includes("seguimiento")) {
    results.unshift("Motor de seguimiento con alertas y próximos pasos sugeridos");
  }

  if (score < 58) {
    results.push("Diagnóstico de proceso y datos antes de automatizar");
  }

  return results.slice(0, 4);
}
