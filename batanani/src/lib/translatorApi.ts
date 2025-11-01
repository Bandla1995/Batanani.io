// Re-export Chrome translator functions for backward compatibility
export {
	translateText,
	translateWithChrome,
	translateStreaming,
	checkTranslatorAvailability,
	canTranslate,
	createTranslator,
	destroyAllTranslators,
	destroyTranslator,
	getSupportedLanguages,
	detectLanguage,
} from './chromeTranslator';
