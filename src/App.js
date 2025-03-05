import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import NavBar from './Components/NavBar/index.tsx';
import Main from './Components/Main/index.tsx';
import FunctionComponents from './Components/FunctionComponents/index.tsx';
import StatusComponent from './Components/StatusComponent/index.tsx';
import './App.css';
import Footer from './Components/Footer/index.tsx';
import ImageContext from './Contexts/ImageContext.ts'; // Importe o contexto das imagens
import DelayContext from './Contexts/DelayContext.ts'; // Importe o contexto do atraso
import ResendMessageContext from './Contexts/ResendMessageContext.ts';
import { StatusProvider } from './Contexts/StatusContext.tsx';

function App() {
  const [activeComponent, setActiveComponent] = useState('inicio');
  const [socket, setSocket] = useState(null);
  const [images, setImages] = useState([]); // Estado para as imagens
  const [delay, setDelay] = useState(0); // Estado para o atraso
  const [resendMessage, setResendMessage] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000'); 
    setSocket(newSocket);

    newSocket.on('message', (data) => {
      console.log('Mensagem recebida do servidor:', data);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleNavClick = (component) => {
    setActiveComponent(component);
  };

  const getPositionClass = (component) => {
    switch (activeComponent) {
      case 'inicio':
        return component === 'inicio' ? 'center' : component === 'function' ? 'right' : 'ultra_right';
      case 'function':
        return component === 'inicio' ? 'left' : component === 'function' ? 'center' : 'right';
      case 'status':
        return component === 'inicio' ? 'ultra_left' : component === 'function' ? 'left' : 'center';
      default:
        return '';
    }
  };

  const sendMessage = (message) => {
    if (socket) {
      socket.emit('message', message);
    }
  };

  return (
    <ImageContext.Provider value={{ images, setImages }}>
      <DelayContext.Provider value={{ delay, setDelay }}> 
      <StatusProvider>
      <ResendMessageContext.Provider value={{ resendMessage, setResendMessage }}>
        <div className="App">
          <NavBar onNavClick={handleNavClick} />
          <div className="container">
            <Main className={getPositionClass('inicio')} sendMessage={sendMessage} />
            <FunctionComponents className={getPositionClass('function')} />
            <StatusComponent className={getPositionClass('status')} />
            <Footer />
          </div>
        </div>
        </ResendMessageContext.Provider>
        </StatusProvider>
      </DelayContext.Provider>

    </ImageContext.Provider>
  );
}

export default App;