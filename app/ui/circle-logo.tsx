import { lusitana } from "@/app/ui/fonts";
import Image from "next/image";

export default function CircleLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <Image
        src="/circle.jpg"
        width={150}
        height={150}
        alt="circle"
        className="rounded-full"
      />
    </div>
  );
}
