// http://www.esdiscuss.org/topic/template-strings-and-templates

export var render = ({title, markup}) =>
`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <link rel="stylesheet" href="/stylesheets/bootstrap.min.css">
  <link rel="stylesheet" href="/stylesheets/theme-one.css">
  <link rel="stylesheet" href="/stylesheets/hljs/github.css">
  <link rel="icon" href="/images/favicon.png">
  <script defer src="/javascripts/vendor/react.js"></script>
  <script defer src="/javascripts/main.bundle.js"></script>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
${markup}
</body>
</html>`;