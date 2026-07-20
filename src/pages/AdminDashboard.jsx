const db = globalThis.__BHOODEVI_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, MapPin, Building, Activity, FileText, CheckCircle2, MessageSquare, ExternalLink, ShieldCheck, LogOut, Clock3, CircleX, X, Save } from "lucide-react";
import { formatPrice } from "@/lib/site";
import { cn } from "@/lib/utils";
import { clearAdminSession } from "@/pages/AdminLogin";

const statusOptions = [
  { value: "Available", label: "Active", icon: CheckCircle2, activeClass: "border-emerald-300 bg-emerald-100 text-emerald-800 shadow-[0_3px_0_rgb(110,231,183)]" },
  { value: "Booked", label: "Booked", icon: Clock3, activeClass: "border-amber-300 bg-amber-100 text-amber-800 shadow-[0_3px_0_rgb(253,230,138)]" },
  { value: "Sold", label: "Sold", icon: CircleX, activeClass: "border-rose-300 bg-rose-100 text-rose-800 shadow-[0_3px_0_rgb(254,205,211)]" },
];

const statusOrder = { Available: 0, Booked: 1, Sold: 2 };

const sortPropertiesByStatus = (properties) => [...properties].sort((a, b) => {
  const statusDifference = (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3);
  if (statusDifference !== 0) return statusDifference;
  return new Date(b.created_date || 0) - new Date(a.created_date || 0);
});

export default function AdminDashboard() {
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingInquiry, setEditingInquiry] = useState(null);
  const [inquirySaving, setInquirySaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const propList = await db.entities.Property.list("-created_date", 100);
      setProperties(sortPropertiesByStatus(propList));
      
      const inqList = await db.entities.Inquiry.list();
      setInquiries(inqList || []);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await db.entities.Property.delete(id);
        setProperties((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        alert("Failed to delete property. Please try again.");
      }
    }
  };

  const handleDeleteInquiry = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the inquiry from "${name || "this client"}"?`)) {
      try {
        await db.entities.Inquiry.delete(id);
        setInquiries((prev) => prev.filter((i) => i.id !== id));
      } catch (err) {
        alert("Failed to delete inquiry. Please try again.");
      }
    }
  };

  const handleSaveInquiry = async (e) => {
    e.preventDefault();
    if (!editingInquiry) return;
    setInquirySaving(true);
    try {
      const updatePayload = {
        name: editingInquiry.name,
        phone: editingInquiry.phone,
        email: editingInquiry.email || "",
        message: editingInquiry.message || "",
        property_title: editingInquiry.property_title || "General Inquiry"
      };
      await db.entities.Inquiry.update(editingInquiry.id, updatePayload);
      setInquiries((prev) =>
        prev.map((i) => (i.id === editingInquiry.id ? { ...i, ...updatePayload } : i))
      );
      setEditingInquiry(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update inquiry. Please try again.");
    } finally {
      setInquirySaving(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    const previousProperties = properties;
    setProperties((current) => sortPropertiesByStatus(current.map((property) => (
      property.id === id ? { ...property, status } : property
    ))));

    try {
      await db.entities.Property.update(id, { status });
    } catch (err) {
      setProperties(previousProperties);
      alert("Failed to update the listing status. Please try again.");
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    navigate("/admin-login", { replace: true });
  };

  const stats = {
    total: properties.length,
    available: properties.filter(p => p.status === "Available").length,
    booked: properties.filter(p => p.status === "Booked").length,
    sold: properties.filter(p => p.status === "Sold").length,
    inquiries: inquiries.length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 bg-background">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="mx-auto max-w-8xl px-5 md:px-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-border pb-8 mb-10">
          <div>
            <div className="flex items-center gap-2 text-sm text-accent mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-semibold tracking-wider uppercase">Admin Panel</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl tracking-tight text-foreground">Estate Control Center</h1>
            <p className="text-muted-foreground mt-2">Manage listings, track customer inquiries, and curate catalog details.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card text-muted-foreground px-4 py-2.5 text-sm font-medium hover:border-rose-300 hover:text-rose-600 transition-all"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
            <Link
              to="/admin/properties/new"
              className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-6 py-3 font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Property
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <StatCard label="Total Listings" value={stats.total} icon={Building} />
          <StatCard label="Available" value={stats.available} icon={CheckCircle2} color="text-emerald-600" />
          <StatCard label="Booked" value={stats.booked} icon={Activity} color="text-amber-500" />
          <StatCard label="Sold / Acquired" value={stats.sold} icon={FileText} color="text-rose-500" />
          <StatCard label="Client Inquiries" value={stats.inquiries} icon={MessageSquare} color="text-accent" />
        </div>

        {/* Layout Grid */}
        <div className="grid xl:grid-cols-3 gap-8">
          
          {/* Properties Table */}
          <div className="xl:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="font-display text-2xl">Property Directory</h2>
                <span className="text-xs text-muted-foreground">Showing {properties.length} listings</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/40 text-muted-foreground text-xs font-semibold uppercase border-b border-border">
                      <th className="px-6 py-4">Property</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-sm">
                    {properties.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                          No properties found. Click "Add Property" to create one.
                        </td>
                      </tr>
                    ) : (
                      properties.map((p) => {
                        const imgUrl = p.images?.[0] || "/images/7a0e880ec_generated_a61bcacb.png";
                        return (
                          <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={imgUrl}
                                  alt={p.title}
                                  className="w-12 h-12 rounded-lg object-cover bg-muted border border-border"
                                />
                                <div>
                                  <div className="font-semibold text-foreground">{p.title}</div>
                                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3 h-3 text-accent" />
                                    {p.location}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground font-medium">{p.type}</td>
                            <td className="px-6 py-4 font-semibold text-foreground">
                              {formatPrice(p.price)}
                              {p.price_unit && p.price_unit !== "Total" && (
                                <span className="text-xs text-muted-foreground font-normal"> / {p.price_unit}</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div
                                className="inline-flex rounded-lg border border-border bg-muted/40 p-1"
                                role="group"
                                aria-label={`Listing status for ${p.title}`}
                              >
                                {statusOptions.map(({ value, label, icon: Icon, activeClass }) => {
                                  const isActive = (p.status || "Available") === value;
                                  return (
                                    <button
                                      key={value}
                                      type="button"
                                      onClick={() => handleStatusChange(p.id, value)}
                                      aria-pressed={isActive}
                                      title={`Mark as ${label}`}
                                      className={cn(
                                        "inline-flex h-7 items-center gap-1 rounded-md border px-2 text-[10px] font-semibold uppercase tracking-wide transition-all duration-200",
                                        "hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 active:shadow-none",
                                        isActive
                                          ? activeClass
                                          : "border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-background hover:text-foreground"
                                      )}
                                    >
                                      <Icon className="h-3 w-3" />
                                      {label}
                                    </button>
                                  );
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  to={`/properties/${p.slug || p.id}`}
                                  target="_blank"
                                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                                  title="View Public Page"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => navigate(`/admin/properties/edit/${p.id}`)}
                                  className="p-2 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(p.id, p.title)}
                                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Inquiries Sidebar */}
          <div>
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm h-full flex flex-col">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="font-display text-2xl">Recent Inquiries</h2>
                <span className="bg-accent/15 text-accent text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {inquiries.length} Active
                </span>
              </div>
              
              <div className="p-6 divide-y divide-border/60 overflow-y-auto max-h-[500px] flex-1">
                {inquiries.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground text-sm">
                    No client inquiries received yet.
                  </div>
                ) : (
                  inquiries.map((inq) => (
                    <div key={inq.id} className="py-4 first:pt-0 last:pb-0 group">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-foreground">{inq.name}</div>
                          <div className="text-[10px] text-muted-foreground">{inq.phone}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingInquiry({ ...inq })}
                            className="p-1.5 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-md transition-all"
                            title="Edit Inquiry"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteInquiry(inq.id, inq.name)}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-accent font-medium mt-1">
                        Ref: {inq.property_title || "General Inquiry"}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 bg-muted/30 p-2.5 rounded-lg border border-border/40 italic">
                        "{inq.message}"
                      </p>
                      {inq.email && (
                        <div className="text-[10px] text-muted-foreground/70 mt-2">
                          Email: {inq.email}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Edit Inquiry Modal */}
      {editingInquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
              <h3 className="font-display text-2xl text-foreground">Edit Client Inquiry</h3>
              <button
                onClick={() => setEditingInquiry(null)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInquiry} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  required
                  value={editingInquiry.name || ""}
                  onChange={(e) => setEditingInquiry({ ...editingInquiry, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={editingInquiry.phone || ""}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, phone: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editingInquiry.email || ""}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, email: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Property Reference
                </label>
                <input
                  type="text"
                  value={editingInquiry.property_title || ""}
                  onChange={(e) => setEditingInquiry({ ...editingInquiry, property_title: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Message / Notes
                </label>
                <textarea
                  rows={4}
                  value={editingInquiry.message || ""}
                  onChange={(e) => setEditingInquiry({ ...editingInquiry, message: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingInquiry(null)}
                  className="rounded-full border border-border px-5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inquirySaving}
                  className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-6 py-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {inquirySaving ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex items-center gap-4">
      <div className={cn("p-3 rounded-xl bg-muted/60 border border-border/40", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-2xl font-bold font-display text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      </div>
    </div>
  );
}
