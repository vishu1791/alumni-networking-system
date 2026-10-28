import React from 'react';
import { X, Mail, Phone, MapPin, Building2, Calendar, Award, Heart, CheckCircle2 } from 'lucide-react';

export default function AlumniDetailModal({ alumnus, onClose, onEdit }) {
  if (!alumnus) return null;

  const initials = alumnus.fullName
    ? alumnus.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'AL';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {initials}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{alumnus.fullName}</h3>
              <p className="text-xs font-semibold text-emerald-700">
                {alumnus.currentRole || 'Alumnus'} {alumnus.currentOrganisation ? `@ ${alumnus.currentOrganisation}` : ''}
              </p>
              <p className="text-xs text-slate-500">{alumnus.degree || 'B.E.'} - {alumnus.department} ({alumnus.graduationYear})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contact Info */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2 text-slate-700">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <a href={`mailto:${alumnus.email}`} className="truncate hover:text-emerald-700 font-medium">
              {alumnus.email}
            </a>
          </div>
          {alumnus.phone && (
            <div className="flex items-center space-x-2 text-slate-700">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{alumnus.phone}</span>
            </div>
          )}
          {alumnus.location && (
            <div className="flex items-center space-x-2 text-slate-700 col-span-full">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{alumnus.location}</span>
            </div>
          )}
        </div>

        {/* Bio */}
        {alumnus.bio && (
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">About</h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
              {alumnus.bio}
            </p>
          </div>
        )}

        {/* Skills */}
        {alumnus.skills && alumnus.skills.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Expertise & Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {alumnus.skills.map((s) => (
                <span
                  key={s.id || s.name}
                  className="text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-md"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {alumnus.interests && (
          <div className="flex items-start space-x-2 text-xs text-slate-600 pt-1">
            <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700">Interests: </span>
              {alumnus.interests}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400">
            Profile Status: <span className="text-emerald-700">{alumnus.status || 'APPROVED'}</span>
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                onClose();
                onEdit(alumnus);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Edit Profile
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

