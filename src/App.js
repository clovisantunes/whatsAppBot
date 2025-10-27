import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import NavBar from './Components/NavBar/index.tsx';
import Main from './Components/Main/index.tsx';
import FunctionComponents from './Components/FunctionComponents/index.tsx';
import StatusComponent from './Components/StatusComponent/index.tsx';
import './App.css';
import Footer from './Components/Footer/index.tsx';
import ImageContext from './Contexts/ImageContext.ts';
import DelayContext from './Contexts/DelayContext.ts';
import ResendMessageContext from './Contexts/ResendMessageContext.ts';
import { StatusProvider } from './Contexts/StatusContext.tsx';

function App() {
  const [activeComponent, setActiveComponent] = useState('inicio');
  const [socket, setSocket] = useState(null);
  const [images, setImages] = useState([]);
  const [delay, setDelay] = useState(0);
  const [resendMessage, setResendMessage] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000'); 
    setSocket(newSocket);

    newSocket.on('message', (data) => {
      console.log('Mensagem recebida do servidor:', data);
    });

    return () => newSocket.disconnect();
  }, []);

  const handleNavClick = (component) => {
    setActiveComponent(component);
  };

  const getPositionClass = (component) => {
    const positions = {
      inicio: { inicio: 'center', function: 'right', status: 'ultra_right' },
      function: { inicio: 'left', function: 'center', status: 'right' },
      status: { inicio: 'ultra_left', function: 'left', status: 'center' }
    };
    return positions[activeComponent]?.[component] || '';
  };

  const sendMessage = (message) => {
    socket?.emit('message', message);
  };

  return (
    <ImageContext.Provider value={{ images, setImages }}>
      <DelayContext.Provider value={{ delay, setDelay }}>
        <StatusProvider>
          <ResendMessageContext.Provider value={{ resendMessage, setResendMessage }}>
            <div className="App">
              <NavBar onNavClick={handleNavClick} activeComponent={activeComponent} />
              <div className="container">
                <Main className={`component ${getPositionClass('inicio')}`} sendMessage={sendMessage} />
                <FunctionComponents className={`component ${getPositionClass('function')}`} />
                <StatusComponent className={`component ${getPositionClass('status')}`} />
              </div>
              <Footer />
            </div>
          </ResendMessageContext.Provider>
        </StatusProvider>
      </DelayContext.Provider>
    </ImageContext.Provider>
  );
}

export default App;