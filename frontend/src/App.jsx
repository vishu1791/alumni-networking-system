import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AlumniDirectory from './components/AlumniDirectory';
import RegisterAlumni from './components/RegisterAlumni';
import EditProfileModal from './components/EditProfileModal';
import AlumniDetailModal from './components/AlumniDetailModal';
import ConnectionsHub from './components/ConnectionsHub';
import JobBoard from './components/JobBoard';
import { fetchAllAlumni, fetchAlumniConnections, fetchConnectedAlumni, fetchJobs } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('directory');
  const [alumniList, setAlumniList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userConnections, setUserConnections] = useState([]);
  const [connectedAlumni, setConnectedAlumni] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [detailModalAlumnus, setDetailModalAlumnus] = useState(null);
  const [editModalAlumnus, setEditModalAlumnus] = useState(null);

  // Load initial data
  const loadInitialData = async () => {
    try {
      const [alumniData, jobsData] = await Promise.all([
        fetchAllAlumni(),
        fetchJobs()
      ]);
      setAlumniList(alumniData);
      setJobs(jobsData);

      // Default the simulated user to the first alumnus if none selected
      if (!currentUserId && alumniData.length > 0) {
        setCurrentUserId(alumniData[0].id);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to load initial data:", err);
      setError("Unable to connect to backend server. Make sure Spring Boot backend is running on port 8080.");
    } finally {
      setLoading(false);
    }
  };

  // Load connection data whenever active simulated user changes
  const loadUserConnections = async (userId) => {
    if (!userId) {
      setUserConnections([]);
      setConnectedAlumni([]);
      return;
    }
    try {
      const [conns, connected] = await Promise.all([
        fetchAlumniConnections(userId),
        fetchConnectedAlumni(userId)
      ]);
      setUserConnections(conns);
      setConnectedAlumni(connected);
    } catch (err) {
      console.warn("Could not load user connections:", err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      loadUserConnections(currentUserId);
    }
  }, [currentUserId]);

  const handleRefresh = async () => {
    await loadInitialData();
    if (currentUserId) {
      await loadUserConnections(currentUserId);
    }
  };

  const handleRegistrationSuccess = (newAlumnus) => {
    handleRefresh();
    setCurrentUserId(newAlumnus.id);
    setActiveTab('directory');
  };

  const handleProfileUpdated = (updatedAlumnus) => {
    handleRefresh();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alumniList={alumniList}
        currentUserId={currentUserId}
        setCurrentUserId={setCurrentUserId}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
            <div>
              <p className="font-semibold">{error}</p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Ensure Supabase credentials in <code>backend/.env</code> are correct and run <code>./mvnw spring-boot:run</code>.
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold rounded-lg text-xs"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-xs text-slate-500 font-medium">Connecting to AlumniConnect API...</p>
          </div>
        ) : (
          <>
            {activeTab === 'directory' && (
              <AlumniDirectory
                alumniList={alumniList}
                onRefresh={handleRefresh}
                currentUserId={currentUserId}
                onSelectAlumniForDetails={setDetailModalAlumnus}
                onEditAlumni={setEditModalAlumnus}
                userConnections={userConnections}
              />
            )}

            {activeTab === 'register' && (
              <RegisterAlumni
                onSuccess={handleRegistrationSuccess}
                onCancel={() => setActiveTab('directory')}
              />
            )}

            {activeTab === 'connections' && (
              <ConnectionsHub
                currentUserId={currentUserId}
                alumniList={alumniList}
                userConnections={userConnections}
                connectedAlumni={connectedAlumni}
                onRefresh={handleRefresh}
              />
            )}

            {activeTab === 'jobs' && (
              <JobBoard
                jobs={jobs}
                onRefresh={handleRefresh}
                currentUserId={currentUserId}
                alumniList={alumniList}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {detailModalAlumnus && (
        <AlumniDetailModal
          alumnus={detailModalAlumnus}
          onClose={() => setDetailModalAlumnus(null)}
          onEdit={(alumnus) => setEditModalAlumnus(alumnus)}
        />
      )}

      {editModalAlumnus && (
        <EditProfileModal
          alumnus={editModalAlumnus}
          onClose={() => setEditModalAlumnus(null)}
          onUpdated={handleProfileUpdated}
        />
      )}

      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-400">
        <p>AlumniConnect — PICT ESDL Project • Built with Spring Boot, PostgreSQL (Supabase), React & Tailwind CSS</p>
      </footer>
    </div>
  );
}

