import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, CheckCircle, ChevronDown, ChevronUp, Download, AlertCircle } from 'lucide-react';
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

// Default recommendations when API fails
const DEFAULT_RECOMMENDATIONS = [
  {
    name: "Frontend Developer",
    description: "Create user interfaces and interactive experiences for web applications using modern JavaScript frameworks.",
    matchPercentage: 85,
    skills: ["JavaScript", "React", "CSS", "UI/UX Fundamentals", "Problem Solving"],
    avgSalary: "$70,000 - $120,000"
  },
  {
    name: "Data Scientist",
    description: "Analyze complex datasets to extract insights and create predictive models to solve business problems.",
    matchPercentage: 78,
    skills: ["Python", "Statistics", "Machine Learning", "Data Visualization", "SQL"],
    avgSalary: "$85,000 - $140,000"
  },
  {
    name: "UX Designer",
    description: "Design intuitive and engaging user experiences for digital products based on user research and testing.",
    matchPercentage: 72,
    skills: ["User Research", "Wireframing", "Prototyping", "Visual Design", "Usability Testing"],
    avgSalary: "$65,000 - $110,000"
  }
];

export default function AssessmentResults({ assessmentResults, onClose }: AssessmentResultsProps) {
  // We'll initialize isLoading to false since we now use a dedicated completion message
  const [isLoading, setIsLoading] = useState(false);
  const [careerRecommendations, setCareerRecommendations] = useState<RecommendedCareer[]>([]);
  const [expandedCareer, setExpandedCareer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
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
  
  // Generate fallback recommendations with appropriate matching percentages
  const getFallbackRecommendations = useCallback(() => {
    return DEFAULT_RECOMMENDATIONS.map(career => {
      let matchScore = 70; // Default base score
      
      // Adjust match score based on skills from assessment
      if (career.name === "Frontend Developer" && skillScores.find(s => s.name === "Software Development")) {
        matchScore = skillScores.find(s => s.name === "Software Development")!.score;
      } else if (career.name === "Data Scientist" && skillScores.find(s => s.name === "Data Science & Analytics")) {
        matchScore = skillScores.find(s => s.name === "Data Science & Analytics")!.score;
      } else if (career.name === "UX Designer" && skillScores.find(s => s.name === "UX/UI Design")) {
        matchScore = skillScores.find(s => s.name === "UX/UI Design")!.score;
      }
      
      return {
        ...career,
        matchPercentage: matchScore
      };
    });
  }, [skillScores]);
  
  // Handle API errors gracefully
  const handleApiError = useCallback((errorMessage: string) => {
    setIsLoading(false);
    setError(errorMessage);
    setIsUsingFallback(true);
    
    // Generate fallback recommendations
    const fallbackRecs = getFallbackRecommendations();
    setCareerRecommendations(fallbackRecs);
    
    // Notify user but don't disrupt the experience
    toast({
      title: "Notice", 
      description: "Using locally generated recommendations. Some personalization may be limited.",
      variant: "default"
    });
  }, [getFallbackRecommendations, toast]);
  
  // Fetch career recommendations
  useEffect(() => {
    const fetchCareerRecommendations = async () => {
      // Safety check to ensure we have assessment results
      if (Object.keys(assessmentResults).length === 0) {
        handleApiError("Missing assessment data. Using general recommendations.");
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        setIsUsingFallback(false);
        
        // Extract top skills from assessment results
        const skillNames = skillScores.slice(0, 3).map(skill => skill.name);
        
        // Prepare general interests and education level
        const interests = ["technology", "problem-solving", "continuous learning"];
        const education = "College/University";
        
        // Call the Gemini API with timeout handling
        let result: string;
        try {
          result = await getCareerRecommendations(
            interests,
            skillNames,
            education,
            assessmentResults
          );
        } catch (apiError: any) {
          console.error('API error:', apiError);
          handleApiError(apiError.message || "Failed to connect to recommendation service");
          return;
        }
        
        // Parse the JSON response
        let parsedData;
        try {
          // Find JSON part in the response (in case there's text before or after JSON)
          const jsonMatch = result.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedData = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("Invalid response format");
          }
        } catch (parseError) {
          console.error("Error parsing API response:", parseError);
          handleApiError("Couldn't process career recommendations");
          return;
        }
        
        // Extract careers from the parsed data
        const recommendations: RecommendedCareer[] = parsedData.careers || [];
        
        if (recommendations.length === 0) {
          handleApiError("No career recommendations were generated");
          return;
        }
        
        // Sort by match percentage
        const sortedRecommendations = [...recommendations]
          .sort((a, b) => b.matchPercentage - a.matchPercentage);
        
        setCareerRecommendations(sortedRecommendations);
        setIsLoading(false);
        
      } catch (error: any) {
        console.error('Error in recommendation process:', error);
        handleApiError(error.message || "An unexpected error occurred");
      }
    };
    
    fetchCareerRecommendations();
  }, [assessmentResults, skillScores, handleApiError]);
  
  // Toggle career expansion
  const toggleCareer = (careerName: string) => {
    if (expandedCareer === careerName) {
      setExpandedCareer(null);
    } else {
      setExpandedCareer(careerName);
    }
  };
  
  // Handle downloading results
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
          {/* We display content immediately without loading states */}
          <>
            {/* Only show the fallback message if we're actually using fallback data and not during initial load */}
            {isUsingFallback && !isLoading && careerRecommendations.length > 0 && (
              <div className="bg-yellow-900/20 border border-yellow-800 rounded-md p-3 mb-6 flex items-start gap-3">
                <AlertCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="text-yellow-400 text-sm font-medium mb-1">Using Local Recommendations</h4>
                  <p className="text-xs text-yellow-400/80">
                    We're using locally generated career recommendations. For more personalized results, 
                    please try again later.
                  </p>
                </div>
              </div>
            )}
            
              <div className="mb-6">
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
                  {careerRecommendations.length > 0 ? (
                    careerRecommendations.map((career) => (
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
                    ))
                  ) : (
                    <div className="text-center p-4 border border-[#4D4D4F] rounded-md">
                      <p className="text-[#8E8E9E]">No career recommendations available. Please try again.</p>
                    </div>
                  )}
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
            disabled={isLoading || careerRecommendations.length === 0}
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