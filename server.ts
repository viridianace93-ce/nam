import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'SnapMeal' });
  });

  // AI Smart Suggestion Endpoint using Google GenAI SDK (Gemini 2.5 Flash)
  app.post('/api/ai-combos', async (req, res) => {
    try {
      const { ingredients, texturePreference } = req.body;

      if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: 'Ingredientes requeridos' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({
          warning: 'No GEMINI_API_KEY configured, using local engine',
          combos: []
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Eres una nutricionista especializada en alimentación compasiva y de bajo esfuerzo para personas con pérdida de apetito o fatiga por tratamientos médicos.
Tienen los siguientes ingredientes en su alacena/refrigerador:
${ingredients.map(i => `- ${i.name} (${i.category})`).join('\n')}
Preferencia de textura/digestión: ${texturePreference || 'amable / cualquiera'}

Genera exactamente 2 a 3 combinaciones de snacks que cumplan:
1. CERO conteo de calorías, CERO lenguaje de dietas restrictivas.
2. Máximo 2 a 3 ingredientes por combinación.
3. Tiempo de preparación máximo 1 a 2 minutos (cero o mínima cocción).
4. Textura amable y digestible.

Devuelve estrictamente un JSON válido con esta estructura:
{
  "combos": [
    {
      "id": "ai-1",
      "title": "Nombre descriptivo y apetecible",
      "formula": ["Ingrediente 1", "Ingrediente 2", "Toque sutil (ej: pizca canela o aceite)"],
      "prepTime": "1 MIN",
      "benefitTag": "BALANCE COMPLETO" | "ALTA ENERGÍA" | "FÁCIL DIGESTIÓN" | "FRESCO & LIGERO",
      "cardTheme": "mint" | "blush" | "teal",
      "whyItWorks": "Explicación cálida y empática de 1-2 frases sobre por qué este bocado sienta bien al estómago.",
      "prepStep": "Instrucción de 1 paso muy simple."
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch (error: any) {
      console.error('Error generating AI combos:', error);
      return res.status(500).json({ error: 'Error al generar sugerencias AI', details: error.message });
    }
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SnapMeal server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
