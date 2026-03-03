import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import useAuth from "../context/useAuth";

export default function InternshipSearch() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();

  const query = new URLSearchParams(search).get("query") || "";
  const locationQuery = new URLSearchParams(search).get("location") || "";
  const [internships, setInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState(query);
  const [selectedLocation, setSelectedLocation] = useState(locationQuery);
  const [availableLocations, setAvailableLocations] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/api/tasks/public");
      setInternships(res.data);
      
      // Extract unique locations
      const locations = new Set();
      res.data.forEach(task => {
        task.locations?.forEach(loc => locations.add(loc));
      });
      setAvailableLocations(Array.from(locations).sort());
    };
    load();
  }, []);

  // Filter by search query AND location
  const filtered = internships.filter(task => {
    const matchesSearch = 
      task.title?.toLowerCase().includes(query.toLowerCase()) ||
      task.employer?.name?.toLowerCase().includes(query.toLowerCase()) ||
      task.skills?.join(" ").toLowerCase().includes(query.toLowerCase());
    
    const matchesLocation = selectedLocation === "" || 
      task.locations?.some(loc => loc.toLowerCase().includes(selectedLocation.toLowerCase()));
    
    return matchesSearch && matchesLocation;
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("query", searchTerm);
    if (selectedLocation) params.set("location", selectedLocation);
    navigate(`/internships?${params.toString()}`);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] pt-24 px-6 pb-12">
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h1 className="text-2xl font-bold mb-6">Search Internships</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by role, skill, or company
            </label>
            <div className="flex items-center border rounded-lg px-4">
              <span className="text-gray-400 mr-3">🔍</span>
              <input
                type="text"
                placeholder="e.g., React, Python, TCS"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full py-3 outline-none"
              />
            </div>
          </div>

          {/* Location Dropdown */}
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by location
            </label>
            <select
              value={selectedLocation}
              onChange={handleLocationChange}
              className="w-full border rounded-lg px-4 py-3 outline-none bg-white"
            >
              <option value="">All Locations</option>
              {availableLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Search
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {(query || selectedLocation) && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            {query && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                Search: "{query}"
              </span>
            )}
            {selectedLocation && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                Location: {selectedLocation}
              </span>
            )}
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedLocation("");
                navigate("/internships");
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <h2 className="text-xl font-semibold mb-4">
        {filtered.length} internship{filtered.length !== 1 ? 's' : ''} found
        {query && <span> for "{query}"</span>}
        {selectedLocation && <span> in {selectedLocation}</span>}
      </h2>

      {!filtered.length && (
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-gray-500 text-lg">No internships found matching your criteria.</p>
          <p className="text-gray-400 mt-2">Try different keywords or locations</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(task => (
          <div
            key={task._id}
            onClick={() => navigate(`/internship/${task._id}`)}
            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg text-gray-900">{task.title}</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {task.status}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mt-1 font-medium">
              {task.employer?.name}
            </p>
            
            <div className="mt-3 space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>{task.locations?.join(", ") || "Multiple locations"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💰</span>
                <span>₹{task.stipend?.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>👥</span>
                <span>{task.applicants?.length || 0} applicants</span>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-3 line-clamp-2">
              {task.description}
            </p>

            {/* Skills Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {task.skills?.slice(0, 3).map((skill, i) => (
                <span key={i} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                  {skill}
                </span>
              ))}
              {task.skills?.length > 3 && (
                <span className="text-xs text-gray-500">+{task.skills.length - 3} more</span>
              )}
            </div>

            <button
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
            >
              View Details & Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
