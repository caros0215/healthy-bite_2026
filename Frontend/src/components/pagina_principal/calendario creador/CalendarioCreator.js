import React, { useState, useRef, useCallback, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const CalendarioCreator = () => {
  const [text, setText] = useState('¡Hola Mundo!');
  const [selectedFont, setSelectedFont] = useState('Poppins');
  const [fontSize, setFontSize] = useState(32);
  const [selectedColor, setSelectedColor] = useState('#333333');
  const [selectedElement, setSelectedElement] = useState('mainText');
  const [elements, setElements] = useState([{
    id: 'mainText', type: 'text', content: '¡Hola Mundo!',
    x: 200, y: 250, fontSize: 32, color: '#333333', fontFamily: 'Poppins',
    fontWeight: 'normal', fontStyle: 'normal',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)', webkitTextStroke: 'none'
  }]);
  const [background, setBackground] = useState('white');
  const [styles, setStyles] = useState({ bold: false, italic: false, shadow: false, glow: false, outline: false });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDesigns, setCalendarDesigns] = useState({});
  const [showCalendar, setShowCalendar] = useState(true);
  const [designTitle, setDesignTitle] = useState('');
  const [userId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('cursos');
  const [mobileTab, setMobileTab] = useState('controls');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  // Offset real del header externo (valor fijo para evitar solapamiento)
  // Ajusta este valor segun la altura real de tu header externo (ej: 60px, 70px, etc.)
  const HEADER_HEIGHT = 60;

  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const elementCounter = useRef(1);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const daysOfWeek = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

  const fonts = [
    { name: 'Poppins', value: 'Poppins' },
    { name: 'Montserrat', value: 'Montserrat' },
    { name: 'Open Sans', value: 'Open Sans' },
    { name: 'Dancing Script', value: 'Dancing Script' },
    { name: 'Pacifico', value: 'Pacifico' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Lobster', value: 'Lobster' },
    { name: 'Playfair Display', value: 'Playfair Display' },
    { name: 'Baloo Bhaijaan', value: 'Baloo Bhaijaan' },
    { name: 'Baloo Thambi 2', value: 'Baloo Thambi 2' },
    { name: 'Poppins Light', value: 'Poppins Light' }
  ];

  const colors = [
    '#333333','#ff6b6b','#4ecdc4','#45b7d1','#96ceb4','#ffeaa7',
    '#dda0dd','#98d8c8','#fd79a8','#fdcb6e','#6c5ce7','#74b9ff',
    '#000000','#ffffff','#e74c3c','#3498db','#2ecc71','#f39c12'
  ];

  const stickers = ['😀','😍','🎉','❤️','⭐','🌟','🔥','💎','🌈','🦄','🎨','🚀','🌸','🌺','🎵','☀️'];

  const backgrounds = [
    { name: 'white', style: { background: 'white' } },
    { name: 'gradient1', style: { background: 'linear-gradient(135deg, #667eea, #764ba2)' } },
    { name: 'gradient2', style: { background: 'linear-gradient(135deg, #f093fb, #f5576c)' } },
    { name: 'gradient3', style: { background: 'linear-gradient(135deg, #4facfe, #00f2fe)' } },
    { name: 'gradient4', style: { background: 'linear-gradient(135deg, #43e97b, #38f9d7)' } }
  ];

  const formatDate = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  useEffect(() => { loadMonthDesigns(); cleanPreviousMonths(); }, [currentDate, selectedCategory]);
  useEffect(() => { loadDesignForDate(selectedDate); }, [selectedDate, selectedCategory]);

  const loadMonthDesigns = async () => {
    setIsLoading(true);
    try {
      const año = currentDate.getFullYear();
      const mes = currentDate.getMonth() + 1;
      const endpoint = selectedCategory === 'cursos' ? 'cursos/obtener-disenos' : 'running/obtener-disenos';
      const response = await fetch(`${API_URL}/api/${endpoint}/${userId}/${año}/${mes}`);
      const data = await response.json();
      if (data.success) {
        const designsByDay = {};
        data.diseños.forEach(d => { designsByDay[new Date(d.fecha).getDate()] = d; });
        setCalendarDesigns(designsByDay);
      }
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  const loadDesignForDate = async (date) => {
    try {
      const fechaStr = formatDate(date);
      const endpoint = selectedCategory === 'cursos' ? 'cursos/obtener-diseno' : 'running/obtener-diseno';
      const response = await fetch(`${API_URL}/api/${endpoint}/${userId}/${fechaStr}`);
      const data = await response.json();
      if (data.success && data.diseño) {
        const design = data.diseño;
        setElements(design.elementos || []);
        setBackground(design.fondo || 'white');
        setDesignTitle(design.titulo || '');
        if (design.elementos?.length > 0) {
          const first = design.elementos[0];
          setSelectedElement(first.id);
          if (first.type === 'text') { setText(first.content); setFontSize(first.fontSize); setSelectedColor(first.color); setSelectedFont(first.fontFamily); }
        }
      } else { resetToDefault(); }
    } catch { resetToDefault(); }
  };

  const cleanPreviousMonths = async () => {
    try {
      const año = currentDate.getFullYear();
      const mes = currentDate.getMonth() + 1;
      const endpoint = selectedCategory === 'cursos' ? 'cursos/limpiar-mes-anterior' : 'running/limpiar-mes-anterior';
      await fetch(`${API_URL}/api/${endpoint}/${userId}/${año}/${mes}`, { method: 'DELETE' });
    } catch (e) { console.error(e); }
  };

  const resetToDefault = () => {
    setElements([{ id: 'mainText', type: 'text', content: '¡Hola Mundo!', x: 200, y: 250, fontSize: 32, color: '#333333', fontFamily: 'Poppins', fontWeight: 'normal', fontStyle: 'normal', textShadow: '2px 2px 4px rgba(0,0,0,0.1)', webkitTextStroke: 'none' }]);
    setSelectedElement('mainText'); setText('¡Hola Mundo!'); setBackground('white'); setDesignTitle('');
  };

  const saveDesign = async () => {
    if (!designTitle.trim()) { alert('Por favor ingresa un título'); return; }
    setIsLoading(true); setSaveStatus('Guardando...');
    try {
      const response = await fetch(`${API_URL}/api/${selectedCategory}/guardar-diseno`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: userId, fecha: formatDate(selectedDate), titulo: designTitle, elementos: elements, fondo: background })
      });
      const data = await response.json();
      if (data.success) { setSaveStatus('✅ Guardado correctamente'); await loadMonthDesigns(); setTimeout(() => setSaveStatus(''), 3000); }
      else { setSaveStatus('❌ Error al guardar'); setTimeout(() => setSaveStatus(''), 3000); }
    } catch { setSaveStatus('❌ Error al guardar'); setTimeout(() => setSaveStatus(''), 3000); }
    finally { setIsLoading(false); }
  };

  const updateSelectedElement = useCallback((updates) => {
    setElements(prev => prev.map(el => el.id === selectedElement ? { ...el, ...updates } : el));
  }, [selectedElement]);

  const handleTextChange = (e) => { setText(e.target.value); updateSelectedElement({ content: e.target.value }); };
  const handleFontChange = (font) => { setSelectedFont(font); updateSelectedElement({ fontFamily: font }); };
  const handleSizeChange = (e) => { const s = parseInt(e.target.value); setFontSize(s); updateSelectedElement({ fontSize: s }); };
  const handleColorChange = (color) => { setSelectedColor(color); updateSelectedElement({ color }); };

  const toggleStyle = (styleType) => {
    const newStyles = { ...styles, [styleType]: !styles[styleType] };
    setStyles(newStyles);
    const updates = {};
    if (styleType === 'bold') updates.fontWeight = newStyles.bold ? 'bold' : 'normal';
    if (styleType === 'italic') updates.fontStyle = newStyles.italic ? 'italic' : 'normal';
    if (styleType === 'shadow') updates.textShadow = newStyles.shadow ? '4px 4px 8px rgba(0,0,0,0.5)' : '2px 2px 4px rgba(0,0,0,0.1)';
    if (styleType === 'glow') updates.textShadow = newStyles.glow ? '0 0 20px currentColor' : '2px 2px 4px rgba(0,0,0,0.1)';
    if (styleType === 'outline') updates.webkitTextStroke = newStyles.outline ? '2px #000000' : 'none';
    updateSelectedElement(updates);
  };

  const addSticker = (emoji) => {
    const s = { id: `sticker_${elementCounter.current++}`, type: 'sticker', content: emoji, x: Math.random() * 300 + 50, y: Math.random() * 150 + 50, fontSize: 40 };
    setElements(prev => [...prev, s]); setSelectedElement(s.id);
  };

  const addNewText = () => {
    const t = { id: `text_${elementCounter.current++}`, type: 'text', content: 'Nuevo texto', x: Math.random() * 200 + 50, y: Math.random() * 100 + 50, fontSize: 32, color: '#333333', fontFamily: 'Poppins', fontWeight: 'normal', fontStyle: 'normal', textShadow: '2px 2px 4px rgba(0,0,0,0.1)', webkitTextStroke: 'none' };
    setElements(prev => [...prev, t]); setSelectedElement(t.id); setText('Nuevo texto');
  };

  const deleteElement = () => {
    if (elements.length > 1) {
      const remaining = elements.filter(el => el.id !== selectedElement);
      setElements(remaining); setSelectedElement(remaining[0].id);
    }
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const changeMonth = (inc) => setCurrentDate(prev => { const d = new Date(prev); d.setMonth(prev.getMonth() + inc); return d; });
  const selectDate = (day) => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={`e-${i}`} style={{ aspectRatio: '1' }} />);
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear();
      const hasDesign = calendarDesigns[day];
      days.push(
        <div key={day} onClick={() => selectDate(day)} style={{ aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', background: isSelected ? '#007bff' : hasDesign ? '#e8f5e8' : '#f8f9fa', color: isSelected ? 'white' : hasDesign ? '#28a745' : '#333', border: '1px solid #dee2e6', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: isSelected ? 'bold' : hasDesign ? '600' : 'normal' }}>
          {day}
          {hasDesign && <div style={{ position: 'absolute', bottom: '2px', right: '2px', fontSize: '10px' }}>📝</div>}
        </div>
      );
    }
    return days;
  };

  const getBackgroundStyle = () => {
    const bg = backgrounds.find(b => b.name === background);
    return bg ? bg.style : { background: 'white' };
  };

  const handleMouseDown = (e, elementId) => {
    e.preventDefault(); setIsDragging(true); setSelectedElement(elementId);
    const rect = canvasRef.current.getBoundingClientRect();
    const element = elements.find(el => el.id === elementId);
    setDragOffset({ x: e.clientX - rect.left - element.x, y: e.clientY - rect.top - element.y });
    if (element.type === 'text') { setText(element.content); setFontSize(element.fontSize); setSelectedColor(element.color); setSelectedFont(element.fontFamily); }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedElement) return;
    const rect = canvasRef.current.getBoundingClientRect();
    updateSelectedElement({ x: e.clientX - rect.left - dragOffset.x, y: e.clientY - rect.top - dragOffset.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleElementClick = (elementId) => {
    setSelectedElement(elementId);
    const el = elements.find(e => e.id === elementId);
    if (el?.type === 'text') { setText(el.content); setFontSize(el.fontSize); setSelectedColor(el.color); setSelectedFont(el.fontFamily); }
  };

  // Canvas en móvil: ocupa 75% del viewport height menos el offset del header
  const mobileCanvasW = Math.min(window.innerWidth - 20, 500);
  const mobileCanvasH = Math.max(Math.round(window.innerHeight * 0.75) - HEADER_HEIGHT - 48, 220);

  // ===== SIDEBAR =====
  const sidebarContent = (
    <>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
          {selectedCategory === 'cursos' ? '📚 Cursos Creator' : '🏃 Running Creator'}
        </h1>
        <p style={{ color: '#666', fontSize: '13px' }}>
          {selectedCategory === 'cursos' ? 'Diseños para cursos y capacitaciones' : 'Diseños para plan de entrenamiento'}
        </p>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333', fontSize: '13px' }}>Guardar en:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['cursos', 'running'].map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ flex: 1, padding: '8px', background: selectedCategory === cat ? '#007bff' : '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
              {cat === 'cursos' ? '📚 Cursos' : '🏃 Running'}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <button onClick={() => setShowCalendar(!showCalendar)} style={{ width: '100%', padding: '8px', background: showCalendar ? '#007bff' : '#6c757d', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
          {showCalendar ? '🗓️ Ocultar Calendario' : '🗓️ Mostrar Calendario'}
        </button>
      </div>
      {showCalendar && (
        <div style={{ marginBottom: '20px', padding: '12px', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #e9ecef' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <button onClick={() => changeMonth(-1)} style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}>‹</button>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
            <button onClick={() => changeMonth(1)} style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}>›</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
            {daysOfWeek.map(d => <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#666', padding: '6px 2px' }}>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>{renderCalendar()}</div>
          <div style={{ marginTop: '10px', fontSize: '11px', color: '#666', textAlign: 'center' }}>Seleccionado: {selectedDate.toLocaleDateString('es-ES')}</div>
        </div>
      )}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '13px' }}>Título del diseño:</label>
        <input type="text" value={designTitle} onChange={(e) => setDesignTitle(e.target.value)}
          placeholder={selectedCategory === 'cursos' ? "Ej: Curso de Marketing" : "Ej: Entrenamiento semanal"}
          style={{ width: '100%', padding: '8px 10px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={saveDesign} disabled={isLoading} style={{ width: '100%', padding: '10px', background: isLoading ? '#6c757d' : '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
          {isLoading ? 'Guardando...' : '💾 Guardar Diseño'}
        </button>
        {saveStatus && <div style={{ marginTop: '8px', textAlign: 'center', fontSize: '13px', color: saveStatus.includes('✅') ? '#28a745' : '#dc3545' }}>{saveStatus}</div>}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '12px', color: '#333' }}>📝 Texto</h3>
        <textarea value={text} onChange={handleTextChange} style={{ width: '100%', height: '55px', padding: '8px', border: '2px solid #e9ecef', borderRadius: '6px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', marginBottom: '10px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: '500' }}>Fuente:</label>
            <select value={selectedFont} onChange={(e) => handleFontChange(e.target.value)} style={{ width: '100%', padding: '6px', border: '2px solid #e9ecef', borderRadius: '6px', fontSize: '11px', boxSizing: 'border-box' }}>
              {fonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: '500' }}>Tamaño: {fontSize}px</label>
            <input type="range" min="12" max="100" value={fontSize} onChange={handleSizeChange} style={{ width: '100%' }} />
          </div>
        </div>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: '500' }}>Color:</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '5px', marginBottom: '10px' }}>
          {colors.map(c => <button key={c} onClick={() => handleColorChange(c)} style={{ width: '28px', height: '28px', background: c, border: selectedColor === c ? '3px solid #007bff' : '2px solid #ddd', borderRadius: '5px', cursor: 'pointer' }} />)}
        </div>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: '500' }}>Estilos:</label>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {[{ key: 'bold', label: 'B' }, { key: 'italic', label: 'I' }, { key: 'shadow', label: 'S' }, { key: 'glow', label: 'G' }, { key: 'outline', label: 'O' }].map(s => (
            <button key={s.key} onClick={() => toggleStyle(s.key)} style={{ padding: '6px 10px', background: styles[s.key] ? '#007bff' : '#f8f9fa', color: styles[s.key] ? 'white' : '#333', border: '1px solid #dee2e6', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>{s.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={addNewText} style={{ flex: 1, padding: '8px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>➕ Texto</button>
          <button onClick={deleteElement} disabled={elements.length <= 1} style={{ flex: 1, padding: '8px', background: elements.length <= 1 ? '#6c757d' : '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: elements.length <= 1 ? 'not-allowed' : 'pointer', fontSize: '11px' }}>🗑️ Eliminar</button>
        </div>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '12px', color: '#333' }}>😊 Stickers</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {stickers.map(s => <button key={s} onClick={() => addSticker(s)} style={{ padding: '8px', background: '#f8f9fa', border: '2px solid #e9ecef', borderRadius: '8px', cursor: 'pointer', fontSize: '18px' }}>{s}</button>)}
        </div>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '12px', color: '#333' }}>🎨 Fondos</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {backgrounds.map(bg => <button key={bg.name} onClick={() => setBackground(bg.name)} style={{ height: '36px', border: background === bg.name ? '3px solid #007bff' : '2px solid #e9ecef', borderRadius: '8px', cursor: 'pointer', ...bg.style }} />)}
        </div>
      </div>
    </>
  );

  // ===== CANVAS =====
  const canvasContent = (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '10px', background: '#f8f9fa', width: '100%', boxSizing: 'border-box' }}>
      <div
        ref={canvasRef}
        style={{
          width: isMobile ? `${mobileCanvasW}px` : '800px',
          height: isMobile ? `${mobileCanvasH}px` : '600px',
          position: 'relative', borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden', flexShrink: 0,
          ...getBackgroundStyle()
        }}
        onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
      >
        {elements.map(element => (
          <div key={element.id} onClick={() => handleElementClick(element.id)} onMouseDown={(e) => handleMouseDown(e, element.id)}
            style={{
              position: 'absolute', left: `${element.x}px`, top: `${element.y}px`,
              fontSize: `${element.fontSize}px`, color: element.color, fontFamily: element.fontFamily,
              fontWeight: element.fontWeight || 'normal', fontStyle: element.fontStyle || 'normal',
              textShadow: element.textShadow || 'none', WebkitTextStroke: element.webkitTextStroke || 'none',
              cursor: 'move', userSelect: 'none', padding: '4px',
              border: selectedElement === element.id ? '2px dashed #007bff' : '2px dashed transparent',
              borderRadius: '4px', background: selectedElement === element.id ? 'rgba(0,123,255,0.1)' : 'transparent',
              minWidth: '20px', minHeight: '20px'
            }}>
            {element.content}
          </div>
        ))}
        <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '6px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
          {selectedCategory === 'cursos' ? '📚' : '🏃'} {selectedDate.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '10px' }}>
          {elements.length} elemento{elements.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );

  return (
    <div ref={wrapperRef} style={{ display: 'flex', flexDirection: 'column', width: '100%', height: isMobile ? 'auto' : '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8f9fa', paddingTop: isMobile ? `${HEADER_HEIGHT}px` : 0 }}>

      {/* ── TAB BAR MÓVIL ──
          position: sticky + top = headerOffset  →  se queda visible pegado
          justo debajo del header externo, sin solaparse con él               */}
      {isMobile && (
        <div style={{
          display: 'flex',
          background: 'white',
          borderBottom: '2px solid #e9ecef',
          borderTop: '1px solid #e9ecef',
          position: 'sticky',
          top: 0,   // ahora el padding-top del contenedor ya da el espacio necesario
          zIndex: 100,
          flexShrink: 0,
        }}>
          <button onClick={() => setMobileTab('controls')}
            style={{ flex: 1, padding: '12px', background: mobileTab === 'controls' ? '#007bff' : 'white', color: mobileTab === 'controls' ? 'white' : '#333', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
            🎨 Controles
          </button>
          <button onClick={() => setMobileTab('canvas')}
            style={{ flex: 1, padding: '12px', background: mobileTab === 'canvas' ? '#007bff' : 'white', color: mobileTab === 'canvas' ? 'white' : '#333', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
            🖼️ Canvas
          </button>
        </div>
      )}

      {/* CONTENIDO */}
      <div style={{ display: 'flex', flex: isMobile ? 'none' : 1, flexDirection: 'row', overflow: isMobile ? 'visible' : 'hidden', minHeight: 0 }}>

        {/* SIDEBAR */}
        <div style={{
          width: isMobile ? '100%' : '320px', minWidth: isMobile ? 'unset' : '320px',
          background: 'white', padding: '15px',
          boxShadow: isMobile ? 'none' : '2px 0 10px rgba(0,0,0,0.1)',
          overflowY: 'auto', height: isMobile ? 'auto' : '100%',
          display: isMobile ? (mobileTab === 'controls' ? 'block' : 'none') : 'block',
          boxSizing: 'border-box',
        }}>
          {sidebarContent}
        </div>

        {/* CANVAS */}
        <div style={{
          display: isMobile ? (mobileTab === 'canvas' ? 'block' : 'none') : 'flex',
          flex: isMobile ? 'none' : 1, width: '100%',
          height: isMobile ? `${mobileCanvasH + 20}px` : 'auto',
          overflow: 'hidden',
        }}>
          {canvasContent}
        </div>
      </div>

      {/* TOOLBAR FLOTANTE */}
      <div style={{ position: 'fixed', bottom: isMobile ? '15px' : '25px', right: isMobile ? '15px' : '25px', display: 'flex', gap: '8px', background: 'white', padding: '10px', borderRadius: '25px', boxShadow: '0 8px 25px rgba(0,0,0,0.15)', zIndex: 1000 }}>
        {[
          { onClick: addNewText, bg: '#17a2b8', icon: '➕', title: 'Agregar texto' },
          { onClick: deleteElement, bg: elements.length <= 1 ? '#6c757d' : '#dc3545', icon: '🗑️', title: 'Eliminar', disabled: elements.length <= 1 },
          { onClick: saveDesign, bg: isLoading ? '#6c757d' : '#28a745', icon: '💾', title: 'Guardar', disabled: isLoading },
          { onClick: resetToDefault, bg: '#6c757d', icon: '🧹', title: 'Limpiar' }
        ].map((btn, i) => (
          <button key={i} onClick={btn.onClick} disabled={btn.disabled} title={btn.title}
            style={{ width: isMobile ? '38px' : '44px', height: isMobile ? '38px' : '44px', borderRadius: '50%', background: btn.bg, color: 'white', border: 'none', cursor: btn.disabled ? 'not-allowed' : 'pointer', fontSize: isMobile ? '15px' : '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {btn.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarioCreator;
