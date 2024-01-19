import React, { HTMLProps, forwardRef } from 'react';

type Props = HTMLProps<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { label, className, ...rest } = props;

  return (
    <label className="form-control w-full max-w-full">
      <div className="label">
        {label && <span className="label-text text-gray-300">{label}</span>}
      </div>
      <input
        type="text"
        ref={ref}
        {...rest}
        className={`input input-bordered w-full max-w-full bg-slate-700 ${className}`}
      />
    </label>
  );
});

Input.displayName = 'Input';
export default Input;
