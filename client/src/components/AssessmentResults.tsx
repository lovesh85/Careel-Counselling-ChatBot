import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, CheckCircle, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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

export default function AssessmentResults({ assessmentResults, onClose }: AssessmentResultsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [careerRecommendations, setCareerRecommendations] = useState<RecommendedCareer[]>([]);
  const [expandedCareer, setExpandedCareer] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fieldNameMap: Record<string, string> = {
    "software_development": "Software Development",
    "data_science": "Data Science & Analytics",
    "ux_design": "UX/UI Design",
    "project_management": "Project Management",
    "technical_writing": "Technical Writing",
    "cybersecurity": "Cybersecurity",
    "ai_research": "AI Research"
  };
  
  const colorMap: Record<string, string> = {
    "software_development": "#4285F4",
    "data_science": "#34A853", 
    "ux_design": "#FBBC05",
    "project_management": "#EA4335",
    "technical_writing": "#8E44AD",
    "cybersecurity": "#1DA1F2",
    "ai_research": "#FF6B6B"
  };

  // Transform assessment results into SkillScore array for visualization
  const skillScores: SkillScore[] = Object.entries(assessmentResults)
    .map(([key, score]) => ({
      name: fieldNameMap[key] || key,
      score: Math.round(score),
      color: colorMap[key] || "#CCCCCC"
    }))
    .sort((a, b) => b.score - a.score);
  
  useEffect(() => {
    // Get career recommendations from Gemini API
    const fetchCareerRecommendations = async () => {
      try {
        setIsLoading(true);
        
        // Extract top skills from assessment results
        const skillNames = skillScores.slice(0, 3).map(skill => skill.name);
        
        // Prepare general interests and education level
        const interests = ["technology", "problem-solving", "continuous learning"];
        const education = "College/University";
        
        // Call the Gemini API
        const result = await getCareerRecommendations(
          interests,
          skillNames,
          education,
          assessmentResults
        );
        
        // Parse the JSON response
        let parsedData;
        try {
          // Find JSON part in the response (in case there's text before or after JSON)
          const jsonMatch = result.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedData = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("No valid JSON found in response");
          }
        } catch (parseError) {
          console.error("Error parsing Gemini API response:", parseError);
          // Fallback to default recommendations if parsing fails
          parsedData = {
            careers: [
              {
                name: "Frontend Developer",
                description: "Create user interfaces and interactive experiences for web applications using modern JavaScript frameworks.",
                matchPercentage: skillScores.find(s => s.name === "Software Development")?.score || 75,
                skills: ["JavaScript", "React", "CSS", "UI/UX Fundamentals", "Problem Solving"],
                avgSalary: "$70,000 - $120,000"
              },
              {
                name: "Data Scientist",
                description: "Analyze complex datasets to extract insights and create predictive models to solve business problems.",
                matchPercentage: skillScores.find(s => s.name === "Data Science & Analytics")?.score || 70,
                skills: ["Python", "Statistics", "Machine Learning", "Data Visualization", "SQL"],
                avgSalary: "$85,000 - $140,000"
              },
              {
                name: "UX Designer",
                description: "Design intuitive and engaging user experiences for digital products based on user research and testing.",
                matchPercentage: skillScores.find(s => s.name === "UX/UI Design")?.score || 65,
                skills: ["User Research", "Wireframing", "Prototyping", "Visual Design", "Usability Testing"],
                avgSalary: "$65,000 - $110,000"
              }
            ]
          };
        }
        
        // Extract careers from the parsed data
        const recommendations = parsedData.careers || [];
        
        // Sort by match percentage
        const sortedRecommendations = recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
        
        setCareerRecommendations(sortedRecommendations);
        setIsLoading(false);
        
      } catch (error) {
        console.error('Error fetching career recommendations:', error);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to get career recommendations. Please try again.",
          variant: "destructive"
        });
      }
    };
    
    fetchCareerRecommendations();
  }, [assessmentResults, skillScores, toast]);
  
  const toggleCareer = (careerName: string) => {
    if (expandedCareer === careerName) {
      setExpandedCareer(null);
    } else {
      setExpandedCareer(careerName);
    }
  };
  
  const handleDownloadResults = () => {
    try {
      // Create a simple text representation of the results
      let resultsText = "SHIFRA CAREER ASSESSMENT RESULTS\n\n";
      resultsText += "SKILL PROFILE:\n";
      
      skillScores.forEach(skill => {
        resultsText += `${skill.name}: ${skill.score}%\n`;
      });
      
      resultsText += "\nRECOMMENDED CAREERS:\n";
      careerRecommendations.forEach(career => {
        resultsText += `\n${career.name} (${career.matchPercentage}% match)\n`;
        resultsText += `Description: ${career.description}\n`;
        resultsText += `Skills: ${career.skills.join(", ")}\n`;
        resultsText += `Average Salary: ${career.avgSalary}\n`;
      });
      
      // Create a Blob and download
      const blob = new Blob([resultsText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'shifra-career-assessment-results.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Assessment results downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download results. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl bg-[#202123] border-[#4D4D4F] text-white max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="relative pb-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 text-[#8E8E9E] hover:text-white"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500" size={20} />
            <CardTitle className="text-xl">Assessment Results</CardTitle>
          </div>
          <CardDescription className="text-[#8E8E9E]">
            Based on your responses, here's a breakdown of your aptitude in different areas
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="w-16 h-16 border-4 border-t-[#1591CF] border-r-[#8E8E9E] border-b-[#C92974] border-l-[#8E8E9E] rounded-full animate-spin mb-4"></div>
              <p className="text-[#8E8E9E]">Analyzing your responses and generating career recommendations...</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Your Skill Profile</h3>
                <div className="space-y-4">
                  {skillScores.map((skill) => (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{skill.name}</span>
                        <span className="text-sm font-medium">{skill.score}%</span>
                      </div>
                      <Progress 
                        value={skill.score} 
                        className="h-2" 
                        style={{ background: '#333', '--tw-progress-fill-color': skill.color } as React.CSSProperties} 
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Recommended Career Paths</h3>
                <div className="space-y-3">
                  {careerRecommendations.map((career) => (
                    <div key={career.name} className="border border-[#4D4D4F] rounded-md overflow-hidden">
                      <div 
                        className="p-3 bg-[#2b2c2f] flex justify-between items-center cursor-pointer hover:bg-[#3b3c3f]"
                        onClick={() => toggleCareer(career.name)}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="h-10 w-1 rounded-full" 
                            style={{ backgroundColor: skillScores.find(s => s.name === fieldNameMap[Object.keys(assessmentResults).find(key => fieldNameMap[key] === career.name.split(' ')[0]) || ''])?.color || '#1591CF' }}
                          ></div>
                          <div>
                            <h4 className="font-medium">{career.name}</h4>
                            <div className="flex items-center gap-1 text-xs text-[#8E8E9E]">
                              <span className="text-white">{career.matchPercentage}% match</span>
                              <span>•</span>
                              <span>{career.avgSalary}</span>
                            </div>
                          </div>
                        </div>
                        {expandedCareer === career.name ? (
                          <ChevronUp size={18} className="text-[#8E8E9E]" />
                        ) : (
                          <ChevronDown size={18} className="text-[#8E8E9E]" />
                        )}
                      </div>
                      
                      {expandedCareer === career.name && (
                        <div className="p-3 border-t border-[#4D4D4F]">
                          <p className="text-sm mb-3">{career.description}</p>
                          <div className="mb-3">
                            <h5 className="text-xs text-[#8E8E9E] mb-1">Key Skills</h5>
                            <div className="flex flex-wrap gap-1">
                              {career.skills.map((skill) => (
                                <span key={skill} className="text-xs bg-[#3b3c3f] px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-gradient-to-r from-[#1a1a1c] to-[#2d2d31] rounded-md border border-[#4D4D4F]">
                <h3 className="text-lg font-medium mb-2">What's Next?</h3>
                <p className="text-sm text-[#8E8E9E] mb-3">
                  These recommendations are based on your aptitude assessment. To get more personalized guidance:
                </p>
                <ul className="text-sm text-[#8E8E9E] list-disc pl-5 space-y-1 mb-4">
                  <li>Chat with our AI assistant for in-depth career advice</li>
                  <li>Explore educational resources for your preferred career paths</li>
                  <li>Take additional assessments to refine your recommendations</li>
                </ul>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-[#4D4D4F] pt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-[#4D4D4F] text-white hover:bg-[#2b2c2f]"
          >
            Close
          </Button>
          
          <Button 
            onClick={handleDownloadResults}
            disabled={isLoading}
            className="flex items-center gap-2 bg-transparent border border-[#1591CF] text-[#1591CF] hover:bg-[#1591CF]/10"
          >
            <Download size={16} />
            <span>Download Results</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}