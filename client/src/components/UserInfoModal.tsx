import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface UserInfoModalProps {
  onClose: () => void;
  onSubmit: (userInfo: { name: string; email: string }) => void;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UserInfoModal({ onClose, onSubmit }: UserInfoModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [existingUserName, setExistingUserName] = useState('');
  const { toast } = useToast();

  // Check if user exists when email changes
  const checkUserExists = async (email: string) => {
    if (!email || !email.includes('@')) return;
    
    try {
      const response = await apiRequest(
        'GET',
        `/api/user/check?email=${encodeURIComponent(email)}`
      );
      
      const jsonData = await response.json();
      
      if (jsonData.exists && jsonData.user) {
        setIsExistingUser(true);
        setExistingUserName(jsonData.user.name);
      } else {
        setIsExistingUser(false);
        setExistingUserName('');
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  // Debounce the email check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (email) {
        checkUserExists(email);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [email]);

  const handleSubmit = () => {
    if (!name && !isExistingUser) {
      toast({
        title: "Name required",
        description: "Please enter your name to continue",
        variant: "destructive"
      });
      return;
    }
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email to continue",
        variant: "destructive"
      });
      return;
    }
    
    // Use existing name if user exists
    const userName = isExistingUser ? existingUserName : name;
    
    onSubmit({ name: userName, email });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#202123] border-[#4D4D4F] text-white">
        <CardHeader>
          <CardTitle className="text-xl">
            {isExistingUser ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                <span>Welcome Back!</span>
              </div>
            ) : (
              "Coming Soon Features"
            )}
          </CardTitle>
          <CardDescription className="text-[#8E8E9E]">
            {isExistingUser 
              ? `Great to see you again, ${existingUserName}! Continue your career journey with us.`
              : "Sign up to get early access to upcoming features and personalized career recommendations."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isExistingUser && (
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name" 
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#2b2c2f] border-[#4D4D4F] text-white"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#2b2c2f] border-[#4D4D4F] text-white"
            />
          </div>
          
          <div className="pt-3">
            <p className="text-sm text-[#8E8E9E]">
              Upcoming features include:
            </p>
            <ul className="text-sm text-[#8E8E9E] list-disc pl-5 mt-2 space-y-1">
              <li>Personalized learning resources based on your assessment results</li>
              <li>Career path roadmaps with step-by-step guidance</li>
              <li>Connect with mentors in your chosen field</li>
              <li>Job opportunity alerts customized to your skills and interests</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-[#4D4D4F] text-white hover:bg-[#2b2c2f]"
          >
            Skip for Now
          </Button>
          
          <Button 
            onClick={handleSubmit}
            className="bg-gradient-to-r from-[#1591CF] to-[#C92974]"
          >
            {isExistingUser ? "Continue" : "Get Early Access"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}