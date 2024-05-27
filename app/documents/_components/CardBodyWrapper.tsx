import React from 'react';

const CardBodyWrapper = ({ body, note }) => {
  return (
    <div className="flex items-center justify-center">
      <div>
        <p className="font-semibold text-sm mx-2">{body}</p>
        <p className="text-[0.6rem] mt-2 text-danger font-bold" dangerouslySetInnerHTML={{ __html: note }}></p>
      </div>
    </div>
  );
};

export default CardBodyWrapper;
