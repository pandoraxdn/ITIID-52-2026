#!/usr/bin/env python3
"""
Lee useSchoolStore.ts, imprime su contenido real y aplica la corrección exacta.
Ejecutar desde la raíz del proyecto.
"""
import os, sys

ROOT = os.getcwd()
PATH = os.path.join(ROOT, "src/pages/dashboard/hooks/useSchoolStore.ts")

if not os.path.exists(PATH):
    print(f"❌ No encontrado: {PATH}")
    sys.exit(1)

with open(PATH, encoding='utf-8') as f:
    content = f.read()

print("── Contenido actual (primeras 25 líneas) ──────────────────")
for i, line in enumerate(content.split('\n')[:25], 1):
    print(f"  {i:3}: {repr(line)}")
print("────────────────────────────────────────────────────────────\n")

# ─── Estrategia: buscar el import que contiene 'Alumno' y reemplazar
# 'import {' → 'import type {' en ESA línea específica ───────────────────
lines = content.split('\n')
new_lines = []
i = 0
changed = False

while i < len(lines):
    line = lines[i]
    
    # Detectar inicio de un import multilínea que contenga tipos de interfaces
    # Patrón: la línea es 'import {' o 'import  {' (sin 'type' ya)
    # Y las siguientes líneas contienen los nombres del error
    type_names = {
        'Alumno', 'AlumnoForm', 'Calificacion', 'CalificacionForm',
        'Inscripcion', 'InscripcionForm', 'Materia', 'MateriaForm',
        'Profesor', 'ProfesorForm'
    }
    
    stripped = line.strip()
    
    # Caso 1: import de una sola línea  import { A, B } from '...'
    if stripped.startswith('import {') and not stripped.startswith('import type {'):
        # Verificar si alguno de los type_names está en esta línea
        if any(name in line for name in type_names):
            line = line.replace('import {', 'import type {', 1)
            changed = True
            print(f"  ✏️  Línea {i+1} (una línea): {repr(line)}")
    
    # Caso 2: inicio de import multilínea  "import {"  sola en la línea
    elif stripped in ('import {', 'import  {'):
        # Leer hacia adelante para ver si contiene type_names
        lookahead = []
        j = i
        depth = stripped.count('{') - stripped.count('}')
        while j < len(lines):
            lookahead.append(lines[j])
            depth += lines[j].count('{') - lines[j].count('}')
            if depth <= 0 and j > i:
                break
            j += 1
        
        block = '\n'.join(lookahead)
        if any(name in block for name in type_names):
            # Reemplazar 'import {' por 'import type {' en la primera línea
            line = line.replace('import {', 'import type {', 1)
            changed = True
            print(f"  ✏️  Línea {i+1} (multilínea): {repr(line)}")
    
    new_lines.append(line)
    i += 1

if changed:
    new_content = '\n'.join(new_lines)
    with open(PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("\n✅ useSchoolStore.ts corregido.")
else:
    print("\n⚠️  No se encontró el patrón esperado.")
    print("    Intentando corrección directa por nombre de variables...\n")
    
    # Fallback: si el import tiene 'import type' en una línea pero los items
    # están listados como non-type en líneas separadas (caso raro de sintaxis mixta),
    # reemplazar simplemente la primera ocurrencia de 'import {' que no sea 'import type {'
    
    # Buscar el bloque exacto de líneas 1-15 del error
    # Error dice líneas 3-12 tienen Alumno...ProfesorForm
    # Eso implica que import { está en línea 2 o 1
    
    # Buscar 'import {' (no 'import type {') que preceda a 'Alumno,'
    idx = content.find('import {')
    while idx != -1:
        # Verificar que no sea ya 'import type {'
        before = content[max(0,idx-1):idx+20]
        if 'type' not in content[idx:idx+15]:
            # Ver si el bloque siguiente contiene Alumno
            block_end = content.find('}', idx)
            block = content[idx:block_end+1]
            if 'Alumno' in block:
                old_block = block
                new_block = block.replace('import {', 'import type {', 1)
                content = content.replace(old_block, new_block, 1)
                with open(PATH, 'w', encoding='utf-8') as f:
                    f.write(content)
                print("✅ Corrección fallback aplicada.")
                break
        idx = content.find('import {', idx + 1)
    else:
        print("❌ No se pudo corregir automáticamente.")
        print("   Edita manualmente: cambia 'import {' por 'import type {' en la línea del import.")
