import logo from "@/icons/mosapro.png";
import Image from "next/image";
import { Typography } from "./MtProvider";
function Header() {
  return (
    <header className="flex  bg-mosapro-green text-white w-full h-36 rounded-lg shadow shadow-black justify-between align-middle items-center ">
      <div className="aspect-square object-contain m-1 p-1 max-h-36">
        <Image
          alt="Logo Mosapro"
          src={logo}
          width={0}
          height={0}
          className="saturate-150 rounded-full shadow-md  "
        />
      </div>
      <div>
        <Typography
          variant="h1"
          as="h1"
          className="text-5xl mr-2"
          color="white"
        >
          Heroes de la pandemia
        </Typography>
      </div>
    </header>
  );
}

export default Header;
