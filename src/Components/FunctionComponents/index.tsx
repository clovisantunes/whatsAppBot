import React, { useState } from "react";
import './style.css';
import { useImageContext } from '../../Contexts/ImageContext.ts';
import { useDelayContext } from '../../Contexts/DelayContext.ts';
import { useResendMessageContext } from '../../Contexts/ResendMessageContext.ts';
import { 
  HiCog, 
  HiClock, 
  HiRefresh, 
  HiPhotograph, 
  HiCheck, 
  HiX,
  HiCloudUpload
} from "react-icons/hi";

type FunctionComponentsProps = {
  className: string;
};

export default function FunctionComponents({ className }: FunctionComponentsProps) {
  const { delay, setDelay } = useDelayContext();
  const { resendMessage, setResendMessage } = useResendMessageContext();
  const { images, setImages } = useImageContext();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const MAX_IMAGES = 10;

  const handleDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Number(e.target.value));
    setDelay(value);
  };

  const handleResendMessage = (value: boolean) => {
    setResendMessage(value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      if (images.length + files.length > MAX_IMAGES) {
        alert(`Máximo de ${MAX_IMAGES} imagens permitido.`);
        return;
      }

      const validImages = files.filter((file) => file.type.startsWith('image/'));

      if (validImages.length !== files.length) {
        alert("Apenas arquivos de imagem são permitidos.");
        return;
      }

      const newImages = [...images, ...validImages];
      setImages(newImages);

      const newPreviews = validImages.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
  };

  const handleClearAllImages = () => {
    // Revoke all object URLs
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setImages([]);
    setImagePreviews([]);
  };

  return (
    <div className={`functions ${className}`}>
      <div className="functions__container">
        {/* Header Section */}
        <div className="functions__header">
          <div className="functions__icon">
            <HiCog />
          </div>
          <div className="functions__title">
            <h1>Configurações Avançadas</h1>
            <p>Personalize o comportamento do envio de mensagens</p>
          </div>
        </div>

        {/* Delay Configuration Card */}
        <div className="card">
          <div className="card__header">
            <div className="card__icon">
              <HiClock />
            </div>
            <div className="card__title">
              <h2>Tempo de Espera</h2>
              <p>Intervalo entre o envio de mensagens</p>
            </div>
          </div>

          <div className="card__content">
            <div className="input-group">
              <label htmlFor="delayInput" className="input-label">
                Duração em minutos
              </label>
              <div className="number-input-group">
                <input
                  id="delayInput"
                  type="number"
                  value={delay}
                  onChange={handleDelayChange}
                  min="0"
                  max="60"
                  step="1"
                  className="input number-input"
                  placeholder="0"
                />
                <span className="number-input-suffix">minutos</span>
              </div>
              <div className="input-hint">
                Define o tempo de espera entre cada mensagem enviada
              </div>
            </div>
          </div>
        </div>

        {/* Resend Configuration Card */}
        <div className="card">
          <div className="card__header">
            <div className="card__icon">
              <HiRefresh />
            </div>
            <div className="card__title">
              <h2>Retentativa de Envio</h2>
              <p>Comportamento em caso de falha</p>
            </div>
          </div>

          <div className="card__content">
            <div className="toggle-group">
              <label className="toggle-label">
                Tentar reenviar mensagens em caso de falha?
              </label>
              <div className="toggle-buttons">
                <button
                  className={`toggle-btn ${resendMessage === true ? "toggle-btn--active" : ""}`}
                  onClick={() => handleResendMessage(true)}
                  aria-pressed={resendMessage === true}
                >
                  <HiCheck className="toggle-btn__icon" />
                  <span>Sim</span>
                </button>
                <button
                  className={`toggle-btn ${resendMessage === false ? "toggle-btn--active" : ""}`}
                  onClick={() => handleResendMessage(false)}
                  aria-pressed={resendMessage === false}
                >
                  <HiX className="toggle-btn__icon" />
                  <span>Não</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Media Configuration Card */}
        <div className="card">
          <div className="card__header">
            <div className="card__icon">
              <HiPhotograph />
            </div>
            <div className="card__title">
              <h2>Mídia & Imagens</h2>
              <p>Gerencie arquivos de mídia para envio</p>
            </div>
            {images.length > 0 && (
              <div className="card__actions">
                <span className="badge">{images.length}/{MAX_IMAGES}</span>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={handleClearAllImages}
                  title="Remover todas as imagens"
                >
                  <HiX className="btn__icon" />
                  Limpar
                </button>
              </div>
            )}
          </div>

          <div className="card__content">
            <div className="upload-section">
              <label className="upload-area">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={images.length >= MAX_IMAGES}
                  className="upload-input"
                />
                <div className="upload-content">
                  <HiCloudUpload className="upload-icon" />
                  <div className="upload-text">
                    <h3>Adicionar Imagens</h3>
                    <p>Clique para selecionar ou arraste arquivos</p>
                    <span className="upload-hint">
                      Máximo: {MAX_IMAGES} imagens • Formatos: JPG, PNG, GIF
                    </span>
                  </div>
                </div>
              </label>

              {imagePreviews.length > 0 && (
                <div className="images-section">
                  <div className="images-grid">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="image-card">
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`}
                          className="image-preview"
                          loading="lazy"
                        />
                        <div className="image-overlay">
                          <span className="image-number">{index + 1}</span>
                          <button 
                            className="image-remove"
                            onClick={() => handleRemoveImage(index)}
                            title="Remover imagem"
                            aria-label={`Remover imagem ${index + 1}`}
                          >
                            <HiX />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}