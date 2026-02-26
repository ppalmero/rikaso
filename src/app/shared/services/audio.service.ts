import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private addSound = new Audio('assets/sounds/add.mp3');

  constructor() {
    this.addSound.volume = 0.4; // sutil
  }

  playAdd() {
    const audio = new Audio(
    'data:audio/wav;base64,UklGRoQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWAAAAAAAP8AAP//AAD+/wAA/v8AAP7/AAD9/wAA/f8AAP3/AAD8/wAA/P8AAPz/AAD7/wAA+/8AAPv/AAD6/wAA+v8AAPr/AAD5/wAA+f8AAPn/AAD4/wAA+P8AAPj/AAD3/wAA9/8AAPf/AAD2/wAA9v8AAPb/AAD1/wAA9f8AAPX/AAD0/wAA9P8AAPT/AADz/wAA8/8AAPP/AADy/wAA8v8AAPL/AADx/wAA8f8AAPH/AADw/wAA8P8AAPD/AADv/wAA7/8AAPD/AADw/wAA8f8AAPH/AADy/wAA8v8AAPP/AADz/wAA9P8AAPT/AAD1/wAA9f8AAPb/AAD2/wAA9/8AAPf/AAD4/wAA+P8AAPn/AAD5/wAA+v8AAPr/AAD7/wAA+/8AAPz/AAD8/wAA/f8AAP3/AAD+/wAA/v8AAP//AAD//wAA'    
    );
//    'data:audio/wav;base64,UklGRlAAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAAAAP//AAD//wAA//8AAP//AAD//wAA'
    audio.volume = 0.4;
    audio.play().catch(() => { });
  }
}
