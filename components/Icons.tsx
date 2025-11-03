
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
export const UserPlusIcon = () => <svg {...iconProps}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>;
export const UploadCloudIcon = () => <svg {...iconProps} className="w-10 h-10 mx-auto text-slate-400"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><path d="M18 8V2a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2.5"/><path d="M16 16l-4-4-4 4"/><path d="M12 12v9"/><path d="M22 12c-2.5 0-4.5-2-4.5-4.5S19.5 3 22 3"/></svg>;
export const PackageIcon = () => <svg {...iconProps}><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v2" /><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5" /><path d="m3.5 10 17 0" /><polyline points="12 22 12 10 3.5 14 20.5 14 12 22" /></svg>;
export const LinkIcon = () => <svg {...iconProps}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>;
export const CopyIcon = () => <svg {...iconProps}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>;
export const CheckIcon = () => <svg {...iconProps}><polyline points="20 6 9 17 4 12"></polyline></svg>;
export const EditIcon = () => <svg {...iconProps}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
