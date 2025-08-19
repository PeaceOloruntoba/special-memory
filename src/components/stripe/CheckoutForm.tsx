import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import Button from "../ui/Button";
import { BiLoaderAlt } from "react-icons/bi";
import { toast } from "sonner";
import { toTitleCase } from "../../lib/utils";

interface CheckoutFormProps {
  plan?: string;
  action: "subscribe" | "updatePaymentMethod";
  onSuccess: (paymentMethodId: string) => void;
  onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  plan,
  action,
  onSuccess,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (!stripe || !elements) {
      setLoading(false);
      toast.error("Stripe is not loaded. Please try again.");
      return;
    }

    try {
      const cardElement = elements.getElement(CardElement);
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement!,
      });

      if (error) {
        setErrorMessage(error.message || "An unknown error occurred.");
        toast.error(error.message || "Payment method creation failed.");
        setLoading(false);
        return;
      }

      if (paymentMethod?.id) {
        onSuccess(paymentMethod.id);
      }

      setLoading(false);
    } catch (err: any) {
      console.error("Payment submission error:", err);
      setErrorMessage(
        err.message || "An unexpected error occurred during payment setup."
      );
      toast.error(err.message || "Payment setup failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-md shadow-sm bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>

      {errorMessage && (
        <div className="text-red-500 text-sm text-center">{errorMessage}</div>
      )}

      <div className="flex gap-4">
        <Button
          type="submit"
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
          disabled={!stripe || loading}
        >
          {loading ? (
            <BiLoaderAlt className="animate-spin mr-2 inline" />
          ) : action === "subscribe" ? (
            `Confirm Subscription for ${toTitleCase(plan || "")}`
          ) : (
            "Update Payment Method"
          )}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="w-full py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CheckoutForm;
