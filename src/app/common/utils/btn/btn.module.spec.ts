import { BtnModule } from './btn.module';

describe('BtnModule', () => {
  let btnModule: BtnModule;

  beforeEach(() => {
    btnModule = new BtnModule();
  });

  it('should create an instance', () => {
    expect(btnModule).toBeTruthy();
  });
});
