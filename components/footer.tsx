import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Image
            src="/LogoExploraMonocromática.png"
            alt="Logo MeideSaqua"
            width={2660}
            height={898}
            className=" mx-auto h-10 sm:h-12 w-auto mb-5 md:block milecem:h-14"
          />
          <p className="text-gray-600 mb-4">
            {" "}
            A vitrine digital que valoriza o empreendedor local e fortalece a
            economia de Saquarema
          </p>
          <hr className="w-16 mx-auto border-gray-300 mb-4" />{" "}
          <p className="text-gray-500 text-sm">
            © Desenvolvido pela{" "}
            <span className="font-medium text-gray-600">
              Secretaria Municipal de Governança e Sustentabilidade de Saquarema
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
