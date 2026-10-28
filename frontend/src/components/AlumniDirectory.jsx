import React, { useState, useEffect } from 'react';
import { Search, Filter, Building2, Calendar, MapPin, Tag, UserCheck, Send, Eye, Edit3, RefreshCw } from 'lucide-react';
import { searchAlumni, sendConnectionRequest } from '../api';

export default function AlumniDirectory({
  alumniList,
  onRefresh,
  currentUserId,
  onSelectAlumniForDetails,
  onEditAlumni,
  userConnections = []
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [filteredList, setFilteredList] = useState(alumniList);
  const [loading, setLoading] = useState(false);
  const [sendingId, setSendingId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  // Derive distinct companies, years, and skills for filter dropdowns
  const availableCompanies = Array.from(new Set(alumniList.map(a => a.currentOrganisation).filter(Boolean)));
  const availableYears = Array.from(new Set(alumniList.map(a => a.graduationYear).filter(Boolean))).sort((a, b) => b - a);
  const availableSkills = Array.from(new Set(alumniList.flatMap(a => (a.skills || []).map(s => s.name)).filter(Boolean)));

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const results = await searchAlumni({
        name: searchTerm,
        company: companyFilter,
        graduationYear: yearFilter,
        skill: skillFilter
      });
      setFilteredList(results);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setCompanyFilter('');
    setYearFilter('');
    setSkillFilter('');
    setFilteredList(alumniList);
  };

  useEffect(() => {
    // If no search fields are active, keep sync with main list
    if (!searchTerm && !companyFilter && !yearFilter && !skillFilter) {
      setFilteredList(alumniList);
    } else {
      handleSearch();
    }
  }, [alumniList, companyFilter, yearFilter, skillFilter]);

  const handleConnect = async (receiverId) => {
    if (!currentUserId) {
      alert("Please select which alumnus you are simulating from the top-right dropdown first!");
      return;
    }
    if (Number(currentUserId) === Number(receiverId)) {
      alert("You cannot connect to yourself!");
      return;
    }
    setSendingId(receiverId);
    try {
      await sendConnectionRequest(currentUserId, receiverId);
      setActionMessage({ type: 'success', text: "Connection request sent successfully!" });
      onRefresh();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || "Failed to send request." });
    } finally {
      setSendingId(null);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  // Helper to determine connection status for a profile card
  const getConnectionState = (targetId) => {
    if (!currentUserId || Number(currentUserId) === Number(targetId)) return 'SELF';
    const match = userConnections.find(
      c => (c.sender?.id === Number(currentUserId) && c.receiver?.id === Number(targetId)) ||
           (c.receiver?.id === Number(currentUserId) && c.sender?.id === Number(targetId))
    );
    if (!match) return 'NONE';
    return match.status; // 'PENDING' or 'ACCEPTED' or 'REJECTED'
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {actionMessage && (
        <div className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between shadow-xs transition-all ${
          actionMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="font-bold ml-2">×</button>
        </div>
      )}

      {/* Search & Filter Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Alumni Directory & Search</h1>
            <p className="text-xs text-slate-500">Filter across PICT graduates by name, company, graduation year, or skill.</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
            <span className="text-xs font-semibold px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
              {filteredList.length} Alumni Found
            </span>
          </div>
        </div>

        {/* Filter Inputs Grid */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Name search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Company Filter */}
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by company..."
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              list="company-options"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <datalist id="company-options">
              {availableCompanies.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>

          {/* Graduation Year */}
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">All Graduation Years</option>
              {availableYears.map(y => <option key={y} value={y}>Class of {y}</option>)}
            </select>
          </div>

          {/* Skill Filter */}
          <div className="relative">
            <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by skill (e.g. Java)..."
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              list="skill-options"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <datalist id="skill-options">
              {availableSkills.map(s => <option key={s} value={s} />)}
            </datalist>
          </div>
        </form>
      </div>

      {/* Alumni Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">Loading alumni records...</div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
          <p className="text-slate-600 font-semibold">No alumni matched your search criteria.</p>
          <p className="text-xs text-slate-400">Try adjusting your filters or resetting them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map((alumnus) => {
            const connState = getConnectionState(alumnus.id);
            const initials = alumnus.fullName
              ? alumnus.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
              : 'AL';

            return (
              <div
                key={alumnus.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300/80 hover:shadow-lg hover:shadow-emerald-950/5 transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top: Avatar, Name & Year */}
                  <div className="flex items-start space-x-3.5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 truncate">{alumnus.fullName}</h3>
                        <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                          '{alumnus.graduationYear}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-emerald-700 truncate">
                        {alumnus.currentRole || 'Alumnus'} {alumnus.currentOrganisation ? `@ ${alumnus.currentOrganisation}` : ''}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{alumnus.department}</p>
                    </div>
                  </div>

                  {/* Location & Bio */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2">
                    {alumnus.location && (
                      <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{alumnus.location}</span>
                      </div>
                    )}
                    {alumnus.bio && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed italic">
                        "{alumnus.bio}"
                      </p>
                    )}
                  </div>

                  {/* Skills tags */}
                  {alumnus.skills && alumnus.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {alumnus.skills.slice(0, 4).map((s) => (
                        <span
                          key={s.id || s.name}
                          className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                        >
                          {s.name}
                        </span>
                      ))}
                      {alumnus.skills.length > 4 && (
                        <span className="text-[10px] text-slate-400 font-medium px-1">
                          +{alumnus.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => onSelectAlumniForDetails(alumnus)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors title='View Full Profile'"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditAlumni(alumnus)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors title='Edit Profile'"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Connection Button */}
                  {connState === 'SELF' ? (
                    <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
                      (Your Profile)
                    </span>
                  ) : connState === 'ACCEPTED' ? (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Connected</span>
                    </span>
                  ) : connState === 'PENDING' ? (
                    <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                      Request Pending
                    </span>
                  ) : (
                    <button
                      onClick={() => handleConnect(alumnus.id)}
                      disabled={sendingId === alumnus.id}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg shadow-xs transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>{sendingId === alumnus.id ? 'Sending...' : 'Connect'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

