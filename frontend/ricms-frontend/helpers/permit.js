import jsPDF from 'jspdf';
import Logo from '../public/images/RICA.png';
import { formatDate,formatMongoDate } from './ReportDateHelper';
import {formatReportDate} from './dateFormatter';


export const generatePdf = async ( permitDetails,user) => {
  const unit = 'px';
  const size = 'A4';
  const orientation = 'portrait';

  const doc = new jsPDF(orientation, unit, size);
  // LOGO
  const imageSource = Logo.src;
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.addImage(imageSource, 'JPEG', 25, 10, 160, 30);

  // IDENTIFICATION OF PERMIT
  const currentDate = formatDate(new Date());
  const locationText = `Kigali, ${currentDate}`;
  const fontSize = 9;
  const textWidth =
    (doc.getStringUnitWidth(locationText) * fontSize) /
    doc.internal.scaleFactor;
  const textX = pageWidth - textWidth - 35;

  doc.setFont('Nunito_Light', 'normal');
  doc.setFontSize(fontSize);

  // LOCATION & DATE
  doc.text(locationText, textX, 15);

  // Permit number
  const permitNo = `NO.: RCIMS/${permitDetails._id}`;
  const boldText = 'No.:';
  const lightText = permitNo.substring(boldText.length);
  const boldFontSize = 10;
  const lightFontSize = 9;
  const lightTextWidth =
    (doc.getStringUnitWidth(lightText) * lightFontSize) /
    doc.internal.scaleFactor;

  const maxLightTextX = pageWidth - 25;
  const lightTextX = Math.min(textX, maxLightTextX - lightTextWidth);

  // TITLE text
  doc.setFont('Nunito_Regular', 'normal');
  doc.setFontSize(boldFontSize);
  doc.text(boldText, lightTextX - 15, 28);

  // Number text
  doc.setFont('Nunito_Light', 'normal');
  doc.setFontSize(lightFontSize);
  doc.text(lightText, lightTextX, 28);

  // UNDERLINE
  const lineY = 55;
  const lineColor = '#CBCBCB';
  const lineWidthValue = 0.8;

  doc.setLineWidth(lineWidthValue);
  doc.setDrawColor(lineColor);
  doc.line(25, lineY, pageWidth - 25, lineY);

  // -----------------------PAGE TITLE------------------------------------
  // TITLE
  const text = 'Authorization for RICA Document Approval';
  const uppercaseText = text.toUpperCase();

  doc.setFont('Copperplate_Gothic_Bold_Regular', 'normal');
  doc.setFontSize(14);
  doc.text(uppercaseText, 25, lineY + 15);

  // LINE 2
  doc.line(25, 77, pageWidth - 25, 77);

  // -----------------------DECLARATION------------------------------------
  // DECLARATION TITLE
  doc.setFont('Nunito_Regular', 'normal');
  doc.setFontSize(12);
  doc.text('TO WHOM IT MAY CONCERN', 25, 95);

  // TEXT
  const disclaimerText = `Authority is hereby granted by Rwanda Inspectorate, Competition and Consumer Protection Authority (RICA), the management authority of RICA , to use the collected  samples.`;
  const margin = 25;
  const maxWidth = pageWidth - 2 * margin;
  const textLines = doc.splitTextToSize(disclaimerText, maxWidth);

  doc.setFont('Nunito_Light', 'normal');
  doc.setFontSize(10);
  doc.text(textLines, margin, 110, {
    lineHeightFactor: 1.3,
  });

  doc.setFont('Nunito_Light', 'normal');
  doc.setFontSize(10);
  doc.text(
    `The samples are used by  ${permitDetails.document.document.companyName} .`,
    margin,
    145
  );

  // LINE
  doc.line(25, 155, pageWidth - 25, 155);

  // -----------------------SAMPLE DETAILS------------------------------------

  const startY = 170;
  const lineHeight = 15;
  let currentY = startY;
  
  const samplesDetails = {
    "Submitted on": formatReportDate(permitDetails.document.createdAt),
    "Approved on": formatReportDate(permitDetails.createdAt),
    "Sample Type": permitDetails.document.document.psamples,
    "Number of Samples": permitDetails.document.document.psamples,
    "Amount Paid": `${permitDetails.amount} RWF`
  };
  
  doc.setFont('Nunito_Regular', 'normal');
  doc.setFontSize(11);
  doc.text('Submitted on:', 25, currentY);
  doc.setFont('Nunito_Light', 'normal');
  doc.setFontSize(11);
  doc.text(samplesDetails["Submitted on"], 120, currentY);
  currentY += lineHeight;
  
  doc.setFont('Nunito_Regular', 'normal');
  doc.setFontSize(11);
  doc.text('Approved on:', 25, currentY);
  doc.setFont('Nunito_Light', 'normal');
  doc.setFontSize(11);
  doc.text(samplesDetails["Approved on"].toString(), 120, currentY);
  currentY += lineHeight;
  
  doc.setFont('Nunito_Regular', 'normal');
  doc.setFontSize(11);
  doc.text('Sample Type:', 25, currentY);
  doc.setFont('Nunito_Light', 'normal');
  doc.setFontSize(11);
  doc.text(samplesDetails["Sample Type"].toString(), 120, currentY);
  currentY += lineHeight;
  
  doc.setFont('Nunito_Regular', 'normal');
  doc.setFontSize(11);
  doc.text('Number of Samples:', 25, currentY);
  doc.setFont('Nunito_Light', 'normal');
  doc.setFontSize(11);
  doc.text(samplesDetails["Number of Samples"].toString(), 120, currentY);
  currentY += lineHeight;
  
  doc.setFont('Nunito_Regular', 'normal');
  doc.setFontSize(11);
  doc.text('Amount Paid:', 25, currentY);
  doc.setFont('Nunito_Light', 'normal');
  doc.setFontSize(11);
  doc.text(samplesDetails["Amount Paid"].toString(), 120, currentY);
  

  // LINE
  doc.line(25, 270, pageWidth - 25, 270);

  // -----------------------APPLICANT------------------------------------
  const applicantText = 'Applicant:';
  const applicantTextWidth =
    (doc.getStringUnitWidth(applicantText) * 11) / doc.internal.scaleFactor;

  doc.setFont('Nunito_Regular', 'normal');
  doc.setFontSize(11);
  doc.text(applicantText, 25, 284);

  doc.setFont('Nunito_Light', 'normal');
  doc.setFontSize(11);
  doc.text(
    `${user.firstname} ${user.lastname}, ${user.role}`,
    applicantTextWidth + 35,
    284
  );
  doc.text(user.email, applicantTextWidth + 35, 284 + 12);
  doc.text(
    formatReportDate(permitDetails.createdAt),
    applicantTextWidth + 35,
    284 + 12 * 2
  );
  doc.text(
    "Kigali, Rwanda",
    applicantTextWidth + 35,
    284 + 12 * 3
  );

  // LINE
  doc.line(25, 330, pageWidth - 25, 330);

  // -----------------------CARRIER------------------------------------
  const carrierText = 'Company in charge:';
  const carrierTextWidth =
    (doc.getStringUnitWidth(carrierText) * 11) / doc.internal.scaleFactor;

  doc.setFont('Nunito_Regular', 'normal');
  doc.setFontSize(11);
  doc.text(carrierText, 25, 344);

  doc.setFont('Nunito_Light', 'normal');
  doc.setFontSize(11);
  doc.text(permitDetails.document.document.companyName, carrierTextWidth + 35, 344);


  // LINE
  doc.line(25, 363, pageWidth - 25, 363);

  // -----------------------TRANSPORTATION------------------------------------
  const transportText = 'Approval Information:';

  doc.setFont('Nunito_Regular', 'normal');
  doc.setFontSize(11);
  doc.text(transportText, 25, 376);
  
  let transportTextY = 388;
  
  const approvals = {
    "RAB APPROVED": formatMongoDate(permitDetails.document.RAB_Approval.timeOfApproval),
    "RSB APPROVED": formatMongoDate(permitDetails.document.RSB_Approval.timeOfApproval),
    "RICA APPROVED": formatMongoDate(permitDetails.document.RICA_Approval.timeOfApproval)
  };
  
  doc.setFont('Nunito_Light', 'normal');
  doc.setFontSize(10);
  doc.text('RAB APPROVED:', 25, transportTextY);
  doc.text(approvals["RAB APPROVED"], 120, transportTextY);
  transportTextY += 12;
  
  doc.text('RSB APPROVED:', 25, transportTextY);
  doc.text(approvals["RSB APPROVED"], 120, transportTextY);
  transportTextY += 12;
  
  doc.text('RICA APPROVED:', 25, transportTextY);
  doc.text(approvals["RICA APPROVED"], 120, transportTextY);
  

  // LINE
  const bottomTransportLineY = transportTextY +10;
  doc.line(25, bottomTransportLineY, pageWidth - 25, bottomTransportLineY);

  // -----------------------VALIDITY & ISSUANCE------------------------------------
  // VALID UNTIL
  const validText = 'Submitted On:';
  const issuedDate = formatReportDate(permitDetails.document.createdAt);
  const validityTextY = bottomTransportLineY + 13;

  const validTextWidth =
    (doc.getStringUnitWidth(validText) * 11) / doc.internal.scaleFactor;
  const issuedDateWidth =
    (doc.getStringUnitWidth(issuedDate) * 11) / doc.internal.scaleFactor;

  const issuedAtX = pageWidth - 25 - validTextWidth;
  const issuedDateX = pageWidth - 25 - issuedDateWidth;

  doc.setFont('Nunito_Regular', 'normal');
  doc.setFontSize(11);
  doc.text(validText, issuedAtX, validityTextY);

  doc.setFont('Nunito_Light', 'normal');
  doc.setFontSize(11);
  doc.text(issuedDate, issuedDateX, validityTextY + 12);

  // ISSUED AT
  const issuedAt = 'Issued at:';

  doc.setFont('Nunito_Regular', 'normal');
  doc.setFontSize(11);
  doc.text(issuedAt, 25, validityTextY);

  doc.setFont('Nunito_Light', 'normal');
  doc.setFontSize(11);
  doc.text(formatReportDate(permitDetails.createdAt), 25, validityTextY + 12);

  // -----------------------APPROVED BY------------------------------------
  const approveText = 'Approved by:';
  const approveTextLineY = validityTextY + 30;

  doc.setFont('Nunito_Regular', 'normal');
  doc.setFontSize(11);
  doc.text(approveText, 25, approveTextLineY);

  doc.setFont('Nunito_Light', 'normal');
  doc.setFontSize(11);
  doc.text("THE ADMINISTRATION OF RICA", 25, approveTextLineY + 12);
  doc.text(
    'Head of Industry department',
    25,
    approveTextLineY + 24
  );
  doc.text('Rwanda Inspectorate, Competition and Consumer Protection Authority', 25, approveTextLineY + 36);

  const qrCodeLineY = approveTextLineY + 44;
  doc.line(25, qrCodeLineY, pageWidth - 25, qrCodeLineY);

  // -----------------------ADDRESS TEXT------------------------------------
  const finalLineY=600
  const addressText =
    'KN 5 Rd, KG 9 Ave, P.O. Box 6239, Remera, Kigali, Rwanda';
  const textFontSize = 8;
  const addressTextWidth =
    (doc.getStringUnitWidth(addressText) * textFontSize) /
    doc.internal.scaleFactor;
  const addressTextX = (pageWidth - addressTextWidth) / 2;
  const addressTextY = finalLineY + 10;

  doc.setFont('Nunito_Light', 'normal');
  doc.setFontSize(textFontSize);
  doc.text(addressText, addressTextX, addressTextY);

  // GENERATE PDF

  doc.save(`Export_permit_.pdf`);
};
