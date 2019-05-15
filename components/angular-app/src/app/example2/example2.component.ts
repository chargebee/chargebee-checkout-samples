import { Component } from '@angular/core';

@Component({
  selector: 'app-example2',
  templateUrl: './example2.component.html',
  styleUrls: ['./example2.component.scss']
})
export class Example2Component {
  firstName: string;
  email: string;
  phone: string;
  loading: boolean;
  token: string;
  error: string;
  cardComponent: any;
  fontSize = 16;
  styles = {
    base: {
      color: '#fff',
      fontWeight: '100',
      fontSize: '16px',
      fontFamily: 'Lato',
      '::placeholder': {
        color: '#fff',
      },
    },
    invalid: {
      color: '#e41029',
    }
  };

  fonts = ['https://fonts.googleapis.com/css?family=Lato:300,500,600'];

  classes = {
    focus: 'focus',
    invalid: 'invalid',
    empty: 'empty',
    complete: 'complete',
  };

  placeholder = {
    number: 'Card number',
    cvv: '123',
    expiry: 'MM/YY',
  };

  icon = true;
  counter = 0;

  constructor() { }

  tokenize() {
    this.loading = true;
    this.cardComponent.tokenize().then((data) => {
      this.token = data.token;
      this.loading = false;
    }).catch((error) => {
      this.loading = false;
      this.error = 'Problem while tokenizing your card details';
    });
  }

  toggleCardIcon = () => {
    this.icon = !this.icon;
  }

  clear = () => {
    this.cardComponent.clear();
  }

  setFontSize = (fontSize) => {
    this.fontSize = fontSize;
    this.styles = {
      ...this.styles,
      base: {
        ...this.styles.base,
        fontSize: `${fontSize}px`
      }
    };
  }

  increaseFontSize = () => {
    this.setFontSize(this.fontSize + 1);
  }

  decreaseFontSize = () => {
    this.setFontSize(this.fontSize - 1);
  }

  changePlaceholder = () => {
    const placeholders = [
      {
        number: 'Card number',
        cvv: '123',
        expiry: 'MM/YY',
      },
      {
        number: '41111 1111 1111',
        cvv: 'CVV',
        expiry: 'MM / YY',
      }
    ];
    this.counter = this.counter + 1;
    this.placeholder = placeholders[this.counter % 2];
  }

  onReady = (cardComponent) => {
    this.cardComponent = cardComponent;
    this.cardComponent.focus();
  }
}
