
interface AIResponse {
  message: string;
  options: string[];
}

interface WorkflowState {
  workflow: string;
  step: number;
  data: Record<string, string>;
}

export class ResponseHandler {
  static parseAIResponse(aiResponse: string, currentState?: WorkflowState): { responses: AIResponse[], state: WorkflowState | undefined } {
    // Handle appointment booking confirmation
    if (aiResponse.includes('!BOOK_APPOINTMENT:')) {
      const bookingMatch = aiResponse.match(/!BOOK_APPOINTMENT:\s*({[\s\S]*?})/);
      if (!bookingMatch) {
        throw new Error('Invalid booking format');
      }

      return {
        responses: [{
          message: "Great! I've booked your appointment. Is there anything else you need help with?",
          options: ["I have another question", "No, thank you"]
        }],
        state: undefined // Reset state after booking
      };
    }

    // Parse the response to extract message and options
    const messageMatch = aiResponse.match(/message:\s*"([^"]+)"/);
    const optionsMatch = aiResponse.match(/options:\s*(\[[\s\S]*?\])/);

    if (messageMatch && optionsMatch) {
      try {
        const message = messageMatch[1];
        const options = JSON.parse(optionsMatch[1]);
        
        // If this is the start of booking workflow
        if (message.includes("Which part of your body needs attention?")) {
          return {
            responses: [{ message, options }],
            state: {
              workflow: "booking",
              step: 1,
              data: {}
            }
          };
        }
        
        // Continue existing workflow if we have state
        if (currentState?.workflow === "booking") {
          // Update the state with the new data based on the current step
          const newState = {
            ...currentState,
            step: currentState.step + 1,
            data: {
              ...currentState.data,
              // Store the response based on the current step
              [getFieldNameForStep(currentState.step)]: message
            }
          };

          return {
            responses: [{ message, options }],
            state: newState
          };
        }

        return {
          responses: [{ message, options }],
          state: currentState
        };

      } catch (error) {
        console.error('Error parsing message/options format:', error);
      }
    }

    // Default response if no match
    return {
      responses: [{
        message: "How can I help you today?",
        options: ["I need to book an appointment", "I have a health concern", "I need medical advice"]
      }],
      state: undefined
    };
  }
}

function getFieldNameForStep(step: number): string {
  switch (step) {
    case 1:
      return 'bodyPart';
    case 2:
      return 'symptoms';
    case 3:
      return 'appointmentType';
    case 4:
      return 'preferredDate';
    case 5:
      return 'preferredTime';
    default:
      return `step${step}`;
  }
}
