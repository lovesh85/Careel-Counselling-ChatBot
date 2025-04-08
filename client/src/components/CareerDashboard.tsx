import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { CareerSuggestion, SkillScore } from '../types';

interface CareerDashboardProps {
  onClose: () => void;
}

// Sample career data (will be replaced with real API data)
const sampleSkillScores: SkillScore[] = [
  { name: 'Analytical Thinking', score: 85, color: 'rgb(43, 206, 212)' },
  { name: 'Creative Thinking', score: 62, color: 'rgb(212, 43, 122)' },
  { name: 'Communication', score: 78, color: 'rgb(21, 145, 207)' },
];

const CareerDashboard: React.FC<CareerDashboardProps> = ({ onClose }) => {
  // Fetch the latest career suggestion
  const { data: careerSuggestion, isLoading } = useQuery<CareerSuggestion>({
    queryKey: ['/api/career-suggestions/latest'],
  });

  // Handle PDF export
  const exportAsPDF = () => {
    alert('PDF export functionality will be implemented here');
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#202123] border border-[#4D4D4F] rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Your Career Dashboard</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="p-2 hover:bg-[#444654]/30 rounded-full"
          >
            <X size={24} />
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1591CF]"></div>
          </div>
        ) : (
          <>
            {/* Personality profile */}
            <div className="mb-8">
              <h3 className="text-lg mb-4 font-medium">Your Personality Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sampleSkillScores.map((skill, index) => (
                  <div key={index} className="p-4 border border-[#4D4D4F] rounded-lg bg-[#444654]/20">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{skill.name}</h4>
                      <span style={{ color: skill.color }}>{skill.score}%</span>
                    </div>
                    <Progress 
                      value={skill.score} 
                      className="h-2 bg-[#444654]/30"
                    >
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${skill.score}%`, 
                          backgroundColor: skill.color 
                        }}
                      ></div>
                    </Progress>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recommended careers */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Recommended Career Paths</h3>
                <Button 
                  variant="ghost"
                  onClick={exportAsPDF}
                  className="text-sm text-[#1591CF] flex items-center gap-1"
                >
                  <Download size={16} />
                  Export as PDF
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {careerSuggestion?.recommendedCareers ? (
                  careerSuggestion.recommendedCareers.map((career, index) => (
                    <div key={index} className="p-4 border border-[#4D4D4F] rounded-lg bg-[#444654]/20 hover:border-[#C92974] transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-lg">{career.name}</h4>
                        <span className="bg-gradient-to-r from-[#1591CF] to-[#C92974] text-white text-xs px-2 py-1 rounded-full">
                          {career.matchPercentage}% Match
                        </span>
                      </div>
                      <p className="text-sm text-[#8E8E9E] mb-3">{career.description}</p>
                      <div className="mb-3">
                        <h5 className="text-xs font-medium mb-1 text-[#8E8E9E]">KEY SKILLS</h5>
                        <div className="flex flex-wrap gap-2">
                          {career.skills.map((skill, skillIndex) => (
                            <span key={skillIndex} className="text-xs bg-[#444654]/40 px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Avg. Salary: {career.avgSalary}</span>
                        <Button 
                          variant="link" 
                          className="text-[#1591CF] p-0 h-auto"
                        >
                          Learn more
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback sample data
                  <>
                    <div className="p-4 border border-[#4D4D4F] rounded-lg bg-[#444654]/20 hover:border-[#C92974] transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-lg">Data Scientist</h4>
                        <span className="bg-gradient-to-r from-[#1591CF] to-[#C92974] text-white text-xs px-2 py-1 rounded-full">
                          95% Match
                        </span>
                      </div>
                      <p className="text-sm text-[#8E8E9E] mb-3">
                        Analyze complex data sets to identify trends and insights that help organizations make better decisions.
                      </p>
                      <div className="mb-3">
                        <h5 className="text-xs font-medium mb-1 text-[#8E8E9E]">KEY SKILLS</h5>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs bg-[#444654]/40 px-2 py-1 rounded">Python</span>
                          <span className="text-xs bg-[#444654]/40 px-2 py-1 rounded">Machine Learning</span>
                          <span className="text-xs bg-[#444654]/40 px-2 py-1 rounded">Statistics</span>
                          <span className="text-xs bg-[#444654]/40 px-2 py-1 rounded">SQL</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Avg. Salary: ₹12-18 LPA</span>
                        <Button variant="link" className="text-[#1591CF] p-0 h-auto">Learn more</Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-[#4D4D4F] rounded-lg bg-[#444654]/20 hover:border-[#C92974] transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-lg">UX/UI Designer</h4>
                        <span className="bg-gradient-to-r from-[#1591CF] to-[#C92974] text-white text-xs px-2 py-1 rounded-full">
                          88% Match
                        </span>
                      </div>
                      <p className="text-sm text-[#8E8E9E] mb-3">
                        Design user interfaces and experiences for websites and applications that are both functional and visually appealing.
                      </p>
                      <div className="mb-3">
                        <h5 className="text-xs font-medium mb-1 text-[#8E8E9E]">KEY SKILLS</h5>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs bg-[#444654]/40 px-2 py-1 rounded">Figma</span>
                          <span className="text-xs bg-[#444654]/40 px-2 py-1 rounded">User Research</span>
                          <span className="text-xs bg-[#444654]/40 px-2 py-1 rounded">Wireframing</span>
                          <span className="text-xs bg-[#444654]/40 px-2 py-1 rounded">HTML/CSS</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Avg. Salary: ₹8-15 LPA</span>
                        <Button variant="link" className="text-[#1591CF] p-0 h-auto">Learn more</Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Recommended education */}
            <div>
              <h3 className="text-lg mb-4 font-medium">Recommended Education Paths</h3>
              <div className="space-y-3">
                <div className="p-4 border border-[#4D4D4F] rounded-lg bg-[#444654]/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">B.Tech in Computer Science</h4>
                      <p className="text-sm text-[#8E8E9E]">4-year undergraduate program</p>
                    </div>
                    <Button 
                      variant="outline"
                      className="text-white bg-[#1591CF]/20 border border-[#1591CF] px-3 py-1 text-sm rounded-lg hover:bg-[#1591CF]/30 transition-colors"
                    >
                      View Colleges
                    </Button>
                  </div>
                </div>
                <div className="p-4 border border-[#4D4D4F] rounded-lg bg-[#444654]/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Master's in Data Science</h4>
                      <p className="text-sm text-[#8E8E9E]">2-year postgraduate program</p>
                    </div>
                    <Button 
                      variant="outline"
                      className="text-white bg-[#1591CF]/20 border border-[#1591CF] px-3 py-1 text-sm rounded-lg hover:bg-[#1591CF]/30 transition-colors"
                    >
                      View Colleges
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CareerDashboard;
