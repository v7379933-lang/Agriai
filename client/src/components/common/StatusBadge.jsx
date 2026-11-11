import React from 'react';

export function StatusBadge({ status, severity, label }) {
  const text = label || status || severity || 'Active';
  const val = String(text).toLowerCase();

  let colorClass = 'bg-slate-100 text-slate-700 border-slate-200';

  if (val.includes('high') || val.includes('severe') || val.includes('critical')) {
    colorClass = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (val.includes('med') || val.includes('warn') || val.includes('partly')) {
    colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (val.includes('low') || val.includes('active') || val.includes('completed') || val.includes('good') || val.includes('clear')) {
    colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (val.includes('rain') || val.includes('flood') || val.includes('water')) {
    colorClass = 'bg-sky-50 text-sky-700 border-sky-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}>
      {text}
    </span>
  );
}

