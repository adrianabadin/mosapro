"use client";
import upload from "@/icons/upload.svg";
import swal from "sweetalert2";
import Image from "next/image";
import partidos from "@/services/partidos.json";
import {
  Card,
  CardBody,
  Input,
  Typography,
  Select,
  Option,
} from "../layout/MtProvider";
import { z } from "zod";
import {
  Button,
  CardFooter,
  Spinner,
  Textarea,
} from "@material-tailwind/react";
import { useForm, Controller } from "react-hook-form";
import {
  useAddFormMutation,
  useUploadPhotoMutation,
} from "../GlobalRedux/Features/apiSlice";
import { GoogleError } from "@/services/google.errors";
export const formSchema = z.object({
  driveId: z
    .string({
      invalid_type_error: "Debe ser una cadena",
    })
    .optional(),
  name: z.string({
    invalid_type_error: "Debe ser una cadena",
    required_error: "Debes proveer una cadena",
  }),
  lastName: z.string({
    invalid_type_error: "Debe ser una cadena",
    required_error: "Debes proveer una cadena",
  }),
  state: z.string({
    invalid_type_error: "Debe ser una cadena",
    required_error: "Debes proveer una cadena",
  }),

  place: z.string({
    invalid_type_error: "Debe ser una cadena",
    required_error: "Debes proveer una cadena",
  }),
  date: z.string().optional(),
  description: z.string({
    invalid_type_error: "Debe ser una cadena",
    required_error: "Debes proveer una cadena",
  }),
});
export type Form = z.infer<typeof formSchema>;
function Formulario() {
  const { handleSubmit, register, control, reset, setValue, getValues } =
    useForm<Form>({
      mode: "all",
    });
  const [uploadPhoto, { isLoading }] = useUploadPhotoMutation();
  const [addForm] = useAddFormMutation();
  const onSubmit = handleSubmit((data) => {
    console.log(data);
    addForm(data)
      .then((res: any) => {
        console.log("success: ", res);
        reset();
      })
      .catch((err: any) => {
        swal.fire("Error", err.text, "error");
      });
  });
  return (
    <Card className="w-full p-4">
      <CardBody className="w-full">
        <Typography
          variant="h3"
          className="text-3xl text-mosapro-gray font-bold text-center my-2"
        >
          Objetivo
        </Typography>
        <Typography className="text-xl text-blue-gray-500 text-justify ">
          A traves de este formulario pretendemos generar un reconto de los
          compañeros de salud que dejaron su vida durante la pandemia. El
          objetivo final es realizar un reconocimiento a su legado al momento de
          finalizar el congreso provincial. Estamos convencidos que el
          sacrificio desinteresado, la solidaridad y la entrega de estos
          trabajadores debe destacarse como un valor fundamental de la sociedad
          que queremos construir. De esta manera recordarlos trae al presente la
          virtud de estos individuos que han fortalecido las filas de nuestro
          colectivo sanitario.
        </Typography>
      </CardBody>
      <form onSubmit={onSubmit} className="flex flex-col w-full">
        <CardBody className=" grid grid-cols-1 md:grid-cols-2 gap-3  w-full ">
          <Input
            label="Nombre"
            variant="outlined"
            {...register("name")}
            className="col-span-1"
          />
          <Input
            label="Apellido"
            variant="outlined"
            {...register("lastName")}
            className="col-span-1"
          />
          <Input
            label="Lugar de trabajo"
            variant="outlined"
            {...register("place")}
          />
          <div className="flex flex-col lg:flex-row justify-between col-span-1 ">
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Año de fallecimiento"
                  containerProps={{ className: "lg:mr-2" }}
                >
                  <Option value=" "> </Option>
                  <Option value="2020">2020</Option>
                  <Option value="2021">2021</Option>
                  <Option value="2022">2022</Option>
                </Select>
              )}
            />

            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Partido"
                  containerProps={{ className: "lg:ml-2 mt-3 lg:mt-0" }}
                >
                  {partidos.departamentos
                    .sort((a, b) => a.nombre.localeCompare(b.nombre))
                    .map((state) => (
                      <Option key={state.id} value={state.nombre}>
                        {state.nombre}
                      </Option>
                    ))
                    .sort()}
                </Select>
              )}
            />
          </div>
          <Textarea
            label="Algunas palabras..."
            variant="outlined"
            className="min-h-52"
            {...register("description")}
          />

          {getValues("driveId") === undefined ? (
            <div className="relative flex justify-center items-center mt-2 md:mt-0 flex-col object-contain">
              <Typography
                variant="h4"
                color="blue-gray"
                className="text-center text-mosapro-gray font-bold"
              >
                Subir Foto
              </Typography>
              {isLoading ? (
                <Spinner fontSize={60} />
              ) : (
                <div className="w-fit h-fit pt-2 relative">
                  <Image src={upload} alt="Subir Foto" width={48} height={48} />
                  <input
                    className="absolute w-full h-full top-0 left-0 cursor-pointer z-10 opacity-0 bg-transparent"
                    type="file"
                    accept="media/jpeg"
                    onChange={(e) => {
                      const body = new FormData();
                      console.log(e.target.files);
                      if (e.target.files !== null)
                        body.append("photo", e.target.files[0]);
                      uploadPhoto(body)
                        .unwrap()
                        .then((res: any) => {
                          const { driveId } = res;
                          setValue("driveId", driveId);
                          console.log(driveId);
                        })
                        .catch((e: GoogleError) => {
                          console.log(e);
                          swal.fire("Error", `${e.text}`, "error");
                        });
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="relative flex justify-center items-center flex-col object-contain">
              <Image
                src={`https://drive.google.com/uc?id=${getValues("driveId")}`}
                alt="Imagen de la persona"
                width={150}
                height={150}
              />
              <div className="relative">
                {isLoading ? (
                  <Spinner fontSize={60} />
                ) : (
                  <Image src={upload} alt="Subir Foto" width={48} height={48} />
                )}
                <input
                  className="absolute w-full h-full top-0 left-0 cursor-pointer z-10 opacity-0 bg-transparent"
                  type="file"
                  accept="media/jpeg"
                  onChange={(e) => {
                    const body = new FormData();
                    console.log(e.target.files);
                    if (e.target.files !== null)
                      body.append("photo", e.target.files[0]);
                    uploadPhoto(body)
                      .unwrap()
                      .then((res: any) => {
                        const { driveId } = res;
                        setValue("driveId", driveId);
                        console.log(driveId);
                      })
                      .catch((e: GoogleError) => {
                        console.log(e);
                        swal.fire("Error", `${e.text}`, "error");
                      });
                  }}
                />
              </div>
            </div>
          )}
        </CardBody>
        <CardFooter className="w-full flex justify-center">
          <Button
            variant="filled"
            type="submit"
            className="min-w-44 bg-blue bg-mosapro-green"
          >
            Enviar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default Formulario;
