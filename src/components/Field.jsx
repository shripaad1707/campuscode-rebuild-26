import { useState } from 'react';

// Labelled input with an inline error and an optional show/hide toggle for passwords.
export default function Field({ label, error, type = 'text', hint, right, ...input }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <label className={`field ${error ? 'field--error' : ''}`}>
      <span className="field__label label">
        {label}
        {hint && <em>{hint}</em>}
      </span>
      <span className="field__box">
        <input type={isPassword && show ? 'text' : type} {...input} aria-invalid={!!error} />
        {isPassword && (
          <button type="button" className="field__toggle label" onClick={() => setShow(s => !s)}>
            {show ? 'Hide' : 'Show'}
          </button>
        )}
        {right}
      </span>
      {error && <span className="field__error">{error}</span>}
    </label>
  );
}
