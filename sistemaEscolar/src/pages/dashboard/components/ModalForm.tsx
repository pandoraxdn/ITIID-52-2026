// ============================================
// ARCHIVO: ModalForm.tsx
// ============================================

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Users} from 'lucide-react';
import {ReactNode} from 'react';

/**
 * Configuración de un campo de texto en el formulario.
 * @template T - Tipo del objeto que contiene el formulario.
 */
export interface TextFieldConfig<T = any> {
  /** Nombre del campo (debe coincidir con una clave de T). */
  name: keyof T;
  /** Etiqueta visible para el campo. */
  label: string;
  /** Icono opcional a mostrar junto a la etiqueta. */
  icon?: React.ElementType;
  /** Texto de placeholder. */
  placeholder?: string;
  /** Indica si el campo es obligatorio (se muestra asterisco). */
  required?: boolean;
  /** Tipo de input (text, email, date, etc.). Por defecto 'text'. */
  type?: string;
}

/**
 * Configuración de un campo de selección (select) en el formulario.
 * @template T - Tipo del objeto que contiene el formulario.
 */
export interface SelectFieldConfig<T = any> {
  /** Nombre del campo (debe coincidir con una clave de T). */
  name: keyof T;
  /** Etiqueta visible. */
  label: string;
  /** Arreglo de opciones como strings (los valores que se enviarán al backend). */
  options: string[];
  /** Indica si es obligatorio. */
  required?: boolean;
  /**
   * Función opcional para transformar el valor seleccionado (string) al tipo esperado por el formulario.
   * Útil para booleanos o números.
   */
  mapValue?: (value: string) => any;
  /**
   * Función opcional para mostrar una etiqueta diferente en la interfaz (por ejemplo, "Activo" en lugar de "true").
   */
  displayLabel?: (option: string) => string;
}

/**
 * Props del componente ModalForm.
 * @template T - Tipo del objeto que maneja el formulario.
 */
interface Props<T = any> {
  /** Controla si el modal está abierto. */
  open: boolean;
  /** Función para cerrar el modal. */
  onClose: () => void;
  /** Función a ejecutar al enviar el formulario. */
  onSubmit: (e: React.FormEvent) => void;
  /** Objeto con los valores actuales del formulario. */
  form: T;
  /** Función para actualizar un campo del formulario. */
  setField: (field: keyof T, value: any) => void;
  /** Función que valida el formulario (retorna true si es válido). */
  isValid: () => boolean;
  /** Indica si está en modo edición (cambia el texto del botón submit). */
  isEditing: boolean;
  /** Estado de carga (deshabilita el botón submit). */
  loading: boolean;
  /** Título del modal (si no se provee, se usa uno genérico). */
  title?: string;
  /** Descripción del modal. */
  description?: string;
  /** Configuración de los campos de texto. */
  textFields: TextFieldConfig<T>[];
  /** Configuración de los campos select. */
  selectFields: SelectFieldConfig<T>[];
  /** Icono a mostrar en el encabezado (por defecto Users). */
  headerIcon?: React.ElementType;
  /** Contenido adicional (puede usarse para campos personalizados no cubiertos por textFields/selectFields). */
  children?: React.ReactNode;
}

/**
 * Componente modal genérico para formularios.
 * Renderiza un diálogo con un formulario que incluye campos de texto y selectores,
 * configurados mediante props. Se integra con el estado del formulario proporcionado
 * por el hook useEmpleadoForm o cualquier otro hook similar.
 *
 * @template T - Tipo del formulario.
 */
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
  headerIcon: HeaderIcon = Users,
  children,
}: Props<T>) {
  const modalTitle = title ?? (isEditing ? 'Editar Registro' : 'Nuevo Registro');
  const modalDescription =
    description ?? (isEditing ? 'Modifica los datos' : 'Registra un nuevo elemento');

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="modal-pro sm:max-w-2xl">
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

        <form onSubmit={onSubmit} className="space-y-5 pt-2">
          {/* Campos de texto */}
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

          {/* Campos select */}
          {selectFields.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {selectFields.map((field) => {
                // Determinamos el valor actual; si es booleano lo convertimos a string para el select
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

          {/* Contenido adicional (campos personalizados) */}
          {children}

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-3 border-t border-border/50">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="glow-gold"
              disabled={!isValid() || loading}
            >
              {isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
