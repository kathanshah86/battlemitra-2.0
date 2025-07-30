import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Users, Trophy, Play, Image, Loader2, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import { useGameStore } from '@/store/gameStore';
import { Tournament, Player, Match } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { FileUpload } from '@/components/ui/file-upload';
import SponsorsTab from '@/components/admin/SponsorsTab';
import RoomsTab from '@/components/admin/RoomsTab';
import TournamentContentEditor from '@/components/admin/TournamentContentEditor';
import TournamentTimerAdmin from '@/components/admin/TournamentTimerAdmin';
import WalletAdmin from '@/components/admin/WalletAdmin';
import LiveMatchYouTubeAdmin from '@/components/admin/LiveMatchYouTubeAdmin';
import PrizeDistributionAdmin from '@/components/admin/PrizeDistributionAdmin';
import AnnouncementsTab from '@/components/admin/AnnouncementsTab';

const Admin = () => {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  
  // Check if user is authorized admin
  const isAuthorizedAdmin = user?.email === 'kathan21042007@gmail.com';
  const {
    tournaments,
    players,
    matches,
    isLoading,
    error,
    initialize,
    addTournament,
    updateTournament,
    deleteTournament,
    addPlayer,
    updatePlayer,
    deletePlayer,
    addMatch,
    updateMatch,
    deleteMatch,
  } = useGameStore();

  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [showAddTournament, setShowAddTournament] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showAddMatch, setShowAddMatch] = useState(false);

  // Form states remain the same
  const [tournamentForm, setTournamentForm] = useState({
    name: '',
    game: '',
    description: '',
    prize_pool: '',
    max_participants: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed' | 'full',
    banner: '',
    entry_fee: '',
    region: '',
    format: '',
    team_size: '',
    organizer: '',
    rules: '',
    schedule: '',
    prizes: '',
    highlights: '',
    registration_opens: '',
    registration_closes: '',
    winners: '',
  });

  const [playerForm, setPlayerForm] = useState({
    name: '',
    points: '',
    wins: '',
    losses: '',
    country: '',
    avatar: '',
    team: '',
    earnings: '',
    win_rate: '',
    tournaments_won: '',
  });

  const [matchForm, setMatchForm] = useState({
    tournament_id: '',
    player1: '',
    player2: '',
    player1_score: '',
    player2_score: '',
    status: 'upcoming' as 'upcoming' | 'live' | 'completed',
    start_time: '',
    game: '',
    thumbnail: '',
  });

  useEffect(() => {
    initialize();
  }, [initialize]);

  const resetTournamentForm = () => {
    setTournamentForm({
      name: '',
      game: '',
      description: '',
      prize_pool: '',
      max_participants: '',
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
      status: 'upcoming',
      banner: '',
      entry_fee: '',
      region: '',
      format: '',
      team_size: '',
      organizer: '',
      rules: '',
      schedule: '',
      prizes: '',
      highlights: '',
      registration_opens: '',
      registration_closes: '',
      winners: '',
    });
    setEditingTournament(null);
    setShowAddTournament(false);
  };

  const resetPlayerForm = () => {
    setPlayerForm({
      name: '',
      points: '',
      wins: '',
      losses: '',
      country: '',
      avatar: '',
      team: '',
      earnings: '',
      win_rate: '',
      tournaments_won: '',
    });
    setEditingPlayer(null);
    setShowAddPlayer(false);
  };

  const resetMatchForm = () => {
    setMatchForm({
      tournament_id: '',
      player1: '',
      player2: '',
      player1_score: '',
      player2_score: '',
      status: 'upcoming',
      start_time: '',
      game: '',
      thumbnail: '',
    });
    setEditingMatch(null);
    setShowAddMatch(false);
  };

  const handleSaveTournament = async () => {
    try {
      // Validate required fields
      if (!tournamentForm.name || !tournamentForm.game || !tournamentForm.prize_pool || 
          !tournamentForm.max_participants || !tournamentForm.start_date || !tournamentForm.end_date) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields (Name, Game, Prize Pool, Max Participants, Start Date, End Date).",
          variant: "destructive",
        });
        return;
      }

      // Format dates properly
      const startDate = new Date(tournamentForm.start_date).toISOString();
      const endDate = new Date(tournamentForm.end_date).toISOString();

      const tournamentData = {
        ...tournamentForm,
        max_participants: parseInt(tournamentForm.max_participants),
        current_participants: editingTournament?.current_participants || 0,
        image: '/lovable-uploads/feb97539-ef64-4950-81ec-d958016900ac.png',
        banner: tournamentForm.banner || undefined,
        highlights: tournamentForm.highlights ? tournamentForm.highlights.split('\n').filter(h => h.trim()) : undefined,
        start_date: startDate,
        end_date: endDate,
        start_time: tournamentForm.start_time || undefined,
        end_time: tournamentForm.end_time || undefined,
        registration_opens: tournamentForm.registration_opens ? new Date(tournamentForm.registration_opens).toISOString() : undefined,
        registration_closes: tournamentForm.registration_closes ? new Date(tournamentForm.registration_closes).toISOString() : undefined,
        winners: tournamentForm.winners || undefined,
      };

      console.log('Saving tournament data:', tournamentData);

      if (editingTournament) {
        await updateTournament(editingTournament.id, tournamentData);
        toast({
          title: "Tournament Updated",
          description: "Tournament has been updated successfully and will reflect on the main website immediately.",
        });
      } else {
        await addTournament(tournamentData);
        toast({
          title: "Tournament Added",
          description: "New tournament has been added and is now live on the main website.",
        });
      }
      resetTournamentForm();
    } catch (error) {
      console.error('Tournament save error:', error);
      toast({
        title: "Error",
        description: `Failed to save tournament: ${error.message || 'Please try again.'}`,
        variant: "destructive",
      });
    }
  };

  const handleSavePlayer = async () => {
    try {
      const playerData = {
        name: playerForm.name,
        points: parseInt(playerForm.points) || 0,
        wins: parseInt(playerForm.wins) || 0,
        losses: parseInt(playerForm.losses) || 0,
        country: playerForm.country,
        avatar: playerForm.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        team: playerForm.team || undefined,
        earnings: parseInt(playerForm.earnings) || 0,
        win_rate: parseFloat(playerForm.win_rate) || 0.0,
        tournaments_won: parseInt(playerForm.tournaments_won) || 0,
      };

      if (editingPlayer) {
        await updatePlayer(editingPlayer.id, playerData);
        toast({
          title: "Player Updated",
          description: "Player information has been updated successfully.",
        });
      } else {
        const newRank = Math.max(...players.map(p => p.rank), 0) + 1;
        await addPlayer({
          ...playerData,
          rank: newRank,
        });
        toast({
          title: "Player Added",
          description: "New player has been added to the system.",
        });
      }
      resetPlayerForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save player. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveMatch = async () => {
    try {
      const matchData = {
        ...matchForm,
        player1_score: parseInt(matchForm.player1_score) || 0,
        player2_score: parseInt(matchForm.player2_score) || 0,
      };

      if (editingMatch) {
        await updateMatch(editingMatch.id, matchData);
        toast({
          title: "Match Updated",
          description: "Match information has been updated successfully.",
        });
      } else {
        await addMatch(matchData);
        toast({
          title: "Match Added",
          description: "New match has been scheduled successfully.",
        });
      }
      resetMatchForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save match. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startEditTournament = (tournament: Tournament) => {
    setTournamentForm({
      name: tournament.name,
      game: tournament.game,
      description: tournament.description,
      prize_pool: tournament.prize_pool,
      max_participants: tournament.max_participants.toString(),
      start_date: tournament.start_date,
      end_date: tournament.end_date,
      start_time: tournament.start_time || '',
      end_time: tournament.end_time || '',
      status: tournament.status,
      banner: tournament.banner || '',
      entry_fee: tournament.entry_fee || '',
      region: tournament.region || '',
      format: tournament.format || '',
      team_size: tournament.team_size || '',
      organizer: tournament.organizer || '',
      rules: tournament.rules || '',
      schedule: tournament.schedule || '',
      prizes: tournament.prizes || '',
      highlights: tournament.highlights ? tournament.highlights.join('\n') : '',
      registration_opens: tournament.registration_opens || '',
      registration_closes: tournament.registration_closes || '',
      winners: (tournament as any).winners || '',
    });
    setEditingTournament(tournament);
    setShowAddTournament(true);
  };

  const startEditPlayer = (player: Player) => {
    setPlayerForm({
      name: player.name,
      points: player.points.toString(),
      wins: player.wins.toString(),
      losses: player.losses.toString(),
      country: player.country,
      avatar: player.avatar,
      team: player.team || '',
      earnings: player.earnings.toString(),
      win_rate: player.win_rate.toString(),
      tournaments_won: player.tournaments_won.toString(),
    });
    setEditingPlayer(player);
    setShowAddPlayer(true);
  };

  const startEditMatch = (match: Match) => {
    setMatchForm({
      tournament_id: match.tournament_id,
      player1: match.player1,
      player2: match.player2,
      player1_score: match.player1_score.toString(),
      player2_score: match.player2_score.toString(),
      status: match.status,
      start_time: match.start_time,
      game: match.game,
      thumbnail: match.thumbnail || '',
    });
    setEditingMatch(match);
    setShowAddMatch(true);
  };

  const handleDeleteTournament = async (id: string) => {
    try {
      await deleteTournament(id);
      toast({
        title: "Tournament Deleted",
        description: "Tournament has been removed from the system.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete tournament. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <span className="ml-2 text-gray-400">Loading admin panel...</span>
          </div>
        </div>
      </Layout>
    );
  }

  // Check authorization
  if (!user) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-400 mb-2">Access Denied</h3>
            <p className="text-gray-500">Please log in to access the admin panel.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthorizedAdmin) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-400 mb-2">Unauthorized Access</h3>
            <p className="text-gray-500">You don't have permission to access the admin panel.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Data</h3>
            <p className="text-gray-500">{error}</p>
            <Button onClick={() => initialize()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 md:mb-4">Admin Panel</h1>
          <p className="text-gray-400 text-sm md:text-lg px-4">
            Manage tournaments, players, and matches - Changes reflect immediately on the main website
          </p>
        </div>

        <Tabs defaultValue="tournaments" className="space-y-6">
          <TabsList className="flex flex-wrap w-full bg-gray-800/90 backdrop-blur-sm gap-3 p-4 justify-center rounded-lg border border-gray-700">
            <TabsTrigger 
              value="tournaments" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 text-sm px-4 py-3 rounded-md font-medium min-w-fit"
            >
              <Trophy className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Tournaments</span>
            </TabsTrigger>
            <TabsTrigger 
              value="players" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 text-sm px-4 py-3 rounded-md font-medium min-w-fit"
            >
              <Users className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Players</span>
            </TabsTrigger>
            <TabsTrigger 
              value="matches" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 text-sm px-4 py-3 rounded-md font-medium min-w-fit"
            >
              <Play className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Matches</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sponsors" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 text-sm px-4 py-3 rounded-md font-medium min-w-fit"
            >
              <Image className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Sponsors</span>
            </TabsTrigger>
            <TabsTrigger 
              value="rooms" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 text-sm px-4 py-3 rounded-md font-medium min-w-fit"
            >
              <Lock className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Rooms</span>
            </TabsTrigger>
            <TabsTrigger 
              value="live-youtube" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 text-sm px-4 py-3 rounded-md font-medium min-w-fit"
            >
              <Play className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Live YouTube</span>
            </TabsTrigger>
            <TabsTrigger 
              value="prizes" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 text-sm px-4 py-3 rounded-md font-medium min-w-fit"
            >
              <Trophy className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Prize Admin</span>
            </TabsTrigger>
            <TabsTrigger 
              value="wallet" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 text-sm px-4 py-3 rounded-md font-medium min-w-fit"
            >
              <Trophy className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Wallet Admin</span>
            </TabsTrigger>
            <TabsTrigger 
              value="announcements" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 text-sm px-4 py-3 rounded-md font-medium min-w-fit"
            >
              <Trophy className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Announcements</span>
            </TabsTrigger>
          </TabsList>

          {/* Tournaments Tab */}
          <TabsContent value="tournaments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Manage Tournaments</h2>
              <Button 
                onClick={() => setShowAddTournament(true)}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Tournament
              </Button>
            </div>

            {(showAddTournament || editingTournament) && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    {editingTournament ? 'Edit Tournament' : 'Add New Tournament'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tournament Name
                      </label>
                      <Input
                        value={tournamentForm.name}
                        onChange={(e) => setTournamentForm({...tournamentForm, name: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Game
                      </label>
                      <Input
                        value={tournamentForm.game}
                        onChange={(e) => setTournamentForm({...tournamentForm, game: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  
                   <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">
                       Description
                     </label>
                     <Textarea
                       value={tournamentForm.description || ''}
                       onChange={(e) => setTournamentForm({...tournamentForm, description: e.target.value})}
                       className="bg-gray-700 border-gray-600 text-white"
                     />
                   </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Image className="w-4 h-4 inline mr-2" />
                      Tournament Banner
                    </label>
                    <FileUpload
                      bucket="tournament-banners"
                      onUpload={(url) => setTournamentForm({...tournamentForm, banner: url})}
                      currentUrl={tournamentForm.banner}
                      maxSize={5}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Prize Pool
                      </label>
                      <Input
                        value={tournamentForm.prize_pool}
                        onChange={(e) => setTournamentForm({...tournamentForm, prize_pool: e.target.value})}
                        placeholder="e.g., $10,000"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Max Participants
                      </label>
                      <Input
                        type="number"
                        value={tournamentForm.max_participants}
                        onChange={(e) => setTournamentForm({...tournamentForm, max_participants: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Status
                      </label>
                      <Select value={tournamentForm.status} onValueChange={(value: any) => setTournamentForm({...tournamentForm, status: value})}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="full">Full</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Entry Fee</label>
                      <Input
                        value={tournamentForm.entry_fee}
                        onChange={(e) => setTournamentForm({...tournamentForm, entry_fee: e.target.value})}
                        placeholder="e.g., ₹10"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Region</label>
                      <Input
                        value={tournamentForm.region}
                        onChange={(e) => setTournamentForm({...tournamentForm, region: e.target.value})}
                        placeholder="e.g., Global"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Format</label>
                      <Input
                        value={tournamentForm.format}
                        onChange={(e) => setTournamentForm({...tournamentForm, format: e.target.value})}
                        placeholder="e.g., Battle Royale"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Team Size</label>
                      <Select value={tournamentForm.team_size} onValueChange={(value) => setTournamentForm({...tournamentForm, team_size: value})}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select team size" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="solo">Solo</SelectItem>
                          <SelectItem value="duo">Duo</SelectItem>
                          <SelectItem value="squad">Squad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                   <div className="grid md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                       <Input
                         type="date"
                         value={tournamentForm.start_date}
                         onChange={(e) => setTournamentForm({...tournamentForm, start_date: e.target.value})}
                         className="bg-gray-700 border-gray-600 text-white"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                       <Input
                         type="date"
                         value={tournamentForm.end_date}
                         onChange={(e) => setTournamentForm({...tournamentForm, end_date: e.target.value})}
                         className="bg-gray-700 border-gray-600 text-white"
                       />
                     </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                       <Input
                         type="time"
                         value={tournamentForm.start_time}
                         onChange={(e) => setTournamentForm({...tournamentForm, start_time: e.target.value})}
                         className="bg-gray-700 border-gray-600 text-white"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                       <Input
                         type="time"
                         value={tournamentForm.end_time}
                         onChange={(e) => setTournamentForm({...tournamentForm, end_time: e.target.value})}
                         className="bg-gray-700 border-gray-600 text-white"
                       />
                     </div>
                   </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Organizer</label>
                    <Input
                      value={tournamentForm.organizer}
                      onChange={(e) => setTournamentForm({...tournamentForm, organizer: e.target.value})}
                      placeholder="e.g., Battle Mitra Official"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">Key Highlights (one per line)</label>
                     <Textarea
                       value={tournamentForm.highlights || ''}
                       onChange={(e) => setTournamentForm({...tournamentForm, highlights: e.target.value})}
                       placeholder="Compete for a prize pool of ₹15,000&#10;Professional tournament management&#10;Live streaming of featured matches"
                       className="bg-gray-700 border-gray-600 text-white"
                       rows={4}
                     />
                   </div>

                   <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Rules</label>
                        <Textarea
                          value={tournamentForm.rules || ''}
                          onChange={(e) => setTournamentForm({...tournamentForm, rules: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Schedule</label>
                        <Textarea
                          value={tournamentForm.schedule || ''}
                          onChange={(e) => setTournamentForm({...tournamentForm, schedule: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                          rows={3}
                        />
                      </div>
                   </div>

                     <div>
                       <label className="block text-sm font-medium text-gray-300 mb-2">Prize Distribution</label>
                       <Textarea
                         value={tournamentForm.prizes || ''}
                         onChange={(e) => setTournamentForm({...tournamentForm, prizes: e.target.value})}
                         className="bg-gray-700 border-gray-600 text-white"
                         rows={3}
                       />
                     </div>

                     {tournamentForm.status === 'completed' && (
                       <div>
                         <label className="block text-sm font-medium text-gray-300 mb-2">Winners Announcement</label>
                         <Textarea
                           value={tournamentForm.winners || ''}
                           onChange={(e) => setTournamentForm({...tournamentForm, winners: e.target.value})}
                           placeholder="1st Place: Player Name - ₹6000&#10;2nd Place: Player Name - ₹3000&#10;3rd Place: Player Name - ₹1000"
                           className="bg-gray-700 border-gray-600 text-white"
                           rows={4}
                         />
                       </div>
                     )}
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSaveTournament} className="bg-green-500 hover:bg-green-600">
                      <Save className="w-4 h-4 mr-2" />
                      Save Tournament
                    </Button>
                    <Button onClick={resetTournamentForm} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {tournaments.map((tournament) => (
                <Card key={tournament.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          {tournament.banner && (
                            <img 
                              src={tournament.banner} 
                              alt={tournament.name}
                              className="w-24 h-16 object-cover rounded border border-gray-600"
                            />
                          )}
                          <div>
                            <h3 className="text-white font-bold text-lg mb-2">{tournament.name}</h3>
                            <p className="text-gray-400 mb-2">{tournament.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-400">
                          <span>Game: {tournament.game}</span>
                          <span>Prize: {tournament.prize_pool}</span>
                          <span>Participants: {tournament.current_participants}/{tournament.max_participants}</span>
                          <span>Status: {tournament.status}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => startEditTournament(tournament)}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleDeleteTournament(tournament.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Tournament Content Editor */}
                    <div className="mt-6">
                      <TournamentContentEditor 
                        tournament={tournament} 
                        onUpdate={() => initialize()}
                      />
                    </div>
                    
                    {/* Tournament Timer Control */}
                    <div className="mt-6">
                      <TournamentTimerAdmin 
                        tournamentId={tournament.id}
                        currentDuration={tournament.timer_duration || 0}
                        isRunning={tournament.timer_is_running || false}
                        onTimerUpdate={() => initialize()}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Players Tab */}
          <TabsContent value="players" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Manage Players</h2>
              <Button 
                onClick={() => setShowAddPlayer(true)}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Player
              </Button>
            </div>

            {(showAddPlayer || editingPlayer) && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    {editingPlayer ? 'Edit Player' : 'Add New Player'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Player Name
                      </label>
                      <Input
                        value={playerForm.name}
                        onChange={(e) => setPlayerForm({...playerForm, name: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Team
                      </label>
                      <Input
                        value={playerForm.team}
                        onChange={(e) => setPlayerForm({...playerForm, team: e.target.value})}
                        placeholder="e.g., Team Liquid"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Country
                      </label>
                      <Input
                        value={playerForm.country}
                        onChange={(e) => setPlayerForm({...playerForm, country: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Earnings ($)
                      </label>
                      <Input
                        type="number"
                        value={playerForm.earnings}
                        onChange={(e) => setPlayerForm({...playerForm, earnings: e.target.value})}
                        placeholder="Total earnings in dollars"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Points
                      </label>
                      <Input
                        type="number"
                        value={playerForm.points}
                        onChange={(e) => setPlayerForm({...playerForm, points: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Wins
                      </label>
                      <Input
                        type="number"
                        value={playerForm.wins}
                        onChange={(e) => setPlayerForm({...playerForm, wins: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Losses
                      </label>
                      <Input
                        type="number"
                        value={playerForm.losses}
                        onChange={(e) => setPlayerForm({...playerForm, losses: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Win Rate (%)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        value={playerForm.win_rate}
                        onChange={(e) => setPlayerForm({...playerForm, win_rate: e.target.value})}
                        placeholder="e.g., 75.5"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tournaments Won
                    </label>
                    <Input
                      type="number"
                      value={playerForm.tournaments_won}
                      onChange={(e) => setPlayerForm({...playerForm, tournaments_won: e.target.value})}
                      placeholder="Number of tournaments won"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Image className="w-4 h-4 inline mr-2" />
                      Player Avatar
                    </label>
                    <FileUpload
                      bucket="player-avatars"
                      onUpload={(url) => setPlayerForm({...playerForm, avatar: url})}
                      currentUrl={playerForm.avatar}
                      maxSize={2}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSavePlayer} className="bg-green-500 hover:bg-green-600">
                      <Save className="w-4 h-4 mr-2" />
                      Save Player
                    </Button>
                    <Button onClick={resetPlayerForm} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {players.map((player) => (
                <Card key={player.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          #{player.rank}
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">{player.name}</h3>
                          <div className="flex gap-4 text-sm text-gray-400">
                            <span>Points: {player.points}</span>
                            <span>W/L: {player.wins}/{player.losses}</span>
                            <span>Country: {player.country}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => startEditPlayer(player)}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => deletePlayer(player.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Manage Matches</h2>
              <Button 
                onClick={() => setShowAddMatch(true)}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Match
              </Button>
            </div>

            {(showAddMatch || editingMatch) && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    {editingMatch ? 'Edit Match' : 'Add New Match'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tournament
                      </label>
                      <Select value={matchForm.tournament_id} onValueChange={(value) => setMatchForm({...matchForm, tournament_id: value})}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select Tournament" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          {tournaments.map((tournament) => (
                            <SelectItem key={tournament.id} value={tournament.id}>
                              {tournament.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Game
                      </label>
                      <Input
                        value={matchForm.game}
                        onChange={(e) => setMatchForm({...matchForm, game: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Player 1
                      </label>
                      <Input
                        value={matchForm.player1}
                        onChange={(e) => setMatchForm({...matchForm, player1: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Player 2
                      </label>
                      <Input
                        value={matchForm.player2}
                        onChange={(e) => setMatchForm({...matchForm, player2: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Player 1 Score
                      </label>
                      <Input
                        type="number"
                        value={matchForm.player1_score}
                        onChange={(e) => setMatchForm({...matchForm, player1_score: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Player 2 Score
                      </label>
                      <Input
                        type="number"
                        value={matchForm.player2_score}
                        onChange={(e) => setMatchForm({...matchForm, player2_score: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Status
                      </label>
                      <Select value={matchForm.status} onValueChange={(value: any) => setMatchForm({...matchForm, status: value})}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="live">Live</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Time
                    </label>
                    <Input
                      type="datetime-local"
                      value={matchForm.start_time}
                      onChange={(e) => setMatchForm({...matchForm, start_time: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Image className="w-4 h-4 inline mr-2" />
                      Match Thumbnail
                    </label>
                    <FileUpload
                      bucket="match-thumbnails"
                      onUpload={(url) => setMatchForm({...matchForm, thumbnail: url})}
                      currentUrl={matchForm.thumbnail}
                      maxSize={3}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSaveMatch} className="bg-green-500 hover:bg-green-600">
                      <Save className="w-4 h-4 mr-2" />
                      Save Match
                    </Button>
                    <Button onClick={resetMatchForm} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {matches.map((match) => (
                <Card key={match.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-4 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            match.status === 'live' 
                              ? 'bg-red-500 text-white' 
                              : match.status === 'upcoming'
                              ? 'bg-yellow-500 text-black'
                              : 'bg-green-500 text-white'
                          }`}>
                            {match.status.toUpperCase()}
                          </span>
                          <span className="text-gray-400 text-sm">{match.game}</span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">
                          {match.player1} vs {match.player2}
                        </h3>
                        <div className="flex gap-4 text-sm text-gray-400">
                          <span>Score: {match.player1_score} - {match.player2_score}</span>
                          <span>Start: {new Date(match.start_time).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => startEditMatch(match)}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => deleteMatch(match.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sponsors Tab */}
          <TabsContent value="sponsors">
            <SponsorsTab />
          </TabsContent>

          <TabsContent value="rooms">
            <RoomsTab />
          </TabsContent>

          {/* Live YouTube Tab */}
          <TabsContent value="live-youtube">
            <LiveMatchYouTubeAdmin />
          </TabsContent>

          {/* Prize Distribution Admin Tab */}
          <TabsContent value="prizes">
            <PrizeDistributionAdmin />
          </TabsContent>

          {/* Wallet Admin Tab */}
          <TabsContent value="wallet">
            <WalletAdmin />
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements">
            <AnnouncementsTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
