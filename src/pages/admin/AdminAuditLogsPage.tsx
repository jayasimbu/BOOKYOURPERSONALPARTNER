import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { AdminAuditLog } from '../../types';
import { FileText, Shield, Clock } from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);

  useEffect(() => {
    setLogs(ApiService.getAdminAuditLogs());
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <FileText className="w-6 h-6 text-[#22D3EE]" />
          <span>Administrative Audit Trail</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete log of privileged administrative actions, provider approvals, and policy enforcement.
        </p>
      </div>

      <div className="bg-[#151C2F] border border-[#232D48] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0B1020] border-b border-[#232D48] text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Admin</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Type</th>
                <th className="p-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232D48]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#1D2740]">
                  <td className="p-4 text-slate-400 font-mono text-[11px]">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-white">{log.admin_name}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-[#22D3EE]/10 text-[#22D3EE] font-mono font-bold text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{log.target_type}</td>
                  <td className="p-4 font-mono text-slate-400">{log.ip_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
