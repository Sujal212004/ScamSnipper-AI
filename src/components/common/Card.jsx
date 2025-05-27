import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  title,
  subtitle,
  icon,
  variant = 'default',
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerContent,
  onClick,
  ...props
}) => {
  // Card variant classes
  const variantClasses = {
    default: 'bg-white border border-gray-200 hover:shadow-lg',
    primary: 'bg-primary-50 border border-primary-200 hover:shadow-lg',
    warning: 'bg-warning-50 border border-warning-200 hover:shadow-lg',
    danger: 'bg-danger-50 border border-danger-200 hover:shadow-lg',
    success: 'bg-success-50 border border-success-200 hover:shadow-lg'
  };

  // Base card classes
  const baseClasses = 'rounded-lg shadow-sm overflow-hidden transition-all duration-300';
  
  // Combined classes
  const cardClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${onClick ? 'cursor-pointer transform hover:-translate-y-1' : ''}
    ${className}
  `;

  return (
    <motion.div 
      className={cardClasses} 
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {(title || icon) && (
        <div className={`px-4 py-3 border-b border-gray-200 ${headerClassName}`}>
          <div className="flex items-center">
            {icon && (
              <motion.div 
                className="mr-3 flex-shrink-0"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {icon}
              </motion.div>
            )}
            <div>
              {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
      
      <div className={`px-4 py-4 ${bodyClassName}`}>
        {children}
      </div>
      
      {footerContent && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          {footerContent}
        </div>
      )}
    </motion.div>
  );
};

export default Card;