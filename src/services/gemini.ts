import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

export async function generateQuestion(context: string): Promise<string> {
  const prompt = `You are a professional interviewer. Based on this context: "${context}", generate a relevant follow-up interview question. Make it natural and conversational.`;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function evaluateResponse(question: string, response: string): Promise<string> {
  const prompt = `As an expert interviewer, evaluate this response to the question: "${question}". Response: "${response}". 
    Provide constructive feedback including:
    1. Strengths of the answer
    2. Areas for improvement
    3. Overall rating (1-10)
    Make the feedback professional and helpful.`;
  
  const result = await model.generateContent(prompt);
  const feedback = await result.response;
  return feedback.text();
}

export async function generateFinalReport(responses: { question: string; response: string; feedback: string }[]): Promise<string> {
  const prompt = `As an interview coach, create a comprehensive evaluation report based on these interview responses:
    ${responses.map(r => `
      Question: ${r.question}
      Response: ${r.response}
      Feedback: ${r.feedback}
    `).join('\n')}
    
    Include:
    1. Overall performance summary
    2. Key strengths demonstrated
    3. Areas for improvement
    4. Specific recommendations for future interviews
    5. Final score (1-100)`;
  
  const result = await model.generateContent(prompt);
  const report = await result.response;
  return report.text();
}