<div align="center">

<img src="icons/icon-192.png" width="88" alt="Knowly">

# Knowly

**Tu compañero de estudio con IA, gratis y de código abierto.**

Sube fotos de la pizarra, del libro, PDFs o apuntes escritos a mano. Knowly los ordena por materias y te prepara guías, flashcards, quizzes, simulacros de examen, clases en pizarra con voz y podcasts.

Usa **tu propia API key** de Anthropic (Claude). Pagas solo lo que usas, normalmente 1-4 $ al mes.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/TU_USUARIO/knowly)

[English summary](#english) · [Cómo instalarlo](#instalación) · [Funciones](#funciones) · [Privacidad](#privacidad-y-datos)

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

Necesitas una **API key de Anthropic**. Créala en [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys). Te recomiendo poner un límite de gasto mensual en **Settings → Limits** (por ejemplo, 10 $).

### Opción A: un clic en Netlify (recomendada)

1. Haz un *fork* de este repo o pulsa el botón **Deploy to Netlify** de arriba.
2. Netlify te pedirá dos cosas:
   - `ANTHROPIC_API_KEY`: tu API key.
   - `APP_PASSWORD`: una contraseña que inventes. Así nadie más puede gastar tu saldo aunque encuentre tu web.
3. Cuando termine, abre tu web, ve a **Ajustes** (abajo a la izquierda) y escribe esa contraseña.

Tu API key se queda guardada en Netlify y nunca llega al navegador.

### Opción B: sin servidor (la más rápida)

1. Descarga el repo (**Code → Download ZIP**) y abre `index.html` en Chrome o Safari. También puedes publicarlo gratis en **GitHub Pages**.
2. En **Ajustes → Clave directa**, pega tu API key.

La key se guarda solo en tu navegador. Es cómodo para uso personal, pero no compartas ese navegador ni esa URL con tu key puesta.

### Opción C: Netlify desde la terminal

```bash
npm install -g netlify-cli
git clone https://github.com/TU_USUARIO/knowly.git && cd knowly
netlify login
netlify sites:create --name knowly-tunombre
netlify link --name knowly-tunombre
netlify env:set ANTHROPIC_API_KEY "sk-ant-..."
netlify env:set APP_PASSWORD "tu-contraseña"
netlify deploy --prod
```

Para probarlo en local con la función de IA: copia `.env.example` como `.env`, rellénalo y ejecuta `netlify dev`.

> ⚠️ Arrastrar la carpeta a *Netlify Drop* no sirve, porque la función de la IA no se publicaría. Usa la opción A o la C.

### Instalarla como app

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
- `netlify/edge-functions/ai.js`: un proxy pequeño que añade tu API key y comprueba la contraseña. Usa *streaming*, así que las respuestas largas no se cortan.
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
