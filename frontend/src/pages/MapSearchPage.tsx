<<<<<<< Updated upstream
import React, { useState, useMemo, Suspense, lazy } from 'react';
import { Filter, Map as MapIcon, ChevronDown, Check, X, ArrowRight, Search, SlidersHorizontal, Star } from 'lucide-react';
import { HOSPITALS } from '../data/mockData';
=======
import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Map as MapIcon, ChevronDown, Check, X, ArrowRight, Search, SlidersHorizontal, Star, Loader2 } from 'lucide-react';
import { Hospital } from '../data/mockData';
>>>>>>> Stashed changes
import { HospitalCard } from '../components/HospitalCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { PATHWAY_NAMES, PATHWAY_TO_TREATMENT_ID, calculateBestTreatment, ProjectionResult, searchHospitals } from '../lib/api';

<<<<<<< Updated upstream
// Dynamically import Leaflet map to avoid SSR issues
const LeafletMap = lazy(() => import('../components/LeafletMap').then(m => ({ default: m.LeafletMap })));
=======
// Map Component with Rating Pins
const MapView = ({ hospitals, hoveredId, selectedIds, onSelect, onHover }: any) => {
  // Calculate bounds
  const lats = hospitals.map((h: any) => h.coordinates.lat);
  const lngs = hospitals.map((h: any) => h.coordinates.lng);
  const minLat = Math.min(...lats) - 0.05;
  const maxLat = Math.max(...lats) + 0.05;
  const minLng = Math.min(...lngs) - 0.05;
  const maxLng = Math.max(...lngs) + 0.05;

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden">
      {/* Map Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#cbd5e1_1px,transparent_1px),linear-gradient(90deg,#cbd5e1_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      {/* Pins */}
      {hospitals.map((hospital: any) => {
        const latPercent = (hospital.coordinates.lat - minLat) / (maxLat - minLat) * 100;
        const lngPercent = (hospital.coordinates.lng - minLng) / (maxLng - minLng) * 100;

        const isSelected = selectedIds.includes(hospital.id);
        const isHovered = hoveredId === hospital.id;

        // Rating Color Logic
        let ratingColor = "bg-slate-400";
        if (hospital.metrics.overallRating >= 4.5) ratingColor = "bg-green-500";
        else if (hospital.metrics.overallRating >= 3.5) ratingColor = "bg-yellow-500";
        else if (hospital.metrics.overallRating >= 3.0) ratingColor = "bg-orange-500";
        else ratingColor = "bg-red-500";

        return (
          <div
            key={hospital.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10"
            style={{ bottom: `${latPercent}%`, left: `${lngPercent}%` }}
            onMouseEnter={() => onHover(hospital.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(hospital.id)}
          >
            <div className={cn(
              "flex flex-col items-center group",
              isHovered || isSelected ? "scale-110 z-50" : "scale-100"
            )}>
               <div className={cn(
                 "px-2 py-1 rounded-md shadow-lg border-2 transition-colors flex items-center gap-1",
                 isSelected ? "bg-[#E91E63] border-white text-white ring-2 ring-[#E91E63]/30" :
                 isHovered ? "bg-white border-[#E91E63] text-slate-900" : "bg-white border-slate-200 text-slate-700"
               )}>
                 <span className={cn("font-bold text-xs", isSelected ? "text-white" : "text-slate-900")}>{hospital.metrics.overallRating}</span>
                 <Star className={cn("h-3 w-3 fill-current", isSelected ? "text-white" : "text-yellow-400")} />
               </div>

               {/* Arrow */}
               <div className={cn(
                 "w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px]",
                 isSelected ? "border-t-[#E91E63]" :
                 isHovered ? "border-t-white" : "border-t-white"
               )}></div>

               {/* Tooltip on Hover */}
               {(isHovered || isSelected) && (
                 <div className="absolute bottom-14 bg-white p-3 rounded-lg shadow-xl border w-48 text-center z-50 pointer-events-none animate-in fade-in zoom-in duration-200 origin-bottom">
                    <div className="font-bold text-sm text-slate-900 truncate">{hospital.name}</div>
                    <div className="flex justify-between items-center mt-2 text-xs text-slate-500 border-t pt-2">
                       <span>{hospital.distance > 0 ? `${hospital.distance} mi` : 'Nearby'}</span>
                       <span className="font-bold text-[#00BFB3]">
                         {hospital.metrics.estOutOfPocket > 0 ? `$${hospital.metrics.estOutOfPocket}` : 'N/A'}
                       </span>
                    </div>
                 </div>
               )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
>>>>>>> Stashed changes

const SIMULATION_STORAGE_KEY = 'carecompass_simulation_results';

const getUserZip = (): string => {
  try {
    const saved = localStorage.getItem('carecompass_profile');
    if (saved) {
      const profile = JSON.parse(saved);
      return profile.zip_code || '';
    }
  } catch (err) {
    console.error('Error reading profile:', err);
  }
  return '';
};

export function MapSearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userZip, setUserZip] = useState('');

  // Fetch hospitals from backend on mount
  useEffect(() => {
    const zip = getUserZip();
    setUserZip(zip);
    if (!zip) {
      setLoading(false);
      setError('Please set your ZIP code in your profile first.');
      return;
    }
    setLoading(true);
    searchHospitals(zip)
      .then(data => {
        setHospitals(data.hospitals);
        setLoading(false);
      })
      .catch(err => {
        console.error('Hospital search error:', err);
        setError('Failed to load hospitals. Is the backend running?');
        setLoading(false);
      });
  }, []);

  // Get the best pathway - try from navigation state first, then calculate from localStorage
  const getBestPathway = (): string | null => {
    // First check if passed directly via navigation state
    const statePathway = location.state?.bestPathway as string | undefined;
    if (statePathway) return statePathway;

    // Otherwise, load simulation results from localStorage and calculate
    try {
      const stored = localStorage.getItem(SIMULATION_STORAGE_KEY);
      if (stored) {
        const results = JSON.parse(stored) as ProjectionResult;
        return calculateBestTreatment(results.pathways);
      }
    } catch (err) {
      console.error('Error loading simulation results from localStorage:', err);
    }
    return null;
  };

  const bestPathway = getBestPathway();
  const recommendedTreatmentId = bestPathway ? PATHWAY_TO_TREATMENT_ID[bestPathway] : null;
  const recommendedTreatmentName = bestPathway ? PATHWAY_NAMES[bestPathway] : null;

  // Sort hospitals: prioritize those offering the recommended treatment, then by rating
  const sortedHospitals = useMemo(() => {
    if (!recommendedTreatmentId) {
      return [...hospitals].sort((a, b) => b.metrics.overallRating - a.metrics.overallRating);
    }

    return [...hospitals].sort((a, b) => {
      const aOffers = a.offersTreatments.includes(recommendedTreatmentId);
      const bOffers = b.offersTreatments.includes(recommendedTreatmentId);

      // Sort by: offers treatment first, then by rating
      if (aOffers && !bOffers) return -1;
      if (!aOffers && bOffers) return 1;
      return b.metrics.overallRating - a.metrics.overallRating;
    });
  }, [recommendedTreatmentId, hospitals]);

  const handleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id].slice(-3) // Max 3 to compare
    );
  };

  // Check if map can be displayed (hospitals have real coordinates)
  const hasCoordinates = hospitals.some(h => h.coordinates.lat !== 0 || h.coordinates.lng !== 0);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">

      {/* Top Search Bar */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm z-30">
        <div className="flex items-center gap-4 text-sm">
          <div className="font-bold text-slate-900 flex items-center gap-2">
             <span className="bg-slate-100 p-1.5 rounded-md"><Search className="h-4 w-4 text-slate-500" /></span>
             Breast Cancer Treatment Centers
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">{userZip || 'No ZIP set'} &bull; nearby</span>
        </div>
        <div className="hidden md:flex items-center gap-2">
           {bestPathway ? (
             <>
               <Badge variant="outline" className="text-slate-500 border-slate-200">
                 Recommended: {recommendedTreatmentName}
               </Badge>
               <Button variant="link" className="text-[#00BFB3] text-xs px-0 h-auto" onClick={() => navigate('/simulate')}>
                 View Results
               </Button>
             </>
           ) : (
             <Badge variant="outline" className="text-slate-500 border-slate-200">
               All Treatment Plans
             </Badge>
           )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Panel: Sidebar */}
        <div className="w-full md:w-[400px] flex flex-col border-r bg-white shadow-xl z-20 relative">

          {/* Filters */}
          <div className="p-4 border-b bg-white space-y-3">
             <div className="flex justify-between items-center">
                <h2 className="font-bold text-slate-800">Filter Results</h2>
                <Button variant="ghost" size="sm" className="h-8 text-slate-500 hover:text-[#00BFB3]">
                  Reset
                </Button>
             </div>

             <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                   <label className="text-xs font-medium text-slate-500">Distance</label>
                   <input type="range" className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00BFB3]" />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-medium text-slate-500">Min Rating</label>
                   <input type="range" className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#E91E63]" />
                </div>
             </div>

             <div className="flex gap-2 pt-2 overflow-x-auto pb-1 scrollbar-hide">
                <Badge variant="secondary" className="cursor-pointer hover:bg-slate-100 border border-slate-200 bg-white text-slate-600 font-normal">
                  In-Network Only
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-slate-100 border border-slate-200 bg-white text-slate-600 font-normal">
                  Academic Center
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-slate-100 border border-slate-200 bg-white text-slate-600 font-normal">
                  Lowest Cost
                </Badge>
             </div>
          </div>

          {/* Sticky Compare Bar (conditionally rendered at top of list) */}
          {selectedIds.length > 0 && (
            <div className="bg-[#E91E63]/10 border-b border-[#E91E63]/20 p-3 sticky top-0 z-10 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-[#E91E63]">{selectedIds.length} Selected to Compare</span>
                <Button variant="ghost" size="sm" className="h-6 text-xs text-slate-500 hover:text-red-500" onClick={() => setSelectedIds([])}>
                  Clear All
                </Button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {selectedIds.map(id => {
                   const h = hospitals.find(h => h.id === id);
                   return (
                     <div key={id} className="bg-white border border-[#E91E63]/30 rounded-md px-2 py-1 text-xs flex items-center gap-1 shadow-sm min-w-[100px] justify-between">
                       <span className="truncate max-w-[80px] font-medium text-slate-700">{h?.name}</span>
                       <X className="h-3 w-3 cursor-pointer text-slate-400 hover:text-red-500" onClick={() => handleSelect(id)} />
                     </div>
                   );
                })}
              </div>
              <Button
                className="w-full bg-[#E91E63] hover:bg-[#D81B60] text-white font-semibold shadow-md shadow-pink-500/20 mt-2"
                size="sm"
                onClick={() => navigate('/compare')}
                disabled={selectedIds.length < 2}
              >
                Compare These Centers <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
             {loading && (
               <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                 <Loader2 className="h-8 w-8 animate-spin mb-3 text-[#00BFB3]" />
                 <p className="text-sm">Loading hospitals near {userZip}...</p>
               </div>
             )}
             {error && (
               <div className="text-center py-12">
                 <p className="text-red-500 text-sm mb-3">{error}</p>
                 <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                   Go to Profile
                 </Button>
               </div>
             )}
             {!loading && !error && hospitals.length === 0 && (
               <div className="text-center py-12 text-slate-500">
                 <p className="text-sm">No hospitals found near ZIP code {userZip}.</p>
               </div>
             )}
             {!loading && !error && hospitals.length > 0 && (
               <>
                 <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                   <span>{sortedHospitals.length} providers found</span>
                   <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800">
                     Sort by: <strong>{bestPathway ? 'Recommended Treatment' : 'Rating'}</strong> <ChevronDown className="h-3 w-3" />
                   </div>
                 </div>

                 {sortedHospitals.map(hospital => {
                   const offersRecommended = recommendedTreatmentId ? hospital.offersTreatments.includes(recommendedTreatmentId) : false;
                   return (
                     <div key={hospital.id} className="relative">
                       {offersRecommended && bestPathway && (
                         <div className="absolute -top-2 -left-2 z-10">
                           <Badge className="bg-[#E91E63] text-white text-xs shadow-md">Offers Recommended</Badge>
                         </div>
                       )}
                       <HospitalCard
                         hospital={hospital}
                         isSelected={selectedIds.includes(hospital.id)}
                         onSelect={handleSelect}
                         onHover={setHoveredId}
                         isMapHovered={hoveredId === hospital.id}
                       />
                     </div>
                   );
                 })}
               </>
             )}

             {/* End of list spacer */}
             <div className="h-10"></div>
          </div>
        </div>

        {/* Right Panel: Map */}
        <div className="hidden md:block flex-1 h-full relative">
<<<<<<< Updated upstream
          <Suspense fallback={
            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
              <p className="text-slate-500">Loading map...</p>
            </div>
          }>
            <LeafletMap
=======
          {hasCoordinates ? (
            <MapView
>>>>>>> Stashed changes
              hospitals={sortedHospitals}
              hoveredId={hoveredId}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onHover={setHoveredId}
            />
<<<<<<< Updated upstream
          </Suspense>
=======
          ) : (
            <div className="flex items-center justify-center h-full bg-slate-50">
              <div className="text-center text-slate-400">
                <MapIcon className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-medium">Map view unavailable</p>
                <p className="text-xs mt-1">Hospital coordinates not available in dataset</p>
              </div>
            </div>
          )}
>>>>>>> Stashed changes

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
             <Button variant="secondary" size="icon" className="bg-white shadow-md rounded-lg hover:bg-slate-50">
               <MapIcon className="h-5 w-5 text-slate-600" />
             </Button>
             <Button variant="secondary" size="icon" className="bg-white shadow-md rounded-lg hover:bg-slate-50">
               <SlidersHorizontal className="h-5 w-5 text-slate-600" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
