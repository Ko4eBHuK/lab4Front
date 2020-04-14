import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { Dot } from '../dot';
import {ReceivedDot} from '../receivedDot';
import {HttpService} from '../http.service';
import * as $ from 'jquery';

let newAbscissa = 0;
let newOrdinate = 0;

@Component({
  selector: 'app-work-zone',
  templateUrl: './work-zone.component.html',
  styleUrls: ['./work-zone.component.css'],
  providers: [HttpService]
})
export class WorkZoneComponent implements OnInit {
  constructor(private http: HttpService) {

  }
  toolsForm = new FormGroup({
    ordinate: new FormControl(0, [
      Validators.required,
      Validators.min(-3),
      Validators.max(5),
      Validators.pattern('-{0,1}[0123456789]{1}.{0,1}[0123456789]{0,10}')
    ]),
    abscissa: new FormControl(0, Validators.required),
    radius: new FormControl(4)
  });

  receivedDot: ReceivedDot;
  dots: Dot[] = [];
  dotsList: Dot[] = [];
  // public test() {
  //   this.http.post('http://localhost:8080/web/zone/dots').subscribe();
  // }
  // public test() {
  //   this.http.getDots().subscribe((data: Dots)  => this.dots = data);
  // }
  test() {
    this.getDotsHist();
    alert(this.dotsList.length);
  }

  ngOnInit(): void {
    draw(4);
    this.getDotsHist();
    areaClick();
    setInterval(drawDotsFromHistory, 1500);
  }

  getDotsHist(): void {
    this.http.getDotsList()
    .subscribe((data ) => {
      return this.dotsList = data.body;
    });
  }

  redraw() {
    const radius = Number((document.getElementById('inputR') as HTMLInputElement).value);
    draw(radius);
    drawDotsFromHistory();
  }

  onSubmit() {
    this.toolsForm.patchValue({
      ordinate: newOrdinate,
      abscissa: newAbscissa
    });
  }
  dropTools() {
    this.toolsForm.patchValue({
      ordinate: 0,
      abscissa: 0,
      radius: 4
    });
    draw(4);
    drawDotsFromHistory();
  }
  abscissaChange() {
    const abscissaSelect = (document.getElementById('inputX') as HTMLInputElement).value;
    this.toolsForm.patchValue({
      abscissa: abscissaSelect
    });
  }
  check() {
    const dot: Dot = new Dot();
    // tslint:disable-next-line:max-line-length
    const url = 'http://localhost:8080/JIOJI/web/dotdata/add/' + this.toolsForm.controls.abscissa.value + '/' + this.toolsForm.controls.ordinate.value + '/' + this.toolsForm.controls.radius.value;
    this.http.addDot(url).subscribe(data => {
      this.receivedDot = data.body;
      dot.x = String(this.receivedDot.x);
      dot.y = String(this.receivedDot.y);
      dot.r = String(this.receivedDot.r);
      dot.pointInArea = String(this.receivedDot.pointInArea);
      dot.executionTime = String(this.receivedDot.executionTime).slice(0,11);
      dot.currentTime = String(this.receivedDot.currentTime);
      this.dotsList.push(dot);
    });
  }
}

// эта функция опреедляет
// координаты клика и переводит
// их в систему координат
// с центром в центре канвы,
// а ещё рисует точку
function areaClick() {
  // tslint:disable-next-line:one-variable-per-declaration
  let clickX, clickY;
  const unitSegmentArea = 50;
  const area = document.getElementById('area') as HTMLCanvasElement;

  area.addEventListener('click', clickXY, false);
  const ctx = area.getContext('2d');

  function  clickXY() {
    // @ts-ignore
    clickX = event.offsetX;
    // @ts-ignore
    clickY = event.offsetY;
    // drawing dot
    newAbscissa = ( clickX - area.width / 2 ) / unitSegmentArea;
    newOrdinate = ( clickY * -1 + area.height / 2 ) / unitSegmentArea;
    if ( status(newAbscissa, newOrdinate) ) {
      ctx.fillStyle = 'rgb(0, 180, 0)';
    } else {
      ctx.fillStyle = 'rgb(180, 0, 0)';
    }
    ctx.beginPath();
    ctx.ellipse(clickX, clickY, 2, 2, 0, 0, Math.PI * 2, false);
    ctx.fill();
    document.getElementById('submitHidden').click();
    document.getElementById('submitButton').click();
  }
}

// эта функция проверяет попадание точки
function status(x, y) {
  let inArea = false;
  const radius = Number((document.getElementById('inputR') as HTMLInputElement).value);

  if ( radius >= 0 ) {
    if ( x >= 0 ) {
      if ( y > 0 ) {
        inArea = y <= -2 * x + radius;
      } else {
        inArea = y >= - radius / 2 && x <= radius;
      }
    } else {
      if ( y >= 0 ) {
        inArea = x * x + y * y <= radius * radius / 4;
      } else {
        inArea = false;
      }
    }
  } else {
    if ( x <= 0 ) {
      if ( y < 0 ) {
        inArea = y >= -2 * x + radius;
      } else {
        inArea = y <= -radius / 2 && x >= radius;
      }
    } else {
      if ( y <= 0 ) {
        inArea = x * x + y * y <= radius * radius / 4;
      } else {
        inArea = false;
      }
    }
  }
  return inArea;
}


// эта функция рисует зону
function draw(radiusValue) {
  const canvas = document.getElementById('area') as HTMLCanvasElement;
  const radius = radiusValue;
  const unitSegmentArea = 50;
  const xCenter = canvas.width / 2;
  const yCenter = canvas.height / 2;
  if (!canvas.getContext) {
    return;
  }
  const ctx = canvas.getContext('2d');
  // поле
  ctx.fillStyle = 'rgb(256, 0, 183)';
  ctx.fillRect(0, 0, xCenter * 2, yCenter * 2);
  // зона
  ctx.fillStyle = 'rgb(256, 256, 256)';
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 1;
  // зона прямоугольник
  ctx.beginPath();
  ctx.moveTo(xCenter, yCenter);
  ctx.lineTo(xCenter + unitSegmentArea * radius, yCenter);
  ctx.lineTo(xCenter + unitSegmentArea * radius, yCenter + unitSegmentArea * radius / 2);
  ctx.lineTo(xCenter, yCenter + unitSegmentArea * radius / 2);
  ctx.stroke();
  ctx.closePath();
  ctx.fill();
  // зона треугольник
  ctx.beginPath();
  ctx.moveTo(xCenter, yCenter);
  ctx.lineTo(xCenter, yCenter - unitSegmentArea * radius);
  ctx.lineTo(xCenter + unitSegmentArea * radius / 2, yCenter);
  ctx.stroke();
  ctx.closePath();
  ctx.fill();
  // зона сектор
  ctx.beginPath();
  ctx.moveTo(xCenter, yCenter);
  ctx.lineTo(xCenter - unitSegmentArea * radius / 2, yCenter);
  const stepCount = 180; // количество шагов
  let step: number; // номер шага
  let angle = 180; // угол
  const arcRadius: number = unitSegmentArea * radius / 2; // радиус сектора
  for (step = 1; step <= stepCount; step++) {
    angle -= 0.5;
    ctx.lineTo(xCenter + arcRadius * Math.cos(angle * 3.141589265 / 180), yCenter - arcRadius * Math.sin(angle * 3.141589265 / 180));
  }
  ctx.lineTo(xCenter, yCenter);
  ctx.stroke();
  ctx.closePath();
  ctx.fill();
  // оси координат и прочее
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 2;
  // оси
  ctx.beginPath();
  ctx.moveTo(0, yCenter);
  ctx.lineTo(xCenter * 2 - 3, yCenter);
  ctx.moveTo(xCenter, 3);
  ctx.lineTo(xCenter, yCenter * 2);
  // стреловидные наконечники
  ctx.moveTo(xCenter * 2 - 20, yCenter - 10);
  ctx.lineTo(xCenter * 2, yCenter);
  ctx.lineTo(xCenter * 2 - 20, yCenter + 10);
  ctx.moveTo(xCenter - 10, 20);
  ctx.lineTo(xCenter, 0);
  ctx.lineTo(xCenter + 10, 20);
  // ctx.stroke();
  // шкала
  for (let i = -9; i < 10; i++) {
    ctx.moveTo(xCenter + unitSegmentArea * i / 2, yCenter - 2);
    ctx.lineTo(xCenter + unitSegmentArea * i / 2, yCenter + 2);
    ctx.moveTo(xCenter - 2, yCenter + unitSegmentArea * i / 2);
    ctx.lineTo(xCenter + 2, yCenter + unitSegmentArea * i / 2);
  }
  ctx.stroke();
  ctx.closePath();
  // предупреждение
  if ( radius < 0 ) {
    ctx.font = '30px Comic Sans MS';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Увага!', xCenter * 1.5, yCenter / 4);
    ctx.font = '18px Comic Sans MS';
    ctx.fillText('радиус не должен быть', xCenter * 1.5, yCenter / 4 + 25);
    ctx.fillText('меньше нуля,', xCenter * 1.5, yCenter / 4 + 50);
    ctx.fillText('но раз уж Вы настаиваете:', xCenter * 1.5, yCenter / 4 + 70);
  }
}

function drawDotsFromHistory() {
  const area = document.getElementById('area') as HTMLCanvasElement;
  const ctx = area.getContext('2d');
  const histX = document.getElementsByClassName('historyX');
  const histY = document.getElementsByClassName('historyY');
  let i;
  let newOutcome;
  let drawingX;
  let drawingY;

  for (i = 0; i <= histX.length - 1; i++) {
    drawingX = Number(histX[i].innerHTML);
    drawingY = Number(histY[i].innerHTML);
    newOutcome = status(drawingX, drawingY);

    if ( newOutcome ) {
      ctx.fillStyle = 'rgb(0, 180, 0)';
    } else {
      ctx.fillStyle = 'rgb(180, 0, 0)';
    }
    drawingX = area.width / 2 + drawingX * 50;
    drawingY = area.height / 2 - drawingY * 50;

    ctx.beginPath();
    ctx.ellipse(drawingX, drawingY, 2, 2, 0, 0, Math.PI * 2, false);
    ctx.fill();
  }
}
