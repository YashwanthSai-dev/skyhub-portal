
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import BreadcrumbNav from '@/components/report/BreadcrumbNav';

const Report = () => {
  const [report, setReport] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!report.trim()) {
      toast.error('Please describe the inconvenience you faced');
      return;
    }
    
    // In a real application, this would send the report to a server
    console.log('Customer report:', report);
    toast.success('Thank you for your feedback!');
    setSubmitted(true);
    setReport('');
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <BreadcrumbNav />
        
        <div className="max-w-3xl mx-auto w-full">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Report an Inconvenience</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Sorry for the inconvenience</CardTitle>
              <CardDescription>
                We apologize for any inconvenience you may have experienced. Your feedback helps us improve our services.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="report" className="text-sm font-medium">
                      Please describe the inconvenience you faced:
                    </label>
                    <Textarea
                      id="report"
                      placeholder="Tell us what went wrong..."
                      value={report}
                      onChange={(e) => setReport(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Submit Report
                  </Button>
                </div>
              </form>
            </CardContent>
            {submitted && (
              <CardFooter>
                <p className="text-green-600 font-medium">
                  Thank you for your feedback. We will review your report and take necessary actions.
                </p>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Report;
