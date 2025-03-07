import OpenAI from 'openai';
import { LLMProvider, TransactionData, InsightData, ChatMessage, ChatResponse } from '../types';
import { generateLLMPrompt } from '../utils';
import { llmLogger } from '../logging';
import type { ProviderConfig } from '../factory';

interface DeepSeekConfig extends ProviderConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  baseURL?: string;
}

export class DeepSeekProvider implements LLMProvider {
  private client: OpenAI;
  private config: DeepSeekConfig;

  constructor(config: DeepSeekConfig) {
    if (!config.apiKey) {
      throw new Error('DeepSeek API key is required');
    }

    this.config = {
      model: config.model || 'deepseek-chat',
      temperature: config.temperature || 0.7,
      maxTokens: config.maxTokens || 4000,
      systemPrompt: config.systemPrompt || '',
      baseURL: config.baseURL || 'https://api.deepseek.com/v1',
      ...config
    };

    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: this.config.baseURL,
      maxRetries: 3,
      timeout: 60000
    });
  }

  async analyze(data: TransactionData): Promise<InsightData> {
    const startTime = Date.now();
    const prompt = generateLLMPrompt(data);

    try {
      const messages = [
        ...(this.config.systemPrompt ? [{
          role: 'system' as const,
          content: this.config.systemPrompt
        }] : []),
        {
          role: 'user' as const,
          content: prompt
        }
      ];

      const response = await this.client.chat.completions.create({
        model: this.config.model,
        messages,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
        response_format: { type: "json_object" },
        seed: 42,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const content = response.choices[0].message?.content?.trim();
      if (!content) {
        throw new Error('Empty response from DeepSeek');
      }

      let parsedResponse: InsightData;
      try {
        parsedResponse = JSON.parse(content);
      } catch (parseError) {
        llmLogger.log({
          timestamp: new Date().toISOString(),
          provider: 'deepseek',
          prompt,
          error: parseError,
          response: content,
          duration: Date.now() - startTime,
          success: false,
          level: 'error'
        });
        throw new Error('Failed to parse DeepSeek response as JSON');
      }

      // Validate response structure
      if (!Array.isArray(parsedResponse.commentary) || !Array.isArray(parsedResponse.tips)) {
        parsedResponse = {
          commentary: Array.isArray(parsedResponse.commentary) ? parsedResponse.commentary : [],
          tips: Array.isArray(parsedResponse.tips) ? parsedResponse.tips : []
        };
      }

      llmLogger.log({
        timestamp: new Date().toISOString(),
        provider: 'deepseek',
        prompt,
        response: parsedResponse,
        duration: Date.now() - startTime,
        success: true,
        level: 'info'
      });

      return parsedResponse;
    } catch (error) {
      llmLogger.log({
        timestamp: new Date().toISOString(),
        provider: 'deepseek',
        prompt,
        error,
        duration: Date.now() - startTime,
        success: false,
        level: 'error'
      });

      if (error instanceof OpenAI.APIError) {
        throw new Error(`DeepSeek API Error: ${error.message} (Type: ${error.type}, Code: ${error.code})`);
      }
      throw error;
    }
  }

  async chat(messages: ChatMessage[]): Promise<ChatResponse> {
    const startTime = Date.now();

    try {
      const formattedMessages = [
        ...(this.config.systemPrompt ? [{
          role: 'system' as const,
          content: this.config.systemPrompt
        }] : []),
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      const response = await this.client.chat.completions.create({
        model: this.config.model,
        messages: formattedMessages,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
        seed: 42,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const content = response.choices[0].message?.content?.trim();
      if (!content) {
        throw new Error('Empty response from DeepSeek');
      }

      const chatResponse: ChatResponse = {
        content,
        usage: {
          prompt_tokens: response.usage.prompt_tokens,
          completion_tokens: response.usage.completion_tokens,
          total_tokens: response.usage.total_tokens
        }
      };

      llmLogger.log({
        timestamp: new Date().toISOString(),
        provider: 'deepseek',
        prompt: messages[messages.length - 1].content,
        response: chatResponse,
        duration: Date.now() - startTime,
        success: true,
        level: 'info'
      });

      return chatResponse;
    } catch (error) {
      llmLogger.log({
        timestamp: new Date().toISOString(),
        provider: 'deepseek',
        prompt: messages[messages.length - 1].content,
        error,
        duration: Date.now() - startTime,
        success: false,
        level: 'error'
      });

      if (error instanceof OpenAI.APIError) {
        throw new Error(`DeepSeek API Error: ${error.message} (Type: ${error.type}, Code: ${error.code})`);
      }
      throw error;
    }
  }
} 