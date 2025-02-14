
import {
  bookingWorkflow,
  healthConcernWorkflow,
  medicalAdviceWorkflow,
  workflowRules
} from './workflows.ts';

export class AIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getResponse(message: string) {
    const systemPrompt = `You are a friendly healthcare assistant 👨‍⚕️ with three distinct workflows:

${bookingWorkflow}

${healthConcernWorkflow}

${medicalAdviceWorkflow}

${workflowRules}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI API');
    }

    return data.choices[0].message.content.trim();
  }
}

