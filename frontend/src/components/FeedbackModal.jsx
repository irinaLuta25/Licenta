import React from 'react';
import { useEffect, useRef, useState } from "react";
import { getQuestionsByEventId, getQuestionsByTherapySessionId } from "../features/question/questionSlice"
import { getAllAnswersByQuestionId } from "../features/answer/answerSlice";
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";


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
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={modalRef}
          className="bg-white rounded-2xl p-10 w-full max-w-3xl shadow-xl relative space-y-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold text-indigo-800 mb-4">
            Feedback pentru{" "}
            {(session?.type === "training" || session?.type === "workshop")
              ? session?.name
              : "sesiunea de terapie - " + session?.employee?.user?.firstName + " " + session?.employee?.user?.lastName}
          </h2>
          <p className="text-md text-black mb-4">
            {"🕰️" + session?.interval?.beginTime.slice(0, 5) + " - " + session?.interval?.endTime.slice(0, 5)}
          </p>

          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {questions.length === 0 ? (
              <p className="italic text-gray-600">Nu există feedback.</p>
            ) : (
              questions.map((q, i) => (
                <div key={q.id} className="bg-[#e0e7ff] border-l-4 border-indigo-400 rounded-md shadow-sm">
                  <button
                    onClick={() => toggleAccordion(i, q.id)}
                    className={`w-full flex justify-between items-center p-4 text-left font-medium text-indigo-800 rounded-lg ${expandedIndex !== i ? 'hover:bg-gray-3  00' : ''}`}>

                    <span>{q.text}</span>
                    {expandedIndex === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {expandedIndex === i && (
                    <div className="px-4 pb-4 space-y-2">
                      {answers.filter(a => !(isTherapySession && a.isAnonymous)).length === 0 ? (
                        <p className="text-sm text-gray-600 italic">Nu există încă răspunsuri.</p>
                      ) : (
                        answers
                          .filter(a => !(isTherapySession && a.isAnonymous))
                          .map((a, idx) => (
                            <div
                              key={idx}
                              className="bg-white border border-indigo-100 p-3 rounded-md shadow-inner text-indigo-900"
                            >
                              <p className="text-gray-900 text-sm break-words whitespace-pre-wrap">“{a.answer}”</p>
                              {!isTherapySession && (
                                <p className="text-xs text-right text-gray-500 mt-1">
                                  — {a.isAnonymous ? "Anonim" : a.employee.user.firstName + " " + a.employee.user.lastName}
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

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeedbackModal;