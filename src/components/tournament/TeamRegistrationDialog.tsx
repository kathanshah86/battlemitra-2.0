import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Crown, UserPlus, Loader2, Mail, User } from 'lucide-react';
import { Tournament, TournamentTeam } from '@/types';
import { tournamentRegistrationService, TeamRegistrationInput } from '@/services/tournamentRegistrationService';

interface Player {
  ign: string;
  playerId: string;
}

interface TeamRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournament: Tournament;
  onTeamCreated: () => void;
  gameId: string;
  playerName: string;
}

const TeamRegistrationDialog: React.FC<TeamRegistrationDialogProps> = ({
  open,
  onOpenChange,
  tournament,
  onTeamCreated,
  gameId,
  playerName
}) => {
  const [activeTab, setActiveTab] = useState('create');
  const [teamName, setTeamName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [selectedGame, setSelectedGame] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [availableTeams, setAvailableTeams] = useState<TournamentTeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);

  const isFree = !tournament.entry_fee || tournament.entry_fee === 'Free' || tournament.entry_fee === '0';
  const teamSize = tournament.team_size === 'duo' ? 2 : tournament.team_size === 'squad' ? 4 : 1;
  const games = ['BGMI', 'Valorant', 'Free Fire'];

  // Initialize form when dialog opens
  useEffect(() => {
    if (open) {
      setTeamName('');
      setLeaderEmail('');
      setSelectedGame('');
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      loadAvailableTeams();
    }
  }, [open, tournament.id]);

  const loadAvailableTeams = async () => {
    setLoadingTeams(true);
    try {
      const teams = await tournamentRegistrationService.getAvailableTeams(tournament.id);
      setAvailableTeams(teams);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) return;

    setIsLoading(true);
    try {
      const teamData: TeamRegistrationInput = {
        tournament_id: tournament.id,
        team_name: teamName.trim(),
        team_size: teamSize,
        player_name: playerName,
        player_game_id: gameId,
        payment_amount: isFree ? 0 : parseInt(tournament.entry_fee?.replace(/[^0-9]/g, '') || '0')
      };

      await tournamentRegistrationService.createTeam(teamData);
      onTeamCreated();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error('Error creating team:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTeamName('');
    setLeaderEmail('');
    setSelectedGame('');
  };

  const handleJoinTeam = async () => {
    if (!selectedTeam) return;

    setIsLoading(true);
    try {
      await tournamentRegistrationService.joinTeam(selectedTeam, {
        tournament_id: tournament.id,
        player_name: playerName,
        player_game_id: gameId,
        payment_amount: isFree ? 0 : parseInt(tournament.entry_fee?.replace(/[^0-9]/g, '') || '0')
      });

      onTeamCreated();
      onOpenChange(false);
      setSelectedTeam('');
    } catch (error: any) {
      console.error('Error joining team:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Users className="w-5 h-5" />
            Team Registration - {tournament.team_size} Tournament
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 border border-gray-600">
            <TabsTrigger 
              value="create" 
              className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-purple-600 border-r border-gray-600"
            >
              Create Team
            </TabsTrigger>
            <TabsTrigger 
              value="join" 
              className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-blue-600"
            >
              Join Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <div className="space-y-4">
              {/* Team Name */}
              <div>
                <Label htmlFor="teamName" className="text-white mb-2 block">
                  Team Name *
                </Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter your team name"
                  className="bg-gray-900/50 border-gray-500 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 shadow-sm"
                />
              </div>

              {/* Team Captain Details */}
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  <span className="text-white font-medium">Team Captain Details</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-gray-300 mb-1 block text-sm">In-Game Name (IGN)</Label>
                    <Input
                      value={playerName}
                      disabled
                      className="bg-gray-700 border-gray-500 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-1 block text-sm">Player ID</Label>
                    <Input
                      value={gameId}
                      disabled
                      className="bg-gray-700 border-gray-500 text-white"
                    />
                  </div>
                </div>
                <div className="mt-3 p-3 bg-blue-500/10 border border-blue-400/30 rounded">
                  <p className="text-sm text-blue-200">
                    ℹ️ You are creating a {tournament.team_size} team (max {teamSize} players). 
                    Other players can join your team after creation.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleCreateTeam}
                disabled={isLoading || !teamName.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Team...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Create Team & Register as Captain
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="join" className="space-y-4">
            <div className="space-y-4">
              {loadingTeams ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                </div>
              ) : availableTeams.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No teams available to join</p>
                  <p className="text-gray-500 text-sm">Create a new team to get started</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {availableTeams.map((team) => (
                    <Card
                      key={team.id}
                      className={`cursor-pointer transition-colors ${
                        selectedTeam === team.id
                          ? 'bg-purple-900/30 border-purple-500'
                          : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
                      }`}
                      onClick={() => setSelectedTeam(team.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-white">{team.team_name}</h4>
                            <p className="text-sm text-gray-400">
                              {team.current_members} / {team.max_members} players
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-green-400 border-green-500">
                              {team.max_members - team.current_members} slots left
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {availableTeams.length > 0 && (
                <Button
                  onClick={handleJoinTeam}
                  disabled={isLoading || !selectedTeam}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Joining Team...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Join Selected Team
                    </>
                  )}
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TeamRegistrationDialog;