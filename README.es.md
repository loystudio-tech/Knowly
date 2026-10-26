<div align="center">

<img src="icons/icon-192.png" width="88" alt="Knowly">

# Knowly

**Tu compañero de estudio con IA, gratis y de código abierto.**

Sube fotos de la pizarra, del libro, PDFs o apuntes escritos a mano. Knowly los ordena por materias y te prepara guías, flashcards, quizzes, simulacros de examen, clases en pizarra con voz y podcasts.

Usa **tu propia API key** de Anthropic (Claude). Pagas solo lo que usas, normalmente 1-4 $ al mes.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/loystudio-tech/Knowly)

[English](README.md) · [Cómo instalarlo](#instalación) · [App de escritorio](#app-de-escritorio) · [Funciones](#funciones) · [Privacidad](#privacidad-y-datos)

</div>

---

## Funciones

| | |
|---|---|
| 🧮 **Solver** | Resuelve problemas paso a paso a partir de texto, una foto, un PDF o algo escrito a mano (también con Apple Pencil). Puedes preguntarle sobre la solución. |
| 🧑‍🏫 **Pizarra** | Una clase que se va escribiendo paso a paso, con dibujos y voz. |
| 📚 **Sets de estudio** | Se crean desde tus archivos y se ordenan solos por materia. Cada set trae guía de estudio, guía de repaso, flashcards, quiz, simulacro, chuleta, podcast y un tutor con chat (también por voz). |
| 🔁 **Repaso diario** | Repetición espaciada con todas tus flashcards, racha de días y mapa de actividad. |
| 🎯 **Predictor de exámenes** | Temas más probables, plan de estudio día a día, simulacros y chuleta. |
| ✨ **Skills** (`/`) | Sube un PDF o fotos con ejercicios hechos a tu manera (o a la de tu profe). Knowly aprende el método y lo aplica cuando escribes `/nombre`. También crea ejercicios nuevos y te enseña el método en la pizarra. |
| ⚡ **Automatizaciones** | «Cuando subo apuntes de Mates → crea flashcards, quiz y 5 ejercicios con mi skill». Se activan al subir material, al apuntar un examen, al sacar mala nota o cada día. |
| ✍️ **Escritura** | Corrector, mejorar redacción, parafrasear, resumir, citas (APA, MLA…) y explicar textos. |
| 🎙️ **Apuntes en vivo** | Transcribe la clase con el micrófono y la convierte en material de estudio. |
| 📅 **Calendario** | Deberes y exámenes, con avisos y un botón «Preparar con IA». |
| ⌘ **Buscador** | ⌘K / Ctrl+K para ir a cualquier sitio o lanzar acciones. |

Funciona en **Mac, PC, iPad y móvil**. Se instala como app (PWA), tiene modo oscuro y claro, y abre sin conexión.

---

## Instalación

Knowly funciona **en cualquier sitio**: como app de escritorio, en el navegador o en cualquier alojamiento. Siempre usas **tu propia API key** de Anthropic. Créala en [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) y pon un límite de gasto mensual en **Settings → Limits** (por ejemplo, 10 $).

| Quiero… | Usar | ¿Necesita servidor? |
|---|---|---|
| Usarla como **app de Mac / Windows / Linux** | [App de escritorio](#app-de-escritorio) | No |
| Probarla en 1 minuto | [Abrir `index.html` / GitHub Pages](#sin-servidor-lo-más-rápido) | No |
| Ponerla online para mí o mi clase | [Netlify](#netlify) · [Vercel](#vercel) · [Cloudflare Pages](#cloudflare-pages) | Sí (incluido) |
| Alojarla en mi ordenador, VPS, Render, Railway… | [Servidor Node](#cualquier-servidor-node) | Sí (incluido) |

Hay dos formas de conectar la IA, y puedes cambiar en **Ajustes** cuando quieras:

- **Modo servidor (recomendado para compartir):** tu API key vive en las variables de entorno del alojamiento y nunca llega al navegador. Pon `ANTHROPIC_API_KEY` y `APP_PASSWORD` (una contraseña que inventes, para que nadie gaste tu saldo). Luego escribe esa contraseña en **Ajustes**.
- **Modo clave directa (sin servidor):** pega tu API key en **Ajustes → Clave directa**. Se guarda solo en tu navegador o app. Ideal para uso personal; no compartas ese navegador.

Todo usa el mismo endpoint `/api/ai`, así que da igual qué alojamiento elijas.

### App de escritorio

Descarga el último `.dmg` (Mac), `.exe` (Windows) o `.AppImage` (Linux) desde [Releases](../../releases), ábrelo y pega tu key en **Ajustes → Clave directa**.

- **Mac:** la app no está firmada por Apple. La primera vez, clic derecho → **Abrir** (o **Ajustes del Sistema → Privacidad y seguridad → Abrir igualmente**).
- El dictado por voz (apuntes en vivo con micrófono) puede no funcionar en la app de escritorio. Para eso usa la versión web instalada como app. Las voces que leen en alto funcionan en todas.
- **Compilarla tú:** `cd desktop && npm install && npm run dist` (queda en `desktop/dist`).
- **Publicar tu propia versión:** sube una etiqueta (`git tag v1.0.0 && git push --tags`). GitHub Actions compila las tres apps y las adjunta a un Release.

### Sin servidor (lo más rápido)

1. Descarga el repo (**Code → Download ZIP**) y abre `index.html` en Chrome o Safari. También puedes publicarlo gratis en **GitHub Pages**.
2. En **Ajustes → Clave directa**, pega tu API key.

### Netlify

Pulsa el botón **Deploy to Netlify** de arriba (o **Add new site → Import from Git**). Pon `ANTHROPIC_API_KEY` y `APP_PASSWORD` cuando te las pida. El proxy es `netlify/edge-functions/ai.js`.

> ⚠️ Arrastrar la carpeta a *Netlify Drop* no sirve, porque la función de la IA no se publicaría.

### Vercel

**Add New → Project → Import** este repo. Deja la configuración de build vacía (framework «Other») y añade `ANTHROPIC_API_KEY` y `APP_PASSWORD` en **Environment Variables**. El proxy es `api/ai.js`.

### Cloudflare Pages

**Workers & Pages → Create → Pages → Connect to Git.** Deja el comando de build vacío y el directorio de salida en `/`. Añade `ANTHROPIC_API_KEY` y `APP_PASSWORD` en **Settings → Variables and Secrets**. El proxy es `functions/api/ai.js`.

### Cualquier servidor Node

```bash
git clone https://github.com/loystudio-tech/Knowly.git && cd Knowly
ANTHROPIC_API_KEY=sk-ant-... APP_PASSWORD=tu-contraseña node server.js
```

Necesita Node 18+. En Render o Railway usa `npm start` como comando de inicio y añade las dos variables. Opcional: `PORT` (por defecto 8787).

### Instalarla como app desde el navegador

- **iPad o iPhone:** en Safari, **Compartir → Añadir a pantalla de inicio**.
- **Mac:** en Safari, **Archivo → Añadir al Dock**. En Chrome, usa el icono de instalar de la barra de direcciones.

---

## Privacidad y datos

- **Tus apuntes, sets y progreso se guardan en tu navegador** (IndexedDB). No hay base de datos ni cuentas.
- Los archivos solo se envían a la API de Anthropic cuando le pides algo a la IA.
- Para cambiar de dispositivo: **Ajustes → Exportar** y luego **Importar** en el otro.
- No hay analíticas ni rastreo.

## ¿Cuánto cuesta?

Knowly es gratis. Solo pagas el uso de la API de Anthropic. Con Sonnet 5.5, un mes normal de estudio sale por unos 1-4 $. Puedes elegir **Haiku 5.5** en Ajustes, que es mucho más barato. Las voces de la pizarra y el podcast son las del navegador, así que son gratis.

## Cómo está hecho

- **Un solo archivo** (`index.html`) con HTML, CSS y JavaScript sin frameworks.
- Un proxy pequeño (`/api/ai`) que añade tu API key y comprueba la contraseña. Usa *streaming*, así que las respuestas largas no se cortan. Hay una versión por alojamiento: `netlify/edge-functions/ai.js`, `api/ai.js` (Vercel), `functions/api/ai.js` (Cloudflare) y `server.js` (Node).
- `desktop/`: un envoltorio de Electron que empaqueta el mismo `index.html` como app de Mac, Windows y Linux.
- Librerías por CDN: [marked](https://github.com/markedjs/marked), [KaTeX](https://katex.org) y [DOMPurify](https://github.com/cure53/DOMPurify).
- Para el formato JSON usa las *structured outputs* de la API de Claude.

¿Quieres cambiar el nombre? Busca `const APP_NAME = 'Knowly';` en `index.html`.

## Contribuir

Los issues y pull requests son bienvenidos. Ideas pendientes:

- Sincronizar entre dispositivos (opcional, con Firebase o Supabase).
- Recordatorios por email aunque la app esté cerrada.
- Voces más naturales (TTS de pago, opcional).
- Usar vídeos de YouTube y archivos de Word/PowerPoint como fuente.

## Licencia

[MIT](LICENSE): úsalo, modifícalo y compártelo libremente.

Knowly es un proyecto independiente y no está afiliado a Anthropic ni a ninguna otra app de estudio.

---

## English

**Knowly** is a free, open-source AI study companion. Upload photos of the whiteboard, textbook pages, PDFs or handwritten notes. Knowly organizes them by subject and builds study guides, flashcards, quizzes, mock exams, whiteboard lessons with voice, podcasts and a spaced-repetition daily review. You can also teach it your own method with **Skills** (`/skill`) and set up **Automations** (e.g. "every time I upload notes, create flashcards and a quiz").

It runs on **your own Anthropic API key**:

- **One click:** use the **Deploy to Netlify** button and set `ANTHROPIC_API_KEY` and `APP_PASSWORD`. Then enter the password in *Ajustes* (Settings).
- **No server:** open `index.html` (or host it on GitHub Pages) and paste your key in *Ajustes → Clave directa*. The key stays in your browser.

All data stays in your browser (IndexedDB), with no accounts and no tracking. The interface is in Spanish. MIT licensed.
