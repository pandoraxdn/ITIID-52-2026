import {useState, useEffect} from "react";
import {Layout, useSchool} from "../components/Layout";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Plus, Search, Pencil, Trash2, BookOpen, Hash, Clock, Award} from "lucide-react";
import {Materia, MateriaForm} from "../types/school";

const empty: MateriaForm = {clave: "", nombre: "", creditos: 0, semestre: 1, horasSemana: 0};

export function Subjects() {
  const {materias, createMateria, updateMateria, deleteMateria} = useSchool();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Materia | null>(null);
  const [form, setForm] = useState<MateriaForm>(empty);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (editing) setForm({clave: editing.clave, nombre: editing.nombre, creditos: editing.creditos, semestre: editing.semestre, horasSemana: editing.horasSemana});
    else setForm(empty);
  }, [editing, open]);

  const filtered = materias.filter(m => m.nombre.toLowerCase().includes(search.toLowerCase()) || m.clave.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    if (editing) updateMateria(editing.id, form);
    else createMateria(form);
    setOpen(false); setEditing(null);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Materias</h1>
            <p className="text-sm text-muted-foreground">{materias.length} registros</p>
          </div>
        </div>
        <Button onClick={() => {setEditing(null); setOpen(true);}} className="gap-2 glow-gold"><Plus className="h-4 w-4" /> Nueva Materia</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nombre o clave..." value={search} onChange={e => setSearch(e.target.value)} className="search-pro" />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table className="table-pro">
          <TableHeader><TableRow>
            <TableHead>Clave</TableHead><TableHead>Nombre</TableHead><TableHead>Créditos</TableHead><TableHead>Semestre</TableHead><TableHead>Hrs/Semana</TableHead><TableHead className="w-24 text-center">Acciones</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map((m, idx) => (
              <TableRow key={m.id} className="animate-fade-in" style={{animationDelay: `${idx * 30}ms`}}>
                <TableCell className="font-mono text-xs text-primary/80">{m.clave}</TableCell>
                <TableCell className="font-medium">{m.nombre}</TableCell>
                <TableCell>
                  <span className="stat-badge bg-primary/10 text-primary">{m.creditos} cr</span>
                </TableCell>
                <TableCell className="text-muted-foreground">{m.semestre}°</TableCell>
                <TableCell className="text-muted-foreground">{m.horasSemana}h</TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-center">
                    <Button size="icon" variant="ghost" className="btn-action-edit" onClick={() => {setEditing(m); setOpen(true);}}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="btn-action-delete" onClick={() => deleteMateria(m.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground"><BookOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />No se encontraron materias</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={() => {setOpen(false); setEditing(null);}}>
        <DialogContent className="modal-pro sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20"><BookOpen className="h-4 w-4 text-primary" /></div>
              <div>
                <DialogTitle className="font-display">{editing ? "Editar Materia" : "Nueva Materia"}</DialogTitle>
                <DialogDescription className="text-xs">{editing ? "Modifica los datos de la materia" : "Registra una nueva asignatura"}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-section"><Label className="flex items-center gap-1.5"><Hash className="h-3 w-3" /> Clave</Label><Input value={form.clave} onChange={e => setForm({...form, clave: e.target.value})} className="search-pro" placeholder="MAT-101" required /></div>
              <div className="form-section"><Label className="flex items-center gap-1.5"><BookOpen className="h-3 w-3" /> Nombre</Label><Input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="search-pro" placeholder="Matemáticas I" required /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="form-section"><Label className="flex items-center gap-1.5"><Award className="h-3 w-3" /> Créditos</Label><Input type="number" value={form.creditos} onChange={e => setForm({...form, creditos: +e.target.value})} className="search-pro" min={0} /></div>
              <div className="form-section"><Label>Semestre</Label><Input type="number" value={form.semestre} onChange={e => setForm({...form, semestre: +e.target.value})} className="search-pro" min={1} max={12} /></div>
              <div className="form-section"><Label className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> Hrs/Semana</Label><Input type="number" value={form.horasSemana} onChange={e => setForm({...form, horasSemana: +e.target.value})} className="search-pro" min={0} /></div>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-border/50">
              <Button type="button" variant="outline" onClick={() => {setOpen(false); setEditing(null);}}>Cancelar</Button>
              <Button type="submit" className="glow-gold">{editing ? "Actualizar" : "Crear Materia"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
