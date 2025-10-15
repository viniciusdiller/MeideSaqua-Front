import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const address = "R. Cel. Madureira, 77 - Centro, Saquarema - RJ";
  const encodedAddress = encodeURIComponent(address);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  return (
    <footer className="bg-gray-100 border-t border-gray-200 w-full">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-wrap justify-center items-start gap-12 md:gap-20">
          <div className=" text-center">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/LogoExploraMonocromática.png"
                alt="Logo MeideSaqua"
                width={160}
                height={57}
                className="h-14 w-auto mx-auto md:mx-auto "
              />
            </Link>
            <p className="text-gray-600 max-w-xs mx-auto ">
              A vitrine digital que valoriza o empreendedor local e fortalece a
              economia de Saquarema.
            </p>
          </div>

          <div className="text-center">
            <h3 className="font-bold uppercase text-gray-800 mb-4">Contato</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center justify-center gap-3">
                <Mail size={16} />
                <span>meidesaqua@saquarema.rj.gov.br</span>
              </li>
              <li className="flex items-center justify-center gap-3 hover:underline hover:text-blue-600 transition-colors">
                <Phone size={16} />
                <a
                  href="https://wa.me/+5522996018024"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-blue-600 transition-colors"
                >
                  <span>(22) 99601-8024</span>
                </a>
              </li>
              <li>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-start gap-3 text-left hover:underline hover:text-blue-600 transition-colors"
                >
                  <MapPin size={16} className="flex-shrink-0" />
                  <span>{address}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Desenvolvido pela Secretaria Municipal
            de Governança e Sustentabilidade de Saquarema
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
