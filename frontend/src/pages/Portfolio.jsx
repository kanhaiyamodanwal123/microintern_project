import { useEffect, useState } from "react";
import api from "../api/api";
import useAuth from "../context/useAuth";

export default function Portfolio() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const load = async () => {
    try {
      const res = await api.get("/api/portfolio", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setItems(res.data || []);
    } catch (err) {
      console.error("Failed to load portfolio:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      completed: "bg-green-100 text-green-700",
      in_progress: "bg-blue-100 text-blue-700",
      open: "bg-gray-100 text-gray-700",
    };
    return styles[status] || styles.open;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Portfolio</h2>
          <p className="text-gray-500">Completed internships and projects</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <span className="text-2xl font-bold text-blue-600">{items.length}</span>
          <span className="text-gray-600 ml-1">Entries</span>
        </div>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="bg-white border rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-gray-700">No Portfolio Entries Yet</h3>
          <p className="text-gray-500 mt-2">
            Complete internships to build your portfolio automatically.
          </p>
        </div>
      )}

      {/* Portfolio Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                {item.title}
              </h3>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {item.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {item.employer?.name?.[0]?.toUpperCase() || "E"}
                </div>
                <div>
                  <p className="text-sm font-medium">{item.employer?.name || "Employer"}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                {item.status === "completed" ? "✅ Completed" : "In Progress"}
              </span>
            </div>

            {item.task && (
              <a
                href={`/task/${item.task}`}
                className="text-sm text-blue-600 hover:underline mt-3 block"
              >
                View Task Details →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
