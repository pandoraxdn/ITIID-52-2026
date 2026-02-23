import {useState, useEffect} from "react";
import {Layout, useSchool} from "../components/Layout";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Plus, Search, Pencil, Trash2, ClipboardList, Users, BookOpen, Calendar} from "lucide-react";
import {Inscripcion, InscripcionForm} from "@/pages/dashboard/types/school";
import {toast} from "../hooks/useToast";

export const Enrollments = () => {
  const {inscripciones, alumnos, materias, createInscripcion, updateInscripcion, deleteInscripcion, getAlumnoName, getMateriaName} = useSchool();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Inscripcion | null>(null);
  const [form, setForm] = useState<InscripcionForm>({idAlumno: "", idMateria: "", cicloEscolar: "2025-1", estatus: "inscrito"});
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (editing) setForm({idAlumno: editing.idAlumno, idMateria: editing.idMateria, cicloEscolar: editing.cicloEscolar, estatus: editing.estatus});
    else setForm({idAlumno: "", idMateria: "", cicloEscolar: "2025-1", estatus: "inscrito"});
  }, [editing, open]);

  const filtered = inscripciones.filter(i => {
    const alumno = getAlumnoName(i.idAlumno).toLowerCase();
    const materia = getMateriaName(i.idMateria).toLowerCase();
    const q = search.toLowerCase();
    return alumno.includes(q) || materia.includes(q) || i.cicloEscolar.includes(q);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.idAlumno || !form.idMateria) return;
    try {
      if (editing) updateInscripcion(editing.id, form);
      else createInscripcion(form);
      setOpen(false); setEditing(null);
    } catch (err: any) {
      toast({title: "Error", description: err.message, variant: "destructive"});
    }
  };

  const alumnosActivos = alumnos.filter(a => a.estatus === "activo");

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20"><ClipboardList className="h-5 w-5 text-primary" /></div>
          <div>
            <h1 className="text-2xl font-display font-bold">Inscripciones</h1>
            <p className="text-sm text-muted-foreground">{inscripciones.length} registros · {inscripciones.filter(i => i.estatus === "inscrito").length} activas</p>
          </div>
        </div>
        <Button onClick={() => {setEditing(null); setOpen(true);}} className="gap-2 glow-gold"><Plus className="h-4 w-4" /> Nueva Inscripción</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar alumno, materia o ciclo..." value={search} onChange={e => setSearch(e.target.value)} className="search-pro" />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table className="table-pro">
          <TableHeader><TableRow>
            <TableHead>Alumno</TableHead><TableHead>Materia</TableHead><TableHead>Ciclo</TableHead><TableHead>Fecha</TableHead><TableHead>Estatus</TableHead><TableHead className="w-24 text-center">Acciones</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map((i, idx) => (
              <TableRow key={i.id} className="animate-fade-in" style={{animationDelay: `${idx * 30}ms`}}>
                <TableCell className="font-medium">{getAlumnoName(i.idAlumno)}</TableCell>
                <TableCell>{getMateriaName(i.idMateria)}</TableCell>
                <TableCell><span className="stat-badge bg-primary/10 text-primary font-mono text-xs">{i.cicloEscolar}</span></TableCell>
                <TableCell className="text-muted-foreground text-sm">{i.fechaInscripcion}</TableCell>
                <TableCell>
                  <span className={`stat-badge ${i.estatus === "inscrito" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${i.estatus === "inscrito" ? "bg-success" : "bg-destructive"}`} />
                    {i.estatus === "inscrito" ? "Inscrito" : "Baja"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-center">
                    <Button size="icon" variant="ghost" className="btn-action-edit" onClick={() => {setEditing(i); setOpen(true);}}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="btn-action-delete" onClick={() => deleteInscripcion(i.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground"><ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-30" />No se encontraron inscripciones</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={() => {setOpen(false); setEditing(null);}}>
        <DialogContent className="modal-pro sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20"><ClipboardList className="h-4 w-4 text-primary" /></div>
              <div>
                <DialogTitle className="font-display">{editing ? "Editar Inscripción" : "Nueva Inscripción"}</DialogTitle>
                <DialogDescription className="text-xs">{editing ? "Modifica los datos de la inscripción" : "Inscribe un alumno a una materia"}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="form-section">
              <Label className="flex items-center gap-1.5"><Users className="h-3 w-3" /> Alumno</Label>
              <Select value={form.idAlumno} onValueChange={v => setForm({...form, idAlumno: v})}>
                <SelectTrigger className="search-pro"><SelectValue placeholder="Seleccionar alumno..." /></SelectTrigger>
                <SelectContent>{alumnosActivos.map(a => <SelectItem key={a.id} value={a.id}>{a.nombre} ({a.matricula})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="form-section">
              <Label className="flex items-center gap-1.5"><BookOpen className="h-3 w-3" /> Materia</Label>
              <Select value={form.idMateria} onValueChange={v => setForm({...form, idMateria: v})}>
                <SelectTrigger className="search-pro"><SelectValue placeholder="Seleccionar materia..." /></SelectTrigger>
                <SelectContent>{materias.map(m => <SelectItem key={m.id} value={m.id}>{m.nombre} ({m.clave})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-section"><Label className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Ciclo Escolar</Label><Input value={form.cicloEscolar} onChange={e => setForm({...form, cicloEscolar: e.target.value})} className="search-pro" placeholder="2025-1" /></div>
              <div className="form-section">
                <Label>Estatus</Label>
                <Select value={form.estatus} onValueChange={v => setForm({...form, estatus: v as InscripcionForm["estatus"]})}>
                  <SelectTrigger className="search-pro"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="inscrito">Inscrito</SelectItem><SelectItem value="baja">Baja</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-border/50">
              <Button type="button" variant="outline" onClick={() => {setOpen(false); setEditing(null);}}>Cancelar</Button>
              <Button type="submit" className="glow-gold">{editing ? "Actualizar" : "Inscribir"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
