import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { FaRegStar, FaStar } from "react-icons/fa";
import { db } from "../../../services/firebaseConnection";
import { Course } from "../../Dashboard";
import React from "react";
import axios from "axios";
import { useNotification } from "../../../contexts/notificationContext";
import { useUser } from "../../../contexts/userDataContext";

export type CourseProps = {
  title: string;
  paiedValue: string;
  paiedDate: string;
};

type PaymentType = {
  owner: string;
  paymentIdentification: string;
  value: number;
  date: Date;
  course: string;
};

export const CourseInfo = ({ title, paiedValue, paiedDate }: CourseProps) => {
  const { user } = useUser();
  const { showNotification } = useNotification();
  const [course, setCourse] = React.useState<Course[]>([]);

  // Função que verifica e formata a data correta
  const parseDate = (date: string | Date): Date => {
    if (typeof date === "string") {
      // Aqui ela tenta criar um objeto Date direto
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error(`Formato de data inválido: ${date}`);
      }
      return parsedDate;
    }
    return date; // Aí se for Date, retorna sem alteração
  };

  // Converte a data de string para Date
  const paiedDateObject = parseDate(paiedDate);

  // Função que adiciona os 7 dias
  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // Formata a data para exibir do jeito certo
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Calcula a data de reembolso (coloquei 8 porque tava contando o dia da compra, o dia da compra não conta)
  const refundDeadline = addDays(paiedDateObject, 8);

  const fetchCourse = async () => {
    const docRef = doc(db, "courses", title);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setCourse([docSnap.data() as Course]);
    }
  };

  React.useEffect(() => {
    fetchCourse();
  }, [title, () => requestRefund()]);

  const requestRefund = async () => {
    try {
      const paiedValueFormatted = paiedValue
        .replace("R$ ", "")
        .replace(",", ".");
      const paymentsSnap = await getDocs(collection(db, "payments"));

      const payments: PaymentType[] = paymentsSnap.docs.map(
        (doc) => doc.data() as PaymentType
      );

      const userPayment = payments.find(
        (payment) => payment.owner === user?.uid && payment.course === title
      );

      if (userPayment) {
        const response = await axios.post("http://localhost:3000/refund", {
          paymentIntentId: userPayment.paymentIdentification,
          amount: parseFloat(paiedValueFormatted),
        });

        if (response.data.success) {
          showNotification("Reembolso solicitado com sucesso", "success");
          await updateDoc(
            doc(db, "payments", userPayment.paymentIdentification),
            {
              situation: "Reembolso solicitado",
            }
          );
          await updateDoc(doc(db, "users", user?.uid as string), {
            courses: arrayRemove(`${title}, ${paiedValue}, ${paiedDate}`),
          });
        } else {
          showNotification("Erro ao solicitar reembolso.", "error");
          console.error("Erro no reembolso:", response.data.error);
        }
      } else {
        showNotification("Pagamento não encontrado.", "error");
      }
    } catch (error) {
      console.error("Erro ao solicitar reembolso:", error);
      showNotification("Erro ao solicitar reembolso.", "error");
    }
  };

  return (
    <>
      {course.map((item, index) => (
        <div
          key={index}
          className="border-y border-gray-100 w-full h-32 px-2 py-1 flex flex-row items-center justify-around"
        >
          <img
            src={item.thumbnail}
            alt="Erro ao buscar foto do curso"
            className="h-full w-auto rounded-md"
          />

          <div className="flex flex-col">
            <div className="flex flex-col font-secondary">
              <p className="text-xl">{item.title}</p>
              <p className="text-lg text-gray-500">Fabrício Oliveira Lopes</p>
            </div>
            <div className="flex flex-row gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="flex flex-row items-center">
                  <input
                    type="radio"
                    name="rating"
                    id={`star${star}`}
                    value={star}
                    className="hidden"
                  />
                  <label
                    htmlFor={`star${star}`}
                    className={`star transition-colors text-yellow-500 text-5xl`}
                  >
                    {star <= Number(item.rating) ? (
                      <FaStar size={20} color="#ffcb0c" />
                    ) : (
                      <FaRegStar size={20} color="#ffcb0c" />
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="font-secondary text-xl">
            <p>
              Valor pago: <strong>{paiedValue}</strong>
            </p>
          </div>
          <div className="flex flex-col items-center">
            <button
              className="px-4 py-2 bg-gray-300 font-tertiary text-xl rounded active:bg-gray-400"
              onClick={requestRefund}
            >
              Reembolsar
            </button>
            <p className="text-xs text-gray-400">
              Reembolso até: {formatDate(refundDeadline)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
