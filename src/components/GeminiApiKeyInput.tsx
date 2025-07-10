import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GeminiApiKeyInput = () => {
  const [apiKey, setApiKey] = useState("");
  const [isStored, setIsStored] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey && storedKey !== 'your-api-key-here') {
      setIsStored(true);
      setApiKey('••••••••••••••••••••••••••••••••••••••••');
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey || apiKey.length < 20) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid Gemini API key.",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('gemini_api_key', apiKey);
    setIsStored(true);
    toast({
      title: "API Key Saved",
      description: "Your Gemini API key has been saved securely in your browser."
    });
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey("");
    setIsStored(false);
    toast({
      title: "API Key Cleared",
      description: "Your Gemini API key has been removed."
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5 text-brand-purple" />
          Gemini API Configuration
        </CardTitle>
        <CardDescription>
          Enter your Google Gemini API key to enable AI-powered content generation and customer data processing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Your API key is stored locally in your browser and never sent to our servers. 
            <a 
              href="https://ai.google.dev/gemini-api/docs/api-key" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 ml-2 text-brand-purple hover:underline"
            >
              Get your free API key here
              <ExternalLink className="w-3 h-3" />
            </a>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="api-key">Gemini API Key</Label>
          <div className="flex gap-2">
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your Gemini API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
            />
            {isStored ? (
              <Button onClick={handleClearApiKey} variant="outline">
                Clear
              </Button>
            ) : (
              <Button onClick={handleSaveApiKey}>
                Save
              </Button>
            )}
          </div>
        </div>

        {isStored && (
          <Alert>
            <AlertDescription className="text-green-600">
              ✓ API key is configured and ready to use
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default GeminiApiKeyInput;