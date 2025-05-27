import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Award, Shield, Search, User, CheckCircle, Download } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { calculateLevel } from '../utils/helpers';
import { generateLeaderboardReport } from '../services/reportGenerator';
import { toast } from 'react-toastify';

const Leaderboard = () => {
  const { currentUser } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [timeRange, setTimeRange] = useState('all');
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Generate demo leaderboard data
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate some random users for the leaderboard
      const generateUsers = () => {
        const users = [];
        const names = [
          'Alex Smith', 'Taylor Johnson', 'Jamie Williams', 'Jordan Brown', 
          'Casey Davis', 'Riley Miller', 'Avery Wilson', 'Morgan Moore', 
          'Cameron Taylor', 'Drew Anderson', 'Sam Thomas', 'Robin Martinez'
        ];
        
        // Add current user if authenticated
        if (currentUser) {
          users.push({
            id: currentUser.uid,
            name: currentUser.name || currentUser.email.split('@')[0],
            points: currentUser.points || 0,
            level: calculateLevel(currentUser.points || 0),
            badges: currentUser.badges || [],
            reportsSubmitted: currentUser.reportsSubmitted || 0,
            isCurrentUser: true
          });
        }
        
        // Add random users
        for (let i = 0; i < 15; i++) {
          const points = Math.floor(Math.random() * 1000) + 50;
          users.push({
            id: `user-${i}`,
            name: names[i % names.length],
            points,
            level: calculateLevel(points),
            badges: Math.floor(Math.random() * 6) + 1,
            reportsSubmitted: Math.floor(Math.random() * 30) + 1,
            isCurrentUser: false
          });
        }
        
        // Sort by points (descending)
        users.sort((a, b) => b.points - a.points);
        
        // Add rank
        return users.map((user, index) => ({
          ...user,
          rank: index + 1
        }));
      };
      
      setLeaderboardData(generateUsers());
      setLoading(false);
    }, 1000);
  }, [currentUser]);
  
  // Filter users based on search input
  const filteredUsers = leaderboardData.filter(user => 
    user.name.toLowerCase().includes(filter.toLowerCase())
  );
  
  // Find current user's rank
  const currentUserRank = leaderboardData.findIndex(user => user.isCurrentUser) + 1;

  // Handle PDF download
  const handleDownloadReport = () => {
    try {
      const pdf = generateLeaderboardReport(filteredUsers, currentUser);
      pdf.save('scamsniper-leaderboard-report.pdf');
      toast.success('Leaderboard report downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate report. Please try again.');
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Leaderboard</h1>
            <p className="text-gray-600 mt-2">
              Join forces with fellow guardians in the fight against scams. Every report, every scan, 
              every prevention counts towards your legacy as a ScamSnipper legend.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleDownloadReport}
            icon={<Download className="h-4 w-4" />}
          >
            Download Report
          </Button>
        </div>
      </motion.div>
      
      {/* Stats Cards */}
      {currentUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {/* Rank Card */}
          <Card className="bg-primary-50 border border-primary-100">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-primary-100">
                <Trophy className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-primary-700">Your Rank</p>
                <p className="text-3xl font-bold text-primary-900">
                  {currentUserRank > 0 ? `#${currentUserRank}` : '-'}
                </p>
              </div>
            </div>
          </Card>
          
          {/* Points Card */}
          <Card className="bg-secondary-50 border border-secondary-100">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-secondary-100">
                <Award className="h-8 w-8 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-secondary-700">Your Points</p>
                <p className="text-3xl font-bold text-secondary-900">
                  {currentUser.points || 0}
                </p>
              </div>
            </div>
          </Card>
          
          {/* Level Card */}
          <Card className="bg-accent-50 border border-accent-100">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-accent-100">
                <Shield className="h-8 w-8 text-accent-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-accent-700">Your Level</p>
                <p className="text-3xl font-bold text-accent-900">
                  {calculateLevel(currentUser.points || 0)}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
      
      {/* Leaderboard */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
            Top Scam Fighters
          </h2>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            {/* Time range filter */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            
            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search users..."
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mx-auto mb-4"
            >
              <Trophy className="h-12 w-12 text-primary-500" />
            </motion.div>
            <p className="text-gray-600">Loading leaderboard...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reports
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Badges
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={user.isCurrentUser ? "bg-primary-50" : ""}
                  >
                    {/* Rank */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.rank <= 3 ? (
                          <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
                            user.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                            user.rank === 2 ? 'bg-gray-100 text-gray-600' :
                            'bg-amber-100 text-amber-600'
                          }`}>
                            <Trophy className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="text-gray-900 font-medium">
                            #{user.rank}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* User */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          {user.isCurrentUser && (
                            <div className="text-xs text-primary-600 flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              You
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {/* Level */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Level {user.level}</div>
                    </td>
                    
                    {/* Points */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.points}</div>
                    </td>
                    
                    {/* Reports */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.reportsSubmitted}</div>
                    </td>
                    
                    {/* Badges */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {Array.isArray(user.badges) ? (
                        <div className="flex -space-x-1">
                          {user.badges.slice(0, 3).map((badge, index) => (
                            <div key={index} className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center text-xs">
                              {badge.icon}
                            </div>
                          ))}
                          {user.badges.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                              +{user.badges.length - 3}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-900">{user.badges}</div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Users Found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </Card>
      
      {/* How to Earn Points */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card
          title="How to Earn Points"
          icon={<Award className="h-5 w-5 text-primary-600" />}
        >
          <p className="text-sm text-gray-600 mb-4">
            Here's how you can earn points and climb the leaderboard:
          </p>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                  <Search className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-sm text-gray-700">Complete a URL Scan</span>
              </div>
              <span className="text-sm font-medium text-primary-600">+10 points</span>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                  <Shield className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-sm text-gray-700">Report a Scam</span>
              </div>
              <span className="text-sm font-medium text-primary-600">+25 points</span>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                  <Trophy className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-sm text-gray-700">Earn a Badge</span>
              </div>
              <span className="text-sm font-medium text-primary-600">+25-100 points</span>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                  <Users className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-sm text-gray-700">Refer a Friend</span>
              </div>
              <span className="text-sm font-medium text-primary-600">+50 points</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              fullWidth
              onClick={() => window.location.href = '/scanner'}
            >
              Start Earning Points
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Leaderboard;