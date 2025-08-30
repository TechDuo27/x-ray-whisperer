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
import { ThumbsUp, ThumbsDown, Calendar as CalendarIcon, Filter, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format, parseISO, subDays } from 'date-fns';

interface FeedbackData {
  id: string;
  user_id: string;
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
  total: number;
}

export default function AdminFeedback() {
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
  const [filteredData, setFilteredData] = useState<FeedbackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(subDays(new Date(), 30));
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  useEffect(() => {
    applyFilters();
    generateTrendData();
  }, [feedbackData, searchTerm, selectedUser, dateFrom, dateTo]);

  const fetchFeedbackData = async () => {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('id, user_id, created_at, feedback_type, feedback_text, feedback_submitted_at, original_filename')
        .not('feedback_type', 'is', null)
        .order('feedback_submitted_at', { ascending: false });

      if (error) throw error;
      const typedData = (data || []).map(item => ({
        ...item,
        feedback_type: item.feedback_type as 'up' | 'down'
      }));
      setFeedbackData(typedData);
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

    // Text search
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.feedback_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.original_filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // User filter
    if (selectedUser !== 'all') {
      filtered = filtered.filter(item => item.user_id === selectedUser);
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(item => 
        new Date(item.feedback_submitted_at) >= dateFrom
      );
    }
    if (dateTo) {
      filtered = filtered.filter(item => 
        new Date(item.feedback_submitted_at) <= dateTo
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const generateTrendData = () => {
    if (!feedbackData.length) return;

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      return {
        date: format(date, 'yyyy-MM-dd'),
        up: 0,
        down: 0,
        total: 0
      };
    });

    feedbackData.forEach(item => {
      const itemDate = format(parseISO(item.feedback_submitted_at), 'yyyy-MM-dd');
      const dayData = last30Days.find(day => day.date === itemDate);
      if (dayData) {
        if (item.feedback_type === 'up') dayData.up++;
        else dayData.down++;
        dayData.total++;
      }
    });

    setTrendData(last30Days);
  };

  const getWordFrequency = () => {
    const words: Record<string, number> = {};
    filteredData.forEach(item => {
      const text = item.feedback_text.toLowerCase();
      const wordsArray = text.match(/\b\w+\b/g) || [];
      wordsArray.forEach(word => {
        if (word.length > 3) { // Only count words longer than 3 characters
          words[word] = (words[word] || 0) + 1;
        }
      });
    });

    return Object.entries(words)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20);
  };

  const metrics = {
    total: filteredData.length,
    upCount: filteredData.filter(f => f.feedback_type === 'up').length,
    downCount: filteredData.filter(f => f.feedback_type === 'down').length,
    approvalRatio: filteredData.length > 0 
      ? (filteredData.filter(f => f.feedback_type === 'up').length / filteredData.length * 100).toFixed(1)
      : '0'
  };

  const uniqueUsers = Array.from(new Set(feedbackData.map(f => f.user_id)));

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Feedback Dashboard</h1>
        <Button onClick={fetchFeedbackData} disabled={loading}>
          Refresh Data
        </Button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-green-600" />
              Positive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.upCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ThumbsDown className="h-4 w-4 text-red-600" />
              Negative
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.downCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Approval Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.approvalRatio}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="insights">Text Insights</TabsTrigger>
          <TabsTrigger value="raw">Raw Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                up: { label: "Positive", color: "hsl(var(--chart-1))" },
                down: { label: "Negative", color: "hsl(var(--chart-2))" }
              }} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{ name: 'Feedback', up: metrics.upCount, down: metrics.downCount }]}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="up" fill="hsl(var(--chart-1))" />
                    <Bar dataKey="down" fill="hsl(var(--chart-2))" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Trends Over Time</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                up: { label: "Positive", color: "hsl(var(--chart-1))" },
                down: { label: "Negative", color: "hsl(var(--chart-2))" },
                total: { label: "Total", color: "hsl(var(--chart-3))" }
              }} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => format(parseISO(date), 'MMM dd')}
                    />
                    <YAxis />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      labelFormatter={(date) => format(parseISO(date), 'MMM dd, yyyy')}
                    />
                    <Line type="monotone" dataKey="up" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                    <Line type="monotone" dataKey="down" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                    <Line type="monotone" dataKey="total" stroke="hsl(var(--chart-3))" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequent Words in Feedback</CardTitle>
              <CardDescription>Most common words (4+ characters) from feedback text</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {getWordFrequency().slice(0, 16).map(([word, count]) => (
                  <div key={word} className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">{word}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="raw" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <Input
                    placeholder="Search feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">User</label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      {uniqueUsers.map(userId => (
                        <SelectItem key={userId} value={userId}>
                          {userId.substring(0, 8)}...
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">From Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, 'MMM dd, yyyy') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">To Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, 'MMM dd, yyyy') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback Entries ({filteredData.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Feedback</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {format(parseISO(item.feedback_submitted_at), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {item.user_id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {item.feedback_type === 'up' ? (
                          <Badge className="bg-green-100 text-green-800">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Positive
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            <ThumbsDown className="h-3 w-3 mr-1" />
                            Negative
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[100px] truncate">
                        {item.original_filename || 'N/A'}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        {expandedRows.has(item.id) ? (
                          <div className="whitespace-pre-wrap text-sm">
                            {item.feedback_text}
                          </div>
                        ) : (
                          <div className="truncate text-sm">
                            {item.feedback_text.substring(0, 100)}...
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRowExpansion(item.id)}
                        >
                          {expandedRows.has(item.id) ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}