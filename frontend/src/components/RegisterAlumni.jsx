import React, { useState } from 'react';
import { UserPlus, CheckCircle2, AlertCircle, Plus, X } from 'lucide-react';
import { registerAlumni } from '../api';

export default function RegisterAlumni({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    graduationYear: new Date().getFullYear(),
    department: 'Computer Engineering',
    degree: 'B.E.',
    currentOrganisation: '',
    currentRole: '',
    location: 'Pune, Maharashtra',
    bio: '',
    interests: '',
    skillsString: 'Java, Spring Boot, React, PostgreSQL'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const departments = [
    'Computer Engineering',
    'Information Technology',
    'Electronics & Telecommunication',
    'Artificial Intelligence & Data Science'
  ];

  const degrees = ['B.E.', 'M.Tech', 'Ph.D'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Parse comma-separated skills
    const skillNames = formData.skillsString
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      graduationYear: Number(formData.graduationYear),
      department: formData.department,
      degree: formData.degree,
      currentOrganisation: formData.currentOrganisation,
      currentRole: formData.currentRole,
      location: formData.location,
      bio: formData.bio,
      interests: formData.interests,
      skillNames
    };

    try {
      const created = await registerAlumni(payload);
      setSuccess(true);
      setTimeout(() => {
        onSuccess(created);
      }, 1200);
    } catch (err) {
      setError(err.message || 'Registration failed. Check if email already exists.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-emerald-200 text-center max-w-xl mx-auto space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Alumni Registered Successfully!</h2>
        <p className="text-sm text-slate-600">The profile has been created and synced with Supabase PostgreSQL.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm max-w-3xl mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Register New Alumnus</h2>
            <p className="text-xs text-slate-500">Add an alumnus to the PICT network database.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Shruti Deshmukh"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. shruti@example.com"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Graduation Year */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Graduation Year *</label>
            <input
              type="number"
              name="graduationYear"
              required
              min="1980"
              max="2030"
              value={formData.graduationYear}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department *</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Degree */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Degree</label>
            <select
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {degrees.map(deg => <option key={deg} value={deg}>{deg}</option>)}
            </select>
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Organisation / Company</label>
            <input
              type="text"
              name="currentOrganisation"
              value={formData.currentOrganisation}
              onChange={handleChange}
              placeholder="e.g. Google / Microsoft / Barclays"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Job Role</label>
            <input
              type="text"
              name="currentRole"
              value={formData.currentRole}
              onChange={handleChange}
              placeholder="e.g. SDE II / Cloud Architect"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Pune, Maharashtra / Bengaluru / Seattle"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Skills (Comma Separated) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Skills (Separated by commas)
          </label>
          <input
            type="text"
            name="skillsString"
            value={formData.skillsString}
            onChange={handleChange}
            placeholder="Java, Spring Boot, React, Microservices, AWS"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <p className="text-[11px] text-slate-400 mt-1">Each skill is automatically registered and mapped in the database.</p>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Short Bio</label>
          <textarea
            name="bio"
            rows="2"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Passionate engineer working on distributed systems and mentoring juniors..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Interests */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Interests & Mentorship Areas</label>
          <input
            type="text"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="System Design, Open Source, Resume Reviews"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all flex items-center space-x-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Registering...' : 'Register Alumnus'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

