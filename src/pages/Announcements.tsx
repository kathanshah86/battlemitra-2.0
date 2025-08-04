import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Calendar, AlertTriangle, Info, AlertCircle, Zap, Sparkles, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
}

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements((data || []) as Announcement[]);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'high':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'normal':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'low':
        return <Zap className="w-5 h-5 text-gray-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      urgent: 'announcement-badge-urgent',
      high: 'announcement-badge-high',
      normal: 'announcement-badge-normal',
      low: 'announcement-badge-low'
    };

    return (
      <Badge 
        variant="outline" 
        className={`${styles[priority as keyof typeof styles]} uppercase text-xs font-semibold animate-fade-in`}
      >
        {priority}
      </Badge>
    );
  };

  const getPriorityOrder = (priority: string) => {
    const order = { urgent: 0, high: 1, normal: 2, low: 3 };
    return order[priority as keyof typeof order] || 2;
  };

  const sortedAnnouncements = announcements.sort((a, b) => {
    const priorityA = getPriorityOrder(a.priority);
    const priorityB = getPriorityOrder(b.priority);
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-background p-6">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3 relative">
                <div className="relative">
                  <Megaphone className="w-8 h-8 text-primary" />
                  <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1 animate-pulse" />
                </div>
                <h1 className="text-4xl font-bold announcement-header-gradient">Announcements</h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Loading the latest updates and important information...
              </p>
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="announcement-card animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-muted rounded"></div>
                      <div className="h-6 bg-muted rounded flex-1 max-w-md"></div>
                      <div className="h-6 bg-muted rounded w-16"></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-4/5"></div>
                      <div className="h-4 bg-muted rounded w-3/5"></div>
                      <div className="pt-3 border-t border-border/50">
                        <div className="h-3 bg-muted rounded w-48"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-background p-6">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Enhanced Header */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 relative">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-primary to-blue-500 p-4 rounded-full">
                  <Megaphone className="w-8 h-8 text-white" />
                </div>
                <Bell className="w-4 h-4 text-primary absolute -top-1 -right-1 animate-bounce" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold announcement-header-gradient">
                Announcements
              </h1>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              <p className="text-muted-foreground text-lg leading-relaxed">
                Stay updated with the latest news, tournament updates, and important information from our esports platform.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Live updates • Real-time notifications</span>
              </div>
            </div>
          </div>

          {/* Enhanced Announcements List */}
          <div className="space-y-6">
            {sortedAnnouncements.length === 0 ? (
              <Card className="announcement-card text-center p-12 animate-scale-in">
                <div className="space-y-6">
                  <div className="relative mx-auto w-20 h-20">
                    <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-primary/20 to-blue-500/20 p-6 rounded-full border border-primary/20">
                      <Megaphone className="w-8 h-8 text-primary mx-auto" />
                    </div>
                    <Sparkles className="w-5 h-5 text-primary absolute -top-1 -right-1 animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">No Announcements Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                      Check back soon for the latest updates, tournament news, and important platform announcements!
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    <span>We'll keep you informed</span>
                  </div>
                </div>
              </Card>
            ) : (
              sortedAnnouncements.map((announcement, index) => (
                <Card 
                  key={announcement.id} 
                  className={`announcement-card announcement-card-${announcement.priority} group animate-fade-in`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getPriorityIcon(announcement.priority)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-foreground text-xl leading-tight font-bold group-hover:text-primary transition-colors">
                            {announcement.title}
                          </CardTitle>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {getPriorityBadge(announcement.priority)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                      {announcement.content}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>
                          Published {format(new Date(announcement.created_at), 'MMM dd, yyyy')}
                          <span className="hidden sm:inline"> at {format(new Date(announcement.created_at), 'HH:mm')}</span>
                        </span>
                      </div>
                      {announcement.updated_at !== announcement.created_at && (
                        <div className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-muted-foreground rounded-full hidden sm:block"></span>
                          <span className="text-muted-foreground/80">
                            Updated {format(new Date(announcement.updated_at), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Enhanced Footer */}
          <div className="text-center py-12 space-y-4">
            <div className="flex items-center justify-center gap-2 text-primary">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
            </div>
            <p className="text-muted-foreground">
              Stay connected for the latest esports tournament updates and platform news.
            </p>
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Bell className="w-3 h-3" />
                Real-time updates
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Important announcements
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Announcements;