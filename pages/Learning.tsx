import React, { useMemo, useState } from 'react';
import { Play, BookOpen, Lock, X } from 'lucide-react';

export const Learning: React.FC = () => {
  type Lesson = {
    id: string;
    title: string;
    vimeoEmbedUrl: string;
  };

  type Course = {
    id: string;
    title: string;
    description: string;
    level: 'Iniciante' | 'Intermediário' | 'Avançado';
    image: string;
    locked: boolean;
    lessons: Lesson[];
  };

  const welcomeVideo = useMemo(() => {
    const vimeoEmbedUrl = 'https://www.youtube.com/embed/PCDL7_nldVA?si=jgUzreAlq6h0myHF';
    return {
      title: 'Vídeo de Boas-Vindas',
      description: 'Assista ao vídeo introdutório da plataforma',
      vimeoEmbedUrl,
    };
  }, []);

  const courses: Course[] = useMemo(() => ([
    {
      id: 'course_platform',
      title: 'COMO FAZER AS OPERAÇÕES, COMO ANALISAR GRÁFICOS',
      description: 'Aprenda a navegar e usar todos os recursos da plataforma.',
      level: 'Iniciante',
      image: 'https://img.youtube.com/vi/knYLKNDxOTk/maxresdefault.jpg',
      locked: false,
      lessons: [
        {
          id: 'p1',
          title: 'COMO FAZER AS OPERAÇÕES, COMO ANALISAR GRÁFICOS',
          vimeoEmbedUrl: 'https://www.youtube.com/embed/knYLKNDxOTk?si=63sSyBWjXut1xTn5',
        },
      ]
    },
    {
      id: 'course_at',
      title: 'COMO FAZER O CADASTRO NA CORRETORA',
      description: 'Domine os conceitos básicos e avançados de análise técnica.',
      level: 'Intermediário',
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=900&auto=format&fit=crop&q=60',
      locked: false,
      lessons: [
        {
          id: 'a1',
          title: 'COMO FAZER O CADASTRO NA CORRETORA',
          vimeoEmbedUrl: 'https://www.youtube.com/embed/CpurpGANMKs?si=Rq-oI2To1CRnpkVh',
        },
      ]
    },
  ]), []);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalLessons, setModalLessons] = useState<Lesson[]>([]);
  const [activeEmbedUrl, setActiveEmbedUrl] = useState('');

  const openSingleVideo = (title: string, embedUrl: string) => {
    setModalTitle(title);
    setModalLessons([]);
    setActiveEmbedUrl(embedUrl);
    setModalOpen(true);
  };

  const openCourse = (course: Course) => {
    if (course.locked) return;
    setModalTitle(course.title);
    setModalLessons(course.lessons);
    setActiveEmbedUrl(course.lessons[0]?.vimeoEmbedUrl || '');
    setModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8 border-b border-nexus-border pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="text-nexus-primary" />
          Área de Aprendizado
        </h2>
        <p className="text-nexus-muted text-sm mt-1">Domine a plataforma e melhore seus resultados.</p>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0A0A0A] border border-nexus-border rounded-2xl w-full max-w-5xl overflow-hidden">
            <div className="p-4 border-b border-nexus-border flex items-center justify-between">
              <div className="text-white font-bold">{modalTitle}</div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg hover:bg-white/5 text-gray-300"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid lg:grid-cols-[320px_1fr]">
              <div className="border-b lg:border-b-0 lg:border-r border-nexus-border max-h-[70vh] overflow-auto">
                {modalLessons.length > 0 ? (
                  <div className="p-3 space-y-2">
                    {modalLessons.map((lesson, idx) => (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => setActiveEmbedUrl(lesson.vimeoEmbedUrl)}
                        className={`w-full text-left px-3 py-3 rounded-xl border transition-colors ${
                          activeEmbedUrl === lesson.vimeoEmbedUrl
                            ? 'border-nexus-primary/50 bg-nexus-primary/10 text-white'
                            : 'border-nexus-border bg-transparent text-gray-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="text-xs text-gray-500 mb-1">Aula {idx + 1}</div>
                        <div className="font-medium">{lesson.title}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-sm text-gray-400">Assista ao vídeo.</div>
                )}
              </div>

              <div className="p-4">
                <div className="w-full aspect-video rounded-xl overflow-hidden border border-nexus-border bg-black">
                  {activeEmbedUrl ? (
                    <iframe
                      src={activeEmbedUrl}
                      className="w-full h-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={modalTitle}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      Sem link configurado.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="glass-panel rounded-xl p-4 border border-nexus-border/60 mb-6 flex items-center justify-between gap-4">
        <div>
          <div className="text-white font-bold">{welcomeVideo.title}</div>
          <div className="text-xs text-nexus-muted">{welcomeVideo.description}</div>
        </div>
        <button
          type="button"
          onClick={() => openSingleVideo(welcomeVideo.title, welcomeVideo.vimeoEmbedUrl)}
          className="px-5 py-2 bg-nexus-primary hover:bg-nexus-400 text-black font-bold rounded-lg flex items-center gap-2"
        >
          <Play size={16} fill="currentColor" className="ml-0.5" />
          Assistir
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="glass-panel rounded-xl overflow-hidden group hover:border-nexus-primary/40 transition-all cursor-pointer"
            onClick={() => openCourse(course)}
          >
            <div className="h-40 relative overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title} 
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${course.locked ? 'grayscale opacity-40' : ''}`} 
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {course.locked ? (
                  <Lock className="text-gray-400" size={32} />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-nexus-primary/90 flex items-center justify-center text-black">
                    <Play size={20} fill="currentColor" className="ml-1" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  course.level === 'Iniciante' ? 'bg-green-900/50 text-green-400' :
                  course.level === 'Intermediário' ? 'bg-yellow-900/50 text-yellow-400' :
                  'bg-red-900/50 text-red-400'
                }`}>
                  {course.level}
                </span>
                {course.locked && <Lock size={14} className="text-gray-500" />}
              </div>
              
              <h3 className={`font-medium leading-tight mb-2 ${course.locked ? 'text-gray-500' : 'text-gray-100 group-hover:text-nexus-primary transition-colors'}`}>
                {course.title}
              </h3>

              <p className="text-xs text-nexus-muted mb-2">
                {course.description}
              </p>
              
              <p className="text-xs text-nexus-muted">
                {course.locked ? 'Disponível no plano Master' : `${course.lessons.length} vídeos`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};