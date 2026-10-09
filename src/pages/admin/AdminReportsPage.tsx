import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { Report } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    setReports(ApiService.getReports());
  }, []);

  const handleResolve = (reportId: string, status: 'resolved' | 'dismissed') => {
    const updated = ApiService.resolveReport(reportId, status, 'Reviewed by operations administration.');
    setReports((prev) => prev.map((r) => (r.id === reportId ? updated : r)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
          <span>Safety Reports & Policy Complaints</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Investigate reported concerns, code of conduct violations, and non-sexual policy compliance.
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-12 text-center text-slate-400 text-xs">
          No open safety complaints or user reports.
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div
              key={r.id}
              className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-5 space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-white">Report #{r.id.slice(-6)}</span>
                  <StatusBadge status={r.status} />
                </div>

                <div className="text-xs text-slate-300">
                  Reporter: <strong className="text-white">{r.reporter_name}</strong> • Reported User: <strong className="text-red-400">{r.reported_user_name}</strong>
                </div>

                <p className="text-xs font-semibold text-amber-300">Reason: {r.reason}</p>
                {r.details && <p className="text-xs text-slate-400 italic bg-[#0B1020] p-2 rounded-xl border border-[#232D48]">"{r.details}"</p>}
              </div>

              {r.status === 'open' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleResolve(r.id, 'dismissed')}
                    className="px-3 py-1.5 rounded-xl bg-[#0B1020] text-slate-400 border border-[#232D48] text-xs font-bold hover:text-white"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => handleResolve(r.id, 'resolved')}
                    className="px-4 py-1.5 rounded-xl bg-[#A3E635] text-slate-950 font-bold text-xs hover:bg-[#84CC16]"
                  >
                    Mark Resolved
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
