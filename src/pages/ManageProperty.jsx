const db = globalThis.__BHOODEVI_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Save, Plus, X, Image as ImageIcon, CheckCircle, Info, Upload, Link2, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROPERTY_TYPES } from "@/lib/site";
import { cn } from "@/lib/utils";

const LOCAL_IMAGES = [
  { path: "/images/8ccca91be_generated_07473839.png", label: "Farm Land / Green Estate" },
  { path: "/images/057d0192b_generated_c24618f0.png", label: "Villa / Residential Development" },
  { path: "/images/56a846ecc_generated_29ead173.png", label: "Commercial Corridor Plot" },
  { path: "/images/34c9a594c_generated_902be099.png", label: "Surveyed Open Plot Grid" },
  { path: "/images/f56023324_generated_6d11b046.png", label: "High Appreciation Parcel" },
  { path: "/images/ab77b02ef_generated_dba33d3f.png", label: "Agricultural / Fertile Crop Acres" },
  { path: "/images/7a0e880ec_generated_a61bcacb.png", label: "Luxury Gated Entrance" },
  { path: "/images/ffb9d83c9_generated_76b418bf.png", label: "CTA Twilight View" }
];

export default function ManageProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    type: "Residential",
    status: "Available",
    price: "",
    price_unit: "Total",
    area: "",
    area_acres: "",
    location: "",
    orr_distance_km: "",
    short_description: "",
    description: "",
    highlights: [],
    amenities: [],
    images: ["/images/7a0e880ec_generated_a61bcacb.png"],
    featured: false,
    verified: true
  });

  const [newHighlight, setNewHighlight] = useState("");
  const [newAmenity, setNewAmenity] = useState("");
  const [customImage, setCustomImage] = useState("");
  const [uploadTab, setUploadTab] = useState("upload"); // "upload" | "presets" | "url"
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (isEdit) {
      loadProperty();
    }
  }, [id]);

  const loadProperty = async () => {
    setFetching(true);
    try {
      const p = await db.entities.Property.get(id);
      if (p) {
        setForm({
          title: p.title || "",
          slug: p.slug || "",
          type: p.type || "Residential",
          status: p.status || "Available",
          price: p.price || "",
          price_unit: p.price_unit || "Total",
          area: p.area || "",
          area_acres: p.area_acres || "",
          location: p.location || "",
          orr_distance_km: p.orr_distance_km || "",
          short_description: p.short_description || "",
          description: p.description || "",
          highlights: p.highlights || [],
          amenities: p.amenities || [],
          images: p.images && p.images.length ? p.images : ["/images/7a0e880ec_generated_a61bcacb.png"],
          featured: p.featured || false,
          verified: p.verified !== undefined ? p.verified : true
        });
      } else {
        setMessage({ text: "Property listing not found.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Failed to load property details.", type: "error" });
    } finally {
      setFetching(false);
    }
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    const computedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setForm((f) => ({ ...f, title: val, slug: computedSlug }));
  };

  const setField = (key) => (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
  };

  const addHighlight = () => {
    if (newHighlight.trim() && !form.highlights.includes(newHighlight.trim())) {
      setForm((f) => ({ ...f, highlights: [...f.highlights, newHighlight.trim()] }));
      setNewHighlight("");
    }
  };

  const removeHighlight = (h) => {
    setForm((f) => ({ ...f, highlights: f.highlights.filter((item) => item !== h) }));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !form.amenities.includes(newAmenity.trim())) {
      setForm((f) => ({ ...f, amenities: [...f.amenities, newAmenity.trim()] }));
      setNewAmenity("");
    }
  };

  const removeAmenity = (a) => {
    setForm((f) => ({ ...f, amenities: f.amenities.filter((item) => item !== a) }));
  };

  const selectImage = (path) => {
    setForm((f) => ({ ...f, images: [path] }));
  };

  const addCustomImage = () => {
    if (customImage.trim()) {
      setForm((f) => ({ ...f, images: [customImage.trim()] }));
      setCustomImage("");
    }
  };

  const handleDeviceUpload = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setForm((f) => ({ ...f, images: [dataUrl] }));
    };
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleDeviceUpload(file);
    e.target.value = ""; // reset so same file can be re-selected
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleDeviceUpload(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.location) {
      setMessage({ text: "Please fill in all required fields (Title, Price, and Location).", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    const payload = {
      ...form,
      price: Number(form.price),
      orr_distance_km: form.orr_distance_km !== "" ? Number(form.orr_distance_km) : null,
      area_acres: form.area_acres !== "" ? Number(form.area_acres) : null,
    };

    try {
      if (isEdit) {
        await db.entities.Property.update(id, payload);
        setMessage({ text: "Property listing updated successfully!", type: "success" });
      } else {
        await db.entities.Property.create(payload);
        setMessage({ text: "New property listing created successfully!", type: "success" });
      }
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      setMessage({ text: err.message || "An error occurred while saving the property listing.", type: "error" });
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 bg-background">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        
        {/* Navigation back */}
        <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to control center
        </Link>

        {/* Header */}
        <div className="border-b border-border pb-6 mb-8">
          <h1 className="font-display text-4xl text-foreground">
            {isEdit ? "Edit Estate Listing" : "Create New Estate"}
          </h1>
          <p className="text-muted-foreground mt-1.5">
            {isEdit ? "Modify and publish updates to this verified land asset." : "Register a new verified land or plot project in the database."}
          </p>
        </div>

        {/* Notifications */}
        {message.text && (
          <div className={cn(
            "p-4 rounded-xl border flex items-center gap-3 mb-8 shadow-sm",
            message.type === "success" 
              ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400" 
              : "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400"
          )}>
            {message.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <Info className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border rounded-2xl p-6 md:p-10 shadow-sm">
          
          {/* Group 1: General Info */}
          <div className="space-y-6">
            <h2 className="font-display text-2xl border-b border-border/60 pb-2.5">1. General Information</h2>
            
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Property Title *">
                <input
                  value={form.title}
                  onChange={handleTitleChange}
                  className="bhoodevi-input"
                  placeholder="e.g. Siri Farms & Orchards"
                  required
                />
              </Field>

              <Field label="URL Slug *">
                <input
                  value={form.slug}
                  onChange={setField("slug")}
                  className="bhoodevi-input"
                  placeholder="e.g. siri-farms-orchards"
                  required
                />
              </Field>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <Field label="Category *">
                <select
                  value={form.type}
                  onChange={setField("type")}
                  className="bhoodevi-input bg-background"
                  required
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>

              <Field label="Availability Status *">
                <select
                  value={form.status}
                  onChange={setField("status")}
                  className="bhoodevi-input bg-background"
                  required
                >
                  <option value="Available">Available</option>
                  <option value="Booked">Booked</option>
                  <option value="Sold">Sold</option>
                </select>
              </Field>

              <Field label="Featured Listing">
                <div className="h-11 flex items-center">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                      className="w-4 h-4 rounded border-border bg-background focus:ring-accent accent-accent text-accent"
                    />
                    <span className="text-sm text-foreground">Pin to homepage featured list</span>
                  </label>
                </div>
              </Field>
            </div>
          </div>

          {/* Group 2: Pricing & Area */}
          <div className="space-y-6">
            <h2 className="font-display text-2xl border-b border-border/60 pb-2.5">2. Dimension & Pricing</h2>
            
            <div className="grid md:grid-cols-3 gap-5">
              <Field label="Price (in ₹) *">
                <input
                  type="number"
                  value={form.price}
                  onChange={setField("price")}
                  className="bhoodevi-input"
                  placeholder="e.g. 12000000"
                  required
                />
              </Field>

              <Field label="Price Denomination *">
                <select
                  value={form.price_unit}
                  onChange={setField("price_unit")}
                  className="bhoodevi-input bg-background"
                  required
                >
                  <option value="Total">Total Valuation</option>
                  <option value="Per Acre">Per Acre</option>
                  <option value="Per Sq.Yd">Per Sq.Yd</option>
                </select>
              </Field>

              <Field label="Display Area Layout *">
                <input
                  value={form.area}
                  onChange={setField("area")}
                  className="bhoodevi-input"
                  placeholder="e.g. 2.5 Acres or 250 Sq.Yds"
                  required
                />
              </Field>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Acres Count (Numeric decimal)">
                <input
                  type="number"
                  step="0.01"
                  value={form.area_acres}
                  onChange={setField("area_acres")}
                  className="bhoodevi-input"
                  placeholder="e.g. 2.5 (for maps and filtering)"
                />
              </Field>

              <Field label="Distance from Outer Ring Road (km)">
                <input
                  type="number"
                  value={form.orr_distance_km}
                  onChange={setField("orr_distance_km")}
                  className="bhoodevi-input"
                  placeholder="e.g. 18"
                />
              </Field>
            </div>
          </div>

          {/* Group 3: Location & Details */}
          <div className="space-y-6">
            <h2 className="font-display text-2xl border-b border-border/60 pb-2.5">3. Location & Text Details</h2>
            
            <Field label="Geographical Location *">
              <input
                value={form.location}
                onChange={setField("location")}
                className="bhoodevi-input"
                placeholder="e.g. Shankarpally, Hyderabad"
                required
              />
            </Field>

            <Field label="Short Blurb / Quick Description">
              <input
                value={form.short_description}
                onChange={setField("short_description")}
                className="bhoodevi-input"
                placeholder="Brief summary for catalog listing preview cards (e.g. Premium organic farm land...)"
              />
            </Field>

            <Field label="Comprehensive Details Description">
              <textarea
                value={form.description}
                onChange={setField("description")}
                rows={5}
                className="bhoodevi-input resize-none"
                placeholder="Detail everything a client would need to know (water sources, soil types, registration parameters, neighborhood details, etc.)."
              />
            </Field>
          </div>

          {/* Group 4: Highlights & Amenities */}
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Highlights */}
            <div className="space-y-4">
              <h3 className="font-display text-xl border-b border-border/60 pb-1.5">Highlights</h3>
              <div className="flex gap-2">
                <input
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  className="bhoodevi-input !py-1.5"
                  placeholder="Add highlight (e.g. Clear Title)"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }}
                />
                <Button type="button" onClick={addHighlight} variant="outline" className="px-3">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {form.highlights.map((h) => (
                  <span key={h} className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-full text-xs font-medium border border-border">
                    {h}
                    <button type="button" onClick={() => removeHighlight(h)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="font-display text-xl border-b border-border/60 pb-1.5">Amenities</h3>
              <div className="flex gap-2">
                <input
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  className="bhoodevi-input !py-1.5"
                  placeholder="Add amenity (e.g. Borewell Water)"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAmenity(); } }}
                />
                <Button type="button" onClick={addAmenity} variant="outline" className="px-3">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {form.amenities.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-full text-xs font-medium border border-border">
                    {a}
                    <button type="button" onClick={() => removeAmenity(a)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Group 5: Asset Images */}
          <div className="space-y-5">
            <h2 className="font-display text-2xl border-b border-border/60 pb-2.5">5. Property Image</h2>

            {/* Active preview */}
            <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex items-center gap-4">
              <div className="relative w-28 h-20 shrink-0 border border-border rounded-lg overflow-hidden bg-muted">
                <img src={form.images[0]} alt="Current Selection" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-semibold text-sm">Active Preview Image</div>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">Upload from your device, pick a preset, or paste a URL.</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex rounded-xl border border-border overflow-hidden text-sm font-medium">
              {[
                { key: "upload", label: "Upload from Device", icon: Upload },
                { key: "presets", label: "Preset Gallery", icon: LayoutGrid },
                { key: "url",    label: "Image URL",        icon: Link2 },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setUploadTab(key)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 transition-colors",
                    uploadTab === key
                      ? "bg-accent text-accent-foreground"
                      : "bg-card text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />{label}
                </button>
              ))}
            </div>

            {/* Tab — Upload from device */}
            {uploadTab === "upload" && (
              <div>
                {/* Hidden native file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileInputChange}
                />

                {/* Drag & Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all select-none",
                    dragOver
                      ? "border-accent bg-accent/5 scale-[1.01]"
                      : "border-border hover:border-accent/60 hover:bg-muted/40"
                  )}
                >
                  <div className={cn(
                    "grid place-items-center w-14 h-14 rounded-2xl transition-colors",
                    dragOver ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm text-foreground">
                      {dragOver ? "Drop it here!" : "Click to browse or drag & drop"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP — up to 10 MB</p>
                  </div>

                  {/* Show filename after selection */}
                  {form.images[0]?.startsWith("data:") && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-3 py-1 text-xs font-medium">
                      <CheckCircle className="w-3.5 h-3.5" /> Image loaded
                    </div>
                  )}
                </div>

                <p className="text-center text-xs text-muted-foreground mt-3">
                  The image is stored locally in your browser and used directly on the listing.
                </p>
              </div>
            )}

            {/* Tab — Preset gallery */}
            {uploadTab === "presets" && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {LOCAL_IMAGES.map((img) => {
                  const isSelected = form.images[0] === img.path;
                  return (
                    <button
                      key={img.path}
                      type="button"
                      onClick={() => selectImage(img.path)}
                      className={cn(
                        "relative aspect-[4/3] rounded-xl overflow-hidden border-2 bg-muted text-left group transition-all",
                        isSelected ? "border-accent ring-2 ring-accent/20" : "border-border hover:border-accent/40"
                      )}
                    >
                      <img src={img.path} alt={img.label} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 bg-accent text-accent-foreground rounded-full p-0.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1.5 text-[9px] text-white font-medium truncate backdrop-blur-sm">
                        {img.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tab — Custom URL */}
            {uploadTab === "url" && (
              <div className="space-y-3">
                <Field label="Paste Image URL or Local Path">
                  <div className="flex gap-2">
                    <input
                      value={customImage}
                      onChange={(e) => setCustomImage(e.target.value)}
                      className="bhoodevi-input"
                      placeholder="e.g. https://domain.com/image.jpg"
                    />
                    <Button type="button" onClick={addCustomImage} className="rounded-xl px-5">Apply</Button>
                  </div>
                </Field>
                {customImage && (
                  <div className="rounded-xl overflow-hidden border border-border h-32 bg-muted">
                    <img src={customImage} alt="URL preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4 flex items-center justify-end gap-4 border-t border-border">
            <Link to="/admin" className="text-sm font-semibold hover:underline">
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-full bg-accent text-accent-foreground px-8 py-4 h-auto font-semibold hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Save Listing
                </>
              )}
            </Button>
          </div>

          <style>{`.bhoodevi-input{width:100%;border-radius:0.6rem;border:1px solid hsl(var(--border));background:hsl(var(--background));padding:0.7rem 0.9rem;font-size:0.95rem;outline:none;transition:border-color .2s}.bhoodevi-input:focus{border-color:hsl(var(--accent))}`}</style>
        </form>

      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="label-tech mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
