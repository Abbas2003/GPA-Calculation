"use client";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { useTheme } from 'next-themes';
import { Loader, Moon, Sun } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Trash } from "lucide-react";
import Link from 'next/link';
import "./globals.css";



export default function GPACalculator() {
  const [activeTab, setActiveTab] = useState('gpa');
  const [courses, setCourses] = useState([{ name: '', grade: '', credits: '', gpa: '' }]);
  const [cgpaSemesters, setCgpaSemesters] = useState([{ gpa: '', credits: '' }]);
  const [result, setResult] = useState<number | null>(null);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  // Optional: Hide loading screen after a timeout
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, []);
  

  const addEntry = (setter: Function, template: any) => setter((prev: any) => [...prev, template]);


  const handleChange = (setter: Function, index: number, field: string, value: string) => {
    setter((prev: any) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  interface Semester {
    gpa: string;
    credits: string;
  }

  const calculateResult = (
    entries: Semester[],
    getPoints: (grade: string) => number = () => 0 // Default for Semester entries
  ) => {
    const { totalPoints, totalCredits } = entries.reduce(
      (acc, entry: any) => {
        const credits = parseFloat(entry.credits) || 0;
        const points = 'grade' in entry ? getPoints(entry.grade) : parseFloat(entry.gpa) || 0;

        return {
          totalPoints: acc.totalPoints + credits * points,
          totalCredits: acc.totalCredits + credits,
        };
      },
      { totalPoints: 0, totalCredits: 0 }
    );

    setResult(totalCredits > 0 ? totalPoints / totalCredits : null);
  };


  const removeEntry = (setter: Function, index: number) => {
    setter((prev: any) => prev.filter((_: any, i: number) => i !== index));
  };


  const getGradePoints = (grade: string) =>
    ({ 'A': 4.0, 'A-': 3.66, 'B+': 3.33, 'B': 3.0, 'B-': 2.66, 'C+': 2.33, 'C': 2.0, 'C-': 1.66, 'D+': 1.33, 'D': 1.0, 'F': 0.0 }[grade] || 0);


  useEffect(() => {
    // Simulate a delay to represent data fetching (e.g., 2 seconds)
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer); // Cleanup timeout
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <h1 className="blinking-text text-white text-5xl font-bold">M.Abbas</h1>
      </div>
    );
  }




  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold">GPA & CGPA Calculator</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
          <CardDescription>Calculate your GPA or CGPA with ease</CardDescription>
          <CardDescription>Built by <Link href={"https://www.linkedin.com/in/mohammad-abbas-dev/"} target='_blank' className='hover:text-blue-800 transition duration-900'>M.Abbas</Link></CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className={`grid grid-cols-2 shadow-md mb-2 border rounded-md p-2`}>
              <TabsTrigger value="gpa">GPA</TabsTrigger>
              <TabsTrigger value="cgpa">CGPA</TabsTrigger>
            </TabsList>

            <TabsContent value="gpa">
              {courses.map((course, index) => (
                <div key={index} className="grid md:grid-cols-4  gap-4 mb-4">
                  <Input
                    placeholder="Course name"
                    value={course.name}
                    required
                    onChange={(e) => handleChange(setCourses, index, 'name', e.target.value)}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        {course.grade || "Select Grade"} {/* Display selected grade */}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Select your grade</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'].map((grade) => (
                        <DropdownMenuItem
                          key={grade}
                          onClick={() => handleChange(setCourses, index, 'grade', grade)}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              checked={course.grade === grade}
                              readOnly
                              className="mr-2"
                              required
                            />
                            {grade}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Input
                    type="number"
                    placeholder="Credits"
                    required
                    value={course.credits}
                    onChange={(e) =>
                      handleChange(setCourses, index, 'credits', e.target.value)
                    }
                  />
                  <Button variant="ghost" size="icon" className='mx-auto' onClick={() => removeEntry(setCourses, index)}>
                    <Trash className="h-5 w-5" />
                    <span className="sr-only">Remove course</span>
                  </Button>
                </div>
              ))}

              <Button
                onClick={() => addEntry(setCourses, { name: '', grade: '', credits: '' })}
                className="mb-4 mr-3"
              >
                Add Course
              </Button>

              <Button
                onClick={() => calculateResult(courses, getGradePoints)}
              >
                Calculate GPA
              </Button>

              {result !== null && (
                <div className="mt-4">
                  <p>Your GPA is: {result.toFixed(2)}</p>
                </div>
              )}
            </TabsContent>


            <TabsContent value="cgpa">
              {cgpaSemesters.map((semester, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                  <Input type="number" required placeholder="GPA" value={semester.gpa} onChange={(e) => handleChange(setCgpaSemesters, index, 'gpa', e.target.value)} />
                  <Input type="number" required placeholder="Credits" value={semester.credits} onChange={(e) => handleChange(setCgpaSemesters, index, 'credits', e.target.value)} />
                </div>
              ))}
              <Button onClick={() => addEntry(setCgpaSemesters, { gpa: '', credits: '' })} className="mb-4 mr-3">Add Semester</Button>
              <Button onClick={() => calculateResult(cgpaSemesters, (s: any) => parseFloat(s.gpa))}>Calculate CGPA</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>{result !== null && <div className="text-2xl font-bold">Result: {result.toFixed(2)}</div>}</CardFooter>
      </Card>


    </div>
  );
}