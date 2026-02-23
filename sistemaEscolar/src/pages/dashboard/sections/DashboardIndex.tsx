import {Layout, useSchool} from "../components/Layout";
import {Users, BookOpen, UserCheck, ClipboardList, Award, ArrowRight, TrendingUp, BarChart3} from "lucide-react";
import {Link} from "react-router-dom";
import pandoraImg from "@/assets/pandora.png";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

const CHART_COLORS = [
  "hsl(43, 70%, 40%)",
  "hsl(220, 10%, 55%)",
  "hsl(142, 60%, 40%)",
  "hsl(0, 65%, 50%)",
  "hsl(38, 92%, 50%)",
];

export const DashboardIndex = () => {
  const {alumnos, materias, profesores, inscripciones, calificaciones, getAlumnoName, getMateriaName} = useSchool();

  const alumnosActivos = alumnos.filter(a => a.estatus === "activo").length;
  const alumnosBaja = alumnos.filter(a => a.estatus === "baja").length;
  const calConPromedio = calificaciones.filter(c => c.promedio !== null);
  const promedioGeneral = calConPromedio.reduce((acc, c) => acc + (c.promedio ?? 0), 0) / (calConPromedio.length || 1);
  const aprobados = calificaciones.filter(c => c.estatus === "aprobado").length;
  const reprobados = calificaciones.filter(c => c.estatus === "reprobado").length;

  const stats = [
    {
      label: "Alumnos Activos",
      value: alumnosActivos,
      icon: Users,
      to: "/dashboard/alumnos",
      color: "text-primary"
    },
    {
      label: "Materias",
      value: materias.length,
      icon: BookOpen,
      to: "/dashboard/materias",
      color: "text-gold-light"
    },
    {
      label: "Profesores",
      value: profesores.filter(p => p.estatus === "activo").length,
      icon: UserCheck,
      to: "/dashboard/profesores",
      color: "text-silver"
    },
    {
      label: "Inscripciones",
      value: inscripciones.filter(i => i.estatus === "inscrito").length,
      icon: ClipboardList, to: "/dashboard/inscripciones",
      color: "text-warning"
    },
    {
      label: "Aprobados",
      value: aprobados,
      icon: Award,
      to: "/dashboard/calificaciones",
      color: "text-success"
    },
    {
      label: "Reprobados",
      value: reprobados,
      icon: Award, to: "/dashboard/calificaciones",
      color: "text-destructive"
    },
  ];

  const pieData = [
    {name: "Activos", value: alumnosActivos},
    {name: "Baja", value: alumnosBaja},
  ].filter(d => d.value > 0);

  // Data for bar chart (grades distribution)
  const gradeStatusData = [
    {name: "Aprobados", cantidad: aprobados},
    {name: "Reprobados", cantidad: reprobados},
    {name: "En curso", cantidad: calificaciones.filter(c => c.estatus === "en curso").length},
  ];

  // Data for line chart (parciales avg)
  const parcialAvgs = calConPromedio.length > 0
    ? [
      {name: "Parcial 1", promedio: Math.round(calConPromedio.reduce((a, c) => a + (c.parcial1 ?? 0), 0) / calConPromedio.length * 10) / 10},
      {name: "Parcial 2", promedio: Math.round(calConPromedio.reduce((a, c) => a + (c.parcial2 ?? 0), 0) / calConPromedio.length * 10) / 10},
      {name: "Parcial 3", promedio: Math.round(calConPromedio.reduce((a, c) => a + (c.parcial3 ?? 0), 0) / calConPromedio.length * 10) / 10},
    ]
    : [{name: "Parcial 1", promedio: 0}, {name: "Parcial 2", promedio: 0}, {name: "Parcial 3", promedio: 0}];

  // Materias by semester bar chart
  const semestres = [...new Set(materias.map(m => m.semestre))].sort();
  const materiasBySemestre = semestres.map(s => ({
    name: `Sem ${s}`,
    materias: materias.filter(m => m.semestre === s).length,
    creditos: materias.filter(m => m.semestre === s).reduce((a, m) => a + m.creditos, 0),
  }));

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Hero */}
      <div className="relative rounded-xl border border-border bg-card overflow-hidden animate-fade-in opacity-80">
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/95 to-transparent z-10" />
        <img
          src={pandoraImg}
          alt="Pandora"
          className="
            absolute 
            right-0 
            top-1/2 
            -translate-y-1/2 
            h-72 
            object-contain 
            pointer-events-none 
            select-none
          "
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

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Grades Status Bar */}
        <div className="rounded-xl border border-border bg-card p-5 animate-fade-in" style={{animationDelay: "200ms"}}>
          <h3 className="font-display text-sm font-semibold mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" /> Estatus de Calificaciones
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeStatusData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{fill: "hsl(var(--muted-foreground))", fontSize: 12}} />
                <YAxis allowDecimals={false} tick={{fill: "hsl(var(--muted-foreground))", fontSize: 12}} />
                <Tooltip
                  contentStyle={{backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))"}}
                />
                <Bar dataKey="cantidad" radius={[6, 6, 0, 0]}>
                  {gradeStatusData.map((_, i) => (
                    <Cell key={i} fill={[CHART_COLORS[2], CHART_COLORS[3], CHART_COLORS[1]][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart student status */}
        <div className="rounded-xl border border-border bg-card p-5 animate-fade-in" style={{animationDelay: "300ms"}}>
          <h3 className="font-display text-sm font-semibold mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Estatus de Alumnos
          </h3>
          <div className="h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({name, value}) => `${name}: ${value}`}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))"}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Line chart parciales */}
        <div className="rounded-xl border border-border bg-card p-5 animate-fade-in" style={{animationDelay: "400ms"}}>
          <h3 className="font-display text-sm font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Promedio por Parcial
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={parcialAvgs}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{fill: "hsl(var(--muted-foreground))", fontSize: 12}} />
                <YAxis domain={[0, 10]} tick={{fill: "hsl(var(--muted-foreground))", fontSize: 12}} />
                <Tooltip
                  contentStyle={{backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))"}}
                />
                <Line type="monotone" dataKey="promedio" stroke={CHART_COLORS[0]} strokeWidth={3} dot={{r: 5, fill: CHART_COLORS[0]}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar chart materias by semestre */}
        <div className="rounded-xl border border-border bg-card p-5 animate-fade-in" style={{animationDelay: "500ms"}}>
          <h3 className="font-display text-sm font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" /> Materias por Semestre
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={materiasBySemestre} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{fill: "hsl(var(--muted-foreground))", fontSize: 12}} />
                <YAxis allowDecimals={false} tick={{fill: "hsl(var(--muted-foreground))", fontSize: 12}} />
                <Tooltip
                  contentStyle={{backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))"}}
                />
                <Legend />
                <Bar dataKey="materias" name="Materias" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
                <Bar dataKey="creditos" name="Créditos" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
