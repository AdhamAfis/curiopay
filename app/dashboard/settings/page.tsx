"use client"

import { useState, useEffect } from 'react';
import { useTheme } from "@/components/theme/theme-provider";
import { useToast } from "@/components/ui/use-toast";
import type { CategorySettings } from '@/lib/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Moon,
  Sun,
  Globe,
  Upload,
  Download,
  Tags,
  Trash2,
  MoreVertical,
  Brain,
  Check,
  EyeIcon,
  EyeOffIcon,
  Link,
  Palette,
  InfoIcon
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import Image from 'next/image';
import { themes } from "@/lib/themes";
import { useSession } from "next-auth/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserSettings {
  preferences: {
    currency: string;
    language: string;
    theme: string;
    monthlyBudget: number;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  emailVerified: Date | null;
}

interface LLMProvider {
  id: string;
  name: string;
  svgPath: string;
  description: string;
  requiresApiKey: boolean;
  apiKeyPlaceholder?: string;
  apiKeyLink?: string;
  extraSettings?: {
    baseUrl?: boolean;
    modelOptions?: string[];
    customModel?: boolean;
    contextLength?: boolean;
    temperature?: boolean;
    maxTokens?: boolean;
  };
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [settings, setSettings] = useState<UserSettings>({
    preferences: {
      currency: 'USD',
      language: 'en',
      theme: theme,
      monthlyBudget: 0
    },
    notifications: {
      email: false,
      push: false,
      sms: false
    },
    emailVerified: null
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategorySettings[]>([]);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategorySettings | null>(null);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showLLMDialog, setShowLLMDialog] = useState(false);
  const [selectedLLM, setSelectedLLM] = useState<string>('gpt-4'); // or whatever default
  const [showApiKey, setShowApiKey] = useState<{[key: string]: boolean}>({});
  const [apiKeys, setApiKeys] = useState<{[key: string]: string}>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('llm-api-keys') || '{}');
    }
    return {};
  });
  const [ollamaSettings, setOllamaSettings] = useState({
    baseUrl: 'http://localhost:11434',
    model: 'llama2',
  });
  const [showProviderConfig, setShowProviderConfig] = useState(false);
  const [ollamaConfig, setOllamaConfig] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedConfig = localStorage.getItem('ollama-config');
      return savedConfig ? JSON.parse(savedConfig) : {
        baseUrl: 'http://localhost:11434',
        model: 'llama2',
        customModel: '',
        contextLength: 4096,
        temperature: 0.7,
      };
    }
    return {
      baseUrl: 'http://localhost:11434',
      model: 'llama2',
      customModel: '',
      contextLength: 4096,
      temperature: 0.7,
    };
  });
  const [defaultLLM, setDefaultLLM] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('default-llm') || 'openai';
    }
    return 'openai';
  });
  const [providerConfigs, setProviderConfigs] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('provider-configs') || '{}');
    }
    return {};
  });

  const llmProviders: LLMProvider[] = [
    {
      id: 'openai',
      name: 'OpenAI',
      svgPath: '/openai.svg',
      description: 'GPT-4 Turbo and GPT-3.5 Turbo',
      requiresApiKey: true,
      apiKeyPlaceholder: 'sk-...',
      apiKeyLink: 'https://platform.openai.com/api-keys',
      extraSettings: {
        modelOptions: [
          'gpt-4-turbo-preview',
          'gpt-4',
          'gpt-3.5-turbo'
        ],
        customModel: true,
        temperature: true,
        maxTokens: true,
      },
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      svgPath: '/anthropic.svg',
      description: 'Claude 3 models',
      requiresApiKey: true,
      apiKeyPlaceholder: 'sk-ant-...',
      apiKeyLink: 'https://console.anthropic.com/settings/keys',
      extraSettings: {
        modelOptions: [
          'claude-3-opus-20240229',
          'claude-3-sonnet-20240229',
          'claude-3-haiku-20240307'
        ],
        temperature: true,
        maxTokens: true,
      },
    },
    {
      id: 'ollama',
      name: 'Ollama',
      svgPath: '/ollama.png',
      description: 'Run models locally',
      requiresApiKey: false,
      extraSettings: {
        baseUrl: true,
        modelOptions: [
          'llama2',
          'mistral',
          'codellama',
          'dolphin-phi',
          'neural-chat',
          'starling-lm',
          'orca-mini',
          'vicuna'
        ],
        customModel: true,
        contextLength: true,
        temperature: true,
        maxTokens: true,
      },
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      svgPath: '/gemini.svg',
      description: 'Gemini Pro and Ultra',
      requiresApiKey: true,
      apiKeyPlaceholder: 'g-...',
      apiKeyLink: 'https://ai.google.dev/',
      extraSettings: {
        modelOptions: [
          'gemini-pro',
          'gemini-pro-vision'
        ],
        temperature: true,
        maxTokens: true,
      },
    },
    {
      id: 'cohere',
      name: 'Cohere',
      svgPath: '/cohere.svg',
      description: 'Command and other models',
      requiresApiKey: true,
      apiKeyPlaceholder: '...',
      apiKeyLink: 'https://dashboard.cohere.com/api-keys',
      extraSettings: {
        modelOptions: [
          'command',
          'command-light',
          'command-nightly',
          'command-light-nightly'
        ],
        temperature: true,
        maxTokens: true,
      },
    },
    {
      id: 'mistral',
      name: 'Mistral',
      svgPath: '/mistral.svg',
      description: 'Mistral Large and Medium',
      requiresApiKey: true,
      apiKeyPlaceholder: '...',
      apiKeyLink: 'https://console.mistral.ai/api-keys/',
      extraSettings: {
        modelOptions: [
          'mistral-large-latest',
          'mistral-medium-latest',
          'mistral-small-latest'
        ],
        temperature: true,
        maxTokens: true,
      },
    },
    {
      id: 'azure',
      name: 'Azure OpenAI',
      svgPath: '/azure.svg',
      description: 'Azure-hosted OpenAI models',
      requiresApiKey: true,
      apiKeyPlaceholder: '...',
      apiKeyLink: 'https://portal.azure.com/',
      extraSettings: {
        baseUrl: true,
        modelOptions: [
          'gpt-4',
          'gpt-35-turbo'
        ],
        temperature: true,
        maxTokens: true,
      },
    },
    {
      id: 'groq',
      name: 'Groq',
      svgPath: '/groq.svg',
      description: 'Ultra-fast inference',
      requiresApiKey: true,
      apiKeyPlaceholder: 'gsk_...',
      apiKeyLink: 'https://console.groq.com/keys',
      extraSettings: {
        modelOptions: [
          'mixtral-8x7b-32768',
          'llama2-70b-4096',
          'gemma-7b-it'
        ],
        customModel: true,
        temperature: true,
        maxTokens: true,
      },
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      svgPath: '/deepseek.svg',
      description: 'DeepSeek Chat and Code models',
      requiresApiKey: true,
      apiKeyPlaceholder: 'sk-...',
      apiKeyLink: 'https://platform.deepseek.ai/api-keys',
      extraSettings: {
        modelOptions: [
          'deepseek-chat',
          'deepseek-coder',
          'deepseek-math',
          'deepseek-chinese',
        ],
        customModel: true,
        temperature: true,
        maxTokens: true,
        baseUrl: true,
      },
    },
  ];

  const defaultProviderConfigs: { [key: string]: any } = {
    openai: {
      model: 'gpt-4-turbo-preview',
      temperature: 0.7,
      maxTokens: 4000,
    },
    anthropic: {
      model: 'claude-3-opus-20240229',
      temperature: 0.7,
      maxTokens: 4000,
    },
    ollama: {
      baseUrl: 'http://localhost:11434',
      model: 'llama2',
      customModel: '',
      contextLength: 4096,
      temperature: 0.7,
      maxTokens: 4000,
    },
    gemini: {
      model: 'gemini-pro',
      temperature: 0.7,
      maxTokens: 4000,
    },
    cohere: {
      model: 'command',
      temperature: 0.7,
      maxTokens: 4000,
    },
    mistral: {
      model: 'mistral-large-latest',
      temperature: 0.7,
      maxTokens: 4000,
    },
    azure: {
      model: 'gpt-4',
      baseUrl: '',
      temperature: 0.7,
      maxTokens: 4000,
    },
    groq: {
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      maxTokens: 4000,
    },
    deepseek: {
      model: 'deepseek-chat',
      temperature: 0.7,
      maxTokens: 4000,
    }
  };

  const handleResetProviderConfig = (providerId: string) => {
    const defaultConfig = defaultProviderConfigs[providerId];
    if (defaultConfig) {
      setProviderConfigs(prev => ({
        ...prev,
        [providerId]: defaultConfig
      }));
      localStorage.setItem('provider-configs', JSON.stringify({
        ...providerConfigs,
        [providerId]: defaultConfig
      }));
      toast({
        title: "Reset Complete",
        description: "Provider settings have been reset to defaults.",
      });
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchCategories();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not load your settings. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not load your categories. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleSettingChange = async (updates: Partial<UserSettings>) => {
    setLoading(true);
    try {
      const newSettings = { ...settings, ...updates };
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) throw new Error('Failed to update settings');
      
      // Update localStorage and state
      if (updates.preferences?.theme) {
        localStorage.setItem('theme', updates.preferences.theme);
      }
      
      setSettings(newSettings);
      toast({
        title: "Success",
        description: "Your settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update your settings. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryAction = async (action: 'create' | 'update' | 'delete', category?: CategorySettings) => {
    try {
      const url = '/api/categories' + (category?.id ? `/${category.id}` : '');
      const method = action === 'create' ? 'POST' : action === 'update' ? 'PUT' : 'DELETE';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: action !== 'delete' ? JSON.stringify(category) : undefined,
      });

      if (!response.ok) throw new Error(`Failed to ${action} category`);
      
      await fetchCategories();
      toast({
        title: "Success",
        description: `Category ${action === 'create' ? 'created' : action === 'update' ? 'updated' : 'deleted'} successfully.`,
      });
      setShowCategoryDialog(false);
      setEditingCategory(null);
    } catch (error) {
      toast({
        title: "Error",
        description: `Could not ${action} category. Please try again later.`,
        variant: "destructive",
      });
    }
  };

  const handleDataExport = async () => {
    try {
      // First check if verification is needed
      const checkResponse = await fetch('/api/verify', {
        method: 'GET'
      });
      const { verified } = await checkResponse.json();

      if (!verified) {
        setShowVerifyDialog(true);
        return;
      }

      // If verified, show export confirmation dialog
      setShowExportDialog(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not verify your export request. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleExportConfirm = async () => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Export failed');
      toast({
        title: "Success",
        description: "Your data export has been sent to your email address.",
      });
      setShowExportDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not export your data. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleVerificationConfirm = async () => {
    try {
      const response = await fetch('/api/verify', {
        method: 'POST'
      });
      const data = await response.json();
      toast({
        title: "Success",
        description: "Please check your email for the verification link.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not send verification email. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setShowVerifyDialog(false);
    }
  };

  const handleDataImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Import failed');
      toast({
        title: "Success",
        description: "Your data has been imported successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not import your data. Please ensure the file format is correct.",
        variant: "destructive",
      });
    }
  };

  const handleClearData = async () => {
    try {
      const response = await fetch('/api/settings/clear-data', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to clear data');
      toast({
        title: "Success",
        description: "All your data has been cleared successfully.",
      });
      setShowClearDataDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not clear your data. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/settings/delete-account', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to delete account');
      toast({
        title: "Success",
        description: "Your account will be deleted shortly. You will be redirected...",
      });
      // Redirect to home page after a short delay
      setTimeout(() => window.location.href = '/', 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete your account. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleLLMSelection = async (llmId: string) => {
    try {
      setSelectedLLM(llmId);
      // Add your API call here to update the LLM preference
      toast({
        title: "Success",
        description: "LLM preference updated successfully.",
      });
      setShowLLMDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update LLM preference.",
        variant: "destructive",
      });
    }
  };

  const handleApiKeyChange = (providerId: string, value: string) => {
    const newApiKeys = { ...apiKeys, [providerId]: value };
    setApiKeys(newApiKeys);
    localStorage.setItem('llm-api-keys', JSON.stringify(newApiKeys));
  };

  const handleOllamaSettingsChange = (settings: typeof ollamaSettings) => {
    setOllamaSettings(settings);
    localStorage.setItem('ollama-settings', JSON.stringify(settings));
  };

  const handleOllamaConfigChange = (updates: Partial<typeof ollamaConfig>) => {
    const newConfig = { ...ollamaConfig, ...updates };
    setOllamaConfig(newConfig);
    localStorage.setItem('ollama-config', JSON.stringify(newConfig));

    // Also update the provider settings in apiKeys
    if (selectedLLM === 'ollama') {
      const ollamaProviderConfig = {
        baseUrl: newConfig.baseUrl,
        model: newConfig.customModel || newConfig.model,
        contextLength: newConfig.contextLength,
        temperature: newConfig.temperature
      };
      handleApiKeyChange('ollama-config', JSON.stringify(ollamaProviderConfig));
    }
  };

  // Add this function to handle default LLM change
  const handleDefaultLLMChange = (llmId: string) => {
    setDefaultLLM(llmId);
    localStorage.setItem('default-llm', llmId);
    toast({
      title: "Success",
      description: "Default LLM updated successfully.",
    });
  };

  const handleProviderConfigChange = (providerId: string, updates: any) => {
    const newConfig = {
      ...providerConfigs[providerId],
      ...updates
    };
    setProviderConfigs(prev => ({
      ...prev,
      [providerId]: newConfig
    }));
    localStorage.setItem('provider-configs', JSON.stringify({
      ...providerConfigs,
      [providerId]: newConfig
    }));
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="w-full h-full p-4 md:p-6 lg:p-8">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">Settings</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:gap-8">
            {/* Preferences */}
            <section>
              <h2 className="text-lg font-semibold mb-2 sm:mb-4">Preferences</h2>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <label className="font-medium">Currency</label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred currency
                    </p>
                  </div>
                  <Select
                    value={settings.preferences.currency}
                    onValueChange={(value) => handleSettingChange({ 
                      preferences: { ...settings.preferences, currency: value }
                    })}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section>
              <h2 className="text-lg font-semibold mb-2 sm:mb-4">Notifications</h2>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      <label className="font-medium">Email Notifications</label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates about your expenses
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => 
                      handleSettingChange({ 
                        notifications: { ...settings.notifications, email: checked }
                      })
                    }
                    disabled={loading || !settings.emailVerified}
                  />
                </div>
                {!settings.emailVerified && (
                  <Alert className="mt-2">
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Email Not Verified</AlertTitle>
                    <AlertDescription>
                      You need to verify your email address to receive notifications.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </section>

            {/* Email Verification */}
            {!settings.emailVerified && (
              <section>
                <h2 className="text-lg font-semibold mb-2 sm:mb-4">Email Verification</h2>
                <div className="space-y-4">
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Verify Your Email</AlertTitle>
                    <AlertDescription className="mt-2">
                      Some features are restricted until you verify your email address:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Exporting your data</li>
                        <li>Receiving email notifications</li>
                        <li>Account recovery options</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                  <Button
                    variant="default"
                    onClick={() => setShowVerifyDialog(true)}
                    className="w-full sm:w-auto"
                  >
                    Verify Email Address
                  </Button>
                </div>
              </section>
            )}

            {/* AI Settings */}
            <section>
              <h2 className="text-lg font-semibold mb-2 sm:mb-4">AI Settings</h2>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      <label className="font-medium">Language Model</label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred AI language model
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <Select value={defaultLLM} onValueChange={handleDefaultLLMChange}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Choose default LLM" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {llmProviders.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id}>
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={() => setShowLLMDialog(true)}
                      className="flex items-center gap-2"
                    >
                      Configure
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Management */}
            <section>
              <h2 className="text-lg font-semibold mb-2 sm:mb-4">Data Management</h2>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={handleDataExport}
                    disabled={loading}
                  >
                    <Download className="w-4 h-4" />
                    Export Data
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex items-center gap-2"
                    onClick={() => setShowClearDataDialog(true)}
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All Data
                  </Button>
                </div>
              </div>
            </section>

            {/* Account Actions */}
            <section>
              <h2 className="text-lg font-semibold mb-2 sm:mb-4 text-red-600">Danger Zone</h2>
              <div className="space-y-4 border-2 border-red-200 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <div>
                    <h3 className="font-medium">Delete Account</h3>
                    <p className="text-sm text-muted-foreground">
                      This will permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteAccountDialog(true)}
                    className="w-full sm:w-auto"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Email Verification Required</AlertDialogTitle>
            <AlertDialogDescription>
              To export your data, we need to verify your email address. Would you like to receive a verification email?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleVerificationConfirm}>
              Send Verification Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showDeleteAccountDialog} onOpenChange={setShowDeleteAccountDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove all of your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showClearDataDialog} onOpenChange={setShowClearDataDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your transactions and financial records.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearData}
              className="bg-red-600 hover:bg-red-700"
            >
              Clear All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Export Data</AlertDialogTitle>
            <AlertDialogDescription>
              This will generate a file containing all your financial records and send it to your email address.
              Do you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleExportConfirm}
            >
              Export Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={showLLMDialog} onOpenChange={setShowLLMDialog}>
        <DialogContent className="sm:max-w-[800px] w-[95vw] max-h-[90vh] p-6 overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-2xl font-bold">Choose Language Model</DialogTitle>
          </DialogHeader>
          
          <Alert className="mt-4 mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>New Providers Available!</AlertTitle>
            <AlertDescription>
              We've added support for several new LLM providers: Mistral AI, Azure OpenAI, Gemini, OpenAI and Anthropic.
              These integrations are currently in beta testing and may have limited functionality.
              For the most stable experience, we recommend using Groq, Cohere, or Ollama.
            </AlertDescription>
          </Alert>

          <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {llmProviders.map((provider) => (
                <div
                  key={provider.id}
                  className={`relative cursor-pointer group`}
                  onClick={() => {
                    setSelectedLLM(provider.id);
                    setShowProviderConfig(true);
                  }}
                >
                  <div className={`
                    p-6 rounded-lg border-2 
                    ${selectedLLM === provider.id ? 'border-primary bg-primary/5' : 'border-border'}
                    hover:border-primary hover:bg-primary/5 transition-all
                    aspect-square flex flex-col items-center justify-center gap-4
                    bg-card relative
                  `}>
                    <div className="w-12 h-12 relative mb-2">
                      <Image
                        src={provider.svgPath}
                        alt={provider.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {provider.description}
                      </p>
                    </div>
                    {selectedLLM === provider.id && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    {provider.id !== 'ollama' && provider.requiresApiKey && (
                      <div className="absolute bottom-2 right-2">
                        <Link className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showProviderConfig} onOpenChange={setShowProviderConfig}>
        <DialogContent className="sm:max-w-[800px] w-[95vw] h-[90vh] sm:h-auto max-h-[90vh] p-6 overflow-hidden flex flex-col gap-6 bg-background">
          <DialogHeader className="flex-shrink-0 space-y-2">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-8 h-8 relative">
                <Image
                  src={llmProviders.find(p => p.id === selectedLLM)?.svgPath || ''}
                  alt={llmProviders.find(p => p.id === selectedLLM)?.name || ''}
                  fill
                  className="object-contain"
                />
              </div>
              Configure {llmProviders.find(p => p.id === selectedLLM)?.name}
            </DialogTitle>
            <DialogDescription>
              Configure your settings for {llmProviders.find(p => p.id === selectedLLM)?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="model">Model</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <div className="space-y-4">
                  {/* API Key Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">API Key</Label>
                      {llmProviders.find(p => p.id === selectedLLM)?.apiKeyLink && (
                        <a
                          href={llmProviders.find(p => p.id === selectedLLM)?.apiKeyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          Get API Key <Link className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        type={showApiKey[selectedLLM] ? 'text' : 'password'}
                        value={apiKeys[selectedLLM] || ''}
                        onChange={(e) => handleApiKeyChange(selectedLLM, e.target.value)}
                        placeholder={llmProviders.find(p => p.id === selectedLLM)?.apiKeyPlaceholder}
                        className="font-mono pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowApiKey(prev => ({
                          ...prev,
                          [selectedLLM]: !prev[selectedLLM]
                        }))}
                      >
                        {showApiKey[selectedLLM] ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Base URL Section */}
                  {llmProviders.find(p => p.id === selectedLLM)?.extraSettings?.baseUrl && (
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Base URL</Label>
                      <Input
                        value={providerConfigs[selectedLLM]?.baseUrl || ''}
                        onChange={(e) => handleProviderConfigChange(selectedLLM, { baseUrl: e.target.value })}
                        placeholder="https://your-endpoint.com"
                        className="font-mono"
                      />
                      <p className="text-sm text-muted-foreground">
                        The API endpoint URL for your service
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="model" className="space-y-6">
                <div className="space-y-4">
                  {/* Model Selection */}
                  {llmProviders.find(p => p.id === selectedLLM)?.extraSettings?.modelOptions && (
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Model</Label>
                      <Select
                        value={providerConfigs[selectedLLM]?.model || llmProviders.find(p => p.id === selectedLLM)?.extraSettings?.modelOptions?.[0]}
                        onValueChange={(value) => handleProviderConfigChange(selectedLLM, { model: value })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          {llmProviders.find(p => p.id === selectedLLM)?.extraSettings?.modelOptions?.map(model => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                          {llmProviders.find(p => p.id === selectedLLM)?.extraSettings?.customModel && (
                            <SelectItem value="custom">Custom Model</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Custom Model Name */}
                  {providerConfigs[selectedLLM]?.model === 'custom' && (
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Custom Model Name</Label>
                      <Input
                        placeholder="Enter custom model name"
                        value={providerConfigs[selectedLLM]?.customModelName || ''}
                        onChange={(e) => handleProviderConfigChange(selectedLLM, { customModelName: e.target.value })}
                        className="font-mono"
                      />
                      <p className="text-sm text-muted-foreground">
                        Enter the exact model name/ID as specified by the provider
                      </p>
                    </div>
                  )}

                  {/* Temperature Control */}
                  {llmProviders.find(p => p.id === selectedLLM)?.extraSettings?.temperature && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-base font-medium">Temperature</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <InfoIcon className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Controls randomness in responses. Higher values make the output more creative but less predictable.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex gap-4 items-center">
                        <Input
                          type="range"
                          min={0}
                          max={2}
                          step={0.1}
                          value={providerConfigs[selectedLLM]?.temperature || 0.7}
                          onChange={(e) => handleProviderConfigChange(selectedLLM, { temperature: parseFloat(e.target.value) })}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          min={0}
                          max={2}
                          step={0.1}
                          value={providerConfigs[selectedLLM]?.temperature || 0.7}
                          onChange={(e) => handleProviderConfigChange(selectedLLM, { temperature: parseFloat(e.target.value) })}
                          className="w-20 font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6">
                <div className="space-y-4">
                  {/* Max Tokens Control */}
                  {llmProviders.find(p => p.id === selectedLLM)?.extraSettings?.maxTokens && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-base font-medium">Max Tokens</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <InfoIcon className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Maximum number of tokens to generate in the response. Higher values allow for longer responses but cost more.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex gap-4 items-center">
                        <Input
                          type="range"
                          min={1}
                          max={32000}
                          step={1}
                          value={providerConfigs[selectedLLM]?.maxTokens || 4000}
                          onChange={(e) => handleProviderConfigChange(selectedLLM, { maxTokens: parseInt(e.target.value) })}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          min={1}
                          max={32000}
                          value={providerConfigs[selectedLLM]?.maxTokens || 4000}
                          onChange={(e) => handleProviderConfigChange(selectedLLM, { maxTokens: parseInt(e.target.value) })}
                          className="w-24 font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* Context Length for Ollama */}
                  {selectedLLM === 'ollama' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-base font-medium">Context Length</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <InfoIcon className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Maximum number of tokens to consider for context. Higher values allow the model to reference more previous conversation but use more memory.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        type="number"
                        value={ollamaConfig.contextLength}
                        onChange={(e) => handleOllamaConfigChange({ contextLength: parseInt(e.target.value) })}
                        min={1}
                        max={32768}
                        className="font-mono"
                      />
                    </div>
                  )}
                </div>

                {selectedLLM === 'azure' && (
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Azure Configuration</AlertTitle>
                    <AlertDescription>
                      Make sure to provide both the API key and the Azure endpoint URL. The model field should match your Azure deployment name.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => handleResetProviderConfig(selectedLLM)}
              className="order-last sm:order-first sm:mr-auto"
            >
              Reset to Default
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowProviderConfig(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleDefaultLLMChange(selectedLLM);
                setShowProviderConfig(false);
                setShowLLMDialog(false);
              }}
            >
              Save & Set as Default
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}