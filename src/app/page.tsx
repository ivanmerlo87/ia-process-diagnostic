import type { Metadata } from "next";
import { DiagnosticStudio } from "@/components/diagnostic-studio";

const appUrl = "https://diagnostico.iaaplicada.ar";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Diagnóstico de Procesos con IA | IA Aplicada Argentina",
  description:
    "Evaluá procesos, fricciones y potencial de automatización con IA en una herramienta práctica pensada para empresas argentinas.",
  keywords: [
    "diagnostico de procesos con ia",
    "evaluacion de automatizacion con ia",
    "automatizacion con ia",
    "automatizacion de procesos",
    "ia para empresas",
    "consultoria ia argentina",
  ],
  openGraph: {
    title: "Diagnóstico de Procesos con IA",
    description:
      "Una herramienta guiada para detectar quick wins, cuellos de botella y casos de uso concretos para IA.",
    url: appUrl,
    type: "website",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diagnóstico de Procesos con IA",
    description:
      "Mapeá fricciones, volumen y casos con más lógica antes de avanzar con una automatización.",
  },
  alternates: {
    canonical: appUrl,
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué devuelve este diagnóstico?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Entrega un score de oportunidad, un track recomendado, estimación de horas recuperables y una lista de casos de uso concretos para priorizar.",
      },
    },
    {
      "@type": "Question",
      name: "¿Para qué tipo de empresas sirve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sirve como primera evaluación para empresas con fricción repetitiva en ventas, operaciones, atención o administración, especialmente cuando hay mucho trabajo manual y seguimiento disperso.",
      },
    },
    {
      "@type": "Question",
      name: "¿Reemplaza un diagnóstico comercial o técnico?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Ordena la señal inicial para decidir si vale la pena pasar a un diagnóstico real de proceso, integración y factibilidad.",
      },
    },
  ],
};

export default function Home() {
  return (
    <main className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="hero hero-single">
        <div className="hero-copy">
          <p className="eyebrow">IA Aplicada Argentina</p>
          <h1>Diagnóstico de procesos con IA para detectar quick wins reales</h1>
          <p className="lede">
            En vez de arrancar por herramientas, arrancá por el proceso. Esta
            app evalúa volumen, fricción, urgencia y preparación operativa para
            mostrar dónde una automatización con IA sí tiene sentido.
          </p>
          <div className="signal-grid">
            <div>
              <strong>Score de oportunidad</strong>
              <span>Una lectura rápida sobre qué tan viable es avanzar.</span>
            </div>
            <div>
              <strong>Casos sugeridos</strong>
              <span>Ideas concretas según área, dolor y volumen.</span>
            </div>
            <div>
              <strong>CTA con contexto</strong>
              <span>El resultado sale listo para pasar a WhatsApp.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="tool-band">
        <DiagnosticStudio />
      </section>

      <section className="content-band">
        <div className="section-heading">
          <p className="eyebrow">Cómo usarla</p>
          <h2>No exagera. Ordena la señal antes de invertir tiempo.</h2>
        </div>
        <div className="card-grid">
          <article className="info-card">
            <h3>1. Elegí un proceso con dolor</h3>
            <p>
              Atención, seguimiento comercial, carga administrativa, operaciones
              o cualquier circuito donde hoy haya demoras, desorden o retrabajo.
            </p>
          </article>
          <article className="info-card">
            <h3>2. Cargá volumen y preparación</h3>
            <p>
              Horas perdidas, volumen, sistemas involucrados, calidad de datos
              y urgencia. Eso define si hay quick win o solo una idea linda.
            </p>
          </article>
          <article className="info-card">
            <h3>3. Mirá el track sugerido</h3>
            <p>
              La salida no es “comprar IA”. Es decidir si conviene pilotear,
              diagnosticar mejor o primero ordenar el proceso.
            </p>
          </article>
        </div>
      </section>

      <section className="content-band subtle">
        <div className="section-heading">
          <p className="eyebrow">Qué mira el diagnóstico</p>
          <h2>Las variables que más separan una oportunidad real de una moda</h2>
        </div>
        <div className="list-layout">
          <div className="info-card">
            <h3>Volumen + frecuencia</h3>
            <p>
              Si el flujo ocurre mucho y siempre molesta, hay base para pensar
              automatización. Si pasa poco, probablemente no.
            </p>
          </div>
          <div className="info-card">
            <h3>Datos y sistemas</h3>
            <p>
              La herramienta también mira si el proceso está mínimamente
              ordenado o si todavía depende demasiado de personas sueltas.
            </p>
          </div>
          <div className="info-card">
            <h3>Urgencia comercial</h3>
            <p>
              Un problema crítico con dueño claro vale más que una idea
              elegante sin urgencia ni sponsor interno.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div>
          <p className="eyebrow">Siguiente paso</p>
          <h2>Si el score da bien, el siguiente paso es bajar el caso a tierra.</h2>
          <p>
            El valor aparece cuando alguien toma el proceso, lo traduce a
            decisión operativa y define una automatización concreta con alcance,
            riesgo y prioridad.
          </p>
        </div>
        <a
          className="cta-button"
          href="https://wa.me/5491123963538?text=Hola%20Ivan%2C%20us%C3%A9%20el%20diagn%C3%B3stico%20de%20procesos%20con%20IA%20y%20quiero%20validar%20un%20caso."
          target="_blank"
          rel="noreferrer"
        >
          Pasar el caso por WhatsApp
        </a>
      </section>
    </main>
  );
}
