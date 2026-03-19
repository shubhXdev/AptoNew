import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Subject, Difficulty, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Systematic Topic List for Serieswise Rotation
const ARITHMETIC_TOPICS = [
  "Percentage", "Profit and Loss", "Discount", "Simple Interest", "Compound Interest", 
  "Ratio & Proportion", "Alligation & Mixture", "Average", "Ages", "Partnership", 
  "Time and Work", "Pipes & Cisterns", "Time, Speed & Distance", "Trains", "Boats & Streams",
  "Simplification", "Number System", "LCM and HCF", "Mensuration 2D", "Mensuration 3D",
  "Data Interpretation (Table/Graph)", "Probability (Bank PO level)"
];

export const generateQuestions = async (
  subject: Subject,
  difficulty: Difficulty,
  count: number,
  attemptCount: number // Added to drive serieswise rotation per attempt
): Promise<Question[]> => {
  const modelName = "gemini-3-flash-preview";
  
  // Use a random mission ID + attempt count to force total uniqueness per click
  const missionId = Math.random().toString(36).substring(7).toUpperCase();
  
  // Calculate starting topic for "Serieswise" rotation based on total attempts
  // This ensures that Attempt 1 starts with Topic A, Attempt 2 with Topic B, etc.
  const startTopicIndex = attemptCount % ARITHMETIC_TOPICS.length;
  const rotatedTopics = [
    ...ARITHMETIC_TOPICS.slice(startTopicIndex),
    ...ARITHMETIC_TOPICS.slice(0, startTopicIndex)
  ];

  let prompt = "";
  
  if (subject === Subject.ARITHMETIC) {
    prompt = `
      CURRENT MISSION: #${attemptCount + 1} | SESSION_ID: ${missionId}.
      You are 'Shubham AptiMaster', an expert in Indian Government Exams (SSC CGL, Bank PO, UPSC CSAT, Railways).
      Generate ${count} (16) UNIQUE Arithmetic questions.
      
      INDIAN EXAM CONTEXT:
      - Use Indian names (Ravi, Priya, Amit, etc.).
      - Use Indian Currency (₹ or Rupees).
      - Scenarios: Indian Railways, local markets, GST, MGNREGA, Banking interest rates (SBI/RBI context), or common Indian trade scenarios.
      - Style: Match the language and complexity of SSC CGL Tier-2 or IBPS PO Mains.

      SERIESWISE ROTATION RULE:
      This is Attempt #${attemptCount + 1}. You must rotate the primary focus.
      Prioritize topics in this specific series for this attempt: ${rotatedTopics.join(", ")}.
      
      STRICT UNIQUENESS RULES:
      1. This is a NEW attempt. NEVER repeat scenarios, names, or values from previous generated sets.
      2. Use complex, realistic competitive exam values (avoid simple 10/20/50).
      3. Create fresh scenarios based on modern industry, trade, or governance.
      4. Ensure exactly one question from each of the rotated topics listed above to cover the syllabus systematically.
      
      EXPLANATION CLARITY (MANDATORY):
      - The explanation must be extremely easy to follow.
      - Structure it as:
        1. [Traditional Method]: Step-by-step calculation using standard formulas.
        2. [Shubham's Shortcut]: A 30-second trick or mental math logic to solve it faster.
      - Use clear line breaks between steps.
      
      REQUIRED:
      - 'strategyRules': 3 specific logical steps to decode this type of problem.
      - 'hints': 2 subtle nudges that encourage 'lateral thinking' without giving away the answer.
    `;
  } else if (subject === Subject.REASONING) {
    prompt = `
      CURRENT MISSION: #${attemptCount + 1} | SESSION_ID: ${missionId}.
      You are 'Shubham AptiMaster', an expert in Reasoning for SSC/Bank/UPSC.
      Generate ${count} (25) Reasoning questions. Difficulty: ${difficulty}.
      Include 8 Non-Verbal questions with distinct SVG figures.
      
      CONTEXT: Use Indian names and scenarios (e.g., family trees with Indian relations, seating arrangements in Indian offices).
      
      EXPLANATION: Provide a clear logical breakdown of the pattern used.

      REQUIRED:
      - 'strategyRules': 2-3 logical steps to solve this pattern.
      - 'hints': 1-2 subtle clues to identify the pattern.
    `;
  } else if (subject === Subject.THINKING) {
    prompt = `
      CURRENT MISSION: #${attemptCount + 1} | SESSION_ID: ${missionId}.
      You are 'Shubham AptiMaster'. Generate 2 ELITE Cognitive Power questions for UPSC/State PSC aspirants.
      
      QUESTION 1 (Situation Mock): 
      Provide a fresh administrative dilemma in an Indian district context. The user must analyze 4 possible actions.
      
      QUESTION 2 (Critical Thinking): 
      A complex logical argument or scientific hypothesis. The user must identify the hidden assumption or weakening fact.
      
      REQUIRED:
      - 'strategyRules': 3 specific logical steps to decode this type of problem.
      - 'hints': 2 subtle nudges that encourage 'lateral thinking' without giving away the answer.
      - 'explanation': A deep dive into why the correct option is ethically or logically superior.
    `;
  }

  const questionSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.INTEGER },
        topic: { type: Type.STRING },
        text: { type: Type.STRING },
        figureSVG: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        correctAnswerIndex: { type: Type.INTEGER },
        explanation: { type: Type.STRING },
        hints: { type: Type.ARRAY, items: { type: Type.STRING } },
        strategyRules: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["id", "text", "options", "correctAnswerIndex", "explanation", "topic"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
        systemInstruction: `You are 'Shubham AptiMaster', a high-stakes competitive exam setter for Indian Government Exams (SSC, Bank, UPSC). 
        Mission context: Attempt #${attemptCount + 1}. 
        Your absolute priority is NO REPETITION. Every 'Mission Start' click must feel like a brand-new, unseen exam paper.
        Explanations must be clear, step-by-step, and include both traditional and shortcut methods for Arithmetic.`
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");

    const questions = JSON.parse(jsonText) as Question[];
    return questions.map((q, index) => ({ ...q, id: index }));
  } catch (error) {
    console.error("GenAI Error:", error);
    throw new Error("Failed to construct the New Mission. Please retry.");
  }
};