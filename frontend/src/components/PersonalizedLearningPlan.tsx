import React, { useState } from 'react';
import { LearningPlanItem, OverallLearningRoadmap } from '../types/analysis';

interface PersonalizedLearningPlanProps {
  learningPlan: LearningPlanItem[];
  roadmap?: OverallLearningRoadmap;
}

export const PersonalizedLearningPlan: React.FC<PersonalizedLearningPlanProps> = ({
  learningPlan,
  roadmap,
}) => {
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0);

  if (!learningPlan || learningPlan.length === 0) {
    return (
      <section aria-labelledby="learning-plan-heading" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 id="learning-plan-heading" className="text-lg font-semibold text-slate-900 mb-2">
          Personalized Learning Plan
        </h2>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-900 text-sm">
          ✓ All key requirements are evidenced in your resume. No mandatory learning roadmap is needed!
        </div>
      </section>
    );
  }

  const currentItem = learningPlan[selectedSkillIndex] || learningPlan[0];

  return (
    <section aria-labelledby="learning-plan-heading" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 id="learning-plan-heading" className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Personalized Learning Plan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step practical curriculum to systematically close identified skill gaps
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
          {learningPlan.length} Target Skills
        </span>
      </div>

      {/* 4-Week Overall Timeline Roadmap */}
      {roadmap && roadmap.weeks && roadmap.weeks.length > 0 && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              4-Week Target Progression Roadmap
            </h3>
            <span className="text-[11px] text-teal-700 font-semibold">Self-Paced Guide</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {roadmap.weeks.map((weekItem, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3 space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {weekItem.week}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">0{idx + 1}</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-900 leading-snug">{weekItem.focus}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{weekItem.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Tabs Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {learningPlan.map((item, idx) => {
            const isSelected = idx === selectedSkillIndex;
            return (
              <button
                key={item.skill}
                type="button"
                onClick={() => setSelectedSkillIndex(idx)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-teal-800 text-white border-teal-800 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{item.skill}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                  isSelected ? 'bg-teal-900 text-teal-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.importance}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detailed Curriculum Card for Selected Skill */}
        {currentItem && (
          <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
                  Recommended Learning Order #{currentItem.recommended_order}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{currentItem.skill}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  ⏱ {currentItem.estimated_time}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {currentItem.importance} Skill
                </span>
              </div>
            </div>

            {/* Core Overview */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">What to Learn</h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {currentItem.what_to_learn}
              </p>
            </div>

            {/* Subtopics Checklist */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Important Subtopics (In Recommended Sequence)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentItem.subtopics.map((sub, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/50 text-xs text-slate-800"
                  >
                    <span className="text-teal-700 font-bold shrink-0">{sIdx + 1}.</span>
                    <span className="leading-snug">{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Practice & Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Beginner-friendly practice task */}
              <div className="p-4 rounded-lg bg-teal-50/60 border border-teal-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-teal-900 text-xs font-bold uppercase tracking-wider">
                  <svg className="w-4 h-4 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  Beginner-Friendly Practice Task
                </div>
                <p className="text-xs text-teal-950 leading-relaxed">
                  {currentItem.practice_task}
                </p>
              </div>

              {/* Small project idea */}
              <div className="p-4 rounded-lg bg-sky-50/60 border border-sky-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-sky-900 text-xs font-bold uppercase tracking-wider">
                  <svg className="w-4 h-4 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Small Project Idea
                </div>
                <p className="text-xs text-sky-950 leading-relaxed">
                  {currentItem.project_idea}
                </p>
              </div>
            </div>

            {/* How to demonstrate on resume */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                How to Demonstrate on Your Resume
              </span>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 flex items-start gap-2.5">
                <span className="text-teal-600 font-bold mt-0.5">📌</span>
                <div className="space-y-1">
                  <p className="font-mono text-slate-700 bg-white p-2 rounded border border-slate-200">
                    "{currentItem.resume_demonstration}"
                  </p>
                  <p className="text-[11px] text-slate-500 italic">
                    Add this evidence to your resume once you build the project, then click "Re-check My Resume" above.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
