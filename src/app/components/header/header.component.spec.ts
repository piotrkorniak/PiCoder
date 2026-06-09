import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a semantic header element', () => {
    const header = fixture.nativeElement.querySelector('header');
    expect(header).toBeTruthy();
  });

  it('should display "PiCoder" text in the logo button', () => {
    const logoButton = fixture.nativeElement.querySelector('.header__logo');
    expect(logoButton.textContent.trim()).toBe('PiCoder');
  });

  it('should render ThemeToggleComponent', () => {
    const toggle = fixture.nativeElement.querySelector('app-theme-toggle');
    expect(toggle).toBeTruthy();
  });

  it('should call window.scrollTo when logo button is clicked', () => {
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const logoButton = fixture.nativeElement.querySelector('.header__logo');
    logoButton.click();
    expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('should have aria-label on the logo button for accessibility', () => {
    const logoButton = fixture.nativeElement.querySelector('.header__logo');
    expect(logoButton.getAttribute('aria-label')).toContain('PiCoder');
  });

  it('should be keyboard accessible (button element is focusable by default)', () => {
    const logoButton = fixture.nativeElement.querySelector('.header__logo');
    expect(logoButton.tagName).toBe('BUTTON');
    expect(logoButton.getAttribute('type')).toBe('button');
  });
});
