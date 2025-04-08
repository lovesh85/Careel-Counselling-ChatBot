import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { getCareerRecommendations } from '@/lib/gemini';

interface SkillScore {
  name: string;
  score: number;
  color: string;
}

interface RecommendedCareer {
  name: string;
  description: string;
  matchPercentage: number;
  skills: string[];
  avgSalary: string;
}

interface AssessmentResultsProps {
  assessmentResults: Record<string, number>;
  onClose: () => void;
}

// Category display names and colors
const categoryDisplayInfo: Record<string, { name: string, color: string }> = {
  analytical: { name: 'Analytical Thinking', color: 'bg-blue-500' },
  organizational: { name: 'Organizational Skills', color: 'bg-purple-500' },
  mathematical: { name: 'Mathematical Aptitude', color: 'bg-cyan-500' },
  verbal: { name: 'Verbal Communication', color: 'bg-green-500' },
  creative: { name: 'Creative Thinking', color: 'bg-yellow-500' },
  technical: { name: 'Technical Proficiency', color: 'bg-orange-500' },
  interpersonal: { name: 'Interpersonal Skills', color: 'bg-pink-500' },
};

export default function AssessmentResults({ assessmentResults, onClose }: AssessmentResultsProps) {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<RecommendedCareer[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Format skills scores for display
  const skillScores: SkillScore[] = Object.entries(assessmentResults).map(([category, score]) => ({
    name: categoryDisplayInfo[category]?.name || category,
    score,
    color: categoryDisplayInfo[category]?.color || 'bg-gray-500'
  })).sort((a, b) => b.score - a.score);
  
  // Get top skills (scoring 75% or higher)
  const topSkills = skillScores.filter(skill => skill.score >= 75).map(skill => skill.name);
  
  // Get career recommendations based on assessment results
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        
        // Mock interests and education for demo
        const interests = topSkills.length > 0 
          ? topSkills 
          : ['Career Development', 'Professional Growth'];
        
        const skills = skillScores.map(skill => skill.name);
        const education = 'Higher Education';
        
        const response = await getCareerRecommendations(
          interests,
          skills,
          education,
          assessmentResults
        );
        
        try {
          // Parse the JSON response
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.careers && Array.isArray(parsedResponse.careers)) {
            setRecommendations(parsedResponse.careers);
          } else {
            throw new Error("Invalid response format");
          }
        } catch (parseError) {
          console.error("Error parsing recommendations:", parseError);
          setError("Could not process career recommendations");
        }
      } catch (error) {
        console.error("Error fetching career recommendations:", error);
        setError("Failed to get career recommendations");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [assessmentResults, topSkills, skillScores]);
  
  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Your Assessment Results</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Based on your aptitude assessment, here are your skill strengths and career recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="skills">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="skills">Your Skills</TabsTrigger>
              <TabsTrigger value="careers">Recommended Careers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="skills" className="space-y-6 mt-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Your Skill Profile</h3>
                <div className="space-y-4">
                  {skillScores.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span>{skill.name}</span>
                        <span>{skill.score}%</span>
                      </div>
                      <Progress value={skill.score} className={`h-2 ${skill.color}`} />
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Your Top Strengths</h3>
                {topSkills.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {topSkills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">Your skills are balanced across different areas.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="careers" className="space-y-6 mt-4">
              {loading ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2">Analyzing your profile and generating recommendations...</p>
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <p className="text-red-500">{error}</p>
                  <Button className="mt-4" onClick={() => window.location.reload()}>Try Again</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Recommended Careers For You</h3>
                  
                  {recommendations.length === 0 ? (
                    <p className="text-muted-foreground">No recommendations available yet. Try completing more of the assessment.</p>
                  ) : (
                    <div className="space-y-6">
                      {recommendations.map((career, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-xl">{career.name}</CardTitle>
                              <div className="text-sm font-medium bg-green-100 text-green-800 py-1 px-2 rounded-full">
                                {career.matchPercentage}% Match
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="py-2">
                            <p className="text-sm text-muted-foreground mb-4">{career.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <h4 className="font-medium mb-1">Key Skills Required</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                  {career.skills.map((skill, idx) => (
                                    <li key={idx}>{skill}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium mb-1">Average Salary Range</h4>
                                <p>{career.avgSalary}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button>Save Results</Button>
        </CardFooter>
      </Card>
    </div>
  );
}