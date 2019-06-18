import { chunkArray, image, statementLH, convertDate2, convertDateAlt, statementFT } from 'src/app/common/interfaces/letterhead';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function renderPDF(custinfo, total?) {
    const pdf = new jsPDF('p', 'pt', 'a4');
    const statementtable = <HTMLTableElement>document.getElementById('statementtable');
    const baltable = <HTMLTableElement>document.getElementById('baltable');

    const stateres = pdf.autoTableHtmlToJson(statementtable, true);
    const balres = pdf.autoTableHtmlToJson(baltable, true);

    const result = chunkArray(stateres.rows, 20);
    const width = pdf.internal.pageSize.getWidth() - 15;

    const totalPagesExp = '{total_pages_count_string}';
    total = Number(total.toFixed(2));
    const cust = custinfo;
    const header = statementLH(cust.company);
    const footer = statementFT(cust.company);
    const img = image(cust.company);
    for (let i = 0; i < result.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      pdf.autoTable(stateres.columns, result[i], {
        theme: 'grid',
        styles: {
          fontSize: 7.5,
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
            columnWidth: 55
          },
          1: {
            halign: 'left',
            columnWidth: 45
          },
          2: {
            halign: 'left',
            columnWidth: 95
          },
          3: {
            halign: 'left',
            columnWidth: 175
          },
          4: {
            halign: 'center',
            columnWidth: 48
          },
          5: {
            halign: 'center',
            columnWidth: 48
          },
          6: {
            halign: 'center',
            columnWidth: 48
          },
          7: {
            halign: 'center',
            columnWidth: 48
          }
        },
        headerStyles: {
          fillColor: false,
          textColor: [23, 73, 144],
          fontStyle: 'normal',
          lineWidth: 0,
          valign: 'bottom',
          fontSize: 7.5
        },
        tableWidth: 'auto',
        tableLineColor: 0,
        margin: {
          top: 227,
          left: 10,
          bottom: 85,
          right: 10,
        },
        pageBreak: 'always',
        addPageContent: function(data) {
          pdf.addImage(img, 'JPEG', 210, 22, 215, 44);
          pdf.setFontSize(8);
          pdf.setFontType('normal');
          pdf.text(header.address, 210, 82);
          pdf.text(header.tel, 210, 96);
          pdf.text(header.vat, 210, 110);
          pdf.setFontType('bold');
          pdf.setFontSize(17.5);
          pdf.setTextColor(23, 73, 144);
          pdf.text(header.title, 210, 135);
          pdf.setFontSize(8.8);
          pdf.setFontType('normal');
          pdf.setTextColor(0);
          pdf.text(`As at ${convertDate2()}`, 250, 155);
          pdf.text(cust.company_name, 15, 170);
          pdf.text(cust.Physical1, 15, 185);
          pdf.text(cust.Physical2, 15, 200);
          pdf.text(cust.Physical3, 15, 215);
          pdf.text(`VAT No : ${cust.Tax_Number}`, 250, 185);
          pdf.text(`B.R.No : ${cust.Registration}`, 250, 200);
          pdf.text(`Customer Code: ${cust.customerCode}`, 450, 170);
          pdf.text(`Statement Date : ${convertDateAlt()}`, 450, 185);
          pdf.setFontType('bold');
          pdf.text(`Amount Due (Rs) : ${Number(total.toFixed(2)).toLocaleString()}`, 450, 200);

          // pdf.text(`Page ${i + 1} of ` + totalPagesExp, 460, 170);

          pdf.setLineWidth(1);
          pdf.line(15, 255, width, 255);
        }
      });
      pdf.autoTable(balres.columns, balres.rows, {
        theme: 'grid',
        styles: {
          fontSize: 8,
          overflow: 'linebreak',
          lineColor: 100,
          lineWidth: 1,
          textColor: 0,
          valign: 'top',
          halign: 'center'
        },
        columnStyles: {
          0: {
            halign: 'center'
          },
          1: {
            halign: 'center'
          },
          2: {
            halign: 'center'
          },
          3: {
            halign: 'center'
          },
          4: {
            halign: 'center'
          },
          5: {
            halign: 'center'
          },
          6: {
            halign: 'center'
          },
        },
        headerStyles: {
          fillColor: false,
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          lineWidth: 0,
          valign: 'bottom',
          fontSize: 8
        },
        tableWidth: 'auto',
        tableLineColor: 0,
        margin: {
          top: 690,
          left: 10,
          bottom: 85,
          right: 10,
        },
        pageBreak: 'always',
        addPageContent: function(data) {
          pdf.setFontSize(7.8);
          pdf.setFontType('bold');
          pdf.text('Terms And Conditions', 15, 745);
          pdf.setFontType('normal');
          pdf.text(footer[0], 15, 760);
          pdf.text(footer[1], 15, 772);
          pdf.text(footer[2], 15, 784);
          pdf.text(footer[3], 15, 796);
          pdf.text(footer[4], 15, 808);
          pdf.text(footer[5], 15, 820);
          pdf.text(footer[6], 15, 832);
        }
      });
    }

    if (typeof pdf.putTotalPages === 'function') {
      pdf.putTotalPages(totalPagesExp);
    }

    if (statementtable && baltable) {
      return pdf;
    }
}

