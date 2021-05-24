import React from 'react';

interface Props {
    percentage: number;
}

const Progress = ( props: Props ) => {
  return (
    <div className='progress'>
      <div
        className='progress-bar progress-bar-striped bg-success'
        role='progressbar'
        style={{ width: `${props.percentage}%` }}
      >
        {props.percentage}%
      </div>
    </div>
  );
};


export default Progress;