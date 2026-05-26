<!DOCTYPE html>
<html>
<head>
  <title>{{name}}</title>
  <link rel="stylesheet" href="/static/normalize.css">
  <link rel="icon" href="/static/logo.png">
</head>
  
<body style="color: blue;">
  <h1>Page1</h1>
  <input id="env" value="{{ env }}" style="display: none;">
  <input id="options" value="{{ options }}" style="display: none;">
  <button id="btn" onclick="handlerClick()">发送请求</button>
</body>
<script src="https://cdn.bootcss.com/axios/0.18.0/axios.min.js"></script>
<script type="text/javascript">
try {
  window.env = document.getElementById('env').value;
  var options = document.getElementById('options').value;
  window.options = JSON.parse(options);
} catch (e) {
  console.log(e);
}
const handlerClick = ()=>{
  axios.get('/api/project/list').then((res)=> {
    console.log(res);
  });
}
</script>
</html>