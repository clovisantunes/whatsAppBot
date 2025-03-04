import React, { useState, useContext } from "react";
import './style.css';
import { useImageContext } from '../../ImageContext.ts'; // Contexto das imagens
import { useDelayContext } from '../../DelayContext.ts'; // Contexto do atraso
import { useResendMessageContext } from '../../ResendMessageContext.ts'; 

type FunctionComponentsProps = {
  id: string;
  className: string;
};

export default function FunctionComponents({ id, className }: FunctionComponentsProps) {
  const { delay, setDelay } = useDelayContext(); // Contexto do atraso
  const { resendMessage, setResendMessage } = useResendMessageContext(); // Contexto do reenvio
  const { images, setImages } = useImageContext(); // Contexto das imagens
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const MAX_IMAGES = 10;

  const handleDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDelay(Number(e.target.value)); // Atualiza o atraso
  };

  const handleResendMessage = (value: boolean) => {
    setResendMessage(value); // Atualiza a opção de reenvio
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      if (images.length + files.length > MAX_IMAGES) {
        alert(`Você pode carregar no máximo ${MAX_IMAGES} imagens.`);
        return;
      }

      const validImages = files.filter((file) => file.type.startsWith('image/'));

      if (validImages.length !== files.length) {
        alert("Apenas arquivos de imagem são permitidos.");
      }

      const newImages = [...images, ...validImages];
      setImages(newImages); 

      const newPreviews = validImages.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
  };

  return (
    <div className={`functionComponents_Container ${className}`} id={id}>
      <div className="functionComponents_Components">
        <h1>Funções</h1>
        <div className="delaySection">
          <label htmlFor="delayInput">Atraso no envio de cada mensagem (minutos):</label>
          <input
            type="number"
            id="delayInput"
            value={delay}
            onChange={handleDelayChange}
            min="0"
          />
        </div>

        <div className="resendSection">
          <p>Enviar mensagem novamente?</p>
          <div className="resendButtons">
            <button
              className={resendMessage === true ? "selected" : ""}
              onClick={() => handleResendMessage(true)}
            >
              Sim
            </button>
            <button
              className={resendMessage === false ? "selected" : ""}
              onClick={() => handleResendMessage(false)}
            >
              Não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}