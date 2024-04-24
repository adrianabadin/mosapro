"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import swal from "sweetalert2";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Dialog,
  DialogBody,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useJwtQuery,
  useLoginMutation,
} from "../GlobalRedux/Features/apiSlice";
import { redirect } from "next/navigation";
const loginSchema = z.object({
  username: z.string().email({ message: "Debes ingresar un email valido" }),
  password: z
    .string({
      required_error: "Debes proveer una contraseña",
      invalid_type_error: "La contraseña debe contener letras",
    })
    .min(6, { message: "La contraseña debe tener al menos 6 letras" }),
});
export type Login = z.infer<typeof loginSchema>;
function Login() {
  const [login] = useLoginMutation();
  const { data, isSuccess } = useJwtQuery(undefined);
  if (isSuccess) redirect("/manage");

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Login>({ resolver: zodResolver(loginSchema), mode: "all" });
  return (
    <Card className="w-2/3">
      <CardBody>
        <Typography variant="h2" className="text-mosapro-green">
          Ingresar
        </Typography>
      </CardBody>
      <form
        onSubmit={handleSubmit((data) => {
          login(data)
            .unwrap()
            .then(() => console.log("Success"))
            .catch((e) => {
              swal.fire("Error al ingresar", e.text, "error");
            });
        })}
      >
        <CardBody>
          <div className="relative pb-4">
            <Input
              {...register("username")}
              variant="outlined"
              label="e-Mail"
              containerProps={{ className: "my-4" }}
              error={errors.username !== undefined || undefined}
            />
            <p className="text-red-500 w-full absolute bottom-0 font-bold text-center">
              {errors.username !== undefined ? errors.username.message : " "}
            </p>
          </div>
          <div className="relative pb-4">
            <Input
              variant="outlined"
              {...register("password")}
              label="Password"
              containerProps={{ className: "my-4" }}
              type="password"
              error={errors.password !== undefined || undefined}
            />
            <p className="text-red-500 w-full absolute bottom-0 font-bold text-center">
              {errors.password !== undefined ? errors.password.message : " "}
            </p>
          </div>
        </CardBody>
        <CardFooter className="w-full flex justify-center">
          <Button
            type="submit"
            disabled={
              errors.password !== undefined || errors.username !== undefined
                ? true
                : undefined
            }
            variant="filled"
            className="bg-mosapro-green"
          >
            Ingresar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default Login;
