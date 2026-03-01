import React, { useState, useRef, useCallback, useEffect } from 'react';

const CalendarioCreator = () => {
  // Estados existentes del text creator
  const [text, setText] = useState('¡Hola Mundo!');
  const [selectedFont, setSelectedFont] = useState('Poppins');
  const [fontSize, setFontSize] = useState(32);
  const [selectedColor, setSelectedColor] = useState('#333333');
  const [selectedElement, setSelectedElement] = useState('mainText');
  const [elements, setElements] = useState([
    {
      id: 'mainText',
      type: 'text',
      content: '¡Hola Mundo!',
      x: 200,
      y: 250,
      fontSize: 32,
      color: '#333333',
      fontFamily: 'Poppins',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
      webkitTextStroke: 'none'
    }
  ]);
  const [background, setBackground] = useState('white');
  const [styles, setStyles] = useState({
    bold: false,
    italic: false,
    shadow: false,
    glow: false,
    outline: false
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Estados del calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDesigns, setCalendarDesigns] = useState({});
  const [showCalendar, setShowCalendar] = useState(true);
  const [designTitle, setDesignTitle] = useState('');
  const [userId] = useState(1); // En producción, esto vendría del login
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Nuevo estado para la categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState('cursos'); // 'cursos' o 'running'

  const canvasRef = useRef(null);
  const elementCounter = useRef(1);

  // Meses en español
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Días de la semana en español
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Configuraciones existentes
  const fonts = [
    { name: 'Poppins', value: 'Poppins' },
    { name: 'Montserrat', value: 'Montserrat' },
    { name: 'Open Sans', value: 'Open Sans' },
    { name: 'Dancing Script', value: 'Dancing Script' },
    { name: 'Pacifico', value: 'Pacifico' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Lobster', value: 'Lobster' },
    { name: 'Playfair Display', value: 'Playfair Display' },
    { name: 'Baloo Bhaijaan Regular', value: 'Baloo Bhaijaan' },
    { name: 'Baloo Thambi 2', value: 'Baloo Thambi 2' },
    { name: 'Poppins Light', value: 'Poppins Light' }
  ];

  const colors = [
    '#333333', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
    '#dda0dd', '#98d8c8', '#fd79a8', '#fdcb6e', '#6c5ce7', '#74b9ff',
    '#000000', '#ffffff', '#e74c3c', '#3498db', '#2ecc71', '#f39c12'
  ];

  const stickers = [
    '😀', '😍', '🎉', '❤️', '⭐', '🌟', '🔥', '💎',
    '🌈', '🦄', '🎨', '🚀', '🌸', '🌺', '🎵', '☀️'
  ];

  const backgrounds = [
    { name: 'white', style: { background: 'white' } },
    { name: 'gradient1', style: { background: 'linear-gradient(135deg, #667eea, #764ba2)' } },
    { name: 'gradient2', style: { background: 'linear-gradient(135deg, #f093fb, #f5576c)' } },
    { name: 'gradient3', style: { background: 'linear-gradient(135deg, #4facfe, #00f2fe)' } },
    { name: 'gradient4', style: { background: 'linear-gradient(135deg, #43e97b, #38f9d7)' } }
  ];

  // Función para formatear la fecha en formato YYYY-MM-DD, manteniendo la fecha local
  const formatDate = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  // Cargar diseños del mes actual al iniciar y cuando cambia el mes o categoría
  useEffect(() => {
    loadMonthDesigns();
    cleanPreviousMonths();
  }, [currentDate, selectedCategory]);

  // Cargar diseño de la fecha seleccionada
  useEffect(() => {
    loadDesignForDate(selectedDate);
  }, [selectedDate, selectedCategory]);

  const loadMonthDesigns = async () => {
    setIsLoading(true);
    try {
      const año = currentDate.getFullYear();
      const mes = currentDate.getMonth() + 1;
      
      const endpoint = selectedCategory === 'cursos' 
        ? `cursos/obtener-disenos` 
        : `running/obtener-disenos`;
      
      const response = await fetch(`http://localhost:5000/api/${endpoint}/${userId}/${año}/${mes}`);
      const data = await response.json();
      
      if (data.success) {
        const designsByDay = {};
        data.diseños.forEach(design => {
          const designDate = new Date(design.fecha).getDate();
          designsByDay[designDate] = design;
        });
        setCalendarDesigns(designsByDay);
      }
    } catch (error) {
      console.error('Error cargando diseños del mes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDesignForDate = async (date) => {
    try {
      const fechaStr = formatDate(date);
      
      const endpoint = selectedCategory === 'cursos' 
        ? `cursos/obtener-diseno` 
        : `running/obtener-diseno`;
      
      const response = await fetch(`http://localhost:5000/api/${endpoint}/${userId}/${fechaStr}`);
      const data = await response.json();
      
      if (data.success && data.diseño) {
        const design = data.diseño;
        setElements(design.elementos || []);
        setBackground(design.fondo || 'white');
        setDesignTitle(design.titulo || '');
        
        if (design.elementos && design.elementos.length > 0) {
          const firstElement = design.elementos[0];
          setSelectedElement(firstElement.id);
          if (firstElement.type === 'text') {
            setText(firstElement.content);
            setFontSize(firstElement.fontSize);
            setSelectedColor(firstElement.color);
            setSelectedFont(firstElement.fontFamily);
          }
        }
      } else {
        resetToDefault();
      }
    } catch (error) {
      console.error('Error cargando diseño:', error);
      resetToDefault();
    }
  };

  const cleanPreviousMonths = async () => {
    try {
      const año = currentDate.getFullYear();
      const mes = currentDate.getMonth() + 1;
      
      const endpoint = selectedCategory === 'cursos' 
        ? `cursos/limpiar-mes-anterior` 
        : `running/limpiar-mes-anterior`;
      
      await fetch(`http://localhost:5000/api/${endpoint}/${userId}/${año}/${mes}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error limpiando meses anteriores:', error);
    }
  };

  const resetToDefault = () => {
    setElements([{
      id: 'mainText',
      type: 'text',
      content: '¡Hola Mundo!',
      x: 200,
      y: 250,
      fontSize: 32,
      color: '#333333',
      fontFamily: 'Poppins',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
      webkitTextStroke: 'none'
    }]);
    setSelectedElement('mainText');
    setText('¡Hola Mundo!');
    setBackground('white');
    setDesignTitle('');
  };

  const saveDesign = async () => {
    if (!designTitle.trim()) {
      alert('Por favor ingresa un título para el diseño');
      return;
    }

    setIsLoading(true);
    setSaveStatus('Guardando...');

    try {
      const fechaStr = formatDate(selectedDate);
      const endpoint = `/api/${selectedCategory}/guardar-diseno`;
      
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: userId,
          fecha: fechaStr,
          titulo: designTitle,
          elementos: elements,
          fondo: background
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSaveStatus('✅ Guardado correctamente');
        await loadMonthDesigns(); // Recargar para reflejar el cambio
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('❌ Error al guardar');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (error) {
      console.error('Error guardando diseño:', error);
      setSaveStatus('❌ Error al guardar');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Funciones existentes del text creator
  const updateSelectedElement = useCallback((updates) => {
    setElements(prev => prev.map(el => 
      el.id === selectedElement ? { ...el, ...updates } : el
    ));
  }, [selectedElement]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    updateSelectedElement({ content: newText });
  };

  const handleFontChange = (font) => {
    setSelectedFont(font);
    updateSelectedElement({ fontFamily: font });
  };

  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setFontSize(newSize);
    updateSelectedElement({ fontSize: newSize });
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    updateSelectedElement({ color });
  };

  const toggleStyle = (styleType) => {
    const newStyles = { ...styles, [styleType]: !styles[styleType] };
    setStyles(newStyles);

    let updates = {};
    
    switch (styleType) {
      case 'bold':
        updates.fontWeight = newStyles.bold ? 'bold' : 'normal';
        break;
      case 'italic':
        updates.fontStyle = newStyles.italic ? 'italic' : 'normal';
        break;
      case 'shadow':
        updates.textShadow = newStyles.shadow ? '4px 4px 8px rgba(0,0,0,0.5)' : '2px 2px 4px rgba(0,0,0,0.1)';
        break;
      case 'glow':
        updates.textShadow = newStyles.glow ? '0 0 20px currentColor' : '2px 2px 4px rgba(0,0,0,0.1)';
        break;
      case 'outline':
        updates.webkitTextStroke = newStyles.outline ? '2px #000000' : 'none';
        break;
    }
    
    updateSelectedElement(updates);
  };

  const addSticker = (emoji) => {
    const newSticker = {
      id: `sticker_${elementCounter.current++}`,
      type: 'sticker',
      content: emoji,
      x: Math.random() * 400 + 200,
      y: Math.random() * 300 + 150,
      fontSize: 40
    };
    setElements(prev => [...prev, newSticker]);
    setSelectedElement(newSticker.id);
  };

  const addNewText = () => {
    const newText = {
      id: `text_${elementCounter.current++}`,
      type: 'text',
      content: 'Nuevo texto',
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
      fontSize: 32,
      color: '#333333',
      fontFamily: 'Poppins',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
      webkitTextStroke: 'none'
    };
    setElements(prev => [...prev, newText]);
    setSelectedElement(newText.id);
    setText('Nuevo texto');
  };

  const deleteElement = () => {
    if (elements.length > 1) {
      setElements(prev => prev.filter(el => el.id !== selectedElement));
      const remainingElements = elements.filter(el => el.id !== selectedElement);
      if (remainingElements.length > 0) {
        setSelectedElement(remainingElements[0].id);
      }
    }
  };

  // Funciones del calendario
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (increment) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + increment);
      return newDate;
    });
  };

  const selectDate = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div 
          key={`empty-${i}`} 
          style={{
            aspectRatio: '1',
            background: 'transparent'
          }}
        />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate.getDate() === day && 
                        selectedDate.getMonth() === currentDate.getMonth() && 
                        selectedDate.getFullYear() === currentDate.getFullYear();
      const hasDesign = calendarDesigns[day];
      
      days.push(
        <div
          key={day}
          onClick={() => selectDate(day)}
          style={{
            aspectRatio: '1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            background: isSelected ? '#007bff' : hasDesign ? '#e8f5e8' : '#f8f9fa',
            color: isSelected ? 'white' : hasDesign ? '#28a745' : '#333',
            border: '1px solid #dee2e6',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: isSelected ? 'bold' : hasDesign ? '600' : 'normal',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.target.style.background = '#e9ecef';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.target.style.background = hasDesign ? '#e8f5e8' : '#f8f9fa';
            }
          }}
        >
          {day}
          {hasDesign && (
            <div style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              fontSize: '10px'
            }}>
              📝
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const getBackgroundStyle = () => {
    const bg = backgrounds.find(b => b.name === background);
    return bg ? bg.style : { background: 'white' };
  };

  // Funciones de arrastrar
  const handleMouseDown = (e, elementId) => {
    e.preventDefault();
    setIsDragging(true);
    setSelectedElement(elementId);
    
    const rect = canvasRef.current.getBoundingClientRect();
    const element = elements.find(el => el.id === elementId);
    setDragOffset({
      x: e.clientX - rect.left - element.x,
      y: e.clientY - rect.top - element.y
    });

    if (element.type === 'text') {
      setText(element.content);
      setFontSize(element.fontSize);
      setSelectedColor(element.color);
      setSelectedFont(element.fontFamily);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedElement) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;
    
    updateSelectedElement({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleElementClick = (elementId) => {
    setSelectedElement(elementId);
    const element = elements.find(el => el.id === elementId);
    if (element && element.type === 'text') {
      setText(element.content);
      setFontSize(element.fontSize);
      setSelectedColor(element.color);
      setSelectedFont(element.fontFamily);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#f8f9fa'
    }}>
      {/* Sidebar con controles */}
      <div style={{
        width: '350px',
        background: 'white',
        padding: '20px',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        overflowY: 'auto',
        height: '100vh'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#333',
            marginBottom: '10px'
          }}>
            {selectedCategory === 'cursos' ? '📚 Cursos Creator' : '🏃 Running Creator'}
          </h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            {selectedCategory === 'cursos' 
              ? 'Crea diseños para tus cursos y capacitaciones' 
              : 'Crea diseños para tu plan de entrenamiento'}
          </p>
        </div>

        {/* Selector de categoría */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#333'
          }}>
            Guardar en:
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setSelectedCategory('cursos')}
              style={{
                flex: 1,
                padding: '10px',
                background: selectedCategory === 'cursos' ? '#007bff' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              📚 Cursos
            </button>
            <button
              onClick={() => setSelectedCategory('running')}
              style={{
                flex: 1,
                padding: '10px',
                background: selectedCategory === 'running' ? '#007bff' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🏃 Running
            </button>
          </div>
        </div>

        {/* Toggle Calendar */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            style={{
              width: '100%',
              padding: '10px',
              background: showCalendar ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            {showCalendar ? '🗓️ Ocultar Calendario' : '🗓️ Mostrar Calendario'}
          </button>
        </div>

        {/* Calendario */}
        {showCalendar && (
          <div style={{ 
            marginBottom: '30px',
            padding: '15px',
            background: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <button
                onClick={() => changeMonth(-1)}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  cursor: 'pointer'
                }}
              >
                ‹
              </button>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                onClick={() => changeMonth(1)}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  cursor: 'pointer'
                }}
              >
                ›
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '2px',
              marginBottom: '5px'
            }}>
              {daysOfWeek.map(day => (
                <div
                  key={day}
                  style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#666',
                    padding: '8px 4px'
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '2px'
            }}>
              {renderCalendar()}
            </div>

            <div style={{ 
              marginTop: '15px', 
              fontSize: '12px', 
              color: '#666',
              textAlign: 'center'
            }}>
              Fecha seleccionada: {selectedDate.toLocaleDateString('es-ES')}
            </div>
          </div>
        )}

        {/* Título del diseño */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#333'
          }}>
            Título del diseño:
          </label>
          <input
            type="text"
            value={designTitle}
            onChange={(e) => setDesignTitle(e.target.value)}
            placeholder={
              selectedCategory === 'cursos' 
                ? "Ej: Curso de Marketing Digital" 
                : "Ej: Entrenamiento semanal"
            }
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Botón guardar */}
        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={saveDesign}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              background: isLoading ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Guardando...' : '💾 Guardar Diseño'}
          </button>
          {saveStatus && (
            <div style={{ 
              marginTop: '10px', 
              textAlign: 'center', 
              fontSize: '14px',
              color: saveStatus.includes('✅') ? '#28a745' : '#dc3545'
            }}>
              {saveStatus}
            </div>
          )}
        </div>

        {/* Controles de texto */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#333' }}>📝 Texto</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Contenido:
            </label>
            <textarea
              value={text}
              onChange={handleTextChange}
              style={{
                width: '100%',
                height: '60px',
                padding: '8px',
                border: '2px solid #e9ecef',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '500' }}>
                Fuente:
              </label>
              <select
                value={selectedFont}
                onChange={(e) => handleFontChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              >
                {fonts.map(font => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '500' }}>
                Tamaño: {fontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="100"
                value={fontSize}
                onChange={handleSizeChange}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '500' }}>
              Color:
            </label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(6, 1fr)', 
              gap: '6px' 
            }}>
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  style={{
                    width: '30px',
                    height: '30px',
                    background: color,
                    border: selectedColor === color ? '3px solid #007bff' : '2px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '500' }}>
              Estilos:
            </label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { key: 'bold', label: 'B', title: 'Negrita' },
                { key: 'italic', label: 'I', title: 'Cursiva' },
                { key: 'shadow', label: 'S', title: 'Sombra' },
                { key: 'glow', label: 'G', title: 'Brillo' },
                { key: 'outline', label: 'O', title: 'Contorno' }
              ].map(style => (
                <button
                  key={style.key}
                  onClick={() => toggleStyle(style.key)}
                  title={style.title}
                  style={{
                    padding: '8px 12px',
                    background: styles[style.key] ? '#007bff' : '#f8f9fa',
                    color: styles[style.key] ? 'white' : '#333',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={addNewText}
              style={{
                flex: 1,
                padding: '10px',
                background: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              ➕ Agregar Texto
            </button>
            <button
              onClick={deleteElement}
              disabled={elements.length <= 1}
              style={{
                flex: 1,
                padding: '10px',
                background: elements.length <= 1 ? '#6c757d' : '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: elements.length <= 1 ? 'not-allowed' : 'pointer',
                fontSize: '12px'
              }}
            >
              🗑️ Eliminar
            </button>
          </div>
        </div>

        {/* Stickers */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#333' }}>😊 Stickers</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '8px' 
          }}>
            {stickers.map(sticker => (
              <button
                key={sticker}
                onClick={() => addSticker(sticker)}
                style={{
                  padding: '10px',
                  background: '#f8f9fa',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '20px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#e9ecef';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f8f9fa';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {sticker}
              </button>
            ))}
          </div>
        </div>

        {/* Fondos */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#333' }}>🎨 Fondos</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '8px' 
          }}>
            {backgrounds.map(bg => (
              <button
                key={bg.name}
                onClick={() => setBackground(bg.name)}
                style={{
                  height: '40px',
                  border: background === bg.name ? '3px solid #007bff' : '2px solid #e9ecef',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  ...bg.style
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Canvas Principal */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '20px',
        background: '#f8f9fa'
      }}>
        <div
          ref={canvasRef}
          style={{
            width: '800px',
            height: '600px',
            position: 'relative',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            cursor: 'default',
            ...getBackgroundStyle()
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {elements.map(element => (
            <div
              key={element.id}
              onClick={() => handleElementClick(element.id)}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
              style={{
                position: 'absolute',
                left: `${element.x}px`,
                top: `${element.y}px`,
                fontSize: `${element.fontSize}px`,
                color: element.color,
                fontFamily: element.fontFamily,
                fontWeight: element.fontWeight || 'normal',
                fontStyle: element.fontStyle || 'normal',
                textShadow: element.textShadow || 'none',
                WebkitTextStroke: element.webkitTextStroke || 'none',
                cursor: 'move',
                userSelect: 'none',
                padding: '4px',
                border: selectedElement === element.id ? '2px dashed #007bff' : '2px dashed transparent',
                borderRadius: '4px',
                background: selectedElement === element.id ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
                minWidth: element.type === 'text' ? '20px' : 'auto',
                minHeight: '20px',
                transition: 'all 0.2s ease'
              }}
              title={element.type === 'text' ? `Texto: ${element.content}` : `Sticker: ${element.content}`}
            >
              {element.content}
            </div>
          ))}

          <div style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {selectedCategory === 'cursos' ? '📚' : '🏃'} 
            {' '}
            {selectedDate.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>

          <div style={{
            position: 'absolute',
            bottom: '15px',
            right: '15px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '15px',
            fontSize: '11px'
          }}>
            {elements.length} elemento{elements.length !== 1 ? 's' : ''}
          </div>

          {isLoading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              🔄 {isLoading}
            </div>
          )}
        </div>
      </div>

      {/* Toolbar flotante */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        display: 'flex',
        gap: '10px',
        background: 'white',
        padding: '15px',
        borderRadius: '25px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        zIndex: 1000
      }}>
        <button
          onClick={addNewText}
          title="Agregar texto"
          style={{
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            background: '#17a2b8',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ➕
        </button>
        
        <button
          onClick={deleteElement}
          disabled={elements.length <= 1}
          title="Eliminar elemento"
          style={{
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            background: elements.length <= 1 ? '#6c757d' : '#dc3545',
            color: 'white',
            border: 'none',
            cursor: elements.length <= 1 ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          🗑️
        </button>

        <button
          onClick={saveDesign}
          disabled={isLoading}
          title="Guardar diseño"
          style={{
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            background: isLoading ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          💾
        </button>

        <button
          onClick={resetToDefault}
          title="Limpiar canvas"
          style={{
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          🧹
        </button>
      </div>
    </div>
  );
};

export default CalendarioCreator;