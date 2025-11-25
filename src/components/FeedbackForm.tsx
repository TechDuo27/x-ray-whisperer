import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface FeedbackFormProps {
  analysisId: string;
  onFeedbackSubmitted: () => void;
  existingFeedback?: {
    feedback_type: 'up' | 'down';
    feedback_text: string;
    feedback_submitted_at: string;
  } | null;
}

export default function FeedbackForm({ analysisId, onFeedbackSubmitted, existingFeedback }: FeedbackFormProps) {
  const [feedbackType, setFeedbackType] = useState<'up' | 'down' | null>(existingFeedback?.feedback_type || null);
  const [feedbackText, setFeedbackText] = useState(existingFeedback?.feedback_text || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wordCount = feedbackText.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isValidLength = wordCount >= 50;

  const handleSubmit = async () => {
    if (!feedbackType || !isValidLength) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('analyses')
        .update({
          feedback_type: feedbackType,
          feedback_text: feedbackText.trim(),
          feedback_submitted_at: new Date().toISOString()
        })
        .eq('id', analysisId);

      if (error) throw error;

      toast({
        title: 'Feedback Submitted',
        description: 'Thank you for your feedback! It helps us improve our AI analysis.',
      });

      onFeedbackSubmitted();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (existingFeedback) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {existingFeedback.feedback_type === 'up' ? (
              <ThumbsUp className="h-5 w-5 text-green-600" />
            ) : (
              <ThumbsDown className="h-5 w-5 text-red-600" />
            )}
            Feedback Submitted
          </CardTitle>
          <CardDescription>
            You provided feedback on {new Date(existingFeedback.feedback_submitted_at).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Your feedback:</p>
            <p className="text-sm">{existingFeedback.feedback_text}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Rate This Analysis</CardTitle>
        <CardDescription>
          Help us improve by providing feedback on the accuracy of this analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button
            variant={feedbackType === 'up' ? 'default' : 'outline'}
            onClick={() => setFeedbackType('up')}
            className="flex-1"
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            Helpful
          </Button>
          <Button
            variant={feedbackType === 'down' ? 'default' : 'outline'}
            onClick={() => setFeedbackType('down')}
            className="flex-1"
          >
            <ThumbsDown className="h-4 w-4 mr-2" />
            Not Helpful
          </Button>
        </div>

        {feedbackType && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Please explain your choice (minimum 50 words required):
            </label>
            <Textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder={
                feedbackType === 'up'
                  ? 'What aspects of the analysis were accurate and helpful? Please provide specific details about what worked well...'
                  : 'What issues did you find with the analysis? Please describe any inaccuracies or missing detections...'
              }
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-between items-center text-sm">
              <span className={wordCount >= 50 ? 'text-green-600' : 'text-muted-foreground'}>
                {wordCount} / 50 words minimum
              </span>
              <Button
                onClick={handleSubmit}
                disabled={!isValidLength || isSubmitting}
                size="sm"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}