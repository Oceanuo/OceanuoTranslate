import React, { useState, useCallback } from 'react';
import { copyToClipboard } from '../utils/clipboard';
import LanguageSelector from '../components/LanguageSelector';
import TextArea from '../components/TextArea';

interface Settings {
  apiKey: string;
  apiHost: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  topP: number;
  presencePenalty: number;
  frequencyPenalty: number;
}

const TranslationInterface = ({ settings }: { settings: Settings }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [inputCopied, setInputCopied] = useState(false);
  const [outputCopied, setOutputCopied] = useState(false);
  const [language, setLanguage] = useState('');

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) {
      setOutputText('Please enter some text to translate.');
      return;
    }

    if (!settings.apiKey) {
      setOutputText('Please enter your API key in the settings.');
      return;
    }

    if (!language) {
      setOutputText('Please select a target language.');
      return;
    }

    setIsTranslating(true);
    setOutputText('...');

    try {
      const response = await fetch(settings.apiHost + '/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.apiKey}`
        },
        body: JSON.stringify({
          model: settings.model,
          messages: [
            { role: "system", content: settings.systemPrompt },
            { role: "user", content: `Translate the following source text to ${language}. Output translation directly without any additional text.\nSource Text: ${inputText}\n\nTranslated Text:` }
          ],
          temperature: parseFloat(settings.temperature.toString()),
          top_p: parseFloat(settings.topP.toString()),
          presence_penalty: parseFloat(settings.presencePenalty.toString()),
          frequency_penalty: parseFloat(settings.frequencyPenalty.toString()),
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.replace(/^data: /, '').trim();
          if (trimmedLine === '' || trimmedLine === '[DONE]') continue;

          try {
            const parsedLine = JSON.parse(trimmedLine);
            const { choices } = parsedLine;
            const { delta } = choices[0];
            const { content } = delta;
            if (content) {
              setOutputText((prev) => prev.endsWith('...') ? prev.slice(0, -3) + content + '...' : prev + content + '...');
            }
          } catch (error) {
            console.error('Error parsing JSON:', error);
            console.error('Problematic line:', trimmedLine);
          }
        }
      }

      // Process any remaining data in the buffer
      if (buffer) {
        try {
          const parsedLine = JSON.parse(buffer);
          const { choices } = parsedLine;
          const { delta } = choices[0];
          const { content } = delta;
          if (content) {
            setOutputText((prev) => prev.endsWith('...') ? prev.slice(0, -3) + content : prev + content);
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
          console.error('Problematic line:', buffer);
        }
      }

      setOutputText((prev) => prev.endsWith('...') ? prev.slice(0, -3) : prev);
    } catch (error) {
      console.error('Translation error:', error);
      setOutputText('An error occurred during translation. Please check your settings and try again.');
    } finally {
      setIsTranslating(false);
    }
  }, [inputText, settings, language]);

  const handleCopy = async (text: string, setCopied: (copied: boolean) => void) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col flex-grow gap-6">
      <TextArea
        value={inputText}
        onChange={setInputText}
        placeholder="Enter text to translate"
        onCopy={() => handleCopy(inputText, setInputCopied)}
        onClear={() => setInputText('')}
        copied={inputCopied}
      />
      <LanguageSelector onLanguageChange={setLanguage} />
      <button 
        onClick={handleTranslate} 
        className="translate-button" 
        disabled={isTranslating}
      >
        {isTranslating ? 'Translating...' : 'Translate'}
      </button>
      <TextArea
        value={outputText}
        onChange={setOutputText}
        placeholder="Translation will appear here"
        onCopy={() => handleCopy(outputText, setOutputCopied)}
        onClear={() => setOutputText('')}
        copied={outputCopied}
        readOnly
      />
    </div>
  );
};

export default TranslationInterface;