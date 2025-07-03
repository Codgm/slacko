import React from 'react';

/**
 * 공통 Button 컴포넌트
 * @param {object} props
 * @param {'primary'|'secondary'|'outline'|'danger'} [props.variant]
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {React.ReactNode} [props.icon]
 * @param {boolean} [props.loading]
 * @param {boolean} [props.disabled]
 * @param {string} [props.ariaLabel]
 * @param {function} [props.onClick]
 * @param {string} [props.type]
 * @param {React.ReactNode} props.children
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  ariaLabel,
  onClick,
  ...rest
}) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    outline: 'bg-white border border-blue-600 text-blue-600 hover:bg-blue-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      className={[
        base,
        variants[variant],
        sizes[size],
        isDisabled ? 'opacity-60 cursor-not-allowed' : '',
      ].join(' ')}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : 0}
      disabled={isDisabled}
      {...rest}
    >
      {loading && (
        <svg className="animate-spin mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
} 