import jsPDF from 'jspdf';
import Logo from '../public/images/RICA.png';
import { formatDate, formatMongoDate } from './ReportDateHelper';
import { formatReportDate } from './dateFormatter';

export const generatePdf = async (permitDetails, user) => {
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
    const textWidth = (doc.getStringUnitWidth(locationText) * fontSize) / doc.internal.scaleFactor;
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
    const lightTextWidth = (doc.getStringUnitWidth(lightText) * lightFontSize) / doc.internal.scaleFactor;

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
    const text = `${user.role} DOCUMENT STATUS REPORT`;
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
    doc.text('REPORT DETAILS', 25, 95);

    // -----------------------SAMPLE DETAILS------------------------------------

    const startY = 110;
    const lineHeight = 15;
    let currentY = startY;

    const samplesDetails = {
        "Submitted on": formatReportDate(permitDetails.document.createdAt),
        "Approved on": formatReportDate(permitDetails.createdAt),
        "Sample Type": permitDetails.document.psamples,
        "Number of Samples": permitDetails.document.tsamples,
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

    // Adjust Applicant section Y coordinate
    const applicantY = currentY + 2 * lineHeight;

    // LINE
    doc.line(25, applicantY - 15, pageWidth - 25, applicantY - 15);

    // -----------------------APPLICANT------------------------------------
    const applicantText = 'Applicant:';
    const applicantTextWidth = (doc.getStringUnitWidth(applicantText) * 11) / doc.internal.scaleFactor;

    doc.setFont('Nunito_Regular', 'normal');
    doc.setFontSize(11);
    doc.text(applicantText, 25, applicantY);

    doc.setFont('Nunito_Light', 'normal');
    doc.setFontSize(11);
    doc.text(`${permitDetails.owner.firstname} ${permitDetails.owner.lastname}, ${user.role}`, applicantTextWidth + 35, applicantY);
    doc.text(permitDetails.owner.email, applicantTextWidth + 35, applicantY + 12);
    doc.text(formatReportDate(permitDetails.createdAt), applicantTextWidth + 35, applicantY + 24);
    doc.text("Kigali, Rwanda", applicantTextWidth + 35, applicantY + 36);

    // LINE
    const approvalY = applicantY + 2 * lineHeight + 12;
    doc.line(25, approvalY, pageWidth - 25, approvalY);

    // -----------------------APPROVAL INFORMATION------------------------------------
    const approvalText = 'Approval Information:';
    const approvalTextWidth = (doc.getStringUnitWidth(approvalText) * 11) / doc.internal.scaleFactor;

    doc.setFont('Nunito_Regular', 'normal');
    doc.setFontSize(11);
    doc.text(approvalText, 25, approvalY + 14);

    doc.setFont('Nunito_Light', 'normal');
    doc.setFontSize(11);
    const approvalStatus = permitDetails.RAB_Approval.approved ? "Approved" : "Rejected";
    doc.text(`${user.role} Approval Status: ${approvalStatus}`, approvalTextWidth + 35, approvalY + 28);
    doc.text(`${user.role} Approval Time: ${formatMongoDate(permitDetails.RAB_Approval.timeOfApproval)}`, approvalTextWidth + 35, approvalY + 40);

    //address

    const addressText = 'Address: Kigali, Rwanda';
    const addressY = doc.internal.pageSize.getHeight() - 30;

    doc.setFont('Nunito_Regular', 'normal');
    doc.setFontSize(11);
    doc.text(addressText, 25, addressY);

    // Save the PDF
    doc.save(`Permit_${permitDetails._id}.pdf`);
};
