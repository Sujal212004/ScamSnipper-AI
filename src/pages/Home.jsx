import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, Search, AlertTriangle, Smartphone, 
  Image as ImageIcon, MapPin, Mic, CheckCircle, ExternalLink
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import HowItWorks from '../components/HowItWorks';

const Home = () => {
  return (
    <div className="bg-white dark:bg-dark-bg">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg text-white">
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                Advanced AI Scam Detection & Protection
              </h1>
              <p className="text-lg sm:text-xl text-primary-100 dark:text-gray-300 mb-8 max-w-2xl">
                ScamSnipper AI uses cutting-edge technology to detect and prevent scams across 
                multiple channels - web, voice, SMS, and images - keeping you and your loved ones safe.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/signup">
                  <Button className="w-full sm:w-auto text-lg py-3 px-8 bg-white text-primary-800 dark:bg-dark-accent dark:text-white hover:bg-gray-100 dark:hover:bg-dark-highlight">
                    Get Started
                  </Button>
                </Link>
                <Link to="/scanner">
                  <Button variant="outline" className="w-full sm:w-auto text-lg py-3 px-8 border-white text-white hover:bg-white hover:bg-opacity-10 dark:border-dark-accent dark:hover:bg-dark-card">
                    Try Scanner
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:block"
            >
              <img 
                src="https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg" 
                alt="Cybersecurity Protection" 
                className="w-full rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />
      
      {/* Key Features */}
      <section className="py-16 bg-gray-50 dark:bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Comprehensive Protection</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform provides multi-channel scam detection using advanced AI and machine learning.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full dark:bg-dark-card">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full p-3 bg-primary-100 dark:bg-dark-highlight mb-4">
                    <Search className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">URL Scanner</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Verify websites and links for phishing attempts, malware, and other security threats.
                  </p>
                </div>
              </Card>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full dark:bg-dark-card">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full p-3 bg-secondary-100 dark:bg-dark-highlight mb-4">
                    <Mic className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Voice Detection</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Analyze phone calls in real-time to identify common scam phrases and tactics.
                  </p>
                </div>
              </Card>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full dark:bg-dark-card">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full p-3 bg-accent-100 dark:bg-dark-highlight mb-4">
                    <ImageIcon className="h-8 w-8 text-accent-600 dark:text-accent-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Image Scanner</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Detect fake logos and counterfeit branding in images using OCR technology.
                  </p>
                </div>
              </Card>
            </motion.div>
            
            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="h-full dark:bg-dark-card">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full p-3 bg-success-100 dark:bg-dark-highlight mb-4">
                    <Smartphone className="h-8 w-8 text-success-600 dark:text-success-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">SMS Alerts</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Receive timely notifications about new scams and threats in your area.
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Heatmap Section */}
      <section className="py-16 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Scam Activity Heatmap
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Our interactive heatmap shows scam activity in your area, helping you stay informed about 
                local threats and patterns. Track phishing attempts, voice scams, and more in real-time.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-success-500 dark:text-success-400 mt-0.5 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Visualize scam hotspots in your geographic area</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-success-500 dark:text-success-400 mt-0.5 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Filter by scam type, date range, and severity</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-success-500 dark:text-success-400 mt-0.5 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Contribute by reporting scams you encounter</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-success-500 dark:text-success-400 mt-0.5 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Receive alerts when new scams emerge near you</span>
                </li>
              </ul>
              <Link to="/heatmap">
                <Button className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Explore Heatmap
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-lg overflow-hidden shadow-xl"
            >
              <img 
                src="https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg" 
                alt="Scam Heatmap" 
                className="w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Statistics Section */}
      <section className="py-16 bg-primary-900 dark:bg-dark-card text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Protection by the Numbers</h2>
            <p className="text-xl text-primary-100 dark:text-gray-300 max-w-3xl mx-auto">
              ScamSniper AI has helped thousands of users stay safe from scammers.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-primary-800 dark:bg-dark-highlight rounded-lg p-6 text-center"
            >
              <div className="text-4xl font-bold mb-2">30,000+</div>
              <div className="text-primary-100 dark:text-gray-300">Scams Detected</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-primary-800 dark:bg-dark-highlight rounded-lg p-6 text-center"
            >
              <div className="text-4xl font-bold mb-2">15,000+</div>
              <div className="text-primary-100 dark:text-gray-300">Users Protected</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-primary-800 dark:bg-dark-highlight rounded-lg p-6 text-center"
            >
              <div className="text-4xl font-bold mb-2">98.7%</div>
              <div className="text-primary-100 dark:text-gray-300">Detection Rate</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-primary-800 dark:bg-dark-highlight rounded-lg p-6 text-center"
            >
              <div className="text-4xl font-bold mb-2">$5M+</div>
              <div className="text-primary-100 dark:text-gray-300">Potential Losses Prevented</div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Hear from people who have used ScamSnipper AI to protect themselves and their families.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full dark:bg-dark-card">
                <div className="flex flex-col h-full">
                  <div className="flex-grow">
                    <div className="flex text-warning-500 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      "The voice scam detector saved my mother from a Medicare scam. 
                      She had the caller on speaker while using the app, and it immediately 
                      flagged suspicious phrases. Thank you for this amazing tool!"
                    </p>
                  </div>
                  <div className="pt-4 mt-auto border-t border-gray-100 dark:border-dark-border">
                    <p className="font-medium text-gray-900 dark:text-white">Jennifer L.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Protected Family Member</p>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full dark:bg-dark-card">
                <div className="flex flex-col h-full">
                  <div className="flex-grow">
                    <div className="flex text-warning-500 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      "I work in IT security and recommend ScamSnipper to all my clients. 
                      The URL scanner has caught several sophisticated phishing attempts 
                      that even some enterprise solutions missed. Impressive technology!"
                    </p>
                  </div>
                  <div className="pt-4 mt-auto border-t border-gray-100 dark:border-dark-border">
                    <p className="font-medium text-gray-900 dark:text-white">Michael T.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">IT Security Consultant</p>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full dark:bg-dark-card">
                <div className="flex flex-col h-full">
                  <div className="flex-grow">
                    <div className="flex text-warning-500 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      "The scam heatmap feature is invaluable for our community outreach program. 
                      We use it to identify areas where seniors are being targeted and focus our 
                      educational workshops there. The SMS alerts keep everyone informed."
                    </p>
                  </div>
                  <div className="pt-4 mt-auto border-t border-gray-100 dark:border-dark-border">
                    <p className="font-medium text-gray-900 dark:text-white">Sarah K.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Community Organizer</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-accent-500 dark:bg-dark-card text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Start Protecting Yourself Today
            </h2>
            <p className="text-xl text-white text-opacity-90 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Join thousands of users who trust ScamSnipper AI to keep them safe from scams.
              Create your free account and get instant access to all features.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup">
                <Button className="w-full sm:w-auto text-lg py-3 px-8 bg-white text-accent-600 dark:bg-dark-accent dark:text-white hover:bg-gray-100 dark:hover:bg-dark-highlight">
                  Sign Up Free
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="w-full sm:w-auto text-lg py-3 px-8 border-white text-white hover:bg-white hover:bg-opacity-10 dark:border-dark-accent dark:hover:bg-dark-card">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Partners Section */}
      <section className="py-16 bg-gray-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Trusted Partners</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We work with leading security organizations to keep our threat database up-to-date.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="flex justify-center">
              <Shield className="h-16 w-16 text-gray-400 dark:text-gray-600" />
            </div>
            <div className="flex justify-center">
              <AlertTriangle className="h-16 w-16 text-gray-400 dark:text-gray-600" />
            </div>
            <div className="flex justify-center">
              <Search className="h-16 w-16 text-gray-400 dark:text-gray-600" />
            </div>
            <div className="flex justify-center">
              <Smartphone className="h-16 w-16 text-gray-400 dark:text-gray-600" />
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <a href="#" className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium">
              View all partners
              <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;