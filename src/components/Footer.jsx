import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Twitter, Facebook, Linkedin, Mail, ExternalLink, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary-400" />
              <span className="ml-2 text-xl font-bold">ScamSnipper AI</span>
            </div>
            <p className="mt-4 text-gray-300 max-w-md">
              Advanced AI-powered scam detection platform that helps protect you from phishing, voice scams, 
              and other fraudulent activities across multiple channels.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
              Features
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/scanner" className="text-gray-300 hover:text-white transition-colors">
                  Scam Scanner
                </Link>
              </li>
              <li>
                <Link to="/heatmap" className="text-gray-300 hover:text-white transition-colors">
                  Scam Heatmap
                </Link>
              </li>
              <li>
                <Link to="/voice-detector" className="text-gray-300 hover:text-white transition-colors">
                  Voice Scam Detection
                </Link>
              </li>
              <li>
                <Link to="/image-scan" className="text-gray-300 hover:text-white transition-colors">
                  Image Logo Scanner
                </Link>
              </li>
              <li>
                <Link to="/sms-alerts" className="text-gray-300 hover:text-white transition-colors">
                  SMS Alerts
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  Blog
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-400 text-sm text-center">
            &copy; {currentYear} ScamSnipper AI. All rights reserved.
          </p>
          <p className="text-center text-sm text-gray-400 flex items-center justify-center">
            Developed with <Heart className="h-8 w-8 text-red-700 mx-1 animate-pulse" /> by Sujal Pandey
          </p>
        </div>
      </div>
     
    </footer>
  );
};

export default Footer;