import { config } from "dotenv";

config();

export const getQrCode = (data) => {
  const qr = {
    url: process.env.QR_CODE_URL,
    backColor: process.env.QR_CODE_BACK_COLOR,
    transparent: process.env.QR_CODE_TRANSPARENT,
    quietZone: process.env.QR_CODE_QUIET_ZONE,
    quietUnit: process.env.QR_CODE_QUIET_UNIT,
    size: process.env.QR_CODE_SIZE,
    error: process.env.QR_CODE_ERROR_CORRECTION,
  };
  console.log(data);
  console.log(qr);
  console.log(
    `${qr.url}?data=${data}&backcolor=${qr.backColor}&istransparent=${qr.transparent}&quietzone=${qr.quietZone}&quietunit=${qr.quietUnit}&size=${qr.size}&errorcorrection=${qr.error}`
  );
  return `${qr.url}?data=${data}&backcolor=${qr.backColor}&istransparent=${qr.transparent}&quietzone=${qr.quietZone}&quietunit=${qr.quietUnit}&size=${qr.size}&errorcorrection=${qr.error}`;
};

export default { getQrCode };
