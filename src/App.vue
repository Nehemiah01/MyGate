<script setup lang="ts">
  import { ref, onMounted, computed, onUnmounted } from 'vue';
  import { LMap, LTileLayer, LMarker, LPopup, LCircle } from "@vue-leaflet/vue-leaflet";
  import axios from 'axios';
  
  // --- Assets & Config ---
  const fontLink = document.createElement('link');
  fontLink.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);
  
  // --- State ---
  const zoom = ref(18);
  const center = ref<[number, number]>([6.5244, 3.3792]); 
  const markerLatLng = ref<[number, number]>([6.5244, 3.3792]);
  const accuracyRadius = ref(0);
  const address = ref("Waiting for GPS signal...");
  const landmark = ref("");
  const loading = ref(false);
  const showMap = ref(false);
  const showPermissionModal = ref(false);
  const deviceType = ref<'android' | 'ios'>('android');
  const isFocusingInput = ref(false);
  
  // UI State
  const isSheetExpanded = ref(true); 
  const selectedLayer = ref('Street View');
  
  // GPS Status
  const gpsStatus = ref("Waiting...");
  const gpsColor = ref("bg-gray-400");
  const gpsSignalStrength = ref(0);
  const currentYear = new Date().getFullYear(); // Dynamic Year
  
  const tileProviders = [
    {
      name: 'Street View',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap',
      maxZoom: 22, maxNativeZoom: 19  
    },
    {
      name: 'Satellite', 
      url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', 
      attribution: '© Google',
      maxZoom: 22, maxNativeZoom: 21 
    }
  ];
  
  // --- Logic ---
  let watchId: number | null = null;
  let lastUpdateTimestamp = 0;
  
  const toggleSheet = () => {
    isSheetExpanded.value = !isSheetExpanded.value;
  };
  
  const locateUser = () => {
    loading.value = true;
    showPermissionModal.value = false;
  
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const now = Date.now();
          if (now - lastUpdateTimestamp < 1000) return; 
          lastUpdateTimestamp = now;
  
          const { latitude, longitude, accuracy } = position.coords;
          accuracyRadius.value = accuracy;
  
          if (accuracy > 50) {
              gpsStatus.value = "Weak Signal";
              gpsColor.value = "bg-rose-500";
              gpsSignalStrength.value = 1;
          } else if (accuracy > 15) {
              gpsStatus.value = "Improving...";
              gpsColor.value = "bg-amber-500";
              gpsSignalStrength.value = 2;
          } else {
              gpsStatus.value = "Excellent Lock";
              gpsColor.value = "bg-emerald-500";
              gpsSignalStrength.value = 3;
          }
  
          if (address.value.includes("Waiting") || address.value.includes("Locating")) {
              center.value = [latitude, longitude];
              markerLatLng.value = [latitude, longitude];
              fetchAddress(latitude, longitude);
              if (zoom.value < 18) zoom.value = 18;
          }
  
          loading.value = false;
          
          if (accuracy < 4 && watchId !== null) {
              gpsStatus.value = "Precise";
              navigator.geolocation.clearWatch(watchId);
              watchId = null;
          }
        },
        (error) => {
          console.error(error);
          loading.value = false;
          showPermissionModal.value = true;
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation is not supported.");
      loading.value = false;
    }
  };
  
  let debounceTimer: any = null;
  const onMarkerDrag = (e: any) => {
    if (watchId !== null) { 
        navigator.geolocation.clearWatch(watchId); 
        watchId = null; 
        gpsStatus.value = "Manual Pin";
        gpsColor.value = "bg-slate-400";
        gpsSignalStrength.value = 3;
    }
  
    const { lat, lng } = e.target.getLatLng();
    markerLatLng.value = [lat, lng];
    
    if (debounceTimer) clearTimeout(debounceTimer);
    address.value = "Locating...";
    debounceTimer = setTimeout(() => {
      fetchAddress(lat, lng);
    }, 800);
  };
  
  const fetchAddress = async (lat: number, lng: number) => {
    loading.value = true;
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
          params: { format: 'json', lat, lon: lng, zoom: 18, addressdetails: 1 }
      });
      address.value = response.data?.display_name || "Unknown Road";
    } catch (error) {
      address.value = "Network error.";
    } finally {
      loading.value = false;
    }
  };
  
  const whatsappLink = computed(() => {
    const mapLink = `https://maps.google.com/?q=${markerLatLng.value[0]},${markerLatLng.value[1]}`;
    const text = `📦 *Delivery for MyGate*\n________________________\n📍 *Address:* ${address.value}\n🏛 *Landmark:* ${landmark.value || 'None'}\n🔗 *Map:* ${mapLink}\n\n_Please come straight to the gate._`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  });
  
  onMounted(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (/iPad|iPhone|iPod/.test(userAgent)) deviceType.value = 'ios';
    setTimeout(() => { showMap.value = true; locateUser(); }, 500);
  });
  
  onUnmounted(() => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
  });
  </script>
  
  <template>
    <div class="h-screen w-full bg-slate-50 relative overflow-hidden font-jakarta text-slate-800">
      
      <div v-if="showPermissionModal" class="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
          <div class="bg-rose-50 p-6 text-center">
            <div class="w-14 h-14 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-slate-800">Enable Location</h2>
            <p class="text-sm text-slate-500 mt-2">We can't find your gate without it.</p>
          </div>
          
          <div class="flex p-1 bg-slate-100 mx-6 mt-4 rounded-xl">
            <button @click="deviceType = 'android'" class="flex-1 py-2 text-xs font-bold rounded-lg transition-all" :class="deviceType === 'android' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'">Android</button>
            <button @click="deviceType = 'ios'" class="flex-1 py-2 text-xs font-bold rounded-lg transition-all" :class="deviceType === 'ios' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'">iPhone</button>
          </div>
  
          <div class="p-6 space-y-4">
            <div class="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100" v-for="(step, i) in (deviceType === 'android' ? ['Tap the Lock 🔒 icon in address bar', 'Tap Permissions', 'Toggle Location ON'] : ['Tap \'Aa\' in address bar', 'Tap Website Settings', 'Set Location to Allow'])" :key="i">
              <span class="flex-shrink-0 w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">{{i+1}}</span>
              <p class="text-sm text-slate-600 font-medium">{{step}}</p>
            </div>
          </div>
          
          <div class="p-4 bg-slate-50 flex gap-3 border-t border-slate-100">
            <button @click="showPermissionModal = false" class="flex-1 py-3.5 px-4 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition">Close</button>
            <button @click="locateUser" class="flex-1 py-3.5 px-4 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">Try Again</button>
          </div>
        </div>
      </div>
  
      <div class="absolute inset-0 z-0 bg-slate-100">
         
        <div class="absolute top-4 right-4 z-[998] flex flex-col items-end gap-3">
          <div class="bg-white/80 backdrop-blur-xl p-1 rounded-full shadow-xl border border-white/50 flex items-center">
              <button 
                  @click="selectedLayer = 'Street View'"
                  class="px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2"
                  :class="selectedLayer === 'Street View' ? 'bg-emerald-600 text-white shadow-md transform scale-105' : 'text-slate-500 hover:bg-slate-100'"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                  Map
              </button>
              <button 
                  @click="selectedLayer = 'Satellite'"
                  class="px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2"
                  :class="selectedLayer === 'Satellite' ? 'bg-emerald-600 text-white shadow-md transform scale-105' : 'text-slate-500 hover:bg-slate-100'"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Satellite
              </button>
          </div>
  
          <div class="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/50 flex items-center gap-2 transition-all duration-300">
             <div class="flex gap-0.5 items-end h-3">
                <div :class="['w-1 rounded-sm transition-all', gpsSignalStrength >= 1 ? gpsColor : 'bg-slate-200 h-1.5', gpsSignalStrength >= 1 ? 'h-1.5' : '']"></div>
                <div :class="['w-1 rounded-sm transition-all', gpsSignalStrength >= 2 ? gpsColor : 'bg-slate-200 h-2', gpsSignalStrength >= 2 ? 'h-2' : '']"></div>
                <div :class="['w-1 rounded-sm transition-all', gpsSignalStrength >= 3 ? gpsColor : 'bg-slate-200 h-3', gpsSignalStrength >= 3 ? 'h-3' : '']"></div>
             </div>
             <span class="text-[10px] font-bold text-slate-600 uppercase tracking-wide min-w-[60px]">{{ gpsStatus }}</span>
          </div>
        </div>
  
        <div v-if="!showMap" class="w-full h-full flex items-center justify-center text-slate-400 animate-pulse bg-slate-100">
           Loading Map Engine...
        </div>
  
        <l-map v-if="showMap" v-model:zoom="zoom" :center="center" :use-global-leaflet="false" :max-zoom="22" class="h-full w-full outline-none">
          <l-tile-layer 
              v-for="tile in tileProviders" 
              :key="tile.name" 
              :name="tile.name" 
              :visible="selectedLayer === tile.name" 
              :url="tile.url" 
              :attribution="tile.attribution" 
              :max-zoom="tile.maxZoom" 
              :max-native-zoom="tile.maxNativeZoom" 
              layer-type="base"
          ></l-tile-layer>
  
          <l-circle :lat-lng="markerLatLng" :radius="accuracyRadius" color="#10B981" :fill-opacity="0.1" :weight="1" class-name="animate-pulse-slow"/>
          <l-marker :lat-lng="markerLatLng" draggable @dragend="onMarkerDrag"><l-popup>Target Location</l-popup></l-marker>
        </l-map>
  
        <button @click="locateUser" class="absolute top-24 right-4 md:top-auto md:bottom-8 md:right-8 z-[800] bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 text-slate-700 hover:bg-slate-50 active:scale-90 transition-all duration-200 group">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 group-hover:text-emerald-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
      </div>
  
      <div class="absolute bottom-0 md:top-4 md:bottom-4 md:left-4 z-[900] w-full md:w-[420px] pointer-events-none flex flex-col justify-end md:justify-start md:h-[calc(100%-2rem)]">
        
        <div 
          class="pointer-events-auto bg-white/95 md:bg-white/85 backdrop-blur-xl w-full rounded-t-[2rem] md:rounded-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col border border-white/50 transition-all duration-300 ease-in-out md:h-full"
          :class="isSheetExpanded ? 'h-auto max-h-[60vh] md:h-full md:max-h-full' : 'h-auto pb-6 md:h-full'"
        >
          
          <div @click="toggleSheet" class="md:hidden w-full pt-4 pb-2 cursor-pointer active:opacity-70">
            <div class="w-12 h-1.5 bg-slate-300 rounded-full mx-auto"></div>
          </div>
  
          <div class="px-5 md:px-8 pt-1 md:pt-8 pb-3 flex items-center justify-between shrink-0">
             <div class="flex items-center gap-3">
               <div class="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
               </div>
               <div>
                 <h1 class="text-lg md:text-xl font-bold text-slate-800 leading-tight tracking-tight">My<span class="text-emerald-600">Gate</span></h1>
                 <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Delivery</p>
               </div>
             </div>
             
             <button @click="toggleSheet" class="md:hidden p-2 text-slate-400 hover:text-emerald-600 transition">
               <svg v-if="isSheetExpanded" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
               <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" /></svg>
             </button>
          </div>
  
          <div class="px-5 md:px-8 overflow-y-auto custom-scrollbar transition-all duration-300 md:flex-grow" :class="isSheetExpanded ? 'opacity-100 max-h-[50vh] md:max-h-full' : 'opacity-100 max-h-0 md:max-h-full md:opacity-100'">
            
            <div class="space-y-4 pb-4">
               <div class="space-y-1">
                <div class="flex justify-between items-center">
                   <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detected Location</label>
                   <span v-if="loading" class="text-[10px] font-bold text-emerald-600 animate-pulse flex items-center gap-1">
                     <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Updating
                   </span>
                </div>
                
                <div class="relative group">
                  <div class="absolute inset-0 bg-gradient-to-r from-emerald-50 to-white rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div class="relative bg-white/60 p-3.5 rounded-2xl border border-slate-100 shadow-sm group-hover:shadow-md transition-all duration-300">
                     <p class="text-slate-800 font-medium text-sm leading-relaxed line-clamp-2" :class="{'opacity-50': loading}">
                       {{ address }}
                     </p>
                  </div>
                </div>
              </div>
  
              <div class="space-y-1">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add Description <span class="text-rose-400">*</span></label>
                <div class="relative">
                  <input 
                    v-model="landmark"
                    @focus="isFocusingInput = true"
                    @blur="isFocusingInput = false"
                    type="text" 
                    placeholder="e.g. Black gate, near Mosque" 
                    class="w-full bg-white border-2 rounded-xl p-3.5 text-sm font-medium transition-all duration-300 placeholder-slate-300 outline-none"
                    :class="isFocusingInput ? 'border-emerald-500 ring-4 ring-emerald-500/10 shadow-lg' : 'border-slate-100 hover:border-emerald-200'"
                  />
                </div>
              </div>
            </div>
  
          </div>
  
          <div class="p-5 md:p-8 pt-0 mt-auto md:block space-y-4" :class="isSheetExpanded ? 'block' : 'hidden'">
             <a 
              :href="whatsappLink"
              target="_blank"
              class="group relative w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 overflow-hidden"
            >
              <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="relative flex items-center gap-2">
                <svg class="w-5 h-5 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-8.68-2.031-.967-.272-.099-.47-.149-.669.198-.198.347-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                <span>Send Location</span>
              </div>
            </a>
  
            <div class="flex flex-col items-center gap-1 opacity-60">
               <svg width="44" height="44" viewBox="0 0 256 256" fill="none" class="text-emerald-600 scale-">
                  <path d="M128 24C79.4 24 40 63.4 40 112C40 168 128 232 128 232C128 232 216 168 216 112C216 63.4 176.6 24 128 24Z" fill="currentColor"/>
                  <path d="M104 88V136M152 88V136M88 104H168M88 120H168M128 80V144" stroke="white" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
               </svg>
               <p class="text-[10px] text-slate-500 font-medium">&copy {{ currentYear }} MyGate. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style>
  .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
  .leaflet-pane { z-index: 1 !important; }
  .leaflet-pane img { max-width: none !important; } 
  .leaflet-control-container .leaflet-top.leaflet-right { top: 80px; right: 10px; }
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.1; transform: scale(1); }
    50% { opacity: 0.2; transform: scale(1.05); }
  }
  .animate-pulse-slow { animation: pulse-slow 3s infinite; }
  </style>