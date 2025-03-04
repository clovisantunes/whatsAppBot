import { Api } from "../../../Api/api.ts";

export async function GetinputInformations() {
  try {
    const response = await Api().get('/messageTemplate/list', {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const formattedData = response.data.data.map((item: any) => ({
      id: item.id,
      message: item.message, 
      label: item.name, 
    }));

    return formattedData;
  } catch (error) {
    throw new Error(error);
  }
}

export async function GetNumberInformations() {
    try {
      const response = await Api().get('/clients', {
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      const formattedData = response.data.data.map((item: any) => {
        const numberWithoutSuffix = item.number.replace('@c.us', ''); 
        const numberWithout55 = numberWithoutSuffix.replace('55', '');
  
        return {
          id: item.id,
          number: numberWithout55, 
          sent: item.sent,
        };
      });
  
      return formattedData;
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function HandleDeleteMessage(id: number) {
    try {
      await Api().delete('messageTemplate/delete', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id: id,
        }
      })
    return true;
    }
    catch(error) {
      throw new Error(error);
    }
  }
  export async function HandleSaveMessage(name: string, message: string): Promise<boolean> {
    try {
      const response = await Api().post('/messageTemplate/create', {
        name: name, // Título da mensagem
        message: message, // Conteúdo da mensagem
      }, {
        headers: {
          'Content-Type': 'application/json', // Define o tipo de conteúdo como JSON
        },
      });
  
      if (response.status === 200 || response.status === 201) {
        return true; // Retorna true se a requisição for bem-sucedida
      } else {
        throw new Error("Erro ao salvar a mensagem: " + response.statusText);
      }
    } catch (error) {
      console.error("Erro ao salvar a mensagem:", error);
      throw new Error("Erro ao salvar a mensagem. Tente novamente.");
    }
  }


export default { GetinputInformations, GetNumberInformations, HandleDeleteMessage }; 