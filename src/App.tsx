
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { TrafficHeroScene, SimulationScene } from './components/QuantumScene';
import { FrameworkDiagram, BenchmarkResultsDiagram, NetworkCarousel } from './components/Diagrams';
import { ArrowDown, Menu, X, Github, ExternalLink, Map, Activity, BarChart3, Database, Cpu, GitFork, Users, Code, Trophy, Terminal, Copy, Check, Play } from 'lucide-react';

interface Author {
    name: string;
    affiliation: string;
    github?: string;
    delay: string;
}

const authors: Author[] = [
    { name: "Ahmet Onur Akman", affiliation: "Jagiellonian University", github: "aonurakman", delay: "0s" },
    { name: "Anastasia Psarou", affiliation: "Jagiellonian University", github: "AnastasiaPsarou", delay: "0.1s" },
    { name: "Michał Hoffmann", affiliation: "Jagiellonian University", github: "Crackhoff", delay: "0.2s" },
    { name: "Łukasz Gorczyca", affiliation: "Jagiellonian University", github: "Limexcyan", delay: "0.3s" },
    { name: "Łukasz Kowalski", affiliation: "Urban Policy Observatory", github: "LukaszKowalski2013", delay: "0.4s" },
    { name: "Paweł Gora", affiliation: "Jagiellonian University", github: "pgora", delay: "0.5s" },
    { name: "Grzegorz Jamróz", affiliation: "Jagiellonian University", github: "GrzegorzJamroz", delay: "0.6s" },
    { name: "Rafał Kucharski", affiliation: "Jagiellonian University", github: "RafalKucharskiPK", delay: "0.7s" },
];

const AuthorCard = ({ author }: { author: Author }) => {
  return (
    <a 
      href={author.github ? `https://github.com/${author.github}` : '#'} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex flex-col group items-center p-6 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 w-full hover:border-urb-blue/50" 
      style={{ animationDelay: author.delay }}
    >
      <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-slate-100 group-hover:border-urb-blue transition-colors relative bg-slate-100 flex items-center justify-center">
        {author.github ? (
             <img 
               src={`https://github.com/${author.github}.png`} 
               alt={author.name} 
               className="w-full h-full object-cover"
             />
        ) : (
             <span className="text-slate-400 font-bold text-xl">{author.name.charAt(0)}</span>
        )}
      </div>
      <h3 className="font-sans font-bold text-sm text-slate-900 text-center mb-1 group-hover:text-urb-blue transition-colors">{author.name}</h3>
      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider text-center leading-relaxed">{author.affiliation}</p>
    </a>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-urb-blue/30 transition-colors">
    <div className="w-12 h-12 bg-blue-50 text-urb-blue rounded-lg flex items-center justify-center mb-4">
      <Icon size={24} />
    </div>
    <h3 className="font-bold text-lg mb-2 text-slate-900">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
  </div>
);

const UrbLogo = () => (
  <img 
    src="https://raw.githubusercontent.com/COeXISTENCE-PROJECT/URB/refs/heads/main/docs/urb.png" 
    alt="URB Logo" 
    className="mx-auto mb-8 h-32 w-auto object-contain"
  />
);

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const copyCitation = () => {
    const citation = `@inproceedings{URB,
  title={URB -- Urban Routing Benchmark for RL-equipped Connected Autonomous Vehicles},
  author={Akman, Ahmet Onur and Psarou, Anastasia and Hoffmann, Micha{\\l} and Gorczyca, {\\L}ukasz and Kowalski, {\\L}ukasz and Gora, Pawe{\\l} and Jamr{\\'o}z, Grzegorz and Kucharski, Rafa{\\l}},
  booktitle={Proceedings of the Thirty-Ninth Annual Conference on Neural Information Processing Systems (NeurIPS 2025) Datasets and Benchmarks Track},
  month={December},
  year={2025}
}`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-urb-blue selection:text-white font-sans">
      
      {/* Navigation - Smart hiding */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform ${
            scrolled ? 'translate-y-0 py-4 px-4' : '-translate-y-full py-6 px-0'
        }`}
      >
        <div className={`
            w-[95%] max-w-[1920px] mx-auto px-4 xl:px-6 flex justify-between items-center transition-all duration-300
            bg-white/95 backdrop-blur-md shadow-lg rounded-2xl py-3 border border-slate-100
        `}>
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {/* Enlarged 1.5x (w-16 -> w-24) */}
            <div className={`transition-all duration-300 w-24 h-24`}>
                 <img 
                  src="https://raw.githubusercontent.com/COeXISTENCE-PROJECT/URB/refs/heads/main/docs/urb.png" 
                  alt="URB Logo" 
                  className="w-full h-full object-contain"
                />
            </div>
            {/* Single line text, adjusted font */}
            <span className={`font-bold text-xl md:text-2xl tracking-tighter leading-none text-slate-900 hidden md:block whitespace-nowrap`}>
              Urban Routing Benchmark
            </span>
             <span className={`font-bold text-xl tracking-tight text-slate-900 md:hidden`}>
              URB
            </span>
          </div>
          
          {/* Responsive Desktop Menu: XL (Laptop) = Compact, 2XL (Large Screen) = Spacious */}
          <div className="hidden xl:flex items-center gap-2 2xl:gap-8 text-xs 2xl:text-sm font-medium text-slate-600">
            <a href="#authors" onClick={scrollToSection('authors')} className="hover:text-urb-blue transition-colors px-2 py-1">Team</a>
            <a href="#overview" onClick={scrollToSection('overview')} className="hover:text-urb-blue transition-colors px-2 py-1">Overview</a>
            <a href="#framework" onClick={scrollToSection('framework')} className="hover:text-urb-blue transition-colors px-2 py-1">Framework</a>
            <a href="#results" onClick={scrollToSection('results')} className="hover:text-urb-blue transition-colors px-2 py-1">Results</a>
            <a href="#getting-started" onClick={scrollToSection('getting-started')} className="hover:text-urb-blue transition-colors whitespace-nowrap px-2 py-1">Get Started</a>
            <a href="#contributing" onClick={scrollToSection('contributing')} className="hover:text-urb-blue transition-colors px-2 py-1">Contributing</a>
            
            <div className="flex items-center gap-2 2xl:gap-4 ml-2">
              <a 
                href="https://www.rafalkucharskilab.pl/COeXISTENCE/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors h-10 2xl:h-12 box-border"
                title="COeXISTENCE Project"
              >
                <img 
                    src="https://github.com/aonurakman/assets/blob/main/icons/coexistence_small.png?raw=true" 
                    alt="Logo" 
                    className="h-5 2xl:h-6 w-auto object-contain" 
                />
                <span className="font-bold tracking-wider text-xs hidden 2xl:inline">COeXISTENCE</span>
              </a>
              <a 
                href="https://github.com/COeXISTENCE-PROJECT/URB" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-3 2xl:px-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors h-10 2xl:h-12 box-border"
                title="View Code on GitHub"
              >
                <Github size={18} className="2xl:w-5 2xl:h-5" />
                <span className="font-semibold hidden 2xl:inline">Code</span>
              </a>
              <a 
                href="https://arxiv.org/abs/2505.17734" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-3 2xl:px-4 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors h-10 2xl:h-12 box-border"
                title="View Paper on ArXiv"
              >
                <img src="https://github.com/aonurakman/assets/blob/main/icons/arxiv.svg.png?raw=true" alt="ArXiv" className="h-5 2xl:h-6 w-auto object-contain" />
                <span className="font-semibold hidden 2xl:inline">Paper</span>
              </a>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button className="xl:hidden text-slate-900 p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8 text-xl font-medium animate-fade-in">
            <a href="#authors" onClick={scrollToSection('authors')}>Team</a>
            <a href="#overview" onClick={scrollToSection('overview')}>Overview</a>
            <a href="#framework" onClick={scrollToSection('framework')}>Framework</a>
            <a href="#results" onClick={scrollToSection('results')}>Results</a>
            <a href="#getting-started" onClick={scrollToSection('getting-started')}>Get Started</a>
            <a href="#contributing" onClick={scrollToSection('contributing')}>Contributing</a>
            <div className="flex flex-col gap-4 mt-4 w-64">
              <a href="https://www.rafalkucharskilab.pl/COeXISTENCE/" className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg">
                <img 
                    src="https://github.com/aonurakman/assets/blob/main/icons/coexistence_small.png?raw=true" 
                    alt="Logo" 
                    className="h-6 w-auto object-contain" 
                />
                <span className="font-semibold">COeXISTENCE</span>
              </a>
              <a href="https://arxiv.org/abs/2505.17734" className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                <img src="https://github.com/aonurakman/assets/blob/main/icons/arxiv.svg.png?raw=true" alt="ArXiv" className="h-6 w-auto object-contain" />
                <span className="font-semibold ml-2">Paper</span>
              </a>
              <a href="https://github.com/COeXISTENCE-PROJECT/URB" className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg">
                <Github size={20} /> <span className="font-semibold">Code</span>
              </a>
            </div>
        </div>
      )}

      {/* Hero Section - Updated with mobile top padding and alignment fix */}
      <header className="relative min-h-screen flex flex-col justify-start items-center pt-32 pb-40 md:justify-center md:pt-0 md:pb-0 overflow-hidden bg-slate-50">
        <TrafficHeroScene />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(248,250,252,0.8)_0%,rgba(248,250,252,0.4)_60%,rgba(248,250,252,0)_100%)]" />

        <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
          <UrbLogo />
          
          {/* Reduced Badge size as requested */}
          <a 
            href="https://neurips.cc/virtual/2025/loc/san-diego/poster/121647"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm hover:border-urb-blue transition-colors group transform hover:scale-105 duration-200"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-bold tracking-widest text-slate-500 uppercase group-hover:text-urb-blue transition-colors">NeurIPS 2025</span>
          </a>
          
          {/* Larger Title (1.5x larger) */}
          <h1 className="font-bold text-6xl md:text-8xl mb-6 text-slate-900 tracking-tight leading-tight">
            Urban Routing Benchmark
            <span className="block text-xl md:text-2xl font-normal text-slate-500 mt-4 font-mono">for RL-equipped Connected Autonomous Vehicles</span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed mb-10">
            A comprehensive benchmarking environment unifying evaluation across <strong>29 real-world traffic networks</strong> to test multi-agent reinforcement learning-based routing strategies in mixed autonomy traffic.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
             <a 
                href="https://github.com/COeXISTENCE-PROJECT/URB" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-8 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
             >
                <Github size={20} />
                <span>Code</span>
             </a>
             <a 
                href="https://arxiv.org/abs/2505.17734" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-8 py-3 bg-red-50 text-red-700 font-medium rounded-lg border border-red-200 hover:bg-red-100 transition-colors shadow-lg shadow-red-500/10 flex items-center justify-center gap-2"
             >
                <img src="https://github.com/aonurakman/assets/blob/main/icons/arxiv.svg.png?raw=true" className="h-5 w-auto object-contain" alt="ArXiv" />
                <span>Paper</span>
             </a>
             <a href="https://doi.org/10.34740/kaggle/ds/7406751" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Kaggle_Logo.svg/2560px-Kaggle_Logo.svg.png" className="h-4 w-auto object-contain" alt="Kaggle" />
                <span>Get Data</span>
             </a>
          </div>
        </div>

        {/* Arrow Down: Relative on mobile to prevent overlap, Absolute on desktop */}
        <div className="flex justify-center animate-bounce opacity-50 mt-20 md:absolute md:bottom-10 md:left-0 md:right-0 md:mt-0">
           <ArrowDown className="text-slate-400" />
        </div>
      </header>

      <main>
        {/* Authors / Team Section (Moved to top) */}
        <section id="authors" className="py-12 bg-white border-b border-slate-200">
           <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-8">
                    <span className="text-urb-blue font-bold tracking-wider uppercase text-xs">Contributors</span>
                    <h2 className="text-2xl font-bold mt-1 text-slate-900">The Research Team</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {authors.map((author, index) => (
                        <AuthorCard key={index} author={author} />
                    ))}
                </div>
           </div>
        </section>

        {/* Overview/Introduction */}
        <section id="overview" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                   <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">The future of urban routing</h2>
                   <div className="w-20 h-1.5 bg-urb-blue mb-8 rounded-full"></div>
                   <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                     Connected Autonomous Vehicles (CAVs) promise to reduce congestion by optimizing routing decisions collectively. However, standard benchmarks for this complex, multi-agent problem have been missing.
                   </p>
                   <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                     <strong>URB</strong> fills this gap. It integrates the microscopic traffic simulator SUMO with <strong>RL-based solutions</strong> to create a realistic testing ground. It features <strong>29 real-world networks</strong>, calibrated demand patterns, and a suite of baseline algorithms.
                   </p>
                   <div className="flex flex-wrap gap-4 mt-8">
                      <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-md text-sm font-semibold text-slate-600">29 Networks</div>
                      <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-md text-sm font-semibold text-slate-600">SUMO Integration</div>
                      <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-md text-sm font-semibold text-slate-600">Baselines</div>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FeatureCard icon={Map} title="Real Topology" desc="Networks from Île-de-France and Ingolstadt varying in size and complexity." />
                    <FeatureCard icon={Activity} title="Realistic Demand" desc="Calibrated trip patterns based on census and empirical traffic data." />
                    <FeatureCard icon={BarChart3} title="Standard Metrics" desc="Evaluate travel time, congestion, and network-level efficiency." />
                    <FeatureCard icon={Database} title="Open Data" desc="Fully reproducible datasets and configuration schemes." />
                </div>
            </div>
          </div>
        </section>

        {/* Framework & Networks */}
        <section id="framework" className="py-24 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-urb-blue font-bold tracking-wider uppercase text-sm">The Platform</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6 text-slate-900">From Map to Metric</h2>
                    <p className="text-slate-600">
                        URB standardizes the pipeline of setting up traffic scenarios, training MARL agents, and assessing their impact on the city.
                    </p>
                </div>

                <div className="mb-20">
                    <FrameworkDiagram />
                </div>

                <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                         <div>
                            <h3 className="text-2xl font-bold mb-4">Diverse Environments</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                To ensure robustness, URB includes networks ranging from small towns like <strong>St. Arnoult</strong> to dense urban centers like <strong>Ingolstadt</strong>.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                                    <div>
                                        <strong className="text-slate-900">St. Arnoult</strong>
                                        <p className="text-sm text-slate-500">Small scale, 222 trips. Good for debugging and quick iteration.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                                    <div>
                                        <strong className="text-slate-900">Provins</strong>
                                        <p className="text-sm text-slate-500">Medium scale, 523 trips. Represents typical suburban traffic.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                                    <div>
                                        <strong className="text-slate-900">Ingolstadt</strong>
                                        <p className="text-sm text-slate-500">Large scale, 1035 trips. High congestion, challenging for coordination.</p>
                                    </div>
                                </li>
                            </ul>
                         </div>
                         <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 h-full flex flex-col justify-center">
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Activity size={18} className="text-urb-blue"/> Network Statistics
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between p-2 bg-white rounded border border-slate-200">
                                    <span className="text-slate-500">Regions</span>
                                    <span className="font-mono font-medium">29</span>
                                </div>
                                <div className="flex justify-between p-2 bg-white rounded border border-slate-200">
                                    <span className="text-slate-500">Total Agents</span>
                                    <span className="font-mono font-medium">Up to 6,924</span>
                                </div>
                                <div className="flex justify-between p-2 bg-white rounded border border-slate-200">
                                    <span className="text-slate-500">Simulation</span>
                                    <span className="font-mono font-medium">SUMO + RouteRL</span>
                                </div>
                            </div>
                         </div>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-slate-100">
                        <NetworkCarousel />
                    </div>
                </div>
            </div>
        </section>

        {/* Simulation Visual */}
        <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute inset-0 z-0 opacity-30">
                <SimulationScene />
            </div>
            <div className="container mx-auto px-6 relative z-10 text-center">
                 <h2 className="text-3xl md:text-5xl font-bold mb-8">Microscopic Simulation</h2>
                 <p className="max-w-2xl mx-auto text-slate-300 text-lg mb-12">
                     Powered by SUMO, URB simulates individual vehicle dynamics to provide the most realistic feedback to learning agents, going far beyond simple fluid approximation models.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                        <Cpu className="w-8 h-8 text-urb-accent mx-auto mb-3" />
                        <div className="text-xl font-bold text-white mb-1">Dynamics</div>
                        <div className="text-xs text-slate-400">Car-following Physics & gap acceptance</div>
                    </div>
                    <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                        <GitFork className="w-8 h-8 text-urb-accent mx-auto mb-3" />
                        <div className="text-xl font-bold text-white mb-1">Intersections</div>
                        <div className="text-xs text-slate-400">Traffic lights, right-of-way rules & junctions</div>
                    </div>
                    <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                        <Users className="w-8 h-8 text-urb-accent mx-auto mb-3" />
                        <div className="text-xl font-bold text-white mb-1">Mixed Traffic</div>
                        <div className="text-xs text-slate-400">Interaction between human drivers and algorithmic CAV agents</div>
                    </div>
                 </div>
            </div>
        </section>

        {/* Results */}
        <section id="results" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 text-center">Benchmark Results</h2>
                    <p className="text-lg text-slate-600 leading-relaxed text-center">
                        We evaluated state-of-the-art MARL algorithms (IPPO, IQL, MAPPO, QMIX) against <strong>URB baselines</strong>. The results reveal a significant challenge: <strong>current algorithms rarely outperform human drivers</strong> in complex, congested networks.
                    </p>
                    <p className="text-center mt-4">
                        <a href="https://arxiv.org/abs/2505.17734" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-urb-blue hover:underline font-medium bg-blue-50 px-3 py-1 rounded-full text-sm">
                            Results reported in our study: URB (arXiv:2505.17734) <ExternalLink size={12}/>
                        </a>
                    </p>
                </div>
                
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm">
                    <BenchmarkResultsDiagram />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                        <h4 className="font-bold text-red-800 mb-2">Scaling Issues</h4>
                        <p className="text-sm text-red-700">Algorithms that work on small maps (St. Arnoult) fail to converge or improve upon baselines in larger networks (Ingolstadt).</p>
                    </div>
                    <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
                        <h4 className="font-bold text-yellow-800 mb-2">Cost of Training</h4>
                        <p className="text-sm text-yellow-700">Training involves exploring suboptimal routes, causing regret and delays for all commuters during the learning phase.</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                        <h4 className="font-bold text-blue-800 mb-2">Future Work</h4>
                        <p className="text-sm text-blue-700">URB establishes a leaderboard to track progress. We need new methods that handle non-stationarity and massive scale.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Getting Started */}
        <section id="getting-started" className="py-24 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="text-urb-blue font-bold tracking-wider uppercase text-sm">Quick Start</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6 text-slate-900">Start Benchmarking</h2>
                    <p className="text-slate-600">
                        Get up and running with URB in minutes. Follow these steps to clone the repository, install dependencies, and run your first experiment.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto bg-slate-900 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                    <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex-1 text-center text-xs font-mono text-slate-400">urb_experiment.sh</div>
                    </div>
                    <div className="p-6 font-mono text-sm text-slate-300 space-y-6 overflow-x-auto">
                        <div>
                            <div className="flex items-center gap-2 text-slate-500 mb-1 select-none">
                                <Terminal size={14} />
                                <span># 1. Clone the repository</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-emerald-400 select-none">$</span>
                                <span>git clone https://github.com/COeXISTENCE-PROJECT/URB.git</span>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex items-center gap-2 text-slate-500 mb-1 select-none">
                                <Terminal size={14} />
                                <span># 2. Install dependencies</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-emerald-400 select-none">$</span>
                                <span>cd URB && pip install -r requirements.txt</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 text-slate-500 mb-1 select-none">
                                <Play size={14} />
                                <span># 3. Run an example experiment (QMIX in St. Arnoult)</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-emerald-400 select-none">$</span>
                                <span className="whitespace-pre-wrap">python scripts/qmix_torchrl.py --id demo --alg-conf config3 --task-conf config4 --net saint_arnoult</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Contributing Section */}
        <section id="contributing" className="py-24 bg-white border-t border-slate-200">
            <div className="container mx-auto px-6 max-w-4xl text-center">
                 <div className="inline-flex items-center justify-center w-16 h-16 bg-urb-blue rounded-full text-white mb-6 shadow-lg shadow-blue-500/30">
                    <Trophy size={32} />
                 </div>
                 <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Join the Leaderboard</h2>
                 <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                    Users can implement their solutions and use URB components by extending the provided template script with their method, and then use it just like any other URB experiment script.
                 </p>
                 
                 <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 shadow-sm text-left">
                    <div className="flex items-center gap-3 mb-4 text-slate-900 font-bold">
                        <Code className="text-urb-blue" />
                        <h3>How to Contribute</h3>
                    </div>
                    <p className="text-slate-600 mb-6 text-sm">
                        Download the template script and follow the documentation to integrate your custom agent. Submit your results via Pull Request to join the official leaderboard.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                         <a 
                            href="https://github.com/COeXISTENCE-PROJECT/URB/blob/main/scripts/base_script.py" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors w-full sm:w-auto"
                        >
                            <Github size={18} />
                            Template Script
                         </a>
                         <a 
                            href="https://github.com/COeXISTENCE-PROJECT/URB" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors w-full sm:w-auto"
                        >
                            Read Documentation
                         </a>
                    </div>
                 </div>
            </div>
        </section>

        {/* Citation */}
        <section className="py-16 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-6 max-w-4xl">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Citation</h3>
                <div className="relative group">
                    <pre className="bg-white p-6 rounded-lg border border-slate-200 text-xs md:text-sm text-slate-600 overflow-x-auto font-mono leading-relaxed shadow-sm">
{`@inproceedings{URB,
  title={URB -- Urban Routing Benchmark for RL-equipped Connected Autonomous Vehicles},
  author={Akman, Ahmet Onur and Psarou, Anastasia and Hoffmann, Micha{\\l} and Gorczyca, {\\L}ukasz and Kowalski, {\\L}ukasz and Gora, Pawe{\\l} and Jamr{\\'o}z, Grzegorz and Kucharski, Rafa{\\l}},
  booktitle={Proceedings of the Thirty-Ninth Annual Conference on Neural Information Processing Systems (NeurIPS 2025) Datasets and Benchmarks Track},
  month={December},
  year={2025}
}`}
                    </pre>
                    <button 
                        onClick={copyCitation}
                        className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-urb-blue hover:text-white rounded-md text-slate-500 transition-all duration-200 shadow-sm"
                        title="Copy BibTeX"
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                </div>
            </div>
        </section>

        {/* Supported By / Credits */}
        <section className="py-12 bg-white border-t border-slate-200">
            <div className="container mx-auto px-6">
                <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Supported By</p>
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 grayscale hover:grayscale-0 transition-all duration-500">
                    <a href="https://en.uj.edu.pl/en_GB/start" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
                        <img src="https://github.com/aonurakman/assets/blob/main/icons/uj.png?raw=true" alt="Jagiellonian University" className="h-16 w-auto object-contain" />
                    </a>
                    <a href="https://www.rafalkucharskilab.pl/COeXISTENCE/" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
                        <img src="https://github.com/aonurakman/assets/blob/main/icons/coexistence.png?raw=true" alt="COeXISTENCE" className="h-12 w-auto object-contain" />
                    </a>
                    <a href="https://www.gmum.net" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
                        <img src="https://github.com/aonurakman/assets/blob/main/icons/gmum.png?raw=true" alt="GMUM" className="h-10 w-auto object-contain" />
                    </a>
                    <a href="https://erc.europa.eu/homepage" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
                        <img src="https://github.com/aonurakman/assets/blob/main/icons/erc.png?raw=true" alt="ERC" className="h-16 w-auto object-contain" />
                    </a>
                </div>
            </div>
        </section>

      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left max-w-lg">
                <div className="text-white font-bold text-xl mb-2">URB</div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">Urban Routing Benchmark for RL-equipped Connected Autonomous Vehicles</p>
                <p className="text-[10px] text-slate-600 leading-relaxed">
                    This work was financed by the European Union within the Horizon Europe Framework Programme (ERC Starting Grant COeXISTENCE no. 101075838).
                </p>
            </div>
            <div className="text-xs text-slate-600">
                © 2025 COeXISTENCE Project. MIT License.
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
