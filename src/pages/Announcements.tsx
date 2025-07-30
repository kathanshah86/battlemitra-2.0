import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Calendar, AlertTriangle, Info, AlertCircle, Zap } from 'lucide-react';
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
      urgent: 'bg-red-500/20 text-red-400 border-red-500/50',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      normal: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      low: 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    };

    return (
      <Badge 
        variant="outline" 
        className={`${styles[priority as keyof typeof styles]} uppercase text-xs font-semibold`}
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/30 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Megaphone className="w-8 h-8 text-purple-400" />
                <h1 className="text-4xl font-bold text-white">Announcements</h1>
              </div>
              <p className="text-gray-300 text-lg">Loading latest updates...</p>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-gray-800/50 border-gray-700 animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-full"></div>
                      <div className="h-4 bg-gray-700 rounded w-2/3"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/30 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <Megaphone className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Announcements
              </h1>
            </div>
            <p className="text-gray-300 text-sm md:text-lg max-w-2xl mx-auto px-4">
              Stay updated with the latest news, tournament updates, and important information from our esports platform.
            </p>
          </div>

          {/* Announcements List */}
          <div className="space-y-4 sm:space-y-6">
            {sortedAnnouncements.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-700 text-center p-8 sm:p-12">
                <div className="space-y-4">
                  <Megaphone className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Announcements Yet</h3>
                    <p className="text-gray-400 text-sm sm:text-base">
                      Check back later for the latest updates and tournament news!
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              sortedAnnouncements.map((announcement) => (
                <Card 
                  key={announcement.id} 
                  className={`bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 ${
                    announcement.priority === 'urgent' 
                      ? 'border-red-500/50 shadow-lg shadow-red-500/20' 
                      : announcement.priority === 'high'
                      ? 'border-orange-500/50 shadow-lg shadow-orange-500/20'
                      : ''
                  }`}
                >
                  <CardHeader className="pb-3 p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        {getPriorityIcon(announcement.priority)}
                        <CardTitle className="text-white text-lg sm:text-xl leading-tight">
                          {announcement.title}
                        </CardTitle>
                      </div>
                      <div className="flex-shrink-0">
                        {getPriorityBadge(announcement.priority)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                    <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                      {announcement.content}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 pt-2 border-t border-gray-700">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>
                          Published on {format(new Date(announcement.created_at), 'MMM dd, yyyy')}
                          <span className="hidden sm:inline"> at {format(new Date(announcement.created_at), 'HH:mm')}</span>
                        </span>
                      </div>
                      {announcement.updated_at !== announcement.created_at && (
                        <span className="text-gray-500 text-xs">
                          • Updated {format(new Date(announcement.updated_at), 'MMM dd, yyyy')}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">
              Stay connected for the latest esports tournament updates and platform news.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Announcements;