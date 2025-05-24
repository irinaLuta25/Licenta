import React from 'react';
import { useEffect, useRef, useState } from "react";
import { getQuestionsByEventId, getQuestionsByTherapySessionId } from "../features/question/questionSlice"
import { getAllAnswersByQuestionId } from "../features/answer/answerSlice";
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FeedbackModal = ({ onClose, session }) => {
    const modalRef = useRef();
    const dispatch = useDispatch();
  
    const questions = useSelector((state) => state.question.list);
    const answers = useSelector((state) => state.answer?.list || []);
  
    const [expandedIndex, setExpandedIndex] = useState(null);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          onClose();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);
  
    useEffect(() => {
      if ((session?.type === "training" || session?.type === "workshop") && session?.id) {
        dispatch(getQuestionsByEventId(session.id));
      } else {
        dispatch(getQuestionsByTherapySessionId(session.id));
      }
    }, [dispatch, session]);
  
    const toggleAccordion = (index, questionId) => {
      const newIndex = index === expandedIndex ? null : index;
      setExpandedIndex(newIndex);
      if (newIndex !== null) {
        dispatch(getAllAnswersByQuestionId({ questionId }));
      }
    };
  
    const isTherapySession = !session?.type;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
        <div
          ref={modalRef}
          className="bg-white/30 backdrop-blur-xl border border-white/30 shadow-lg rounded-xl p-10 w-full max-w-3xl"
        >
          <h2 className="text-2xl font-bold text-indigo-800 mb-4">
            Feedback for{" "}
            {(session?.type === "training" || session?.type === "workshop")
              ? session?.name
              : "Therapy Session - " + session?.employee?.user?.firstName + " " + session?.employee?.user?.lastName}
          </h2>
          <p className="text-sm text-gray-700 mb-4">
            {session?.interval?.beginTime.slice(0, 5) + " - " + session?.interval?.endTime.slice(0, 5)}
          </p>
  
          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {questions.length === 0 ? (
              <p className="italic text-gray-600">No feedback questions available for this session.</p>
            ) : (
              questions.map((q, i) => (
                <div key={q.id} className="bg-white/60 rounded-lg shadow-md">
                  <button
                    onClick={() => toggleAccordion(i, q.id)}
                    className={`w-full flex justify-between items-center p-4 text-left font-medium text-indigo-800 rounded-lg ${expandedIndex !== i ? 'hover:bg-indigo-100' : ''}`}>

                    <span>Q: {q.text}</span>
                    {expandedIndex === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {expandedIndex === i && (
                    <div className="px-4 pb-4 space-y-2">
                      {answers.filter(a => !(isTherapySession && a.isAnonymous)).length === 0 ? (
                        <p className="text-sm text-gray-600 italic">No answers available yet.</p>
                      ) : (
                        answers
                          .filter(a => !(isTherapySession && a.isAnonymous))
                          .map((a, idx) => (
                            <div
                              key={idx}
                              className="bg-white/70 p-3 rounded-md border border-gray-200 shadow-sm overflow-x-auto max-w-full"
                            >
                              <p className="text-gray-900 text-sm break-words whitespace-pre-wrap">“{a.answer}”</p>
                              {!isTherapySession && (
  <p className="text-xs text-right text-gray-500 mt-1">
    — {a.isAnonymous ? "Anonymous" : a.employee.user.firstName + " " + a.employee.user.lastName}
  </p>
)}
                            </div>
                          ))
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
  
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default FeedbackModal;