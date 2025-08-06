import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, MapPin, Trophy, ArrowLeft, Gamepad, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import TournamentRegistrationComponent from '@/components/tournament/TournamentRegistration';
import TournamentTimer from '@/components/tournament/TournamentTimer';
import PrizeDistribution from '@/components/tournament/PrizeDistribution';
import SponsorsSection from '@/components/tournament/SponsorsSection';
import { useGameStore } from '@/store/gameStore';

const TournamentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tournaments, initialize } = useGameStore();
  useEffect(() => {
    initialize();
  }, [initialize]);

  const tournament = tournaments.find(t => t.id === id);

  if (!tournament) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Tournament not found</h1>
            <Button onClick={() => navigate('/tournaments')}>
              Back to Tournaments
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="tournament-hero relative h-[350px] sm:h-[450px] lg:h-[600px] overflow-hidden">
          {tournament.banner ? (
            <img 
              src={tournament.banner} 
              alt={tournament.name}
              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-1000"
            />
          ) : (
            <div className="w-full h-full tournament-hero"></div>
          )}
          
          {/* Animated floating elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full opacity-20 floating-animation"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-pink-400 to-blue-600 rounded-full opacity-15 floating-animation" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-25 floating-animation" style={{animationDelay: '4s'}}></div>
          
          <div className="absolute inset-0 flex flex-col justify-between z-10">
            <div className="p-4 sm:p-6 lg:p-8 animate-slide-up">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/tournaments')}
                className="tournament-card-modern text-white hover:bg-white/30 transform hover:scale-110 transition-all duration-300 backdrop-blur-md border border-white/20 glow-pulse"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tournaments
              </Button>
            </div>
            
            <div className="p-4 sm:p-6 lg:p-8 animate-scale-in" style={{animationDelay: '0.3s'}}>
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge className="tournament-card-modern px-4 py-2 text-sm font-bold backdrop-blur-lg border border-purple-400/30">
                  🎮 {tournament.game || 'Battle Royale'}
                </Badge>
                <Badge 
                  className={`px-4 py-2 text-sm font-bold backdrop-blur-lg border-2 glow-pulse ${
                    tournament.status === 'upcoming' ? 'border-blue-400/50 bg-blue-500/20 text-blue-200' :
                    tournament.status === 'ongoing' ? 'border-green-400/50 bg-green-500/20 text-green-200' :
                    'border-gray-400/50 bg-gray-500/20 text-gray-200'
                  }`}
                >
                  🔥 {tournament.status.toUpperCase()}
                </Badge>
                {tournament.entry_fee && (
                  <Badge className="tournament-card-modern border-emerald-400/50 bg-emerald-500/20 text-emerald-200 px-4 py-2 text-sm font-bold">
                    💰 Entry: {tournament.entry_fee}
                  </Badge>
                )}
              </div>
              
              <h1 className="tournament-neon-text text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 leading-tight">
                {tournament.name}
              </h1>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-white text-xs sm:text-sm">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">
                    {new Date(tournament.start_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">
                    {tournament.current_participants}/{tournament.max_participants} Players
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">{tournament.region || 'Global'}</span>
                </div>
                <div className="flex items-center">
                  <Gamepad className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">{tournament.format || 'Battle Royale'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Prize Pool Card */}
          <div className="absolute top-6 right-6 z-20 animate-float">
            <div className="tournament-card-cyber p-6 text-center backdrop-blur-xl border-2 border-transparent bg-gradient-to-br from-yellow-400/20 to-orange-500/20 glow-pulse">
              <div className="flex items-center justify-center mb-3">
                <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
                <p className="text-yellow-200 text-sm font-bold uppercase tracking-wider">Prize Pool</p>
              </div>
              <p className="tournament-text-gradient text-2xl sm:text-3xl lg:text-4xl font-black">{tournament.prize_pool}</p>
            </div>
          </div>
        </div>


        {/* Tournament Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 animate-slide-up">
              {/* Tournament Timer */}
              <TournamentTimer tournament={tournament} />
              
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="tournament-card-modern grid w-full grid-cols-3 sm:grid-cols-5 p-2 h-auto backdrop-blur-xl border border-white/10">
                  <TabsTrigger value="overview" className="tournament-hologram transition-all duration-300 hover:scale-105 text-sm font-bold p-4 data-[state=active]:tournament-card-cyber">
                    <span className="hidden sm:inline">📊 Overview</span>
                    <span className="sm:hidden">📊 Info</span>
                  </TabsTrigger>
                  <TabsTrigger value="register" className="tournament-hologram transition-all duration-300 hover:scale-105 text-sm font-bold p-4 data-[state=active]:tournament-card-cyber">
                    <span className="hidden sm:inline">🚀 Register</span>
                    <span className="sm:hidden">🚀 Join</span>
                  </TabsTrigger>
                  <TabsTrigger value="rules" className="tournament-hologram transition-all duration-300 hover:scale-105 text-sm font-bold p-4 data-[state=active]:tournament-card-cyber">📋 Rules</TabsTrigger>
                  <TabsTrigger value="schedule" className="tournament-hologram transition-all duration-300 hover:scale-105 text-sm font-bold p-4 data-[state=active]:tournament-card-cyber hidden sm:block">⏰ Schedule</TabsTrigger>
                  <TabsTrigger value="prizes" className="tournament-hologram transition-all duration-300 hover:scale-105 text-sm font-bold p-4 data-[state=active]:tournament-card-cyber hidden sm:block">🏆 Prizes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="register" className="mt-6">
                  <TournamentRegistrationComponent tournament={tournament} />
                </TabsContent>
                
                <TabsContent value="overview" className="mt-8">
                  <div className="space-y-8">
                    {/* Hero Description */}
                    <div className="tournament-card-modern p-8 overflow-hidden relative glow-pulse">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-cyan-500/5 to-pink-600/10" />
                      <CardContent className="relative z-10 p-0">
                        <div className="flex items-center mb-8">
                          <div className="w-20 h-20 tournament-card-cyber rounded-2xl flex items-center justify-center mr-6 glow-pulse">
                            <Gamepad className="w-10 h-10 text-white" />
                          </div>
                          <div>
                            <h3 className="tournament-text-gradient text-4xl font-black mb-2">About the Tournament</h3>
                            <p className="text-cyan-300 text-lg font-medium">🔥 Epic battles await you!</p>
                          </div>
                        </div>
                        <p className="text-white text-xl leading-relaxed font-medium">
                          {tournament.description || '🎮 Join the ultimate Free Fire tournament and compete against the best players from around the world! Show your skills, strategy, and teamwork to win the grand prize. 💪 Are you ready to dominate the battlefield? 🔥'}
                        </p>
                      </CardContent>
                    </div>

                    {/* Tournament Details Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="tournament-card-cyber p-6 text-center tournament-hologram group glow-pulse">
                        <div className="w-16 h-16 tournament-card-modern rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Gamepad className="w-8 h-8 text-cyan-300" />
                        </div>
                        <h4 className="text-cyan-200 font-bold mb-3 text-lg uppercase tracking-wider">🎮 Format</h4>
                        <p className="tournament-text-gradient font-black text-2xl">{tournament.format || 'Battle Royale'}</p>
                      </div>
                      
                      <div className="tournament-card-cyber p-6 text-center tournament-hologram group glow-pulse">
                        <div className="w-16 h-16 tournament-card-modern rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Trophy className="w-8 h-8 text-yellow-300" />
                        </div>
                        <h4 className="text-yellow-200 font-bold mb-3 text-lg uppercase tracking-wider">💰 Entry Fee</h4>
                        <p className="tournament-text-gradient font-black text-2xl">{tournament.entry_fee || '₹10'}</p>
                      </div>

                      <div className="tournament-card-cyber p-6 text-center tournament-hologram group glow-pulse">
                        <div className="w-16 h-16 tournament-card-modern rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <MapPin className="w-8 h-8 text-orange-300" />
                        </div>
                        <h4 className="text-orange-200 font-bold mb-3 text-lg uppercase tracking-wider">🌍 Region</h4>
                        <p className="tournament-text-gradient font-black text-2xl">{tournament.region || 'Global'}</p>
                      </div>

                      <div className="tournament-card-cyber p-6 text-center tournament-hologram group glow-pulse">
                        <div className="w-16 h-16 tournament-card-modern rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Users className="w-8 h-8 text-purple-300" />
                        </div>
                        <h4 className="text-purple-200 font-bold mb-3 text-lg uppercase tracking-wider">👑 Organizer</h4>
                        <p className="tournament-text-gradient font-black text-2xl">{tournament.organizer || 'Battle Mitra'}</p>
                      </div>
                    </div>

                    {/* Key Highlights */}
                    {tournament.highlights && (
                      <Card className="bg-gradient-to-br from-yellow-600/20 via-orange-600/20 to-red-600/20 border-yellow-400/30 backdrop-blur-sm">
                        <CardContent className="p-8">
                          <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mr-4">
                              <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-2xl font-bold text-white">Key Highlights</h4>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            {tournament.highlights.map((highlight, index) => (
                              <div key={index} className="flex items-center p-4 bg-black/20 rounded-lg border-l-4 border-yellow-400">
                                <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mr-4 flex-shrink-0"></div>
                                <span className="text-gray-200 font-medium">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="rules" className="mt-6">
                  <Card className="bg-gradient-to-br from-red-900/30 via-orange-900/20 to-yellow-900/30 border-red-500/30 backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-orange-600/5" />
                    <CardContent className="relative p-8">
                      <div className="flex items-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center mr-6 shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-white mb-2">Tournament Rules</h3>
                          <p className="text-gray-300">Important guidelines for all participants</p>
                        </div>
                      </div>
                      
                      <div className="bg-black/30 rounded-xl p-8 border border-red-500/20">
                        <div className="prose prose-invert max-w-none">
                          <div className="text-gray-200 text-lg leading-relaxed whitespace-pre-line">
                            {tournament.rules || `📋 Tournament Rules

🎯 General Guidelines:
• All participants must follow fair play rules
• No cheating, hacking, or exploiting allowed
• Respect all players and organizers
• Use only approved devices and software

⏰ Match Rules:
• Be present 15 minutes before match time
• Late arrivals may result in disqualification
• Match settings will be announced beforehand
• Screenshots required for dispute resolution

🏆 Prize Distribution:
• Winners will be announced after verification
• Prize money will be distributed within 7 days
• Valid ID proof required for prize claim
• Organizers' decision is final in all disputes

📱 Communication:
• Join our official Discord/WhatsApp group
• Check announcements regularly
• Contact support for any queries

⚠️ Violations may lead to immediate disqualification.`}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="schedule" className="mt-6">
                  <Card className="bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-blue-900/30 border-indigo-500/30 backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-blue-600/5" />
                    <CardContent className="relative p-8">
                      <div className="flex items-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mr-6 shadow-lg">
                          <Clock className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-white mb-2">Tournament Schedule</h3>
                          <p className="text-gray-300">Complete timeline and match schedule</p>
                        </div>
                      </div>
                      
                      <div className="bg-black/30 rounded-xl p-8 border border-indigo-500/20">
                        <div className="space-y-6">
                          {tournament.schedule ? (
                            <div className="text-gray-200 text-lg leading-relaxed whitespace-pre-line">
                              {tournament.schedule}
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-indigo-600/20 to-blue-600/20 rounded-lg border-l-4 border-indigo-400">
                                <div className="w-3 h-3 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                  <h4 className="text-indigo-300 font-semibold text-lg mb-2">Registration Phase</h4>
                                  <p className="text-gray-300">Open registration for all participants</p>
                                  <span className="text-sm text-indigo-400">{new Date(tournament.start_date).toLocaleDateString()}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border-l-4 border-purple-400">
                                <div className="w-3 h-3 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                  <h4 className="text-purple-300 font-semibold text-lg mb-2">Qualification Rounds</h4>
                                  <p className="text-gray-300">Initial screening and team formation</p>
                                  <span className="text-sm text-purple-400">Day 1-2</span>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg border-l-4 border-blue-400">
                                <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                  <h4 className="text-blue-300 font-semibold text-lg mb-2">Semi-Finals</h4>
                                  <p className="text-gray-300">Top teams compete for final spots</p>
                                  <span className="text-sm text-blue-400">Day 3</span>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg border-l-4 border-yellow-400">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                  <h4 className="text-yellow-300 font-semibold text-lg mb-2">Grand Finals</h4>
                                  <p className="text-gray-300">Ultimate showdown for the championship</p>
                                  <span className="text-sm text-yellow-400">{new Date(tournament.end_date).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="prizes" className="mt-6">
                  <div className="space-y-6">
                    <PrizeDistribution prizesContent={tournament.prizes_content} />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Winners Announcement for Completed Tournaments */}
              {(tournament.status === 'completed' || tournament.status === 'ongoing') && (tournament as any)?.winners && (
                <div className="mt-8">
                  {/* Celebration Banner */}
                  <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 p-1 rounded-xl mb-6 shadow-2xl">
                    <Card className="bg-gray-900 border-0 rounded-lg overflow-hidden">
                      <CardContent className="p-0">
                        {/* Header Section */}
                        <div className="bg-gradient-to-br from-yellow-500/30 via-orange-500/30 to-red-500/30 p-8 text-center relative overflow-hidden">
                          {/* Animated background elements */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_hsl(45,100%,70%,0.1)_0%,_transparent_50%)]" />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_hsl(25,100%,60%,0.1)_0%,_transparent_50%)]" />
                          
                          <div className="relative z-10">
                            {/* Trophy Icon */}
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 shadow-xl animate-bounce">
                              <Trophy className="w-10 h-10 text-white drop-shadow-lg" />
                            </div>
                            
                            {/* Title */}
                            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                              🏆 TOURNAMENT CHAMPIONS 🏆
                            </h2>
                            
                            {/* Subtitle */}
                            <p className="text-xl text-yellow-200 font-semibold mb-2">
                              {tournament.name}
                            </p>
                            
                            {/* Decorative line */}
                            <div className="flex justify-center mb-4">
                              <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full shadow-lg" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Winners Content */}
                        <div className="p-8 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
                          <div className="bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 rounded-xl p-6 border-2 border-yellow-400/40 shadow-inner">
                            <div className="text-center mb-6">
                              <h3 className="text-2xl font-bold text-yellow-300 mb-2">🥇 Winners List 🥇</h3>
                            </div>
                            
                            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-yellow-400/50 shadow-lg">
                              <div className="text-white text-xl leading-loose whitespace-pre-wrap font-semibold text-center">
                                {(tournament as any).winners}
                              </div>
                            </div>
                            
                            {/* Celebration Footer */}
                            <div className="text-center mt-8 space-y-2">
                              <p className="text-2xl font-bold text-yellow-300">
                                🎉 CONGRATULATIONS! 🎉
                              </p>
                              <p className="text-lg text-orange-200 font-medium">
                                Amazing performance by our champions!
                              </p>
                              <div className="flex justify-center space-x-4 mt-4 text-2xl">
                                <span>🏆</span>
                                <span>🥇</span>
                                <span>🎊</span>
                                <span>🔥</span>
                                <span>⭐</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Debug Info - Remove after testing */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-4 bg-gray-800 rounded text-white text-sm">
                  <p>Debug Info:</p>
                  <p>Status: {tournament.status}</p>
                  <p>Winners: {(tournament as any)?.winners || 'No winners data'}</p>
                  <p>Show winners: {((tournament.status === 'completed' || tournament.status === 'ongoing') && (tournament as any)?.winners) ? 'YES' : 'NO'}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6 animate-fade-in animation-delay-500">
              <Card className="bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-indigo-900/40 border-blue-500/30 backdrop-blur-sm shadow-xl relative overflow-hidden hover-scale">
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
                <CardContent className="p-6 relative z-10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center drop-shadow-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3 shadow-lg animate-pulse">
                      <Clock className="w-4 h-4 text-white drop-shadow-sm" />
                    </div>
                    Tournament Format
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                      <span className="text-blue-200 font-semibold text-sm">Format:</span>
                      <span className="text-white font-bold drop-shadow-sm">{tournament.format || 'Battle Royale'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
                      <span className="text-green-200 font-semibold text-sm">Entry Fee:</span>
                      <span className="text-white font-bold drop-shadow-sm">{tournament.entry_fee || '₹10'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                      <span className="text-purple-200 font-semibold text-sm">Team Size:</span>
                      <span className="text-white font-bold drop-shadow-sm">{tournament.team_size || 'Solo'}</span>
                    </div>
                    {tournament.start_time && tournament.end_time && (
                      <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
                        <span className="text-orange-200 font-semibold text-sm">Time:</span>
                        <span className="text-white font-bold drop-shadow-sm">{tournament.start_time} - {tournament.end_time}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/40 via-blue-900/30 to-teal-900/40 border-green-500/30 backdrop-blur-sm shadow-xl relative overflow-hidden hover-scale">
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
                <CardContent className="p-6 relative z-10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center drop-shadow-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-teal-500 rounded-full flex items-center justify-center mr-3 shadow-lg animate-pulse">
                      <Clock className="w-4 h-4 text-white drop-shadow-sm" />
                    </div>
                    Timeline
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-black/20 rounded-lg border-l-4 border-blue-400 transform hover:translate-x-2 transition-transform duration-200">
                      <p className="text-white font-bold text-base mb-1 drop-shadow-sm">Registration Opens</p>
                      <p className="text-blue-200 font-medium">
                        {tournament.registration_opens ? 
                          new Date(tournament.registration_opens).toLocaleDateString() : 
                          new Date(tournament.start_date).toLocaleDateString()
                        }
                      </p>
                    </div>
                    <div className="p-4 bg-black/20 rounded-lg border-l-4 border-yellow-400 transform hover:translate-x-2 transition-transform duration-200">
                      <p className="text-white font-bold text-base mb-1 drop-shadow-sm">Registration Closes</p>
                      <p className="text-yellow-200 font-medium">
                        {tournament.registration_closes ? 
                          new Date(tournament.registration_closes).toLocaleDateString() : 
                          new Date(tournament.start_date).toLocaleDateString()
                        }
                      </p>
                    </div>
                    <div className="p-4 bg-black/20 rounded-lg border-l-4 border-green-400 transform hover:translate-x-2 transition-transform duration-200">
                      <p className="text-white font-bold text-base mb-1 drop-shadow-sm">Tournament Starts</p>
                      <p className="text-green-200 font-medium">
                        {new Date(tournament.start_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Sponsors Section */}
        <SponsorsSection className="bg-gray-900/50" />
      </div>
    </Layout>
  );
};

export default TournamentDetail;