import { QRCodeSVG } from "qrcode.react";
import { useNotification } from "../../../contexts/notificationContext";

export const PixPayment = ({ price }: { price: string }) => {
  const { showNotification } = useNotification();

  const generatePixPayload = (price: string) => {
    const payload = `00020101021126360014BR.GOV.BCB.PIX0114119601681595204000053039865802BR5910Fabrício Oliveira Lopes6009SAO PAULO5405${price}62070503***6304`;
    return payload;
  };

  const copyToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      showNotification("Texto copiado para a área de transferência", "success");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center mt-5 flex-col gap-4">
      <QRCodeSVG value={generatePixPayload(price)} size={256} />
      <p className="mx-auto w-2/3 text-center">{generatePixPayload(price)}</p>
      <button
        className="px-4 py-2 bg-gray-300 font-tertiary text-xl rounded active:bg-gray-400"
        onClick={() => copyToClipboard(generatePixPayload(price))}
      >
        Copiar
      </button>
      <h3 className="font-secondary text-2xl mt-5">
        Leia o QR Code com o app do seu banco
      </h3>
      <h4>Ou copie o texto abaixo e cole no app do seu banco</h4>
    </div>
  );
};
