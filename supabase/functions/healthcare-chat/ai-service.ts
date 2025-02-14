
export class AIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getResponse(message: string) {
    // If message indicates booking, start workflow immediately
    if (message.toLowerCase().includes('i need to book an appointment')) {
      return `message: "Which part of your body needs attention? 🩺"
options: ["Head/Face", "Chest/Heart", "Stomach/Digestive", "Back/Spine", "Arms/Hands", "Legs/Feet", "Skin", "Other"]`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a healthcare assistant helping patients book appointments and provide health advice. Follow these workflows exactly:

1. BOOKING WORKFLOW:
When user wants to book an appointment, start with asking about body part, then follow the exact steps in order.
Never skip steps or change their order.

2. HEALTH CONCERNS:
For health concerns, ask appropriate questions to understand the issue.

3. MEDICAL ADVICE:
Provide helpful medical information and suggest booking if needed.

ALWAYS format responses as:
message: "Your message here"
options: ["Option 1", "Option 2", "Option 3"]`
          },
          {
            role: "user",
            content: message
          }
        ],
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }
}
