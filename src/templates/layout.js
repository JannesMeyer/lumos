exports.render = function(data, body) {
    return (

`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${data.title}</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="/stylesheets/bootstrap.min.css">
  <link rel="stylesheet" href="/stylesheets/theme-one.css">
  <link rel="stylesheet" href="/stylesheets/hljs/github.css">
  <link rel="icon" href="/images/favicon-template.png">
  <!-- Doesn't work in most browsers -->
  <link rel="preload" href="/fonts/glyphicons-halflings-regular.woff" type="font/woff">
  <!--
  <link rel="prev" href="">
  <link rel="next" href="">
  -->
  <!-- TODO: bundle both of these and load them async at the end of the body -->
  <script defer src="/javascripts/vendor/react.js"></script>
  <script defer src="/javascripts/main.bundle.js"></script>
</head>
<body>${body}
<script>
var data = ${JSON.stringify(data)}
</script>
<!-- LiveReload -->
<!-- <script src="http://notes:35729/livereload.js?snipver=1"></script> -->
</body>
</html>`

    );
}