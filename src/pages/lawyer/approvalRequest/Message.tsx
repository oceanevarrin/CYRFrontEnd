import React from 'react';

interface Props {
    msg: string;
}

const Message = (props: Props) => {
  return (
    <div className='alert alert-info alert-dismissible fade show' role='alert'>
      {props.msg}
      <button
        type='button'
        className='close'
        data-dismiss='alert'
        aria-label='Close'
      >
        <span aria-hidden='true'>&times;</span>
      </button>
    </div>
  );
};

export default Message;