import { Elements } from "@stripe/react-stripe-js";
import { RouterApp } from "../routes/router";
import { BrowserRouter as Router } from "react-router";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51Pk7m8P9KYnbHtuSYkCfqkXMjAVjHaZJcTa9ItfjRtdxPrpsPEIlM0Nan2FkIks5VPTOPSu6HPx6Z2RvMdeHkHB400nw9mXkxD"
);

function App() {
  return (
    <div className="flex px-20 py-10 w-full h-screen gap-10">
      <Router>
        <Elements stripe={stripePromise}>
          <RouterApp />
        </Elements>
      </Router>
    </div>
  );
}

export default App;
