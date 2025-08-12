import { toast } from "sonner";

export const handleError = (error: any) => {
  console.error(error);
  const { response } = error;
  if (response?.data?.error?.message) {
    toast.error(response.data.error.message);
  } else if (response?.data?.message) {
    toast.error(response.data.message);
  } else {
    toast.error("Something went wrong");
  }
};
