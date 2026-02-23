import {useState, useEffect} from "react";
import {Layout, useSchool} from "@/pages/dashboard/components/Layout";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Plus, Search, Pencil, Trash2, Award, FileText} from "lucide-react";
import {Calificacion, CalificacionForm} from "@/types/school";

export const Grades = () => {
  const {calificaciones, inscripciones, createCalificacion, updateCalificacion, deleteCalificacion, getInscripcionLabel} = useSchool();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Calificacion | null>(null);
  const [form, setForm] = useState<CalificacionForm>({idInscripcion: "", parcial1: null, parcial2: null, parcial3: null});
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (editing) setForm({idInscripcion: editing.idInscripcion, parcial1: editing.parcial1, parcial2: editing.parcial2, parcial3: editing.parcial3});
    else setForm({idInscripcion: "", parcial1: null, parcial2: null, parcial3: null});
  }, [editing, open]);

  const filtered = calificaciones.filter(c => {
    const label = getInscripcionLabel(c.idInscripcion).toLowerCase();
    return label.includes(search.toLowerCase());
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.idInscripcion) return;
    if (editing) updateCalificacion(editing.id, form);
    else createCalificacion(form);
    setOpen(false); setEditing(null);
  };

  const inscripcionesActivas = inscripciones.filter(i => i.estatus === "inscrito");
  const gradedIds = new Set(calificaciones.map(c => c.idInscripcion));
  const available = inscripcionesActivas.filter(i => !gradedIds.has(i.id));

  const statusStyle = (s: string) => {
    if (s === "aprobado") return "bg-success/10 text-success";
    if (s === "reprobado") return "bg-destructive/10 text-destructive";
    return "bg-warning/10 text-warning";
  };

  const statusDot = (s: string) => {
    if (s === "aprobado") return "bg-success";
    if (s === "reprobado") return "bg-destructive";
    return "bg-warning";
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20"><Award className="h-5 w-5 text-primary" /></div>
          <div>
            <h1 className="text-2xl font-display font-bold">Calificaciones</h1>
            <p className="text-sm text-muted-foreground">{calificaciones.length} registros</p>
          </div>
        </div>
        <Button onClick={() => {setEditing(null); setOpen(true);}} className="gap-2 glow-gold" disabled={available.length === 0 && !editing}>
          <Plus className="h-4 w-4" /> Nueva Calificación
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar alumno o materia..." value={search} onChange={e => setSearch(e.target.value)} className="search-pro" />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table className="table-pro">
          <TableHeader><TableRow>
            <TableHead>Alumno – Materia</TableHead><TableHead className="text-center">P1</TableHead><TableHead className="text-center">P2</TableHead><TableHead className="text-center">P3</TableHead><TableHead className="text-center">Promedio</TableHead><TableHead>Estatus</TableHead><TableHead className="w-24 text-center">Acciones</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map((c, idx) => (
              <TableRow key={c.id} className="animate-fade-in" style={{animationDelay: `${idx * 30}ms`}}>
                <TableCell className="font-medium">{getInscripcionLabel(c.idInscripcion)}</TableCell>
                <TableCell className="text-center text-muted-foreground">{c.parcial1 ?? "—"}</TableCell>
                <TableCell className="text-center text-muted-foreground">{c.parcial2 ?? "—"}</TableCell>
                <TableCell className="text-center text-muted-foreground">{c.parcial3 ?? "—"}</TableCell>
                <TableCell className="text-center">
                  <span className="font-display font-bold text-lg">{c.promedio?.toFixed(1) ?? "—"}</span>
                </TableCell>
                <TableCell>
                  <span className={`stat-badge ${statusStyle(c.estatus)}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusDot(c.estatus)}`} />
                    {c.estatus === "aprobado" ? "Aprobado" : c.estatus === "reprobado" ? "Reprobado" : "En Curso"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-center">
                    <Button size="icon" variant="ghost" className="btn-action-edit" onClick={() => {setEditing(c); setOpen(true);}}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="btn-action-delete" onClick={() => deleteCalificacion(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground"><Award className="h-8 w-8 mx-auto mb-2 opacity-30" />No se encontraron calificaciones</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={() => {setOpen(false); setEditing(null);}}>
        <DialogContent className="modal-pro sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20"><FileText className="h-4 w-4 text-primary" /></div>
              <div>
                <DialogTitle className="font-display">{editing ? "Editar Calificación" : "Nueva Calificación"}</DialogTitle>
                <DialogDescription className="text-xs">{editing ? "Corrige las calificaciones del alumno" : "Registra las calificaciones parciales"}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="form-section">
              <Label className="flex items-center gap-1.5"><Award className="h-3 w-3" /> Inscripción (Alumno – Materia)</Label>
              <Select value={form.idInscripcion} onValueChange={v => setForm({...form, idInscripcion: v})} disabled={!!editing}>
                <SelectTrigger className="search-pro"><SelectValue placeholder="Seleccionar inscripción..." /></SelectTrigger>
                <SelectContent>
                  {(editing ? inscripciones : available).map(i => (
                    <SelectItem key={i.id} value={i.id}>{getInscripcionLabel(i.id)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="form-section"><Label>Parcial 1</Label><Input type="number" step="0.1" min="0" max="10" value={form.parcial1 ?? ""} onChange={e => setForm({...form, parcial1: e.target.value ? +e.target.value : null})} className="search-pro text-center" placeholder="0-10" /></div>
              <div className="form-section"><Label>Parcial 2</Label><Input type="number" step="0.1" min="0" max="10" value={form.parcial2 ?? ""} onChange={e => setForm({...form, parcial2: e.target.value ? +e.target.value : null})} className="search-pro text-center" placeholder="0-10" /></div>
              <div className="form-section"><Label>Parcial 3</Label><Input type="number" step="0.1" min="0" max="10" value={form.parcial3 ?? ""} onChange={e => setForm({...form, parcial3: e.target.value ? +e.target.value : null})} className="search-pro text-center" placeholder="0-10" /></div>
            </div>
            <p className="text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">💡 El promedio y estatus se calculan automáticamente. Mínimo aprobatorio: 6.0</p>
            <div className="flex justify-end gap-3 pt-3 border-t border-border/50">
              <Button type="button" variant="outline" onClick={() => {setOpen(false); setEditing(null);}}>Cancelar</Button>
              <Button type="submit" className="glow-gold">{editing ? "Actualizar" : "Registrar"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
