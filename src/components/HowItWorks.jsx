import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Brain, 
  MapPin, 
  Shield, 
  Users,
  ArrowRight
} from 'lucide-react';
import Card from './common/Card';

const HowItWorks = () => {
  const steps = [
    {
      icon: <AlertTriangle className="h-8 w-8 text-warning-500" />,
      title: "Report Scams",
      description: "Users report suspicious activities across multiple channels - web, voice, SMS, and images."
    },
    {
      icon: <Brain className="h-8 w-8 text-primary-500" />,
      title: "AI Analysis",
      description: "Our advanced AI analyzes the data in real-time to detect patterns and identify threats."
    },
    {
      icon: <MapPin className="h-8 w-8 text-danger-500" />,
      title: "Map Updates",
      description: "The scam heatmap updates instantly to show threat hotspots in your area."
    },
    {
      icon: <Shield className="h-8 w-8 text-success-500" />,
      title: "Local Protection",
      description: "AI model evolves locally to provide personalized protection while maintaining privacy."
    },
    {
      icon: <Users className="h-8 w-8 text-accent-500" />,
      title: "Community Safety",
      description: "Users stay protected through shared knowledge and real-time alerts."
    }
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-4">
            How ScamSnipper AI Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Our advanced AI-powered platform protects you through a seamless, privacy-focused process
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full dark:bg-dark-card dark:border-dark-border">
                  <div className="flex flex-col items-center text-center">
                    <div className="rounded-full p-4 bg-gray-100 dark:bg-dark-bg mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-gray-400 dark:text-gray-600" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            ScamSnipper AI continuously learns and adapts to new threats while keeping your data private and secure. 
            All analysis happens locally on your device.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;