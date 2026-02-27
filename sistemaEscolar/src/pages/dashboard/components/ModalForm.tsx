import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Users} from 'lucide-react';

export interface TextFieldConfig<T = any> {
  name: keyof T;
  label: string;
  icon?: React.ElementType;
  placeholder?: string;
  required?: boolean;
  type?: string;
}

export interface SelectFieldConfig<T = any> {
  name: keyof T;
  label: string;
  options: string[];
  required?: boolean;
  mapValue?: (value: string) => any;
  displayLabel?: (option: string) => string;
}

interface Props<T = any> {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  form: T;
  setField: (field: keyof T, value: any) => void;
  isValid: () => boolean;
  isEditing: boolean;
  loading: boolean;
  title?: string;
  description?: string;
  textFields: TextFieldConfig<T>[];
  selectFields: SelectFieldConfig<T>[];
  headerIcon?: React.ElementType;
  children?: React.ReactNode;
}

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
  const modalDescription = description ?? (isEditing ? 'Modifica los datos' : 'Registra un nuevo elemento');

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

          {selectFields.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {selectFields.map((field) => {
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

          {children}

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
