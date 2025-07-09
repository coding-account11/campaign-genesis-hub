import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const Support = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <HelpCircle className="w-8 h-8 text-brand-teal" />
          Support
        </h1>
        <p className="text-muted-foreground mt-2">Get help and support</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Help & Support</CardTitle>
          <CardDescription>Coming soon - access help documentation, tutorials, and contact support.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Support resources will be available in a future update.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;