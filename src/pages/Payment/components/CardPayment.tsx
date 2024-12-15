import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

export const CardPayment = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement!,
    });

    if (error) {
      console.error(error.message);
    } else {
      console.log("Pagamento bem-sucedido:", paymentMethod);
    }
  };

  return (
    <div className="w-2/3 p-8">
      <h3 className="text-xl font-semibold text-gray-700 mb-6">
        Pagar com cartão
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label htmlFor="email" className="text-gray-600 mb-1">
          E-mail
        </label>
        <input
          type="email"
          id="email"
          placeholder="Digite seu e-mail"
          className="border border-gray-300 rounded-md p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <label className="text-gray-600 mb-1">Dados do cartão</label>
        <div className="border border-gray-300 rounded-md p-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#333",
                  "::placeholder": { color: "#bfbfbf" },
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>

        <label htmlFor="name" className="text-gray-600 mb-1">
          Nome do titular do cartão
        </label>
        <input
          type="text"
          id="name"
          placeholder="Nome completo"
          className="border border-gray-300 rounded-md p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <button
          type="submit"
          disabled={!stripe}
          className="bg-gray-500 text-white font-semibold py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-400 transition duration-200"
        >
          Pagar
        </button>
      </form>
    </div>
  );
};
