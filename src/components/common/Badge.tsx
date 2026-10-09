import React from 'react';
import { BookingStatus, VerificationStatus } from '../../types';

interface StatusBadgeProps {
  status: BookingStatus | VerificationStatus | 'active' | 'suspended' | string;
  type?: 'booking' | 'verification' | 'general';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let colorStyle = 'bg-slate-800 text-slate-300 border-slate-700';

  switch (status) {
    case 'CONFIRMED':
    case 'COMPLETED':
    case 'approved':
    case 'active':
      colorStyle = 'bg-[#A3E635]/10 text-[#A3E635] border-[#A3E635]/30';
      break;
    case 'PENDING':
    case 'PAYMENT_PENDING':
    case 'pending':
      colorStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      break;
    case 'ACCEPTED':
      colorStyle = 'bg-[#22D3EE]/10 text-[#22D3EE] border-[#22D3EE]/30';
      break;
    case 'DECLINED':
    case 'CANCELLED':
    case 'rejected':
    case 'suspended':
      colorStyle = 'bg-red-500/10 text-red-400 border-red-500/30';
      break;
    case 'REFUNDED':
    case 'REFUND_PENDING':
      colorStyle = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border ${colorStyle}`}
    >
      {status}
    </span>
  );
};
