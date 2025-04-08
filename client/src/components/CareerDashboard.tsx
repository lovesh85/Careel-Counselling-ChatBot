import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface CareerDashboardProps {
  onClose: () => void;
}

export default function CareerDashboard({ onClose }: CareerDashboardProps) {
  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Career Dashboard</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Explore career paths, job trends, and educational requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 text-center">
            <h3 className="text-lg font-medium mb-4">Career Dashboard Coming Soon</h3>
            <p className="text-muted-foreground">
              This feature is currently under development. Please take the aptitude assessment 
              for personalized career recommendations.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </CardFooter>
      </Card>
    </div>
  );
}