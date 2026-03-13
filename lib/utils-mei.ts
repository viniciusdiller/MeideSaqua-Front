import { toast } from "sonner";
import { campoLabels } from "@/constants/mei-options";

export const maskCNAE = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{1})(\d{2})/, "$1/$2")
    .replace(/(\/\d{2})\d+?$/, "$1");
export const maskCPF = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
export const maskCNPJ = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
export const maskPhone = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");

export const stripEmojis = (value: string) => {
  if (!value) return "";
  return value.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    "",
  );
};

export const getQuillTextLength = (value: string) => {
  if (typeof window === "undefined" || !value || value === "<p><br></p>")
    return 0;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = value;
  return (tempDiv.textContent || tempDiv.innerText || "").trim().length;
};

export const onFinishFailed = (errorInfo: any) => {
  if (!errorInfo.errorFields || errorInfo.errorFields.length === 0) return;
  const labelsComErro = errorInfo.errorFields
    .map((field: any) => {
      const fieldName = field.name[0];
      return campoLabels[fieldName] || fieldName;
    })
    .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);

  if (labelsComErro.length > 0) {
    const plural = labelsComErro.length > 1;
    toast.error(
      `Por favor, preencha ${plural ? "os campos obrigatórios" : "o campo obrigatório"}: ${labelsComErro.join(", ")}.`,
    );
  }
};
