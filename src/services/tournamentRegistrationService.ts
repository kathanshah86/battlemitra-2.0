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

  // Team flows using tournament_teams and tournament_team_members
  async createTeam(teamData: TeamRegistrationInput): Promise<{ team: any; registration: TournamentRegistration }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Create team (captain membership is auto-added by trigger)
    const { data: team, error: teamErr } = await supabase
      .from('tournament_teams')
      .insert([
        {
          tournament_id: teamData.tournament_id,
          captain_user_id: user.id,
          team_name: teamData.team_name,
          max_members: 1, // placeholder, will be set by trigger based on tournament.team_size
        } as any,
      ])
      .select()
      .single();

    if (teamErr) throw teamErr;

    // Create registration row for captain (for UI compatibility)
    const { data: reg, error: regErr } = await supabase
      .from('tournament_registrations')
      .insert([
        {
          user_id: user.id,
          tournament_id: teamData.tournament_id,
          player_name: teamData.player_name,
          game_id: teamData.game_id ?? teamData.player_game_id ?? '',
          status: 'registered',
        },
      ])
      .select()
      .single();

    if (regErr) throw regErr;

    return {
      team,
      registration: {
        ...(reg as any),
        player_game_id: (reg as any).game_id,
        registration_date: (reg as any).created_at,
      } as TournamentRegistration,
    };
  },

  async joinTeam(teamId: string, playerData: Omit<TournamentRegistrationInput, 'game_id'> & { game_id?: string }): Promise<TournamentRegistration> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Join team
    const { error: joinErr } = await supabase
      .from('tournament_team_members')
      .insert([
        { team_id: teamId, user_id: user.id, role: 'member' },
      ]);
    if (joinErr) throw joinErr;

    // Ensure registration exists (idempotent)
    const { data: existing } = await supabase
      .from('tournament_registrations')
      .select('*')
      .eq('user_id', user.id)
      .eq('tournament_id', playerData.tournament_id)
      .maybeSingle();

    if (!existing) {
      const { data: reg, error: regErr } = await supabase
        .from('tournament_registrations')
        .insert([
          {
            user_id: user.id,
            tournament_id: playerData.tournament_id,
            player_name: playerData.player_name,
            game_id: playerData.game_id ?? playerData.player_game_id ?? '',
            status: 'registered',
          },
        ])
        .select()
        .single();
      if (regErr) throw regErr;
      return {
        ...(reg as any),
        player_game_id: (reg as any).game_id,
        registration_date: (reg as any).created_at,
      } as TournamentRegistration;
    }

    return {
      ...(existing as any),
      player_game_id: (existing as any).game_id,
      registration_date: (existing as any).created_at,
    } as TournamentRegistration;
  },

  async getTournamentTeams(tournamentId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('tournament_teams')
      .select('*')
      .eq('tournament_id', tournamentId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getTeamMembers(teamId: string): Promise<TournamentRegistration[]> {
    const { data, error } = await supabase
      .from('tournament_team_members')
      .select('*')
      .eq('team_id', teamId)
      .order('joined_at', { ascending: true });
    if (error) throw error;
    // Map to a simplified TournamentRegistration-like structure for compatibility
    return (data || []).map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      tournament_id: '',
      player_name: '',
      game_id: '',
      status: 'registered',
      created_at: row.joined_at,
      updated_at: row.joined_at,
      player_game_id: '',
      registration_date: row.joined_at,
    }));
  },

  async getAvailableTeams(tournamentId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('tournament_teams')
      .select('*')
      .eq('tournament_id', tournamentId)
      .eq('status', 'open')
      .eq('is_full', false)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },
};
