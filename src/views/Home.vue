<script setup lang="ts">
  import { ArrowRightIcon } from '@heroicons/vue/24/outline';
  
  // Using your provided illustrations
  import heroImage from '../assets/images/6.png'; // Woman hugging globe
  import pillarEnergy from '../assets/images/4.png'; // Industry on ice
  import pillarCircular from '../assets/images/5.png'; // Cleanup crew
  import pillarEducation from '../assets/images/2.png'; // Watering plant
  import pillarInclusivity from '../assets/images/1.png'; // Planting together
  
  const pillars = [
    {
      title: "Climate Action & Energy",
      desc: "Advancing renewable energy and direct climate action to combat environmental challenges.",
      image: pillarEnergy,
      accent: "brand-accent-3" // Red/Orange
    },
    {
      title: "Circular Economy",
      desc: "Creating resilient ecosystems by minimizing waste and promoting sustainable resource use.",
      image: pillarCircular,
      accent: "brand-accent-1" // Orange
    },
    {
      title: "Green Education",
      desc: "Equipping the next generation with the knowledge and skills for a sustainable future.",
      image: pillarEducation,
      accent: "brand-primary" // Green
    },
    {
      title: "Inclusive Development",
      desc: "Empowering women and underserved populations to lead transformative change.",
      image: pillarInclusivity,
      accent: "brand-accent-2" // Yellow
    }
  ];
  
  const team = [
    {
      name: "Feyisara Wahab", // Replace with actual name
      role: "Projects & Impact",
      image: "/team/feyi.jpg",
      bio: "Overseeing the execution of school clubs, bootcamps, and community outreach programs."
    },
    {
      name: "Morayo Agunbiade", // Replace with actual name from LinkedIn
      role: "Founder & Lead",
      image: "/team/moyo.png",
      bio: "Driving the strategic vision of GRF and fostering partnerships for sustainable development."
    },
    {
      name: "Bukola Adeyemi", // Replace with actual name
      role: "Advocacy & Outreach",
      image: "/team/bukola.png",
      bio: "Amplifying our voice and sharing the stories of our green champions across Africa."
    }
  ];
  
  const stats = [
    { label: 'Youths Empowered', value: '500+' },
    { label: 'Projects', value: '5+' },
    { label: 'SDGs Impacted', value: '8' },
  ];
  
  const linkedInUrl = "https://www.linkedin.com/company/green-reformation-foundation-grf-sdec";
  const instagramUrl = "https://www.instagram.com/grfsdec/";
  </script>
  
  <template>
    <main>
      <section class="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden bg-brand-light texture-overlay">
        <div class="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-3xl opacity-70"></div>
        <div class="absolute bottom-0 left-0 -ml-32 -mb-32 w-[500px] h-[500px] bg-brand-accent-2/20 rounded-full blur-3xl opacity-70"></div>
  
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-2 gap-16 items-center">
            <div class="max-w-2xl order-2 lg:order-1">
              <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-primary/20 shadow-sm mb-8 animate-fade-in">
                <span class="flex h-2 w-2 rounded-full bg-brand-primary animate-pulse"></span>
                <span class="text-xs font-bold tracking-wide uppercase text-brand-dark">Youth-Led Non-Profit</span>
              </div>
              
              <h1 class="text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 text-brand-dark">
                Bridging Environmental Action with Social Impact.
              </h1>
              
              <p class="text-xl text-gray-700 mb-10 leading-relaxed font-medium">
                Accelerating environmental sustainability and inclusive development across Africa through innovation and youth empowerment.
              </p>
              
              <div class="flex flex-wrap gap-4">
                <a href="#impact" class="cursor-pointer bg-brand-dark hover:bg-brand-primary text-white px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg hover:-translate-y-1">
                  Our Impact Areas
                  <ArrowRightIcon class="w-5 h-5" />
                </a>
                <a :href="linkedInUrl" target="_blank" class="cursor-pointer bg-white hover:bg-gray-50 text-brand-dark border-2 border-brand-dark/10 px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2">
                  Connect on LinkedIn
                </a>
              </div>
            </div>
  
            <div class="relative order-1 lg:order-2 flex justify-center">
               <img 
                 :src="heroImage" 
                 alt="Woman hugging the earth illustration" 
                 class="w-full max-w-lg h-auto object-contain animate-float drop-shadow-2xl"
               >
               
               <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/40 max-w-sm w-full">
                 <div class="flex justify-around items-center text-center divide-x divide-gray-200/50">
                    <div v-for="stat in stats" :key="stat.label" class="px-4 w-full">
                      <p class="text-3xl font-bold text-brand-primary">{{ stat.value }}</p>
                      <p class="text-xs uppercase tracking-wider text-gray-600 font-bold mt-1">{{ stat.label }}</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>
  
      <section id="mission" class="py-24 bg-white texture-overlay">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <h2 class="text-sm uppercase tracking-widest font-bold text-brand-accent-1 mb-4">Our Mission</h2>
          <p class="text-3xl md:text-4xl leading-tight text-brand-dark font-bold mb-8">
            "Rooted in <span class="text-brand-primary">equity, innovation, and empowerment</span>, GRF equips young people—especially women and underserved populations—with the tools to lead transformative change."
          </p>
          <div class="h-1 w-24 bg-brand-accent-2 mx-auto rounded-full"></div>
        </div>
      </section>
  
      <section id="impact" class="py-24 bg-brand-light texture-overlay relative">
          <div class="absolute top-0 left-0 w-64 h-64 bg-brand-accent-1/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div class="absolute bottom-0 right-0 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
  
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="text-center max-w-2xl mx-auto mb-16">
            <h2 class="text-4xl font-bold text-brand-dark mb-4">Our Core Pillars</h2>
            <p class="text-gray-700 text-lg">By bridging environmental action with social impact, we are building resilient ecosystems where people and planet thrive together.</p>
          </div>
  
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
  <div 
    v-for="(item, idx) in pillars" 
    :key="idx"
    class="bg-white rounded-[1rem] overflow-hidden border-transparent hover:border-brand-primary/20 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col"
  >
    <div class="h-56 w-full relative overflow-hidden bg-gray-100 flex-shrink-0">
       <div :class="`absolute inset-0 bg-${item.accent}/10 z-0`"></div>
       <img 
         :src="item.image" 
         :alt="item.title" 
         class="w-full h-full object-cover relative z-10 group-hover:scale-110 transition-transform duration-700"
       >
    </div>

    <div class="p-8 flex-grow flex flex-col">
      <h3 class="text-2xl font-bold mb-3 text-brand-dark min-h-[3.5rem]">
        {{ item.title }}
      </h3>
      
      <p class="text-gray-600 leading-relaxed flex-grow">
        {{ item.desc }}
      </p>
    </div>
  </div>
</div>
        </div>
      </section>
  
      <section class="py-24 bg-white texture-overlay">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-brand-dark mb-4">Meet the Changemakers</h2>
            <p class="text-gray-600 max-w-2xl mx-auto">The dedicated team driving the Green Reformation across Africa.</p>
          </div>
  
          <div class="grid md:grid-cols-3 gap-12">
            <div v-for="(member, index) in team" :key="index" class="text-center group">
              <div class="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-brand-light shadow-xl group-hover:scale-105 transition-transform duration-300">
                <img :src="member.image" :alt="member.name" class="w-full h-full object-cover">
              </div>
              <h3 class="text-xl font-bold text-brand-dark">{{ member.name }}</h3>
              <p class="text-brand-primary font-medium text-sm mb-3 uppercase tracking-wide">{{ member.role }}</p>
              <p class="text-gray-500 leading-relaxed text-sm px-4">{{ member.bio }}</p>
            </div>
          </div>
        </div>
      </section>
  
      <section id="contact" class="py-24 bg-brand-light texture-overlay">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-brand-dark rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden shadow-2xl">
            <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(#e9c46a 1.5px, transparent 1.5px); background-size: 24px 24px;"></div>
            
            <div class="relative z-10 max-w-3xl mx-auto">
              <h2 class="text-4xl md:text-5xl font-bold text-white mb-6 font-display">Ready to become a Green Champion?</h2>
              <p class="text-brand-light text-lg mb-10 font-medium opacity-90">
                Join our community-driven projects, school green clubs, and advocacy campaigns. Together, we can create a resilient future.
              </p>
              <div class="flex flex-col sm:flex-row justify-center gap-4">
                <a :href="instagramUrl" target="_blank" class="bg-brand-accent-2 text-brand-dark px-10 py-4 rounded-full font-bold hover:bg-white hover:scale-105 transition-all shadow-lg">
                  Follow on Instagram
                </a>
                <a :href="linkedInUrl" target="_blank" class="bg-brand-primary text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-brand-primary hover:scale-105 transition-all shadow-lg">
                  Connect on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </template>