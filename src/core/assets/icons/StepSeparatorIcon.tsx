import React from 'react';

interface StepSeparatorIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const StepSeparatorIcon: React.FC<StepSeparatorIconProps> = ({
  className,
  stroke = 'currentColor',
  ...props
}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="1"
      viewBox="0 0 24 1"
      fill="none"
      {...props}
    >
      <path d="M0 0.5H24" stroke={stroke} />
    </svg>
  );
};
