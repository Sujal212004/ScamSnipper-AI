import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Check, AlertTriangle, ExternalLink, Info } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Check name
    if (!formState.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Check email
    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formState.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    // Check subject
    if (!formState.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    // Check message
    if (!formState.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formState.message.trim().length < 10) {
      newErrors.message = 'Message is too short (minimum 10 characters)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Submit form
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent-900 via-accent-800 to-accent-900 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-accent-100 mb-8">
              Have questions, feedback, or want to report a scam? We're here to help.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
                
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="rounded-full p-2 bg-accent-100">
                        <Mail className="h-6 w-6 text-accent-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Email</h3>
                      <p className="mt-1 text-gray-600">support@scamsnipper.ai</p>
                      <p className="mt-1 text-sm text-gray-500">For general inquiries and support</p>
                    </div>
                  </div>
                  
                  {/* Phone */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="rounded-full p-2 bg-primary-100">
                        <Phone className="h-6 w-6 text-primary-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                      <p className="mt-1 text-gray-600">+91 9144XXXXXX</p>
                      <p className="mt-1 text-sm text-gray-500">Mon-Fri, 9am-5pm IST</p>
                    </div>
                  </div>
                  
                  {/* Address */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="rounded-full p-2 bg-secondary-100">
                        <MapPin className="h-6 w-6 text-secondary-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Office</h3>
                      <p className="mt-1 text-gray-600">
                        Anand Nagar <br />
                        TIT COLLEGE <br />
                        Bhopal- 462001
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Social Links */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Facebook</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-gray-500">
                      <span className="sr-only">LinkedIn</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
              
              {/* Report a Scam Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8"
              >
                <Card
                  title="Report a Scam"
                  icon={<AlertTriangle className="h-5 w-5 text-warning-500" />}
                  className="bg-warning-50 border border-warning-200"
                >
                  <p className="text-gray-700 mb-4">
                    Have you encountered a scam? Report it directly to help protect others in the community.
                  </p>
                  <Button 
                    variant="warning" 
                    fullWidth
                    className="flex items-center justify-center"
                    onClick={() => window.location.href = '/scanner'}
                  >
                    Report a Scam
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Card>
              </motion.div>
            </div>
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                
                {submitSuccess ? (
                  <div className="p-4 bg-success-50 border border-success-200 rounded-md mb-6">
                    <div className="flex">
                      <Check className="h-5 w-5 text-success-500 mr-2" />
                      <div>
                        <p className="text-success-700 font-medium">Message Sent Successfully!</p>
                        <p className="text-sm text-success-600 mt-1">
                          Thank you for reaching out. We'll get back to you as soon as possible.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border ${errors.name ? 'border-danger-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-danger-600">{errors.name}</p>
                        )}
                      </div>
                      
                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border ${errors.email ? 'border-danger-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-danger-600">{errors.email}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Subject */}
                    <div className="mb-6">
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.subject ? 'border-danger-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                      />
                      {errors.subject && (
                        <p className="mt-1 text-sm text-danger-600">{errors.subject}</p>
                      )}
                    </div>
                    
                    {/* Message */}
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formState.message}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.message ? 'border-danger-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                      ></textarea>
                      {errors.message && (
                        <p className="mt-1 text-sm text-danger-600">{errors.message}</p>
                      )}
                    </div>
                    
                    {/* Privacy Notice */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-md">
                      <div className="flex">
                        <Info className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-sm text-gray-500">
                          By submitting this form, you agree to our{' '}
                          <a href="#" className="text-primary-600 hover:text-primary-800">
                            Privacy Policy
                          </a>{' '}
                          and consent to be contacted regarding your inquiry.
                        </p>
                      </div>
                    </div>
                    
                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      loading={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
                    </Button>
                  </form>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find quick answers to common questions about ScamSnipper AI.
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {/* FAQ Item 1 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  How quickly can I expect a response to my inquiry?
                </h3>
                <p className="text-gray-600">
                  We typically respond to all inquiries within 24-48 business hours. For urgent matters related to active scams, 
                  we prioritize responses and aim to get back to you as quickly as possible.
                </p>
              </Card>
            </motion.div>
            
            {/* FAQ Item 2 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  I've found a bug or have a feature suggestion. How can I report it?
                </h3>
                <p className="text-gray-600">
                  We appreciate your feedback! You can use the contact form above to report bugs or suggest features. 
                  Please include as much detail as possible, including any screenshots or steps to reproduce the issue.
                </p>
              </Card>
            </motion.div>
            
            {/* FAQ Item 3 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Does ScamSnipper AI offer enterprise solutions for businesses?
                </h3>
                <p className="text-gray-600">
                  Yes, we offer enterprise-level solutions for businesses looking to protect their employees and customers from scams. 
                  Please contact our sales team at enterprise@scamsnipper.ai for more information on custom integrations and bulk licensing.
                </p>
              </Card>
            </motion.div>
            
            {/* FAQ Item 4 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  I've been scammed. Can ScamSnipper AI help me recover my losses?
                </h3>
                <p className="text-gray-600">
                  While ScamSnipper AI is primarily a preventative tool, we can provide guidance on steps to take after being scammed. 
                  We recommend reporting the scam through our platform and contacting relevant authorities such as your local police, 
                  the FBI's Internet Crime Complaint Center (IC3), and the FTC.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;