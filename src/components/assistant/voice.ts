/**
 * Voice architecture for the AI helper — TYPES ONLY, intentionally not
 * implemented yet (per product direction: "Do not implement voice yet").
 *
 * When enabled later, `useAssistantVoice()` will layer speech onto the existing
 * text assistant without changing its behavior:
 *   - output: Web Speech API `speechSynthesis`, voice keyed to the active locale
 *   - input:  `SpeechRecognition` (webkitSpeechRecognition), language = active locale
 *   - permission: microphone is requested only on an explicit user tap, never on
 *     load; declining leaves the text assistant fully functional.
 *
 * Keeping this as a flag + interface means the text UI can already branch on
 * `ASSISTANT_VOICE_ENABLED` and render a mic button placeholder if desired,
 * with zero runtime cost while voice is off.
 */

export const ASSISTANT_VOICE_ENABLED = false;

export type AssistantVoiceState = "idle" | "listening" | "speaking";

export interface AssistantVoiceApi {
  readonly supported: boolean;
  readonly state: AssistantVoiceState;
  /** Speak text in the current website language. */
  speak: (text: string) => void;
  /** Begin listening; resolves with the recognized transcript. */
  listen: () => Promise<string>;
  /** Stop any in-progress speech or recognition. */
  stop: () => void;
}
