import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, Users, Clock, Award, 
  FileText, Brain, BookOpen, Target
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">
              About ScamSnipper AI
            </h1>
            <p className="text-xl text-secondary-100 mb-8">
              Our mission is to protect individuals and communities from scams through 
              innovation, education, and advanced technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Led by experts in frontend development and cybersecurity.
            </p>
          </motion.div>
          
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="max-w-md">
                <div className="flex flex-col items-center text-center">
                  <div className="h-32 w-32 rounded-full bg-gray-200 mb-4 overflow-hidden">
                    <div className="h-full w-full flex items-center justify-center">
                      <Users className="h-16 w-16 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">MR.Sujal Pandey</h3>
                  <p className="text-primary-600 mb-2">CEO ScamSnipper AI</p>
                  <p className="text-primary-600 mb-4">Frontend Specialist</p>
                  <p className="text-gray-600">
                    Expert frontend developer with a passion for creating secure and user-friendly applications.
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Join Our Mission to Fight Scams
            </h2>
            <p className="text-xl text-white text-opacity-90 max-w-3xl mx-auto mb-8">
              Whether you're looking to protect yourself, your family, or your community,
              ScamSnipper AI provides the tools you need to stay safe in today's digital world.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup">
                <Button className="w-full sm:w-auto text-lg py-3 px-8 bg-white text-primary-800 hover:bg-gray-100">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="w-full sm:w-auto text-lg py-3 px-8 border-white text-white hover:bg-white hover:bg-opacity-10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;