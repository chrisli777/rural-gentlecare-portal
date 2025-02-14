
interface AIResponse {
  message: string;
  options: string[];
}

export class ResponseHandler {
  static parseAIResponse(aiResponse: string): AIResponse[] {
    if (aiResponse.includes('!BOOK_APPOINTMENT:')) {
      const bookingMatch = aiResponse.match(/!BOOK_APPOINTMENT:\s*({[\s\S]*?})/);
      if (!bookingMatch) {
        throw new Error('Invalid booking format');
      }

      return [{
        message: "Great! I've booked your appointment. Is there anything else you need help with?",
        options: ["I have another question", "No, thank you"]
      }];
    }

    const messageMatch = aiResponse.match(/message:\s*"([^"]+)"/);
    const optionsMatch = aiResponse.match(/options:\s*(\[[\s\S]*?\])/);

    if (messageMatch && optionsMatch) {
      try {
        const message = messageMatch[1];
        const options = JSON.parse(optionsMatch[1]);
        return [{ message, options }];
      } catch (error) {
        console.error('Error parsing message/options format:', error);
      }
    }

    return [{
      message: "How can I help you today?",
      options: ["I need to book an appointment", "I have a health concern", "I need medical advice"]
    }];
  }
}

