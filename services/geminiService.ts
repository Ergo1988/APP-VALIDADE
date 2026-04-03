import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getUsageSuggestions = async (product: Product): Promise<string> => {
  if (!apiKey) {
    return "Erro: Chave de API não configurada. Verifique o ambiente.";
  }

  try {
    const prompt = `
      Eu tenho o seguinte produto que está perto de vencer ou venceu:
      Produto: ${product.name}
      Categoria: ${product.category}
      Quantidade: ${product.quantity} ${product.unit}
      Data de Vencimento: ${product.expirationDate}

      Por favor, sugira 3 ideias criativas, receitas rápidas ou formas de uso para evitar o desperdício deste produto.
      Se o produto já estiver vencido, avise sobre os riscos e se existe algum uso seguro (ex: compostagem) ou se deve ser descartado imediatamente.
      Responda em português, formatado com markdown simples (bullets).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar sugestões no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao conectar com a IA. Tente novamente mais tarde.";
  }
};
