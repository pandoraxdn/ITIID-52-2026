import {useState, useEffect} from "react";
import {Layout, useSchool} from "../components/Layout";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Plus, Search, Pencil, Trash2, Users, Mail, Phone, Calendar, UserCheck, GraduationCap} from "lucide-react";
import {Alumno, AlumnoForm} from "../types/school";

const empty: AlumnoForm = {nombre: "", correo: "", telefono: "", fechaNacimiento: "", fechaIngreso: "", estatus: "activo"};

export function Students() {
  const {alumnos, createAlumno, updateAlumno, deleteAlumno} = useSchool();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Alumno | null>(null);
  const [form, setForm] = useState<AlumnoForm>(empty);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (editing) setForm({nombre: editing.nombre, correo: editing.correo, telefono: editing.telefono, fechaNacimiento: editing.fechaNacimiento, fechaIngreso: editing.fechaIngreso, estatus: editing.estatus});
    else setForm(empty);
  }, [editing, open]);

  const filtered = alumnos.filter(a => a.nombre.toLowerCase().includes(search.toLowerCase()) || a.matricula.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    if (editing) updateAlumno(editing.id, form);
    else createAlumno(form);
    setOpen(false); setEditing(null);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Alumnos</h1>
            <p className="text-sm text-muted-foreground">{alumnos.length} registros · {alumnos.filter(a => a.estatus === "activo").length} activos</p>
          </div>
        </div>
        <Button onClick={() => {setEditing(null); setOpen(true);}} className="gap-2 glow-gold">
          <Plus className="h-4 w-4" /> Nuevo Alumno
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nombre o matrícula..." value={search} onChange={e => setSearch(e.target.value)} className="search-pro" />
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <Table className="table-pro">
          <TableHeader>
            <TableRow>
              <TableHead>Matrícula</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Ingreso</TableHead>
              <TableHead>Estatus</TableHead>
              <TableHead className="w-24 text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((a, idx) => (
              <TableRow key={a.id} className="animate-fade-in" style={{animationDelay: `${idx * 30}ms`}}>
                <TableCell className="font-mono text-xs text-primary/80">{a.matricula}</TableCell>
                <TableCell className="font-medium">{a.nombre}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{a.correo}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{a.telefono}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{a.fechaIngreso}</TableCell>
                <TableCell>
                  <span className={`stat-badge ${a.estatus === "activo" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${a.estatus === "activo" ? "bg-success" : "bg-destructive"}`} />
                    {a.estatus === "activo" ? "Activo" : "Baja"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-center">
                    <Button size="icon" variant="ghost" className="btn-action-edit" onClick={() => {setEditing(a); setOpen(true);}}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="btn-action-delete" onClick={() => deleteAlumno(a.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  No se encontraron alumnos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={() => {setOpen(false); setEditing(null);}}>
        <DialogContent className="modal-pro sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <GraduationCap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <DialogTitle className="font-display">{editing ? "Editar Alumno" : "Nuevo Alumno"}</DialogTitle>
                <DialogDescription className="text-xs">{editing ? "Modifica los datos del alumno" : "Completa los datos para registrar un nuevo alumno"}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="form-section">
              <Label className="flex items-center gap-1.5"><UserCheck className="h-3 w-3" /> Nombre Completo</Label>
              <Input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="search-pro" placeholder="Ej: Juan Pérez García" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-section">
                <Label className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> Correo</Label>
                <Input type="email" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} className="search-pro" placeholder="correo@escuela.edu" />
              </div>
              <div className="form-section">
                <Label className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> Teléfono</Label>
                <Input value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} className="search-pro" placeholder="555-0101" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-section">
                <Label className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Fecha de Nacimiento</Label>
                <Input type="date" value={form.fechaNacimiento} onChange={e => setForm({...form, fechaNacimiento: e.target.value})} className="search-pro" />
              </div>
              <div className="form-section">
                <Label className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Fecha de Ingreso</Label>
                <Input type="date" value={form.fechaIngreso} onChange={e => setForm({...form, fechaIngreso: e.target.value})} className="search-pro" />
              </div>
            </div>
            <div className="form-section">
              <Label>Estatus</Label>
              <Select value={form.estatus} onValueChange={v => setForm({...form, estatus: v as AlumnoForm["estatus"]})}>
                <SelectTrigger className="search-pro"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="activo">Activo</SelectItem><SelectItem value="baja">Baja</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-border/50">
              <Button type="button" variant="outline" onClick={() => {setOpen(false); setEditing(null);}}>Cancelar</Button>
              <Button type="submit" className="glow-gold">{editing ? "Actualizar" : "Crear Alumno"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
