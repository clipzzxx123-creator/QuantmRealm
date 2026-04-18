import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Palette, Camera, Film, Image as ImageIcon } from 'lucide-react';

const DiscordIcon = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.076.076 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z" />
  </svg>
);

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d', { alpha: false });
    let animationFrameId;
    let particles = [];
    let bolts = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.init();
      }

      init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedY = Math.random() * 0.7 + 0.2;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.opacity = Math.random() * 0.3 + 0.1;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y > canvas.height) {
          this.y = -10;
          this.x = Math.random() * canvas.width;
        }
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
      }

      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Bolt {
      constructor() {
        this.path = [];
        this.segments = 20;
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.life = 1;
        this.flashIntensity = 0.4;
        this.generatePath();
      }

      generatePath() {
        let curX = this.x;
        let curY = this.y;
        this.path.push({ x: curX, y: curY });
        for (let i = 0; i < this.segments; i += 1) {
          curX += (Math.random() - 0.5) * 60;
          curY += canvas.height / this.segments;
          this.path.push({ x: curX, y: curY });
          if (Math.random() > 0.95) {
            this.path.push('branch');
            this.path.push({ x: curX + (Math.random() - 0.5) * 40, y: curY + 20 });
          }
        }
      }

      update() {
        this.life -= 0.05;
      }

      draw() {
        if (this.life <= 0) return;

        const lifeProgress = 1 - this.life;
        const flashOpacity = Math.max(0, this.flashIntensity * (1 - lifeProgress * lifeProgress));

        if (flashOpacity > 0) {
          const gradient = ctx.createRadialGradient(this.x, 200, 0, this.x, 200, canvas.height * 0.8);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${flashOpacity * 0.08})`);
          gradient.addColorStop(0.5, `rgba(255, 255, 255, ${flashOpacity * 0.03})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.strokeStyle = `rgba(255, 255, 255, ${this.life * 0.2})`;
        ctx.lineWidth = 1.5 + this.life * 0.5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(255, 255, 255, ${this.life * 0.6})`;
        ctx.beginPath();
        ctx.moveTo(this.path[0].x, this.path[0].y);
        for (let i = 1; i < this.path.length; i += 1) {
          if (this.path[i] === 'branch') {
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.path[i - 1].x, this.path[i - 1].y);
            i += 1;
            if (this.path[i]) ctx.lineTo(this.path[i].x, this.path[i].y);
          } else {
            ctx.lineTo(this.path[i].x, this.path[i].y);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    const init = () => {
      particles = Array.from({ length: 120 }, () => new Particle());
    };

    const animate = () => {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#000000');
      grad.addColorStop(1, '#0a0a0a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (Math.random() > 0.996 && bolts.length < 2) bolts.push(new Bolt());
      bolts = bolts.filter((bolt) => bolt.life > 0);
      bolts.forEach((bolt) => {
        bolt.update();
        bolt.draw();
      });
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

const PortfolioItem = ({ title }) => (
  <div className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-500 ease-out hover:scale-[1.03] hover:border-white/40 hover:shadow-2xl hover:shadow-white/5">
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black via-black/20 to-transparent p-8 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
      <div className="translate-y-4 transform transition-transform duration-500 ease-out group-hover:translate-y-0">
        <p className="text-xl font-black tracking-tight text-white">{title}</p>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">View Project</p>
      </div>
    </div>
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="transform-gpu text-white/5 transition-all duration-700 ease-out group-hover:scale-110 group-hover:text-white/20">
        <ImageIcon size={80} strokeWidth={0.5} />
      </div>
    </div>
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-white/[0.03] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
  </div>
);

export default function App() {
  const DISCORD_LINK = 'https://discord.gg/nXthZ5qywN';

  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState('hero');

  const sections = [
    { id: 'pfp', title: 'PFP', icon: <Camera size={18} />, description: 'High-impact profile identifiers.' },
    { id: 'banners', title: 'BANNERS', icon: <Palette size={18} />, description: 'Cinematic social media headers.' },
    { id: 'vfx', title: 'VFX', icon: <Film size={18} />, description: 'Motion-driven visual storytelling.' },
    { id: 'gfx', title: 'GFX', icon: <ImageIcon size={18} />, description: 'Premium static brand assets.' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const scrollPos = window.scrollY + 250;
      let current = 'hero';
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPos) {
          current = section.id;
        }
      });
      setActiveSection(current);
    };

    let timeout;
    const handleMouseMove = (event) => {
      if (timeout) cancelAnimationFrame(timeout);
      timeout = requestAnimationFrame(() => {
        setMousePos({
          x: (event.clientX / window.innerWidth - 0.5) * 15,
          y: (event.clientY / window.innerHeight - 0.5) * 15,
        });
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeout) cancelAnimationFrame(timeout);
    };
  }, [sections]);

  const scrollToSection = (event, id) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-black font-sans text-white antialiased selection:bg-white selection:text-black">
      <AnimatedBackground />

      <div className={`fixed left-8 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-8 transition-opacity duration-500 xl:flex ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
        {sections.map((section) => (
          <div
            key={section.id}
            className="group flex cursor-pointer items-center gap-4"
            onClick={(event) => scrollToSection(event, section.id)}
          >
            <div className={`h-1 rounded-full transition-all duration-500 ${activeSection === section.id ? 'w-8 bg-white' : 'w-4 bg-white/20 group-hover:bg-white/40'}`} />
            <span className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 ${activeSection === section.id ? 'translate-x-0 text-white' : '-translate-x-2 text-white/20 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>
              {section.title}
            </span>
          </div>
        ))}
      </div>

      <nav className={`fixed left-0 right-0 top-0 z-50 px-8 py-6 transition-all duration-700 ${scrolled ? 'border-b border-white/5 bg-black/60 py-4 backdrop-blur-2xl' : 'bg-transparent'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="group cursor-pointer text-2xl font-black tracking-tighter" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            QUANTM<span className="text-white/20 transition-colors duration-500 group-hover:text-white">.</span>
          </div>

          <div className="flex items-center gap-10">
            <div className="hidden gap-10 text-[10px] font-black tracking-[0.4em] lg:flex">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={(event) => scrollToSection(event, section.id)}
                  className={`uppercase outline-none transition-all duration-300 ${activeSection === section.id ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
                >
                  {section.title}
                </button>
              ))}
            </div>

            <a
              href={DISCORD_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-full bg-white px-6 py-2.5 text-[11px] font-black text-black shadow-xl shadow-white/5 transition-all duration-300 hover:bg-zinc-200 active:scale-95"
            >
              <DiscordIcon size={16} />
              <span className="tracking-[0.1em] text-black">DISCORD</span>
            </a>
          </div>
        </div>
      </nav>

      <section className="relative flex h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div
          className="z-10 transform-gpu transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }}
        >
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-white/20" />
            <h2 className="text-[9px] font-bold uppercase tracking-[0.6em] text-white/40">Established 2026</h2>
            <div className="h-px w-12 bg-white/20" />
          </div>
          <h1 className="mb-10 px-4 text-[12vw] leading-none font-black select-none md:text-9xl">
            <span className="mb-2 block tracking-tighter">QUANTM</span>
            <span className="inline-block bg-gradient-to-b from-white via-white to-white/10 bg-clip-text pr-4 tracking-tight text-transparent">
              STUDIOS
            </span>
          </h1>
          <div className="mt-6 flex flex-col justify-center gap-6 sm:flex-row">
            <button
              onClick={(event) => scrollToSection(event, 'pfp')}
              className="rounded-full bg-white px-12 py-4 text-[11px] font-black tracking-[0.2em] text-black shadow-2xl shadow-white/10 transition-transform duration-300 hover:scale-105"
            >
              VIEW SHOWREEL
            </button>
            <button className="rounded-full border border-white/10 bg-transparent px-12 py-4 text-[11px] font-black tracking-[0.2em] transition-all duration-300 hover:border-white/30 hover:bg-white/5">
              GET IN TOUCH
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4 opacity-20">
          <div className="h-16 w-px bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-56 px-8 pb-40">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-32">
            <div className="mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-xl space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40">
                  {section.title}
                </p>
                <h3 className="text-6xl font-black tracking-tight">{section.title}</h3>
                <p className="text-lg font-medium leading-relaxed text-zinc-500">{section.description}</p>
              </div>
              <button className="group flex items-center gap-3 border-b border-white/10 pb-3 text-[10px] font-black tracking-[0.3em] text-white/20 transition-all duration-500 hover:text-white">
                EXPLORE PROJECTS
                <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <PortfolioItem key={item} title={`${section.title} Concept`} />
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="relative z-10 border-t border-white/5 bg-[#020202] px-8 py-32">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 text-center">
          <div className="space-y-6">
            <div className="text-6xl font-black tracking-tighter">
              QUANTM<span className="text-white/20">.</span>
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-600">Visual Excellence Redefined</p>
          </div>

          <div className="flex flex-wrap justify-center gap-12 md:gap-24">
            {['YouTube'].map((link) => (
              <a
                key={link}
                href="#"
                className="group relative text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 transition-all duration-300 hover:text-white"
              >
                {link}
                <span className="absolute -bottom-2 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex w-full flex-col items-center justify-between gap-6 border-t border-white/5 pt-16 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-700 md:flex-row">
            <span>© 2026 QUANTM STUDIOS</span>
            <div className="flex gap-10">
              <a href="#" className="transition-colors hover:text-zinc-400">Privacy</a>
              <a href="#" className="transition-colors hover:text-zinc-400">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
