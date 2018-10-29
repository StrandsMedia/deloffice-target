import {
  Directive,
  Input,
  Output,
  OnInit,
  ViewContainerRef,
  OnDestroy,
  DoCheck,
  ComponentFactoryResolver,
  ChangeDetectorRef
} from '@angular/core';

import { PushComponent } from '../../views/workflow/sessions/push/push.component';
import { TempComponent } from '../../views/workflow/sessions/temp/temp.component';
import { InprogressComponent } from '../../views/workflow/sessions/inprogress/inprogress.component';
import { ArchivedComponent } from '../../views/workflow/sessions/archived/archived.component';

import { Subscription } from 'rxjs';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[dynamic]'
})
export class DynamicComponentDirective implements OnInit, OnDestroy, DoCheck {
  @Input() dynamic: string;

  tempString: string;

  data: Subscription;
  private elRef;

  readonly templateMapper = {
    create: PushComponent,
    provisional: TempComponent,
    inprogress: InprogressComponent,
    archived: ArchivedComponent
  };

  constructor(
    public viewContainerRef: ViewContainerRef,
    private factory: ComponentFactoryResolver,
  ) {
    this.elRef = viewContainerRef;
  }

  ngOnInit() {
    this.tempString = this.dynamic;
    this.loadComponent(this.dynamic);
  }

  ngOnDestroy() {
    // this.data.unsubscribe();
  }

  ngDoCheck() {
    if (this.tempString === this.dynamic) {
      return false;
    } else {
      this.tempString = this.dynamic;
      this.loadComponent(this.dynamic);
    }
  }

  loadComponent(name) {
    const componentFactory = this.factory.resolveComponentFactory(this.getComponentByAlias(name));
    this.elRef.clear();
    const componentRef = this.elRef.createComponent(componentFactory);
  }

  private getComponentByAlias(alias: string) {
    return this.templateMapper[alias];
  }

}
