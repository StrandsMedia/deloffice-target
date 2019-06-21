import { chunkArray, image, invoiceLH, convertDate, tableToJSPDFData } from '../../common/interfaces/letterhead';

import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

export function renderInvoice(inv): jsPDF {
    const pdf: jsPDF = new jsPDF('p', 'pt', 'a4');

    const mainres = tableToJSPDFData('#maintable');

    const result = chunkArray(mainres.body, 8);
    console.log(result.length);

    const width = pdf.internal.pageSize.getWidth() - 15;

    console.log(result);

    const totalPagesExp = '{total_pages_count_string}';

    for (let i = 0; i < result.length; i++) {
        if (i > 0) {
            pdf.addPage();
        }
        (pdf as any).autoTable({
            head: mainres.head,
            body: result[i],
            theme: 'grid',
            styles: {
                fontSize: 9,
                overflow: 'linebreak',
                lineColor: 100,
                lineWidth: 0,
                textColor: 0,
                valign: 'top',
                halign: 'left'
            },
            columnStyles: {
                0: {
                    halign: 'left',
                    cellWidth: 60
                },
                1: {
                    halign: 'left',
                    cellWidth: 180
                },
                2: {
                    halign: 'left',
                    cellWidth: 35
                },
                3: {
                    halign: 'center',
                    cellWidth: 55
                },
                4: {
                    halign: 'center',
                    cellWidth: 55
                },
                5: {
                    halign: 'center',
                    cellWidth: 55
                },
                6: {
                    halign: 'center',
                    cellWidth: 55
                },
                7: {
                    halign: 'center',
                    cellWidth: 65
                }
            },
            headStyles: {
                fillColor: false,
                textColor: [23, 73, 144],
                fontStyle: 'normal',
                lineWidth: 0,
                valign: 'bottom',
                fontSize: 8
            },
            tableWidth: 'auto',
            tableLineColor: 0,
            margin: {
                top: 227,
                left: 10,
                bottom: 85,
                right: 10,
            },
            // pageBreak: 'always',
            didDrawPage: function(data) {
                pdf.addImage(image('DEL'), 'JPEG', 210, 22, 215, 44);
                pdf.setFontSize(8);
                pdf.setFontType('normal');
                pdf.text(invoiceLH.address, 210, 82);
                pdf.text(invoiceLH.tel, 210, 96);
                pdf.text(invoiceLH.vat, 210, 110);
                pdf.setFontType('bold');
                pdf.setFontSize(17.5);
                pdf.setTextColor(23, 73, 144);
                pdf.text(invoiceLH.title, 210, 135);
                pdf.setFontSize(9.7);
                pdf.setFontType('normal');
                pdf.setTextColor(0);
                pdf.text(inv.company_name, 15, 155);
                pdf.text(inv.Physical1, 15, 170);
                pdf.text(inv.Physical2, 15, 185);
                pdf.text(inv.Physical3, 15, 200);
                pdf.text(`VAT No : ${inv.Tax_Number}`, 250, 155);
                pdf.text(`B.R.No : ${inv.Registration}`, 250, 170);
                pdf.text(`Date: ${convertDate(inv.InvDate)}`, 460, 155);
                pdf.text(`Page ${i + 1} of ` + totalPagesExp, 460, 170);
                pdf.text(`Ref: ${inv.invRef}`, 460, 185);
                pdf.setFontSize(8.7);
                pdf.text(`Contact Person: ${inv.Contact_Person}`, 15, 215);
                pdf.text(`Tel : ${inv.Telephone}`, 15, 228);
                pdf.setLineWidth(1);
                pdf.line(15, 255, width, 255);
                pdf.line(15, 645, width, 645);
            }
            });
            (pdf as any).autoTable({
                html: '#totaltable',
                theme: 'grid',
                styles: {
                    fontSize: 9,
                    overflow: 'linebreak',
                    lineColor: 100,
                    lineWidth: 0,
                    textColor: 0,
                    valign: 'top',
                    halign: 'left',
                    fontStyle: 'bold'
                },
                headStyles: {
                    fillColor: false,
                    fontStyle: 'bold'
                },
                columnStyles: {
                    0: {
                        halign: 'left',
                        cellWidth: 60
                    },
                    1: {
                        halign: 'left',
                        cellWidth: 180
                    },
                    2: {
                        halign: 'left',
                        cellWidth: 35
                    },
                    3: {
                        halign: 'center',
                        cellWidth: 55
                    },
                    4: {
                        halign: 'center',
                        cellWidth: 55
                    },
                    5: {
                        halign: 'center',
                        cellWidth: 55
                    },
                    6: {
                        halign: 'center',
                        cellWidth: 55
                    },
                    7: {
                        halign: 'center',
                        cellWidth: 65
                    }
                },
                tableWidth: 'auto',
                tableLineColor: 0,
                startY: 620,
                margin: {
                    top: 620,
                    left: 10,
                    bottom: 85,
                    right: 10,
                },
                didParseCell: function(data) {
                    const cell = data.cell;
                    const someEl = cell.raw;
                    if (cell.classList.contains('bolder')) {
                        cell.styles.textColor = [255, 255, 0];
                    } else {
                        cell.styles.textColor = [255, 0, 0];
                    }
                },
                // pageBreak: 'auto',
                didDrawPage: function(data) {
                    pdf.line(355, 620, 400, 620);
                    pdf.line(460, 620, 505, 620);
                    pdf.line(520, 620, 565, 620);

                    pdf.line(355, 638, 400, 638);
                    pdf.line(460, 638, 505, 638);
                    pdf.line(520, 638, 565, 638);

                    pdf.line(355, 640, 400, 640);
                    pdf.line(460, 640, 505, 640);
                    pdf.line(520, 640, 565, 640);
                }
            });
            (pdf as any).autoTable({
                html: '#signtable',
                didParseCell: function(data) {
                    const cell = data.cell;
                    const tdElement = cell.raw;
                    if (tdElement.classList.contains('clear')) {
                        cell.styles.lineWidth = 0;
                    }
                },
                theme: 'grid',
                styles: {
                    fontSize: 7.6,
                    cellWidth: 'auto',
                    overflow: 'linebreak',
                    lineColor: 100,
                    lineWidth: 0.2,
                    textColor: 0,
                    valign: 'middle'
                },
                columnStyles: {
                },
                headStyles: {
                    fillColor: false,
                    textColor: 0,
                    halign: 'center',
                    fontStyle: 'normal'
                },
                tableWidth: 'auto',
                tableLineColor: 0,
                startY: 655,
                margin: {
                    top: 655,
                    left: 15,
                    bottom: 85,
                    right: 15,
                },
                pageBreak: 'auto',
                didDrawPage: function(data) {
                    pdf.setFontSize(7.8);
                    pdf.setFontType('bold');
                    pdf.text('Terms And Conditions', 15, 745);
                    pdf.setFontType('normal');
                    pdf.text('(1) Invoice is due for payment 30 days as from the date of invoice', 15, 760);
                    pdf.text('(2) Cheques to be drawn in favour of DelOffice Ltd and Invoice Number to be quoted', 15, 772);
                    // tslint:disable-next-line:max-line-length
                    pdf.text('(3) Charges on this invoice should be verified and queries should be made within 10 days from date of issue else invoice will be considered as final', 15, 784);
                    pdf.text('(4) Interest at the rate of 1.5% per month will be charged on overdue accounts', 15, 796);
                    // tslint:disable-next-line:max-line-length
                    pdf.text('(5) In case of recovery through a solicitor, all fees, charges and commission, not exceeding 10% of amount due, are payable by the client', 15, 808);
                    pdf.text('(6) Only the original receipt, issued by DelOffice Ltd, will be accepted as proof of payment.', 15, 820);
                }
            }
        );
    }

    if (typeof pdf.putTotalPages === 'function') {
        pdf.putTotalPages(totalPagesExp);
    }

    return pdf;
}
