import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ItemSelectorComponent } from './item-selector.component';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatarUrl',
  standalone: false
})
class MockAvatarUrlPipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Pipe({
  name: 'translate',
  standalone: false
})
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('ItemSelectorComponent', () => {
  let component: ItemSelectorComponent;
  let fixture: ComponentFixture<ItemSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemSelectorComponent, MockAvatarUrlPipe, MockTranslatePipe],
      imports: [FormsModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be visible by default', () => {
    expect(component.visible).toBeFalse();
    const modalContent = fixture.nativeElement.querySelector('.modal-content');
    expect(modalContent).toBeNull();
  });

  it('should display items when visible', () => {
    component.visible = true;
    component.items = [
      { name: 'Item 1', url: 'assets/images/default_avatar.svg' },
      { name: 'Item 2', url: 'assets/images/default_avatar.svg' }
    ];
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.item-card');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Item 1');
  });

  it('should emit select event when item is clicked', () => {
    spyOn(component.select, 'emit');
    const item = { name: 'Test Item', url: 'test.png' };
    component.onSelect(item);
    expect(component.select.emit).toHaveBeenCalledWith(item);
  });

  it('should emit play event when onPlay is called', () => {
    spyOn(component.play, 'emit');
    const item = { name: 'Test Sound', url: 'test.mp3' };
    const event = new MouseEvent('click');
    component.onPlay(event, item);
    expect(component.play.emit).toHaveBeenCalledWith(item);
  });

  it('should stop propagation when onPlay is called', () => {
    const event = new MouseEvent('click');
    spyOn(event, 'stopPropagation');
    spyOn(event, 'stopImmediatePropagation');
    component.onPlay(event, {});
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(event.stopImmediatePropagation).toHaveBeenCalled();
  });

  it('should emit close event on close button click', () => {
    spyOn(component.close, 'emit');
    component.visible = true;
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector('.modal-backdrop');
    backdrop.click();

    expect(component.close.emit).toHaveBeenCalled();
  });
});
