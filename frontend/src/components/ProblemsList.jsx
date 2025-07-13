import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProblemsByManager } from "../features/problem/problemSlice";

const ProblemsList = ({ managerId, selectedYear, onShowAll, showAll }) => {
  const dispatch = useDispatch();
  const { problemsList, loading, error } = useSelector((state) => state.problem);

  useEffect(() => {
    if (managerId) {
      dispatch(fetchProblemsByManager(managerId));
    }
  }, [dispatch, managerId]);


  if (error) return <p className="text-red-600">Eroare: {error}</p>;
  if (!problemsList.length) return <p>Nu există probleme raportate în departamentul tău.</p>;

  const filteredProblems = problemsList.filter(problem => {
    const problemYear = new Date(problem.createdAt).getFullYear();
    return problemYear === selectedYear;
  });

  const problemsToShow = showAll ? filteredProblems : filteredProblems.slice(0, 3);

  return (
    <>
      <ul>
        {problemsToShow.map((problem) => (
          <li key={problem.id} className="mb-4 border-b border-gray-300 pb-3 last:border-b-0 last:pb-0">
            <p className="mb-1 text-gray-800">
              {problem.isAnonymous ? (
                <em className="italic text-gray-600">Anonim:</em>
              ) : (
                <strong className="font-semibold text-gray-900">
                  {problem.employee?.user
                    ? `${problem.employee.user.firstName} ${problem.employee.user.lastName}`
                    : "Nume necunoscut"}
                </strong>
              )}
            </p>
            <p className="text-gray-700 mb-1">{problem.description}</p>
            <small className="text-gray-500 text-xs">{new Date(problem.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>

      {!showAll && filteredProblems.length > 3 && (
        <div className="text-center mt-4">
          <button
            onClick={onShowAll}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
          >
            Vezi toate
          </button>
        </div>
      )}
    </>
  );
};

export default ProblemsList;
