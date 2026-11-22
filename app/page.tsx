"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { TravelMapPlace } from "./components/interactive-travel-map";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Compass,
  Home,
  Hotel,
  MapPin,
  Menu,
  Plus,
  Search,
  Users,
  Utensils,
  WalletCards,
  X,
  Check,
  Clock3,
  Car,
  MoreHorizontal,
  ArrowUpRight,
  ReceiptText,
  ListTodo,
  Heart,
  UserRound,
  LogOut,
  Moon,
  Sun,
  Camera,
  ImagePlus,
  Compass as CompassRose,
  Mail,
  Sparkles,
  Banknote,
  ClipboardCheck,
  Trash2,
  Package,
  UserPlus,
} from "lucide-react";

const InteractiveTravelMap = dynamic(() => import("./components/interactive-travel-map"), {
  ssr: false,
  loading: () => <div className="travel-map-loading">Loading your map…</div>,
});

type PlaceSuggestion = {
  name: string;
  category: string;
  location: string;
  price: string;
  votes: number;
  tone: string;
};

type TripGroup = {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  budget: string;
  coverImage: string;
  type: string;
  invites: string[];
};

const navItems = [
  { label: "Home", icon: Home },
  { label: "Groups", icon: Users },
  { label: "Discover", icon: Compass },
  { label: "Checklist", icon: ClipboardCheck },
  { label: "Tasks", icon: ListTodo },
  { label: "Itinerary", icon: CalendarDays },
  { label: "Expenses", icon: WalletCards },
  { label: "Settlement", icon: Banknote },
  { label: "Memories", icon: Camera },
];

const members = [
  { name: "Sarah", initials: "SA", color: "#E9D5FF" },
  { name: "Rahul", initials: "RA", color: "#C7D2FE" },
  { name: "Janny", initials: "JA", color: "#FECDD3" },
  { name: "Laasya Reddy", initials: "LR", color: "#3730A3", white: true },
];

const travelMapPlaces: TravelMapPlace[] = [
  { id: "goa", name: "Goa", region: "West coast", trip: "Goa Weekend", status: "Planned", latitude: 15.2993, longitude: 74.124 },
  { id: "coorg", name: "Coorg", region: "Karnataka", trip: "Coorg Getaway", status: "Visited", latitude: 12.3375, longitude: 75.8069 },
  { id: "pondicherry", name: "Pondicherry", region: "Tamil Nadu", trip: "Pondicherry Weekend", status: "Visited", latitude: 11.9416, longitude: 79.8083 },
];

function BrandMark() {
  return <Image src="/squadup-logo.png" alt="" width={36} height={36} className="brand-mark" />;
}

function Avatar({ member, size = 34 }: { member: (typeof members)[number]; size?: number }) {
  return (
    <div
      className="avatar"
      title={member.name}
      style={{ width: size, height: size, background: member.color, color: member.white ? "#fff" : "#4A5565" }}
    >
      {member.initials}
    </div>
  );
}

function AvatarStack({ compact = false }: { compact?: boolean }) {
  return (
    <div className="avatar-stack">
      {members.slice(0, compact ? 3 : 4).map((member) => (
        <Avatar key={member.name} member={member} size={compact ? 30 : 34} />
      ))}
    </div>
  );
}

function Sidebar({
  active,
  setActive,
  open,
  setOpen,
}: {
  active: string;
  setActive: (label: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <>
      {open && <button className="sidebar-backdrop" aria-label="Close menu" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <button className="mobile-close" aria-label="Close menu" onClick={() => setOpen(false)}>
          <X size={19} />
        </button>
        <div className="brand">
          <BrandMark />
          <span>SquadUp</span>
        </div>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={active === item.label ? "nav-item active" : "nav-item"}
                onClick={() => {
                  setActive(item.label);
                  setOpen(false);
                }}
              >
                <Icon size={19} strokeWidth={1.9} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

function Header({
  setMenuOpen,
  setActive,
  profileName,
  profileEmail,
  theme,
  toggleTheme,
}: {
  setMenuOpen: (open: boolean) => void;
  setActive: (active: string) => void;
  profileName: string;
  profileEmail: string;
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profileMenuOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) setProfileMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [profileMenuOpen]);

  return (
    <header className="topbar">
      <button className="menu-button" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
        <Menu size={21} />
      </button>
      <div className="search-box">
        <Search size={17} />
        <input aria-label="Search" placeholder="Search groups, places or people" />
        <kbd>⌘ K</kbd>
      </div>
      <div className="header-actions">
        <button className="icon-button notification-button" aria-label="Open notifications" onClick={() => setActive("Notifications")}>
          <Bell size={19} />
          <span aria-hidden="true" />
        </button>
        <div className="header-theme-toggle" role="group" aria-label="Choose theme">
          <button
            type="button"
            className={theme === "light" ? "active" : ""}
            aria-label="Light theme"
            title="Light theme"
            aria-pressed={theme === "light"}
            onClick={() => { if (theme !== "light") toggleTheme(); }}
          >
            <Sun size={16} />
          </button>
          <button
            type="button"
            className={theme === "dark" ? "active" : ""}
            aria-label="Dark theme"
            title="Dark theme"
            aria-pressed={theme === "dark"}
            onClick={() => { if (theme !== "dark") toggleTheme(); }}
          >
            <Moon size={16} />
          </button>
        </div>
        <div className="header-profile" ref={profileMenuRef}>
          <button
            className="header-profile-button"
            aria-label={`Open ${profileName} profile menu`}
            aria-expanded={profileMenuOpen}
            aria-haspopup="menu"
            onClick={() => setProfileMenuOpen((open) => !open)}
          >
            <Avatar member={{ ...members[3], name: profileName, initials: profileName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() }} size={36} />
            <span className="header-profile-name">{profileName}</span>
            <MoreHorizontal size={17} />
          </button>
          {profileMenuOpen && (
            <div className="header-profile-menu" role="menu">
              <div className="header-profile-summary">
                <strong>{profileName}</strong>
                <span>{profileEmail}</span>
              </div>
              <button className="profile-menu-link" role="menuitem" onClick={() => { setActive("Profile"); setProfileMenuOpen(false); }}>
                <UserRound size={16} /> Profile &amp; Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function StatCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: "indigo" | "green" | "orange";
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        {tone === "indigo" ? <CircleDollarSign size={20} /> : tone === "green" ? <ArrowUpRight size={20} /> : <WalletCards size={20} />}
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

function ExpenseOverview({ full = false }: { full?: boolean }) {
  const expenses = [
    { name: "Hotel advance", sub: "Paid by Sarah", amount: 2500, category: "Accommodation", icon: Hotel, tone: "lavender" },
    { name: "Lunch", sub: "Paid by Rahul", amount: 1200, category: "Food & dining", icon: Utensils, tone: "peach" },
    { name: "Transport", sub: "Paid by Janny", amount: 800, category: "Transport", icon: Car, tone: "blue" },
  ];
  const totalSpending = expenses.reduce((total, expense) => total + expense.amount, 0);
  const categories = [...new Set(expenses.map((expense) => expense.category))].map((name) => {
    const categoryExpenses = expenses.filter((expense) => expense.category === name);
    return {
      name,
      amount: categoryExpenses.reduce((total, expense) => total + expense.amount, 0),
      tone: categoryExpenses[0].tone,
      icon: categoryExpenses[0].icon,
    };
  });

  return (
    <section className={full ? "panel expense-panel full-expense" : "panel expense-panel"}>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">TRIP BUDGET</p>
          <h2>Group expense overview</h2>
        </div>
        {full && <button className="secondary-button"><Plus size={16} /> Add expense</button>}
      </div>
      <div className="spending-layout">
        <div className="spending-summary">
          <span>Total group spending</span>
          <strong>₹{totalSpending.toLocaleString("en-IN")}</strong>
          <small>of ₹12,000 budget</small>
          <div className="progress-track"><div className="progress-fill" /></div>
        </div>
        <div className="balance-row">
          <div>
            <span>You are owed</span>
            <strong className="green-text">₹800</strong>
          </div>
          <div>
            <span>You owe</span>
            <strong className="orange-text">₹350</strong>
          </div>
        </div>
      </div>
      {full && (
        <div className="category-breakdown">
          <div className="category-breakdown-heading">
            <div><p className="eyebrow">WHERE IT GOES</p><h3>Spending by category</h3></div>
            <span>₹{totalSpending.toLocaleString("en-IN")} total</span>
          </div>
          <div className="category-list">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div className="category-row" key={category.name}>
                  <div className={`expense-icon ${category.tone}`}><Icon size={17} /></div>
                  <div className="category-details">
                    <div className="category-label"><strong>{category.name}</strong><span>₹{category.amount.toLocaleString("en-IN")} · {(category.amount / totalSpending * 100).toFixed(1)}%</span></div>
                    <div className="category-track"><span className={category.tone} style={{ width: `${category.amount / totalSpending * 100}%` }} /></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="expense-divider" />
      <h3 className="subheading">Recent expenses</h3>
      <div className="expense-list">
        {expenses.map((expense) => {
          const Icon = expense.icon;
          return (
            <div className="expense-row" key={expense.name}>
              <div className={`expense-icon ${expense.tone}`}><Icon size={18} /></div>
              <div className="expense-name"><strong>{expense.name}</strong><span>{expense.sub}</span></div>
              <strong>₹{expense.amount.toLocaleString("en-IN")}</strong>
            </div>
          );
        })}
      </div>
      {!full && <button className="text-link">View expense details <ChevronRight size={16} /></button>}
    </section>
  );
}

function GroupCard({ onOpen, group }: { onOpen: () => void; group?: TripGroup }) {
  const name = group?.name ?? "Goa Weekend";
  const location = group?.location ?? "Goa, India";
  const dates = group?.startDate && group?.endDate
    ? `${group.startDate} – ${group.endDate}`
    : "Dec 18–20";
  return (
    <div className={group?.type === "Completed" ? "group-card completed-trip-card" : "group-card"} role="button" tabIndex={0} onClick={onOpen} onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") onOpen();
    }}>
      <div className="group-cover" style={group?.coverImage ? { backgroundImage: `linear-gradient(180deg,rgba(30,27,45,.03),rgba(30,27,45,.2)),url("${group.coverImage}")` } : undefined}>
        <div className="cover-sun" />
        <div className="cover-mountains one" />
        <div className="cover-mountains two" />
      </div>
      <div className="group-card-body">
        <div className="group-card-title">
          <div>
            <span className="status-dot" /> <small>{group?.type ?? "Upcoming"}</small>
            <h3>{name}</h3>
          </div>
          <MoreHorizontal className="card-menu-icon" size={18} aria-hidden="true" />
        </div>
        <div className="group-meta">
          <span><CalendarDays size={15} /> {dates}</span>
          <span><MapPin size={15} /> {location}</span>
          {group?.budget && <span><WalletCards size={15} /> ₹{Number(group.budget).toLocaleString("en-IN")}</span>}
        </div>
        <div className="group-card-footer">
          <AvatarStack compact />
          <span>{group ? group.invites.length + 1 : 4} members</span>
        </div>
      </div>
    </div>
  );
}

function CreateGroupModal({ close, onCreate }: { close: () => void; onCreate: (group: TripGroup) => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onCreate({
      id: `${Date.now()}`,
      name: String(formData.get("name")).trim(),
      type: String(formData.get("type")),
      location: String(formData.get("location")).trim() || "Location to be decided",
      startDate: String(formData.get("startDate")),
      endDate: String(formData.get("endDate")),
      budget: String(formData.get("budget")),
      coverImage: String(formData.get("coverImage")).trim(),
      invites: String(formData.get("invites") ?? "").split(",").map((email) => email.trim()).filter(Boolean),
    });
    close();
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={close}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="create-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-heading">
          <div><p className="eyebrow">NEW GROUP</p><h2 id="create-title">Create a group</h2></div>
          <button className="icon-button" onClick={close} aria-label="Close"><X size={19} /></button>
        </div>
        <form onSubmit={submit}>
          <label>Group name<input name="name" required placeholder="e.g. Goa Weekend" /></label>
          <div className="form-grid">
            <label>Type<select name="type" defaultValue="Trip"><option>Trip</option><option>Outing</option><option>Event</option></select></label>
            <label>Estimated budget<input name="budget" required type="number" min="0" placeholder="₹12,000" /></label>
          </div>
          <div className="form-grid">
            <label>Start date<input name="startDate" required type="date" /></label>
            <label>End date<input name="endDate" required type="date" /></label>
          </div>
          <label>Location<input name="location" placeholder="Where are you going?" /></label>
          <label>Cover image URL<input name="coverImage" type="url" placeholder="https://example.com/photo.jpg" /></label>
          <label>Invite friends<input name="invites" type="email" multiple placeholder="Add email addresses" /></label>
          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={close}>Cancel</button>
            <button type="submit" className="primary-button">Create group</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ openGroup, openCreate, groups }: { openGroup: () => void; openCreate: () => void; groups: TripGroup[] }) {
  const [tab, setTab] = useState("Overview");
  const [mapFilter, setMapFilter] = useState<"All places" | "Visited" | "Planned">("All places");
  const [selectedMapPlace, setSelectedMapPlace] = useState("goa");
  const completedTrips: TripGroup[] = [
    { id: "past-pondicherry", name: "Pondicherry Weekend", location: "Pondicherry, India", startDate: "Aug 12", endDate: "Aug 14", budget: "", coverImage: "", type: "Completed", invites: ["Sarah", "Rahul", "Janny"] },
    { id: "past-coorg", name: "Coorg Getaway", location: "Coorg, India", startDate: "May 03", endDate: "May 06", budget: "", coverImage: "", type: "Completed", invites: ["Sarah", "Rahul"] },
  ];
  const plannedTripCount = groups.length + 1;
  const visibleMapPlaces = travelMapPlaces.filter((place) => mapFilter === "All places" || place.status === mapFilter);
  const activeMapPlace = visibleMapPlaces.find((place) => place.id === selectedMapPlace) ?? visibleMapPlaces[0] ?? travelMapPlaces[0];

  return (
    <div className="dashboard">
      <div className="welcome-row">
        <div><p>MONDAY, DECEMBER 14</p><h1>Good morning, Laasya <span>👋</span></h1></div>
        <button className="primary-button" onClick={openCreate}><Plus size={18} /> Create a group</button>
      </div>

      <div className="tabs" role="tablist">
        {["Overview", "Trips", "Places", "Tasks", "Expenses"].map((item) => (
          <button key={item} role="tab" aria-selected={tab === item} className={tab === item ? "tab active" : "tab"} onClick={() => setTab(item)}>
            {item}
            {item === "Tasks" && <span className="tab-count">3</span>}
            {item === "Trips" && <span className="tab-count">{completedTrips.length + plannedTripCount}</span>}
          </button>
        ))}
      </div>

      {tab === "Trips" && (
        <section className="trips-page">
          <div className="trips-summary">
            <article className="trip-count-card completed"><span><Check size={17} /></span><div><strong>{completedTrips.length}</strong><small>Trips taken</small></div></article>
            <article className="trip-count-card planned"><span><CalendarDays size={17} /></span><div><strong>{plannedTripCount}</strong><small>In the plan</small></div></article>
          </div>
          <section className="travel-map-card" aria-labelledby="travel-map-title">
            <div className="travel-map-heading">
              <div>
                <p className="eyebrow">YOUR STORY, ON THE MAP</p>
                <h2 id="travel-map-title">A little more of the world, together</h2>
                <p className="travel-map-subtitle">Every pin is a memory made or one waiting to happen.</p>
              </div>
              <div className="map-filter" role="group" aria-label="Filter map places">
                {(["All places", "Visited", "Planned"] as const).map((filter) => (
                  <button key={filter} type="button" className={mapFilter === filter ? "active" : ""} aria-pressed={mapFilter === filter} onClick={() => setMapFilter(filter)}>{filter}</button>
                ))}
              </div>
            </div>
            <div className="travel-map">
              <InteractiveTravelMap places={visibleMapPlaces} selectedPlaceId={activeMapPlace.id} onSelectPlace={setSelectedMapPlace} />
            </div>
            <div className="travel-map-footer">
              <div className="map-legend"><span><i className="visited" /> Been there</span><span><i className="planned" /> On the wishlist</span></div>
              <div className="map-selected-place">
                <span className={`map-selected-icon ${activeMapPlace.status.toLowerCase()}`}><MapPin size={17} /></span>
                <div><strong>{activeMapPlace.name}</strong><small>{activeMapPlace.region} · {activeMapPlace.trip}</small></div>
                <span className={`map-status ${activeMapPlace.status.toLowerCase()}`}>{activeMapPlace.status}</span>
              </div>
            </div>
          </section>
          <section className="trips-section">
            <div className="section-heading"><div><p className="eyebrow">UP NEXT</p><h2>Trips in the plan <span>{plannedTripCount}</span></h2></div><button className="text-link" onClick={openCreate}><Plus size={15} /> Plan a trip</button></div>
            <div className="group-grid">
              <GroupCard onOpen={openGroup} />
              {groups.map((group) => <GroupCard key={group.id} group={group} onOpen={openGroup} />)}
            </div>
          </section>
          <section className="trips-section">
            <div className="section-heading"><div><p className="eyebrow">GOOD TIMES, KEPT</p><h2>Previous trips <span>{completedTrips.length}</span></h2></div></div>
            <div className="group-grid">{completedTrips.map((trip) => <GroupCard key={trip.id} group={trip} onOpen={openGroup} />)}</div>
          </section>
        </section>
      )}
      {tab === "Overview" && (
        <div className="overview-grid">
          <div className="main-column">
            <section className="groups-section">
              <div className="section-heading"><div><p className="eyebrow">YOUR PLANS</p><h2>Upcoming groups</h2></div><button className="text-link">View all <ChevronRight size={16} /></button></div>
              <div className="group-grid"><GroupCard onOpen={openGroup} />{groups.map((group) => <GroupCard key={group.id} group={group} onOpen={openGroup} />)}<button className="add-group-card" onClick={openCreate}><span><Plus size={22} /></span><strong>Plan something new</strong><small>Create a group</small></button></div>
            </section>
            <div className="stat-grid">
              <StatCard label="Upcoming plans" value="2" detail="Next in 4 days" tone="indigo" />
              <StatCard label="You are owed" value="₹800" detail="Across 2 groups" tone="green" />
              <StatCard label="Pending tasks" value="3" detail="1 due this week" tone="orange" />
            </div>
            <section className="panel dashboard-activity">
              <div className="panel-heading"><div><p className="eyebrow">THE LATEST</p><h2>Recent activity</h2></div><button className="text-link" onClick={() => openGroup()}>Open group <ChevronRight size={15} /></button></div>
              <div className="activity-feed"><p><span className="activity-dot lavender" /><strong>Sarah added a hotel expense</strong><small>₹2,500 · 5m ago</small></p><p><span className="activity-dot blue" /><strong>Rahul joined Goa Weekend</strong><small>2h ago</small></p><p><span className="activity-dot peach" /><strong>Your trip dates are confirmed</strong><small>Yesterday</small></p></div>
            </section>
          </div>
          <aside className="right-column"><ExpenseOverview /></aside>
        </div>
      )}
      {tab === "Places" && <PlacesPanel />}
      {tab === "Tasks" && <TasksPanel />}
      {tab === "Expenses" && <ExpenseOverview full />}
    </div>
  );
}

function PlacesPanel() {
  const [places, setPlaces] = useState<PlaceSuggestion[]>([
    { name: "Titos", category: "Nightlife", location: "Baga, Goa", price: "₹1,200", votes: 3, tone: "night" },
    { name: "Thalassa", category: "Restaurant", location: "Vagator, Goa", price: "₹1,800", votes: 2, tone: "sunset" },
    { name: "Curlies", category: "Beach club", location: "Anjuna, Goa", price: "₹900", votes: 4, tone: "beach" },
  ]);
  const [votedPlaces, setVotedPlaces] = useState<string[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<string[]>([]);
  const [addingSuggestion, setAddingSuggestion] = useState(false);

  const toggleVote = (name: string) => {
    setVotedPlaces((current) => current.includes(name)
      ? current.filter((place) => place !== name)
      : [...current, name]);
  };

  const toggleSaved = (name: string) => {
    setSavedPlaces((current) => current.includes(name)
      ? current.filter((place) => place !== name)
      : [...current, name]);
  };

  const addSuggestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const price = String(formData.get("price") ?? "").trim();
    if (!name || !location || !category || !price) return;
    const tones = ["beach", "sunset", "night"];
    setPlaces((current) => [...current, {
      name,
      location,
      category,
      price: `₹${Number(price).toLocaleString("en-IN")}`,
      votes: 0,
      tone: tones[current.length % tones.length],
    }]);
    setAddingSuggestion(false);
  };

  const sortedPlaces = [...places].sort((a, b) =>
    b.votes + Number(votedPlaces.includes(b.name)) - a.votes - Number(votedPlaces.includes(a.name)));

  return (
    <section className="panel places-panel">
      <div className="panel-heading"><div><p className="eyebrow">GOA WEEKEND</p><h2>Discover places</h2><p className="places-intro">Vote for the places you want to visit. Your group’s favorites rise to the top.</p></div><button className="primary-button" onClick={() => setAddingSuggestion((open) => !open)}><Plus size={16} /> Add suggestion</button></div>
      {addingSuggestion && (
        <form className="suggestion-form" onSubmit={addSuggestion}>
          <label>Place name<input name="name" required placeholder="e.g. Palolem Beach" /></label>
          <label>Category<input name="category" required placeholder="Beach, restaurant..." /></label>
          <label>Location<input name="location" required placeholder="Area, city" /></label>
          <label>Price per person (₹)<input name="price" type="number" min="0" required placeholder="1000" /></label>
          <button type="button" className="secondary-button" onClick={() => setAddingSuggestion(false)}>Cancel</button>
          <button type="submit" className="primary-button"><Plus size={15} /> Add place</button>
        </form>
      )}
      <div className="place-grid">
        {sortedPlaces.map((place) => (
          <article className="place-card" key={place.name}>
            <div className={`place-image ${place.tone}`}><span className="budget-badge">Within budget</span><button className={savedPlaces.includes(place.name) ? "save-place saved" : "save-place"} aria-label={`${savedPlaces.includes(place.name) ? "Unsave" : "Save"} ${place.name}`} aria-pressed={savedPlaces.includes(place.name)} onClick={() => toggleSaved(place.name)}><Heart size={17} fill={savedPlaces.includes(place.name) ? "currentColor" : "none"} /></button></div>
            <div className="place-body">
              <span className="place-category">{place.category}</span>
              <h3>{place.name}</h3>
              <p><MapPin size={14} /> {place.location}</p>
              <div className="place-footer">
                <div><strong>{place.price}</strong><span> / person</span></div>
                <button className={votedPlaces.includes(place.name) ? "vote-button voted" : "vote-button"} aria-pressed={votedPlaces.includes(place.name)} onClick={() => toggleVote(place.name)}>
                  <Check size={15} /> {votedPlaces.includes(place.name) ? "You voted" : "Vote"}
                </button>
              </div>
              <div className="place-vote-summary"><AvatarStack compact /><span>{place.votes + (votedPlaces.includes(place.name) ? 1 : 0)} votes from your group</span><b>{place.votes + (votedPlaces.includes(place.name) ? 1 : 0)}</b></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TasksPanel() {
  const [tasks, setTasks] = useState([
    { name: "Book resort", owner: "Sarah", due: "Dec 16", priority: "High", status: "To do" },
    { name: "Arrange airport pickup", owner: "Rahul", due: "Dec 17", priority: "Medium", status: "To do" },
    { name: "Create shared itinerary", owner: "Laasya Reddy", due: "Today", priority: "High", status: "In progress" },
    { name: "Confirm travel dates", owner: "Janny", due: "Dec 12", priority: "Low", status: "Completed" },
  ]);
  const [addingTask, setAddingTask] = useState(false);
  const columns = [
    { title: "To do", tone: "todo" },
    { title: "In progress", tone: "progress" },
    { title: "Completed", tone: "done" },
  ];
  const createTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("task") ?? "").trim();
    if (!name) return;
    setTasks((current) => [...current, {
      name,
      owner: String(formData.get("owner")),
      due: String(formData.get("due")) || "No deadline",
      priority: String(formData.get("priority")),
      status: "To do",
    }]);
    setAddingTask(false);
  };

  return (
    <>
    {addingTask && <form className="task-create-form" onSubmit={createTask}><label>Task<input name="task" required placeholder="What needs to get done?" /></label><label>Owner<select name="owner" defaultValue="Laasya Reddy">{members.map((member) => <option key={member.name}>{member.name}</option>)}</select></label><label>Deadline<input name="due" type="date" /></label><label>Priority<select name="priority" defaultValue="Medium"><option>High</option><option>Medium</option><option>Low</option></select></label><button type="button" className="secondary-button" onClick={() => setAddingTask(false)}>Cancel</button><button type="submit" className="primary-button"><Plus size={15} /> Create task</button></form>}
    <section className="tasks-board">
      {columns.map((column) => (
        <div className="task-column" key={column.title}>
          <div className="task-column-heading"><div><span className={`task-dot ${column.tone}`} /><h3>{column.title}</h3></div><b>{tasks.filter((task) => task.status === column.title).length}</b></div>
          {tasks.filter((task) => task.status === column.title).map((task) => (
            <article className="task-card" key={task.name}>
              <div className="task-card-top"><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span><MoreHorizontal size={17} /></div>
              <h4>{task.name}</h4>
              <div className="task-card-footer"><span><UserRound size={14} /> {task.owner === "Laasya Reddy" ? "Laasya" : task.owner}</span><span><Clock3 size={14} /> {task.due}</span></div>
            </article>
          ))}
          <button className="add-task" onClick={() => setAddingTask(true)}><Plus size={16} /> Add task</button>
        </div>
      ))}
    </section>
    </>
  );
}

type ChecklistScope = "personal" | "group";
type ChecklistItem = {
  id: string;
  name: string;
  category: string;
  checked: boolean;
  broughtBy: string | null;
};

const checklistStorageKey = "squadup-trip-checklists-v1";
const checklistDefaults: Record<ChecklistScope, ChecklistItem[]> = {
  personal: [
    { id: "personal-id", name: "ID / passport", category: "Essentials", checked: false, broughtBy: null },
    { id: "personal-phone", name: "Phone and charger", category: "Essentials", checked: false, broughtBy: null },
    { id: "personal-medicine", name: "Personal medicines", category: "Essentials", checked: false, broughtBy: null },
    { id: "personal-sunscreen", name: "Sunscreen and toiletries", category: "Toiletries", checked: false, broughtBy: null },
    { id: "personal-clothes", name: "Clothes for each day", category: "Clothing", checked: false, broughtBy: null },
    { id: "personal-water", name: "Reusable water bottle", category: "Essentials", checked: false, broughtBy: null },
  ],
  group: [
    { id: "group-speaker", name: "Bluetooth speaker", category: "Shared gear", checked: false, broughtBy: null },
    { id: "group-first-aid", name: "First-aid kit", category: "Essentials", checked: false, broughtBy: null },
    { id: "group-power-bank", name: "Portable power bank", category: "Shared gear", checked: false, broughtBy: null },
    { id: "group-cards", name: "Cards or a travel game", category: "Activities", checked: false, broughtBy: null },
    { id: "group-towels", name: "Beach towels", category: "Shared gear", checked: false, broughtBy: null },
  ],
};

function isChecklistItem(value: unknown): value is ChecklistItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === "string"
    && typeof item.name === "string"
    && typeof item.category === "string"
    && typeof item.checked === "boolean"
    && (typeof item.broughtBy === "string" || item.broughtBy === null);
}

function ChecklistPanel({ initialScope = "personal" }: { initialScope?: ChecklistScope }) {
  const [scope, setScope] = useState<ChecklistScope>(initialScope);
  const [lists, setLists] = useState<Record<ChecklistScope, ChecklistItem[]>>(checklistDefaults);
  const [groupMembers, setGroupMembers] = useState(["Laasya", "Sarah", "Rahul", "Janny"]);
  const [ready, setReady] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [memberError, setMemberError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(checklistStorageKey);
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (parsed && typeof parsed === "object") {
            const value = parsed as Record<string, unknown>;
            setLists({
              personal: Array.isArray(value.personal) && value.personal.every(isChecklistItem) ? value.personal : checklistDefaults.personal,
              group: Array.isArray(value.group) && value.group.every(isChecklistItem) ? value.group : checklistDefaults.group,
            });
            if (Array.isArray(value.groupMembers) && value.groupMembers.every((member) => typeof member === "string")) {
              const savedMembers = value.groupMembers.map((member) => member.trim()).filter(Boolean);
              if (savedMembers.length) setGroupMembers(savedMembers);
            }
          } else {
            console.error("Could not load saved trip checklists: unexpected data format.");
          }
        }
      } catch (error) {
        console.error("Could not load saved trip checklists:", error);
      } finally {
        setReady(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(checklistStorageKey, JSON.stringify({ ...lists, groupMembers }));
    } catch (error) {
      console.error("Could not save trip checklists:", error);
    }
  }, [lists, groupMembers, ready]);

  const items = lists[scope];
  const completedCount = items.filter((item) => item.checked).length;
  const updateItems = (update: (current: ChecklistItem[]) => ChecklistItem[]) => {
    setLists((current) => ({ ...current, [scope]: update(current[scope]) }));
  };
  const addItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("item") ?? "").trim();
    if (!name) return;
    updateItems((current) => [...current, {
      id: crypto.randomUUID(),
      name,
      category: String(formData.get("category") ?? "Essentials"),
      checked: false,
      broughtBy: null,
    }]);
    event.currentTarget.reset();
    setAddingItem(false);
  };
  const addGroupMember = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = String(new FormData(form).get("member") ?? "").trim();
    if (!name) return;
    if (groupMembers.some((member) => member.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      setMemberError("This member is already on the list.");
      return;
    }
    setGroupMembers((current) => [...current, name]);
    setMemberError("");
    form.reset();
    setAddingMember(false);
  };

  return (
    <section className="panel checklist-panel">
      <div className="panel-heading checklist-heading">
        <div>
          <p className="checklist-trip-label"><ClipboardCheck size={14} /> GOA WEEKEND <span>·</span> {scope === "group" ? "SHARED LIST" : "PACKING LIST"}</p>
          <h2>{scope === "group" ? "Group checklist" : "Your checklist"}</h2>
          <p className="checklist-description">{scope === "group" ? "Share the load: claim gear you can bring, then mark it ready." : "A handy packing starter list. Check things off and add anything you need."}</p>
        </div>
        <button className="primary-button checklist-add-button" onClick={() => setAddingItem((open) => !open)}><Plus size={16} /><span>Add item</span></button>
      </div>
      <div className="checklist-toolbar">
        <div className="checklist-switch" role="tablist" aria-label="Checklist type">
          <button role="tab" aria-selected={scope === "personal"} className={scope === "personal" ? "active" : ""} onClick={() => setScope("personal")}><UserRound size={15} /> For you</button>
          <button role="tab" aria-selected={scope === "group"} className={scope === "group" ? "active" : ""} onClick={() => setScope("group")}><Users size={15} /> For group</button>
        </div>
        <span className="checklist-progress"><strong>{completedCount}</strong> of {items.length} items ready</span>
      </div>
      <div className="checklist-progress-track" role="progressbar" aria-label="Checklist progress" aria-valuemin={0} aria-valuemax={items.length} aria-valuenow={completedCount}>
        <span style={{ width: `${items.length ? completedCount / items.length * 100 : 0}%` }} />
      </div>
      {scope === "group" && (
        <div className="checklist-members">
          <div className="checklist-member-heading">
            <div><span className="checklist-member-title">Your crew <b>{groupMembers.length}</b></span><p>Assign shared items to someone in your group.</p></div>
            <button className="checklist-add-member" aria-expanded={addingMember} onClick={() => { setAddingMember((open) => !open); setMemberError(""); }}><UserPlus size={15} /> <span>{addingMember ? "Close" : "Add people"}</span></button>
          </div>
          <div className="checklist-member-list">{groupMembers.map((member) => <span className="checklist-member-chip" key={member}><span aria-hidden="true">{member.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span>{member}</span>)}</div>
          {addingMember && (
            <form className="checklist-member-form" onSubmit={addGroupMember}>
              <div className="checklist-member-form-copy"><strong>Add someone to the list</strong><small>They’ll be available for assigning shared items.</small></div>
              <label className="sr-only" htmlFor="checklist-member-name">Member name</label>
              <input id="checklist-member-name" name="member" required maxLength={40} autoFocus placeholder="Enter their name" />
              <button className="primary-button" type="submit"><Plus size={14} /> Add person</button>
              {memberError && <p role="alert">{memberError}</p>}
            </form>
          )}
        </div>
      )}
      {addingItem && (
        <form className="checklist-add-form" onSubmit={addItem}>
          <label>What do you need?<input name="item" required maxLength={80} autoFocus placeholder={scope === "group" ? "e.g. Portable speaker" : "e.g. Sunglasses"} /></label>
          <label>Category<select name="category" defaultValue={scope === "group" ? "Shared gear" : "Essentials"}><option>Essentials</option><option>Clothing</option><option>Toiletries</option><option>Shared gear</option><option>Food &amp; supplies</option><option>Activities</option><option>Other</option></select></label>
          <button type="button" className="secondary-button" onClick={() => setAddingItem(false)}>Cancel</button>
          <button type="submit" className="primary-button"><Plus size={15} /> Add to list</button>
        </form>
      )}
      <div className="checklist-items">
        {items.map((item) => (
          <article className={`checklist-item${item.checked ? " checked" : ""}`} key={item.id}>
            <label className="checklist-item-main">
              <input type="checkbox" checked={item.checked} onChange={(event) => updateItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, checked: event.target.checked } : entry))} />
              <span className="checklist-item-icon"><Package size={17} /></span>
              <span className="checklist-item-copy"><strong>{item.name}</strong><small>{item.category}</small></span>
            </label>
            {scope === "group" && (
              <select className={`checklist-claim${item.broughtBy ? " claimed" : ""}`} aria-label={`Assign who brings ${item.name}`} value={item.broughtBy ?? ""} onChange={(event) => updateItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, broughtBy: event.target.value || null } : entry))}>
                <option value="">Who’s bringing?</option>
                {groupMembers.map((member) => <option key={member} value={member}>{member}</option>)}
              </select>
            )}
            <button className="checklist-remove" aria-label={`Remove ${item.name}`} onClick={() => updateItems((current) => current.filter((entry) => entry.id !== item.id))}><Trash2 size={16} /></button>
          </article>
        ))}
        {items.length === 0 && <div className="checklist-empty"><ClipboardCheck size={24} /><strong>Your list is clear</strong><span>Add an item so nothing gets left behind.</span></div>}
      </div>
      <p className="checklist-note"><span /> Your lists are saved in this browser on this device.</p>
    </section>
  );
}

type MemoryPhoto = {
  caption: string;
  date: string;
  by: string;
  scene: string;
  src?: string;
};

function MemoriesPanel() {
  const [filter, setFilter] = useState("Everyone");
  const [uploadedPhotos, setUploadedPhotos] = useState<MemoryPhoto[]>([]);
  const photoUrls = useRef<string[]>([]);
  const memories: MemoryPhoto[] = [
    { caption: "Sunset at the beach", date: "Dec 18 · Day 1", by: "Sarah", scene: "scene-one" },
    { caption: "First night out", date: "Dec 18 · Day 1", by: "Rahul", scene: "scene-two" },
    { caption: "Slow mornings", date: "Dec 19 · Day 2", by: "Janny", scene: "scene-three" },
    { caption: "The whole crew", date: "Dec 19 · Day 2", by: "Laasya Reddy", scene: "scene-four" },
  ];

  useEffect(() => () => photoUrls.current.forEach((url) => URL.revokeObjectURL(url)), []);

  const addPhotos = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []).filter((file) => file.type.startsWith("image/"));
    const newPhotos = files.map((file) => {
      const src = URL.createObjectURL(file);
      photoUrls.current.push(src);
      return {
        caption: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        date: "Just now",
        by: "Laasya Reddy",
        scene: "uploaded-photo",
        src,
      };
    });
    setUploadedPhotos((current) => [...current, ...newPhotos]);
    event.currentTarget.value = "";
  };

  const photos = [...uploadedPhotos, ...memories];
  const visiblePhotos = filter === "Everyone" ? photos : photos.filter((photo) => photo.by === filter);
  const filters = ["Everyone", "Laasya Reddy", "Sarah", "Rahul", "Janny"];

  return (
    <section className="panel memories-panel">
      <div className="panel-heading memories-heading">
        <div><p className="eyebrow">GOA WEEKEND</p><h2>Trip memories</h2><p className="places-intro">Little moments, saved together. {photos.length} photos in this album.</p></div>
        <label className="primary-button upload-button"><ImagePlus size={17} /> Add photos<input type="file" accept="image/*" multiple onChange={addPhotos} /></label>
      </div>
      <div className="memory-filters" role="group" aria-label="Filter memories by member">
        {filters.map((member) => <button key={member} className={filter === member ? "memory-filter active" : "memory-filter"} onClick={() => setFilter(member)}>{member === "Laasya Reddy" ? "Laasya" : member}</button>)}
      </div>
      {visiblePhotos.length > 0 ? (
        <div className="memory-grid">
          {visiblePhotos.map((photo, index) => (
            <article className="memory-card" key={`${photo.caption}-${photo.date}-${index}`}>
              <div className={`memory-image ${photo.scene}`} style={photo.src ? { backgroundImage: `url("${photo.src}")` } : undefined}>
                {!photo.src && <span className="memory-sun" />}
                {!photo.src && <span className="memory-horizon" />}
                {!photo.src && <span className="memory-landscape" />}
                <span className="memory-day">{photo.date.split(" · ")[0]}</span>
              </div>
              <div className="memory-caption"><div><h3>{photo.caption}</h3><span>{photo.date}</span></div><Avatar member={members.find((member) => member.name === photo.by) ?? members[3]} size={30} /></div>
            </article>
          ))}
        </div>
      ) : (
        <div className="memory-empty"><Camera size={24} /><h3>No moments from {filter} yet</h3><p>Choose another person or add a photo to the album.</p></div>
      )}
      <p className="memory-note">Photos you add are saved in this browser preview only.</p>
    </section>
  );
}

export function LandingPage({ navigate }: { navigate: (screen: string) => void }) {
  const features = [
    { icon: Users, title: "Plan together", description: "Bring your crew, ideas, and plans into one shared space." },
    { icon: WalletCards, title: "Split the costs", description: "Track shared spending and settle up without the awkward math." },
    { icon: Camera, title: "Keep the memories", description: "Save the moments, places, and little details you’ll talk about later." },
  ];

  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="landing-orb orb-one" /><div className="landing-orb orb-two" />
        <div className="landing-copy">
          <span className="landing-kicker"><Sparkles size={14} /> GOOD PLANS, BETTER TOGETHER</span>
          <h1>Your people.<br /><span>Your next great story.</span></h1>
          <p>Trips, get-togethers, and everything in between — plan it all with your favorite people in one happy place.</p>
          <div className="landing-actions"><button className="primary-button" onClick={() => navigate("Sign up")}>Get started <ChevronRight size={17} /></button></div>
          <div className="landing-social"><AvatarStack compact /><span>Made for the memories you make together</span></div>
        </div>
        <div className="landing-preview">
          <div className="landing-preview-top"><div><span className="status-dot" /> NEXT ADVENTURE</div><span>•••</span></div>
          <div className="landing-trip-art"><span>GOA, INDIA</span><strong>Goa Weekend</strong><small>Dec 18 – 20 · 4 friends</small><div className="landing-trip-sun" /><div className="landing-trip-wave wave-one" /><div className="landing-trip-wave wave-two" /></div>
          <div className="landing-preview-bottom"><div><span>Trip budget</span><strong>₹12,000</strong></div><div className="landing-members"><AvatarStack compact /></div></div>
        </div>
      </section>
      <section className="landing-features"><div><p className="eyebrow">EVERYTHING IN ONE PLACE</p><h2>More time together. Less time coordinating.</h2></div><div className="feature-grid">{features.map((feature) => { const Icon = feature.icon; return <article className="feature-card" key={feature.title}><span><Icon size={20} /></span><h3>{feature.title}</h3><p>{feature.description}</p></article>; })}</div></section>
      <div className="landing-signin">Already have an account? <button onClick={() => navigate("Log in")}>Log in</button></div>
    </div>
  );
}

export function AuthScreen({ navigate, signupInitially = true }: { navigate: (screen: string) => void; signupInitially?: boolean }) {
  const [signup, setSignup] = useState(signupInitially);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const configured = isSupabaseConfigured();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (new URLSearchParams(window.location.search).get("error") === "callback") {
        setErrorMessage("Google sign-in could not be completed. Check the Supabase redirect URL and try again.");
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const startGoogleSignIn = async () => {
    setPending(true);
    setErrorMessage("");
    try {
      const { data, error } = await createClient().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
      if (!data.url) throw new Error("Supabase did not return a Google sign-in URL.");
      window.location.assign(data.url);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not start Google sign-in.");
      setPending(false);
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setErrorMessage("");
    setNotice("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const supabase = createClient();
      if (signup) {
        const name = String(formData.get("name") ?? "").trim();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        if (data.session) {
          navigate("Onboarding");
        } else {
          setNotice("Check your inbox to confirm your email, then sign in to continue.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("Home");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Authentication failed. Please try again.");
    }
    setPending(false);
  };
  return (
    <section className="auth-layout">
      <div className="auth-art"><div className="brand"><BrandMark /><span>SquadUp</span></div><div><span className="landing-kicker"><Sparkles size={14} /> YOUR PLANS, TOGETHER</span><h1>Make room<br />for more <span>together.</span></h1><p>All the good stuff — plans, people, and memories — right where your group needs it.</p></div><div className="auth-art-stamp"><Users size={20} /><span>Your crew’s new favorite place</span></div></div>
      <div className="auth-form-wrap">
        <button className="auth-back" onClick={() => navigate("Landing Page")}>← Back to SquadUp</button>
        <div className="auth-form-card">
          <p className="eyebrow">WELCOME TO SQUADUP</p>
          <h2>{signup ? "Create your account" : "Welcome back"}</h2>
          <p className="auth-subtitle">{signup ? "Start planning something worth remembering." : "Your people and plans are right where you left them."}</p>
          {!configured && <p className="auth-feedback error" role="alert">Connect Supabase by adding its URL and publishable key to <code>.env.local</code>. See the Supabase setup steps in README.md.</p>}
          {errorMessage && <p className="auth-feedback error" role="alert">{errorMessage}</p>}
          {notice && <p className="auth-feedback success" role="status">{notice}</p>}
          <button className="google-auth-button" type="button" onClick={startGoogleSignIn} disabled={!configured || pending}>
            <span className="google-mark" aria-hidden="true">G</span> Continue with Google
          </button>
          <div className="auth-divider"><span>or continue with email</span></div>
          <form onSubmit={submit}>
            {signup && <label>Your name<input name="name" autoComplete="name" required placeholder="Laasya Reddy" disabled={!configured || pending} /> </label>}
            <label>Email address<span className="auth-input-icon"><Mail size={16} /><input name="email" type="email" autoComplete="email" required placeholder="you@example.com" disabled={!configured || pending} /></span></label>
            <label>Password<input name="password" type="password" autoComplete={signup ? "new-password" : "current-password"} minLength={8} required placeholder="At least 8 characters" disabled={!configured || pending} /></label>
            <button className="primary-button auth-submit" type="submit" disabled={!configured || pending}>{pending ? "Please wait…" : signup ? "Create account" : "Log in"} {!pending && <ChevronRight size={17} />}</button>
          </form>
          <p className="auth-switch">{signup ? "Already have an account?" : "New to SquadUp?"} <button onClick={() => { setSignup((value) => !value); setErrorMessage(""); setNotice(""); }}>{signup ? "Log in" : "Create an account"}</button></p>
        </div>
      </div>
    </section>
  );
}

export function OnboardingScreen({ navigate }: { navigate: (screen: string) => void }) {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;
    createClient().auth.getUser().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setErrorMessage(error.message);
        return;
      }
      const metadataName = data.user.user_metadata?.full_name;
      if (typeof metadataName === "string") setFullName(metadataName);
    }).catch((error: unknown) => {
      if (active) setErrorMessage(error instanceof Error ? error.message : "Could not load your profile.");
    });
    return () => { active = false; };
  }, []);

  const finishOnboarding = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setErrorMessage("");
    const formData = new FormData(event.currentTarget);
    try {
      const { error } = await createClient().auth.updateUser({
        data: {
          full_name: fullName,
          default_currency: String(formData.get("currency")),
          planning_interest: String(formData.get("interest")),
          notification_preference: formData.get("reminders") === "on" ? "Email & push" : "Off",
          onboarding_complete: true,
        },
      });
      if (error) throw error;
      navigate("Home");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not save your profile.");
      setPending(false);
    }
  };

  return (
    <section className="onboarding-layout">
      <div className="onboarding-top"><div className="brand"><BrandMark /><span>SquadUp</span></div><button className="auth-back" onClick={() => navigate("Login / Signup")}>Save and come back</button></div>
      <div className="onboarding-card">
        <div className="onboarding-progress"><span style={{ width: `${step * 50}%` }} /></div>
        <p className="eyebrow">A LITTLE ABOUT YOU · STEP {step} OF 2</p>
        {errorMessage && <p className="auth-feedback error" role="alert">{errorMessage}</p>}
        {step === 1 ? (
          <>
            <div className="onboarding-avatar"><Avatar member={members[3]} size={78} /><button aria-label="Add profile photo"><Camera size={15} /></button></div>
            <h1>What should we call you?</h1>
            <p className="auth-subtitle">Your friends will see this on your shared plans.</p>
            <form onSubmit={(event) => { event.preventDefault(); setStep(2); }}>
              <label>Your name<input name="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required /></label>
              <label>Profile picture<input type="file" accept="image/*" /></label>
              <button className="primary-button auth-submit" type="submit">Next <ChevronRight size={17} /></button>
            </form>
          </>
        ) : (
          <>
            <h1>Make it yours.</h1>
            <p className="auth-subtitle">You can always change these preferences later.</p>
            <form onSubmit={finishOnboarding}>
              <label>Default currency<select name="currency" defaultValue="INR"><option value="INR">Indian Rupee (₹)</option><option value="USD">US Dollar ($)</option><option value="EUR">Euro (€)</option><option value="GBP">British Pound (£)</option></select></label>
              <label>What do you like planning?<select name="interest" defaultValue="Trips"><option>Trips</option><option>Food & outings</option><option>Events & celebrations</option><option>A little bit of everything</option></select></label>
              <label className="preference-check"><input name="reminders" type="checkbox" defaultChecked /> Send me useful group reminders</label>
              <div className="onboarding-actions"><button type="button" className="secondary-button" onClick={() => setStep(1)} disabled={pending}>Back</button><button type="submit" className="primary-button" disabled={pending}>{pending ? "Saving…" : "Finish setup"} {!pending && <Check size={16} />}</button></div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

const groupModules = ["Overview", "Places", "Itinerary", "Tasks", "Checklist", "Expenses", "Settlement", "Memories"];

function GroupWorkspace({ active, navigate }: { active: string; navigate: (screen: string) => void }) {
  const currentModule = active.replace("Group ", "");
  const selectModule = (name: string) => navigate(name === "Overview" ? "Group Overview" : `Group ${name}`);
  return (
    <div className="workspace-page">
      <div className="workspace-cover"><span>GOA, INDIA · DEC 18–20</span><div><p>YOUR NEXT ADVENTURE</p><h1>Goa Weekend</h1></div><div className="workspace-cover-sun" /><div className="workspace-cover-hill hill-one" /><div className="workspace-cover-hill hill-two" /></div>
      <section className="workspace-intro"><div><div className="workspace-title-row"><h2>Goa Weekend</h2><span className="workspace-status"><span /> Planning</span></div><p><MapPin size={15} /> Goa, India <span>·</span> <CalendarDays size={15} /> Dec 18–20 <span>·</span> <WalletCards size={15} /> ₹12,000 budget</p></div><div className="workspace-members"><AvatarStack /><span>4 friends</span><button className="secondary-button"><Plus size={15} /> Invite</button></div></section>
      <nav className="workspace-tabs" aria-label="Group workspace navigation">{groupModules.map((name) => <button key={name} className={currentModule === name ? "workspace-tab active" : "workspace-tab"} onClick={() => selectModule(name)}>{name}</button>)}</nav>
      {currentModule === "Overview" && <div className="workspace-grid"><section className="panel workspace-updates"><div className="panel-heading"><div><p className="eyebrow">YOUR GROUP</p><h2>Trip overview</h2></div><button className="secondary-button"><Plus size={15} /> Add update</button></div><div className="workspace-member-list"><h3>Your crew</h3>{members.map((member) => <div key={member.name}><Avatar member={member} size={34} /><span><strong>{member.name}</strong><small>{member.name === "Laasya Reddy" ? "You" : "Group member"}</small></span><Check size={16} /></div>)}</div><div className="workspace-activity"><h3>Recent updates</h3><p><span className="activity-dot lavender" /> Sarah added Hotel advance <small> · 5m ago</small></p><p><span className="activity-dot blue" /> Rahul joined the group <small> · 2h ago</small></p><p><span className="activity-dot peach" /> You created this trip <small> · Yesterday</small></p></div></section><div className="workspace-summary"><ExpenseOverview /><section className="panel next-up-card"><p className="eyebrow">UP NEXT</p><h3>Plan the perfect day</h3><p>Add your first activity to the shared itinerary.</p><button className="text-link" onClick={() => selectModule("Itinerary")}>Open itinerary <ChevronRight size={15} /></button></section></div></div>}
      {currentModule === "Places" && <PlacesPanel />}
      {currentModule === "Itinerary" && <ItineraryPanel />}
      {currentModule === "Tasks" && <TasksPanel />}
      {currentModule === "Checklist" && <ChecklistPanel initialScope="group" />}
      {currentModule === "Expenses" && <ExpenseOverview full />}
      {currentModule === "Settlement" && <SettlementPanel />}
      {currentModule === "Memories" && <MemoriesPanel />}
    </div>
  );
}

type ItineraryActivity = {
  time: string;
  title: string;
  place: string;
  kind: string;
  icon: typeof Utensils;
};

function ItineraryPanel() {
  const [day, setDay] = useState(1);
  const [addingActivity, setAddingActivity] = useState(false);
  const [plansByDay, setPlansByDay] = useState<Record<number, ItineraryActivity[]>>({
    1: [
      { time: "9:00 AM", title: "Breakfast by the beach", place: "Baga Beach Shack", kind: "Food", icon: Utensils },
      { time: "11:30 AM", title: "Check in & settle down", place: "Casa Anjuna · Hotel", kind: "Stay", icon: Hotel },
      { time: "4:00 PM", title: "Sunset at the fort", place: "Chapora Fort", kind: "Explore", icon: CompassRose },
      { time: "7:30 PM", title: "Dinner with the whole crew", place: "Thalassa, Vagator", kind: "Food", icon: Utensils },
    ],
    2: [],
    3: [],
  });
  const addActivity = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const place = String(formData.get("place") ?? "").trim();
    if (!title || !place) return;
    const kind = String(formData.get("kind") ?? "Explore");
    const icon = kind === "Food" ? Utensils : kind === "Stay" ? Hotel : CompassRose;
    const timeValue = String(formData.get("time") ?? "");
    const time = timeValue ? new Date(`2000-01-01T${timeValue}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "Time TBD";
    setPlansByDay((current) => ({ ...current, [day]: [...(current[day] ?? []), { title, place, kind, icon, time }] }));
    setAddingActivity(false);
  };
  const plans = plansByDay[day] ?? [];
  return (
    <section className="panel itinerary-panel">
      <div className="panel-heading"><div><p className="eyebrow">GOA WEEKEND · DEC 18–20</p><h2>Trip itinerary</h2><p className="places-intro">A shared plan for the days you’ll remember.</p></div><button className="primary-button" onClick={() => setAddingActivity((open) => !open)}><Plus size={16} /> Add activity</button></div>
      {addingActivity && <form className="activity-create-form" onSubmit={addActivity}><label>Activity<input name="title" required placeholder="What are you doing?" /></label><label>Place<input name="place" required placeholder="Where?" /></label><label>Day<select value={day} onChange={(event) => setDay(Number(event.target.value))}><option value={1}>Fri, Dec 18</option><option value={2}>Sat, Dec 19</option><option value={3}>Sun, Dec 20</option></select></label><label>Time<input name="time" type="time" /></label><label>Type<select name="kind"><option>Explore</option><option>Food</option><option>Stay</option></select></label><button type="button" className="secondary-button" onClick={() => setAddingActivity(false)}>Cancel</button><button type="submit" className="primary-button"><Plus size={15} /> Add to day</button></form>}
      <div className="itinerary-days">{[1,2,3].map((number) => <button key={number} className={day === number ? "itinerary-day active" : "itinerary-day"} onClick={() => setDay(number)}><span>DAY 0{number}</span><strong>{number === 1 ? "Fri, Dec 18" : number === 2 ? "Sat, Dec 19" : "Sun, Dec 20"}</strong></button>)}</div>
      {plans.length > 0 ? <div className="timeline">{plans.map((plan, index) => { const Icon = plan.icon; return <article className="timeline-item" key={`${plan.title}-${index}`}><div className="timeline-time">{plan.time}</div><div className="timeline-rail"><span><Icon size={16} /></span></div><div className="timeline-card"><div><span className="place-category">{plan.kind}</span><h3>{plan.title}</h3><p><MapPin size={14} /> {plan.place}</p></div><AvatarStack compact /></div></article>; })}</div> : <div className="itinerary-empty"><CalendarDays size={23} /><h3>Day {day} is open</h3><p>Add a place or activity and make it yours.</p><button className="secondary-button" onClick={() => setAddingActivity(true)}><Plus size={15} /> Add an activity</button></div>}
    </section>
  );
}

function SettlementPanel() {
  const [paid, setPaid] = useState<string[]>([]);
  const balances = [
    { from: "Rahul", to: "Sarah", amount: "₹650", initials: "RA", color: "#C7D2FE" },
    { from: "Laasya Reddy", to: "Maya", amount: "₹350", initials: "LR", color: "#3730A3" },
  ];
  const remaining = balances
    .filter((balance) => !paid.includes(balance.from))
    .reduce((total, balance) => total + Number(balance.amount.replace(/[^\d]/g, "")), 0);
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

  return (
    <div className="settlement-page">
      <section className="settlement-hero">
        <div>
          <p className="eyebrow">GOA WEEKEND · SETTLE UP</p>
          <h2>{remaining === 0 ? "Everyone’s all square." : "One last step to all square."}</h2>
          <p>{remaining === 0 ? "All suggested repayments are marked as paid." : "Mark repayments as paid as your group settles up."}</p>
        </div>
        <div className="settlement-total"><span>Still to settle</span><strong>{formatCurrency(remaining)}</strong></div>
      </section>
      <section className="panel settlement-panel">
        <div className="panel-heading">
          <div><p className="eyebrow">SUGGESTED SETTLEMENTS</p><h2>Who owes whom</h2></div>
          <span className="settlement-count">{balances.length - paid.length} payments left</span>
        </div>
        <div className="settlement-list">
          {balances.map((balance) => {
            const isPaid = paid.includes(balance.from);
            return (
              <article className={`settlement-row ${isPaid ? "settlement-paid" : ""}`} key={balance.from}>
                <Avatar member={{ name: balance.from, initials: balance.initials, color: balance.color, white: balance.from === "Laasya Reddy" }} size={40} />
                <div className="settlement-people"><strong>{balance.from}</strong><span>pays</span><strong>{balance.to}</strong></div>
                <strong className="settlement-amount">{balance.amount}</strong>
                <button className={isPaid ? "secondary-button repayment-button paid" : "secondary-button repayment-button"} onClick={() => setPaid((current) => isPaid ? current.filter((name) => name !== balance.from) : [...current, balance.from])}>
                  {isPaid ? <><Check size={15} /> Paid</> : "Mark paid"}
                </button>
              </article>
            );
          })}
        </div>
        <p className="settlement-note">Payments are recorded in this preview only. No money moves through SquadUp.</p>
      </section>
      <section className="panel settlement-history">
        <p className="eyebrow">HOW WE GOT HERE</p><h2>Expense summary</h2>
        <div><span>Total shared spending</span><strong>₹4,500</strong></div>
        <div><span>Settled so far</span><strong className="green-text">₹{(3500 + (1000 - remaining)).toLocaleString("en-IN")}</strong></div>
        <div><span>Remaining balance</span><strong>{formatCurrency(remaining)}</strong></div>
      </section>
    </div>
  );
}

function SectionView({
  active,
  navigate,
  openCreate,
  groups,
  profileName,
  profileEmail,
  defaultCurrency,
  defaultNotifications,
  saveProfile,
}: {
  active: string;
  navigate: (screen: string) => void;
  openCreate: () => void;
  groups: TripGroup[];
  profileName: string;
  profileEmail: string;
  defaultCurrency: string;
  defaultNotifications: string;
  saveProfile: (name: string, email: string) => Promise<string | void>;
}) {
  const router = useRouter();
  const [editingProfile, setEditingProfile] = useState(false);
  const [draftName, setDraftName] = useState(profileName);
  const [draftEmail, setDraftEmail] = useState(profileEmail);
  const [currency, setCurrency] = useState(defaultCurrency);
  const [notificationPreference, setNotificationPreference] = useState(defaultNotifications);
  const [savedMessage, setSavedMessage] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const persistProfile = async () => {
    setSavingProfile(true);
    setSavedMessage("");
    try {
      const message = await saveProfile(draftName.trim() || profileName, draftEmail.trim() || profileEmail);
      setEditingProfile(false);
      setSavedMessage(message ?? "Saved");
      window.setTimeout(() => setSavedMessage(""), 4000);
    } catch (error) {
      setSavedMessage(error instanceof Error ? `Could not save: ${error.message}` : "Could not save profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const persistPreference = async (
    field: "default_currency" | "notification_preference",
    value: string,
    setValue: (value: string) => void,
  ) => {
    setSavingProfile(true);
    setSavedMessage("");
    try {
      const { error } = await createClient().auth.updateUser({ data: { [field]: value } });
      if (error) throw error;
      setValue(value);
      setSavedMessage("Saved");
      window.setTimeout(() => setSavedMessage(""), 2500);
    } catch (error) {
      setSavedMessage(error instanceof Error ? `Could not save: ${error.message}` : "Could not save preference.");
    } finally {
      setSavingProfile(false);
    }
  };

  const signOut = async () => {
    setSavingProfile(true);
    setSavedMessage("");
    try {
      const { error } = await createClient().auth.signOut();
      if (error) throw error;
      router.replace("/");
      router.refresh();
    } catch (error) {
      setSavedMessage(error instanceof Error ? `Could not sign out: ${error.message}` : "Could not sign out.");
    } finally {
      setSavingProfile(false);
    }
  };

  if (active === "Group Overview" || active.startsWith("Group ")) return <GroupWorkspace active={active} navigate={navigate} />;
  if (active === "Groups") return (
    <div className="standalone-page"><div className="welcome-row"><div><p>COLLABORATE</p><h1>My groups</h1></div><button className="primary-button" onClick={openCreate}><Plus size={18} /> Create group</button></div><div className="group-grid full"><GroupCard onOpen={() => navigate("Group Overview")} />{groups.map((group) => <GroupCard key={group.id} group={group} onOpen={() => navigate("Group Overview")} />)}</div></div>
  );
  if (active === "Discover") return <PlacesPanel />;
  if (active === "Tasks") return <div className="standalone-page"><div className="welcome-row"><div><p>GOA WEEKEND</p><h1>Tasks & responsibilities</h1></div><button className="primary-button"><Plus size={18} /> Add task</button></div><TasksPanel /></div>;
  if (active === "Checklist") return <div className="standalone-page"><ChecklistPanel /></div>;
  if (active === "Itinerary") return <div className="standalone-page"><ItineraryPanel /></div>;
  if (active === "Settlement") return <div className="standalone-page"><div className="welcome-row"><div><p>SHARED EXPENSES</p><h1>Settlement</h1></div></div><SettlementPanel /></div>;
  if (active === "Memories") return <div className="standalone-page"><MemoriesPanel /></div>;
  if (active === "Expenses") return <div className="standalone-page"><div className="welcome-row"><div><p>ALL GROUPS</p><h1>Expenses</h1></div></div><ExpenseOverview full /></div>;
  if (active === "Notifications") return (
    <div className="standalone-page"><div className="welcome-row"><div><p>UPDATES</p><h1>Notifications</h1></div><button className="text-link">Mark all as read</button></div><section className="panel notification-list"><div className="notification-row unread"><span className="notification-icon lavender"><ReceiptText size={18} /></span><div><strong>Sarah added a hotel expense</strong><p>₹2,500 added to Goa Weekend</p></div><time>5m ago</time></div><div className="notification-row"><span className="notification-icon blue"><Users size={18} /></span><div><strong>Rahul joined your group</strong><p>Goa Weekend now has 4 members</p></div><time>2h ago</time></div><div className="notification-row"><span className="notification-icon peach"><ListTodo size={18} /></span><div><strong>Task due tomorrow</strong><p>Create shared itinerary</p></div><time>Yesterday</time></div></section></div>
  );
  if (active === "Profile") return (
    <div className="standalone-page">
      <div className="welcome-row"><div><p>ACCOUNT</p><h1>Profile &amp; settings</h1></div></div>
      <section className="panel profile-panel">
        <div className="profile-head">
          <Avatar member={{ ...members[3], name: profileName, initials: profileName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() }} size={72} />
          {editingProfile ? (
            <div className="profile-edit-fields">
              <label>Name<input value={draftName} onChange={(event) => setDraftName(event.target.value)} /></label>
              <label>Email<input type="email" value={draftEmail} onChange={(event) => setDraftEmail(event.target.value)} /></label>
            </div>
          ) : <div><h2>{profileName}</h2><p>{profileEmail}</p></div>}
          {editingProfile ? (
            <div className="profile-edit-actions">
              <button className="secondary-button" onClick={() => setEditingProfile(false)}>Cancel</button>
              <button className="primary-button" onClick={persistProfile} disabled={savingProfile}>{savingProfile ? "Saving…" : "Save"}</button>
            </div>
          ) : <button className="secondary-button" onClick={() => { setDraftName(profileName); setDraftEmail(profileEmail); setEditingProfile(true); }}>Edit profile</button>}
        </div>
        <div className="settings-grid">
          <label>Default currency<select value={currency} disabled={savingProfile} onChange={(event) => void persistPreference("default_currency", event.target.value, setCurrency)}><option value="INR">Indian Rupee (₹)</option><option value="USD">US Dollar ($)</option><option value="EUR">Euro (€)</option><option value="GBP">British Pound (£)</option></select></label>
          <label>Notification preference<select value={notificationPreference} disabled={savingProfile} onChange={(event) => void persistPreference("notification_preference", event.target.value, setNotificationPreference)}><option>Email & push</option><option>Push only</option><option>Email only</option><option>Off</option></select></label>
        </div>
        <div className="profile-footer"><button className="logout-button" onClick={signOut} disabled={savingProfile}><LogOut size={17} /> Sign out</button><span className="saved-message" role="status">{savedMessage}</span></div>
      </section>
    </div>
  );
  return null;
}

export function AppShell({
  initialProfileName,
  initialProfileEmail,
  initialCurrency,
  initialNotifications,
}: {
  initialProfileName: string;
  initialProfileEmail: string;
  initialCurrency: string;
  initialNotifications: string;
}) {
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [groups, setGroups] = useState<TripGroup[]>([]);
  const [profileName, setProfileName] = useState(initialProfileName);
  const [profileEmail, setProfileEmail] = useState(initialProfileEmail);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedTheme = window.localStorage.getItem("squadup-theme");
      if (savedTheme === "dark") setTheme("dark");
      setThemeReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("squadup-theme", theme);
  }, [theme, themeReady]);

  const toggleTheme = () => setTheme((current) => current === "light" ? "dark" : "light");

  return (
    <div className="app-shell">
      <Sidebar active={active} setActive={setActive} open={menuOpen} setOpen={setMenuOpen} />
      <div className="app-main">
        <Header setMenuOpen={setMenuOpen} setActive={setActive} profileName={profileName} profileEmail={profileEmail} theme={theme} toggleTheme={toggleTheme} />
        <main className="content">
            {active === "Home" ? <Dashboard openGroup={() => setActive("Group Overview")} openCreate={() => setCreateOpen(true)} groups={groups} /> : <SectionView active={active} navigate={setActive} openCreate={() => setCreateOpen(true)} groups={groups} profileName={profileName} profileEmail={profileEmail} defaultCurrency={initialCurrency} defaultNotifications={initialNotifications} saveProfile={async (name, email) => {
              const { data, error } = await createClient().auth.updateUser({ email, data: { full_name: name } });
              if (error) throw error;
              setProfileName(name);
              if (data.user.email) setProfileEmail(data.user.email);
              return email !== profileEmail ? "Profile saved. Confirm your new email if prompted." : "Saved";
            }} />}
        </main>
      </div>
      {createOpen && <CreateGroupModal close={() => setCreateOpen(false)} onCreate={(group) => setGroups((current) => [group, ...current])} />}
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {["Home", "Groups", "Checklist", "Expenses", "Memories"].map((label) => {
          const item = navItems.find((navItem) => navItem.label === label);
          if (!item) return null;
          const Icon = item.icon;
          return <button key={item.label} className={active === item.label ? "active" : ""} onClick={() => setActive(item.label)}><Icon size={20} /><span>{item.label === "Notifications" ? "Alerts" : item.label}</span></button>;
        })}
      </nav>
    </div>
  );
}

export default function LandingRoute() {
  const router = useRouter();
  return <main className="public-route"><LandingPage navigate={(screen) => router.push(screen === "Sign up" ? "/auth?mode=signup" : screen === "Log in" ? "/auth?mode=login" : "/home")} /></main>;
}
