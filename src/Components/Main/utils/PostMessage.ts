import { Api } from "../../../Api/api.ts";

interface PostMessageProps {
  to: string[];
  message: string;
  formData?: FormData;
  ignoreSent?: boolean;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: {
    message: string;
    details?: {
      errorType?: string;
      message?: string;
    };
  };
}

export default async function PostMessage({
  to,
  message,
  formData,
  ignoreSent = false,
}: PostMessageProps): Promise<ApiResponse> {
  try {
    const route = ignoreSent ? "/message/sendIgnoreSent" : "/message/send";

    const postMessage = await Api().post(route, {
      to: to,
      message: message,
      ...(formData && { formData }),
    });

    return {
      success: true,
      message: postMessage.data.message || "Mensagem enviada com sucesso!",
      data: postMessage.data.data,
    };
  } catch (error) {
    console.log(error);

    const errorData = error.response?.data || {};
    
    const errorResponse: ApiResponse = {
      success: false,
      error: {
        message: errorData.details?.message || errorData.error || "Erro ao enviar a mensagem.",
        details: {
          errorType: errorData.details?.errorType || "GENERIC_ERROR",
          message: errorData.details?.message || "Erro desconhecido.",
        },
      },
    };

    console.error("Erro ao enviar mensagem:", errorResponse);

    return errorResponse;
  }
}
