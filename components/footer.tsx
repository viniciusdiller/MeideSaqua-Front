import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 w-full">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left">
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
            <h3 className="font-bold uppercase text-gray-800 mb-4">
              Links Úteis
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/sobre"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Sobre o Projeto
                </Link>
              </li>
              <li>
                <Link
                  href="/espaco-mei"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Espaço MEI
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Fale Conosco
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="font-bold uppercase text-gray-800 mb-4">Contato</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center justify-center gap-3">
                <Mail size={16} />
                <span>meidesaqua@saquarema.rj.gov.br</span>
              </li>
              <li className="flex items-center justify-center gap-3">
                <Phone size={16} />
                <span>(22) 0000-0000</span>
              </li>
              <li className="flex items-center justify-center gap-3 break-words">
                <MapPin size={16} />
                <span>R. Cel. Madureira, 77 - Centro, Saquarema - RJ</span>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="font-bold uppercase text-gray-800 mb-4">Siga-nos</h3>
            <div className="flex justify-center gap-5">
              <a
                href="https://www.facebook.com/PrefeituradeSaquarema/"
                aria-label="Facebook"
                className="text-gray-500 hover:text-blue-700 transition-colors"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://www.instagram.com/prefeiturasaquarema/?hl=en"
                aria-label="Instagram"
                className="text-gray-500 hover:text-pink-600 transition-colors"
              >
                <Instagram size={24} />
              </a>
            </div>
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
