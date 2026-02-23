import {useState} from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {Checkbox} from "@/components/ui/checkbox";
import {
  Plus, Search, Pencil, Trash2, UserCheck,
} from "lucide-react";

import {useEmpleadoApi} from "../hooks/useEmpleadoApi";
import {useEmpleadoForm} from "../hooks/useEmpleadoForm";
import {Empleado, TipoPuesto, TipoEmpleado} from "../interfaces/empleado";

export const Empleados = () => {
  const {
    empleados,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
    loading,
  } = useEmpleadoApi();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Empleado | null>(null);
  const [search, setSearch] = useState("");

  const {
    form,
    setField,
    errors,
    handleSubmit,
    reset,
    isSubmitting,
  } = useEmpleadoForm({
    initial: editing,
    onSubmit: async (data, editingId) => {
      if (editingId) {
        await updateEmpleado(editingId, data);
      } else {
        await createEmpleado(data);
      }
      setOpen(false);
      setEditing(null);
      reset();
    },
  });

  const filtered = empleados.filter((e) =>
    `${e.nombre} ${e.apellido_p} ${e.apellido_m}`
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    e.departamento.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este empleado?")) return;
    await deleteEmpleado(id);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserCheck className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Empleados</h1>
            <p className="text-sm text-muted-foreground">
              {empleados.length} registros · {empleados.filter(e => e.activo).length} activos
            </p>
          </div>
        </div>
        <Button onClick={() => {setEditing(null); setOpen(true);}}>
          <Plus className="h-4 w-4 mr-2" /> Nuevo Empleado
        </Button>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o departamento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* TABLE */}
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N°</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo Inst.</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Puesto</TableHead>
              <TableHead>Estatus</TableHead>
              <TableHead className="text-center w-24">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.numero_empleado}</TableCell>
                <TableCell>
                  {e.nombre} {e.apellido_p} {e.apellido_m}
                </TableCell>
                <TableCell>{e.email_institucional}</TableCell>
                <TableCell>{e.telefono}</TableCell>
                <TableCell>{e.tipo_empleado}</TableCell>
                <TableCell>{e.puesto}</TableCell>
                <TableCell>
                  {e.activo ? (
                    <span className="text-green-600 font-medium">Activo</span>
                  ) : (
                    <span className="text-red-600 font-medium">Inactivo</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-center">
                    <Button size="icon" variant="ghost"
                      onClick={() => {setEditing(e); setOpen(true);}}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost"
                      onClick={() => handleDelete(e.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No se encontraron empleados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODAL */}
      <Dialog open={open} onOpenChange={() => {setOpen(false); setEditing(null);}}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar Empleado" : "Nuevo Empleado"}
            </DialogTitle>
            <DialogDescription>
              Completa la información del empleado
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => handleSubmit(e, editing?.id ?? null)}
            className="space-y-4"
          >

            {/* Numero */}
            <div>
              <Label>Número de Empleado</Label>
              <Input
                value={form.numero_empleado}
                onChange={(e) => setField("numero_empleado", e.target.value)}
              />
              {errors.numero_empleado && (
                <p className="text-sm text-red-500">{errors.numero_empleado}</p>
              )}
            </div>

            {/* Nombre */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Nombre</Label>
                <Input value={form.nombre}
                  onChange={(e) => setField("nombre", e.target.value)} />
              </div>
              <div>
                <Label>Apellido P.</Label>
                <Input value={form.apellido_p}
                  onChange={(e) => setField("apellido_p", e.target.value)} />
              </div>
              <div>
                <Label>Apellido M.</Label>
                <Input value={form.apellido_m}
                  onChange={(e) => setField("apellido_m", e.target.value)} />
              </div>
            </div>

            {/* Correos */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Email Personal</Label>
                <Input value={form.email_personal}
                  onChange={(e) => setField("email_personal", e.target.value)} />
              </div>
              <div>
                <Label>Email Institucional</Label>
                <Input value={form.email_institucional}
                  onChange={(e) => setField("email_institucional", e.target.value)} />
              </div>
            </div>

            {/* Teléfono y Departamento */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Teléfono</Label>
                <Input value={form.telefono}
                  onChange={(e) => setField("telefono", e.target.value)} />
              </div>
              <div>
                <Label>Departamento</Label>
                <Input value={form.departamento}
                  onChange={(e) => setField("departamento", e.target.value)} />
              </div>
            </div>

            {/* TipoEmpleado y Puesto */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Tipo Empleado</Label>
                <Select
                  value={form.tipo_empleado}
                  onValueChange={(v) => setField("tipo_empleado", v as TipoEmpleado)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.values(TipoEmpleado).map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Puesto</Label>
                <Select
                  value={form.puesto}
                  onValueChange={(v) => setField("puesto", v as TipoPuesto)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.values(TipoPuesto).map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fecha y Activo */}
            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <Label>Fecha Contratación</Label>
                <Input
                  type="date"
                  value={form.fecha_contratacion}
                  onChange={(e) => setField("fecha_contratacion", e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 mt-6">
                <Checkbox
                  checked={form.activo}
                  onCheckedChange={(v) => setField("activo", Boolean(v))}
                />
                <Label>Empleado Activo</Label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline"
                onClick={() => {setOpen(false); setEditing(null);}}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {editing ? "Actualizar" : "Crear"}
              </Button>
            </div>

          </form>
        </DialogContent>
      </Dialog>

      {loading && <p className="text-sm text-muted-foreground">Cargando...</p>}
    </div>
  );
};
