import { supabase } from '@/integrations/supabase/client';

export interface TournamentRegistration {
  id: string;
  user_id: string;
  tournament_id: string;
  player_name: string;
  game_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  // Optional legacy fields (for UI compatibility)
  player_game_id?: string;
  registration_date?: string;
  payment_status?: 'pending' | 'completed' | 'failed';
  payment_amount?: number;
  team_id?: string;
  is_team_captain?: boolean;
}

export interface TournamentRegistrationInput {
  tournament_id: string;
  player_name: string;
  game_id?: string;
  player_game_id?: string;
  payment_amount?: number;
}

// Optional legacy types for team flows
export interface TeamRegistrationInput {
  tournament_id: string;
  team_name: string;
  team_size: number;
  player_name: string;
  game_id?: string;
  payment_amount?: number;
  player_game_id?: string;
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('tournament_registrations')
      .insert([
        {
          user_id: user.id,
          tournament_id: registration.tournament_id,
          player_name: registration.player_name,
          game_id: registration.game_id ?? registration.player_game_id ?? '',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    // Map for UI compatibility
    return {
      ...(data as any),
      player_game_id: (data as any).game_id,
      registration_date: (data as any).created_at,
      payment_status: undefined,
      payment_amount: undefined,
    } as TournamentRegistration;
  },

  async getUserRegistrations(userId: string): Promise<TournamentRegistration[]> {
    const { data, error } = await supabase
      .from('tournament_registrations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((row: any) => ({
      ...row,
      player_game_id: row.game_id,
      registration_date: row.created_at,
    })) as TournamentRegistration[];
  },

  async getTournamentRegistrations(tournamentId: string): Promise<TournamentRegistration[]> {
    const { data, error } = await supabase
      .from('tournament_registrations')
      .select('*')
      .eq('tournament_id', tournamentId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []).map((row: any) => ({
      ...row,
      player_game_id: row.game_id,
      registration_date: row.created_at,
    })) as TournamentRegistration[];
  },

  async checkUserRegistration(userId: string, tournamentId: string): Promise<TournamentRegistration | null> {
    const { data, error } = await supabase
      .from('tournament_registrations')
      .select('*')
      .eq('user_id', userId)
      .eq('tournament_id', tournamentId)
      .maybeSingle();

    if (error) throw error;
    return data
      ? ({
          ...(data as any),
          player_game_id: (data as any).game_id,
          registration_date: (data as any).created_at,
        } as TournamentRegistration)
      : null;
  },

  async updateStatus(registrationId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('tournament_registrations')
      .update({ status })
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

  async upsertTournamentRoom(
    tournamentId: string,
    roomData: Partial<Pick<TournamentRoom, 'room_id' | 'room_password'>>
  ): Promise<TournamentRoom> {
    const { data, error } = await supabase
      .from('tournament_rooms')
      .upsert(
        {
          tournament_id: tournamentId,
          ...roomData,
        },
        { onConflict: 'tournament_id' }
      )
      .select()
      .single();

    if (error) throw error;
    return data as TournamentRoom;
  },

  // Legacy team flows (stubs for compatibility)
  async createTeam(_teamData: TeamRegistrationInput): Promise<{ team: any; registration: TournamentRegistration }> {
    throw new Error('Team registration is not enabled.');
  },

  async joinTeam(_teamId: string, _playerData: Omit<TournamentRegistrationInput, 'game_id'> & { game_id?: string }): Promise<TournamentRegistration> {
    throw new Error('Team registration is not enabled.');
  },

  async getTournamentTeams(_tournamentId: string): Promise<any[]> {
    return [];
  },

  async getTeamMembers(_teamId: string): Promise<TournamentRegistration[]> {
    return [];
  },

  async getAvailableTeams(_tournamentId: string): Promise<any[]> {
    return [];
  },
};
