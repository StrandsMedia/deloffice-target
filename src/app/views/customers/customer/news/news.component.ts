import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { WorkflowService } from 'src/app/common/services/workflow.service';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  entries: Observable<any>;

  wf_columns = [
    'workflow_id',
    'time',
    'company_name',
    'step',
    'product',
  ];
  pr_columns = [
    'job_id',
    'product',
    'paperspecs',
    'qtyorder',
  ];
  td_columns = [
    'tid',
    'product',
    'estimated_quantity',
    'schedule',
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private wf: WorkflowService
  ) { }

  ngOnInit() {
    this.get();
  }

  get() {
    this.route.params.forEach((params: Params) => {
      this.entries = this.wf.readByCust(+params['id']);
    });
  }

}
