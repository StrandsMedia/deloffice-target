import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import { WorkflowService } from 'src/app/common/services/workflow.service';
import { chunkArray, image, breakLine, breakLine2, tableToJSPDFData } from 'src/app/common/interfaces/letterhead';

import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Cell, CellHookData } from 'jspdf-autotable';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/common/services/auth.service';
import { QuestionControlService } from '../popup/utils/question-control.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
  breakLine = breakLine;
  breakLine2 = breakLine2;
  job: Observable<any>;
  user: any;
  batch: Array<number> = [];
  realloc: number;
  public loading: boolean;

  scrim: HTMLElement = document.querySelector('.loading-scrim');

  questions: any;
  formData: any;
  tempPDF: any;

  vehicles = [
    '4730 ZR 01',
    '5271 ZR 02',
    '629 MR 03',
    '3213 ZU 04',
    '3652 ZT 04',
    '2772 ZV 05',
    '5027 ZR 06'
  ];

  columns = [
    'id',
    'date',
    'time',
    'customer',
    'invno',
    'product',
    'status',
    'delivery',
    'realloc',
    'tick'
  ];

  public closeSessionForm: FormGroup = this.fb.group({
    vehicle: ['', Validators.required],
    driver: [null, Validators.required],
    user: [null],
    sessionID: [null],
    region: null
  });

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private qcs: QuestionControlService,
    private route: ActivatedRoute,
    private wf: WorkflowService
  ) {
    auth.currentUser.subscribe((data) => this.user = data);
  }

  ngOnInit(): void {
    this.get();
  }

  get() {
    this.route.params.forEach((params: Params) => {
      this.job = this.wf.readJob(+params['id']).pipe(
        map(res => {
          let total = 0;
          if (res['papersumm']) {
            res['papersumm'].reduce((acc, curr) => {
              total = acc + +curr['total'];
              return total;
            }, 0);
            res['total'] = total;
          }
          return res;
        })
      );
    });
  }

  trackByFn(index, item) {
    return index;
  }

  stringCheck(string: string, string2) {
    const substring = 'A4';
    const substring2 = 'A3';
    const substring3 = 'A5';
    if (string.indexOf(substring) !== -1 || string.indexOf(substring2) !== -1 || string.indexOf(substring3) !== -1) {
      const substr = '(' + string2 + ')';
      const newstring = string.replace(string2, substr);
      return newstring;
    } else {
      return string + ' ' + '(' + string2 + ')';
    }
  }

  renderPDF(data) {
    const pdf = new jsPDF('l', 'pt', 'a4');
    // const maintable: HTMLTableElement = <HTMLTableElement>document.getElementById('maintable');
    // const papersum: HTMLTableElement = <HTMLTableElement>document.getElementById('papersum');
    // const mainres = (pdf as any).autoTableHtmlToJson(maintable, true);
    // const paperres = (pdf as any).autoTableHtmlToJson(papersum, true);

    // const checktbl: HTMLTableElement = <HTMLTableElement>document.getElementById('tablecheck');
    // const checkres = pdf.autoTableHtmlToJson(checktbl, true);

    const checkres = tableToJSPDFData('#tablecheck');

    const mainres = tableToJSPDFData('#maintable');
    const result = chunkArray(mainres.body, 8);

    let driver;
    let vehicle;
    let title;
    let status;
    let check = false;

    if (data.papersumm.length > 0) {
      check = true;
    }

    switch (data.seshstatus) {
      case '2':
        title = 'PICKUP CONTROL SHEET';
        break;
      default:
        title = 'DELIVERY CONTROL SHEET';
        break;
    }

    driver = 'Not Specified';
    vehicle = 'Not Specified';

    if (data.driver) {
      driver = data.driver;
    }

    if (data.vehicle) {
      vehicle = data.vehicle;
    }

    const job = data.jobID;
    const date = new Date(data.time).toISOString().slice(0, 10);

    switch (+data.seshstatus) {
      case 0:
        status = 'Provisional';
        break;
      case 1:
        status = 'Final';
        break;
      case 2:
        status = 'Pickup';
        break;
      default:
        status = 'Archive';
        break;
    }

    const img = image('DEL');

    for (let i = 0; i < result.length; i++) {
      // if (i > 0) {
      //   pdf.addPage();
      // }
      (pdf as any).autoTable({
          head: mainres.head,
          body: result[i],
          theme: 'grid',
          styles: {
            fontSize: 9.2,
            overflow: 'linebreak',
            lineColor: 100,
            lineWidth: 0.2,
            textColor: 0,
            valign: 'top',
            halign: 'left'
          },
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 150 },
            2: { cellWidth: 60 },
            3: { cellWidth: 60 },
            4: { cellWidth: 100 },
            5: { cellWidth: 200 },
          },
          headStyles: {
            fillColor: false,
            textColor: 0,
          },
          tableWidth: 'auto',
          tableLineColor: 0,
          margin: {
            top: 100,
            left: 15,
            bottom: 100,
            right: 15,
          },
          // pageBreak: 'always',
          didDrawPage: function(dt) {
            pdf.addImage(img, 'JPEG', 16, 18, 160, 33);
            pdf.text(title, 15, 65);
            pdf.setFontSize(11.4);
            pdf.text('Driver: ' + driver, 15, 82);
            pdf.text('Vehicle: ' + vehicle, 300, 65);
            pdf.text('Job No.: #' + job, 300, 82);
            pdf.text('Date: ' + date, 480, 65);
            pdf.text('Status: ' + status, 480, 82);
            // if (i === 0) {
            //   pdf.text('Sign (Delivery) : ', 15, 550);
            //   pdf.line(100, 550, 230, 550);
            //   pdf.text('Sign (Account.) : ', 250, 550);
            //   pdf.line(335, 550, 465, 550);
            // }
          }
      });
      (pdf as any).autoTable({
        head: checkres.head,
        body: checkres.body,
        didParseCell: function(data: CellHookData) {
          const cell = data.cell;
          cell.styles.cellPadding = 10;
        },
        theme: 'grid',
        styles: {
          fontSize: 10,
          overflow: 'linebreak',
          lineColor: 100,
          lineWidth: 0.2,
          textColor: 0,
          valign: 'top',
          halign: 'left'
        },
        tableWidth: 'auto',
        tableLineColor: 0,
        margin: {
          top: 500,
          left: 15,
          bottom: 0,
          right: 15,
        },
        headerStyles: {
          fillColor: false,
          textColor: 0,
        }
      });   
    }
    if (check) {
      pdf.addPage();
      (pdf as any).autoTable({
          html: '#papersum',
          didParseCell: function(data: CellHookData) {
            const cell = data.cell;
            const tdElement = cell.raw;
            if (tdElement.classList.contains('bolder')) {
              cell.styles.fontStyle = 'bold';
              cell.styles.halign = 'right';
              cell.styles.fontSize = 9.8;
              cell.styles.textColor = [255, 0, 0];
            }
            if (tdElement.classList.contains('text-right')) {
              cell.styles.halign = 'right';
            }

            const rows = data.table.body;
            if (data.row.index === rows.length - 1) {
              pdf.setFontType('bold');
            }
          },
          theme: 'grid',
          styles: {
            fontSize: 9.2,
            cellWidth: 'auto',
            overflow: 'linebreak',
            lineColor: 100,
            lineWidth: 0.2,
            textColor: 0,
            valign: 'middle'
          },
          columnStyles: {
            1: { cellWidth: 75 },
          },
          headStyles: {
            fillColor: false,
            textColor: 0,
          },
          tableWidth: 'auto',
          tableLineColor: 0,
          margin: {
            top: 100,
            left: 15,
            bottom: 85,
            right: 15,
          },
          didDrawPage: function(dt) {
            pdf.addImage(img, 'JPEG', 16, 18, 160, 33);
            pdf.setFontSize(11.4);
            pdf.text('PAPER SUMMARY', 15, 64);

            pdf.text('Driver: ' + driver, 15, 82);
            pdf.text('Vehicle: ' + vehicle, 300, 65);
            pdf.text('Job No.: #' + job, 300, 82);
            pdf.text('Date: ' + date, 480, 65);
            pdf.text('Status: ' + status, 480, 82);
          }
        }
      );
    }

    // pdf.save(`delivery_job_${job}.pdf`);
    pdf.output('dataurlnewwindow');
  }

  closeSession(data) {
    this.scrim.style.display = 'flex';
    this.closeSessionForm.controls['user'].setValue(this.user.user_id);
    this.closeSessionForm.controls['sessionID'].setValue(data.jobID);
    this.wf.closeSession(this.closeSessionForm.value).subscribe(
      (dt) => {
        console.log(dt);
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.scrim.style.display = 'none';
        this.get();
      }
    );
  }

  pushinto($event) {
    if ($event.target.checked) {
      if (!this.batch.includes(+$event.target.value)) {
        this.batch.push(+$event.target.value);
      }
    } else {
      if (this.batch.includes(+$event.target.value)) {
        this.batch.forEach((id, index) => {
          if (id === +$event.target.value) {
            this.batch.splice(index, 1);
          }
        });
      }
    }
    console.log(this.batch);
  }

  editWF() {
    const newdata = {step: null, workflow_id: null};
    newdata.step = 9;
    switch (this.batch.length) {
      case 0:
        break;
      case 1:
        newdata.workflow_id = this.batch[0];
        break;
      default:
        newdata.workflow_id = this.batch;
        break;
    }

    this.questions = this.qcs.getQuestions(Number(8), newdata);
  }

  loadInfo($event: any) {
    this.formData = $event;
    this.formData.user = this.user.user_id;
  }

  update() {
    this.scrim.style.display = 'flex';
    this.wf.changeStatus(this.formData).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.scrim.style.display = 'none';
        this.get();
        setTimeout(() => this.formData.status = 0, 500);
        this.batch = [];
      }
    );
  }

  select(id) {
    this.realloc = id;
  }

  reallocate(jobID) {
    const object = {
      workflow_id: this.realloc,
      user: this.user.user_id,
      step: 9,
      status: 'back',
      note: '',
      comment: 'Re-allocated',
      jobID: jobID
    };

    this.scrim.style.display = 'flex';
    this.wf.changeStatus(object).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.scrim.style.display = 'none';
        this.get();
        this.realloc = null;
      }
    );
  }

}
