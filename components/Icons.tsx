import React from 'react';

const iconProps = {
  className: "w-6 h-6",
  strokeWidth: "1.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor"
};

export const HomeIcon = () => <svg {...iconProps}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
export const UsersIcon = () => <svg {...iconProps}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
export const MegaphoneIcon = () => <svg {...iconProps}><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>;
export const BeakerIcon = () => <svg {...iconProps}><path d="M4.5 3h15" /><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" /><path d="M6 14h12" /></svg>;
export const BellIcon = () => <svg {...iconProps}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>;
export const SparklesIcon = () => <svg {...iconProps}><path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9z" /></svg>;
export const SendIcon = () => <svg {...iconProps} strokeWidth="2" ><path d="m22 2-7 20-4-9-9-4Z"/><path d="m22 2-11 11"/></svg>;
export const LoaderIcon = () => <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.99988V5.99988M12 18V21M4.92969 4.92969L7.04969 7.04969M16.9502 16.9502L19.0702 19.0702M2.99988 12H5.99988M18 12H21M4.92969 19.0702L7.04969 16.9502M16.9502 7.04969L19.0702 4.92969" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
export const TrashIcon = () => <svg {...iconProps}><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>;
export const PlusIcon = () => <svg {...iconProps} className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
export const XIcon = () => <svg {...iconProps}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
export const WhatsappIcon = () => <svg {...iconProps}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;