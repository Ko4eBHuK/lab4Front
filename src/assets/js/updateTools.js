$('document').ready(function(){
  drawZone();
});

function drawZone() {
  alert('Жора, твоя мама огонь!');
  let radiusArea = document.getElementById('inputR').value;
  let unitSegmentArea = 50;
  let xCenter = document.getElementById('area').width / 2;
  let yCenter = document.getElementById('area').height / 2;

  //zone 13444
  $('#area').drawRect({
    layer: true,
    x: 0, y: 0,
    fromCenter: false,
    fillStyle: '#33B6DC',
    width: xCenter * 2,
    height: yCenter * 2
  }).drawRect({
    groups: ['zone'],
    layer: true,
    x: xCenter, y: yCenter,
    fromCenter: false,
    width: unitSegmentArea * radiusArea,
    height: unitSegmentArea * radiusArea / 2
  }).drawLine({
    groups: ['zone'],
    layer: true,
    strokeWidth: 1,
    closed: true,
    x1: xCenter, y1: yCenter,
    x2: xCenter + unitSegmentArea * radiusArea / 2, y2: yCenter,
    x3: xCenter, y3: yCenter - unitSegmentArea * radiusArea
  }).drawArc({
    groups: ['zone'],
    layer: true,
    x: xCenter, y: yCenter,
    radius: unitSegmentArea * radiusArea / 2,
    start: 270, end: 0
  }).drawLine({
    groups: ['zone'],
    layer: true,
    strokeWidth: 1,
    closed: true,
    x1: xCenter, y1: yCenter,
    x2: xCenter - unitSegmentArea * radiusArea / 2, y2: yCenter,
    x3: xCenter - unitSegmentArea * radiusArea / 2, y3: yCenter - 1,
    x4: xCenter, y4: yCenter - unitSegmentArea * radiusArea / 2 - 1
  }).setLayerGroup('zone',{
    fillStyle: '#FF6100',
    strokeStyle: '#FF6100'
  }).drawLayers();

  //coordinate system 13444
  for(var i = -9; i <= 9; i++){
    if(i !== 0){
      $('#area').drawLine({
        groups: ['coordinateSys'],
        layer: true,
        strokeWidth: 3,
        x1: xCenter + unitSegmentArea * i / 2,y1: yCenter + 4,
        x2: xCenter + unitSegmentArea * i / 2,y2: yCenter - 4
      }).drawLine({
        groups: ['coordinateSys'],
        layer: true,
        strokeWidth: 3,
        x1: xCenter - 4,y1: yCenter + unitSegmentArea * i / 2,
        x2: xCenter + 4,y2: yCenter + unitSegmentArea * i / 2
      });
    }
  }
  $('#area').drawPath({
    groups: ['coordinateSys'],
    layer: true,
    x:0, y:0,
    strokeWidth: 3,
    p1:{
      type: 'line',
      rounded: true,
      endArrow: true,
      arrowRadius: 12,
      arrowAngle: 75,
      x1: 1, y1: yCenter ,
      x2: xCenter * 2 - 6, y2: yCenter
    },
    p2: {
      type: 'line',
      rounded: true,
      endArrow: true,
      arrowRadius: 12,
      arrowAngle: 75,
      x1: xCenter , y1: yCenter * 2 - 1,
      x2: xCenter , y2: 6
    }
  }).setLayerGroup('coordinateSys',{
    fillStyle: '#fff',
    strokeStyle: '#fff'
  }).drawLayers();

  //axis titles
  $('#area').drawText({
    groups:['axisLabels'],
    text: 'X',
    layer: true,
    x: xCenter * 2 - 20, y: yCenter - 26
  }).drawText({
    groups:['axisLabels'],
    text: 'Y',
    layer: true,
    x: xCenter + 22, y: 26
  }).setLayerGroup('axisLabels',{
    fillStyle: '#33B6DC',
    strokeStyle: '#fff',
    fontSize: 50,
    fontFamily: 'system-ui',
    strokeWidth: 1
  }).drawLayers();

  //axis digits
  $('#area').drawText({
    groups:['coordinateSysDigits'],
    text: '0',
    layer: true,
    x: xCenter + 11, y: yCenter - 11
  }).drawText({
    groups:['coordinateSysDigits'],
    text: '1',
    layer: true,
    x: xCenter + unitSegmentArea, y: yCenter - 11
  }).drawText({
    groups:['coordinateSysDigits'],
    text: '2',
    layer: true,
    x: xCenter + unitSegmentArea * 2, y: yCenter - 11
  }).drawText({
    groups:['coordinateSysDigits'],
    text: '3',
    layer: true,
    x: xCenter + unitSegmentArea * 3, y: yCenter - 11
  }).drawText({
    groups:['coordinateSysDigits'],
    text: '4',
    layer: true,
    x: xCenter + unitSegmentArea * 4, y: yCenter - 11
  }).drawText({
    groups:['coordinateSysDigits'],
    text: '4',
    layer: true,
    x: xCenter - 11, y: yCenter - unitSegmentArea * 4
  }).drawText({
    groups:['coordinateSysDigits'],
    text: '-2',
    layer: true,
    x: xCenter - unitSegmentArea * 2, y: yCenter + 13
  }).drawText({
    groups:['coordinateSysDigits'],
    text: '-2',
    layer: true,
    x: xCenter - 13, y: yCenter + unitSegmentArea * 2
  }).setLayerGroup('coordinateSysDigits',{
    fillStyle: '#fff',
    fontSize: 20,
    fontFamily: 'system-ui',
  }).drawLayers();
}
