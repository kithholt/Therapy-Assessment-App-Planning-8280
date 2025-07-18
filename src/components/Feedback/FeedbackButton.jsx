import React, { useState } from 'react';
import { FeedbackWorkflow } from '@questlabs/react-sdk';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import questConfig from '../../config/questConfig';

const { FiMessageSquare } = FiIcons;

const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        style={{ background: questConfig.PRIMARY_COLOR }}
        className="flex gap-1 rounded-l-md rounded-r-none justify-end items-center px-3 text-14 leading-5 font-semibold py-2 text-white z-50 fixed top-[50%] right-0 -translate-y-1/2 transition-all h-9"
      >
        <SafeIcon icon={FiMessageSquare} className="text-xl text-white" />
        <span className="text-white text-sm font-medium leading-none">Feedback</span>
      </button>

      {isOpen && (
        <FeedbackWorkflow
          uniqueUserId={localStorage.getItem('userId') || questConfig.USER_ID}
          questId={questConfig.QUEST_FEEDBACK_QUESTID}
          isOpen={isOpen}
          accent={questConfig.PRIMARY_COLOR}
          onClose={() => setIsOpen(false)}
        >
          <FeedbackWorkflow.ThankYou />
        </FeedbackWorkflow>
      )}
    </>
  );
};

export default FeedbackButton;