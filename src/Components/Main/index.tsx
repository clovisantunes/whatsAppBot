import React, { useState, useEffect } from "react";
import "./style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputItems from "../InputsItems/index.tsx";
import { useStatusContext } from '../../Contexts/StatusContext.tsx'; // Importe o contexto

type MainProps = {
  id: string;
  className: string;
};

export default function Main({ id, className }: MainProps) {
  const [number, setNumber] = useState("");
  const [savedNumbers, setSavedNumbers] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const { setTotalNumbersToSend } = useStatusContext(); // Acesse a função para atualizar o total de números

  const isValidPhoneNumber = (num: string) => {
    return /^55\d{10}$/.test(num);
  };

  const formatPhoneNumber = (num: string) => {
    const numericValue = num.replace(/\D/g, "");

    if (numericValue.startsWith("55") && numericValue.length === 13) {
      return numericValue.slice(0, 10) + numericValue.slice(11);
    }

    if (!numericValue.startsWith("55")) {
      return `55${numericValue}`;
    }

    return numericValue;
  };

  const handleSave = () => {
    const formattedNumber = formatPhoneNumber(number);

    if (!isValidPhoneNumber(formattedNumber)) {
      toast.error("Número inválido! Use o formato DDD + 8 dígitos (ex: 5199999999)", {
        position: "top-right",
      });
      return;
    }

    if (!savedNumbers.includes(formattedNumber)) {
      setSavedNumbers([...savedNumbers, formattedNumber]);
      setNumber("");
    } else {
      toast.error("Número já adicionado!", { position: "top-right" });
    }
  };

  const handleDelete = (num: string) => {
    const item = document.getElementById(`saved-${num}`);
    if (item) {
      item.classList.add("removing");
      setTimeout(() => {
        setSavedNumbers((prev) => prev.filter((n) => n !== num));
      }, 300);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, "");

    if (inputValue !== numericValue) {
      toast.error("Apenas números são permitidos", { position: "top-right" });
    }

    setNumber(numericValue);
  };

  const handleAddFromInputItems = (num: string) => {
    const formattedNumber = formatPhoneNumber(num);
    if (!savedNumbers.includes(formattedNumber)) {
      setSavedNumbers([...savedNumbers, formattedNumber]);
    }
  };

  const handleImagesUpdate = (newImages: File[]) => {
    setImages(newImages);
  };

  // Atualiza o total de números a enviar sempre que savedNumbers mudar
  useEffect(() => {
    setTotalNumbersToSend(savedNumbers.length);
  }, [savedNumbers, setTotalNumbersToSend]);

  return (
    <div className={`main_Container ${className}`} id={id}>
      <ToastContainer />
      <div className="main_component">
        <div className="card_one">
          <div className="card_one_text">
            <h1>Digite o número a ser enviado à mensagem:</h1>
          </div>
          <div className="card_one_input">
            <input
              className="inputNumber"
              type="text"
              placeholder="Digite o número (ex: 5199999999)"
              value={number}
              onChange={handleInputChange}
              maxLength={12}
            />
            <button className="buttonNumber" onClick={handleSave}>
              Salvar
            </button>
          </div>
        </div>
        <div className="card_two">
          <div className="card_two_text">
            <h1>Números destinados:</h1>
          </div>
          <div className="savedNumbers_container">
            {savedNumbers.map((num) => (
              <div key={num} id={`saved-${num}`} className="savedNumber">
                {num}
                <button className="deleteButton" onClick={() => handleDelete(num)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <InputItems savedNumbers={savedNumbers} onAddNumber={handleAddFromInputItems} />
      </div>
    </div>
  );
}