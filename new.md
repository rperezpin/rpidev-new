import React, { useState, useEffect, useRef } from 'react';
import { 
  Code2, 
  BarChart, 
  Zap, 
  Database, 
  ChevronRight, 
  Globe, 
  Monitor,
  Layout,
  Linkedin,
  Github,
  Mail
} from 'lucide-react';

const App = () => {
  const scrollContainerRef = useRef(null);
  const [activeSection, setActiveSection] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        const width = window.innerWidth;
        const section = Math.round(scrollLeft / width);
        setActiveSection(section);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (idx) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: idx * window.innerWidth,
        behavior: 'smooth'
      });
    }
  };

  const services = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Desarrollo Web & Apps",
      desc: "Soluciones robustas, escalables y a medida utilizando los stacks tecnológicos más avanzados (React, Next.js, Node)."
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Consultoría Digital",
      desc: "Optimización de procesos y estrategia técnica para transformar negocios tradicionales en líderes digitales."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Automatizaciones",
      desc: "Conectamos tus herramientas para eliminar tareas repetitivas y maximizar la eficiencia operativa de tu equipo."
    }
  ];

  return (
    <div className="bg-[#020617] text-white min-h-screen font-sans selection:bg-[#3b82f6]/30 overflow-hidden">
      
      {/* CAPA DE SEO ESTRUCTURADO */}
      <header className="sr-only">
        <h1>RPIDEV - Rubén | Consultoría Digital y Desarrollo de Software</h1>
        <p>Expertos en transformación digital, creación de SaaS, E-commerce de alto rendimiento y automatización de procesos.</p>
      </header>

      {/* GRADIENTE DINÁMICO AZUL RPIDEV */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(1000px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.08), transparent 80%)`
        }}
      />
      <div className="fixed -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#1d4ed8]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* BARRA DE NAVEGACIÓN SUPERIOR */}
      <nav className="fixed top-0 left-0 w-full p-6 md:p-10 z-50 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => scrollToSection(0)}>
          <div className="relative">
            <div className="w-10 h-10 bg-[#3b82f6] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 transform group-hover:rotate-12 transition-transform duration-300">
              <span className="font-black text-white text-xl tracking-tighter italic">R</span>
            </div>
          </div>
          <span className="font-bold text-xl tracking-tighter uppercase hidden sm:block">RPIDEV</span>
        </div>

        <div className="flex gap-2 bg-white/5 backdrop-blur-xl p-1.5 rounded-full border border-white/10">
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              onClick={() => scrollToSection(idx)}
              className={`px-5 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${
                activeSection === idx ? 'bg-[#3b82f6] text-white' : 'hover:bg-white/5 text-slate-400'
              }`}
            >
              {['INICIO', 'SERVICIOS', 'PROYECTOS', 'CONTACTO'][idx]}
            </button>
          ))}
        </div>
      </nav>

      {/* CONTENEDOR HORIZONTAL SCROLL */}
      <main 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory h-screen no-scrollbar relative z-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        
        {/* PANTALLA 1: PRESENTACIÓN */}
        <section className="min-w-full h-full snap-start flex flex-col justify-center px-6 md:px-24">
          <div className={`max-w-5xl transition-all duration-1000 transform ${activeSection === 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="flex items-center gap-3 mb-6 text-[#60a5fa] font-mono text-sm tracking-widest">
              <div className="w-8 h-[2px] bg-[#3b82f6]" />
              CONSULTOR DIGITAL & DEV
            </div>
            <h2 className="text-6xl md:text-[8rem] font-black leading-[0.85] tracking-tighter mb-10">
              ¡Hola! Soy <span className="text-[#3b82f6]">Rubén</span>,<br/>
              <span className="text-white/40">desarrollador y consultor.</span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl font-light leading-relaxed">
              En RPIDEV impulsamos negocios a través de la tecnología. No solo creamos código, diseñamos el futuro digital de tu marca.
            </p>
            <button 
              onClick={() => scrollToSection(1)}
              className="mt-12 group flex items-center gap-4 text-sm font-bold tracking-widest text-[#3b82f6] hover:text-white transition-colors"
            >
              EXPLORAR SERVICIOS <ChevronRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </section>

        {/* PANTALLA 2: SERVICIOS EXPANDIDOS */}
        <section className="min-w-full h-full snap-start flex flex-col justify-center px-6 md:px-24 bg-white/[0.01]">
          <div className={`max-w-6xl mx-auto w-full transition-all duration-1000 ${activeSection === 1 ? 'opacity-100' : 'opacity-0 scale-95'}`}>
            <div className="mb-16">
              <h3 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter italic">NUESTRO FOCO.</h3>
              <p className="text-slate-500 font-mono">/ IMPULSANDO EL CRECIMIENTO DIGITAL</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, i) => (
                <div key={i} className="group p-10 bg-white/[0.03] border border-white/5 rounded-[2.5rem] hover:border-[#3b82f6]/40 transition-all duration-500">
                  <div className="w-14 h-14 bg-[#3b82f6]/10 text-[#3b82f6] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h4 className="text-2xl font-bold mb-4 uppercase tracking-tight">{service.title}</h4>
                  <p className="text-slate-400 leading-relaxed font-light">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PANTALLA 3: PORTFOLIO */}
        <section className="min-w-full h-full snap-start flex flex-col justify-center px-6 md:px-24">
          <div className={`max-w-7xl mx-auto w-full transition-all duration-1000 ${activeSection === 2 ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
            <div className="flex justify-between items-end mb-12">
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter">PORTFOLIO.</h3>
              <span className="text-slate-600 mb-2 font-mono">SABEMOS LO QUE HACEMOS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="group relative rounded-[3rem] overflow-hidden bg-slate-900 border border-white/5 aspect-video">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <div className="absolute bottom-10 left-10 z-20">
                  <span className="text-[#3b82f6] text-xs font-bold tracking-[0.3em]">WEB & E-COMMERCE</span>
                  <h5 className="text-3xl font-black mt-2">Plataformas de Alto Rendimiento</h5>
                </div>
                <div className="absolute top-10 right-10 z-20 bg-white/10 backdrop-blur-md p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                  <Monitor className="w-6 h-6" />
                </div>
              </div>

              <div className="group relative rounded-[3rem] overflow-hidden bg-slate-900 border border-white/5 aspect-video">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <div className="absolute bottom-10 left-10 z-20">
                  <span className="text-cyan-400 text-xs font-bold tracking-[0.3em]">CUSTOM APPS</span>
                  <h5 className="text-3xl font-black mt-2">Software a Medida & Automatización</h5>
                </div>
                <div className="absolute top-10 right-10 z-20 bg-white/10 backdrop-blur-md p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                  <Layout className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PANTALLA 4: CONTACTO */}
        <section className="min-w-full h-full snap-start flex flex-col justify-center items-center px-6 bg-gradient-to-b from-transparent to-[#020617]">
          <div className={`max-w-4xl text-center transition-all duration-1000 ${activeSection === 3 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
            <h3 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 italic outline-text">HABLAMOS.</h3>
            <p className="text-xl md:text-2xl text-slate-400 mb-12 font-light">
              ¿Preparado para escalar? Estamos a un clic de distancia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a href="mailto:hola@rpidev.com" className="group relative px-12 py-5 bg-[#3b82f6] text-white font-black text-sm uppercase tracking-widest rounded-full overflow-hidden">
                <span className="relative z-10">Enviar un Mensaje</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              </a>
              
              <div className="flex gap-8">
                <Linkedin className="w-6 h-6 text-slate-500 hover:text-[#3b82f6] transition-colors cursor-pointer" />
                <Github className="w-6 h-6 text-slate-500 hover:text-[#3b82f6] transition-colors cursor-pointer" />
                <Mail className="w-6 h-6 text-slate-500 hover:text-[#3b82f6] transition-colors cursor-pointer" />
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* MARCA DE AGUA Y ESTADO */}
      <div className="fixed bottom-10 left-10 z-50 flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-600 font-mono tracking-[0.2em]">© 2026 RPIDEV</span>
        </div>
        <div className="h-4 w-[1px] bg-white/10" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]" />
          <span className="text-[10px] font-bold tracking-tighter">SISTEMAS ONLINE</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .outline-text {
          -webkit-text-stroke: 1px rgba(255,255,255,0.1);
          color: transparent;
        }
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />
    </div>
  );
};

export default App;