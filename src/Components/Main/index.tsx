import React, { useState, useEffect } from "react";
import "./style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputItems from "../InputsItems/index.tsx";
import { useStatusContext } from '../../Contexts/StatusContext.tsx';

type MainProps = {
  id: string;
  className: string;
};

export default function Main({ id, className }: MainProps) {
  const [number, setNumber] = useState("");
  const [savedNumbers, setSavedNumbers] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const { setTotalNumbersToSend } = useStatusContext();

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
    const numbersArray = number.split(/[\n, ]+/).map(num => num.trim()).filter(num => num !== "");

    const validNumbers: string[] = [];
    const invalidNumbers: string[] = [];

    numbersArray.forEach(num => {
      const formattedNumber = formatPhoneNumber(num);

      if (!isValidPhoneNumber(formattedNumber)) {
        invalidNumbers.push(num);
      } else if (!savedNumbers.includes(formattedNumber)) {
        validNumbers.push(formattedNumber);
      } else {
        toast.error(`Número já adicionado: ${formattedNumber}`, { position: "top-right" });
      }
    });

    if (invalidNumbers.length > 0) {
      toast.error(`Números inválidos: ${invalidNumbers.join(", ")}! Use o formato DDD + 8 dígitos (ex: 5199999999)`, {
        position: "top-right",
      });
    }

    if (validNumbers.length > 0) {
      setSavedNumbers(prev => [...prev, ...validNumbers]);
      toast.success(`Números adicionados: ${validNumbers.join(", ")}`, { position: "top-right" });
    }

    setNumber("");
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setNumber(inputValue);
  };

  const handleAddFromInputItems = (numbers: string[]) => {
    const formattedNumbers = numbers.map(num => formatPhoneNumber(num));
    const uniqueNumbers = formattedNumbers.filter(num => !savedNumbers.includes(num));

    if (uniqueNumbers.length > 0) {
      setSavedNumbers(prev => [...prev, ...uniqueNumbers]);
      toast.success(`Números adicionados: ${uniqueNumbers.join(", ")}`, { position: "top-right" });
    } else {
      toast.error("Nenhum número novo para adicionar.", { position: "top-right" });
    }
  };

  const handleImagesUpdate = (newImages: File[]) => {
    setImages(newImages);
  };

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
            <textarea
              className="inputNumber"
              placeholder="Digite os números separados por vírgulas, espaços ou quebras de linha (ex: 5199999999, 5198888888)"
              value={number}
              onChange={handleInputChange}
              rows={5}
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