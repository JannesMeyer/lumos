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
  <link rel="icon" href="/images/favicon.png">
  <link rel="preload" href="/fonts/glyphicons-halflings-regular.woff" type="font/woff">
  <!--
  We don't do this because we don't want chrome to prerender pages that we will load by ajax instead
  <link rel="prev" href="">
  <link rel="next" href="">
  -->
  <script defer src="/javascripts/vendor/react.js"></script>
  <script defer src="/javascripts/main.bundle.js"></script>
</head>
<body>${body}
  <!-- LiveReload
  <script src="http://notes:35729/livereload.js?snipver=1"></script>
   -->
  <script>
  var data = ${JSON.stringify(data)}
  </script>
</body>
</html>`

    );
}