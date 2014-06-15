export var render = ({title, markupString}) =>
`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="/stylesheets/bootstrap.min.css">
  <link rel="stylesheet" href="/stylesheets/theme-one.css">
  <link rel="stylesheet" href="/stylesheets/hljs/github.css">
  <link rel="icon" href="/images/favicon.png">
  <script defer src="/javascripts/vendor/react.js"></script>
  <script defer src="/javascripts/main.bundle.js"></script>
</head>
<body>
${markupString}
</body>
</html>`;