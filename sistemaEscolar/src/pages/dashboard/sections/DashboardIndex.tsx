import { useState, useEffect } from "react";
import { useSchool } from "../components/Layout";
import { Users, BookOpen, UserCheck, ClipboardList, Award, ArrowRight, TrendingUp, BarChart3, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import pandoraImg from "@/assets/pandora.png";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { pandoraApi } from "@/api/pandoraApi";
import axios from "axios";
import {
  PREDICCION_ASISTENCIA,
  PREDICCION_CALIFICACIONES,
  PREDICCION_DEMANDA_GRUPOS,
  PREDICCION_RETARDOS,
  PREDICCION_CONSUMO_COMEDOR
} from "../graphql/predicciones";

// Helper para reintentos con backoff exponencial
const fetchWithRetry = async (query: string, variables: any = {}, retries = 3, baseDelay = 1000) => {
  let lastError: any;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await pandoraApi.post('', { query, variables });
      return response.data;
    } catch (error: any) {
      lastError = error;
      const isNetworkError = axios.isAxiosError(error) && (!error.response || error.response.status >= 500);
      if (!isNetworkError || attempt === retries) {
        throw error;
      }
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
};

export const DashboardIndex = () => {
  const { alumnos, materias, profesores, inscripciones, calificaciones } = useSchool();

  // Estados para predicciones
  const [asistencia, setAsistencia] = useState<any>(null);
  const [asistenciaLoading, setAsistenciaLoading] = useState(true);
  const [asistenciaError, setAsistenciaError] = useState<string | null>(null);

  const [calificacionesPred, setCalificacionesPred] = useState<any[]>([]);
  const [califLoading, setCalifLoading] = useState(true);
  const [califError, setCalifError] = useState<string | null>(null);

  const [demanda, setDemanda] = useState<any[]>([]);
  const [demandaLoading, setDemandaLoading] = useState(true);
  const [demandaError, setDemandaError] = useState<string | null>(null);

  const [retardos, setRetardos] = useState<any[]>([]);
  const [retardosLoading, setRetardosLoading] = useState(true);
  const [retardosError, setRetardosError] = useState<string | null>(null);

  const [consumo, setConsumo] = useState<any>(null);
  const [consumoLoading, setConsumoLoading] = useState(true);
  const [consumoError, setConsumoError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAsistencia = async () => {
      try {
        const res = await fetchWithRetry(PREDICCION_ASISTENCIA, { mesesHistorico: 8, factorS: 0.10 });
        setAsistencia(res.data.prediccionAsistenciaProximoMes);
      } catch (err: any) {
        setAsistenciaError(err.message);
      } finally {
        setAsistenciaLoading(false);
      }
    };

    const fetchCalificaciones = async () => {
      try {
        const res = await fetchWithRetry(PREDICCION_CALIFICACIONES, { factorS: 0.20, soloRiesgo: true });
        setCalificacionesPred(res.data.prediccionCalificacionProximoPeriodo);
      } catch (err: any) {
        setCalifError(err.message);
      } finally {
        setCalifLoading(false);
      }
    };

    const fetchDemanda = async () => {
      try {
        const res = await fetchWithRetry(PREDICCION_DEMANDA_GRUPOS, { factorS: 0.12 });
        setDemanda(res.data.prediccionDemandaGruposSiguienteCiclo);
      } catch (err: any) {
        setDemandaError(err.message);
      } finally {
        setDemandaLoading(false);
      }
    };

    const fetchRetardos = async () => {
      try {
        const res = await fetchWithRetry(PREDICCION_RETARDOS, { mesesHistorico: 6, factorS: 0.22 });
        setRetardos(res.data.prediccionRetardosEmpleados);
      } catch (err: any) {
        setRetardosError(err.message);
      } finally {
        setRetardosLoading(false);
      }
    };

    const fetchConsumo = async () => {
      try {
        const res = await fetchWithRetry(PREDICCION_CONSUMO_COMEDOR, { semanasHistorico: 8, factorS: 0.17 });
        setConsumo(res.data.prediccionConsumoComedor);
      } catch (err: any) {
        setConsumoError(err.message);
      } finally {
        setConsumoLoading(false);
      }
    };

    fetchAsistencia();
    fetchCalificaciones();
    fetchDemanda();
    fetchRetardos();
    fetchConsumo();
  }, []);

  // Datos estáticos para estadísticas y hero
  const alumnosActivos = alumnos.filter(a => a.estatus === "activo").length;
  const calConPromedio = calificaciones.filter(c => c.promedio !== null);
  const promedioGeneral = calConPromedio.reduce((acc, c) => acc + (c.promedio ?? 0), 0) / (calConPromedio.length || 1);
  const aprobados = calificaciones.filter(c => c.estatus === "aprobado").length;
  const reprobados = calificaciones.filter(c => c.estatus === "reprobado").length;

  const stats = [
    { label: "Alumnos Activos", value: alumnosActivos, icon: Users, to: "/dashboard/alumnos", color: "text-primary" },
    { label: "Materias", value: materias.length, icon: BookOpen, to: "/dashboard/materias", color: "text-gold-light" },
    { label: "Profesores", value: profesores.filter(p => p.estatus === "activo").length, icon: UserCheck, to: "/dashboard/profesores", color: "text-silver" },
    { label: "Inscripciones", value: inscripciones.filter(i => i.estatus === "inscrito").length, icon: ClipboardList, to: "/dashboard/inscripciones", color: "text-warning" },
    { label: "Aprobados", value: aprobados, icon: Award, to: "/dashboard/calificaciones", color: "text-success" },
    { label: "Reprobados", value: reprobados, icon: Award, to: "/dashboard/calificaciones", color: "text-destructive" },
  ];

  const renderStatus = (loading: boolean, error: string | null, children: React.ReactNode) => {
    if (loading) return (
      <div className="h-48 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
    if (error) return (
      <div className="h-48 flex items-center justify-center text-destructive text-sm">
        Error: {error}
      </div>
    );
    return children;
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Hero */}
      <div className="relative rounded-xl border border-border bg-card overflow-hidden animate-fade-in opacity-80">
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/95 to-transparent z-10" />
        <img
          src={pandoraImg}
          alt="Pandora"
          className="absolute right-0 top-1/2 -translate-y-1/2 h-72 object-contain pointer-events-none select-none"
        />
        <div className="relative z-20 p-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1 w-8 rounded-full bg-primary" />
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Dashboard</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Sistema <span className="text-primary">Escolar</span>
          </h1>
          <p className="text-muted-foreground max-w-md mb-1">
            Gestiona alumnos, materias, profesores, inscripciones y calificaciones.
          </p>
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm">Promedio general: <span className="text-primary font-bold text-lg">{promedioGeneral.toFixed(1)}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-silver" />
              <span className="text-sm text-muted-foreground">{calConPromedio.length} calificaciones registradas</span>
            </div>
          </div>
          <Link
            to="/dashboard/alumnos"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 glow-gold"
          >
            Ver Alumnos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map(({label, value, icon: Icon, to, color}, idx) => (
          <Link
            key={label}
            to={to}
            className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5 group animate-fade-in"
            style={{animationDelay: `${idx * 60}ms`}}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-muted">
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
            </div>
            <p className="text-2xl font-display font-bold mb-0.5">{value}</p>
            <span className="text-xs text-muted-foreground">{label}</span>
          </Link>
        ))}
      </div>

      {/* ---------- SECCIÓN PREDICCIONES ---------- */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-bold">Predicciones</h2>
          <span className="text-xs text-muted-foreground">Basadas en Transformada de Laplace</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Asistencia */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-sm font-semibold mb-2">📅 Asistencia próxima mes</h3>
            {renderStatus(asistenciaLoading, asistenciaError,
              asistencia && (
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-bold text-primary">
                      {asistencia.tasa_asistencia_predicha}%
                    </span>
                    <span className="text-sm text-muted-foreground">
                      confianza {asistencia.confianza_pct}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Faltas estimadas:</span>
                    <span className="font-medium">{asistencia.faltas_predichas}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>α (suavizado):</span>
                    <span>{asistencia.factor_alpha}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Mes analizado: {asistencia.meses_analizados} meses
                  </div>
                </div>
              )
            )}
          </div>

          {/* Consumo Comedor */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-sm font-semibold mb-2">🍽️ Consumo en comedor</h3>
            {renderStatus(consumoLoading, consumoError,
              consumo && (
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-bold text-primary">
                      {consumo.consumos_esperados}
                    </span>
                    <span className="text-sm text-muted-foreground">consumos</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ingreso estimado:</span>
                    <span className="font-medium">${consumo.ingreso_comedor_estimado}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ajuste estacional:</span>
                    <span>{consumo.variacion_estacional}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Semana predicha: {consumo.semana_predicha}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Riesgo de reprobación */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-sm font-semibold mb-2">⚠️ Riesgo de reprobación</h3>
            {renderStatus(califLoading, califError,
              calificacionesPred && calificacionesPred.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {calificacionesPred.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="border-b border-border pb-2 last:border-0">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm truncate">{item.materia}</span>
                        <span className={`text-sm font-bold ${item.riesgo_reprobacion_pct > 50 ? 'text-destructive' : 'text-warning'}`}>
                          {item.riesgo_reprobacion_pct}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Promedio predicho: {item.promedio_predicho}</span>
                        <span>Confianza: {item.confianza_pct}%</span>
                      </div>
                    </div>
                  ))}
                  {calificacionesPred.length > 5 && (
                    <div className="text-xs text-center text-muted-foreground mt-2">
                      +{calificacionesPred.length - 5} materias con riesgo
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
                  No se encontraron materias con riesgo significativo
                </div>
              )
            )}
          </div>

          {/* Demanda Grupos */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-sm font-semibold mb-2">📚 Grupos necesarios (próximo ciclo)</h3>
            {renderStatus(demandaLoading, demandaError,
              demanda && demanda.length > 0 ? (
                <>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={demanda}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="nivel" tick={{fill: "hsl(var(--muted-foreground))", fontSize: 12}} />
                        <YAxis allowDecimals={false} tick={{fill: "hsl(var(--muted-foreground))", fontSize: 12}} />
                        <Tooltip contentStyle={{backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8}} />
                        <Bar dataKey="grupos_necesarios" name="Grupos" fill="#f4b942" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Tabla debajo del gráfico */}
                  <div className="mt-4 border-t border-border pt-3">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">Detalle por nivel</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-1 font-medium">Nivel</th>
                            <th className="text-right py-1 font-medium">Grupos necesarios</th>
                            <th className="text-right py-1 font-medium">Alumnos esperados</th>
                            <th className="text-right py-1 font-medium">Crecimiento %</th>
                            <th className="text-right py-1 font-medium">Confianza %</th>
                           </tr>
                        </thead>
                        <tbody>
                          {demanda.map((item, idx) => (
                            <tr key={idx} className="border-b border-border/50">
                              <td className="py-1">{item.nivel}</td>
                              <td className="text-right py-1">{item.grupos_necesarios}</td>
                              <td className="text-right py-1">{item.alumnos_esperados}</td>
                              <td className="text-right py-1">{item.crecimiento_pct}%</td>
                              <td className="text-right py-1">{item.confianza_pct}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">
                  No hay datos disponibles
                </div>
              )
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-1 gap-4">
          {/* Retardos Empleados */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-sm font-semibold mb-2">⏱️ Retardos esperados por departamento</h3>
            {renderStatus(retardosLoading, retardosError,
              retardos && retardos.length > 0 ? (
                <>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={retardos}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="departamento" tick={{fill: "hsl(var(--muted-foreground))", fontSize: 12}} angle={-15} textAnchor="end" height={60} />
                        <YAxis tick={{fill: "hsl(var(--muted-foreground))", fontSize: 12}} />
                        <Tooltip contentStyle={{backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8}} />
                        <Bar dataKey="retardos_esperados" name="Minutos de retardo" fill="#e74c3c" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Tabla debajo del gráfico */}
                  <div className="mt-4 border-t border-border pt-3">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">Detalle por departamento</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-1 font-medium">Departamento</th>
                            <th className="text-right py-1 font-medium">Retardos esperados (min)</th>
                            <th className="text-right py-1 font-medium">Empleados en riesgo</th>
                            <th className="text-right py-1 font-medium">Confianza %</th>
                           </tr>
                        </thead>
                        <tbody>
                          {retardos.map((item, idx) => (
                            <tr key={idx} className="border-b border-border/50">
                              <td className="py-1">{item.departamento}</td>
                              <td className="text-right py-1">{item.retardos_esperados}</td>
                              <td className="text-right py-1">{item.empleados_en_riesgo}</td>
                              <td className="text-right py-1">{item.confianza_pct}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                  No hay datos disponibles
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
