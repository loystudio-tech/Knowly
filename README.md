# Knowly: tu compañero de estudio con IA

Sube fotos de la pizarra, del libro, PDFs o apuntes escritos a mano. Knowly los organiza por materia y te prepara guías, flashcards, quizzes, simulacros, chuletas, clases en pizarra con voz y podcasts. Además puedes enseñarle tu método con **Skills** y automatizar tareas con **Automatizaciones**.

## Estructura

```
knowly/
├── index.html                    ← toda la app (un solo archivo)
├── netlify/edge-functions/ai.js  ← proxy seguro hacia Claude (tu API key va aquí, no en la web)
├── sw.js                         ← funciona sin conexión e instalable (PWA)
├── manifest.webmanifest, icons/  ← icono y modo app en iPad, Mac y móvil
└── netlify.toml
```

## Publicar en Netlify (desde GitHub, recomendado)

1. Sube esta carpeta a un repo de GitHub.
2. En Netlify: **Add new site → Import an existing project → GitHub →** elige el repo.
   - Build command: *(vacío)*. Publish directory: `.`
3. En **Site configuration → Environment variables** añade:
   - `ANTHROPIC_API_KEY` = tu clave de https://console.anthropic.com
   - `APP_PASSWORD` = una contraseña que elijas
4. Pulsa **Deploys → Trigger deploy**.
5. Abre la web y escribe la contraseña en **Ajustes**.

A partir de ahí, cada `git push` publica la nueva versión automáticamente.

Pon un límite de gasto en la consola de Anthropic (**Settings → Limits**), por ejemplo 10 $ al mes.

### Alternativa: con la terminal

```bash
npm install -g netlify-cli
cd knowly
netlify login
netlify sites:create --name knowly-tunombre
netlify link --name knowly-tunombre
netlify env:set ANTHROPIC_API_KEY "sk-ant-..."
netlify env:set APP_PASSWORD "tu-contraseña"
netlify deploy --prod
```

> Arrastrar la carpeta a Netlify Drop **no** sirve: la función de la IA tiene que desplegarse desde Git o con la CLI.

## Instalarla como app

- **iPad o iPhone:** en Safari, **Compartir → Añadir a pantalla de inicio**. Se abre a pantalla completa, con su icono.
- **Mac:** en Safari, **Archivo → Añadir al Dock**. En Chrome, el icono de instalar de la barra de direcciones.

## Probar en local

Abre `index.html` en Chrome. En **Ajustes → Clave directa**, pega tu API key. Solo se guarda en ese navegador.

## Funciones

- **Solver:** resuelve paso a paso desde texto, foto, PDF o escritura a mano (Apple Pencil). Puedes hacerle preguntas sobre la solución.
- **Pizarra:** clase escrita paso a paso con dibujos y voz.
- **Sets de estudio:** se organizan solos por materia. Incluyen guía, repaso, flashcards, quiz, simulacro, chuleta, podcast y un tutor con chat (también por voz).
- **Repaso diario:** repetición espaciada con todas tus flashcards, racha y mapa de actividad.
- **Predictor de exámenes:** temas probables, plan día a día, simulacros y chuleta.
- **Skills:** sube un PDF o fotos con ejercicios hechos a tu manera. Knowly aprende el método y lo aplica cuando escribes `/nombre` en el Solver, el chat, Escritura o al crear un set. También genera ejercicios nuevos y te enseña el método en la pizarra.
- **Automatizaciones:** «cuando subo material, cuando apunto un examen, cuando saco menos de X o cada día» → crea flashcards, quiz, chuleta, podcast, pizarra, simulacro, plan de examen o recordatorios, aplica una skill o sigue una instrucción tuya. Se ejecutan en segundo plano.
- **Escritura:** corrector, mejorar redacción, parafrasear, resumir, citas y explicar textos.
- **Apuntes en vivo:** transcribe la clase con el micrófono.
- **Calendario:** deberes y exámenes, con avisos.
- **⌘K / Ctrl+K:** buscador para ir a cualquier sitio o lanzar acciones.

## Datos

Todo se guarda en el navegador (IndexedDB), en el dispositivo donde lo uses. Para pasarlo a otro dispositivo, usa **Ajustes → Exportar / Importar**.

## Cambiar el nombre

En `index.html`, busca `const APP_NAME = 'Knowly';`.
