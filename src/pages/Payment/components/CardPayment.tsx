import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useNotification } from "../../../contexts/notificationContext";
import axios from "axios";
import React from "react";
import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../services/firebaseConnection";
import { useNavigate } from "react-router";
import { Course } from "../../Dashboard";
import { useUser } from "../../../hooks/useUser";

export const CardPayment = ({
  value,
  nameCourse,
  setCourse,
}: {
  value: string;
  nameCourse: string;
  setCourse: React.Dispatch<React.SetStateAction<Course[]>>;
}) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const { showNotification } = useNotification();
  const { user } = useUser();

  const formatValue = (value: string) => parseInt(value.replace("R$ ", ""));
  const valueFormatted = formatValue(value);

  const [paymentError, setPaymentError] = React.useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");

  const formaterDate = (date: Date) => {
    const [day, month, year] = date
      .toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .split("/");
    return `${year}-${month}-${day}`;
  };

  console.log(user?.uid)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!name.trim()) {
      setPaymentError("O nome do titular é obrigatório.");
      return;
    }
    if (!email.trim()) {
      setPaymentError("O e-mail é obrigatório.");
      return;
    }
    event.preventDefault();
    if (!stripe || !elements) return;

    setPaymentError(undefined);
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setPaymentError("O campo não foi carregado corretamente");
      return;
    }

    const { error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (!error) {
      setLoading(true);
      try {
        const { data } = await axios.post(
          "http://localhost:3000/create-payment-intent",
          { amount: valueFormatted }
        );

        const result = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: { name: user?.name, email: email },
          },
        });

        if (result.error) {
          setPaymentError(result.error.message || "Erro desconhecido.");
          if (result.error.message) {
            showNotification(result.error.message, "error");
          }
        } else if (result.paymentIntent?.status === "succeeded") {
          showNotification("Pagamento realizado com sucesso!", "success");
          const identification = result.paymentIntent.id;

          if (!user?.uid) return;

          await setDoc(doc(db, "payments", identification), {
            owner: user.uid,
            course: nameCourse,
            value: valueFormatted,
            date: formaterDate(new Date()),
            paymentIdentification: identification,
          });

          setCourse([]);

          const docRef = doc(db, "users", `${user?.uid}`);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const actualCourses = docSnap.data()?.courses || [];
            const course = `${nameCourse}, ${value}, ${formaterDate(
              new Date()
            )}`;
            const updatedCourses = [...actualCourses, course];
            await updateDoc(doc(db, "users", `${user?.uid}`), {
              courses: updatedCourses,
            });
          } else {
            await updateDoc(doc(db, "users", `${user?.uid}`), {
              courses: [nameCourse],
            });
          }

          await updateDoc(doc(db, "courses", nameCourse), {
            quantity: increment(1),
          });

          navigate("/mycourses");
        }
      } catch (error) {
        console.error("Erro na API de pagamento:", error);
        showNotification(
          "Erro na comunicação com o servidor de pagamento.",
          "error"
        );
        setPaymentError("Erro na API de pagamento.");
      } finally {
        setLoading(false);
      }
    } else {
      setPaymentError(error.message);
      showNotification("Algo deu errado, verifique o erro.", "error");
    }
  };

  return (
    <div className="w-full md:w-2/3 p-8">
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
          aria-label="Digite seu e-mail"
          aria-invalid={!!paymentError}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-md p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
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
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          type="submit"
          disabled={!stripe || loading}
          className={`${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-500 hover:bg-gray-600"
          } text-white font-semibold py-2 rounded-md transition duration-200`}
        >
          {loading ? "Processando..." : "Pagar"}
        </button>
      </form>
      {paymentError && (
        <p className="text-red-600 mt-4 text-sm">{paymentError}</p>
      )}
    </div>
  );
};
