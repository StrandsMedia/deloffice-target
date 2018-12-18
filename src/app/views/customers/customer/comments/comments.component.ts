import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { CommentsService } from 'src/app/common/services/comments.service';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-comms',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommsComponent implements OnInit {
  comments: Observable<any>;
  status: 1 | 2 = 1;

  constructor(
    private cmt: CommentsService,
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.get();
  }

  get() {
    this.route.params.forEach((params: Params) => {
      this.comments = this.cmt.getComments(this.status, 0, +params['id']).pipe(
        map((comments: any) => comments.records)
      );
      this.cdRef.detectChanges();
    });
  }

  trackByFn(index, item) {
    return index;
  }

  toggleState(status) {
    status === 1 ? this.status = 1 : this.status = 2;
    this.get();
  }

  public getInitials(name: string): string {
    if (name) {
      return name.charAt(0);
    }

    return;
  }

}
