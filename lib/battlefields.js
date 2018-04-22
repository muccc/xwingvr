exports.simple = {
  assets: [
    {
      element:'img',
      id: 'moon',
      src:'img/moon.jpg' //moon texture from https://www.jpl.nasa.gov/spaceimages/details.php?id=PIA14931
    }
  ],
  scenery: [
    {
      element:'a-sky',
      src:'img/stars.png'  
    },
    {
      element:'a-sphere',
      src:'#moon',
      position:'500 -250 0',
      rotation:'90 0 0',
      radius:'200'
    }
  ]
}