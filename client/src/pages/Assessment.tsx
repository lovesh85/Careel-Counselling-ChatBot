import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AptitudeTest from '@/components/AptitudeTest';
import AssessmentResults from '@/components/AssessmentResults';
import { BrainCog, ClipboardList, Award } from 'lucide-react';
import { Link } from 'wouter';

export default function Assessment() {
  const [showAptitudeTest, setShowAptitudeTest] = useState(false);
  const [showAssessmentResults, setShowAssessmentResults] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<Record<string, number>>({});
  
  return (
    <div className="w-full h-full overflow-y-auto p-4 md:p-8 bg-gradient-to-br from-[#1a1a1c] to-[#2d2d31]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#1591CF] to-[#C92974] inline-block text-transparent bg-clip-text mb-4">
            Career Assessment Hub
          </h1>
          <p className="text-[#8E8E9E] max-w-2xl mx-auto">
            Discover your strengths, explore potential career paths, and get personalized 
            recommendations tailored to your unique skills and interests.
          </p>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#202123] border-[#4D4D4F] hover:border-[#C92974] transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="bg-gradient-to-br from-[#1591CF] to-[#C92974] w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <BrainCog className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">Aptitude Assessment</CardTitle>
              <CardDescription>
                Evaluate your cognitive abilities and technical skills
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-[#8E8E9E]">
              A comprehensive test that measures your analytical thinking, problem-solving, 
              and various skill categories to identify your strengths.
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => setShowAptitudeTest(true)}
                className="w-full bg-gradient-to-r from-[#1591CF] to-[#C92974]"
              >
                Start Aptitude Test
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-[#202123] border-[#4D4D4F] hover:border-[#C92974] transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="bg-gradient-to-br from-[#1591CF] to-[#C92974] w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <ClipboardList className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">Personality Assessment</CardTitle>
              <CardDescription>
                Discover your work style and interpersonal traits
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-[#8E8E9E]">
              Understand your communication style, leadership potential, and how you collaborate 
              with others in professional environments.
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline"
                className="w-full border-[#4D4D4F] text-[#8E8E9E]"
                disabled
              >
                Coming Soon
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-[#202123] border-[#4D4D4F] hover:border-[#C92974] transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="bg-gradient-to-br from-[#1591CF] to-[#C92974] w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <Award className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">Interest Inventory</CardTitle>
              <CardDescription>
                Map your passions to potential career fields
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-[#8E8E9E]">
              Identify your interests and preferences to find career paths that align with 
              activities you naturally enjoy and excel at.
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline"
                className="w-full border-[#4D4D4F] text-[#8E8E9E]"
                disabled
              >
                Coming Soon
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-[#8E8E9E] mb-4">
            Need personalized guidance? Chat with our AI career counselor.
          </p>
          <Link href="/virtual-assistant">
            <a>
              <Button variant="outline" className="border-[#4D4D4F] text-white hover:bg-[#2b2c2f]">
                Talk to Virtual Assistant
              </Button>
            </a>
          </Link>
        </div>
      </div>
      
      {/* Test Modals */}
      {showAptitudeTest && (
        <AptitudeTest 
          onClose={() => setShowAptitudeTest(false)} 
          onComplete={(results) => {
            setShowAptitudeTest(false);
            setAssessmentResults(results);
            setShowAssessmentResults(true);
          }} 
        />
      )}
      
      {showAssessmentResults && (
        <AssessmentResults 
          assessmentResults={assessmentResults}
          onClose={() => setShowAssessmentResults(false)} 
        />
      )}
    </div>
  );
}