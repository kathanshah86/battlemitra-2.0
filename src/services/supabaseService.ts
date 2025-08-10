
import { supabase } from '@/integrations/supabase/client';
import { Tournament, Player, Match } from '@/types';

// Helper function to convert database row to Tournament
const convertToTournament = (dbRow: any): Tournament => {
  return {
    ...dbRow,
    // Map DB fields to app fields
    image: dbRow.image_url ?? '',
    registration_opens: dbRow.registration_start_time ?? undefined,
    registration_closes: dbRow.registration_end_time ?? undefined,
  } as Tournament;
};

// Helper function to convert Tournament to database format
const convertToDbFormat = (tournament: any) => {
  const db: any = {};

  // Direct mappings
  if (tournament.name !== undefined) db.name = tournament.name;
  if (tournament.game !== undefined) db.game = tournament.game;
  if (tournament.description !== undefined) db.description = tournament.description;
  if (tournament.prize_pool !== undefined) db.prize_pool = tournament.prize_pool;
  if (tournament.max_participants !== undefined) db.max_participants = tournament.max_participants;
  if (tournament.current_participants !== undefined) db.current_participants = tournament.current_participants;
  if (tournament.status !== undefined) db.status = tournament.status;
  if (tournament.rules !== undefined) db.rules = tournament.rules;
  if (tournament.schedule !== undefined) db.schedule = tournament.schedule;
  if (tournament.timer_duration !== undefined) db.timer_duration = tournament.timer_duration;
  if (tournament.timer_start_time !== undefined) db.timer_start_time = tournament.timer_start_time;
  if (tournament.timer_is_running !== undefined) db.timer_is_running = tournament.timer_is_running;

  // Date/time mappings (ensure ISO strings)
  if (tournament.start_date) db.start_date = new Date(tournament.start_date).toISOString();
  if (tournament.end_date) db.end_date = new Date(tournament.end_date).toISOString();

  // Registration window mapping
  if (tournament.registration_opens) db.registration_start_time = new Date(tournament.registration_opens).toISOString();
  if (tournament.registration_closes) db.registration_end_time = new Date(tournament.registration_closes).toISOString();

  // Image mapping
  if (tournament.image !== undefined) db.image_url = tournament.image;

  return db;
};

// Tournament operations
export const tournamentService = {
  async getAll(): Promise<Tournament[]> {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tournaments:', error);
      return [];
    }
    return (data || []).map(convertToTournament);
  },

  async create(tournament: Omit<Tournament, 'id' | 'created_at' | 'updated_at'>): Promise<Tournament> {
    // Clean up the tournament data - remove empty strings and undefined values
    let tournamentData = { ...tournament };
    
    // Remove empty string values to prevent database errors
    Object.keys(tournamentData).forEach(key => {
      if (tournamentData[key] === '' || tournamentData[key] === undefined || tournamentData[key] === null) {
        delete tournamentData[key];
      }
    });

    // Ensure required dates are present and properly formatted
    if (!tournamentData.start_date) {
      tournamentData.start_date = new Date().toISOString();
    } else {
      tournamentData.start_date = new Date(tournamentData.start_date).toISOString();
    }
    
    if (!tournamentData.end_date) {
      tournamentData.end_date = new Date().toISOString();
    } else {
      tournamentData.end_date = new Date(tournamentData.end_date).toISOString();
    }

    // Handle optional date fields
    if (tournamentData.registration_opens) {
      tournamentData.registration_opens = new Date(tournamentData.registration_opens).toISOString();
    }
    if (tournamentData.registration_closes) {
      tournamentData.registration_closes = new Date(tournamentData.registration_closes).toISOString();
    }

    // Convert to database format
    const dbData = convertToDbFormat(tournamentData);

    console.log('Creating tournament with cleaned data:', dbData);

    const { data, error } = await supabase
      .from('tournaments')
      .insert([dbData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating tournament:', error);
      throw error;
    }
    return convertToTournament(data);
  },

  async update(id: string, tournament: Partial<Tournament>): Promise<Tournament> {
    // Clean up the tournament data - remove empty strings and undefined values
    let updateData = { ...tournament };
    
    // Remove empty string values to prevent database errors
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === '' || updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      }
    });

    // Format date fields if they exist
    if (updateData.start_date) {
      updateData.start_date = new Date(updateData.start_date).toISOString();
    }
    if (updateData.end_date) {
      updateData.end_date = new Date(updateData.end_date).toISOString();
    }
    if (updateData.registration_opens) {
      updateData.registration_opens = new Date(updateData.registration_opens).toISOString();
    }
    if (updateData.registration_closes) {
      updateData.registration_closes = new Date(updateData.registration_closes).toISOString();
    }

    // Add updated timestamp
    updateData.updated_at = new Date().toISOString();

    // Convert to database format
    const dbData = convertToDbFormat(updateData);

    console.log('Updating tournament with cleaned data:', dbData);
    
    const { data, error } = await supabase
      .from('tournaments')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating tournament:', error);
      throw error;
    }
    return convertToTournament(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting tournament:', error);
      throw error;
    }
  }
};

// Player operations
export const playerService = {
  async getAll(): Promise<Player[]> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('rank', { ascending: true });
    
    if (error) {
      console.error('Error fetching players:', error);
      return [];
    }
    return (data || []) as Player[];
  },

  async create(player: Omit<Player, 'id' | 'created_at' | 'updated_at'>): Promise<Player> {
    const { data, error } = await supabase
      .from('players')
      .insert([player])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating player:', error);
      throw error;
    }
    return data as Player;
  },

  async update(id: string, player: Partial<Player>): Promise<Player> {
    const { data, error } = await supabase
      .from('players')
      .update({ ...player, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating player:', error);
      throw error;
    }
    return data as Player;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting player:', error);
      throw error;
    }
  }
};

// Match operations
export const matchService = {
  async getAll(): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error('Error fetching matches:', error);
      return [];
    }
    return (data || []) as Match[];
  },

  async create(match: Omit<Match, 'id' | 'created_at' | 'updated_at'>): Promise<Match> {
    // Ensure start_time is properly formatted
    const matchData = {
      ...match,
      start_time: match.start_time || new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('matches')
      .insert([matchData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating match:', error);
      throw error;
    }
    return data as Match;
  },

  async update(id: string, match: Partial<Match>): Promise<Match> {
    // Filter out empty string dates
    const updateData = { ...match };
    if (updateData.start_time === '') delete updateData.start_time;
    
    const { data, error } = await supabase
      .from('matches')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating match:', error);
      throw error;
    }
    return data as Match;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting match:', error);
      throw error;
    }
  }
};
