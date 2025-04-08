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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-[#202123] border-[#4D4D4F] text-white">
              <CardHeader>
                <CardTitle className="text-base">Popular Career Paths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Software Development</span>
                    <span className="text-green-500">+24% growth</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Data Science</span>
                    <span className="text-green-500">+22% growth</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Healthcare Administration</span>
                    <span className="text-green-500">+18% growth</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Digital Marketing</span>
                    <span className="text-green-500">+16% growth</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-[#202123] border-[#4D4D4F] text-white">
              <CardHeader>
                <CardTitle className="text-base">Skills in Demand</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>AI/Machine Learning</span>
                    <span className="text-blue-500">Tech</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Data Analysis</span>
                    <span className="text-blue-500">Tech</span>
                  </li>
                  <li className="flex justify-between">
                    <span>UX/UI Design</span>
                    <span className="text-purple-500">Design</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Project Management</span>
                    <span className="text-orange-500">Business</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Education Paths</h3>
            <p className="text-muted-foreground mb-3">
              Take the aptitude assessment for personalized education recommendations.
            </p>
            <Button 
              className="bg-gradient-to-r from-[#1591CF] to-[#C92974] w-full"
              onClick={onClose}
            >
              Start Aptitude Assessment
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </CardFooter>
      </Card>
    </div>
  );
}