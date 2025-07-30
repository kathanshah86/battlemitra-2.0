import { supabase } from '@/integrations/supabase/client';
import { TournamentTeam } from '@/types';

export interface TournamentRegistration {
  id: string;
  user_id: string;
  tournament_id: string;
  player_name: string;
  player_game_id: string;
  registration_date: string;
  payment_status: 'pending' | 'completed' | 'failed';
  payment_amount: number;
  team_id?: string;
  is_team_captain?: boolean;
  created_at: string;
  updated_at: string;
}

export interface TournamentRegistrationInput {
  tournament_id: string;
  player_name: string;
  player_game_id: string;
  payment_amount?: number;
  team_id?: string;
  is_team_captain?: boolean;
}

export interface TeamRegistrationInput {
  tournament_id: string;
  team_name: string;
  team_size: number;
  player_name: string;
  player_game_id: string;
  payment_amount?: number;
}

export interface TournamentRoom {
  id: string;
  tournament_id: string;
  room_id?: string;
  room_password?: string;
  created_at: string;
  updated_at: string;
}

export const tournamentRegistrationService = {
  async registerForTournament(registration: TournamentRegistrationInput): Promise<TournamentRegistration> {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('tournament_registrations')
      .insert([{
        ...registration,
        user_id: user.id,
        payment_status: 'completed'
      }])
      .select()
      .single();

    if (error) throw error;
    return data as TournamentRegistration;
  },

  async getUserRegistrations(userId: string): Promise<TournamentRegistration[]> {
    const { data, error } = await supabase
      .from('tournament_registrations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as TournamentRegistration[];
  },

  async getTournamentRegistrations(tournamentId: string): Promise<TournamentRegistration[]> {
    const { data, error } = await supabase
      .from('tournament_registrations')
      .select('*')
      .eq('tournament_id', tournamentId)
      .eq('payment_status', 'completed')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []) as TournamentRegistration[];
  },

  async checkUserRegistration(userId: string, tournamentId: string): Promise<TournamentRegistration | null> {
    const { data, error } = await supabase
      .from('tournament_registrations')
      .select('*')
      .eq('user_id', userId)
      .eq('tournament_id', tournamentId)
      .maybeSingle();

    if (error) throw error;
    return data as TournamentRegistration | null;
  },

  async updatePaymentStatus(registrationId: string, status: 'completed' | 'failed'): Promise<void> {
    const { error } = await supabase
      .from('tournament_registrations')
      .update({ payment_status: status })
      .eq('id', registrationId);

    if (error) throw error;
  },

  async getTournamentRoom(tournamentId: string): Promise<TournamentRoom | null> {
    const { data, error } = await supabase
      .from('tournament_rooms')
      .select('*')
      .eq('tournament_id', tournamentId)
      .maybeSingle();

    if (error) throw error;
    return data as TournamentRoom | null;
  },

  async upsertTournamentRoom(tournamentId: string, roomData: Partial<Pick<TournamentRoom, 'room_id' | 'room_password'>>): Promise<TournamentRoom> {
    const { data, error } = await supabase
      .from('tournament_rooms')
      .upsert({
        tournament_id: tournamentId,
        ...roomData
      }, {
        onConflict: 'tournament_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data as TournamentRoom;
  },

  // Team-related functions
  async createTeam(teamData: TeamRegistrationInput): Promise<{ team: TournamentTeam; registration: TournamentRegistration }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Create team first
    const { data: team, error: teamError } = await supabase
      .from('tournament_teams')
      .insert([{
        tournament_id: teamData.tournament_id,
        team_name: teamData.team_name,
        team_captain_id: user.id,
        team_size: teamData.team_size,
        max_members: teamData.team_size
      }])
      .select()
      .single();

    if (teamError) throw teamError;

    // Register captain to the team
    const registration = await this.registerForTournament({
      tournament_id: teamData.tournament_id,
      player_name: teamData.player_name,
      player_game_id: teamData.player_game_id,
      payment_amount: teamData.payment_amount,
      team_id: team.id,
      is_team_captain: true
    });

    return { team: team as TournamentTeam, registration };
  },

  async joinTeam(teamId: string, playerData: Omit<TournamentRegistrationInput, 'team_id' | 'is_team_captain'>): Promise<TournamentRegistration> {
    // Check if team is full
    const { data: team, error: teamError } = await supabase
      .from('tournament_teams')
      .select('*')
      .eq('id', teamId)
      .single();

    if (teamError) throw teamError;
    if (team.is_full) throw new Error('Team is already full');

    return this.registerForTournament({
      ...playerData,
      team_id: teamId,
      is_team_captain: false
    });
  },

  async getTournamentTeams(tournamentId: string): Promise<TournamentTeam[]> {
    const { data, error } = await supabase
      .from('tournament_teams')
      .select('*')
      .eq('tournament_id', tournamentId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []) as TournamentTeam[];
  },

  async getTeamMembers(teamId: string): Promise<TournamentRegistration[]> {
    const { data, error } = await supabase
      .from('tournament_registrations')
      .select('*')
      .eq('team_id', teamId)
      .eq('payment_status', 'completed')
      .order('is_team_captain', { ascending: false });

    if (error) throw error;
    return (data || []) as TournamentRegistration[];
  },

  async getAvailableTeams(tournamentId: string): Promise<TournamentTeam[]> {
    const { data, error } = await supabase
      .from('tournament_teams')
      .select('*')
      .eq('tournament_id', tournamentId)
      .eq('is_full', false)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []) as TournamentTeam[];
  }
};