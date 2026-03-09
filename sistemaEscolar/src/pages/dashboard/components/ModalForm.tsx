// ============================================
// ARCHIVO: ModalForm.tsx
// PROPÓSITO: Componente reutilizable que muestra un modal (ventana emergente)
//            con un formulario. Puede usarse para crear o editar cualquier tipo de registro.
//            Es genérico, lo que significa que funciona con diferentes tipos de datos
//            (alumnos, profesores, etc.) gracias al uso de TypeScript.
// ============================================

// Importaciones de componentes UI de la librería shadcn/ui
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Users} from 'lucide-react'; // Ícono por defecto

// ============================================
// CONFIGURACIÓN DE TIPOS (INTERFACES)
// ============================================
// Estas interfaces definen la estructura de las props que el componente puede recibir.
// Al ser genéricas (<T = any>), podemos especificar el tipo de datos del formulario
// (por ejemplo, Alumno, Profesor, etc.) y TypeScript verificará que los nombres de campo coincidan.

/**
 * Configuración de un campo de texto en el formulario.
 * @template T - Tipo del objeto que contiene el formulario (ej. Alumno, Profesor).
 */
export interface TextFieldConfig<T = any> {
  name: keyof T;          // Nombre del campo (debe ser una clave válida de T)
  label: string;          // Etiqueta visible
  icon?: React.ElementType; // Ícono opcional (componente de lucide-react)
  placeholder?: string;   // Texto de placeholder
  required?: boolean;     // Si es obligatorio (muestra asterisco)
  type?: string;          // Tipo de input (text, email, date, password, etc.)
}

/**
 * Configuración de un campo de selección (select) en el formulario.
 * @template T - Tipo del objeto que contiene el formulario.
 */
export interface SelectFieldConfig<T = any> {
  name: keyof T;          // Nombre del campo
  label: string;          // Etiqueta visible
  options: string[];      // Lista de opciones (valores que se enviarán)
  required?: boolean;     // Si es obligatorio
  mapValue?: (value: string) => any;  // Función opcional para transformar el valor seleccionado (ej. convertir 'true' a booleano)
  displayLabel?: (option: string) => string; // Función opcional para mostrar una etiqueta diferente en la UI (ej. "Activo" en lugar de "true")
}

/**
 * Props que recibe el componente ModalForm.
 * @template T - Tipo de los datos del formulario.
 */
interface Props<T = any> {
  open: boolean;                          // Controla si el modal está abierto o cerrado
  onClose: () => void;                     // Función para cerrar el modal
  onSubmit: (e: React.FormEvent) => void;  // Función que se ejecuta al enviar el formulario
  form: T;                                 // Objeto con los valores actuales del formulario
  setField: (field: keyof T, value: any) => void; // Función para actualizar un campo específico
  isValid: () => boolean;                   // Función que valida el formulario (retorna true si es válido)
  isEditing: boolean;                       // Indica si estamos en modo edición (cambia el texto del botón)
  loading: boolean;                         // Estado de carga (deshabilita el botón de submit)
  title?: string;                           // Título del modal (si no se provee, se usa uno por defecto)
  description?: string;                      // Descripción del modal
  textFields: TextFieldConfig<T>[];          // Lista de campos de texto a renderizar
  selectFields: SelectFieldConfig<T>[];      // Lista de campos select a renderizar
  headerIcon?: React.ElementType;            // Ícono a mostrar en el encabezado (por defecto Users)
  children?: React.ReactNode;                 // Contenido adicional (campos personalizados que no entran en textFields o selectFields)
}

// ============================================
// COMPONENTE PRINCIPAL: ModalForm
// ============================================
// Este componente es genérico: <T> se especificará cuando se use (ej. <ModalForm<Alumno> ... />)
export function ModalForm<T>({
  open,
  onClose,
  onSubmit,
  form,
  setField,
  isValid,
  isEditing,
  loading,
  title,
  description,
  textFields,
  selectFields,
  headerIcon: HeaderIcon = Users, // Si no se pasa icono, usamos Users por defecto
  children,
}: Props<T>) {
  // Si no se proporciona título, usamos uno por defecto según el modo (edición o creación)
  const modalTitle = title ?? (isEditing ? 'Editar Registro' : 'Nuevo Registro');
  // Si no se proporciona descripción, usamos una por defecto
  const modalDescription = description ?? (isEditing ? 'Modifica los datos' : 'Registra un nuevo elemento');

  return (
    // Componente Dialog de shadcn/ui: controla la apertura/cierre del modal
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      {/* Contenido del modal con ancho máximo personalizado */}
      <DialogContent className="modal-pro sm:max-w-2xl">
        {/* Cabecera del modal: ícono, título y descripción */}
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <HeaderIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="font-display">{modalTitle}</DialogTitle>
              <DialogDescription className="text-xs">{modalDescription}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Formulario */}
        <form onSubmit={onSubmit} className="space-y-5 pt-2">
          {/* Campos de texto: se renderizan en un grid de 2 columnas */}
          {textFields.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {textFields.map((field) => (
                <div key={String(field.name)} className="form-section">
                  <Label className="flex items-center gap-1.5">
                    {field.icon && <field.icon className="h-3 w-3" />}
                    {field.label} {field.required && '*'}
                  </Label>
                  <Input
                    type={field.type || 'text'}
                    value={String(form[field.name] ?? '')}
                    onChange={(e) => setField(field.name, e.target.value)}
                    className="search-pro"
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Campos de selección (select) */}
          {selectFields.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {selectFields.map((field) => {
                // Determinamos el valor actual: si es booleano, lo convertimos a string 'true'/'false'
                let currentValue: string;
                if (typeof form[field.name] === 'boolean') {
                  currentValue = form[field.name] ? 'true' : 'false';
                } else {
                  currentValue = String(form[field.name] ?? '');
                }
                return (
                  <div key={String(field.name)} className="form-section">
                    <Label>
                      {field.label} {field.required && '*'}
                    </Label>
                    <Select
                      value={currentValue}
                      onValueChange={(v) =>
                        setField(field.name, field.mapValue ? field.mapValue(v) : v)
                      }
                    >
                      <SelectTrigger className="search-pro">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {field.displayLabel ? field.displayLabel(opt) : opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
          )}

          {/* Contenido adicional (children) que se renderiza después de los campos estándar */}
          {children}

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-3 border-t border-border/50">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="glow-gold" disabled={!isValid() || loading}>
              {isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
