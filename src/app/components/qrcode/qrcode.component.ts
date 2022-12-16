import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import QRCode from 'easyqrcodejs';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss'],
})
export class QrCodeComponent implements OnChanges, AfterViewInit {
  @Input() qrcElementType: 'url' | 'img' | 'canvas' = 'url';
  @Input() cssClass = 'qrcode';
  @Input() qrcValue = 'https://www.amon.tech';
  @Input() qrcVersion:
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | '10'
    | '11'
    | '12'
    | '13'
    | '14'
    | '15'
    | '16'
    | '17'
    | '18'
    | '19'
    | '20'
    | '21'
    | '22'
    | '23'
    | '24'
    | '25'
    | '26'
    | '27'
    | '28'
    | '29'
    | '30'
    | '31'
    | '32'
    | '33'
    | '34'
    | '35'
    | '36'
    | '37'
    | '38'
    | '39'
    | '40'
    | '' = '';

  @Input() errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H' = 'M';
  @Input() qrcMargin = 4;
  @Input() qrcScale = 4;
  @Input() qrcWidth = 10;
  @Input() qrcColorDark = '#3c3f41';
  @Input() qrcColorLight = '#ffffff';
  @ViewChild('qrcElement', { static: false }) qrcElement: ElementRef;
  private readonly options: any;
  private qrCode: QRCode;

  constructor() {
    this.options = {
      text: this.qrcValue,
      dotScale: 0.4,
      logo: 'assets/img/amn-black.svg',
      width: 140,
      height: 140,
      colorLight: '#fff',
      colorDark: '#000',
      quietZone: 10,
      logoWidth: 50,
      logoHeight: 50,
      quietZoneColor: 'transparent',
      logoBackgroundTransparent: false,
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes &&
      changes.qrcValue &&
      changes.qrcValue.previousValue !== undefined
    ) {
      if (this.qrCode) {
        this.qrCode.clear();
      }
      this.options.text = this.qrcValue;
      this.qrCode = new QRCode(this.qrcElement.nativeElement, this.options);
    }
  }

  ngAfterViewInit() {
    this.options.text = this.qrcValue;
    this.qrCode = new QRCode(this.qrcElement.nativeElement, this.options);
  }
}
