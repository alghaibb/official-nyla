import React from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'

import classes from './index.module.scss'

type Props = {
  name: string
  label: string
  register: UseFormRegister<FieldValues & any>
  required?: boolean
  error?: any
  type?: 'text'
  validate?: (value: string) => boolean | string
  disabled?: boolean
}

export const Textarea: React.FC<Props> = ({ name, label, required, register, error, disabled }) => {
  return (
    <div className={classes.textareaWrap}>
      <label htmlFor={name} className={classes.label}>
        {label}
        {required ? <span className={classes.asterisk}>&nbsp;*</span> : ''}
      </label>
      <textarea
        id={name}
        name={name}
        {...register(name, { required })}
        className={[classes.textarea, error && classes.error].filter(Boolean).join(' ')}
        disabled={disabled}
        rows={4}
      ></textarea>
      {error && (
        <div className={classes.errorMessage}>
          {!error?.message && error?.type === 'required'
            ? 'This field is required'
            : error?.message}
        </div>
      )}
    </div>
  )
}
