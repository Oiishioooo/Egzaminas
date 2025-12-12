import React, { useEffect, useMemo, useState } from "react";
import { Calendar, MapPin, Star, Plus, X, Search, Filter } from "lucide-react";
import "./styles/index.css";

/** Storage wrapper: uses window.storage if available, otherwise localStorage */
const storage = {
  async get(key) {
    try {
      if (window.storage?.get) return await window.storage.get(key);
      const value = localStorage.getItem(key);
      return value ? { value } : null;
    } catch {
      return null;
    }
  },
  async set(key, value) {
    try {
      if (window.storage?.set) return await window.storage.set(key, value);
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
};

const CATEGORIES = {
  music: "Muzika",
  sport: "Sportas",
  culture: "Kultūra",
  food: "Maistas",
  education: "Švietimas",
  other: "Kita",
};

const SAMPLE_EVENTS = [
  {
    id: 1,
    title: "Vasaros Festivalis 2025",
    date: "2025-07-15",
    location: "Senamiesčio aikštė",
    category: "music",
    description:
      "Kasmetinis vasaros muzikos festivalis su įvairiomis grupėmis. Bus atlikėjai iš visos Lietuvos, maisto mugė ir linksmybės visai šeimai.",
    ratings: [5, 4, 5, 5, 4],
    image:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Futbolo Čempionatas",
    date: "2025-08-20",
    location: "Stadionas Žalgiris",
    category: "sport",
    description:
      "Regioninis futbolo čempionatas su dalyviais iš viso miesto ir apylinkių.",
    ratings: [4, 4, 5, 3],
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Knygų Mugė",
    date: "2025-09-10",
    location: "Kultūros centras",
    category: "culture",
    description:
      "Daugiau nei 100 leidyklų, susitikimai su rašytojais ir edukacinės programos.",
    ratings: [5, 5, 5, 4, 5],
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Kulinarijos Festas",
    date: "2025-10-05",
    location: "Laisvės alėja",
    category: "food",
    description:
      "Geriausių restoranų ir maisto vagonėlių festivalis, skanus maistas ir gėrimai.",
    ratings: [4, 3, 5, 4],
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop",
  },
  {
    id: 5,
    title: "Technologijų Konferencija",
    date: "2025-11-15",
    location: "Technopolis",
    category: "education",
    description: "Naujausios technologijos ir inovacijos, paskaitos bei workshopai.",
    ratings: [5, 5, 4, 5],
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop",
  },
  {
    id: 6,
    title: "Senamiesčio Turgus",
    date: "2025-12-01",
    location: "Senamiestis",
    category: "other",
    description: "Rankų darbo gaminių ir vietinių ūkininkų produktų turgus.",
    ratings: [3, 4, 4, 3],
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop",
  },
];

function avgRating(ratings = []) {
  if (!ratings.length) return "0.0";
  const sum = ratings.reduce((a, b) => a + b, 0);
  return (sum / ratings.length).toFixed(1);
}

function formatLT(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("lt-LT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function IconInput({ icon: Icon, children }) {
  return (
    <div className="iconInput">
      <Icon className="iconInput__icon" size={20} />
      {children}
    </div>
  );
}

function RatingBadge({ ratings }) {
  const count = ratings?.length || 0;
  return (
    <div className="ratingBadge" title={`Įvertinimų: ${count}`}>
      <Star className="ratingBadge__star" size={16} />
      <span className="ratingBadge__avg">{avgRating(ratings)}</span>
      <span className="ratingBadge__count">({count})</span>
    </div>
  );
}

function EventCard({ event, onRate }) {
  return (
    <article className="eventCard">
      <div className="eventCard__media">
        {event.image ? (
          <img className="eventCard__img" src={event.image} alt={event.title} loading="lazy" />
        ) : (
          <div className="eventCard__imgFallback">
            <span>🎉</span>
          </div>
        )}

        <div className="eventCard__topRow">
          <span className="badge">{CATEGORIES[event.category] || "Kita"}</span>
          <RatingBadge ratings={event.ratings} />
        </div>
      </div>

      <div className="eventCard__body">
        <h3 className="eventCard__title">{event.title}</h3>

        <div className="eventMeta">
          <div className="eventMeta__row">
            <Calendar size={18} className="eventMeta__icon" />
            <span>{formatLT(event.date)}</span>
          </div>
          <div className="eventMeta__row">
            <MapPin size={18} className="eventMeta__icon" />
            <span>{event.location}</span>
          </div>
        </div>

        <p className="eventCard__desc">{event.description}</p>

        <div className="eventCard__footer">
          <p className="eventCard__rateLabel">Įvertinkite renginį:</p>
          <div className="starsRow" role="group" aria-label="Įvertinimas nuo 1 iki 5">
            {[1, 2, 3, 4, 5].map((r) => (
              <button key={r} type="button" className="starBtn" onClick={() => onRate(event.id, r)}>
                <Star size={26} className="starBtn__icon" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modalOverlay" onMouseDown={onClose} role="presentation">
      <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <header className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button type="button" className="iconBtn" onClick={onClose} aria-label="Uždaryti">
            <X size={22} />
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [events, setEvents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    location: "",
    category: "music",
    description: "",
    image: "",
  });

  useEffect(() => {
    (async () => {
      const result = await storage.get("events-list");
      if (result?.value) {
        try {
          const loaded = JSON.parse(result.value);
          setEvents(Array.isArray(loaded) ? loaded : []);
          return;
        } catch {
          // fall through to sample
        }
      }
      setEvents(SAMPLE_EVENTS);
      await storage.set("events-list", JSON.stringify(SAMPLE_EVENTS));
    })();
  }, []);

  const filteredEvents = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    let list = [...events];

    // sort by date asc (nice UX)
    list.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (s) {
      list = list.filter((e) => {
        const hay = `${e.title} ${e.location} ${e.description}`.toLowerCase();
        return hay.includes(s);
      });
    }
    if (filterCategory !== "all") {
      list = list.filter((e) => e.category === filterCategory);
    }
    return list;
  }, [events, searchTerm, filterCategory]);

  const saveEvents = async (next) => {
    setEvents(next);
    await storage.set("events-list", JSON.stringify(next));
  };

  const handleAddEvent = async () => {
    const { title, date, location, description } = newEvent;
    if (!title || !date || !location || !description) {
      alert("Prašome užpildyti visus privalomus laukus");
      return;
    }
    const event = { id: Date.now(), ...newEvent, ratings: [] };
    await saveEvents([event, ...events]);
    setNewEvent({
      title: "",
      date: "",
      location: "",
      category: "music",
      description: "",
      image: "",
    });
    setShowAddForm(false);
  };

  const handleRating = async (eventId, rating) => {
    const next = events.map((e) =>
      e.id === eventId ? { ...e, ratings: [...(e.ratings || []), rating] } : e
    );
    await saveEvents(next);
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="container topbar__inner">
          <div className="topbar__left">
            <h1 className="title">Miesto Renginiai</h1>
            <p className="subtitle">Atrask geriausius renginius savo mieste</p>
          </div>

          <button type="button" className="btn btn--primary" onClick={() => setShowAddForm(true)}>
            <Plus size={20} />
            Pridėti renginį
          </button>
        </div>
      </header>

      <main className="container main">
        <section className="panel">
          <IconInput icon={Search}>
            <input
              className="input input--withIcon"
              type="text"
              placeholder="Ieškoti pagal pavadinimą, vietą, aprašymą…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </IconInput>

          <IconInput icon={Filter}>
            <select
              className="input input--withIcon input--select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">🎯 Visos kategorijos</option>
              {Object.entries(CATEGORIES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </IconInput>
        </section>

        <section className="grid">
          {filteredEvents.length ? (
            filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} onRate={handleRating} />
            ))
          ) : (
            <div className="empty">
              <div className="empty__emoji">😢</div>
              <div className="empty__title">Renginių nerasta</div>
              <div className="empty__desc">Pabandykite pakeisti paiešką ar filtrus.</div>
            </div>
          )}
        </section>
      </main>

      {showAddForm && (
        <Modal title="Pridėti naują renginį" onClose={() => setShowAddForm(false)}>
          <div className="form">
            <div className="field">
              <label>Pavadinimas *</label>
              <input
                className="input"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>

            <div className="fieldRow">
              <div className="field">
                <label>Data *</label>
                <input
                  className="input"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Kategorija *</label>
                <select
                  className="input input--select"
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                >
                  {Object.entries(CATEGORIES).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label>Vieta *</label>
              <input
                className="input"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </div>

            <div className="field">
              <label>Aprašymas *</label>
              <textarea
                className="input textarea"
                rows={4}
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>

            <div className="field">
              <label>Nuotraukos URL (nebūtina)</label>
              <input
                className="input"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={newEvent.image}
                onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
              />
            </div>

            <div className="actions">
              <button type="button" className="btn btn--primary" onClick={handleAddEvent}>
                Pridėti renginį
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => setShowAddForm(false)}>
                Atšaukti
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
