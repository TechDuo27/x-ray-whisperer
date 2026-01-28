import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, ArrowLeft, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import ImageAnnotationViewer from '@/components/ImageAnnotationViewer';
import { getHexColor } from '@/utils/modelLoader';
import { useAuth } from '@/hooks/useAuth';

interface FeedbackData {
  id: string;
  user_id: string;
  user_name: string | null;
  user_email: string | null;
  created_at: string;
  feedback_type: string | null;
  feedback_text: string;
  feedback_image_url?: string;
  feedback_submitted_at: string;
  original_filename: string;
  image_url: string;
  analysis_results: any;
  confidence_threshold: number;
}

export default function AdminFeedback() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
  const [filteredData, setFilteredData] = useState<FeedbackData[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [feedbackData, searchTerm]);

  const fetchFeedbackData = async () => {
    setLoading(true);
    try {
      const { data: analysesData, error: analysesError } = await supabase
        .from('analyses')
        .select('id, user_id, created_at, feedback_type, feedback_text, feedback_image_url, feedback_submitted_at, original_filename, image_url, analysis_results, confidence_threshold')
        .not('feedback_submitted_at', 'is', null)
        .order('feedback_submitted_at', { ascending: false })
        .limit(1000);

      if (analysesError) throw analysesError;

      const userIds = Array.from(new Set(analysesData?.map(item => item.user_id) || []));
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', userIds);

      if (profilesError) {
        console.warn('Could not fetch profiles data:', profilesError);
      }

      const profilesMap = new Map(
        profilesData?.map(profile => [profile.user_id, profile]) || []
      );

      const transformedData: FeedbackData[] = (analysesData || []).map(item => {
        const profile = profilesMap.get(item.user_id);
        return {
          id: item.id,
          user_id: item.user_id,
          user_name: profile?.full_name || null,
          user_email: profile?.email || null,
          created_at: item.created_at,
          feedback_type: item.feedback_type,
          feedback_text: item.feedback_text || '',
          feedback_image_url: item.feedback_image_url,
          feedback_submitted_at: item.feedback_submitted_at,
          original_filename: item.original_filename,
          image_url: item.image_url,
          analysis_results: item.analysis_results,
          confidence_threshold: item.confidence_threshold || 0.25
        };
      });
      
      setFeedbackData(transformedData);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to load feedback data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = feedbackData;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.feedback_text.toLowerCase().includes(searchLower) ||
        (item.user_name && item.user_name.toLowerCase().includes(searchLower)) ||
        (item.user_email && item.user_email.toLowerCase().includes(searchLower)) ||
        item.original_filename.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading feedback data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Admin Feedback</h1>
          </div>
          <Button onClick={fetchFeedbackData} disabled={loading}>
            Refresh Data
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search feedback text, user name, email, or filename..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} results
          </div>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Filename</TableHead>
                    <TableHead>Preview</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No feedback found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((feedback) => (
                      <>
                        <TableRow key={feedback.id} className="cursor-pointer hover:bg-muted/50" onClick={() => toggleRowExpansion(feedback.id)}>
                          <TableCell onClick={(e) => { e.stopPropagation(); toggleRowExpansion(feedback.id); }}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              {expandedRows.has(feedback.id) ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{feedback.user_name || 'Unknown'}</span>
                              <span className="text-xs text-muted-foreground">{feedback.user_email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(parseISO(feedback.feedback_submitted_at), 'MMM dd, yyyy HH:mm')}
                          </TableCell>
                          <TableCell>
                            {feedback.feedback_image_url ? (
                              <Badge variant="outline" className="border-blue-500 text-blue-500">
                                Visual
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Text Only</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {feedback.original_filename}
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate text-sm" title={feedback.feedback_text}>
                              {feedback.feedback_text.substring(0, 80)}
                              {feedback.feedback_text.length > 80 && '...'}
                            </div>
                          </TableCell>
                        </TableRow>
                        {expandedRows.has(feedback.id) && (
                          <TableRow>
                            <TableCell colSpan={6} className="p-4 bg-muted/30">
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <h4 className="font-medium text-primary">User Feedback:</h4>
                                    <div className="p-4 bg-background rounded-lg border shadow-sm min-h-[100px]">
                                      <p className="text-sm whitespace-pre-wrap">{feedback.feedback_text}</p>
                                    </div>
                                  </div>
                                  {feedback.feedback_image_url && (
                                    <div className="space-y-2">
                                      <h4 className="font-medium text-primary">User Drawing:</h4>
                                      <div className="border rounded-lg bg-background overflow-hidden shadow-sm">
                                        <img 
                                          src={feedback.feedback_image_url} 
                                          alt="User feedback drawing" 
                                          className="w-full max-h-[400px] object-contain" 
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                {feedback.image_url && feedback.analysis_results?.detections && (
                                  <div className="space-y-2 pt-4 border-t">
                                    <h4 className="font-medium">Original Analysis Context:</h4>
                                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                                      <div className="xl:col-span-2 border rounded-lg overflow-hidden bg-background">
                                        <ImageAnnotationViewer
                                          originalImageUrl={feedback.image_url}
                                          detections={feedback.analysis_results.detections.filter((det: any) => 
                                            det.confidence >= (feedback.confidence_threshold || 0.25)
                                          )}
                                          filename={feedback.original_filename || 'analysis'}
                                        />
                                      </div>
                                      <div className="space-y-3 bg-background p-4 rounded-lg border">
                                        <h5 className="font-medium text-sm">Detected Conditions</h5>
                                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                          {(() => {
                                            const filteredDetections = feedback.analysis_results.detections.filter((det: any) => 
                                              det.confidence >= (feedback.confidence_threshold || 0.25)
                                            );
                                            
                                            const grouped = filteredDetections.reduce((acc: any, det: any) => {
                                              const key = det.display_name || det.class;
                                              if (!acc[key]) {
                                                acc[key] = {
                                                  displayName: key,
                                                  color: getHexColor(det),
                                                  count: 0,
                                                  maxConfidence: 0
                                                };
                                              }
                                              acc[key].count++;
                                              acc[key].maxConfidence = Math.max(acc[key].maxConfidence, det.confidence);
                                              return acc;
                                            }, {});

                                            return Object.values(grouped).map((item: any) => (
                                              <div key={item.displayName} className="flex items-center gap-2 text-xs p-2 hover:bg-muted rounded">
                                                <div 
                                                  className="w-3 h-3 rounded-full flex-shrink-0" 
                                                  style={{ backgroundColor: item.color }}
                                                ></div>
                                                <div className="flex-1">
                                                  <div className="font-medium">{item.displayName}</div>
                                                  <div className="text-muted-foreground">
                                                    {item.count} count • Max Conf: {(item.maxConfidence * 100).toFixed(0)}%
                                                  </div>
                                                </div>
                                              </div>
                                            ));
                                          })()}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-end space-x-2 p-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-3 py-1 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
