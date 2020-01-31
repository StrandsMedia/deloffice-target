import { Component, OnInit } from '@angular/core';

import { CategoryService } from '../../../common/services/category.service';
import { CommentsService } from '../../../common/services/comments.service';
import { MarketingService } from '../../../common/services/marketing.service';
import { ProductService } from '../../../common/services/product.service';

import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-marketing-overview',
  templateUrl: './marketing-overview.component.html',
  styleUrls: ['./marketing-overview.component.scss']
})
export class MarketingOverviewComponent implements OnInit {
  public loading = false;

  public dataSource$: Observable<any>;
  public category$: Observable<any>;
  public subcategory$: Observable<any>;

  public productcat$: Observable<any>;

  public sector: any = 1;
  public subsector: any;

  public prod_category: any = 995;
  public prod_subcategory: any;

  public selected$: Observable<any>;

  public columns = [
    'customerCode',
    'company_name',
    'current',
    '30days',
    '60days',
    'lastorder',
    'comment',
    'commbox'
  ];

  constructor(
    private cat: CategoryService,
    private cmt: CommentsService,
    private mkt: MarketingService,
    private prod: ProductService
  ) { }

  ngOnInit() {
    this.get();
    this.category$ = this.cat.getSector();
    this.loadSubsectors();
    this.productcat$ = this.prod.getCategoriesIrr();
  }

  get() {
    console.log({
      sector: this.sector,
      subsector: this.subsector,
      category: this.prod_category,
      subcategory: this.prod_subcategory
    })
    this.loading = true;
    this.dataSource$ = this.mkt.generateMktReport({
      sector: this.sector,
      subsector: this.subsector,
      category: this.prod_category,
      subcategory: this.prod_subcategory
    }).pipe(
      map(res => res.records),
      tap(v => this.loading = false)
    );
  }

  loadSubsectors() {
    this.subcategory$ = this.cat.getSubsector().pipe(
      map((subsectors: any) => {
        return subsectors.filter(subsec => subsec.upcat == this.sector)
      })
    )
  }

  trackByFn(index, item) {
    return index;
  }

  public sortObs(key, direction = true) {
    this.loading = true;
    let dir;
    direction ? dir = 'desc' : dir = 'asc';
    this.dataSource$ = this.mkt.generateMktReport({
      sector: this.sector,
      subsector: this.subsector,
      category: this.prod_category,
      subcategory: this.prod_subcategory
    }).pipe(
      map(res => res.records),
      map((res: any[]) => {
        return res.sort((a, b) => {
          if (isNaN(a[key]) === false) {
            // tslint:disable-next-line:curly
            if (+a[key] > +b[key]) return dir === 'asc' ? 1 : -1;
            // tslint:disable-next-line:curly
            if (+a[key] < +b[key]) return dir === 'asc' ? -1 : 1;
          } else {
            // tslint:disable-next-line:curly
            if (a[key] > b[key]) return dir === 'asc' ? 1 : -1;
            // tslint:disable-next-line:curly
            if (a[key] < b[key]) return dir === 'asc' ? -1 : 1;
          }
          return 0;
        });
      }),
      tap(v => this.loading = false)
    );
  }

  public getComment(cust_id: number) {
    this.selected$ = this.cmt.getComments(1, 0, cust_id, 1).pipe(
      map(cmts => cmts.records)
    )
  }

  public getInitials(name: string): string {
    if (name) {
      return name.charAt(0);
    }

    return;
  }

}
