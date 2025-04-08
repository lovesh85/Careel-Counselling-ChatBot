import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, BookOpen, Lightbulb, HelpCircle } from 'lucide-react';

export default function Help() {
  return (
    <div className="w-full h-full overflow-y-auto p-4 md:p-8 bg-gradient-to-br from-[#1a1a1c] to-[#2d2d31]">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <a className="inline-flex items-center gap-2 text-[#8E8E9E] hover:text-white mb-6">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </a>
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#1591CF] to-[#C92974] inline-block text-transparent bg-clip-text mb-4">
            Help & Resources
          </h1>
          <p className="text-[#8E8E9E] max-w-2xl">
            Find answers to common questions and access additional resources to help with your career journey.
          </p>
        </div>
        
        <div className="grid gap-6 mb-8">
          <Card className="bg-[#202123] border-[#4D4D4F]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle size={20} className="text-[#1591CF]" />
                How to Use Shifra
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-medium">Getting Started</h3>
              <p className="text-sm text-[#8E8E9E]">
                Shifra is an AI-powered career counseling assistant designed to help you navigate your 
                educational and professional journey. Here's how to make the most of it:
              </p>
              
              <div className="pl-4 border-l-2 border-[#4D4D4F] space-y-2">
                <p className="text-sm text-[#8E8E9E]">
                  <span className="font-medium text-white">Chat with AI:</span> Ask any questions about careers, 
                  educational paths, or job opportunities.
                </p>
                <p className="text-sm text-[#8E8E9E]">
                  <span className="font-medium text-white">Take Assessments:</span> Complete aptitude and 
                  interest tests to discover your strengths and suitable career paths.
                </p>
                <p className="text-sm text-[#8E8E9E]">
                  <span className="font-medium text-white">Review Recommendations:</span> Get personalized 
                  career suggestions based on your skills, interests, and assessment results.
                </p>
                <p className="text-sm text-[#8E8E9E]">
                  <span className="font-medium text-white">Explore Resources:</span> Access curated resources 
                  for different career paths and educational opportunities.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#202123] border-[#4D4D4F]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb size={20} className="text-[#C92974]" />
                Career Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#4D4D4F] rounded-md p-4">
                  <h3 className="font-medium mb-2">Resume & Interview Tips</h3>
                  <p className="text-sm text-[#8E8E9E] mb-3">
                    Guides for creating standout resumes and acing job interviews.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-[#1591CF] text-sm flex items-center gap-1">
                    Coming Soon <ExternalLink size={12} />
                  </Button>
                </div>
                
                <div className="border border-[#4D4D4F] rounded-md p-4">
                  <h3 className="font-medium mb-2">Career Planning Toolkit</h3>
                  <p className="text-sm text-[#8E8E9E] mb-3">
                    Tools and worksheets to help map out your career journey.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-[#1591CF] text-sm flex items-center gap-1">
                    Coming Soon <ExternalLink size={12} />
                  </Button>
                </div>
                
                <div className="border border-[#4D4D4F] rounded-md p-4">
                  <h3 className="font-medium mb-2">Industry Insights</h3>
                  <p className="text-sm text-[#8E8E9E] mb-3">
                    Latest trends and information about various career industries.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-[#1591CF] text-sm flex items-center gap-1">
                    Coming Soon <ExternalLink size={12} />
                  </Button>
                </div>
                
                <div className="border border-[#4D4D4F] rounded-md p-4">
                  <h3 className="font-medium mb-2">College & Course Database</h3>
                  <p className="text-sm text-[#8E8E9E] mb-3">
                    Information about educational institutions and relevant courses.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-[#1591CF] text-sm flex items-center gap-1">
                    Coming Soon <ExternalLink size={12} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#202123] border-[#4D4D4F]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen size={20} className="text-[#1591CF]" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-white">How accurate are the assessment results?</h3>
                  <p className="text-sm text-[#8E8E9E]">
                    Our assessments are designed to provide guidance based on your responses, but they should be 
                    used as one tool in your career exploration process. Combine results with your own research 
                    and possibly discussions with career counselors.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-white">Can I retake the assessments?</h3>
                  <p className="text-sm text-[#8E8E9E]">
                    Yes, you can take the assessments as many times as you like. Your most recent results will 
                    be saved in your profile.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-white">How does the AI generate career recommendations?</h3>
                  <p className="text-sm text-[#8E8E9E]">
                    The AI analyzes your assessment results, stated interests, and educational background to 
                    match with careers that require similar skill sets and align with your preferences.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-white">Is my data secure?</h3>
                  <p className="text-sm text-[#8E8E9E]">
                    Yes, we prioritize data security and privacy. Your assessment results and conversations 
                    are stored securely and used only to provide personalized recommendations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-8 mb-6">
          <p className="text-[#8E8E9E] mb-4">
            Have more questions? Talk to our virtual assistant for immediate help.
          </p>
          <Link href="/virtual-assistant">
            <a>
              <Button className="bg-gradient-to-r from-[#1591CF] to-[#C92974]">
                Chat with Virtual Assistant
              </Button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}