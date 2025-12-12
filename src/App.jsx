import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Star, Plus, X, Search, Filter } from 'lucide-react';
import './styles/index.css'; // global styles

export default function App() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    location: '',
    category: 'music',
    description: '',
    image: ''
  });

  const categories = {
    music: 'Muzika',
    sport: 'Sportas',
    culture: 'Kultūra',
    food: 'Maistas',
    education: 'Švietimas',
    other: 'Kita'
  };

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const result = await window.storage?.get('events-list');
        if (result) {
          const loadedEvents = JSON.parse(result.value);
          setEvents(loadedEvents);
          setFilteredEvents(loadedEvents);
        } else {
          const sampleEvents = [
            {
              id: 1,
              title: 'Vasaros Festivalis 2025',
              date: '2025-07-15',
              location: 'Senamiesčio aikštė',
              category: 'music',
              description: 'Kasmetinis vasaros muzikos festivalis su įvairiomis grupėmis. Bus atlikėjai iš visos Lietuvos, maisto mugė ir linksmybės visai šeimai.',
              ratings: [5, 4, 5, 5, 4],
              image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop'
            },
            {
              id: 2,
              title: 'Futbolo Čempionatas',
              date: '2025-08-20',
              location: 'Stadionas Žalgiris',
              category: 'sport',
              description: 'Regioninis futbolo čempionatas su dalyviais iš viso miesto ir apylinkių.',
              ratings: [4, 4, 5, 3],
              image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop'
            },
            {
              id: 3,
              title: 'Knygų Mugė',
              date: '2025-09-10',
              location: 'Kultūros centras',
              category: 'culture',
              description: 'Daugiau nei 100 leidyklų, susitikimai su rašytojais ir edukacinės programos.',
              ratings: [5, 5, 5, 4, 5],
              image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=400&fit=crop'
            },
            {
              id: 4,
              title: 'Kulinarijos Festas',
              date: '2025-10-05',
              location: 'Laisvės alėja',
              category: 'food',
              description: 'Geriausių restoranų ir maisto vagonėlių festivalis, skanus maistas ir gėrimai.',
              ratings: [4, 3, 5, 4],
              image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop'
            },
            {
              id: 5,
              title: 'Technologijų Konferencija',
              date: '2025-11-15',
              location: 'Technopolis',
              category: 'education',
              description: 'Naujausios technologijos ir inovacijos, paskaitos bei workshopai.',
              ratings: [5, 5, 4, 5],
              image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop'
            },
            {
              id: 6,
              title: 'Senamiesčio Turgus',
              date: '2025-12-01',
              location: 'Senamiestis',
              category: 'other',
              description: 'Rankų darbo gaminių ir vietinių ūkininkų produktų turgus.',
              ratings: [3, 4, 4, 3],
              image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop'
            },
          ];
          setEvents(sampleEvents);
          setFilteredEvents(sampleEvents);
          await window.storage?.set('events-list', JSON.stringify(sampleEvents));
        }
      } catch (error) {
        console.error('Klaida įkeliant renginius:', error);
        setEvents([]);
        setFilteredEvents([]);
      }
    };
    loadEvents();
  }, []);

  useEffect(() => {
    let filtered = events;
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterCategory !== 'all') {
      filtered = filtered.filter(event => event.category === filterCategory);
    }
    setFilteredEvents(filtered);
  }, [searchTerm, filterCategory, events]);

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.location || !newEvent.description) {
      alert('Prašome užpildyti visus privalomus laukus');
      return;
    }
    const event = { id: Date.now(), ...newEvent, ratings: [] };
    const updatedEvents = [...events, event];
    setEvents(updatedEvents);
    try {
      await window.storage?.set('events-list', JSON.stringify(updatedEvents));
    } catch (error) {
      console.error('Klaida išsaugant renginį:', error);
    }
    setNewEvent({ title: '', date: '', location: '', category: 'music', description: '', image: '' });
    setShowAddForm(false);
  };

  const handleRating = async (eventId, rating) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        return { ...event, ratings: [...(event.ratings || []), rating] };
      }
      return event;
    });
    setEvents(updatedEvents);
    try {
      await window.storage?.set('events-list', JSON.stringify(updatedEvents));
    } catch (error) {
      console.error('Klaida išsaugant įvertinimą:', error);
    }
  };

  const calculateAverage = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <div>
            <h1 className="text-4xl font-black gradient-text">Miesto Renginiai</h1>
            <p className="text-gray-600 mt-1">Atrask geriausius renginius savo mieste</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="button button-primary flex items-center gap-2 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
          >
            <Plus size={22} />
            <span className="font-semibold">Pridėti renginį</span>
          </button>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-10 border border-gray-200 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center max-w-4xl mx-auto">
          <div className="search-container relative max-w-md w-full mx-auto md:mx-0">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400" size={22} />
            <input
              type="text"
              placeholder="Ieškoti renginių pagal pavadinimą, vietą..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input text-gray-800"
              style={{ paddingLeft: '2.8rem' }} // adjust padding for icon
            />
          </div>
          <div className="relative max-w-xs w-full mx-auto md:mx-0">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400" size={22} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input appearance-none bg-white text-gray-800 font-medium cursor-pointer"
              style={{ paddingLeft: '2.8rem' }} // padding for icon
            >
              <option value="all">🎯 Visos kategorijos</option>
              {Object.entries(categories).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid-events max-w-7xl mx-auto px-2 md:px-0">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div key={event.id} className="card max-w-sm mx-auto md:max-w-none md:mx-0">
                {event.image && (
                  <div className="relative overflow-hidden h-56">
                    <img src={event.image} alt={event.title} />
                    <div className="absolute top-4 left-4">
                      <span className="badge">{categories[event.category]}</span>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1.5 rounded-full">
                      <Star className="text-white fill-white" size={16} />
                      <span className="font-bold text-white">{calculateAverage(event.ratings)}</span>
                      <span className="text-white text-sm">({event.ratings?.length || 0})</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 leading-tight">{event.title}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar size={18} className="text-indigo-500" />
                    <span className="text-sm font-medium">{new Date(event.date).toLocaleDateString('lt-LT', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin size={18} className="text-indigo-500" />
                    <span className="text-sm font-medium">{event.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">{event.description}</p>
                  <div className="border-t-2 border-gray-100 pt-5">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Įvertinkite renginį:</p>
                    <div className="rating-stars flex gap-2 justify-center">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          onClick={() => handleRating(event.id, rating)}
                          className="p-1"
                        >
                          <Star
                            size={28}
                            className="text-yellow-400 hover:text-yellow-500 hover:fill-yellow-400 transition-colors"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div>😢</div>
              <p>Renginių nerasta</p>
              <p>Pabandykite pakeisti paieškos filtrus</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="p-6">
              <div className="modal-header">
                <h2>Pridėti naują renginį</h2>
                <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <div className="modal-body">
                {['title', 'date', 'location', 'description', 'image'].map((field, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field === 'image' ? 'Nuotraukos URL (nebūtina)' : `${field.charAt(0).toUpperCase() + field.slice(1)} *`}
                    </label>
                    {field === 'description' ? (
                      <textarea
                        required
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        rows={4}
                        className="input"
                      />
                    ) : (
                      <input
                        type={field === 'date' ? 'date' : field === 'image' ? 'url' : 'text'}
                        required={field !== 'image'}
                        value={newEvent[field]}
                        onChange={(e) => setNewEvent({ ...newEvent, [field]: e.target.value })}
                        placeholder={field === 'image' ? 'https://example.com/image.jpg' : ''}
                        className="input"
                      />
                    )}
                  </div>
                ))}

                <div className="flex gap-4 pt-4">
                  <button onClick={handleAddEvent} className="button button-primary flex-1">
                    Pridėti renginį
                  </button>
                  <button onClick={() => setShowAddForm(false)} className="button button-secondary flex-1">
                    Atšaukti
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
