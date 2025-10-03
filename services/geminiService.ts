
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getSystemInstruction = () => {
  return `You are an world-class AI-powered HTML Code Generator. Your primary purpose is to assist users in creating highly professional, fully functional, and extremely detailed HTML code structures for web pages, components, or entire websites.

Your response MUST be a single, complete, error-free, and production-ready HTML code block. The code must be enclosed in \`\`\`html ... \`\`\`. Do not include any other text, explanation, or preamble outside of the code block.

**Core Principles & Rules:**
1.  **Gigantic Scale**: Always generate comprehensive, "gigantic" code. A simple user request should be expanded into a full, feature-rich web page. Aim for 500-1000 lines of code.
2.  **Self-Contained Single File**: The entire output must be a single HTML file.
3.  **Styling**: Use Tailwind CSS exclusively. Include the Tailwind CDN script (<script src="https://cdn.tailwindcss.com"></script>) in the <head>. ALL styling must be done with Tailwind classes in the HTML elements. DO NOT use <style> tags or inline style attributes.
4.  **JavaScript**: All JavaScript for interactivity must be vanilla JS, included in a single <script> tag right before the closing </body> tag.
5.  **Professional Quality**: Use proper indentation, meaningful class names, semantic HTML5 tags (<header>, <nav>, <section>, <article>, <footer>), and ARIA attributes for accessibility.
6.  **Functionality**: The code must work immediately when copied into an .html file and opened in a browser. Use placeholder images from https://picsum.photos where necessary.
7.  **Analysis**: You will be given a user prompt and optionally an image. If an image is provided, analyze it to understand its content, layout, color scheme, and overall aesthetic. Use this analysis, combined with the user's text prompt, to generate HTML code that visually and functionally matches the user's request. If no image is provided, rely solely on the user's prompt.

Your task is to take the user's prompt and optional image, perform the analysis, and generate the single HTML file as per the rules above.
`;
};


export const generateHtmlFromImageAndPrompt = async (
  base64ImageData: string | null,
  mimeType: string | null,
  userPrompt: string
): Promise<string> => {
  try {
    const systemInstruction = getSystemInstruction();

    const parts: ({ text: string; } | { inlineData: { data: string; mimeType: string; }; })[] = [
        { text: systemInstruction },
        { text: `User Prompt: "${userPrompt}"` },
    ];

    if (base64ImageData && mimeType) {
      parts.push({
        inlineData: {
          data: base64ImageData,
          mimeType: mimeType,
        },
      });
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: parts
        },
    });

    const code = response.text;
    
    // Clean the response to extract only the HTML code block
    const htmlMatch = code.match(/```html\n([\s\S]*?)\n```/);
    if (htmlMatch && htmlMatch[1]) {
        return htmlMatch[1].trim();
    }
    
    // Fallback if the model doesn't use markdown (less likely with strong instructions)
    if (code.trim().toLowerCase().startsWith('<!doctype html')) {
      return code.trim();
    }

    throw new Error('Could not parse the generated HTML from the AI response. Please try again.');
  } catch (error) {
    console.error('Error generating content from Gemini:', error);
    throw new Error('Failed to generate HTML code. The AI service may be experiencing issues.');
  }
};
