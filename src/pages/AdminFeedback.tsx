import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ThumbsUp, ThumbsDown, Calendar as CalendarIcon, Filter, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format, parseISO, subDays } from 'date-fns';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { Link } from 'react-router-dom';

interface FeedbackData {
  id: string;
  user_id: string;
  user_name: string | null;
  user_email: string | null;
  created_at: string;
  feedback_type: 'up' | 'down';
  feedback_text: string;
  feedback_submitted_at: string;
  original_filename: string;
}

interface TrendData {
  date: string;
  up: number;
  down: number;
}

interface WordFrequency {
  word: string;
  count: number;
}

export default function AdminFeedback() {
  const [loading, setLoading] = useState(true);
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
  const [filteredData, setFilteredData] = useState<FeedbackData[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<Date | undefined>();
  const [filterDateTo, setFilterDateTo] = useState<Date | undefined>();
  const [chartDateFrom, setChartDateFrom] = useState<Date | undefined>(subDays(new Date(), 30));
  const [chartDateTo, setChartDateTo] = useState<Date | undefined>(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [feedbackData, searchTerm, filterUser, filterDateFrom, filterDateTo]);

  const fetchFeedbackData = async () => {
    try {
      // Optimized query - fetch data separately to avoid join issues
      const { data: analysesData, error: analysesError } = await supabase
        .from('analyses')
        .select('id, user_id, created_at, feedback_type, feedback_text, feedback_submitted_at, original_filename')
        .not('feedback_type', 'is', null)
        .order('feedback_submitted_at', { ascending: false })
        .limit(1000);

      if (analysesError) throw analysesError;

      // Get unique user IDs for profile lookup
      const userIds = Array.from(new Set(analysesData?.map(item => item.user_id) || []));
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', userIds);

      if (profilesError) {
        console.warn('Could not fetch profiles data:', profilesError);
      }

      // Create optimized lookup map
      const profilesMap = new Map(
        profilesData?.map(profile => [profile.user_id, profile]) || []
      );

      // Transform data efficiently
      const transformedData: FeedbackData[] = (analysesData || []).map(item => {
        const profile = profilesMap.get(item.user_id);
        return {
          id: item.id,
          user_id: item.user_id,
          user_name: profile?.full_name || null,
          user_email: profile?.email || null,
          created_at: item.created_at,
          feedback_type: item.feedback_type as 'up' | 'down',
          feedback_text: item.feedback_text,
          feedback_submitted_at: item.feedback_submitted_at,
          original_filename: item.original_filename
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
        item.user_name?.toLowerCase().includes(searchLower) ||
        item.user_email?.toLowerCase().includes(searchLower) ||
        item.original_filename.toLowerCase().includes(searchLower)
      );
    }
    
    if (filterUser !== 'all') {
      filtered = filtered.filter(item => item.user_id === filterUser);
    }
    
    if (filterDateFrom) {
      filtered = filtered.filter(item => 
        new Date(item.feedback_submitted_at) >= filterDateFrom
      );
    }
    
    if (filterDateTo) {
      filtered = filtered.filter(item => 
        new Date(item.feedback_submitted_at) <= filterDateTo
      );
    }
    
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const getTrendData = (): TrendData[] => {
    if (!chartDateFrom || !chartDateTo) return [];
    
    const chartFiltered = feedbackData.filter(item => {
      const itemDate = new Date(item.feedback_submitted_at);
      return itemDate >= chartDateFrom && itemDate <= chartDateTo;
    });

    const dailyData = new Map<string, { up: number; down: number }>();
    
    chartFiltered.forEach(item => {
      const date = format(parseISO(item.feedback_submitted_at), 'yyyy-MM-dd');
      const current = dailyData.get(date) || { up: 0, down: 0 };
      
      if (item.feedback_type === 'up') {
        current.up++;
      } else {
        current.down++;
      }
      
      dailyData.set(date, current);
    });

    return Array.from(dailyData.entries())
      .map(([date, counts]) => ({
        date,
        ...counts
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const getWordFrequency = (): WordFrequency[] => {
    const words = new Map<string, number>();
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their']);
    
    filteredData.forEach(item => {
      const text = item.feedback_text.toLowerCase();
      const wordList = text.match(/\b\w+\b/g) || [];
      
      wordList.forEach(word => {
        if (word.length > 3 && !stopWords.has(word)) {
          words.set(word, (words.get(word) || 0) + 1);
        }
      });
    });

    return Array.from(words.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  };

  const getChartFilteredData = () => {
    if (!chartDateFrom || !chartDateTo) return feedbackData;
    
    return feedbackData.filter(item => {
      const itemDate = new Date(item.feedback_submitted_at);
      return itemDate >= chartDateFrom && itemDate <= chartDateTo;
    });
  };

  const chartFilteredData = getChartFilteredData();
  
  const metrics = {
    total: chartFilteredData.length,
    upCount: chartFilteredData.filter(f => f.feedback_type === 'up').length,
    downCount: chartFilteredData.filter(f => f.feedback_type === 'down').length,
    approvalRatio: chartFilteredData.length > 0 
      ? (chartFilteredData.filter(f => f.feedback_type === 'up').length / chartFilteredData.length * 100).toFixed(1)
      : '0'
  };

  // Pagination calculations
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  
  // Get unique users with proper names - filter out entries without names
  const uniqueUsers = Array.from(
    new Map(
      feedbackData
        .filter(f => f.user_name) // Only include users with names
        .map(f => [f.user_id, { id: f.user_id, name: f.user_name }])
    ).values()
  ).sort((a, b) => a.name!.localeCompare(b.name!));

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const trendData = getTrendData();
  const wordFrequency = getWordFrequency();

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
      <DarkModeToggle />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Admin Feedback Dashboard</h1>
          </div>
          <Button onClick={fetchFeedbackData} disabled={loading}>
            Refresh Data
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="insights">Text Insights</TabsTrigger>
            <TabsTrigger value="data">Raw Data</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Date Range Selector for Charts */}
            <Card>
              <CardHeader>
                <CardTitle>Chart Date Range</CardTitle>
                <CardDescription>Select date range for overview metrics and charts</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4 items-center">
                <div className="flex gap-2 items-center">
                  <label className="text-sm font-medium">From:</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {chartDateFrom ? format(chartDateFrom, 'MMM dd, yyyy') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={chartDateFrom}
                        onSelect={setChartDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex gap-2 items-center">
                  <label className="text-sm font-medium">To:</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {chartDateTo ? format(chartDateTo, 'MMM dd, yyyy') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={chartDateTo}
                        onSelect={setChartDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>

            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
                  <Badge variant="secondary">{metrics.total}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.total}</div>
                  <p className="text-xs text-muted-foreground">feedback entries</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Positive Feedback</CardTitle>
                  <ThumbsUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{metrics.upCount}</div>
                  <p className="text-xs text-muted-foreground">thumbs up</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Negative Feedback</CardTitle>
                  <ThumbsDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{metrics.downCount}</div>
                  <p className="text-xs text-muted-foreground">thumbs down</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approval Ratio</CardTitle>
                  <Badge variant={Number(metrics.approvalRatio) >= 70 ? "default" : "destructive"}>
                    {metrics.approvalRatio}%
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.approvalRatio}%</div>
                  <p className="text-xs text-muted-foreground">positive feedback</p>
                </CardContent>
              </Card>
            </div>

            {/* Feedback Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Feedback Distribution</CardTitle>
                <CardDescription>Visual breakdown of positive vs negative feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    up: { label: "Positive", color: "#22c55e" },
                    down: { label: "Negative", color: "#ef4444" },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{ name: 'Feedback', up: metrics.upCount, down: metrics.downCount }]}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="up" fill="#22c55e" name="Positive" />
                      <Bar dataKey="down" fill="#ef4444" name="Negative" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Frequent Words</CardTitle>
                <CardDescription>Common words and phrases from feedback text (filtered data)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {wordFrequency.slice(0, 12).map((item, index) => (
                    <div key={item.word} className="p-3 bg-muted rounded-md">
                      <div className="font-medium capitalize">{item.word}</div>
                      <div className="text-sm text-muted-foreground">{item.count} occurrences</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <Input
                      placeholder="Search feedback, user, or filename..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">User</label>
                    <Select value={filterUser} onValueChange={setFilterUser}>
                      <SelectTrigger>
                        <SelectValue placeholder="All users" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border z-50">
                        <SelectItem value="all">All users</SelectItem>
                        {uniqueUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">From Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filterDateFrom ? format(filterDateFrom, 'MMM dd, yyyy') : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filterDateFrom}
                          onSelect={setFilterDateFrom}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">To Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filterDateTo ? format(filterDateTo, 'MMM dd, yyyy') : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filterDateTo}
                          onSelect={setFilterDateTo}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} results
              </div>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            {/* Raw Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>Feedback Data</CardTitle>
                <CardDescription>Raw feedback entries with user information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>User Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Filename</TableHead>
                        <TableHead>Preview</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.map((feedback) => (
                        <>
                          <TableRow key={feedback.id} className="cursor-pointer hover:bg-muted/50">
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleRowExpansion(feedback.id)}
                              >
                                {expandedRows.has(feedback.id) ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {feedback.user_id}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{feedback.user_name || 'Unknown'}</div>
                                <div className="text-xs text-muted-foreground">{feedback.user_email}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(parseISO(feedback.feedback_submitted_at), 'MMM dd, yyyy HH:mm')}
                            </TableCell>
                            <TableCell>
                              <Badge variant={feedback.feedback_type === 'up' ? 'default' : 'destructive'}>
                                {feedback.feedback_type === 'up' ? (
                                  <><ThumbsUp className="w-3 h-3 mr-1" /> Positive</>
                                ) : (
                                  <><ThumbsDown className="w-3 h-3 mr-1" /> Negative</>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {feedback.original_filename}
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div className="truncate text-sm">
                                {feedback.feedback_text.substring(0, 100)}
                                {feedback.feedback_text.length > 100 && '...'}
                              </div>
                            </TableCell>
                          </TableRow>
                          {expandedRows.has(feedback.id) && (
                            <TableRow>
                              <TableCell colSpan={7} className="p-4 bg-muted/30">
                                <div className="space-y-2">
                                  <h4 className="font-medium">Full Feedback Text:</h4>
                                  <p className="text-sm whitespace-pre-wrap">{feedback.feedback_text}</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} results
                    </div>
                    <div className="flex space-x-2">
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
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}