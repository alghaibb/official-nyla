import React from 'react'

import classes from './index.module.scss'

export const LoadingSpinner: React.FC = () => {
  return (
    <div className={classes.loadingSpinner}>
      <div className={classes.spinner}></div>
    </div>
  )
}

export default LoadingSpinner
