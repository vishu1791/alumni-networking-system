import React, { useState } from 'react';
import { Link2, Check, X, Clock, UserCheck, Send, AlertCircle, Sparkles } from 'lucide-react';
import { acceptConnection, rejectConnection, sendConnectionRequest } from '../api';

export default function ConnectionsHub({
  currentUserId,
  alumniList,
  userConnections,
  connectedAlumni,
  onRefresh
}) {
  const [subTab, setSubTab] = useState('incoming'); // 'incoming', 'sent', 'connected'
  const [targetAlumniId, setTargetAlumniId] = useState('');
  const [loadingAction, setLoadingAction] = useState(null);
  const [error, setError] = useState(null);

  const currentUser = alumniList.find(a => a.id === Number(currentUserId));

  // Partition connections into incoming vs sent
  const incomingPending = userConnections.filter(
    c => c.receiver?.id === Number(currentUserId) && c.status === 'PENDING'
  );

  const sentPending = userConnections.filter(
    c => c.sender?.id === Number(currentUserId) && c.status === 'PENDING'
  );

  const handleAccept = async (connId) => {
    setLoadingAction(connId);
    try {
      await acceptConnection(connId);
      onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = async (connId) => {
    setLoadingAction(connId);
    try {
      await rejectConnection(connId);
      onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSendNew = async (e) => {
    e.preventDefault();
    if (!targetAlumniId) return;
    setLoadingAction('send');
    setError(null);
    try {
      await sendConnectionRequest(currentUserId, targetAlumniId);
      setTargetAlumniId('');
      onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  if (!currentUserId) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center max-w-xl mx-auto space-y-3">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Please Select an Alumnus to Simulate</h3>
        <p className="text-xs text-slate-500">
          Use the <strong>"Simulating:"</strong> dropdown at the top right header to act as an alumnus. Then you can send requests, accept invitations, and manage your network!
        </p>
      </div>
    );
  }

  // Candidates available to send a request to (excluding self, already connected, or pending)
  const existingIds = new Set(
    userConnections.flatMap(c => [c.sender?.id, c.receiver?.id])
  );
  const potentialAlumni = alumniList.filter(
    a => a.id !== Number(currentUserId) && !existingIds.has(a.id)
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-2xl text-white p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold bg-emerald-700/80 text-emerald-200 px-2.5 py-0.5 rounded-full">
              Active Session
            </span>
            <span className="text-xs text-emerald-100">ID #{currentUser?.id}</span>
          </div>
          <h2 className="text-xl font-bold mt-1">{currentUser?.fullName}'s Connections Hub</h2>
          <p className="text-xs text-emerald-100/90 mt-0.5">
            {currentUser?.currentRole || 'Alumnus'} {currentUser?.currentOrganisation ? `@ ${currentUser.currentOrganisation}` : ''}
          </p>
        </div>

        {/* Quick Send Form */}
        <form onSubmit={handleSendNew} className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/20 flex items-center space-x-2 w-full md:w-auto">
          <select
            value={targetAlumniId}
            onChange={(e) => setTargetAlumniId(e.target.value)}
            className="bg-emerald-950/40 text-xs text-white border border-emerald-600/50 rounded-lg px-3 py-1.5 outline-none"
          >
            <option value="" className="text-slate-800">Select peer to connect...</option>
            {potentialAlumni.map(a => (
              <option key={a.id} value={a.id} className="text-slate-800">
                {a.fullName} ({a.currentOrganisation || a.department})
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!targetAlumniId || loadingAction === 'send'}
            className="px-3.5 py-1.5 text-xs font-semibold bg-white text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors flex items-center space-x-1 shrink-0"
          >
            <Send className="w-3 h-3" />
            <span>Send</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold text-rose-600 ml-2">×</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          onClick={() => setSubTab('incoming')}
          className={`pb-3 text-xs font-semibold px-2 transition-all relative ${
            subTab === 'incoming' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Incoming Requests ({incomingPending.length})</span>
          {subTab === 'incoming' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t" />
          )}
        </button>

        <button
          onClick={() => setSubTab('connected')}
          className={`pb-3 text-xs font-semibold px-2 transition-all relative ${
            subTab === 'connected' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Connected Network ({connectedAlumni.length})</span>
          {subTab === 'connected' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t" />
          )}
        </button>

        <button
          onClick={() => setSubTab('sent')}
          className={`pb-3 text-xs font-semibold px-2 transition-all relative ${
            subTab === 'sent' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Sent Requests ({sentPending.length})</span>
          {subTab === 'sent' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t" />
          )}
        </button>
      </div>

      {/* Tab 1: Incoming Pending */}
      {subTab === 'incoming' && (
        <div className="space-y-3">
          {incomingPending.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center space-y-1">
              <p className="text-xs font-medium text-slate-500">No pending incoming connection requests.</p>
              <p className="text-[11px] text-slate-400">Switch user from the top right to simulate sending a request to this user!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomingPending.map((conn) => (
                <div key={conn.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{conn.sender?.fullName}</h4>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      {conn.sender?.currentRole || 'Alumnus'} {conn.sender?.currentOrganisation ? `@ ${conn.sender.currentOrganisation}` : ''}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {conn.sender?.department} ('{conn.sender?.graduationYear})
                    </p>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleAccept(conn.id)}
                      disabled={loadingAction === conn.id}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => handleReject(conn.id)}
                      disabled={loadingAction === conn.id}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center space-x-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Connected Network */}
      {subTab === 'connected' && (
        <div className="space-y-3">
          {connectedAlumni.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center space-y-1">
              <p className="text-xs font-medium text-slate-500">You haven't connected with any alumni yet.</p>
              <p className="text-[11px] text-slate-400">Send requests from the Directory or the top bar to build your network.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connectedAlumni.map((peer) => (
                <div key={peer.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{peer.fullName}</h4>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <UserCheck className="w-3 h-3" />
                      <span>Connected</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {peer.currentRole || 'Alumnus'} {peer.currentOrganisation ? `@ ${peer.currentOrganisation}` : ''}
                  </p>
                  <p className="text-[11px] text-slate-400">{peer.department} ('{peer.graduationYear})</p>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 truncate">
                    Email: <a href={`mailto:${peer.email}`} className="text-emerald-700 hover:underline">{peer.email}</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Sent Requests */}
      {subTab === 'sent' && (
        <div className="space-y-3">
          {sentPending.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center space-y-1">
              <p className="text-xs font-medium text-slate-500">No outgoing connection requests waiting.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sentPending.map((conn) => (
                <div key={conn.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Sent to: {conn.receiver?.fullName}</h4>
                    <p className="text-[11px] text-slate-600">
                      {conn.receiver?.currentRole} {conn.receiver?.currentOrganisation ? `@ ${conn.receiver.currentOrganisation}` : ''}
                    </p>
                  </div>
                  <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Pending</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

